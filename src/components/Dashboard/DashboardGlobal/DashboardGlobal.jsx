import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import './DashboardGlobal.css';
import { useToast } from '../../../context/ToastContext';
import { dashboardService } from '../../../services/dashboardService';



// ── Íconos ──
const Icon = {
  Check: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Pulse: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  Clock: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Alert: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  Plus: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
};

const DashboardGlobal = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { showToast } = useToast();

  const [dashboardData, setDashboardData] = useState(null);
  const [stats, setStats] = useState({
    completadas: 0,
    activas: 0,
    pendientes: 0,
    retrasadas: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = await dashboardService.getFullDashboardData();
      if (data) {
        setDashboardData(data);
        setStats(data.stats);
        setIsLoaded(true);
      }
    };
    fetchData();
  }, []);



  // ── Configuración ECharts ──
  const globalTextStyle = {
    fontFamily: "'Inter', sans-serif",
    color: '#1e293b',
    fontWeight: 600
  };



  // 1. Sparkline Opciones
  const getSparklineOption = (color, data) => ({
    grid: { left: 0, right: 0, top: 0, bottom: 0 },
    xAxis: { type: 'category', show: false },
    yAxis: { type: 'value', show: false },
    textStyle: globalTextStyle,
    series: [{
      data,
      type: 'line',
      smooth: true,
      symbol: 'none',
      lineStyle: { color, width: 2 },
      areaStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: `${color}44` },
            { offset: 1, color: `${color}00` }
          ]
        }
      }
    }]
  });

  // 2. Gráfico de Rosca (Avance por Línea)
  const lineProgressOption = {
    backgroundColor: 'transparent',
    textStyle: globalTextStyle,
    tooltip: { 
      trigger: 'item', 
      padding: 10, 
      backgroundColor: '#161b22', 
      borderColor: '#333', 
      textStyle: { color: '#fff', fontFamily: "'Inter', sans-serif" } 
    },
    legend: { 
      bottom: '2%', 
      left: 'center',
      itemWidth: 12,
      itemHeight: 12,
      textStyle: { color: '#1e293b', fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600 },

      itemGap: 20
    },
    series: [
      {
        name: 'Avance %',
        type: 'pie',
        radius: ['45%', '65%'],
        center: ['50%', '42%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 6, borderColor: '#161b22', borderWidth: 2 },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 18,
            fontWeight: 'bold',
            color: '#fff',
            fontFamily: "'Inter', sans-serif"
          }
        },
        labelLine: { show: false },
        data: [
          { value: stats.completadas, name: 'Completadas', itemStyle: { color: '#15803d' } },
          { value: stats.activas, name: 'En ejecución', itemStyle: { color: '#1d4ed8' } },
          { value: stats.pendientes, name: 'Pendientes', itemStyle: { color: '#64748b' } },
          { value: stats.retrasadas, name: 'Retrasadas', itemStyle: { color: '#d97706' } }
        ]

      }
    ]
  };

  // 3. Gráfico de Barras (Cumplimiento Estratégico)
  const strategyComplianceOption = {
    backgroundColor: 'transparent',
    textStyle: globalTextStyle,
    tooltip: { 
      trigger: 'axis', 
      axisPointer: { type: 'shadow' },
      textStyle: { fontFamily: "'Inter', sans-serif" }
    },
    grid: { left: '3%', right: '8%', bottom: '5%', containLabel: true },
    xAxis: {
      type: 'value',
      boundaryGap: [0, 0.01],
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
      axisLabel: { color: '#1e293b', fontFamily: "'Inter', sans-serif", fontWeight: 500 }

    },
    yAxis: {
      type: 'category',
      data: dashboardData?.zones.map(z => z.nombre) || [],
      axisLabel: { color: '#1e293b', fontSize: 11, fontFamily: "'Inter', sans-serif", fontWeight: 600 },
      axisLine: { show: false }

    },

    series: [
      {
        type: 'bar',
        data: dashboardData?.zones.map(z => ({
          value: z.incidentes,
          itemStyle: { color: z.incidentes > 10 ? '#ef4444' : '#1d4ed8' }
        })) || [],
        showBackground: true,
        backgroundStyle: { color: 'rgba(0, 0, 0, 0.02)' },
        barWidth: '45%',
        itemStyle: { borderRadius: [0, 4, 4, 0] },
        label: { 
          show: true, 
          position: 'right', 
          formatter: '{c} inc.', 
          color: '#1e293b', 
          fontFamily: "'Inter', sans-serif",
          fontWeight: '700'
        }
      }

    ]
  };

  return (
    <div className="dashboard-global">
      
      {/* ── Encabezado ── */}
      <header className="dashboard-global__header">
        <div className="dashboard-global__title-block">
          <h1>Dashboard global</h1>
          <p>Programa Sembremos Seguridad · Cantón Puntarenas (Periodo 2025)</p>
        </div>
        <div className="dashboard-global__actions">
          <div className="sidebar-admin__role role-badge--light" style={{ margin: 0 }}>
            <span className="sidebar-admin__role-dot" />
            <span className="sidebar-admin__role-label">Administrador</span>
          </div>

          <button 
            className="dashboard-global__btn-new" 
            id="btn-nueva-accion"
            onClick={() => showToast('Iniciando creación de nueva acción estratégica...', 'info')}
          >
            <Icon.Plus />
            Nueva acción
          </button>

        </div>
      </header>

      {/* ── Tarjetas con Sparklines ── */}
      <section className="dashboard-global__stats-grid">
        <div className="stat-card stat-card--green">
          <div className="stat-card__icon"><Icon.Check /></div>
          <div className="stat-card__value">{String(stats.completadas).padStart(2, '0')}</div>
          <div className="stat-card__label">Metas Realizadas</div>
          <div className="stat-card__sparkline">
            <ReactECharts option={getSparklineOption('#22c55e', [5, 12, 18, 14, 22, 19, 25])} style={{ height: '40px' }} />
          </div>
        </div>
        <div className="stat-card stat-card--blue">
          <div className="stat-card__icon"><Icon.Pulse /></div>
          <div className="stat-card__value">{String(stats.activas).padStart(2, '0')}</div>
          <div className="stat-card__label">Acciones Activas</div>
          <div className="stat-card__sparkline">
            <ReactECharts option={getSparklineOption('#3b82f6', [10, 8, 11, 10, 12, 11, 12])} style={{ height: '40px' }} />
          </div>
        </div>
        <div className="stat-card stat-card--orange">
          <div className="stat-card__icon"><Icon.Clock /></div>
          <div className="stat-card__value">{String(stats.pendientes).padStart(2, '0')}</div>
          <div className="stat-card__label">Pendientes</div>
          <div className="stat-card__sparkline">
            <ReactECharts option={getSparklineOption('#f59e0b', [20, 18, 16, 17, 15, 14, 14])} style={{ height: '40px' }} />
          </div>
        </div>
        <div className="stat-card stat-card--red">
          <div className="stat-card__icon"><Icon.Alert /></div>
          <div className="stat-card__value">{String(stats.retrasadas).padStart(2, '0')}</div>
          <div className="stat-card__label">Con Retraso</div>
          <div className="stat-card__sparkline">
            <ReactECharts option={getSparklineOption('#ef4444', [2, 1, 3, 2, 1, 2, 1])} style={{ height: '40px' }} />
          </div>
        </div>

      </section>

      {/* ── Grid Principal de Gráficos ── */}
      <div className="dashboard-global__main-grid">
        
        {/* Gráfico de Avance por Línea */}
        <section className="dashboard-card">
          <div className="dashboard-card__header">
            <h2 className="dashboard-card__title">Resumen de Acciones por Estado</h2>
          </div>
          <div className="dashboard-card__chart-container">
            {isLoaded && <ReactECharts option={lineProgressOption} style={{ height: '100%', width: '100%' }} />}
          </div>
        </section>


        {/* Informes Cualitativos (Timeline) */}
        <section className="dashboard-card">
          <div className="dashboard-card__header">
            <h2 className="dashboard-card__title">Últimas Actualizaciones</h2>
          </div>
          <div className="timeline">
            {dashboardData?.notifications.map(note => (
              <div key={note.id} className={`timeline-item timeline-item--${note.tipo === 'success' ? 'green' : 'blue'}`}>
                <div className="timeline-item__dot" />
                <div className="timeline-item__content">
                  <div className="timeline-item__title">{note.mensaje}</div>
                  <div className="timeline-item__desc">{note.fecha}</div>
                </div>
              </div>
            ))}
            {(!dashboardData || dashboardData.notifications.length === 0) && (
              <p style={{ color: '#64748b', fontSize: '0.85rem' }}>No hay actualizaciones recientes.</p>
            )}
          </div>
        </section>


        {/* Gráfico de Cumplimiento Estratégico (Full Width) */}
        <section className="dashboard-card dashboard-global__bottom-card">
          <div className="dashboard-card__header">
            <h2 className="dashboard-card__title">Distribución de Incidentes por Zonas Críticas</h2>
          </div>
          <div className="dashboard-global__bottom-chart">
            {isLoaded && <ReactECharts option={strategyComplianceOption} style={{ height: '100%', width: '100%' }} />}
          </div>
        </section>


      </div>

    </div>
  );
};

export default DashboardGlobal;
