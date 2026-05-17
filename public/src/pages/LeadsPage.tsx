import { useState, useMemo } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";

import Navbar from "../components/Layouts/Navbar";
import LeadCard from "../components/Lead/LeadCard";
import LeadForm from "../components/Lead/LeadForm";
import DelegationManager from "../components/Lead/DelegationManager";
import type { LeadFormData } from "../components/Lead/LeadForm";
import { useAuth } from "../contexts/useAuth";
import { useLeads } from "../hooks/useLeads";
import type { ApiLead, AssignableUser } from "../hooks/useLeads";

export type LeadStatus =
  | "Novo"
  | "Em atendimento"
  | "Agendado"
  | "Em negociação"
  | "Vendido"
  | "Perdido";

const STAGE_META: Record<LeadStatus, { color: string; bg: string }> = {
  "Novo":           { color: "#ef4444", bg: "#fef2f2" },
  "Em atendimento": { color: "#3b82f6", bg: "#eff6ff" },
  "Agendado":       { color: "#f59e0b", bg: "#fffbeb" },
  "Em negociação":  { color: "#f97316", bg: "#fff7ed" },
  "Vendido":        { color: "#10b981", bg: "#f0fdf4" },
  "Perdido":        { color: "#94a3b8", bg: "#f8fafc" },
};

const KANBAN_STAGES: LeadStatus[] = [
  "Novo",
  "Em atendimento",
  "Agendado",
  "Em negociação",
  "Vendido",
  "Perdido",
];

// ── Draggable card wrapper ──────────────────────────────────────────────────
function DraggableCard({
  lead,
  canDrag,
  canDelegate,
  onEdit,
  onDelegate,
}: {
  lead: ApiLead;
  canDrag: boolean;
  canDelegate: boolean;
  onEdit: () => void;
  onDelegate: () => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: lead.id,
    disabled: !canDrag,
  });

  return (
    <div
      ref={setNodeRef}
      {...(canDrag ? listeners : {})}
      {...(canDrag ? attributes : {})}
      className={`touch-none outline-none ${isDragging ? "opacity-30" : ""} ${!canDrag ? "cursor-not-allowed" : ""}`}
    >
      <LeadCard
        clientName={lead.clientName}
        subject={lead.subject}
        origin={lead.origin}
        importance={lead.importance}
        attendantName={lead.attendantName}
        canDelegate={canDelegate}
        onEdit={onEdit}
        onDelegate={onDelegate}
      />
    </div>
  );
}

