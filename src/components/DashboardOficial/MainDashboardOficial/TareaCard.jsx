import React, { useState } from 'react';
import './MainDashboard.css';
import EstadoBadge from "./EstadoBadge";
import { oficialService } from '../../../services/oficialService';
import { useToast } from '../../../context/ToastContext';
import { RefreshCw } from 'lucide-react';

const TareaCard = ({ tarea, isLast, onUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { showToast } = useToast();

  const getStatusColorClass = (estado) => {
    const s = estado?.toLowerCase() || '';
    if (s.includes('proceso') || s.includes('ejec')) return 'dot-blue';
    if (s.includes('completado') || s.includes('listo')) return 'dot-green';
    if (s.includes('retrasada') || s.includes('alerta')) return 'dot-orange';
    return 'dot-yellow';
  };

  const handleNextStatus = async () => {
    const statuses = ['Pendiente', 'En ejecución', 'Completada'];
    const currentIndex = statuses.indexOf(tarea?.estado || 'Pendiente');
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    
    setIsUpdating(true);
    try {
      await oficialService.updateActividad(tarea.id, { 
        status: nextStatus,
        ...(nextStatus === 'Completada' ? { porcentaje: 100 } : {})
      });
      showToast(`Tarea actualizada a ${nextStatus}`, 'success');
      if (onUpdate) onUpdate();
    } catch (error) {
      showToast('Error al actualizar la tarea', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const dotClass = getStatusColorClass(tarea?.estado);

  return (
    <div className="TimelineItem">
      <div className={`TimelineDot ${dotClass}`}></div>
      
      <div className="TimelineContent">
        <div className="TimelineMeta">
          <span className="TimelineTime">{tarea?.fecha || 'Hoy'}</span>
          <span className="TimelineSeparator">·</span>
          <span className="TimelineUser">Responsable Asignado</span>
          <span className="TimelineSeparator">·</span>
          <span className="TimelineZone">{tarea?.zona || 'Cantón'}</span>
        </div>
        
        <article className="TareaCardTimeline">
          <div className="TareaCardHeaderTimeline">
             <div className="TareaCardTitle">
                <span className="TareaCode">{tarea?.lineaAccion || tarea?.codigo || 'S/L'}</span>
                <span className="TareaTitleSep">·</span>
                <span className="TareaName">{tarea?.problematica || tarea?.titulo || 'Sin título'}</span>
             </div>
             <EstadoBadge status={tarea?.estado || 'PENDIENTE'} />
          </div>
          <div className="TareaCardBodyTimeline">
             <div className="TareaDetailsGrid">
                {tarea?.propuestaMeta && (
                  <div className="TareaDetailItem">
                    <strong>Propuesta / Meta:</strong>
                    <p>{tarea.propuestaMeta}</p>
                  </div>
                )}
                {tarea?.responsables && (
                  <div className="TareaDetailItem">
                    <strong>Corresponsables:</strong>
                    <p>{tarea.responsables}</p>
                  </div>
                )}
                {tarea?.descripcion && (
                  <div className="TareaDetailItem">
                    <strong>Instrucciones:</strong>
                    <p>{tarea.descripcion}</p>
                  </div>
                )}
             </div>
             
             <div className="TareaCardFooter">
                <button 
                    className="BtnUpdateStatus" 
                    onClick={handleNextStatus}
                    disabled={isUpdating}
                >
                  <RefreshCw size={14} className={isUpdating ? 'spin' : ''} />
                  {isUpdating ? 'Actualizando...' : 'Avanzar Estado'}
                </button>
             </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default TareaCard;
