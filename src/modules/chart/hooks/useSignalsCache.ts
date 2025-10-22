import { DUPLICATE_DETECTION_WINDOW, MAX_SIGNALS_CACHE, SIGNALS_CACHE_KEY } from '@shared/constants';
import type { TradingSignal } from '@shared/types';
import { StorageService, generateSignalId } from '@shared/utils';
import { useCallback, useEffect, useRef, useState } from 'react';

interface UseSignalsCacheProps {
  symbol: string;
  studies: string[];
  onSignalDetected?: (signal: TradingSignal) => void;
}

interface UseSignalsCacheReturn {
  signalsCache: TradingSignal[];
  saveSignal: (signal: 'LONG' | 'SHORT', entry: string, sl: string, tp1: string, tp2: string, tp3: string) => void;
  clearSignals: () => void;
  exportSignals: () => void;
  hasNewSignals: boolean;
  resetNewSignals: () => void;
}

/**
 * Custom hook for managing trading signals cache
 */
export const useSignalsCache = ({
  symbol,
  studies,
  onSignalDetected,
}: UseSignalsCacheProps): UseSignalsCacheReturn => {
  const [signalsCache, setSignalsCache] = useState<TradingSignal[]>(() => {
    // Load signals from cache on mount
    const cached = StorageService.getItem<TradingSignal[]>(SIGNALS_CACHE_KEY, []);
    return cached;
  });
  const [hasNewSignals, setHasNewSignals] = useState(false);
  const seenSignals = useRef<Set<string>>(new Set());

  // Initialize seen signals
  useEffect(() => {
    signalsCache.forEach((s) => seenSignals.current.add(s.id));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Save signals to cache
  const saveSignalsToCache = useCallback((signals: TradingSignal[]) => {
    StorageService.setItem(SIGNALS_CACHE_KEY, signals);
  }, []);

  // Save a new signal
  const saveSignal = useCallback(
    (signal: 'LONG' | 'SHORT', entry: string, sl: string, tp1: string, tp2: string, tp3: string) => {
      const now = Date.now();

      // Check for duplicate signals
      const recentDuplicate = signalsCache.find(
        (s) =>
          s.symbol === symbol &&
          s.signal === signal &&
          s.entry === entry &&
          now - s.timestamp < DUPLICATE_DETECTION_WINDOW
      );

      if (recentDuplicate) {
        return;
      }

      const signalData: TradingSignal = {
        id: generateSignalId(symbol, signal, entry),
        symbol,
        signal,
        entry,
        sl,
        tp1,
        tp2,
        tp3,
        strategy: studies.map((s) => s.split(';')[0] || s).join(', '),
        timestamp: now,
      };

      const updated = [signalData, ...signalsCache].slice(0, MAX_SIGNALS_CACHE);
      setSignalsCache(updated);
      saveSignalsToCache(updated);
      setHasNewSignals(true);

      onSignalDetected?.(signalData);
    },
    [signalsCache, symbol, studies, saveSignalsToCache, onSignalDetected]
  );

  // Reset new signals flag
  const resetNewSignals = useCallback(() => {
    setHasNewSignals(false);
  }, []);

  // Clear all signals
  const clearSignals = useCallback(() => {
    setSignalsCache([]);
    seenSignals.current.clear();
    setHasNewSignals(false);
    StorageService.removeItem(SIGNALS_CACHE_KEY);
  }, []);

  // Export signals to JSON
  const exportSignals = useCallback(() => {
    const dataStr = JSON.stringify(signalsCache, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `trading_signals_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [signalsCache]);

  return {
    signalsCache,
    saveSignal,
    clearSignals,
    exportSignals,
    hasNewSignals,
    resetNewSignals,
  };
};

