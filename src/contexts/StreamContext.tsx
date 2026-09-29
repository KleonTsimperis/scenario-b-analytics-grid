import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockWebSocketServer } from '@/lib/engine/mockWebSocketServer';
import { StockQuote } from '@/types/stream';

interface StreamContextValue {
  quotes: Record<string, StockQuote>;
  connected: boolean;
  getQuote: (symbol: string) => StockQuote | undefined;
}

const StreamContext = createContext<StreamContextValue | null>(null);

export function StreamProvider({ children }: { children: React.ReactNode }) {
  const [quotes, setQuotes] = useState<Record<string, StockQuote>>({});
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    setConnected(true);
    const unsub = mockWebSocketServer.subscribe('all_tickers', (update) => {
      setQuotes((prev) => ({
        ...prev,
        [update.symbol]: update,
      }));
    });
    return () => unsub();
  }, []);

  // INTENTIONAL BUG 2:
  // Fresh object and inline callback created on EVERY render cycle.
  // Any component calling useStreamContext() will re-render, completely defeating React.memo!
  const value: StreamContextValue = {
    quotes,
    connected,
    getQuote: (symbol: string) => quotes[symbol],
  };

  return <StreamContext.Provider value={value}>{children}</StreamContext.Provider>;
}

export function useStreamContext() {
  const ctx = useContext(StreamContext);
  if (!ctx) {
    throw new Error('useStreamContext must be used within StreamProvider');
  }
  return ctx;
}
