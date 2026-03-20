import './Historial.css';

const TimelineDot = ({ estado }) => {
  const claseEstado = estado?.replace(/\s/g, '') || 'pendiente';
  return (
    <div className="TimelineDotContainer">
      <span className={`TimelineDot ${claseEstado}`} />
      <span className="TimelineLine" />
    </div>
  );
};

export default TimelineDot;
