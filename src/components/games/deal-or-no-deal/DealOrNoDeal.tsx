import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import Typography from "@mui/material/Typography";
import Modal from "./Modal";
import Board from "./Board";
import Header from "./Header";
import dndState, {
  dndHelperSelector,
  briefcasesToOpen,
  newDNDGame,
} from "../../../recoil/deal-or-no-deal-state";

// TODO: add rules to page
/* DealOrNoDeal  ->  Header
 *              |->  Board  ->  Case
 *              |->  Modal  ->  Money */
const DND: React.FC = () => {
  const [{ dnd, player }, setState] = useRecoilState(dndState);
  const { numCases, offer } = useRecoilValue(dndHelperSelector);
  const { board, dndOpen, isOver, turn, playerChoice, casesToOpen } = dnd;

  // --------------------     Header     -------------------- //

  /** called in Header, resets game */
  const newGame = (): void => setState({ dnd: newDNDGame(), player });

  // --------------------     Board     -------------------- //

  /**
   * called in Board to open a briefcase
   * gets: board, playerChoice, isOver, casesToOpen
   * sets: dnd { board, casesTopOpen, playerChoice, dndOpen }, player { money }
   */
  const openBriefcase = (x: number) => {
    const bc = board[x];
    // check if player has already made case selection
    if (playerChoice) {
      // verify cases left and briefcase not already opened
      if (!isOver && casesToOpen > 0 && bc.loc !== playerChoice.loc && bc.on) {
        // flag the value and update global trackers
        const newBoard = [...board];
        const newCase = { ...newBoard[x], on: false };
        newBoard[x] = newCase;

        // update board
        setState({
          dnd: {
            ...dnd,
            board: newBoard,
            dndOpen: casesToOpen === 1,
            casesToOpen: casesToOpen - 1,
          },
          player,
        });
      }
    } else {
      setState({
        dnd: { ...dnd, playerChoice: bc },
        player: {
          ...player,
          money: player.money - 100,
        },
      });
    }
  };

  // --------------------     Modal     -------------------- //

  /**
   * called in Modal on selection of Deal
   * gets: offer
   * sets: dnd { dndOpen, isOver }, player: { status, money }
   */
  const deal = (): void => {
    const total = Math.round(offer / 1000);
    setState({
      dnd: {
        ...dnd,
        dndOpen: false,
        isOver: total,
      },
      player: {
        ...player,
        status: total > 100 ? "win" : "lose",
        money: player.money + total,
      },
    });
  };

  /**
   * called in Modal on selection of No Deal
   * gets: numCases, playerChoice
   * sets: dnd { dndOpen, isOver, turn, casesToOpen }, player: { status, money }
   */
  const noDeal = (): void => {
    // no deal on last case
    if (numCases <= 2) {
      const newOffer = playerChoice ? playerChoice.val : -1;
      const total = Math.round(newOffer / 1000);
      setState({
        dnd: {
          ...dnd,
          dndOpen: false,
          isOver: total,
        },
        player: {
          ...player,
          status: total > 100 ? "win" : "lose",
          money: player.money + total,
        },
      });
    } else {
      // advance the turn
      setState({
        dnd: {
          ...dnd,
          dndOpen: false,
          turn: turn + 1,
          casesToOpen:
            turn < briefcasesToOpen - 1 ? briefcasesToOpen - turn : 1,
        },
        player,
      });
    }
  };

  /**
   * called in Modal
   * gets: board, playerChoice, player.money
   * sets: dnd { dndOpen, isOver }, player: { status, money }
   */
  const swap = (): void => {
    for (let i = 0; i < board.length; i += 1) {
      const bc = board[i];
      if (bc.on && playerChoice && bc.loc !== playerChoice.loc) {
        const total = Math.round(bc.val / 1000);
        setState({
          dnd: {
            ...dnd,
            dndOpen: false,
            isOver: total,
          },
          player: {
            ...player,
            status: total > 100 ? "win" : "lose",
            money: player.money + total,
          },
        });
        return;
      }
    }
  };

  return (
    <>
      <Typography variant="h2" gutterBottom>
        Deal or No Deal
      </Typography>
      <Header
        casesToOpen={casesToOpen}
        isOver={isOver}
        newGame={newGame}
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
