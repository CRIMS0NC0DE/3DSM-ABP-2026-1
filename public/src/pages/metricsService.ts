import type { MetricSummary, ChartDataPoint, TransactionData, PieDataPoint, AttendantDataPoint } from "./index";

export const metricsService = {
  getSummary: (): MetricSummary[] => [
    { id: "1", label: "Vendas Totais", value: "R$ 24.500", trendValue: "+12%", trend: "up", icon: "💰" },
    { id: "2", label: "Novos Leads", value: "128", trendValue: "-3%", trend: "down", icon: "👥" },
    { id: "3", label: "Taxa de Conversão", value: "18.2%", trendValue: "+7%", trend: "up", icon: "📈" },
    { id: "4", label: "Ticket Médio", value: "R$ 1.250", trendValue: "estável", trend: "stable", icon: "🏷️" },
  ],

  getRevenueData: (): ChartDataPoint[] => [
    { label: "Jan", value: 400 }, { label: "Fev", value: 300 }, { label: "Mar", value: 600 },
    { label: "Abr", value: 800 }, { label: "Mai", value: 500 }, { label: "Jun", value: 900 },
  ],

  getLeadSourceData: (): PieDataPoint[] => [
    { label: "Instagram", value: 45, color: "#0ea5e9" }, // Sky 500
    { label: "WhatsApp", value: 30, color: "#10b981" }, // Emerald 500
    { label: "Facebook", value: 15, color: "#3b82f6" }, // Blue 500
    { label: "Outros", value: 10, color: "#64748b" },   // Slate 500
  ],

  getCategoryPerformance: (): ChartDataPoint[] => [
    { label: "Sedans", value: 85 },
    { label: "SUVs", value: 120 },
    { label: "Hatchbacks", value: 65 },
    { label: "Caminhonetes", value: 40 },
  ],

  getAttendantPerformance: (): AttendantDataPoint[] => [
    { name: "Thiago Nunes", sales: 12, leads: 45, conversion: "26.6%", avatarColor: "bg-emerald-500" },
    { name: "Márcio Bueno", sales: 8, leads: 38, conversion: "21.1%", avatarColor: "bg-blue-500" },
    { name: "Davi Almeida", sales: 15, leads: 52, conversion: "28.8%", avatarColor: "bg-rose-500" },
    { name: "Vinícius", sales: 5, leads: 30, conversion: "16.6%", avatarColor: "bg-amber-500" },
  ],

  getRecentTransactions: (): TransactionData[] => [
    { id: "T1", customer: "João Silva", status: "Completed", date: "22/10/2023", amount: "R$ 1.200", paymentMethod: "Pix" },
    { id: "T2", customer: "Maria Oliveira", status: "Pending", date: "21/10/2023", amount: "R$ 850", paymentMethod: "Cartão" },
    { id: "T3", customer: "Pedro Santos", status: "Canceled", date: "20/10/2023", amount: "R$ 2.100", paymentMethod: "Boleto" },
    { id: "T4", customer: "Ana Costa", status: "Completed", date: "19/10/2023", amount: "R$ 1.500", paymentMethod: "Pix" },
  ]
};