# Sistema de Recordatorios de Eventos — Diseño y justificación

> Estado al cierre de Fase 3 (confirmación de evento + cadencia de avisos).
> Próximo paso: Fase 4 — worker `node-cron` que dispara los recordatorios pendientes.

---

## 1. Qué resuelve este sistema

Cuando un funcionario agenda un evento en el calendario (reunión interinstitucional, operativo preventivo, etc.), el sistema:

1. **Envía un correo de confirmación inmediato** al creador, con el evento adjunto como archivo `.ics`.
2. **Genera automáticamente una cadencia de recordatorios** que se irán enviando por correo conforme se acerca la fecha del evento:

   `14 días → 7 días → 4 días → 2 días → 1 día → 12 horas → 1 hora antes del evento`.

   El aviso de **1 hora antes es el punto mínimo**: avisos más cercanos (30, 15, 5 min) se omiten porque a esa altura el evento ya debería estar en marcha y el aviso pierde valor.

3. **Sólo programa los recordatorios que aplican**. Si el evento se crea con 3 días de antelación, no programa los de 14d, 7d ni 4d — sólo los que aún caen en el futuro.

4. **Si la fecha del evento cambia**, recalcula los recordatorios pendientes sin reenviar los que ya salieron.

---

## 2. Arquitectura

```
┌─────────────────────┐
│ Frontend / API      │  POST /eventos
│ (Calendario.jsx)    │──────────────────────┐
└─────────────────────┘                      │
                                             ▼
                              ┌──────────────────────────────┐
                              │ EventoCalendario.create()    │
                              └──────────────────────────────┘
                                             │
                              ┌──────────────┴────────────────┐
                              │ Hook afterCreate              │
                              ├───────────────────────────────┤
                              │ 1. Auditoría (LogAuditoria)   │
                              │ 2. RecordatorioService        │
                              │    .generarRecordatorios()    │
                              │ 3. setImmediate ─► Confirmación │
                              │    MailService                │
                              │    .enviarConfirmacion()      │
                              └──────────────┬────────────────┘
                                             │
                              ┌──────────────▼────────────────┐
                              │ tabla eventos_recordatorios   │
                              │ (estado = pendiente)          │
                              └──────────────┬────────────────┘
                                             │  cada 1 min (Fase 4)
                              ┌──────────────▼────────────────┐
                              │ Worker node-cron              │
                              │ - WHERE programado_para<=NOW  │
                              │ - resolverDestinatariosEvento │
                              │ - enviarRecordatorio (+ .ics) │
                              │ - marca estado = enviado      │
                              └───────────────────────────────┘
```

---

## 3. Decisiones de diseño — el porqué de cada elección

### 3.1 Generación anticipada vs cálculo dinámico

**Decisión**: pre-calcular los recordatorios al crear el evento y persistirlos en `eventos_recordatorios`.

**Por qué**: la alternativa era que el worker, cada minuto, escanee `eventos_calendario` y calcule "qué eventos están dentro de la ventana de 14d/7d/.../5m". Eso obliga al worker a hacer aritmética con fechas en SQL y a llevar registro aparte de "ya envié este recordatorio". Pre-calcular y guardar en una tabla nos da:

- **Idempotencia gratis**: cada fila tiene `estado` y `enviado_en`. No hay forma de mandar dos veces el mismo aviso.
- **Auditabilidad**: queda trazado qué se envió y cuándo.
- **Worker simple**: una sola query `WHERE estado='pendiente' AND programado_para<=NOW()`.
- **Failover natural**: si el worker se cae 10 minutos, los recordatorios encolados salen apenas vuelve.

### 3.2 `UNIQUE(evento_id, offset_minutos)` + `ignoreDuplicates: true`

**Por qué**: blinda contra dobles ejecuciones del hook (por ejemplo, si el cliente reintenta el POST). El insert duplicado se silencia sin levantar excepción que pudiera abortar el guardado del evento.

### 3.3 Estados explícitos: `pendiente | enviando | enviado | omitido | fallido`

**Por qué cada uno**:
- `pendiente` — recién generado, esperando que el worker lo tome.
- `enviando` — el worker hizo lock optimista; previene que dos instancias del worker (si escala horizontalmente) procesen el mismo recordatorio.
- `enviado` — exitoso. Se preserva como historia, **no se regenera** aunque la fecha del evento cambie.
- `omitido` — útil para futuras razones de no envío (ej. usuario desactivó notificaciones después de programar).
- `fallido` — se intentó 3 veces sin éxito. Visible en endpoint admin de diagnóstico (Fase 6).

### 3.4 `setImmediate(...)` para el correo de confirmación

**Por qué**: el `await` en el hook bloquearía la respuesta HTTP del POST `/eventos`. Si Gmail tarda 2 s en aceptar la conexión SMTP, el usuario ve un POST lento. Con `setImmediate`, el evento se guarda y responde 201 al instante, y la confirmación sale en el siguiente tick del event loop.

