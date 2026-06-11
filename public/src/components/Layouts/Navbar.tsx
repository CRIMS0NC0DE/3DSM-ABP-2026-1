import type { AuthUser } from "../../types/auth";
import { Link } from "react-router-dom";

interface NavbarProps {
  user: AuthUser | null;
  onLogout: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  return (
    <nav className="flex w-full items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-4 text-white">
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">1000 Valle</p>
        <h1 className="text-lg font-semibold">Dashboard Comercial</h1>
      </div>

      <ul className="hidden gap-6 text-sm font-medium text-slate-300 md:flex">
        <li>
          <Link to="/dashboard" className="transition hover:text-cyan-300">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/leads" className="transition hover:text-cyan-300">
            Leads
          </Link>
        </li>
        {user?.role === "ADMIN" && (
          <li>
            <Link to="/logs" className="transition hover:text-cyan-300">
              Logs
            </Link>
          </li>
        )}
      </ul>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-white">{user?.nome || "Usuario"}</p>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{user?.role || "sem perfil"}</p>
        </div>

        <button
          onClick={onLogout}
          className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-300 hover:text-cyan-200"
        >
          Sair
        </button>
      </div>
    </nav>
  );
}
