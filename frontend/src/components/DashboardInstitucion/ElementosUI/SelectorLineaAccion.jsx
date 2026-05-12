import './ElementosUI.css';

export const SelectorLineaAccion = ({ lineas = [], alSeleccionar }) => {
  return (
    <div className="SelectorLineaAccion">
      <label>Seleccionar Línea de Acción:</label>
      <select onChange={(e) => alSeleccionar && alSeleccionar(e.target.value)}>
        <option value="">Seleccione una línea asignada...</option>
        {lineas.map(linea => (
          <option key={linea.id} value={linea.id}>{linea.codigo} - {linea.nombre}</option>
        ))}
      </select>
    </div>
  );
};

export default SelectorLineaAccion;
