import './SistemaDeReporte.css';

export const FiltroJurisdiccion = ({ alCambiar }) => {
  return (
    <div className="FiltroJurisdiccion">
      <label>Filtrar por Zona Crítica:</label>
      <select onChange={(e) => alCambiar(e.target.value)}>
        <option value="cantonal">Cantón Central</option>
        <option value="barranca">Barranca</option>
        <option value="chacarita">Chacarita</option>
        <option value="el-roble">El Roble</option>
      </select>
    </div>
  );
};

export default FiltroJurisdiccion;
