import { DBCard } from '../../../store/types';

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
  const isStraight = hist.lastIndexOf(1) - hist.indexOf(1) === 4 // (end - start = 4)
    || (hist[12] && hist[0] && hist[1] && hist[2] && hist[3]); // (A,2,3,4,5)
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
    hist[(card.weight || 2) - 2] += 1; // 2-14 - 2 = 0-12
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

  const cards = ['0', '0', '0', '0', '0'];
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
export const getCardsToDiscard = (n: number, hist: number[], hand: DBCard[]): number[] => {
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
  return nextCardsToDiscard;
};
