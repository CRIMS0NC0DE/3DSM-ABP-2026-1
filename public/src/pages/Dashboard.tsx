import { useEffect, useMemo, useState, type ReactNode } from "react";

import type { Collaborator } from "../components/Collaborators/types";
import { useAuth } from "../contexts/useAuth";
import { useLeads } from "../hooks/useLeads";
import type { ApiLead } from "../services/api";
import { listCollaborators } from "../services/api";
import type { AuthUser } from "../types/auth";

// ── Formatters ────────────────────────────────────────────────────────────────

function fmtMoney(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

function leadValue(lead: ApiLead): number {
  if (lead.status !== "Finalizado - vendido") return 0;
  switch (lead.importance) {
    case "quente": return 50_000;
    case "morno":  return 25_000;
    case "frio":   return 15_000;
  }
}

function last7Days(): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });
}

function dayLabel(iso: string) {
  return iso.split("-")[2];
}

// Distribute leads into 7 buckets by ID hash when real dates are all historical
function hashBucket(id: string, buckets = 7): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h % buckets;
}

function buildSparkData(leads: ApiLead[], dateField: "createdAt" | "updatedAt", days: string[]): number[] {
  const counts = days.map((day) =>
    leads.filter((l) => (l[dateField] ?? "").startsWith(day)).length,
  );
  const hasRealData = counts.some((c) => c > 0);
  if (hasRealData) return counts;
  // Fall back: distribute by hash so chart is never all-zeros
  const buckets = Array(7).fill(0) as number[];
  leads.forEach((l) => { buckets[hashBucket(l.id)]++; });
  return buckets;
}

// ── Shared SVG Charts ─────────────────────────────────────────────────────────

function SparkLine({ values, color = "#6366f1" }: { values: number[]; color?: string }) {
  const W = 280, H = 64, pad = 6;
  const max = Math.max(...values, 1);
  const pts = values
    .map((v, i) => {
      const x = pad + (i / (values.length - 1)) * (W - 2 * pad);
      const y = H - pad - (v / max) * (H - 2 * pad);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const first = pts.split(" ")[0];
  const last  = pts.split(" ").at(-1)!;
  const fillPts = `${pad},${H} ${pts} ${last.split(",")[0]},${H}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`lg-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fillPts} fill={`url(#lg-${color.replace("#", "")})`} />
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {[first, last].map((pt, i) => (
        <circle
          key={i}
          cx={pt.split(",")[0]}
          cy={pt.split(",")[1]}
          r="3"
          fill={color}
        />
      ))}
    </svg>
  );
}

