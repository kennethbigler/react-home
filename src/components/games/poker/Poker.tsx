import React from 'react';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import asyncForEach from '../../../helpers/asyncForEach';
import { swapCards, newHand, payout } from '../../../store/modules/players';
import GameTable from '../game-table';
import Deck from '../../../apis/Deck';
import {
  rankHand, getHistogram, evaluate, getHand,
} from './helpers';
import {
  newPokerGame, startPokerGame, endPokerTurn, endPokerGame,
  discardCards, updateCardsToDiscard,
} from '../../../store/modules/poker';
import {
  DBPlayer, DBTurn, DBRootState, DBPoker,
  PokerGameFunctions as PGF,
} from '../../../store/types';

const DEALER = 0;
const LAST_PLAYER = 5;

interface PokerActions {
  playerActions: {
    swapCards: typeof swapCards;
    newHand: typeof newHand;
    payout: typeof payout;
  };
  pokerActions: {
    newPokerGame: typeof newPokerGame;
    startPokerGame: typeof startPokerGame;
    endPokerTurn: typeof endPokerTurn;
    endPokerGame: typeof endPokerGame;
    discardCards: typeof discardCards;
    updateCardsToDiscard: typeof updateCardsToDiscard;
  };
}
interface PokerDBState extends DBPoker {
  turn: DBTurn;
  players: DBPlayer[];
}
interface PokerProps extends PokerDBState, PokerActions {}

interface UsePokerFunctions {
  checkUpdate: () => Promise<void>;
  handleGameFunctionClick: (type: PGF) => void;
}

