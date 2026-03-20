import './Historial.css';
import TimelineItem from "./TimelineItem";
import FiltroHistorial from "./FiltroHistorial";

const HistorialContainer = ({ registros = [] }) => {
  return (
    <section className="HistorialContainer">
      <h3>Historial de Actualizaciones</h3>
      <FiltroHistorial alFiltrar={(valor) => console.log('Filtrar:', valor)} />
      <div className="TimelineList">
        {registros.length > 0 ? (
          registros.map((reg, index) => (
            <TimelineItem
              key={index}
              fecha={reg.fecha}
              oficial={reg.oficial}
              zona={reg.zona}
              lineaAccion={reg.lineaAccion}
              comentario={reg.comentario}
            />
          ))
        ) : (
          <p className="HistorialVacio">No hay registros en el historial.</p>
        )}
      </div>
    </section>
  );
};

export default HistorialContainer;
