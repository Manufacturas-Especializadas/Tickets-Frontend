import { useState } from "react";
import { ticketFormService } from "../../api/services/ticketFormService";
import { Table } from "../../components/Table/Table";
import type { Tickets } from "../../interfaces/Tickets/interfaceTickets";
import Swal from "sweetalert2";
import { getEditModalHtml, getViewModalHtml } from "../../utils/ticketHelpers";
import { useTicketsData } from "../../hooks/useTicketsData";

export const AdminIndex = () => {
  const {
    setTickets,
    categories,
    loading,
    error,
    filteredTickets,
    filterStatus,
    setFilterStatus,
  } = useTicketsData();

  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const handleDelete = async (row: Tickets) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `Vas a eliminar el ticket: ${row.name}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    setActionLoading(row.id);
    try {
      const response = await ticketFormService.deleteTicket(row.id);
      if (response.success) {
        setTickets((prev) => prev.filter((t) => t.id !== row.id));
        Swal.fire("¡Eliminado!", "Ticket eliminado correctamente", "success");
      } else {
        throw new Error(response.message || "No se pudo eliminar");
      }
    } catch (error) {
      Swal.fire("Error", "Problema al comunicarse con el servidor", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleEdit = async (row: Tickets) => {
    const { value: formValues } = await Swal.fire({
      title: `<strong>Editar Ticket #${row.id}</strong>`,
      html: getEditModalHtml(row, categories),
      width: "600px",
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      preConfirm: () => {
        const name = (
          document.getElementById("swal-name") as HTMLInputElement
        )?.value.trim();
        const categoryId = Number(
          (document.getElementById("swal-category") as HTMLSelectElement)?.value
        );

        if (!name || !categoryId) {
          Swal.showValidationMessage("Nombre y Categoría son obligatorios");
          return false;
        }

        return {
          name,
          department:
            (document.getElementById("swal-department") as HTMLInputElement)
              ?.value || "",
          affair:
            (document.getElementById("swal-affair") as HTMLInputElement)
              ?.value || "",
          problemDescription:
            (
              document.getElementById(
                "swal-problemDescription"
              ) as HTMLTextAreaElement
            )?.value || "",
          categoryId,
          statusId: Number(
            (document.getElementById("swal-status") as HTMLSelectElement)?.value
          ),
        };
      },
    });

    if (!formValues) return;

    setActionLoading(row.id);
    try {
      const response = await ticketFormService.updateTicket(row.id, formValues);
      if (response.success) {
        const statusMap: Record<number, string> = {
          1: "Pendiente",
          2: "En progreso",
          3: "Resuelto",
        };

        setTickets((prev) =>
          prev.map((t) =>
            t.id === row.id
              ? {
                  ...t,
                  ...formValues,
                  status: statusMap[formValues.statusId] || t.status,
                }
              : t
          )
        );
        Swal.fire(
          "¡Actualizado!",
          "Ticket actualizado correctamente",
          "success"
        );
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      Swal.fire("Error", "No se pudo actualizar el ticket", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleView = (row: Tickets) => {
    Swal.fire({
      title: `<strong>Detalles del Ticket #${row.id}</strong>`,
      html: getViewModalHtml(row),
      confirmButtonText: "Cerrar",
    });
  };

  const handleDownloadReport = async () => {
    Swal.fire({
      title: "Generando reporte...",
      didOpen: () => Swal.showLoading(),
    });
    try {
      await ticketFormService.downloadReport();
      Swal.fire("¡Éxito!", "Archivo descargado", "success");
    } catch (error: any) {
      Swal.fire("Error", "No se pudo generar el archivo", "error");
    }
  };

  const columns = [
    { name: "Nombre", selector: (row: Tickets) => row.name, sortable: true },
    {
      name: "Categoría",
      selector: (row: Tickets) => row.category,
      sortable: true,
    },
    {
      name: "Estatus",
      selector: (row: Tickets) => row.status || "N/A",
      sortable: true,
    },
  ];

  const subHeaderComponent = (
    <div className="flex items-center gap-2 py-2 justify-end">
      <label className="font-semibold text-gray-700 text-sm">
        Filtar por estatus
      </label>

      <select
        id="status-filter"
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        className="block w-52 px-3 py-2 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
      >
        <option value="all">Todos</option>
        <option value="Abierto">Abierto</option>
        <option value="En progreso">En progreso</option>
        <option value="Cerrado">Cerrado</option>
      </select>
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-center mb-6">
            <h1 className="text-xl font-bold uppercase">
              Administra los tickets registrados
            </h1>

            <div className="flex space-x-3">
              <button
                onClick={handleDownloadReport}
                className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-md
                                transition-colors hover:cursor-pointer"
                disabled={loading}
              >
                Descargar información
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            {loading ? (
              <div className="py-12 text-center text-gray-500">
                Cargandos datos...
              </div>
            ) : error ? (
              <div className="py-12 text-center">
                <div className="text-red-500 font-medium mb-2">{error}</div>
                <button
                  className="bg-primary text-white px-4 py-2 rounded-md
                                        hover:bg-secondary transition-all"
                >
                  Reintentar
                </button>
              </div>
            ) : (
              <>
                <Table<Tickets>
                  columns={columns}
                  data={filteredTickets}
                  loading={loading}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  onView={handleView}
                  actionLoading={actionLoading}
                  subHeaderComponent={subHeaderComponent}
                  title="Lista de Tickets"
                  pagination
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
