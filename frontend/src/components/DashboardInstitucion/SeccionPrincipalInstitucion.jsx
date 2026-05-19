import React, { useState, useEffect } from 'react';
import ListaMisTareas from './MainDashboardInstitucion/ListaMisTareas';
import HistorialContainer from './Historial/HistorialContainer';
import PerfilUsuario from '../Dashboard/PerfilUsuario/PerfilUsuario';
import Calendario from '../Shared/Calendario/Calendario';
import ReportesRechazadosEditor from './MainDashboardInstitucion/ReportesRechazadosEditor';
import EditorInformeTrimestral from './InformesTrimestrales/EditorInformeTrimestral';
import { editoresService } from '../../services/editoresService';
import DashboardAvances from '../Dashboard/DashboardAvances/DashboardAvances';
import { useToast } from '../../context/ToastContext';
import { useLogin } from '../../context/LoginContext';
import { CheckCircle, Clock, Activity, DollarSign, MessageCircle, Bot, Bell, X, LayoutDashboard } from 'lucide-react';
import SoporteInstitucional from '../Dashboard/SoporteInstitucional/SoporteInstitucional';
import TopbarInstitucion from './Navegacion/TopbarInstitucion';
import ChatBotWindow from '../Shared/ChatBot/ChatBotWindow';
import NotificacionAdmin from '../Dashboard/NotificacionesAdmin/NotificacionAdmin';
import ZonasCriticas from '../Dashboard/ZonasCriticas/ZonasCriticas';
import { useRef } from 'react';
import '../Dashboard/DashboardGlobal/DashboardGlobal.css';

