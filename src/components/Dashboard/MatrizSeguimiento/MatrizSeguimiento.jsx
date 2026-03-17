import React, { useState, useEffect } from 'react';
import './MatrizSeguimiento.css';
import { useToast } from '../../../context/ToastContext';

const Icon = {
  Search: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Filter: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  ),
  Download: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  More: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
    </svg>
  )
};

const MatrizSeguimiento = () => {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todos');

  const data = [
    { 
      no: 2,
      id: 'LA-SOC-02', 
      problematica: 'SITUACION DE CALLE',
      titulo: 'Atención Integral Personas Calle', 
      accion: 'Convenio de financiamiento municipal con centros de reinserción social para ayuda integral.',
      objetivo: 'Brindar atención integral propiciando una eficiente reinserción a la sociedad.',
      indicador: 'Adjudicación contratación',
      meta: 'Firma y ejecución del convenio marco',
      responsable: 'Municipalidad',
      corresponsable: 'Gestión Social, CCSS, Salud, IMAS',
      progreso: 15,
      estado: 'En ejecución'
    },
    { 
      no: 3,
      id: 'LA-DRO-03', 
      problematica: 'CONSUMO DE DROGA',
      titulo: 'Red Cantonal Cultural/Deportiva', 
      accion: 'Crear red cultural y deportiva para festivales recreativos intercolegiales.',
      objetivo: 'Prevenir consumo de drogas y alcohol mediante actividades lúdicas competitivas.',
      indicador: 'Cantidad de festivales intercolegiales',
      meta: 'Red Cultural y Deportiva conformada',
      responsable: 'Municipalidad',
      corresponsable: 'MEP, Deporte, Persona Joven, ADIs',
      progreso: 65,
      estado: 'En ejecución'
    },
    { 
      no: 4,
      id: 'LA-ESP-04', 
      problematica: 'VENTA DE DROGAS',
      titulo: 'Recuperación Espacios Públicos', 
      accion: 'Embellecimiento de espacios en Barranca, Puntarenas, Chacarita y El Roble.',
      objetivo: 'Disminuir venta de droga mediante la recuperación de infraestructura pública.',
      indicador: 'Espacios públicos recuperados',
      meta: '56 Parques embellecidos',
      responsable: 'Municipalidad',
      corresponsable: 'Desarrollo Urbano, ICE, RECOPE, INCOP',
      progreso: 40,
      estado: 'En ejecución'
    },
    { 
      no: 5,
      id: 'LA-SEG-05', 
      problematica: 'VENTA DE DROGAS',
      titulo: 'Comisión Seguridad Cantonal', 
      accion: 'Creación y puesta en marcha de la comisión de seguridad cantonal.',
      objetivo: 'Planificar acciones interinstitucionales de control de patentes y narcomenudeo.',
      indicador: 'Acciones interinstitucionales ejecutadas',
      meta: 'Comisión de Seguridad conformada',
      responsable: 'Municipalidad',
      corresponsable: 'Fuerza Pública, Turística, OIJ, MSP',
      progreso: 100,
      estado: 'Completada'
    },
    { 
      no: 6,
      id: 'LA-INV-06', 
      problematica: 'FALTA INVERSION SOCIAL',
      titulo: 'Actualización Plan Regulador', 
      accion: 'Actualizar el plan regulador comunal y comercial del cantón.',
      objetivo: 'Promover construcción de infraestructura destinada al desarrollo cantonal.',
      indicador: 'Actualización del Plan Regulador',
      meta: 'Plan Regulador en Paseo Turistas/Zonas Críticas',
      responsable: 'Municipalidad',
      corresponsable: 'Consejo Municipal, INVU, ICT, MINAE',
      progreso: 85,
      estado: 'En ejecución'
    },
    { 
      no: 7,
      id: 'LA-ALU-07', 
      problematica: 'ALUMBRADO PÚBLICO',
      titulo: 'Diagnóstico Alumbrado Crítico', 
      accion: 'Estudio de puntos críticos para instalación/mantenimiento en Barranca y Centro.',
      objetivo: 'Intervenir lugares priorizados para mejorar la iluminación e impacto criminal.',
      indicador: 'Zonas intervenidas con iluminación',
      meta: '56 espacios públicos intervenidos',
      responsable: 'Municipalidad',
      corresponsable: 'Fuerza Pública, ICE, AYA, UTN, MOPT',
      progreso: 0,
      estado: 'Pendiente'
    },
    { 
      no: 8,
      id: 'LA-DES-08', 
      problematica: 'DESEMPLEO',
      titulo: 'Innovación Social Digital', 
      accion: 'Modelo ITA-LAC y DIDTT para valor agregado en Agroindustria.',
      objetivo: 'Impulsar desarrollo por tecnologías digitales disminuyendo brecha de desempleo.',
      indicador: 'Capacitaciones impartidas',
      meta: 'Modelo Innovación Social Digital ejecutado',
      responsable: 'Municipalidad',
      corresponsable: 'Gestión Social, MIOTT, MAG, PROCOMER',
      progreso: 10,
      estado: 'En ejecución'
    }
  ];

  const filteredData = data.filter(item => {
    const matchesSearch = item.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.problematica.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'Todos' || item.estado === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleExport = () => {
    showToast('Generando reporte Excel de la matriz estratégica...', 'info');
  };

  return (
    <div className="matriz-seguimiento">
      <header className="matriz-header">
        <div className="matriz-title-block">
          <h1>Matriz Estratégica Institucional</h1>
          <p>Líneas de Trabajo y Estrategia Integral - Cantón Puntarenas</p>
        </div>
        <button className="btn-export" onClick={handleExport}>
          <Icon.Download />
          Exportar Matriz
        </button>
      </header>

      <div className="matriz-controls">
        <div className="search-wrapper">
          <Icon.Search />
          <input 
            type="text" 
            placeholder="Buscar por código, problemática o acción..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-wrapper">
          <Icon.Filter />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="Todos">Todos los estados</option>
            <option value="Completada">Completadas</option>
            <option value="En ejecución">En ejecución</option>
            <option value="Pendiente">Pendientes</option>
            <option value="Retrasada">Retrasadas</option>
          </select>
        </div>
      </div>

      <div className="matriz-table-container">
        <table className="matriz-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Problemática Priorizada</th>
              <th>Línea de Acción / Objetivo</th>
              <th>Propuesta / Meta</th>
              <th>Responsables</th>
              <th>Estado / Progreso</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id}>
                <td className="col-no"><small>#{item.no}</small></td>
                <td className="col-prob">
                  <div className="status-dot-mini" style={{ background: item.progreso === 100 ? '#22c55e' : (item.progreso > 0 ? '#3b82f6' : '#94a3b8') }} />
                  <strong>{item.problematica}</strong>
                  <div className="item-id-tag">{item.id}</div>
                </td>
                <td className="col-accion">
                  <div className="action-title-main">{item.titulo}</div>
                  <div className="action-desc-sub">{item.objetivo}</div>
                </td>
                <td className="col-meta">
                  <div className="action-meta-main">{item.meta}</div>
                  <div className="action-indicador-sub">Ind: {item.indicador}</div>
                </td>
                <td className="col-resp">
                  <div className="resp-main">{item.responsable}</div>
                  <div className="resp-sub">{item.corresponsable}</div>
                </td>
                <td className="col-progreso-status">
                  <div className="status-badge-container">
                    <span className={`status-badge status--${item.estado.toLowerCase().replace(' ', '-')}`}>
                      {item.estado}
                    </span>
                  </div>
                  <div className="progress-mini-bar">
                    <div className="progress-mini-fill" style={{ width: `${item.progreso}%`, backgroundColor: item.progreso === 100 ? '#22c55e' : '#3b82f6' }} />
                    <span className="progress-mini-text">{item.progreso}%</span>
                  </div>
                </td>
                <td className="col-actions">
                  <button className="btn-icon-more" onClick={() => showToast(`Detalles técnicos: ${item.id}`, 'info')}>
                    <Icon.More />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredData.length === 0 && (
          <div className="empty-state">
            <p>No se encontraron resultados para los filtros aplicados.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatrizSeguimiento;
