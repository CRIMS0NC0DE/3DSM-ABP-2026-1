interface LeadCardProps {
  name: string;
  interest: string;
  states: string;
  value?: string;
  origin?: string;
  tags?: string[];
  company?: string;
  onEdit?: () => void;
}

export default function LeadCard({
  name,
  interest,
  value,
  origin,
  tags,
  company,
  onEdit,
}: LeadCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm select-none cursor-grab active:cursor-grabbing">
      <div className="flex items-start justify-between gap-2 px-3 pt-3 pb-1">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-800">{name}</p>
          {company && (
            <p className="truncate text-[11px] text-slate-400">{company}</p>
          )}
        </div>
        <GripIcon />
      </div>

      <div className="flex items-center gap-1.5 px-3 pb-2">
        <CarIcon />
        <p className="truncate text-[11px] text-slate-500">{interest}</p>
      </div>

      {(value ?? origin ?? (tags && tags.length > 0)) && (
        <div className="flex flex-wrap items-center gap-1 px-3 pb-2">
          {value && (
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-100">
              {value}
            </span>
          )}
          {origin && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500">
              {origin}
            </span>
          )}
          {tags?.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-600 border border-amber-100"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {onEdit && (
        <div className="px-2 pb-2">
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 py-1.5 text-[11px] font-semibold text-blue-600 transition hover:bg-blue-100 hover:border-blue-300"
          >
            <PencilIcon />
            Editar lead
          </button>
        </div>
      )}
    </div>
  );
}

function GripIcon() {
  return (
    <svg width="10" height="14" viewBox="0 0 10 14" fill="#cbd5e1" className="mt-0.5 shrink-0">
      <circle cx="2.5" cy="2.5" r="1.2" />
      <circle cx="7.5" cy="2.5" r="1.2" />
      <circle cx="2.5" cy="7" r="1.2" />
      <circle cx="7.5" cy="7" r="1.2" />
      <circle cx="2.5" cy="11.5" r="1.2" />
      <circle cx="7.5" cy="11.5" r="1.2" />
    </svg>
  );
}

function CarIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <path d="M14 16H9m10 0h3v-3.13a4 4 0 0 0-1.24-2.83L19 8h-5" />
      <path d="M7 8H5L3.04 10.04A4 4 0 0 0 2 12.87V16h2" />
      <circle cx="6.5" cy="16.5" r="2.5" />
      <circle cx="16.5" cy="16.5" r="2.5" />
      <path d="M2 12h20" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}
