import React, { useState } from 'react';
import MetricCard from '../Dashboard/MetricCard'; // Importando o seu componente base

// Tipagem para os filtros de período
type PeriodoFiltro = 'semana' | 'mes' | 'ano' | 'customizado';

export default function DashboardGerenteLoja() {
    // Estados para controle dos filtros
    const [periodo, setPeriodo] = useState<PeriodoFiltro>('mes');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-10 text-slate-800">
            
            {/* Cabeçalho e Filtros */}
            <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard da Loja</h1>
                    <p className="text-sm text-slate-500 mt-1">Acompanhe os indicadores de leads e conversões da sua unidade em tempo real.</p>
                </div>

                {/* Bloco de Filtros */}
                <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
                    {(['semana', 'mes', 'ano'] as const).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriodo(p)}
                            className={`rounded-xl px-4 py-2 text-sm font-medium capitalize transition ${
                                periodo === p 
                                    ? 'bg-slate-900 text-white shadow-sm' 
                                    : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            Este {p === 'mes' ? 'Mês' : p}
                        </button>
                    ))}
                    
                    <button
                        onClick={() => setPeriodo('customizado')}
                        className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                            periodo === 'customizado' 
                                ? 'bg-slate-900 text-white shadow-sm' 
                                : 'text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                        Customizado
                    </button>

                    {/* Inputs de data para período customizado */}
                    {periodo === 'customizado' && (
                        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 animate-fadeIn">
                            <input 
                                type="date" 
                                value={dataInicio}
                                onChange={(e) => setDataInicio(e.target.value)}
                                className="rounded-lg border border-slate-200 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-slate-400"
                            />
                            <span className="text-xs text-slate-400">até</span>
                            <input 
                                type="date" 
                                value={dataFim}
                                onChange={(e) => setDataFim(e.target.value)}
                                className="rounded-lg border border-slate-200 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-slate-400"
                            />
                        </div>
                    )}
                </div>
            </header>

            {/* --- SEÇÃO 1: Cards Métricas Principais (Usando seu MetricCard) --- */}
            <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <MetricCard 
                    title="Total de Leads" 
                    value={1248} 
                    color="blue"
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                />
                <MetricCard 
                    title="Leads Quentes" 
                    value={412} 
                    color="red"
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>}
                />
                <MetricCard 
                    title="Vendas Finalizadas" 
                    value={284} 
                    color="green"
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
                <MetricCard 
                    title="Média de Conversão" 
                    value="22.7%" 
                    color="yellow"
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
                />
            </section>

            {/* --- SEÇÃO 2: Status, Importância e Origens --- */}
            <section className="grid gap-8 lg:grid-cols-3 mb-8">
                
                {/* Leads por Status */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">Leads por Status</h2>
                    <div className="space-y-3">
                        {[
                            { name: 'Lead Novo', count: 320, color: 'bg-blue-500' },
                            { name: 'Em Atendimento', count: 450, color: 'bg-amber-500' },
                            { name: 'Em Negociação', count: 180, color: 'bg-purple-500' },
                            { name: 'Venda Finalizada', count: 214, color: 'bg-emerald-500' },
                            { name: 'Perdido', count: 84, color: 'bg-rose-500' },
                        ].map((item) => (
                            <div key={item.name} className="space-y-1">
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-slate-600">{item.name}</span>
                                    <span className="text-slate-900">{item.count}</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full">
                                    <div className={`${item.color} h-2 rounded-full`} style={{ width: `${(item.count / 1248) * 100}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Leads por Origem */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">Leads por Origem</h2>
                    <div className="space-y-4">
                        {[
                            { name: 'WhatsApp', count: 620, percent: '50%' },
                            { name: 'Instagram', count: 310, percent: '25%' },
                            { name: 'Facebook', count: 188, percent: '15%' },
                            { name: 'Visita Presencial', count: 130, percent: '10%' },
                        ].map((origem) => (
                            <div key={origem.name} className="flex items-center justify-between border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                                <span className="text-sm font-medium text-slate-600">{origem.name}</span>
                                <div className="text-right">
                                    <span className="text-sm font-bold text-slate-900 block">{origem.count}</span>
                                    <span className="text-xs text-slate-400">{origem.percent}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Leads por Importância (Temperatura) */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 mb-4">Leads por Importância</h2>
                        <div className="grid grid-cols-3 gap-3 text-center mt-4">
                            <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100">
                                <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider block">Quente</span>
                                <span className="text-2xl font-bold text-rose-900 block mt-1">412</span>
                            </div>
                            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
                                <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider block">Morno</span>
                                <span className="text-2xl font-bold text-amber-900 block mt-1">536</span>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                                <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider block">Frio</span>
                                <span className="text-2xl font-bold text-blue-900 block mt-1">300</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Motivos de Finalização / Perda */}
                    <div className="mt-6 pt-6 border-t border-slate-100">
                        <h3 className="text-sm font-bold text-slate-900 mb-2">Principais Motivos de Perda</h3>
                        <p className="text-xs text-slate-500 mb-3">Principais razões para o arquivamento de leads na loja.</p>
                        <ul className="text-xs space-y-2">
                            <li className="flex justify-between text-slate-600"><span>Preço muito alto</span> <span className="font-semibold text-slate-900">45%</span></li>
                            <li className="flex justify-between text-slate-600"><span>Sem estoque do produto</span> <span className="font-semibold text-slate-900">30%</span></li>
                            <li className="flex justify-between text-slate-600"><span>Comprou no concorrente</span> <span className="font-semibold text-slate-900">25%</span></li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* --- SEÇÃO 3: Tempo de Resposta e Desempenho de Atendentes --- */}
            <section className="grid gap-8 lg:grid-cols-2">
                
                {/* Tempo Médio de Primeiro Atendimento (Substituindo Distribuição por Loja) */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">Tempo Médio de Primeiro Atendimento</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { name: 'WhatsApp', count: '14 min', color: 'border-l-4 border-green-500' },
                            { name: 'Instagram', count: '28 min', color: 'border-l-4 border-purple-500' },
                            { name: 'Facebook', count: '35 min', color: 'border-l-4 border-blue-500' },
                            { name: 'Site / Formulário', count: '42 min', color: 'border-l-4 border-slate-400' },
                        ].map((canal) => (
                            <div key={canal.name} className={`bg-slate-50 p-4 rounded-2xl ${canal.color}`}>
                                <span className="text-xs font-semibold text-slate-500 block">{canal.name}</span>
                                <span className="text-xl font-bold text-slate-900 block mt-1">{canal.count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Taxa de Conversão por Atendente */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">Taxa de Conversão por Atendente</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    <th className="pb-3">Nome</th>
                                    <th className="pb-3 text-center">Atendidos</th>
                                    <th className="pb-3 text-center">Vendas</th>
                                    <th className="pb-3 text-right">Taxa</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {[
                                    { nome: 'Carlos Silva', atendidos: 150, vendas: 45, taxa: '30.0%' },
                                    { nome: 'Ana Costa', atendidos: 180, vendas: 40, taxa: '22.2%' },
                                    { nome: 'Mariana Souza', atendidos: 130, vendas: 26, taxa: '20.0%' },
                                    { nome: 'Pedro Henrique', atendidos: 90, vendas: 12, taxa: '13.3%' },
                                ].map((atendente, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition">
                                        <td className="py-3 font-medium text-slate-900">{atendente.nome}</td>
                                        <td className="py-3 text-center text-slate-600">{atendente.atendidos}</td>
                                        <td className="py-3 text-center text-slate-600">{atendente.vendas}</td>
                                        <td className="py-3 text-right font-semibold text-emerald-600">{atendente.taxa}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </section>
        </div>
    );
}