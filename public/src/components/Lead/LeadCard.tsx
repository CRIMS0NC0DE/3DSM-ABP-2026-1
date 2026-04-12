interface LeadProps {
  name: string;
  email: string;
  interest: string;
  phone: string;
  states: "Novo" | "Em andamento" | "Fechado";
}

export default function LeadCard({ name, email, interest, phone, states }: LeadProps) {
  function getStatusColor(status: string) {
    switch (status) {
      case "Novo":
        return "before:bg-emerald-500 text-slate-700";
      case "Em andamento":
        return "before:bg-amber-500 text-slate-700";
      case "Fechado":
        return "before:bg-rose-500 text-slate-700";
      default:
        return "before:bg-slate-400 text-slate-700";
    }
  }

  return (
    <div className="flex h-full flex-col justify-between rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div>
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{name}</h2>
            <p className="mt-1 text-sm text-slate-500">{interest}</p>
          </div>
          <span
            className={`inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${getStatusColor(states)}`}
          >
            <span className="h-2.5 w-2.5 rounded-full" />
            {states}
          </span>
        </div>

        <div className="space-y-3 border-t border-slate-200 pt-4 text-sm text-slate-600">
          <p>
            <span className="font-medium text-slate-800">Email:</span> {email}
          </p>
          <p>
            <span className="font-medium text-slate-800">Telefone:</span> {phone}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <button className="rounded-2xl bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-slate-800">
          Ver detalhes
        </button>
        <button className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-800 transition hover:bg-slate-100">
          Editar
        </button>
        <button className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-rose-700 transition hover:bg-rose-50">
          Excluir
        </button>
      </div>
    </div>
  );
}