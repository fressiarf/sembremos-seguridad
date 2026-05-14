import './Historial.css';

export const FiltroHistorial = ({ alFiltrar }) => {
  return (
    <div className="FiltroHistorial">
      <input
        type="text"
        placeholder="Buscar por Oficial o Código (LA-2025...)"
        onChange={(e) => alFiltrar(e.target.value)}
      />
      <select onChange={(e) => alFiltrar(e.target.value)}>
        <option value="todos">Todas las fechas</option>
        <option value="hoy">Hoy</option>
        <option value="semana">Esta semana</option>
      </select>
    </div>
  );
};

export default FiltroHistorial;
