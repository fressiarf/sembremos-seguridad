const SyncService = require('../services/SyncService');

/**
 * Gestor de Colas Asíncronas en Memoria (Alternativa a BullMQ/Redis)
 * Implementa Cola FIFO, Reintentos (Retries) y Retraso Exponencial (Exponential Backoff).
 */
class SyncWorker {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
    this.maxRetries = 3;
    // Tiempos de espera por reintento en milisegundos: 2s, 4s, 8s
    this.backoffDelays = [2000, 4000, 8000];
  }

  /**
   * Encola un nuevo trabajo (Fire and Forget)
   * @param {string} type Tipo de sincronización: 'syncLineasAccion', 'syncKpis', etc.
   */
  addJob(type) {
    this.queue.push({ type, attempt: 0 });
    console.log(`[WORKER] Trabajo encolado: ${type}. Tareas pendientes: ${this.queue.length}`);
    this.processQueue();
  }

  /**
   * Bucle principal de la cola
   */
  async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;
    const job = this.queue.shift(); // Saca el primer trabajo (FIFO)

    try {
      console.log(`[WORKER] Procesando trabajo: ${job.type} (Intento ${job.attempt + 1})`);
      
      let result;
      // Mapeo dinámico al método de SyncService
      if (typeof SyncService[job.type] === 'function') {
        result = await SyncService[job.type]();
      } else {
        throw new Error(`Método ${job.type} no existe en SyncService`);
      }

      if (result && result.success === false) {
        throw new Error(result.error || 'Fallo lógico en la sincronización');
      }

      console.log(`[WORKER] Trabajo completado exitosamente: ${job.type}`);
    } catch (error) {
      console.error(`[WORKER ERROR] Falló el trabajo ${job.type}:`, error.message);
      
      if (job.attempt < this.maxRetries) {
        const delay = this.backoffDelays[job.attempt];
        console.log(`[WORKER] Reintentando en ${delay}ms... (Quedan ${this.maxRetries - job.attempt} intentos)`);
        
        job.attempt++;
        
        // Volver a encolar con retraso (Backoff Exponencial)
        setTimeout(() => {
          this.queue.push(job);
          this.processQueue();
        }, delay);
      } else {
        console.error(`[WORKER FATAL] Trabajo ${job.type} descartado después de ${this.maxRetries} intentos fallidos.`);
        // Aquí en producción se podría insertar en una tabla de "Failed Jobs" para auditoría
      }
    } finally {
      this.isProcessing = false;
      // Continúa con el siguiente en la cola
      this.processQueue();
    }
  }
}

// Exportar una única instancia (Singleton) para que toda la aplicación comparta la misma cola
module.exports = new SyncWorker();
