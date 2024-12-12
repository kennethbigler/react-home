import { useAtom, useSetAtom } from "jotai";
import { shuffleAtom, dealPokerAtom, DBCard } from "../../../jotai/deck-state";
import pokerState, {
  PokerGameFunctions as PGF,
  newPokerGameState,
} from "../../../jotai/poker-state";
import { DBPlayer } from "../../../jotai/player-atom";

/** Rankings:
 *   Straight Flush  8
 *   4 of a Kind     7
 *   Full House      6
 *   Flush           5
 *   Straight        4
 *   3 of a Kind     3
 *   2 Pair          2
 *   1 Pair          1
 *   High Card       0
 * @return {number} value is a base 14 string, to be converted into base 10 for comparison */
export const rankHand = (hand: DBCard[], hist: number[]): number => {
  // iterate through and look for hands with multiple cards
  if (hist.includes(4)) {
    return 7; // 4 of a kind
  }
  // Check for hands with sets of 3 or 2 cards
  const has3 = hist.includes(3);
  const i = hist.indexOf(2);
  const has2 = i !== -1;
  if (has3 && has2) {
    return 6; // full house
  }
  if (has3) {
    return 3; // 3 of a kind
  }
  if (has2 && hist.includes(2, i + 1)) {
    return 2; // 2 pair
  }
  if (has2) {
    return 1; // 1 pair
  }
  // all single cards
  // check for straight
  const isStraight =
    hist.lastIndexOf(1) - hist.indexOf(1) === 4 || // (end - start = 4)
    (hist[12] && hist[0] && hist[1] && hist[2] && hist[3]); // (A,2,3,4,5)
  // check for flush
  let isFlush = true;
  for (let j = 0; j < hand.length; j += 1) {
    if (hand[j].suit !== hand[0].suit) {
      isFlush = false;
      break;
    }
  }
  if (isStraight && isFlush) {
    return 8; // straight flush
  }
  if (isFlush) {
    return 5; // flush
  }
  if (isStraight) {
    return 4; // straight
  }
  return 0; // high card
};

export const getHistogram = (hand: DBCard[]): number[] => {
  // Histogram for the cards
  const hist = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  // put hand into the histogram
  hand.forEach((card) => {
    if (card) {
      hist[card.weight - 2] += 1; // 2-14 - 2 = 0-12
    }
  });
  return hist;
};

/**
 * Compare hands to see who wins
 * @param {array} hand - array of card objects
 * Hands is assigned a weight based on hand, then card values
 * Compare values to see who wins
 * @return {number} value is a base 14 string, to be converted into base 10 for comparison
 */
export const evaluate = (hand: DBCard[]): string => {
  const hist = getHistogram(hand);
  const rank = rankHand(hand, hist);

  const cards = ["0", "0", "0", "0", "0"];
  let total = 0; // track number of cards counted
  let numCards = 4; // number of same cards in a set
  let i = 0; // iterator
  let last = -1; // track location of last in numCards set

  // get card values and display them in order of importance
  while (total < 5) {
    const num = hist.indexOf(numCards, last + 1);
    if (num === -1) {
      numCards -= 1;
      last = -1;
    } else {
      cards[i] = num.toString(14);
      i += 1;
      total += numCards;
      last = num;
    }
  }
  return `${rank}${cards.reduce((a, c) => `${a}${c}`)}`;
};

