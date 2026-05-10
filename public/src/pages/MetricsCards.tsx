import type { MetricSummary } from "./index";

export default function MetricsCards({ data }: { data: MetricSummary[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {data.map((item) => (
        <div key={item.id} className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-sm transition hover:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-2xl">{item.icon}</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              item.trend === 'up' ? 'bg-emerald-500/10 text-emerald-500' : 
              item.trend === 'down' ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-500/10 text-slate-400'
            }`}>
              {item.trendValue}
            </span>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-slate-400">{item.label}</p>
            <p className="mt-1 text-2xl font-bold text-white">{item.value}</p>
          </div>
          {/* Efeito visual Cruip */}
          <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-blue-600/5 blur-2xl" />
        </div>
      ))}
    </div>
  );
}