import React, { memo } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip,
} from 'recharts';
import map from 'lodash/map';
// custom
import parseData from './helpers';
import { pennyPokerScores, pennyPokerColors } from '../../../constants/poker';
// Parents: PokerNightTabs

const PennyPokerNight = memo(() => {
  const parsedScores = parseData(pennyPokerScores);

  return (
    <div>
      <ResponsiveContainer width="100%" height={650}>
        <LineChart data={parsedScores}>
          {map(pennyPokerColors, (color, key) => (
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
            domain={[-400, 600]}
            width={40}
            orientation="right"
            tickLine={false}
            ticks={[-400, -200, 0, 200, 400, 600]}
          />
          <Tooltip itemSorter={a => -a.value} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});

export default PennyPokerNight;
