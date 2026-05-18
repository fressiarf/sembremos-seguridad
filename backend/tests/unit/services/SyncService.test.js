// Mocks de los modelos de Sequelize antes de importar el servicio
const mockLineaAccion = {
  findAll: jest.fn()
};
const mockLineaAccionSync = {
  upsert: jest.fn()
};
const mockInstitucionMaestra = {
  findAll: jest.fn()
};
const mockInstitucionLocal = {
  upsert: jest.fn()
};
const mockKpiNacional = {
  findAll: jest.fn()
};
const mockKpiLocalSync = {
  upsert: jest.fn()
};

jest.mock('../../../src/models/msp/LineaAccion', () => mockLineaAccion);
jest.mock('../../../src/models/muni/LineaAccionSync', () => mockLineaAccionSync);
jest.mock('../../../src/models/msp/InstitucionMaestra', () => mockInstitucionMaestra);
jest.mock('../../../src/models/muni/InstitucionLocal', () => mockInstitucionLocal);
jest.mock('../../../src/models/msp/KpiNacional', () => mockKpiNacional);
jest.mock('../../../src/models/msp/AccionEstrategica', () => ({}));
jest.mock('../../../src/models/muni/KpiLocalSync', () => mockKpiLocalSync);

const SyncService = require('../../../src/services/SyncService');

describe('SyncService Unit Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('syncLineasAccion (Sincronización de Líneas de Acción MSP -> MUNI)', () => {
    it('debe procesar correctamente las líneas, reportando creados y actualizados', async () => {
      // Mock de datos de MSP (Fuerza Pública)
      mockLineaAccion.findAll.mockResolvedValue([
        { id: 'uuid-1', titulo: 'Línea de Prevención', problematica: 'Crimen', objetivo_general: 'Reducir delito' },
        { id: 'uuid-2', titulo: 'Línea de Recuperación', problematica: 'Espacios', objetivo_general: 'Recuperar parques' }
      ]);

      // Primer registro es nuevo (created: true), segundo es una actualización (created: false)
      mockLineaAccionSync.upsert
        .mockResolvedValueOnce([{}, true])
        .mockResolvedValueOnce([{}, false]);

      const result = await SyncService.syncLineasAccion();

      expect(result.success).toBe(true);
      expect(result.entity).toBe('LineasAccion');
      expect(result.stats).toEqual({ creados: 1, actualizados: 1, total: 2 });
      expect(mockLineaAccion.findAll).toHaveBeenCalledTimes(1);
      expect(mockLineaAccionSync.upsert).toHaveBeenCalledTimes(2);
    });

    it('debe capturar errores de base de datos y retornar reporte fallido', async () => {
      mockLineaAccion.findAll.mockRejectedValue(new Error('Conexión perdida a base de datos MSP'));

      const result = await SyncService.syncLineasAccion();

      expect(result.success).toBe(false);
      expect(result.entity).toBe('LineasAccion');
      expect(result.error).toBe('Conexión perdida a base de datos MSP');
    });
  });

  describe('syncInstituciones (Sincronización de Catálogo de Instituciones MSP -> MUNI)', () => {
    it('debe sincronizar todas las instituciones maestras en el espejo local', async () => {
      mockInstitucionMaestra.findAll.mockResolvedValue([
        { id: 'inst-1', nombre: 'Ministerio de Salud', siglas: 'MINSA' },
        { id: 'inst-2', nombre: 'Fuerza Pública', siglas: 'FP' }
      ]);

      mockInstitucionLocal.upsert.mockResolvedValue([{}, true]);

      const result = await SyncService.syncInstituciones();

      expect(result.success).toBe(true);
      expect(result.entity).toBe('Instituciones');
      expect(result.stats).toEqual({ creados: 2, actualizados: 0, total: 2 });
    });
  });

  describe('syncKpis (Sincronización de KPIs desnormalizando la Acción Estratégica)', () => {
    it('debe sincronizar KPIs y usar el fallback si no hay acción estratégica asociada', async () => {
      mockKpiNacional.findAll.mockResolvedValue([
        { 
          id: 'kpi-1', 
          nombre_indicador: 'Parques Recuperados', 
          valor_meta: 10, 
          valor_actual: 4,
          accion: { nombre: 'Acción Territorial' }
        },
        { 
          id: 'kpi-2', 
          nombre_indicador: 'Lámparas Instaladas', 
          valor_meta: 100, 
          valor_actual: 50,
          accion: null // Sin acción
        }
      ]);

      mockKpiLocalSync.upsert.mockResolvedValue([{}, true]);

      const result = await SyncService.syncKpis();

      expect(result.success).toBe(true);
      expect(result.stats).toEqual({ creados: 2, actualizados: 0, total: 2 });
      expect(mockKpiLocalSync.upsert).toHaveBeenNthCalledWith(1, {
        id: 'kpi-1',
        accion_nombre: 'Acción Territorial',
        nombre_indicador: 'Parques Recuperados',
        valor_meta: 10,
        valor_actual: 4
      });
      expect(mockKpiLocalSync.upsert).toHaveBeenNthCalledWith(2, {
        id: 'kpi-2',
        accion_nombre: 'Sin acción',
        nombre_indicador: 'Lámparas Instaladas',
        valor_meta: 100,
        valor_actual: 50
      });
    });
  });

  describe('syncAll (Consolidación en Paralelo)', () => {
    it('debe ejecutar todas las sincronizaciones en paralelo de forma exitosa', async () => {
      mockLineaAccion.findAll.mockResolvedValue([]);
      mockInstitucionMaestra.findAll.mockResolvedValue([]);
      mockKpiNacional.findAll.mockResolvedValue([]);

      const result = await SyncService.syncAll();

      expect(result.success).toBe(true);
      expect(result.resumen).toEqual({ exitosos: 3, fallidos: 0 });
      expect(result.resultados.lineasAccion.success).toBe(true);
      expect(result.resultados.instituciones.success).toBe(true);
      expect(result.resultados.kpis.success).toBe(true);
    });
  });
});
