import UserBrand from "./UserBrand";

const SidebarOficial = () => {
  return (
    <aside>
      <UserBrand />
      <nav>
        <ul>
          {/* Aquí irán los MenuLinkItem */}
          <li>Inicio / Dashboard</li>
          <li>Mis Líneas de Acción</li>
          <li>Historial de Reportes</li>
        </ul>
      </nav>
      <div>
        <button>Cerrar Sesión</button>
      </div>
    </aside>
  );
};

export default SidebarOficial;
