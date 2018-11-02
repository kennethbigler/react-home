import React from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend,
} from 'recharts';
// functions
import map from 'lodash/map';
import assign from 'lodash/assign';
import reduce from 'lodash/reduce';
import hasIn from 'lodash/hasIn';
import scores, { colors } from '../../../constants/poker';
// Parents: Main

const PokerNight = () => {
  let prevWeek = {};
  const parsedScores = map(scores, (week) => {
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
      <h2>Penny Poker Night Scores</h2>
      <ResponsiveContainer width="100%" height={650}>
        <LineChart data={parsedScores}>
          {map(colors, (color, key) => <Line type="monotone" dataKey={key} key={key} stroke={color} />)}
          <XAxis dataKey="name" interval="preserveStartEnd" />
          <YAxis
            domain={[-400, 600]}
            width={40}
            orientation="right"
            tickLine={false}
            ticks={[-400, -200, 0, 200, 400, 600]}
          />
          <Tooltip itemSorter={(a, b) => b.value - a.value} />
          <Legend />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PokerNight;
