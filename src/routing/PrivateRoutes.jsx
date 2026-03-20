import { Navigate } from "react-router-dom";

const PrivateRoutes = ({ children }) => {
  const estaAutenticado = sessionStorage.getItem('currentUser');

  if (!estaAutenticado) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoutes;