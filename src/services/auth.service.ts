import apiClient from "../api/api";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  estabelecimentoId?: string;
  estabelecimentoNome?: string;
}

export interface Estabelecimento {
  id: string;
  nome: string;
  createdAt?: string;
  updatedAt?: string;
}

class AuthService {
  /**
   * Obter dados do usuário autenticado
   */
  async getCurrentUser(): Promise<User> {
    try {
      return await apiClient.get<User>("/auth/me");
    } catch (error) {
      throw new Error("Não autenticado");
    }
  }

  /**
   * Fazer login com email e senha
   */
  async login(
    email: string,
    password: string,
  ): Promise<{ user: User; token: string }> {
    const response = await apiClient.post<{ user: User; token: string }>(
      "/auth/login",
      {
        email,
        password,
      },
    );
    if (response.token) {
      apiClient.setToken(response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
    }
    return response;
  }

  getToken(): string | null {
    return apiClient.getToken();
  }

  /**
   * Fazer logout
   */
  logout(): void {
    apiClient.clearToken();
    localStorage.removeItem("user");
    localStorage.removeItem("auth_token");
  }

  /**
   * Atualizar dados do usuário
   */
  async updateUser(data: Partial<User>): Promise<User> {
    const user = await apiClient.put<User>("/auth/me", data);
    localStorage.setItem("user", JSON.stringify(user));
    return user;
  }

  /**
   * Obter usuário armazenado localmente
   */
  getStoredUser(): User | null {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Verificar se está autenticado
   */
  isAuthenticated(): boolean {
    return !!apiClient.getToken() && !!this.getStoredUser();
  }
}

export const authService = new AuthService();
export default authService;
