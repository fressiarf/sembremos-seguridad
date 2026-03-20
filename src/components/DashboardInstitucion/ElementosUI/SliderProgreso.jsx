import './ElementosUI.css';

export const SliderProgreso = ({ valor, alCambiar }) => {
  return (
    <div className="SliderProgreso">
      <label>Porcentaje de Avance Actual: {valor}%</label>
      <input
        type="range"
        min="0"
        max="100"
        value={valor}
        onChange={(e) => alCambiar && alCambiar(e.target.value)}
      />
    </div>
  );
};

export default SliderProgreso;
