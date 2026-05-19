const nodemailer = require('nodemailer');

/**
 * Servicio para envío automatizado de correos
 */
class MailerService {
  constructor() {
    // Para producción, leer desde process.env.SMTP_HOST, etc.
    // Usamos una configuración base o de pruebas.
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: process.env.SMTP_PORT || 587,
      auth: {
        user: process.env.SMTP_USER || 'fake_user@ethereal.email',
        pass: process.env.SMTP_PASS || 'fake_pass'
      }
    });
  }

  async sendMonthlyReport(emails, summaryData) {
    try {
      const info = await this.transporter.sendMail({
        from: '"Sembremos Seguridad" <noreply@sembremos-seguridad.go.cr>',
        to: emails.join(', '),
        subject: `Reporte Gerencial - ${new Date().toLocaleDateString()}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #0b2240;">Reporte de Avance Institucional</h2>
            <p>Estimado/a Director/a,</p>
            <p>Adjunto a este correo encontrará el resumen automatizado del mes actual con el progreso de las Líneas Estratégicas y Tareas en ejecución.</p>
            <hr>
            <p><strong>Total de Líneas Activas:</strong> ${summaryData.totalLineas || 0}</p>
            <p><strong>Nuevos Incidentes Reportados:</strong> ${summaryData.incidentesNuevos || 0}</p>
            <hr>
            <p style="font-size: 12px; color: #666;">Este es un mensaje generado automáticamente por el sistema. Por favor no responder a esta dirección.</p>
          </div>
        `
      });
      console.log(`[MAILER] Reporte mensual enviado exitosamente a: ${emails.length} destinatarios. ID: ${info.messageId}`);
      return true;
    } catch (error) {
      console.error('[MAILER ERROR] Error al enviar reporte mensual:', error.message);
      return false;
    }
  }
}

module.exports = new MailerService();
