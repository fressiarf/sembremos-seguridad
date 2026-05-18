const ActividadService = require('../../../src/services/muni/ActividadService');
const ActividadLocal = require('../../../src/models/muni/ActividadLocal');
const ReporteEvidencia = require('../../../src/models/muni/ReporteEvidencia');

jest.mock('../../../src/models/muni/ActividadLocal');
jest.mock('../../../src/models/muni/ReporteEvidencia');

describe('ActividadService Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('cerrarActividad (Reglas de negocio complejas)', () => {
    it('debe lanzar error si la actividad no existe', async () => {
      ActividadLocal.findByPk.mockResolvedValue(null);
      await expect(ActividadService.cerrarActividad('uuid-123')).rejects.toThrow('Actividad no encontrada');
    });

    it('debe lanzar error si la actividad ya está cerrada', async () => {
      ActividadLocal.findByPk.mockResolvedValue({ id: 'uuid-123', estado_id: 3 });
      await expect(ActividadService.cerrarActividad('uuid-123')).rejects.toThrow('La actividad ya se encuentra cerrada');
    });

    it('debe lanzar error si la actividad no tiene reportes de evidencia aprobados', async () => {
      ActividadLocal.findByPk.mockResolvedValue({ id: 'uuid-123', estado_id: 2, save: jest.fn() });
      ReporteEvidencia.count.mockResolvedValue(0); // 0 reportes aprobados

      await expect(ActividadService.cerrarActividad('uuid-123'))
        .rejects.toThrow('No se puede cerrar una actividad sin reportes de evidencia aprobados');
    });

    it('debe cerrar la actividad exitosamente si tiene reportes aprobados', async () => {
      const mockSave = jest.fn();
      const mockActividad = { id: 'uuid-123', estado_id: 2, save: mockSave };
      
      ActividadLocal.findByPk.mockResolvedValue(mockActividad);
      ReporteEvidencia.count.mockResolvedValue(1); // 1 reporte aprobado

      const result = await ActividadService.cerrarActividad('uuid-123');

      expect(mockSave).toHaveBeenCalled();
      expect(result.estado_id).toBe(3); // Estado cambiado a Cerrado
    });
  });

  describe('calcularAvanceFinanciero (Cálculo automático de avance)', () => {
    it('debe retornar 0 si no hay presupuesto asignado', async () => {
      ActividadLocal.findByPk.mockResolvedValue({ id: 'uuid-123', presupuesto_asignado: 0 });
      const avance = await ActividadService.calcularAvanceFinanciero('uuid-123');
      expect(avance).toBe(0);
    });

    it('debe calcular correctamente el porcentaje de avance con presupuestos', async () => {
      ActividadLocal.findByPk.mockResolvedValue({
        id: 'uuid-123',
        presupuesto_asignado: 1000,
        presupuestos: [
          { monto_ejecutado: 250 },
          { monto_ejecutado: 250 }
        ]
      });

      const avance = await ActividadService.calcularAvanceFinanciero('uuid-123');
      expect(avance).toBe(50); // 500 / 1000 = 50%
    });

    it('debe topar el avance máximo en 100%', async () => {
      ActividadLocal.findByPk.mockResolvedValue({
        id: 'uuid-123',
        presupuesto_asignado: 1000,
        presupuestos: [
          { monto_ejecutado: 1500 } // Sobrepasó el presupuesto
        ]
      });

      const avance = await ActividadService.calcularAvanceFinanciero('uuid-123');
      expect(avance).toBe(100);
    });
  });
});
