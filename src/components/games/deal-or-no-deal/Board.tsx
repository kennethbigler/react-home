import React from 'react';
import Paper from '@material-ui/core/Paper';
import Case from './Case';
import { Briefcase } from '../../../store/types';

interface BoardProps {
  board: Briefcase[];
  onClick: (x: number) => void;
  playerChoice?: Briefcase;
}

const style: React.CSSProperties = {
  maxWidth: 796,
  padding: 9,
  textAlign: 'center',
  display: 'block',
  margin: 'auto',
  marginTop: 20,
};

const Board: React.FC<BoardProps> = ({ board, onClick, playerChoice: pc }: BoardProps) => (
  <Paper elevation={2} style={style}>
    {board.map((bc, i) => (
      <Case
        key={i}
        briefcase={bc}
        onClick={(): void => onClick(i)}
        secondary={pc && pc.loc === bc.loc}
      />
    ))}
  </Paper>
);

export default Board;
