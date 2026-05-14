/**
 * Rutas Legacy (Compatibilidad con json-server)
 * 
 * Este módulo sirve los datos de db.json a través de rutas REST estándar,
 * permitiendo que el frontend existente funcione sin modificaciones
 * mientras se completa la migración gradual a la API v1.
 * 
 * NOTA: Estas rutas son temporales y serán reemplazadas progresivamente
 * por los controladores reales conectados a MySQL.
 */
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Cargamos el db.json al iniciar (una sola vez para rendimiento)
const DB_PATH = path.join(__dirname, '../../../../db.json');
let dbData = {};

function loadDB() {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    dbData = JSON.parse(raw);
  } catch (err) {
    console.error('⚠️  No se pudo cargar db.json para rutas legacy:', err.message);
    dbData = {};
  }
}

// Cargar al arranque
loadDB();

/**
 * Helper: Genera un router GET para una colección del db.json
 */
function serveCollection(collectionName) {
  return (req, res) => {
    const data = dbData[collectionName];
    
    // Si no existe, devolvemos un array vacío para no romper el frontend
    if (data === undefined) {
      return res.json([]);
    }

    // Si no es un array (caso de presupuestoAsignado), lo devolvemos tal cual
    if (!Array.isArray(data)) {
      return res.json(data);
    }

    // Soporte básico para filtros por query string (como json-server)
    let result = [...data];
    const queryKeys = Object.keys(req.query).filter(k => !k.startsWith('_'));
    
    for (const key of queryKeys) {
      result = result.filter(item => String(item[key]) === String(req.query[key]));
    }

    // Soporte para _sort y _order
    if (req.query._sort) {
      const sortField = req.query._sort;
      const order = req.query._order === 'desc' ? -1 : 1;
      result.sort((a, b) => {
        if (a[sortField] < b[sortField]) return -1 * order;
        if (a[sortField] > b[sortField]) return 1 * order;
        return 0;
      });
    }

    return res.json(result);
  };
}

/**
 * Helper: GET por ID
 */
function serveById(collectionName) {
  return (req, res) => {
    const data = dbData[collectionName];
    if (!data) {
      return res.status(404).json({ error: `Colección '${collectionName}' no encontrada` });
    }
    const item = data.find(d => String(d.id) === String(req.params.id));
    if (!item) {
      return res.status(404).json({ error: 'Registro no encontrado' });
    }
    return res.json(item);
  };
}

/**
 * Helper: POST (crear registro en memoria y persistir)
 */
function createInCollection(collectionName) {
  return (req, res) => {
    if (!dbData[collectionName]) {
      dbData[collectionName] = [];
    }
    const newItem = {
      id: String(Date.now()).slice(-4),
      ...req.body
    };
    dbData[collectionName].push(newItem);
    persistDB();
    return res.status(201).json(newItem);
  };
}

/**
 * Helper: PATCH (actualizar parcialmente)
 */
function updateInCollection(collectionName) {
  return (req, res) => {
    const data = dbData[collectionName];
    if (!data) return res.status(404).json({ error: 'Colección no encontrada' });

    const index = data.findIndex(d => String(d.id) === String(req.params.id));
    if (index === -1) return res.status(404).json({ error: 'Registro no encontrado' });

    dbData[collectionName][index] = { ...data[index], ...req.body };
    persistDB();
    return res.json(dbData[collectionName][index]);
  };
}

/**
 * Helper: DELETE
 */
function deleteFromCollection(collectionName) {
  return (req, res) => {
    const data = dbData[collectionName];
    if (!data) return res.status(404).json({ error: 'Colección no encontrada' });

    dbData[collectionName] = data.filter(d => String(d.id) !== String(req.params.id));
    persistDB();
    return res.json({});
  };
}

/**
 * Persiste los cambios al archivo db.json
 */
function persistDB() {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(dbData, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error persistiendo db.json:', err.message);
  }
}

// ═══════════════════════════════════════════════════════
// Definición de todas las rutas legacy
// ═══════════════════════════════════════════════════════

const collections = [
  'usuarios',
  'tareas',
  'lineasAccion',
  'zonas',
  'alertas',
  'notificaciones',
  'reportes',
  'distribucionPolicial',
  'comentariosSoporte',
  'eventos',
  'presupuestoAsignado',
  'logs_seguridad',
  'notificaciones_admin'
];

// Registrar rutas CRUD para cada colección
collections.forEach(name => {
  // Evitamos registrar presupuestoAsignado aquí si queremos un manejo especial, 
  // pero con la mejora en serveCollection ya no es necesario el caso especial al final.
  router.get(`/${name}`, serveCollection(name));
  router.get(`/${name}/:id`, serveById(name));
  router.post(`/${name}`, createInCollection(name));
  router.patch(`/${name}/:id`, updateInCollection(name));
  router.put(`/${name}/:id`, updateInCollection(name));
  router.delete(`/${name}/:id`, deleteFromCollection(name));
});

module.exports = router;