**Costo**: si el envío de la confirmación falla, no se notifica al cliente — sólo se loggea. Es aceptable porque el evento sí se creó; el usuario lo ve en el calendario. El recordatorio del día siguiente cubre cualquier omisión.

### 3.5 `.ics` adjunto en vez de Google Calendar API (en v1 inmediato)

**Por qué primero el `.ics`**: el destinatario abre el adjunto y se agrega a su Google/Outlook/Apple Calendar con un clic. Sin OAuth por usuario, sin tokens que rotar, sin permisos pendientes. Cubre el 90% del valor con el 10% del esfuerzo.

La integración real con Google Calendar API (que también acordamos) queda como Fase 7 — agregará inserción/actualización/borrado automático en el calendario del usuario, **complementando** al `.ics`.

### 3.6 `UID = evento.id` en el `.ics`

**Por qué**: las apps de calendario usan el UID para deduplicar/actualizar invitaciones. Si reenviamos el `.ics` (por ejemplo, al cambiar la fecha del evento), la app del usuario reconoce que es el mismo evento y lo actualiza en lugar de crear uno nuevo. Sin esto, el calendario del usuario se llenaría de duplicados.

### 3.7 Resolución de destinatarios v1: sólo el creador

**Por qué la limitación**:
- `EventoCalendario` tiene `creado_por` (FK a `usuarios_local`) → resuelve email del creador con un `findByPk`.
- `EventoCalendario` **no tiene** una columna `participantes_instituciones`. La frontend manda el array, pero `EventoCalendario.create(req.body)` lo descarta porque Sequelize sólo persiste los campos del modelo.
- `usuarios_local` **no tiene** `institucion_id`. No hay manera de hacer "todos los usuarios de la institución X".

**Cuándo se expande**: en una iteración aparte, agregando:
1. Columna JSON `participantes_instituciones` (UUID[]) en `eventos_calendario`.
2. Columna `institucion_id` en `usuarios_local` (o explotar la tabla `asignaciones_cogestor` existente).
3. Extender `resolverDestinatariosEvento` para hacer el JOIN.

El servicio ya está aislado en [src/services/DestinatariosService.js](../src/services/DestinatariosService.js) → ese es el único archivo que cambia.

### 3.8 `node-cron` cada 1 minuto vs BullMQ + Redis

**Por qué `node-cron`**: para esta escala (decenas o cientos de eventos por día) el costo de operación de Redis no se justifica. `node-cron` corre en el mismo proceso del backend, lee de MySQL, manda los correos y termina. Si en el futuro hay miles de eventos/día se puede migrar a BullMQ; los servicios ya están aislados y la migración sería contenida.

### 3.9 Wording de la cadencia

**Decisión** (confirmada por el usuario): mantener el formato actual.

```
14 días -> Faltan 14 días
 7 días -> Faltan 7 días
 4 días -> Faltan 4 días
 2 días -> Faltan 2 días
 1 día  -> Es mañana
12 horas -> Faltan 12 horas
 1 hora -> Falta 1 hora
```

Casos especiales: "Es mañana" (1 día) y "Falta 1 hora" para concordancia gramatical singular.

---

## 4. Inventario de archivos — qué hace cada uno

### Base de datos

| Archivo | Por qué existe |
|---|---|
| [src/migrations/muni/20260513400001-create-evento-recordatorio.js](../src/migrations/muni/20260513400001-create-evento-recordatorio.js) | Crea la tabla `eventos_recordatorios` con FK CASCADE a `eventos_calendario`, UNIQUE compuesto y índice de scan. |
| [src/models/muni/EventoRecordatorio.js](../src/models/muni/EventoRecordatorio.js) | Modelo Sequelize. Expone `OFFSETS_MINUTOS` como constante reutilizable. |
| [src/models/muni/EventoCalendario.js](../src/models/muni/EventoCalendario.js) | **Modificado**: hooks `afterCreate`/`afterUpdate` extendidos para generar recordatorios + disparar confirmación. |
| [src/migrations/muni/20260515171335-add-last-login-to-users-muni.js](../src/migrations/muni/20260515171335-add-last-login-to-users-muni.js) | **Bugfix paralelo**: corregido nombre de tabla `UsuarioLocal` → `usuarios_local`. |

### Servicios

| Archivo | Por qué existe |
|---|---|
| [src/services/RecordatorioService.js](../src/services/RecordatorioService.js) | Calcula qué offsets aplican (futuros), inserta/regenera filas. Función pura `calcularRecordatoriosAplicables` testeable sin DB. |
| [src/services/RecordatorioFormatter.js](../src/services/RecordatorioFormatter.js) | Helpers de humanización ("Faltan 2 días"), fecha en español con Luxon, `escapeHtml`. Aislado para reuso. |
| [src/services/IcsService.js](../src/services/IcsService.js) | Genera el `.ics` con UID estable. Convierte fechas a hora local CR. |
| [src/services/MailService.js](../src/services/MailService.js) | Pool SMTP nodemailer + render de plantilla. Funciones públicas: `enviarRecordatorio`, `enviarConfirmacion`, `sendMail`, `verify`. |
| [src/services/DestinatariosService.js](../src/services/DestinatariosService.js) | Punto único de resolución de destinatarios. Hoy = creador. Aislado para extensión futura. |

