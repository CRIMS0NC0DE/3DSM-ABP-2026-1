import { useState } from "react";

import MetricCard from "../components/Dashboard/MetricCard";
import Navbar from "../components/Layouts/Navbar";
import LeadCard from "../components/Lead/LeadCard";
import LeadForm from "../components/Lead/LeadForm";
import Logo from "../assets/logo_1000.svg";
import { useAuth } from "../contexts/AuthContext";

export default function Homepage() {
  const [showLeadForm, setShowLeadForm] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="relative min-h-screen bg-slate-100">
      <Navbar user={user} onLogout={logout} />

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <img src={Logo} alt="" className="h-96 w-96 opacity-[0.04]" />
      </div>

      <main className="relative z-10 flex flex-col gap-4 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard title="Total de Leads" value={150} icon={<span>150</span>} color="blue" />
          <MetricCard title="Leads Novos" value={30} icon={<span>30</span>} color="green" />
          <MetricCard title="Em Andamento" value={60} icon={<span>60</span>} color="yellow" />
          <MetricCard title="Fechados" value={60} icon={<span>60</span>} color="red" />
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Painel autenticado</p>
              <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
            </div>

            <button
              onClick={() => setShowLeadForm(true)}
              className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              Adicionar Lead
            </button>
          </div>

          <p className="mt-3 text-sm text-slate-500">
            Sessao ativa para <strong>{user?.nome}</strong> com perfil <strong>{user?.role}</strong>.
          </p>
        </section>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <LeadCard
            name="Marcio"
            phone="(11) 99999-0001"
            interest="Honda Civic"
            states="Novo"
            email="123@bol.com.br"
          />
          <LeadCard
            name="Vini"
            phone="(11) 99999-0002"
            interest="Toyota Corolla"
            states="Em andamento"
            email="456@bol.com.br"
          />
          <LeadCard
            name="Eric"
            phone="(11) 99999-0003"
            interest="Jeep Compass"
            states="Fechado"
            email="789@bol.com.br"
          />
        </div>
      </main>

      {showLeadForm ? <LeadForm onclose={() => setShowLeadForm(false)} /> : null}
    </div>
  );
}

