import { Navigate } from "react-router-dom";

const PrivateRoutes = ({ children, allowedRoles = [] }) => {
  const estaAutenticado = sessionStorage.getItem('currentUser');

  if (!estaAutenticado) {
    return <Navigate to="/" />;
  }

  // Validar rol si se especifican roles permitidos
  if (allowedRoles.length > 0) {
    const user = JSON.parse(estaAutenticado);
    const userRol = user?.rol?.toLowerCase()?.trim();
    const rolesNormalizados = allowedRoles.map(r => String(r).toLowerCase().trim());
    
    if (!userRol || !rolesNormalizados.includes(userRol)) {
      console.warn(`Access Denied: User role [${userRol}] not in allowed roles [${rolesNormalizados.join(', ')}]`);
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default PrivateRoutes;