import type { AttendantDataPoint } from "./index";

export default function AttendantPerformance({ data }: { data: AttendantDataPoint[] }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-sm">
      <div className="mb-6 text-left">
        <h2 className="font-bold text-slate-100">Performance da Equipe</h2>
        <p className="text-xs text-slate-500">Ranking por taxa de conversão</p>
      </div>
      <div className="space-y-6">
        {data.sort((a, b) => b.sales - a.sales).map((attendant) => (
          <div key={attendant.name} className="flex items-center gap-4">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${attendant.avatarColor || 'bg-slate-700'}`}>
              {attendant.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-slate-200 truncate">{attendant.name}</span>
                <span className="text-xs font-medium text-blue-400">{attendant.conversion}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-1.5 flex-1 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full transition-all duration-1000" 
                    style={{ width: attendant.conversion }} 
                  />
                </div>
                <span className="text-[10px] font-mono text-slate-500 whitespace-nowrap">
                  {attendant.sales} vds / {attendant.leads} leads
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}