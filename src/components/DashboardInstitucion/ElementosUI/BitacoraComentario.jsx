import './ElementosUI.css';

export const BitacoraComentario = ({ valor, alCambiar }) => {
  return (
    <div className="BitacoraComentario">
      <label>Bitácora Técnica / Notas de Campo:</label>
      <textarea
        placeholder="Describa brevemente la actualización realizada..."
        value={valor}
        onChange={(e) => alCambiar && alCambiar(e.target.value)}
      />
    </div>
  );
};

export default BitacoraComentario;
