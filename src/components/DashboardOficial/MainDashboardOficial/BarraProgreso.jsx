import './MainDashboard.css';

const BarraProgreso = ({ porcentaje }) => {
  const getColor = (pct) => {
    if (pct >= 75) return '#22c55e';
    if (pct >= 40) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="BarraProgresoContainer">
      <div className="BarraProgresoTexto">
        <span>{porcentaje}% completado</span>
      </div>
      <div className="BarraProgresoTrack">
        <div className="BarraProgresoFill" style={{ width: `${porcentaje}%`, backgroundColor: getColor(porcentaje) }}></div>
      </div>
    </div>
  );
};

export default BarraProgreso;
