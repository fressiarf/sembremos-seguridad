import './Historial.css';

const EvidenciaHistorial = ({ url, tipo }) => {
  return (
    <div className="EvidenciaHistorial">
      <span className="EvidenciaTipo">{tipo}</span>
      <button className="EvidenciaBtn" onClick={() => window.open(url)}>Ver evidencia</button>
    </div>
  );
};

export default EvidenciaHistorial;
