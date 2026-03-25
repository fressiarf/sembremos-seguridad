import React, { useState, useRef } from 'react';
import './FormInstitucion.css';
import { institucionService } from '../../../services/oficialService';
import { useToast } from '../../../context/ToastContext';
import { useLogin } from '../../../context/LoginContext';
import { 
  ClipboardList, Users, DollarSign, Upload, MessageSquare, 
  ChevronDown, X, FileImage, Send, MapPin, Calendar
} from 'lucide-react';

const TIPOS_ACTIVIDAD = [
  'Charla', 'Taller', 'Feria', 'Festival', 'Jornada de Voluntariado',
  'Campaña', 'Reunión', 'Visita Domiciliaria', 'Capacitación',
  'Evento Deportivo', 'Mesa de Articulación', 'Otro'
];

const LOCATION_DATA = {
  "Puntarenas": {
    "Puntarenas": ["Puntarenas Centro", "Barranca", "El Roble", "Chacarita", "Fray Casiano", "El Carmen"],
    "Esparza": ["Espíritu Santo", "San Juan", "Macacona", "San Rafael", "San Jerónimo"]
  },
  "San José": {
    "San José": ["Carmen", "Merced", "Hospital", "Catedral", "Zapote", "San Francisco de Dos Ríos", "Uruca", "Mata Redonda", "Pavas", "Hatillo", "San Sebastián"]
  }
};

const AGE_GROUPS = [
  { key: 'ninos', label: 'Niñez', range: '0-12 años', emoji: '👶' },
  { key: 'adolescentes', label: 'Adolescencia', range: '13-17 años', emoji: '🧑' },
  { key: 'jovenes', label: 'Juventud', range: '18-35 años', emoji: '💪' },
  { key: 'adultos', label: 'Adultos', range: '36-59 años', emoji: '🧑‍💼' },
  { key: 'adultoMayor', label: 'Adulto Mayor', range: '60+ años', emoji: '👴' },
];

