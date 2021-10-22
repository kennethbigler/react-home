import React from 'react';
import maxBy from 'lodash/maxBy';
import {
  ResponsiveContainer, XAxis, YAxis, Tooltip, AreaChart, Area,
} from 'recharts';
import { useTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';
import InfoPopup from '../../common/info-popover/InfoPopup';

interface ScoreGraphProps {
  scores: number[];
}
interface ScoreGraphEntry {
  value: number;
}

const generateScoreGraph = (scores: number[]): ScoreGraphEntry[] => (
  scores.map((value) => ({ value }))
);

const ScoreGraph: React.FC<ScoreGraphProps> = (props: ScoreGraphProps) => {
  const { palette: { secondary: { main }}} = useTheme();
  const { scores: dBScores } = props;

  const scores = React.useMemo(() => generateScoreGraph(dBScores), [dBScores]);
  const recent = scores[scores.length - 1] || { value: 0 };
  const mostRecent = recent.value;
  const top = maxBy(scores, 'value') || { value: 0 };
  const topScore = top.value;

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
          <Area type="monotone" dataKey="value" stroke={main} fillOpacity={1} fill="url(#mainColor)" />
        </AreaChart>
      </ResponsiveContainer>
      <Typography variant="h4">{`Most Recent: ${mostRecent}`}</Typography>
      <Typography variant="h4">{`Top Score: ${topScore}`}</Typography>
    </InfoPopup>
  );
};

export default ScoreGraph;
