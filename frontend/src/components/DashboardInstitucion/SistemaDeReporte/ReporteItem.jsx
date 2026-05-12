import './SistemaDeReporte.css';

export const ReporteItem = ({ titulo, descripcion, children }) => {
  return (
    <div className="ReporteItem">
      <div className="ReporteItemInfo">
        <span>{titulo}</span>
        <p>{descripcion}</p>
      </div>
      <div className="ReporteItemActions">
        {children}
      </div>
    </div>
  );
};

export default ReporteItem;
