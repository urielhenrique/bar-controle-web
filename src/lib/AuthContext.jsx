import React, { createContext, useState, useContext, useEffect } from "react";
import authService from "@/services/auth.service";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    checkAppState();
  }, []);

  const checkAppState = async () => {
    try {
      setAuthError(null);

      // Check if user is authenticated by checking stored user
      const storedUser = authService.getStoredUser();
      if (storedUser) {
        // Verify with backend (validação real via cookies)
        await checkUserAuth();
      } else {
        setIsLoadingAuth(false);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Unexpected error checking app state:", error);
      setAuthError({
        type: "unknown",
        message: error.message || "Erro ao inicializar aplicação",
      });
      setIsLoadingAuth(false);
    }
  };

  const checkUserAuth = async () => {
    try {
      setIsLoadingAuth(true);
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      setIsAuthenticated(true);
      setIsLoadingAuth(false);
    } catch (error) {
      console.error("Falha ao verificar autenticação:", error);
      setIsLoadingAuth(false);
      setIsAuthenticated(false);
      authService.logout();
      setAuthError({
        type: "auth_required",
        message: "Autenticação necessária",
      });
    }
  };

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

  const logout = async (shouldRedirect = true) => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);

    if (shouldRedirect) {
      window.location.href = "/login-v2";
    }
  };

  const navigateToLogin = () => {
    window.location.href = "/login-v2";
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
        logout,
        navigateToLogin,
        checkAppState,
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
