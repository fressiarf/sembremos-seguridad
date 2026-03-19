import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import './DashboardGlobal.css';
import { useToast } from '../../../context/ToastContext';
import { dashboardService } from '../../../services/dashboardService';

const Icon = {
  Check: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>,
  Pulse: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>,
  Clock: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
  DollarSign: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
};

const DashboardGlobal = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { showToast } = useToast();
  const [dashboardData, setDashboardData] = useState(null);
  const [stats, setStats] = useState({ 
    completadas: 2, 
    activas: 12, 
    pendientes: 14, 
    retrasadas: 1 
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = await dashboardService.getFullDashboardData();
      if (data) { 
        setDashboardData(data); 
        if (data.stats) {
          setStats({
            completadas: data.stats.tareasCompletadas || 2,
            activas: data.stats.totalTareas || 12,
            pendientes: data.stats.tareasPendientes || 14,
            retrasadas: data.stats.retrasadas || 1
          });
        }
        setIsLoaded(true); 
      }
    };
    fetchData();
  }, []);

  const globalTextStyle = { fontFamily: "'Inter', sans-serif", color: '#0b2240', fontWeight: 700 };

  const getSparklineOption = (color, data) => ({
    grid: { left: 0, right: 0, top: 20, bottom: 0 },
    xAxis: { type: 'category', show: false },
    yAxis: { type: 'value', show: false },
    series: [{ 
      data, 
      type: 'line', 
      smooth: true, 
      symbol: 'none', 
      lineStyle: { color, width: 2 },
      areaStyle: { 
        color: { 
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1, 
          colorStops: [{ offset: 0, color: `${color}22` }, { offset: 1, color: `${color}00` }] 
        } 
      } 
    }]
  });

  const progressPieOption = {
    backgroundColor: 'transparent',
    textStyle: globalTextStyle,
    series: [{ 
      name: 'Avance', 
      type: 'pie', 
      radius: ['60%', '85%'], 
      center: ['50%', '50%'], 
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
      label: { show: false }, 
      labelLine: { show: false },
      data: [
        { value: 65, name: 'Completado', itemStyle: { color: '#008d45' } },
        { value: 25, name: 'En Proceso', itemStyle: { color: '#f59e0b' } },
        { value: 10, name: 'Pendiente', itemStyle: { color: '#163a66' } }
      ]
    }]
  };

  return (
    <div className="dashboard-global">
      {/* ── Header ── */}
      <header className="dashboard-global__header">
        <div className="dashboard-global__title-block">
          <h1>Dashboard global</h1>
          <p>Programa Sembremos Seguridad · Cantón Puntarenas (Periodo 2025)</p>
        </div>
        <div className="dashboard-global__actions">
          <div className="status-pill status-pill--admin">
            <span className="dot" /> ADMINISTRADOR
          </div>
          <button className="btn-new-action">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            Nueva acción
          </button>
        </div>
      </header>

      {/* ── Stats Cards ── */}
      <section className="dashboard-global__stats-grid">
        <div className="stat-card stat-card--green">
          <div className="stat-card__icon-box"><Icon.Check /></div>
          <div className="stat-card__content">
             <div className="stat-card__value">{String(stats.completadas).padStart(2, '0')}</div>
             <div className="stat-card__label">Metas Realizadas</div>
          </div>
          <div className="stat-card__sparkline">
            <ReactECharts option={getSparklineOption('#22c55e', [5, 8, 12, 7, 10, 15, 12])} style={{ height: '50px', width: '100%' }} />
          </div>
        </div>
        <div className="stat-card stat-card--blue">
          <div className="stat-card__icon-box"><Icon.Pulse /></div>
          <div className="stat-card__content">
            <div className="stat-card__value">{String(stats.activas).padStart(2, '0')}</div>
            <div className="stat-card__label">Acciones Activas</div>
          </div>
          <div className="stat-card__sparkline">
            <ReactECharts option={getSparklineOption('#3b82f6', [10, 15, 12, 18, 14, 20, 18])} style={{ height: '50px', width: '100%' }} />
          </div>
        </div>
        <div className="stat-card stat-card--orange">
          <div className="stat-card__icon-box"><Icon.Clock /></div>
          <div className="stat-card__content">
            <div className="stat-card__value">{String(stats.pendientes).padStart(2, '0')}</div>
            <div className="stat-card__label">Pendientes</div>
          </div>
          <div className="stat-card__sparkline">
            <ReactECharts option={getSparklineOption('#f59e0b', [20, 18, 22, 19, 21, 18, 19])} style={{ height: '50px', width: '100%' }} />
          </div>
        </div>
        <div className="stat-card stat-card--red">
          <div className="stat-card__icon-box">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
          </div>
          <div className="stat-card__content">
            <div className="stat-card__value">{String(stats.retrasadas).padStart(2, '0')}</div>
            <div className="stat-card__label">Con Retraso</div>
          </div>
          <div className="stat-card__sparkline">
            <ReactECharts option={getSparklineOption('#ef4444', [2, 5, 3, 8, 4, 6, 5])} style={{ height: '50px', width: '100%' }} />
          </div>
        </div>
      </section>

      {/* ── Main Grid ── */}
      <div className="dashboard-global__main-grid">
        <section className="dashboard-card">
          <div className="dashboard-card__header">
            <h2 className="dashboard-card__title">Avance por Línea de Acción</h2>
          </div>
          <div className="dashboard-card__chart-container">
            {isLoaded && <ReactECharts option={progressPieOption} style={{ height: '100%', width: '100%' }} />}
          </div>
        </section>

        <section className="dashboard-card">
          <div className="dashboard-card__header">
            <h2 className="dashboard-card__title">Informes de Avance (Puntarenas)</h2>
          </div>
          <div className="info-timeline">
            <div className="info-item">
              <div className="info-item__marker info-item__marker--green" />
              <div className="info-item__box">
                <h4>Centro Cívico por la Paz</h4>
                <p>Transformación de espacio y uso regular por jóvenes.</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-item__marker info-item__marker--blue" />
              <div className="info-item__box">
                <h4>Mercadito Navideño</h4>
                <p>Feria de emprendimiento juvenil con éxito (L#4).</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-item__marker info-item__marker--orange" />
              <div className="info-item__box">
                <h4>Patrullaje Preventivo</h4>
                <p>Aumento de presencia en el casco central.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardGlobal;
