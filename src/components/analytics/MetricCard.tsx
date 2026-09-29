import React from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
}

export function MetricCard({ title, value, subtitle }: MetricCardProps) {
  return (
    <div className="bg-gray-800/60 border border-gray-700/60 rounded-lg p-4">
      <h3 className="text-xs uppercase font-semibold text-gray-400">{title}</h3>
      <p className="mt-1 text-2xl font-bold font-mono text-white">{value}</p>
      {subtitle && <p className="mt-1 text-xs text-gray-500">{subtitle}</p>}
    </div>
  );
}
