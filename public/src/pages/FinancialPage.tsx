import { useMemo, useState } from "react";
import { useFinance } from "../hooks/useFinance";
import type { ApiFinanceEntry } from "../hooks/useFinance";

interface Transaction {
  id: string;
  cliente: string;
  veiculo: string;
  valor: number;
  metodo: string;
  tipo: "Avista" | "Parcelado";
  parcelas: number;
  data: string;
  status: "Concluído" | "Pendente" | "Falhado";
  categoria: "Venda" | "Entrada" | "Comissão" | "Despesa";
}

const STATUS_MAP: Record<ApiFinanceEntry["status"], Transaction["status"]> = {
  paid:      "Concluído",
  pending:   "Pendente",
  overdue:   "Falhado",
  cancelled: "Falhado",
};

const CATEGORY_MAP: Record<string, Transaction["categoria"]> = {
  venda:      "Venda",
  entrada:    "Entrada",
  "comissão": "Comissão",
  comissao:   "Comissão",
  despesa:    "Despesa",
  marketing:  "Despesa",
  "manutenção": "Despesa",
  manutencao: "Despesa",
};

function toTransaction(e: ApiFinanceEntry): Transaction {
  const cat = e.category.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const parts = e.notes?.split(" - ") ?? [];
  return {
    id:       e.id,
    cliente:  parts.length > 1 ? parts[parts.length - 1] : (e.notes ?? e.category),
    veiculo:  parts.length > 1 ? parts.slice(0, -1).join(" - ") : "—",
    valor:    parseFloat(e.amount),
    metodo:   "—",
    tipo:     "Avista",
    parcelas: 1,
    data:     e.dueDate,
    status:   STATUS_MAP[e.status] ?? "Pendente",
    categoria: e.type === "expense"
      ? "Despesa"
      : (CATEGORY_MAP[cat] ?? "Venda"),
  };
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function StatusBadge({ status }: { status: Transaction["status"] }) {
  const styles = {
    Concluído: "bg-emerald-100 text-emerald-700",
    Pendente: "bg-amber-100 text-amber-700",
    Falhado: "bg-rose-100 text-rose-700",
  };
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
}

function CategoriaBadge({ categoria }: { categoria: Transaction["categoria"] }) {
  const styles = {
    Venda: "bg-blue-100 text-blue-700",
    Entrada: "bg-purple-100 text-purple-700",
    Comissão: "bg-orange-100 text-orange-700",
    Despesa: "bg-rose-100 text-rose-700",
  };
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${styles[categoria]}`}>
      {categoria}
    </span>
  );
}

export default function FinancialPage() {
  const { entries, loading } = useFinance();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<Transaction["status"] | "Todos">("Todos");
  const [filterCategoria, setFilterCategoria] = useState<Transaction["categoria"] | "Todos">("Todos");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const transactions = useMemo(() => entries.map(toTransaction), [entries]);

  const filtered = useMemo(() => {
    return transactions
      .filter((t) => {
        const matchSearch =
          t.cliente.toLowerCase().includes(search.toLowerCase()) ||
          t.veiculo.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === "Todos" || t.status === filterStatus;
        const matchCategoria = filterCategoria === "Todos" || t.categoria === filterCategoria;
        const d = new Date(t.data);
        const matchStart = !startDate || d >= new Date(startDate);
        const matchEnd = !endDate || d <= new Date(endDate + "T23:59:59");
        return matchSearch && matchStatus && matchCategoria && matchStart && matchEnd;
      })
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  }, [transactions, search, filterStatus, filterCategoria, startDate, endDate]);

  const totalReceita = filtered.filter((t) => t.status === "Concluído" && t.categoria !== "Despesa").reduce((s, t) => s + t.valor, 0);
  const totalPendente = filtered.filter((t) => t.status === "Pendente").reduce((s, t) => s + t.valor, 0);
  const totalFalhado = filtered.filter((t) => t.status === "Falhado").reduce((s, t) => s + t.valor, 0);
  const concluidos = filtered.filter((t) => t.status === "Concluído");
  const ticketMedio = concluidos.length > 0 ? totalReceita / concluidos.length : 0;

  const MESES_PT = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const currentYear = new Date().getFullYear();
  const monthlyData = useMemo(() => {
    return MESES_PT.map((mes, i) => ({
      mes,
      receita: transactions
        .filter((t) => {
          const d = new Date(t.data);
          return d.getFullYear() === currentYear && d.getMonth() === i
            && t.status === "Concluído" && t.categoria !== "Despesa";
        })
        .reduce((s, t) => s + t.valor, 0),
    }));
  }, [transactions, currentYear]);

  const maxReceita = Math.max(...monthlyData.map((d) => d.receita), 1);

  const categoriaCount: Record<string, number> = {};
  transactions.filter((t) => t.status === "Concluído").forEach((t) => {
    categoriaCount[t.categoria] = (categoriaCount[t.categoria] || 0) + 1;
  });
  const totalConcluidos = transactions.filter((t) => t.status === "Concluído").length;

  const categoriaCores: Record<string, string> = {
    Venda:     "bg-blue-500",
    Entrada:   "bg-purple-500",
    Comissão:  "bg-orange-500",
    Despesa:   "bg-rose-500",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-slate-500 animate-pulse">Carregando financeiro…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6 text-slate-900">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <header className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-slate-400">CRM · Financeiro</p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">Painel Financeiro</h1>
              <p className="mt-2 text-sm text-slate-500">
                Acompanhe receitas, transações e desempenho financeiro da concessionária.
              </p>
            </div>
          </div>
        </header>

        {/* KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Receita Confirmada</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">{formatCurrency(totalReceita)}</p>
            <p className="mt-1 text-xs text-emerald-600 font-medium">● Transações concluídas</p>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Ticket Médio</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">{formatCurrency(ticketMedio)}</p>
            <p className="mt-1 text-xs text-blue-600 font-medium">● Por venda concluída</p>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Pendente</p>
            <p className="mt-3 text-3xl font-bold text-amber-600">{formatCurrency(totalPendente)}</p>
            <p className="mt-1 text-xs text-amber-600 font-medium">● Aguardando confirmação</p>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Falhado</p>
            <p className="mt-3 text-3xl font-bold text-rose-600">{formatCurrency(totalFalhado)}</p>
            <p className="mt-1 text-xs text-rose-600 font-medium">● Transações falhadas</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
          {/* Revenue Bar Chart */}
          <div className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm backdrop-blur">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Receita Mensal</p>
              <h2 className="mt-1 text-lg font-bold text-slate-900">Fluxo de Receita — 2026</h2>
            </div>
            <div className="flex h-44 items-end gap-3">
              {monthlyData.map((d) => {
                const pct = d.receita > 0 ? (d.receita / maxReceita) * 100 : 0;
                return (
                  <div key={d.mes} className="group relative flex flex-1 flex-col items-center gap-1">
                    {d.receita > 0 && (
                      <div className="absolute -top-8 hidden rounded-xl bg-slate-800 px-2 py-1 text-[10px] font-semibold text-white group-hover:block whitespace-nowrap">
                        {formatCurrency(d.receita)}
                      </div>
                    )}
                    <div
                      style={{ height: pct > 0 ? `${pct}%` : "8px" }}
                      className={`w-full rounded-t-xl transition-all duration-300 ${
                        d.receita === 0
                          ? "bg-slate-100 border border-dashed border-slate-300"
                          : "bg-blue-500 group-hover:bg-blue-400"
                      }`}
                    />
                    <span className="text-[11px] font-semibold text-slate-500 mt-1">{d.mes}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm backdrop-blur">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Categorias</p>
              <h2 className="mt-1 text-lg font-bold text-slate-900">Distribuição</h2>
            </div>
            <div className="space-y-3">
              {Object.entries(categoriaCount).map(([cat, count]) => {
                const pct = totalConcluidos > 0 ? Math.round((count / totalConcluidos) * 100) : 0;
                return (
                  <div key={cat}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-700">{cat}</span>
                      <span className="text-sm font-semibold text-slate-900">{pct}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100">
                      <div
                        style={{ width: `${pct}%` }}
                        className={`h-2 rounded-full transition-all duration-500 ${categoriaCores[cat] ?? "bg-slate-400"}`}
                      />
                    </div>
                  </div>
                );
              })}
              {Object.keys(categoriaCount).length === 0 && (
                <p className="text-sm text-slate-400 py-4 text-center">Sem dados disponíveis.</p>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        <section className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm backdrop-blur">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Filtros</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <label className="block xl:col-span-2">
              <span className="text-sm font-semibold text-slate-600">Pesquisar</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Descrição ou categoria..."
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-600">Status</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as Transaction["status"] | "Todos")}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="Todos">Todos</option>
                <option value="Concluído">Concluído</option>
                <option value="Pendente">Pendente</option>
                <option value="Falhado">Falhado</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-600">De</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-600">Até</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </label>
          </div>
        </section>

        {/* Transaction Table */}
        <section className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm backdrop-blur">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
              Transações · <span className="text-slate-700">{filtered.length}</span>
            </p>
            <p className="text-sm font-semibold text-slate-700">
              Total: <span className="text-slate-900 font-bold">{formatCurrency(filtered.reduce((s, t) => s + t.valor, 0))}</span>
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-slate-600">
                  <th className="px-4 py-3 font-semibold">Descrição</th>
                  <th className="px-4 py-3 font-semibold">Valor</th>
                  <th className="px-4 py-3 font-semibold">Vencimento</th>
                  <th className="px-4 py-3 font-semibold">Categoria</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length > 0 ? (
                  filtered.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-4 font-medium text-slate-900">{t.cliente}</td>
                      <td className="whitespace-nowrap px-4 py-4 font-semibold text-slate-900">{formatCurrency(t.valor)}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-slate-500">{formatDate(t.data)}</td>
                      <td className="whitespace-nowrap px-4 py-4"><CategoriaBadge categoria={t.categoria} /></td>
                      <td className="whitespace-nowrap px-4 py-4"><StatusBadge status={t.status} /></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-slate-400">
                      Nenhum lançamento encontrado para os filtros aplicados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
}
