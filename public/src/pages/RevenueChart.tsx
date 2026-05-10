import type { ChartDataPoint } from "./index";

export default function RevenueChart({ data }: { data: ChartDataPoint[] }) {
  const max = data && data.length > 0 ? Math.max(...data.map(d => d.value)) : 100;
  
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="font-bold text-slate-100">Fluxo de Receita</h2>
        <p className="text-xs text-slate-500">Visualização semestral</p>
      </div>
      <div className="flex h-48 items-end justify-between gap-2 px-2">
        {data.map((d) => {
          const height = (d.value / max) * 100;
          return (
            <div key={d.label} className="group relative flex flex-1 flex-col items-center gap-2">
              {/* Tooltip simulado */}
              <div className="absolute -top-8 hidden rounded bg-slate-800 px-2 py-1 text-[10px] text-white group-hover:block">
                R$ {d.value}k
              </div>
              <div 
                style={{ height: `${Math.max(height, 5)}%` }}
                className="w-full rounded-t-lg bg-blue-600/40 transition-all duration-300 group-hover:bg-blue-500"
              />
              <div className="h-1 w-full rounded-full bg-blue-600/20" />
              <span className="text-[10px] uppercase tracking-wider text-slate-500">{d.label}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-blue-500" />
          <span className="text-xs text-slate-300">Receita Realizada</span>
        </div>
      </div>
    </div>
  );
}