import { StockQuote } from '@/types/stream';

export function calculateMarketSummary(quotes: Record<string, StockQuote>) {
  const quoteList = Object.values(quotes);
  if (quoteList.length === 0) {
    return { avgPrice: 0, totalVolume: 0, topGainer: null };
  }

  const totalVolume = quoteList.reduce((sum, q) => sum + q.volume, 0);
  const avgPrice = quoteList.reduce((sum, q) => sum + q.price, 0) / quoteList.length;

  const topGainer = [...quoteList].sort((a, b) => b.change - a.change)[0] || null;

  return { avgPrice, totalVolume, topGainer };
}
