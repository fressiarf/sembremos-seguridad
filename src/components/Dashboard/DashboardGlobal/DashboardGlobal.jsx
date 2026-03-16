import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import './DashboardGlobal.css';

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

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // ── Configuración ECharts ──
  const globalTextStyle = {
    fontFamily: "'Inter', sans-serif",
    color: '#7a9cc4'
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
      textStyle: { color: '#e8eef8', fontFamily: "'Inter', sans-serif", fontSize: 11 },
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
          { value: 45, name: 'L#1: Alcohol/Drogas', itemStyle: { color: '#f59e0b' } },
          { value: 30, name: 'L#3: Calle', itemStyle: { color: '#3b82f6' } },
          { value: 68, name: 'L#4: Inversión Social', itemStyle: { color: '#22c55e' } }
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
      axisLabel: { color: '#7a9cc4', fontFamily: "'Inter', sans-serif" }
    },
    yAxis: {
      type: 'category',
      data: ['Prog. Educativos', 'Campañas Pub.', 'Seguimiento Mesas', 'Festivales Juv.'],
      axisLabel: { color: '#e8eef8', fontSize: 11, fontFamily: "'Inter', sans-serif" },
      axisLine: { show: false }
    },
    series: [
      {
        type: 'bar',
        data: [
          { value: 66, itemStyle: { color: '#3b82f6' } },
          { value: 33, itemStyle: { color: '#f59e0b' } },
          { value: 50, itemStyle: { color: '#3b82f6' } },
          { value: 50, itemStyle: { color: '#22c55e' } }
        ],
        showBackground: true,
        backgroundStyle: { color: 'rgba(255, 255, 255, 0.03)' },
        barWidth: '45%',
        itemStyle: { borderRadius: [0, 4, 4, 0] },
        label: { 
          show: true, 
          position: 'right', 
          formatter: '{c}%', 
          color: '#fff', 
          fontFamily: "'Inter', sans-serif",
          fontWeight: '600'
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
          <div className="sidebar-admin__role" style={{ margin: 0 }}>
            <span className="sidebar-admin__role-dot" />
            <span className="sidebar-admin__role-label">Administrador</span>
          </div>
          <button className="dashboard-global__btn-new" id="btn-nueva-accion">
            <Icon.Plus />
            Nueva acción
          </button>
        </div>
      </header>

      {/* ── Tarjetas con Sparklines ── */}
      <section className="dashboard-global__stats-grid">
        <div className="stat-card stat-card--green">
          <div className="stat-card__icon"><Icon.Check /></div>
          <div className="stat-card__value">02</div>
          <div className="stat-card__label">Metas Realizadas</div>
          <div className="stat-card__sparkline">
            <ReactECharts option={getSparklineOption('#22c55e', [5, 12, 18, 14, 22, 19, 25])} style={{ height: '40px' }} />
          </div>
        </div>
        <div className="stat-card stat-card--blue">
          <div className="stat-card__icon"><Icon.Pulse /></div>
          <div className="stat-card__value">12</div>
          <div className="stat-card__label">Acciones Activas</div>
          <div className="stat-card__sparkline">
            <ReactECharts option={getSparklineOption('#3b82f6', [10, 8, 11, 10, 12, 11, 12])} style={{ height: '40px' }} />
          </div>
        </div>
        <div className="stat-card stat-card--orange">
          <div className="stat-card__icon"><Icon.Clock /></div>
          <div className="stat-card__value">14</div>
          <div className="stat-card__label">Pendientes</div>
          <div className="stat-card__sparkline">
            <ReactECharts option={getSparklineOption('#f59e0b', [20, 18, 16, 17, 15, 14, 14])} style={{ height: '40px' }} />
          </div>
        </div>
        <div className="stat-card stat-card--red">
          <div className="stat-card__icon"><Icon.Alert /></div>
          <div className="stat-card__value">01</div>
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
            <h2 className="dashboard-card__title">Avance por Línea de Acción</h2>
          </div>
          <div className="dashboard-card__chart-container">
            {isLoaded && <ReactECharts option={lineProgressOption} style={{ height: '100%', width: '100%' }} />}
          </div>
        </section>

        {/* Informes Cualitativos (Timeline) */}
        <section className="dashboard-card">
          <div className="dashboard-card__header">
            <h2 className="dashboard-card__title">Informes de Avance (Puntarenas)</h2>
          </div>
          <div className="timeline">
            <div className="timeline-item timeline-item--green">
              <div className="timeline-item__dot" />
              <div className="timeline-item__content">
                <div className="timeline-item__title">Centro Cívico por la Paz</div>
                <div className="timeline-item__desc">Transformación de espacio y uso regular por jóvenes.</div>
              </div>
            </div>
            <div className="timeline-item timeline-item--blue">
              <div className="timeline-item__dot" />
              <div className="timeline-item__content">
                <div className="timeline-item__title">Mercadito Navideño</div>
                <div className="timeline-item__desc">Feria de emprendimiento juvenil con éxito (L#4).</div>
              </div>
            </div>
            <div className="timeline-item timeline-item--orange">
              <div className="timeline-item__dot" />
              <div className="timeline-item__content">
                <div className="timeline-item__title">Campaña de Redes Sociales</div>
                <div className="timeline-item__desc">Lanzamiento de la 1era campaña de prevención (L#1).</div>
              </div>
            </div>
          </div>
        </section>

        {/* Gráfico de Cumplimiento Estratégico (Full Width) */}
        <section className="dashboard-card dashboard-global__bottom-card">
          <div className="dashboard-card__header">
            <h2 className="dashboard-card__title">Cumplimiento de Acciones Estratégicas (Metas 2025)</h2>
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
