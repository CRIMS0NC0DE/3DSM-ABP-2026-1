import React, { useState, useMemo } from "react";
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
import { useAuth } from "../contexts/useAuth";

export type LeadStatus =
  | "Não atendido"
  | "Em negociação"
  | "Não lido"
  | "Agendado"
  | "Finalizado - vendido";

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  interest: string;
  status: LeadStatus;
  company?: string;
  value?: string;
  tags?: string[];
  origin?: string;
  createdAt: string;
  responsible?: string;
}

const STAGE_META: Record<LeadStatus, { color: string; bg: string }> = {
  "Não atendido":       { color: "#ef4444", bg: "#fef2f2" },
  "Em negociação":      { color: "#f97316", bg: "#fff7ed" },
  "Não lido":           { color: "#8b5cf6", bg: "#f5f3ff" },
  "Agendado":           { color: "#f59e0b", bg: "#fffbeb" },
  "Finalizado - vendido": { color: "#10b981", bg: "#f0fdf4" },
};

const KANBAN_STAGES: LeadStatus[] = [
  "Não atendido",
  "Em negociação",
  "Não lido",
  "Agendado",
  "Finalizado - vendido",
];

const initialLeads: Lead[] = [
  {
    id: "1",
    name: "Marcio",
    company: "Fatec",
    phone: "(11) 99999-0001",
    email: "123@bol.com.br",
    interest: "Honda Civic",
    status: "Não atendido",
    value: "R$ 55.000",
    origin: "Instagram",
    createdAt: "2024-05-10",
    tags: ["Hot", "Prioridade"],
  },
  {
    id: "2",
    name: "Vini",
    phone: "(11) 99999-0002",
    email: "456@bol.com.br",
    interest: "Toyota Corolla",
    status: "Não lido",
    value: "R$ 82.000",
    origin: "WhatsApp",
    createdAt: "2024-05-09",
  },
  {
    id: "3",
    name: "Eric",
    phone: "(11) 99999-0003",
    email: "789@bol.com.br",
    interest: "Jeep Compass",
    status: "Em negociação",
    value: "R$ 110.000",
    origin: "Site",
    createdAt: "2024-05-08",
    tags: ["Financiamento"],
  },
  {
    id: "4",
    name: "Ana",
    company: "AutoPrime",
    phone: "(11) 98888-1234",
    email: "ana@autoprime.com",
    interest: "BMW X5",
    status: "Agendado",
    value: "R$ 290.000",
    origin: "Indicação",
    createdAt: "2024-05-07",
    tags: ["VIP"],
  },
];

// ── Draggable card wrapper ────────────────────────────────────────────────────
function DraggableCard({ lead, onEdit }: { lead: Lead; onEdit: () => void }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: lead.id,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`touch-none outline-none ${isDragging ? "opacity-30" : ""}`}
    >
      <LeadCard
        name={lead.name}
        interest={lead.interest}
        states={lead.status}
        value={lead.value}
        origin={lead.origin}
        tags={lead.tags}
        company={lead.company}
        onEdit={onEdit}
      />
    </div>
  );
}

