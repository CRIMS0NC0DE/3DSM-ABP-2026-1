import { useState, type FormEvent } from "react";

import { ASSIGNABLE_ROLES, ROLE_LABELS } from "./types";
import type { UserRole } from "../../types/auth";

export default function NewCollaboratorModal({
  isOpen,
  onClose,
  onCreate,
  existingEmails = [],
  currentUserRole,
  teams = [],
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (input: {
    nome: string;
    email: string;
    telefone: string;
    role: UserRole;
    senha: string;
    teamId: string | null;
  }) => void | Promise<void>;
  existingEmails?: string[];
  currentUserRole: UserRole;
  teams?: Array<{ id: string; name: string }>;
}) {
  const assignableRoles = ASSIGNABLE_ROLES[currentUserRole] ?? [];
  const defaultRole     = assignableRoles[assignableRoles.length - 1] ?? "ATENDENTE";

  const [nome, setNome]         = useState("");
  const [email, setEmail]       = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha]       = useState("");
  const [role, setRole]         = useState<UserRole>(defaultRole);
  const [teamId, setTeamId]     = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const normalizedEmail    = email.trim().toLowerCase();
  const emailExists        = existingEmails.some((e) => e.toLowerCase() === normalizedEmail);
  const needsTeam          = role === "GERENTE" || role === "ATENDENTE";
  const teamValid          = !needsTeam || teamId !== "";
  const canSave =
    nome.trim().length >= 3 &&
    normalizedEmail.includes("@") &&
    senha.length >= 6 &&
    !emailExists &&
    teamValid;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);

    if (nome.trim().length < 3) {
      setErrorMsg("Informe o nome completo do colaborador.");
      return;
    }
    if (!normalizedEmail.includes("@")) {
      setErrorMsg("Informe um e-mail válido.");
      return;
    }
    if (emailExists) {
      setErrorMsg("Já existe um colaborador cadastrado com esse e-mail.");
      return;
    }
    if (senha.length < 6) {
      setErrorMsg("A senha deve ter no mínimo 6 caracteres.");
      return;
    }
    if (needsTeam && !teamId) {
      setErrorMsg("Selecione a unidade/loja do colaborador.");
      return;
    }

    setSubmitting(true);
    try {
      await onCreate({
        nome:   nome.trim(),
        email:  normalizedEmail,
        telefone: telefone.trim(),
        role,
        senha,
        teamId: teamId || null,
      });
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Não foi possível criar o usuário.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Novo colaborador</p>
            <h2 className="mt-1.5 text-2xl font-bold text-slate-900">Adicionar usuário</h2>
            <p className="mt-1.5 text-sm text-slate-500">
              Preencha os dados e defina o nível de acesso.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-2xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Fechar"
          >
            ×
          </button>
        </div>

        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          {/* Nome */}
          <label className="grid gap-1.5">
            <span className="text-sm font-semibold text-slate-700">Nome completo</span>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex.: João da Silva"
              autoComplete="name"
              required
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            />
          </label>

          {/* E-mail */}
          <label className="grid gap-1.5">
            <span className="text-sm font-semibold text-slate-700">E-mail</span>
            <input
              value={email}
              type="email"
              inputMode="email"
              autoComplete="email"
              onChange={(e) => { setEmail(e.target.value); setErrorMsg(null); }}
              placeholder="nome@empresa.com"
              required
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            />
          </label>

          {/* Telefone */}
          <label className="grid gap-1.5">
            <span className="text-sm font-semibold text-slate-700">Telefone</span>
            <input
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="+55 11 90000-0000"
              autoComplete="tel"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            />
          </label>

          {/* Senha */}
          <label className="grid gap-1.5">
            <span className="text-sm font-semibold text-slate-700">Senha inicial</span>
            <input
              value={senha}
              type="password"
              autoComplete="new-password"
              onChange={(e) => { setSenha(e.target.value); setErrorMsg(null); }}
              placeholder="Mínimo 6 caracteres"
              required
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            />
          </label>

          {/* Função — restricted to what the viewer can assign */}
          <label className="grid gap-1.5">
            <span className="text-sm font-semibold text-slate-700">Função / Cargo</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            >
              {assignableRoles.map((r) => (
                <option key={r} value={r}>{ROLE_LABELS[r]}</option>
              ))}
            </select>
          </label>

          {/* Vínculo de loja — shown when role requires a team */}
          {teams.length > 0 && (
            <label className="grid gap-1.5">
              <span className="text-sm font-semibold text-slate-700">
                Unidade / Loja
                {needsTeam && <span className="ml-1 text-red-500">*</span>}
              </span>
              <select
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              >
                <option value="">Selecione a unidade...</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              {needsTeam && !teamId && (
                <p className="text-xs text-amber-600">Obrigatório para Gerentes e Vendedores.</p>
              )}
            </label>
          )}

          {/* Error */}
          {(errorMsg ?? emailExists) && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {errorMsg ?? "Já existe um colaborador com esse e-mail."}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!canSave || submitting}
              className="flex-1 rounded-2xl bg-[#b81414] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#9f1313] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Criando..." : "Criar usuário"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
