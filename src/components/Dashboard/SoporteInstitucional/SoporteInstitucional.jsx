import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Send, User, Calendar, Shield, 
  MessageCircle, Info, MoreVertical, Search, Filter,
  CheckCircle, Trash2, Reply, Loader, AlertTriangle
} from 'lucide-react';
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
  const [enviando, setEnviando] = useState(false);

  const [replyToInstitucion, setReplyToInstitucion] = useState(null);

  const isAdmin = user?.rol === 'admin' || user?.rol === 'superadmin';

  // Carga de datos
  const cargarComentarios = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getComentariosSoporte();
      setComentarios(Array.isArray(data) ? data : []);
    } catch (e) {
      showToast('Error al conectar con el servidor', 'error');
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
      setEnviando(true);
      const dataNuevo = {
        autor: user?.nombre || 'Funcionario',
        institucion: user?.institucion || 'Institución',
        rol: user?.rol || 'institucion',
        mensaje: nuevoComentario,
        prioridad: 'normal',
        estado: 'pendiente',
        targetInstitucion: isAdmin ? replyToInstitucion : null // Tag the destination if Admin is replying
      };

      await dashboardService.postComentarioSoporte(dataNuevo);
      setNuevoComentario('');
      setReplyToInstitucion(null); // Clear reply context
      showToast('Mensaje enviado al canal de soporte', 'success');
      cargarComentarios();
    } catch (error) {
      showToast('Error al enviar el mensaje', 'error');
    } finally {
      setEnviando(false);
    }
  };

  const handleUpdateStatus = async (id, nuevoEstado) => {
    try {
      await dashboardService.updateComentarioSoporte(id, { estado: nuevoEstado });
      setComentarios(prev => prev.map(c => c.id === id ? { ...c, estado: nuevoEstado } : c));
      showToast(`Estado actualizado a ${nuevoEstado}`, 'success');
    } catch (e) {
      showToast('Error al actualizar estado', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Desea eliminar este mensaje permanentemente?')) return;
    try {
      await dashboardService.deleteComentarioSoporte(id);
      setComentarios(prev => prev.filter(c => c.id !== id));
      showToast('Mensaje eliminado correctamente', 'success');
    } catch (e) {
      showToast('Error al eliminar mensaje', 'error');
    }
  };

  const comentariosFiltrados = comentarios.filter(c => {
    // 1. FILTRO POR INSTITUCIÓN (Multi-tenant logic)
    const esVisibleParaUsuario = isAdmin || 
                                 c.institucion === user?.institucion || 
                                 c.targetInstitucion === user?.institucion;

    if (!esVisibleParaUsuario) return false;

    // 2. FILTRO POR ESTADO
    const cumpleFiltro = filtro === 'todos' || c.estado === filtro;

    // 3. FILTRO POR BÚSQUEDA
    const cumpleBusqueda = 
      c.mensaje.toLowerCase().includes(busqueda.toLowerCase()) || 
      c.autor.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.institucion.toLowerCase().includes(busqueda.toLowerCase());

    return cumpleFiltro && cumpleBusqueda;
  });

  if (loading && comentarios.length === 0) {
    return (
      <div className="no-messages-v2">
        <Loader className="spinner-icon" size={48} />
        <p>Cargando canal de comunicación institucional...</p>
      </div>
    );
  }

  return (
    <div className="soporte-view-wrapper">
      <div 
        className="soporte-hero-banner"
        style={{ 
          background: `linear-gradient(rgba(11, 34, 64, 0.85), rgba(11, 34, 64, 0.85)), url('/bg-institucional.png')`,
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="soporte-hero-content">
          <div className="banner-badge">CANAL DE COORDINACIÓN TÉCNICA</div>
          <h1>Soporte y Comunicación</h1>
          <p>Herramienta directa para la coordinación entre instituciones federadas y la administración central.</p>
        </div>
      </div>

      <div className="soporte-container-custom">
        <aside className="soporte-sidebar-glass">
          <div className="glass-control-card">
            <h3><Search size={16} /> Buscar Mensaje</h3>
            <input 
              type="text" 
              placeholder="Descripción, autor..." 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="glass-control-card">
            <h3><Filter size={16} /> Estado</h3>
            <div className="filter-pills-v2">
              {[
                { id: 'todos', label: 'Ver Todos' },
                { id: 'pendiente', label: 'Pendientes' },
                { id: 'respondido', label: 'Respondidos' },
                { id: 'leído', label: 'Leídos' }
              ].map(f => (
                <button 
                  key={f.id} 
                  className={`filter-pill-v2 ${filtro === f.id ? 'active' : ''}`}
                  onClick={() => setFiltro(f.id)}
                >
                  {f.label}
                  <span className="stats-count">
                    {f.id === 'todos' ? comentarios.length : comentarios.filter(c => c.estado === f.id).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div style={{
            background: '#002f6c', color: 'white', padding: '1.25rem',
            borderRadius: '16px', fontSize: '0.75rem', lineHeight: '1.5',
            display: 'flex', gap: '10px'
          }}>
            <Info size={40} style={{ opacity: 0.8 }} />
            <p>Este canal es para coordinaciones estratégicas. No lo utilice para procesos que requieran firma digital o trámites legales formales.</p>
          </div>
        </aside>

        <section className="soporte-feed-area">
          <div className="soporte-input-card">
            <form onSubmit={handleEnviar} className="input-box-premium">
              <textarea 
                placeholder="Escriba su consulta o comentario para la administración..."
                value={nuevoComentario}
                onChange={(e) => setNuevoComentario(e.target.value)}
              />
              <div className="input-actions">
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>
                  Identificado como: <strong>{user?.nombre}</strong> ({user?.institucion})
                </span>
                <button type="submit" disabled={!nuevoComentario.trim() || enviando} className="btn-send-message">
                  {enviando ? <Loader className="animate-spin" size={18} /> : <Send size={18} />}
                  Enviar Comentario
                </button>
              </div>
            </form>
          </div>

          <div className="soporte-messages-list">
            {comentariosFiltrados.length === 0 ? (
              <div className="no-messages-v2">
                <MessageSquare size={64} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                <p>No se encontraron mensajes en esta categoría.</p>
              </div>
            ) : (
              comentariosFiltrados.map((coment) => (
                <div key={coment.id} className="chat-bubble-container">
                  <div className={`chat-bubble ${coment.rol === 'admin' ? 'bubble-admin' : 'bubble-user'}`}>
                    <div className="bubble-header">
                      <div className="author-meta">
                        <div className="avatar-mini">
                          {coment.rol === 'admin' ? <Shield size={16} /> : <User size={16} />}
                        </div>
                        <div>
                          <h4>{coment.autor}</h4>
                          <span>{coment.institucion}</span>
                        </div>
                      </div>
                      <span className="timestamp-v2">
                        <Calendar size={12} style={{ marginRight: '4px' }} />
                        {new Date(coment.fecha).toLocaleDateString()} · {new Date(coment.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="bubble-body">
                      <p>{coment.mensaje}</p>
                    </div>

                    <div className="bubble-footer">
                      <div className="status-pills">
                        <span className={`status-badge-v2 ${coment.estado}`}>
                          {coment.estado}
                        </span>
                        {coment.prioridad === 'alta' && (
                          <span className="status-badge-v2" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>Prioridad Alta</span>
                        )}
                      </div>

                      {isAdmin && (
                        <div className="msg-actions-v2">
                          {coment.estado === 'pendiente' && (
                            <button 
                              className="action-btn-v2" 
                              onClick={() => handleUpdateStatus(coment.id, 'leído')}
                              title="Marcar como leido"
                            >
                              <CheckCircle size={14} /> Leído
                            </button>
                          )}
                          {coment.estado !== 'respondido' && (
                            <button 
                              className="action-btn-v2" 
                              onClick={() => {
                                setNuevoComentario(`RE: ${coment.mensaje.substring(0, 30)}... \n\n`);
                                setReplyToInstitucion(coment.institucion); 
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              title="Responder"
                            >
                              <Reply size={14} /> Responder
                            </button>
                          )}
                          <button 
                            className="action-btn-v2" 
                            onClick={() => handleUpdateStatus(coment.id, 'respondido')}
                            title="Marcar como respondido"
                          >
                           Resuelto
                          </button>
                          <button 
                            className="action-btn-v2 delete" 
                            onClick={() => handleDelete(coment.id)}
                            title="Eliminar"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>
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
