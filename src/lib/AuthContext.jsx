import React, { createContext, useState, useContext, useEffect } from "react";
import authService from "@/services/auth.service";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // Apenas restaurar estado de sessão anterior sem fazer requisição
    const storedUser = authService.getStoredUser();
    if (storedUser) {
      // Usuário tinha sessão anterior - restaurar estado localmente
      setUser(storedUser);
      setIsAuthenticated(true);
    }
    setIsLoadingAuth(false);
  }, []);

  const isRateLimitError = (error) =>
    error?.status === 429 ||
    String(error?.message || "")
      .toLowerCase()
      .includes("muitas requisicoes");

  const login = async (email, password) => {
    try {
      setIsLoadingAuth(true);
      setAuthError(null);
      const response = await authService.login(email, password);
      setUser(response.user);
      setIsAuthenticated(true);
      setIsLoadingAuth(false);
      return response;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setIsLoadingAuth(false);
      setIsAuthenticated(false);
      setAuthError({
        type: "login_failed",
        message: error.message || "Erro ao fazer login",
      });
      throw error;
    }
  };

  const loginWithGoogle = async (credential) => {
    try {
      setIsLoadingAuth(true);
      setAuthError(null);
      const response = await authService.loginWithGoogle(credential);
      setUser(response.user);
      setIsAuthenticated(true);
      setIsLoadingAuth(false);
      return response;
    } catch (error) {
      console.error("Erro ao fazer login com Google:", error);
      setIsLoadingAuth(false);
      setIsAuthenticated(false);
      setAuthError({
        type: "login_failed",
        message: error.message || "Erro ao fazer login com Google",
      });
      throw error;
    }
  };

  const register = async (nomeEstabelecimento, nome, email, senha) => {
    try {
      setIsLoadingAuth(true);
      setAuthError(null);
      const response = await authService.register(
        nomeEstabelecimento,
        nome,
        email,
        senha,
      );
      setUser(response.user);
      setIsAuthenticated(true);
      setIsLoadingAuth(false);
      return response;
    } catch (error) {
      console.error("Erro ao criar conta:", error);
      setIsLoadingAuth(false);
      setIsAuthenticated(false);
      setAuthError({
        type: "register_failed",
        message: error.message || "Erro ao criar conta",
      });
      throw error;
    }
  };

  const logout = async (shouldRedirect = true) => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);

    if (shouldRedirect) {
      window.location.href = "/login";
    }
  };

  const navigateToLogin = () => {
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLogged: isAuthenticated,
        isLoadingAuth,
        authError,
        login,
        loginWithGoogle,
        register,
        logout,
        navigateToLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
