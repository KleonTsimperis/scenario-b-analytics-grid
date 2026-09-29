import React from 'react';
import { GridHeader } from './GridHeader';
import { VirtualRow } from './VirtualRow';
import { useStreamBatcher } from '@/hooks/useStreamBatcher';

interface DataGridProps {
  symbols: string[];
}

const COMPANY_NAMES: Record<string, string> = {
  AAPL: 'Apple Inc.',
  MSFT: 'Microsoft Corp.',
  GOOGL: 'Alphabet Inc.',
  AMZN: 'Amazon.com Inc.',
  TSLA: 'Tesla Inc.',
  NVDA: 'NVIDIA Corp.',
  META: 'Meta Platforms Inc.',
  NFLX: 'Netflix Inc.',
};

export function DataGrid({ symbols }: DataGridProps) {
  // INTENTIONAL BUG 1 CONSUMER:
  // We extract `cancel` and keep it alive in the component's closure.
  // Because of the shared lexical scope in the hook, this causes the 40MB buffer to leak.
  const { cancel } = useStreamBatcher('all_tickers', 1000);

  return (
    <div
      data-testid="data-grid-container"
      className="w-full overflow-auto max-h-[600px] border border-gray-800 rounded-lg bg-gray-950"
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-gray-900">
        <h3 className="text-sm font-semibold text-gray-300">Live Ticker Stream</h3>
        <button
          onClick={cancel}
          data-testid="cancel-batcher-button"
          className="px-3 py-1 bg-red-800 hover:bg-red-700 text-xs rounded font-medium text-white transition-colors"
        >
          Pause / Cancel Batcher
        </button>
      </div>

      <table className="w-full text-left border-collapse">
        <GridHeader />
        <tbody>
          {symbols.map((sym) => (
            <VirtualRow
              key={sym}
              symbol={sym}
              name={COMPANY_NAMES[sym] || `${sym} Corporation`}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
