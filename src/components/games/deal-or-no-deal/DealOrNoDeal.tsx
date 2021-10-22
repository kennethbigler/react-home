import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Typography from '@mui/material/Typography';
import Modal from './Modal';
import Board from './Board';
import Header from './Header';
import {
  newGame, setOpenCase, setOpenOffer, setNoDeal, setFinishGame, setPlayerChoice,
} from '../../../store/modules/dnd';
import { DBRootState, briefcasesToOpen } from '../../../store/types';

// TODO: add rules to page
/* DealOrNoDeal  ->  Header
 *              |->  Board  ->  Case
 *              |->  Modal  ->  Money */
const DND: React.FC = () => {
  const {
    board, dndOpen, isOver, offer, sum, turn,
    player, playerChoice, casesToOpen, numCases,
  } = useSelector((state: DBRootState) => ({
    ...state.dnd,
    player: state.players[0],
  }));

  const dispatch = useDispatch();

  /** function to generate the bank offer */
  const getBankOffer = React.useCallback(
    (): number => Math.round((sum / numCases) * (turn / 10)),
    [numCases, sum, turn],
  );

  /** open a briefcase and update global status
   * NOTE: udpates sum, numCases, board, casesToOpen */
  const openBriefcase = React.useCallback((x: number): void => {
    const bc = board[x];
    // check if player has already made case selection
    if (playerChoice) {
      // verify cases left and briefcase not already opened
      if (!isOver && casesToOpen > 0 && bc.loc !== playerChoice.loc && bc.on) {
        // flag the value and update global trackers
        bc.on = false;
        // update board
        dispatch(setOpenCase(board, sum - bc.val, numCases - 1, casesToOpen - 1));
      }
    } else {
      dispatch(setPlayerChoice(player.id, bc));
    }
  }, [board, casesToOpen, dispatch, isOver, numCases, player.id, playerChoice, sum]);

  const handleOpen = React.useCallback((): void => {
    // get the new offer
    const newOffer = getBankOffer();
    // reset the counter
    const newCasesToOpen = turn < briefcasesToOpen - 1 ? briefcasesToOpen - turn : 1;
    dispatch(setOpenOffer(newOffer, newCasesToOpen));
  }, [dispatch, getBankOffer, turn]);

  /** function to reset the game */
  const newDNDGame = React.useCallback((): void => {
    dispatch(newGame());
  }, [dispatch]);

  /** function to finish the game
   * NOTE: payout to user offer / 1k */
  const finishGame = React.useCallback((finalOffer: number): void => {
    dispatch(setFinishGame(player.id, finalOffer));
  }, [dispatch, player.id]);

  /** called on selection of Deal */
  const deal = React.useCallback(
    (): void => finishGame(offer),
    [finishGame, offer],
  );

  /** called on selection of No Deal
   * NOTE: update turn, casesToOpen */
  const noDeal = React.useCallback((): void => {
    // no deal on last case
    if (numCases <= 2) {
      finishGame(playerChoice ? playerChoice.val : -1);
    } else {
      // advance the turn
      dispatch(setNoDeal(turn));
    }
  }, [dispatch, finishGame, numCases, playerChoice, turn]);

  const swap = React.useCallback((): void => {
    for (let i = 0; i < board.length; i += 1) {
      const bc = board[i];
      if (bc.on && playerChoice && bc.loc !== playerChoice.loc) {
        finishGame(bc.val);
        return;
      }
    }
  }, [board, finishGame, playerChoice]);

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

export default DND;
