import axios, { AxiosInstance, AxiosError } from "axios";
import * as Sentry from "@sentry/react";

const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string) || "http://localhost:3000";

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  if (value === null || typeof value !== "object") return false;
  if (value instanceof Date) return false;
  return Object.getPrototypeOf(value) === Object.prototype;
};

const toCamelCase = (value: string) =>
  value.replace(/_([a-z0-9])/g, (_, char) => char.toUpperCase());

const toSnakeCase = (value: string) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1_$2")
    .toLowerCase();

const transformKeysDeep = (
  input: unknown,
  transformer: (key: string) => string,
): unknown => {
  if (Array.isArray(input)) {
    return input.map((item) => transformKeysDeep(item, transformer));
  }
  if (!isPlainObject(input)) return input;

  const output: Record<string, unknown> = {};
  Object.entries(input).forEach(([key, value]) => {
    output[transformer(key)] = transformKeysDeep(value, transformer);
  });
  return output;
};

class ApiClient {
  private client: AxiosInstance;
  private csrfToken: string | null = null;
  private csrfTokenPromise: Promise<void> | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // IMPORTANTE: Permite envio de cookies
    });

    // Interceptor de REQUEST: adiciona CSRF token e transforma dados
    this.client.interceptors.request.use(async (config) => {
      const method = config.method?.toLowerCase() || "";

      // Adiciona CSRF token para métodos que modificam dados
      if (["post", "put", "delete", "patch"].includes(method)) {
        await this.ensureCsrfToken();
        if (this.csrfToken) {
          config.headers["X-CSRF-Token"] = this.csrfToken;
        }
      }

      // Transforma params para snake_case
      if (config.params) {
        const params = transformKeysDeep(config.params, toSnakeCase) as Record<
          string,
          unknown
        >;

        if (typeof params.sort === "string") {
          const sortValue = params.sort;
          const normalized = sortValue.startsWith("-")
            ? `-${toSnakeCase(sortValue.slice(1))}`
            : toSnakeCase(sortValue);
          params.sort = normalized;
        }

        config.params = params;
      }

      // Transforma body para snake_case
      const data = config.data;
      if (data && typeof data === "object") {
        if (data instanceof FormData || data instanceof Blob) {
          return config;
        }
        config.data = transformKeysDeep(data, toSnakeCase);
      }

      return config;
    });

    // Interceptor de RESPONSE: transforma dados e lida com erros
    this.client.interceptors.response.use(
      (response) => {
        if (response?.data) {
          response.data = transformKeysDeep(response.data, toCamelCase);
        }
        return response;
      },
      (error: AxiosError) => Promise.reject(error),
    );
  }

  /**
   * Buscar e armazenar CSRF token
   * Deve ser chamado no carregamento da aplicação
   */
  private async sleep(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }

  async fetchCsrfToken(): Promise<void> {
    try {
      const response = await this.client.get<{ csrfToken: string }>(
        "/auth/csrf-token",
      );
      this.csrfToken = response.data.csrfToken;
    } catch (error: any) {
      const handledError = this.handleError(error) as Error & {
        status?: number;
      };
      if (handledError.status === 429) {
        await this.sleep(800);
        return this.fetchCsrfToken();
      }
      console.error("Erro ao buscar CSRF token:", error);
      throw handledError;
    }
  }

  /**
   * Garante que o CSRF token esteja carregado antes de requests sensiveis
   */
  private async ensureCsrfToken(): Promise<void> {
    if (this.csrfToken) return;
    if (!this.csrfTokenPromise) {
      this.csrfTokenPromise = this.fetchCsrfToken().finally(() => {
        this.csrfTokenPromise = null;
      });
    }
    await this.csrfTokenPromise;
    if (!this.csrfToken) {
      throw new Error("CSRF token indisponivel. Tente novamente em instantes.");
    }
  }

  /**
   * Método genérico GET
   */
  async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    try {
      const response = await this.client.get<T>(url, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Método genérico POST
   */
  async post<T>(url: string, data?: any): Promise<T> {
    try {
      const response = await this.client.post<T>(url, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Método genérico PUT
   */
  async put<T>(url: string, data?: any): Promise<T> {
    try {
      const response = await this.client.put<T>(url, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Método genérico DELETE
   */
  async delete<T>(url: string): Promise<T> {
    try {
      const response = await this.client.delete<T>(url);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Tratamento centralizado de erros
   */
  private handleError(error: any): Error {
    let status = 0;
    let message = error.message || "Unknown error";
    let errorData: any = null;

    if (error.response) {
      // Erro da API - suporta tanto 'message' quanto 'error'
      message =
        error.response.data?.message ||
        error.response.data?.error ||
        error.message;
      status = error.response.status;
      errorData = error.response.data;

      // Capture API errors in Sentry (excluding auth token errors)
      if (status >= 500) {
        // Server errors
        Sentry.captureException(error, {
          tags: {
            type: "api_error",
            status: status.toString(),
          },
          level: "error",
          contexts: {
            api: {
              url: error.config?.url || "unknown",
              method: error.config?.method?.toUpperCase() || "unknown",
              status: status,
              message: message,
            },
          },
        });
      } else if (status === 403) {
        // Forbidden/Auth errors
        Sentry.captureMessage("Authentication failed", {
          level: "warning",
          tags: {
            type: "auth_error",
            status: status.toString(),
          },
        });
      } else if (
        status === 402 ||
        error.response.data?.error === "PAYMENT_REQUIRED"
      ) {
        // Stripe/Payment errors
        Sentry.captureMessage("Payment processing error", {
          level: "warning",
          tags: {
            type: "payment_error",
            status: status.toString(),
          },
        });
      }
    } else if (error.request) {
      // Erro de conexão
      message = "Erro ao conectar com o servidor";
      status = 0;
      Sentry.captureException(error, {
        tags: {
          type: "connection_error",
        },
        level: "warning",
      });
    } else {
      // Other errors
      Sentry.captureException(error, {
        tags: {
          type: "client_error",
        },
        level: "error",
      });
    }

    const apiError = new Error(message) as Error & {
      status?: number;
      data?: unknown;
    };
    apiError.status = status;
    apiError.data = errorData;
    return apiError;
  }
}

export const apiClient = new ApiClient();
export default apiClient;
