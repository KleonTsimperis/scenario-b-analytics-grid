export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  volume: number;
  timestamp: number;
}

export interface StreamPayload extends StockQuote {
  channel: string;
}

export type StreamListener = (payload: StreamPayload) => void;

export interface StreamState {
  quotes: Record<string, StockQuote>;
  connected: boolean;
  activeChannel: string;
}
