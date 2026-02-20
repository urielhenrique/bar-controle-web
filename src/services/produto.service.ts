import apiClient from "../api/api";

export interface Produto {
  id: string;
  nome: string;
  categoria: string;
  volume: string;
  estoqueAtual: number;
  estoqueMinimo: number;
  precoCompra: number;
  precoVenda: number;
  fornecedorId: string;
  estabelecimentoId: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProdutoDTO {
  nome: string;
  categoria: string;
  volume: string;
  estoqueAtual: number;
  estoqueMinimo: number;
  precoCompra: number;
  precoVenda: number;
  fornecedorId: string;
  estabelecimentoId: string;
  status?: string;
}

export interface UpdateProdutoDTO extends Partial<CreateProdutoDTO> {}

class ProdutoService {
  /**
   * Obter todos os produtos com filtros opcionais
   */
  async getAll(
    filters?: Record<string, any>,
    sortBy?: string,
    limit?: number,
  ): Promise<Produto[]> {
    const params: Record<string, any> = {};
    if (filters) Object.assign(params, filters);
    if (sortBy) params.sort = sortBy;
    if (limit) params.limit = limit;

    try {
      const response = await apiClient.get<any>("/produtos", params);
      console.log("[ProdutoService] Resposta da API /produtos:", response);

      // A API retorna: { data: [...], nextCursor, hasMore }
      if (
        response &&
        typeof response === "object" &&
        Array.isArray(response.data)
      ) {
        console.log("[ProdutoService] ✓ Extraindo data do objeto paginado");
        return response.data;
      }

      // Fallback: se for array direto
      if (Array.isArray(response)) {
        console.log("[ProdutoService] ✓ Retornando array diretamente");
        return response;
      }

      console.warn(
        "[ProdutoService] ✗ Formato de resposta inesperado:",
        response,
      );
      return [];
    } catch (error) {
      console.error("[ProdutoService] Erro ao buscar produtos:", error);
      return [];
    }
  }

  /**
   * Obter produto por ID
   */
  async getById(id: string): Promise<Produto> {
    return apiClient.get<Produto>(`/produtos/${id}`);
  }

  /**
   * Criar novo produto
   */
  async create(data: CreateProdutoDTO): Promise<Produto> {
    return apiClient.post<Produto>("/produtos", data);
  }

  /**
   * Atualizar produto
   */
  async update(id: string, data: UpdateProdutoDTO): Promise<Produto> {
    return apiClient.put<Produto>(`/produtos/${id}`, data);
  }

  /**
   * Deletar produto
   */
  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/produtos/${id}`);
  }

  /**
   * Obter produtos por estabelecimento
   */
  async getByEstabelecimento(estabelecimentoId: string): Promise<Produto[]> {
    return this.getAll({ estabelecimentoId });
  }
}

export const produtoService = new ProdutoService();
export default produtoService;
