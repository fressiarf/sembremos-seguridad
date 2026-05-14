import './ElementosUI.css';

export const BtnGuardarAvance = ({ alEnviar, deshabilitado }) => {
  return (
    <button
      className="BtnGuardarAvance"
      onClick={alEnviar}
      disabled={deshabilitado}
    >
      Actualizar Estado de Línea
    </button>
  );
};

export default BtnGuardarAvance;
