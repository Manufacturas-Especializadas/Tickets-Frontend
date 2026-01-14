import { API_CONFIG } from "../../config/api";
import { apiClient } from "../client";

class AuthService {
  private loginEndpoint = API_CONFIG.endpoints.auth.login;
  private logoutEndpoint = API_CONFIG.endpoints.auth.logout;

  async login(payRollNumber: number, password: string): Promise<any> {
    return apiClient.post(this.loginEndpoint, { payRollNumber, password });
  }

  async logout(): Promise<void> {
    await apiClient.post(this.logoutEndpoint, {});
  }
}

export const authService = new AuthService();
