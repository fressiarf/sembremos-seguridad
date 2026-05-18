const { registrarAuditoria, generarHooksAuditoria } = require('../../../src/common/helpers/auditHelper');

describe('Audit Helper & Hooks Unit Tests', () => {
  let mockLogModel;

  beforeEach(() => {
    // Mockear el modelo de Sequelize de logs
    mockLogModel = {
      create: jest.fn().mockResolvedValue({ id: 'log-uuid-123' })
    };
    jest.clearAllMocks();
  });

  describe('registrarAuditoria', () => {
    it('debe registrar un log de auditoría con los parámetros correctos', async () => {
      const params = {
        LogModel: mockLogModel,
        accion: 'CREATE',
        entidad: 'IncidenteDelictivo',
        entidad_id: 'inc-999',
        datosAnteriores: null,
        datosNuevos: { descripcion: 'Robo a mano armada', zona_id: 2 },
        usuarioId: 'user-uuid-111'
      };

      await registrarAuditoria(params);

      expect(mockLogModel.create).toHaveBeenCalledTimes(1);
      expect(mockLogModel.create).toHaveBeenCalledWith({
        usuario_id: 'user-uuid-111',
        accion: 'CREATE',
        entidad: 'IncidenteDelictivo',
        entidad_id: 'inc-999',
        datos_anteriores: null,
        datos_nuevos: { descripcion: 'Robo a mano armada', zona_id: 2 }
      });
    });

    it('debe registrar el log como sistema (usuario default) si no se provee usuarioId', async () => {
      const params = {
        LogModel: mockLogModel,
        accion: 'DELETE',
        entidad: 'ZonaRiesgo',
        entidad_id: 'zona-44',
        datosAnteriores: { nombre: 'Zona Roja' },
        datosNuevos: null,
        usuarioId: null
      };

      await registrarAuditoria(params);

      expect(mockLogModel.create).toHaveBeenCalledWith(expect.objectContaining({
        usuario_id: '00000000-0000-0000-0000-000000000000',
        accion: 'DELETE'
      }));
    });

    it('debe capturar errores si la base de datos de auditoría falla, sin propagar el error a la transacción principal', async () => {
      mockLogModel.create.mockRejectedValue(new Error('Error de espacio en disco en BD Auditoría'));
      
      const spyConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      // No debe lanzar excepción
      await expect(
        registrarAuditoria({
          LogModel: mockLogModel,
          accion: 'CREATE',
          entidad: 'UsuarioFP',
          entidad_id: 'user-123'
        })
      ).resolves.not.toThrow();

      expect(spyConsoleError).toHaveBeenCalledTimes(1);
      spyConsoleError.mockRestore();
    });
  });

  describe('generarHooksAuditoria', () => {
    let hooks;
    const mockInstance = {
      id: 'inst-123',
      dataValues: {
        id: 'inst-123',
        nombre: 'Fressia',
        password: 'Password123',
        password_hash: '$2b$10$hashedstuff'
      },
      changed: jest.fn(),
      previous: jest.fn(),
      getDataValue: jest.fn()
    };

    beforeEach(() => {
      hooks = generarHooksAuditoria(mockLogModel, 'UsuarioFP');
    });

    it('debe generar hooks afterCreate, afterUpdate y afterDestroy', () => {
      expect(hooks.afterCreate).toBeDefined();
      expect(hooks.afterUpdate).toBeDefined();
      expect(hooks.afterDestroy).toBeDefined();
    });

    describe('afterCreate Hook', () => {
      it('debe logear la creación filtrando contraseñas y hashes sensibles', async () => {
        await hooks.afterCreate(mockInstance, { userId: 'actor-uuid-000' });

        expect(mockLogModel.create).toHaveBeenCalledWith({
          usuario_id: 'actor-uuid-000',
          accion: 'CREATE',
          entidad: 'UsuarioFP',
          entidad_id: 'inst-123',
          datos_anteriores: null,
          datos_nuevos: {
            id: 'inst-123',
            nombre: 'Fressia'
            // password y password_hash deben haber sido filtrados
          }
        });
      });
    });

    describe('afterUpdate Hook', () => {
      it('debe registrar un log de actualización calculando la diferencia (diff) de datos', async () => {
        mockInstance.changed.mockReturnValue(['nombre']);
        mockInstance.previous.mockReturnValue('Nombre Viejo');
        mockInstance.getDataValue.mockReturnValue('Nombre Nuevo');

        await hooks.afterUpdate(mockInstance, { userId: 'actor-uuid-000' });

        expect(mockLogModel.create).toHaveBeenCalledWith({
          usuario_id: 'actor-uuid-000',
          accion: 'UPDATE',
          entidad: 'UsuarioFP',
          entidad_id: 'inst-123',
          datos_anteriores: { nombre: 'Nombre Viejo' },
          datos_nuevos: { nombre: 'Nombre Nuevo' }
        });
      });

      it('debe ignorar actualizaciones si solo se modificaron campos sensibles o no hubo cambios reales', async () => {
        mockInstance.changed.mockReturnValue(['password', 'password_hash']);

        await hooks.afterUpdate(mockInstance, { userId: 'actor-uuid-000' });

        expect(mockLogModel.create).not.toHaveBeenCalled();
      });
    });

    describe('afterDestroy Hook', () => {
      it('debe registrar la eliminación de manera segura sin contraseña', async () => {
        await hooks.afterDestroy(mockInstance, { userId: 'actor-uuid-999' });

        expect(mockLogModel.create).toHaveBeenCalledWith({
          usuario_id: 'actor-uuid-999',
          accion: 'DELETE',
          entidad: 'UsuarioFP',
          entidad_id: 'inst-123',
          datos_anteriores: {
            id: 'inst-123',
            nombre: 'Fressia'
          },
          datos_nuevos: null
        });
      });
    });
  });
});
