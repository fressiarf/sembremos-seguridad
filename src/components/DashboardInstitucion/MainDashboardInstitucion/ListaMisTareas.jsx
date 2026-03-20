import React from 'react';
import TareaCard from './TareaCard';
import { ListTodo } from 'lucide-react';

const ListaMisTareas = ({ tareas = [], onUpdate }) => {
  if (tareas.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '4rem 2rem',
        background: '#fff',
        borderRadius: '16px',
        border: '1px dashed #cbd5e1',
        color: '#64748b',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px'
      }}>
        <ListTodo size={48} opacity={0.3} />
        <div>
          <h3 style={{ margin: '0 0 6px', color: '#0b2240', fontSize: '1.1rem' }}>No hay tareas aquí</h3>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>No se encontraron tareas con el filtro actual.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {tareas.map(tarea => (
        <TareaCard
          key={tarea.id}
          tarea={tarea}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
};

export default ListaMisTareas;
