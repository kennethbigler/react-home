import React from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip,
} from 'recharts';
import { PokerScoreEntry, PokerColorEntry } from '../../../constants/poker';

interface PokerNightProps {
  parsedScores: PokerScoreEntry[];
  colors: PokerColorEntry;
  domain: [number, number];
  ticks?: number[];
}

const PokerNight: React.FC<PokerNightProps> = (props: PokerNightProps) => {
  const {
    parsedScores, colors, domain, ticks,
  } = props;

  return (
    <ResponsiveContainer width="100%" height={650}>
      <LineChart data={parsedScores}>
        {Object.entries(colors).map(([key, color]: [string, string]) => (
          <Line
            type="monotone"
            dataKey={key}
            key={key}
            stroke={color}
            connectNulls
          />
        ))}
        <XAxis dataKey="name" interval="preserveStartEnd" />
        <YAxis
          domain={domain}
          width={40}
          orientation="right"
          tickLine={false}
          ticks={ticks && ticks}
        />
        <Tooltip itemSorter={(a): number => ((a.value !== undefined) ? -a.value : 0)} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PokerNight;
