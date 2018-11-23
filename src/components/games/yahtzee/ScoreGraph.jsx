import React from 'react';
import types from 'prop-types';
import {
  ResponsiveContainer, XAxis, YAxis, Tooltip, AreaChart, Area,
} from 'recharts';
import { withTheme } from '@material-ui/core/styles';
import InfoPopup from '../../common/InfoPopup';
// Parents: Main

const ScoreGraph = (props) => {
  const { scores, theme } = props;
  return (
    <InfoPopup title="Yahtzee Score History">
      <ResponsiveContainer minWidth={255} height={300}>
        <AreaChart data={scores}>
          <defs>
            <linearGradient id="mainColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="20%" stopColor={theme.palette.secondary.main} stopOpacity={0.8} />
              <stop offset="100%" stopColor={theme.palette.secondary.main} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" interval="preserveStartEnd" />
          <YAxis width={40} orientation="right" tickLine={false} />
          <Tooltip />
          <Area type="monotone" dataKey="score" stroke={theme.palette.secondary.main} fillOpacity={1} fill="url(#mainColor)" />
        </AreaChart>
      </ResponsiveContainer>
    </InfoPopup>
  );
};

ScoreGraph.propTypes = {
  // types = [array, bool, func, number, object, string, symbol].isRequired
  scores: types.arrayOf(
    types.shape({
      score: types.number.isRequired,
    }).isRequired,
  ).isRequired,
  theme: types.shape({
    palette: types.shape({
      secondary: types.shape({
        main: types.string.isRequired,
      }).isRequired,
    }).isRequired,
  }),
};

export default withTheme()(ScoreGraph);
