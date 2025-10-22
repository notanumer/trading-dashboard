/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./TradingViewChart.css";

const CACHE_KEY = "tradingview_signals_cache";

interface TradingSignal {
  id: string;
  symbol: string;
  signal: "LONG" | "SHORT";
  entry: string;
  sl: string;
  tp1: string;
  strategy: string;
  timestamp: number;
}

interface TradingViewChartProps {
  symbol: string;
  studies: string[];
  interval?: string;
  theme?: "light" | "dark";
  onSignalDetected?: (signal: TradingSignal) => void;
}

export const TradingViewChart: React.FC<TradingViewChartProps> = ({
  symbol,
  studies,
  interval = "15",
  theme = "light",
  onSignalDetected,
}) => {
  const containerId = useMemo(
    () => `tradingview_${Math.random().toString(36).substr(2, 9)}`,
    []
  );

  const chartRef = useRef<any>(null);
  const observerRef = useRef<MutationObserver | null>(null);

  const [signalsCache, setSignalsCache] = useState<TradingSignal[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const [hasNewSignals, setHasNewSignals] = useState(false);
  const seenSignals = useRef<Set<string>>(new Set());

  // --- Computed values
  const longCount = useMemo(
    () => signalsCache.filter((s) => s.signal === "LONG").length,
    [signalsCache]
  );
  const shortCount = useMemo(
    () => signalsCache.filter((s) => s.signal === "SHORT").length,
    [signalsCache]
  );

  // --- Helpers
  const formatTime = (timestamp: number) =>
    new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  // --- Load/save cache
  useEffect(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as TradingSignal[];
        setSignalsCache(parsed);
        parsed.forEach((s) => seenSignals.current.add(s.id));
      }
    } catch (err) {
      console.error("Error loading signals from cache:", err);
    }
  }, []);

  const saveSignalsToCache = useCallback((signals: TradingSignal[]) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(signals));
    } catch (err) {
      console.error("Error saving signals to cache:", err);
    }
  }, []);

  const clearLogs = useCallback(() => {
    if (window.confirm("Are you sure you want to clear all signals?")) {
      setSignalsCache([]);
      seenSignals.current.clear();
      setHasNewSignals(false);
      localStorage.removeItem(CACHE_KEY);
    }
  }, []);

  const exportLogs = useCallback(() => {
    const dataStr = JSON.stringify(signalsCache, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trading_signals_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [signalsCache]);

  const loadTradingViewScript = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      if ((window as any).TradingView) return resolve();
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/tv.js";
      script.async = true;
      script.onload = () => resolve();
      document.head.appendChild(script);
    });
  }, []);

  const extractPricesFromText = (text: string) => {
    const numbers = text.match(/[\d.]+/g);
    const prices: { entry?: string; sl?: string; tp1?: string } = {};
    if (numbers && numbers.length >= 2) {
      prices.entry = numbers[0];
      prices.sl = numbers[1];
      if (numbers.length > 2) prices.tp1 = numbers[2];
    }
    return prices;
  };

  const saveSignal = useCallback(
    (signal: "LONG" | "SHORT", entry: string, sl: string, tp1: string) => {
      const signalId = `${symbol}_${signal}_${entry}_${Date.now()}`;
      const now = Date.now();

      const recentDuplicate = signalsCache.find(
        (s) =>
          s.symbol === symbol &&
          s.signal === signal &&
          s.entry === entry &&
          now - s.timestamp < 5000
      );
      if (recentDuplicate) return;

      const signalData: TradingSignal = {
        id: signalId,
        symbol,
        signal,
        entry,
        sl,
        tp1,
        strategy: studies.map((s) => s.split(";")[0] || s).join(", "),
        timestamp: now,
      };

      const updated = [signalData, ...signalsCache].slice(0, 100);
      setSignalsCache(updated);
      saveSignalsToCache(updated);
      if (!showLogs) setHasNewSignals(true);

      console.group("📊 Trading Signal Detected");
      console.log("Symbol:", symbol);
      console.log("Strategy:", signalData.strategy);
      console.log("Signal:", signal);
      console.log("Entry:", entry);
      console.log("Stop Loss:", sl);
      console.log("Take Profit:", tp1);
      console.log("Time:", new Date().toLocaleString());
      console.groupEnd();

      onSignalDetected?.(signalData);
    },
    [signalsCache, saveSignalsToCache, showLogs, symbol, studies, onSignalDetected]
  );

  const checkForSignals = useCallback(
    (element: Element) => {
      const text = (element.textContent || "").toUpperCase();
      if (text.includes("LONG") || text.includes("SHORT")) {
        const signal = text.includes("LONG") ? "LONG" : "SHORT";
        const prices = extractPricesFromText(text);
        saveSignal(
          signal,
          prices.entry || "N/A",
          prices.sl || "N/A",
          prices.tp1 || "N/A"
        );
      }
    },
    [saveSignal]
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
    observerRef.current.observe(chartContainer, { childList: true, subtree: true });
  }, [containerId, checkForSignals]);

  const initializeChart = useCallback(() => {
    const TradingView = (window as any).TradingView;
    if (!TradingView) return;

    const chartConfig = {
      symbol,
      interval,
      timezone: "Etc/UTC",
      theme,
      style: "1",
      locale: "en",
      toolbar_bg: "#f1f3f6",
      hide_legend: true,
      hide_side_toolbar: false,
      enable_publishing: false,
      allow_symbol_change: true,
      hide_volume: true,
      container_id: containerId,
      autosize: true,
      studies,
      onChartReady: () => {
        try {
          if (chartRef.current?.activeChart) {
            chartRef.current.activeChart().onStudyEvent((event: any) => {
              if (event?.data?.text) {
                const text = event.data.text.toUpperCase();
                if (text.includes("LONG") || text.includes("SHORT")) {
                  const signal = text.includes("LONG") ? "LONG" : "SHORT";
                  const entry = event.data.entry || event.data.price || "N/A";
                  const sl = event.data.sl || event.data.stopLoss || "N/A";
                  const tp1 = event.data.tp1 || event.data.takeProfit1 || "N/A";
                  saveSignal(signal, entry, sl, tp1);
                }
              }
            });
          }
        } catch (err) {
          console.error("Error attaching study event listener:", err);
        }

        setTimeout(() => monitorSignals(), 1500);
      },
    };

    chartRef.current = new TradingView.widget(chartConfig);
  }, [containerId, interval, symbol, theme, studies, monitorSignals, saveSignal]);

  // --- Mount
  useEffect(() => {
    loadTradingViewScript().then(initializeChart);
    return () => observerRef.current?.disconnect();
  }, [initializeChart, loadTradingViewScript]);

  // --- Reinitialize on prop change
  useEffect(() => {
    if (chartRef.current && chartRef.current.remove) {
      chartRef.current.remove();
      initializeChart();
    }
  }, [symbol, studies, initializeChart]);

  // --- Reset "new" status
  useEffect(() => {
    if (showLogs) setHasNewSignals(false);
  }, [showLogs]);

  return (
    <div className="trading-view-wrapper">
      {!showLogs && (
        <div className="btn-show-logs-wrapper">
          <button
            className={`btn btn--primary ${hasNewSignals ? "has-new" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              setShowLogs(true);
            }}
          >
            📊 Signals <span className="btn__count">{signalsCache.length}</span>
          </button>
        </div>
      )}

      <div id={containerId} className="chart-container" />

      {showLogs && (
        <div className="logs-overlay" onClick={() => setShowLogs(false)}>
          <div className="logs-panel" onClick={(e) => e.stopPropagation()}>
            <div className="logs-header">
              <h3>📊 Trading Signals Log</h3>
              <div className="logs-actions">
                <button className="btn btn--danger" onClick={clearLogs}>
                  Clear All
                </button>
                <button className="btn btn--success" onClick={exportLogs}>
                  Export JSON
                </button>
                <button className="btn btn--ghost" onClick={() => setShowLogs(false)}>
                  ✕
                </button>
              </div>
            </div>

            <div className="logs-stats">
              <span>Total: {signalsCache.length}</span>
              <span>LONG: {longCount}</span>
              <span>SHORT: {shortCount}</span>
            </div>

            <div className="logs-content">
              {signalsCache.length === 0 && (
                <div className="empty-logs">No signals detected yet</div>
              )}

              {signalsCache.map((signal) => (
                <div
                  key={signal.id}
                  className={`signal-item ${signal.signal.toLowerCase()}`}
                >
                  <div className="signal-header">
                    <span className="signal-type">{signal.signal}</span>
                    <span className="signal-time">
                      {formatTime(signal.timestamp)}
                    </span>
                  </div>
                  <div className="signal-details">
                    <div>
                      <strong>Symbol:</strong> {signal.symbol}
                    </div>
                    <div>
                      <strong>Entry:</strong> {signal.entry}
                    </div>
                    <div>
                      <strong>Stop Loss:</strong> {signal.sl}
                    </div>
                    <div>
                      <strong>Take Profit:</strong> {signal.tp1}
                    </div>
                    <div className="signal-strategy">{signal.strategy}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
