import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { Category } from "../../interfaces/Categories/interfaceCategory";
import { ticketFormService, type TicketFormData } from "../../api/services/ticketFormService";
import Swal from "sweetalert2";

interface FormErrors {
    subject?: string;
    departament?: string;
    category?: string;
    priority?: string;
    description?: string;
    email?: string;
    name?: string;
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
    const [category, setCategory] = useState<Category[]>([]);
    const navigate = useNavigate();


    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const validate = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';

        if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
        if (!formData.affair.trim()) newErrors.subject = 'El asunto es obligatorio';
        if (!formData.categoryId) newErrors.category = 'Selecciona una categoría';
        if (!formData.problemDescription.trim())
            newErrors.description = 'La descripción es obligatoria';

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await ticketFormService.getCategories();
                setCategory(data);
            } catch (error) {
                console.error('Error loading categories:', error)
            }
        };
        loadCategories();

    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setIsSubmitting(true);

        try {
            const response = await ticketFormService.registerTicket(formData);
            if (response.success) {
                setSubmitSuccess(true);
                Swal.fire({
                    title: '¡Exito!',
                    text: 'Ticket enviado',
                    icon: 'success'
                });
                setFormData({
                    name: '',
                    department: '',
                    affair: '',
                    problemDescription: '',
                    categoryId: 0,
                    statusId: 0
                });

                navigate('/');
            } else {
                console.error(`Error: ${response.message || 'No se pudo registrar el ticket'}`);
            }
        } catch (error) {
            console.error('Error submitting ticket:', error);
            Swal.fire({
                title: 'Oooops...',
                text: 'Hubo un error al enviar el ticket. Inténtalo de nuevo.',
                icon: 'error'
            })
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="max-w-3xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-md mt-8">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-gray-800 uppercase">
                        Abrir nuevo ticket
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Por favor, completa el siguiente formulario para reportar un problema o realizar una consulta
                    </p>
                </div>
                {
                    submitSuccess && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                            ¡Ticket enviado con éxito!
                        </div>
                    )
                }
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Tu nombre
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`mt-1 block w-full border border-gray-300 
                                    rounded-md shadow-md py-2 px-3 focus:outline-none
                                    focus:ring-indigo-500 focus:border-indigo-500 ${errors.name ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label htmlFor="departament" className="block text-sm font-medium text-gray-700">
                            Departamento
                        </label>
                        <input
                            type="text"
                            id="department"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            className={`mt-1 block w-full border border-gray-300 
                                    rounded-md shadow-md py-2 px-3 focus:outline-none
                                    focus:ring-indigo-500 focus:border-indigo-500 ${errors.departament ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.departament && <p className="text-red-500 text-xs mt-1">{errors.departament}</p>}
                    </div>


                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                            Asunto
                        </label>
                        <input
                            type="text"
                            id="affair"
                            name="affair"
                            value={formData.affair}
                            onChange={handleChange}
                            className={`mt-1 block w-full border border-gray-300
                                rounded-md shadow-md py-2 px-3 focus:outline-none
                                focus:ring-indigo-500 focus:border-indigo-500 ${errors.subject ? 'border-red-500' : 'border-gray-300'}`
                            }
                        />
                        {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                    </div>

                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                            Categoria
                        </label>
                        <select
                            id="category"
                            name="category"
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
                            className={`mt-1 block w-full border border-gray-300
                                rounded-md shadow-md py-2 px-3 focus:outline-none
                                focus:ring-indigo-500 focus:border-indigo-500 ${errors.category ? 'border-red-500' : 'border-gray-300'}`
                            }
                        >
                            <option value="">Selecciona una categoría</option>
                            {
                                category.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    <div>
                        <label htmlFor="problemDescription" className="block text-sm font-medium text-gray-700 mb-1">
                            Descripción del problema
                        </label>
                        <textarea
                            id="problemDescription"
                            name="problemDescription"
                            value={formData.problemDescription}
                            onChange={handleChange}
                            rows={5}
                            className={`mt-1 block w-full border border-gray-300
                                rounded-md shadow-md py-2 px-3 focus:outline-none
                                focus:ring-indigo-500 focus:border-indigo-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`
                            }
                        />
                        {
                            errors.description && (
                                <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                            )
                        }
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-2.5
                            px-4 rounded-lg transition flex items-center justify-center hover:cursor-pointer"
                        >
                            {
                                isSubmitting ? (
                                    <>
                                        <svg
                                            className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                                )
                            }
                        </button>
                    </div>
                    <div>
                        <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => navigate("/")}
                            className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white py-2.5
                            px-4 rounded-lg transition flex items-center justify-center hover:cursor-pointer"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}
