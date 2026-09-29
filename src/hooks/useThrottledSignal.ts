import { useState, useEffect, useRef } from 'react';

export function useThrottledSignal<T>(value: T, intervalMs: number = 200): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecuted = useRef<number>(Date.now());

  useEffect(() => {
    if (Date.now() >= lastExecuted.current + intervalMs) {
      lastExecuted.current = Date.now();
      setThrottledValue(value);
    } else {
      const timerId = setTimeout(() => {
        lastExecuted.current = Date.now();
        setThrottledValue(value);
      }, intervalMs);
      return () => clearTimeout(timerId);
    }
  }, [value, intervalMs]);

  return throttledValue;
}
