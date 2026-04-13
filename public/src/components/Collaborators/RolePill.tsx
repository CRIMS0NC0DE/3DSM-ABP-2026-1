import type { UserRole } from "../../types/auth";

function classNames(...values: Array<string | false | undefined | null>) {
  return values.filter(Boolean).join(" ");
}

export default function RolePill({ role }: { role: UserRole }) {
  const labelMap: Record<UserRole, string> = {
    ADMINISTRADOR: "Administrador",
    GERENTE_GERAL: "Gerente geral",
    GERENTE: "Gerente",
    ATENDENTE: "Atendente",
    USUARIO: "Usuário",
  };

  const colorMap: Record<UserRole, string> = {
    ADMINISTRADOR: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    GERENTE_GERAL: "bg-blue-50 text-blue-700 ring-blue-200",
    GERENTE: "bg-sky-50 text-sky-700 ring-sky-200",
    ATENDENTE: "bg-amber-50 text-amber-700 ring-amber-200",
    USUARIO: "bg-slate-50 text-slate-700 ring-slate-200",
  };

  return (
    <span className={classNames("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1", colorMap[role])}>
      {labelMap[role]}
    </span>
  );
}

