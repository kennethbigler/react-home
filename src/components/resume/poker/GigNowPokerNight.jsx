import React from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend,
} from 'recharts';
// functions
import map from 'lodash/map';
import assign from 'lodash/assign';
import reduce from 'lodash/reduce';
import hasIn from 'lodash/hasIn';
import { gigNowPokerScores, gigNowPokerColors } from '../../../constants/poker';
// Parents: PokerNightTabs

const PokerNight = () => {
  let prevWeek = {};
  const parsedScores = map(gigNowPokerScores, (week) => {
    const parsedWeek = reduce(assign({}, week, prevWeek, { name: week.name }), (parsed, val, key) => {
      if (hasIn(prevWeek, key) && hasIn(week, key) && key !== 'name') {
        parsed[key] = prevWeek[key] + week[key];
      } else {
        parsed[key] = val;
      }
      return parsed;
    }, {});
    prevWeek = parsedWeek;
    return parsedWeek;
  });

  return (
    <div>
      <h1>GigNow Poker Night Scores</h1>
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
          <Tooltip itemSorter={(a, b) => b.value - a.value} />
          <Legend />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PokerNight;
