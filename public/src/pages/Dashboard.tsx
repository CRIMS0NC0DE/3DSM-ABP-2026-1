import { useState } from "react";

import MetricCard from "../components/Dashboard/MetricCard";
import Navbar from "../components/Layouts/Navbar";
import LeadCard from "../components/Lead/LeadCard";
import LeadForm from "../components/Lead/LeadForm";
import Logo from "../assets/logo_1000.svg";
import { useAuth } from "../contexts/useAuth";

// Importações dos painéis de gerência
import DashboardGerenteLoja from "../components/DashboardGerenteLoja/DashboardGerenteLoja"; 
import DashboardGerenteGeral from "../components/DashboardGerenteGeral/DashboardGerenteGeral";

// Importação do componente de barreira de acesso
import AcessoNegado from "../components/Layouts/DeniedAcess";
import DeniedAccess from "../components/Layouts/DeniedAcess";

type LeadStatus =
  | "Lead Novo"
  | "Em Atendimento"
  | "Em Negociação"
  | "Venda Finalizada"
  | "Perdido";

interface Lead {
  name: string;
  phone: string;
  email: string;
  interest: string;
  status: LeadStatus;
}

const initialLeads: Lead[] = [
  {
    name: "Marcio",
    phone: "(11) 99999-0001",
    email: "123@bol.com.br",
    interest: "Honda Civic",
    status: "Lead Novo",
  },
  {
    name: "Vini",
    phone: "(11) 99999-0002",
    email: "456@bol.com.br",
    interest: "Toyota Corolla",
    status: "Em Negociação",
  },
];

const statusSummary = [
  { label: "Aguardando contato", value: 8, color: "bg-blue-500" },
  { label: "Negócios em aberto", value: 4, color: "bg-amber-500" },
  { label: "Fechados hoje", value: 2, color: "bg-emerald-500" },
];

export default function Homepage() {
  const { user, logout } = useAuth();
  
  // Estados para a visão do Vendedor/Consultor
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [showLeadForm, setShowLeadForm] = useState(false);

  // Mapeamento de permissões por roles
  const isGerente = user?.role === "GERENTE"; 
  const isGerenteGeral = user?.role === "GERENTE_GERAL";
  const isAdmin = user?.role === "ADMIN";

  // Métricas da visão do vendedor
  const totalLeads = leads.length;
  const newLeads = leads.filter((lead) => lead.status === "Lead Novo").length;
  const inProgressLeads = leads.filter((lead) => lead.status === "Em Negociação").length;
  const closedLeads = leads.filter((lead) => lead.status === "Venda Finalizada").length;

  function handleSaveLead(lead: Lead) {
    setLeads((current) => [lead, ...current]);
  }

  // =========================================================
  // INTERCEPÇÃO 1: GERENTE DE LOJA
  // =========================================================
  if (isGerente) {
    return (
      <div className="relative min-h-screen bg-slate-100 text-slate-900">
        <Navbar user={user} onLogout={logout} />
        <main className="relative z-10 p-6">
          <DashboardGerenteLoja />
        </main>
      </div>
    );
  }

  // =========================================================
  // INTERCEPÇÃO 2: GERENTE GERAL OU ADMIN
  // =========================================================
  if (isGerenteGeral || isAdmin) {
    return (
      <div className="relative min-h-screen bg-slate-100 text-slate-900">
        <Navbar user={user} onLogout={logout} />
        <main className="relative z-10">
          <DashboardGerenteGeral />
        </main>
      </div>
    );
  }


  return (
    <div className="relative min-h-screen bg-slate-100 text-slate-900">
  <Navbar user={user} onLogout={logout} />

  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
    <img src={Logo} alt="" className="h-96 w-96 opacity-[0.04]" />
  </div>

  <main className="relative z-10 flex flex-col gap-6 p-6">
    <DeniedAccess />
  </main>
</div>
  );
}