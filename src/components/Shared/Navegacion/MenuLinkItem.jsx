import './Navegacion.css';

const MenuLinkItem = ({ label, icon, isActive, badgeCount, onClick, collapsed }) => {
  return (
    <button 
      className={`MenuLinkItem ${isActive ? 'Activo' : ''} ${collapsed ? 'MenuLinkItem--collapsed' : ''}`}
      onClick={onClick}
      title={collapsed ? label : ''}
    >
      <div className="MenuLinkIconArea">
        <span className="MenuLinkIcon">
          {icon}
        </span>
        {badgeCount !== undefined && <span className="MenuLinkBadge">{badgeCount}</span>}
      </div>
      <span className="MenuLinkText">{label}</span>
    </button>
  );
};

export default MenuLinkItem;
