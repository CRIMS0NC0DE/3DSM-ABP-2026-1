interface DashboardHeaderProps {
  statusFilter: string;
  onStatusChange: (status: string) => void;
  startDate: string;
  onStartDateChange: (date: string) => void;
  endDate: string;
  onEndDateChange: (date: string) => void;
}

export default function DashboardHeader({ 
  statusFilter, 
  onStatusChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange 
}: DashboardHeaderProps) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 md:text-3xl">Painel de Performance</h1>
        <p className="mt-1 text-sm text-slate-400">Bem-vindo de volta! Aqui está o que está acontecendo hoje.</p>
      </div>
      
      <div className="flex flex-wrap items-center gap-4">
        {/* Dropdown de Status */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="cursor-pointer rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm text-slate-200 outline-none transition hover:border-slate-600 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10"
          >
            <option value="all">Todos os Status</option>
            <option value="completed">Concluídos</option>
            <option value="pending">Pendentes</option>
            <option value="canceled">Cancelados</option>
          </select>
        </div>

        {/* Período de Data */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1">Período</label>
          <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/50 p-1 px-3 outline-none transition hover:border-slate-600">
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="bg-transparent text-xs text-slate-100 outline-none [color-scheme:dark]"
            />
            <span className="text-slate-600 font-bold">→</span>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="bg-transparent text-xs text-slate-100 outline-none [color-scheme:dark]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}