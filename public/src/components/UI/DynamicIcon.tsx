import {
  ArrowTrendingUpIcon,
  BoltIcon,
  ChartBarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  FireIcon,
  SparklesIcon,
  TagIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import type { ComponentType, SVGProps } from 'react';

type HeroIcon = ComponentType<SVGProps<SVGSVGElement>>;

/**
 * Mapeamento central: nome semântico → ícone Heroicons.
 * Para adicionar um novo ícone: importe-o acima e registre aqui.
 */
const iconMap: Record<string, HeroIcon> = {
  // Financeiro / Métricas
  'currency-dollar': CurrencyDollarIcon,
  money: CurrencyDollarIcon,
  vendas: CurrencyDollarIcon,

  // Pessoas / Leads
  users: UsersIcon,
  leads: UsersIcon,
  pessoas: UsersIcon,

  // Tendência / Crescimento
  'arrow-trending-up': ArrowTrendingUpIcon,
  conversion: ArrowTrendingUpIcon,
  tendencia: ArrowTrendingUpIcon,

  // Etiqueta / Ticket
  tag: TagIcon,
  ticket: TagIcon,

  // Gráfico geral
  'chart-bar': ChartBarIcon,
  total: ChartBarIcon,
  grafico: ChartBarIcon,

  // Urgente / Quente
  fire: FireIcon,
  hot: FireIcon,
  quente: FireIcon,

  // Tempo
  clock: ClockIcon,
  time: ClockIcon,
  tempo: ClockIcon,

  // Destaque / Premium
  sparkles: SparklesIcon,
  premium: SparklesIcon,
  destaque: SparklesIcon,

  // Meta / Objetivo
  bolt: BoltIcon,
  goal: BoltIcon,
  meta: BoltIcon,
};

interface DynamicIconProps extends SVGProps<SVGSVGElement> {
  name: string;
  className?: string;
}

/**
 * Renderiza um ícone Heroicons (outline 24px) pelo nome semântico.
 *
 * @example
 * <DynamicIcon name="fire" className="h-5 w-5 text-rose-500" />
 * <DynamicIcon name="currency-dollar" className="h-6 w-6 text-emerald-600" />
 */
export default function DynamicIcon({ name, className = 'h-5 w-5', ...rest }: DynamicIconProps) {
  const Icon = iconMap[name] ?? ChartBarIcon;
  return <Icon className={className} aria-hidden="true" {...rest} />;
}
