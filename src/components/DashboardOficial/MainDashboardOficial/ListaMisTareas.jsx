import './MainDashboard.css';
import TareaCard from "./TareaCard";
import { ChevronDown } from 'lucide-react';

const ListaMisTareas = ({ tareas = [], onUpdate }) => {
  return (
    <section className="ListaMisTareas">
      <div className="ListaMisTareasHeader">
        <h3>Mis tareas actuales</h3>
        <button className="FiltroBtn">
          Filtrar <ChevronDown size={14} />
        </button>
      </div>
      
      <div className="TimelineContenedor">
        {tareas.length > 0 ? (
          tareas.map((tarea, index) => (
            <TareaCard 
              key={index} 
              tarea={tarea} 
              isLast={index === tareas.length - 1} 
              onUpdate={onUpdate}
            />
          ))
        ) : (
          <p className="TimelineVacio">No tienes tareas asignadas actualmente.</p>
        )}
      </div>
    </section>
  );
};

export default ListaMisTareas;
