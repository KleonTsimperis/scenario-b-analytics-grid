import React from 'react';

interface BadgeProps {
  variant?: 'positive' | 'negative' | 'neutral';
  children: React.ReactNode;
}

export function Badge({ variant = 'neutral', children }: BadgeProps) {
  const styles = {
    positive: 'bg-green-900/60 text-green-300 border-green-700',
    negative: 'bg-red-900/60 text-red-300 border-red-700',
    neutral: 'bg-gray-800 text-gray-300 border-gray-700',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${styles[variant]}`}>
      {children}
    </span>
  );
}
