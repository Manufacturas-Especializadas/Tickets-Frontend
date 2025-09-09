import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { Tickets } from "../../interfaces/Tickets/interfaceTickets";
import { ticketFormService } from "../../api/services/ticketFormService";

export const HomeIndex = () => {
    const [activeFilter, setActiveFilter] = useState('all');
    const [tickets, setTickets] = useState<Tickets[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const ticketsPerPage = 2;
    const navigate = useNavigate();

    useEffect(() => {
        const loadTickets = async () => {
            try {
                const data = await ticketFormService.getTickets();
                setTickets(data);
            } catch (Error) {
                console.log('Error loading tickets: ', Error);
            }
        };

        loadTickets();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [activeFilter, searchTerm]);

    const counts = {
        all: tickets.length,
        open: tickets.filter(t => t.status === 'Abierto').length,
        progress: tickets.filter(t => t.status === 'En progreso').length,
        closed: tickets.filter(t => t.status === 'Cerrado').length
    };

    const filters = [
        { key: 'all', label: 'Todos', count: counts.all },
        { key: 'open', label: 'Abiertos', count: counts.open },
        { key: 'progress', label: 'En progreso', count: counts.progress },
        { key: 'closed', label: 'Cerrados', count: counts.closed }
    ];

    const getFilteredTickets = () => {
        let filtered = tickets;

        if (activeFilter === 'open') {
            filtered = filtered.filter(ticket => ticket.status === 'Abierto');
        } else if (activeFilter === 'progress') {
            filtered = filtered.filter(ticket => ticket.status === 'En progreso');
        } else if (activeFilter === 'closed') {
            filtered = filtered.filter(ticket => ticket.status === 'Cerrado');
        }

        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(ticket =>
                ticket.name.toLowerCase().includes(term) ||
                ticket.affair.toLowerCase().includes(term) ||
                ticket.category?.toLowerCase().includes(term) ||
                ticket.status?.toLowerCase().includes(term)
            );
        }

        return filtered;
    };

    const filteredTickets = getFilteredTickets();

    const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);
    const indexOfLastTicket = currentPage * ticketsPerPage;
    const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
    const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket);

    return (
        <>
            <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
                <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                Sistema de Tickets
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Gestiona y sigue el estado de tus solicitudes
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Buscar tickets..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-300 rounded-lg focus:ring-2
                                    focus:ring-indigo-500 focus:outline-none text-sm"
                                />
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-gray-400 absolute left-3 top-2.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>

                            <button
                                onClick={() => navigate("/abrir-ticket")}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium
                                px-5 py-2 rounded-lg shadow transition hover:cursor-pointer"
                            >
                                Nuevo ticket
                            </button>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-6 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-6 flex flex-wrap gap-2">
                            {
                                filters.map((filter) => (
                                    <button
                                        key={filter.key}
                                        onClick={() => setActiveFilter(filter.key)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition hover:cursor-pointer ${activeFilter === filter.key
                                            ? 'bg-indigo-600 text-white shadow'
                                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                            }`}
                                    >
                                        {filter.label}{' '}
                                        <span
                                            className={`ml-1.5 px-2 py-0.5 rounded-full text-xs ${activeFilter === filter.key
                                                ? 'bg-white bg-opacity-30'
                                                : 'bg-gray-200'
                                                }`}
                                        >
                                            {filter.count}
                                        </span>
                                    </button>
                                ))
                            }
                        </div>

                        <div className="space-y-4">
                            {
                                currentTickets.map((ticket) => (
                                    <div
                                        key={ticket.id}
                                        className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow
                                        border border-gray-200"
                                    >
                                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-medium text-gray-800">
                                                    {ticket.affair}
                                                </h3>
                                                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                                                    <div className="flex gap-1">
                                                        <span className="font-bold">
                                                            📅 Fecha de la solicitud:
                                                        </span>
                                                        <span>
                                                            {ticket.date}
                                                        </span>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <span className="font-bold">
                                                            📌 Solicitante:
                                                        </span>
                                                        <span>
                                                            {ticket.name}
                                                        </span>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <span className="font-bold">
                                                            Categoria:
                                                        </span>
                                                        <span>
                                                            {ticket.category}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <span
                                                className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${ticket.status === 'Abierto' ? 'bg-green-500 text-white' :
                                                    ticket.status === 'En progreso' ? 'bg-blue-500 text-white' :
                                                        ticket.status === 'Cerrado' ? 'bg-red-500 text-white' : ''
                                                    } w-fit`}
                                            >
                                                {ticket.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>

                        {
                            currentTickets.length === 0 && (
                                <div className="text-center py-10">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-12 w-12 mx-auto text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                    <h3 className="mt-4 text-lg font-medium text-gray-700">
                                        {tickets.length === 0 ? 'No hay tickets disponibles' : 'No se encontraron tickets'}
                                    </h3>
                                    {tickets.length > 0 && searchTerm && (
                                        <p className="text-gray-500 mt-2">Prueba con otros términos de búsqueda.</p>
                                    )}
                                </div>
                            )
                        }

                        {
                            totalPages > 1 && (
                                <div className="flex justify-center items-center gap-2 mt-6">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700
                                            disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        Anterior
                                    </button>

                                    <div className="flex gap-1">
                                        {
                                            Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                                <button
                                                    key={page}
                                                    onClick={() => setCurrentPage(page)}
                                                    className={`px-3 py-1 rounded text-sm font-medium transition ${currentPage === page
                                                        ? 'bg-indigo-600 text-white'
                                                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                                        }`}
                                                >
                                                    {page}
                                                </button>
                                            ))
                                        }
                                    </div>

                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 disabled:opacity-50
                                                disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            )
                        }
                    </div>
                </main>
            </div>
        </>
    )
}