const usePokerFunctions = (props: PokerProps): UsePokerFunctions => {
  const { players, turn: { player: turn }} = props;

  // ----------     bot automation handlers     ---------- //
  /** increment player turn and reset state */
  const endTurn = async (turnToEnd: number): Promise<void> => {
    const { pokerActions } = props;
    await pokerActions.endPokerTurn(turnToEnd);
  };

  /** iterate through array, removing each index number from hand
   * then add new cards to the hand
   */
  const discard = async (cardsToDiscardInDB: number[]): Promise<void> => {
    const { playerActions } = props;

    const { id, hands } = players[turn];
    await playerActions.swapCards(hands, id, cardsToDiscardInDB);
  };

  /** function to remove n number of cards */
  const discardHelper = async (n: number, hist: number[]): Promise<void> => {
    const hand = getHand(players, turn);
    const nextCardsToDiscard = [];
    const cardValues = [hist.indexOf(1)];
    // find cards without pairs, starting with the smallest
    for (let i = 1; i < n; i += 1) {
      cardValues[i] = hist.indexOf(1, cardValues[i - 1] + 1);
    }
    // find hand index of individual cards
    for (let i = 0; i < hand.length; i += 1) {
      for (let j = 0; j < cardValues.length; j += 1) {
        if (hand[i].weight - 2 === cardValues[j]) {
          nextCardsToDiscard.push(i);
          break;
        }
      }
    }

    // discard lowest, non-pair n cards
    await discard(nextCardsToDiscard);
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
  const computer = async (): Promise<void> => {
    const hand = getHand(players, turn);
    const hist = getHistogram(hand);
    const rank = rankHand(hand, hist);

    switch (rank) {
      case 0: // draw 4-5 on high card
        hist.lastIndexOf(1) >= 11
          ? await discardHelper(4, hist) // if ace || king draw 4
          : await discard([0, 1, 2, 3, 4]); // otherwise, draw all 5
        break;
      case 1: // draw 3 on 2 of a kind
        await discardHelper(3, hist);
        break;
      case 2: // draw 1 on 3 of a kind
      case 3: // draw 1 on 2 Pair
        await discardHelper(1, hist);
        break;
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
    const { playerActions, pokerActions } = props;

    let winner = { val: 0, id: 0 };
    players.forEach((player) => {
      if (player.id === DEALER || player.id > LAST_PLAYER) { return; }

      const playerScore = parseInt(evaluate(player.hands[0].cards), 14);
      if (playerScore > winner.val) {
        winner = { val: playerScore, id: player.id };
      }
    });
    await pokerActions.endPokerGame();
    players.forEach((player) => {
      if (player.id === DEALER || player.id > LAST_PLAYER) { return; }

      if (player.id === winner.id) {
        playerActions.payout(player.id, 'win', 20);
      } else {
        playerActions.payout(player.id, 'lose', -5);
      }
    });
  };

  const checkUpdate = async (): Promise<void> => {
    const { previousPlayer, hideHands } = props;

    const player = players[turn] || { isBot: false };
    const gameOver = previousPlayer >= LAST_PLAYER;
    const hasNotPlayed = previousPlayer !== turn;

    if (!hideHands && !gameOver && player.isBot && hasNotPlayed) {
      console.log(previousPlayer);
      const canPlay: boolean = player.id !== DEALER && player.id <= LAST_PLAYER;
      console.log(canPlay ? `computer(${player.id})` : 'endGame()', player);
      canPlay ? await computer() : await endGame();
    }
  };

  // ----------     player handlers     ---------- //
  const newGame = (): void => {
    const { pokerActions } = props;
    pokerActions.newPokerGame(players);
  };

  /** function to finish betting and start the game */
  const startGame = (): void => {
    const { pokerActions, playerActions } = props;

    pokerActions.startPokerGame();
    // shuffle the deck
    Deck.shuffle().then(() => {
      // deal the hands
      asyncForEach(players, async (player: DBPlayer) => {
        if (player.id !== DEALER && player.id <= LAST_PLAYER) {
          await playerActions.newHand(player.id, 5);
        }
      });
    });
  };

  /** helper function wrapping discard, meant for UI */
  const handleDiscard = (): void => {
    const { pokerActions, cardsToDiscard } = props;
    discard(cardsToDiscard);
    pokerActions.discardCards();
  };

  /** function to route click actions */
  const handleGameFunctionClick = (type: PGF): void => {
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

const Poker: React.FC<PokerProps> = (props: PokerProps) => {
  const {
    turn, players, cardsToDiscard, gameFunctions,
    previousPlayer, hideHands,
  } = props;

  /** function to be called on card clicks */
  const cardClickHandler = (playerNo: number, handNo: number, cardNo: number): void => {
    const { pokerActions } = props;
    const newCardsToDiscard = [...cardsToDiscard];
    // find card
    const i = newCardsToDiscard.indexOf(cardNo);
    // toggle in array
    i === -1 ? newCardsToDiscard.push(cardNo) : newCardsToDiscard.splice(i, 1);
    // update state
    pokerActions.updateCardsToDiscard(newCardsToDiscard);
  };

  const { checkUpdate, handleGameFunctionClick } = usePokerFunctions(props);

  checkUpdate();

  return (
    <>
      <Typography variant="h2" gutterBottom>
        5 Card Draw Poker
      </Typography>
      <GameTable
        cardClickHandler={cardClickHandler}
        cardsToDiscard={cardsToDiscard}
        gameFunctions={gameFunctions}
        onClick={handleGameFunctionClick}
        gameOver={previousPlayer >= LAST_PLAYER}
        hideHands={hideHands}
        isBlackJack={false}
        players={players}
        turn={turn}
      />
    </>
  );
};

// react-redux export
function mapStateToProps(state: DBRootState): PokerDBState {
  return {
    turn: state.turn,
    players: state.players,
    ...state.poker,
  };
}

function mapDispatchToProps(dispatch: Dispatch): PokerActions {
  return {
    playerActions: bindActionCreators({ swapCards, newHand, payout }, dispatch),
    pokerActions: bindActionCreators(
      {
        newPokerGame,
        startPokerGame,
        endPokerTurn,
        endPokerGame,
        discardCards,
        updateCardsToDiscard,
      },
      dispatch,
    ),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Poker);
