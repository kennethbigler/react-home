import React from "react";
import { useRecoilState } from "recoil";
import Typography from "@mui/material/Typography";
import Modal from "./Modal";
import Board from "./Board";
import Header from "./Header";
import dndState, {
  briefcasesToOpen,
  newDNDGame,
} from "../../../recoil/deal-or-no-deal-state";

// TODO: add rules to page
/* DealOrNoDeal  ->  Header
 *              |->  Board  ->  Case
 *              |->  Modal  ->  Money */
const DND: React.FC = () => {
  const [{ dnd, player }, setState] = useRecoilState(dndState);
  const {
    board,
    dndOpen,
    isOver,
    offer,
    sum,
    turn,
    playerChoice,
    casesToOpen,
    numCases,
  } = dnd;

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
        // flag the value and update global trackers
        const newBoard = [...board];
        const newCase = { ...newBoard[x], on: false };
        newBoard[x] = newCase;

        // update board
        setState({
          dnd: {
            ...dnd,
            board: newBoard,
            sum: sum - bc.val,
            numCases: numCases - 1,
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

  const handleOpen = (): void => {
    // get the new offer
    const newOffer = getBankOffer();
    // reset the counter
    const newCasesToOpen =
      turn < briefcasesToOpen - 1 ? briefcasesToOpen - turn : 1;
    setState({
      dnd: {
        ...dnd,
        offer: newOffer,
        casesToOpen: newCasesToOpen,
        dndOpen: true,
      },
      player,
    });
  };

  /** function to reset the game */
  const newGame = (): void => setState({ dnd: newDNDGame(), player });

  /** called on selection of Deal */
  const deal = (): void => {
    const total = Math.round(offer / 1000);
    setState({
      dnd: {
        ...dnd,
        dndOpen: false,
        isOver: true,
      },
      player: {
        ...player,
        status: total > 100 ? "win" : "lose",
        money: player.money + total,
      },
    });
  };

  /** called on selection of No Deal
   * NOTE: update turn, casesToOpen */
  const noDeal = (): void => {
    // no deal on last case
    if (numCases <= 2) {
      const newOffer = playerChoice ? playerChoice.val : -1;
      const total = Math.round(newOffer / 1000);
      setState({
        dnd: {
          ...dnd,
          dndOpen: false,
          isOver: true,
          offer: newOffer,
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
        },
        player,
      });
    }
  };

  const swap = (): void => {
    for (let i = 0; i < board.length; i += 1) {
      const bc = board[i];
      if (bc.on && playerChoice && bc.loc !== playerChoice.loc) {
        const total = Math.round(bc.val / 1000);
        setState({
          dnd: {
            ...dnd,
            dndOpen: false,
            isOver: true,
            offer: bc.val,
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
        newGame={newGame}
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
