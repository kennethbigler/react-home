import asyncForEach from '../../../helpers/asyncForEach';
import { swapCards, newHand, payout } from '../../../store/modules/players';
import Deck from '../../../apis/Deck';
import {
  rankHand, getHistogram, evaluate, getCardsToDiscard,
} from './helpers';
import {
  newPokerGame, startPokerGame, endPokerTurn, endPokerGame,
  discardCards,
} from '../../../store/modules/poker';
import {
  DBPlayer, DBTurn, DBPoker, PokerGameFunctions as PGF,
} from '../../../store/types';

const DEALER = 0;
const LAST_PLAYER = 5;

interface UsePokerFunctions {
  checkUpdate: () => Promise<void>;
  handleGameFunctionClick: (type: PGF) => void;
}

interface PokerHookProps extends DBPoker {
  players: DBPlayer[];
  turn: DBTurn;
  dispatch: Function;
}

const usePokerFunctions = (props: PokerHookProps): UsePokerFunctions => {
  // ----------     bot automation handlers     ---------- //
  /** increment player turn and reset state */
  const endTurn = async (turnToEnd: number): Promise<void> => {
    const { dispatch } = props;
    await dispatch(endPokerTurn(turnToEnd));
  };

  /** iterate through array, removing each index number from hand
   * then add new cards to the hand
   */
  const discard = async (cardsToDiscardInDB: number[], player: DBPlayer): Promise<void> => {
    const { dispatch } = props;
    const { id, hands } = player;
    await dispatch(swapCards(hands, id, cardsToDiscardInDB));
  };

  /** computer play algorithm:
   * PAIRS
   * draw 0 on 4 of a kind
   * draw 0 on full house
   * draw 1 on 3 of a kind, keep higher of 2
   * draw 1 on 2 pair
   * draw 3 on 2 of a kind
   *
   * This is a nice to have, for now we only follow the first half
   * STRAIGHT/FLUSH
   * draw 0 on straight
   * draw 0 on flush
   * draw 0 on straight flush
   * if 1 away from sf -> draw 1
   * if 1 away from S -> draw 1 if 5+ players, else regular hand
   * if 1 away from F -> draw 1 if 5+ players, else regular hand
   *
   * REGULAR HAND
   * if K / A -> draw 4
   * else draw 5
   */
  const computer = async (player: DBPlayer, turn: number): Promise<void> => {
    const hand = player.hands[0].cards;
    const hist = getHistogram(hand);
    const rank = rankHand(hand, hist);

    switch (rank) {
      case 0: /* draw 4-5 on high card */ {
        const nextCardsToDiscard = hist.lastIndexOf(1) >= 11
          ? getCardsToDiscard(4, hist, hand) // if ace || king draw 4
          : [0, 1, 2, 3, 4]; // otherwise, draw all 5
        await discard(nextCardsToDiscard, player);
        break;
      }
      case 1: /* draw 3 on 2 of a kind */ {
        const nextCardsToDiscard = getCardsToDiscard(3, hist, hand);
        await discard(nextCardsToDiscard, player);
        break;
      }
      case 2: /* draw 1 on 3 of a kind */
      case 3: /* draw 1 on 2 Pair */ {
        const nextCardsToDiscard = getCardsToDiscard(1, hist, hand);
        await discard(nextCardsToDiscard, player);
        break;
      }
      case 4: // draw 0 on straight
      case 5: // draw 0 on flush
      case 6: // draw 0 on full house
      case 7: // draw 0 on 4 of a kind
      case 8: // draw 0 on straight flush
      default:
        break;
    }
    await endTurn(turn);
  };

  const endGame = async (): Promise<void> => {
    const { dispatch, players } = props;

    let winner = { val: 0, id: 0 };
    players.forEach((player) => {
      if (player.id === DEALER || player.id > LAST_PLAYER) { return; }

      const playerScore = parseInt(evaluate(player.hands[0].cards), 14);
      if (playerScore > winner.val) {
        winner = { val: playerScore, id: player.id };
        console.log(winner);
      }
    });
    await dispatch(endPokerGame());
    players.forEach((player) => {
      if (player.id === DEALER || player.id > LAST_PLAYER) { return; }

      if (player.id === winner.id) {
        dispatch(payout(player.id, 'win', 20));
      } else {
        dispatch(payout(player.id, 'lose', -5));
      }
    });
  };

  const checkUpdate = async (): Promise<void> => {
    const {
      previousPlayer, hideHands, players, turn: { player: turn },
    } = props;

    const player = players[turn] || { isBot: false };
    const gameOver = previousPlayer >= LAST_PLAYER;
    const hasNotPlayed = previousPlayer !== turn;

    if (!hideHands && !gameOver && player.isBot && hasNotPlayed) {
      console.log('------------------------------');
      console.log('previous player: ', previousPlayer);
      const canPlay: boolean = player.id !== DEALER && player.id <= LAST_PLAYER;
      console.log(canPlay ? `computer(${player.id}, ${turn})` : 'endGame()');
      console.log(player);
      canPlay ? await computer(player, turn) : await endGame();
    }
  };

  // ----------     player handlers     ---------- //
  const newGame = (): void => {
    const { dispatch, players } = props;
    dispatch(newPokerGame(players));
  };

  /** function to finish betting and start the game */
  const startGame = (): void => {
    const { dispatch, players } = props;

    dispatch(startPokerGame());
    // shuffle the deck
    Deck.shuffle().then(() => {
      // deal the hands
      asyncForEach(players, async (player: DBPlayer) => {
        if (player.id !== DEALER && player.id <= LAST_PLAYER) {
          await dispatch(newHand(player.id, 5));
        }
      });
    });
  };

  /** helper function wrapping discard, meant for UI */
  const handleDiscard = (): void => {
    const {
      dispatch, cardsToDiscard, players, turn: { player: turn },
    } = props;
    discard(cardsToDiscard, players[turn]);
    dispatch(discardCards());
  };

  /** function to route click actions */
  const handleGameFunctionClick = (type: PGF): void => {
    const { turn: { player: turn }} = props;
    switch (type) {
      case PGF.DISCARD_CARDS:
        handleDiscard(); break;
      case PGF.END_TURN:
        endTurn(turn); break;
      case PGF.NEW_GAME:
        newGame(); break;
      case PGF.START_GAME:
        startGame(); break;
      default:
        // eslint-disable-next-line no-console
        console.error('Unknown Game Function: ', type);
    }
  };

  return {
    checkUpdate,
    handleGameFunctionClick,
  };
};

export default usePokerFunctions;
