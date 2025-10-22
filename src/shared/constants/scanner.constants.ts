import type { Category, Strategy, SymbolItem } from '@shared/types';
import {
  FaBitcoin,
  FaChartLine,
  FaEuroSign,
  FaOilCan,
} from 'react-icons/fa';

/**
 * Available market categories
 */
export const CATEGORIES: Category[] = [
  { value: 'Forex', icon: FaEuroSign },
  { value: 'Commodities', icon: FaOilCan },
  { value: 'Crypto', icon: FaBitcoin },
  { value: 'Indices', icon: FaChartLine },
] as const;

/**
 * Available trading strategies
 */
export const STRATEGIES: Strategy[] = [
  { title: 'Golden Era', value: ['PUB;0b373fb0e6634a73bc8b838cf0690725'] },
  {
    title: 'Trend Wave',
    value: [
      'PUB;00ec48baf0ee43f0a43e1658bb54cdab',
      'PUB;38080827cf244587b5e7dbb9f272db0a',
    ],
  },
  {
    title: 'Smartmonics',
    value: [
      'PUB;ec7a7c1c91c645519b35b9505b4169a9',
      'PUB;5bdd7bb857ba48d68bf573c3fe0a08c3',
    ],
  },
  {
    title: 'Liquidity Flow',
    value: [
      'PUB;cfb67dca49e94b5ca341ab4c1bcf4d37',
      'PUB;b7b3fe63710742cb9f7db5bfa9695e5a',
    ],
  },
  { title: 'Sniper', value: ['PUB;717dd00ad9c1445b84b39adfb5ed5f3d'] },
  { title: 'Price Hunter', value: ['PUB;ba1af294fd5047fbbf5cfd0f66697725'] },
] as const;

/**
 * Forex trading symbols
 */
export const FOREX_SYMBOLS: readonly SymbolItem[] = [
  { symbol: 'FX:EURUSD', title: 'EUR/USD' },
  { symbol: 'FX:GBPUSD', title: 'GBP/USD' },
  { symbol: 'FX:USDJPY', title: 'USD/JPY' },
] as const;

/**
 * Commodities trading symbols
 */
export const COMMODITIES_SYMBOLS: readonly SymbolItem[] = [
  { symbol: 'TVC:USOIL', title: 'Crude Oil' },
  { symbol: 'TVC:GOLD', title: 'Gold' },
  { symbol: 'TVC:SILVER', title: 'Silver' },
] as const;

/**
 * Cryptocurrency trading symbols
 */
export const CRYPTO_SYMBOLS: readonly SymbolItem[] = [
  { symbol: 'BINANCE:BTCUSDT', title: 'BTC/USDT' },
  { symbol: 'BINANCE:ETHUSDT', title: 'ETH/USDT' },
  { symbol: 'BINANCE:XRPUSDT', title: 'XRP/USDT' },
  { symbol: 'BINANCE:SOLUSDT', title: 'SOL/USDT' },
  { symbol: 'BINANCE:LINKUSDT', title: 'LINK/USDT' },
  { symbol: 'BINANCE:DOGEUSDT', title: 'DOGE/USDT' },
] as const;

/**
 * Market indices symbols
 */
export const INDICES_SYMBOLS: readonly SymbolItem[] = [
  { symbol: 'BLACKBULL:US30', title: 'US30' },
  { symbol: 'BLACKBULL:NAS100', title: 'NAS100' },
  { symbol: 'VANTAGE:SP500', title: 'SP500' },
] as const;

/**
 * Local storage keys
 */
export const SCANNER_STORAGE_KEYS = {
  CATEGORY: 'scanner:selectedCategory',
  STRATEGY: 'scanner:selectedStrategy',
} as const;