const FormInstitucion = ({ tarea, onComplete, initialReporte = null }) => {
  const { showToast } = useToast();
  const { user } = useLogin();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  // Sections collapse state
  const [sections, setSections] = useState({
    actividad: true,
    asistentes: true,
    inversion: true,
    archivos: true,
    observaciones: false,
  });

  // Form data pre-filled if initialReporte is provided
  const [formData, setFormData] = useState({
    tipoActividad: initialReporte?.tipoActividad || '',
    fechaRealizacion: initialReporte?.fecha || '',
    provincia: '',
    canton: '',
    distrito: '',
    lugarExacto: initialReporte?.lugar || '',
    descripcion: initialReporte?.descripcion || '',
    asistentes: initialReporte?.asistentes || { ninos: '', adolescentes: '', jovenes: '', adultos: '', adultoMayor: '' },
    inversionColones: initialReporte?.inversionColones || '',
    detalleRecursos: initialReporte?.detalleRecursos || '',
    observaciones: initialReporte?.observaciones || '',
    permisosImagen: false,
  });

  const [archivos, setArchivos] = useState(
    initialReporte?.fotos ? initialReporte.fotos.map(f => ({ name: f, size: 'Pre-cargado' })) : []
  );

  const toggleSection = (key) => {
    setSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateAsistentes = (key, value) => {
    setFormData(prev => ({
      ...prev,
      asistentes: { ...prev.asistentes, [key]: value }
    }));
  };

  const totalAsistentes = AGE_GROUPS.reduce((sum, group) => {
    return sum + (parseInt(formData.asistentes[group.key]) || 0);
  }, 0);

  // Simulate file selection
  const handleFileSelect = () => {
    // Simulate picking files
    const mockFiles = [
      { name: `evidencia_${tarea.id}_${Date.now()}.jpg`, size: '2.4 MB' },
    ];
    if (archivos.length >= 5) {
      showToast('Máximo 5 archivos permitidos', 'warning');
      return;
    }
    setArchivos(prev => [...prev, ...mockFiles]);
    showToast('Archivo agregado ✓', 'success');
  };

  const removeFile = (index) => {
    setArchivos(prev => prev.filter((_, i) => i !== index));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.descripcion.trim()) {
      showToast('Describí lo que se realizó en la actividad', 'warning');
      return;
    }
    if (!formData.tipoActividad) {
      showToast('Seleccioná el tipo de actividad', 'warning');
      return;
    }
    if (totalAsistentes === 0) {
      showToast('Ingresá al menos un asistente en la sección de población beneficiada', 'warning');
      return;
    }
    if (archivos.length > 0 && !formData.permisosImagen) {
      showToast('Debe confirmar el uso legal de las imágenes adjuntas marcando la casilla al final del formulario.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        responsableId: user?.id,
        reporteInstitucion: formData.descripcion,
        tipoActividad: formData.tipoActividad,
        fechaRealizacion: formData.fechaRealizacion || new Date().toISOString().split('T')[0],
        lugar: formData.distrito ? `${formData.distrito}, ${formData.canton}. ${formData.lugarExacto}` : formData.lugarExacto,
        asistentes: {
          ninos: parseInt(formData.asistentes.ninos) || 0,
          adolescentes: parseInt(formData.asistentes.adolescentes) || 0,
          jovenes: parseInt(formData.asistentes.jovenes) || 0,
          adultos: parseInt(formData.asistentes.adultos) || 0,
          adultoMayor: parseInt(formData.asistentes.adultoMayor) || 0,
        },
        totalAsistentes,
        inversionColones: parseFloat(formData.inversionColones) || 0,
        detalleRecursos: formData.detalleRecursos,
        archivos: archivos.map(f => f.name),
        observaciones: formData.observaciones,
        fotos: archivos.map(f => f.name),
      };

      if (initialReporte) {
        await institucionService.editarReporteRechazado(initialReporte.id, payload);
        showToast('¡Reporte corregido y enviado exitosamente! ✓', 'success');
      } else {
        await institucionService.completarTarea(tarea.id, payload);
        showToast('¡Reporte generado exitosamente! ✓', 'success');
      }
      
      onComplete();
    } catch (error) {
      showToast('Error al enviar el reporte', 'error');
    } finally {
      setLoading(false);
    }
  };

  const SectionHeader = ({ icon: Icon, title, sectionKey }) => (
    <div className="form-section-header" onClick={() => toggleSection(sectionKey)}>
      <div className="section-icon"><Icon size={14} /></div>
      {title}
      <ChevronDown size={16} className={`section-chevron ${!sections[sectionKey] ? 'collapsed' : ''}`} />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="form-resultados">
      
      {/* ═══ SECCIÓN 1: INFORMACIÓN DE LA ACTIVIDAD ═══ */}
      <div className="form-section">
        <SectionHeader icon={ClipboardList} title="Información de la Actividad" sectionKey="actividad" />
        {sections.actividad && (
          <div className="form-section-body">
            <div className="fr-row-2">
              <div>
                <label className="fr-label">Tipo de Actividad <span className="required">*</span></label>
                <select 
                  className="fr-select"
                  value={formData.tipoActividad}
                  onChange={e => updateField('tipoActividad', e.target.value)}
                >
                  <option value="">Seleccionar...</option>
                  {TIPOS_ACTIVIDAD.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="fr-label">Fecha de Realización <span className="required">*</span></label>
                <input 
                  type="date" 
                  className="fr-input"
                  value={formData.fechaRealizacion}
                  onChange={e => updateField('fechaRealizacion', e.target.value)}
                />
              </div>
            </div>
            <div className="fr-row-3" style={{ marginTop: '1rem' }}>
              <div>
                <label className="fr-label">Provincia</label>
                <select className="fr-select" value={formData.provincia} onChange={e => setFormData({...formData, provincia: e.target.value, canton: '', distrito: ''})}>
                  <option value="">Seleccionar...</option>
                  {Object.keys(LOCATION_DATA).map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="fr-label">Cantón</label>
                <select className="fr-select" value={formData.canton} onChange={e => setFormData({...formData, canton: e.target.value, distrito: ''})} disabled={!formData.provincia}>
                  <option value="">Seleccionar...</option>
                  {formData.provincia && Object.keys(LOCATION_DATA[formData.provincia]).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="fr-label">Distrito</label>
                <select className="fr-select" value={formData.distrito} onChange={e => setFormData({...formData, distrito: e.target.value})} disabled={!formData.canton}>
                  <option value="">Seleccionar...</option>
                  {formData.canton && LOCATION_DATA[formData.provincia][formData.canton].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <label className="fr-label">Detalle Exacto del Lugar (Punto de Referencia)</label>
              <input 
                type="text" 
                className="fr-input"
                placeholder="Ej: Salón Comunal, Escuela..."
                value={formData.lugarExacto}
                onChange={e => updateField('lugarExacto', e.target.value)}
              />
            </div>
            <div style={{ marginTop: '1rem' }}>
              <label className="fr-label">Descripción de lo realizado <span className="required">*</span></label>
              <textarea 
                className="fr-textarea"
                placeholder="Describí detalladamente las acciones ejecutadas, logros obtenidos y cualquier dato relevante..."
                value={formData.descripcion}
                onChange={e => updateField('descripcion', e.target.value)}
                rows="4"
              />
            </div>
          </div>
        )}
      </div>

      {/* ═══ SECCIÓN 2: POBLACIÓN BENEFICIADA ═══ */}
      <div className="form-section">
        <SectionHeader icon={Users} title="Población Beneficiada — Asistentes por Rango de Edad" sectionKey="asistentes" />
        {sections.asistentes && (
          <div className="form-section-body">
            <div className="age-grid">
              {AGE_GROUPS.map(group => (
                <div key={group.key} className="age-group">
                  <span className="age-emoji">{group.emoji}</span>
                  <span className="age-label">{group.label}</span>
                  <span className="age-range">{group.range}</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.asistentes[group.key]}
                    onChange={e => updateAsistentes(group.key, e.target.value)}
                  />
                </div>
              ))}
              <div className="age-total">
                <span className="age-label">TOTAL</span>
                <span className="total-number">{totalAsistentes}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ═══ SECCIÓN 3: INVERSIÓN Y RECURSOS ═══ */}
      <div className="form-section">
        <SectionHeader icon={DollarSign} title="Inversión y Recursos" sectionKey="inversion" />
        {sections.inversion && (
          <div className="form-section-body">
            <div className="fr-row-2">
              <div>
                <label className="fr-label">Inversión Realizada (₡)</label>
                <input
                  type="number"
                  className="fr-input"
                  placeholder="0"
                  min="0"
                  value={formData.inversionColones}
                  onChange={e => updateField('inversionColones', e.target.value)}
                />
              </div>
              <div>
                <label className="fr-label">Detalle de Recursos Utilizados</label>
                <input
                  type="text"
                  className="fr-input"
                  placeholder="Ej: Material didáctico, refrigerios, transporte..."
                  value={formData.detalleRecursos}
                  onChange={e => updateField('detalleRecursos', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ═══ SECCIÓN 4: EVIDENCIA FOTOGRÁFICA ═══ */}
      <div className="form-section">
        <SectionHeader icon={Upload} title="Evidencia Fotográfica" sectionKey="archivos" />
        {sections.archivos && (
          <div className="form-section-body">
            <div 
              className={`file-upload-zone ${archivos.length > 0 ? 'has-files' : ''}`}
              onClick={handleFileSelect}
            >
              <div className="file-upload-icon">
                <FileImage size={22} color="#64748b" />
              </div>
              <div className="file-upload-text">
                Clic para agregar archivos de evidencia
              </div>
              <div className="file-upload-hint">
                Formatos aceptados: JPG, PNG, PDF · Máximo 5 archivos
              </div>
            </div>

            {archivos.length > 0 && (
              <div className="file-list">
                {archivos.map((file, index) => (
                  <div key={index} className="file-item">
                    <FileImage size={16} color="#3b82f6" />
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">{file.size}</span>
                    <button 
                      type="button"
                      className="file-remove" 
                      onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ═══ SECCIÓN 5: OBSERVACIONES ═══ */}
      <div className="form-section">
        <SectionHeader icon={MessageSquare} title="Observaciones Adicionales" sectionKey="observaciones" />
        {sections.observaciones && (
          <div className="form-section-body">
            <div>
              <label className="fr-label">Notas o comentarios extras</label>
              <textarea
                className="fr-textarea"
                placeholder="Cualquier observación adicional sobre la actividad..."
                value={formData.observaciones}
                onChange={e => updateField('observaciones', e.target.value)}
                rows="3"
              />
            </div>
          </div>
        )}
      </div>

      {/* ═══ CHECKBOX LEGAL ═══ */}
      <div style={{ padding: '0 0.5rem', marginTop: '0.25rem', marginBottom: '0.5rem' }}>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
          <input 
            type="checkbox" 
            checked={formData.permisosImagen}
            onChange={e => updateField('permisosImagen', e.target.checked)}
            style={{ marginTop: '4px', width: '18px', height: '18px', accentColor: '#3b82f6', flexShrink: 0 }}
          />
          <span style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.5 }}>
            <strong style={{ color: '#0b2240' }}>Declaración jurada de uso de imagen:</strong> Confirmo que las fotografías o material audiovisual adjunto cuentan con los permisos y consentimientos informados requeridos por la legislación vigente para su uso como evidencia oficial en el programa Sembremos Seguridad y organismos cooperantes (INL).
          </span>
        </label>
      </div>

      {/* ═══ SUBMIT ═══ */}
      <div className="fr-submit-wrapper">
        <button type="submit" disabled={loading} className="fr-submit-btn">
          {loading ? (
            'Guardando Reporte...'
          ) : (
            <>
              <Send size={18} />
              {initialReporte ? 'Enviar Corrección' : 'Enviar Reporte de Resultados'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default FormInstitucion;
