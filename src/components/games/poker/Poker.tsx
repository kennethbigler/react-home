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

const Poker: React.FC<PokerProps> = (props: PokerProps) => {
  const {
    turn: { player: turn }, players, cardsToDiscard, gameFunctions,
    gameOver, hideHands,
  } = props;

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

  /** increment player turn and reset state */
  const endTurn = (): void => {
    const { pokerActions } = props;
    pokerActions.endPokerTurn();
  };

  const endGame = (): void => {
    const { playerActions, pokerActions } = props;

    let winner = { val: 0, id: 0 };
    players.forEach((player) => {
      if (player.id === DEALER || player.id > LAST_PLAYER) { return; }

      const playerScore = parseInt(evaluate(player.hands[0].cards), 14);
      if (playerScore > winner.val) {
        winner = { val: playerScore, id: player.id };
      }
    });
    players.forEach((player) => {
      if (player.id === DEALER || player.id > LAST_PLAYER) { return; }

      if (player.id === winner.id) {
        playerActions.payout(player.id, 'win', 20);
      } else {
        playerActions.payout(player.id, 'lose', -5);
      }
    });
    pokerActions.endPokerGame();
  };

  /** iterate through array, removing each index number from hand
   * then add new cards to the hand
   */
  const discard = (cardsToDiscardInDB: number[]): void => {
    const { playerActions } = props;

    const { id, hands } = players[turn];
    playerActions.swapCards(hands, id, cardsToDiscardInDB);
  };

  /** helper function wrapping discard, meant for UI */
  const handleDiscard = (): void => {
    const { pokerActions } = props;
    discard(cardsToDiscard);
    pokerActions.discardCards();
  };

  /** function to remove n number of cards */
  const discardHelper = (n: number, hist: number[]): void => {
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
    discard(nextCardsToDiscard);
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
  const computer = (): void => {
    const hand = getHand(players, turn);
    const hist = getHistogram(hand);
    const rank = rankHand(hand, hist);

    switch (rank) {
      case 0: // draw 4-5 on high card
        hist.lastIndexOf(1) >= 11
          ? discardHelper(4, hist) // if ace || king draw 4
          : discard([0, 1, 2, 3, 4]); // otherwise, draw all 5
        break;
      case 1: // draw 3 on 2 of a kind
        discardHelper(3, hist);
        break;
      case 2: // draw 1 on 3 of a kind
      case 3: // draw 1 on 2 Pair
        discardHelper(1, hist);
        break;
      case 4: // draw 0 on straight
      case 5: // draw 0 on flush
      case 6: // draw 0 on full house
      case 7: // draw 0 on 4 of a kind
      case 8: // draw 0 on straight flush
      default:
        break;
    }
    endTurn();
  };

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

  /** function to route click actions */
  const handleGameFunctionClick = (type: PGF): void => {
    switch (type) {
      case PGF.DISCARD_CARDS:
        handleDiscard(); break;
      case PGF.END_TURN:
        endTurn(); break;
      case PGF.NEW_GAME:
        newGame(); break;
      case PGF.START_GAME:
        startGame(); break;
      default:
        // eslint-disable-next-line no-console
        console.error('Unknown Game Function: ', type);
    }
  };

  const checkUpdate = (): void => {
    const player: DBPlayer = players[turn];

    if (!hideHands && !gameOver && player.isBot) {
      const canPlay: boolean = player.id !== DEALER && player.id <= LAST_PLAYER;
      canPlay ? computer() : endGame();
      console.log(canPlay ? 'computer()' : 'endGame()');
    }
  };

  checkUpdate();

  const playerTurn = React.useMemo(() => ({ player: turn, hand: 0 }), [turn]);

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
        gameOver={gameOver}
        hideHands={hideHands}
        isBlackJack={false}
        players={players}
        turn={playerTurn}
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
