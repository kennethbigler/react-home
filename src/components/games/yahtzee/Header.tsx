import React from 'react';
import Typography from '@mui/material/Typography';
import ScoreGraph from './ScoreGraph';

interface HeaderProps {
  scores: number[];
}

const Header: React.FC<HeaderProps> = ({ scores }: HeaderProps) => (
  <div className="flex-container">
    <Typography variant="h2">Yahtzee</Typography>
    <ScoreGraph scores={scores} />
  </div>
);

export default Header;
