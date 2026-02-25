import apiClient from "../api/api";

export interface MonitoringFilters {
  page?: number;
  limit?: number;
  days?: number;
  eventType?: string;
  estabelecimentoId?: string;
}

export interface MonitoringData {
  events: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  stats: {
    byType: any[];
    byDay: Array<{ date: string; count: number }>;
  };
}

class MonitoringService {
  /**
   * Fetch monitoring data from backend
   * Admin only
   */
  async getMonitoringData(filters: MonitoringFilters): Promise<MonitoringData> {
    try {
      const params = new URLSearchParams();

      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());
      if (filters.days) params.append("days", filters.days.toString());
      if (filters.eventType) params.append("eventType", filters.eventType);
      if (filters.estabelecimentoId)
        params.append("estabelecimentoId", filters.estabelecimentoId);

      const response = await apiClient.get<{
        success: boolean;
        data: MonitoringData;
      }>(`/internal/monitoring?${params.toString()}`);

      if (!response.success) {
        throw new Error("Falha ao buscar dados de monitoramento");
      }

      return response.data;
    } catch (error: any) {
      console.error("Erro ao buscar dados de monitoramento:", error);
      throw error;
    }
  }
}

export const monitoringService = new MonitoringService();
export default monitoringService;
