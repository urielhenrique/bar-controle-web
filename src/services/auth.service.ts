import apiClient from "../api/api";

const isRateLimitError = (error: unknown): boolean => {
  const message = String(
    (error as Error | undefined)?.message || "",
  ).toLowerCase();
  const status = (error as { status?: number } | undefined)?.status;
  return status === 429 || message.includes("muitas requisicoes");
};

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
      if (isRateLimitError(error)) {
        throw error;
      }
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

  /**
   * Fazer login com Google OAuth
   */
  async loginWithGoogle(
    credential: string,
  ): Promise<{ user: User; token: string }> {
    const response = await apiClient.post<{ user: User; token: string }>(
      "/auth/google",
      {
        credential,
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
