import { SIGNAL_MONITORING_DELAY } from '@shared/constants';
import { extractPricesFromText } from '@shared/utils';
import { useCallback, useEffect, useRef } from 'react';

interface UseSignalDetectionProps {
  containerId: string;
  onSignalFound: (signal: 'LONG' | 'SHORT', entry: string, sl: string, tp1: string) => void;
}

/**
 * Custom hook for detecting trading signals in TradingView chart
 */
export const useSignalDetection = ({
  containerId,
  onSignalFound,
}: UseSignalDetectionProps) => {
  const observerRef = useRef<MutationObserver | null>(null);

  const checkForSignals = useCallback(
    (element: Element) => {
      const text = (element.textContent || '').toUpperCase();
      if (text.includes('LONG') || text.includes('SHORT')) {
        const signal = text.includes('LONG') ? 'LONG' : 'SHORT';
        const prices = extractPricesFromText(text);
        onSignalFound(
          signal,
          prices.entry || 'N/A',
          prices.sl || 'N/A',
          prices.tp1 || 'N/A'
        );
      }
    },
    [onSignalFound]
  );

  const monitorSignals = useCallback(() => {
    const chartContainer = document.getElementById(containerId);
    if (!chartContainer) return;

    observerRef.current = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            checkForSignals(node as Element);
          }
        }
      }
    });

    observerRef.current.observe(chartContainer, {
      childList: true,
      subtree: true,
    });
  }, [containerId, checkForSignals]);

  const startMonitoring = useCallback(() => {
    setTimeout(() => {
      monitorSignals();
    }, SIGNAL_MONITORING_DELAY);
  }, [monitorSignals]);

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return { startMonitoring };
};

