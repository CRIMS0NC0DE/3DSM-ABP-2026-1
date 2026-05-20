import { useState, useMemo } from 'react';
import MetricCard from '../Dashboard/MetricCard';
import DynamicIcon from '../UI/DynamicIcon';

type PeriodoFiltro = 'semana' | 'mes' | 'ano' | 'customizado';
type VisaoAtiva = 'comercial' | 'analitico';

export default function DashboardGerenteGeral() {
    // Estados de Controle Globais
    const [visao, setVisao] = useState<VisaoAtiva>('comercial');
    const [periodo, setPeriodo] = useState<PeriodoFiltro>('mes');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');

    // Dados reativos tratados com fallbacks seguros para evitar quebras de runtime
    const dadosFiltrados = useMemo(() => {
        if (periodo === 'semana') {
            return {
                kpis: { total: 620, quentes: 140, vendas: 110, meta: "65%" },
                origens: [
                    { name: 'WhatsApp', count: 260, pct: '42%' },
                    { name: 'Instagram', count: 160, pct: '26%' },
                    { name: 'Contato Telefônico', count: 86, pct: '14%' },
                    { name: 'Visita na Loja', count: 68, pct: '11%' },
                    { name: 'Formulários Digitais', count: 46, pct: '7%' },
                ],
                importancia: { quente: 140, morno: 280, frio: 200 },
                equipes: [
                    { nome: 'Loja SJC', leads: 250, taxa: '22.1%', color: 'bg-blue-500', maxBar: '100%' },
                    { nome: 'Loja PA', leads: 210, taxa: '19.5%', color: 'bg-emerald-500', maxBar: '84%' },
                    { nome: 'Loja CA', leads: 160, taxa: '15.0%', color: 'bg-amber-500', maxBar: '64%' },
                ],
                funil: { convertidos: 110, perdidos: 510, pctConvertidos: 17.7 },
                atendentes: [
                    { nome: 'Carlos Silva', equipe: 'Loja SJC', leads: 95, tempo: '10 min', taxa: '23.5%' },
                    { nome: 'Ana Costa', equipe: 'Loja PA', leads: 88, tempo: '08 min', taxa: '21.0%' }
                ]
            };
        }

        // Dados padrão para 'mes', 'ano' ou quando 'customizado' estiver ativo
        return {
            kpis: { total: 2840, quentes: 890, vendas: 522, meta: "74%" },
            origens: [
                { name: 'WhatsApp', count: 1192, pct: '42%' },
                { name: 'Instagram', count: 738, pct: '26%' },
                { name: 'Contato Telefônico', count: 398, pct: '14%' },
                { name: 'Visita na Loja', count: 312, pct: '11%' },
                { name: 'Formulários Digitais', count: 200, pct: '7%' },
            ],
            importancia: { quente: 890, morno: 1250, frio: 700 },
            equipes: [
                { nome: 'Loja SJC', leads: 1100, taxa: '22.4%', color: 'bg-blue-500', maxBar: '100%' },
                { nome: 'Loja PA', leads: 950, taxa: '18.1%', color: 'bg-emerald-500', maxBar: '86%' },
                { nome: 'Loja CA', leads: 790, taxa: '14.8%', color: 'bg-amber-500', maxBar: '71%' },
            ],
            funil: { convertidos: 522, perdidos: 2318, pctConvertidos: 18.4 },
            atendentes: [
                { nome: 'Carlos Silva', equipe: 'Loja SJC', leads: 420, tempo: '11 min', taxa: '24.5%' },
                { nome: 'Ana Costa', equipe: 'Loja PA', leads: 390, tempo: '09 min', taxa: '21.0%' },
                { nome: 'Mariana Souza', equipe: 'Loja SJC', leads: 410, tempo: '16 min', taxa: '18.2%' },
                { nome: 'Pedro Henrique', equipe: 'Loja CA', leads: 350, tempo: '22 min', taxa: '11.4%' }
            ]
        };
    }, [periodo, dataInicio, dataFim]);

    return (
        <div className="w-full bg-slate-50 min-h-screen text-slate-800 p-6 md:p-10">
            
            {/* --- CABEÇALHO E FILTROS GLOBAIS --- */}
            <header className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-slate-200 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Gerente Geral</h1>
                    <p className="text-sm text-slate-500 mt-1">Gestão unificada das equipes SJC, PA e CA, origens de tráfego e funil analítico.</p>
                </div>

                {/* Filtro Temporal Unificado */}
                <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm self-start lg:self-center">
                    {(['semana', 'mes', 'ano'] as const).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriodo(p)}
                            className={`rounded-xl px-4 py-2 text-sm font-medium capitalize transition ${
                                periodo === p ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            {p === 'mes' ? 'Mês' : p}
                        </button>
                    ))}
                    <button
                        onClick={() => setPeriodo('customizado')}
                        className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                            periodo === 'customizado' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                        Customizado
                    </button>

                    {periodo === 'customizado' && (
                        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 animate-fadeIn">
                            <input 
                                type="date" 
                                value={dataInicio} 
                                onChange={(e) => setDataInicio(e.target.value)} 
                                className="rounded-lg border border-slate-200 px-2 py-1 text-xs focus:ring-2 focus:ring-slate-400 outline-none"
                            />
                            <span className="text-xs text-slate-400">até</span>
                            <input 
                                type="date" 
                                value={dataFim} 
                                onChange={(e) => setDataFim(e.target.value)} 
                                className="rounded-lg border border-slate-200 px-2 py-1 text-xs focus:ring-2 focus:ring-slate-400 outline-none"
                            />
                        </div>
                    )}
                </div>
            </header>

            {/* --- SELETOR DE SUBMENUS (SUB-ABAS) --- */}
            <div className="flex border-b border-slate-200 mb-8 gap-6">
                <button 
                    onClick={() => setVisao('comercial')}
                    className={`pb-4 text-base font-semibold transition-all relative ${visao === 'comercial' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    Dashboard Comercial
                    {visao === 'comercial' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#b81414] rounded-full" />}
                </button>
                <button 
                    onClick={() => setVisao('analitico')}
                    className={`pb-4 text-base font-semibold transition-all relative ${visao === 'analitico' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    Dashboard Analítico
                    {visao === 'analitico' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#b81414] rounded-full" />}
                </button>
            </div>

            {/* ========================================================= */}
            {/* --- SUBMENU 1: DASHBOARD COMERCIAL ---------------------- */}
            {/* ========================================================= */}
            {visao === 'comercial' && (
                <div className="space-y-8 animate-fadeIn">
                    
                    {/* Linha Superior de Métricas Corporativas (Usando seu MetricCard) */}
                    <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        <MetricCard title="Total de Leads" value={dadosFiltrados.kpis.total} color="blue" icon={<DynamicIcon name="total" className="h-6 w-6" />} />
                        <MetricCard title="Leads Quentes" value={dadosFiltrados.kpis.quentes} color="red" icon={<DynamicIcon name="fire" className="h-6 w-6" />} />
                        <MetricCard title="Vendas Consolidadas" value={dadosFiltrados.kpis.vendas} color="green" icon={<DynamicIcon name="money" className="h-6 w-6" />} />
                        <MetricCard title="Atingimento Geral" value={dadosFiltrados.kpis.meta} color="yellow" icon={<DynamicIcon name="meta" className="h-6 w-6" />} />
                    </section>

                    <section className="grid gap-8 lg:grid-cols-3">
                        {/* Indicador 1: Leads por Origem */}
                        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Leads por Origem</h3>
                            <div className="space-y-3.5 flex-1 justify-center flex flex-col">
                                {dadosFiltrados.origens.map((item) => (
                                    <div key={item.name} className="space-y-1">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="font-medium text-slate-600">{item.name}</span>
                                            <span className="font-bold text-slate-900">{item.count} <span className="text-xs font-normal text-slate-400">({item.pct})</span></span>
                                        </div>
                                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                            <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: item.pct }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Indicador 2: Distribuição por Importância & Motivos */}
                        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-4">Distribuição por Importância</h3>
                                <div className="grid grid-cols-3 gap-3 text-center mt-2">
                                    <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100">
                                        <span className="text-xs font-semibold text-rose-700 block">QUENTE</span>
                                        <span className="text-2xl font-bold text-rose-900 block mt-1">{dadosFiltrados.importancia.quente}</span>
                                    </div>
                                    <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
                                        <span className="text-xs font-semibold text-amber-700 block">MORNO</span>
                                        <span className="text-2xl font-bold text-amber-900 block mt-1">{dadosFiltrados.importancia.morno}</span>
                                    </div>
                                    <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                                        <span className="text-xs font-semibold text-blue-700 block">FRIO</span>
                                        <span className="text-2xl font-bold text-blue-900 block mt-1">{dadosFiltrados.importancia.frio}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Motivos de Finalização (Requisitado) */}
                            <div className="mt-6 pt-6 border-t border-slate-100">
                                <h4 className="text-sm font-bold text-slate-900 mb-3">Motivos de Finalização (Perdas)</h4>
                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between text-slate-600"><span>Preço / Orçamento do cliente fora</span> <span className="font-semibold text-slate-900">42%</span></div>
                                    <div className="flex justify-between text-slate-600"><span>Sem estoque / Modelo indisponível</span> <span className="font-semibold text-slate-900">28%</span></div>
                                    <div className="flex justify-between text-slate-600"><span>Desistência de Compra / Lead parou de responder</span> <span className="font-semibold text-slate-900">20%</span></div>
                                    <div className="flex justify-between text-slate-600"><span>Financiamento Bancário Recusado</span> <span className="font-semibold text-slate-900">10%</span></div>
                                </div>
                            </div>
                        </div>

                        {/* Indicador 3: Volume de Leads por Equipe */}
                        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Leads por Equipe</h3>
                            <div className="space-y-4 flex-1 justify-center flex flex-col">
                                {dadosFiltrados.equipes.map((eq) => (
                                    <div key={eq.nome} className="space-y-2">
                                        <div className="flex justify-between text-sm font-medium">
                                            <span className="text-slate-800 font-semibold">{eq.nome}</span>
                                            <span className="text-slate-600 font-bold">{eq.leads} <span className="text-xs font-normal text-slate-400">leads alocados</span></span>
                                        </div>
                                        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                                            <div className={`${eq.color} h-full rounded-full transition-all duration-500`} style={{ width: eq.maxBar }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            )}

            {/* ========================================================= */}
            {/* --- SUBMENU 2: DASHBOARD ANALÍTICO ---------------------- */}
            {/* ========================================================= */}
            {visao === 'analitico' && (
                <div className="space-y-8 animate-fadeIn">
                    
                    {/* Indicadores Avançados de Eficiência */}
                    <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                                <DynamicIcon name="conversion" className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Taxa de Conversão Média Global</p>
                                <p className="text-2xl font-bold text-slate-900 mt-0.5">{dadosFiltrados.funil.pctConvertidos}%</p>
                                <span className="text-[10px] text-slate-400">(Leads Convertidos / Total Finalizados)</span>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center">
                                <DynamicIcon name="clock" className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tempo Médio até Atendimento</p>
                                <p className="text-2xl font-bold text-slate-900 mt-0.5">{dadosFiltrados.atendentes[0].tempo}</p>
                                <span className="text-[10px] text-purple-600 font-medium">Resposta média entre todas as equipes</span>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
                                <DynamicIcon name="total" className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Amostragem Total Filtrada</p>
                                <p className="text-2xl font-bold text-slate-900 mt-0.5">{dadosFiltrados.kpis.total}</p>
                                <span className="text-[10px] text-slate-400">Fluxo total processado</span>
                            </div>
                        </div>
                    </section>

                    <section className="grid gap-8 lg:grid-cols-2">
                        {/* Gráfico 4: Convertidos vs Não Convertidos */}
                        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Leads Convertidos x Não Convertidos</h3>
                            <p className="text-xs text-slate-400 mb-6">Proporção direta de conversão de leads e sucesso de vendas corporativas.</p>
                            
                            <div className="space-y-5">
                                <div className="relative pt-1">
                                    <div className="flex mb-3 items-center justify-between text-xs font-semibold">
                                        <span className="text-emerald-600 uppercase bg-emerald-50 px-2.5 py-1 rounded-md">Convertidos ({dadosFiltrados.funil.pctConvertidos}%)</span>
                                        <span className="text-rose-600 uppercase bg-rose-50 px-2.5 py-1 rounded-md">Não Convertidos ({(100 - dadosFiltrados.funil.pctConvertidos).toFixed(1)}%)</span>
                                    </div>
                                    
                                    {/* Barra Proporcional Acumulada Nativa Tailwind */}
                                    <div className="overflow-hidden h-6 text-xs flex rounded-2xl bg-slate-100 w-full shadow-inner">
                                        <div style={{ width: `${dadosFiltrados.funil.pctConvertidos}%` }} className="flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500 transition-all duration-500"></div>
                                        <div style={{ width: `${100 - dadosFiltrados.funil.pctConvertidos}%` }} className="flex flex-col text-center whitespace-nowrap text-white justify-center bg-rose-400 transition-all duration-500"></div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-center pt-2">
                                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        <span className="text-xs text-slate-500 block mb-0.5">Vendas Concluídas</span>
                                        <span className="block text-lg font-bold text-slate-800">{dadosFiltrados.funil.convertidos}</span>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        <span className="text-xs text-slate-500 block mb-0.5">Leads Perdidos</span>
                                        <span className="block text-lg font-bold text-slate-800">{dadosFiltrados.funil.perdidos}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Gráfico 5: Taxa de Conversão por Equipe */}
                        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">Taxa de Conversão por Equipe</h3>
                                <p className="text-xs text-slate-400 mb-6">Eficiência comercial individualizada de cada filial.</p>
                                <div className="space-y-4">
                                    {dadosFiltrados.equipes.map((eq) => (
                                        <div key={eq.nome} className="space-y-1">
                                            <div className="flex justify-between text-sm">
                                                <span className="font-semibold text-slate-700">{eq.nome}</span>
                                                <span className="text-slate-900 font-bold text-emerald-600">{eq.taxa}</span>
                                            </div>
                                            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                                <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: eq.taxa }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Tabela de Inteligência Avançada: Leads por Atendente */}
                        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm lg:col-span-2">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Performance e Leads por Atendente</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-100 text-xs font-semibold uppercase text-slate-400">
                                            <th className="pb-3">Atendente</th>
                                            <th className="pb-3">Equipe / Unidade</th>
                                            <th className="pb-3 text-center">Leads Alocados</th>
                                            <th className="pb-3 text-center">Tempo Médio de Atendimento</th>
                                            <th className="pb-3 text-right">Taxa de Conversão</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {dadosFiltrados.atendentes.map((atendente, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50/50 transition">
                                                <td className="py-3 font-medium text-slate-900">{atendente.nome}</td>
                                                <td className="py-3 text-slate-600 text-xs font-semibold uppercase">
                                                    <span className="px-2 py-1 bg-slate-100 rounded-md">{atendente.equipe}</span>
                                                </td>
                                                <td className="py-3 text-center text-slate-600 font-semibold">{atendente.leads}</td>
                                                <td className="py-3 text-center text-slate-500 font-mono text-xs">{atendente.tempo}</td>
                                                <td className="py-3 text-right font-semibold text-emerald-600">{atendente.taxa}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}