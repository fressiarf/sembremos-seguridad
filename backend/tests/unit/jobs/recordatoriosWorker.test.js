/**
 * Tests de la máquina de estados del worker.
 * Mockeamos modelos y servicios para que NO toque DB ni SMTP.
 *
 * Lo que validamos:
 *   - Sin pendientes → procesados=0.
 *   - Con un pendiente y SMTP OK → estado pasa a 'enviado'.
 *   - Con SMTP no configurado → recordatorio se re-encola sin gastar intentos.
 *   - Sin destinatarios → estado 'omitido'.
 *   - Error de envío → intentos++ y vuelve a 'pendiente' (o 'fallido' en el 3er intento).
 *   - Lock optimista: si el UPDATE devuelve 0 filas, no se procesa.
 */

jest.mock('../../../src/models/muni/EventoRecordatorio');
jest.mock('../../../src/models/muni/EventoCalendario');
jest.mock('../../../src/models/muni/NotificacionLocal');
jest.mock('../../../src/models/muni/UsuarioLocal');
jest.mock('../../../src/services/MailService');
jest.mock('../../../src/services/DestinatariosService');

const EventoRecordatorio = require('../../../src/models/muni/EventoRecordatorio');
const NotificacionLocal = require('../../../src/models/muni/NotificacionLocal');
const UsuarioLocal = require('../../../src/models/muni/UsuarioLocal');
const MailService = require('../../../src/services/MailService');
const DestinatariosService = require('../../../src/services/DestinatariosService');

const worker = require('../../../src/jobs/recordatoriosWorker');

const construirRecordatorioMock = (overrides = {}) => ({
  id: 'rec-1',
  evento_id: 'ev-1',
  offset_minutos: 60,
  intentos: 0,
  evento: {
    id: 'ev-1',
    titulo: 'Reunión test',
    descripcion: 'desc',
    fecha_inicio: new Date(Date.now() + 60 * 60 * 1000)
  },
  ...overrides
});

describe('recordatoriosWorker.procesarRecordatorios', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    // Defaults seguros — cada test puede sobreescribir
    NotificacionLocal.create = jest.fn().mockResolvedValue({});
    UsuarioLocal.findOne = jest.fn().mockResolvedValue(null); // no in-app por defecto
  });

  it('no hace nada cuando no hay pendientes', async () => {
    EventoRecordatorio.findAll.mockResolvedValue([]);
    const res = await worker.procesarRecordatorios();
    expect(res.procesados).toBe(0);
    expect(EventoRecordatorio.update).not.toHaveBeenCalled();
    expect(MailService.enviarRecordatorio).not.toHaveBeenCalled();
  });

  it('flujo feliz: lockea, envía, marca enviado', async () => {
    const rec = construirRecordatorioMock();
    EventoRecordatorio.findAll.mockResolvedValue([rec]);
    EventoRecordatorio.update.mockResolvedValue([1]); // lock toma 1 fila
    DestinatariosService.resolverDestinatariosEvento.mockResolvedValue([
      { nombre: 'Juan', email: 'juan@test.local' }
    ]);
    MailService.enviarRecordatorio.mockResolvedValue({ messageId: 'msg-1', accepted: ['juan@test.local'] });

    const res = await worker.procesarRecordatorios();

    expect(res.procesados).toBe(1);
    // Lock optimista
    expect(EventoRecordatorio.update).toHaveBeenCalledWith(
      { estado: 'enviando' },
      { where: { id: 'rec-1', estado: 'pendiente' } }
    );
    // Marcado como enviado al final
    const llamadasUpdate = EventoRecordatorio.update.mock.calls;
    const finalCall = llamadasUpdate[llamadasUpdate.length - 1];
    expect(finalCall[0]).toMatchObject({ estado: 'enviado', ultimo_error: null });
  });

  it('SMTP no configurado: re-encola como pendiente sin gastar intentos', async () => {
    const rec = construirRecordatorioMock();
    EventoRecordatorio.findAll.mockResolvedValue([rec]);
    EventoRecordatorio.update.mockResolvedValue([1]);
    DestinatariosService.resolverDestinatariosEvento.mockResolvedValue([
      { nombre: 'Juan', email: 'juan@test.local' }
    ]);
    MailService.enviarRecordatorio.mockResolvedValue({ skipped: true, reason: 'SMTP no configurado' });

    await worker.procesarRecordatorios();

    const llamadas = EventoRecordatorio.update.mock.calls;
    const ultima = llamadas[llamadas.length - 1];
    expect(ultima[0]).toEqual({ estado: 'pendiente' });
    // No se incrementa intentos
    expect(JSON.stringify(ultima[0])).not.toContain('intentos');
  });

  it('sin destinatarios resueltos: marca como omitido', async () => {
    const rec = construirRecordatorioMock();
    EventoRecordatorio.findAll.mockResolvedValue([rec]);
    EventoRecordatorio.update.mockResolvedValue([1]);
    DestinatariosService.resolverDestinatariosEvento.mockResolvedValue([]);

    await worker.procesarRecordatorios();

    const llamadas = EventoRecordatorio.update.mock.calls;
    const ultima = llamadas[llamadas.length - 1];
    expect(ultima[0]).toMatchObject({ estado: 'omitido' });
    expect(ultima[0].ultimo_error).toContain('sin destinatarios');
    expect(MailService.enviarRecordatorio).not.toHaveBeenCalled();
  });

  it('error en envío: incrementa intentos y vuelve a pendiente si < 3', async () => {
    const rec = construirRecordatorioMock({ intentos: 1 });
    EventoRecordatorio.findAll.mockResolvedValue([rec]);
    EventoRecordatorio.update.mockResolvedValue([1]);
    DestinatariosService.resolverDestinatariosEvento.mockResolvedValue([
      { nombre: 'Juan', email: 'juan@test.local' }
    ]);
    MailService.enviarRecordatorio.mockRejectedValue(new Error('Connection refused'));

    await worker.procesarRecordatorios();

    const llamadas = EventoRecordatorio.update.mock.calls;
    const ultima = llamadas[llamadas.length - 1];
    expect(ultima[0]).toMatchObject({
      estado: 'pendiente',
      intentos: 2,
      ultimo_error: 'Connection refused'
    });
  });

  it('al 3er intento fallido: marca como fallido', async () => {
    const rec = construirRecordatorioMock({ intentos: 2 });
    EventoRecordatorio.findAll.mockResolvedValue([rec]);
    EventoRecordatorio.update.mockResolvedValue([1]);
    DestinatariosService.resolverDestinatariosEvento.mockResolvedValue([
      { nombre: 'Juan', email: 'juan@test.local' }
    ]);
    MailService.enviarRecordatorio.mockRejectedValue(new Error('SMTP timeout'));

    await worker.procesarRecordatorios();

    const llamadas = EventoRecordatorio.update.mock.calls;
    const ultima = llamadas[llamadas.length - 1];
    expect(ultima[0]).toMatchObject({ estado: 'fallido', intentos: 3 });
  });

  it('lock optimista perdido (UPDATE = 0 filas): no procesa', async () => {
    const rec = construirRecordatorioMock();
    EventoRecordatorio.findAll.mockResolvedValue([rec]);
    EventoRecordatorio.update.mockResolvedValue([0]); // otro worker se lo llevó

    const res = await worker.procesarRecordatorios();

    expect(res.procesados).toBe(0);
    expect(MailService.enviarRecordatorio).not.toHaveBeenCalled();
    expect(DestinatariosService.resolverDestinatariosEvento).not.toHaveBeenCalled();
  });
});
