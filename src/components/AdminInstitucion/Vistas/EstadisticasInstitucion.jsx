import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { adminInstitucionService } from '../../../services/adminInstitucionService';
import { useLogin } from '../../../context/LoginContext';
import { useToast } from '../../../context/ToastContext';
import {
  BarChart3, PieChart, TrendingUp, Users, CheckCircle,
  Clock, Target, Activity, MapPin, Layers, UserCheck
} from 'lucide-react';
import '../../Dashboard/Estadisticas/EstadisticasGlobal.css';

const EstadisticasInstitucion = () => {
  const { user } = useLogin();
  const { showToast } = useToast();
  const [tareas, setTareas] = useState([]);
  const [responsables, setResponsables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      try {
        const [tareasData, respData] = await Promise.all([
          adminInstitucionService.getTareas({ institucionId: user.id }),
          adminInstitucionService.getResponsables()
        ]);
        setTareas(tareasData);
        setResponsables(respData);
      } catch (e) {
        console.error('Error fetching estadísticas institución:', e);
        showToast('Error al cargar estadísticas', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.id]);

  if (loading) return <div style={{ padding: '3rem', color: '#7a9cc4' }}>Cargando estadísticas...</div>;

  // ── Derived Data ──
  const totalTareas = tareas.length;
  const completadas = tareas.filter(t => t.estado === 'Completado').length;
  const conActividades = tareas.filter(t => t.estado === 'Con Actividades').length;
  const sinActividades = tareas.filter(t => t.estado === 'Sin Actividades').length;
  const cumplimiento = totalTareas > 0 ? Math.round((completadas / totalTareas) * 100) : 0;

  // Tasks by responsible (editor/funcionario)
  const tareasPorResponsable = (() => {
    const map = {};
    tareas.forEach(t => {
      const resp = responsables.find(r => r.id === t.responsableId);
      const nombre = resp?.nombre || 'Sin Asignar';
      if (!map[nombre]) map[nombre] = { total: 0, completadas: 0, conActividades: 0, sinActividades: 0, cargo: resp?.cargo || '' };
      map[nombre].total++;
      if (t.estado === 'Completado') map[nombre].completadas++;
      else if (t.estado === 'Con Actividades') map[nombre].conActividades++;
      else map[nombre].sinActividades++;
    });
    return Object.entries(map)
      .map(([nombre, d]) => ({ nombre, ...d, progreso: d.total > 0 ? Math.round((d.completadas / d.total) * 100) : 0 }))
      .sort((a, b) => b.total - a.total);
  })();

  // Tasks by line of action
  const tareasPorLinea = (() => {
    const map = {};
    tareas.forEach(t => {
      const nombre = t.lineaNombre || `Línea #${t.lineaNumero || '?'}`;
      if (!map[nombre]) map[nombre] = { total: 0, completadas: 0 };
      map[nombre].total++;
      if (t.estado === 'Completado') map[nombre].completadas++;
    });
    return Object.entries(map).map(([nombre, d]) => ({
      nombre, ...d, progreso: d.total > 0 ? Math.round((d.completadas / d.total) * 100) : 0
    }));
  })();

  // Tasks by zone
  const tareasPorZona = (() => {
    const map = {};
    tareas.forEach(t => {
      const z = t.zona || 'Sin Zona';
      if (!map[z]) map[z] = { total: 0, completadas: 0 };
      map[z].total++;
      if (t.estado === 'Completado') map[z].completadas++;
    });
    return Object.entries(map).map(([nombre, d]) => ({
      nombre, ...d, pendientes: d.total - d.completadas
    }));
  })();

  // Tasks by priority
  const tareasPorPrioridad = (() => {
    const map = { alta: 0, media: 0, baja: 0 };
    tareas.forEach(t => { map[t.prioridad || 'media']++; });
    return map;
  })();

  // ═══════════════════════════════════
  //  ECharts Configurations
  // ═══════════════════════════════════

  // 1. Donut — Estado de Tareas
  const donutOption = {
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { bottom: 0, textStyle: { fontSize: 11, color: '#64748b' } },
    series: [{
      type: 'pie',
      radius: ['48%', '72%'],
      center: ['50%', '42%'],
      itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 3 },
      label: { show: false },
      emphasis: {
        label: { show: true, fontSize: 14, fontWeight: 'bold' },
        itemStyle: { shadowBlur: 15, shadowColor: 'rgba(0,0,0,0.15)' }
      },
      data: [
        { value: completadas, name: 'Completadas', itemStyle: { color: '#22c55e' } },
        { value: conActividades, name: 'Con Actividades', itemStyle: { color: '#3b82f6' } },
        { value: sinActividades, name: 'Sin Actividades', itemStyle: { color: '#f59e0b' } }
      ]
    }]
  };

  // 2. Gauge — Cumplimiento
  const gaugeOption = {
    series: [{
      type: 'gauge',
      startAngle: 200, endAngle: -20,
      min: 0, max: 100,
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
        valueAnimation: true, formatter: '{value}%',
        fontSize: 26, fontWeight: 900, color: '#0b2240', offsetCenter: [0, '10%']
      },
      data: [{ value: cumplimiento }]
    }]
  };

  // 3. Horizontal Bar — Rendimiento por Funcionario (Editor)
  const barResponsableOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { data: ['Completadas', 'En Proceso', 'Sin Actividad'], bottom: 0, textStyle: { fontSize: 10, color: '#64748b' } },
    grid: { left: '3%', right: '4%', bottom: '14%', containLabel: true },
    xAxis: {
      type: 'value', minInterval: 1,
      axisLabel: { color: '#94a3b8', fontSize: 11 },
      splitLine: { lineStyle: { color: '#f1f5f9' } }
    },
    yAxis: {
      type: 'category',
      data: tareasPorResponsable.map(r => r.nombre.length > 20 ? r.nombre.slice(0, 20) + '…' : r.nombre),
      axisLabel: { color: '#334155', fontSize: 11, fontWeight: 600 },
      axisLine: { show: false }, axisTick: { show: false }
    },
    series: [
      {
        name: 'Completadas', type: 'bar', stack: 'total',
        data: tareasPorResponsable.map(r => r.completadas),
        itemStyle: { color: '#22c55e' }, barWidth: 18
      },
      {
        name: 'En Proceso', type: 'bar', stack: 'total',
        data: tareasPorResponsable.map(r => r.conActividades),
        itemStyle: { color: '#3b82f6' }, barWidth: 18
      },
      {
        name: 'Sin Actividad', type: 'bar', stack: 'total',
        data: tareasPorResponsable.map(r => r.sinActividades),
        itemStyle: { color: '#f59e0b', borderRadius: [0, 4, 4, 0] }, barWidth: 18
      }
    ]
  };

  // 4. Bar — Tareas por Zona
  const barZonaOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['Completadas', 'Pendientes'], bottom: 0, textStyle: { fontSize: 11, color: '#64748b' } },
    grid: { left: '3%', right: '4%', bottom: '14%', containLabel: true },
    xAxis: {
      type: 'category',
      data: tareasPorZona.map(z => z.nombre),
      axisLabel: { color: '#334155', fontSize: 11, fontWeight: 600 },
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
        itemStyle: { color: '#22c55e' }, barWidth: 28
      },
      {
        name: 'Pendientes', type: 'bar', stack: 'total',
        data: tareasPorZona.map(z => z.pendientes),
        itemStyle: { color: '#f59e0b', borderRadius: [4, 4, 0, 0] }, barWidth: 28
      }
    ]
  };

  // 5. Pie — Prioridad
  const piePrioridadOption = {
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { bottom: 0, textStyle: { fontSize: 11, color: '#64748b' } },
    series: [{
      type: 'pie', radius: '65%', center: ['50%', '42%'],
      itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
      label: { show: true, formatter: '{b}\n{d}%', fontSize: 11, fontWeight: 600 },
      data: [
        { value: tareasPorPrioridad.alta, name: 'Alta', itemStyle: { color: '#ef4444' } },
        { value: tareasPorPrioridad.media, name: 'Media', itemStyle: { color: '#f59e0b' } },
        { value: tareasPorPrioridad.baja, name: 'Baja', itemStyle: { color: '#22c55e' } }
      ]
    }]
  };

  // 6. Progress per Linea — Horizontal Bar
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
      data: tareasPorLinea.map(l => l.nombre.length > 28 ? l.nombre.slice(0, 28) + '…' : l.nombre),
      axisLabel: { color: '#334155', fontSize: 11, fontWeight: 600 },
      axisLine: { show: false }, axisTick: { show: false }
    },
    series: [{
      type: 'bar',
      data: tareasPorLinea.map(l => ({
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

  const institucionNombre = user?.institucion || 'Mi Institución';

  return (
    <div className="estadisticas-global">
      {/* ── Header ── */}
      <div className="estadisticas-global__header">
        <h1>📊 Estadísticas de {institucionNombre}</h1>
        <p>Rendimiento de tareas, funcionarios y avance institucional</p>
      </div>

      {/* ── KPI Strip ── */}
      <div className="estadisticas-kpi-strip" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
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
            <span className="estadisticas-kpi-value">{completadas}</span>
            <span className="estadisticas-kpi-label">Completadas</span>
          </div>
        </div>
        <div className="estadisticas-kpi-card">
          <div className="estadisticas-kpi-icon amber"><Clock size={22} /></div>
          <div className="estadisticas-kpi-data">
            <span className="estadisticas-kpi-value">{sinActividades}</span>
            <span className="estadisticas-kpi-label">Sin Actividades</span>
          </div>
        </div>
        <div className="estadisticas-kpi-card">
          <div className="estadisticas-kpi-icon purple"><Users size={22} /></div>
          <div className="estadisticas-kpi-data">
            <span className="estadisticas-kpi-value">{tareasPorResponsable.length}</span>
            <span className="estadisticas-kpi-label">Funcionarios</span>
          </div>
        </div>
      </div>

      {/* ── Row 1: Donut + Gauge ── */}
      <div className="estadisticas-charts-grid">
        <div className="estadisticas-chart-card">
          <div className="estadisticas-chart-header">
            <PieChart size={20} className="chart-icon" />
            <h3>Estado de Mis Tareas</h3>
          </div>
          <div className="estadisticas-chart-body">
            <ReactECharts option={donutOption} style={{ height: '300px', width: '100%' }} />
          </div>
        </div>

        <div className="estadisticas-chart-card">
          <div className="estadisticas-chart-header">
            <Target size={20} className="chart-icon" />
            <h3>Cumplimiento Institucional</h3>
          </div>
          <div className="estadisticas-chart-body">
            <ReactECharts option={gaugeOption} style={{ height: '300px', width: '100%' }} />
          </div>
        </div>
      </div>

      {/* ── Row 2: Rendimiento de Funcionarios (Full Width) ── */}
      <div className="estadisticas-charts-grid">
        <div className="estadisticas-chart-card estadisticas-chart-card--full">
          <div className="estadisticas-chart-header">
            <UserCheck size={20} className="chart-icon" />
            <h3>Rendimiento por Funcionario (Editor)</h3>
          </div>
          <div className="estadisticas-chart-body">
            <ReactECharts option={barResponsableOption} style={{ height: `${Math.max(250, tareasPorResponsable.length * 45)}px`, width: '100%' }} />
          </div>
        </div>
      </div>

      {/* ── Row 3: Líneas + Zona ── */}
      <div className="estadisticas-charts-grid">
        <div className="estadisticas-chart-card">
          <div className="estadisticas-chart-header">
            <TrendingUp size={20} className="chart-icon" />
            <h3>Progreso por Línea de Acción</h3>
          </div>
          <div className="estadisticas-chart-body">
            <ReactECharts option={barLineaOption} style={{ height: '280px', width: '100%' }} />
          </div>
        </div>

        <div className="estadisticas-chart-card">
          <div className="estadisticas-chart-header">
            <MapPin size={20} className="chart-icon" />
            <h3>Tareas por Zona</h3>
          </div>
          <div className="estadisticas-chart-body">
            <ReactECharts option={barZonaOption} style={{ height: '280px', width: '100%' }} />
          </div>
        </div>
      </div>

      {/* ── Row 4: Prioridad ── */}
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

        {/* Table: Detalle por Funcionario */}
        <div className="estadisticas-chart-card">
          <div className="estadisticas-chart-header">
            <Users size={20} className="chart-icon" />
            <h3>Detalle por Funcionario</h3>
          </div>
          <div className="estadisticas-chart-body" style={{ padding: 0, overflowX: 'auto' }}>
            <table className="estadisticas-table">
              <thead>
                <tr>
                  <th>Funcionario</th>
                  <th>Cargo</th>
                  <th>Tareas</th>
                  <th>Progreso</th>
                </tr>
              </thead>
              <tbody>
                {tareasPorResponsable.map((r, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 700 }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <UserCheck size={14} color="#3b82f6" /> {r.nombre}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.78rem', color: '#64748b' }}>{r.cargo || '—'}</td>
                    <td>{r.total}</td>
                    <td>
                      <div className="estadisticas-progress-mini">
                        <div className="track">
                          <div
                            className="fill"
                            style={{
                              width: `${r.progreso}%`,
                              backgroundColor: r.progreso > 60 ? '#22c55e' : r.progreso > 30 ? '#3b82f6' : '#f59e0b'
                            }}
                          />
                        </div>
                        <span className="pct">{r.progreso}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Row 5: Full-width Table — By Zona ── */}
      <div className="estadisticas-charts-grid">
        <div className="estadisticas-chart-card estadisticas-chart-card--full">
          <div className="estadisticas-chart-header">
            <MapPin size={20} className="chart-icon" />
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
    </div>
  );
};

export default EstadisticasInstitucion;
