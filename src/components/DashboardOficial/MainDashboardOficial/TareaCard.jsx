import React, { useState } from 'react';
import './MainDashboard.css';
import EstadoBadge from "./EstadoBadge";
import { oficialService } from '../../../services/oficialService';
import { useToast } from '../../../context/ToastContext';
import { RefreshCw, ClipboardEdit, ChevronUp, ChevronDown } from 'lucide-react';
import FormOficial from './FormOficial';

const TareaCard = ({ tarea, isLast, onUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showForm, setShowForm] = useState(false);
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
      <article className="TareaCardTimeline">
        {/* Header Institucional (Verde como en el PDF) */}
        <div className="TareaCardHeaderInstitucional">
          <span>Línea de Acción: {tarea?.lineaAccion || tarea?.codigo || 'S/L'}</span>
          <EstadoBadge status={tarea?.estado || 'PENDIENTE'} />
        </div>

        {/* Columna Principal - Descripción y Acciones */}
        <div className="TareaCardColPrincipal">
          <div className="CeldaHeader">Descripción de la Línea de Trabajo</div>
          <div className="CeldaTabla">
            <h4 className="TareaNameLabel">{tarea?.problematica || tarea?.titulo || 'Sin título'}</h4>
            <p className="TareaDescripcionText">
              {tarea?.propuestaMeta || tarea?.descripcion || 'No hay descripción disponible para esta línea de acción.'}
            </p>
          </div>

          <div className="CeldaHeader">Acciones Estratégicas / Bitácora</div>
          <div className="CeldaTabla">
            <ul className="AccionesEstrategicasList">
              {tarea?.descripcion ? (
                <li>{tarea.descripcion}</li>
              ) : (
                <li>Pendiente de asignación de acciones detalladas.</li>
              )}
              {tarea?.zona && <li>Zona de operación: {tarea.zona}</li>}
            </ul>
          </div>
        </div>

        {/* Columna Lateral - Coordinador y Detalles */}
        <div className="TareaCardColLateral">
          <div className="CeldaHeader">Coordinador</div>
          <div className="CeldaTabla">
            <strong className="CoordinadorLabel">Fuerza Pública</strong>
            <p className="CoordinadorValue">{tarea?.responsables || 'Sembremos Seguridad'}</p>
          </div>

          <div className="CeldaHeader">Estado</div>
          <div className="CeldaTabla" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px' }}>
            <button 
                className="BtnUpdateStatus" 
                onClick={handleNextStatus}
                disabled={isUpdating}
                style={{ width: '100%', justifyContent: 'center' }}
            >
              <RefreshCw size={14} className={isUpdating ? 'spin' : ''} />
              {isUpdating ? 'Avanzar' : 'Siguiente'}
            </button>

            <button 
                className={`BtnToggleForm ${showForm ? 'active' : ''}`}
                onClick={() => setShowForm(!showForm)}
                style={{ width: '100%', justifyContent: 'center' }}
            >
              <ClipboardEdit size={14} />
              {showForm ? 'Cerrar' : 'Reportar'}
            </button>
          </div>
        </div>

        {showForm && (
          <div className="TareaCardFormExpander" style={{ gridColumn: '1 / -1', padding: '1.5rem', borderTop: '1px solid #000' }}>
            <FormOficial 
              actividad={tarea} 
              onSuccess={() => {
                setShowForm(false);
                if (onUpdate) onUpdate();
              }} 
            />
          </div>
        )}
      </article>
    </div>
  );
};

export default TareaCard;
