import { useEffect, useState } from "react";

import type { UserRole } from "../../types/auth";

export default function NewCollaboratorModal({
  isOpen,
  onClose,
  onCreate,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (input: { nome: string; email: string; telefone: string; role: UserRole }) => void;
}) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [role, setRole] = useState<UserRole>("USUARIO");

  useEffect(() => {
    if (!isOpen) return;
    setNome("");
    setEmail("");
    setTelefone("");
    setRole("USUARIO");
  }, [isOpen]);

  if (!isOpen) return null;

  const canSave = nome.trim().length >= 3 && email.trim().includes("@");

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

        <div className="mt-6 grid gap-4">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-700">Nome completo</span>
            <input
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200"
              placeholder="Ex.: João da Silva"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-700">E-mail</span>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200"
              placeholder="nome@empresa.com"
              inputMode="email"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-700">Telefone</span>
            <input
              value={telefone}
              onChange={(event) => setTelefone(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200"
              placeholder="+55 11 90000-0000"
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
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={!canSave}
            onClick={() =>
              onCreate({
                nome: nome.trim(),
                email: email.trim(),
                telefone: telefone.trim(),
                role,
              })
            }
            className="rounded-2xl bg-[#b81414] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#9f1313] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Criar usuário
          </button>
        </div>
      </div>
    </div>
  );
}

