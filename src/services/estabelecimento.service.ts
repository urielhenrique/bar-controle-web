import apiClient from "../api/api";

export interface Estabelecimento {
  id: string;
  nome: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEstabelecimentoDTO {
  nome: string;
}

class EstabelecimentoService {
  /**
   * Obter todos os estabelecimentos
   */
  async getAll(): Promise<Estabelecimento[]> {
    return apiClient.get<Estabelecimento[]>("/estabelecimentos");
  }

  /**
   * Obter estabelecimento por ID
   */
  async getById(id: string): Promise<Estabelecimento> {
    return apiClient.get<Estabelecimento>(`/estabelecimentos/${id}`);
  }

  /**
   * Criar novo estabelecimento
   */
  async create(data: CreateEstabelecimentoDTO): Promise<Estabelecimento> {
    return apiClient.post<Estabelecimento>("/estabelecimentos", data);
  }

  /**
   * Atualizar estabelecimento
   */
  async update(
    id: string,
    data: Partial<CreateEstabelecimentoDTO>,
  ): Promise<Estabelecimento> {
    return apiClient.put<Estabelecimento>(`/estabelecimentos/${id}`, data);
  }

  /**
   * Deletar estabelecimento
   */
  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/estabelecimentos/${id}`);
  }
}

export const estabelecimentoService = new EstabelecimentoService();
export default estabelecimentoService;
