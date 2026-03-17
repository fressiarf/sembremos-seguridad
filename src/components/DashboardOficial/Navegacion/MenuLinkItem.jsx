const MenuLinkItem = ({ label, iconName, isActive, badgeCount }) => {
  return (
    <a href="#">
      <i>{/* Icono placeholder */}</i>
      <span>{label}</span>
      {badgeCount > 0 && <span>{badgeCount}</span>}
    </a>
  );
};

export default MenuLinkItem;
