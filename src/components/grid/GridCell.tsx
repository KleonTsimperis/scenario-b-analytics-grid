import React, { useSyncExternalStore, useCallback } from 'react';
import { useStreamContext } from '@/contexts/StreamContext';

interface GridCellProps {
  symbol: string;
  field: 'price' | 'change' | 'volume';
}

// SOLUTION 2:
// GridCell subscribes ONLY to updates for its specific `symbol` via useSyncExternalStore,
// completely decoupling it from the global context re-renders of unrelated tickers.
export const GridCell = React.memo(function GridCell({ symbol, field }: GridCellProps) {
  const { getQuote, subscribeSymbol } = useStreamContext();

  const subscribe = useCallback(
    (onStoreChange: () => void) => subscribeSymbol(symbol, onStoreChange),
    [subscribeSymbol, symbol]
  );

  const quote = useSyncExternalStore(
    subscribe,
    () => getQuote(symbol),
    () => getQuote(symbol)
  );

  // Track renders for automated test assertion
  if (typeof window !== 'undefined') {
    (window as any).__RENDER_COUNTERS__ = (window as any).__RENDER_COUNTERS__ || {};
    const key = `${symbol}_${field}`;
    (window as any).__RENDER_COUNTERS__[key] = ((window as any).__RENDER_COUNTERS__[key] || 0) + 1;
  }

  if (!quote) {
    return <td data-testid={`cell-${symbol}-${field}`} className="p-2 border border-gray-800 text-gray-500">-</td>;
  }

  return (
    <td
      data-testid={`cell-${symbol}-${field}`}
      className="p-2 border border-gray-800 font-mono text-sm"
    >
      {field === 'price' && `$${quote.price.toFixed(2)}`}
      {field === 'change' && (
        <span className={quote.change >= 0 ? 'text-green-400' : 'text-red-400'}>
          {quote.change >= 0 ? '+' : ''}
          {quote.change.toFixed(2)}%
        </span>
      )}
      {field === 'volume' && quote.volume.toLocaleString()}
    </td>
  );
});
