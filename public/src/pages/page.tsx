import { useMetrics } from "./useMetrics";
import DashboardHeader from "./DashboardHeader";
import MetricsCards from "./MetricsCards";
import RevenueChart from "./RevenueChart";
import MetricsTable from "./MetricsTable";
import LeadDistributionPie from "./LeadDistributionPie";
import CategoryBarChart from "./CategoryBarChart";
import AttendantPerformance from "./AttendantPerformance";

export default function MetricsPage() {
  const { 
    summary, 
    revenueData, 
    transactions, 
    leadSources, 
    categoryPerformance, 
    attendantPerformance, 
    filter, 
    setFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate 
  } = useMetrics();

  return (
    <div className="min-h-full bg-slate-950 p-4 text-slate-100 sm:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header com Filtros */}
        <DashboardHeader 
          statusFilter={filter}
          onStatusChange={setFilter}
          startDate={startDate}
          onStartDateChange={setStartDate}
          endDate={endDate}
          onEndDateChange={setEndDate}
        />

        {/* Sumário em Cards */}
        <MetricsCards data={summary} />

        {/* Linha 2: Gráfico de Receita e Distribuição */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
          <RevenueChart data={revenueData} />
          </div>
          <LeadDistributionPie data={leadSources} />
        </div>
          
        {/* Linha 3: Tabela e Performance */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
          <MetricsTable transactions={transactions} />
          </div>
          <div className="flex flex-col gap-6">
            <AttendantPerformance data={attendantPerformance} />
            <CategoryBarChart data={categoryPerformance} />
          </div>
        </div>
      </div>
    </div>
  );
}