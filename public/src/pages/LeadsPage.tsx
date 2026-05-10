import { useState, useMemo } from "react";

import MetricCard from "../components/Dashboard/MetricCard";
import Navbar from "../components/Layouts/Navbar";
import LeadCard from "../components/Lead/LeadCard";
import LeadForm from "../components/Lead/LeadForm";
import Logo from "../assets/logo_1000.svg";
import { useAuth } from "../contexts/AuthContext";

// Definição dos estágios do funil conforme solicitado
export type LeadStatus = 
  | "Novos Leads" 
  | "Primeiro Contato" 
  | "Qualificados" 
  | "Proposta Enviada" 
  | "Negociação" 
  | "Fechado" 
  | "Perdido";

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  interest: string;
  status: LeadStatus;
  company?: string;
  value?: string;
  tags?: string[];
  origin?: string;
  createdAt: string;
  responsible?: string;
}

const initialLeads: Lead[] = [
  {
    id: "1",
    name: "Marcio",
    company: "Fatec",
    phone: "(11) 99999-0001",
    email: "123@bol.com.br",
    interest: "Honda Civic",
    status: "Novos Leads",
    value: "R$ 55.000",
    origin: "Instagram",
    createdAt: "2024-05-10",
    responsible: "Márcio Bueno",
    tags: ["Hot", "Prioridade"],
  },
  {
    id: "2",
    name: "Vini",
    phone: "(11) 99999-0002",
    email: "456@bol.com.br",
    interest: "Toyota Corolla",
    status: "Primeiro Contato",
    value: "R$ 82.000",
    origin: "WhatsApp",
    createdAt: "2024-05-09",
    responsible: "Vinícius Oliveira",
  },
  {
    id: "3",
    name: "Eric",
    phone: "(11) 99999-0003",
    email: "789@bol.com.br",
    interest: "Jeep Compass",
    status: "Negociação",
    value: "R$ 110.000",
    origin: "Site",
    createdAt: "2024-05-08",
    responsible: "Eric França",
    tags: ["Financiamento"],
  },
];

const KANBAN_STAGES: LeadStatus[] = [
  "Novos Leads",
  "Primeiro Contato",
  "Qualificados",
  "Proposta Enviada",
  "Negociação",
  "Fechado",
  "Perdido",
];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const { user, logout } = useAuth();

  const totalLeads = leads.length;
  const newLeads = leads.filter((lead) => lead.status === "Novos Leads").length;
  const inProgressLeads = leads.filter((lead) => 
    !["Novos Leads", "Fechado", "Perdido"].includes(lead.status)
  ).length;
  const closedLeads = leads.filter((lead) => lead.status === "Fechado").length;

  function handleSaveLead(lead: Lead) {
    setLeads((current) => [lead, ...current]);
  }

  // Agrupamento para as colunas do Kanban
  const leadsByStage = useMemo(() => {
    const grouped = {} as Record<LeadStatus, Lead[]>;
    KANBAN_STAGES.forEach(stage => grouped[stage] = []);
    leads.forEach(lead => {
      if (grouped[lead.status]) grouped[lead.status].push(lead);
    });
    return grouped;
  }, [leads]);

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
          <MetricCard title="Funil Ativo" value={inProgressLeads} icon={<span>{inProgressLeads}</span>} color="yellow" />
          <MetricCard title="Fechados" value={closedLeads} icon={<span>{closedLeads}</span>} color="red" />
        </div>

        <div className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-slate-400">CRM de Vendas</p>
            <h1 className="text-2xl font-bold text-slate-900">Pipeline de Leads</h1>
          </div>
          <button
            onClick={() => setShowLeadForm(true)}
            className="rounded-2xl bg-[#b81414] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#9f1313]"
          >
            + Novo Lead
          </button>
        </div>

        {/* Kanban Board Area */}
        <div className="flex flex-1 gap-4 overflow-x-auto pb-4">
          {KANBAN_STAGES.map((stage) => (
            <div key={stage} className="flex min-w-[320px] flex-col gap-3 rounded-[2rem] bg-slate-200/40 p-4">
              <div className="flex items-center justify-between px-2 mb-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">{stage}</h3>
                <span className="rounded-full bg-slate-300/50 px-2.5 py-0.5 text-xs font-bold text-slate-600">
                  {leadsByStage[stage].length}
                </span>
              </div>
              
              <div className="flex flex-col gap-3">
                {leadsByStage[stage].map((lead) => (
                  <LeadCard
                    key={lead.id}
                    name={lead.name}
                    phone={lead.phone}
                    interest={lead.interest}
                    states={lead.status}
                    email={lead.email}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {showLeadForm ? <LeadForm onclose={() => setShowLeadForm(false)} onSave={handleSaveLead} /> : null}
    </div>
  );
}
