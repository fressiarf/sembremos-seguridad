import './Historial.css';

export const TimelineItem = ({ fecha, oficial, zona, lineaAccion, comentario, children }) => {
  return (
    <div className="TimelineItem">
      <div className="TimelineMeta">
        <span className="TimelineFecha">{fecha}</span>
        <span className="TimelineOficial">{oficial}</span>
      </div>
      <div className="TimelineContenido">
        <h4>{lineaAccion}</h4>
        <h5>Zona: {zona}</h5>
        <p>{comentario}</p>
        {children && <div className="TimelineChildren">{children}</div>}
      </div>
    </div>
  );
};

export default TimelineItem;
