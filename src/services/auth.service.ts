import apiClient from "../api/api";

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
    return await apiClient.get<User>("/auth/me");
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
    // Cookies httpOnly são definidos automaticamente pelo backend
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
    // Cookies httpOnly são definidos automaticamente pelo backend
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
    // Cookies httpOnly são definidos automaticamente pelo backend
    return response;
  }

  getToken(): string | null {
    // Tokens estão em httpOnly cookies, não em localStorage
    // Este método é mantido para compatibilidade mas não retorna nada
    return null;
  }

  /**
   * Fazer logout
   * Backend remove cookies httpOnly automaticamente
   */
  async logout(): Promise<void> {
    try {
      // Chamar endpoint de logout para limpar cookies no backend
      await apiClient.post("/auth/logout", {});
    } catch (error) {
      // Continuar mesmo se falhar (pode estar offline)
      console.error("Erro ao fazer logout:", error);
    }
  }

  /**
   * Atualizar dados do usuário
   */
  async updateUser(data: Partial<User>): Promise<User> {
    const user = await apiClient.put<User>("/auth/me", data);
    // Usuário será refetched via GET /auth/me se necessário
    return user;
  }

  /**
   * Este método é DEPRECATED - não use mais localStorage
   * Use AuthContext.isAuthenticated em vez disso
   */
  getStoredUser(): User | null {
    // Retorna null sempre - sessão é validada via GET /auth/me
    return null;
  }

  /**
   * Verificar se está autenticado
   * Use AuthContext em vez disso
   */
  isAuthenticated(): boolean {
    // Sempre retorna false aqui
    // A validação real é feita no AuthContext via GET /auth/me
    return false;
  }
}

export const authService = new AuthService();
export default authService;
