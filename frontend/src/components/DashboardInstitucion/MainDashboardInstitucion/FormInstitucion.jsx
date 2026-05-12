import React, { useState, useRef } from 'react';
import './FormInstitucion.css';
import { editoresService } from '../../../services/editoresService';
import { useToast } from '../../../context/ToastContext';
import { useLogin } from '../../../context/LoginContext';
import { 
  ClipboardList, Users, DollarSign, Upload, MessageSquare, 
  ChevronDown, X, FileImage, Send, MapPin, LayoutGrid, Calendar, Activity
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
  "San Jose": {
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

  // Determinar el tipo de tarea (por defecto 1 si no viene)
  const tipoTarea = tarea?.tipo || 1;

  // Sections collapse state
  const [sections, setSections] = useState({
    actividad: true,
    cuantificacion: tarea?.seguimientoTipo === 'numerico' || (!tarea?.seguimientoTipo && tipoTarea !== 2),
    asistentes: tarea?.enfoqueHumano !== false && tipoTarea === 1,
    hitos: tarea?.seguimientoTipo === 'hitos' || tipoTarea === 2,
    seguridad: tipoTarea === 3,
    gestion: tipoTarea === 4,
    recursos: tipoTarea === 5,
    inversion: true,
    archivos: true,
    observaciones: false,
  });

  // Form data
  const [formData, setFormData] = useState({
    tipoActividad: initialReporte?.tipoActividad || '',
    fechaRealizacion: initialReporte?.fecha || '',
    provincia: '',
    canton: '',
    distrito: '',
    lugarExacto: initialReporte?.lugar || '',
    descripcion: initialReporte?.descripcion || '',
    // Tipo 1: Asistentes
    asistentes: initialReporte?.asistentes || { ninos: '', adolescentes: '', jovenes: '', adultos: '', adultoMayor: '' },
    // Tipo 2 o Seguimiento por Hitos: Hitos
    hitos: initialReporte?.hitos || tarea?.hitos || [
      { id: 'h1', label: 'Planificación / Diseño', completado: false },
      { id: 'h2', label: 'Licitación / Adjudicación', completado: false },
      { id: 'h3', label: 'Inicio de Obra', completado: false },
      { id: 'h4', label: 'Ejecución 50%', completado: false },
      { id: 'h5', label: 'Entrega Final', completado: false },
    ],
    // Tipo 3: Seguridad
    incidencias: initialReporte?.incidencias || '',
    numeroPatrullajes: initialReporte?.numeroPatrullajes || '',
    // Tipo 4: Gestión
    acuerdos: initialReporte?.acuerdos || '',
    institucionesPresentes: initialReporte?.institucionesPresentes || '',
    // Tipo 5: Recursos
    itemsEntregados: initialReporte?.itemsEntregados || '',
    numeroSerie: initialReporte?.numeroSerie || '',

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

  const toggleHito = (index) => {
    const newHitos = [...formData.hitos];
    newHitos[index].completado = !newHitos[index].completado;
    setFormData({ ...formData, hitos: newHitos });
  };

  const totalAsistentes = AGE_GROUPS.reduce((sum, group) => {
    return sum + (parseInt(formData.asistentes[group.key]) || 0);
  }, 0);

  const totalHitosCompletados = formData.hitos.filter(h => h.completado).length;
  const porcentajeHitos = Math.round((totalHitosCompletados / formData.hitos.length) * 100);

  const handleFileSelect = () => {
    const mockFiles = [{ name: `evidencia_${tarea?.id || 'temp'}_${Date.now()}.jpg`, size: '2.4 MB' }];
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.descripcion.trim()) {
      showToast('Describí lo que se realizó', 'warning');
      return;
    }
    
    // Validaciones por tipo
    if (tarea?.enfoqueHumano !== false && tipoTarea === 1 && totalAsistentes === 0) {
      showToast('Ingresá al menos un beneficiario', 'warning');
      return;
    }

    try {
      // Priorizamos la cantidad de impacto manual (ej: escuelas) sobre la suma demográfica si existe
      const impactoFinal = formData.cantidadImpacto !== undefined && formData.cantidadImpacto > 0 
        ? formData.cantidadImpacto 
        : totalAsistentes;

      const payload = {
        responsableId: user?.id,
        reporteInstitucion: formData.descripcion,
        tipoActividad: formData.tipoActividad,
        fechaRealizacion: formData.fechaRealizacion || new Date().toISOString().split('T')[0],
        lugar: formData.distrito ? `${formData.distrito}, ${formData.canton}. ${formData.lugarExacto}` : formData.lugarExacto,
        tipoTarea: tipoTarea,
        ...formData,
        totalAsistentes: impactoFinal, // Este campo es el que mapea a 'beneficiados' en el servicio
        archivos: archivos.map(f => f.name),
        fotos: archivos.map(f => f.name),
      };

      if (initialReporte) {
        await editoresService.editarReporteRechazado(initialReporte.id, payload);
        showToast('¡Reporte corregido y enviado! ✓', 'success');
      } else {
        await editoresService.completarTarea(tarea.id, payload);
        showToast('¡Reporte generado exitosamente! ✓', 'success');
      }
      
      onComplete();
    } catch (error) {
      showToast('Error al enviar el reporte', 'error');
    } finally {
      setLoading(false);
    }
  };

  const SectionHeader = ({ icon: Icon, title, sectionKey, subtitle = "" }) => (
    <div className="form-section-header" onClick={() => toggleSection(sectionKey)}>
      <div className="section-header-left">
        <div className="section-icon"><Icon size={14} /></div>
        <div className="section-title-wrapper">
           <span className="section-title-text">{title}</span>
           {subtitle && <span className="section-subtitle-text">{subtitle}</span>}
        </div>
      </div>
      <ChevronDown size={16} className={`section-chevron ${!sections[sectionKey] ? 'collapsed' : ''}`} />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="form-resultados">
      
      {/* ═══ SECCIÓN 1: INFORMACIÓN GENERAL ═══ */}
      <div className="form-section">
        <SectionHeader icon={ClipboardList} title="Información de la Actividad / Avance" sectionKey="actividad" />
        {sections.actividad && (
          <div className="form-section-body">
            <div className="fr-row-2">
              <div>
                <label className="fr-label">Tipo de Actividad <span className="required">*</span></label>
                <select className="fr-select" value={formData.tipoActividad} onChange={e => updateField('tipoActividad', e.target.value)} required>
                  <option value="">Seleccionar...</option>
                  {TIPOS_ACTIVIDAD.map(tipo => <option key={tipo} value={tipo}>{tipo}</option>)}
                </select>
              </div>
              <div>
                <label className="fr-label">Fecha del Avance <span className="required">*</span></label>
                <input type="date" className="fr-input" value={formData.fechaRealizacion} onChange={e => updateField('fechaRealizacion', e.target.value)} required />
              </div>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <label className="fr-label">Descripción Detallada del Avance <span className="required">*</span></label>
              <textarea className="fr-textarea" placeholder="¿Qué se hizo en este periodo?" value={formData.descripcion} onChange={e => updateField('descripcion', e.target.value)} rows="3" required />
            </div>
          </div>
        )}
      </div>

      {/* ═══ SECCIONES DINÁMICAS POR TIPO ═══ */}

      {/* ═══ SECCIÓN COMÚN: REGISTRO DE AVANCE CUANTITATIVO ═══ */}
      {(tarea?.seguimientoTipo === 'numerico' || (!tarea?.seguimientoTipo && tipoTarea !== 2)) && (
        <div className="form-section">
          <SectionHeader icon={Activity} title="Cuantificación del Avance" subtitle="Datos para la Barra de Progreso" sectionKey="cuantificacion" />
          {sections.cuantificacion && (
            <div className="form-section-body">
              <div style={{ background: '#f0f9ff', padding: '15px', borderRadius: '8px', border: '1px solid #bae6fd' }}>
                <label className="fr-label" style={{ color: '#0369a1', fontWeight: 700 }}>
                  {tarea?.detalleMeta ? `Cantidad de ${tarea.detalleMeta} a reportar` : 'Avance Cuantitativo del Objetivo'} <span className="required">*</span>
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <input 
                    type="number" 
                    className="fr-input" 
                    placeholder="0" 
                    min="0"
                    style={{ fontSize: '1.2rem', fontWeight: 800, width: '120px', textAlign: 'center' }}
                    value={formData.cantidadImpacto || ''} 
                    onChange={e => {
                      const val = parseInt(e.target.value) || 0;
                      updateField('cantidadImpacto', val);
                      if (tipoTarea === 3) updateField('numeroPatrullajes', val);
                    }} 
                    required 
                  />
                  <div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      Meta de la Tarea: <strong>{tarea?.meta}</strong> {tarea?.detalleMeta || 'unidades'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#0369a1', fontWeight: 600 }}>
                      Este valor alimentará directamente la barra de progreso de la Matriz.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══ SECCIONES DINÁMICAS POR TIPO (Detalles Cualitativos) ═══ */}

      {tarea?.enfoqueHumano !== false && tipoTarea === 1 && (
        <div className="form-section section--social">
          <SectionHeader icon={Users} title="Detalle Demográfico" subtitle="Opcional: Desglose de beneficiados" sectionKey="asistentes" />
          {sections.asistentes && (
            <div className="form-section-body">
              <div className="age-grid">
                {AGE_GROUPS.map(group => (
                  <div key={group.key} className="age-group">
                    <span className="age-emoji">{group.emoji}</span>
                    <span className="age-label">{group.label}</span>
                    <input type="number" min="0" placeholder="0" value={formData.asistentes[group.key]} onChange={e => updateAsistentes(group.key, e.target.value)} />
                  </div>
                ))}
                <div className="age-total">
                  <span className="age-label">Suma Demográfica</span>
                  <span className="total-number">{totalAsistentes}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══ SECCIÓN DE HITOS / FASES (Si aplica) ═══ */}

      {(tarea?.seguimientoTipo === 'hitos' || tipoTarea === 2) && (
        <div className="form-section section--infra">
          <SectionHeader icon={LayoutGrid} title="Control de Hitos Técnicos" subtitle={`Avance: ${porcentajeHitos}%`} sectionKey="hitos" />
          {sections.hitos && (
            <div className="form-section-body">
              <div className="hitos-checklist">
                {formData.hitos.map((hito, idx) => (
                  <label key={hito.id} className="hito-item">
                    <input type="checkbox" checked={hito.completado} onChange={() => toggleHito(idx)} />
                    <span className="hito-label">{hito.label}</span>
                  </label>
                ))}
              </div>
              <div className="infra-progress-bar">
                <div className="infra-progress-fill" style={{ width: `${porcentajeHitos}%` }}></div>
              </div>
            </div>
          )}
        </div>
      )}

      {tipoTarea === 3 && (
        <div className="form-section section--seguro">
          <SectionHeader icon={MapPin} title="Registro Operativo de Seguridad" sectionKey="seguridad" />
          {sections.seguridad && (
            <div className="form-section-body">
              <div className="fr-row-2">
                <div>
                  <label className="fr-label">Incidencias Detectadas</label>
                  <input type="number" className="fr-input" value={formData.incidencias} onChange={e => updateField('incidencias', e.target.value)} placeholder="0" />
                </div>
                <div>
                   {/* El número de patrullajes se maneja en la sección de cuantificación arriba */}
                   <label className="fr-label">Observaciones Operativas</label>
                   <input type="text" className="fr-input" value={formData.lugarExacto} onChange={e => updateField('lugarExacto', e.target.value)} placeholder="Sector, unidad..." />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {tipoTarea === 4 && (
        <div className="form-section section--gestion">
           <SectionHeader icon={MessageSquare} title="Acuerdos Interinstitucionales" sectionKey="gestion" />
           {sections.gestion && (
             <div className="form-section-body">
               <label className="fr-label">Instituciones Participantes</label>
               <input type="text" className="fr-input" placeholder="Ej: PANI, MEP, Municipalidad..." value={formData.institucionesPresentes} onChange={e => updateField('institucionesPresentes', e.target.value)} />
               <label className="fr-label" style={{marginTop: '1rem'}}>Acuerdos Alcanzados</label>
               <textarea className="fr-textarea" placeholder="Resumen de compromisos..." value={formData.acuerdos} onChange={e => updateField('acuerdos', e.target.value)} rows="3" />
             </div>
           )}
        </div>
      )}

      {tipoTarea === 5 && (
        <div className="form-section section--recursos">
          <SectionHeader icon={Send} title="Control de Recursos e Inventario" sectionKey="recursos" />
          {sections.recursos && (
            <div className="form-section-body">
              <div className="fr-row-2">
                <div>
                   <label className="fr-label">Ítem / Equipamiento Entregado</label>
                   <input type="text" className="fr-input" value={formData.itemsEntregados} onChange={e => updateField('itemsEntregados', e.target.value)} placeholder="Ej: Computadoras" />
                </div>
                <div>
                   <label className="fr-label">Números de Serie / Placa</label>
                   <input type="text" className="fr-input" value={formData.numeroSerie} onChange={e => updateField('numeroSerie', e.target.value)} placeholder="SN-000..." />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══ SECCIÓN COMÚN: INVERSIÓN ═══ */}
      <div className="form-section">
        <SectionHeader icon={DollarSign} title="Seguimiento Presupuestario" subtitle={tarea?.presupuestoEstimado ? `Presupuesto Estimado: ₡${tarea.presupuestoEstimado.toLocaleString()}` : ""} sectionKey="inversion" />
        {sections.inversion && (
          <div className="form-section-body">
            <div className="fr-row-2">
              <div>
                <label className="fr-label">Inversión del Avance (₡)</label>
                <input type="number" min="0" className="fr-input" value={formData.inversionColones} onChange={e => updateField('inversionColones', e.target.value)} />
              </div>
              <div>
                <label className="fr-label">Detalle de Gasto / Recursos</label>
                <input type="text" className="fr-input" value={formData.detalleRecursos} onChange={e => updateField('detalleRecursos', e.target.value)} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ═══ EVIDENCIA Y CIERRE ═══ */}
      <div className="form-section">
        <SectionHeader icon={Upload} title="Evidencia Fotográfica y Documentos" sectionKey="archivos" />
        {sections.archivos && (
          <div className="form-section-body">
            <div className="file-upload-zone" onClick={handleFileSelect}>
               <div className="file-upload-text">Clic para agregar evidencia</div>
            </div>
            {archivos.length > 0 && (
              <div className="file-list">
                {archivos.map((file, index) => (
                  <div key={index} className="file-item">
                    <span>{file.name}</span>
                    <button type="button" onClick={() => removeFile(index)}><X size={12} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="fr-legal-check">
        <label>
          <input type="checkbox" checked={formData.permisosImagen} onChange={e => updateField('permisosImagen', e.target.checked)} />
          <span>Confirmo el uso legal de imágenes bajo lineamientos de INL / Programa Sembremos Seguridad.</span>
        </label>
      </div>

      <div className="fr-submit-wrapper">
        <button type="submit" disabled={loading} className="fr-submit-btn">
          {loading ? 'Guardando...' : (initialReporte ? 'Corregir Reporte' : 'Enviar Reporte Estratégico')}
        </button>
      </div>
    </form>
  );
};

export default FormInstitucion;
