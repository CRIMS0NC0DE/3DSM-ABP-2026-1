interface MetricCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: 'blue' | 'green' | 'yellow' | 'red';
}
export default function MetricCard({ title, value, icon, color }: MetricCardProps) {
    const wrapperClasses = 'rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm transition hover:shadow-md';

    const iconBGClasses = {
        blue: 'bg-blue-100 text-blue-700',
        green: 'bg-emerald-100 text-emerald-700',
        yellow: 'bg-amber-100 text-amber-700',
        red: 'bg-rose-100 text-rose-700',
    };

    const titleClasses = 'text-sm font-semibold uppercase tracking-[0.16em] text-slate-500';
    const valueClasses = 'mt-2 text-2xl font-semibold text-slate-900';

    return (
        <div className={`${wrapperClasses} flex items-center gap-4`}>
            <div className={`flex h-12 w-12 items-center justify-center rounded-3xl ${iconBGClasses[color]}`}>
                {icon}
            </div>
            <div>
                <h3 className={titleClasses}>{title}</h3>
                <p className={valueClasses}>{value}</p>
            </div>
        </div>
    );
}