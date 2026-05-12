const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configuración para la Base de Datos de Fuerza Pública (MSP)
const sequelizeFP = new Sequelize(
  process.env.DB_MSP_NAME,
  process.env.DB_MSP_USER,
  process.env.DB_MSP_PASSWORD,
  {
    host: process.env.DB_MSP_HOST,
    port: process.env.DB_MSP_PORT,
    dialect: 'mysql',
    logging: false,
    define: {
      timestamps: true,
      underscored: true
    }
  }
);

// Configuración para la Base de Datos de la Municipalidad (MUNI_DB)
const sequelizeMUNI = new Sequelize(
  process.env.DB_MUNI_NAME,
  process.env.DB_MUNI_USER,
  process.env.DB_MUNI_PASSWORD,
  {
    host: process.env.DB_MUNI_HOST,
    port: process.env.DB_MUNI_PORT,
    dialect: 'mysql',
    logging: false,
    define: {
      timestamps: true,
      underscored: true
    }
  }
);

/**
 * Función para probar las conexiones
 */
const testConnections = async () => {
  try {
    await sequelizeFP.authenticate();
    console.log(' Conexión exitosa a FP_DB (Fuerza Pública)');
    
    await sequelizeMUNI.authenticate();
    console.log(' Conexión exitosa a MUNI_DB (Municipalidad)');
  } catch (error) {
    console.error(' Error de conexión a las bases de datos:', error);
  }
};

module.exports = {
  sequelizeFP,
  sequelizeMUNI,
  testConnections
};
