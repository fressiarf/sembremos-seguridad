require('dotenv').config();
const app = require('./app'); // Corregido: está en la raíz
const { sequelizeFP, sequelizeMUNI } = require('./src/config/database');

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
    });
  } catch (error) {
    console.error(' Error fatal al iniciar el servidor:', error.message);
    process.exit(1);
  }
};

startServer();