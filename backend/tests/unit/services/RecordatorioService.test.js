/**
 * Tests unitarios de RecordatorioService.
 * Solo cubre las funciones puras (calcularRecordatoriosAplicables, OFFSETS_MINUTOS).
 * Las funciones que tocan DB (generarRecordatorios, regenerarRecordatorios) se
 * validan en src/scripts/test-flow.js contra BD real.
 */

const {
  calcularRecordatoriosAplicables,
  OFFSETS_MINUTOS
} = require('../../../src/services/RecordatorioService');

describe('RecordatorioService — funciones puras', () => {

  describe('OFFSETS_MINUTOS', () => {
    it('coincide exactamente con la spec acordada (14d / 7d / 4d / 2d / 1d / 12h / 1h)', () => {
      expect(OFFSETS_MINUTOS).toEqual([20160, 10080, 5760, 2880, 1440, 720, 60]);
    });

    it('está ordenado de mayor a menor', () => {
      for (let i = 1; i < OFFSETS_MINUTOS.length; i++) {
        expect(OFFSETS_MINUTOS[i - 1]).toBeGreaterThan(OFFSETS_MINUTOS[i]);
      }
    });
  });

  describe('calcularRecordatoriosAplicables', () => {
    const ahora = new Date('2026-05-18T10:00:00Z');

    it('devuelve los 7 offsets cuando el evento está a 30 días', () => {
      const fecha = new Date(ahora.getTime() + 30 * 24 * 60 * 60 * 1000);
      const res = calcularRecordatoriosAplicables(fecha, ahora);
      expect(res).toHaveLength(7);
      expect(res.map((r) => r.offset_minutos)).toEqual([20160, 10080, 5760, 2880, 1440, 720, 60]);
    });

    it('omite offsets que ya pasaron — evento a 3 días → 4 recordatorios (2d, 1d, 12h, 1h)', () => {
      const fecha = new Date(ahora.getTime() + 3 * 24 * 60 * 60 * 1000);
      const res = calcularRecordatoriosAplicables(fecha, ahora);
      expect(res.map((r) => r.offset_minutos)).toEqual([2880, 1440, 720, 60]);
    });

    it('evento en 90 minutos → solo aplica el offset 60', () => {
      const fecha = new Date(ahora.getTime() + 90 * 60 * 1000);
      const res = calcularRecordatoriosAplicables(fecha, ahora);
      expect(res).toHaveLength(1);
      expect(res[0].offset_minutos).toBe(60);
    });

    it('evento en 30 minutos → ningún offset aplica (el de 1h ya pasó)', () => {
      const fecha = new Date(ahora.getTime() + 30 * 60 * 1000);
      const res = calcularRecordatoriosAplicables(fecha, ahora);
      expect(res).toEqual([]);
    });

    it('evento en el pasado → array vacío', () => {
      const fecha = new Date(ahora.getTime() - 60 * 60 * 1000);
      expect(calcularRecordatoriosAplicables(fecha, ahora)).toEqual([]);
    });

    it('programado_para de cada recordatorio = fechaInicio - offset', () => {
      const fecha = new Date(ahora.getTime() + 15 * 24 * 60 * 60 * 1000); // +15d
      const res = calcularRecordatoriosAplicables(fecha, ahora);
      const r14d = res.find((r) => r.offset_minutos === 20160);
      expect(r14d.programado_para.getTime()).toBe(fecha.getTime() - 20160 * 60 * 1000);
    });

    it('acepta fechaInicio como string ISO', () => {
      const fechaIso = new Date(ahora.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();
      const res = calcularRecordatoriosAplicables(fechaIso, ahora);
      expect(res.length).toBeGreaterThan(0);
      expect(res[0].programado_para).toBeInstanceOf(Date);
    });
  });
});
