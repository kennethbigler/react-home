import { MouseEventHandler } from "react";
import Paper from "@mui/material/Paper";
import Board from "./Board";
import Header from "./Header";
import { C4Turn } from "../../../jotai/connect4-atom";

interface GameBoardProps {
  board: number[][];
  insert: (col: number) => void;
  newGame: MouseEventHandler;
  turn: C4Turn;
  winner?: number;
}

const GameBoard = ({
  board,
  insert,
  winner,
  turn,
  newGame,
}: GameBoardProps) => (
  <Paper
    elevation={2}
    style={{
      maxWidth: 900,
      minWidth: 300,
      display: "block",
      margin: "auto",
      paddingBottom: 5,
    }}
  >
    <Header newGame={newGame} turn={turn} winner={winner} />
    <Board board={board} insert={insert} turn={turn} />
  </Paper>
);

export default GameBoard;
