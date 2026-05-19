/**
 * Tests unitarios de RecordatorioFormatter (humanización y escape HTML).
 */

const {
  formatearAvisoTiempo,
  formatearFechaHumana,
  escapeHtml
} = require('../../../src/services/RecordatorioFormatter');

describe('RecordatorioFormatter', () => {

  describe('formatearAvisoTiempo', () => {
    it('cubre todos los offsets de la cadencia oficial', () => {
      expect(formatearAvisoTiempo(20160)).toBe('Faltan 14 días');
      expect(formatearAvisoTiempo(10080)).toBe('Faltan 7 días');
      expect(formatearAvisoTiempo(5760)).toBe('Faltan 4 días');
      expect(formatearAvisoTiempo(2880)).toBe('Faltan 2 días');
      expect(formatearAvisoTiempo(720)).toBe('Faltan 12 horas');
      expect(formatearAvisoTiempo(60)).toBe('Falta 1 hora');
    });

    it('usa el caso especial "Es mañana" para 1440 (1 día)', () => {
      expect(formatearAvisoTiempo(1440)).toBe('Es mañana');
    });

    it('usa singular para 1 hora y 1 minuto', () => {
      expect(formatearAvisoTiempo(60)).toBe('Falta 1 hora');
      expect(formatearAvisoTiempo(1)).toBe('Falta 1 minuto');
    });

    it('usa plural para múltiples horas y minutos', () => {
      expect(formatearAvisoTiempo(120)).toBe('Faltan 2 horas');
      expect(formatearAvisoTiempo(30)).toBe('Faltan 30 minutos');
      expect(formatearAvisoTiempo(5)).toBe('Faltan 5 minutos');
    });

    it('redondea offsets no exactos correctamente', () => {
      // 90min ≈ 2h (redondeo)
      expect(formatearAvisoTiempo(90)).toMatch(/^Faltan 2 hora/);
    });
  });

  describe('formatearFechaHumana', () => {
    it('devuelve formato día-mes-hora en español', () => {
      const fecha = new Date('2026-05-21T20:00:00Z'); // 14:00 hora CR (UTC-6)
      const out = formatearFechaHumana(fecha);
      expect(out).toMatch(/jueves/);
      expect(out).toMatch(/mayo/);
      expect(out).toMatch(/14:00/);
    });

    it('aplica la TZ explícita cuando se le pasa', () => {
      const fecha = new Date('2026-01-01T05:00:00Z');
      const enUtc = formatearFechaHumana(fecha, 'UTC');
      expect(enUtc).toMatch(/05:00/);
    });

    it('acepta string ISO', () => {
      const out = formatearFechaHumana('2026-05-21T20:00:00Z');
      expect(out).toMatch(/14:00/);
    });
  });

  describe('escapeHtml', () => {
    it('escapa los 5 caracteres reservados', () => {
      expect(escapeHtml('<')).toBe('&lt;');
      expect(escapeHtml('>')).toBe('&gt;');
      expect(escapeHtml('&')).toBe('&amp;');
      expect(escapeHtml('"')).toBe('&quot;');
      expect(escapeHtml("'")).toBe('&#39;');
    });

    it('previene inyección XSS en strings combinados', () => {
      const malicioso = '<script>alert("x")</script>';
      const out = escapeHtml(malicioso);
      expect(out).not.toContain('<script>');
      expect(out).toContain('&lt;script&gt;');
    });

    it('maneja null/undefined sin lanzar', () => {
      expect(escapeHtml(null)).toBe('');
      expect(escapeHtml(undefined)).toBe('');
    });

    it('pasa strings sin caracteres reservados intactos', () => {
      expect(escapeHtml('Reunión interinstitucional')).toBe('Reunión interinstitucional');
    });
  });
});
