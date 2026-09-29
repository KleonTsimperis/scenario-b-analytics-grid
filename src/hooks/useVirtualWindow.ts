import { useState, useEffect } from 'react';

export function useVirtualWindow(itemCount: number, rowHeight: number = 40) {
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(600);

  useEffect(() => {
    const handleResize = () => setViewportHeight(window.innerHeight || 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalHeight = itemCount * rowHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - 2);
  const endIndex = Math.min(itemCount - 1, Math.floor((scrollTop + viewportHeight) / rowHeight) + 2);

  return {
    startIndex,
    endIndex,
    totalHeight,
    onScroll: (e: React.UIEvent<HTMLElement>) => setScrollTop(e.currentTarget.scrollTop),
  };
}
