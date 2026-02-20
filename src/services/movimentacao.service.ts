import apiClient from "../api/api";

export interface MovimentacaoEstoque {
  id: string;
  produtoId: string;
  produtoNome: string;
  tipo: "Entrada" | "Saída";
  quantidade: number;
  data: string;
  observacao?: string;
  estabelecimentoId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMovimentacaoDTO {
  produtoId: string;
  tipo: "Entrada" | "Saída";
  quantidade: number;
  observacao?: string;
  estabelecimentoId: string;
}

export interface UpdateMovimentacaoDTO extends Partial<CreateMovimentacaoDTO> {}

class MovimentacaoService {
  /**
   * Obter todas as movimentações com filtros opcionais
   */
  async getAll(
    filters?: Record<string, any>,
    sortBy?: string,
    limit?: number,
  ): Promise<MovimentacaoEstoque[]> {
    const params: Record<string, any> = {};
    if (filters) Object.assign(params, filters);
    if (sortBy) params.sort = sortBy;
    if (limit) params.limit = limit;

    try {
      const response = await apiClient.get<any>("/movimentacoes", params);
      console.log(
        "[MovimentacaoService] Resposta da API /movimentacoes:",
        response,
      );

      // A API retorna: { data: [...], nextCursor, hasMore }
      if (
        response &&
        typeof response === "object" &&
        Array.isArray(response.data)
      ) {
        console.log(
          "[MovimentacaoService] ✓ Extraindo data do objeto paginado",
        );
        return response.data;
      }

      // Fallback: se for array direto
      if (Array.isArray(response)) {
        console.log("[MovimentacaoService] ✓ Retornando array diretamente");
        return response;
      }

      console.warn(
        "[MovimentacaoService] ✗ Formato de resposta inesperado:",
        response,
      );
      return [];
    } catch (error) {
      console.error(
        "[MovimentacaoService] Erro ao buscar movimentações:",
        error,
      );
      return [];
    }
  }

  /**
   * Obter movimentação por ID
   */
  async getById(id: string): Promise<MovimentacaoEstoque> {
    return apiClient.get<MovimentacaoEstoque>(`/movimentacoes/${id}`);
  }

  /**
   * Criar nova movimentação
   */
  async create(data: CreateMovimentacaoDTO): Promise<MovimentacaoEstoque> {
    return apiClient.post<MovimentacaoEstoque>("/movimentacoes", data);
  }

  /**
   * Atualizar movimentação
   */
  async update(
    id: string,
    data: UpdateMovimentacaoDTO,
  ): Promise<MovimentacaoEstoque> {
    return apiClient.put<MovimentacaoEstoque>(`/movimentacoes/${id}`, data);
  }

  /**
   * Deletar movimentação
   */
  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/movimentacoes/${id}`);
  }

  /**
   * Obter movimentações por estabelecimento
   */
  async getByEstabelecimento(
    estabelecimentoId: string,
  ): Promise<MovimentacaoEstoque[]> {
    return this.getAll({ estabelecimentoId }, "-createdAt", 200);
  }

  /**
   * Obter movimentações por produto
   */
  async getByProduto(produtoId: string): Promise<MovimentacaoEstoque[]> {
    return this.getAll({ produtoId }, "-createdAt");
  }
}

export const movimentacaoService = new MovimentacaoService();
export default movimentacaoService;
