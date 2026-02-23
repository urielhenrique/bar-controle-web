import apiClient from "@/api/api";

class AuthService {
  /**
   * Login com email e senha
   * Tokens são armazenados automaticamente em httpOnly cookies pelo backend
   */
  async login(email, password) {
    const response = await apiClient.post("/auth/login", { email, password });

    // Armazenar apenas dados do usuário (não tokens)
    if (response.user) {
      localStorage.setItem("user", JSON.stringify(response.user));
    }

    return response;
  }

  /**
   * Login com Google OAuth
   * Tokens são armazenados automaticamente em httpOnly cookies pelo backend
   */
  async loginWithGoogle(credential) {
    const response = await apiClient.post("/auth/google", { credential });

    // Armazenar apenas dados do usuário (não tokens)
    if (response.user) {
      localStorage.setItem("user", JSON.stringify(response.user));
    }

    return response;
  }

  /**
   * Registro de novo usuário
   * Tokens são armazenados automaticamente em httpOnly cookies pelo backend
   */
  async register(nomeEstabelecimento, nome, email, senha) {
    const response = await apiClient.post("/auth/register", {
      nomeEstabelecimento,
      nome,
      email,
      senha,
    });

    // Armazenar apenas dados do usuário (não tokens)
    if (response.user) {
      localStorage.setItem("user", JSON.stringify(response.user));
    }

    return response;
  }

  /**
   * Obter usuário atual
   */
  async getCurrentUser() {
    try {
      const response = await apiClient.get("/auth/me");
      localStorage.setItem("user", JSON.stringify(response));
      return response;
    } catch (error) {
      await this.logout();
      throw error;
    }
  }

  /**
   * Logout
   * Chama o endpoint do backend que limpa os cookies
   */
  async logout() {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Erro ao fazer logout no servidor:", error);
    } finally {
      // Limpar dados locais
      localStorage.removeItem("user");
    }
  }

  /**
   * Obter usuário armazenado
   */
  getStoredUser() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Verificar se está autenticado
   * Checa se existe usuário armazenado localmente
   * A validação real do token acontece no servidor via cookies
   */
  isAuthenticated() {
    return !!this.getStoredUser();
  }
}

export default new AuthService();
