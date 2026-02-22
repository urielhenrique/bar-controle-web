import apiClient from "@/api/api";

class AuthService {
  /**
   * Login com email e senha
   */
  async login(email, password) {
    const response = await apiClient.post("/auth/login", { email, password });

    if (response.token) {
      localStorage.setItem("auth_token", response.token);
      if (response.refreshToken) {
        localStorage.setItem("refresh_token", response.refreshToken);
      }
      if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
      }
    }

    return response;
  }

  /**
   * Login com Google OAuth
   */
  async loginWithGoogle(credential) {
    const response = await apiClient.post("/auth/google", { credential });

    if (response.token) {
      localStorage.setItem("auth_token", response.token);
      if (response.refreshToken) {
        localStorage.setItem("refresh_token", response.refreshToken);
      }
      if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
      }
    }

    return response;
  }

  /**
   * Registro de novo usuário
   */
  async register(nomeEstabelecimento, nome, email, senha) {
    const response = await apiClient.post("/auth/register", {
      nomeEstabelecimento,
      nome,
      email,
      senha,
    });

    if (response.token) {
      localStorage.setItem("auth_token", response.token);
      if (response.refreshToken) {
        localStorage.setItem("refresh_token", response.refreshToken);
      }
      if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
      }
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
      this.logout();
      throw error;
    }
  }

  /**
   * Logout
   */
  logout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
  }

  /**
   * Obter token armazenado
   */
  getToken() {
    return localStorage.getItem("auth_token");
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
   */
  isAuthenticated() {
    return !!this.getToken();
  }
}

export default new AuthService();
