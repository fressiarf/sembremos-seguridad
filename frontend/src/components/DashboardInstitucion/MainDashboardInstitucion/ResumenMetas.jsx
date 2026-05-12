import './MainDashboard.css';
import StatCardPersonal from "./StatCardPersonal";

const ResumenMetas = () => {
  return (
    <section className="ResumenMetasContainer">
      <StatCardPersonal label="Mis Líneas" valor="4" tipo="info" />
      <StatCardPersonal label="Por Reportar" valor="2" tipo="alerta" />
      <StatCardPersonal label="Metas Listas" valor="1" tipo="exito" />
    </section>
  );
};

export default ResumenMetas;
