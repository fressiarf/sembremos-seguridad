import './MainDashboard.css';

const BarraProgreso = ({ porcentaje }) => {
  return (
    <div className="BarraProgresoContainer">
      <div className="BarraProgresoMeta">
        <span className="ProgresoLabel">Progreso de la Línea</span>
        <span className="ProgresoPorcentaje">{porcentaje}%</span>
      </div>
      <div className="BarraProgresoTrack">
        <div 
          className="BarraProgresoFill" 
          style={{ 
            width: `${porcentaje}%`, 
            background: `linear-gradient(90deg, var(--msp-red) 0%, #ef4444 100%)` 
          }}
        ></div>
      </div>
    </div>
  );
};

export default BarraProgreso;
