import React, { useState } from 'react';
import { AlertCircle, ChevronDown, ChevronUp, Clock, FileText, CheckCircle, Activity } from 'lucide-react';

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
    <div className="card-inst">
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
          <h2 className="card-inst-title">{linea.lineaAccion}</h2>
          <p className="card-inst-subtitle">Problemática: {linea.problematica}</p>
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
      {expanded && (
        <div className="card-inst-body">
          <div className="card-inst-body-grid">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default CardLineaAccion;
