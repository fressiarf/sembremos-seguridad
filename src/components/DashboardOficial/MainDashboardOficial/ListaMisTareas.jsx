import './MainDashboard.css';
import TareaCard from "./TareaCard";

const ListaMisTareas = ({ tareas = [] }) => {
  return (
    <section className="ListaMisTareas">
      <h3>Mis Tareas Actuales</h3>
      <div className="ListaTareasContenido">
        {tareas.length > 0 ? (
          tareas.map((tarea, index) => (
            <TareaCard key={index} tarea={tarea} />
          ))
        ) : (
          <p>No tienes tareas asignadas actualmente.</p>
        )}
      </div>
    </section>
  );
};

export default ListaMisTareas;
