import type { PieDataPoint } from "./index";

export default function LeadDistributionPie({ data }: { data: PieDataPoint[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercent = 0;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-sm">
      <h2 className="mb-6 font-bold text-slate-100">Origem dos Leads</h2>
      <div className="flex flex-col items-center gap-8 sm:flex-row">
        <div className="relative h-40 w-40">
          <svg viewBox="0 0 32 32" className="h-full w-full -rotate-90 rounded-full">
            {data.map((item, index) => {
              const percent = (item.value / total) * 100;
              const dashArray = `${percent} 100`;
              const dashOffset = -cumulativePercent;
              cumulativePercent += percent;
              return (
                <circle
                  key={index}
                  cx="16"
                  cy="16"
                  r="16"
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth="6"
                  strokeDasharray={dashArray}
                  strokeDashoffset={dashOffset}
                  className="transition-all duration-500"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-full">
            <span className="text-xl font-bold text-white">{total}</span>
            <span className="text-[10px] uppercase text-slate-500">Total</span>
          </div>
        </div>
        <div className="flex-1 space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-300">{item.label}</span>
              </div>
              <span className="font-semibold text-slate-100">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}