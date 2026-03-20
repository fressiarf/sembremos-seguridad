import './MainDashboard.css';

const EstadoBadge = ({ status }) => {
  const claseEstado = status?.replace(/\s/g, '').toLowerCase() || 'pendiente';
  return (
    <span className={`EstadoBadge ${claseEstado}`}>
      <span className="EstadoDot"></span>
      {status}
    </span>
  );
};

export default EstadoBadge;
