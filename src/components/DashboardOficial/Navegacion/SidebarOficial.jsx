import './Navegacion.css';
import UserBrand from "./UserBrand";
import MenuLinkItem from "./MenuLinkItem";

const SidebarOficial = () => {
  return (
    <aside className="SidebarOficial">
      <div>
        <UserBrand />
        <nav>
          <ul className="NavMenuLista">
            <li><MenuLinkItem label="Dashboard" isActive={true} /></li>
            <li><MenuLinkItem label="Mis Líneas de Acción" badgeCount={2} /></li>
            <li><MenuLinkItem label="Historial de Reportes" /></li>
          </ul>
        </nav>
      </div>
      <div>
        <button className="BtnCerrarSesion">Cerrar Sesión</button>
      </div>
    </aside>
  );
};

export default SidebarOficial;
