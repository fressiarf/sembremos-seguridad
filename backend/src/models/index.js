'use strict';

const fs = require('fs');
const path = require('path');
const db = {};

// Carga recursiva de modelos en subcarpetas (MSP, Muni)
const loadModels = (dir) => {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      loadModels(fullPath);
    } else if (file !== 'index.js' && file.endsWith('.js')) {
      const model = require(fullPath);
      if (model && model.name) {
        db[model.name] = model;
      }
    }
  });
};

loadModels(__dirname);

// Ejecutar asociaciones
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
