import { useMemo, useState } from "react";

interface PaymentDetail {
  id: number;
  cliente: string;
  valor: number;
  metodo: "Crédito" | "Débito" | "Consignado" | "Pix";
  tipo: "Avista" | "Parcelado";
  parcelas: number;
  data: string; // ISO
  status: "Concluído" | "Pendente" | "Falhado";
}

// TODO: Remover mocks e integrar com o backend real quando a API estiver disponível
const paymentsMock: PaymentDetail[] = [
  {
    id: 1,
    cliente: "Marcio Silva",
    valor: 52990,
    metodo: "Crédito",
    tipo: "Parcelado",
    parcelas: 12,
    data: "2026-04-11T14:35:00Z",
    status: "Concluído",
  },
  {
    id: 2,
    cliente: "Vanessa Souza",
    valor: 39990,
    metodo: "Débito",
    tipo: "Avista",
    parcelas: 1,
    data: "2026-04-10T10:15:00Z",
    status: "Concluído",
  },
  {
    id: 3,
    cliente: "Carlos Pereira",
    valor: 23990,
    metodo: "Pix",
    tipo: "Avista",
    parcelas: 1,
    data: "2026-04-09T18:45:00Z",
    status: "Pendente",
  },
  {
    id: 4,
    cliente: "Letícia Andrade",
    valor: 84990,
    metodo: "Consignado",
    tipo: "Parcelado",
    parcelas: 24,
    data: "2026-04-07T12:05:00Z",
    status: "Concluído",
  },
  {
    id: 5,
    cliente: "André Lima",
    valor: 12990,
    metodo: "Crédito",
    tipo: "Avista",
    parcelas: 1,
    data: "2026-04-06T16:25:00Z",
    status: "Falhado",
  },
  {
    id: 6,
    cliente: "Ana Carolina",
    valor: 67290,
    metodo: "Pix",
    tipo: "Parcelado",
    parcelas: 6,
    data: "2026-04-04T09:50:00Z",
    status: "Concluído",
  },
];

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function PaymentDetailsPage() {
  const [search, setSearch] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentDetail["metodo"] | "Todos">("Todos");
  const [paymentType, setPaymentType] = useState<PaymentDetail["tipo"] | "Todos">("Todos");
  const [installments, setInstallments] = useState<number | "Todos">("Todos");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const filteredPayments = useMemo(() => {
    return paymentsMock
      .filter((payment) => {
        const matchesSearch =
          payment.cliente.toLowerCase().includes(search.toLowerCase()) ||
          payment.metodo.toLowerCase().includes(search.toLowerCase());

        const matchesMethod = paymentMethod === "Todos" || payment.metodo === paymentMethod;
        const matchesType = paymentType === "Todos" || payment.tipo === paymentType;
        const matchesInstallments = installments === "Todos" || payment.parcelas === installments;

        const paymentDate = new Date(payment.data);
        const matchesStart = !startDate || paymentDate >= new Date(startDate);
        const matchesEnd = !endDate || paymentDate <= new Date(endDate + "T23:59:59");

        return matchesSearch && matchesMethod && matchesType && matchesInstallments && matchesStart && matchesEnd;
      })
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  }, [search, paymentMethod, paymentType, installments, startDate, endDate]);

  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.valor, 0);

  return (
    <div className="min-h-screen bg-slate-100 p-6 text-slate-900">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Pagamentos</p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">Detalhes de pagamentos</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                Filtre por tipo, método, data e número de parcelas para encontrar a transação desejada.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl bg-slate-50 px-5 py-4 text-sm text-slate-700 shadow-sm">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Transações</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{filteredPayments.length}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 px-5 py-4 text-sm text-slate-700 shadow-sm">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Valor total</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{formatCurrency(totalAmount)}</p>
              </div>
            </div>
          </div>
        </header>

        <section className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm backdrop-blur">
          <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <label className="block">
                <span className="text-sm font-semibold text-slate-600">Pesquisar</span>
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Cliente ou método"
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-600">Método</span>
                <select
                  value={paymentMethod}
                  onChange={(event) => setPaymentMethod(event.target.value as PaymentDetail["metodo"] | "Todos")}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="Todos">Todos</option>
                  <option value="Crédito">Crédito</option>
                  <option value="Débito">Débito</option>
                  <option value="Consignado">Consignado</option>
                  <option value="Pix">Pix</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-600">Tipo</span>
                <select
                  value={paymentType}
                  onChange={(event) => setPaymentType(event.target.value as PaymentDetail["tipo"] | "Todos")}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="Todos">Todos</option>
                  <option value="Avista">À vista</option>
                  <option value="Parcelado">Parcelado</option>
                </select>
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <label className="block">
                <span className="text-sm font-semibold text-slate-600">Parcelas</span>
                <select
                  value={installments}
                  onChange={(event) => {
                    const value = event.target.value;
                    setInstallments(value === "Todos" ? "Todos" : Number(value));
                  }}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="Todos">Todos</option>
                  <option value={1}>1x</option>
                  <option value={6}>6x</option>
                  <option value={12}>12x</option>
                  <option value={24}>24x</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-600">Data inicial</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-600">Data final</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </label>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm backdrop-blur">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-slate-700">
                  <th className="px-4 py-3 font-semibold">Cliente</th>
                  <th className="px-4 py-3 font-semibold">Valor</th>
                  <th className="px-4 py-3 font-semibold">Método</th>
                  <th className="px-4 py-3 font-semibold">Tipo</th>
                  <th className="px-4 py-3 font-semibold">Parcelas</th>
                  <th className="px-4 py-3 font-semibold">Data</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-slate-50">
                      <td className="whitespace-nowrap px-4 py-4 text-slate-900">{payment.cliente}</td>
                      <td className="whitespace-nowrap px-4 py-4 font-semibold text-slate-900">{formatCurrency(payment.valor)}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-slate-600">{payment.metodo}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-slate-600">{payment.tipo}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-slate-600">{payment.parcelas}x</td>
                      <td className="whitespace-nowrap px-4 py-4 text-slate-600">{formatDate(payment.data)}</td>
                      <td className="whitespace-nowrap px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            payment.status === "Concluído"
                              ? "bg-emerald-100 text-emerald-700"
                              : payment.status === "Pendente"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                      Nenhuma transação encontrada para os filtros aplicados.
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

