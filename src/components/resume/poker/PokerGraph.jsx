import React from 'react';
import types from 'prop-types';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip,
} from 'recharts';
import map from 'lodash/map';
// custom
// Parents: PokerNightTabs

const PokerNight = (props) => {
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
        <Tooltip itemSorter={a => -a.value} />
      </LineChart>
    </ResponsiveContainer>
  );
};

PokerNight.propTypes = {
  parsedScores: types.arrayOf(types.objectOf(types.oneOfType([types.string, types.number]))).isRequired,
  colors: types.objectOf(types.string).isRequired,
  domain: types.arrayOf(types.number).isRequired,
  ticks: types.arrayOf(types.number),
};

export default PokerNight;