// ── Kanban column ───────────────────────────────────────────────────────────
function KanbanColumn({
  stage,
  leads,
  canDelegate,
  currentUserId,
  currentUserRole,
  onEdit,
  onDelegate,
}: {
  stage: LeadStatus;
  leads: ApiLead[];
  canDelegate: boolean;
  currentUserId: string;
  currentUserRole: string;
  onEdit: (lead: ApiLead) => void;
  onDelegate: (lead: ApiLead) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });
  const { color, bg } = STAGE_META[stage];

  function canDragLead(lead: ApiLead): boolean {
    if (currentUserRole !== "ATENDENTE") return true;
    return lead.attendantId === currentUserId;
  }

  return (
    <div
      className="flex h-full min-w-[230px] max-w-[230px] flex-col rounded-2xl overflow-hidden shadow-sm"
      style={{ background: isOver ? bg : "#f1f5f9" }}
    >
      <div
        className="flex items-center justify-between px-3 py-2.5 shrink-0"
        style={{ borderTop: `3px solid ${color}` }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
          <h3 className="truncate text-[11px] font-bold uppercase tracking-widest text-slate-500">
            {stage}
          </h3>
        </div>
        <span
          className="ml-2 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold"
          style={{ background: color + "20", color }}
        >
          {leads.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={`flex flex-1 min-h-0 flex-col gap-2 overflow-y-auto p-2 transition-colors duration-150 ${
          isOver ? "ring-2 ring-inset ring-blue-300" : ""
        }`}
      >
        {leads.map((lead) => (
          <DraggableCard
            key={lead.id}
            lead={lead}
            canDrag={canDragLead(lead)}
            canDelegate={canDelegate}
            onEdit={() => onEdit(lead)}
            onDelegate={() => onDelegate(lead)}
          />
        ))}

        <div
          className={`mt-auto flex items-center justify-center rounded-xl border-2 border-dashed py-4 text-[11px] transition-colors duration-150 ${
            isOver
              ? "border-blue-300 text-blue-400 bg-blue-50"
              : "border-slate-200 text-slate-300"
          }`}
        >
          {isOver ? "Soltar aqui" : "+ Soltar card"}
        </div>
      </div>
    </div>
  );
}

// ── Edit modal ──────────────────────────────────────────────────────────────
function EditLeadModal({
  lead,
  onClose,
}: {
  lead: ApiLead;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Detalhes do Lead</h2>
          <button onClick={onClose} className="text-slate-400 transition hover:text-slate-700">✕</button>
        </div>
        <dl className="space-y-2 text-sm">
          <Row label="Cliente"     value={lead.clientName} />
          <Row label="Telefone"    value={lead.clientPhone ?? "—"} />
          <Row label="E-mail"      value={lead.clientEmail ?? "—"} />
          <Row label="Interesse"   value={lead.subject ?? "—"} />
          <Row label="Origem"      value={lead.origin} />
          <Row label="Temperatura" value={lead.importance} />
          <Row label="Responsável" value={lead.attendantName} />
          <Row label="Estágio"     value={lead.status} />
        </dl>
        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="w-28 shrink-0 font-medium text-slate-500">{label}</dt>
      <dd className="text-slate-800 capitalize">{value}</dd>
    </div>
  );
}

// ── Delegate modal ──────────────────────────────────────────────────────────
function DelegateModal({
  lead,
  assignableUsers,
  currentUserRole,
  onClose,
  onDelegate,
}: {
  lead: ApiLead;
  assignableUsers: AssignableUser[];
  currentUserRole: string;
  onClose: () => void;
  onDelegate: (attendantId: string) => Promise<void>;
}) {
  const [selectedUser, setSelectedUser] = useState<AssignableUser | null>(null);
  const [saving, setSaving]             = useState(false);

  async function handleConfirm() {
    if (!selectedUser) return;
    setSaving(true);
    try {
      await onDelegate(selectedUser.id);
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400">Delegar lead</p>
            <h2 className="text-base font-bold text-slate-900 mt-0.5">{lead.clientName}</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 transition hover:text-slate-700">✕</button>
        </div>

        <DelegationManager
          currentUserRole={currentUserRole}
          assignableUsers={assignableUsers}
          selectedUserId={selectedUser?.id}
          onSelect={setSelectedUser}
        />

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedUser || saving}
            className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:opacity-50"
          >
            {saving ? "Delegando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────
export default function LeadsPage() {
  const { user, logout } = useAuth();

  const [showLeadForm, setShowLeadForm]     = useState(false);
  const [editingLead, setEditingLead]       = useState<ApiLead | null>(null);
  const [delegatingLead, setDelegatingLead] = useState<ApiLead | null>(null);
  const [activeId, setActiveId]             = useState<string | null>(null);

  const { leads, assignableUsers, loading, error, moveLead, delegateLead, addLead } = useLeads({ paused: activeId !== null });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const canDelegate = user?.role === "ADMIN" || user?.role === "GERENTE_GERAL" || user?.role === "GERENTE";
  const canCreate   = user?.role !== "GERENTE_GERAL";

  const visibleLeads = useMemo(() => {
    if (user?.role === "ATENDENTE") {
      return leads.filter((l) => l.attendantId === user.id);
    }
    if (user?.role === "GERENTE") {
      const teamIds = new Set(assignableUsers.map((u) => u.id));
      return leads.filter((l) => teamIds.has(l.attendantId) || l.attendantId === user.id);
    }
    return leads;
  }, [leads, assignableUsers, user?.role, user?.id]);

  const leadsByStage = useMemo(() => {
    const grouped = {} as Record<LeadStatus, ApiLead[]>;
    KANBAN_STAGES.forEach((stage) => (grouped[stage] = []));
    visibleLeads.forEach((lead) => {
      const stage = lead.status as LeadStatus;
      if (grouped[stage]) grouped[stage].push(lead);
      else grouped["Novo"].push(lead);
    });
    return grouped;
  }, [visibleLeads]);

  const activeLead = activeId ? visibleLeads.find((l) => l.id === activeId) : null;

  const totalLeads    = visibleLeads.length;
  const newLeads      = leadsByStage["Novo"].length;
  const inFunnelLeads = leadsByStage["Em atendimento"].length + leadsByStage["Agendado"].length + leadsByStage["Em negociação"].length;
  const closedLeads   = leadsByStage["Vendido"].length;

  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(active.id as string);
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null);
    if (!over) return;
    const newStage = over.id as LeadStatus;
    const lead = leads.find((l) => l.id === active.id);
    if (!lead || lead.status === newStage) return;
    moveLead(lead.id, newStage);
  }

  async function handleSaveLead(data: LeadFormData) {
    await addLead(data);
  }

  async function handleDelegate(attendantId: string) {
    if (!delegatingLead) return;
    await delegateLead(delegatingLead.id, attendantId);
  }

  if (loading) {
    return (
      <div className="flex h-full flex-col bg-slate-100">
        <Navbar user={user} onLogout={logout} />
        <div className="flex flex-1 items-center justify-center text-slate-400 text-sm">
          Carregando leads...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full flex-col bg-slate-100">
        <Navbar user={user} onLogout={logout} />
        <div className="flex flex-1 items-center justify-center text-red-500 text-sm">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-slate-100 text-slate-900">
      <Navbar user={user} onLogout={logout} />

      <main className="flex flex-1 min-h-0 flex-col gap-3 px-5 pb-5 pt-4">
        {/* Header bar */}
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm shrink-0">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">CRM de Vendas</p>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">Pipeline de Leads</h1>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-xs text-slate-500">
              <Stat label="Total"    value={totalLeads}    color="#64748b" />
              <Stat label="Novos"    value={newLeads}      color="#ef4444" />
              <Stat label="Funil"    value={inFunnelLeads} color="#f97316" />
              <Stat label="Fechados" value={closedLeads}   color="#10b981" />
            </div>
          </div>
          {canCreate && (
            <button
              onClick={() => setShowLeadForm(true)}
              className="rounded-xl bg-[#b81414] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#9f1313] shrink-0"
            >
              + Novo Lead
            </button>
          )}
        </div>

        {/* Kanban board */}
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="flex-1 min-h-0 overflow-x-auto">
            <div className="flex h-full gap-3 pb-1">
              {KANBAN_STAGES.map((stage) => (
                <KanbanColumn
                  key={stage}
                  stage={stage}
                  leads={leadsByStage[stage]}
                  canDelegate={canDelegate}
                  currentUserId={user?.id ?? ""}
                  currentUserRole={user?.role ?? ""}
                  onEdit={setEditingLead}
                  onDelegate={setDelegatingLead}
                />
              ))}
            </div>
          </div>

          <DragOverlay dropAnimation={null}>
            {activeLead ? (
              <div className="w-[230px] rotate-2 shadow-2xl opacity-95">
                <LeadCard
                  clientName={activeLead.clientName}
                  subject={activeLead.subject}
                  origin={activeLead.origin}
                  importance={activeLead.importance}
                  attendantName={activeLead.attendantName}
                  canDelegate={false}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>

      {showLeadForm && (
        <LeadForm onclose={() => setShowLeadForm(false)} onSave={handleSaveLead} />
      )}

      {editingLead && (
        <EditLeadModal lead={editingLead} onClose={() => setEditingLead(null)} />
      )}

      {delegatingLead && (
        <DelegateModal
          lead={delegatingLead}
          assignableUsers={assignableUsers}
          currentUserRole={user?.role ?? ""}
          onClose={() => setDelegatingLead(null)}
          onDelegate={handleDelegate}
        />
      )}
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
      <span className="text-slate-400">{label}:</span>
      <span className="font-bold" style={{ color }}>{value}</span>
    </div>
  );
}
