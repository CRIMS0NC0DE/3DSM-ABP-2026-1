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

export default function LeadsPage() {
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

      <main className="relative z-10 flex flex-col gap-4 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard title="Total de Leads" value={totalLeads} icon={<span>{totalLeads}</span>} color="blue" />
          <MetricCard title="Leads Novos" value={newLeads} icon={<span>{newLeads}</span>} color="green" />
          <MetricCard title="Em andamento" value={inProgressLeads} icon={<span>{inProgressLeads}</span>} color="yellow" />
          <MetricCard title="Fechados" value={closedLeads} icon={<span>{closedLeads}</span>} color="red" />
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Painel de leads</p>
              <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
            </div>

            <button
              onClick={() => setShowLeadForm(true)}
              className="rounded-2xl bg-[#b81414] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#9f1313]"
            >
              Adicionar Lead
            </button>
          </div>

          <p className="mt-3 text-sm text-slate-500">
            Sessão ativa para <strong>{user?.nome || "usuário"}</strong> com perfil <strong>{user?.role || "padrão"}</strong>.
          </p>
        </section>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {leads.length > 0 ? (
            leads.map((lead, index) => (
              <LeadCard
                key={`${lead.email}-${index}`}
                name={lead.name}
                phone={lead.phone}
                interest={lead.interest}
                states={lead.status}
                email={lead.email}
              />
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white/80 p-8 text-center text-slate-500 shadow-sm">
              Nenhum lead cadastrado ainda. Clique em adicionar para criar o primeiro lead.
            </div>
          )}
        </div>
      </main>

      {showLeadForm ? <LeadForm onclose={() => setShowLeadForm(false)} onSave={handleSaveLead} /> : null}
    </div>
  );
}

