import { Dispatch } from "redux";
import asyncForEach from "../../../helpers/asyncForEach";
import { swapCards, newHand, payout } from "../../../store/modules/players";
import Deck from "../../../apis/Deck";
import { DEALER, LAST_PLAYER, computer, findAndPayWinner } from "./helpers";
import {
  newPokerGame,
  startPokerGame,
  endPokerTurn,
  endPokerGame,
  discardCards,
} from "../../../store/modules/poker";
import { DBPlayer, PokerGameFunctions as PGF } from "../../../store/types";

interface UsePokerFunctions {
  checkUpdate: () => Promise<void>;
  handleGameFunctionClick: (type: string) => void;
}

const usePokerFunctions = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: Dispatch<any>,
  cardsToDiscard: number[],
  players: DBPlayer[],
  turn: number,
  hideHands: boolean,
  gameOver: boolean
): UsePokerFunctions => {
  // ----------     bot automation handlers     ---------- //
  /** increment player turn and reset state */
  const endTurn = async (): Promise<void> => {
    try {
      await dispatch(endPokerTurn());
    } catch (e) {
      console.error(e); // eslint-disable-line no-console
    }
  };

  /** iterate through array, removing each index number from hand
   * then add new cards to the hand */
  const discard = async (
    cardsToDiscardInDB: number[],
    player: DBPlayer
  ): Promise<void> => {
    try {
      const { id, hands } = player;
      await dispatch(swapCards(hands, id, cardsToDiscardInDB));
    } catch (e) {
      console.error(e); // eslint-disable-line no-console
    }
  };

  const payPlayer = (id: number, status: string, money: number) => {
    dispatch(payout(id, status, money));
  };

  const endGame = async (
    tempPlayers: DBPlayer[],
    tempTurn: number
  ): Promise<void> => {
    try {
      await dispatch(endPokerGame());

      await asyncForEach(tempPlayers, async (player: DBPlayer, i: number) => {
        if (tempTurn <= i && i < LAST_PLAYER) {
          await computer(player, discard);
        }
      });

      findAndPayWinner(tempPlayers, payPlayer);
    } catch (e) {
      console.error(e); // eslint-disable-line no-console
    }
  };

  const checkUpdate = async (): Promise<void> => {
    try {
      const player = players[turn] || { isBot: false };

      if (!hideHands && !gameOver && player.isBot) {
        await endGame(players, turn);
      }
    } catch (e) {
      console.error(e); // eslint-disable-line no-console
    }
  };

  // ----------     player handlers     ---------- //
  const newGame = async (tempPlayers: DBPlayer[]): Promise<void> => {
    try {
      await dispatch(newPokerGame(tempPlayers));
    } catch (e) {
      console.error(e); // eslint-disable-line no-console
    }
  };

  /** function to finish betting and start the game */
  const startGame = async (tempPlayers: DBPlayer[]): Promise<void> => {
    try {
      await dispatch(startPokerGame());
      // shuffle the deck
      await Deck.shuffle().then(async () => {
        // deal the hands
        await asyncForEach(tempPlayers, async (player: DBPlayer) => {
          if (player.id !== DEALER && player.id <= LAST_PLAYER) {
            try {
              await dispatch(newHand(player.id, 5));
            } catch (e) {
              console.error(e); // eslint-disable-line no-console
            }
          }
        });
      });
    } catch (e) {
      console.error(e); // eslint-disable-line no-console
    }
  };

  /** helper function wrapping discard, meant for UI */
  const handleDiscard = async (
    tempPlayers: DBPlayer[],
    tempTurn: number,
    tempCardsToDiscard: number[]
  ): Promise<void> => {
    try {
      await discard(tempCardsToDiscard, tempPlayers[tempTurn]);
      await dispatch(discardCards());
    } catch (e) {
      console.error(e); // eslint-disable-line no-console
    }
  };

  /** function to route click actions */
  const handleGameFunctionClick = async (type: string): Promise<void> => {
    try {
      switch (type) {
        case PGF.DISCARD_CARDS:
          await handleDiscard(players, turn, cardsToDiscard);
          break;
        case PGF.END_TURN:
          await endTurn();
          break;
        case PGF.NEW_GAME:
          await newGame(players);
          break;
        case PGF.START_GAME:
          await startGame(players);
          break;
        default:
          // eslint-disable-next-line no-console
          console.error("Unknown Game Function: ", type);
      }
    } catch (e) {
      console.error(e); // eslint-disable-line no-console
    }
  };

  return {
    checkUpdate,
    handleGameFunctionClick,
  };
};

export default usePokerFunctions;
