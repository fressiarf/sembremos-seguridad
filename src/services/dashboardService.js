const BASE_URL = 'http://localhost:3001';

export const dashboardService = {
  getStats: async () => {
    try {
      const [activities, zones, alerts] = await Promise.all([
        fetch(`${BASE_URL}/actividades`).then(r => r.json()),
        fetch(`${BASE_URL}/zonas`).then(r => r.json()),
        fetch(`${BASE_URL}/alertas`).then(r => r.json())
      ]);

      return {
        activitiesCount: activities.length,
        zonesCount: zones.length,
        alertsCount: alerts.length
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return { activitiesCount: 0, zonesCount: 0, alertsCount: 0 };
    }
  },

  getDetailedStats: async () => {
    try {
      const response = await fetch(`${BASE_URL}/actividades`);
      const activities = await response.json();

      return {
        completadas: activities.filter(a => a.status === 'Completada').length,
        activas: activities.filter(a => a.status === 'En ejecución').length,
        pendientes: activities.filter(a => a.status === 'Pendiente').length,
        retrasadas: activities.filter(a => a.status === 'Retrasada').length
      };
    } catch (error) {
      console.error('Error fetching detailed stats:', error);
      return { completadas: 0, activas: 0, pendientes: 0, retrasadas: 0 };
    }
  },

  getFullDashboardData: async () => {
    try {
      const [activities, zones, alerts, notifications] = await Promise.all([
        fetch(`${BASE_URL}/actividades`).then(r => r.json()),
        fetch(`${BASE_URL}/zonas`).then(r => r.json()),
        fetch(`${BASE_URL}/alertas`).then(r => r.json()),
        fetch(`${BASE_URL}/notificaciones`).then(r => r.json())
      ]);

      return {
        activities,
        zones,
        alerts,
        notifications,
        stats: {
          completadas: activities.filter(a => a.status === 'Completada').length,
          activas: activities.filter(a => a.status === 'En ejecución').length,
          pendientes: activities.filter(a => a.status === 'Pendiente').length,
          retrasadas: activities.filter(a => a.status === 'Retrasada').length
        }
      };
    } catch (error) {
      console.error('Error fetching full dashboard data:', error);
      return null;
    }
  },

  getZonas: async () => {
    try {
      const response = await fetch(`${BASE_URL}/zonas`);
      if (!response.ok) throw new Error('Error fetching zonas');
      return await response.json();
    } catch (error) {
      console.error('Error in getZonas:', error);
      throw error;
    }
  },

  createActivity: async (activityData) => {
    try {
      const response = await fetch(`${BASE_URL}/actividades`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activityData)
      });
      if (!response.ok) throw new Error('Error creating activity');
      return await response.json();
    } catch (error) {
      console.error('Error in createActivity:', error);
      throw error;
    }
  }
};

