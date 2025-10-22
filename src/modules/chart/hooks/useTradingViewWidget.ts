import { DEFAULT_CHART_CONFIG } from '@shared/constants';
import type { ChartInterval, ChartTheme } from '@shared/types';
import { useCallback, useEffect, useRef } from 'react';

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
  onChartReady?: (widget: TradingViewWidget) => void;
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
  onChartReady,
}: UseTradingViewWidgetProps) => {
  const chartRef = useRef<TradingViewWidget | null>(null);

  const loadTradingViewScript = useCallback((): Promise<void> => {
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
  }, []);

  const initializeChart = useCallback(() => {
    const TradingView = window.TradingView;
    if (!TradingView) return;

    const chartConfig = {
      ...DEFAULT_CHART_CONFIG,
      symbol,
      interval,
      theme,
      container_id: containerId,
      studies,
      onChartReady: () => {
        if (chartRef.current && onChartReady) {
          onChartReady(chartRef.current);
        }
      },
    };

    chartRef.current = new TradingView.widget(chartConfig);
  }, [containerId, interval, symbol, theme, studies, onChartReady]);

  const reinitializeChart = useCallback(() => {
    if (chartRef.current?.remove) {
      chartRef.current.remove();
    }
    initializeChart();
  }, [initializeChart]);

  useEffect(() => {
    loadTradingViewScript().then(initializeChart);
  }, [loadTradingViewScript, initializeChart]);

  useEffect(() => {
    reinitializeChart();
  }, [symbol, studies, reinitializeChart]);

  return { chartRef };
};

