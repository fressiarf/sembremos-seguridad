import React, { useState, useEffect } from 'react';
import { adminInstitucionService } from '../../../services/adminInstitucionService';
import { useToast } from '../../../context/ToastContext';
import { CheckCircle, Clock, FileSearch, Activity, AlertTriangle, Users, Target, MapPin, Calendar as CalIcon } from 'lucide-react';
import '../AdminInstitucion.css';

const DashboardAdminInst = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        const result = await adminInstitucionService.getDashboardData();
        setData(result);
      } catch (e) {
        showToast('Error al cargar dashboard', 'error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div style={{ padding: '3rem', color: '#7a9cc4' }}>Cargando dashboard...</div>;
  if (!data) return null;

  const { estadisticas: stats, urgentes, reportesRecientes } = data;

  return (
    <div style={{ padding: '2rem 2.5rem', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', margin: '0 0 4px', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
          Panel Admin Institución
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', margin: 0, textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>
          Gestiona las tareas y reportes de tu institución.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="admin-inst-stats-grid">
        <div className="admin-inst-stat-card" style={{ borderLeft: '4px solid #3b82f6' }}>
          <div className="admin-inst-stat-header">
            <Activity size={18} color="#3b82f6" />
            <span className="admin-inst-stat-label">Tareas Totales</span>
          </div>
          <span className="admin-inst-stat-value">{stats.totalTareas}</span>
        </div>

        <div className="admin-inst-stat-card" style={{ borderLeft: '4px solid #22c55e' }}>
          <div className="admin-inst-stat-header">
            <CheckCircle size={18} color="#22c55e" />
            <span className="admin-inst-stat-label">Completadas</span>
          </div>
          <span className="admin-inst-stat-value">{stats.completadas}</span>
        </div>

        <div className="admin-inst-stat-card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div className="admin-inst-stat-header">
            <FileSearch size={18} color="#f59e0b" />
            <span className="admin-inst-stat-label">Reportes Pendientes</span>
          </div>
          <span className="admin-inst-stat-value">{stats.reportesPendientes}</span>
        </div>

        <div className="admin-inst-stat-card" style={{ borderLeft: '4px solid #8b5cf6' }}>
          <div className="admin-inst-stat-header">
            <Target size={18} color="#8b5cf6" />
            <span className="admin-inst-stat-label">Avance General</span>
          </div>
          <span className="admin-inst-stat-value">{stats.progreso}%</span>
        </div>
      </div>

      {/* Two column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
        {/* Left: Urgent Tasks */}
        <div>
          <h3 className="admin-inst-section-title">
            <AlertTriangle size={18} /> Tareas Urgentes / Próximas a Vencer
          </h3>
          {urgentes.length === 0 ? (
            <div className="admin-inst-empty">
              <CheckCircle size={40} opacity={0.3} />
              <p>No hay tareas urgentes</p>
            </div>
          ) : (
            urgentes.map(t => {
              const vencida = t.diasRestantes < 0;
              const proxima = t.diasRestantes >= 0 && t.diasRestantes <= 15;
              const clase = vencida ? 'admin-inst-urgente-item--vencida' : proxima ? 'admin-inst-urgente-item--proxima' : 'admin-inst-urgente-item--normal';
              return (
                <div key={t.id} className={`admin-inst-urgente-item ${clase}`}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: '#0b2240', fontSize: '0.9rem', marginBottom: '4px' }}>{t.titulo}</div>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: '#64748b' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Activity size={12} /> L#{t.lineaNumero}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} /> {t.zona}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Users size={12} /> {t.responsable?.nombre || 'Sin asignar'}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className={`admin-inst-badge ${t.estado === 'Completado' ? 'admin-inst-badge--completado' : t.estado === 'Con Actividades' ? 'admin-inst-badge--con-actividades' : 'admin-inst-badge--sin-actividades'}`}>
                      {t.estado}
                    </span>
                    <div style={{ fontSize: '0.7rem', color: vencida ? '#ef4444' : '#64748b', fontWeight: 600, marginTop: '4px' }}>
                      <CalIcon size={11} style={{ verticalAlign: 'middle', marginRight: '3px' }} />
                      {vencida ? `Vencida hace ${Math.abs(t.diasRestantes)} días` : `${t.diasRestantes} días restantes`}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Recent Reports Pending Review */}
        <div>
          <h3 className="admin-inst-section-title">
            <FileSearch size={18} /> Reportes Esperando Revisión
          </h3>
          {reportesRecientes.length === 0 ? (
            <div className="admin-inst-empty">
              <FileSearch size={40} opacity={0.3} />
              <p>No hay reportes pendientes</p>
            </div>
          ) : (
            reportesRecientes.map(r => (
              <div key={r.id} style={{
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '14px',
                marginBottom: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ fontWeight: 700, color: '#0b2240', fontSize: '0.9rem' }}>
                    {r.tarea?.titulo}
                  </div>
                  <span className="admin-inst-badge admin-inst-badge--pendiente">Pendiente</span>
                </div>
                <p style={{ margin: '0 0 8px', fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5 }}>
                  {r.descripcion.length > 120 ? r.descripcion.substring(0, 120) + '...' : r.descripcion}
                </p>
                <div style={{ display: 'flex', gap: '12px', fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>
                  <span><Users size={11} style={{ verticalAlign: 'middle' }} /> {r.responsable?.nombre}</span>
                  <span><CalIcon size={11} style={{ verticalAlign: 'middle' }} /> {r.fecha}</span>
                  <span>👥 {r.beneficiados} beneficiados</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardAdminInst;
