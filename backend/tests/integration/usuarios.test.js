const request = require('supertest');
const app = require('../../src/app');
const jwt = require('jsonwebtoken');

// Modelos mockeados a través de jest.spyOn
const UsuarioFP = require('../../src/models/msp/UsuarioFP');
const UsuarioLocal = require('../../src/models/muni/UsuarioLocal');

describe('Usuarios Integration Tests (CRUD Entidad A)', () => {
  let adminToken;

  beforeAll(() => {
    // Generar un token válido de ADMIN_MSP para pasar el authMiddleware
    adminToken = jwt.sign(
      { id: 'admin-uuid', email: 'admin@msp.go.cr', role: 'admin', nivel: 'MSP' },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /usuarios (Legacy Proxy)', () => {
    it('debe devolver la lista fusionada de usuarios MSP y MUNI', async () => {
      // Mockear respuestas de la base de datos
      const mspUser = { id: 'uuid-msp-1', email: 'msp@go.cr', role: 'Operativo', dataValues: { nombre: 'Juan' } };
      const muniUser = { id: 'uuid-muni-1', email: 'muni@go.cr', role: 'Gestor', dataValues: { nombre: 'Pedro' } };

      jest.spyOn(UsuarioFP, 'findAll').mockResolvedValue([mspUser]);
      jest.spyOn(UsuarioLocal, 'findAll').mockResolvedValue([muniUser]);

      const response = await request(app)
        .get('/usuarios')
        .set('Cookie', [`token=${adminToken}`]) // Inyectar cookie de autenticación
        .expect(200);

      // Validar que se hayan fusionado y tengan los prefijos correctos
      expect(response.body).toHaveLength(2);
      
      const muniRes = response.body.find(u => u.tipo === 'MUNI');
      expect(muniRes.id).toBe('muni_uuid-muni-1');
      expect(muniRes.usuario).toBe('muni@go.cr');

      const mspRes = response.body.find(u => u.tipo === 'MSP');
      expect(mspRes.id).toBe('msp_uuid-msp-1');
      expect(mspRes.usuario).toBe('msp@go.cr');
    });
  });

  describe('DELETE /usuarios/:id (Legacy Proxy)', () => {
    it('debe eliminar un usuario MSP basándose en el prefijo', async () => {
      const destroySpy = jest.spyOn(UsuarioFP, 'destroy').mockResolvedValue(1);

      const response = await request(app)
        .delete('/usuarios/msp_uuid-123')
        .set('Cookie', [`token=${adminToken}`])
        .expect(200);

      expect(response.body.message).toBe('Usuario eliminado correctamente');
      expect(destroySpy).toHaveBeenCalledWith({ where: { id: 'uuid-123' } });
    });

    it('debe eliminar un usuario MUNI basándose en el prefijo', async () => {
      const destroySpy = jest.spyOn(UsuarioLocal, 'destroy').mockResolvedValue(1);

      const response = await request(app)
        .delete('/usuarios/muni_uuid-456')
        .set('Cookie', [`token=${adminToken}`])
        .expect(200);

      expect(response.body.message).toBe('Usuario eliminado correctamente');
      expect(destroySpy).toHaveBeenCalledWith({ where: { id: 'uuid-456' } });
    });
  });

  describe('PATCH /usuarios/:id (Legacy Proxy)', () => {
    it('debe actualizar el perfil de un usuario existente', async () => {
      const mockUserInstance = {
        update: jest.fn().mockResolvedValue(true)
      };
      
      jest.spyOn(UsuarioFP, 'findByPk').mockResolvedValue(mockUserInstance);

      const response = await request(app)
        .patch('/usuarios/msp_uuid-789')
        .set('Cookie', [`token=${adminToken}`])
        .send({ nombre: 'Fressia Editada', activo: false })
        .expect(200);

      expect(response.body.message).toBe('Usuario actualizado correctamente');
      expect(mockUserInstance.update).toHaveBeenCalledWith(
        expect.objectContaining({ nombre: 'Fressia Editada', activo: false })
      );
    });

    it('debe devolver 404 si el usuario no existe al actualizar', async () => {
      jest.spyOn(UsuarioLocal, 'findByPk').mockResolvedValue(null);

      const response = await request(app)
        .patch('/usuarios/muni_uuid-999')
        .set('Cookie', [`token=${adminToken}`])
        .send({ nombre: 'Fantasma' })
        .expect(404);

      expect(response.body.error).toBe('Usuario no encontrado');
    });
  });
});
