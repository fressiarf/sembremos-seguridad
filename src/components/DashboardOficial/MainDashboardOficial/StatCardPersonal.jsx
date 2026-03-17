import './MainDashboard.css';

const StatCardPersonal = ({ label, valor, tipo }) => {
  return (
    <article className="StatCard">
      <div className="StatCardInfo">
        <p>{label}</p>
        <h2>{valor}</h2>
      </div>
      <div className={`StatCardIcono ${tipo}`}>
        <i>📊</i>
      </div>
    </article>
  );
};

export default StatCardPersonal;
