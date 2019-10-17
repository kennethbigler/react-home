import React from 'react';
import get from 'lodash/get';
import maxBy from 'lodash/maxBy';
import {
  ResponsiveContainer, XAxis, YAxis, Tooltip, AreaChart, Area,
} from 'recharts';
import { withTheme } from '@material-ui/core/styles';
import { Typography, Theme } from '@material-ui/core';
import InfoPopup from '../../common/InfoPopup';

interface ScoreGraphProps {
  scores: number[];
  theme: Theme;
}
interface ScoreGraphEntry {
  score: number;
  value: number;
}
interface ScoreGraphState {
  scores: ScoreGraphEntry[];
}

const generateScoreGraph = (scores: number[]): ScoreGraphState => ({
  scores: scores.map((score) => ({ score, value: score })),
});

class ScoreGraph extends React.Component<ScoreGraphProps, ScoreGraphState> {
  constructor(props: ScoreGraphProps) {
    super(props);
    this.state = generateScoreGraph(props.scores);
  }

  static getDerivedStateFromProps(props: ScoreGraphProps, state: ScoreGraphState): ScoreGraphState | null {
    if (props.scores.length > state.scores.length) {
      return generateScoreGraph(props.scores);
    }
    return null;
  }

  shouldComponentUpdate(nextProps: ScoreGraphProps): boolean {
    const { scores } = this.props;
    return nextProps.scores.length > scores.length;
  }

  render(): React.ReactNode {
    const { theme: { palette: { secondary: { main }}}} = this.props;
    const { scores } = this.state;

    const mostRecent = get(scores, `[${scores.length - 1}].score`, 0);
    const topScore = get(maxBy(scores, 'score'), 'score', 0);

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
  }
}

export default withTheme(ScoreGraph);
