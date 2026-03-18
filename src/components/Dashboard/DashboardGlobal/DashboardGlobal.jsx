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
  const [stats, setStats] = useState({ totalLineas: 0, totalTareas: 0, tareasCompletadas: 0, tareasPendientes: 0, inversionTotal: 0, cumplimiento: 0 });

  const formatColones = (amount) => {
    if (!amount || amount === 0) return '₡0';
    if (amount >= 1000000) return '₡' + (amount / 1000000).toFixed(1) + 'M';
    if (amount >= 1000) return '₡' + (amount / 1000).toFixed(0) + 'K';
    return '₡' + amount.toLocaleString('es-CR');
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await dashboardService.getFullDashboardData();
      if (data) { setDashboardData(data); setStats(data.stats); setIsLoaded(true); }
    };
    fetchData();
  }, []);

  const globalTextStyle = { fontFamily: "'Inter', sans-serif", color: '#0b2240', fontWeight: 700 };

  const getSparklineOption = (color, data) => ({
    grid: { left: 0, right: 0, top: 0, bottom: 0 },
    xAxis: { type: 'category', show: false },
    yAxis: { type: 'value', show: false },
    textStyle: globalTextStyle,
    series: [{ data, type: 'line', smooth: true, symbol: 'none', lineStyle: { color, width: 2 },
      areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: `${color}33` }, { offset: 1, color: `${color}00` }] } }
    }]
  });

  const tareasPieOption = {
    backgroundColor: 'transparent', textStyle: globalTextStyle,
    tooltip: { trigger: 'item', backgroundColor: '#0b2240', borderColor: '#333', textStyle: { color: '#fff', fontFamily: "'Inter'" } },
    legend: { bottom: '0%', left: 'center', itemWidth: 10, itemHeight: 10, textStyle: { color: '#0b2240', fontFamily: "'Inter'", fontSize: 10, fontWeight: 700 } },
    series: [{ name: 'Tareas', type: 'pie', radius: ['50%', '75%'], center: ['50%', '40%'], avoidLabelOverlap: false,
      itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
      label: { show: false }, emphasis: { label: { show: true, fontSize: 16, fontWeight: 'bold', color: '#0b2240' } }, labelLine: { show: false },
      data: [
        { value: stats.tareasCompletadas, name: 'Completadas', itemStyle: { color: '#22c55e' } },
        { value: stats.tareasPendientes, name: 'Pendientes', itemStyle: { color: '#64748b' } }
      ]
    }]
  };

  const zonesOption = {
    backgroundColor: 'transparent', textStyle: globalTextStyle,
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '2%', right: '10%', bottom: '5%', containLabel: true },
    xAxis: { type: 'value', splitLine: { lineStyle: { color: '#e2e8f0', type: 'dashed' } }, axisLabel: { color: '#64748b', fontFamily: "'Inter'", fontWeight: 600 } },
    yAxis: { type: 'category', data: dashboardData?.zones?.map(z => z.nombre) || [], axisLabel: { color: '#0b2240', fontSize: 10, fontFamily: "'Inter'", fontWeight: 700 }, axisLine: { show: true, lineStyle: { color: '#e2e8f0' } } },
    series: [{ type: 'bar', data: dashboardData?.zones?.map(z => ({ value: z.incidentes, itemStyle: { color: z.incidentes > 10 ? '#ce1126' : '#0b2240' } })) || [], barWidth: '50%', itemStyle: { borderRadius: [0, 2, 2, 0] }, label: { show: true, position: 'right', formatter: '{c}', color: '#0b2240', fontFamily: "'Inter'", fontWeight: '800' } }]
  };

  return (
    <div className="dashboard-global">
      <section className="dashboard-global__stats-grid">
        <div className="stat-card stat-card--green">
          <div className="stat-card__icon"><Icon.Check /></div>
          <div className="stat-card__value">{String(stats.tareasCompletadas).padStart(2, '0')}</div>
          <div className="stat-card__label">Tareas Completadas</div>
          <div className="stat-card__sparkline"><ReactECharts option={getSparklineOption('#22c55e', [0, 1, 1, 2, 3, 3, stats.tareasCompletadas])} style={{ height: '40px' }} /></div>
        </div>
        <div className="stat-card stat-card--blue">
          <div className="stat-card__icon"><Icon.Pulse /></div>
          <div className="stat-card__value">{String(stats.totalTareas).padStart(2, '0')}</div>
          <div className="stat-card__label">Total Tareas</div>
          <div className="stat-card__sparkline"><ReactECharts option={getSparklineOption('#163a66', [0, 1, 2, 3, 4, 5, stats.totalTareas])} style={{ height: '40px' }} /></div>
        </div>
        <div className="stat-card stat-card--orange">
          <div className="stat-card__icon"><Icon.Clock /></div>
          <div className="stat-card__value">{stats.cumplimiento}%</div>
          <div className="stat-card__label">Cumplimiento General</div>
          <div className="stat-card__sparkline"><ReactECharts option={getSparklineOption('#f59e0b', [0, 10, 20, 30, 40, 50, stats.cumplimiento])} style={{ height: '40px' }} /></div>
        </div>
        <div className="stat-card stat-card--red">
          <div className="stat-card__icon"><Icon.DollarSign /></div>
          <div className="stat-card__value">{formatColones(stats.inversionTotal)}</div>
          <div className="stat-card__label">Inversión Total</div>
          <div className="stat-card__sparkline"><ReactECharts option={getSparklineOption('#0b2240', [0, 100, 300, 500, 800, 1200, stats.inversionTotal / 1000])} style={{ height: '40px' }} /></div>
        </div>
      </section>

      <div className="dashboard-global__main-grid">
        <section className="dashboard-card">
          <div className="dashboard-card__header"><h2 className="dashboard-card__title">Tareas: Completadas vs Pendientes</h2></div>
          <div className="dashboard-card__chart-container">{isLoaded && <ReactECharts option={tareasPieOption} style={{ height: '100%', width: '100%' }} />}</div>
        </section>
        <section className="dashboard-card">
          <div className="dashboard-card__header"><h2 className="dashboard-card__title">Últimas Actualizaciones</h2></div>
          <div className="timeline">
            {dashboardData?.notifications?.length > 0 ? dashboardData.notifications.map(n => (
              <div key={n.id} className={`timeline-item timeline-item--${n.tipo === 'success' ? 'green' : n.tipo === 'warning' ? 'orange' : 'blue'}`}>
                <div className="timeline-item__dot" /><div className="timeline-item__content"><div className="timeline-item__title">{n.mensaje}</div><div className="timeline-item__desc">{n.fecha}</div></div>
              </div>
            )) : <p style={{ color: '#64748b', fontSize: '0.85rem' }}>No hay actualizaciones recientes.</p>}
          </div>
        </section>
        <section className="dashboard-card dashboard-global__bottom-card">
          <div className="dashboard-card__header"><h2 className="dashboard-card__title">Incidentes por Zona</h2></div>
          <div className="dashboard-global__bottom-chart">{isLoaded && <ReactECharts option={zonesOption} style={{ height: '100%', width: '100%' }} />}</div>
        </section>
      </div>
    </div>
  );
};

export default DashboardGlobal;
