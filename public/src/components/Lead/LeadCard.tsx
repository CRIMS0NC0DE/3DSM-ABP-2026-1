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
        return "bg-green-100 text-green-700";
      case "Em andamento":
        return "bg-yellow-100 text-yellow-700";
      case "Fechado":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  }

  return (
    <div className="flex h-full flex-col justify-between rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{name}</h2>
            <p className="text-sm text-slate-500">{interest}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(states)}`}>
            {states}
          </span>
        </div>

        <div className="space-y-3 text-sm text-slate-600">
          <p>
            <span className="font-medium text-slate-800">Email:</span> {email}
          </p>
          <p>
            <span className="font-medium text-slate-800">Telefone:</span> {phone}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <button className="rounded-2xl bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-slate-700">
          Ver detalhes
        </button>
        <button className="rounded-2xl bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-800 transition hover:bg-slate-200">
          Editar
        </button>
        <button className="rounded-2xl bg-red-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-red-700 transition hover:bg-red-200">
          Excluir
        </button>
      </div>
    </div>
  );
}