const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


if (!API_BASE_URL) {
    throw new Error("API base URL is not defined in environment variables")
}

export const API_CONFIG = {
    baseUrl: API_BASE_URL,
    endpoints: {
        ticketForm: {
            tickets: '/api/TicketForm/GetTickets',
            categories: '/api/TicketForm/GetCategories',
            register: '/api/TicketForm/RegisterTicket',
            update: '/api/TicketForm/Update/',
            delete: '/api/TicketForm/Delete/'
        },
    },
} as const;