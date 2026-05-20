import Navbar from "../components/Layouts/Navbar";
import Logo from "../assets/logo_1000.svg";
import { useAuth } from "../contexts/useAuth";

import DashboardGerenteLoja from "../components/DashboardGerenteLoja/DashboardGerenteLoja";
import DashboardGerenteGeral from "../components/DashboardGerenteGeral/DashboardGerenteGeral";
import DeniedAccess from "../components/Layouts/DeniedAcess";

export default function Homepage() {
  const { user, logout } = useAuth();

  const isGerente = user?.role === "GERENTE";
  const isGerenteGeral = user?.role === "GERENTE_GERAL";
  const isAdmin = user?.role === "ADMIN";

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