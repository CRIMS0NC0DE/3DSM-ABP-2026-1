import { useMemo, useState, type ReactNode } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import Logo from "../../assets/logo.branco.1000.png";
import { useAuth } from "../../contexts/useAuth";
import { usePermissions } from "../../hooks/usePermissions";
import type { PermissionKey } from "../Collaborators/types";

type SidebarItem = {
  label: string;
  to: string;
  icon: ReactNode;
  permissionKey?: PermissionKey;
};

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M4 4h7v7H4V4Zm9 0h7v11h-7V4ZM4 13h7v7H4v-7Zm9 4h7v3h-7v-3Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M16.75 7.5a3.25 3.25 0 1 1-6.5 0 3.25 3.25 0 0 1 6.5 0Z"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M6.5 19.25a6 6 0 0 1 11 0"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M8.25 9.25a2.75 2.75 0 1 1-5.5 0 2.75 2.75 0 0 1 5.5 0Z"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M2.75 19a5 5 0 0 1 4.5-4.9"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M6 15h12l-1.3-6a2 2 0 0 0-1.96-1.56H9.26A2 2 0 0 0 7.3 9L6 15Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 15.25V18a1.5 1.5 0 0 0 1.5 1.5h.25A1.75 1.75 0 0 0 9 17.75V17h6v.75A1.75 1.75 0 0 0 16.75 19.5H17A1.5 1.5 0 0 0 18.5 18v-2.75"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M8.25 14h.01M15.75 14h.01"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LeadsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M7 7.5h10M7 12h10M7 16.5h6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M12 22a2.25 2.25 0 0 0 2.2-1.7M6.5 9.5a5.5 5.5 0 0 1 11 0c0 6 2 6.5 2 6.5H4.5s2-.5 2-6.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M12 15.25A3.25 3.25 0 1 0 12 8.75a3.25 3.25 0 0 0 0 6.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M19.4 13.1c.05-.36.1-.72.1-1.1 0-.38-.05-.74-.1-1.1l2.02-1.57a.9.9 0 0 0 .22-1.14l-1.92-3.32a.9.9 0 0 0-1.08-.4l-2.38.96a8.34 8.34 0 0 0-1.9-1.1l-.36-2.54A.9.9 0 0 0 12.11 1h-3.8a.9.9 0 0 0-.89.76l-.36 2.54a8.34 8.34 0 0 0-1.9 1.1l-2.38-.96a.9.9 0 0 0-1.08.4L-.2 8.2a.9.9 0 0 0 .22 1.14L2.04 10.9c-.05.36-.1.72-.1 1.1 0 .38.05.74.1 1.1L.02 14.67a.9.9 0 0 0-.22 1.14l1.92 3.32a.9.9 0 0 0 1.08.4l2.38-.96c.6.45 1.23.82 1.9 1.1l.36 2.54a.9.9 0 0 0 .89.76h3.8a.9.9 0 0 0 .89-.76l.36-2.54c.67-.28 1.3-.65 1.9-1.1l2.38.96a.9.9 0 0 0 1.08-.4l1.92-3.32a.9.9 0 0 0-.22-1.14L19.4 13.1Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
function PaymentDetailsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M2 10h20" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M6 15h4M16 15h2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function TransactionsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path d="M7 7h10a3 3 0 0 1 3 3v1" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M17 17H7a3 3 0 0 1-3-3v-1" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M18 9l2 2-2 2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 15l-2-2 2-2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LogsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M6 4h9l5 5v11a1 1 0 0 1-1 1H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path d="M14 4v5h5" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M8 13h8M8 16.5h5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function FinancialIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Z" stroke="currentColor" strokeWidth="1.75" />
      <path d="M12 6v2m0 8v2M9 9.5C9 8.12 10.34 7 12 7s3 1.12 3 2.5c0 1.55-1.5 2.5-3 2.5s-3 .95-3 2.5C9 15.88 10.34 17 12 17s3-1.12 3-2.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function DocumentsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function AgendaIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M10 7V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2v-1"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M3 12h11"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M7 8l-4 4 4 4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const { can } = usePermissions();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const role = user?.role ?? "ATENDENTE";

  const leadsLabel = role === "ATENDENTE" ? "Meus Leads" : "Leads";
  const colabLabel =
    role === "GERENTE" ? "Minha Equipe" :
      role === "GERENTE_GERAL" ? "Gestão de Equipes" :
        "Colaboradores";
  const configLabel =
    role === "ATENDENTE" ? "Meu Perfil" :
      role === "GERENTE" ? "Config. Unidade" :
        "Configurações";
  const reportLabel =
    role === "ATENDENTE" ? "Meu Relatório" :
      role === "GERENTE" ? "Rel. Regional" :
        role === "GERENTE_GERAL" ? "Rel. Consolidado" :
          "Rel. Transações";

  const allItems = useMemo<SidebarItem[]>(
    () => [
      { label: "Dashboard", to: "/dashboard", icon: <DashboardIcon />, permissionKey: "dashboard" },
      { label: "Garagem", to: "/garagem", icon: <CarIcon />, permissionKey: "garagem" },
      { label: leadsLabel, to: "/leads", icon: <LeadsIcon />, permissionKey: "leads" },
      { label: "Agenda", to: "/agenda", icon: <AgendaIcon /> },
      { label: "Documentos", to: "/documentos", icon: <DocumentsIcon /> },
      { label: "Notificações", to: "/notificacoes", icon: <BellIcon />, permissionKey: "notificacoes" },
      { label: colabLabel, to: "/colaboradores", icon: <UsersIcon />, permissionKey: "colaboradores" },
      { label: "Logs", to: "/logs", icon: <LogsIcon />, permissionKey: "logs" },
      { label: configLabel, to: "/configuracoes", icon: <SettingsIcon />, permissionKey: "configuracoes" },
    ],
    [leadsLabel, colabLabel, configLabel],
  );

  const allReportItems = useMemo<SidebarItem[]>(
    () => [
      { label: "Financeiro", to: "/financeiro", icon: <FinancialIcon /> },
      { label: "Det. Pagamento", to: "/detalhes-pagamento", icon: <PaymentDetailsIcon />, permissionKey: "detalhes_pagamento" },
      { label: reportLabel, to: "/relatorio-transacoes", icon: <TransactionsIcon />, permissionKey: "relatorio" },
    ],
    [reportLabel],
  );

  const items = allItems.filter((item) => !item.permissionKey || can(item.permissionKey));
  const reportItems = allReportItems.filter((item) => !item.permissionKey || can(item.permissionKey));

  const containerWidth = isCollapsed ? "w-20" : "w-72";
  const labelClass = isCollapsed ? "sr-only" : "truncate";

  return (
    <aside
      className={[
        "sticky top-0 flex h-screen flex-col border-r border-slate-800/30 bg-gradient-to-b from-slate-950 to-slate-900 text-slate-100",
        "transition-[width] duration-200 ease-out",
        containerWidth,
      ].join(" ")}
      aria-label="Menu lateral"
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <div className="flex items-center px-4 py-5">
        <img
          src={Logo}
          alt="1000 Valle Multimarcas"
          className={[
            "shrink-0 object-contain opacity-95",
            isCollapsed ? "h-10 w-10" : "h-10 w-48",
          ].join(" ")}
        />
      </div>

      <nav className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden space-y-1 px-3">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            title={isCollapsed ? item.label : undefined}
            className={({ isActive }) => {
              const base =
                "group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition";
              const collapsedPadding = isCollapsed ? "justify-center" : "";
              const active = isActive
                ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20"
                : "text-slate-200 hover:bg-white/10 hover:text-white";

              return [base, collapsedPadding, active].join(" ");
            }}
            end
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-slate-100 group-hover:bg-white/10">
              {item.icon}
            </span>
            <span className={labelClass}>{item.label}</span>
          </NavLink>
        ))}

        {/* ── Report section ── */}
        {reportItems.length > 0 && <div className="mt-3 pt-3 border-t border-white/10">
          <p className={isCollapsed ? "sr-only" : "mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400"}>
            Relatórios
          </p>
          <div className="space-y-1">
            {reportItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end
                title={isCollapsed ? item.label : undefined}
                className={({ isActive }) =>
                  [
                    "group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition",
                    isCollapsed ? "justify-center" : "",
                    isActive
                      ? "bg-amber-500 text-white shadow-sm shadow-amber-500/30"
                      : "text-amber-200/80 hover:bg-amber-500/15 hover:text-amber-200",
                  ].join(" ")
                }
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-300 group-hover:bg-amber-500/20">
                  {item.icon}
                </span>
                <span className={labelClass}>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>}

      </nav>

      <div className="border-t border-white/10 p-3">
        <div className={isCollapsed ? "sr-only" : "px-2 pb-3"}>
          <p className="text-xs text-slate-300">Logado como</p>
          <p className="mt-1 truncate text-sm font-semibold text-white">
            {user?.nome || user?.email || "Usuário"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            logout();
            navigate("/login", { replace: true, state: { from: location } });
          }}
          className={[
            "flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-slate-100 transition",
            "bg-white/5 hover:bg-white/10",
            isCollapsed ? "justify-center" : "",
          ].join(" ")}
          title={isCollapsed ? "Sair" : undefined}
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/5">
            <LogoutIcon />
          </span>
          <span className={labelClass}>Sair</span>
        </button>
      </div>
    </aside>
  );
}
