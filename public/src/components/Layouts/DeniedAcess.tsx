import { useNavigate } from 'react-router-dom'; // Importa o hook de navegação

export default function DeniedAccess() {
    const navigate = useNavigate(); // Inicializa o hook

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center animate-fadeIn">
            {/* Ícone de Cadeado/Alerta */}
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-rose-50 text-rose-600 border border-rose-100 shadow-sm mb-6">
                <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 0v2m0-2h2m-2 0H10m3-13a4 4 0 00-8 0v4h3a2 2 0 002 2h4a2 2 0 002-2h3V9a4 4 0 00-8 0zM5 13a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2H5z" />
                </svg>
            </div>

            {/* Textos de Feedback */}
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Área Restrita da Gerência
            </h2>
            <p className="mt-2 max-w-md text-sm text-slate-500 leading-relaxed">
                Ops! O seu perfil de acesso não possui permissionamento para visualizar os Dashboards Comerciais e Analíticos.
            </p>

            {/* Ação para o Vendedor retornar */}
            <div className="mt-8">
                <button
                    type="button"
                    onClick={() => navigate('/leads')} // Redireciona via React Router
                    className="inline-flex items-center justify-center rounded-3xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 shadow-sm"
                >
                    Voltar para Meus Leads
                </button>
            </div>
        </div>
    );
}