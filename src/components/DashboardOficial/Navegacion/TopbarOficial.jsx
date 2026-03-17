import './Navegacion.css';

const TopbarOficial = ({ usuario, seccion, subtitulo }) => {
  return (
    <header className="TopbarOficial">
      <div className="TopbarSeccion">
        <h1>{seccion || 'Dashboard'}</h1>
        <span>{subtitulo || 'Panel del Oficial'}</span>
      </div>
      <div className="TopbarUsuario">
        <span>Oficial: {usuario?.nombre || 'Brandon Mora'}</span>
        <span>Sector: {usuario?.zona || 'Barranca'}</span>
      </div>
    </header>
  );
};

export default TopbarOficial;
