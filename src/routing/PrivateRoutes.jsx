import { Navigate } from "react-router-dom";

const PrivateRoutes = ({ children, allowedRoles = [] }) => {
  const estaAutenticado = sessionStorage.getItem('currentUser');

  if (!estaAutenticado) {
    return <Navigate to="/" />;
  }

  // Validar rol si se especifican roles permitidos
  if (allowedRoles.length > 0) {
    const user = JSON.parse(estaAutenticado);
    if (!allowedRoles.includes(user?.rol)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default PrivateRoutes;