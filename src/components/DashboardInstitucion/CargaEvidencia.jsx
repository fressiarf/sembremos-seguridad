import React, { useState } from 'react';
import { UploadCloud, Users, DollarSign, Image as ImageIcon } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const CargaEvidencia = ({ lineaId }) => {
  const { showToast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  const [archivos, setArchivos] = useState([]);
  const [kpis, setKpis] = useState({ personas: '', inversion: '' });

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files).map(f => f.name);
      setArchivos([...archivos, ...newFiles]);
      showToast('Evidencia cargada correctamente', 'success');
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(f => {
        // Mock a thumbnail preview using createObjectURL for an enhanced "Multimedia" feel
        return {
          name: f.name,
          preview: URL.createObjectURL(f),
          isImage: f.type.startsWith('image/')
        };
      });
      setArchivos([...archivos, ...newFiles]);
      showToast('Evidencia multimedia cargada correctamente', 'success');
    }
  };

  const removeFile = (indexToRemove) => {
    setArchivos(archivos.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="evidencia-module">
      <h3 className="delegation-header" style={{ marginBottom: '16px' }}>
        <UploadCloud size={18} />
        Centro de Carga de Evidencia
      </h3>
      <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>
        Flujo de Campo a Oficina: Adjunte el respaldo multimedia y reporte el impacto cuantitativo de la intervención.
      </p>

      {/* 1. CARGA MULTIMEDIA */}
      <h4 style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: 600, marginBottom: '12px' }}>
        1. Respaldo Multimedia
      </h4>
      <div 
        className={`dropzone ${dragActive ? 'active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById(`file-upload-${lineaId}`).click()}
      >
        <input 
          type="file" 
          id={`file-upload-${lineaId}`} 
          multiple 
          accept="image/*,application/pdf"
          onChange={handleChange} 
          style={{ display: 'none' }} 
        />
        <UploadCloud size={32} className="dropzone-icon" />
        <p className="dropzone-text">Arrastra fotografías o documentos que validen la acción</p>
        <p className="dropzone-subtext">Haga clic o suelte aquí (JPG, PNG, PDF)</p>
      </div>

      {archivos.length > 0 && (
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '16px', marginBottom: '24px' }}>
          {archivos.map((archivo, index) => (
            <div key={index} style={{
              position: 'relative', width: '80px', height: '80px', 
              borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)', background: '#f8fafc',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {archivo.isImage ? (
                <img src={archivo.preview} alt={archivo.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ textAlign: 'center', padding: '4px' }}>
                  <ImageIcon size={24} color="#94a3b8" style={{ marginBottom: '4px' }} />
                  <div style={{ fontSize: '0.55rem', color: '#64748b', wordBreak: 'break-all', lineHeight: 1.1 }}>{archivo.name}</div>
                </div>
              )}
              <button 
                onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                style={{
                  position: 'absolute', top: '4px', right: '4px', 
                  background: 'rgba(239, 68, 68, 0.9)', color: 'white', 
                  border: 'none', borderRadius: '50%', width: '20px', height: '20px', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  cursor: 'pointer', fontSize: '10px'
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '24px 0' }} />

      {/* 2. REPORTE DE IMPACTO */}
      <h4 style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: 600, marginBottom: '12px' }}>
        2. Reporte de Impacto (Cuantitativo)
      </h4>
      <div className="kpi-inputs" style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <div className="kpi-group">
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>Cantidad de Beneficiarios</label>
          <div className="kpi-input-wrapper">
            <Users size={16} className="kpi-icon" />
            <input 
              type="number" 
              placeholder="Ej. 150" 
              value={kpis.personas}
              style={{ background: '#fff' }}
              onChange={e => setKpis({ ...kpis, personas: e.target.value })}
            />
          </div>
          <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Personas impactadas directamente</span>
        </div>
        
        <div className="kpi-group">
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>Dinero Invertido</label>
          <div className="kpi-input-wrapper">
            <DollarSign size={16} className="kpi-icon" color="#16a34a" />
            <input 
              type="number" 
              placeholder="₡ 0" 
              value={kpis.inversion}
              style={{ background: '#fff' }}
              onChange={e => setKpis({ ...kpis, inversion: e.target.value })}
            />
          </div>
          <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Recursos financieros ejecutados</span>
        </div>
      </div>
      
      <div style={{ marginTop: '24px', textAlign: 'right' }}>
        <button style={{ 
          background: '#3b82f6', color: '#fff', border: 'none', 
          padding: '10px 20px', borderRadius: '6px', fontWeight: 600, 
          cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' 
        }}>
          <UploadCloud size={16} /> Enviar Reporte de Campo
        </button>
      </div>

    </div>
  );
};

export default CargaEvidencia;
