require('dotenv').config();
const app = require('./app');
const { sequelizeFP, sequelizeMUNI } = require('./config/database');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Probar conexión de Fuerza Pública
    await sequelizeFP.authenticate();
    console.log(' Conexión exitosa a MSP_DB (Fuerza Pública)');
    
    // Probar conexión de Municipalidad
    await sequelizeMUNI.authenticate();
    console.log(' Conexión exitosa a MUNI_DB (Municipalidad)');
    
    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(` Servidor corriendo en http://localhost:${PORT}`);
      console.log(' Usa la terminal para las migraciones.');

      // Worker de recordatorios — opt-in vía flag .env
      if (process.env.ENABLE_REMINDERS !== 'false') {
        const recordatoriosWorker = require('./jobs/recordatoriosWorker');
        recordatoriosWorker.start();
      } else {
        console.log(' Worker de recordatorios deshabilitado (ENABLE_REMINDERS=false)');
      }
    });
  } catch (error) {
    console.error(' Error fatal al iniciar el servidor:', error.message);
    process.exit(1);
  }
};

startServer();