const express = require('express');
const cors = require('cors');

// Inicializar la aplicación de Express
const app = express();

// --- Middlewares Globales ---

// 1. Configurar CORS para permitir peticiones desde el frontend
app.use(cors());

// 2. Middleware para parsear el body de las peticiones en formato JSON (express.json)
app.use(express.json());

// Middleware para parsear datos de formularios (opcional pero recomendado)
app.use(express.urlencoded({ extended: true }));

// Ruta de prueba inicial
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenido a la API del sistema.' });
});

// Exportar la app para usarla en server.js
module.exports = app;
