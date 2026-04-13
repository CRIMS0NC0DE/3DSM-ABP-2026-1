import { useEffect, useMemo, useState } from "react";

import NewCollaboratorModal from "../components/Collaborators/NewCollaboratorModal";
import RolePill from "../components/Collaborators/RolePill";
import Switch from "../components/Collaborators/Switch";
import {
  buildDefaultPermissoes,
  COLLABORATORS_STORAGE_KEY,
  formatRelativeTime,
  MODULES,
  normalizeText,
  safeReadStoredCollaborators,
  type Collaborator,
} from "../components/Collaborators/types";
import Logo from "../assets/logo_1000.svg";
import Navbar from "../components/Layouts/Navbar";
import { useAuth } from "../contexts/AuthContext";
import type { UserRole } from "../types/auth";

function classNames(...values: Array<string | false | undefined | null>) {
  return values.filter(Boolean).join(" ");
}

export default function CollaboratorsPage() {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "ADMINISTRADOR";

  const [collaborators, setCollaborators] = useState<Collaborator[]>(() => safeReadStoredCollaborators());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Collaborator | null>(null);
  const [activeTab, setActiveTab] = useState<"info" | "permissoes">("permissoes");

  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "TODOS">("TODOS");
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);
  const [isNewOpen, setIsNewOpen] = useState(false);

  const selected = useMemo(
    () => (selectedId ? collaborators.find((collaborator) => collaborator.id === selectedId) || null : null),
    [collaborators, selectedId],
  );

  useEffect(() => {
    if (!selected) {
      setDraft(null);
      return;
    }
    setDraft({ ...selected, permissoes: { ...selected.permissoes } });
    setActiveTab("permissoes");
  }, [selected?.id]);

  useEffect(() => {
    localStorage.setItem(COLLABORATORS_STORAGE_KEY, JSON.stringify(collaborators));
  }, [collaborators]);

  const filtered = useMemo(() => {
    const normalizedQuery = normalizeText(query);

    return collaborators.filter((collaborator) => {
      if (roleFilter !== "TODOS" && collaborator.role !== roleFilter) return false;
      if (!normalizedQuery) return true;
      const haystack = normalizeText(`${collaborator.nome} ${collaborator.email} ${collaborator.telefone}`);
      return haystack.includes(normalizedQuery);
    });
  }, [collaborators, query, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  useEffect(() => {
    setPage(1);
  }, [query, roleFilter, pageSize]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  function updateCollaborator(id: string, updater: (current: Collaborator) => Collaborator) {
    setCollaborators((current) => current.map((item) => (item.id === id ? updater(item) : item)));
  }

  return (
    <div className="relative min-h-screen bg-slate-100 text-slate-900">
      <Navbar user={user} onLogout={logout} />

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <img src={Logo} alt="" className="h-96 w-96 opacity-[0.04]" />
      </div>

      <main className="relative z-10 flex flex-col gap-6 p-6">
        <section className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Usuários</p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">Colaboradores</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-500">Gerencie os colaboradores e suas permissões.</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {!isAdmin ? (
                <div className="rounded-3xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900 shadow-sm">
                  Apenas <strong>administradores</strong> podem editar permissões.
                </div>
              ) : null}

              <button
                type="button"
                onClick={() => setIsNewOpen(true)}
                disabled={!isAdmin}
                className="inline-flex items-center justify-center rounded-3xl bg-[#b81414] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#9f1313] disabled:cursor-not-allowed disabled:opacity-60"
              >
                + Novo usuário
              </button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white/95 p-5 shadow-sm backdrop-blur">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                  <span className="font-semibold text-slate-700">Itens por página</span>
                  <select
                    value={pageSize}
                    onChange={(event) => setPageSize(Number(event.target.value))}
                    className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </label>

                <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                  <span className="font-semibold text-slate-700">Filtro</span>
                  <select
                    value={roleFilter}
                    onChange={(event) => setRoleFilter(event.target.value as UserRole | "TODOS")}
                    className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200"
                  >
                    <option value="TODOS">Todos</option>
                    <option value="ADMINISTRADOR">Administrador</option>
                    <option value="GERENTE_GERAL">Gerente geral</option>
                    <option value="GERENTE">Gerente</option>
                    <option value="ATENDENTE">Atendente</option>
                    <option value="USUARIO">Usuário</option>
                  </select>
                </label>
              </div>

              <label className="relative w-full max-w-md">
                <span className="sr-only">Buscar</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Buscar aqui..."
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm text-slate-900 shadow-sm outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200"
                />
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>
              </label>
            </div>

            <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200">
              <div className="grid grid-cols-[1.4fr_1.2fr_0.8fr_0.8fr_0.5fr] bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                <span>Nome completo</span>
                <span>E-mail</span>
                <span>Permissões</span>
                <span>Último login</span>
                <span className="text-right">Status</span>
              </div>

              <div className="divide-y divide-slate-200 bg-white">
                {paginated.length === 0 ? (
                  <div className="p-8 text-center text-sm text-slate-500">Nenhum usuário encontrado.</div>
                ) : (
                  paginated.map((collaborator) => {
                    const isSelected = collaborator.id === selectedId;
                    return (
                      <button
                        key={collaborator.id}
                        type="button"
                        onClick={() => setSelectedId(collaborator.id)}
                        className={classNames(
                          "grid w-full grid-cols-[1.4fr_1.2fr_0.8fr_0.8fr_0.5fr] items-center gap-3 px-4 py-4 text-left text-sm transition",
                          isSelected ? "bg-cyan-50/60" : "hover:bg-slate-50",
                        )}
                      >
                        <span className="min-w-0 truncate font-semibold text-slate-900">{collaborator.nome}</span>
                        <span className="min-w-0 truncate text-slate-600">{collaborator.email}</span>
                        <span>
                          <RolePill role={collaborator.role} />
                        </span>
                        <span className="text-slate-600">{formatRelativeTime(collaborator.lastLoginAt)}</span>
                        <span className="flex justify-end">
                          <Switch
                            checked={collaborator.ativo}
                            label={`Status de ${collaborator.nome}`}
                            disabled={!isAdmin}
                            onChange={(next) =>
                              updateCollaborator(collaborator.id, (current) => ({
                                ...current,
                                ativo: next,
                              }))
                            }
                          />
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

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
                de <strong className="text-slate-900">{filtered.length}</strong> usuários
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={page <= 1}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Anterior
                </button>
                <span className="text-sm font-semibold text-slate-700">
                  {page} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                  disabled={page >= totalPages}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Próximo
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white/95 p-5 shadow-sm backdrop-blur">
            {!draft ? (
              <div className="flex h-full min-h-[22rem] flex-col items-center justify-center gap-3 text-center">
                <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Detalhes</p>
                <h2 className="text-xl font-semibold text-slate-900">Selecione um colaborador</h2>
                <p className="max-w-sm text-sm text-slate-500">
                  Clique em um usuário na lista para visualizar e editar permissões.
                </p>
              </div>
            ) : (
              <div className="flex h-full flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-white">
                      {draft.nome
                        .split(" ")
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((part) => part[0]?.toUpperCase())
                        .join("")}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-lg font-semibold text-slate-900">{draft.nome}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <RolePill role={draft.role} />
                        <span className="text-xs text-slate-500">
                          Último login: <strong className="text-slate-700">{formatRelativeTime(draft.lastLoginAt)}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedId(null)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-2xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                    aria-label="Fechar painel"
                    title="Fechar"
                  >
                    ×
                  </button>
                </div>

                <div className="mt-5 flex items-center gap-2 rounded-3xl bg-slate-50 p-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("info")}
                    className={classNames(
                      "flex-1 rounded-3xl px-4 py-2 text-sm font-semibold transition",
                      activeTab === "info" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:bg-white/60",
                    )}
                  >
                    Informações
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("permissoes")}
                    className={classNames(
                      "flex-1 rounded-3xl px-4 py-2 text-sm font-semibold transition",
                      activeTab === "permissoes"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-600 hover:bg-white/60",
                    )}
                  >
                    Permissões
                  </button>
                </div>

                <div className="mt-5 flex-1">
                  {activeTab === "info" ? (
                    <div className="grid gap-4">
                      <div className="rounded-3xl border border-slate-200 bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Contato</p>
                        <div className="mt-3 grid gap-2 text-sm text-slate-700">
                          <p>
                            <span className="font-semibold text-slate-900">E-mail:</span> {draft.email}
                          </p>
                          <p>
                            <span className="font-semibold text-slate-900">Telefone:</span> {draft.telefone || "—"}
                          </p>
                        </div>
                      </div>

                      <div className="rounded-3xl border border-slate-200 bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Perfil</p>
                        <div className="mt-3 grid gap-2">
                          <label className="grid gap-2">
                            <span className="text-sm font-semibold text-slate-700">Tipo de usuário</span>
                            <select
                              value={draft.role}
                              disabled={!isAdmin}
                              onChange={(event) => {
                                const nextRole = event.target.value as UserRole;
                                setDraft((current) =>
                                  current
                                    ? {
                                        ...current,
                                        role: nextRole,
                                        permissoes: buildDefaultPermissoes(nextRole),
                                      }
                                    : current,
                                );
                              }}
                              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 disabled:cursor-not-allowed disabled:bg-slate-50"
                            >
                              <option value="USUARIO">Usuário</option>
                              <option value="ATENDENTE">Atendente</option>
                              <option value="GERENTE">Gerente</option>
                              <option value="GERENTE_GERAL">Gerente geral</option>
                              <option value="ADMINISTRADOR">Administrador</option>
                            </select>
                          </label>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-3xl border border-slate-200 bg-white p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Permissões</p>
                      <p className="mt-2 text-sm text-slate-500">Ative ou desative o acesso às áreas do sistema.</p>

                      <div className="mt-4 grid gap-3">
                        {MODULES.map((module) => (
                          <div
                            key={module.key}
                            className="flex items-center justify-between gap-4 rounded-3xl bg-slate-50 px-4 py-3"
                          >
                            <span className="text-sm font-semibold text-slate-800">{module.label}</span>
                            <Switch
                              checked={Boolean(draft.permissoes[module.key])}
                              disabled={!isAdmin}
                              label={`Permissão para ${module.label}`}
                              onChange={(next) =>
                                setDraft((current) =>
                                  current
                                    ? {
                                        ...current,
                                        permissoes: {
                                          ...current.permissoes,
                                          [module.key]: next,
                                        },
                                      }
                                    : current,
                                )
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-5 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      if (!selected) return;
                      setDraft({ ...selected, permissoes: { ...selected.permissoes } });
                    }}
                    className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Cancelar
                  </button>

                  <button
                    type="button"
                    disabled={!isAdmin || !draft}
                    onClick={() => {
                      if (!draft) return;
                      updateCollaborator(draft.id, () => draft);
                    }}
                    className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <NewCollaboratorModal
        isOpen={isNewOpen}
        onClose={() => setIsNewOpen(false)}
        onCreate={({ nome, email, telefone, role }) => {
          const id = `col-${globalThis.crypto?.randomUUID?.() ?? String(Date.now())}`;
          const newCollaborator: Collaborator = {
            id,
            nome,
            email,
            telefone,
            role,
            ativo: true,
            lastLoginAt: null,
            permissoes: buildDefaultPermissoes(role),
          };

          setCollaborators((current) => [newCollaborator, ...current]);
          setSelectedId(id);
          setIsNewOpen(false);
        }}
      />
    </div>
  );
}

