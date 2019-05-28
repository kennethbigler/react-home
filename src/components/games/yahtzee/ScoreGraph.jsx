import React from 'react';
import types from 'prop-types';
import maxBy from 'lodash/maxBy';
import get from 'lodash/get';
import {
  ResponsiveContainer, XAxis, YAxis, Tooltip, AreaChart, Area,
} from 'recharts';
import { withTheme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import InfoPopup from '../../common/InfoPopup';
// Parents: Main

const ScoreGraph = (props) => {
  const { scores, theme: { palette: { secondary: { main } } } } = props;
  const mostRecent = get(scores, `[${scores.length - 1}].score`, 0);
  const topScore = scores.length > 0 ? maxBy(scores, 'score').score : 0;
  return (
    <InfoPopup title="Yahtzee Score History" buttonText="Score History">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={scores}>
          <defs>
            <linearGradient id="mainColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="20%" stopColor={main} stopOpacity={0.8} />
              <stop offset="100%" stopColor={main} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" interval="preserveStartEnd" />
          <YAxis width={40} orientation="right" tickLine={false} />
          <Tooltip />
          <Area type="monotone" dataKey="score" stroke={main} fillOpacity={1} fill="url(#mainColor)" />
        </AreaChart>
      </ResponsiveContainer>
      <Typography variant="h4">{`Most Recent: ${mostRecent}`}</Typography>
      <Typography variant="h4">{`Top Score: ${topScore}`}</Typography>
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

export default withTheme(ScoreGraph);
