import { useEffect, useMemo, useState } from "react";
import type { Category } from "../interfaces/Categories/interfaceCategory";
import type { Tickets } from "../interfaces/Tickets/interfaceTickets";
import { ticketFormService } from "../api/services/ticketFormService";

export const useTicketsData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tickets, setTickets] = useState<Tickets[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [ticketsData, categoriesData] = await Promise.all([
          ticketFormService.getTickets(),
          ticketFormService.getCategories(),
        ]);
        setTickets(ticketsData);
        setCategories(categoriesData);
        setError(null);
      } catch (err) {
        console.error("Error loading data: ", err);
        setError("Error al cargar la informacion del servidor");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredTickets = useMemo(() => {
    if (filterStatus === "all") return tickets;

    return tickets.filter((ticket) => ticket.status === filterStatus);
  }, [tickets, filterStatus]);

  return {
    tickets,
    setTickets,
    categories,
    loading,
    error,
    filteredTickets,
    filterStatus,
    setFilterStatus,
  };
};
