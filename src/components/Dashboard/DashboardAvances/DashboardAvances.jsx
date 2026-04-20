import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { dashboardService } from '../../../services/dashboardService';
import { editoresService } from '../../../services/editoresService';
import { useLogin } from '../../../context/LoginContext';
import {
  TrendingUp, Layers, CheckCircle, Target, DollarSign,
  ChevronDown, MapPin, Activity, BarChart3
} from 'lucide-react';
import './DashboardAvances.css';

/**
 * DashboardAvances — Visualización del avance desglosado
 * @param {string} scope - 'global' | 'institucion' | 'editor'
 *   - global: Todas las líneas y tareas (SuperAdmin)
 *   - institucion: Sólo las líneas/tareas de la institución del usuario (AdminInstitucion)
 *   - editor: Sólo las tareas asignadas al editor (Enlace Institucional)
 */
const DashboardAvances = ({ scope = 'global' }) => {
  const { user } = useLogin();
  const [lineas, setLineas] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [zonas, setZonas] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedLinea, setExpandedLinea] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (scope === 'editor') {
          // Editor: sólo sus tareas
          const data = await editoresService.getFullDashboardData(user?.id);
          if (data) {
            // Agrupar tareas del editor por línea de acción
            const tareasEditor = data.tareas || [];
            setTareas(tareasEditor);

            // Construir líneas sintéticas a partir de las tareas del editor
            const lineaMap = {};
            tareasEditor.forEach(t => {
              const lineaId = t.lineaAccionId || t.lineaId || 'N/A';
              if (!lineaMap[lineaId]) {
                lineaMap[lineaId] = {
                  id: lineaId,
                  no: t.lineaNumero || '?',
                  titulo: t.lineaNombre || `Línea #${t.lineaNumero || '?'}`,
                  problematica: '',
                  tareas: [],
                  totalTareas: 0,
                  tareasCompletadas: 0,
                  progreso: 0,
                  inversionLinea: 0
                };
              }
              lineaMap[lineaId].tareas.push(t);
              lineaMap[lineaId].totalTareas++;
              if (t.completada) lineaMap[lineaId].tareasCompletadas++;
              lineaMap[lineaId].inversionLinea += (t.inversionColones || 0);
            });
            const lineasSinteticas = Object.values(lineaMap).map(l => ({
              ...l,
              progreso: l.totalTareas > 0 ? Math.min(100, Math.round(
                l.tareas.reduce((s, t) => s + (t.progresoReal || 0), 0) / l.totalTareas
              )) : 0
            }));
            setLineas(lineasSinteticas);

            // Zonas del editor
            const zonasMap = {};
            tareasEditor.forEach(t => {
              const z = t.zona || 'Sin zona';
              if (!zonasMap[z]) zonasMap[z] = { nombre: z, total: 0, completadas: 0 };
              zonasMap[z].total++;
              if (t.completada) zonasMap[z].completadas++;
            });
            setZonas(Object.values(zonasMap));

            setStats({
              totalLineas: lineasSinteticas.length,
              totalTareas: data.estadisticas?.totalTareas || tareasEditor.length,
              tareasCompletadas: data.estadisticas?.completadas || 0,
              inversionTotal: data.estadisticas?.inversionTotal || 0,
              cumplimiento: data.estadisticas?.progresoGeneral || 0
            });
          }
        } else {
          // Global o Institución: usar dashboardService
          const dashData = await dashboardService.getFullDashboardData();
          if (dashData) {
            let filteredLineas = dashData.lineas || [];
            let filteredTareas = dashData.tareas || [];
            let filteredZones = dashData.zones || [];

            // Filtrar por institución si es adminInstitucion
            if (scope === 'institucion' && user?.institucion) {
              const instName = user.institucion;
              filteredTareas = filteredTareas.filter(t =>
                t.institucionNombre === instName ||
                (t.corresponsables && t.corresponsables.includes(instName))
              );
              // Rebuildar líneas con solo las tareas de la institución
              filteredLineas = filteredLineas.map(l => {
                const tareasLinea = filteredTareas.filter(t => t.lineaAccionId === l.id);
                if (tareasLinea.length === 0) return null;
                const progresoTotal = tareasLinea.reduce((s, t) => s + (t.progresoReal || 0), 0);
                return {
                  ...l,
                  tareas: tareasLinea,
                  totalTareas: tareasLinea.length,
                  tareasCompletadas: tareasLinea.filter(t => t.completada).length,
                  progreso: Math.min(100, Math.round(progresoTotal / tareasLinea.length)),
                  inversionLinea: tareasLinea.reduce((s, t) => s + (t.inversionColones || 0), 0)
                };
              }).filter(Boolean);

              // Zonas from filtered tasks
              const zonasMap = {};
              filteredTareas.forEach(t => {
                const z = t.zona || 'Sin zona';
                if (!zonasMap[z]) zonasMap[z] = { nombre: z, total: 0, completadas: 0 };
                zonasMap[z].total++;
                if (t.completada) zonasMap[z].completadas++;
              });
              filteredZones = Object.values(zonasMap);
            } else {
              // Global: construir zonas desde las tareas
              const zonasMap = {};
              filteredTareas.forEach(t => {
                const z = t.zona || 'Sin zona';
                if (!zonasMap[z]) zonasMap[z] = { nombre: z, total: 0, completadas: 0 };
                zonasMap[z].total++;
                if (t.completada) zonasMap[z].completadas++;
              });
              filteredZones = Object.values(zonasMap);
            }

            setLineas(filteredLineas);
            setTareas(filteredTareas);
            setZonas(filteredZones);

            const totalTareas = filteredTareas.length;
            const tareasComp = filteredTareas.filter(t => t.completada).length;
            const invTotal = filteredTareas.filter(t => t.completada).reduce((s, t) => s + (t.inversionColones || 0), 0);
            setStats({
              totalLineas: filteredLineas.length,
              totalTareas,
              tareasCompletadas: tareasComp,
              inversionTotal: invTotal,
              cumplimiento: totalTareas > 0 ? Math.min(100, Math.round((tareasComp / totalTareas) * 100)) : 0
            });
          }
        }
      } catch (error) {
        console.error('Error cargando datos de avances:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [scope, user?.id, user?.institucion]);

  // ── Helpers ──
  const formatColones = (amount) => {
    if (!amount || amount === 0) return '₡0';
    return '₡' + amount.toLocaleString('es-CR');
  };

  const getProgressColor = (pct) => {
    if (pct > 60) return '#22c55e';
    if (pct > 30) return '#3b82f6';
    return '#f59e0b';
  };

  const getTaskBadgeClass = (tarea) => {
    if (tarea.completada) return 'completada';
    if (tarea.estado === 'Con Actividades' || tarea.estado === 'En Proceso') return 'en-proceso';
    return 'pendiente';
  };

  const getTaskBadgeLabel = (tarea) => {
    if (tarea.completada) return 'Completada';
    return tarea.estado || 'Pendiente';
  };

  // Avance total general (promedio de todas las líneas, capped at 100%)
  const avanceGeneral = lineas.length > 0
    ? Math.min(100, Math.round(lineas.reduce((s, l) => s + (l.progreso || 0), 0) / lineas.length))
    : 0;

  // ── Scope labels ──
  const scopeLabels = {
    global: { title: 'Dashboard de Avances del Programa', subtitle: 'Avance general de todas las líneas estratégicas · Sembremos Seguridad' },
    institucion: { title: `Avances de ${user?.institucion || 'Mi Institución'}`, subtitle: 'Progreso de las líneas y tareas asignadas a tu institución' },
    editor: { title: 'Mi Avance Personal', subtitle: 'Progreso individual de las tareas asignadas a tu perfil' }
  };

  // ═══════════════════════
  //  ECharts Configurations
  // ═══════════════════════

  // Gauge — Avance Total
  const gaugeOption = {
    series: [{
      type: 'gauge',
      startAngle: 200,
      endAngle: -20,
      min: 0,
      max: 100,
      splitNumber: 10,
      radius: '90%',
      center: ['50%', '55%'],
      itemStyle: { color: getProgressColor(avanceGeneral) },
      progress: { show: true, width: 22, roundCap: true },
      pointer: { show: false },
      axisLine: { lineStyle: { width: 22, color: [[1, '#f1f5f9']] } },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      title: { show: false },
      detail: {
        valueAnimation: true,
        formatter: '{value}%',
        fontSize: 32,
        fontWeight: 900,
        color: '#0b2240',
        offsetCenter: [0, '10%']
      },
      data: [{ value: avanceGeneral }]
    }]
  };

  // Bar — Avance por Línea de Acción
  const barLineasOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '8%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'value', max: 100,
      axisLabel: { formatter: '{value}%', color: '#94a3b8', fontSize: 11 },
      splitLine: { lineStyle: { color: '#f1f5f9' } }
    },
    yAxis: {
      type: 'category',
      data: lineas.map(l => {
        const name = l.titulo || `Línea ${l.no}`;
        return name.length > 30 ? name.slice(0, 30) + '…' : name;
      }),
      axisLabel: { color: '#334155', fontSize: 11, fontWeight: 600 },
      axisLine: { show: false }, axisTick: { show: false }
    },
    series: [{
      type: 'bar',
      data: lineas.map(l => ({
        value: Math.min(100, l.progreso || 0),
        itemStyle: {
          color: getProgressColor(l.progreso),
          borderRadius: [0, 6, 6, 0]
        }
      })),
      barWidth: 22,
      label: { show: true, position: 'right', formatter: '{c}%', fontWeight: 700, fontSize: 11, color: '#334155' }
    }]
  };

  // Bar — Desglose por Zona
  const barZonasOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['Completadas', 'Pendientes'], bottom: 0, textStyle: { fontSize: 11, color: '#64748b' } },
    grid: { left: '3%', right: '4%', bottom: '14%', containLabel: true },
    xAxis: {
      type: 'category',
      data: zonas.map(z => z.nombre),
      axisLabel: { color: '#334155', fontSize: 11, fontWeight: 600, rotate: zonas.length > 5 ? 20 : 0 },
      axisLine: { show: false }, axisTick: { show: false }
    },
    yAxis: {
      type: 'value', minInterval: 1,
      axisLabel: { color: '#94a3b8', fontSize: 11 },
      splitLine: { lineStyle: { color: '#f1f5f9' } }
    },
    series: [
      {
        name: 'Completadas', type: 'bar', stack: 'total',
        data: zonas.map(z => z.completadas || 0),
        itemStyle: { color: '#22c55e' }, barWidth: 30
      },
      {
        name: 'Pendientes', type: 'bar', stack: 'total',
        data: zonas.map(z => (z.total || 0) - (z.completadas || 0)),
        itemStyle: { color: '#f59e0b', borderRadius: [4, 4, 0, 0] }, barWidth: 30
      }
    ]
  };

  // ═══════════════
  //  RENDER
  // ═══════════════

  if (loading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: '#7a9cc4' }}>
        <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>Cargando avances...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-avances" id="dashboard-avances">

      {/* ── Header Banner ── */}
      <header className="avances-banner">
        <div className="banner-badge">DASHBOARD DE AVANCES</div>
        <h1>{scopeLabels[scope]?.title}</h1>
        <p>{scopeLabels[scope]?.subtitle}</p>
      </header>

      {/* ── KPI Strip ── */}
      <div className="avances-kpi-strip">
        <div className="avances-kpi-card">
          <div className="avances-kpi-icon blue"><Layers size={22} /></div>
          <div className="avances-kpi-data">
            <span className="avances-kpi-value">{stats.totalLineas || 0}</span>
            <span className="avances-kpi-label">Líneas de Acción</span>
          </div>
        </div>
        <div className="avances-kpi-card">
          <div className="avances-kpi-icon green"><Target size={22} /></div>
          <div className="avances-kpi-data">
            <span className="avances-kpi-value">{avanceGeneral}%</span>
            <span className="avances-kpi-label">Avance General</span>
          </div>
        </div>
        <div className="avances-kpi-card">
          <div className="avances-kpi-icon amber"><CheckCircle size={22} /></div>
          <div className="avances-kpi-data">
            <span className="avances-kpi-value">{stats.tareasCompletadas || 0}/{stats.totalTareas || 0}</span>
            <span className="avances-kpi-label">Tareas Completadas</span>
          </div>
        </div>
        <div className="avances-kpi-card">
          <div className="avances-kpi-icon purple"><DollarSign size={22} /></div>
          <div className="avances-kpi-data">
            <span className="avances-kpi-value">{formatColones(stats.inversionTotal)}</span>
            <span className="avances-kpi-label">Inversión Ejecutada</span>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="avances-body">

        {/* ── Gauge + Bar por Línea ── */}
        <div className="avances-charts-row">
          <div className="avances-chart-card">
            <div className="avances-chart-header">
              <Target size={20} className="chart-icon" />
              <h3>Avance Total del Programa</h3>
            </div>
            <div className="avances-chart-body">
              <ReactECharts option={gaugeOption} style={{ height: '280px', width: '100%' }} />
              <div style={{ textAlign: 'center', marginTop: '-10px' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                  Máximo: 100% · Promedio de {lineas.length} líneas estratégicas
                </span>
              </div>
            </div>
          </div>

          <div className="avances-chart-card">
            <div className="avances-chart-header">
              <TrendingUp size={20} className="chart-icon" />
              <h3>Avance por Línea de Acción</h3>
            </div>
            <div className="avances-chart-body">
              <ReactECharts option={barLineasOption} style={{ height: '300px', width: '100%' }} />
            </div>
          </div>
        </div>

        {/* ── Tabla de Avance Individual por Línea ── */}
        <div className="avances-chart-card avances-chart-card--full">
          <div className="avances-chart-header">
            <BarChart3 size={20} className="chart-icon" />
            <h3>Avance Individual por Línea de Acción</h3>
          </div>
          <div className="avances-chart-body" style={{ padding: 0 }}>
            <table className="avances-table">
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>N°</th>
                  <th>Nombre de Línea Estratégica</th>
                  <th style={{ textAlign: 'center' }}>Tareas</th>
                  <th>Progreso</th>
                  <th>Inversión</th>
                  <th style={{ width: '50px' }}></th>
                </tr>
              </thead>
              <tbody>
                {lineas.map((linea) => (
                  <React.Fragment key={linea.id}>
                    <tr>
                      <td className="col-number">{linea.no || '-'}</td>
                      <td className="col-linea">
                        {linea.titulo}
                        {linea.problematica && (
                          <span className="linea-sub">Línea de acción: {linea.problematica}</span>
                        )}
                      </td>
                      <td className="col-tasks">
                        <span className="completed">{linea.tareasCompletadas || 0}</span>
                        <span className="divider">/</span>
                        {linea.totalTareas || 0}
                      </td>
                      <td>
                        <div className="avances-progress-cell">
                          <div className="avances-progress-track">
                            <div
                              className="avances-progress-fill"
                              style={{
                                width: `${Math.min(100, linea.progreso || 0)}%`,
                                backgroundColor: getProgressColor(linea.progreso)
                              }}
                            />
                          </div>
                          <span className="avances-progress-pct" style={{ color: getProgressColor(linea.progreso) }}>
                            {Math.min(100, linea.progreso || 0)}%
                          </span>
                        </div>
                      </td>
                      <td className="col-inversion">{formatColones(linea.inversionLinea)}</td>
                      <td>
                        <button
                          className={`avances-expand-btn ${expandedLinea === linea.id ? 'rotated' : ''}`}
                          onClick={() => setExpandedLinea(expandedLinea === linea.id ? null : linea.id)}
                          title="Ver tareas"
                        >
                          <ChevronDown size={16} />
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Row — Tareas de esta línea */}
                    {expandedLinea === linea.id && linea.tareas && linea.tareas.length > 0 && (
                      <tr>
                        <td colSpan="6" style={{ padding: 0 }}>
                          <div className="avances-expand-content">
                            <div className="avances-expand-tasks">
                              {linea.tareas.map(t => (
                                <div key={t.id} className="avances-task-row">
                                  <div className="avances-task-info">
                                    <span className="avances-task-title">{t.titulo}</span>
                                    <span className="avances-task-inst">
                                      {t.institucionNombre || 'Sin asignar'} · {t.zona || 'Sin zona'}
                                    </span>
                                  </div>
                                  <div className="avances-task-meta">
                                    <span
                                      className="avances-task-pct"
                                      style={{ color: getProgressColor(t.progresoReal || 0) }}
                                    >
                                      {Math.min(100, t.progresoReal || 0)}%
                                    </span>
                                    <span className={`avances-task-badge ${getTaskBadgeClass(t)}`}>
                                      {getTaskBadgeLabel(t)}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
                {lineas.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                      No hay líneas de acción para mostrar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Total General Footer */}
            {lineas.length > 0 && (
              <div className="avances-total-footer">
                <div className="avances-total-label">
                  Avance Total General
                  <strong>Promedio ponderado de todas las líneas (máximo 100%)</strong>
                </div>
                <div className="avances-total-right">
                  <div className="avances-total-bar">
                    <div className="avances-total-bar-fill" style={{ width: `${avanceGeneral}%` }} />
                  </div>
                  <span className="avances-total-pct">{avanceGeneral}%</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Desglose por Zona ── */}
        <div className="avances-charts-row">
          <div className="avances-chart-card">
            <div className="avances-chart-header">
              <MapPin size={20} className="chart-icon" />
              <h3>Desglose de Avance por Zona</h3>
            </div>
            <div className="avances-chart-body" style={{ padding: 0 }}>
              <table className="avances-table">
                <thead>
                  <tr>
                    <th>Zona</th>
                    <th style={{ textAlign: 'center' }}>Total</th>
                    <th style={{ textAlign: 'center' }}>Completadas</th>
                    <th style={{ textAlign: 'center' }}>Pendientes</th>
                    <th>Progreso</th>
                  </tr>
                </thead>
                <tbody>
                  {zonas.map((zona, i) => {
                    const prog = zona.total > 0 ? Math.min(100, Math.round((zona.completadas / zona.total) * 100)) : 0;
                    const pendientes = zona.total - (zona.completadas || 0);
                    return (
                      <tr key={i}>
                        <td style={{ fontWeight: 700 }}>
                          <div className="avances-zona-row">
                            <div className="avances-zona-dot" style={{ backgroundColor: getProgressColor(prog) }} />
                            {zona.nombre}
                          </div>
                        </td>
                        <td style={{ textAlign: 'center', fontWeight: 700 }}>{zona.total}</td>
                        <td style={{ textAlign: 'center', fontWeight: 700, color: '#22c55e' }}>{zona.completadas || 0}</td>
                        <td style={{ textAlign: 'center', fontWeight: 700, color: '#f59e0b' }}>{pendientes}</td>
                        <td>
                          <div className="avances-progress-cell">
                            <div className="avances-progress-track">
                              <div
                                className="avances-progress-fill"
                                style={{ width: `${prog}%`, backgroundColor: getProgressColor(prog) }}
                              />
                            </div>
                            <span className="avances-progress-pct" style={{ color: getProgressColor(prog) }}>
                              {prog}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {zonas.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                        No hay zonas con tareas asignadas.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="avances-chart-card">
            <div className="avances-chart-header">
              <Activity size={20} className="chart-icon" />
              <h3>Tareas por Zona (Gráfico)</h3>
            </div>
            <div className="avances-chart-body">
              <ReactECharts option={barZonasOption} style={{ height: '300px', width: '100%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAvances;
