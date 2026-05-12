import './ElementosUI.css';

export const AlertaEstadoLinea = ({ diasRestantes, estado }) => {
  const getNivel = () => {
    if (diasRestantes <= 3) return 'critica';
    if (diasRestantes <= 7) return 'advertencia';
    return 'normal';
  };

  return (
    <div className={`AlertaEstadoLinea ${getNivel()}`}>
      <span>Estado: {estado}</span>
      {diasRestantes <= 5 && <p>¡Atención! Quedan {diasRestantes} días para el hito.</p>}
    </div>
  );
};

export default AlertaEstadoLinea;
