import React from 'react';
import { useStreamContext } from '@/contexts/StreamContext';

interface GridCellProps {
  symbol: string;
  field: 'price' | 'change' | 'volume';
}

// INTENTIONAL BUG 2 TARGET:
// Even with React.memo, this cell re-renders whenever ANY ticker updates because it consumes
// useStreamContext() which provides an unmemoized object instance!
export const GridCell = React.memo(function GridCell({ symbol, field }: GridCellProps) {
  const { quotes } = useStreamContext();
  const quote = quotes[symbol];

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
