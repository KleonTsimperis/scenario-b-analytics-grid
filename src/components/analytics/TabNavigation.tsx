import React from 'react';

interface TabNavigationProps {
  activeTab: 'overview' | 'telemetry';
  onTabChange: (tab: 'overview' | 'telemetry') => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="flex space-x-2 border-b border-gray-800 pb-2 mb-6">
      <button
        data-testid="tab-overview"
        onClick={() => onTabChange('overview')}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          activeTab === 'overview'
            ? 'bg-blue-600 text-white'
            : 'text-gray-400 hover:text-white hover:bg-gray-800'
        }`}
      >
        Overview Summary
      </button>
      <button
        data-testid="tab-telemetry"
        onClick={() => onTabChange('telemetry')}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          activeTab === 'telemetry'
            ? 'bg-blue-600 text-white'
            : 'text-gray-400 hover:text-white hover:bg-gray-800'
        }`}
      >
        Live Telemetry Grid
      </button>
    </div>
  );
}
