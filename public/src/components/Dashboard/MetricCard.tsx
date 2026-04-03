interface MetricCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: 'blue' | 'green' | 'yellow' | 'red';
}
export default function MetricCard({ title, value, icon, color }: MetricCardProps) {
    const colorClasses = {
        blue: 'bg-blue-100 text-blue-500',
        green: 'bg-green-100 text-green-500',
        yellow: 'bg-yellow-100 text-yellow-500',
        red: 'bg-red-100 text-red-500',
    };
    
    const iconBGClasses = {
        blue: 'bg-blue-500 text-white',
        green: 'bg-green-500 text-white',
        yellow: 'bg-yellow-500 text-white',
        red: 'bg-red-500 text-white',
    };

    return(
        <div className={`rounded-2xl border p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow ${colorClasses[color]}`}>
            {/* Ícone com fundo colorido */}
            <div className={`p-3 rounded-full ${iconBGClasses[color]}`}>
                {icon}
            </div>
            {/* Infos */}
            <div>
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="text-2xl font-bold">{value}</p>
            </div>
        </div>

    )
}