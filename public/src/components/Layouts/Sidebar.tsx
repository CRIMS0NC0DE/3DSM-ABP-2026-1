import { useEffect, useMemo, useState, type ReactNode } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import Logo from "../../assets/logo.branco.1000.png";
import { useAuth } from "../../contexts/AuthContext";

type SidebarItem = {
  label: string;
  to: string;
  icon: ReactNode;
};

const SIDEBAR_STORAGE_KEY = "crm-sidebar-collapsed";

function readCollapsedPreference(): boolean {
  const raw = localStorage.getItem(SIDEBAR_STORAGE_KEY);
  if (!raw) return false;
  return raw === "true";
}

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
      <path
        d="M7 4h10a2 2 0 0 1 2 2v14H5V6a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M8 8h8M8 12h8M8 16h5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TransactionsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M7 7h10a3 3 0 0 1 3 3v1"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M17 17H7a3 3 0 0 1-3-3v-1"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M18 9l2 2-2 2"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 15l-2-2 2-2"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CollapseIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M4 12h16"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d={collapsed ? "M10 8l-4 4 4 4" : "M14 8l4 4-4 4"}
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
  const [isCollapsed, setIsCollapsed] = useState(readCollapsedPreference);

  useEffect(() => {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, String(isCollapsed));
  }, [isCollapsed]);

  const items = useMemo<SidebarItem[]>(
    () => [
      { label: "Dashboard", to: "/", icon: <DashboardIcon /> },
      { label: "Garagem", to: "/garagem", icon: <CarIcon /> },
      { label: "Leads", to: "/leads", icon: <LeadsIcon /> },
      { label: "Notificações", to: "/notificacoes", icon: <BellIcon /> },
      { label: "Configurações", to: "/configuracoes", icon: <SettingsIcon /> },
    ],
    [],
  );

  const reportItems = useMemo<SidebarItem[]>(
    () => [
      { label: "Detalhes pagamento", to: "/detalhes-pagamento", icon: <PaymentDetailsIcon /> },
      { label: "Transações", to: "/transacoes", icon: <TransactionsIcon /> },
    ],
    [],
  );

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
    >
      <div className="flex items-center justify-between gap-3 px-4 py-5">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src={Logo}
            alt="1000 Valle Multimarcas"
            className={[
              "shrink-0 object-contain opacity-95",
              isCollapsed ? "h-10 w-10" : "h-10 w-48",
            ].join(" ")}
          />
        </div>

        <button
          type="button"
          onClick={() => setIsCollapsed((value) => !value)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-200 transition hover:bg-white/10"
          aria-label={isCollapsed ? "Expandir menu" : "Recolher menu"}
          title={isCollapsed ? "Expandir" : "Recolher"}
        >
          <CollapseIcon collapsed={isCollapsed} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3">
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
            end={item.to === "/"}
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-slate-100 group-hover:bg-white/10">
              {item.icon}
            </span>
            <span className={labelClass}>{item.label}</span>
          </NavLink>
        ))}

        <div className="mt-4 border-t border-white/10 pt-4">
          <p className={isCollapsed ? "sr-only" : "px-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400"}>
            Report
          </p>

          <div className="mt-2 space-y-1">
            {reportItems.map((item) => (
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
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-slate-100 group-hover:bg-white/10">
                  {item.icon}
                </span>
                <span className={labelClass}>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
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
