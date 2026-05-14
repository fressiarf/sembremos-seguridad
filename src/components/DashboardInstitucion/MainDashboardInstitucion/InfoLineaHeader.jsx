import './MainDashboard.css';

const InfoLineaHeader = ({ codigo, titulo, zona, fechaLimite }) => {
  return (
    <div className="InfoLineaHeader">
      <div className="InfoLineaBadge">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"></path></svg>
        <span>{codigo}</span>
      </div>
      <h4>{titulo}</h4>
      <div className="InfoLineaMeta">
        <span className="MetaZona">{zona}</span>
        {fechaLimite && <span className="MetaFecha"> • Vence: {fechaLimite}</span>}
      </div>
    </div>
  );
};

export default InfoLineaHeader;