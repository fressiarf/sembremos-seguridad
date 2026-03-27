wimport React, { useState, useEffect } from 'react';
import { MessageSquare, Send, User, Calendar, Shield, MessageCircle, Info, MoreVertical, Search, Filter } from 'lucide-react';
import { useLogin } from '../../../context/LoginContext';
import { useToast } from '../../../context/ToastContext';
import { dashboardService } from '../../../services/dashboardService';
import './SoporteInstitucional.css';

const SoporteInstitucional = () => {
  const { user } = useLogin();
  const { showToast } = useToast();
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [filtro, setFiltro] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);

  // Carga real de datos desde el servidor
  const cargarComentarios = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getComentariosSoporte();
      setComentarios(data);
    } catch (e) {
      console.error("Error cargando comentarios", e);
      showToast('No se pudieron cargar los mensajes', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarComentarios();
  }, []);

  const handleEnviar = async (e) => {
    e.preventDefault();
    if (!nuevoComentario.trim()) return;

    try {
      const dataNuevo = {
        autor: user?.nombre || 'Usuario Institucional',
        institucion: user?.institucion || 'Institución',
        rol: user?.rol || 'institucion',
        mensaje: nuevoComentario,
        prioridad: 'normal',
        estado: 'pendiente'
      };

      await dashboardService.postComentarioSoporte(dataNuevo);
      
      // Limpiar y recargar
      setNuevoComentario('');
      showToast('Comentario publicado en el canal de soporte', 'success');
      cargarComentarios();
    } catch (error) {
      showToast('Error al enviar el comentario', 'error');
    }
  };

  const comentariosFiltrados = comentarios.filter(c => {
    const cumpleFiltro = filtro === 'todos' || c.estado === filtro;
    const cumpleBusqueda = c.mensaje.toLowerCase().includes(busqueda.toLowerCase()) || 
                          c.autor.toLowerCase().includes(busqueda.toLowerCase()) ||
                          c.institucion.toLowerCase().includes(busqueda.toLowerCase());
    return cumpleFiltro && cumpleBusqueda;
  });

  return (
    <div className="soporte-container">
      <header className="soporte-header-full">
        <div className="soporte-title-group">
          <div className="soporte-icon-wrapper">
            <MessageCircle size={24} />
          </div>
          <div>
            <h1>Soporte y Comunicación Institucional</h1>
            <p>Canal directo de comunicación entre Editores e Instituciones con la Administración Central</p>
          </div>
        </div>
        
        <div className="soporte-header-stats">
          <div className="soporte-stat-item">
            <span className="stat-label">Total</span>
            <span className="stat-value">{comentarios.length}</span>
          </div>
          <div className="soporte-stat-item">
            <span className="stat-label">Pendientes</span>
            <span className="stat-value pending">{comentarios.filter(c => c.estado === 'pendiente').length}</span>
          </div>
        </div>
      </header>

      <div className="soporte-main-layout">
        <aside className="soporte-sidebar-controls">
          <div className="soporte-control-group">
            <label><Search size={14} /> Buscar mensaje</label>
            <input 
              type="text" 
              placeholder="Contenido, autor..." 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="soporte-control-group">
            <label><Filter size={14} /> Filtrar por estado</label>
            <div className="filter-pills">
              {['todos', 'pendiente', 'respondido', 'leído'].map(f => (
                <button 
                  key={f} 
                  className={`filter-pill ${filtro === f ? 'active' : ''}`}
                  onClick={() => setFiltro(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="soporte-info-card">
            <Info size={18} />
            <p>Este espacio es de uso exclusivo para coordinaciones técnicas. Para fallos críticos de acceso, contacte a soporte TI por los canales oficiales.</p>
          </div>
        </aside>

        <section className="soporte-messages-area">
          <div className="soporte-input-box">
            <form onSubmit={handleEnviar}>
              <div className="input-wrapper">
                <textarea 
                  placeholder="Escriba un comentario o solicitud para el Administrador..."
                  value={nuevoComentario}
                  onChange={(e) => setNuevoComentario(e.target.value)}
                />
                <div className="input-footer">
                  <div className="input-hints">
                    <span>Shift + Enter para nueva línea</span>
                  </div>
                  <button type="submit" disabled={!nuevoComentario.trim()}>
                    <Send size={16} />
                    Enviar Comentario
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="soporte-messages-list">
            {comentariosFiltrados.length === 0 ? (
              <div className="no-messages">
                <MessageSquare size={48} />
                <p>No hay mensajes que coincidan con los filtros</p>
              </div>
            ) : (
              comentariosFiltrados.map((coment) => (
                <div key={coment.id} className={`message-card ${coment.rol === 'admin' ? 'admin-msg' : ''}`}>
                  <div className="message-header">
                    <div className="message-author-info">
                      <div className="author-avatar">
                        {coment.rol === 'admin' ? <Shield size={16} /> : <User size={16} />}
                      </div>
                      <div>
                        <h3>{coment.autor}</h3>
                        <span>{coment.institucion}</span>
                      </div>
                    </div>
                    <div className="message-meta">
                      <div className={`status-badge ${coment.estado}`}>
                        {coment.estado}
                      </div>
                      <span className="timestamp">
                        <Calendar size={12} />
                        {new Date(coment.fecha).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="message-body">
                    <p>{coment.mensaje}</p>
                  </div>
                  <div className="message-actions">
                    <button className="icon-btn"><MoreVertical size={16} /></button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default SoporteInstitucional;
