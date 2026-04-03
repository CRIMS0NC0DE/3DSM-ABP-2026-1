import Navbar from '../components/Layouts/Navbar'
import Logo from '../assets/logo_1000.svg'
import LeadCard from '../components/Lead/LeadCard'
import LeadForm from '../components/Lead/LeadForm'
import { useState } from 'react';
import MetricCard from '../components/Dashboard/MetricCard';

export default function Homepage() {
    const [showLeadForm, setShowLeadForm] = useState(false);
    return (
        <div className="relative min-h-screen bg-gray-100">
            <Navbar />

            {/* Marca d'água */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <img src={Logo} alt="" className="w-96 h-96 opacity-5" />
            </div>

            {/* Conteúdo */}
            <main className="relative z-10 p-6 flex flex-col gap-4">
                {/* Métricas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricCard title="Total de Leads" value={150} icon={<span>👥</span>} color="blue" />
                    <MetricCard title="Leads Novos" value={30} icon={<span>🆕</span>} color="green" />
                    <MetricCard title="Em Andamento" value={60} icon={<span>🔄</span>} color="yellow" />
                    <MetricCard title="Fechados" value={60} icon={<span>✅</span>} color="red" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Leads</h1>
                {/* Conteúdo */}
                <div className="flex justify-end">
                    <button onClick={() => setShowLeadForm(true)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        Adicionar Lead
                    </button>
                </div>
                {/* Cards de teste */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <LeadCard name="Marcio" phone="(11) 99999-0001" interest="Honda Civic" states="Novo" email='123@bol.com.br' />
                    <LeadCard name="Vini" phone="(11) 99999-0002" interest="Toyota Corolla" states="Em andamento" email='456@bol.com.br' />
                    <LeadCard name="Eric" phone="(11) 99999-0003" interest="Jeep Compass" states="Fechado" email='789@bol.com.br' />
                </div>
            </main>
            {/* Visualização de Modal com informações do lead */}
            {showLeadForm && <LeadForm onclose={() => setShowLeadForm(false)} />}
        </div>
    )
}