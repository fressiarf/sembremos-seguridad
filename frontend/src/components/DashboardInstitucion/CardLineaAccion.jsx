import React, { useState } from 'react';
import { AlertCircle, ChevronDown, ChevronUp, Clock, FileText, CheckCircle, Activity, MapPin, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CardLineaAccion = ({ linea, children }) => {
  const [expanded, setExpanded] = useState(false);

  // Semáforo de prioridad / urgencia (simulado)
  const getTrafficLight = (progreso) => {
    if (progreso === 100) return { color: 'bg-green-500', label: 'Completada', icon: <CheckCircle size={14}/> };
    if (progreso > 40) return { color: 'bg-yellow-400', label: 'En proceso', icon: <Activity size={14}/> };
    return { color: 'bg-red-500', label: 'Retrasada / Urgente', icon: <AlertCircle size={14}/> };
  };

  const status = getTrafficLight(linea.progreso);

  return (
    <motion.div 
      layout
      className="card-inst"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.12)' }}
      transition={{ duration: 0.3 }}
    >
      {/* Header Visible siempre */}
      <div className="card-inst-header">
        <div className="card-inst-title-area">
          <div className="card-inst-badges">
            <span className={`badge-traffic-light ${status.color}`}>
              {status.icon}
              {status.label}
            </span>
            <span className="badge-id">ID: {linea.id}</span>
          </div>
          <h2 className="card-inst-title">{linea.titulo}</h2>
          <div className="card-inst-metadata-row">
            <span className="metadata-item">
              <MapPin size={12} /> {linea.canton || 'Lugar no especificado'}
            </span>
            <span className="metadata-item">
              <Users size={12} /> {linea.totalTareas || 0} tareas locales
            </span>
          </div>
          <p className="card-inst-subtitle">Línea de Acción: {linea.problematica}</p>
        </div>

        <div className="card-inst-progress-area">
          <div className="progress-info">
            <span className="progress-value">{linea.progreso}%</span>
            <span className="progress-label">Avance General</span>
          </div>
          <div className="progress-bar-bg">
            <div className={`progress-bar-fill ${status.color}`} style={{ width: `${linea.progreso}%` }}></div>
          </div>
        </div>

        <div className="card-inst-actions">
          <button 
            className="btn-expand" 
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      {/* Contenido Expandido: Módulo Delegación y Carga de Evidencia */}
      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card-inst-body"
          >
            <div className="card-inst-body-grid">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CardLineaAccion;
