import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { mockWebSocketServer } from '@/lib/engine/mockWebSocketServer';
import { StockQuote } from '@/types/stream';

interface StreamContextValue {
  quotes: Record<string, StockQuote>;
  connected: boolean;
  getQuote: (symbol: string) => StockQuote | undefined;
  subscribeSymbol: (symbol: string, callback: () => void) => () => void;
}

const StreamContext = createContext<StreamContextValue | null>(null);

export function StreamProvider({ children }: { children: React.ReactNode }) {
  const [connected, setConnected] = useState(false);
  const quotesRef = useRef<Record<string, StockQuote>>({});
  const listenersRef = useRef<Map<string, Set<() => void>>>(new Map());

  useEffect(() => {
    setConnected(true);
    const unsub = mockWebSocketServer.subscribe('all_tickers', (update) => {
      // 1. Update mutable ref for atomic O(1) cell lookups
      quotesRef.current[update.symbol] = update;

      // 2. Notify ONLY listeners subscribed to this specific symbol
      const symbolListeners = listenersRef.current.get(update.symbol);
      if (symbolListeners) {
        symbolListeners.forEach((cb) => cb());
      }
    });
    return () => unsub();
  }, []);

  const getQuote = useCallback((symbol: string) => {
    return quotesRef.current[symbol];
  }, []);

  const subscribeSymbol = useCallback((symbol: string, callback: () => void) => {
    if (!listenersRef.current.has(symbol)) {
      listenersRef.current.set(symbol, new Set());
    }
    listenersRef.current.get(symbol)!.add(callback);
    return () => {
      listenersRef.current.get(symbol)?.delete(callback);
    };
  }, []);

  // SOLUTION 2:
  // The context value is completely stable across ticker updates!
  // High-frequency mutations are decoupled into atomic per-symbol subscriptions.
  const value = useMemo<StreamContextValue>(() => ({
    quotes: quotesRef.current,
    connected,
    getQuote,
    subscribeSymbol,
  }), [connected, getQuote, subscribeSymbol]);

  return <StreamContext.Provider value={value}>{children}</StreamContext.Provider>;
}

export function useStreamContext() {
  const ctx = useContext(StreamContext);
  if (!ctx) {
    throw new Error('useStreamContext must be used within StreamProvider');
  }
  return ctx;
}
