import React from "react";
import Typography from "@mui/material/Typography";
import Modal from "./Modal";
import Board from "./Board";
import Header from "./Header";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import {
  newGame,
  setOpenCase,
  setOpenOffer,
  setNoDeal,
  setFinishGame,
  setPlayerChoice,
  briefcasesToOpen,
} from "../../../store/modules/dnd";

// TODO: add rules to page
/* DealOrNoDeal  ->  Header
 *              |->  Board  ->  Case
 *              |->  Modal  ->  Money */
const DND: React.FC = () => {
  const {
    board,
    dndOpen,
    isOver,
    offer,
    sum,
    turn,
    player,
    playerChoice,
    casesToOpen,
    numCases,
  } = useAppSelector((state) => ({
    ...state.dnd,
    player: state.players[0],
  }));

  const dispatch = useAppDispatch();

  /** function to generate the bank offer */
  const getBankOffer = React.useCallback(
    (): number => Math.round((sum / numCases) * (turn / 10)),
    [numCases, sum, turn]
  );

  /** open a briefcase and update global status
   * NOTE: updates sum, numCases, board, casesToOpen */
  const openBriefcase = (x: number) => {
    const bc = board[x];
    // check if player has already made case selection
    if (playerChoice) {
      // verify cases left and briefcase not already opened
      if (!isOver && casesToOpen > 0 && bc.loc !== playerChoice.loc && bc.on) {
        // update board
        dispatch(
          setOpenCase({
            board,
            caseNum: x,
            sum: sum - bc.val,
            numCases: numCases - 1,
            casesToOpen: casesToOpen - 1,
          })
        );
      }
    } else {
      dispatch(setPlayerChoice({ id: player.id, playerChoice: bc }));
    }
  };

  const handleOpen = (): void => {
    // get the new offer
    const newOffer = getBankOffer();
    // reset the counter
    const newCasesToOpen =
      turn < briefcasesToOpen - 1 ? briefcasesToOpen - turn : 1;
    dispatch(setOpenOffer({ offer: newOffer, casesToOpen: newCasesToOpen }));
  };

  /** function to reset the game */
  const newDNDGame = (): void => {
    dispatch(newGame());
  };

  /** called on selection of Deal */
  const deal = (): void => {
    dispatch(setFinishGame({ id: player.id, offer }));
  };

  /** called on selection of No Deal
   * NOTE: update turn, casesToOpen */
  const noDeal = (): void => {
    // no deal on last case
    if (numCases <= 2) {
      dispatch(
        setFinishGame({
          id: player.id,
          offer: playerChoice ? playerChoice.val : -1,
        })
      );
    } else {
      // advance the turn
      dispatch(setNoDeal(turn));
    }
  };

  const swap = (): void => {
    for (let i = 0; i < board.length; i += 1) {
      const bc = board[i];
      if (bc.on && playerChoice && bc.loc !== playerChoice.loc) {
        dispatch(setFinishGame({ id: player.id, offer: bc.val }));
        return;
      }
    }
  };

  // check if it is time for an offer
  casesToOpen === 0 && setTimeout(handleOpen, 300);

  return (
    <>
      <Typography variant="h2" gutterBottom>
        Deal or No Deal
      </Typography>
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
