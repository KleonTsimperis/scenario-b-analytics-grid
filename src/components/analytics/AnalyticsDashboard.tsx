import React, { useState } from 'react';
import { TabNavigation } from './TabNavigation';
import { MetricCard } from './MetricCard';
import { DataGrid } from '@/components/grid/DataGrid';
import { useStreamContext } from '@/contexts/StreamContext';
import { calculateMarketSummary } from '@/lib/metrics/calculations';

const TICKERS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX'];

export function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'telemetry'>('telemetry');
  const { quotes, connected } = useStreamContext();
  const summary = calculateMarketSummary(quotes);

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Market Telemetry Console</h1>
          <p className="text-sm text-gray-400">High-frequency real-time order stream monitor</p>
        </div>
        <div className="flex items-center space-x-2">
          <span
            className={`w-3 h-3 rounded-full ${
              connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
            }`}
          />
          <span className="text-xs text-gray-400 font-mono">
            {connected ? 'STREAM LIVE (100ms)' : 'OFFLINE'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <MetricCard
          title="Average Portfolio Price"
          value={`$${summary.avgPrice.toFixed(2)}`}
          subtitle="Updated in real time"
        />
        <MetricCard
          title="Aggregate Volume"
          value={summary.totalVolume.toLocaleString()}
          subtitle="Cumulative session ticks"
        />
        <MetricCard
          title="Top Gainer"
          value={summary.topGainer ? `${summary.topGainer.symbol}` : 'None'}
          subtitle={
            summary.topGainer ? `+${summary.topGainer.change.toFixed(2)}%` : 'No data'
          }
        />
      </div>

      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'overview' ? (
        <div data-testid="overview-panel" className="bg-gray-800/40 p-8 rounded-lg text-center border border-gray-700/60">
          <h3 className="text-lg font-semibold text-white mb-2">Market Overview Snapshot</h3>
          <p className="text-sm text-gray-400 max-w-lg mx-auto">
            Switch tabs to Live Telemetry to view the continuous WebSocket order feed.
          </p>
        </div>
      ) : (
        <DataGrid symbols={TICKERS} />
      )}
    </div>
  );
}
