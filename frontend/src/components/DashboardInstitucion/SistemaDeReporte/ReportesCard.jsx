import './SistemaDeReporte.css';

export const ReportesCard = ({ children }) => {
  return (
    <div className="ReportesCard">
      <div className="ReportesCardHeader">
        <h3>Reportes Estratégicos INL/MSP</h3>
        <p>Generación de datos oficiales para el cantón central de Puntarenas</p>
      </div>
      <div className="ReportesCardBody">
        {children}
      </div>
    </div>
  );
};

export default ReportesCard;
