import './SistemaDeReporte.css';

export const TextAreaBitacora = ({ label, placeholder }) => {
  return (
    <div className="TextAreaBitacora">
      <label>{label}</label>
      <textarea placeholder={placeholder}></textarea>
    </div>
  );
};

export default TextAreaBitacora;
