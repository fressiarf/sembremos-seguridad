const validationHelper = require('../../../src/common/helpers/validationHelper');

describe('Validation Helpers Unit Tests', () => {
  
  describe('isValidCedula (Cédula de Costa Rica)', () => {
    it('debe retornar true para cédulas válidas (9 dígitos numéricos, sin guiones, no empiezan por 0)', () => {
      expect(validationHelper.isValidCedula('116240234')).toBe(true);
      expect(validationHelper.isValidCedula('501230456')).toBe(true);
      expect(validationHelper.isValidCedula('901110222')).toBe(true);
    });

    it('debe retornar false para cédulas que comiencen por 0', () => {
      expect(validationHelper.isValidCedula('016240234')).toBe(false);
    });

    it('debe retornar false para cédulas con longitud menor a 9 dígitos', () => {
      expect(validationHelper.isValidCedula('11624023')).toBe(false);
      expect(validationHelper.isValidCedula('12345')).toBe(false);
    });

    it('debe retornar false para cédulas con longitud mayor a 9 dígitos', () => {
      expect(validationHelper.isValidCedula('1162402345')).toBe(false);
    });

    it('debe retornar false para cédulas con guiones o espacios', () => {
      expect(validationHelper.isValidCedula('1-1624-0234')).toBe(false);
      expect(validationHelper.isValidCedula('11624 023')).toBe(false);
    });

    it('debe retornar false si el valor es nulo o vacío', () => {
      expect(validationHelper.isValidCedula(null)).toBe(false);
      expect(validationHelper.isValidCedula(undefined)).toBe(false);
      expect(validationHelper.isValidCedula('')).toBe(false);
    });
  });

  describe('isValidEmail (Correo Electrónico)', () => {
    it('debe retornar true para emails con formato válido', () => {
      expect(validationHelper.isValidEmail('oficial.seguridad@msp.go.cr')).toBe(true);
      expect(validationHelper.isValidEmail('usuario@muni.or.cr')).toBe(true);
      expect(validationHelper.isValidEmail('test@gmail.com')).toBe(true);
    });

    it('debe retornar false si no contiene el símbolo "@"', () => {
      expect(validationHelper.isValidEmail('usuariosinemail.com')).toBe(false);
    });

    it('debe retornar false si no contiene un dominio válido con punto', () => {
      expect(validationHelper.isValidEmail('usuario@dominio')).toBe(false);
    });

    it('debe retornar false si contiene espacios en blanco', () => {
      expect(validationHelper.isValidEmail('usuario @dominio.com')).toBe(false);
      expect(validationHelper.isValidEmail('usuario@dominio .com')).toBe(false);
    });
  });
});
