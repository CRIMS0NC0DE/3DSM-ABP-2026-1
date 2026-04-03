interface LeadProps {
    name: string;
    email: string;
    interest: string;
    phone: string;
    states: 'Novo' | 'Em andamento' | 'Fechado';
}

export default function LeadCard({ name, email, interest, phone, states }: LeadProps) {

    function getStatusColor(status: string) {
        switch (status) {
            case 'Novo':
                return 'text-green-500';
            case 'Em andamento':
                return 'text-yellow-500';
            case 'Fechado':
                return 'text-red-500';
            default:
                return 'text-gray-500';
        }
    }


    return (
        <div className="bg-white shadow-md rounded-lg p-4">
            {/* Nome e Status */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800">{name}</h2>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(states)}`}>
                    {states}
                </span>
            </div>
            {/* Informações */}
            <div className="text-sm text-gray-500 flex flex-col gap1-1">
                <p className="text-sm text-gray-600 mb-1">Email: {email}</p>
                <p className="text-sm text-gray-600 mb-1">Interesse: {interest}</p>
                <p className="text-sm text-gray-600 mb-1">Telefone: {phone}</p>
            </div>

            {/* Aba de Ações */}
            <div className="flex gap-2">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Ver detalhes
                </button>
                <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
                    Editar
                </button>
                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                    Excluir
                </button>
            </div>
        </div>
    );
}