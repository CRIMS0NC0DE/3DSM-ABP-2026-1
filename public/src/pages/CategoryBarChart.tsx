import type { ChartDataPoint } from "./index";

export default function CategoryBarChart({ data }: { data: ChartDataPoint[] }) {
  const max = Math.max(...data.map(d => d.value));

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-sm">
      <h2 className="mb-6 font-bold text-slate-100">Performance por Categoria</h2>
      <div className="space-y-5">
        {data.map((item) => (
          <div key={item.label} className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300">{item.label}</span>
              <span className="text-slate-400">{item.value} unidades</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-800">
              <div 
                className="h-full rounded-full bg-blue-600 transition-all duration-700" 
                style={{ width: `${(item.value / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}