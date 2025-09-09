import DataTable, { type TableColumn } from "react-data-table-component";

interface Props<T> {
    columns: TableColumn<T>[];
    data: T[];
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
    onView?: (row: T) => void;
    onRowClicked?: (row: T) => void;
    title?: string;
    loading?: boolean;
    pagination?: boolean;
    selectableRows?: boolean;
    actionLoading?: number | null;
}

export const Table = <T extends object>({
    columns,
    data,
    onEdit,
    onDelete,
    onView,
    title,
    loading = false,
    pagination = true,
    selectableRows = false,
    onRowClicked,
    actionLoading
}: Props<T>) => {

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: "#0071ab",
                color: "white",
                fontWeight: "bold",
                fontSize: "14px",
                padding: "12px",
            },
        },
        cells: {
            style: {
                padding: "12px"
            }
        },
        rows: {
            style: {
                minHeight: "50px",
                "&:nth-child(even)": {
                    backgroundColor: "rgba(0, 164, 228, 0.05)"
                },
                "&:hover": {
                    backgroundColor: "rgba(0, 142, 212, 0.1)"
                }
            },
        },
        pagination: {
            style: {
                borderTop: "none",
                justifyContent: "center"
            }
        }
    };

    const actionColumn: TableColumn<T> | null = onEdit || onDelete || onView
        ? {
            name: "Acciones",
            cell: (row: T) => {
                const rowId = (row as any).id as number;

                return (
                    <div style={{ display: "flex", gap: "8px" }}>
                        {
                            onView && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onView(row);
                                    }}
                                    style={buttonStyle("blue")}
                                    disabled={actionLoading === rowId}
                                >
                                    {actionLoading === rowId ? "Cargando..." : "Detalles"}
                                </button>
                            )
                        }
                        {
                            onEdit && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(row);
                                    }}
                                    style={buttonStyle("orange")}
                                    disabled={actionLoading === rowId}
                                >
                                    {actionLoading === rowId ? "Cargando..." : "Editar"}
                                </button>
                            )
                        }
                        {
                            onDelete && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(row);
                                    }}
                                    style={buttonStyle("red")}
                                    disabled={actionLoading === rowId}
                                >
                                    {actionLoading === rowId ? "Cargando..." : "Eliminar"}
                                </button>
                            )
                        }
                    </div>
                );
            },
            ignoreRowClick: true,
            width: "200px"
        }
        : null;

    const finalColumns = actionColumn ? [...columns, actionColumn] : columns;

    return (
        <>
            <div style={{ margin: "20px 0" }}>
                {title && <h3 style={{ marginBottom: "16px", color: "#0071ab" }}>{title}</h3>}
                <DataTable
                    columns={finalColumns}
                    data={data}
                    customStyles={customStyles}
                    progressPending={loading}
                    pagination={pagination}
                    selectableRows={selectableRows}
                    onRowClicked={onRowClicked}
                    highlightOnHover
                    pointerOnHover={!!onRowClicked}
                />
            </div>
        </>
    )
}

const buttonStyle = (color: string) => ({
    padding: "6px 6px",
    border: "none",
    borderRadius: "4px",
    color: "white",
    backgroundColor: color,
    cursor: "pointer",
    fontSize: "12px",
});

export type { Props };