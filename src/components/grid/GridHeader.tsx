import React from 'react';

export function GridHeader() {
  return (
    <thead className="bg-gray-800 text-gray-300 text-left text-xs uppercase tracking-wider sticky top-0 z-10">
      <tr>
        <th className="p-2 border border-gray-700">Ticker</th>
        <th className="p-2 border border-gray-700">Company</th>
        <th className="p-2 border border-gray-700">Price</th>
        <th className="p-2 border border-gray-700">24h Change</th>
        <th className="p-2 border border-gray-700">Volume</th>
      </tr>
    </thead>
  );
}
