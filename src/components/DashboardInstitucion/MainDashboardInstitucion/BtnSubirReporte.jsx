import './MainDashboard.css';

const BtnSubirReporte = () => {
  return (
    <button type="button" className="BtnSubirReporte" title="Crear nuevo reporte operativo">
      <svg className="BtnIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"></path></svg>
      <span>Nuevo Reporte</span>
    </button>
  );
};

export default BtnSubirReporte;
