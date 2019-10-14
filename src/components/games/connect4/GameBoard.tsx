import React from 'react';
import Paper from '@material-ui/core/Paper';
import Board from './Board';
import Header from './Header';
import { Turn } from './types';

interface GameBoardProps {
  board: number[][];
  insert: Function;
  newGame: React.MouseEventHandler;
  turn: Turn;
  winner?: number;
}

const GameBoard: React.FC<GameBoardProps> = (props: GameBoardProps) => {
  const {
    board, insert, winner, turn,
    newGame,
  } = props;

  return (
    <Paper
      elevation={2}
      style={{
        maxWidth: 900,
        minWidth: 300,
        display: 'block',
        margin: 'auto',
        paddingBottom: 5,
      }}
    >
      <Header newGame={newGame} turn={turn} winner={winner} />
      <Board board={board} insert={insert} turn={turn} />
    </Paper>
  );
};

export default GameBoard;
