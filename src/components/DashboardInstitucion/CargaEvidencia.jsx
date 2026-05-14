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
    if (e.target.files && e.target.files[0]) {
      const newFiles = Array.from(e.target.files).map(f => f.name);
      setArchivos([...archivos, ...newFiles]);
      showToast('Evidencia cargada correctamente', 'success');
    }
  };

  return (
    <div className="evidencia-module">
      <h3 className="delegation-header">
        <UploadCloud size={18} />
        Carga de Evidencia Express
      </h3>

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
          onChange={handleChange} 
          style={{ display: 'none' }} 
        />
        <UploadCloud size={32} className="dropzone-icon" />
        <p className="dropzone-text">Arrastra fotos o documentos aquí</p>
        <p className="dropzone-subtext">o haz clic para explorar en tu computadora</p>
      </div>

      {archivos.length > 0 && (
        <div className="uploaded-files-list" style={{ marginBottom: '1.25rem' }}>
          {archivos.map((archivo, index) => (
            <span key={index} className="file-tag">
               <ImageIcon size={12} /> {archivo}
            </span>
          ))}
        </div>
      )}

      <div className="kpi-inputs">
        <div className="kpi-group">
          <label>Personas Impactadas</label>
          <div className="kpi-input-wrapper">
            <Users size={16} className="kpi-icon" />
            <input 
              type="number" 
              placeholder="0" 
              value={kpis.personas}
              onChange={e => setKpis({ ...kpis, personas: e.target.value })}
            />
          </div>
        </div>
        
        <div className="kpi-group">
          <label>Presupuesto Invertido</label>
          <div className="kpi-input-wrapper">
            <DollarSign size={16} className="kpi-icon" />
            <input 
              type="number" 
              placeholder="₡ 0" 
              value={kpis.inversion}
              onChange={e => setKpis({ ...kpis, inversion: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CargaEvidencia;
