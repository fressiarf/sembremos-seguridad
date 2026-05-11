import React from 'react';
import ReactECharts from 'echarts-for-react';
import PageTransition from '../../Shared/PageTransition';
import { Network, TrendingUp, TriangleAlert } from 'lucide-react';
import './DiagnosticoMetodologico.css';

/**
 * Panel de Diagnóstico Metodológico
 * Justificación científica y territorial de las líneas de acción.
 */
const DiagnosticoMetodologico = () => {

  // ── 1. Matriz MIC-MAC (Impactos Cruzados) ──
  // X: Dependencia, Y: Influencia (Motricidad)
  // Cuadrante superior derecho (Alta Inf, Alta Dep): Factores Clave de Riesgo
  const micmacData = [
    { name: 'Consumo de Drogas', value: [85, 92], category: 'Riesgo Clave' },
    { name: 'Venta de Drogas', value: [90, 88], category: 'Riesgo Clave' },
    { name: 'Desempleo Juvenil', value: [75, 85], category: 'Riesgo Clave' },
    { name: 'Falta Inversión Social', value: [30, 95], category: 'Determinante' }, // Alta influencia, baja dependencia
    { name: 'Violencia Intrafamiliar', value: [80, 60], category: 'Riesgo Clave' },
    { name: 'Robos a Personas', value: [88, 40], category: 'Resultado' }, // Alta dependencia, baja influencia
    { name: 'Vandalismo', value: [70, 30], category: 'Resultado' },
    { name: 'Deserción Escolar', value: [60, 70], category: 'Riesgo Clave' },
    { name: 'Iluminación Pública', value: [20, 65], category: 'Determinante' },
    { name: 'Conflictos Vecinales', value: [50, 45], category: 'Autónomo' }
  ];

  const scatterOption = {
    tooltip: {
      formatter: function (param) {
        return `<div style="font-weight:700">${param.data.name}</div>
                <div style="font-size:12px;color:#64748b">Dependencia: ${param.data.value[0]}</div>
                <div style="font-size:12px;color:#64748b">Influencia: ${param.data.value[1]}</div>`;
      }
    },
    grid: { left: '8%', right: '10%', bottom: '10%', top: '10%' },
    xAxis: {
      type: 'value', name: 'Dependencia ➔', nameLocation: 'middle', nameGap: 25,
      min: 0, max: 100, splitLine: { show: false }
    },
    yAxis: {
      type: 'value', name: 'Influencia ➔', nameLocation: 'middle', nameGap: 30,
      min: 0, max: 100, splitLine: { show: false }
    },
    visualMap: { show: false, min: 0, max: 100, dimension: 1, inRange: { color: ['#3b82f6', '#f59e0b', '#ef4444'] } },
    series: [{
      type: 'scatter',
      symbolSize: 20,
      itemStyle: { borderColor: '#fff', borderWidth: 2, shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.1)' },
      data: micmacData,
      markLine: {
        animation: false,
        lineStyle: { type: 'dashed', color: '#94a3b8' },
        data: [
          { xAxis: 50, label: { formatter: 'Media Dependencia' } },
          { yAxis: 50, label: { formatter: 'Media Influencia' } }
        ]
      },
      markArea: {
        silent: true,
        data: [
          [{ xAxis: 50, yAxis: 50, itemStyle: { color: 'rgba(239,68,68,0.05)' } }, { xAxis: 100, yAxis: 100 }], // Clave
          [{ xAxis: 0, yAxis: 50, itemStyle: { color: 'rgba(245,158,11,0.05)' } }, { xAxis: 50, yAxis: 100 }], // Determinante
          [{ xAxis: 50, yAxis: 0, itemStyle: { color: 'rgba(59,130,246,0.05)' } }, { xAxis: 100, yAxis: 50 }], // Resultado
          [{ xAxis: 0, yAxis: 0, itemStyle: { color: 'rgba(148,163,184,0.05)' } }, { xAxis: 50, yAxis: 50 }] // Autónomo
        ]
      }
    }],
    annotations: [
      { type: 'text', left: '75%', top: '15%', style: { text: 'ZONA DE CONFLICTO / RIESGO', fill: '#ef4444', fontStyle: 'italic', fontWeight: 'bold', opacity: 0.3 } },
      { type: 'text', left: '15%', top: '15%', style: { text: 'ZONA ESTRUCTURAL', fill: '#f59e0b', fontStyle: 'italic', fontWeight: 'bold', opacity: 0.3 } }
    ]
  };


  // ── 2. Diagrama de Pareto (Priorización 80/20) ──
  const paretoData = [
    { name: 'Venta de Drogas', freq: 450 },
    { name: 'Robos P.', freq: 320 },
    { name: 'Consumo', freq: 280 },
    { name: 'VIF', freq: 190 },
    { name: 'Desempleo', freq: 110 },
    { name: 'Riñas', freq: 85 },
    { name: 'Vandalismo', freq: 40 },
    { name: 'Otros', freq: 25 }
  ];
  
  const totalFreq = paretoData.reduce((acc, curr) => acc + curr.freq, 0);
  let accFreq = 0;
  const accumPct = paretoData.map(item => {
    accFreq += item.freq;
    return Math.round((accFreq / totalFreq) * 100);
  });

  const paretoOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
    legend: { data: ['Frecuencia (Impacto)', '% Acumulado'], bottom: 0 },
    grid: { left: '5%', right: '5%', bottom: '15%', top: '15%' },
    xAxis: [{
      type: 'category',
      data: paretoData.map(d => d.name),
      axisLabel: { rotate: 30, fontSize: 10, color: '#475569', fontWeight: 600 }
    }],
    yAxis: [
      { type: 'value', name: 'Impacto', position: 'left', axisLine: { show: true, lineStyle: { color: '#3b82f6' } } },
      { type: 'value', name: '% Acum.', position: 'right', min: 0, max: 100, axisLine: { show: true, lineStyle: { color: '#ef4444' } }, axisLabel: { formatter: '{value} %' } }
    ],
    series: [
      {
        name: 'Frecuencia (Impacto)',
        type: 'bar',
        data: paretoData.map(d => d.freq),
        itemStyle: { color: '#3b82f6', borderRadius: [4, 4, 0, 0] },
        barWidth: '40%'
      },
      {
        name: '% Acumulado',
        type: 'line',
        yAxisIndex: 1,
        data: accumPct,
        itemStyle: { color: '#ef4444' },
        lineStyle: { width: 3, type: 'solid' },
        symbolSize: 8,
        label: { show: true, formatter: '{c}%', position: 'top', color: '#dc2626', fontSize: 11, fontWeight: 'bold' },
        markLine: {
          data: [{ yAxis: 80, name: 'Regla 80/20' }],
          lineStyle: { color: '#f59e0b', type: 'dashed', width: 2 },
          label: { position: 'start', formatter: 'Límite 80%', color: '#f59e0b' }
        }
      }
    ]
  };


  // ── 3. Triángulo de la Violencia (Análisis Galtung Modificado) ──
  const radarOption = {
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, data: ['Puntarenas Centro', 'Chacarita', 'Barranca'] },
    radar: {
      indicator: [
        { name: 'Violencia Directa\n(Delitos Visibles)', max: 100 },
        { name: 'V. Estructural\n(Pobreza, Desempleo)', max: 100 },
        { name: 'V. Cultural\n(Normalización del Delito)', max: 100 }
      ],
      shape: 'polygon',
      center: ['50%', '45%'],
      radius: '65%',
      splitNumber: 4,
      axisName: { color: '#1e293b', fontWeight: 'bold', fontSize: 12 },
      splitArea: { areaStyle: { color: ['rgba(241, 245, 249, 0.4)', 'rgba(241, 245, 249, 0.6)'] } },
      axisLine: { lineStyle: { color: '#cbd5e1' } },
      splitLine: { lineStyle: { color: '#cbd5e1' } }
    },
    series: [{
      name: 'Perfil de Violencia',
      type: 'radar',
      data: [
        {
          value: [85, 45, 60],
          name: 'Puntarenas Centro',
          itemStyle: { color: '#3b82f6' },
          areaStyle: { color: 'rgba(59, 130, 246, 0.2)' }
        },
        {
          value: [90, 85, 80],
          name: 'Chacarita',
          itemStyle: { color: '#ef4444' },
          areaStyle: { color: 'rgba(239, 68, 68, 0.2)' }
        },
        {
          value: [50, 95, 75],
          name: 'Barranca',
          itemStyle: { color: '#f59e0b' },
          areaStyle: { color: 'rgba(245, 158, 11, 0.2)' }
        }
      ]
    }]
  };


  return (
    <PageTransition>
      <div className="diagnostico-container">
        
        <header className="diagnostico-header">
          <h1 className="diagnostico-title">Panel de Diagnóstico Metodológico</h1>
          <p className="diagnostico-subtitle">
            Análisis científico de los insumos territoriales utilizados para la formulación 
            de las Líneas de Acción Estratégicas del programa en el Cantón de Puntarenas.
          </p>
        </header>

        {/* TOP GRID: MIC-MAC & Radar */}
        <div className="diagnostico-grid-top">
          
          <div className="diag-panel">
            <div className="diag-panel-header">
              <div className="diag-icon-box blue"><Network size={18} /></div>
              <div className="diag-panel-title">
                <h3>Matriz de Impactos Cruzados (MIC-MAC)</h3>
                <span>Clasificación de factores por Influencia vs. Dependencia</span>
              </div>
            </div>
            <div className="diag-panel-body">
              <ReactECharts option={scatterOption} style={{ height: '350px', width: '100%' }} />
            </div>
          </div>

          <div className="diag-panel">
            <div className="diag-panel-header">
              <div className="diag-icon-box rose"><TriangleAlert size={18} /></div>
              <div className="diag-panel-title">
                <h3>Triángulo de la Violencia</h3>
                <span>Análisis comparativo de raíces delictivas por distrito</span>
              </div>
            </div>
            <div className="diag-panel-body">
              <ReactECharts option={radarOption} style={{ height: '350px', width: '100%' }} />
            </div>
          </div>

        </div>

        {/* BOTTOM GRID: Pareto */}
        <div className="diagnostico-grid-bottom">
          <div className="diag-panel">
            <div className="diag-panel-header">
              <div className="diag-icon-box purple"><TrendingUp size={18} /></div>
              <div className="diag-panel-title">
                <h3>Diagrama de Pareto (Regla 80/20)</h3>
                <span>Priorización de delitos y factores de riesgo para atención inmediata</span>
              </div>
            </div>
            <div className="diag-panel-body">
              <ReactECharts option={paretoOption} style={{ height: '380px', width: '100%' }} />
            </div>
          </div>
        </div>

      </div>
    </PageTransition>
  );
};

export default DiagnosticoMetodologico;
