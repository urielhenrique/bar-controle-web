import apiClient from "../api/api";

export interface Fornecedor {
  id: string;
  nome: string;
  telefone?: string;
  prazoEntregaDias: number;
  estabelecimentoId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateFornecedorDTO {
  nome: string;
  telefone?: string;
  prazoEntregaDias: number;
  estabelecimentoId: string;
}

export interface UpdateFornecedorDTO extends Partial<CreateFornecedorDTO> {}

class FornecedorService {
  /**
   * Obter todos os fornecedores com filtros opcionais
   */
  async getAll(filters?: Record<string, any>): Promise<Fornecedor[]> {
    const params: Record<string, any> = {};
    if (filters) Object.assign(params, filters);

    try {
      const response = await apiClient.get<any>("/fornecedores", params);
      console.log(
        "[FornecedorService] Resposta da API /fornecedores:",
        response,
      );

      // A API retorna: { data: [...], nextCursor, hasMore }
      if (
        response &&
        typeof response === "object" &&
        Array.isArray(response.data)
      ) {
        console.log("[FornecedorService] ✓ Extraindo data do objeto paginado");
        return response.data;
      }

      // Fallback: se for array direto
      if (Array.isArray(response)) {
        console.log("[FornecedorService] ✓ Retornando array diretamente");
        return response;
      }

      console.warn(
        "[FornecedorService] ✗ Formato de resposta inesperado:",
        response,
      );
      return [];
    } catch (error) {
      console.error("[FornecedorService] Erro ao buscar fornecedores:", error);
      return [];
    }
  }

  /**
   * Obter fornecedor por ID
   */
  async getById(id: string): Promise<Fornecedor> {
    return apiClient.get<Fornecedor>(`/fornecedores/${id}`);
  }

  /**
   * Criar novo fornecedor
   */
  async create(data: CreateFornecedorDTO): Promise<Fornecedor> {
    return apiClient.post<Fornecedor>("/fornecedores", data);
  }

  /**
   * Atualizar fornecedor
   */
  async update(id: string, data: UpdateFornecedorDTO): Promise<Fornecedor> {
    return apiClient.put<Fornecedor>(`/fornecedores/${id}`, data);
  }

  /**
   * Deletar fornecedor
   */
  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/fornecedores/${id}`);
  }

  /**
   * Obter fornecedores por estabelecimento
   */
  async getByEstabelecimento(estabelecimentoId: string): Promise<Fornecedor[]> {
    return this.getAll({ estabelecimentoId });
  }
}

export const fornecedorService = new FornecedorService();
export default fornecedorService;
