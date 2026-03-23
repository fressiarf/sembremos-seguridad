import React, { useState } from 'react';
import './FormInstitucion.css';
import { institucionService } from '../../../services/oficialService';
import { useToast } from '../../../context/ToastContext';

const FormInstitucion = ({ tarea, onComplete }) => {
  const [formData, setFormData] = useState({
    reporteInstitucion: '',
    inversionColones: '',
    fotos: ''
  });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.reporteInstitucion.trim()) {
      showToast('Describí lo que hiciste para completar la tarea', 'warning');
      return;
    }

    setLoading(true);
    try {
      const fotosArray = formData.fotos
        ? formData.fotos.split(',').map(f => f.trim()).filter(f => f)
        : [];

      await institucionService.completarTarea(tarea.id, {
        reporteInstitucion: formData.reporteInstitucion,
        inversionColones: parseFloat(formData.inversionColones) || 0,
        fotos: fotosArray
      });

      showToast('¡Tarea completada exitosamente! ✓', 'success');
      onComplete();
    } catch (error) {
      showToast('Error al completar la tarea', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="FormOficialContainer" style={{ border: 'none', background: 'transparent', boxShadow: 'none', padding: '1.5rem' }}>
      <div className="FormGroup">
        <label>¿Qué hiciste para completar esta tarea? *</label>
        <textarea
          className="FormControl FormTextarea"
          placeholder="Describí las acciones realizadas..."
          value={formData.reporteInstitucion}
          onChange={e => setFormData({...formData, reporteInstitucion: e.target.value})}
          style={{ minHeight: '100px' }}
        />
      </div>
      <div className="FormRowGrid">
        <div className="FormGroup">
          <label>Inversión realizada (₡)</label>
          <input
            type="number"
            className="FormControl"
            placeholder="0"
            value={formData.inversionColones}
            onChange={e => setFormData({...formData, inversionColones: e.target.value})}
          />
        </div>
        <div className="FormGroup">
          <label>Fotos de evidencia (URLs)</label>
          <input
            type="text"
            className="FormControl"
            placeholder="url1, url2, ..."
            value={formData.fotos}
            onChange={e => setFormData({...formData, fotos: e.target.value})}
          />
        </div>
      </div>
      <div className="FormActions">
        <button
          type="submit"
          disabled={loading}
          className="BtnSubmit"
          style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
        >
          {loading ? 'Guardando...' : '✓ Marcar como Completada'}
        </button>
      </div>
    </form>
  );
};

export default FormInstitucion;
