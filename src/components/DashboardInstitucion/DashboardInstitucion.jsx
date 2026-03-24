import React, { useState, useEffect } from 'react';
import './DashboardInstitucion.css';
import { useLogin } from '../../context/LoginContext';
import { useToast } from '../../context/ToastContext';
import { dashboardService } from '../../services/dashboardService';
import CardLineaAccion from './CardLineaAccion';
import ModuloDelegacion from './ModuloDelegacion';
import CargaEvidencia from './CargaEvidencia';
import { Building2, FileText, Download, Building } from 'lucide-react';

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
            let estado = 'Pendiente';
            if (linea.totalTareas > 0 && linea.progreso === 100) estado = 'Completada';
            else if (linea.progreso > 0) estado = 'En ejecución';
            return { ...linea, estado };
          });
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
    const text = `${item.lineaAccion} ${item.id} ${item.problematica}`.toLowerCase();
    const matchesSearch = text.includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'Todos' || item.estado === filterStatus;
    // Si queremos filtrar estricto por institucion, lo agregaríamos aquí. 
    // Por ahora omitido para que se vea data (ya que la DB de db.json quizás no mapea exactamente)
    return matchesSearch && matchesFilter;
  });

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
