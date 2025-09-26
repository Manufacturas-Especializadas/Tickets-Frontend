import React, { useEffect, useRef, useState } from "react";
import type { Category } from "../../interfaces/Categories/interfaceCategory";
import { ticketFormService, type FoundTicket, type TicketFormData } from "../../api/services/ticketFormService";
import Swal from "sweetalert2";
import { TicketSearchBar } from "../../components/TicketSearchBar/TicketSearchBar";
import { TicketCard } from "../../components/TicketCard/TicketCard";

interface FormErrors {
    name?: string;
    department?: string;
    affair?: string;
    category?: string;
    description?: string;
}

export const TicketForm = () => {
    const [formData, setFormData] = useState<TicketFormData>({
        name: '',
        department: '',
        affair: '',
        problemDescription: '',
        categoryId: 0,
        statusId: 1
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchLoading, setSearchLoading] = useState(false);
    const [foundTicket, setFoundTicket] = useState<FoundTicket | null>(null);
    const hasSearchedRef = useRef(false);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await ticketFormService.getCategories();
                setCategories(data);
            } catch (error) {
                console.error('Error loading categories:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'No se pudieron cargar las categorías. Por favor, intenta más tarde.',
                    icon: 'error'
                });
            }
        };

        loadCategories();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        if (foundTicket) setFoundTicket(null);
    };

    const handleSearch = async () => {
        if (!searchTerm.trim() || searchTerm.length < 2) {
            Swal.fire({
                title: 'Buscar',
                text: 'Por favor, ingresa al menos 2 caracteres para buscar',
                icon: 'info'
            });
            return;
        }

        setSearchLoading(true);
        hasSearchedRef.current = true;

        try {
            const result = await ticketFormService.searchTicketByName(searchTerm);

            if (result.success && result.data) {
                setFoundTicket(result.data);
            } else {
                throw new Error(result.message || "Ticket no encontrado");
            }
        } catch (error) {
            Swal.fire({
                title: 'No encontrado',
                text: error instanceof Error ? error.message : 'Error desconocido',
                icon: 'warning'
            });
            setFoundTicket(null);
        } finally {
            setSearchLoading(false);
        }
    };

    const handleClearSearch = () => {
        setSearchTerm("");
        setFoundTicket(null);
        hasSearchedRef.current = false;
    };

    const validate = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
        if (!formData.affair.trim()) newErrors.affair = 'El asunto es obligatorio';
        if (!formData.categoryId) newErrors.category = 'Selecciona una categoría';
        if (!formData.problemDescription.trim()) newErrors.description = 'La descripción es obligatoria';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setIsSubmitting(true);

        try {
            const response = await ticketFormService.registerTicket(formData);
            if (response.success) {
                setSubmitSuccess(true);
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Tu ticket se ha enviado correctamente.',
                    icon: 'success',
                    timer: 3000,
                    showConfirmButton: false
                });

                setFormData({
                    name: '',
                    department: '',
                    affair: '',
                    problemDescription: '',
                    categoryId: 0,
                    statusId: 1
                });

                handleClearSearch();
            } else {
                throw new Error(response.message || 'No se pudo registrar el ticket');
            }
        } catch (error) {
            console.error('Error submitting ticket:', error);
            Swal.fire({
                title: 'Oooops...',
                text: 'Hubo un error al enviar el ticket. Inténtalo de nuevo.',
                icon: 'error'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
                        Abrir nuevo ticket
                    </h1>
                    <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Por favor, completa este formulario para reportar un problema o realizar una solicitud.
                        Nuestro equipo responderá lo antes posible.
                    </p>
                </div>

                {submitSuccess && (
                    <div className="mb-6 flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-4 animate-fade-in">
                        <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-green-800 font-medium">¡Ticket enviado con éxito!</span>
                    </div>
                )}

                <TicketSearchBar
                    searchTerm={searchTerm}
                    onSearch={handleSearch}
                    onClear={handleClearSearch}
                    onChange={handleSearchChange}
                    isSearching={searchLoading}
                />

                {
                    foundTicket ? (
                        <TicketCard
                            ticket={foundTicket}
                            categories={categories}
                            onClear={handleClearSearch}
                        />
                    ) : hasSearchedRef.current && searchTerm && !searchLoading && foundTicket === null ? (
                        <div className="mb-8 p-5 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-center">
                            <p className="text-gray-500">No se encontró ningún ticket con ese nombre.</p>
                        </div>
                    ) : null
                }

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Nombre */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                            Nombre *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-all duration-200 ${errors.name
                                ? 'border-red-500 focus:ring-red-500/30'
                                : 'border-gray-300 focus:ring-indigo-500/30'
                                }`}
                            aria-invalid={!!errors.name}
                            aria-describedby={errors.name ? "name-error" : undefined}
                        />
                        {errors.name && (
                            <p id="name-error" className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Departamento */}
                    <div>
                        <label htmlFor="department" className="block text-sm font-semibold text-gray-700 mb-2">
                            Departamento
                        </label>
                        <input
                            type="text"
                            id="department"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-all duration-200 ${errors.department
                                ? 'border-red-500 focus:ring-red-500/30'
                                : 'border-gray-300 focus:ring-indigo-500/30'
                                }`}
                            aria-invalid={!!errors.department}
                            aria-describedby={errors.department ? "department-error" : undefined}
                        />
                        {errors.department && (
                            <p id="department-error" className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                {errors.department}
                            </p>
                        )}
                    </div>

                    {/* Asunto */}
                    <div>
                        <label htmlFor="affair" className="block text-sm font-semibold text-gray-700 mb-2">
                            Asunto del ticket *
                        </label>
                        <input
                            type="text"
                            id="affair"
                            name="affair"
                            value={formData.affair}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-all duration-200 ${errors.affair
                                ? 'border-red-500 focus:ring-red-500/30'
                                : 'border-gray-300 focus:ring-indigo-500/30'
                                }`}
                            aria-invalid={!!errors.affair}
                            aria-describedby={errors.affair ? "affair-error" : undefined}
                        />
                        {errors.affair && (
                            <p id="affair-error" className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                {errors.affair}
                            </p>
                        )}
                    </div>

                    {/* Categoría */}
                    <div>
                        <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                            Categoría *
                        </label>
                        <select
                            id="category"
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={(e) => {
                                const value = e.target.value ? Number(e.target.value) : 0;
                                setFormData(prev => ({
                                    ...prev,
                                    categoryId: value
                                }));

                                if (errors.category) {
                                    setErrors(prev => ({ ...prev, category: undefined }));
                                }
                            }}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-all duration-200 appearance-none bg-white ${errors.category
                                ? 'border-red-500 focus:ring-red-500/30'
                                : 'border-gray-300 focus:ring-indigo-500/30'
                                }`}
                            aria-invalid={!!errors.category}
                            aria-describedby={errors.category ? "category-error" : undefined}
                        >
                            <option value="">Selecciona una categoría</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        {errors.category && (
                            <p id="category-error" className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                {errors.category}
                            </p>
                        )}
                    </div>

                    {/* Descripción */}
                    <div>
                        <label htmlFor="problemDescription" className="block text-sm font-semibold text-gray-700 mb-2">
                            Descripción detallada del problema *
                        </label>
                        <textarea
                            id="problemDescription"
                            name="problemDescription"
                            value={formData.problemDescription}
                            onChange={handleChange}
                            rows={6}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:outline-none transition-all duration-200 resize-vertical ${errors.description
                                ? 'border-red-500 focus:ring-red-500/30'
                                : 'border-gray-300 focus:ring-indigo-500/30'
                                }`}
                            aria-invalid={!!errors.description}
                            aria-describedby={errors.description ? "description-error" : undefined}
                        />
                        {errors.description && (
                            <p id="description-error" className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-center w-full sm:flex-row gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl 
                                font-medium text-white transition-all duration-200 transform hover:scale-[1.01] 
                                active:scale-[0.99] ${isSubmitting
                                    ? 'bg-indigo-400 cursor-not-allowed'
                                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg'
                                } hover:cursor-pointer`}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg
                                        className="animate-spin h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Enviando...
                                </>
                            ) : (
                                'Enviar Ticket'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};