# Sembremos Seguridad

## Descripción
Sembremos Seguridad es una plataforma web desarrollada con React y Vite destinada a la gestión y monitoreo de la seguridad institucional. El sistema permite visualizar indicadores estratégicos, gestionar líneas de acción, realizar seguimiento de tareas y monitorear zonas de riesgo en tiempo real. 

El proyecto integra una arquitectura modular que facilita la escalabilidad y utiliza una API simulada mediante JSON Server para el manejo de datos durante el desarrollo y pruebas de concepto.

Funcionalidades principales:
- Sistema de autenticación con rutas protegidas para administradores y oficiales.
- Tablero de control (Dashboard) global con indicadores institucionales y visualización de datos mediante gráficos.
- Gestión de líneas de acción y seguimiento de cumplimiento de metas.
- Registro de tareas y reportes de campo realizados por oficiales.
- Monitoreo de zonas críticas y niveles de riesgo por localidad.
- Notificaciones y alertas en tiempo real sobre el avance de las metas.

---

## Tecnologías utilizadas
- React 19
- Vite
- React Router DOM
- ECharts / echarts-for-react (Visualización de datos)
- Lucide React (Iconografía)
- Context API (Gestión de estado global para autenticación y notificaciones)
- JSON Server (API de pruebas)
- ESLint (Calidad de código)

---

## Estructura del proyecto
sembremos-seguridad/
├── public/               # Archivos estáticos
├── src/
│   ├── assets/           # Imágenes y recursos globales
│   ├── components/       # Componentes organizados por módulos (Login, Dashboard, etc.)
│   ├── constants/        # Constantes y configuraciones fijas del proyecto
│   ├── context/          # Proveedores de contexto para el estado global
│   ├── pages/            # Vistas principales de la aplicación
│   ├── routing/          # Configuración de rutas y protección de acceso
│   ├── services/         # Lógica de comunicación con la API
│   ├── utils/            # Funciones utilitarias (ej. exportación a CSV, formateos)
│   ├── App.jsx           # Componente raíz
│   └── main.jsx          # Punto de entrada de la aplicación
├── db.json               # Base de datos simulada para el backend
├── vite.config.js        # Configuración de Vite
├── package.json          # Dependencias y scripts
└── README.md             # Documentación del proyecto

---

## Instalación
Para instalar el proyecto localmente, siga estos pasos:

1. Instalar las dependencias:
bash
npm install

---

## Ejecución del proyecto
Este proyecto requiere la ejecución simultánea del frontend y el servidor de datos (API mock).

### 1. Iniciar el servidor de datos (JSON Server)
bash
npx json-server --watch db.json --port 5000

### 2. Iniciar el frontend
bash
npm run dev

- Acceso frontend: http://localhost:5173
- Acceso API: http://localhost:5000

---

## Scripts disponibles
bash
npm run dev       # Ejecuta la aplicación en modo desarrollo
npm run build     # Compila la aplicación para producción
npm run lint      # Analiza el código buscando posibles errores
npm run preview   # Previsualiza la versión de producción localmente

---

## Buenas prácticas implementadas
- Arquitectura de componentes desacoplada y reutilizable.
- Uso de rutas privadas para asegurar el acceso a áreas restringidas.
- Gestión de estado centralizada para autenticación y avisos informativos.
- Separación de la lógica de negocio de la interfaz de usuario.
- Implementación de estándares de codificación mediante ESLint.

---

## Contribución
Para colaborar en este proyecto:
1. Crear una rama para la nueva funcionalidad.
2. Realizar los cambios necesarios.
3. Asegurarse de que el código pasa las pruebas de linting.
4. Solicitar la revisión mediante un pull request.

---

## Licencia
Este proyecto se distribuye bajo una licencia de uso libre para fines educativos y de investigación institucional.

---

## Notas adicionales
- El backend está simulado, los cambios realizados en los datos se guardarán localmente en el archivo db.json.
- Para cambiar la configuración de la API, revise los archivos dentro del directorio src/services.
