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

export interface FoundTicket extends TicketFormData {
    createdAt: string
}

export interface TicketResponse {
    success: boolean;
    message?: string;
    ticketId?: string;
}

class TicketFormService {
    private categoriesEnpoint = API_CONFIG.endpoints.ticketForm.categories;
    private ticketsEnpoint = API_CONFIG.endpoints.ticketForm.tickets;
    private searchByName = API_CONFIG.endpoints.ticketForm.search;
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

    async searchTicketByName(name: string): Promise<{
        success: boolean;
        data?: FoundTicket;
        message?: string;
    }> {
        if (!name || name.trim() === '') {
            return {
                success: false,
                message: 'El nombre del ticket es obligatorio.'
            };
        }

        try {
            const url = `${this.searchByName}?name=${encodeURIComponent(name)}`;

            const response = await apiClient.get<{
                success: boolean;
                data?: FoundTicket;
                message?: string;
            }>(url);

            return response;
        } catch (error: any) {
            console.error('Error al buscar ticket por nombre:', error);

            if (error instanceof Error && error.message.includes('404')) {
                return {
                    success: false,
                    message: 'No se encontró ningún ticket con ese nombre.'
                };
            }

            if (error instanceof Error && error.message.includes('400')) {
                return {
                    success: false,
                    message: 'Solicitud inválida.'
                };
            }

            return {
                success: false,
                message: 'Ocurrió un error al comunicarse con el servidor. Inténtalo más tarde.'
            };
        }
    }
}

export const ticketFormService = new TicketFormService();