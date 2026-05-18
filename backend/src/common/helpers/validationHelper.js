/**
 * Helpers para validaciones de datos sensibles y formatos oficiales
 */
class ValidationHelper {
  /**
   * Valida el formato de la cédula de identidad de Costa Rica
   * Formato: 9 dígitos exactos, sin guiones.
   * @param {string} cedula 
   * @returns {boolean}
   */
  isValidCedula(cedula) {
    if (!cedula) return false;
    // Regex: 9 dígitos numéricos
    const regex = /^[1-9][0-9]{8}$/;
    return regex.test(cedula);
  }

  /**
   * Valida formato de email estándar
   */
  isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
}

module.exports = new ValidationHelper();
