import type { IChartApi } from 'lightweight-charts';

export interface Signal {
  id: string;
  signal: string;
  timestamp: number;
  symbol: string;
  entry: number;
  sl: number;
  tp: number[];
}

export interface TradingViewChartProps {
  symbol?: string;
  studies?: string[];
  onSignalReceived?: (signal: Signal) => void;
}

export type ChartContainerRef = {
  chart: IChartApi | null;
  container: HTMLDivElement | null;
};

export interface ChartData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}