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

const AGE_GROUPS = [
  { key: 'ninos', label: 'Niñez', range: '0-12 años', emoji: '👶' },
  { key: 'adolescentes', label: 'Adolescencia', range: '13-17 años', emoji: '🧑' },
  { key: 'jovenes', label: 'Juventud', range: '18-35 años', emoji: '💪' },
  { key: 'adultos', label: 'Adultos', range: '36-59 años', emoji: '🧑‍💼' },
  { key: 'adultoMayor', label: 'Adulto Mayor', range: '60+ años', emoji: '👴' },
];

const FormInstitucion = ({ tarea, onComplete }) => {
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

  // Form data
  const [formData, setFormData] = useState({
    tipoActividad: '',
    fechaRealizacion: '',
    lugar: '',
    descripcion: '',
    asistentes: { ninos: '', adolescentes: '', jovenes: '', adultos: '', adultoMayor: '' },
    inversionColones: '',
    detalleRecursos: '',
    observaciones: '',
  });

  const [archivos, setArchivos] = useState([]);

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

    setLoading(true);
    try {
      await institucionService.completarTarea(tarea.id, {
        responsableId: user?.id,
        reporteInstitucion: formData.descripcion,
        tipoActividad: formData.tipoActividad,
        fechaRealizacion: formData.fechaRealizacion || new Date().toISOString().split('T')[0],
        lugar: formData.lugar,
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
      });

      showToast('¡Reporte enviado exitosamente! ✓', 'success');
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
            <div className="fr-row-3">
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
              <div>
                <label className="fr-label">Lugar / Ubicación</label>
                <input 
                  type="text" 
                  className="fr-input"
                  placeholder="Ej: Escuela de Barranca"
                  value={formData.lugar}
                  onChange={e => updateField('lugar', e.target.value)}
                />
              </div>
            </div>
            <div>
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

      {/* ═══ SUBMIT ═══ */}
      <div className="fr-submit-wrapper">
        <button type="submit" disabled={loading} className="fr-submit-btn">
          {loading ? (
            'Enviando Reporte...'
          ) : (
            <>
              <Send size={18} />
              Enviar Reporte de Resultados
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default FormInstitucion;
