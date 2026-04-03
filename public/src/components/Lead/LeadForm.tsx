interface LeadFromProps {
    onclose: () => void;
}

export default function LeadForm({ onclose }: LeadFromProps) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            {/* Modal */}
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md flex flex-center">
                {/* Cabeçalho */}
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800">Novo Lead</h2>
                    <button onClick={onclose} className="text-gray-400 hover:text-gray-600">:X</button>
                </div>
            </div>

            <hr className="my-4 border-gray-300" />
            {/* Campos de preenchimento */}
            <form className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Nome
                    </label>
                    <input
                        type="text"
                        id="name"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Digite o nome do lead"
                    />
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Telefone
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Digite o telefone do lead"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Digite o email do lead"
                    />
                </div>
                <div>
                    <label htmlFor="interest" className="block text-sm font-medium text-gray-700">
                        Interesse
                    </label>
                    <input
                        type="text"
                        id="interest"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Digite o interesse do lead"
                    />
                </div>
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                        Status
                    </label>
                    <select
                        id="status"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="Novo">Novo</option>
                        <option value="Em andamento">Em andamento</option>
                        <option value="Fechado">Fechado</option>
                    </select>
                </div>
            </form>
            {/* Botões de ação */}
            <div className="mt-6 flex justify-end gap-4">
                <button
                    onClick={onclose}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                    Cancelar
                </button>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Salvar
                </button>

            </div>
        </div>)
}