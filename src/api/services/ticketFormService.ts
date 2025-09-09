import { API_CONFIG } from "../../config/api";
import type { Category } from "../../interfaces/Categories/interfaceCategory";
import type { Tickets } from "../../interfaces/Tickets/interfaceTickets";
import { apiClient } from "../client";

export interface TicketFormData {
    name: string;
    department: string;
    affair: string;
    problemDescription: string;
    categoryId: number;
    statusId: number;
}

export interface TicketResponse {
    success: boolean;
    message?: string;
    ticketId?: string;
}

class TicketFormService {
    private categoriesEnpoint = API_CONFIG.endpoints.ticketForm.categories;
    private ticketsEnpoint = API_CONFIG.endpoints.ticketForm.tickets;
    private registerEnpoint = API_CONFIG.endpoints.ticketForm.register;
    private udpateEnpoint = API_CONFIG.endpoints.ticketForm.update;
    private deleteEnpoint = API_CONFIG.endpoints.ticketForm.delete;

    async getCategories(): Promise<Category[]> {
        return apiClient.get<Category[]>(this.categoriesEnpoint);
    }

    async getTickets(): Promise<Tickets[]> {
        return apiClient.get<Tickets[]>(this.ticketsEnpoint);
    }

    async registerTicket(data: TicketFormData): Promise<TicketResponse> {
        return apiClient.post<TicketResponse>(this.registerEnpoint, data);
    }

    async updateTicket(id: number | string, data: Partial<TicketFormData>): Promise<TicketResponse> {
        return apiClient.put<TicketResponse>(`${this.udpateEnpoint}${id}`, data);
    }

    async deleteTicket(id: number | string): Promise<TicketResponse> {
        return apiClient.delete<TicketResponse>(`${this.deleteEnpoint}${id}`);
    }
}

export const ticketFormService = new TicketFormService();