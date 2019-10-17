import React from 'react';
import Typography from '@material-ui/core/Typography';
import ScoreGraph from './ScoreGraph';

interface HeaderProps {
  scores: number[];
}

const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
  const { scores } = props;

  return (
    <div className="flex-container">
      <Typography variant="h2">Yahtzee</Typography>
      <ScoreGraph scores={scores} />
    </div>
  );
};

export default Header;
