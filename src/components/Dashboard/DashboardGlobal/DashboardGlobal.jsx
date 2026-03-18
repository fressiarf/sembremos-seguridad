import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import './DashboardGlobal.css';
import { useToast } from '../../../context/ToastContext';
import { dashboardService } from '../../../services/dashboardService';
import TopbarOficial from '../../DashboardOficial/Navegacion/TopbarOficial';



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

import logoMsp from '../../../assets/Msp_logo-removebg-preview.png';
import logoInl from '../../../assets/inl-logo-acronym-vertical-navy-removebg-preview.png';
import logoSembremos from '../../../assets/Captura_de_pantalla_2026-03-15_191337-removebg-preview.png';

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
    color: '#0b2240', // Navy Blue
    fontWeight: 700
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
            { offset: 0, color: `${color}33` },
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
      backgroundColor: '#0b2240', 
      borderColor: '#333', 
      textStyle: { color: '#fff', fontFamily: "'Inter', sans-serif" } 
    },
    legend: { 
      bottom: '0%', 
      left: 'center',
      itemWidth: 10,
      itemHeight: 10,
      textStyle: { color: '#0b2240', fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 700 },
      itemGap: 15
    },
    series: [
      {
        name: 'Avance %',
        type: 'pie',
        radius: ['50%', '75%'],
        center: ['50%', '40%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
        label: { show: false, position: 'center' },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold',
            color: '#0b2240',
            fontFamily: "'Inter', sans-serif"
          }
        },
        labelLine: { show: false },
        data: [
          { value: stats.completadas, name: 'Completadas', itemStyle: { color: '#008d45' } }, // Inst Green
          { value: stats.activas, name: 'En ejecución', itemStyle: { color: '#163a66' } }, // Navy Light
          { value: stats.pendientes, name: 'Pendientes', itemStyle: { color: '#64748b' } },
          { value: stats.retrasadas, name: 'Retrasadas', itemStyle: { color: '#ce1126' } } // Inst Red
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
    grid: { left: '2%', right: '10%', bottom: '5%', containLabel: true },
    xAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#e2e8f0', type: 'dashed' } },
      axisLabel: { color: '#64748b', fontFamily: "'Inter', sans-serif", fontWeight: 600 }
    },
    yAxis: {
      type: 'category',
      data: dashboardData?.zones.map(z => z.nombre) || [],
      axisLabel: { color: '#0b2240', fontSize: 10, fontFamily: "'Inter', sans-serif", fontWeight: 700 },
      axisLine: { show: true, lineStyle: { color: '#e2e8f0' } }
    },
    series: [
      {
        type: 'bar',
        data: dashboardData?.zones.map(z => ({
          value: z.incidentes,
          itemStyle: { color: z.incidentes > 10 ? '#ce1126' : '#0b2240' }
        })) || [],
        barWidth: '50%',
        itemStyle: { borderRadius: [0, 2, 2, 0] },
        label: { 
          show: true, 
          position: 'right', 
          formatter: '{c}', 
          color: '#0b2240', 
          fontFamily: "'Inter', sans-serif",
          fontWeight: '800'
        }
      }
    ]
  };

   return (
    <div className="dashboard-global">

      {/* ── Tarjetas con Sparklines (Estilo Ficha Técnica) ── */}
      <section className="dashboard-global__stats-grid">
        <div className="stat-card stat-card--green">
          <div className="stat-card__icon"><Icon.Check /></div>
          <div className="stat-card__value">{String(stats.completadas).padStart(2, '0')}</div>
          <div className="stat-card__label">Metas Realizadas</div>
          <div className="stat-card__sparkline">
            <ReactECharts option={getSparklineOption('#008d45', [5, 12, 18, 14, 22, 19, 25])} style={{ height: '40px' }} />
          </div>
        </div>
        <div className="stat-card stat-card--blue">
          <div className="stat-card__icon"><Icon.Pulse /></div>
          <div className="stat-card__value">{String(stats.activas).padStart(2, '0')}</div>
          <div className="stat-card__label">Acciones Activas</div>
          <div className="stat-card__sparkline">
            <ReactECharts option={getSparklineOption('#163a66', [10, 8, 11, 10, 12, 11, 12])} style={{ height: '40px' }} />
          </div>
        </div>
        <div className="stat-card stat-card--orange">
          <div className="stat-card__icon"><Icon.Clock /></div>
          <div className="stat-card__value">{String(stats.pendientes).padStart(2, '0')}</div>
          <div className="stat-card__label">Pendientes</div>
          <div className="stat-card__sparkline">
            <ReactECharts option={getSparklineOption('#ce1126', [20, 18, 16, 17, 15, 14, 14])} style={{ height: '40px' }} />
          </div>
        </div>
        <div className="stat-card stat-card--red">
          <div className="stat-card__icon"><Icon.Alert /></div>
          <div className="stat-card__value">{String(stats.retrasadas).padStart(2, '0')}</div>
          <div className="stat-card__label">Con Retraso</div>
          <div className="stat-card__sparkline">
            <ReactECharts option={getSparklineOption('#ce1126', [2, 1, 3, 2, 1, 2, 1])} style={{ height: '40px' }} />
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
