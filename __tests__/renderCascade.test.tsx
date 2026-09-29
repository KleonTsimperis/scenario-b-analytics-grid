import React from 'react';
import { render, act } from '@testing-library/react';
import { StreamProvider } from '../src/contexts/StreamContext';
import { DataGrid } from '../src/components/grid/DataGrid';
import { mockWebSocketServer } from '../src/lib/engine/mockWebSocketServer';

describe('Scenario B: Performance Cascade & Selector Isolation', () => {
  beforeEach(() => {
    (window as any).__RENDER_COUNTERS__ = {};
    mockWebSocketServer.reset();
  });

  it('MUST NOT re-render unrelated cells when an individual ticker updates', async () => {
    render(
      <StreamProvider>
        <DataGrid symbols={['AAPL', 'MSFT', 'GOOGL', 'AMZN']} />
      </StreamProvider>
    );

    // Initial render count for MSFT cell
    const initialMsftRenders = (window as any).__RENDER_COUNTERS__['MSFT_price'] || 1;

    // Simulate an AAPL ticker update ONLY
    await act(async () => {
      mockWebSocketServer.emit('all_tickers', {
        symbol: 'AAPL',
        price: 185.5,
        change: 0.75,
        volume: 5400000,
      });
    });

    // AAPL cell should have re-rendered
    expect((window as any).__RENDER_COUNTERS__['AAPL_price']).toBeGreaterThan(1);

    // INTENTIONAL BUG 2 ASSERTION:
    // In the buggy implementation, StreamContext generates a fresh object reference on every state update,
    // causing MSFT cells to re-render even though MSFT's data never changed!
    // In the fixed implementation, MSFT cell render count MUST remain strictly equal to initialMsftRenders.
    expect((window as any).__RENDER_COUNTERS__['MSFT_price']).toBe(initialMsftRenders);
  });
});
