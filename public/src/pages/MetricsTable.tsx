import type { TransactionData } from "./index";

export default function MetricsTable({ transactions }: { transactions: TransactionData[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 shadow-sm">
      <div className="bg-slate-800/30 px-6 py-4 border-b border-slate-800">
        <h2 className="font-bold text-slate-100">Transações Recentes</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-800/20 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-6 py-3 font-semibold">Cliente</th>
              <th className="px-6 py-3 font-semibold text-center">Status</th>
              <th className="px-6 py-3 font-semibold">Data</th>
              <th className="px-6 py-3 font-semibold text-right">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {transactions.map((t) => (
              <tr key={t.id} className="transition hover:bg-white/5">
                <td className="px-6 py-4 font-medium text-slate-200">{t.customer}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    t.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' :
                    t.status === 'Pending' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'
                  }`}>
                    {t.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-400">{t.date}</td>
                <td className="px-6 py-4 text-right font-bold text-slate-200">{t.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}