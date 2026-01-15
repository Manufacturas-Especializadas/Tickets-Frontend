import { API_CONFIG } from "../config/api";

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.baseUrl;
  }

  private getHeaders(customHeaders: HeadersInit = {}): HeadersInit {
    const headers: any = {
      "Content-Type": "application/json",
      ...customHeaders,
    };

    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  private handleUnauthorized() {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");

    window.location.href = "/login";
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers = this.getHeaders(options.headers);

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      this.handleUnauthorized();
      throw new Error("Sesión expirada. Por favor inicia sesión nuevamente.");
    }

    if (!response.ok) {
      let errorMessage = `HTTP Error: ${response.status}`;
      try {
        const errorBody = await response.json();
        if (errorBody && errorBody.message) errorMessage = errorBody.message;
      } catch (e) {
        errorMessage = `${response.status} - ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json() as Promise<T>;
    }

    return null as unknown as T;
  }

  get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: "GET" });
  }

  post<T>(endpoint: string, body: any) {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  put<T>(endpoint: string, body: any) {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  async downloadReport(endpoint: string, fileName: string): Promise<void> {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(
          `Error al descargar: ${response.status} ${response.statusText}`
        );
      }

      const blob = await response.blob();

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error en downloadReport:", error);
      throw error;
    }
  }
}

export const apiClient = new ApiClient();
