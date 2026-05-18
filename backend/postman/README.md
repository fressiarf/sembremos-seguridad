# Pruebas Postman — Sembremos Seguridad

Colección de pruebas manuales para la API del backend.

## Archivos

| Archivo | Descripción |
| --- | --- |
| `sembremos-seguridad.postman_collection.json` | Colección con todos los endpoints (Auth, Usuarios, MSP, Muni, AI, Notificaciones). Cada request incluye `pm.test(...)` con asserts. |
| `sembremos-seguridad.postman_environment.json` | Environment local con `baseUrl`, credenciales y variables que se llenan automáticamente al correr los requests. |

## Importar en Postman

1. Abrir Postman → **Import** → arrastrar ambos archivos JSON.
2. Seleccionar el environment **Sembremos Seguridad - Local** en el dropdown superior derecho.
3. Editar las variables `mspEmail`, `mspPassword`, `muniEmail`, `muniPassword` con credenciales válidas de tu base.

## Levantar el servidor

```powershell
cd backend
npm install
npm run dev
```

Servidor por defecto en `http://localhost:5000` (variable `baseUrl`).

## Importante: autenticación por cookie

El backend usa cookie HTTP-only llamada `token`. **No** se usan cabeceras `Authorization: Bearer`.

- Para que los endpoints protegidos funcionen, ejecutá primero **`01 - Autenticación > POST /system/login (MSP)`** o **`(MUNI)`**.
- Postman guarda la cookie automáticamente y la envía en los siguientes requests al mismo host.
- En **Postman Desktop**: chequeá que tenés activado **Settings → General → Automatically follow redirects** y que las cookies aparecen en el ícono 🍪 del request.
- En **Postman Web**: necesitás instalar el **Postman Desktop Agent** para que las cookies HTTP-only funcionen contra `localhost`.

## Orden recomendado de ejecución

Para que las pruebas que dependen de IDs funcionen sin tocar nada a mano:

1. `00 - Health > GET /health`
2. `01 - Autenticación > POST /system/login (MSP)` → guarda cookie + `mspUserId`.
3. `01 - Autenticación > GET /auth/me` → verifica la sesión.
4. `02 - Usuarios y Dashboard > GET /system/usuarios` (requiere ADMIN_MSP).
5. `04 - MSP / Territorio > GET /provincias` → guarda `provinciaId`.
6. `04 - MSP / Territorio > GET /cantones/:provinciaId` → guarda `cantonId`.
7. `06 - MSP / Estrategia > GET /lineas` → guarda `kpiId`.
8. `10 - Muni / Actividades > POST /muni/actividades` → guarda `actividadId`.
9. Resto de los grupos en cualquier orden.
10. `01 - Autenticación > POST /system/logout` al final.

## Tipos de asserts incluidos

Cada request lleva al menos:

- **Status code esperado** (`200`, `201`, `204`, `400`, `401` según corresponda).
- **Estructura de respuesta**: existencia de campos clave (`data.user.id`, `status`, etc.).
- **Tiempo de respuesta** < 5s (assert a nivel colección).
- **Content-Type JSON** cuando hay body (assert a nivel colección).
- **Encadenado de variables**: los requests `GET` extraen IDs (`provinciaId`, `actividadId`, `kpiId`, etc.) al environment para que los `POST/PUT/DELETE` siguientes los usen.

Los casos negativos (credenciales inválidas, sin cookie, cédula mal formada, campos faltantes) están bajo el grupo `01 - Autenticación` y aseguran que el backend responda con `400` o `401` según corresponda.

## Correr en lote con Newman (opcional)

```powershell
npm install -g newman
newman run postman/sembremos-seguridad.postman_collection.json `
  -e postman/sembremos-seguridad.postman_environment.json `
  --cookie-jar cookies.json
```

> El flag `--cookie-jar` es necesario para que Newman persista la cookie de sesión entre requests, igual que lo hace Postman Desktop.

## Cobertura

| Grupo | Endpoints |
| --- | ---: |
| 00 - Health | 1 |
| 01 - Autenticación | 10 |
| 02 - Usuarios y Dashboard | 10 |
| 03 - MSP / Sync | 8 |
| 04 - MSP / Territorio | 3 |
| 05 - MSP / Instituciones | 3 |
| 06 - MSP / Estrategia | 3 |
| 07 - MSP / Incidentes | 3 |
| 08 - MSP / Inteligencia | 2 |
| 09 - Muni / Config Local | 2 |
| 10 - Muni / Actividades | 5 |
| 11 - Muni / Reportes | 3 |
| 12 - Muni / Presupuesto | 2 |
| 13 - Notificaciones | 2 |
| 14 - AI | 2 |

**Total: 59 requests**, cubriendo el 100% de las rutas declaradas en `src/app.js` (excluyendo el proxy `legacy/jsonProxy.routes.js`).

## Notas de mantenimiento

- Si agregás un endpoint nuevo, replicá el patrón: bloque `request` + bloque `event.test` con `pm.test(...)`.
- Si cambian las credenciales del seeder, actualizá el environment (no la colección).
- Los payloads de ejemplo (`POST /msp/incidentes`, `POST /muni/actividades`, etc.) usan IDs `1` por defecto para FKs (`tipo_delito_id`, `provincia_id`, etc.). Ajustalos a los catálogos reales de tu BD si los seeders no coinciden.
