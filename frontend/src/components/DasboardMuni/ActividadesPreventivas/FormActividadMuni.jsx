import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { muniService } from '../../../services/muniService';

const FormActividadMuni = ({ isOpen, onClose, onSave, lineaIdPredeterminada = '' }) => {
  const [lineas, setLineas] = useState([]);
  const [instituciones, setInstituciones] = useState([]);
  const [formData, setFormData] = useState({
    titulo: '',
    tipo: 1, // 1: Social, 2: Infraestructura
    lineaAccionId: lineaIdPredeterminada,
    institucionAsignadaId: '',
    indicador: '',
    meta: '',
    fechaLimite: '',
    zona: '',
    presupuestoEstimado: 0
  });

  useEffect(() => {
    if (isOpen) {
      muniService.getFullMuniDashboard().then(data => {
        if (data && data.lineasConProgreso) {
          setLineas(data.lineasConProgreso);
        }
      });
      // Cargar instituciones válidas
      fetch('http://localhost:5000/usuarios')
        .then(res => res.json())
        .then(users => {
          const instMap = {};
          users.forEach(u => {
            if (u.rol === 'adminInstitucion' || u.institucion === 'Municipalidad') {
              if (!instMap[u.institucion]) instMap[u.institucion] = u;
            }
          });
          setInstituciones(Object.values(instMap));
        });

      setFormData({
        titulo: '',
        tipo: 1,
        lineaAccionId: lineaIdPredeterminada || (lineas.length > 0 ? lineas[0].id : ''),
        institucionAsignadaId: '',
        indicador: '',
        meta: '',
        fechaLimite: '',
        zona: '',
        presupuestoEstimado: 0
      });
    }
  }, [isOpen, lineaIdPredeterminada]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'tipo' || name === 'presupuestoEstimado' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const lineaSeleccionada = lineas.find(l => l.id === formData.lineaAccionId);
    const instSeleccionada = instituciones.find(i => i.id === formData.institucionAsignadaId) || { id: "11", institucion: "Municipalidad" };

    const nuevaTarea = {
      id: `TA-${Math.floor(Math.random() * 90000) + 10000}`,
      tipo: formData.tipo,
      lineaAccionId: formData.lineaAccionId,
      titulo: formData.titulo,
      indicador: formData.indicador,
      meta: formData.meta,
      metaValor: 1,
      plazo: "Variable",
      institucionId: instSeleccionada.id,
      institucionNombre: instSeleccionada.institucion,
      corresponsable: "Por asignar",
      evidenciaSeguimiento: "",
      completada: false,
      reporteInstitucion: "",
      fotos: [],
      inversionColones: 0,
      presupuestoEstimado: formData.presupuestoEstimado,
      estado: "PENDIENTE_ASIGNACION_INTERNA", // Regla de Negocio
      responsableId: null, // El Admin Institucional llenará esto
      fechaLimite: formData.fechaLimite,
      zona: formData.zona,
      prioridad: "media",
      lineaNumero: lineaSeleccionada ? lineaSeleccionada.no : 0,
      lineaNombre: lineaSeleccionada ? (lineaSeleccionada.problematica || lineaSeleccionada.titulo) : "Línea Municipal",
      creadorId: "11" // ID de la Muni
    };

    onSave(nuevaTarea);
  };

  if (!isOpen) return null;

  // Lógica de Validación de Instituciones por Línea de Acción
  const lineaActual = lineas.find(l => l.id === formData.lineaAccionId);
  const instValidas = instituciones.filter(inst => {
    if (!lineaActual || !lineaActual.institucionesLideres || lineaActual.institucionesLideres.length === 0) return true; // Si no hay restricción, mostrar todas
    return lineaActual.institucionesLideres.includes(inst.id) || inst.id === "11"; // Incluir siempre la Muni misma
  });

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000,
      padding: '20px', boxSizing: 'border-box'
    }}>
      <div style={{
        background: '#fff', borderRadius: '24px', padding: '32px',
        width: '100%', maxWidth: '850px', maxHeight: '95vh', overflow: 'hidden',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        boxSizing: 'border-box', display: 'flex', flexDirection: 'column'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: 0, fontSize: '1.35rem', color: '#0f172a', fontWeight: 800 }}>Nueva Actividad Preventiva</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                Título de la Actividad *
              </label>
              <input required type="text" name="titulo" value={formData.titulo} onChange={handleChange}
                placeholder="Ej: Construcción de parque recreativo"
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.95rem', boxSizing: 'border-box', outlineColor: '#0d9488' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                Tipo de Prevención
              </label>
              <select name="tipo" value={formData.tipo} onChange={handleChange}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.95rem', backgroundColor: '#fff', boxSizing: 'border-box', outlineColor: '#0d9488' }}>
                <option value={1}>Prevención Social</option>
                <option value={2}>Infraestructura</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                Línea de Acción *
              </label>
              <select required name="lineaAccionId" value={formData.lineaAccionId} onChange={handleChange}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.95rem', backgroundColor: '#fff', boxSizing: 'border-box', outlineColor: '#0d9488', textOverflow: 'ellipsis' }}>
                <option value="">Seleccione una línea</option>
                {lineas.map(l => (
                  <option key={l.id} value={l.id}>L#{l.no} - {l.problematica || l.titulo}</option>
                ))}
              </select>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                Institución Responsable (Asignar a) *
              </label>
              <select required name="institucionAsignadaId" value={formData.institucionAsignadaId} onChange={handleChange}
                disabled={!formData.lineaAccionId} title={!formData.lineaAccionId ? 'Seleccione una línea primero' : ''}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.95rem', backgroundColor: !formData.lineaAccionId ? '#f8fafc' : '#fff', boxSizing: 'border-box', outlineColor: '#0d9488' }}>
                <option value="">Seleccionar institución delegada</option>
                {instValidas.map(inst => (
                  <option key={inst.id} value={inst.id}>{inst.institucion}</option>
                ))}
              </select>
              {formData.lineaAccionId && lineaActual?.institucionesLideres && (
                <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}>
                  Filtrado según matriz institucional de la línea.
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Zona / Barrio *</label>
              <input required type="text" name="zona" value={formData.zona} onChange={handleChange} placeholder="Ej: Chacarita"
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.95rem', boxSizing: 'border-box', outlineColor: '#0d9488' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Fecha Límite</label>
              <input required type="date" name="fechaLimite" value={formData.fechaLimite} onChange={handleChange}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.95rem', boxSizing: 'border-box', outlineColor: '#0d9488', color: '#475569' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Presupuesto (₡)</label>
              <input type="number" name="presupuestoEstimado" value={formData.presupuestoEstimado} onChange={handleChange} min="0" step="50000"
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.95rem', boxSizing: 'border-box', outlineColor: '#0d9488' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Indicador de Éxito</label>
              <input type="text" name="indicador" value={formData.indicador} onChange={handleChange} placeholder="Ej: 5 parques remozados"
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.95rem', boxSizing: 'border-box', outlineColor: '#0d9488' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Meta</label>
              <input type="text" name="meta" value={formData.meta} onChange={handleChange} placeholder="Ej: 30 Jóvenes"
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.95rem', boxSizing: 'border-box', outlineColor: '#0d9488' }} />
            </div>
          </div>

          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '16px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
            <button type="button" onClick={onClose}
              style={{ padding: '12px 24px', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#475569', fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' }}>
              Cancelar
            </button>
            <button type="submit"
              style={{ padding: '12px 24px', borderRadius: '12px', border: 'none', background: '#0d9488', color: '#fff', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(13, 148, 136, 0.3)', transition: 'background 0.2s' }}>
              <Save size={18} /> Agregar Actividad
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormActividadMuni;
