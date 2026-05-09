export type MetricTrend = "up" | "down" | "stable";

export interface MetricSummary {
  id: string;
  label: string;
  value: string | number;
  trendValue: string;
  trend: MetricTrend;
  icon: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface PieDataPoint {
  label: string;
  value: number;
  color: string;
}

export interface AttendantDataPoint {
  name: string;
  sales: number;
  leads: number;
  conversion: string;
  avatarColor?: string;
}

export interface TransactionData {
  id: string;
  customer: string;
  status: "Completed" | "Pending" | "Canceled";
  date: string;
  amount: string;
  paymentMethod: string;
}