// ── Kanban column ─────────────────────────────────────────────────────────────
function KanbanColumn({
  stage,
  leads,
  onEdit,
}: {
  stage: LeadStatus;
  leads: Lead[];
  onEdit: (lead: Lead) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });
  const { color, bg } = STAGE_META[stage];

  return (
    <div
      className="flex h-full min-w-[230px] max-w-[230px] flex-col rounded-2xl overflow-hidden shadow-sm"
      style={{ background: isOver ? bg : "#f1f5f9" }}
    >
      {/* Column header */}
      <div
        className="flex items-center justify-between px-3 py-2.5 shrink-0"
        style={{ borderTop: `3px solid ${color}` }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="h-2 w-2 rounded-full shrink-0"
            style={{ backgroundColor: color }}
          />
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

      {/* Drop zone — scrollable card list */}
      <div
        ref={setNodeRef}
        className={`flex flex-1 min-h-0 flex-col gap-2 overflow-y-auto p-2 transition-colors duration-150 ${
          isOver ? "ring-2 ring-inset ring-blue-300" : ""
        }`}
      >
        {leads.map((lead) => (
          <DraggableCard key={lead.id} lead={lead} onEdit={() => onEdit(lead)} />
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

// ── Edit modal ────────────────────────────────────────────────────────────────
function EditLeadModal({
  lead,
  onClose,
  onSave,
}: {
  lead: Lead;
  onClose: () => void;
  onSave: (lead: Lead) => void;
}) {
  const [name, setName] = useState(lead.name);
  const [company, setCompany] = useState(lead.company ?? "");
  const [interest, setInterest] = useState(lead.interest);
  const [value, setValue] = useState(lead.value ?? "");
  const [origin, setOrigin] = useState(lead.origin ?? "");
  const [status, setStatus] = useState<LeadStatus>(lead.status);

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    onSave({
      ...lead,
      name,
      company: company || undefined,
      interest,
      value: value || undefined,
      origin: origin || undefined,
      status,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Editar Lead</h2>
          <button
            onClick={onClose}
            className="text-slate-400 transition hover:text-slate-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="mb-1 block text-xs font-medium text-slate-600">Nome</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Empresa</label>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Interesse (veículo)</label>
              <input
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Valor</label>
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="R$ 0.000"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Origem</label>
              <input
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="Instagram, WhatsApp..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              />
            </div>
            <div className="col-span-2">
              <label className="mb-1 block text-xs font-medium text-slate-600">Estágio</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as LeadStatus)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              >
                {KANBAN_STAGES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#b81414] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#9f1313]"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const { user, logout } = useAuth();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === "Não atendido").length;
  const inProgressLeads = leads.filter((l) => l.status === "Em negociação").length;
  const closedLeads = leads.filter((l) => l.status === "Finalizado - vendido").length;

  const leadsByStage = useMemo(() => {
    const grouped = {} as Record<LeadStatus, Lead[]>;
    KANBAN_STAGES.forEach((stage) => (grouped[stage] = []));
    leads.forEach((lead) => {
      if (grouped[lead.status]) grouped[lead.status].push(lead);
    });
    return grouped;
  }, [leads]);

  const activeLead = activeId ? leads.find((l) => l.id === activeId) : null;

  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(active.id as string);
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null);
    if (!over) return;
    const newStage = over.id as LeadStatus;
    setLeads((prev) =>
      prev.map((l) => (l.id === active.id ? { ...l, status: newStage } : l))
    );
  }

  function handleSaveLead(formLead: {
    name: string;
    phone: string;
    email: string;
    interest: string;
    status: string;
  }) {
    const newLead: Lead = {
      ...formLead,
      status: formLead.status as LeadStatus,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0],
    };
    setLeads((prev) => [newLead, ...prev]);
  }

  function handleUpdateLead(updated: Lead) {
    setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    setEditingLead(null);
  }

  return (
    <div className="flex h-full flex-col bg-slate-100 text-slate-900">
      <Navbar user={user} onLogout={logout} />

      <main className="flex flex-1 min-h-0 flex-col gap-3 px-5 pb-5 pt-4">
        {/* ── Compact header bar ── */}
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm shrink-0">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                CRM de Vendas
              </p>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">
                Pipeline de Leads
              </h1>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-xs text-slate-500">
              <Stat label="Total" value={totalLeads} color="#64748b" />
              <Stat label="Novos" value={newLeads} color="#3b82f6" />
              <Stat label="Funil" value={inProgressLeads} color="#f97316" />
              <Stat label="Fechados" value={closedLeads} color="#10b981" />
            </div>
          </div>
          <button
            onClick={() => setShowLeadForm(true)}
            className="rounded-xl bg-[#b81414] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#9f1313] shrink-0"
          >
            + Novo Lead
          </button>
        </div>

        {/* ── Kanban board ── */}
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex-1 min-h-0 overflow-x-auto">
            <div className="flex h-full gap-3 pb-1">
              {KANBAN_STAGES.map((stage) => (
                <KanbanColumn
                  key={stage}
                  stage={stage}
                  leads={leadsByStage[stage]}
                  onEdit={setEditingLead}
                />
              ))}
            </div>
          </div>

          <DragOverlay dropAnimation={null}>
            {activeLead ? (
              <div className="w-[230px] rotate-2 shadow-2xl opacity-95">
                <LeadCard
                  name={activeLead.name}
                  interest={activeLead.interest}
                  states={activeLead.status}
                  value={activeLead.value}
                  origin={activeLead.origin}
                  tags={activeLead.tags}
                  company={activeLead.company}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>

      {showLeadForm ? (
        <LeadForm
          onclose={() => setShowLeadForm(false)}
          onSave={handleSaveLead}
        />
      ) : null}

      {editingLead ? (
        <EditLeadModal
          lead={editingLead}
          onClose={() => setEditingLead(null)}
          onSave={handleUpdateLead}
        />
      ) : null}
    </div>
  );
}

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="h-2 w-2 rounded-full shrink-0"
        style={{ backgroundColor: color }}
      />
      <span className="text-slate-400">{label}:</span>
      <span className="font-bold" style={{ color }}>
        {value}
      </span>
    </div>
  );
}
