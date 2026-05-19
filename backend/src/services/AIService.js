const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

class AIService {
  constructor() {
    // Modelo con mayor capacidad de razonamiento para chatbots y análisis complejo
    this.model = 'llama-3.3-70b-versatile'; 
  }

  /**
   * Integra la llamada a Groq para resumir texto
   */
  async generarResumenEjecutivo(texto) {
    if (!texto || texto.length < 20) return texto;
    
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'Eres un analista experto en seguridad pública de Costa Rica. Genera un resumen ejecutivo profesional y conciso en español del siguiente reporte de cumplimiento.'
          },
          {
            role: 'user',
            content: texto
          }
        ],
        model: this.model,
        temperature: 0.3,
      });

      return `[IA Resumen]: ${completion.choices[0]?.message?.content || 'Error al generar resumen.'}`;
    } catch (error) {
      console.error('Error en Groq (generarResumenEjecutivo):', error);
      return `[IA Error]: No se pudo generar el resumen (${error.message}).`;
    }
  }

  /**
   * Clasifica automáticamente la gravedad de un incidente basado en su descripción
   */
  async clasificarIncidente(descripcion) {
    if (!descripcion) return { gravedad: 'MEDIA/BAJA', sugerencia: 'Monitoreo preventivo.' };

    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `Eres un sistema de triage de incidentes policiales.
Clasifica el incidente y responde ÚNICAMENTE con un JSON válido con este formato:
{ "gravedad": "ALTA" | "MEDIA" | "BAJA", "sugerencia": "tu sugerencia táctica breve" }`
          },
          {
            role: 'user',
            content: `Incidente reportado: ${descripcion}`
          }
        ],
        model: this.model,
        temperature: 0.1,
        response_format: { type: 'json_object' }
      });

      const responseText = completion.choices[0]?.message?.content;
      return JSON.parse(responseText);
    } catch (error) {
      console.error('Error en Groq (clasificarIncidente):', error);
      return { gravedad: 'MEDIA/BAJA', sugerencia: 'Error en clasificación. Monitoreo preventivo.' };
    }
  }
}

module.exports = new AIService();
