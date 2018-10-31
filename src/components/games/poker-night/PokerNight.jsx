import React from 'react';
// https://react-table.js.org/#/story/readme
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend,
} from 'recharts';
import 'react-table/react-table.css';
// functions
import map from 'lodash/map';
import assign from 'lodash/assign';
import reduce from 'lodash/reduce';
import hasIn from 'lodash/hasIn';
import scores, { colors } from './poker';
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

  console.log(parsedScores);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={parsedScores}>
        {map(colors, (color, key) => <Line type="monotone" dataKey={key} key={key} stroke={color} />)}
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip itemSorter={(a, b) => b.value - a.value} />
        <Legend />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PokerNight;
