# 🌿 Sembremos Seguridad — Plataforma de Seguimiento Estratégico

> **Estrategia integral de prevención para la seguridad pública en Costa Rica.**
> Liderada por el Ministerio de Seguridad Pública (MSP) con el apoyo de la Embajada de Estados Unidos y la Policía Nacional de Colombia.

---

## 1. Contexto Institucional

**Sembremos Seguridad** es una estrategia cuyo objetivo primordial es **prevenir la criminalidad y mejorar la percepción de seguridad** mediante la recuperación de espacios públicos y la coordinación interinstitucional.

### Metodología (5 Etapas)
La estrategia se despliega en cinco fases sucesivas:

| Etapa | Descripción |
| :--- | :--- |
| **1. Planeación** | Definición de alcance cantonal, asignación de responsables y presupuestos. |
| **2. Recolección** | Encuestas a la comunidad, al sector comercio y a la Fuerza Pública; integración de estadísticas criminales del OIJ y MSP. |
| **3. Tratamiento** | Aplicación de la **Matriz de Impactos Cruzados (MIC-MAC)** y el **Triángulo de la Violencia** para clasificar y priorizar factores de riesgo. |
| **4. Análisis** | Generación de diagnósticos diferenciados por distrito y cantón (ej. Puntarenas Central vs. Monteverde). |
| **5. Líneas de Acción** | Conversión de hallazgos en tareas estratégicas ejecutables con indicadores, metas y plazos. |

### Diagnóstico Puntarenas
- **Cantón Central:** 23 factores prioritarios identificados. Sobresalen la **venta y consumo de drogas, el desempleo, los robos a personas y la violencia intrafamiliar**.
- **Monteverde:** 14 factores prioritarios. Destacan el **consumo de drogas, la falta de presencia policial y la falta de inversión social**.

### Actores Clave
- **MSP / Fuerza Pública:** Administración Global del programa y operatividad policial.
- **IMAS:** Liderazgo de la prevención social a través del **Comité Intersectorial Regional Social (CIR Social)**.
- **Instituciones Corresponsables:** PANI, CCSS, MEP, IAFA, Ministerio de Salud, Bomberos, Cruz Roja, Municipalidades, INL.

---

## 2. La Plataforma Web (Intranet)

Se ha desarrollado una **plataforma web de alto rendimiento** que actúa como puente entre la identificación de problemáticas locales y la ejecución coordinada de tareas por parte de las instituciones. Su enfoque se centra en cinco pilares:

### Pilar 1: Articulación Interinstitucional
- **Acceso basado en roles (RBAC):** Cada institución tiene su propia "llave" de entrada para visualizar solo lo que le compete, permitiendo colaboración sin fricción.
- **Gestión del CIR Social:** Facilita la articulación de acciones sobre poblaciones vulnerables, consumo de drogas y deporte.

### Pilar 2: Gestión Estratégica y Seguimiento de Metas
- **Matriz de Seguimiento Estratégico:** Corazón del sistema. Desglosa la estrategia desde la **Línea Estratégica** → **Línea de Acción** → **Tarea Estratégica**.
- **Asignación de responsabilidades:** Cada tarea tiene "nombre y apellido", un presupuesto asignado y una fecha de entrega.
- **Filtros dinámicos:** Avance filtrable por cantón, distrito (Barranca, Chacarita, El Roble), trimestre y estado.

### Pilar 3: Recolección de Evidencia y Control en Tiempo Real
- **Reporte de oficiales en campo:** Los funcionarios suben fotografías y documentos como prueba de cumplimiento (parques recuperados, censos de calle, actas).
- **Indicadores de impacto:** Registro de **personas beneficiadas** e **inversión ejecutada (₡)** por cada actividad.
- **Revisión y aprobación:** Los administradores institucionales revisan, aprueban o rechazan evidencias con observaciones.

### Pilar 4: Análisis Territorial y Visualización de Riesgos
- **Zonas Críticas (Semáforo de riesgo):** Tarjetas por distrito (Barranca, Chacarita, El Roble, Puntarenas Centro) con nivel de riesgo, incidentes, líneas activas y beneficiarios.
- **Distribución Policial:** Mapa SVG interactivo de Puntarenas con visualización de oficiales y patrullas por sector, niveles de cobertura (Óptimo, Adecuado, Regular, Insuficiente) y análisis comparativo.
- **Radar de Riesgo:** Gráfico radar con dimensiones de Prevención, Entorno, Monitoreo, Operatividad y Ciudadanía.

