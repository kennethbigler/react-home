import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Piece from './Piece';
import { C4Turn } from '../../../store/types';

interface BoardProps {
  board: number[][];
  insert: (col: number) => void;
  turn: C4Turn;
}

const styles: React.CSSProperties = {
  padding: 1,
  textAlign: 'center',
};

const Board: React.FC<BoardProps> = (props: BoardProps) => {
  const { board, turn, insert } = props;
  // generate code for Connect4 Board
  const gameBoard = board.map((arr, i) => {
    const row = arr.map((piece, j) => (
      <TableCell key={`c4c${i},${j}`} style={styles}>
        <Piece piece={piece} />
      </TableCell>
    ));
    return (
      <TableRow key={`c4r${i}`}>
        {row}
      </TableRow>
    );
  }).reverse();
  // generate buttons to play pieces based off top board row
  const gameButtons = board[board.length - 1].map((piece, i) => (
    <TableCell key={`c4h${i}`} style={styles}>
      <Piece
        enabled={!piece}
        onClick={(): void => insert(i)}
        piece={!piece ? turn : 0}
      />
    </TableCell>
  ));

  return (
    <Table>
      <TableHead>
        <TableRow>
          {gameButtons}
        </TableRow>
      </TableHead>
      <TableBody>
        {gameBoard}
      </TableBody>
    </Table>
  );
};

export default Board;
