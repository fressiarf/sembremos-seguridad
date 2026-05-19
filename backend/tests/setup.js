// Setup global de Jest: garantiza que JWT_SECRET esté definido en todos los workers,
// sin depender de un archivo .env real (que puede no existir en CI).
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
