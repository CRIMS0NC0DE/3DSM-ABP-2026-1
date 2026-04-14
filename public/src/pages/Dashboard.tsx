import { useState } from "react";

import MetricCard from "../components/Dashboard/MetricCard";
import Navbar from "../components/Layouts/Navbar";
import LeadCard from "../components/Lead/LeadCard";
import LeadForm from "../components/Lead/LeadForm";
import Logo from "../assets/logo_1000.svg";
import { useAuth } from "../contexts/AuthContext";

interface Lead {
  name: string;
  phone: string;
  email: string;
  interest: string;
  status: "Novo" | "Em andamento" | "Fechado";
}

const initialLeads: Lead[] = [
  {
    name: "Marcio",
    phone: "(11) 99999-0001",
    email: "123@bol.com.br",
    interest: "Honda Civic",
    status: "Novo",
  },
  {
    name: "Vini",
    phone: "(11) 99999-0002",
    email: "456@bol.com.br",
    interest: "Toyota Corolla",
    status: "Em andamento",
  },
  {
    name: "Eric",
    phone: "(11) 99999-0003",
    email: "789@bol.com.br",
    interest: "Jeep Compass",
    status: "Fechado",
  },
];

const statusSummary = [
  { label: "Aguardando contato", value: 8, color: "bg-blue-500" },
  { label: "Negócios em aberto", value: 4, color: "bg-amber-500" },
  { label: "Fechados hoje", value: 2, color: "bg-emerald-500" },
];

export default function Homepage() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const { user, logout } = useAuth();

  const totalLeads = leads.length;
  const newLeads = leads.filter((lead) => lead.status === "Novo").length;
  const inProgressLeads = leads.filter((lead) => lead.status === "Em andamento").length;
  const closedLeads = leads.filter((lead) => lead.status === "Fechado").length;

  function handleSaveLead(lead: Lead) {
    setLeads((current) => [lead, ...current]);
  }

  return (
    <div className="relative min-h-screen bg-slate-100 text-slate-900">
      <Navbar user={user} onLogout={logout} />

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <img src={Logo} alt="" className="h-96 w-96 opacity-[0.04]" />
      </div>

      <main className="relative z-10 flex flex-col gap-6 p-6">
        <section className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-mono text-sm uppercase tracking-[0.22em] text-slate-400">Dashboard</p>              <h1 className="mt-2 text-3xl font-bold text-slate-900">Bem-vindo, {user?.nome || "usuário"}</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                Visão geral rápida do seu desempenho comercial. Use a sidebar para navegar entre as áreas do sistema.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-700 shadow-sm">
                Último login: <span className="font-semibold text-slate-900">Hoje</span>
              </div>
              <button
                type="button"
                onClick={() => setShowLeadForm(true)}
                className="inline-flex items-center justify-center rounded-3xl bg-[#b81414] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#9f1313]"
              >
                Adicionar lead
              </button>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <MetricCard title="Total de Leads" value={totalLeads} icon={<span>{totalLeads}</span>} color="blue" />
            <MetricCard title="Leads Novos" value={newLeads} icon={<span>{newLeads}</span>} color="green" />
            <MetricCard title="Em andamento" value={inProgressLeads} icon={<span>{inProgressLeads}</span>} color="yellow" />
            <MetricCard title="Fechados" value={closedLeads} icon={<span>{closedLeads}</span>} color="red" />
          </div>

          <section className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm backdrop-blur">
            <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Resumo</p>
            <h2 className="mt-3 text-xl font-semibold text-slate-900">Status da semana</h2>
            <div className="mt-5 grid gap-3">
              {statusSummary.map((item) => (
                <div key={item.label} className="rounded-3xl bg-slate-50 p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                      <p className="mt-1 text-sm text-slate-500">Trend atual</p>
                    </div>
                    <span className={`${item.color} inline-flex h-10 min-w-[2.5rem] items-center justify-center rounded-3xl text-sm font-semibold text-white`}>
                      {item.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.6fr_1fr]">
          <section className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm backdrop-blur">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Leads recentes</p>
                <h2 className="text-2xl font-semibold text-slate-900">Acompanhe os principais contatos</h2>
              </div>
              <p className="text-sm text-slate-500">Os últimos cadastros estão listados abaixo.</p>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {leads.slice(0, 3).map((lead, index) => (
                <LeadCard
                  key={`${lead.email}-${index}`}
                  name={lead.name}
                  phone={lead.phone}
                  interest={lead.interest}
                  states={lead.status}
                  email={lead.email}
                />
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm backdrop-blur">
            <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Visão rápida</p>
            <div className="mt-6 space-y-4">
              <div className="rounded-3xl bg-slate-50 p-4 shadow-sm">
                <p className="text-sm text-slate-500">Tarefas pendentes</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">5</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4 shadow-sm">
                <p className="text-sm text-slate-500">Novos clientes</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">3</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4 shadow-sm">
                <p className="text-sm text-slate-500">Progresso da meta</p>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full w-[70%] rounded-full bg-emerald-500" />
                </div>
                <p className="mt-2 text-sm text-slate-500">70% da meta mensal atingida</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {showLeadForm ? <LeadForm onclose={() => setShowLeadForm(false)} onSave={handleSaveLead} /> : null}
    </div>
  );
}

