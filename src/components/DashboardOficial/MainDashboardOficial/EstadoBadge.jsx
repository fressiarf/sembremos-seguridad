import './MainDashboard.css';

const EstadoBadge = ({ status }) => {
  const claseEstado = status?.replace(/\s/g, '') || 'Pendiente';
  return (
    <span className={`EstadoBadge ${claseEstado}`}>
      {status}
    </span>
  );
};

export default EstadoBadge;
