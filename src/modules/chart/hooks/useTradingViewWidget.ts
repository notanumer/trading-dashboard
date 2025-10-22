import { DEFAULT_CHART_CONFIG } from '@shared/constants';
import type { ChartInterval, ChartTheme } from '@shared/types';
import { useEffect, useRef } from 'react';

interface TradingViewWidget {
  remove?: () => void;
  activeChart?: () => {
    onStudyEvent?: (callback: (event: StudyEvent) => void) => void;
  };
}

interface StudyEvent {
  data?: {
    text?: string;
    entry?: string;
    price?: string;
    sl?: string;
    stopLoss?: string;
    tp1?: string;
    takeProfit1?: string;
  };
}

interface TradingViewGlobal {
  widget: new (config: unknown) => TradingViewWidget;
}

declare global {
  interface Window {
    TradingView?: TradingViewGlobal;
  }
}

interface UseTradingViewWidgetProps {
  containerId: string;
  symbol: string;
  interval: ChartInterval;
  theme: ChartTheme;
  studies: string[];
}

/**
 * Custom hook for managing TradingView widget lifecycle
 */
export const useTradingViewWidget = ({
  containerId,
  symbol,
  interval,
  theme,
  studies,
}: UseTradingViewWidgetProps) => {
  const chartRef = useRef<TradingViewWidget | null>(null);
  const prevSymbolRef = useRef(symbol);
  const prevStudiesRef = useRef(studies);

  // Initialize and manage chart lifecycle
  useEffect(() => {
    const loadScript = (): Promise<void> => {
      return new Promise((resolve) => {
        if (window.TradingView) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/tv.js';
        script.async = true;
        script.onload = () => resolve();
        document.head.appendChild(script);
      });
    };

    const createWidget = () => {
      const TradingView = window.TradingView;
      if (!TradingView) return;

      const chartConfig = {
        ...DEFAULT_CHART_CONFIG,
        symbol,
        interval,
        theme,
        container_id: containerId,
        studies,
      };

      chartRef.current = new TradingView.widget(chartConfig);
    };

    // Check if we need to reinitialize
    const symbolChanged = prevSymbolRef.current !== symbol;
    const studiesChanged = JSON.stringify(prevSymbolRef.current) !== JSON.stringify(studies);

    if (symbolChanged || studiesChanged) {
      // Remove old widget
      if (chartRef.current?.remove) {
        chartRef.current.remove();
      }

      // Update refs
      prevSymbolRef.current = symbol;
      prevStudiesRef.current = studies;

      // Create new widget
      loadScript().then(createWidget);
    } else if (!chartRef.current) {
      // Initial creation
      prevSymbolRef.current = symbol;
      prevStudiesRef.current = studies;
      loadScript().then(createWidget);
    }
  }, [symbol, studies, interval, theme, containerId]);

  return { chartRef };
};

