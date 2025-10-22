import type { IconType } from 'react-icons';

/**
 * Trading strategy configuration
 */
export interface Strategy {
  title: string;
  value: string[];
}

/**
 * Trading symbol item
 */
export interface SymbolItem {
  symbol: string;
  title: string;
}

/**
 * Market category type
 */
export type CategoryType = 'Forex' | 'Commodities' | 'Crypto' | 'Indices';

/**
 * Market category configuration
 */
export interface Category {
  value: CategoryType;
  icon: IconType;
}

