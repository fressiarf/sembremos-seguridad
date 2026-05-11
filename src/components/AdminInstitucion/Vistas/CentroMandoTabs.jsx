import React, { useState } from 'react';
import DashboardAdminInst from './DashboardAdminInst';
import DashboardAvances from '../../Dashboard/DashboardAvances/DashboardAvances';
import MesaCIR from '../../Dashboard/MesaCIR/MesaCIR';
import '../../Dashboard/Estadisticas/EstadisticasGlobal.css';
import { LayoutDashboard, CheckCircle, Activity } from 'lucide-react';

const CentroMandoTabs = () => {
  const [activeTab, setActiveTab] = useState('ejecutivo');

  const getTabClass = (tabId) => `estadisticas-tab-btn ${activeTab === tabId ? 'active' : ''}`;

  return (
    <div className="estadisticas-global">
      <div className="estadisticas-tabs-nav" style={{ margin: '0 2rem 2rem 2rem' }}>
        <button className={getTabClass('ejecutivo')} onClick={() => setActiveTab('ejecutivo')}>
          <LayoutDashboard size={16} /> 1. Resumen Operativo
        </button>
        <button className={getTabClass('avances')} onClick={() => setActiveTab('avances')}>
          <CheckCircle size={16} /> 2. Cumplimiento y Metas
        </button>
      </div>

      <div className="estadisticas-tab-content">
        {activeTab === 'ejecutivo' && (
          <div className="tab-pane-fade-in" style={{ margin: '-2rem -2.5rem -4rem', padding: 0 }}>
             <DashboardAdminInst />
          </div>
        )}

        {activeTab === 'avances' && (
          <div className="tab-pane-fade-in" style={{ margin: '-2rem -2.5rem -4rem', padding: 0 }}>
            <DashboardAvances scope="institucion" />
          </div>
        )}
      </div>
    </div>
  );
};

export default CentroMandoTabs;
