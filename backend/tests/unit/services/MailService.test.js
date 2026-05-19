/**
 * Tests unitarios de MailService — funciones de construcción (sin SMTP real).
 * sendMail/enviarRecordatorio/enviarConfirmacion no se testean aquí porque
 * requieren transport real; se validan en src/scripts/test-worker.js.
 */

const {
  construirHtmlRecordatorio,
  construirHtmlConfirmacion,
  construirAsunto,
  construirAsuntoConfirmacion
} = require('../../../src/services/MailService');

const eventoBase = {
  id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  titulo: 'Reunión interinstitucional',
  descripcion: 'Coordinación operativa preventiva',
  fecha_inicio: new Date('2026-06-01T15:00:00Z'),
  fecha_fin: new Date('2026-06-01T16:30:00Z')
};

describe('MailService — constructores de HTML y asuntos', () => {

  describe('construirAsunto (recordatorios)', () => {
    it('formato [aviso] título — incluye humanización del offset', () => {
      expect(construirAsunto({ evento: eventoBase, offsetMinutos: 1440 }))
        .toBe('[Es mañana] Reunión interinstitucional');
      expect(construirAsunto({ evento: eventoBase, offsetMinutos: 60 }))
        .toBe('[Falta 1 hora] Reunión interinstitucional');
      expect(construirAsunto({ evento: eventoBase, offsetMinutos: 2880 }))
        .toBe('[Faltan 2 días] Reunión interinstitucional');
    });
  });

  describe('construirAsuntoConfirmacion', () => {
    it('siempre usa prefijo [Nuevo evento]', () => {
      expect(construirAsuntoConfirmacion({ evento: eventoBase }))
        .toBe('[Nuevo evento] Reunión interinstitucional');
    });
  });

  describe('construirHtmlRecordatorio', () => {
    it('renderiza la plantilla sin placeholders pendientes', () => {
      const html = construirHtmlRecordatorio({ evento: eventoBase, offsetMinutos: 1440 });
      expect(html.match(/\{\{\w+\}\}/g)).toBeNull();
    });

    it('inyecta el aviso humanizado en el encabezado', () => {
      const html = construirHtmlRecordatorio({ evento: eventoBase, offsetMinutos: 60 });
      expect(html).toContain('Falta 1 hora');
    });

    it('inyecta título y descripción del evento', () => {
      const html = construirHtmlRecordatorio({ evento: eventoBase, offsetMinutos: 60 });
      expect(html).toContain('Reunión interinstitucional');
      expect(html).toContain('Coordinación operativa preventiva');
    });

    it('escapa HTML maliciosos en título y descripción', () => {
      const evil = {
        ...eventoBase,
        titulo: '<script>alert(1)</script>',
        descripcion: '<img src=x onerror=alert(1)>'
      };
      const html = construirHtmlRecordatorio({ evento: evil, offsetMinutos: 60 });
      expect(html).not.toContain('<script>alert(1)</script>');
      expect(html).not.toContain('<img src=x');
      expect(html).toContain('&lt;script&gt;');
    });

    it('renderiza fila de categoría solo si se pasa categoria', () => {
      const sin = construirHtmlRecordatorio({ evento: eventoBase, offsetMinutos: 60 });
      const con = construirHtmlRecordatorio({ evento: eventoBase, offsetMinutos: 60, categoria: 'Reunión' });
      expect(sin).not.toContain('Categoría');
      expect(con).toContain('Categoría');
      expect(con).toContain('Reunión');
    });

    it('renderiza lista de participantes solo si se pasa array no vacío', () => {
      const sin = construirHtmlRecordatorio({ evento: eventoBase, offsetMinutos: 60 });
      const con = construirHtmlRecordatorio({
        evento: eventoBase, offsetMinutos: 60,
        participantes: ['IMAS', 'CCSS']
      });
      expect(sin).not.toContain('Participantes');
      expect(con).toContain('Participantes');
      expect(con).toContain('IMAS');
      expect(con).toContain('CCSS');
    });

    it('CTA url apunta al frontend con query del evento_id', () => {
      const html = construirHtmlRecordatorio({ evento: eventoBase, offsetMinutos: 60 });
      expect(html).toContain(`evento=${eventoBase.id}`);
    });
  });

  describe('construirHtmlConfirmacion', () => {
    it('usa encabezado "Nuevo evento agendado"', () => {
      const html = construirHtmlConfirmacion({ evento: eventoBase });
      expect(html).toContain('Nuevo evento agendado');
    });

    it('renderiza sin placeholders pendientes', () => {
      const html = construirHtmlConfirmacion({ evento: eventoBase });
      expect(html.match(/\{\{\w+\}\}/g)).toBeNull();
    });
  });
});
