import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import Typography from '@material-ui/core/Typography';
import Modal from './Modal';
import Board from './Board';
import Header from './Header';
import {
  newGame, setOpenCase, setOpenOffer, setNoDeal, setFinishGame, setPlayerChoice,
} from '../../../store/modules/dnd';
import {
  DBRootState, DBPlayer, DBDND, briefcasesToOpen,
} from '../../../store/types';

interface DNDActions {
  newGame: typeof newGame;
  setOpenOffer: typeof setOpenOffer;
  setOpenCase: typeof setOpenCase;
  setNoDeal: typeof setNoDeal;
  setFinishGame: typeof setFinishGame;
  setPlayerChoice: typeof setPlayerChoice;
}
interface DNDReduxState extends DBDND {
  player: DBPlayer;
}
interface DNDProps extends DNDReduxState {
  dndActions: DNDActions;
}

// TODO: add rules to page
/* DealOrNoDeal  ->  Header
 *              |->  Board  ->  Case
 *              |->  Modal  ->  Money */
const DND: React.FC<DNDProps> = (props: DNDProps) => {
  const {
    board,
    dndOpen,
    isOver,
    offer,
    player,
    playerChoice,
    casesToOpen,
    numCases,
    sum,
    turn,
  } = props;

  /** function to generate the bank offer */
  const getBankOffer = (): number => Math.round((sum / numCases) * (turn / 10));

  /** open a briefcase and update global status
   * NOTE: udpates sum, numCases, board, casesToOpen */
  const openBriefcase = (x: number): void => {
    const { dndActions } = props;
    const bc = board[x];
    // check if player has already made case selection
    if (playerChoice) {
      // verify cases left and briefcase not already opened
      if (!isOver && casesToOpen > 0 && bc.loc !== playerChoice.loc && bc.on) {
        // flag the value and update global trackers
        bc.on = false;
        // update board
        dndActions.setOpenCase(board, sum - bc.val, numCases - 1, casesToOpen - 1);
      }
    } else {
      dndActions.setPlayerChoice(player.id, bc);
    }
  };

  const handleOpen = (): void => {
    const { dndActions } = props;
    // get the new offer
    const newOffer = getBankOffer();
    // reset the counter
    const newCasesToOpen = turn < briefcasesToOpen - 1 ? briefcasesToOpen - turn : 1;
    dndActions.setOpenOffer(newOffer, newCasesToOpen);
  };

  /** function to reset the game */
  const newDNDGame = (): void => {
    const { dndActions } = props;
    dndActions.newGame();
  };

  /** function to finish the game
   * NOTE: payout to user offer / 1k */
  const finishGame = (finalOffer: number): void => {
    const { dndActions } = props;
    dndActions.setFinishGame(player.id, finalOffer);
  };

  /** called on selection of Deal */
  const deal = (): void => finishGame(offer);

  /** called on selection of No Deal
   * NOTE: update turn, casesToOpen */
  const noDeal = (): void => {
    const { dndActions } = props;
    // no deal on last case
    if (numCases <= 2) {
      finishGame(playerChoice ? playerChoice.val : -1);
    } else {
      // advance the turn
      dndActions.setNoDeal(turn);
    }
  };

  const swap = (): void => {
    for (let i = 0; i < board.length; i += 1) {
      const bc = board[i];
      if (bc.on && playerChoice && bc.loc !== playerChoice.loc) {
        finishGame(bc.val);
        return;
      }
    }
  };

  // check if it is time for an offer
  casesToOpen === 0 && setTimeout(handleOpen, 300);

  return (
    <>
      <Typography variant="h2" gutterBottom>Deal or No Deal</Typography>
      <Header
        casesToOpen={casesToOpen}
        isOver={isOver}
        newGame={newDNDGame}
        offer={offer}
        player={player}
        playerChoice={playerChoice}
      />
      <Board
        board={board}
        onClick={openBriefcase}
        playerChoice={playerChoice}
      />
      <Modal
        board={board}
        deal={deal}
        noDeal={noDeal}
        numCases={numCases}
        offer={offer}
        open={dndOpen}
        swap={swap}
      />
    </>
  );
};

// react-redux export
const mapStateToProps = (state: DBRootState): DNDReduxState => ({
  ...state.dnd,
  player: state.players[0],
});
const mapDispatchToProps = (dispatch: Dispatch): { dndActions: DNDActions } => ({
  dndActions: bindActionCreators({
    newGame, setOpenOffer, setOpenCase, setNoDeal, setFinishGame, setPlayerChoice,
  }, dispatch),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DND);
