import './SistemaDeReporte.css';

export const SelectorEstadoLinea = () => {
  return (
    <div className="SelectorEstadoLinea">
      <label>Estado Actual de la Línea:</label>
      <select>
        <option>En ejecución</option>
        <option>Completada</option>
        <option>Pendiente</option>
        <option>Retrasada</option>
      </select>
    </div>
  );
};

export default SelectorEstadoLinea;
