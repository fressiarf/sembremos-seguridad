import React, { useState } from 'react';
import { Plus, Check, Trash2, User } from 'lucide-react';

const AVATARES_SIMULADOS = [
  { id: 'u1', nombre: 'Carlos Ruiz', rol: 'Depto. Social' },
  { id: 'u2', nombre: 'María Soto', rol: 'Seguridad' },
  { id: 'u3', nombre: 'Luis Arce', rol: 'Coordinador' }
];

const ModuloDelegacion = ({ lineaId, tareasIniciales = [] }) => {
  const [tareas, setTareas] = useState(tareasIniciales);
  const [nuevaTarea, setNuevaTarea] = useState('');
  const [asignadoA, setAsignadoA] = useState('');

  const agregarTarea = () => {
    if (!nuevaTarea.trim()) return;
    const persona = AVATARES_SIMULADOS.find(a => a.id === asignadoA) || { nombre: 'Sin asignar' };
    
    setTareas([...tareas, { 
      id: Date.now().toString(), 
      titulo: nuevaTarea, 
      completada: false,
      asignado: persona.nombre
    }]);
    setNuevaTarea('');
    setAsignadoA('');
  };

  const toggleCompletada = (id) => {
    setTareas(tareas.map(t => t.id === id ? { ...t, completada: !t.completada } : t));
  };

  const eliminarTarea = (id) => {
    setTareas(tareas.filter(t => t.id !== id));
  };

  return (
    <div className="delegation-module">
      <h3 className="delegation-header">
        <Check size={18} />
        Delegación Interna y Sub-tareas
      </h3>

      <div className="task-input-group">
        <input 
          type="text" 
          placeholder="Escriba la nueva subtarea..." 
          className="task-input"
          value={nuevaTarea}
          onChange={e => setNuevaTarea(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && agregarTarea()}
        />
        <select 
          className="avatar-select" 
          value={asignadoA}
          onChange={e => setAsignadoA(e.target.value)}
        >
          <option value="">Asignar a...</option>
          {AVATARES_SIMULADOS.map(a => (
            <option key={a.id} value={a.id}>{a.nombre} - {a.rol}</option>
          ))}
        </select>
        <button className="btn-add-task" onClick={agregarTarea}>
          <Plus size={18} />
        </button>
      </div>

      <div className="subtask-list">
        {tareas.length === 0 ? (
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>No hay subtareas delegadas todavía.</p>
        ) : (
          tareas.map(t => (
            <div key={t.id} className={`subtask-item ${t.completada ? 'completed' : ''}`}>
              <input 
                type="checkbox" 
                className="subtask-checkbox" 
                checked={t.completada}
                onChange={() => toggleCompletada(t.id)}
              />
              <div className="subtask-content">
                <h4 className="subtask-title">{t.titulo}</h4>
                <div className="avatar-badge">
                  <User size={12} /> {t.asignado}
                </div>
              </div>
              <button 
                onClick={() => eliminarTarea(t.id)}
                style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ModuloDelegacion;
