import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import type { Tickets } from "../../interfaces/Tickets/interfaceTickets";
import { ticketFormService } from "../../api/services/ticketFormService";

export const HomeIndex = () => {
    type FilterKey = 'all' | 'Abierto' | 'En progreso' | 'Cerrado';
    const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
    const [tickets, setTickets] = useState<Tickets[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const ticketsPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    useEffect(() => {
        const loadTickets = async () => {
            try {
                setLoading(true);
                const data = await ticketFormService.getTickets();
                setTickets(data);
            } catch (error) {
                console.error('Error loading tickets:', error);
            } finally {
                setLoading(false);
            }
        };

        loadTickets();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [activeFilter, debouncedSearchTerm]);

    const counts = useMemo(() => ({
        all: tickets.length,
        open: tickets.filter(t => t.status === 'Abierto').length,
        progress: tickets.filter(t => t.status === 'En progreso').length,
        closed: tickets.filter(t => t.status === 'Cerrado').length
    }), [tickets]);

    const filters: { key: FilterKey; label: string; count: number }[] = [
        { key: 'all', label: 'Todos', count: counts.all },
        { key: 'Abierto', label: 'Abiertos', count: counts.open },
        { key: 'En progreso', label: 'En progreso', count: counts.progress },
        { key: 'Cerrado', label: 'Cerrados', count: counts.closed }
    ];

    const filteredTickets = useMemo(() => {
        let filtered = [...tickets];

        if (activeFilter !== 'all') {
            filtered = filtered.filter(ticket => ticket.status === activeFilter);
        }

        if (debouncedSearchTerm.trim()) {
            const term = debouncedSearchTerm.toLowerCase();
            filtered = filtered.filter(ticket =>
                ticket.name.toLowerCase().includes(term) ||
                ticket.affair.toLowerCase().includes(term) ||
                ticket.category?.toLowerCase().includes(term) ||
                ticket.status?.toLowerCase().includes(term)
            );
        }

        return filtered;
    }, [tickets, activeFilter, debouncedSearchTerm]);

    const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);
    const indexOfLastTicket = currentPage * ticketsPerPage;
    const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
    const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket);

    const renderPaginationButtons = () => {
        const pages = [];

        if (currentPage > 2) {
            pages.push(
                <button
                    key={1}
                    onClick={() => setCurrentPage(1)}
                    className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition"
                >
                    1
                </button>
            );
        }

        if (currentPage > 3) {
            pages.push(<span key="start-ellipsis" className="px-3 py-2 text-gray-500">...</span>);
        }

        for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition ${currentPage === i
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                >
                    {i}
                </button>
            );
        }

        if (currentPage < totalPages - 2) {
            pages.push(<span key="end-ellipsis" className="px-3 py-2 text-gray-500">...</span>);
        }

        if (currentPage < totalPages - 1) {
            pages.push(
                <button
                    key={totalPages}
                    onClick={() => setCurrentPage(totalPages)}
                    className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition"
                >
                    {totalPages}
                </button>
            );
        }

        return pages;
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
            <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <p className="text-xl text-gray-500 font-bold">
                            Sigue el estado de tus solicitudes
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative w-full sm:w-64">
                            <input
                                type="text"
                                placeholder="Buscar tickets..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm transition-shadow"
                                aria-label="Buscar tickets por nombre, asunto, categoría o estado"
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
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm 
                            font-medium px-5 py-2 rounded-lg shadow transition 
                            hover:cursor-pointer whitespace-nowrap"
                            aria-label="Crear nuevo ticket"
                        >
                            Nuevo ticket
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 p-6 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-6 flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {filters.map((filter) => (
                            <button
                                key={filter.key}
                                onClick={() => setActiveFilter(filter.key)}
                                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${activeFilter === filter.key
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-indigo-300'
                                    } hover:cursor-pointer`}
                                aria-label={`Filtrar por ${filter.label}`}
                            >
                                {filter.label}{' '}
                                <span
                                    className={`ml-1.5 px-2 py-0.5 rounded-full text-xs ${activeFilter === filter.key
                                        ? 'bg-white bg-opacity-30 text-white'
                                        : 'bg-gray-200 text-gray-600'
                                        }`}
                                >
                                    {filter.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white p-5 rounded-xl shadow-sm animate-pulse border border-gray-100">
                                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                                    <div className="flex flex-col md:flex-row gap-4 mt-3">
                                        <div className="flex-1 space-y-2">
                                            <div className="h-3 bg-gray-200 rounded w-full"></div>
                                            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                                            <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                                        </div>
                                        <div className="h-7 bg-gray-200 rounded w-20"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <>
                            {currentTickets.length === 0 ? (
                                <div role="status" aria-live="polite" className="text-center py-10">
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
                                        {tickets.length === 0
                                            ? 'No hay tickets disponibles'
                                            : 'No se encontraron tickets'}
                                    </h3>
                                    {tickets.length > 0 && debouncedSearchTerm && (
                                        <p className="text-gray-500 mt-2">Prueba con otros términos de búsqueda.</p>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {currentTickets.map((ticket) => (
                                        <div
                                            key={ticket.id}
                                            className="bg-white p-5 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100"
                                            onClick={() => navigate(`/ticket/${ticket.id}`)}
                                        >
                                            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
                                                        {ticket.affair}
                                                    </h3>
                                                    <div className="flex flex-wrap gap-3 text-sm text-gray-600 mt-2">
                                                        <div className="flex items-center gap-1">
                                                            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                            </svg>
                                                            <span>{ticket.date}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                            </svg>
                                                            <span>{ticket.name}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2zm10 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                            </svg>
                                                            <span>{ticket.category || 'Sin categoría'}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <span
                                                    className={`inline-flex px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap ${ticket.status === 'Abierto' ? 'bg-green-100 text-green-800' :
                                                        ticket.status === 'En progreso' ? 'bg-blue-100 text-blue-800' :
                                                            ticket.status === 'Cerrado' ? 'bg-red-100 text-red-800' :
                                                                'bg-gray-100 text-gray-800'
                                                        }`}
                                                >
                                                    {ticket.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-1 mt-6">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-2 rounded-lg border border-gray-300 bg-white 
                                        text-gray-700 disabled:opacity-50 hover:bg-gray-50 transition
                                        hover:cursor-pointer"
                                        aria-label="Página anterior"
                                    >
                                        Anterior
                                    </button>

                                    <div className="flex gap-1 hover:cursor-pointer">
                                        {renderPaginationButtons()}
                                    </div>

                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-2 rounded-lg border border-gray-300 bg-white 
                                        text-gray-700 disabled:opacity-50 hover:bg-gray-50 transition
                                        hover:cursor-pointer"
                                        aria-label="Siguiente página"
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};