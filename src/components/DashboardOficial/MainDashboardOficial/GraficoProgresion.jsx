import './MainDashboard.css';

const GraficoProgresion = ({ porcentaje }) => {
  const radius = 15.9155;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (porcentaje / 100) * circumference;

  return (
    <div className="GraficoProgresionContainer">
      <div className="GraficoWrapper">
        <svg className="GraficoSVG" viewBox="0 0 36 36">
          <circle className="GraficoFondo" cx="18" cy="18" r={radius} fill="transparent" strokeWidth="2.5"></circle>
          <circle 
            className="GraficoProgreso" 
            cx="18" cy="18" r={radius} 
            fill="transparent" 
            strokeWidth="3" 
            strokeDasharray={circumference} 
            strokeDashoffset={offset}
            strokeLinecap="round"
          ></circle>
        </svg>
        <div className="GraficoCentro">
          <span className="GraficoPorcentaje">{porcentaje}%</span>
          <span className="GraficoLabel">Completado</span>
        </div>
      </div>
      <p className="GraficoSubtitulo">Meta Operativa 2025</p>
    </div>
  );
};

export default GraficoProgresion;
