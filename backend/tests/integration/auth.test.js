const request = require('supertest');

// Mockear variables de entorno para JWT
process.env.JWT_SECRET = 'super-secret-integration-key-999';
process.env.JWT_EXPIRES_IN = '2h';

// Importar los modelos y controladores reales
const { UsuarioFP, UsuarioLocal } = require('../../src/models');

// Importar la app de Express
const app = require('../../src/app');

// Mockear el helper de autenticación para controlar la comparación de hashes
const authHelper = require('../../src/common/helpers/authHelper');
const compareSpy = jest.spyOn(authHelper, 'comparePassword');

describe('Auth Integration Tests', () => {
  let findOneFPSpy;
  let findOneLocalSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    // Espiar los métodos findOne de los modelos de Sequelize
    findOneFPSpy = jest.spyOn(UsuarioFP, 'findOne');
    findOneLocalSpy = jest.spyOn(UsuarioLocal, 'findOne');
  });

  afterEach(() => {
    findOneFPSpy.mockRestore();
    findOneLocalSpy.mockRestore();
  });

  describe('GET /health', () => {
    it('debe responder 200 OK y status UP', async () => {
      const response = await request(app)
        .get('/health')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.status).toBe('UP');
      expect(response.body.timestamp).toBeDefined();
    });
  });

  describe('POST /api/v1/system/login', () => {
    it('debe fallar con 400 si faltan campos obligatorios', async () => {
      const response = await request(app)
        .post('/api/v1/system/login')
        .send({ email: 'oficial@msp.go.cr' }) // Faltan password y nivel
        .expect(400);

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toContain('obligatorios');
    });

    it('debe iniciar sesión exitosamente, devolver datos del usuario y setear la cookie HttpOnly', async () => {
      // Configurar el espía para devolver un usuario de prueba
      findOneFPSpy.mockResolvedValue({
        id: 'uuid-oficial-1',
        nombre: 'Fressia',
        apellido: 'Rivera',
        cedula: '116240234',
        email: 'oficial@msp.go.cr',
        password_hash: 'mock-bcrypt-hash',
        activo: true,
        rol: { nombre: 'SuperAdmin' },
        institucion: { nombre: 'Ministerio de Seguridad Pública' },
        institucion_id: 1
      });

      // Configurar comparación de contraseña correcta
      compareSpy.mockResolvedValue(true);

      const response = await request(app)
        .post('/api/v1/system/login')
        .send({
          email: 'oficial@msp.go.cr',
          password: 'PasswordSeguro123',
          nivel: 'MSP'
        })
        .expect(200);

      // 1. Validar cuerpo JSON de respuesta
      expect(response.body.status).toBe('success');
      expect(response.body.message).toContain('Sesión iniciada correctamente');
      expect(response.body.data.user.cedula).toBe('116240234');
      expect(response.body.data.user.email).toBe('oficial@msp.go.cr');
      expect(response.body.data.user.rol).toBe('admin');

      // 2. Validar que la cookie 'token' se haya seteado con HttpOnly y SameSite=Strict
      const cookies = response.headers['set-cookie'];
      expect(cookies).toBeDefined();
      
      const tokenCookie = cookies.find(cookie => cookie.startsWith('token='));
      expect(tokenCookie).toBeDefined();
      expect(tokenCookie).toContain('HttpOnly');
      expect(tokenCookie).toContain('SameSite=Strict');
    });

    it('debe fallar con 401 si las credenciales son inválidas', async () => {
      findOneFPSpy.mockResolvedValue({
        id: 'uuid-oficial-1',
        email: 'oficial@msp.go.cr',
        password_hash: 'mock-bcrypt-hash',
        activo: true
      });

      // Contraseña incorrecta
      compareSpy.mockResolvedValue(false);

      const response = await request(app)
        .post('/api/v1/system/login')
        .send({
          email: 'oficial@msp.go.cr',
          password: 'PasswordIncorrecto',
          nivel: 'MSP'
        })
        .expect(401);

      expect(response.body.status).toBe('fail');
      expect(response.body.message).toContain('inválidas');
    });
  });
});
