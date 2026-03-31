import React, { createContext, useState, useContext, useEffect } from "react";
import authService from "@/services/auth.service";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // Restaurar sessão a partir do backend (cookies httpOnly)
    const restoreSession = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
        setIsAuthenticated(true);
        setAuthError(null);
      } catch (error) {
        const status = error?.status;
        const errorCode = error?.data?.error;
        const isExpiredSession =
          status === 401 &&
          (errorCode === "SESSION_EXPIRED" || errorCode === "INVALID_TOKEN");

        // Usuário não autenticado (esperado na primeira vez)
        setUser(null);
        setIsAuthenticated(false);

        if (isExpiredSession) {
          setAuthError({
            type: "session_expired",
            message: "Sessao expirada. Faca login novamente.",
          });
        } else {
          setAuthError(null);
        }
      } finally {
        setIsLoadingAuth(false);
      }
    };

    restoreSession();
  }, []);

  const isRateLimitError = (error) =>
    error?.status === 429 ||
    String(error?.message || "")
      .toLowerCase()
      .includes("muitas requisicoes");

  const login = async (email, password) => {
    try {
      setAuthError(null);
      const response = await authService.login(email, password);
      setUser(response.user);
      setIsAuthenticated(true);
      setAuthError(null);
      return response;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
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
      setAuthError(null);
      const response = await authService.loginWithGoogle(credential);
      setUser(response.user);
      setIsAuthenticated(true);
      setAuthError(null);
      return response;
    } catch (error) {
      console.error("Erro ao fazer login com Google:", error);
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
      setAuthError(null);
      const response = await authService.register(
        nomeEstabelecimento,
        nome,
        email,
        senha,
      );
      setUser(response.user);
      setIsAuthenticated(true);
      setAuthError(null);
      return response;
    } catch (error) {
      console.error("Erro ao criar conta:", error);
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
    setAuthError(null);

    if (shouldRedirect) {
      window.location.href = "/login";
    }
  };

  const refreshUser = async () => {
    try {
      const updatedUser = await authService.getCurrentUser();
      setUser(updatedUser);
      setAuthError(null);
    } catch (error) {
      console.error("Erro ao atualizar dados do usuário:", error);
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
        refreshUser,
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
