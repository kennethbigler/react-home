import { memo } from "react";
import { useAtom, useAtomValue } from "jotai";
import Typography from "@mui/material/Typography";
import Modal from "./Modal";
import Board from "./Board";
import Header from "./Header";
import dndState, {
  dealOrNoDealRead,
  briefcasesToOpen,
  newDNDGame,
} from "../../../jotai/deal-or-no-deal-state";
import PlayerMenu from "../../common/header/PlayerMenu";

/* DealOrNoDeal  ->  Header
 *              |->  Board  ->  Case
 *              |->  Modal  ->  Money */
const DealOrNoDeal = memo(() => {
  const [{ dnd, money, status }, setState] = useAtom(dndState);
  const { numCases, offer, name } = useAtomValue(dealOrNoDealRead);
  const { board, dndOpen, isOver, turn, playerChoice, casesToOpen } = dnd;

  // --------------------     Header     -------------------- //

  /** called in Header, resets game */
  const newGame = (): void => setState({ dnd: newDNDGame() });

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
        });
      }
    } else {
      setState({
        dnd: { ...dnd, playerChoice: bc },
        money: money - 100,
        status,
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
    const total = Math.ceil(offer / 1000);
    setState({
      dnd: {
        ...dnd,
        dndOpen: false,
        isOver: total,
      },
      money: money + total,
      status: total > 100 ? "win" : "lose",
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
      const newOffer = playerChoice?.val || 0;
      const total = Math.ceil(newOffer / 1000);
      setState({
        dnd: {
          ...dnd,
          dndOpen: false,
          isOver: total,
        },
        money: money + total,
        status: total > 100 ? "win" : "lose",
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
      });
    }
  };

  /**
   * called in Modal
   * gets: board, playerChoice, money
   * sets: dnd { dndOpen, isOver }, player: { status, money }
   */
  const swap = (): void => {
    for (let i = 0; i < board.length; i += 1) {
      const bc = board[i];
      if (bc.on && playerChoice && bc.loc !== playerChoice.loc) {
        const total = Math.ceil(bc.val / 1000);
        setState({
          dnd: {
            ...dnd,
            dndOpen: false,
            isOver: total,
          },
          money: money + total,
          status: total > 100 ? "win" : "lose",
        });
        return;
      }
    }
  };

  return (
    <>
      <div className="flex-container">
        <Typography variant="h2" component="h1" gutterBottom>
          Deal or No Deal
        </Typography>
        <PlayerMenu />
      </div>
      <Header
        casesToOpen={casesToOpen}
        isOver={isOver}
        newGame={newGame}
        name={name}
        money={money}
        playerChoice={playerChoice}
        dndOpen={dndOpen}
      />
      <Board
        board={board}
        isOver={!!isOver}
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
});

DealOrNoDeal.displayName = "DealOrNoDeal";

export default DealOrNoDeal;