const SeccionPrincipalInstitucion = ({ activeView = 'dashboard', collapsed, setCollapsed }) => {
  const { user } = useLogin();
  const [showTopbarNotifs, setShowTopbarNotifs] = useState(false);
  const [showChatBot, setShowChatBot] = useState(false);
  const [activeTab, setActiveTab] = useState('resumen');
  const notifRef = useRef(null);

  const toggleDrawer = () => setShowTopbarNotifs(prev => !prev);
  const toggleChatBot = () => setShowChatBot(prev => !prev);

  // Efecto para manejar la exclusividad y el colapso del sidebar
  useEffect(() => {
    if (showTopbarNotifs) {
      setShowChatBot(false);
      if (setCollapsed) setCollapsed(true);
    }
  }, [showTopbarNotifs, setCollapsed]);

  useEffect(() => {
    if (showChatBot) {
      setShowTopbarNotifs(false);
      if (setCollapsed) setCollapsed(true);
    }
  }, [showChatBot, setCollapsed]);
  const [tareas, setTareas] = useState([]);
  const [estadisticas, setEstadisticas] = useState({
    totalTareas: 0, completadas: 0, pendientes: 0,
    inversionTotal: 0, progresoGeneral: 0
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Todas');
  const { showToast } = useToast();

  const loadData = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const data = await editoresService.getFullDashboardData(user.id);
      if (data) {
        setTareas(data.tareas);
        setEstadisticas(data.estadisticas);
      }
    } catch (error) {
      showToast('Error al cargar tus tareas', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [user?.id]);

  const formatColones = (amount) => {
    if (!amount || amount === 0) return '₡0';
    return '₡' + amount.toLocaleString('es-CR');
  };

  if (loading) return <div style={{ padding: '3rem', color: '#7a9cc4' }}>Cargando datos...</div>;

  const getSeccionLabel = () => {
    const labels = {
      dashboard: 'Resumen Personal',
      lineas: 'Hoja de Ruta Diaria',
      reportes: 'Historial',
      historial: 'Historial de Reportes',
      calendario: 'Calendario',
      alertas: 'Soporte Directo',
      perfil: 'Mi Perfil',
      rechazados: 'Devoluciones y Feedback',
      informeTrimestral: 'Informe Trimestral',
      avances: 'Consultor de Metas',
      zonas: 'Mapa de Nodos',
      documentacion: 'Documentación Operativa'
    };
    return labels[activeView] || 'Dashboard';
  };

  const renderContent = () => {
    // ── Vista Historial de Reportes ──
    if (activeView === 'historial') {
      const tareasCompletadas = tareas.filter(t => t.completada);
      const registros = tareasCompletadas.map(t => ({
        fecha: t.fechaCompletada,
        oficial: t.institucionNombre,
        zona: t.zona || 'Asignada',
        lineaAccion: `${t.lineaNombre} - ${t.titulo}`,
        comentario: t.reporteInstitucion || 'Sin reporte detallado'
      }));
      return (
        <div style={{ padding: '2rem 2.5rem' }}>
          <HistorialContainer registros={registros} />
        </div>
      );
    }

    // ── Vista Calendario ──
    if (activeView === 'calendario') {
      return (
        <div style={{ padding: '2rem 2.5rem' }}>
          <Calendario />
        </div>
      );
    }

    // ── Vista Reportes Rechazados ──
    if (activeView === 'rechazados') {
      return (
        <div style={{ padding: '2rem 2.5rem' }}>
          <ReportesRechazadosEditor />
        </div>
      );
    }

    // ── Vista Informe Trimestral ──
    if (activeView === 'informeTrimestral') {
      return <EditorInformeTrimestral />;
    }

    // ── Vista Soporte y Comentarios ──
    if (activeView === 'alertas') {
      return (
        <div style={{ padding: '0 2.5rem 2.5rem' }}>
          <SoporteInstitucional />
        </div>
      );
    }

    // ── Vista Dashboard (Resumen y Avances) ──
    if (activeView === 'dashboard') {
      const getTabClass = (tabId) => `estadisticas-tab-btn ${activeTab === tabId ? 'active' : ''}`;

      return (
        <div className="estadisticas-global">
          <div className="estadisticas-tabs-nav" style={{ margin: '0 2rem 2rem 2rem' }}>
            <button className={getTabClass('resumen')} onClick={() => setActiveTab('resumen')}>
              <LayoutDashboard size={16} /> 1. Resumen Personal
            </button>
            <button className={getTabClass('avances')} onClick={() => setActiveTab('avances')}>
              <CheckCircle size={16} /> 2. Consultor de Metas
            </button>
          </div>

          <div className="estadisticas-tab-content">
            {activeTab === 'resumen' && (
              <div className="tab-pane-fade-in" style={{ margin: '-2rem -2.5rem -4rem', padding: 0 }}>
                <div className="dashboard-global" style={{ padding: 0 }}>
                  <header className="dashboard-global__banner" style={{ margin: '2rem 2.5rem 0', borderRadius: '12px' }}>
                    <div className="banner-content">
                      <div className="dashboard-top-stats-grid" style={{ width: '100%' }}>
                        <div className="stat-card-mini">
                          <div className="mini-icon blue"><Activity size={16} /></div>
                          <div className="mini-data">
                            <span className="mini-val">{estadisticas.totalTareas}</span>
                            <span className="mini-lbl">Tareas Asignadas</span>
                          </div>
                        </div>
                        
                        <div className="stat-card-mini progress-main-card">
                          <span className="mini-lbl">Avance Tareas</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div className="mini-icon green"><CheckCircle size={16} /></div>
                            <span className="mini-val" style={{ fontSize: '0.9rem', color: '#0b2240' }}>
                              {estadisticas.completadas} / {estadisticas.totalTareas || 0}
                            </span>
                          </div>
                          <div className="main-prog-group" style={{ marginTop: '6px' }}>
                            <span className="main-prog-val">{Math.round((estadisticas.completadas / (estadisticas.totalTareas || 1)) * 100)}%</span>
                            <div className="main-prog-bar">
                              <div className="fill" style={{ width: `${Math.min(100, (estadisticas.completadas / (estadisticas.totalTareas || 1)) * 100)}%`, backgroundColor: '#22c55e' }}></div>
                            </div>
                          </div>
                        </div>

                        <div className="stat-card-mini progress-main-card">
                          <span className="mini-lbl">Progreso Total de Tareas</span>
                          <div className="main-prog-group">
                            <span className="main-prog-val">{estadisticas.progresoGeneral}%</span>
                            <div className="main-prog-bar"><div className="fill" style={{width:`${estadisticas.progresoGeneral}%`, backgroundColor: '#3b82f6'}}></div></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </header>

                  <div className="dashboard-global-body" style={{ padding: '2rem 2.5rem' }}>
                    <div className="dashboard-main-grid-layout" style={{ display: 'block' }}>
                      <main className="intelligence-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                        
                        {/* Card 1: Inversión Financiera */}
                        <section className="dashboard-card-v4">
                          <div className="card-v4-header">
                            <DollarSign size={20} className="header-icon" style={{ color: '#8b5cf6' }} />
                            <h3>Mi Inversión Total</h3>
                          </div>
                          <div style={{ padding: '2rem', textAlign: 'center' }}>
                            <p style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0b2240', margin: '0 0 10px 0' }}>{formatColones(estadisticas.inversionTotal)}</p>
                            <span className="mini-tag" style={{ background: '#f5f3ff', color: '#6d28d9', padding: '6px 12px', fontSize: '0.8rem', borderRadius: '20px' }}>Inversión Ejecutada en Actividades</span>
                          </div>
                        </section>

                        {/* Card 2: Balance Operativo */}
                        <section className="dashboard-card-v4">
                          <div className="card-v4-header">
                            <Clock size={20} className="header-icon" style={{ color: '#f59e0b' }} />
                            <h3>Balance Operativo</h3>
                          </div>
                          <div className="lineas-cascade-container">
                            <div className="cir-inst-row" style={{ padding: '15px', borderBottom: '1px solid #f1f5f9' }}>
                                <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span className="cir-inst-name" style={{ fontSize: '0.9rem' }}>Completadas</span>
                                  <span className="cir-inst-budget" style={{ fontSize: '1.2rem' }}>{estadisticas.completadas}</span>
                                </div>
                            </div>
                            <div className="cir-inst-row" style={{ padding: '15px' }}>
                                <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span className="cir-inst-name" style={{ fontSize: '0.9rem' }}>Pendientes de Concluir</span>
                                  <span className="cir-inst-budget" style={{ fontSize: '1.2rem', color: '#f59e0b' }}>{estadisticas.pendientes}</span>
                                </div>
                            </div>
                          </div>
                        </section>

                      </main>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'avances' && (
              <div className="tab-pane-fade-in" style={{ margin: '-2rem -2.5rem -4rem', padding: 0 }}>
                <DashboardAvances scope="editor" />
              </div>
            )}
          </div>
        </div>
      );
    }

    // ── Vista Mapa de Nodos (Zonas Críticas) ──
    if (activeView === 'zonas') {
      return <ZonasCriticas />;
    }

    // ── Vista Documentación Operativa (Placeholder) ──
    if (activeView === 'documentacion') {
      return (
        <div style={{ padding: '2rem 2.5rem' }}>
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '3rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.25rem', color: '#1e293b', marginBottom: '8px' }}>Repositorio de Documentación Operativa</h2>
            <p style={{ color: '#64748b' }}>Aquí encontrará los manuales, guías y protocolos necesarios para su despliegue en campo. (Módulo en preparación)</p>
          </div>
        </div>
      );
    }

    // ── Vista Perfil ──
    if (activeView === 'perfil') {
      return (
        <div style={{ padding: '2rem 2.5rem' }}>
          <PerfilUsuario />
        </div>
      );
    }

    // ── Vista Mis Tareas (Solo Lista de Tareas y Filtros) ──
    const tareasFiltradas = tareas.filter(t => {
      if (filter === 'Completadas') return t.completada;
      if (filter === 'Pendientes') return !t.completada;
      return true; // 'Todas'
    });

    return (
      <div style={{ padding: '2rem 2.5rem' }}>
        <ListaMisTareas 
          tareas={tareasFiltradas}
          filter={filter}
          setFilter={setFilter}
          onUpdate={loadData}
        />
      </div>
    );
  };

  return (
    <>
      <TopbarInstitucion 
        usuario={user}
        seccion={getSeccionLabel()}
        rol={user?.rol === 'adminInstitucion' ? 'COORD. INSTITUCIONAL' : 'EDITOR'}
      >
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginLeft: '1rem' }}>
          <button 
            onClick={toggleChatBot}
            style={{
              background: showChatBot ? '#002f6c' : 'transparent', 
              border: '1px solid #e2e8f0', 
              cursor: 'pointer', padding: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '50%', transition: 'all 0.2s',
              backgroundColor: showChatBot ? '#002f6c' : '#ffffff',
            }}
          >
            <Bot size={20} color={showChatBot ? '#ffffff' : '#002f6c'} />
          </button>

          <div ref={notifRef} style={{ position: 'relative' }}>
            <button 
              onClick={toggleDrawer}
              style={{
                background: showTopbarNotifs ? '#002f6c' : 'transparent', 
                border: '1px solid #e2e8f0', 
                cursor: 'pointer', padding: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '50%', transition: 'all 0.2s',
                backgroundColor: showTopbarNotifs ? '#002f6c' : '#ffffff',
              }}
            >
              <Bell size={20} color={showTopbarNotifs ? '#ffffff' : '#002f6c'} />
            </button>
          </div>
        </div>
      </TopbarInstitucion>
      
      {renderContent()}

      {showTopbarNotifs && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.1)' }} onClick={() => setShowTopbarNotifs(false)}></div>
          <NotificacionAdmin variant="drawer" />
        </>
      )}

      {showChatBot && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 9998, backgroundColor: 'rgba(0,0,0,0.05)' }} onClick={() => setShowChatBot(false)}></div>
          <ChatBotWindow onClose={() => setShowChatBot(false)} user={user} />
        </>
      )}
    </>
  );
};

export default SeccionPrincipalInstitucion;
