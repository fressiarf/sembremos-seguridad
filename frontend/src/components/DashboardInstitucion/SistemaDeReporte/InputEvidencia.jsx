import './SistemaDeReporte.css';

export const InputEvidencia = ({ label }) => {
  return (
    <div className="InputEvidencia">
      <label>{label}</label>
      <input type="file" multiple />
    </div>
  );
};

export default InputEvidencia;
