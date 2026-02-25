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
  plano?: string; // FREE ou PRO
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
   * Tokens são armazenados em httpOnly cookies automaticamente pelo backend
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
    // Armazenar apenas dados do usuário (tokens já estão em cookies httpOnly)
    if (response.user) {
      localStorage.setItem("user", JSON.stringify(response.user));
    }
    return response;
  }

  /**
   * Fazer login com Google OAuth
   * Tokens são armazenados em httpOnly cookies automaticamente pelo backend
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
    // Armazenar apenas dados do usuário (tokens já estão em cookies httpOnly)
    if (response.user) {
      localStorage.setItem("user", JSON.stringify(response.user));
    }
    return response;
  }

  /**
   * Criar nova conta (registro)
   * Tokens são armazenados em httpOnly cookies automaticamente pelo backend
   */
  async register(
    nomeEstabelecimento: string,
    nome: string,
    email: string,
    senha: string,
  ): Promise<{ user: User; token: string }> {
    const response = await apiClient.post<{ user: User; token: string }>(
      "/auth/register",
      {
        nomeEstabelecimento,
        nome,
        email,
        senha,
      },
    );
    // Armazenar apenas dados do usuário (tokens já estão em cookies httpOnly)
    if (response.user) {
      localStorage.setItem("user", JSON.stringify(response.user));
    }
    return response;
  }

  getToken(): string | null {
    // Tokens estão em httpOnly cookies, não em localStorage
    // Este método é mantido para compatibilidade mas não retorna nada
    return null;
  }

  /**
   * Fazer logout
   * Remove dados do cliente, backend remove cookies
   */
  logout(): void {
    localStorage.removeItem("user");
    localStorage.removeItem("auth_token");
    // Cookies httpOnly são removidos automaticamente pelo backend via logout endpoint
    // ou expiração natural
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
