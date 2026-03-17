import './MainDashboard.css';

export const ProximosHitos = ({ hito, fecha }) => {
  return (
    <div className="ProximosHitosCard">
      <h4>Próxima Meta Programada</h4>
      <p>{hito}</p>
      <span>Fecha: {fecha}</span>
    </div>
  );
};

export default ProximosHitos;
