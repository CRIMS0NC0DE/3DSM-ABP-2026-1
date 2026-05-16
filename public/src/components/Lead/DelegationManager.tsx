import { useState, useMemo, useRef, useEffect } from "react";
import type { AssignableUser } from "../../services/api";

// Roles each actor can delegate to, in hierarchy order
const DELEGATION_MAP: Record<string, string[]> = {
  ADMIN:         ["GERENTE_GERAL", "GERENTE", "ATENDENTE"],
  GERENTE_GERAL: ["GERENTE"],
  GERENTE:       ["ATENDENTE"],
  ATENDENTE:     [],
};

const ROLE_LABELS: Record<string, string> = {
  GERENTE_GERAL: "Ger. Geral",
  GERENTE:       "Gerente",
  ATENDENTE:     "Vendedor",
};

const ROLE_COLORS: Record<string, { active: string; ring: string }> = {
  GERENTE_GERAL: { active: "bg-indigo-600 text-white",   ring: "ring-indigo-300" },
  GERENTE:       { active: "bg-violet-600 text-white",   ring: "ring-violet-300" },
  ATENDENTE:     { active: "bg-emerald-600 text-white",  ring: "ring-emerald-300" },
};

export interface DelegationManagerProps {
  currentUserRole: string;
  assignableUsers: AssignableUser[];
  selectedUserId?: string;
  onSelect: (user: AssignableUser | null) => void;
}

export default function DelegationManager({
  currentUserRole,
  assignableUsers,
  selectedUserId,
  onSelect,
}: DelegationManagerProps) {
  const assignableRoles = DELEGATION_MAP[currentUserRole] ?? [];

  const [activeRole, setActiveRole]   = useState<string>(assignableRoles[0] ?? "");
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen]               = useState(false);

  const inputRef    = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return assignableUsers.filter((u) => {
      if (u.role !== activeRole) return false;
      if (!q) return true;
      return u.nome.toLowerCase().includes(q);
    });
  }, [assignableUsers, activeRole, searchQuery]);

  const selectedUser = assignableUsers.find((u) => u.id === selectedUserId) ?? null;

  function handleBadgeClick(role: string) {
    setActiveRole(role);
    setSearchQuery("");
    onSelect(null);
    setOpen(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function handleSelectUser(user: AssignableUser) {
    onSelect(user);
    setSearchQuery(user.nome);
    setOpen(false);
  }

  function handleInputChange(value: string) {
    setSearchQuery(value);
    if (selectedUser) onSelect(null);
    setOpen(value.length > 0);
  }

  if (assignableRoles.length === 0) {
    return (
      <p className="text-sm text-slate-400 text-center py-3">
        Você não tem permissão para delegar leads.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Role badges */}
      <div className="flex flex-wrap gap-2">
        {assignableRoles.map((role) => {
          const isActive = activeRole === role;
          const colors   = ROLE_COLORS[role] ?? { active: "bg-slate-700 text-white", ring: "ring-slate-300" };
          return (
            <button
              key={role}
              type="button"
              onClick={() => handleBadgeClick(role)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ring-2 ring-offset-1 ${
                isActive
                  ? `${colors.active} ${colors.ring}`
                  : "bg-slate-100 text-slate-500 ring-transparent hover:bg-slate-200"
              }`}
            >
              {ROLE_LABELS[role] ?? role}
            </button>
          );
        })}
      </div>

      {/* Search input + dropdown */}
      <div ref={containerRef} className="relative">
        <div
          className={`flex items-center gap-2 rounded-xl border px-3 py-2 transition ${
            open ? "border-violet-400 ring-2 ring-violet-100" : "border-slate-200"
          } ${selectedUser ? "bg-emerald-50 border-emerald-300" : "bg-white"}`}
        >
          {/* Search icon */}
          <svg
            className="h-4 w-4 shrink-0 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>

          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => { if (searchQuery) setOpen(true); }}
            placeholder={`Buscar ${ROLE_LABELS[activeRole] ?? activeRole}...`}
            className="flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none"
          />

          {/* Clear button */}
          {(searchQuery || selectedUser) && (
            <button
              type="button"
              onClick={() => { setSearchQuery(""); onSelect(null); setOpen(false); }}
              className="text-slate-400 hover:text-slate-600 transition"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Selected checkmark */}
          {selectedUser && (
            <svg className="h-4 w-4 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>

        {/* Dropdown */}
        {open && (
          <ul className="absolute left-0 right-0 top-full z-20 mt-1 max-h-48 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
            {filteredUsers.length === 0 ? (
              <li className="px-4 py-3 text-sm text-slate-400 text-center">
                Nenhum resultado para "{searchQuery}"
              </li>
            ) : (
              filteredUsers.map((user) => (
                <li key={user.id}>
                  <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); handleSelectUser(user); }}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition hover:bg-slate-50 ${
                      selectedUserId === user.id ? "bg-violet-50 text-violet-700 font-medium" : "text-slate-700"
                    }`}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500 uppercase">
                      {user.nome.charAt(0)}
                    </span>
                    <span className="truncate">{user.nome}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      {/* Selected user confirmation chip */}
      {selectedUser && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white uppercase">
            {selectedUser.nome.charAt(0)}
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-emerald-800 truncate">{selectedUser.nome}</p>
            <p className="text-[10px] text-emerald-600">{ROLE_LABELS[selectedUser.role] ?? selectedUser.role}</p>
          </div>
          <svg className="ml-auto h-4 w-4 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </div>
  );
}
