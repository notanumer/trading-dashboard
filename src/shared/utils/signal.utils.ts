import type { PriceLevels } from '@shared/types';

/**
 * Extract price levels from text containing numbers
 */
export const extractPricesFromText = (text: string): PriceLevels => {
  const prices: PriceLevels = {};

  // Try to extract with labels first
  const entryMatch = text.match(/entry[:\s]+([0-9.]+)/i);
  const slMatch = text.match(/sl[:\s]+([0-9.]+)/i);
  const tp1Match = text.match(/tp\s*1?[:\s]+([0-9.]+)/i);

  if (entryMatch) prices.entry = entryMatch[1];
  if (slMatch) prices.sl = slMatch[1];
  if (tp1Match) prices.tp1 = tp1Match[1];

  // Fallback: extract all numbers if labels not found
  if (!prices.entry && !prices.sl && !prices.tp1) {
    const numbers = text.match(/[\d.]+/g);
    if (numbers && numbers.length >= 2) {
      prices.entry = numbers[0];
      prices.sl = numbers[1];
      if (numbers.length > 2) {
        prices.tp1 = numbers[2];
      }
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

