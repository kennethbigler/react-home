import { DBCard } from "../../../apis/useDeck";
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
export const computer = async (
  player: DBPlayer,
  discard: (
    cardsToDiscardInDB: number[],
    player: DBPlayer,
  ) => Promise<DBPlayer>,
): Promise<DBPlayer> => {
  if (player.hands.length < 1) {
    return player;
  }
  try {
    const hand = player.hands[0].cards;
    const hist = getHistogram(hand);
    const rank = rankHand(hand, hist);

    switch (rank) {
      case 0: /* draw 4-5 on high card */ {
        const nextCardsToDiscard =
          hist.lastIndexOf(1) >= 11
            ? getCardsToDiscard(4, hist, hand) // if ace || king draw 4
            : [0, 1, 2, 3, 4]; // otherwise, draw all 5
        const newPlayer = await discard(nextCardsToDiscard, player);
        return newPlayer;
      }
      case 1: /* draw 3 on 2 of a kind */ {
        const nextCardsToDiscard = getCardsToDiscard(3, hist, hand);
        const newPlayer = await discard(nextCardsToDiscard, player);
        return newPlayer;
      }
      case 2: /* draw 1 on 3 of a kind */
      case 3: /* draw 1 on 2 Pair */ {
        const nextCardsToDiscard = getCardsToDiscard(1, hist, hand);
        const newPlayer = await discard(nextCardsToDiscard, player);
        return newPlayer;
      }
      case 4: // draw 0 on straight
      case 5: // draw 0 on flush
      case 6: // draw 0 on full house
      case 7: // draw 0 on 4 of a kind
      case 8: // draw 0 on straight flush
      default:
        break;
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
  return player;
};

export const findAndPayWinner = (players: DBPlayer[]): void => {
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