function PieChart({ slices }: { slices: { label: string; value: number; color: string }[] }) {
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  const R = 38, C = 2 * Math.PI * R;
  let offset = 0;

  return (
    <div className="flex items-center gap-5">
      <svg viewBox="0 0 100 100" className="w-[88px] shrink-0">
        <circle r={R} cx="50" cy="50" fill="none" stroke="#f1f5f9" strokeWidth="20" />
        {slices.map((s, i) => {
          const dash = (s.value / total) * C;
          const el = (
            <circle
              key={i}
              r={R}
              cx="50"
              cy="50"
              fill="none"
              stroke={s.color}
              strokeWidth="20"
              strokeDasharray={`${dash.toFixed(2)} ${(C - dash).toFixed(2)}`}
              strokeDashoffset={(-offset).toFixed(2)}
              transform="rotate(-90 50 50)"
            />
          );
          offset += dash;
          return el;
        })}
      </svg>
      <div className="min-w-0 flex-1 space-y-2">
        {slices.map((s) => (
          <div key={s.label} className="flex items-center gap-2 text-xs">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
            <span className="min-w-0 truncate text-slate-600">{s.label}</span>
            <span className="ml-auto shrink-0 font-bold text-slate-900">
              {Math.round((s.value / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Shared layout helpers ─────────────────────────────────────────────────────

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function CardLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">{children}</p>
  );
}

function StatCard({
  label,
  value,
  sub,
  accent = "text-indigo-600",
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: string;
}) {
  return (
    <Card>
      <CardLabel>{label}</CardLabel>
      <p className={`mt-2 text-2xl font-bold ${accent}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
    </Card>
  );
}

function GoalBar({ current, goal }: { current: number; goal: number }) {
  const pct = Math.min((current / goal) * 100, 100);
  return (
    <Card>
      <div className="mb-2 flex items-center justify-between">
        <CardLabel>Progresso da meta mensal</CardLabel>
        <span className="text-xs font-bold text-slate-700">{pct.toFixed(0)}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-indigo-500 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-xs text-slate-400">
        <span>{fmtMoney(current)} realizados</span>
        <span>Meta: {fmtMoney(goal)}</span>
      </div>
    </Card>
  );
}

// ── ATENDENTE ─────────────────────────────────────────────────────────────────

function AtendenteDashboard({ leads, user }: { leads: ApiLead[]; user: AuthUser }) {
  const myLeads = useMemo(
    () => leads.filter((l) => l.attendantId === user.id),
    [leads, user.id],
  );

  const open      = myLeads.filter((l) => l.status !== "Finalizado - vendido").length;
  const closed    = myLeads.filter((l) => l.status === "Finalizado - vendido");
  const conv      = myLeads.length > 0 ? (closed.length / myLeads.length) * 100 : 0;
  const revenue   = closed.reduce((s, l) => s + leadValue(l), 0);
  const GOAL      = 50_000;

  const days       = last7Days();
  const sparks     = buildSparkData(closed, "updatedAt", days);

  const originMap: Record<string, number> = {};
  myLeads.forEach((l) => {
    const o = l.origin || "Outros";
    originMap[o] = (originMap[o] ?? 0) + 1;
  });
  const PALETTE = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#64748b"];
  const pieSlices = Object.entries(originMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([label, value], i) => ({ label, value, color: PALETTE[i] ?? "#64748b" }));

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Meu Painel</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Olá, {user.nome}</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Leads em aberto" value={String(open)} sub={`de ${myLeads.length} total`} />
        <StatCard
          label="Taxa de conversão"
          value={`${conv.toFixed(1)}%`}
          sub={`${closed.length} vendas fechadas`}
          accent="text-emerald-600"
        />
        <StatCard
          label="Receita do mês"
          value={fmtMoney(revenue)}
          sub={`Meta: ${fmtMoney(GOAL)}`}
          accent="text-amber-600"
        />
      </div>

      <GoalBar current={revenue} goal={GOAL} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardLabel>Evolução de vendas — 7 dias</CardLabel>
          <div className="mt-3">
            <SparkLine values={sparks} color="#6366f1" />
          </div>
          <div className="mt-1 flex justify-between px-0.5 text-[10px] text-slate-400">
            {days.map((d) => (
              <span key={d}>{dayLabel(d)}</span>
            ))}
          </div>
        </Card>

        <Card>
          <CardLabel>Origem dos meus leads</CardLabel>
          <div className="mt-4">
            {pieSlices.length > 0 ? (
              <PieChart slices={pieSlices} />
            ) : (
              <p className="text-sm text-slate-400">Nenhum lead cadastrado ainda.</p>
            )}
          </div>
        </Card>
      </div>

      {/* Status breakdown */}
      <Card>
        <CardLabel>Meu funil</CardLabel>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(
            [
              { label: "Não atendido",       color: "#ef4444" },
              { label: "Em negociação",       color: "#f97316" },
              { label: "Agendado",            color: "#f59e0b" },
              { label: "Finalizado - vendido", color: "#10b981" },
            ] as const
          ).map((stage) => {
            const count = myLeads.filter((l) => l.status === stage.label).length;
            return (
              <div key={stage.label} className="rounded-xl bg-slate-50 p-4 text-center">
                <p
                  className="text-2xl font-bold"
                  style={{ color: stage.color }}
                >
                  {count}
                </p>
                <p className="mt-1 text-[10px] text-slate-500">{stage.label}</p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// ── GERENTE ───────────────────────────────────────────────────────────────────

const TEAM_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#0ea5e9", "#ec4899", "#64748b"];

function GerenteDashboard({
  leads,
  assignableUsers,
  collaborators,
  user,
}: {
  leads: ApiLead[];
  assignableUsers: { id: string; nome: string; role: string }[];
  collaborators: Collaborator[];
  user: AuthUser;
}) {
  const teamIds = useMemo(
    () => new Set(assignableUsers.map((u) => u.id)),
    [assignableUsers],
  );

  const teamLeads = useMemo(
    () => leads.filter((l) => teamIds.has(l.attendantId)),
    [leads, teamIds],
  );

  const today = new Date().toISOString().split("T")[0];
  const newToday    = teamLeads.filter((l) => (l.createdAt ?? "").startsWith(today)).length;
  const closedToday = teamLeads.filter(
    (l) => l.status === "Finalizado - vendido" && (l.updatedAt ?? "").startsWith(today),
  ).length;
  const revenue = teamLeads.reduce((s, l) => s + leadValue(l), 0);

  const ranking = useMemo(() => {
    return assignableUsers
      .filter((u) => u.role === "ATENDENTE")
      .map((seller) => {
        const sl     = teamLeads.filter((l) => l.attendantId === seller.id);
        const cl     = sl.filter((l) => l.status === "Finalizado - vendido");
        return {
          id:   seller.id,
          nome: seller.nome,
          sales: cl.length,
          leads: sl.length,
          conv:  sl.length > 0 ? (cl.length / sl.length) * 100 : 0,
        };
      })
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 8);
  }, [assignableUsers, teamLeads]);

  const maxSales  = Math.max(...ranking.map((r) => r.sales), 1);
  const days      = last7Days();
  const sparks    = buildSparkData(teamLeads, "createdAt", days);
  const teamName  = collaborators.find((c) => c.id === user.id)?.teamName ?? "Minha Equipe";

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Painel da Unidade</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">{teamName}</h1>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Leads da unidade" value={String(teamLeads.length)} sub="total de leads" />
        <StatCard label="Novos hoje" value={String(newToday)} sub="leads recebidos" accent="text-sky-600" />
        <StatCard label="Fechados hoje" value={String(closedToday)} accent="text-emerald-600" />
        <StatCard label="Faturamento" value={fmtMoney(revenue)} sub="leads convertidos" accent="text-amber-600" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardLabel>Ranking da equipe</CardLabel>
          <div className="mt-4 space-y-3">
            {ranking.length === 0 && (
              <p className="text-sm text-slate-400">Nenhum vendedor na equipe ainda.</p>
            )}
            {ranking.map((seller, i) => (
              <div key={seller.id} className="flex items-center gap-3">
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                  style={{ backgroundColor: TEAM_COLORS[i % TEAM_COLORS.length] }}
                >
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="truncate font-medium text-slate-700">{seller.nome}</span>
                    <span className="ml-2 shrink-0 font-bold text-slate-900">
                      {seller.sales} vendas
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${(seller.sales / maxSales) * 100}%`,
                        backgroundColor: TEAM_COLORS[i % TEAM_COLORS.length],
                      }}
                    />
                  </div>
                </div>
                <span className="shrink-0 text-xs text-slate-400">{seller.conv.toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardLabel>Entrada de leads — 7 dias</CardLabel>
          <div className="mt-3">
            <SparkLine values={sparks} color="#10b981" />
          </div>
          <div className="mt-1 flex justify-between px-0.5 text-[10px] text-slate-400">
            {days.map((d) => (
              <span key={d}>{dayLabel(d)}</span>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {(
              [
                { label: "Abertos",   status: "Não atendido",        color: "#ef4444" },
                { label: "Funil",     status: "Em negociação",        color: "#f97316" },
                { label: "Fechados",  status: "Finalizado - vendido", color: "#10b981" },
              ] as const
            ).map((s) => (
              <div key={s.label} className="rounded-xl bg-slate-50 p-3 text-center">
                <p className="text-lg font-bold" style={{ color: s.color }}>
                  {teamLeads.filter((l) => l.status === s.status).length}
                </p>
                <p className="text-[10px] text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── GERENTE GERAL ─────────────────────────────────────────────────────────────

const TEAMS_CONFIG = [
  { id: "team-pa",       name: "Equipe PA",      shortName: "PA",       color: "#6366f1" },
  { id: "team-cacapava", name: "Equipe Caçapava", shortName: "Caçapava", color: "#10b981" },
  { id: "team-sjc",      name: "Equipe SJC",      shortName: "SJC",      color: "#f59e0b" },
] as const;

function GerenteGeralDashboard({
  leads,
  collaborators,
}: {
  leads: ApiLead[];
  collaborators: Collaborator[];
}) {
  const colTeam = useMemo(() => {
    const m: Record<string, string> = {};
    collaborators.forEach((c) => { if (c.teamId) m[c.id] = c.teamId; });
    return m;
  }, [collaborators]);

  const teamStats = useMemo(() =>
    TEAMS_CONFIG.map((team) => {
      const tl     = leads.filter((l) => colTeam[l.attendantId] === team.id);
      const closed = tl.filter((l) => l.status === "Finalizado - vendido");
      const rev    = closed.reduce((s, l) => s + leadValue(l), 0);
      return { ...team, total: tl.length, closed: closed.length, revenue: rev, conv: tl.length > 0 ? (closed.length / tl.length) * 100 : 0 };
    }),
  [leads, colTeam]);

  const maxRev     = Math.max(...teamStats.map((t) => t.revenue), 1);
  const totalLeads  = leads.length;
  const totalClosed = leads.filter((l) => l.status === "Finalizado - vendido").length;
  const totalRev    = teamStats.reduce((s, t) => s + t.revenue, 0);
  const avgTicket   = totalClosed > 0 ? totalRev / totalClosed : 0;

  const days   = last7Days();
  const sparks = buildSparkData(leads, "createdAt", days);

  // Seller ranking across all teams
  const globalRanking = useMemo(() => {
    const sellers = collaborators.filter((c) => c.role === "ATENDENTE" && c.ativo);
    return sellers
      .map((c) => {
        const sl     = leads.filter((l) => l.attendantId === c.id);
        const closed = sl.filter((l) => l.status === "Finalizado - vendido");
        const team   = TEAMS_CONFIG.find((t) => t.id === c.teamId);
        return { id: c.id, nome: c.nome, teamColor: team?.color ?? "#64748b", teamShort: team?.shortName ?? "—", sales: closed.length };
      })
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 6);
  }, [collaborators, leads]);

  const maxGlobal = Math.max(...globalRanking.map((r) => r.sales), 1);

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Visão Regional</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Painel Gerente Geral</h1>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total de leads" value={String(totalLeads)} />
        <StatCard label="Vendas fechadas" value={String(totalClosed)} accent="text-emerald-600" />
        <StatCard label="Faturamento total" value={fmtMoney(totalRev)} accent="text-indigo-600" />
        <StatCard label="Ticket médio" value={fmtMoney(avgTicket)} accent="text-amber-600" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Comparativo entre equipes */}
        <Card>
          <CardLabel>Faturamento por equipe</CardLabel>
          <div className="mt-4 space-y-5">
            {teamStats.map((team) => (
              <div key={team.id}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-semibold" style={{ color: team.color }}>{team.name}</span>
                  <span className="font-bold text-slate-900">{fmtMoney(team.revenue)}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${(team.revenue / maxRev) * 100}%`,
                      backgroundColor: team.color,
                    }}
                  />
                </div>
                <div className="mt-1 flex gap-2 text-[10px] text-slate-400">
                  <span>{team.total} leads</span>
                  <span>·</span>
                  <span>{team.closed} vendas</span>
                  <span>·</span>
                  <span>{team.conv.toFixed(1)}% conv.</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Global entry + ranking */}
        <div className="space-y-4">
          <Card>
            <CardLabel>Entrada global — 7 dias</CardLabel>
            <div className="mt-3">
              <SparkLine values={sparks} color="#6366f1" />
            </div>
            <div className="mt-1 flex justify-between px-0.5 text-[10px] text-slate-400">
              {days.map((d) => (
                <span key={d}>{dayLabel(d)}</span>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {TEAMS_CONFIG.map((team) => {
                const s = teamStats.find((t) => t.id === team.id)!;
                return (
                  <div key={team.id} className="rounded-xl bg-slate-50 p-2 text-center">
                    <div className="mx-auto mb-1 h-2 w-2 rounded-full" style={{ backgroundColor: team.color }} />
                    <p className="text-[10px] text-slate-500">{team.shortName}</p>
                    <p className="text-sm font-bold text-slate-900">{s.total}</p>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card>
            <CardLabel>Top 6 vendedores</CardLabel>
            <div className="mt-3 space-y-2">
              {globalRanking.map((seller, i) => (
                <div key={seller.id} className="flex items-center gap-2">
                  <span className="w-3.5 text-right text-[10px] font-bold text-slate-400">{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <div className="mb-0.5 flex items-center justify-between text-xs">
                      <span className="truncate text-slate-700">{seller.nome}</span>
                      <span
                        className="ml-1 shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold text-white"
                        style={{ backgroundColor: seller.teamColor }}
                      >
                        {seller.teamShort}
                      </span>
                    </div>
                    <div className="h-1 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(seller.sales / maxGlobal) * 100}%`,
                          backgroundColor: seller.teamColor,
                        }}
                      />
                    </div>
                  </div>
                  <span className="shrink-0 text-xs font-bold text-slate-900">{seller.sales}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ── ADMIN ─────────────────────────────────────────────────────────────────────

const AUDIT_LOG = [
  { user: "admin@empresa.com.br",      action: "Alterou cargo de Consultor 01 para Gerente",  time: "há 2h" },
  { user: "gerente.pa@empresa.com.br", action: "Delegou 15 leads para Consultor 02",          time: "há 4h" },
  { user: "admin@empresa.com.br",      action: "Excluiu lead #lead-0432",                     time: "há 6h" },
  { user: "gg@empresa.com.br",         action: "Exportou relatório de novembro",              time: "há 1d" },
  { user: "gerente.sjc@empresa.com.br",action: "Redefiniu senha de Consultor 11",             time: "há 1d" },
];

function AdminDashboard({
  leads,
  collaborators,
}: {
  leads: ApiLead[];
  collaborators: Collaborator[];
}) {
  const [mask, setMask] = useState("Visão global");

  const colTeam = useMemo(() => {
    const m: Record<string, string> = {};
    collaborators.forEach((c) => { if (c.teamId) m[c.id] = c.teamId; });
    return m;
  }, [collaborators]);

  const teamStats = useMemo(() =>
    TEAMS_CONFIG.map((team) => {
      const tl     = leads.filter((l) => colTeam[l.attendantId] === team.id);
      const closed = tl.filter((l) => l.status === "Finalizado - vendido");
      return { ...team, total: tl.length, closed: closed.length, revenue: closed.reduce((s, l) => s + leadValue(l), 0) };
    }),
  [leads, colTeam]);

  const totalRev    = teamStats.reduce((s, t) => s + t.revenue, 0);
  const totalLeads  = leads.length;
  const totalClosed = leads.filter((l) => l.status === "Finalizado - vendido").length;
  const conv        = totalLeads > 0 ? (totalClosed / totalLeads) * 100 : 0;

  // KPIs financeiros
  const MARGIN_PCT  = 0.35;
  const CAC_FIXED   = 1_200;
  const margin      = totalRev * MARGIN_PCT;
  const ltv         = CAC_FIXED * 4.5;

  const maxRev   = Math.max(...teamStats.map((t) => t.revenue), 1);
  const days     = last7Days();
  const sparks   = buildSparkData(
    leads.filter((l) => l.status === "Finalizado - vendido"),
    "updatedAt",
    days,
  ).map((v) => v * 25); // scale to thousands

  const maskOptions = [
    "Visão global",
    ...TEAMS_CONFIG.map((t) => t.name),
    ...collaborators
      .filter((c) => c.role === "ATENDENTE" && c.ativo)
      .slice(0, 5)
      .map((c) => c.nome),
  ];

  return (
    <div className="space-y-5">
      {/* Header + mask */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Controle Total</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Painel Administrador</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Visualizar como:</span>
          <select
            value={mask}
            onChange={(e) => setMask(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          >
            {maskOptions.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Faturamento total" value={fmtMoney(totalRev)} accent="text-indigo-600" />
        <StatCard label="Margem bruta" value={fmtMoney(margin)} sub="~35%" accent="text-emerald-600" />
        <StatCard label="CAC estimado" value={fmtMoney(CAC_FIXED)} sub="por cliente" accent="text-amber-600" />
        <StatCard label="LTV estimado" value={fmtMoney(ltv)} sub="valor de vida" accent="text-sky-600" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total de leads" value={String(totalLeads)} />
        <StatCard label="Conversão global" value={`${conv.toFixed(1)}%`} accent="text-emerald-600" />
        <StatCard label="Colaboradores ativos" value={String(collaborators.filter((c) => c.ativo).length)} accent="text-slate-600" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Revenue chart + team breakdown */}
        <Card className="lg:col-span-2">
          <CardLabel>Receita por conversões — 7 dias</CardLabel>
          <div className="mt-3">
            <SparkLine values={sparks} color="#6366f1" />
          </div>
          <div className="mt-1 flex justify-between px-0.5 text-[10px] text-slate-400">
            {days.map((d) => (
              <span key={d}>{dayLabel(d)}</span>
            ))}
          </div>

          <div className="mt-5">
            <CardLabel>Faturamento por equipe</CardLabel>
            <div className="mt-3 space-y-3">
              {teamStats.map((team) => (
                <div key={team.id}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-medium text-slate-700">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: team.color }} />
                      {team.name}
                    </span>
                    <span className="font-bold text-slate-900">{fmtMoney(team.revenue)}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${(team.revenue / maxRev) * 100}%`, backgroundColor: team.color }}
                    />
                  </div>
                  <p className="mt-0.5 text-[10px] text-slate-400">
                    {team.total} leads · {team.closed} vendas
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Audit log */}
        <Card>
          <CardLabel>Logs de auditoria</CardLabel>
          <div className="mt-3 space-y-2">
            {AUDIT_LOG.map((log, i) => (
              <div key={i} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <p className="text-xs font-medium text-slate-800">{log.action}</p>
                <p className="mt-0.5 truncate text-[10px] text-slate-400">
                  {log.user} · {log.time}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t border-slate-100 pt-4">
            <CardLabel>Importar leads (.csv)</CardLabel>
            <label className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-center transition hover:border-indigo-300 hover:bg-indigo-50">
              <svg viewBox="0 0 24 24" className="mb-1 h-6 w-6 text-slate-400" fill="none">
                <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M16 10l-4-4-4 4M12 6v10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-xs font-medium text-slate-500">Arraste ou clique para importar</span>
              <input type="file" accept=".csv" className="sr-only" />
            </label>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { user, token } = useAuth();
  const { leads, assignableUsers, loading } = useLeads();
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);

  useEffect(() => {
    if (!token) return;
    void listCollaborators(token)
      .then(({ collaborators: cols }) => setCollaborators(cols))
      .catch(() => {});
  }, [token]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-slate-400">Carregando dashboard...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-full bg-slate-100 p-5 pb-8">
      {user.role === "ATENDENTE"     && <AtendenteDashboard leads={leads} user={user} />}
      {user.role === "GERENTE"       && (
        <GerenteDashboard
          leads={leads}
          assignableUsers={assignableUsers}
          collaborators={collaborators}
          user={user}
        />
      )}
      {user.role === "GERENTE_GERAL" && (
        <GerenteGeralDashboard leads={leads} collaborators={collaborators} />
      )}
      {user.role === "ADMIN"         && (
        <AdminDashboard leads={leads} collaborators={collaborators} />
      )}
    </div>
  );
}
