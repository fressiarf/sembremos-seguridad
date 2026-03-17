const BASE_URL = 'http://localhost:5000';

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
  }
};


