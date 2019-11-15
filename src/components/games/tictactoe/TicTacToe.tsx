import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { playTurn, newGame } from '../../../store/modules/ticTacToe';
import Header from './Header';
import History from './History';
import Board from './Board';
import { getTurn, calculateWinner } from './helpers';
import { DBTicTacToe, DBRootState } from '../../../store/types';
import { X, O, EMPTY } from '../../../store/initialState';

interface TicTacToeActions {
  playTurn: Function;
  newGame: Function;
}
interface TicTacToeProps extends DBTicTacToe {
  ticTacToeActions: TicTacToeActions;
}

const paperStyles: React.CSSProperties = { width: 343, display: 'block', margin: 'auto' };

/* TicTacToe  ->  Header
 *           |->  Board  ->  Cell
 *           |->  History */
const TicTacToe: React.FC<TicTacToeProps> = (props: TicTacToeProps) => {
  const {
    turn, step, history, ticTacToeActions,
  } = props;
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

      ticTacToeActions.playTurn({
        history: newHistory.concat([{ board, location }]),
        step: newHistory.length,
        turn: turn === X ? O : X,
      });
    }
  };

  /** function that resets game back to it's initial state */
  const newTTTGame = (): void => {
    ticTacToeActions.newGame();
  };

  /** function that modifies board to go back to a previous point in history
   * @param step - desired point in history */
  const jumpToStep = (stepNo: number): void => {
    const newTurn: DBTicTacToe = { step: stepNo, turn: getTurn(stepNo), history };
    // Double click will eliminate all other history if there is any
    if (step === stepNo) {
      newTurn.history = history.slice(0, step + 1);
    }
    // update board to previous turn, non-permanent, history exists still
    ticTacToeActions.playTurn(newTurn);
  };

  const current = history[step];
  const board = current.board.slice();
  const { winner, winRow } = calculateWinner(board);

  return (
    <>
      <Typography variant="h2" gutterBottom>Tic-Tac-Toe</Typography>
      <Paper elevation={2} style={paperStyles}>
        <Header newGame={newTTTGame} turn={turn} winner={winner} />
        <Board
          board={board}
          onClick={handleClick}
          winRow={winRow}
        />
      </Paper>
      <History history={history} jumpToStep={jumpToStep} step={step} />
    </>
  );
};

// react-redux export
const mapStateToProps = (state: DBRootState): DBTicTacToe => ({
  ...state.ticTacToe,
});
const mapDispatchToProps = (dispatch: Dispatch): { ticTacToeActions: TicTacToeActions } => ({
  ticTacToeActions: bindActionCreators({ playTurn, newGame }, dispatch),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TicTacToe);
