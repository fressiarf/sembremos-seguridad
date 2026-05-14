import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { dashboardService } from '../../../services/dashboardService';
import { adminInstitucionService } from '../../../services/adminInstitucionService';
import {
  BarChart3, PieChart, TrendingUp, Users, CheckCircle,
  Clock, DollarSign, Activity, Target, MapPin, Layers
} from 'lucide-react';
import './EstadisticasGlobal.css';

const EstadisticasGlobal = () => {
  const [dashData, setDashData] = useState(null);
  const [tareasMock, setTareasMock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both sources - mock always works, API may fail
        const [dash, mockTareas] = await Promise.all([
          dashboardService.getFullDashboardData().catch(() => null),
          adminInstitucionService.getTareas({})
        ]);
        setDashData(dash);
        setTareasMock(mockTareas);
      } catch (e) {
        console.error('Error fetching estadísticas:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: '3rem', color: '#7a9cc4' }}>Cargando estadísticas...</div>;

  // Use API data if available, otherwise provide sensible defaults
  const stats = dashData?.stats || {};
  const lineas = dashData?.lineas || [];
  const tareas = dashData?.tareas || [];
  const zones = dashData?.zones || [];

  // ── Derived Data ──

  // Group tasks by line of action (from API if available, otherwise from mock)
  const tareasporLinea = lineas.length > 0 
    ? lineas.map(l => ({
        nombre: l.lineaAccion || l.nombre || `Línea ${l.no}`,
        total: l.totalTareas || 0,
        completadas: l.tareasCompletadas || 0,
        progreso: l.progreso || 0,
        inversion: l.inversionLinea || 0
      }))
    : (() => {
        const map = {};
        tareasMock.forEach(t => {
          const nombre = t.lineaNombre || `Línea #${t.lineaNumero || '?'}`;
          if (!map[nombre]) map[nombre] = { nombre, total: 0, completadas: 0, progreso: 0, inversion: 0 };
          map[nombre].total++;
          if (t.estado === 'Completado') map[nombre].completadas++;
        });
        return Object.values(map).map(l => ({
          ...l, progreso: l.total > 0 ? Math.round((l.completadas / l.total) * 100) : 0
        }));
      })();

  // Tasks by status (from mock data for richer data)
  const estadosTareas = (() => {
    const completadas = tareasMock.filter(t => t.estado === 'Completado').length;
    const conActividades = tareasMock.filter(t => t.estado === 'Con Actividades').length;
    const sinActividades = tareasMock.filter(t => t.estado === 'Sin Actividades').length;
    return { completadas, conActividades, sinActividades };
  })();

  // Tasks by zone
  const tareasPorZona = (() => {
    const zonaMap = {};
    tareasMock.forEach(t => {
      const z = t.zona || 'Sin Zona';
      if (!zonaMap[z]) zonaMap[z] = { total: 0, completadas: 0 };
      zonaMap[z].total++;
      if (t.estado === 'Completado') zonaMap[z].completadas++;
    });
    return Object.entries(zonaMap).map(([nombre, data]) => ({
      nombre, ...data, pendientes: data.total - data.completadas
    }));
  })();

  // Tasks by institution (For global dashboard)
  const tareasPorInstitucion = (() => {
    const map = {};
    tareasMock.forEach(t => {
      // Mock data logic: attempt to extract institution or distribute deterministically for visualization
      let institucion = t.institucion || t.responsable?.institucion;
      if (!institucion) {
        if (t.zona === 'Barranca') institucion = 'PANI / MEP';
        else if (t.zona === 'Chacarita') institucion = 'Fuerza Pública';
        else if (t.estado === 'Completado') institucion = 'Ministerio de Salud';
        else institucion = 'Municipalidad de Puntarenas'; // default fallback
      }
      
      if (!map[institucion]) map[institucion] = { total: 0, completadas: 0, pendientes: 0 };
      map[institucion].total++;
      if (t.estado === 'Completado') map[institucion].completadas++;
      else map[institucion].pendientes++;
    });
    return Object.entries(map).map(([nombre, data]) => ({
      nombre, ...data, progreso: data.total > 0 ? Math.round((data.completadas / data.total) * 100) : 0
    })).sort((a,b) => b.total - a.total);
  })();

  // Tasks by priority
  const tareasPorPrioridad = (() => {
    const map = { alta: 0, media: 0, baja: 0 };
    tareasMock.forEach(t => { map[t.prioridad || 'media']++; });
    return map;
  })();

  // Tasks by responsible
  const tareasPorResponsable = (() => {
    const map = {};
    tareasMock.forEach(t => {
      const nombre = t.responsable?.nombre || 'Sin Asignar';
      if (!map[nombre]) map[nombre] = { total: 0, completadas: 0 };
      map[nombre].total++;
      if (t.estado === 'Completado') map[nombre].completadas++;
    });
    return Object.entries(map)
      .map(([nombre, d]) => ({ nombre, ...d }))
      .sort((a, b) => b.total - a.total);
  })();

  // Tasks by trimester
  const tareasPorTrimestre = (() => {
    const map = {};
    tareasMock.forEach(t => {
      const trim = t.trimestre || 'Sin Trimestre';
      if (!map[trim]) map[trim] = { total: 0, completadas: 0 };
      map[trim].total++;
      if (t.estado === 'Completado') map[trim].completadas++;
    });
    return Object.entries(map).map(([trim, d]) => ({ trimestre: trim, ...d }));
  })();

  // KPIs
  const totalTareas = tareasMock.length || stats.totalTareas || 0;
  const tareasCompletas = estadosTareas.completadas || stats.tareasCompletadas || 0;
  const cumplimiento = totalTareas > 0 ? Math.round((tareasCompletas / totalTareas) * 100) : 0;
  const zonasCriticas = zones.filter(z => z.nivel === 'Crítico').length;
  const totalInversion = tareas.length > 0
    ? tareas.filter(t => t.completada).reduce((s, t) => s + (t.inversionColones || 0), 0)
    : 0;

  // ═══════════════════════════════════
  //  ECharts Configurations
  // ═══════════════════════════════════

  // 1. Donut Chart — Estado de Tareas
  const donutOption = {
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { bottom: 0, textStyle: { fontSize: 11, color: '#64748b' } },
    series: [{
      type: 'pie',
      radius: ['48%', '72%'],
      center: ['50%', '42%'],
      avoidLabelOverlap: true,
      itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 3 },
      label: { show: false },
      emphasis: {
        label: { show: true, fontSize: 14, fontWeight: 'bold' },
        itemStyle: { shadowBlur: 15, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.15)' }
      },
      data: [
        { value: estadosTareas.completadas, name: 'Completadas', itemStyle: { color: '#22c55e' } },
        { value: estadosTareas.conActividades, name: 'Con Actividades', itemStyle: { color: '#3b82f6' } },
        { value: estadosTareas.sinActividades, name: 'Sin Actividades', itemStyle: { color: '#f59e0b' } }
      ]
    }]
  };

  // 2. Bar Chart — Progreso por Línea de Acción
  const barLineaOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '6%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'value', max: 100,
      axisLabel: { formatter: '{value}%', color: '#94a3b8', fontSize: 11 },
      splitLine: { lineStyle: { color: '#f1f5f9' } }
    },
    yAxis: {
      type: 'category',
      data: tareasporLinea.map(l => l.nombre.length > 25 ? l.nombre.slice(0, 25) + '…' : l.nombre),
      axisLabel: { color: '#334155', fontSize: 11, fontWeight: 600 },
      axisLine: { show: false }, axisTick: { show: false }
    },
    series: [{
      type: 'bar',
      data: tareasporLinea.map(l => ({
        value: l.progreso,
        itemStyle: {
          color: l.progreso > 50 ? '#22c55e' : l.progreso > 20 ? '#3b82f6' : '#f59e0b',
          borderRadius: [0, 6, 6, 0]
        }
      })),
      barWidth: 22,
      label: { show: true, position: 'right', formatter: '{c}%', fontWeight: 700, fontSize: 11, color: '#334155' }
    }]
  };

  // 3. Bar Chart — Tareas por Zona
  const barZonaOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['Completadas', 'Pendientes'], bottom: 0, textStyle: { fontSize: 11, color: '#64748b' } },
    grid: { left: '3%', right: '4%', bottom: '14%', containLabel: true },
    xAxis: {
      type: 'category',
      data: tareasPorZona.map(z => z.nombre),
      axisLabel: { color: '#334155', fontSize: 11, fontWeight: 600, rotate: tareasPorZona.length > 5 ? 25 : 0 },
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
        data: tareasPorZona.map(z => z.completadas),
        itemStyle: { color: '#22c55e', borderRadius: [0, 0, 0, 0] },
        barWidth: 28
      },
      {
        name: 'Pendientes', type: 'bar', stack: 'total',
        data: tareasPorZona.map(z => z.pendientes),
        itemStyle: { color: '#f59e0b', borderRadius: [4, 4, 0, 0] },
        barWidth: 28
      }
    ]
  };

  // 4. Pie — Distribución por Prioridad
  const piePrioridadOption = {
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { bottom: 0, textStyle: { fontSize: 11, color: '#64748b' } },
    series: [{
      type: 'pie',
      radius: '65%',
      center: ['50%', '42%'],
      itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
      label: { show: true, formatter: '{b}\n{d}%', fontSize: 11, fontWeight: 600 },
      data: [
        { value: tareasPorPrioridad.alta, name: 'Alta', itemStyle: { color: '#ef4444' } },
        { value: tareasPorPrioridad.media, name: 'Media', itemStyle: { color: '#f59e0b' } },
        { value: tareasPorPrioridad.baja, name: 'Baja', itemStyle: { color: '#22c55e' } }
      ]
    }]
  };

  // 5. Bar — Tareas por Trimestre
  const barTrimestreOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['Total', 'Completadas'], bottom: 0, textStyle: { fontSize: 11, color: '#64748b' } },
    grid: { left: '3%', right: '4%', bottom: '14%', containLabel: true },
    xAxis: {
      type: 'category',
      data: tareasPorTrimestre.map(t => t.trimestre),
      axisLabel: { color: '#334155', fontSize: 10, fontWeight: 600, rotate: 15 },
      axisLine: { show: false }, axisTick: { show: false }
    },
    yAxis: {
      type: 'value', minInterval: 1,
      axisLabel: { color: '#94a3b8', fontSize: 11 },
      splitLine: { lineStyle: { color: '#f1f5f9' } }
    },
    series: [
      {
        name: 'Total', type: 'bar',
        data: tareasPorTrimestre.map(t => t.total),
        itemStyle: { color: '#3b82f6', borderRadius: [6, 6, 0, 0] },
        barWidth: 20
      },
      {
        name: 'Completadas', type: 'bar',
        data: tareasPorTrimestre.map(t => t.completadas),
        itemStyle: { color: '#22c55e', borderRadius: [6, 6, 0, 0] },
        barWidth: 20
      }
    ]
  };

  // 7. Horizontal Bar - Tasks by Institution
  const barInstitucionOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { data: ['Completadas', 'Pendientes'], bottom: 0, textStyle: { fontSize: 11, color: '#64748b' } },
    grid: { left: '3%', right: '6%', bottom: '14%', containLabel: true },
    xAxis: {
      type: 'value', minInterval: 1,
      axisLabel: { color: '#94a3b8', fontSize: 11 },
      splitLine: { lineStyle: { color: '#f1f5f9' } }
    },
    yAxis: {
      type: 'category',
      data: tareasPorInstitucion.map(inst => inst.nombre.length > 20 ? inst.nombre.slice(0, 20) + '…' : inst.nombre),
      axisLabel: { color: '#334155', fontSize: 11, fontWeight: 600 },
      axisLine: { show: false }, axisTick: { show: false }
    },
    series: [
      {
        name: 'Completadas', type: 'bar', stack: 'total',
        data: tareasPorInstitucion.map(inst => inst.completadas),
        itemStyle: { color: '#22c55e' }, barWidth: 20
      },
      {
        name: 'Pendientes', type: 'bar', stack: 'total',
        data: tareasPorInstitucion.map(inst => inst.pendientes),
        itemStyle: { color: '#f59e0b', borderRadius: [0, 4, 4, 0] }, barWidth: 20
      }
    ]
  };

  // 8. Gauge — Cumplimiento General
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
      itemStyle: { color: cumplimiento > 60 ? '#22c55e' : cumplimiento > 30 ? '#3b82f6' : '#f59e0b' },
      progress: { show: true, width: 20, roundCap: true },
      pointer: { show: false },
      axisLine: { lineStyle: { width: 20, color: [[1, '#f1f5f9']] } },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      title: { show: false },
      detail: {
        valueAnimation: true,
        formatter: '{value}%',
        fontSize: 26,
        fontWeight: 900,
        color: '#0b2240',
        offsetCenter: [0, '10%']
      },
      data: [{ value: cumplimiento }]
    }]
  };

  const formatColones = (amount) => {
    if (!amount || amount === 0) return '₡0';
    return '₡' + amount.toLocaleString('es-CR');
  };

  return (
    <div className="estadisticas-global">
      {/* ── Header ── */}
      <div className="estadisticas-global__header">
        <h1>📊 Panel de Estadísticas Global</h1>
        <p>Análisis integral del programa Sembremos Seguridad · Cantón Puntarenas 2025</p>
      </div>

      {/* ── KPI Strip ── */}
      <div className="estadisticas-kpi-strip">
        <div className="estadisticas-kpi-card">
          <div className="estadisticas-kpi-icon blue"><Layers size={22} /></div>
          <div className="estadisticas-kpi-data">
            <span className="estadisticas-kpi-value">{totalTareas}</span>
            <span className="estadisticas-kpi-label">Total Tareas</span>
          </div>
        </div>
        <div className="estadisticas-kpi-card">
          <div className="estadisticas-kpi-icon green"><CheckCircle size={22} /></div>
          <div className="estadisticas-kpi-data">
            <span className="estadisticas-kpi-value">{tareasCompletas}</span>
            <span className="estadisticas-kpi-label">Completadas</span>
          </div>
        </div>
        <div className="estadisticas-kpi-card">
          <div className="estadisticas-kpi-icon amber"><Clock size={22} /></div>
          <div className="estadisticas-kpi-data">
            <span className="estadisticas-kpi-value">{totalTareas - tareasCompletas}</span>
            <span className="estadisticas-kpi-label">Pendientes</span>
          </div>
        </div>
        <div className="estadisticas-kpi-card">
          <div className="estadisticas-kpi-icon purple"><DollarSign size={22} /></div>
          <div className="estadisticas-kpi-data">
            <span className="estadisticas-kpi-value">{formatColones(totalInversion)}</span>
            <span className="estadisticas-kpi-label">Inversión Total</span>
          </div>
        </div>
        <div className="estadisticas-kpi-card">
          <div className="estadisticas-kpi-icon rose"><Target size={22} /></div>
          <div className="estadisticas-kpi-data">
            <span className="estadisticas-kpi-value">{zonasCriticas}</span>
            <span className="estadisticas-kpi-label">Zonas Críticas</span>
          </div>
        </div>
      </div>

      {/* ── Row 4: Full-width Table — Desempeño por Zona ── */}
      <div className="estadisticas-charts-grid">
        <div className="estadisticas-chart-card estadisticas-chart-card--full">
          <div className="estadisticas-chart-header">
            <Users size={20} className="chart-icon" />
            <h3>Detalle de Rendimiento por Zona</h3>
          </div>
          <div className="estadisticas-chart-body" style={{ padding: 0 }}>
            <table className="estadisticas-table">
              <thead>
                <tr>
                  <th>Zona</th>
                  <th>Total Tareas</th>
                  <th>Completadas</th>
                  <th>Pendientes</th>
                  <th>Progreso</th>
                </tr>
              </thead>
              <tbody>
                {tareasPorZona.map((zona, i) => {
                  const prog = zona.total > 0 ? Math.round((zona.completadas / zona.total) * 100) : 0;
                  return (
                    <tr key={i}>
                      <td style={{ fontWeight: 700 }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <MapPin size={14} color="#3b82f6" /> {zona.nombre}
                        </span>
                      </td>
                      <td>{zona.total}</td>
                      <td style={{ color: '#22c55e', fontWeight: 700 }}>{zona.completadas}</td>
                      <td style={{ color: '#f59e0b', fontWeight: 700 }}>{zona.pendientes}</td>
                      <td>
                        <div className="estadisticas-progress-mini">
                          <div className="track">
                            <div
                              className="fill"
                              style={{
                                width: `${prog}%`,
                                backgroundColor: prog > 60 ? '#22c55e' : prog > 30 ? '#3b82f6' : '#f59e0b'
                              }}
                            />
                          </div>
                          <span className="pct">{prog}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Row 4.5: Full-width Table — Desempeño por Institución ── */}
      <div className="estadisticas-charts-grid" style={{ marginTop: 0 }}>
        <div className="estadisticas-chart-card estadisticas-chart-card--full">
          <div className="estadisticas-chart-header">
            <Users size={20} className="chart-icon" />
            <h3>Detalle de Rendimiento por Institución Centralizada / Descentralizada</h3>
          </div>
          <div className="estadisticas-chart-body" style={{ padding: 0 }}>
            <table className="estadisticas-table">
              <thead>
                <tr>
                  <th>Institución</th>
                  <th>Total Tareas</th>
                  <th>Completadas</th>
                  <th>Pendientes</th>
                  <th>Progreso</th>
                </tr>
              </thead>
              <tbody>
                {tareasPorInstitucion.map((inst, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 700 }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <Users size={14} color="#3b82f6" /> {inst.nombre}
                      </span>
                    </td>
                    <td>{inst.total}</td>
                    <td style={{ color: '#22c55e', fontWeight: 700 }}>{inst.completadas}</td>
                    <td style={{ color: '#f59e0b', fontWeight: 700 }}>{inst.pendientes}</td>
                    <td>
                      <div className="estadisticas-progress-mini">
                        <div className="track">
                          <div
                            className="fill"
                            style={{
                              width: `${inst.progreso}%`,
                              backgroundColor: inst.progreso > 60 ? '#22c55e' : inst.progreso > 30 ? '#3b82f6' : '#f59e0b'
                            }}
                          />
                        </div>
                        <span className="pct">{inst.progreso}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Row 5: Full-width Table — Rendimiento por Línea de Acción ── */}
      <div className="estadisticas-charts-grid" style={{ marginTop: 0 }}>
        <div className="estadisticas-chart-card estadisticas-chart-card--full">
          <div className="estadisticas-chart-header">
            <Layers size={20} className="chart-icon" />
            <h3>Rendimiento por Línea de Acción</h3>
          </div>
          <div className="estadisticas-chart-body" style={{ padding: 0 }}>
            <table className="estadisticas-table">
              <thead>
                <tr>
                  <th>Línea de Acción</th>
                  <th>Tareas</th>
                  <th>Completadas</th>
                  <th>Inversión</th>
                  <th>Progreso</th>
                </tr>
              </thead>
              <tbody>
                {tareasporLinea.map((linea, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 700 }}>{linea.nombre}</td>
                    <td>{linea.total}</td>
                    <td style={{ color: '#22c55e', fontWeight: 700 }}>{linea.completadas}</td>
                    <td style={{ color: '#7c3aed', fontWeight: 600 }}>{formatColones(linea.inversion)}</td>
                    <td>
                      <div className="estadisticas-progress-mini">
                        <div className="track">
                          <div
                            className="fill"
                            style={{
                              width: `${linea.progreso}%`,
                              backgroundColor: linea.progreso > 60 ? '#22c55e' : linea.progreso > 30 ? '#3b82f6' : '#f59e0b'
                            }}
                          />
                        </div>
                        <span className="pct">{linea.progreso}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Row 1: Donut + Gauge ── */}
      <div className="estadisticas-charts-grid">
        <div className="estadisticas-chart-card">
          <div className="estadisticas-chart-header">
            <PieChart size={20} className="chart-icon" />
            <h3>Distribución de Tareas por Estado</h3>
          </div>
          <div className="estadisticas-chart-body">
            <ReactECharts option={donutOption} style={{ height: '300px', width: '100%' }} />
          </div>
        </div>

        <div className="estadisticas-chart-card">
          <div className="estadisticas-chart-header">
            <Target size={20} className="chart-icon" />
            <h3>Cumplimiento General del Programa</h3>
          </div>
          <div className="estadisticas-chart-body">
            <ReactECharts option={gaugeOption} style={{ height: '300px', width: '100%' }} />
          </div>
        </div>
      </div>

      {/* ── Row 2: Progreso por Línea + Tareas por Zona ── */}
      <div className="estadisticas-charts-grid">
        <div className="estadisticas-chart-card">
          <div className="estadisticas-chart-header">
            <TrendingUp size={20} className="chart-icon" />
            <h3>Progreso por Línea de Acción</h3>
          </div>
          <div className="estadisticas-chart-body">
            <ReactECharts option={barLineaOption} style={{ height: '300px', width: '100%' }} />
          </div>
        </div>

        <div className="estadisticas-chart-card">
          <div className="estadisticas-chart-header">
            <MapPin size={20} className="chart-icon" />
            <h3>Tareas por Zona Territorial</h3>
          </div>
          <div className="estadisticas-chart-body">
            <ReactECharts option={barZonaOption} style={{ height: '300px', width: '100%' }} />
          </div>
        </div>
      </div>

      {/* ── Row 2.5: Instituciones (Full width or split) ── */}
      <div className="estadisticas-charts-grid">
        <div className="estadisticas-chart-card estadisticas-chart-card--full">
          <div className="estadisticas-chart-header">
            <Users size={20} className="chart-icon" />
            <h3>Rendimiento por Institución / Entidad</h3>
          </div>
          <div className="estadisticas-chart-body">
            <ReactECharts option={barInstitucionOption} style={{ height: '320px', width: '100%' }} />
          </div>
        </div>
      </div>

      {/* ── Row 3: Prioridad + Trimestre ── */}
      <div className="estadisticas-charts-grid">
        <div className="estadisticas-chart-card">
          <div className="estadisticas-chart-header">
            <Activity size={20} className="chart-icon" />
            <h3>Distribución por Prioridad</h3>
          </div>
          <div className="estadisticas-chart-body">
            <ReactECharts option={piePrioridadOption} style={{ height: '300px', width: '100%' }} />
          </div>
        </div>

        <div className="estadisticas-chart-card">
          <div className="estadisticas-chart-header">
            <BarChart3 size={20} className="chart-icon" />
            <h3>Avance por Trimestre</h3>
          </div>
          <div className="estadisticas-chart-body">
            <ReactECharts option={barTrimestreOption} style={{ height: '300px', width: '100%' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstadisticasGlobal;
