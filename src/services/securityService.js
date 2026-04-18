const BASE_URL = 'http://localhost:5000';

export const securityService = {
  // 1. Editor solicita el cambio
  requestPasswordChange: async (user) => {
    try {
      const requestPayload = {
        userId: user.id,
        nombre: user.nombre,
        institucion: user.institucion,
        status: 'ESPERANDO_APROBACION',
        requestedAt: new Date().toISOString(),
        expiresAt: null
      };

      const res = await fetch(`${BASE_URL}/password_approvals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload)
      });

      // Notificar al Admin Institucional
      await fetch(`${BASE_URL}/notificaciones_admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          institucion: user.institucion,
          tipo: 'SOLICITUD_SEGURIDAD',
          mensaje: `URGENTE: El Editor [${user.nombre}] solicita autorización para cambio de clave institucional.`,
          requestId: (await res.json()).id,
          leida: false,
          timestamp: new Date().toISOString()
        })
      });

      return true;
    } catch (error) {
      console.error('Error requestPasswordChange:', error);
      return false;
    }
  },

  // 2. Admin Institucional aprueba
  approvePasswordChange: async (requestId) => {
    try {
      const expirationDate = new Date();
      expirationDate.setMinutes(expirationDate.getMinutes() + 15); // Ventana de 15 minutos

      const updatePayload = {
        status: 'VENTANA_ABIERTA',
        expiresAt: expirationDate.toISOString(),
        approvedAt: new Date().toISOString()
      };

      const res = await fetch(`${BASE_URL}/password_approvals/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload)
      });
      const updatedReq = await res.json();

      // Notificar al Editor
      await fetch(`${BASE_URL}/notificaciones_editor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: updatedReq.userId,
          tipo: 'APROBACION_SEGURIDAD',
          mensaje: '⚠️ SEGURIDAD: Su superior ha abierto una VENTANA DE CAMBIO de 15 minutos. Realice el cambio ahora.',
          expiresAt: updatePayload.expiresAt,
          leida: false,
          timestamp: new Date().toISOString()
        })
      });

      return updatedReq;
    } catch (error) {
      console.error('Error approvePasswordChange:', error);
      return false;
    }
  },

  // 3. Verificar si la ventana sigue abierta (Middleware Logic Simulator)
  checkApprovalWindow: async (userId) => {
    try {
      const res = await fetch(`${BASE_URL}/password_approvals?userId=${userId}&status=VENTANA_ABIERTA`);
      const results = await res.json();
      
      if (results.length === 0) return { active: false, reason: 'No hay ventana abierta' };

      const currentReq = results[results.length - 1]; // Tomar la más reciente
      const now = new Date();
      const expiration = new Date(currentReq.expiresAt);

      if (now > expiration) {
        // Bloqueo por expiración
        await fetch(`${BASE_URL}/password_approvals/${currentReq.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'EXPIRADO_BLOQUEADO' })
        });
        return { active: false, reason: 'VENTANA EXPIRADA (BLOQUEADA)' };
      }

      return { active: true, reqId: currentReq.id, expiresAt: currentReq.expiresAt };
    } catch (error) {
      return { active: false };
    }
  },

  // 4. Finalizar cambio de clave
  finalizePasswordChange: async (userId, requestId, newPassword) => {
    try {
      // Cambio de contraseña
      await fetch(`${BASE_URL}/usuarios/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword })
      });

      // Cerrar ventana
      await fetch(`${BASE_URL}/password_approvals/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'ACTIVO', 
          completedAt: new Date().toISOString() 
        })
      });

      // Registrar en el LOG DE AUDITORÍA
      await fetch(`${BASE_URL}/logs_seguridad`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          accion: 'CHANGE_PWD_WINDOW_SUCCESS',
          detalles: 'Contraseña actualizada correctamente dentro de la ventana de aprobación',
          timestamp: new Date().toISOString()
        })
      });

      return true;
    } catch (error) {
      return false;
    }
  }
};
