"use client";

import { memo, useEffect, useRef } from "react";

/**
 * TradingView "Ticker Tape" widget — a live scrolling market strip.
 * Loaded client-side from TradingView's embed CDN. Symbols are tuned to
 * Blue Fox's world: gold, major FX pairs, indices and crypto.
 */
const SYMBOLS = [
  { proName: "OANDA:XAUUSD", title: "Gold" },
  { proName: "FX:EURUSD", title: "EUR/USD" },
  { proName: "FX:GBPUSD", title: "GBP/USD" },
  { proName: "BITSTAMP:BTCUSD", title: "BTC/USD" },
  { proName: "BITSTAMP:ETHUSD", title: "ETH/USD" },
  { proName: "FOREXCOM:SPXUSD", title: "S&P 500" },
  { proName: "SSE:000001", title: "Shanghai Composite" },
];

function TradingViewTickerBase() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    // Guard against React StrictMode double-mount injecting the script twice.
    if (!container || container.dataset.loaded === "true") return;
    container.dataset.loaded = "true";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;
    script.type = "text/javascript";
    script.innerHTML = JSON.stringify({
      symbols: SYMBOLS,
      showSymbolLogo: true,
      isTransparent: true,
      displayMode: "adaptive",
      colorTheme: "dark",
      locale: "en",
    });
    container.appendChild(script);
  }, []);

  return (
    <div className="border-b border-border bg-[#0a1020]">
      <div className="tradingview-widget-container" ref={containerRef}>
        <div className="tradingview-widget-container__widget" />
      </div>
    </div>
  );
}

export const TradingViewTicker = memo(TradingViewTickerBase);
