import React from 'react';
import { GridCell } from './GridCell';

interface VirtualRowProps {
  symbol: string;
  name: string;
  style?: React.CSSProperties;
}

export const VirtualRow = React.memo(function VirtualRow({ symbol, name, style }: VirtualRowProps) {
  return (
    <tr data-testid={`row-${symbol}`} style={style} className="hover:bg-gray-800/40 transition-colors">
      <td className="p-2 border border-gray-800 font-medium text-white">{symbol}</td>
      <td className="p-2 border border-gray-800 text-gray-400 text-sm">{name}</td>
      <GridCell symbol={symbol} field="price" />
      <GridCell symbol={symbol} field="change" />
      <GridCell symbol={symbol} field="volume" />
    </tr>
  );
});
