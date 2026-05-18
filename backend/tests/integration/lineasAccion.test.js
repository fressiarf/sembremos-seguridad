const request = require('supertest');
const app = require('../../src/app');
const jwt = require('jsonwebtoken');

// Modelos mockeados a través de jest.spyOn
const LineaAccion = require('../../src/models/msp/LineaAccion');
const PresupuestoDetalle = require('../../src/models/muni/PresupuestoDetalle');

describe('Lineas de Accion Integration Tests (CRUD Entidad B)', () => {
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

  describe('GET /lineasAccion (Legacy Proxy)', () => {
    it('debe devolver la lista de lineas de accion con su calculo de inversion cruzada (Integridad Relacional)', async () => {
      // Mock de Base de Datos MSP
      const mockLineas = [{
        id: 'linea-uuid-1',
        titulo: 'Prevención del Delito',
        get: () => ({ id: 'linea-uuid-1', titulo: 'Prevención del Delito' })
      }];
      
      // Mock de Base de Datos MUNI para comprobar inversión cruzada
      const mockPresupuestos = [{
        monto_ejecutado: '500.50',
        actividad: { linea_sync_id: 'linea-uuid-1' }
      }];

      jest.spyOn(LineaAccion, 'findAll').mockResolvedValue(mockLineas);
      jest.spyOn(PresupuestoDetalle, 'findAll').mockResolvedValue(mockPresupuestos);

      const response = await request(app)
        .get('/lineasAccion')
        .set('Cookie', [`token=${adminToken}`])
        .expect(200);

      expect(response.body).toHaveLength(1);
      
      const linea = response.body[0];
      expect(linea.titulo).toBe('Prevención del Delito');
      // Verifica la integridad de la relación cruzada MSP <-> MUNI (Suma de Presupuesto)
      expect(linea.inversionLinea).toBe(500.50);
      expect(linea.responsables).toContain('Fuerza Pública');
      expect(linea.responsables).toContain('Municipalidad');
    });
  });

  describe('POST /lineasAccion (Legacy Proxy)', () => {
    it('debe crear una nueva linea de accion exitosamente', async () => {
      const nuevaLinea = { titulo: 'Nueva Linea Estratégica', descripcion: 'Testing' };
      
      jest.spyOn(LineaAccion, 'create').mockResolvedValue({
        id: 'new-uuid',
        ...nuevaLinea
      });

      const response = await request(app)
        .post('/lineasAccion')
        .set('Cookie', [`token=${adminToken}`])
        .send(nuevaLinea)
        .expect(201);

      expect(response.body.id).toBe('new-uuid');
      expect(response.body.titulo).toBe('Nueva Linea Estratégica');
      expect(LineaAccion.create).toHaveBeenCalledWith(expect.objectContaining(nuevaLinea));
    });

    it('debe devolver 500 si falla la inserción en la base de datos', async () => {
      jest.spyOn(LineaAccion, 'create').mockRejectedValue(new Error('Error de conexión DB'));

      const response = await request(app)
        .post('/lineasAccion')
        .set('Cookie', [`token=${adminToken}`])
        .send({ titulo: 'Fallo inminente' })
        .expect(500);

      expect(response.body.error).toBe('Error de conexión DB');
    });
  });
});
