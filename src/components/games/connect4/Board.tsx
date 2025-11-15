import { CSSProperties } from "react";
import Piece from "./Piece";
import { C4Turn } from "../../../jotai/connect4-atom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

interface BoardProps {
  board: number[][];
  insert: (col: number) => void;
  turn: C4Turn;
}

const styles: CSSProperties = {
  padding: 1,
  textAlign: "center",
};

const Board = ({ board, turn, insert }: BoardProps) => {
  // generate code for Connect4 Board
  const gameBoard = board
    .map((arr, i) => {
      const row = arr.map((piece, j) => (
        <TableCell key={`c4c${i},${j}`} style={styles}>
          <Piece piece={piece} />
        </TableCell>
      ));
      return <TableRow key={`c4r${i}`}>{row}</TableRow>;
    })
    .reverse();
  // generate buttons to play pieces based off top board row
  const gameButtons = board[board.length - 1].map((piece, i) => (
    <TableCell key={`c4h${i}`} style={styles}>
      <Piece
        enabled={!piece}
        onClick={(): void => insert(i)}
        piece={!piece ? turn : 0}
        ariaLabel={`insert piece into column ${i}`}
      />
    </TableCell>
  ));

  return (
    <Table>
      <TableHead>
        <TableRow>{gameButtons}</TableRow>
      </TableHead>
      <TableBody>{gameBoard}</TableBody>
    </Table>
  );
};

export default Board;
