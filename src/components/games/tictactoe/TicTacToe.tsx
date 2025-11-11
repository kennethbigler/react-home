import { memo, CSSProperties } from "react";
import { useAtom } from "jotai";
import ticTacToeAtom, {
  TicTacToeState,
  X,
  O,
  EMPTY,
  newTicTacToe,
} from "../../../jotai/tic-tac-toe-atom";
import Header from "./Header";
import History from "./History";
import Board from "./Board";
import { getTurn, calculateWinner } from "./helpers";
import { Paper, Typography } from "@mui/material";

const paperStyles: CSSProperties = {
  width: 343,
  display: "block",
  margin: "auto",
};

/* TicTacToe  ->  Header
 *           |->  Board  ->  Cell
 *           |->  History */
const TicTacToe = memo(() => {
  const [{ turn, step, history }, setState] = useAtom(ticTacToeAtom);

  /** function that modifies board with appropriate turn
   * @param location - location of board click (row * 3 + col) */
  const handleClick = (location: number): void => {
    const newHistory = history.slice(0, step + 1);
    const current = newHistory[step];
    const board = current.board.slice();

    // game is over or cell is full
    if (!calculateWinner(board).winner && board[location] === EMPTY) {
      // place marker, then update turn
      board[location] = turn;

      setState({
        history: newHistory.concat([{ board, location }]),
        step: newHistory.length,
        turn: turn === X ? O : X,
      });
    }
  };

  /** function that resets game back to it's initial state */
  const newTTTGame = (): void => setState(newTicTacToe());

  /** function that modifies board to go back to a previous point in history
   * @param step - desired point in history */
  const jumpToStep = (stepNo: number): void => {
    const newTurn: TicTacToeState = {
      step: stepNo,
      turn: getTurn(stepNo),
      history,
    };
    // Double click will eliminate all other history if there is any
    if (step === stepNo) {
      newTurn.history = history.slice(0, step + 1);
    }
    // update board to previous turn, non-permanent, history exists still
    setState(newTurn);
  };

  const current = history[step];
  const board = current.board.slice();
  const { winner, winRow } = calculateWinner(board);

  return (
    <>
      <Typography variant="h2" component="h1" gutterBottom>
        Tic-Tac-Toe
      </Typography>
      <Paper elevation={2} style={paperStyles}>
        <Header newGame={newTTTGame} turn={turn} winner={winner} />
        <Board board={board} onClick={handleClick} winRow={winRow} />
      </Paper>
      <History history={history} jumpToStep={jumpToStep} step={step} />
    </>
  );
});

TicTacToe.displayName = "TicTacToe";

export default TicTacToe;
