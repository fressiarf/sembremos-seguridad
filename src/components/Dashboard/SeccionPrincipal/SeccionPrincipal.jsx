import React from 'react';
import './SeccionPrincipal.css';
import DashboardGlobal from '../DashboardGlobal/DashboardGlobal';
import ActividadOficiales from '../ActividadOficiales/ActividadOficiales';
import GestionUsuarios from '../GestionUsuarios/GestionUsuarios';
import PerfilUsuario from '../PerfilUsuario/PerfilUsuario';
import MatrizSeguimiento from '../MatrizSeguimiento/MatrizSeguimiento';



const SeccionPrincipal = ({ collapsed, activeView }) => {
  return (
    <main className={`main-content ${collapsed ? 'main-content--collapsed' : ''}`}>
      {activeView === 'dashboard' && <DashboardGlobal />}
      {activeView === 'actividades' && <ActividadOficiales />}
      {activeView === 'usuarios' && <GestionUsuarios />}
      {activeView === 'perfil' && <PerfilUsuario />}
      {activeView === 'matrices' && <MatrizSeguimiento />}



      
      {/* Placeholder para otras vistas */}
      {activeView !== 'dashboard' && activeView !== 'actividades' && activeView !== 'usuarios' && activeView !== 'perfil' && activeView !== 'matrices' && (

        <div style={{ padding: '2rem', color: '#7a9cc4' }}>
          <h2>Vista en desarrollo: {activeView}</h2>
          <p>Esta sección se implementará próximamente.</p>
        </div>
      )}
    </main>
  );
};

export default SeccionPrincipal;

