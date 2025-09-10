import { useEffect, useState } from "react";
import { ticketFormService } from "../../api/services/ticketFormService";
import { Table } from "../../components/Table/Table";
import type { Tickets } from "../../interfaces/Tickets/interfaceTickets";
import type { Category } from "../../interfaces/Categories/interfaceCategory";
import Swal from "sweetalert2";

export const AdminIndex = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [category, setCategory] = useState<Category[]>([]);
    const [tickets, setTickets] = useState<Tickets[]>([]);
    const [actionLoading, setActionLoading] = useState<number | null>(null);

    useEffect(() => {
        const loadTickets = async () => {
            try {
                const data = await ticketFormService.getTickets();
                setTickets(data);
                setError(null);
            } catch (error) {
                console.error("Error loading tickets: ", error);

            } finally {
                setLoading(false);
            }
        };
        loadTickets();
    }, []);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await ticketFormService.getCategories();
                setCategory(data);
            } catch (error) {
                console.error('Error loading categories:', error);
            }
        };
        loadCategories();
    }, []);

    const handleDelete = async (row: Tickets) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: `Vas a eliminar el ticket: ${row.name}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) {
            return;
        }

        setActionLoading(row.id);

        try {
            const response = await ticketFormService.deleteTicket(row.id);
            if (response.success) {
                setTickets(tickets.filter(ticket => ticket.id !== row.id));

                Swal.fire({
                    title: '¡Eliminado!',
                    text: 'El ticket ha sido eliminado correctamente',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: response.message || 'No se pudo eliminar el ticket',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                })
            }
        } catch (error) {
            console.error("Erro al eliminar:", error);
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al comunicarse con el servidor',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        } finally {
            setActionLoading(null);
        }
    }

    const handleEdit = async (row: Tickets) => {
        const { value: formValues } = await Swal.fire({
            title: `<strong>Editar Ticket #${row.id}</strong>`,
            html: `
                <div style="text-align: left; max-height: 70vh; overflow-y: auto; padding: 10px;">
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Nombre</label>
                        <input id="swal-name" class="swal2-input" value="${row.name}" placeholder="Tu nombre">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Departamento</label>
                        <input id="swal-department" class="swal2-input" value="${row.department || ''}" placeholder="Departamento">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Asunto</label>
                        <input id="swal-affair" class="swal2-input" value="${row.affair}" placeholder="Asunto">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Categoría</label>
                        <select id="swal-category" class="swal2-select" style="width: 100%; padding: 8px; border: 1px solid #d9d9d9; border-radius: 4px;">
                            ${category.map(cat => `
                                <option value="${cat.id}" ${cat.id === row.categoryId ? 'selected' : ''}>${cat.name}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Descripción del problema</label>
                        <textarea id="swal-problemDescription" class="swal2-textarea" placeholder="Describe el problema..." style="width: 100%;">${row.problemDescription || ''}</textarea>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Estatus</label>
                        <select id="swal-status" class="swal2-select" style="width: 100%; padding: 8px; border: 1px solid #d9d9d9; border-radius: 4px;">
                            <option value="1" ${row.statusId === 1 ? 'selected' : ''}>Pendiente</option>
                            <option value="2" ${row.statusId === 2 ? 'selected' : ''}>En progreso</option>
                            <option value="3" ${row.statusId === 3 ? 'selected' : ''}>Resuelto</option>
                        </select>
                    </div>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Guardar cambios',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const name = (document.getElementById('swal-name') as HTMLInputElement)?.value.trim();
                const affair = (document.getElementById('swal-affair') as HTMLInputElement)?.value.trim();
                const categoryId = Number((document.getElementById('swal-category') as HTMLSelectElement)?.value);
                const problemDescription = (document.getElementById('swal-problemDescription') as HTMLTextAreaElement)?.value.trim();

                if (!name) {
                    Swal.showValidationMessage('El nombre es obligatorio');
                    return false;
                }
                if (!affair) {
                    Swal.showValidationMessage('El asunto es obligatorio');
                    return false;
                }
                if (!categoryId) {
                    Swal.showValidationMessage('Selecciona una categoría');
                    return false;
                }
                if (!problemDescription) {
                    Swal.showValidationMessage('La descripción es obligatoria');
                    return false;
                }

                return {
                    name,
                    department: (document.getElementById('swal-department') as HTMLInputElement)?.value || '',
                    affair,
                    problemDescription,
                    categoryId,
                    statusId: Number((document.getElementById('swal-status') as HTMLSelectElement)?.value)
                };
            }
        });

        if (!formValues) return;

        setActionLoading(row.id);

        try {
            const response = await ticketFormService.updateTicket(row.id, formValues);
            if (response.success) {
                setTickets(tickets.map(ticket =>
                    ticket.id === row.id
                        ? {
                            ...ticket,
                            ...formValues,
                            status: formValues.statusId === 1 ? 'Pendiente' :
                                formValues.statusId === 2 ? 'En progreso' :
                                    formValues.statusId === 3 ? 'Resuelto' : ticket.status
                        }
                        : ticket
                ));

                Swal.fire({
                    title: '¡Actualizado!',
                    text: 'El ticket ha sido actualizado correctamente.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: response.message || 'No se pudo actualizar el ticket.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            }
        } catch (err) {
            console.error("Error al actualizar:", err);
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al comunicarse con el servidor.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        } finally {
            setActionLoading(null);
        }
    }

    const handleView = (row: Tickets) => {
        Swal.fire({
            title: `<strong>Detalles del Ticket #${row.id}</strong>`,
            html: `
                <div style="text-align: left; line-height: 1.6; font-size: 14px;">
                    <div style="text-align: left; line-height: 1.6; font-size: 14px;">
                        <p><strong>Nombre:</strong> ${row.name}</p>
                        <p><strong>Departamento:</strong> ${row.department || 'N/A'}</p>
                        <p><strong>Asunto:</strong> ${row.affair}</p>
                        <p><strong>Descripción del problema:</strong></p>
                        <p style="background: #f8f9fa; padding: 10px; border-radius: 5px; border-left: 4px solid #0071ab;">
                            ${row.problemDescription || 'Sin descripción'}
                        </p>
                        <p><strong>Categoría:</strong> ${row.category || 'N/A'}</p>
                        <p><strong>Estatus:</strong> <span style="color: ${row.status === 'Resuelto' ? '#28a745' :
                    row.status === 'Pendiente' ? '#ffc107' :
                        row.status === 'En progreso' ? '#17a2b8' : '#6c757d'
                };">${row.status || 'N/A'}</span></p>
                        <p><strong>Fecha de registro:</strong> ${row.date || 'N/A'}</p>
                    </div>
                </div>            
            `,
            icon: 'info',
            confirmButtonText: 'Cerrar',
            customClass: {
                popup: 'swal2-popup-custom',
                title: 'swal2-title-custom'
            }
        });
    };

    const columns = [
        {
            name: "Nombre",
            selector: (row: Tickets) => row.name,
            sortable: true,
        },
        {
            name: "Categoría",
            selector: (row: Tickets) => row.category,
            sortable: true
        },
        {
            name: "Estatus",
            selector: (row: Tickets) => row.status || "N/A",
            sortable: true
        },
    ];

    return (
        <>
            <div className="min-h-screen bg-gray-50 p-4 md:p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-center mb-6">
                        <h1 className="text-xl font-bold uppercase">
                            Administra los tickets registrados
                        </h1>

                        <div className="flex space-x-3">
                            <button className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-md
                                transition-colors hover:cursor-pointer" disabled={loading}>
                                Descargar información
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-4">
                        {
                            loading ? (
                                <div className="py-12 text-center text-gray-500">
                                    Cargandos datos...
                                </div>
                            ) : error ? (
                                <div className="py-12 text-center">
                                    <div className="text-red-500 font-medium mb-2">
                                        {error}
                                    </div>
                                    <button className="bg-primary text-white px-4 py-2 rounded-md
                                        hover:bg-secondary transition-all">
                                        Reintentar
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <Table<Tickets>
                                        columns={columns}
                                        data={tickets}
                                        loading={loading}
                                        onDelete={handleDelete}
                                        onEdit={handleEdit}
                                        onView={handleView}
                                        actionLoading={actionLoading}
                                        title="Lista de Tickets"
                                        pagination
                                    />
                                </>
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    )
}