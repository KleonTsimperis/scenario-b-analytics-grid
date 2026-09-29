import React, { useEffect } from 'react';
import { StreamProvider } from '@/contexts/StreamContext';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { mockWebSocketServer } from '@/lib/engine/mockWebSocketServer';

export function App() {
  useEffect(() => {
    mockWebSocketServer.startStreaming(100);
    return () => mockWebSocketServer.stopStreaming();
  }, []);

  return (
    <StreamProvider>
      <main className="min-h-screen py-8">
        <AnalyticsDashboard />
      </main>
    </StreamProvider>
  );
}

export default App;
