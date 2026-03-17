import '../DashboardOficial.css';

const LayoutDashboard = ({ sidebar, children }) => {
  return (
    <div className="LayoutDashboard">
      {sidebar}
      <div className="ContenedorPrincipalDashboard">
        {children}
      </div>
    </div>
  );
};

export default LayoutDashboard;
