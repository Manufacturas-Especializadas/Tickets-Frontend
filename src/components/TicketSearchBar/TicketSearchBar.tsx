import type React from "react";

interface Props {
    searchTerm: string;
    onSearch: () => void;
    onClear: () => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isSearching: boolean
}

export const TicketSearchBar: React.FC<Props> = ({
    searchTerm,
    onSearch,
    onClear,
    onChange,
    isSearching,
}) => {
    return (
        <>
            <div className="mb-8 p-4 bg-white rounded-xl shadow-md border border-gray-100">
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    <div className="flex-grow w-full">
                        <label htmlFor="ticket-search" className="block text-sm font-medium text-gray-700 mb-1">
                            Buscar ticket por nombre
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="ticket-search"
                                value={searchTerm}
                                onChange={onChange}
                                placeholder="Nombre de usuario"
                                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:outline-none 
                                transition-all duration-200 border-gray-300 focus:ring-indigo-500/30"
                                aria-label="Buscar por nombre de usuario"
                            />
                            {
                                searchTerm && (
                                    <button
                                        type="button"
                                        onClick={onClear}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400
                                        hover:text-gray-600 transition-colors hover:cursor-pointer"
                                        aria-label="Limpiar búsqueda"
                                    >
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )
                            }
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onSearch}
                        disabled={isSearching || !searchTerm.trim()}
                        className={`px-6 py-3 rounded-xl font-medium text-white transition-all duration-200
                            ${isSearching || !searchTerm.trim()
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg'
                            }
                        hover:cursor-pointer`}
                    >
                        {
                            isSearching ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                "Buscar"
                            )
                        }
                    </button>
                </div>
            </div>
        </>
    )
}
