import './ElementosUI.css';

export const CargaEvidencias = ({ alSubir }) => {
  return (
    <div className="CargaEvidencias">
      <label>Adjuntar Evidencias (Fotos/PDF):</label>
      <input
        type="file"
        multiple
        onChange={(e) => alSubir && alSubir(e.target.files)}
      />
      <p>Formatos permitidos: JPG, PNG, PDF</p>
    </div>
  );
};

export default CargaEvidencias;
