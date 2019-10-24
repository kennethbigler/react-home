import React from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, AxisDomain,
} from 'recharts';
import map from 'lodash/map';

interface PokerNightProps {
  parsedScores: { [name: string]: string | number }[];
  colors: { [name: string]: string };
  domain: [AxisDomain, AxisDomain];
  ticks?: number[];
}

const PokerNight: React.FC<PokerNightProps> = (props: PokerNightProps) => {
  const {
    parsedScores, colors, domain, ticks,
  } = props;

  return (
    <ResponsiveContainer width="100%" height={650}>
      <LineChart data={parsedScores}>
        {map(colors, (color, key) => (
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
        <Tooltip itemSorter={(a): number => -a.value} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PokerNight;
