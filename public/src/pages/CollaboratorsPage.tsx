import { useEffect, useMemo, useState, type KeyboardEvent } from "react";

import NewCollaboratorModal from "../components/Collaborators/NewCollaboratorModal";
import RolePill from "../components/Collaborators/RolePill";
import Switch from "../components/Collaborators/Switch";
import {
  ASSIGNABLE_ROLES,
  buildDefaultPermissoes,
  COLLABORATORS_STORAGE_KEY,
  filterCollaboratorsForViewer,
  formatRelativeTime,
  MODULES,
  normalizeText,
  ROLE_LABELS,
  safeReadStoredCollaborators,
  TEAMS,
  type Collaborator,
} from "../components/Collaborators/types";
import Logo from "../assets/logo_1000.svg";
import Navbar from "../components/Layouts/Navbar";
import {
  createCollaborator,
  listCollaborators,
  updateCollaborator as updateCollaboratorRequest,
} from "../services/api";
import { getApiErrorMessage } from "../contexts/authState";
import { useAuth } from "../contexts/useAuth";
import type { UserRole } from "../types/auth";

function cx(...values: Array<string | false | undefined | null>) {
  return values.filter(Boolean).join(" ");
}

function createDraft(c: Collaborator): Collaborator {
  return { ...c, permissoes: { ...c.permissoes } };
}

// ── Access blocked screen ────────────────────────────────────────────────────
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
        <h2 className="mt-2 text-xl font-bold text-slate-900">Área Administrativa</h2>
        <p className="mt-3 text-sm text-slate-500">
          Seu perfil não tem permissão para acessar o painel de colaboradores. Entre em contato com um Administrador.
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

