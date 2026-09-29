import { StreamPayload, StreamListener } from '@/types/stream';

class MockWebSocketServer {
  private listeners: Map<string, Set<StreamListener>> = new Map();
  private latestPayloads: Map<string, StreamPayload> = new Map();
  private intervalId: any = null;

  subscribe(channel: string, listener: StreamListener): () => void {
    if (!this.listeners.has(channel)) {
      this.listeners.set(channel, new Set());
    }
    this.listeners.get(channel)!.add(listener);

    return () => {
      const set = this.listeners.get(channel);
      if (set) {
        set.delete(listener);
        if (set.size === 0) {
          this.listeners.delete(channel);
        }
      }
    };
  }

  emit(channel: string, payload: Partial<StreamPayload> & { symbol: string; price: number }) {
    const fullPayload: StreamPayload = {
      channel,
      change: 0,
      volume: 1000,
      timestamp: Date.now(),
      ...payload,
    };

    this.latestPayloads.set(channel, fullPayload);

    const channelListeners = this.listeners.get(channel);
    if (channelListeners) {
      channelListeners.forEach((listener) => listener(fullPayload));
    }
  }

  getLatest(channel: string): StreamPayload | undefined {
    return this.latestPayloads.get(channel);
  }

  getListenerCount(channel: string): number {
    return this.listeners.get(channel)?.size || 0;
  }

  startStreaming(intervalMs: number = 100) {
    if (this.intervalId) return;

    const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX'];
    this.intervalId = setInterval(() => {
      const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
      const priceDelta = (Math.random() - 0.49) * 2;
      this.emit('all_tickers', {
        symbol: randomSymbol,
        price: Math.max(10, 150 + priceDelta * 10),
        change: priceDelta,
        volume: Math.floor(Math.random() * 100000),
      });
    }, intervalMs);
  }

  stopStreaming() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  reset() {
    this.stopStreaming();
    this.listeners.clear();
    this.latestPayloads.clear();
  }
}

export const mockWebSocketServer = new MockWebSocketServer();