### Pilar 5: Eficiencia Administrativa y Reporting
- **Informes en un clic:** Exportación de matrices de cumplimiento a **PDF** (jsPDF) y **Excel** (SheetJS/XLSX).
- **Auditoría y seguridad:** Registro de logs de todas las acciones críticas (aprobaciones, cambios de contraseña, eliminaciones) en `logs_seguridad`.
- **Protocolo de seguridad de contraseñas:** Ventana de aprobación de 15 minutos controlada por el administrador institucional para cambios de clave.
- **UX Premium:** Skeleton Loading, transiciones con Framer Motion y micro-interacciones para feedback inmediato.

---

## 3. Arquitectura de Roles

El sistema implementa 4 niveles de acceso, cada uno con su propio dashboard y permisos:

```
┌─────────────────────────────────────────────────────────────────┐
│  SUPER_ADMIN (admin)          → Fuerza Pública / MSP           │
│  ├── Dashboard Global Estratégico                              │
│  ├── Matriz de Seguimiento Completa                            │
│  ├── Gestión de Usuarios (CRUD de instituciones)               │
│  ├── Zonas Críticas + Distribución Policial                    │
│  ├── Estadísticas Globales (ECharts)                           │
│  └── Exportación PDF/Excel + Auditoría                         │
├─────────────────────────────────────────────────────────────────┤
│  ADMIN_INSTITUCION (adminInstitucion)  → Director Institucional│
│  ├── Dashboard Institucional (solo su entidad)                 │
│  ├── Gestión de Tareas (asignación de responsables)            │
│  ├── Revisión de Reportes / Evidencias                         │
│  ├── Informes Trimestrales                                     │
│  ├── Gestión de Funcionarios                                   │
│  └── Calendario + Estadísticas Institucionales                 │
├─────────────────────────────────────────────────────────────────┤
│  SUB_ADMIN (municipalidad)    → Municipalidad                  │
│  └── Acceso preventivo (sin acceso a datos de delitos)         │
├─────────────────────────────────────────────────────────────────┤
│  EDITOR (institucion)         → Funcionario / Oficial en Campo │
│  ├── Visualización de líneas de acción asignadas               │
│  ├── Carga de Evidencia (drag-and-drop)                        │
│  ├── Registro de KPIs (personas impactadas, inversión)         │
│  └── Envío de reportes de cumplimiento                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Stack Tecnológico

| Capa | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Frontend** | React 18 + Vite | Compilación ultrarrápida y HMR |
| **Routing** | React Router DOM | Rutas protegidas por rol (PrivateRoutes) |
| **Estado Global** | Context API | `LoginContext` (auth) + `ToastContext` (notificaciones) |
| **Animaciones** | Framer Motion | Transiciones de página, layout animations, hover effects |
| **Visualización** | ECharts (echarts-for-react) | Gráficos radar, barras, líneas de tendencia |
| **Iconografía** | Lucide React | Sistema de íconos consistente |
| **Alertas** | SweetAlert2 | Confirmaciones y alertas de seguridad |
| **Reportes** | jsPDF + jspdf-autotable + SheetJS | Generación de PDFs y hojas de cálculo |
| **Estilos** | Vanilla CSS | Variables personalizadas, glassmorphism en badges |
| **Backend** | JSON Server | API REST simulada sobre `db.json` (puerto 5000) |

---

## 5. Estructura del Proyecto

```
sembremos-seguridad/
├── public/                          # Archivos estáticos
├── src/
│   ├── assets/                      # Imágenes (hero, logos)
│   ├── components/
│   │   ├── Login/                   # Autenticación + Soporte de Acceso
│   │   ├── Dashboard/               # ── Panel del Administrador Global ──
│   │   │   ├── DashboardGlobal/     # Resumen ejecutivo con KPIs
│   │   │   ├── LineasAccion/        # Matriz de Seguimiento + Reportes
│   │   │   ├── MatrizSeguimiento/   # Tabla estratégica expandible
│   │   │   ├── ZonasCriticas/       # Semáforo territorial por distrito
│   │   │   ├── MapaDistribucion/    # Mapa SVG policial interactivo
│   │   │   ├── Estadisticas/        # Gráficos globales (ECharts)
│   │   │   ├── GestionUsuarios/     # CRUD de instituciones y admins
│   │   │   ├── ActividadOficiales/  # Seguimiento de oficiales
│   │   │   ├── NotificacionesAdmin/ # Centro de alertas del admin
│   │   │   ├── SoporteInstitucional/# Canal de comunicación
│   │   │   ├── DashboardAvances/    # Indicadores de progreso
│   │   │   ├── SidebarAdmin/        # Navegación lateral (badges glass)
│   │   │   └── PerfilUsuario/       # Configuración de cuenta
│   │   │
│   │   ├── AdminInstitucion/        # ── Panel del Admin Institucional ──
│   │   │   ├── Vistas/
│   │   │   │   ├── DashboardAdminInst.jsx
│   │   │   │   ├── GestionTareas.jsx        # Asignación de responsables
│   │   │   │   ├── GestionFuncionarios.jsx  # CRUD de oficiales
│   │   │   │   ├── RevisionReportes.jsx     # Aprobación de evidencias
│   │   │   │   ├── RevisionInformesTrimestral.jsx
│   │   │   │   ├── HistorialReportes.jsx
│   │   │   │   ├── EstadisticasInstitucion.jsx
│   │   │   │   └── CalendarioAdminInst.jsx
│   │   │   └── Navegacion/                 # Sidebar institucional
│   │   │
│   │   ├── DashboardInstitucion/    # ── Panel del Funcionario ──
│   │   │   ├── CardLineaAccion.jsx          # Tarjetas con Framer Motion
│   │   │   ├── CargaEvidencia.jsx           # Drag-and-drop de archivos
│   │   │   ├── ModuloDelegacion.jsx         # Asignación de tareas
│   │   │   └── SistemaDeReporte/            # Envío de reportes
│   │   │
│   │   ├── DasboardMuni/            # ── Panel Municipal ──
│   │   │   └── AccesoRestringido/
│   │   │
│   │   └── Shared/                  # Componentes reutilizables
│   │       ├── SkeletonLoader.jsx/css       # Carga anatómica animada
│   │       ├── PageTransition.jsx           # Framer Motion wrapper
│   │       └── Navegacion/                  # Branding + UserBrand
│   │
│   ├── constants/
│   │   └── roles.js                 # SUPER_ADMIN, ADMIN_INSTITUCION, SUB_ADMIN, EDITOR
│   ├── context/
│   │   ├── LoginContext.jsx         # Autenticación y sesión
│   │   └── ToastContext.jsx         # Sistema de notificaciones
│   ├── routing/
│   │   ├── Routing.jsx              # Definición de rutas
│   │   └── PrivateRoutes.jsx        # Guard por rol
│   ├── services/
│   │   ├── dashboardService.js      # Datos del dashboard global
│   │   ├── adminInstitucionService.js # Operaciones institucionales
│   │   ├── editoresService.js       # Operaciones de funcionarios
│   │   ├── userService.js           # CRUD de usuarios
│   │   ├── securityService.js       # Protocolo de cambio de clave
│   │   ├── informesService.js       # Informes trimestrales
│   │   └── muniService.js           # Servicio municipal
│   ├── utils/
│   │   └── exportUtils.js           # Exportación CSV/Excel
│   ├── App.jsx
│   └── main.jsx
├── db.json                          # Base de datos simulada (JSON Server)
├── vite.config.js
├── package.json
└── README.md
```

---

## 6. Módulos Implementados vs. Requerimientos

| Requerimiento del Programa | Estado | Módulo en Código |
| :--- | :---: | :--- |
| Acceso basado en roles (RBAC) | ✅ | `PrivateRoutes.jsx` + `roles.js` |
| Matriz de Seguimiento Estratégico | ✅ | `MatrizSeguimiento.jsx` |
| Jerarquía Línea Estratégica → Línea de Acción → Tarea | ✅ | `DashboardGlobal.jsx` + `MatrizSeguimiento.jsx` |
| Asignación de responsabilidades y presupuestos | ✅ | `GestionTareas.jsx` + `ModuloDelegacion.jsx` |
| Filtros dinámicos (cantón, trimestre, estado) | ✅ | `GestionTareas.jsx` + `MatrizSeguimiento.jsx` |
| Reporte de oficiales con evidencia fotográfica | ✅ | `CargaEvidencia.jsx` (drag-and-drop) |
| Indicadores de impacto (personas, inversión ₡) | ✅ | `CargaEvidencia.jsx` (KPIs) |
| Revisión y aprobación de evidencias | ✅ | `RevisionReportes.jsx` |
| Zonas Críticas (semáforo territorial) | ✅ | `ZonasCriticas.jsx` |
| Distribución policial (mapa interactivo) | ✅ | `MapaDistribucion.jsx` (SVG interactivo) |
| Exportación PDF/Excel en un clic | ✅ | `MatrizSeguimiento.jsx` + `DashboardGlobal.jsx` |
| Auditoría y logs de seguridad | ✅ | `securityService.js` → `logs_seguridad` |
| Protocolo de cambio de clave con ventana de 15 min | ✅ | `securityService.js` |
| Skeleton Loading premium | ✅ | `SkeletonLoader.jsx` |
| Transiciones y micro-interacciones | ✅ | `PageTransition.jsx` + `CardLineaAccion.jsx` |
| Informes trimestrales | ✅ | `RevisionInformesTrimestral.jsx` |
| Estadísticas con gráficos (ECharts) | ✅ | `EstadisticasGlobal.jsx` + `EstadisticasInstitucion.jsx` |
| Centro de Comunicación / Soporte | ✅ | `SoporteInstitucional/` + `DashboardGlobal.jsx` |
| Calendario institucional | ✅ | `CalendarioAdminInst.jsx` |

---

## 7. Guía de Inicio Rápido

### Requisitos Previos
- **Node.js** v16 o superior
- **Git**

### Instalación

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd sembremos-seguridad

# 2. Instalar dependencias
npm install
```

