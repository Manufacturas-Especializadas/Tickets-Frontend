import type { Category } from "../interfaces/Categories/interfaceCategory";
import type { Tickets } from "../interfaces/Tickets/interfaceTickets";

export const TICKET_STATUS = {
  PENDING: { id: 1, label: "Pendiente", color: "#ffc107" },
  IN_PROGRESS: { id: 2, label: "En progreso", color: "#17a2b8" },
  RESOLVED: { id: 3, label: "Resuelto", color: "#28a745" },
  DEFAULT: { id: 0, label: "N/A", color: "#6c757d" },
};

export const getStatusColor = (statusName: string) => {
  const status = Object.values(TICKET_STATUS).find(
    (s) => s.label === statusName
  );

  return status ? status.color : TICKET_STATUS.DEFAULT.color;
};

export const getEditModalHtml = (
  row: Tickets,
  categories: Category[]
) => `<div style="text-align: left; max-height: 70vh; overflow-y: auto; padding: 10px;">
    <div class="mb-4">
      <label class="block font-bold mb-1">Nombre</label>
      <input id="swal-name" class="swal2-input" value="${
        row.name
      }" placeholder="Tu nombre">
    </div>
    <div class="mb-4">
      <label class="block font-bold mb-1">Departamento</label>
      <input id="swal-department" class="swal2-input" value="${
        row.department || ""
      }" placeholder="Departamento">
    </div>
    <div class="mb-4">
      <label class="block font-bold mb-1">Asunto</label>
      <input id="swal-affair" class="swal2-input" value="${
        row.affair
      }" placeholder="Asunto">
    </div>
    <div class="mb-4">
        <label class="block font-bold mb-1">Categoría</label>
        <select id="swal-category" class="swal2-select w-3/4 p-2 border rounded">
            ${categories
              .map(
                (cat) =>
                  `<option value="${cat.id}" ${
                    cat.id === row.categoryId ? "selected" : ""
                  }>${cat.name}</option>`
              )
              .join("")}
        </select>
    </div>
    <div class="mb-4">
        <label class="block font-bold mb-1">Descripción</label>
        <textarea id="swal-problemDescription" class="swal2-textarea w-3/4" placeholder="Describe el problema...">${
          row.problemDescription || ""
        }</textarea>
    </div>
    <div class="mb-4">
        <label class="block font-bold mb-1">Estatus</label>
        <select id="swal-status" class="swal2-select w-3/4 p-2 border rounded">
            <option value="1" ${
              row.statusId === 1 ? "selected" : ""
            }>Pendiente</option>
            <option value="2" ${
              row.statusId === 2 ? "selected" : ""
            }>En progreso</option>
            <option value="3" ${
              row.statusId === 3 ? "selected" : ""
            }>Resuelto</option>
        </select>
    </div>
  </div>`;

export const getViewModalHtml = (
  row: Tickets
) => `<div class="text-left text-sm leading-relaxed">
        <p><strong>Nombre:</strong> ${row.name}</p>
        <p><strong>Departamento:</strong> ${row.department || "N/A"}</p>
        <p><strong>Asunto:</strong> ${row.affair}</p>
        <div class="my-2">
            <strong>Descripción:</strong>
            <p class="bg-gray-100 p-3 rounded-md border-l-4 border-blue-500 mt-1">
                ${row.problemDescription || "Sin descripción"}
            </p>
        </div>
        <p><strong>Categoría:</strong> ${row.category || "N/A"}</p>
        <p><strong>Estatus:</strong> <span style="color: ${getStatusColor(
          row.status || ""
        )}; font-weight: bold;">${row.status || "N/A"}</span></p>
        <p><strong>Fecha:</strong> ${row.date || "N/A"}</p>
    </div>`;
