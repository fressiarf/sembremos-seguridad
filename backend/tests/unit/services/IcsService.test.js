/**
 * Tests unitarios de IcsService — validan estructura iCalendar válida.
 */

const { generarIcs, construirAdjuntoIcs } = require('../../../src/services/IcsService');

const eventoBase = {
  id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  titulo: 'Reunión interinstitucional',
  descripcion: 'Coordinación operativa',
  fecha_inicio: new Date('2026-06-01T15:00:00Z'),
  fecha_fin: new Date('2026-06-01T16:30:00Z')
};

describe('IcsService', () => {

  describe('generarIcs', () => {
    it('produce estructura iCalendar válida', async () => {
      const ics = await generarIcs({ evento: eventoBase });
      expect(ics).toContain('BEGIN:VCALENDAR');
      expect(ics).toContain('END:VCALENDAR');
      expect(ics).toContain('BEGIN:VEVENT');
      expect(ics).toContain('END:VEVENT');
      expect(ics).toContain('VERSION:2.0');
    });

    it('usa el evento.id como UID — clave para deduplicación en clientes', async () => {
      const ics = await generarIcs({ evento: eventoBase });
      expect(ics).toContain(`UID:${eventoBase.id}`);
    });

    it('marca METHOD:REQUEST para que sea reconocido como invitación', async () => {
      const ics = await generarIcs({ evento: eventoBase });
      expect(ics).toContain('METHOD:REQUEST');
      expect(ics).toContain('STATUS:CONFIRMED');
    });

    it('incluye organizador si se pasa email', async () => {
      const ics = await generarIcs({
        evento: eventoBase,
        organizadorEmail: 'avisos@sembremos.cr'
      });
      expect(ics).toContain('ORGANIZER');
      expect(ics).toContain('avisos@sembremos.cr');
    });

    it('lista attendees con rol y partstat', async () => {
      const ics = await generarIcs({
        evento: eventoBase,
        attendees: [{ nombre: 'Juan', email: 'juan@test.local' }]
      });
      expect(ics).toContain('ATTENDEE');
      expect(ics).toContain('juan@test.local');
    });

    it('usa duración fallback de 1 hora cuando no hay fecha_fin', async () => {
      const ics = await generarIcs({
        evento: { ...eventoBase, fecha_fin: null }
      });
      expect(ics).toContain('DURATION:PT1H');
    });

    it('escribe DTSTART en hora local (sin Z) con la TZ por defecto CR', async () => {
      const ics = await generarIcs({ evento: eventoBase });
      // 15:00 UTC = 09:00 CR (UTC-6)
      expect(ics).toMatch(/DTSTART:20260601T090000/);
    });
  });

  describe('construirAdjuntoIcs', () => {
    it('retorna objeto compatible con nodemailer (filename, content, contentType)', async () => {
      const adj = await construirAdjuntoIcs({ evento: eventoBase });
      expect(adj.filename).toBe('evento.ics');
      expect(typeof adj.content).toBe('string');
      expect(adj.contentType).toMatch(/text\/calendar/);
      expect(adj.contentType).toMatch(/method=REQUEST/);
    });
  });
});
