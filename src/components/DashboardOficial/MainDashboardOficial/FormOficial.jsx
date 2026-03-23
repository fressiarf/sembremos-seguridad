import React, { useState } from 'react';
import './FormOficial.css';
import { oficialService } from '../../../services/oficialService';
import { useToast } from '../../../context/ToastContext';

const FormOficial = ({ tarea, onComplete }) => {
  const [formData, setFormData] = useState({
    reporteOficial: '',
    inversionColones: '',
    fotos: ''
  });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.reporteOficial.trim()) {
      showToast('Describí lo que hiciste para completar la tarea', 'warning');
      return;
    }

    setLoading(true);
    try {
      const fotosArray = formData.fotos
        ? formData.fotos.split(',').map(f => f.trim()).filter(f => f)
        : [];

      await oficialService.completarTarea(tarea.id, {
        reporteOficial: formData.reporteOficial,
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
    <form onSubmit={handleSubmit} className="form-oficial" style={{ borderRadius: 0, boxShadow: 'none', border: 'none', margin: 0 }}>
      <div className="form-oficial__body">
        <div className="form-group" style={{ marginBottom: '12px' }}>
          <label>¿Qué hiciste para completar esta tarea? *</label>
          <textarea
            className="form-textarea"
            placeholder="Describí las acciones realizadas..."
            value={formData.reporteOficial}
            onChange={e => setFormData({...formData, reporteOficial: e.target.value})}
            style={{ height: '80px' }}
          />
        </div>
        <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="form-group">
            <label>Inversión realizada (₡)</label>
            <input
              type="number"
              className="form-input"
              placeholder="0"
              value={formData.inversionColones}
              onChange={e => setFormData({...formData, inversionColones: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Fotos de evidencia (URLs)</label>
            <input
              type="text"
              className="form-input"
              placeholder="url1, url2, ..."
              value={formData.fotos}
              onChange={e => setFormData({...formData, fotos: e.target.value})}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="form-submit-btn"
          style={{ marginTop: '12px', width: '100%' }}
        >
          {loading ? 'Guardando...' : '✓ Marcar como Completada'}
        </button>
      </div>
    </form>
  );
};

export default FormOficial;
