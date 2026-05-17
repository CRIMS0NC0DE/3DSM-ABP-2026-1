// Tipos do Dashboard
export interface PieDataPoint {
  label: string;
  value: number;
  color: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface AttendantDataPoint {
  name: string;
  sales: number;
  leads: number;
  conversion: string;
  avatarColor?: string;
}

export interface MetricSummary {
  id: string;
  label: string;
  value: string;
  trend: 'up' | 'down' | 'neutral' | 'stable';
  trendValue: string;
  /** Nome semântico mapeado em DynamicIcon (ex: "money", "leads", "fire") */
  icon: string;
}

export interface TransactionData {
  id: number | string;
  customer: string;
  status: 'Completed' | 'Pending' | 'Canceled';
  date: string;
  amount: string;
  paymentMethod?: string;
}

// Tipos do Chat
export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface ChatUser {
  id: string;
  nome: string;
  avatar?: string;
  online: boolean;
  ultimoAcesso?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: MessageStatus;
}

export interface Conversation {
  id: string;
  participants: ChatUser[];
  lastMessage?: Message;
  updatedAt: string;
}