import React, { useState, useEffect } from 'react';
import { useStreamBatcher } from '@/hooks/useStreamBatcher';
import { mockWebSocketServer } from '@/lib/engine/mockWebSocketServer';

export function CandidateTaskHUD() {
  const [isOpen, setIsOpen] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number>(5400); // 90 minutes
  const [renderStats, setRenderStats] = useState<{ aapl: number; msft: number }>({ aapl: 0, msft: 0 });
  const { cancel } = useStreamBatcher('all_tickers', 1000);

  // 90-minute countdown timer
  useEffect(() => {
    const storedStart = sessionStorage.getItem('assessment_senior_start_time');
    let startTime = storedStart ? parseInt(storedStart, 10) : Date.now();
    if (!storedStart) {
      sessionStorage.setItem('assessment_senior_start_time', String(startTime));
    }

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, 5400 - elapsed);
      setTimeLeft(remaining);

      // Read render counters
      if (typeof window !== 'undefined') {
        const counters = (window as any).__RENDER_COUNTERS__ || {};
        setRenderStats({
          aapl: counters['AAPL_price'] || 0,
          msft: counters['MSFT_price'] || 0,
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  const handleEmitAaplOnly = () => {
    mockWebSocketServer.emit('all_tickers', {
      symbol: 'AAPL',
      price: 185.0 + Math.random() * 2,
      change: 0.5,
      volume: 5000000,
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full shadow-2xl font-medium text-sm flex items-center space-x-2 border-2 border-white/20 transition-all"
      >
        <span>🛠 Senior Assessment Console</span>
        <span className="bg-indigo-900/60 text-xs px-2 py-0.5 rounded-full font-mono">
          {formatTime(timeLeft)}
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 bg-gray-900 text-gray-100 rounded-xl shadow-2xl border border-gray-700 p-5 font-sans animate-in slide-in-from-bottom-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
          <h3 className="font-bold text-sm text-white">Senior Assessment Console</h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono bg-gray-800 px-2 py-0.5 rounded text-indigo-300 border border-gray-700">
            ⏱ {formatTime(timeLeft)}
          </span>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white text-xs font-semibold px-1.5 py-0.5 rounded hover:bg-gray-800"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Task Checklist */}
      <div className="mt-4 space-y-4 text-xs">
        {/* Ticket 1: Closure Leak */}
        <div className="bg-gray-800/60 p-3 rounded-lg border border-gray-700/60">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-red-400">[BUG-2001] V8 Closure Leak</span>
            <span className="text-gray-400">Blocker</span>
          </div>
          <p className="mt-1 text-gray-300">
            40MB buffer stays pinned in V8 heap after cancellation due to shared lexical scope.
          </p>
          <button
            onClick={cancel}
            className="mt-2 w-full bg-red-600/30 hover:bg-red-600/50 text-red-200 border border-red-500/40 py-1.5 px-2 rounded font-medium transition-colors text-center"
          >
            🛑 Trigger Batcher Cancellation
          </button>
        </div>

        {/* Ticket 2: Render Cascade */}
        <div className="bg-gray-800/60 p-3 rounded-lg border border-gray-700/60">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-yellow-400">[BUG-2002] Render Cascade</span>
            <span className="text-gray-400">Critical</span>
          </div>
          <p className="mt-1 text-gray-300">
            Context reference instability causes all 1,200 cells to re-render on every tick.
          </p>
          <div className="mt-2 p-2 bg-gray-950 rounded border border-gray-800 font-mono text-[11px] flex justify-between">
            <span>AAPL Renders: <strong className="text-green-400">{renderStats.aapl}</strong></span>
            <span>MSFT Renders: <strong className="text-yellow-400">{renderStats.msft}</strong></span>
          </div>
          <button
            onClick={handleEmitAaplOnly}
            className="mt-2 w-full bg-yellow-600/30 hover:bg-yellow-600/50 text-yellow-200 border border-yellow-500/40 py-1.5 px-2 rounded font-medium transition-colors text-center"
          >
            ⚡ Update AAPL Only (Watch MSFT re-render)
          </button>
        </div>

        {/* Reminders */}
        <div className="pt-2 border-t border-gray-800 text-[11px] text-gray-400 space-y-1">
          <p>📌 Full details: <code className="text-indigo-300">./TASKS.md</code></p>
          <p>🧪 Run tests: <code className="text-indigo-300">pnpm test</code></p>
          <p>📝 Document prompts: <code className="text-indigo-300">./PROMPTS.md</code></p>
          <p className="text-amber-300/80">⚠️ Do not modify files in __tests__/</p>
        </div>
      </div>
    </div>
  );
}
