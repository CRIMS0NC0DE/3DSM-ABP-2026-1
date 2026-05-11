import { useState, type FormEvent } from "react";

import type { UserRole } from "../../types/auth";

export default function NewCollaboratorModal({
  isOpen,
  onClose,
  onCreate,
  existingEmails = [],
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (input: { nome: string; email: string; telefone: string; role: UserRole; senha: string }) => void | Promise<void>;
  existingEmails?: string[];
}) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [role, setRole] = useState<UserRole>("USUARIO");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const normalizedEmail = email.trim().toLowerCase();
  const emailAlreadyExists = existingEmails.some((existingEmail) => existingEmail.toLowerCase() === normalizedEmail);
  const canSave = nome.trim().length >= 3 && normalizedEmail.includes("@") && senha.length >= 6 && !emailAlreadyExists;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    if (nome.trim().length < 3) {
      setErrorMessage("Informe o nome completo do colaborador.");
      return;
    }

    if (!normalizedEmail.includes("@")) {
      setErrorMessage("Informe um e-mail valido.");
      return;
    }

    if (emailAlreadyExists) {
      setErrorMessage("Ja existe um colaborador cadastrado com esse e-mail.");
      return;
    }

    if (senha.length < 6) {
      setErrorMessage("A senha deve ter no minimo 6 caracteres.");
      return;
    }

    setIsSubmitting(true);

    try {
      await onCreate({
        nome: nome.trim(),
        email: normalizedEmail,
        telefone: telefone.trim(),
        role,
        senha,
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Nao foi possivel criar o usuario.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Novo usuário</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Adicionar colaborador</h2>
            <p className="mt-2 text-sm text-slate-500">
              Crie o usuário e depois ajuste as permissões no painel ao lado.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Fechar"
            title="Fechar"
          >
            ×
          </button>
        </div>

        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-700">Nome completo</span>
            <input
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200"
              placeholder="Ex.: João da Silva"
              autoComplete="name"
              required
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-700">E-mail</span>
            <input
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setErrorMessage(null);
              }}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200"
              placeholder="nome@empresa.com"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-700">Telefone</span>
            <input
              value={telefone}
              onChange={(event) => setTelefone(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200"
              placeholder="+55 11 90000-0000"
              autoComplete="tel"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-700">Senha inicial</span>
            <input
              value={senha}
              onChange={(event) => {
                setSenha(event.target.value);
                setErrorMessage(null);
              }}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200"
              placeholder="Mínimo de 6 caracteres"
              type="password"
              autoComplete="new-password"
              required
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-700">Perfil</span>
            <select
              value={role}
              onChange={(event) => setRole(event.target.value as UserRole)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200"
            >
              <option value="USUARIO">Usuário</option>
              <option value="ATENDENTE">Atendente</option>
              <option value="GERENTE">Gerente</option>
              <option value="GERENTE_GERAL">Gerente geral</option>
              <option value="ADMINISTRADOR">Administrador</option>
            </select>
          </label>

          {errorMessage || emailAlreadyExists ? (
            <div className="rounded-2xl border border-[#b81414]/30 bg-[#b81414]/10 px-4 py-3 text-sm text-[#690b0b]">
              {errorMessage || "Ja existe um colaborador cadastrado com esse e-mail."}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!canSave || isSubmitting}
              className="rounded-2xl bg-[#b81414] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#9f1313] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Criando..." : "Criar usuário"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
