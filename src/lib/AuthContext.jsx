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

      // Check if user is authenticated
      const token = authService.getToken();
      if (token) {
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

  const logout = (shouldRedirect = true) => {
    authService.logout();
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
