import apiClient from "../api/api";

export interface Limites {
  produtos: number | null;
  usuarios: number | null;
  movimentacoesMes: number | null;
}

export interface Uso {
  produtos: number;
  usuarios: number;
  movimentacoesMes: number;
}

export interface PlanoStatus {
  plano: "FREE" | "PRO";
  limites: Limites;
  uso: Uso;
}

// Tipo da resposta do backend
interface BackendPlanoResponse {
  plano: "FREE" | "PRO";
  recursosProdutos: {
    usado: number;
    limite: number;
    percentual: number;
    atencao: boolean;
    atingido: boolean;
  };
  recursosUsuarios: {
    usado: number;
    limite: number;
    percentual: number;
    atencao: boolean;
    atingido: boolean;
  };
  recursosMovimentacao: {
    usado: number;
    limite: number;
    percentual: number;
    atencao: boolean;
    atingido: boolean;
  };
  limiteAting: string[];
  recomendacao: string | null;
}

class PlanoService {
  /**
   * Obter status do plano do estabelecimento
   * Mapeia a resposta do backend para o formato esperado pelo frontend
   */
  async getStatus(): Promise<PlanoStatus> {
    try {
      const response =
        await apiClient.get<BackendPlanoResponse>("/plano/status");

      // Validar resposta
      if (!response || typeof response !== "object") {
        throw new Error("Resposta inválida da API");
      }

      // Mapear resposta do backend para o formato esperado
      const mapped: PlanoStatus = {
        plano: response.plano,
        limites: {
          produtos: response.recursosProdutos?.limite ?? 100,
          usuarios: response.recursosUsuarios?.limite ?? 5,
          movimentacoesMes: response.recursosMovimentacao?.limite ?? 1000,
        },
        uso: {
          produtos: response.recursosProdutos?.usado ?? 0,
          usuarios: response.recursosUsuarios?.usado ?? 0,
          movimentacoesMes: response.recursosMovimentacao?.usado ?? 0,
        },
      };

      return mapped;
    } catch (error) {
      console.error("Erro ao obter status do plano:", error);

      // Lançar erro com mensagem descritiva
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Não foi possível obter o status do plano");
    }
  }

  /**
   * Obter informações de uso dos recursos
   */
  async getUsage() {
    try {
      const [status, limites] = await Promise.all([
        apiClient.get("/plano/uso"),
        apiClient.get("/plano/limites"),
      ]);

      // Backend retorna: { produtos, usuarios, movimentacaoMes }
      // E: { plano, limiteProdutos, limiteUsuarios, limiteMovimentacaoMensal }
      return {
        produtosCriados: status.produtos || 0,
        limiteProdutos: limites.limiteProdutos || 50,
        usuariosCriados: status.usuarios || 0,
        limiteUsuarios: limites.limiteUsuarios || 1,
        movimentacoesMes: status.movimentacaoMes || 0,
        limiteMovimentacaoMensal: limites.limiteMovimentacaoMensal || 100,
      };
    } catch (error) {
      console.error("Erro ao obter uso de recursos:", error);
      throw error;
    }
  }
}

export default new PlanoService();