### Ejecución (requiere 2 terminales simultáneas)

**Terminal 1 — Servidor de Datos (API Mock en puerto 5000)**
```bash
npx json-server --watch db.json --port 5000
```

**Terminal 2 — Aplicación React (puerto 5173)**
```bash
npm run dev
```

### URLs de Acceso
| Servicio | URL |
| :--- | :--- |
| Frontend | `http://localhost:5173` |
| API REST | `http://localhost:5000` |

### Scripts Disponibles
```bash
npm run dev       # Servidor de desarrollo con HMR
npm run build     # Compilación para producción
npm run lint      # Análisis estático de código
npm run preview   # Previsualización del build de producción
```

---

## 8. Convenciones del Sistema

### Nomenclatura Jerárquica
```
Línea Estratégica    → Problemática macro (ej. "Venta y consumo de drogas")
  └── Línea de Acción → Plan de intervención (ej. "Programa de prevención en escuelas")
       └── Tarea Estratégica → Actividad específica con indicador y responsable
```

### Paleta de Colores Institucional
| Color | Hex | Uso |
| :--- | :--- | :--- |
| Azul Marino | `#0b2240` | Fondo principal, headers, autoridad |
| Azul Acero | `#002f6c` | Sidebars, elementos de navegación |
| Verde Institucional | `#008d45` | Acentos de éxito, progreso completado |
| Ámbar | `#f59e0b` | Estados de advertencia, "en proceso" |
| Rojo Urgencia | `#ef4444` | Alertas, tareas vencidas |

### Badges del Sidebar
Los indicadores numéricos en las barras laterales utilizan un estilo **Glassmorphism** (fondo translúcido `rgba(255,255,255,0.12)` con `backdrop-filter: blur`) para informar sin causar fatiga visual.

---

## 9. Notas Técnicas

- El backend está **simulado con JSON Server**. Los cambios en los datos se persisten automáticamente en el archivo `db.json`.
- Para cambiar la URL base de la API, modifique los archivos en `src/services/`.
- El protocolo de seguridad de contraseñas utiliza una **ventana temporal de 15 minutos** aprobada por el administrador institucional, registrando todos los eventos en `logs_seguridad`.
- Los datos de distribución policial (mapa SVG) se cargan desde el endpoint `/distribucionPolicial` del JSON Server.

---

## 10. Licencia

Software de uso institucional desarrollado para el Ministerio de Seguridad Pública de Costa Rica.
Todos los derechos reservados. Uso exclusivo con autorización institucional.
