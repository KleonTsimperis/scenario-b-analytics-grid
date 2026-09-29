import { useState, useEffect } from 'react';
import { mockWebSocketServer } from '@/lib/engine/mockWebSocketServer';
import { StreamPayload } from '@/types/stream';

export interface BatcherResult {
  lastBatch: StreamPayload[];
  cancel: () => void;
}

export function useStreamBatcher(channel: string, flushIntervalMs: number = 1000): BatcherResult {
  const [lastBatch, setLastBatch] = useState<StreamPayload[]>([]);
  const [cancelFn, setCancelFn] = useState<() => void>(() => () => {});

  useEffect(() => {
    // 1. Heavy allocation: 40MB raw buffer for local tick computations
    const rawBuffer = new ArrayBuffer(40_000_000);
    
    // Store weak ref globally so our automated test suite can assert whether V8 GC was able to free it
    if (typeof globalThis !== 'undefined') {
      (globalThis as any).__LAST_RAW_BUFFER_REF__ = new WeakRef(rawBuffer);
    }

    // 2. Processing function: closes over `rawBuffer` to compute byte metrics
    const processTick = () => {
      const latest = mockWebSocketServer.getLatest(channel);
      if (latest && rawBuffer.byteLength > 0) {
        setLastBatch((prev) => [...prev.slice(-49), latest]);
      }
    };

    // 3. Native setTimeout schedule
    const timerId = setTimeout(processTick, flushIntervalMs);

    // INTENTIONAL BUG 1 (The Jake Archibald Closure Leak):
    // This `cancel` closure ONLY uses `timerId`.
    // However, because `timerId` and `rawBuffer` are defined in the SAME lexical scope,
    // and `processTick` references `rawBuffer`, V8 places both on the SAME Context Record.
    // As long as `cancel` is referenced by the component state, `rawBuffer` CANNOT be collected!
    const cancel = () => {
      clearTimeout(timerId);
    };

    setCancelFn(() => cancel);

    return () => {
      cancel();
    };
  }, [channel, flushIntervalMs]);

  return { lastBatch, cancel: cancelFn };
}
