import './MainDashboard.css';

const StatCardPersonal = ({ label, valor, tipo }) => {
  const CardIcons = {
    info: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
    ),
    alerta: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
    ),
    exito: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
    )
  };

  const IconComp = CardIcons[tipo] || CardIcons.info;

  return (
    <article className="StatCard" data-tipo={tipo}>
      <div className={`StatCardIcono ${tipo}`}>
        <IconComp />
      </div>
      
      <div className="StatCardContenido">
        <h2 className="StatCardValor">{valor}</h2>
        <p className="StatCardLabel">{label}</p>
      </div>
    </article>
  );
};

export default StatCardPersonal;
