import React, { useState } from 'react';
import './FormOficial.css';

/**
 * Componente FormOficial
 * Permite al oficial actualizar el estado y la bitácora de una actividad específica.
 * @param {Object} actividad - La actividad a editar (opcional, para modo edición)
 * @param {Function} onSuccess - Callback al completar la actualización
 */
const FormOficial = ({ actividad, onSuccess }) => {
  // Estado local del formulario
  const [formData, setFormData] = useState({
    status: actividad?.status || 'Pendiente',
    descripcion: actividad?.descripcion || '',
  });

  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Enviar la actualización a la API
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!actividad?.id) {
      setMensaje({ tipo: 'error', texto: 'No hay una actividad seleccionada para actualizar.' });
      return;
    }

    setLoading(true);
    setMensaje({ tipo: '', texto: '' });

    try {
      const response = await fetch(`http://localhost:5000/actividades/${actividad.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: formData.status,
          descripcion: formData.descripcion,
          fecha: new Date().toISOString().split('T')[0], // Actualiza la fecha al día de hoy
          oficialId: "2", // Juan Vargas
          oficialNombre: "Juan Vargas"
        }),
      });

      if (!response.ok) throw new Error('Error al actualizar la actividad');

      setMensaje({ tipo: 'success', texto: '¡Actividad actualizada correctamente!' });
      
      if (onSuccess) {
        setTimeout(() => onSuccess(), 1500);
      }
    } catch (error) {
      console.error('Error PATCH:', error);
      setMensaje({ tipo: 'error', texto: 'Hubo un error al conectar con el servidor.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="FormOficialContainer">
      <div className="FormOficialHeader">
        <h2>Reporte de Avance Operativo</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--inst-text-muted)', margin: '4px 0 0' }}>
          Oficial: Juan Vargas | Actividad: {actividad?.titulo || 'Cargando...'}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="FormGroup">
          <label htmlFor="status">Estado de la Tarea</label>
          <select
            id="status"
            name="status"
            className="FormControl FormSelect"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="Pendiente">Pendiente</option>
            <option value="En ejecución">En ejecución</option>
            <option value="Completada">Completada</option>
          </select>
        </div>

        <div className="FormGroup">
          <label htmlFor="descripcion">Bitácora Técnica / Notas de Campo</label>
          <textarea
            id="descripcion"
            name="descripcion"
            className="FormControl FormTextarea"
            placeholder="Describa brevemente el progreso realizado..."
            value={formData.descripcion}
            onChange={handleChange}
            required
          />
        </div>

        {mensaje.texto && (
          <div className={`StatusMessage ${mensaje.tipo}`}>
            {mensaje.texto}
          </div>
        )}

        <div className="FormActions">
          <button 
            type="submit" 
            className="BtnSubmit" 
            disabled={loading || !actividad?.id}
          >
            {loading ? 'Guardando...' : 'Actualizar Reporte'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormOficial;
