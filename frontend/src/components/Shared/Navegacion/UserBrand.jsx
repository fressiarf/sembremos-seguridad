import logoMsp from '../../../assets/Msp_logo-removebg-preview.png';
import './Navegacion.css';

const UserBrand = ({ collapsed }) => {
  return (
    <div className={`UserBrandContainer ${collapsed ? 'collapsed' : ''}`}>
      <div className="UserBrandLogo">
        <img src={logoMsp} alt="MSP" className="BrandLogoImg" />
      </div>
      {!collapsed && (
        <div className="UserBrandTexto">
          <h3>SEMBREMOS</h3>
          <p className="BrandSubtitle">SEGURIDAD</p>
        </div>
      )}
    </div>
  );
};

export default UserBrand;
