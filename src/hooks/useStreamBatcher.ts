import { useState, useEffect } from 'react';
import { mockWebSocketServer } from '@/lib/engine/mockWebSocketServer';
import { StreamPayload } from '@/types/stream';

export interface BatcherResult {
  lastBatch: StreamPayload[];
  cancel: () => void;
}

// SOLUTION 1: LEXICAL SCOPE ISOLATION
// We move timer creation into an independent helper scope.
// The returned cancel closure ONLY references `createTimer`'s scope (which only holds `timerId`).
// It does NOT share the V8 Context Record containing `rawBuffer`,
// allowing V8 to immediately garbage-collect the 40MB buffer upon unmount/cancellation.
function createTimer(callback: () => void, ms: number) {
  const timerId = setTimeout(callback, ms);
  return () => clearTimeout(timerId);
}

export function useStreamBatcher(channel: string, flushIntervalMs: number = 1000): BatcherResult {
  const [lastBatch, setLastBatch] = useState<StreamPayload[]>([]);
  const [cancelFn, setCancelFn] = useState<() => void>(() => () => {});

  useEffect(() => {
    // 1. Heavy allocation: 40MB raw buffer for local tick computations
    const rawBuffer = new ArrayBuffer(40_000_000);

    if (typeof globalThis !== 'undefined') {
      (globalThis as any).__LAST_RAW_BUFFER_REF__ = new WeakRef(rawBuffer);
    }

    // 2. Processing function: closes over `rawBuffer`
    const processTick = () => {
      const latest = mockWebSocketServer.getLatest(channel);
      if (latest && rawBuffer.byteLength > 0) {
        setLastBatch((prev) => [...prev.slice(-49), latest]);
      }
    };

    // 3. Isolated cancel function does NOT share lexical scope with rawBuffer:
    const cancel = createTimer(processTick, flushIntervalMs);

    setCancelFn(() => cancel);

    return () => {
      cancel();
    };
  }, [channel, flushIntervalMs]);

  return { lastBatch, cancel: cancelFn };
}
