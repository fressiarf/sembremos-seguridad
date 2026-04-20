import React, { useState, useEffect } from 'react';
import ListaMisTareas from './MainDashboardInstitucion/ListaMisTareas';
import HistorialContainer from './Historial/HistorialContainer';
import PerfilUsuario from '../Dashboard/PerfilUsuario/PerfilUsuario';
import Calendario from '../Shared/Calendario/Calendario';
import ReportesRechazadosEditor from './MainDashboardInstitucion/ReportesRechazadosEditor';
import EditorInformeTrimestral from './InformesTrimestrales/EditorInformeTrimestral';
import { editoresService } from '../../services/editoresService';
import { useToast } from '../../context/ToastContext';
import { useLogin } from '../../context/LoginContext';
import { CheckCircle, Clock, Activity, DollarSign, MessageCircle, Bot, Bell, X } from 'lucide-react';
import SoporteInstitucional from '../Dashboard/SoporteInstitucional/SoporteInstitucional';
import TopbarInstitucion from './Navegacion/TopbarInstitucion';
import ChatBotWindow from '../Shared/ChatBot/ChatBotWindow';
import NotificacionAdmin from '../Dashboard/NotificacionesAdmin/NotificacionAdmin';
import { useRef } from 'react';

const SeccionPrincipalInstitucion = ({ activeView = 'dashboard', collapsed, setCollapsed }) => {
  const { user } = useLogin();
  const [showTopbarNotifs, setShowTopbarNotifs] = useState(false);
  const [showChatBot, setShowChatBot] = useState(false);
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
      dashboard: 'Dashboard Rendimiento',
      lineas: 'Mis Tareas',
      reportes: 'Historial',
      historial: 'Historial de Reportes',
      calendario: 'Calendario',
      alertas: 'Soporte y Comentarios',
      perfil: 'Mi Perfil',
      rechazados: 'Devoluciones',
      informeTrimestral: 'Informe Trimestral'
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

    // ── Vista Dashboard (Solo Resumen / Estadísticas) ──
    if (activeView === 'dashboard') {
      return (
        <div style={{ padding: '2rem 2.5rem', fontFamily: 'Inter, sans-serif' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', margin: '0 0 4px', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>Dashboard de Rendimiento</h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', margin: 0, textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>Resumen de tus actividades, avance e inversión.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem', borderLeft: '4px solid #22c55e', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <CheckCircle size={18} color="#22c55e" />
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Completadas</span>
              </div>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0b2240' }}>{estadisticas.completadas}</span>
            </div>
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem', borderLeft: '4px solid #f59e0b', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <Clock size={18} color="#f59e0b" />
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Pendientes</span>
              </div>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0b2240' }}>{estadisticas.pendientes}</span>
            </div>
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem', borderLeft: '4px solid #3b82f6', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <Activity size={18} color="#3b82f6" />
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Progreso Total</span>
              </div>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0b2240' }}>{estadisticas.progresoGeneral}%</span>
            </div>
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem', borderLeft: '4px solid #8b5cf6', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <DollarSign size={18} color="#8b5cf6" />
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Mi Inversión Total</span>
              </div>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0b2240' }}>{formatColones(estadisticas.inversionTotal)}</span>
            </div>
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
