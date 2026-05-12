import './SistemaDeReporte.css';

const BtnExport = ({ formato, onClick }) => {
  return (
    <button className="BtnExport" onClick={onClick}>
      Descargar {formato}
    </button>
  );
};

export default BtnExport;
