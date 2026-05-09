import { useState, useMemo } from "react";
import { metricsService } from "./metricsService";

export function useMetrics() {
  const [filter, setFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  const summary = useMemo(() => metricsService.getSummary(), []);
  const revenueData = useMemo(() => metricsService.getRevenueData(), []);
  const transactions = useMemo(() => metricsService.getRecentTransactions(), []);
  const leadSources = useMemo(() => metricsService.getLeadSourceData(), []);
  const categoryPerformance = useMemo(() => metricsService.getCategoryPerformance(), []);
  const attendantPerformance = useMemo(() => metricsService.getAttendantPerformance(), []);

  const filteredTransactions = useMemo(() => {
    return (transactions || []).filter(t => {
      // Filtro de Status
      const matchesStatus = filter === "all" || t.status.toLowerCase() === filter.toLowerCase();
      if (!matchesStatus) return false;

      // Filtro de Data
      if (startDate || endDate) {
        // Converte "DD/MM/YYYY" para objeto Date
        const [day, month, year] = t.date.split('/').map(Number);
        const transactionDate = new Date(year, month - 1, day);

        if (startDate) {
          const start = new Date(startDate);
          if (transactionDate < start) return false;
        }
        if (endDate) {
          const end = new Date(endDate);
          // Ajusta para o final do dia escolhido
          end.setHours(23, 59, 59, 999);
          if (transactionDate > end) return false;
        }
      }

      return true;
    });
  }, [filter, startDate, endDate, transactions]);

  return {
    summary,
    revenueData,
    transactions: filteredTransactions,
    leadSources,
    categoryPerformance,
    attendantPerformance,
    filter,
    setFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    totalRevenue: "R$ 124.500,00"
  };
}