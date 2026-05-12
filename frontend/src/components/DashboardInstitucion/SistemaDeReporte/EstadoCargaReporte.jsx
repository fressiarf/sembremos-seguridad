import './SistemaDeReporte.css';

export const EstadoCargaReporte = ({ estaListo }) => {
  return (
    <div className={`EstadoCarga ${estaListo ? 'listo' : 'cargando'}`}>
      <span className={`EstadoCargaDot ${estaListo ? 'listo' : 'cargando'}`}></span>
      <span>{estaListo ? "Sincronizado" : "Actualizando datos..."}</span>
    </div>
  );
};

export default EstadoCargaReporte;
