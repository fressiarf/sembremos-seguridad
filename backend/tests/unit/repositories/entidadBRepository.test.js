const entidadBRepository = require('../../../src/common/repositories/entidadBRepository');
const { 
  LineaAccion, 
  LineaAccionSync 
} = require('../../../src/models');

// Mock de los modelos de Sequelize
jest.mock('../../../src/models', () => ({
  LineaAccion: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn()
  },
  LineaAccionSync: {
    findAll: jest.fn(),
    findByPk: jest.fn()
  },
  Canton: {},
  UsuarioFP: {},
  AccionEstrategica: {},
  KpiNacional: {},
  ActividadLocal: {}
}));

describe('EntidadBRepository Unit Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllByLevel', () => {
    it('debe llamar a LineaAccion.findAll cuando el nivel es MSP', async () => {
      const mockData = [{ id: '1', titulo: 'Test MSP', get: () => ({ id: '1', titulo: 'Test MSP' }) }];
      LineaAccion.findAll.mockResolvedValue(mockData);

      const result = await entidadBRepository.getAllByLevel('MSP');

      expect(LineaAccion.findAll).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0].titulo).toBe('Test MSP');
    });

    it('debe llamar a LineaAccionSync.findAll cuando el nivel es MUNI', async () => {
      const mockData = [{ id: '2', titulo: 'Test MUNI', get: () => ({ id: '2', titulo: 'Test MUNI' }) }];
      LineaAccionSync.findAll.mockResolvedValue(mockData);

      const result = await entidadBRepository.getAllByLevel('MUNI');

      expect(LineaAccionSync.findAll).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0].titulo).toBe('Test MUNI');
    });
  });

  describe('getById', () => {
    it('debe recuperar un registro con raw: true', async () => {
      const mockId = 'uuid-123';
      const mockRecord = { id: mockId, titulo: 'Detalle' };
      LineaAccion.findByPk.mockResolvedValue(mockRecord);

      const result = await entidadBRepository.getById(mockId, 'MSP');

      expect(LineaAccion.findByPk).toHaveBeenCalledWith(mockId, expect.objectContaining({
        raw: true
      }));
      expect(result).toEqual(mockRecord);
    });
  });

  describe('create', () => {
    it('debe crear un registro y devolver objeto plano', async () => {
      const inputData = { titulo: 'Nueva Linea' };
      const mockInstance = { ...inputData, id: 'new-id', get: () => ({ ...inputData, id: 'new-id' }) };
      LineaAccion.create.mockResolvedValue(mockInstance);

      const result = await entidadBRepository.create(inputData);

      expect(LineaAccion.create).toHaveBeenCalledWith(inputData);
      expect(result.id).toBe('new-id');
    });
  });

  describe('delete', () => {
    it('debe retornar true si el registro fue eliminado', async () => {
      LineaAccion.destroy.mockResolvedValue(1);
      const result = await entidadBRepository.delete('id-123');
      expect(result).toBe(true);
    });

    it('debe retornar false si no se eliminó nada', async () => {
      LineaAccion.destroy.mockResolvedValue(0);
      const result = await entidadBRepository.delete('id-non-existent');
      expect(result).toBe(false);
    });
  });
});
