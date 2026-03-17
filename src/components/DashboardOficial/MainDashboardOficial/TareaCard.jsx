import './MainDashboard.css';
import InfoLineaHeader from "./InfoLineaHeader";
import BarraProgreso from "./BarraProgreso";
import EstadoBadge from "./EstadoBadge";
import BtnSubirReporte from "./BtnSubirReporte";

const TareaCard = ({ tarea }) => {
  return (
    <article className="TareaCard">
      <InfoLineaHeader
        codigo={tarea?.codigo || 'LA-0000-00'}
        titulo={tarea?.titulo || 'Sin título'}
        zona={tarea?.zona || 'Sin zona'}
      />
      <BarraProgreso porcentaje={tarea?.porcentaje || 0} />
      <div className="TareaCardAcciones">
        <EstadoBadge status={tarea?.estado || 'Pendiente'} />
        <BtnSubirReporte />
      </div>
    </article>
  );
};

export default TareaCard;
