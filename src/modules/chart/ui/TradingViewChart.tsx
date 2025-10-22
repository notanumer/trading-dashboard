import { Box } from '@chakra-ui/react';
import type { ChartInterval, ChartTheme, SignalDetectedCallback } from '@shared/types';
import { memo, useCallback, useId, useState } from 'react';
import { useSignalsCache, useTradingViewWidget } from '../hooks';
import { LogsPanel, SignalsButton } from './components';

interface TradingViewChartProps {
  symbol: string;
  studies: string[];
  interval?: ChartInterval;
  theme?: ChartTheme;
  onSignalDetected?: SignalDetectedCallback;
}

/**
 * TradingView chart component with manual signal tracking
 */
export const TradingViewChart = memo<TradingViewChartProps>(
  ({
    symbol,
    studies,
    interval = '15',
    theme = 'light',
    onSignalDetected,
  }) => {
    const [showLogs, setShowLogs] = useState(false);

    // Generate unique container ID
    const uniqueId = useId();
    const containerId = `tradingview_${uniqueId.replace(/:/g, '_')}`;

    // Signals cache management
    const {
      signalsCache,
      //saveSignal,
      clearSignals,
      exportSignals,
      hasNewSignals,
      resetNewSignals,
    } = useSignalsCache({
      symbol,
      studies,
      onSignalDetected,
    });

    // TradingView widget initialization
    useTradingViewWidget({
      containerId,
      symbol,
      interval,
      theme,
      studies,
    });

    // Handle opening logs panel
    const handleToggleLogs = useCallback(() => {
      setShowLogs((prev) => {
        if (!prev) {
          // Opening the panel - reset new signals flag
          resetNewSignals();
        }
        return !prev;
      });
    }, [resetNewSignals]);

    // Handle closing logs panel
    const handleCloseLogs = useCallback(() => {
      setShowLogs(false);
    }, []);

    return (
      <Box position="relative" width="100%" height="100%">
        {/* <AddSignalButton
          symbol={symbol}
          onAddSignal={saveSignal}
        /> */}

        <SignalsButton
          signalsCount={signalsCache.length}
          hasNewSignals={hasNewSignals}
          onClick={handleToggleLogs}
          isVisible={!showLogs}
        />

        <Box
          id={containerId}
          width="100%"
          height="100%"
          minHeight="650px"
        />

        <LogsPanel
          signals={signalsCache}
          isOpen={showLogs}
          onClose={handleCloseLogs}
          onClear={clearSignals}
          onExport={exportSignals}
        />
      </Box>
    );
  }
);

TradingViewChart.displayName = 'TradingViewChart';