### Plantilla y configuración

| Archivo | Por qué existe |
|---|---|
| [src/templates/recordatorio.html](../src/templates/recordatorio.html) | HTML email-safe (table layout, estilos inline). Misma plantilla para confirmación y recordatorio — sólo cambia el texto del encabezado. |
| [.env](../.env) / [.env.example](../.env.example) | Variables: SMTP Gmail, TZ, URL frontend, flags. `.env.example` documenta el contrato sin exponer credenciales. |

### Herramientas

| Archivo | Por qué existe |
|---|---|
| [src/scripts/test-mail.js](../src/scripts/test-mail.js) | Verificación manual end-to-end sin necesidad de crear evento en DB. Modo dry-run (sólo render) o envío real con `--modo=confirmacion`/`recordatorio`. |
| [src/scripts/verify-recordatorios.js](../src/scripts/verify-recordatorios.js) | Smoke test integral: DB + servicios + plantilla. Lo corremos antes de avanzar a la siguiente fase. |
| [src/scripts/test-flow.js](../src/scripts/test-flow.js) | Prueba end-to-end con BD: crea un evento real, valida que se generen los recordatorios correctos y limpia después de sí mismo. |

---

## 5. Cómo verificar manualmente

### 5.1 Verificación automática (recomendada antes de avanzar)

```bash
cd backend
node src/scripts/verify-recordatorios.js
```

Debe reportar `OK` en todos los chequeos. Si algo falla, no avancemos.

### 5.2 Inspección visual del correo

```bash
cd backend
node src/scripts/test-mail.js --modo=confirmacion        # genera preview HTML + .ics
node src/scripts/test-mail.js --modo=recordatorio --offset=60
```

Abre los archivos en `backend/src/scripts/tmp/preview-*.html` con el navegador para ver el diseño, y `preview-*.ics` con un editor de texto o tu app de calendario para validar el adjunto.

### 5.3 Envío real (requiere App Password de Gmail)

```bash
cd backend
node src/scripts/test-mail.js tu-correo@gmail.com --modo=confirmacion
```

Para que esto funcione: setear `MAIL_USER` y `MAIL_PASS` en `.env` (16 caracteres sin espacios, generado en https://myaccount.google.com/apppasswords con 2FA activado).

### 5.4 Prueba end-to-end con evento real (recomendado)

```bash
cd backend
node src/scripts/test-flow.js
```

Crea un evento real con `fecha_inicio = NOW() + 2 días`, verifica que se generen exactamente 5 recordatorios (2d/1d/12h/1h, omite los que ya pasaron), valida que la actualización de fecha regenere correctamente y limpia todo al terminar. No envía correos reales.

---

## 6. Estado y próximos pasos

### Hecho (Fases 0-3)

- [x] **Fase 0**: dependencias (`nodemailer`, `node-cron`, `ics`, `luxon`, `googleapis`), `.env` extendido.
- [x] **Fase 1**: migración `eventos_recordatorios` aplicada, modelo registrado.
- [x] **Fase 2**: hooks de `EventoCalendario` generan/regeneran recordatorios.
- [x] **Fase 3**: pipeline de correo + plantilla + `.ics`. Confirmación inmediata en `afterCreate`.

### Siguiente — Fase 4: Worker

- [ ] `src/jobs/recordatoriosWorker.js`: `node-cron` cada 1 min.
- [ ] Lock optimista: `UPDATE ... SET estado='enviando' WHERE estado='pendiente' AND id=?`.
- [ ] Reintentos: 3 con backoff, luego `fallido`.
- [ ] Arranque desde `server.js` con flag `ENABLE_REMINDERS`.
- [ ] Notificación in-app paralela en `notificaciones_local`.

### Pendiente (Fases 5-7)

- **Fase 5**: UI — toggle de preferencias, vista "Mis recordatorios", retirar `setInterval` de EmailJS.
- **Fase 6**: tests Jest + logs + endpoint admin de diagnóstico.
- **Fase 7**: integración bidireccional con Google Calendar API (OAuth2 por usuario).

### Limitaciones conocidas

1. Destinatarios v1 = creador del evento. Expansión a participantes requiere migración (ver §3.7).
2. Si el backend está caído cuando un recordatorio vence, el worker lo procesa apenas vuelva; pero hay un desfase. Aceptable en este contexto.
3. No hay rate-limiting de Gmail. Para volúmenes grandes (>500 correos/día) habría que cambiar a SendGrid/SES.
