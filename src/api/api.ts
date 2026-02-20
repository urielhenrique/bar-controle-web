import axios, { AxiosInstance, AxiosError } from "axios";

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

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Interceptor para adicionar token automaticamente
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

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

      const data = config.data;
      if (data && typeof data === "object") {
        if (data instanceof FormData || data instanceof Blob) {
          return config;
        }
        config.data = transformKeysDeep(data, toSnakeCase);
      }

      return config;
    });

    // Interceptor para lidar com erros de autenticação
    this.client.interceptors.response.use(
      (response) => {
        if (response?.data) {
          response.data = transformKeysDeep(response.data, toCamelCase);
        }
        return response;
      },
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user");
        }
        return Promise.reject(error);
      },
    );
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
    if (error.response) {
      // Erro da API
      const message = error.response.data?.message || error.message;
      return new Error(message);
    }
    if (error.request) {
      // Erro de conexão
      return new Error("Erro ao conectar com o servidor");
    }
    return new Error(error.message);
  }

  /**
   * Salvar token de autenticação
   */
  setToken(token: string): void {
    localStorage.setItem("auth_token", token);
  }

  /**
   * Obter token armazenado
   */
  getToken(): string | null {
    return localStorage.getItem("auth_token");
  }

  /**
   * Limpar token
   */
  clearToken(): void {
    localStorage.removeItem("auth_token");
  }
}

export const apiClient = new ApiClient();
export default apiClient;
