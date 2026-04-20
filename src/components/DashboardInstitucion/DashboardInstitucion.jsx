import React, { useState, useEffect } from 'react';
import './DashboardInstitucion.css';
import { useLogin } from '../../context/LoginContext';
import { useToast } from '../../context/ToastContext';
import { dashboardService } from '../../services/dashboardService';
import CardLineaAccion from './CardLineaAccion';
import ModuloDelegacion from './ModuloDelegacion';
import CargaEvidencia from './CargaEvidencia';
import { Building2, FileText, Download, Building, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

const DashboardInstitucion = () => {
  const { user } = useLogin();
  const { showToast } = useToast();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todos');

  const institucion = user?.institucion || 'Institución Local';

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const dashData = await dashboardService.getFullDashboardData();
        if (dashData && dashData.lineas) {
          // Filtrado estricto: solo líneas asignadas a esta institución
          // En modo mock, podemos simular que todo aplica o usar un filtro laxo si es necesario ver data
          const filtered = dashData.lineas.map(linea => {
            const tareasLocales = linea.tareas ? linea.tareas.filter(t => {
              if (t.institucionesIds && Array.isArray(t.institucionesIds)) {
                return t.institucionesIds.includes(String(user?.id));
              }
              return String(t.institucionId) === String(user?.id);
            }) : [];
            const totalTareas = tareasLocales.length;
            const tareasCompletadas = tareasLocales.filter(t => t.completada).length;
            const progreso = totalTareas > 0 ? Math.round((tareasCompletadas / totalTareas) * 100) : 0;

            let estado = 'Pendiente';
            if (totalTareas > 0 && progreso === 100) estado = 'Completada';
            else if (progreso > 0) estado = 'En ejecución';
            
            return { 
              ...linea, 
              tareas: tareasLocales,
              totalTareas,
              tareasCompletadas,
              progreso,
              estado 
            };
          }).filter(l => l.totalTareas > 0);
          setData(filtered);
        }
      } catch (error) {
        showToast('Error al cargar datos institucionales', 'error');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [institucion]);

  const filteredData = data.filter(item => {
    const text = `${item.titulo} ${item.id} ${item.problematica}`.toLowerCase();
    const matchesSearch = text.includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'Todos' || item.estado === filterStatus;
    // Si queremos filtrar estricto por institucion, lo agregaríamos aquí. 
    // Por ahora omitido para que se vea data (ya que la DB de db.json quizás no mapea exactamente)
    return matchesSearch && matchesFilter;
  });

  const exportExcel = () => {
    if (filteredData.length === 0) {
      showToast('No hay datos para exportar', 'warning');
      return;
    }

    const exportData = [];
    filteredData.forEach(l => {
      if (l.tareas && l.tareas.length > 0) {
        l.tareas.forEach(t => {
          exportData.push({
            'Nombre de Línea Estratégica': l.problematica,
            'Línea de Acción': l.titulo,
            'Tarea Estratégica Asignada': t.titulo,
            'Prioridad': t.prioridad || 'Media',
            'Estado': t.estado || (t.completada ? 'Cerrada' : 'En Ejecución'),
            'Indicador': t.indicador || '-',
            'Presupuesto Oficial (₡)': t.presupuestoEstimado || 0,
            'Inversión Usada (₡)': t.inversionColones || 0,
            'Fecha Límite': t.fechaLimite || '-',
            'Consideraciones': t.consideraciones || '-'
          });
        });
      } else {
        exportData.push({
          'Nombre de Línea Estratégica': l.problematica,
          'Línea de Acción': l.titulo,
          'Tarea Estratégica Asignada': 'Sin tareas bajo tu responsabilidad',
          'Prioridad': '-',
          'Estado': '-',
          'Indicador': '-',
          'Presupuesto Oficial (₡)': 0,
          'Inversión Usada (₡)': 0,
          'Fecha Límite': '-',
          'Consideraciones': '-'
        });
      }
    });

    try {
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Plan de Trabajo');
      XLSX.writeFile(wb, `Plan_Trabajo_${institucion.replace(/\s+/g, '_')}_${new Date().getTime()}.xlsx`);
      showToast('Plan de trabajo exportado ✓', 'success');
    } catch (e) {
      showToast('Error al exportar Excel', 'error');
    }
  };

  if (loading) {
    return <div style={{ padding: '3rem', color: '#64748b' }}>Cargando Panel Operativo...</div>;
  }

  return (
    <div className="dashboard-institucion-wrapper" style={{ width: '100%' }}>
      {/* Contenido Principal con fondo transparente para dejar ver el fondo global (navy azul) */}
      <div className="dashboard-institucion-content" style={{ 
        flex: 1, 
        padding: '2.5rem', 
        backgroundColor: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}>
        
        {/* Print Official Header */}
        <div className="print-header">
          <div style={{ textAlign: 'center', color: '#1e3a8a' }}>
             <Building size={48} />
             <div style={{ fontSize: '0.7rem', fontWeight: 700, marginTop: '8px' }}>MINISTERIO DE<br/>SEGURIDAD PÚBLICA</div>
          </div>
          <div className="print-title">
            <h2>Ficha Oficial de Rendición de Cuentas</h2>
            <p>Programa Sembremos Seguridad • INL Costa Rica</p>
            <p style={{ marginTop: '0.5rem', color: '#3b82f6' }}>{institucion.toUpperCase()}</p>
          </div>
          <div style={{ textAlign: 'center', color: '#0b2240' }}>
             <Building2 size={48} />
             <div style={{ fontSize: '0.7rem', fontWeight: 700, marginTop: '8px' }}>MUNICIPALIDAD<br/>PUBLICA</div>
          </div>
        </div>

        {/* Filters */}
        <div className="dashboard-inst-filters">
          <input 
            type="text" 
            placeholder="Buscar línea de acción..." 
            className="inst-search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="inst-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="Todos">Todas las líneas</option>
            <option value="Completada">Completadas</option>
            <option value="En ejecución">En proceso</option>
            <option value="Pendiente">Retrasadas / Pendientes</option>
          </select>
          <button 
            onClick={exportExcel}
            style={{
              padding: '0.6rem 1rem',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              marginLeft: 'auto'
            }}
            title="Exportar Plan de Trabajo a Excel"
          >
            <FileSpreadsheet size={16} />
            Exportar Bitácora Institucional
          </button>
        </div>

        {/* Cards Grid */}
        <div className="cards-grid">
          {filteredData.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
              <FileText size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
              <h3>No hay líneas de acción que coincidan con los filtros</h3>
            </div>
          ) : (
            filteredData.map(linea => (
              <CardLineaAccion key={linea.id} linea={linea}>
                <ModuloDelegacion lineaId={linea.id} tareasIniciales={linea.tareas || []} />
                <CargaEvidencia lineaId={linea.id} />
              </CardLineaAccion>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardInstitucion;
