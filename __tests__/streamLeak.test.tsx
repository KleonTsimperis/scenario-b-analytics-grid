import { renderHook, act } from '@testing-library/react';
import { useStreamBatcher } from '../src/hooks/useStreamBatcher';

describe('Scenario B: Shared Lexical Scope & Closure Leak', () => {
  it('MUST allow rawBuffer to be garbage collected even while cancel() closure is retained', async () => {
    // Requires node running with --expose-gc (pre-configured in package.json test script)
    if (!global.gc) {
      throw new Error('Test must be executed with --expose-gc flag enabled.');
    }

    let cancelFn: (() => void) | null = null;

    // 1. Mount the hook
    const { result, unmount } = renderHook(() => useStreamBatcher('all_tickers', 500));

    act(() => {
      cancelFn = result.current.cancel;
    });

    // Capture the weak reference to the inner buffer exposed by the hook
    const targetRef = (globalThis as any).__LAST_RAW_BUFFER_REF__ as WeakRef<ArrayBuffer>;

    // Ensure it exists initially
    expect(targetRef.deref()).toBeDefined();

    // 2. Call cancel() to clear the timer
    act(() => {
      if (cancelFn) cancelFn();
    });

    // 3. Unmount the hook (optional, but ensures React effects are cleaned)
    unmount();

    // Allow any pending microtasks (promises) or event loop tasks (setTimeout clearing) to finish
    await new Promise((resolve) => setTimeout(resolve));

    // 4. Trigger full V8 Garbage Collection sweep
    global.gc();
    global.gc();

    // INTENTIONAL BUG 1 FAILURE ASSERTION:
    // In the buggy code, `cancelFn` is still retained in our test closure.
    // Because `cancelFn` shares the V8 Context Record with `rawBuffer`,
    // `targetRef.deref()` is NOT undefined (V8 was unable to collect the 40MB buffer!).
    // In a properly decoupled implementation, targetRef.deref() is undefined (freed).
    expect(targetRef.deref()).toBeUndefined();
  });
});
