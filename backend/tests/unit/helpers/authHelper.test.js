// Seteamos una clave secreta simulada para las pruebas de tokens ANTES de importar los módulos
process.env.JWT_SECRET = 'test-secret-key-12345';
process.env.JWT_EXPIRES_IN = '1h';

const authHelper = require('../../../src/common/helpers/authHelper');
const tokenService = require('../../../src/common/services/tokenService');

describe('Auth Helpers & Token Service Unit Tests', () => {
  
  describe('authHelper (Bcrypt)', () => {
    it('debe encriptar una contraseña correctamente y generar un hash diferente a la contraseña original', async () => {
      const password = 'MiPasswordSeguro123';
      const hash = await authHelper.hashPassword(password);
      
      expect(hash).not.toBe(password);
      expect(hash.startsWith('$2a$') || hash.startsWith('$2b$')).toBe(true); // Estructura típica de bcrypt
    });

    it('debe retornar true cuando la contraseña y el hash coinciden', async () => {
      const password = 'MiPasswordSeguro123';
      const hash = await authHelper.hashPassword(password);
      
      const isMatch = await authHelper.comparePassword(password, hash);
      expect(isMatch).toBe(true);
    });

    it('debe retornar false cuando la contraseña no coincide con el hash', async () => {
      const password = 'MiPasswordSeguro123';
      const hash = await authHelper.hashPassword(password);
      
      const isMatch = await authHelper.comparePassword('PasswordIncorrecto', hash);
      expect(isMatch).toBe(false);
    });
  });

  describe('tokenService (JWT Token Manager)', () => {
    const mockUser = {
      id: 'uuid-usuario-123',
      email: 'oficial.prueba@msp.go.cr',
      rol: 'ADMIN_MSP'
    };
    const mockNivel = 'MSP';

    it('debe generar un token JWT firmado válido conteniendo los datos correctos del payload', () => {
      const token = tokenService.generateToken(mockUser, mockNivel);
      
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT tiene formato cabecera.payload.firma
    });

    it('debe verificar y decodificar correctamente un token válido', () => {
      const token = tokenService.generateToken(mockUser, mockNivel);
      const decoded = tokenService.verifyToken(token);
      
      expect(decoded.id).toBe(mockUser.id);
      expect(decoded.email).toBe(mockUser.email);
      expect(decoded.role).toBe(mockUser.rol);
      expect(decoded.nivel).toBe(mockNivel);
    });

    it('debe fallar y lanzar un error si se intenta verificar un token alterado o inválido', () => {
      const invalidToken = 'cabecera.payloadFalso.firmaInvalida';
      
      expect(() => {
        tokenService.verifyToken(invalidToken);
      }).toThrow();
    });
  });
});
