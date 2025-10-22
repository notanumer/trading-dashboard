import type { PriceLevels } from '@shared/types';

/**
 * Extract price levels from text containing numbers
 */
export const extractPricesFromText = (text: string): PriceLevels => {
  const numbers = text.match(/[\d.]+/g);
  const prices: PriceLevels = {};

  if (numbers && numbers.length >= 2) {
    prices.entry = numbers[0];
    prices.sl = numbers[1];
    if (numbers.length > 2) {
      prices.tp1 = numbers[2];
    }
  }

  return prices;
};

/**
 * Format timestamp to localized date string
 */
export const formatSignalTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

/**
 * Generate unique signal ID
 */
export const generateSignalId = (
  symbol: string,
  signal: 'LONG' | 'SHORT',
  entry: string
): string => {
  return `${symbol}_${signal}_${entry}_${Date.now()}`;
};

/**
 * Export signals to JSON file
 */
export const exportSignalsToJson = (signals: unknown[]): void => {
  const dataStr = JSON.stringify(signals, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `trading_signals_${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

