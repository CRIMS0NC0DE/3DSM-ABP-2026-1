import { useEffect, useMemo, useState } from "react";

import Logo from "../assets/logo_1000.svg";
import Navbar from "../components/Layouts/Navbar";
import { formatRelativeTime, normalizeText } from "../components/Collaborators/types";
import { listAuditLogs, type AuditAction, type AuditLogEntry } from "../services/api";
import { getApiErrorMessage } from "../contexts/authState";
import { useAuth } from "../contexts/useAuth";

function cx(...values: Array<string | false | undefined | null>) {
  return values.filter(Boolean).join(" ");
}

// ── Metadados de cada tipo de ação ────────────────────────────────────────────
const ACTION_META: Record<AuditAction, { label: string; badge: string; dot: string }> = {
  lead_created:        { label: "Captação de lead",   badge: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  lead_status_changed: { label: "Mudança de status",  badge: "bg-blue-50 text-blue-700 border-blue-200",          dot: "bg-blue-500" },
  lead_assigned:       { label: "Delegação de lead",  badge: "bg-cyan-50 text-cyan-700 border-cyan-200",          dot: "bg-cyan-500" },
  collaborator_created:{ label: "Novo colaborador",   badge: "bg-violet-50 text-violet-700 border-violet-200",    dot: "bg-violet-500" },
  collaborator_deleted:{ label: "Exclusão de colaborador", badge: "bg-red-50 text-red-700 border-red-200",         dot: "bg-red-600" },
  role_changed:        { label: "Alteração de cargo", badge: "bg-amber-50 text-amber-700 border-amber-200",       dot: "bg-amber-500" },
  permission_changed:  { label: "Alteração de permissão", badge: "bg-rose-50 text-rose-700 border-rose-200",      dot: "bg-rose-500" },
  login:               { label: "Acesso",             badge: "bg-slate-100 text-slate-600 border-slate-200",      dot: "bg-slate-400" },
};

const ACTION_KEYS = Object.keys(ACTION_META) as AuditAction[];

const FALLBACK_META = {
  label: "Ação",
  badge: "bg-slate-100 text-slate-600 border-slate-200",
  dot:   "bg-slate-400",
};

function ActionBadge({ action }: { action: AuditAction }) {
  // Tolera ações desconhecidas (ex.: registros antigos no localStorage)
  const meta = ACTION_META[action] ?? { ...FALLBACK_META, label: action };
  return (
    <span className={cx("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold", meta.badge)}>
      <span className={cx("h-1.5 w-1.5 rounded-full", meta.dot)} />
      {meta.label}
    </span>
  );
}

// ── Tela de acesso bloqueado (defensivo — rota já é protegida) ─────────────────
function AccessBlocked({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-100 p-6">
      <div className="w-full max-w-sm rounded-[2rem] border border-red-200 bg-white p-8 text-center shadow-lg">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
          <svg className="h-7 w-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-red-500">Acesso Restrito</p>
        <h2 className="mt-2 text-xl font-bold text-slate-900">Logs de Auditoria</h2>
        <p className="mt-3 text-sm text-slate-500">
          Apenas o Administrador pode visualizar o registro de atividades do sistema.
        </p>
        <button
          type="button"
          onClick={onLogout}
          className="mt-6 w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Voltar ao login
        </button>
      </div>
    </div>
  );
}

function formatAbsolute(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default function LogsPage() {
  const { token, user, logout } = useAuth();

  // Defesa extra além da PermissionRoute
  const [logs, setLogs]             = useState<AuditLogEntry[]>([]);
  const [loading, setLoading]       = useState(true);
  const [apiError, setApiError]     = useState<string | null>(null);

  const [query, setQuery]           = useState("");
  const [actionFilter, setActionFilter] = useState<AuditAction | "TODAS">("TODAS");
  const [pageSize, setPageSize]     = useState(25);
  const [page, setPage]             = useState(1);

  useEffect(() => {
    if (!token) return;
    void listAuditLogs(token)
      .then(({ logs }) => {
        setLogs(logs);
        setApiError(null);
      })
      .catch((err: unknown) => setApiError(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [token]);

  const filtered = useMemo(() => {
    const q = normalizeText(query);
    return logs.filter((log) => {
      if (actionFilter !== "TODAS" && log.action !== actionFilter) return false;
      if (!q) return true;
      return normalizeText(`${log.actorName} ${log.target} ${log.description}`).includes(q);
    });
  }, [logs, query, actionFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated  = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  // Contadores por tipo de ação
  const counts = useMemo(() => {
    const map: Partial<Record<AuditAction, number>> = {};
    logs.forEach((l) => { map[l.action] = (map[l.action] ?? 0) + 1; });
    return map;
  }, [logs]);

  // Defesa extra além da PermissionRoute (após os hooks, p/ não violar rules-of-hooks)
  if (user && user.role !== "ADMIN") {
    return <AccessBlocked onLogout={logout} />;
  }

  return (
    <div className="relative min-h-screen bg-slate-100 text-slate-900">
      <Navbar user={user} onLogout={logout} />

      {/* Watermark */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <img src={Logo} alt="" className="h-96 w-96 opacity-[0.04]" />
      </div>

      <main className="relative z-10 flex flex-col gap-6 p-6">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <section className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Painel Administrativo</p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">Logs de Auditoria</h1>
              <p className="mt-2 text-sm text-slate-500">
                Registro de todas as ações geradas pelos usuários do sistema.
              </p>

              {/* Contadores por ação */}
              <div className="mt-3 flex flex-wrap gap-3">
                {ACTION_KEYS.filter((k) => counts[k]).map((k) => (
                  <span
                    key={k}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600"
                  >
                    <span className={cx("h-1.5 w-1.5 rounded-full", ACTION_META[k].dot)} />
                    <span className="font-bold text-slate-900">{counts[k]}</span>
                    {ACTION_META[k].label}
                  </span>
                ))}
              </div>
            </div>

            {apiError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {apiError}
              </div>
            )}
          </div>
        </section>

        {/* ── Tabela ─────────────────────────────────────────────────────── */}
        <section>
          <div className="rounded-[2rem] border border-slate-200 bg-white/95 p-5 shadow-sm backdrop-blur">
            {/* Filtros */}
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                  <span className="font-semibold text-slate-700">Itens</span>
                  <select
                    value={pageSize}
                    onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </label>

                <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                  <span className="font-semibold text-slate-700">Ação</span>
                  <select
                    value={actionFilter}
                    onChange={(e) => { setActionFilter(e.target.value as AuditAction | "TODAS"); setPage(1); }}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                  >
                    <option value="TODAS">Todas</option>
                    {ACTION_KEYS.map((k) => (
                      <option key={k} value={k}>{ACTION_META[k].label}</option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="relative w-full max-w-md">
                <span className="sr-only">Buscar</span>
                <input
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                  placeholder="Buscar por usuário, alvo ou descrição..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm text-slate-900 shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                />
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>
              </label>
            </div>

            {/* Tabela */}
            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
              <div className="grid grid-cols-[1.3fr_1fr_1.8fr_1.1fr] bg-slate-50 px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                <span>Usuário</span>
                <span>Ação</span>
                <span>Detalhe</span>
                <span className="text-right">Data / Hora</span>
              </div>

              <div className="divide-y divide-slate-100 bg-white">
                {loading ? (
                  <div className="p-8 text-center text-sm text-slate-500">Carregando logs...</div>
                ) : paginated.length === 0 ? (
                  <div className="p-8 text-center text-sm text-slate-500">Nenhum registro encontrado.</div>
                ) : (
                  paginated.map((log) => (
                    <div
                      key={log.id}
                      className="grid grid-cols-[1.3fr_1fr_1.8fr_1.1fr] items-center gap-3 px-4 py-3.5 text-left text-sm"
                    >
                      {/* Usuário */}
                      <span className="flex min-w-0 items-center gap-2.5">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-[11px] font-bold text-white">
                          {log.actorName.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("")}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate font-semibold text-slate-900">{log.actorName}</span>
                          <span className="block truncate text-xs text-slate-400">{log.actorRole}</span>
                        </span>
                      </span>

                      {/* Ação */}
                      <span><ActionBadge action={log.action} /></span>

                      {/* Detalhe */}
                      <span className="min-w-0 truncate text-slate-600" title={log.description}>
                        {log.description}
                      </span>

                      {/* Quando */}
                      <span className="text-right">
                        <span className="block font-medium text-slate-700">{formatAbsolute(log.createdAt)}</span>
                        <span className="block text-xs text-slate-400">{formatRelativeTime(log.createdAt)}</span>
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Paginação */}
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                Mostrando{" "}
                <strong className="text-slate-900">
                  {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1}
                </strong>{" "}
                –{" "}
                <strong className="text-slate-900">
                  {Math.min(page * pageSize, filtered.length)}
                </strong>{" "}
                de <strong className="text-slate-900">{filtered.length}</strong>
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Anterior
                </button>
                <span className="text-sm font-semibold text-slate-700">
                  {page} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Próximo
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
