import React from "react";

interface Props {
    ticket: {
        name: string;
        department: string;
        affair: string;
        problemDescription: string;
        categoryId: number | null;
        statusId: number;
        createdAt: string;
    };
    categories: { id: number; name: string }[];
    onClear: () => void;
}

export const TicketCard: React.FC<Props> = ({ ticket, categories, onClear }) => {
    const getStatusText = (statusId: number): string => {
        const statusMap: Record<number, string> = {
            1: "Abierto",
            2: "En progreso",
            3: "Cerrado",
            4: "Resuelto",
        };
        return statusMap[statusId] || "Desconocido";
    };

    const category = categories.find(cat => cat.id === ticket.categoryId)?.name || "No asignada";

    return (
        <div className="mb-8 p-5 bg-white rounded-xl shadow-md border border-gray-100 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">{ticket.name}</h3>
                <button
                    type="button"
                    onClick={onClear}
                    className="mt-4 sm:mt-0 flex items-center gap-1 px-3 py-2 
                    text-red-600 border border-red-200 rounded-lg hover:bg-red-50 
                    transition-colors text-sm hover:cursor-pointer"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Borrar
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                <div>
                    <span className="text-gray-500">Departamento:</span>
                    <p className="font-medium text-gray-800 mt-1">{ticket.department || "-"}</p>
                </div>
                <div>
                    <span className="text-gray-500">Asunto:</span>
                    <p className="font-medium text-gray-800 mt-1">{ticket.affair || "-"}</p>
                </div>
                <div>
                    <span className="text-gray-500">Categoría:</span>
                    <p className="font-medium text-gray-800 mt-1">{category}</p>
                </div>
                <div>
                    <span className="text-gray-500">Estado:</span>{' '}
                    <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${ticket.statusId === 1 ? 'bg-green-100 text-green-800' :
                        ticket.statusId === 2 ? 'bg-yellow-100 text-yellow-800' :
                            ticket.statusId === 3 || ticket.statusId === 4 ? 'bg-gray-100 text-gray-800' :
                                'bg-blue-100 text-blue-800'
                        }`}>
                        {getStatusText(ticket.statusId)}
                    </span>
                </div>
            </div>

            <div className="mb-4">
                <span className="text-gray-500 block mb-1">Descripción:</span>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg text-sm leading-relaxed">
                    {ticket.problemDescription || "-"}
                </p>
            </div>

        </div>
    );
};