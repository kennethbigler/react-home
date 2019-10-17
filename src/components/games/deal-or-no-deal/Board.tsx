import React from 'react';
import Paper from '@material-ui/core/Paper';
import map from 'lodash/map';
import Case, { Briefcase } from './Case';


interface BoardProps {
  board: Briefcase[];
  onClick: Function;
  playerChoice: Briefcase;
}

const style: React.CSSProperties = {
  maxWidth: 796,
  padding: 9,
  textAlign: 'center',
  display: 'block',
  margin: 'auto',
  marginTop: 20,
};

const Board: React.FC<BoardProps> = (props: BoardProps) => {
  const { board, onClick, playerChoice: pc } = props;

  return (
    <Paper elevation={2} style={style}>
      {map(board, (bc, i) => (
        <Case
          key={i}
          briefcase={bc}
          onClick={(): void => onClick(i)}
          secondary={pc && pc.loc === bc.loc}
        />
      ))}
    </Paper>
  );
};

export default Board;
