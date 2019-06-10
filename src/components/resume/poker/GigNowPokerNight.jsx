import React, { memo } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip,
} from 'recharts';
import map from 'lodash/map';
// custom
import parseData from './helpers';
import { gigNowPokerScores, gigNowPokerColors } from '../../../constants/poker';
// Parents: PokerNightTabs

const PokerNight = memo(() => {
  const parsedScores = parseData(gigNowPokerScores);

  return (
    <div>
      <ResponsiveContainer width="100%" height={650}>
        <LineChart data={parsedScores}>
          {map(gigNowPokerColors, (color, key) => <Line type="monotone" dataKey={key} key={key} stroke={color} />)}
          <XAxis dataKey="name" interval="preserveStartEnd" />
          <YAxis
            domain={[-100, 100]}
            width={40}
            orientation="right"
            tickLine={false}
          />
          <Tooltip itemSorter={a => -a.value} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});

export default PokerNight;