/** function to remove n number of cards */
export const getCardsToDiscard = (
  n: number,
  hist: number[],
  hand: DBCard[],
): number[] => {
  const nextCardsToDiscard: number[] = [];
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
  return nextCardsToDiscard;
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
export const computer = (
  player: DBPlayer,
  discard: (cardsToDiscardInDB: number[], player: DBPlayer) => void,
) => {
  if (player.hands.length < 1) {
    return player;
  }
  const hand = player.hands[0].cards;
  const hist = getHistogram(hand);
  const rank = rankHand(hand, hist);

  switch (rank) {
    case 0: /* draw 4-5 on high card */ {
      const nextCardsToDiscard =
        hist.lastIndexOf(1) >= 11
          ? getCardsToDiscard(4, hist, hand) // if ace || king draw 4
          : [0, 1, 2, 3, 4]; // otherwise, draw all 5
      discard(nextCardsToDiscard, player);
      break;
    }
    case 1: /* draw 3 on 2 of a kind */ {
      const nextCardsToDiscard = getCardsToDiscard(3, hist, hand);
      discard(nextCardsToDiscard, player);
      break;
    }
    case 2: /* draw 1 on 3 of a kind */
    case 3: /* draw 1 on 2 Pair */ {
      const nextCardsToDiscard = getCardsToDiscard(1, hist, hand);
      discard(nextCardsToDiscard, player);
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
};

const findAndPayWinner = (players: DBPlayer[]): void => {
  let winner = { val: 0, id: 0 };

  players.forEach((player) => {
    if (player.hands[0]?.cards.length < 1) {
      return;
    }

    const playerScore = parseInt(evaluate(player.hands[0].cards), 14);
    if (playerScore > winner.val) {
      winner = { val: playerScore, id: player.id };
    }
  });

  players.forEach((player, i) => {
    if (player.id === winner.id) {
      const newPlayer = { ...player, status: "win", money: player.money + 20 };
      players[i] = newPlayer;
    } else {
      const newPlayer = { ...player, status: "lose", money: player.money - 5 };
      players[i] = newPlayer;
    }
  });
};

const usePoker = () => {
  const [
    {
      poker: { cardsToDiscard, gameFunctions, gameOver, hideHands },
      turn,
      players,
    },
    setState,
  ] = useAtom(pokerState);
  const shuffle = useSetAtom(shuffleAtom);
  const deal = useSetAtom(dealPokerAtom);

  // ----------     bot automation handlers     ---------- //
  /** iterate through array, removing each index number from hand
   * then add new cards to the hand */
  const discard = (cardsToDiscardInDB: number[], player: DBPlayer) => {
    const { hands, id } = player;
    const cards = [...hands[0].cards];

    cardsToDiscardInDB.sort().forEach((dIdx, i) => {
      cards.splice(dIdx - i, 1);
    });

    deal(cardsToDiscardInDB.length, id, cards);
  };

  const checkUpdate = () => {
    if (!hideHands && !gameOver && players[turn.player]?.isBot) {
      const newPlayers = [...players];

      // returns immutable new players
      newPlayers.forEach((player: DBPlayer, i: number) => {
        if (turn.player <= i) {
          computer(player, discard);
        }
      });

      // modifies money in newPlayers obj
      findAndPayWinner(newPlayers);

      // update state once
      setState({
        poker: {
          cardsToDiscard,
          gameFunctions: [PGF.NEW_GAME],
          gameOver: true,
          hideHands,
        },
        players: newPlayers,
        turn: { player: 0, hand: 0 },
      });
    }
  };

  // ----------     player handlers     ---------- //
  /** function to finish betting and start the game */
  const startGame = () => {
    // shuffle the deck
    shuffle();
    // deal the hands
    players.forEach((player: DBPlayer) => {
      // New Hand
      deal(5, player.id);
    });
    setState({
      poker: {
        cardsToDiscard,
        gameFunctions: [PGF.DISCARD_CARDS],
        gameOver,
        hideHands: false,
      },
    });
  };

  /** helper function wrapping discard, meant for UI */
  const handleDiscard = (
    tempPlayers: DBPlayer[],
    tempTurn: number,
    tempCardsToDiscard: number[],
  ) => {
    discard(tempCardsToDiscard, tempPlayers[tempTurn]);
    setState({
      poker: {
        cardsToDiscard: [],
        gameFunctions: [PGF.END_TURN],
        gameOver,
        hideHands,
      },
    });
  };

  /** function to route click actions */
  const handleGameFunctionClick = (type: PGF) => {
    const newPlayers: DBPlayer[] = [];

    switch (type) {
      case PGF.DISCARD_CARDS:
        handleDiscard(players, turn.player, cardsToDiscard);
        break;
      case PGF.END_TURN:
        setState({
          poker: {
            cardsToDiscard: [],
            gameFunctions: [PGF.DISCARD_CARDS],
            gameOver,
            hideHands,
          },
          turn: { player: turn.player + 1, hand: 0 },
        });
        break;
      case PGF.NEW_GAME:
        players.forEach((player) =>
          newPlayers.push({
            ...player,
            status: "",
            hands: [],
            bet: 5,
          }),
        );
        setState({
          poker: newPokerGameState(),
          turn: { player: 0, hand: 0 },
          players: newPlayers,
        });
        break;
      case PGF.START_GAME:
        startGame();
        break;
      default:
        // eslint-disable-next-line no-console
        console.error("Unknown Game Function: ", type);
    }
  };

  /** function to be called on card clicks */
  const cardClickHandler = (
    _playerNo: number,
    _handNo: number,
    cardNo: number,
  ): void => {
    const newCardsToDiscard = [...cardsToDiscard];
    // find card
    const i = newCardsToDiscard.indexOf(cardNo);
    // toggle in array
    if (i === -1) {
      newCardsToDiscard.push(cardNo);
    } else {
      newCardsToDiscard.splice(i, 1);
    }
    // update state
    setState({
      poker: {
        cardsToDiscard: newCardsToDiscard,
        gameFunctions,
        gameOver,
        hideHands,
      },
    });
  };

  return {
    checkUpdate,
    cardClickHandler,
    cardsToDiscard,
    gameFunctions,
    handleGameFunctionClick,
    gameOver,
    hideHands,
    players,
    turn,
  };
};

export default usePoker;
