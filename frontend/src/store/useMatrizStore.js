import { create } from 'zustand';
import { dashboardService } from '../services/dashboardService';

const useMatrizStore = create((set, get) => ({
  lineas: [],
  tareas: [],
  reportes: [],
  loading: true,
  error: null,
  
  fetchData: async () => {
    try {
      set({ loading: true, error: null });
      const data = await dashboardService.getFullDashboardData();
      set({
        lineas: data.lineasEnriquecidas || [],
        tareas: data.tareas || [],
        reportes: data.reportes || [],
        loading: false
      });
    } catch (error) {
      console.error("Error fetching matriz data:", error);
      set({ loading: false, error: error.message });
    }
  },
  
  // Permite obtener datos filtrados sin necesidad de recalcular todo en los componentes
  getFilteredLineas: (searchTerm) => {
    const { lineas } = get();
    if (!searchTerm) return lineas;
    const lowerTerm = searchTerm.toLowerCase();
    return lineas.filter(l => 
      (l.titulo && l.titulo.toLowerCase().includes(lowerTerm)) ||
      (l.problematica && l.problematica.toLowerCase().includes(lowerTerm)) ||
      (l.objetivo && l.objetivo.toLowerCase().includes(lowerTerm))
    );
  }
}));

export default useMatrizStore;