// ── Inline role select ────────────────────────────────────────────────────────
function RoleSelect({
  current,
  viewerRole,
  disabled,
  onChange,
}: {
  current: UserRole;
  viewerRole: UserRole;
  disabled: boolean;
  onChange: (role: UserRole) => void;
}) {
  const options = ASSIGNABLE_ROLES[viewerRole] ?? [];

  if (options.length <= 1) {
    return <RolePill role={current} />;
  }

  return (
    <select
      value={current}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value as UserRole)}
      onClick={(e) => e.stopPropagation()}
      className="rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-700 shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-50"
    >
      {options.map((r) => (
        <option key={r} value={r}>{ROLE_LABELS[r]}</option>
      ))}
    </select>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function CollaboratorsPage() {
  const { token, user, logout } = useAuth();

  // ATENDENTE is blocked
  if (user?.role === "ATENDENTE") {
    return <AccessBlocked onLogout={logout} />;
  }

  const viewerRole   = user?.role   ?? "ATENDENTE";
  const viewerTeamId = user?.teamId ?? null;
  const canCreate    = viewerRole !== "ATENDENTE";

  const [allCollaborators, setAllCollaborators] = useState<Collaborator[]>(() =>
    safeReadStoredCollaborators(),
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft]           = useState<Collaborator | null>(null);
  const [activeTab, setActiveTab]   = useState<"info" | "permissoes">("permissoes");

  const [query, setQuery]           = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "TODOS">("TODOS");
  const [pageSize, setPageSize]     = useState(25);
  const [page, setPage]             = useState(1);
  const [isNewOpen, setIsNewOpen]   = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [apiError, setApiError]     = useState<string | null>(null);
  const [saving, setSaving]         = useState<string | null>(null); // id of row being saved

  // Persist to localStorage whenever allCollaborators changes
  useEffect(() => {
    localStorage.setItem(COLLABORATORS_STORAGE_KEY, JSON.stringify(allCollaborators));
  }, [allCollaborators]);

  // Load from API on mount
  useEffect(() => {
    if (!token) return;
    void listCollaborators(token)
      .then(({ collaborators }) => {
        setAllCollaborators(collaborators);
        setApiError(null);
      })
      .catch((err: unknown) => setApiError(getApiErrorMessage(err)));
  }, [token]);

  // RBAC filter — what this viewer can see
  const visibleCollaborators = useMemo(
    () => filterCollaboratorsForViewer(allCollaborators, viewerRole, viewerTeamId),
    [allCollaborators, viewerRole, viewerTeamId],
  );

  // Role filter options available to this viewer
  const availableRoleFilters = useMemo<Array<UserRole | "TODOS">>(() => {
    if (viewerRole === "ADMIN")         return ["TODOS", "ADMIN", "GERENTE_GERAL", "GERENTE", "ATENDENTE"];
    if (viewerRole === "GERENTE_GERAL") return ["TODOS", "GERENTE", "ATENDENTE"];
    return ["TODOS", "ATENDENTE"];
  }, [viewerRole]);

  const filtered = useMemo(() => {
    const q = normalizeText(query);
    return visibleCollaborators.filter((c) => {
      if (roleFilter !== "TODOS" && c.role !== roleFilter) return false;
      if (!q) return true;
      return normalizeText(`${c.nome} ${c.email} ${c.teamName ?? ""}`).includes(q);
    });
  }, [visibleCollaborators, query, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated  = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const selected = useMemo(
    () => (selectedId ? allCollaborators.find((c) => c.id === selectedId) ?? null : null),
    [allCollaborators, selectedId],
  );

  // ── Persist helper ────────────────────────────────────────────────────────
  async function persistCollaborator(next: Collaborator) {
    setAllCollaborators((prev) => prev.map((c) => (c.id === next.id ? next : c)));
    setDraft((d) => (d?.id === next.id ? createDraft(next) : d));
    if (!token) return;
    setSaving(next.id);
    try {
      const { collaborator: saved } = await updateCollaboratorRequest(token, next.id, {
        nome:       next.nome,
        telefone:   next.telefone,
        role:       next.role,
        ativo:      next.ativo,
        permissoes: next.permissoes,
        teamId:     next.teamId,
        teamName:   next.teamName,
      });
      setAllCollaborators((prev) => prev.map((c) => (c.id === saved.id ? saved : c)));
      setDraft((d) => (d?.id === saved.id ? createDraft(saved) : d));
      setApiError(null);
    } catch (err: unknown) {
      setApiError(getApiErrorMessage(err));
    } finally {
      setSaving(null);
    }
  }

  function updateField(id: string, updater: (c: Collaborator) => Collaborator) {
    const current = allCollaborators.find((c) => c.id === id);
    if (!current) return;
    void persistCollaborator(updater(current));
  }

  function selectRow(c: Collaborator) {
    setSelectedId(c.id);
    setDraft(createDraft(c));
    setActiveTab("permissoes");
    setSuccessMsg(null);
  }

  function handleRowKeyDown(e: KeyboardEvent<HTMLDivElement>, c: Collaborator) {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    selectRow(c);
  }

  // Counts for header stats
  const counts = useMemo(() => {
    const map: Partial<Record<UserRole, number>> = {};
    visibleCollaborators.forEach((c) => { map[c.role] = (map[c.role] ?? 0) + 1; });
    return map;
  }, [visibleCollaborators]);

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
              <h1 className="mt-2 text-3xl font-bold text-slate-900">Colaboradores</h1>
              <p className="mt-2 text-sm text-slate-500">
                Gerencie usuários, funções e permissões de acesso ao sistema.
              </p>

              {/* Role counters */}
              <div className="mt-3 flex flex-wrap gap-3">
                {(Object.entries(counts) as [UserRole, number][]).map(([role, n]) => (
                  <span
                    key={role}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600"
                  >
                    <span className="font-bold text-slate-900">{n}</span>
                    {ROLE_LABELS[role]}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {apiError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                  {apiError}
                </div>
              )}
              {successMsg && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                  {successMsg}
                </div>
              )}
              {canCreate && (
                <button
                  type="button"
                  onClick={() => setIsNewOpen(true)}
                  className="inline-flex items-center justify-center rounded-2xl bg-[#b81414] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#9f1313]"
                >
                  + Novo colaborador
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ── Two-panel layout ────────────────────────────────────────────── */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.65fr]">

          {/* ── Table panel ─────────────────────────────────────────────── */}
          <div className="rounded-[2rem] border border-slate-200 bg-white/95 p-5 shadow-sm backdrop-blur">
            {/* Filters */}
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
                  <span className="font-semibold text-slate-700">Função</span>
                  <select
                    value={roleFilter}
                    onChange={(e) => { setRoleFilter(e.target.value as UserRole | "TODOS"); setPage(1); }}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                  >
                    {availableRoleFilters.map((r) => (
                      <option key={r} value={r}>
                        {r === "TODOS" ? "Todos" : ROLE_LABELS[r]}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="relative w-full max-w-md">
                <span className="sr-only">Buscar</span>
                <input
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                  placeholder="Buscar por nome, e-mail ou unidade..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm text-slate-900 shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                />
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>
              </label>
            </div>

            {/* Table */}
            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
              {/* Header row */}
              <div className="grid grid-cols-[1.4fr_1.1fr_0.8fr_0.75fr_1fr_0.5fr] bg-slate-50 px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                <span>Nome</span>
                <span>E-mail</span>
                <span>Unidade</span>
                <span>Função</span>
                <span>Alterar Cargo</span>
                <span className="text-right">Status</span>
              </div>

              <div className="divide-y divide-slate-100 bg-white">
                {paginated.length === 0 ? (
                  <div className="p-8 text-center text-sm text-slate-500">
                    Nenhum colaborador encontrado.
                  </div>
                ) : (
                  paginated.map((c) => {
                    const isSelected = c.id === selectedId;
                    const isSaving   = saving === c.id;
                    return (
                      <div
                        key={c.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => selectRow(c)}
                        onKeyDown={(e) => handleRowKeyDown(e, c)}
                        className={cx(
                          "grid cursor-pointer grid-cols-[1.4fr_1.1fr_0.8fr_0.75fr_1fr_0.5fr] items-center gap-3 px-4 py-3.5 text-left text-sm outline-none transition",
                          isSelected ? "bg-violet-50/60" : "hover:bg-slate-50",
                          isSaving   ? "opacity-60" : "",
                        )}
                      >
                        {/* Nome + avatar */}
                        <span className="flex min-w-0 items-center gap-2.5">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-[11px] font-bold text-white">
                            {c.nome.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("")}
                          </span>
                          <span className="truncate font-semibold text-slate-900">{c.nome}</span>
                        </span>

                        <span className="min-w-0 truncate text-slate-500">{c.email}</span>

                        {/* Unidade */}
                        <span className="min-w-0 truncate text-slate-600">
                          {c.teamName ?? <span className="text-slate-300">—</span>}
                        </span>

                        {/* Função badge */}
                        <span>
                          <RolePill role={c.role} />
                        </span>

                        {/* Inline role change */}
                        <span onClick={(e) => e.stopPropagation()}>
                          <RoleSelect
                            current={c.role}
                            viewerRole={viewerRole}
                            disabled={isSaving}
                            onChange={(newRole) =>
                              updateField(c.id, (cur) => ({
                                ...cur,
                                role:      newRole,
                                permissoes: buildDefaultPermissoes(newRole),
                              }))
                            }
                          />
                        </span>

                        {/* Status toggle */}
                        <span className="flex justify-end" onClick={(e) => e.stopPropagation()}>
                          <Switch
                            checked={c.ativo}
                            label={`Status de ${c.nome}`}
                            disabled={isSaving}
                            onChange={(next) =>
                              updateField(c.id, (cur) => ({ ...cur, ativo: next }))
                            }
                          />
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Pagination */}
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

          {/* ── Detail panel ─────────────────────────────────────────────── */}
          <div className="rounded-[2rem] border border-slate-200 bg-white/95 p-5 shadow-sm backdrop-blur">
            {!draft ? (
              <div className="flex h-full min-h-[22rem] flex-col items-center justify-center gap-3 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                  <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Detalhes</p>
                <p className="text-sm text-slate-500">Clique em um colaborador para ver detalhes e editar permissões.</p>
              </div>
            ) : (
              <div className="flex h-full flex-col">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-white">
                      {draft.nome.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("")}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-bold text-slate-900">{draft.nome}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <RolePill role={draft.role} />
                        {draft.teamName && (
                          <span className="text-xs text-slate-400">{draft.teamName}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setSelectedId(null); setDraft(null); }}
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    aria-label="Fechar"
                  >
                    ×
                  </button>
                </div>

                {/* Tabs */}
                <div className="mt-5 flex items-center gap-2 rounded-2xl bg-slate-50 p-1.5">
                  {(["info", "permissoes"] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={cx(
                        "flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition",
                        activeTab === tab
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-500 hover:bg-white/60",
                      )}
                    >
                      {tab === "info" ? "Informações" : "Permissões"}
                    </button>
                  ))}
                </div>

                <div className="mt-4 flex-1">
                  {activeTab === "info" ? (
                    <div className="grid gap-4">
                      <InfoCard title="Contato">
                        <InfoRow label="E-mail"   value={draft.email} />
                        <InfoRow label="Telefone" value={draft.telefone || "—"} />
                        <InfoRow label="Unidade"  value={draft.teamName ?? "—"} />
                        <InfoRow label="Último login" value={formatRelativeTime(draft.lastLoginAt)} />
                      </InfoCard>

                      <InfoCard title="Perfil">
                        <label className="grid gap-1.5">
                          <span className="text-xs font-semibold text-slate-500">Função</span>
                          <select
                            value={draft.role}
                            onChange={(e) => {
                              const r = e.target.value as UserRole;
                              setDraft((d) => d ? { ...d, role: r, permissoes: buildDefaultPermissoes(r) } : d);
                            }}
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                          >
                            {(ASSIGNABLE_ROLES[viewerRole] ?? []).map((r) => (
                              <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                            ))}
                          </select>
                        </label>
                      </InfoCard>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Permissões de Acesso</p>
                      <p className="mt-1 text-xs text-slate-500">Ative ou desative o acesso às áreas do sistema.</p>
                      <div className="mt-4 grid gap-2.5">
                        {MODULES.map((mod) => (
                          <div
                            key={mod.key}
                            className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-3 py-2.5"
                          >
                            <span className="text-sm font-semibold text-slate-800">{mod.label}</span>
                            <Switch
                              checked={Boolean(draft.permissoes[mod.key])}
                              label={`Permissão para ${mod.label}`}
                              onChange={(next) =>
                                setDraft((d) =>
                                  d ? { ...d, permissoes: { ...d.permissoes, [mod.key]: next } } : d,
                                )
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-5 flex gap-3 border-t border-slate-100 pt-5">
                  <button
                    type="button"
                    onClick={() => { if (selected) setDraft(createDraft(selected)); }}
                    className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    disabled={!draft || saving === draft.id}
                    onClick={() => {
                      if (!draft) return;
                      void persistCollaborator(draft);
                      setSuccessMsg(`${draft.nome} atualizado com sucesso.`);
                    }}
                    className="flex-1 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving === draft?.id ? "Salvando..." : "Salvar"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <NewCollaboratorModal
        key={String(isNewOpen)}
        isOpen={isNewOpen}
        currentUserRole={viewerRole}
        existingEmails={allCollaborators.map((c) => c.email)}
        teams={TEAMS}
        onClose={() => setIsNewOpen(false)}
        onCreate={async ({ nome, email, telefone, role, senha, teamId }) => {
          if (!token) throw new Error("Sessão expirada. Faça login novamente.");
          const { collaborator: newCol } = await createCollaborator(token, {
            nome,
            email,
            telefone,
            role,
            senha,
            teamId,
          });
          setAllCollaborators((prev) => [newCol, ...prev]);
          setSelectedId(newCol.id);
          setDraft(createDraft(newCol));
          setActiveTab("permissoes");
          setQuery("");
          setRoleFilter("TODOS");
          setPage(1);
          setSuccessMsg(`${nome} cadastrado com sucesso.`);
          setIsNewOpen(false);
        }}
      />
    </div>
  );
}

// ── Small UI helpers ──────────────────────────────────────────────────────────
function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{title}</p>
      <div className="mt-3 grid gap-2 text-sm">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <p className="flex gap-2">
      <span className="w-24 shrink-0 font-semibold text-slate-500">{label}</span>
      <span className="text-slate-800">{value}</span>
    </p>
  );
}
