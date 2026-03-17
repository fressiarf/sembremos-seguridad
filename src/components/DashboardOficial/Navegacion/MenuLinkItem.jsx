import './Navegacion.css';

const MenuLinkItem = ({ label, iconName, isActive, badgeCount }) => {
  return (
    <a href="#" className={`MenuLinkItem ${isActive ? 'Activo' : ''}`}>
      <span>{label}</span>
      {badgeCount > 0 && <span className="MenuLinkBadge">{badgeCount}</span>}
    </a>
  );
};

export default MenuLinkItem;
