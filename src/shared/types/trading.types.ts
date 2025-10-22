/**
 * Core trading signal type
 */
export interface TradingSignal {
  id: string;
  symbol: string;
  signal: 'LONG' | 'SHORT';
  entry: string;
  sl: string;
  tp1: string;
  tp2: string;
  tp3: string;
  strategy: string;
  timestamp: number;
}

/**
 * Price levels extracted from text
 */
export interface PriceLevels {
  entry?: string;
  sl?: string;
  tp1?: string;
}

/**
 * Signal detection callback
 */
export type SignalDetectedCallback = (signal: TradingSignal) => void;

/**
 * Trading chart theme
 */
export type ChartTheme = 'light' | 'dark';

/**
 * Trading chart interval
 */
export type ChartInterval = '1' | '5' | '15' | '30' | '60' | 'D' | 'W' | 'M';

