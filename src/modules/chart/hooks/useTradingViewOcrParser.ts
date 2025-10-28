import html2canvas from 'html2canvas';
import { useEffect, useRef } from 'react';
import Tesseract from 'tesseract.js';

interface ParsedSignal {
  entry?: number;
  sl?: number;
  tps?: number[];
  timestamp: number;
}

/**
 * Periodically parses text (Entry, TP, SL) from TradingView chart via OCR
 */
export const useTradingViewOcrParser = (
  containerId: string,
  intervalMs: number = 3000,
  downloadBlob = true,
) => {
  const parsingRef = useRef(false);

  useEffect(() => {
    const parseText = async () => {
      if (parsingRef.current) return;
      parsingRef.current = true;

      try {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Снимаем скриншот графика
        const canvas = await html2canvas(container, {
          useCORS: true,
          scale: 2, // лучше качество текста
          logging: true,
        });

        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob((b) => resolve(b), 'image/png')
        );
        if (!blob) return;

        if (downloadBlob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `tradingview_snapshot_${Date.now()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          console.log('[OCR] Snapshot downloaded for inspection.');
        }

        // Распознаём текст
        const { data } = await Tesseract.recognize(blob, 'eng');
        console.log(data);
        const text = data.text;
        console.log(text);

        // Ищем ключевые уровни
        const entryMatch = text.match(/Entry[:\s]+([\d.,]+)/i);
        const slMatch = text.match(/SL[:\s]+([\d.,]+)/i);
        const tpMatches = [...text.matchAll(/TP\s*\d*[:\s]+([\d.,]+)/gi)];

        const signal: ParsedSignal = {
          entry: entryMatch ? parseFloat(entryMatch[1].replace(',', '')) : undefined,
          sl: slMatch ? parseFloat(slMatch[1].replace(',', '')) : undefined,
          tps: tpMatches.map((m) => parseFloat(m[1].replace(',', ''))),
          timestamp: Date.now(),
        };

        if (signal.entry || signal.sl || signal.tps?.length) {
          console.log('[OCR] Parsed signal:', signal);

          // сохраняем в localStorage
          const existing = JSON.parse(localStorage.getItem('signals') || '[]');
          existing.push(signal);
          localStorage.setItem('signals', JSON.stringify(existing));
        }
      } catch (err) {
        console.error('[OCR Parser Error]', err);
      } finally {
        parsingRef.current = false;
      }
    };

    const interval = setInterval(parseText, intervalMs);
    return () => clearInterval(interval);
  }, [containerId, intervalMs, downloadBlob]);
};
