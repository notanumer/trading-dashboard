/**
 * Local storage key for signals cache
 */
export const SIGNALS_CACHE_KEY = 'tradingview_signals_cache' as const;

/**
 * Maximum number of signals to store
 */
export const MAX_SIGNALS_CACHE = 100 as const;

/**
 * Duplicate signal detection window (milliseconds)
 */
export const DUPLICATE_DETECTION_WINDOW = 5000 as const;

/**
 * Signal monitoring delay (milliseconds)
 */
export const SIGNAL_MONITORING_DELAY = 1500 as const;

/**
 * Default chart configuration
 */
export const DEFAULT_CHART_CONFIG = {
  interval: '15',
  theme: 'light',
  timezone: 'Etc/UTC',
  style: '1',
  locale: 'en',
  toolbarBg: '#f1f3f6',
  hideLegend: true,
  hideSideToolbar: false,
  enablePublishing: false,
  allowSymbolChange: true,
  hideVolume: true,
  autosize: true,
} as const;

