import { Shield } from 'lucide-react';
import './Navegacion.css';

const UserBrand = ({ collapsed }) => {
  return (
    <div className="UserBrandContainer">
      <div className="UserBrandLogo">
        <Shield size={24} color="#0f172a" fill="#0f172a" />
      </div>
      <div className="UserBrandTexto">
        <h3>SEMBREMOS</h3>
        <p className="BrandSubtitle">SEGURIDAD</p>
      </div>
    </div>
  );
};

export default UserBrand;
