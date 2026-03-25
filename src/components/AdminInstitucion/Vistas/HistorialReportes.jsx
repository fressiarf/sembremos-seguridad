import React, { useState, useEffect } from 'react';
import { adminInstitucionService } from '../../../services/adminInstitucionService';
import { useToast } from '../../../context/ToastContext';
import { useLogin } from '../../../context/LoginContext';
import { Clock, Users, Activity, CheckCircle, XCircle, AlertCircle, Image } from 'lucide-react';
import '../AdminInstitucion.css';

const HistorialReportes = () => {
  const { user } = useLogin();
  const [reportes, setReportes] = useState([]);
  const [responsables, setResponsables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    estado: 'Todos',
    responsableId: 'Todos',
    lineaId: 'Todos',
    trimestre: 'Todos',
  });
  const { showToast } = useToast();

  const loadData = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const [historial, resps] = await Promise.all([
        adminInstitucionService.getHistorial({ ...filtros, institucionId: user.id }),
        adminInstitucionService.getResponsables()
      ]);
      setReportes(historial);
      setResponsables(resps);
    } catch (e) {
      showToast('Error al cargar historial', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [filtros, user?.id]);

  const handleFiltro = (key, value) => {
    setFiltros(prev => ({ ...prev, [key]: value }));
  };

  const getEstadoIcon = (estado) => {
    if (estado === 'aprobado') return <CheckCircle size={14} color="#22c55e" />;
    if (estado === 'rechazado') return <XCircle size={14} color="#ef4444" />;
    return <AlertCircle size={14} color="#f59e0b" />;
  };

  const getEstadoBadgeClass = (estado) => {
    if (estado === 'aprobado') return 'admin-inst-badge--aprobado';
    if (estado === 'rechazado') return 'admin-inst-badge--rechazado';
    return 'admin-inst-badge--pendiente';
  };

  if (loading) return <div style={{ padding: '3rem', color: '#7a9cc4' }}>Cargando historial...</div>;

  return (
    <div style={{ padding: '2rem 2.5rem', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', margin: '0 0 4px', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
          Historial de Reportes
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', margin: 0, textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>
          Registro completo de todos los reportes de tu institución.
        </p>
      </div>

      {/* Filters */}
      <div className="admin-inst-filters">
        <select className="admin-inst-select" value={filtros.estado} onChange={e => handleFiltro('estado', e.target.value)}>
          <option value="Todos">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="aprobado">Aprobado</option>
          <option value="rechazado">Rechazado</option>
        </select>

        <select className="admin-inst-select" value={filtros.responsableId} onChange={e => handleFiltro('responsableId', e.target.value)}>
          <option value="Todos">Todos los responsables</option>
          {responsables.map(r => (
            <option key={r.id} value={r.id}>{r.nombre}</option>
          ))}
        </select>

        <select className="admin-inst-select" value={filtros.lineaId} onChange={e => handleFiltro('lineaId', e.target.value)}>
          <option value="Todos">Todas las líneas</option>
          <option value="linea-1">Línea #1 — Consumo de drogas</option>
          <option value="linea-3">Línea #3 — Personas en sit. de calle</option>
          <option value="linea-4">Línea #4 — Falta de inversión social</option>
        </select>

        <select className="admin-inst-select" value={filtros.trimestre} onChange={e => handleFiltro('trimestre', e.target.value)}>
          <option value="Todos">Todos los trimestres</option>
          <option value="I Trimestre 2025">I Trimestre 2025</option>
          <option value="II Trimestre 2025">II Trimestre 2025</option>
          <option value="III Trimestre 2025">III Trimestre 2025</option>
          <option value="IV Trimestre 2025">IV Trimestre 2025</option>
        </select>
      </div>

      {/* Table */}
      {reportes.length === 0 ? (
        <div className="admin-inst-empty">
          <Clock size={48} opacity={0.3} />
          <h3>No hay reportes con estos filtros</h3>
          <p>Ajusta los filtros para ver otros registros.</p>
        </div>
      ) : (
        <table className="admin-inst-historial-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Responsable</th>
              <th>Tarea / Acción Estratégica</th>
              <th>Línea</th>
              <th>Detalles de Ejecución</th>
              <th>Evidencia</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {reportes.map(r => (
              <tr key={r.id}>
                <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{r.fecha}</td>
                <td>
                  <div style={{ fontWeight: 600, color: '#0b2240' }}>{r.responsable?.nombre}</div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{r.responsable?.cargo}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 600, color: '#0b2240', marginBottom: '2px' }}>{r.tarea?.titulo}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{r.accionEstrategica}</div>
                  {r.observacionRechazo && (
                    <div style={{
                      marginTop: '6px',
                      padding: '6px 10px',
                      background: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      color: '#991b1b',
                    }}>
                      <strong>Observación:</strong> {r.observacionRechazo}
                    </div>
                  )}
                </td>
                <td>
                  <span className="admin-inst-meta-tag">
                    <Activity size={11} /> L#{r.tarea?.lineaNumero}
                  </span>
                </td>
                <td>
                  <div style={{ fontWeight: 700, color: '#0b2240', fontSize: '0.85rem' }}>👥 {r.beneficiados} asist.</div>
                  {r.tipoActividad && <div style={{ fontSize: '0.75rem', color: '#3b82f6', marginTop: '4px', fontWeight: 500 }}>🎯 {r.tipoActividad}</div>}
                  {r.inversionColones > 0 && <div style={{ fontSize: '0.75rem', color: '#16a34a', marginTop: '2px', fontWeight: 500 }}>💰 ₡{r.inversionColones.toLocaleString()}</div>}
                </td>
                <td>
                  {r.fotos && r.fotos.length > 0 ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: '#1e40af' }}>
                      <Image size={14} /> {r.fotos.length}
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>—</span>
                  )}
                </td>
                <td>
                  <span className={`admin-inst-badge ${getEstadoBadgeClass(r.estado)}`}>
                    {getEstadoIcon(r.estado)} {r.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default HistorialReportes;
