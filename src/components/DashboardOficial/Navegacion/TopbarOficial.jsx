import './Navegacion.css';

const TopbarOficial = ({ usuario, seccion, subtitulo }) => {
  return (
    <header className="TopbarOficial">
      <div className="TopbarIzquierda">
        <div className="TopbarSeccionInfo">
          <h1>{seccion || 'Dashboard'}</h1>
          <p className="TopbarSubtitulo">{subtitulo || 'Panel del Oficial'}</p>
        </div>
      </div>
      
      <div className="TopbarDerecha">
        <div className="TopbarAcciones">
          <div className="StatusPill">
            <span className="StatusDot" />
            <span className="StatusLabel">OFICIAL</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopbarOficial;
