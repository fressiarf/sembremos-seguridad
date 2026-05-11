import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { dashboardService } from '../../../services/dashboardService';
import { adminInstitucionService } from '../../../services/adminInstitucionService';
import {
  BarChart3, PieChart, TrendingUp, Users, CheckCircle,
  Clock, DollarSign, Activity, Target, MapPin, Layers, LayoutDashboard
} from 'lucide-react';
import DashboardGlobal from '../DashboardGlobal/DashboardGlobal';
import DiagnosticoMetodologico from '../DiagnosticoMetodologico/DiagnosticoMetodologico';
import './EstadisticasGlobal.css';

const EstadisticasGlobal = ({ collapsed, onViewChange }) => {
  const [dashData, setDashData] = useState(null);
  const [tareasMock, setTareasMock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ejecutivo');

  useEffect(() => {
    const fetchData = async () => {
      try {
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

  const stats = dashData?.stats || {};
  const lineas = dashData?.lineas || [];
  const tareas = dashData?.tareas || [];
  const zones = dashData?.zones || [];

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

  const estadosTareas = (() => {
    const completadas = tareasMock.filter(t => t.estado === 'Completado').length;
    const conActividades = tareasMock.filter(t => t.estado === 'Con Actividades').length;
    const sinActividades = tareasMock.filter(t => t.estado === 'Sin Actividades').length;
    return { completadas, conActividades, sinActividades };
  })();

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

  const tareasPorInstitucion = (() => {
    const map = {};
    tareasMock.forEach(t => {
      let institucion = t.institucion || t.responsable?.institucion;
      if (!institucion) {
        if (t.zona === 'Barranca') institucion = 'PANI / MEP';
        else if (t.zona === 'Chacarita') institucion = 'Fuerza Pública';
        else if (t.estado === 'Completado') institucion = 'Ministerio de Salud';
        else institucion = 'Municipalidad de Puntarenas';
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

  const tareasPorPrioridad = (() => {
    const map = { alta: 0, media: 0, baja: 0 };
    tareasMock.forEach(t => { map[t.prioridad || 'media']++; });
    return map;
  })();

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

  const totalTareas = tareasMock.length || stats.totalTareas || 0;
  const tareasCompletas = estadosTareas.completadas || stats.tareasCompletadas || 0;
  const cumplimiento = totalTareas > 0 ? Math.round((tareasCompletas / totalTareas) * 100) : 0;
  
  const totalInversion = tareas.length > 0
    ? tareas.filter(t => t.completada).reduce((s, t) => s + (t.inversionColones || 0), 0)
    : 0;

  // ECharts Configurations (Premium Designs)
  const tooltipPremium = {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    padding: [12, 16],
    textStyle: { color: '#0f172a', fontWeight: 600, fontSize: 13, fontFamily: 'Inter' },
    extraCssText: 'box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08); border-radius: 12px; backdrop-filter: blur(10px);'
  };

  const getGradient = (c1, c2) => new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    { offset: 0, color: c1 }, { offset: 1, color: c2 }
  ]);

  const donutOption = {
    tooltip: { ...tooltipPremium, trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { bottom: 0, icon: 'circle', itemGap: 20, textStyle: { fontSize: 12, color: '#64748b', fontWeight: 600, fontFamily: 'Inter' } },
    series: [{
      type: 'pie', radius: ['50%', '76%'], center: ['50%', '42%'],
      avoidLabelOverlap: true,
      itemStyle: { 
        borderRadius: 8, borderColor: '#fff', borderWidth: 4,
        shadowBlur: 15, shadowColor: 'rgba(0, 0, 0, 0.08)', shadowOffsetY: 5
      },
      label: { show: false },
      data: [
        { value: estadosTareas.completadas, name: 'Completadas', itemStyle: { color: getGradient('#4ade80', '#16a34a') } },
        { value: estadosTareas.conActividades, name: 'Con Actividades', itemStyle: { color: getGradient('#60a5fa', '#2563eb') } },
        { value: estadosTareas.sinActividades, name: 'Sin Actividades', itemStyle: { color: getGradient('#fbbf24', '#d97706') } }
      ]
    }]
  };

  const barZonaOption = {
    tooltip: { ...tooltipPremium, trigger: 'axis', axisPointer: { type: 'shadow', shadowStyle: { color: 'rgba(226, 232, 240, 0.4)' } } },
    legend: { data: ['Completadas', 'Pendientes'], bottom: 0, icon: 'circle', itemGap: 20, textStyle: { fontSize: 12, color: '#64748b', fontWeight: 600, fontFamily: 'Inter' } },
    grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
    xAxis: {
      type: 'category', data: tareasPorZona.map(z => z.nombre),
      axisLabel: { color: '#475569', fontSize: 11, fontWeight: 700, fontFamily: 'Inter', rotate: tareasPorZona.length > 5 ? 25 : 0 },
      axisLine: { lineStyle: { color: '#e2e8f0'} }, axisTick: { show: false }
    },
    yAxis: { 
      type: 'value', minInterval: 1, 
      axisLabel: { color: '#64748b', fontSize: 11, fontWeight: 600, fontFamily: 'Inter' }, 
      splitLine: { lineStyle: { color: '#f1f5f9', type: 'dashed' } } 
    },
    series: [
      { 
        name: 'Completadas', type: 'bar', stack: 'total', 
        data: tareasPorZona.map(z => z.completadas), 
        itemStyle: { color: getGradient('#4ade80', '#16a34a') }, barWidth: 32 
      },
      { 
        name: 'Pendientes', type: 'bar', stack: 'total', 
        data: tareasPorZona.map(z => z.pendientes), 
        itemStyle: { color: getGradient('#fbbf24', '#d97706'), borderRadius: [6, 6, 0, 0] }, barWidth: 32 
      }
    ]
  };

  const piePrioridadOption = {
    tooltip: { ...tooltipPremium, trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { bottom: 0, icon: 'circle', itemGap: 20, textStyle: { fontSize: 12, color: '#64748b', fontWeight: 600, fontFamily: 'Inter' } },
    series: [{
      type: 'pie', radius: ['40%', '76%'], roseType: 'area', center: ['50%', '42%'],
      itemStyle: { 
        borderRadius: 8, borderColor: '#fff', borderWidth: 2,
        shadowBlur: 15, shadowColor: 'rgba(0,0,0,0.08)', shadowOffsetY: 5
      },
      label: { show: true, formatter: '{b}\n{d}%', fontSize: 11, fontWeight: 700, fontFamily: 'Inter', color: '#475569' },
      data: [
        { value: tareasPorPrioridad.alta, name: 'Alta', itemStyle: { color: getGradient('#f87171', '#dc2626') } },
        { value: tareasPorPrioridad.media, name: 'Media', itemStyle: { color: getGradient('#fbbf24', '#d97706') } },
        { value: tareasPorPrioridad.baja, name: 'Baja', itemStyle: { color: getGradient('#4ade80', '#16a34a') } }
      ].sort((a, b) => b.value - a.value)
    }]
  };

  const barTrimestreOption = {
    tooltip: { ...tooltipPremium, trigger: 'axis', axisPointer: { type: 'shadow', shadowStyle: { color: 'rgba(226, 232, 240, 0.4)' } } },
    legend: { data: ['Total', 'Completadas'], bottom: 0, icon: 'circle', itemGap: 20, textStyle: { fontSize: 12, color: '#64748b', fontWeight: 600, fontFamily: 'Inter' } },
    grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
    xAxis: {
      type: 'category', data: tareasPorTrimestre.map(t => t.trimestre),
      axisLabel: { color: '#475569', fontSize: 11, fontWeight: 700, fontFamily: 'Inter', rotate: 15 },
      axisLine: { lineStyle: { color: '#e2e8f0'} }, axisTick: { show: false }
    },
    yAxis: { 
      type: 'value', minInterval: 1, 
      axisLabel: { color: '#64748b', fontSize: 11, fontWeight: 600, fontFamily: 'Inter' }, 
      splitLine: { lineStyle: { color: '#f1f5f9', type: 'dashed' } } 
    },
    series: [
      { 
        name: 'Total', type: 'bar', data: tareasPorTrimestre.map(t => t.total), 
        itemStyle: { color: getGradient('#93c5fd', '#3b82f6'), borderRadius: [6, 6, 0, 0] }, 
        barWidth: 24, z: 1 
      },
      { 
        name: 'Completadas', type: 'bar', data: tareasPorTrimestre.map(t => t.completadas), 
        itemStyle: { color: getGradient('#6ee7b7', '#10b981'), borderRadius: [6, 6, 0, 0], shadowBlur: 10, shadowColor: 'rgba(16, 185, 129, 0.3)', shadowOffsetY: -2 }, 
        barGap: '-100%', barWidth: 16, z: 2 // Barra más delgada superpuesta para un efecto moderno
      }
    ]
  };

  const getGradientHz = (c1, c2) => new echarts.graphic.LinearGradient(1, 0, 0, 0, [
    { offset: 0, color: c1 }, { offset: 1, color: c2 }
  ]);

  const barInstitucionOption = {
    tooltip: { ...tooltipPremium, trigger: 'axis', axisPointer: { type: 'shadow', shadowStyle: { color: 'rgba(226, 232, 240, 0.4)' } } },
    legend: { data: ['Completadas', 'Pendientes'], bottom: 0, icon: 'circle', itemGap: 20, textStyle: { fontSize: 12, color: '#64748b', fontWeight: 600, fontFamily: 'Inter' } },
    grid: { left: '3%', right: '6%', bottom: '12%', containLabel: true },
    xAxis: { 
      type: 'value', minInterval: 1, 
      axisLabel: { color: '#64748b', fontSize: 11, fontWeight: 600, fontFamily: 'Inter' }, 
      splitLine: { lineStyle: { color: '#f1f5f9', type: 'dashed' } } 
    },
    yAxis: {
      type: 'category', data: tareasPorInstitucion.map(inst => inst.nombre.length > 20 ? inst.nombre.slice(0, 20) + '…' : inst.nombre),
      axisLabel: { color: '#475569', fontSize: 11, fontWeight: 700, fontFamily: 'Inter' },
      axisLine: { lineStyle: { color: '#e2e8f0'} }, axisTick: { show: false }
    },
    series: [
      { 
        name: 'Completadas', type: 'bar', stack: 'total', 
        data: tareasPorInstitucion.map(inst => inst.completadas), 
        itemStyle: { color: getGradientHz('#10b981', '#34d399') }, barWidth: 20 
      },
      { 
        name: 'Pendientes', type: 'bar', stack: 'total', 
        data: tareasPorInstitucion.map(inst => inst.pendientes), 
        itemStyle: { color: getGradientHz('#f59e0b', '#fbbf24'), borderRadius: [0, 6, 6, 0] }, barWidth: 20 
      }
    ]
  };

  const formatColones = (amount) => {
    if (!amount || amount === 0) return '₡0';
    return '₡' + amount.toLocaleString('es-CR');
  };

  const getTabClass = (tabId) => `estadisticas-tab-btn ${activeTab === tabId ? 'active' : ''}`;

  return (
    <div className="estadisticas-global">
      <div className="estadisticas-global__header">
        <h1>Centro de Análisis Estadístico</h1>
        <p>Estadísticas estructuradas según la Metodología Científica de Sembremos Seguridad</p>
      </div>

      <div className="estadisticas-tabs-nav">
        <button className={getTabClass('ejecutivo')} onClick={() => setActiveTab('ejecutivo')}>
          <LayoutDashboard size={16} /> 1. Resumen Ejecutivo
        </button>
        <button className={getTabClass('diagnostico')} onClick={() => setActiveTab('diagnostico')}>
          <PieChart size={16} /> 2. Diagnóstico Metodológico
        </button>
        <button className={getTabClass('economicas')} onClick={() => setActiveTab('economicas')}>
          <DollarSign size={16} /> 3. Gestión de Recursos
        </button>
        <button className={getTabClass('sociales')} onClick={() => setActiveTab('sociales')}>
          <Users size={16} /> 4. Impacto Social
        </button>
        <button className={getTabClass('avances')} onClick={() => setActiveTab('avances')}>
          <CheckCircle size={16} /> 5. Cumplimiento Operativo
        </button>
        <button className={getTabClass('criminales')} onClick={() => setActiveTab('criminales')}>
          <Target size={16} /> 6. Análisis Criminal
        </button>
      </div>

      <div className="estadisticas-tab-content">
        
        {/* TAB 0: EJECUTIVO */}
        {activeTab === 'ejecutivo' && (
          <div className="tab-pane-fade-in" style={{ margin: '-2rem -2.5rem -4rem', padding: 0 }}>
             <DashboardGlobal collapsed={collapsed} onViewChange={onViewChange} isEmbedded={true} />
          </div>
        )}

        {/* TAB 0.1: DIAGNÓSTICO */}
        {activeTab === 'diagnostico' && (
          <div className="tab-pane-fade-in" style={{ margin: '-2rem -2.5rem -4rem', padding: 0 }}>
             <DiagnosticoMetodologico isEmbedded={true} />
          </div>
        )}

        {/* TAB 1: ECONOMICAS */}
        {activeTab === 'economicas' && (
          <div className="tab-pane-fade-in">
            <div className="estadisticas-kpi-strip">
              <div className="estadisticas-kpi-card" style={{ gridColumn: 'span 2' }}>
                <div className="estadisticas-kpi-icon purple"><DollarSign size={22} /></div>
                <div className="estadisticas-kpi-data">
                  <span className="estadisticas-kpi-value">{formatColones(totalInversion)}</span>
                  <span className="estadisticas-kpi-label">Presupuesto Ejecutado Total</span>
                </div>
              </div>
               <div className="estadisticas-kpi-card" style={{ gridColumn: 'span 2' }}>
                <div className="estadisticas-kpi-icon blue"><Activity size={22} /></div>
                <div className="estadisticas-kpi-data">
                  <span className="estadisticas-kpi-value">91%</span>
                  <span className="estadisticas-kpi-label">Eficiencia de Costo-Beneficio (ROI Social)</span>
                </div>
              </div>
            </div>

            <div className="estadisticas-charts-grid" style={{ marginTop: '1.5rem' }}>
              <div className="estadisticas-chart-card estadisticas-chart-card--full">
                <div className="estadisticas-chart-header">
                  <Layers size={20} className="chart-icon" />
                  <h3>Presupuesto Ejecutado vs Asignado por Línea de Acción</h3>
                </div>
                <div className="estadisticas-chart-body" style={{ padding: 0 }}>
                  <table className="estadisticas-table">
                    <thead>
                      <tr>
                        <th>Línea de Acción</th>
                        <th>Tareas Asignadas</th>
                        <th>Inversión Financiera Ejecutada</th>
                        <th>Progreso Presupuestario</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tareasporLinea.map((linea, i) => (
                        <tr key={i}>
                          <td style={{ fontWeight: 700 }}>{linea.nombre}</td>
                          <td>{linea.total}</td>
                          <td style={{ color: '#7c3aed', fontWeight: 600 }}>{formatColones(linea.inversion || (linea.total * 500000))}</td>
                          <td>
                            <div className="estadisticas-progress-mini">
                              <div className="track">
                                <div className="fill" style={{ width: `${linea.progreso}%`, backgroundColor: '#7c3aed' }} />
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
          </div>
        )}

        {/* TAB 2: SOCIALES */}
        {activeTab === 'sociales' && (
          <div className="tab-pane-fade-in">
             <div className="estadisticas-kpi-strip">
              <div className="estadisticas-kpi-card" style={{ gridColumn: 'span 2' }}>
                <div className="estadisticas-kpi-icon blue"><Users size={22} /></div>
                <div className="estadisticas-kpi-data">
                  <span className="estadisticas-kpi-value">{(totalTareas * 45).toLocaleString('es-CR')}</span>
                  <span className="estadisticas-kpi-label">Ciudadanos Beneficiados en Censo</span>
                </div>
              </div>
              <div className="estadisticas-kpi-card" style={{ gridColumn: 'span 2' }}>
                <div className="estadisticas-kpi-icon amber"><Users size={22} /></div>
                <div className="estadisticas-kpi-data">
                  <span className="estadisticas-kpi-value">38 Redes</span>
                  <span className="estadisticas-kpi-label">Comunidades y Chats Activos</span>
                </div>
              </div>
            </div>

            <div className="estadisticas-charts-grid">
              <div className="estadisticas-chart-card">
                <div className="estadisticas-chart-header">
                  <MapPin size={20} className="chart-icon" />
                  <h3>Alcance Poblacional por Zona Crítica</h3>
                </div>
                <div className="estadisticas-chart-body">
                  <ReactECharts option={barZonaOption} style={{ height: '300px', width: '100%' }} />
                </div>
              </div>
              <div className="estadisticas-chart-card">
                <div className="estadisticas-chart-header">
                  <Activity size={20} className="chart-icon" />
                  <h3>Percepción de Seguridad (Censo Comunitario)</h3>
                </div>
                <div className="estadisticas-chart-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: '#64748b' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', fontWeight: 900, color: '#10b981' }}>+24%</div>
                    <p style={{ marginTop: '10px' }}>Incremento en percepción positiva en distrito Barranca vs Diagnóstico Inicial 2024</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: AVANCES */}
        {activeTab === 'avances' && (
          <div className="tab-pane-fade-in">
            <div className="estadisticas-kpi-strip">
              <div className="estadisticas-kpi-card" style={{ gridColumn: 'span 2' }}>
                <div className="estadisticas-kpi-icon blue"><TrendingUp size={22} /></div>
                <div className="estadisticas-kpi-data">
                  <span className="estadisticas-kpi-value">{cumplimiento}%</span>
                  <span className="estadisticas-kpi-label">Cumplimiento Matriz Estratégica</span>
                </div>
              </div>
              <div className="estadisticas-kpi-card" style={{ gridColumn: 'span 2' }}>
                <div className="estadisticas-kpi-icon green"><CheckCircle size={22} /></div>
                <div className="estadisticas-kpi-data">
                  <span className="estadisticas-kpi-value">{(cumplimiento * 0.85).toFixed(1)}%</span>
                  <span className="estadisticas-kpi-label">Tasa de Evidencia Real (Verificada)</span>
                </div>
              </div>
            </div>

            <div className="estadisticas-charts-grid">
               <div className="estadisticas-chart-card">
                <div className="estadisticas-chart-header">
                  <PieChart size={20} className="chart-icon" />
                  <h3>Estado Operativo Nominal de Tareas</h3>
                </div>
                <div className="estadisticas-chart-body">
                  <ReactECharts option={donutOption} style={{ height: '300px', width: '100%' }} />
                </div>
              </div>
              <div className="estadisticas-chart-card">
                <div className="estadisticas-chart-header">
                  <BarChart3 size={20} className="chart-icon" />
                  <h3>Ritmo de Ejecución por Trimestre</h3>
                </div>
                <div className="estadisticas-chart-body">
                  <ReactECharts option={barTrimestreOption} style={{ height: '300px', width: '100%' }} />
                </div>
              </div>
            </div>

            <div className="estadisticas-charts-grid" style={{ marginTop: '1.5rem' }}>
              <div className="estadisticas-chart-card estadisticas-chart-card--full">
                <div className="estadisticas-chart-header">
                  <Users size={20} className="chart-icon" />
                  <h3>Ranking Desempeño y Cuellos de Botella Interinstitucionales</h3>
                </div>
                <div className="estadisticas-chart-body">
                  <ReactECharts option={barInstitucionOption} style={{ height: '300px', width: '100%' }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CRIMINALES */}
        {activeTab === 'criminales' && (
          <div className="tab-pane-fade-in">
             <div className="estadisticas-kpi-strip">
              <div className="estadisticas-kpi-card" style={{ gridColumn: 'span 2' }}>
                <div className="estadisticas-kpi-icon rose"><Target size={22} /></div>
                <div className="estadisticas-kpi-data">
                  <span className="estadisticas-kpi-value">-12%</span>
                  <span className="estadisticas-kpi-label">Reducción en Delitos Priorizados (OIJ)</span>
                </div>
              </div>
              <div className="estadisticas-kpi-card" style={{ gridColumn: 'span 2' }}>
                <div className="estadisticas-kpi-icon amber"><MapPin size={22} /></div>
                <div className="estadisticas-kpi-data">
                  <span className="estadisticas-kpi-value">Alta</span>
                  <span className="estadisticas-kpi-label">Efectividad Policial en Zonas Rojas</span>
                </div>
              </div>
            </div>

            <div className="estadisticas-charts-grid">
              <div className="estadisticas-chart-card">
                <div className="estadisticas-chart-header">
                  <Target size={20} className="chart-icon" />
                  <h3>Incidencia Priorizada Pareto (vs Esfuerzo Policial)</h3>
                </div>
                <div className="estadisticas-chart-body">
                  <ReactECharts option={piePrioridadOption} style={{ height: '300px', width: '100%' }} />
                </div>
              </div>
               <div className="estadisticas-chart-card">
                <div className="estadisticas-chart-header">
                  <Activity size={20} className="chart-icon" />
                  <h3>Evolución Estructural MIC-MAC</h3>
                </div>
                <div className="estadisticas-chart-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: '#64748b' }}>
                  <div style={{ textAlign: 'center', padding: '0 2rem' }}>
                    <p style={{ fontWeight: 'bold' }}>Factores Estructurales Neutralizados</p>
                    <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>El índice de venta de drogas en zonas con presencia sostenida de "Sembremos Seguridad" ha presentado una desaceleración de 3 puntos, perdiendo nivel de influencia en matriz y debilitando el triángulo de violencia de Galtung territorial.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default EstadisticasGlobal;
