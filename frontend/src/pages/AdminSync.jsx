import React, { useState } from 'react';

const AdminSync = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSync = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/admin/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ message: 'Error de conexión', error: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Sincronización de Datos</h1>
          <p style={styles.subtitle}>Base de Datos MSP ↔ Municipalidad</p>
        </div>

        <div style={styles.actionCard}>
          <div style={styles.infoArea}>
            <h3>Sincronización Maestra</h3>
            <p>Actualiza las metas y líneas de acción nacionales en el entorno local.</p>
          </div>
          <button 
            onClick={handleSync} 
            disabled={loading}
            style={loading ? {...styles.syncBtn, opacity: 0.7} : styles.syncBtn}
          >
            {loading ? 'Procesando...' : '🔄 Sincronizar Ahora'}
          </button>
        </div>

        {result && !result.error && (
          <div style={styles.resultsArea}>
            <div style={styles.statsGrid}>
              <div style={styles.statItem}>
                <span style={styles.statVal}>{result.data.stats.total}</span>
                <span style={styles.statLabel}>Encontrados</span>
              </div>
              <div style={{...styles.statItem, borderLeft: '1px solid #eee'}}>
                <span style={{...styles.statVal, color: '#38A169'}}>{result.data.stats.creados}</span>
                <span style={styles.statLabel}>Nuevos</span>
              </div>
              <div style={{...styles.statItem, borderLeft: '1px solid #eee'}}>
                <span style={{...styles.statVal, color: '#3182ce'}}>{result.data.stats.actualizados}</span>
                <span style={styles.statLabel}>Actualizados</span>
              </div>
            </div>

            <div style={styles.detailsList}>
              {result.data.hasChanges ? (
                <>
                  <h4 style={styles.listTitle}>Se agregaron los siguientes registros nuevos:</h4>
                  {result.data.detallado.map((item, index) => (
                    <div key={index} style={styles.listItem}>
                      <span style={styles.itemTitle}>{item.titulo}</span>
                      <span style={styles.badgeNew}>Nuevo</span>
                    </div>
                  ))}
                </>
              ) : (
                <div style={styles.upToDate}>
                  <p>✨ Toda la información está al día. No hay cambios pendientes.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {result?.error && (
          <div style={styles.errorBanner}>
            ⚠️ {result.message}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f7fafc',
    padding: '40px 20px',
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  container: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#2d3748',
    marginBottom: '8px',
  },
  subtitle: {
    color: '#718096',
    fontSize: '18px',
  },
  actionCard: {
    backgroundColor: '#fff',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  infoArea: {
    maxWidth: '60%',
  },
  syncBtn: {
    backgroundColor: '#2d3748',
    color: '#fff',
    border: 'none',
    padding: '16px 32px',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
  },
  resultsArea: {
    backgroundColor: '#fff',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
    animation: 'slideUp 0.5s ease-out',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    backgroundColor: '#f8f9fa',
    borderBottom: '1px solid #edf2f7',
  },
  statItem: {
    padding: '30px',
    textAlign: 'center',
  },
  statVal: {
    display: 'block',
    fontSize: '36px',
    fontWeight: '800',
    color: '#2d3748',
  },
  statLabel: {
    fontSize: '14px',
    color: '#a0aec0',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  detailsList: {
    padding: '30px',
  },
  listTitle: {
    marginBottom: '20px',
    color: '#4a5568',
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid #f7fafc',
  },
  itemTitle: {
    fontSize: '15px',
    color: '#2d3748',
    fontWeight: '500',
  },
  badgeNew: {
    backgroundColor: '#c6f6d5',
    color: '#22543d',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '700',
  },
  badgeUpdate: {
    backgroundColor: '#bee3f8',
    color: '#2a4365',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '700',
  },
  upToDate: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#ebf8ff',
    borderRadius: '12px',
    color: '#2b6cb0',
    fontWeight: '600',
  },
  errorBanner: {
    backgroundColor: '#fff5f5',
    color: '#c53030',
    padding: '15px',
    borderRadius: '12px',
    textAlign: 'center',
    fontWeight: '600',
  }
};

export default AdminSync;
