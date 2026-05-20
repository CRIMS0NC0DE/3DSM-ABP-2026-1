import { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import MetricsCards from "./MetricsCards";
import RevenueChart from "./RevenueChart";
import CategoryBarChart from "./CategoryBarChart";
import MetricsTable from "./MetricsTable";
import AttendantPerformance from "./AttendantPerformance";
import LeadDistributionPie from "./LeadDistributionPie";
import type { MetricSummary, ChartDataPoint, TransactionData, AttendantDataPoint, PieDataPoint } from "./index";

// Mocks para o Relatório
const metricsMock: MetricSummary[] = [
  { id: '1', label: 'Receita Total', value: 'R$ 1.240.000', trend: 'up', trendValue: '+14%', icon: 'money' },
  { id: '2', label: 'Novos Leads', value: '1.248', trend: 'up', trendValue: '+8%', icon: 'leads' },
  { id: '3', label: 'Taxa de Conversão', value: '18.4%', trend: 'down', trendValue: '-2%', icon: 'meta' },
  { id: '4', label: 'Ticket Médio', value: 'R$ 85.400', trend: 'up', trendValue: '+5%', icon: 'premium' },
];

const revenueMock: ChartDataPoint[] = [
  { label: 'Jan', value: 450 }, { label: 'Fev', value: 520 }, { label: 'Mar', value: 480 },
  { label: 'Abr', value: 610 }, { label: 'Mai', value: 550 }, { label: 'Jun', value: 670 },
];

const categoryMock: ChartDataPoint[] = [
  { label: 'Seminovos', value: 145 },
  { label: 'Zero KM', value: 82 },
  { label: 'Consignados', value: 34 },
];

const pieMock: PieDataPoint[] = [
  { label: 'Instagram', value: 45, color: '#3b82f6' },
  { label: 'Facebook', value: 25, color: '#10b981' },
  { label: 'WhatsApp', value: 20, color: '#f59e0b' },
  { label: 'Outros', value: 10, color: '#6366f1' },
];

const attendantsMock: AttendantDataPoint[] = [
  { name: 'Márcio Bueno', sales: 24, leads: 110, conversion: '21.8%', avatarColor: 'bg-blue-500' },
  { name: 'Vinícius Oliveira', sales: 19, leads: 95, conversion: '20%', avatarColor: 'bg-emerald-500' },
  { name: 'Davi Snaider', sales: 15, leads: 120, conversion: '12.5%', avatarColor: 'bg-amber-500' },
];

const transactionsMock: TransactionData[] = [
  { id: 1, customer: 'Henrique Pinho', status: 'Completed', date: '12 Out 2026', amount: 'R$ 125.000' },
  { id: 2, customer: 'Eric França', status: 'Pending', date: '11 Out 2026', amount: 'R$ 84.900' },
  { id: 3, customer: 'Pedro Rosa', status: 'Canceled', date: '10 Out 2026', amount: 'R$ 52.000' },
];

export default function MetricsPage() {
  const [status, setStatus] = useState("all");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  return (
    <main className="min-h-screen bg-slate-950 p-6 lg:p-10">
      <DashboardHeader 
        statusFilter={status}
        onStatusChange={setStatus}
        startDate={start}
        onStartDateChange={setStart}
        endDate={end}
        onEndDateChange={setEnd}
      />

      <div className="space-y-8">
        {/* KPIs */}
        <MetricsCards data={metricsMock} />

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          <RevenueChart data={revenueMock} />
          <LeadDistributionPie data={pieMock} />
        </div>

        {/* Middle Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <MetricsTable transactions={transactionsMock} />
          </div>
          <div className="space-y-6">
            <CategoryBarChart data={categoryMock} />
            <AttendantPerformance data={attendantsMock} />
          </div>
        </div>
      </div>

      <footer className="mt-12 border-t border-slate-900 pt-6 text-center text-xs text-slate-600">
        © 2026 1000 Valle Multimarcas - Sistema de Gestão Interna (Intranet)
      </footer>
    </main>
  );
}