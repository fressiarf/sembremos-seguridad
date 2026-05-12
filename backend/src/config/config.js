require('dotenv').config();

module.exports = {
  muni: {
    username: process.env.DB_MUNI_USER,
    password: process.env.DB_MUNI_PASSWORD,
    database: process.env.DB_MUNI_NAME,
    host: process.env.DB_MUNI_HOST,
    dialect: 'mysql'
  },
  msp: {
    username: process.env.DB_MSP_USER,
    password: process.env.DB_MSP_PASSWORD,
    database: process.env.DB_MSP_NAME,
    host: process.env.DB_MSP_HOST,
    dialect: 'mysql'
  }
};
