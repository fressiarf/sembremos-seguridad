import './MainDashboard.css';

const InfoLineaHeader = ({ codigo, titulo, zona, fechaLimite }) => {
  return (
    <div className="InfoLineaHeader">
      <span className="InfoLineaCodigo">{codigo}</span>
      <h4>{titulo}</h4>
      <small>{zona}</small>
      {fechaLimite && <small> • Límite: {fechaLimite}</small>}
    </div>
  );
};

export default InfoLineaHeader;