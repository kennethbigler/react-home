import React, { Component } from 'react';
import { Deck } from '../../../apis/Deck';
// Parents: Main

const getHistogram = hand => {
  // Histogram for the cards
  let hist = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  // put hand into the histrogram
  hand.forEach(card => {
    hist[card.rank - 2] += 1; //2-14 - 2 = 0-12
  });
  return hist;
};

/**
 * Rankings:
 *   Straight Flush  8
 *   4 of a Kind     7
 *   Full House      6
 *   Flush           5
 *   Straight        4
 *   3 of a Kind     3
 *   2 Pair          2
 *   1 Pair          1
 *   High Card       0
 * @return {number} value is a base 13 string, to be converted into base 10 for comparison
 */
const rankHand = (hand, hist) => {
  // iterate through and look for hands with multiple cards
  if (hist.indexOf(4) !== -1) {
    return 7; // 4 of a kind
  }
  // Check for hands with sets of 3 or 2 cards
  const has3 = hist.indexOf(3) !== -1;
  const i = hist.indexOf(2);
  const has2 = i !== -1;
  if (has3 && has2) {
    return 6; // full house
  } else if (has3) {
    return 3; // 3 of a kind
  } else if (has2 && hist.indexOf(2, i + 1) !== -1) {
    return 2; // 2 pair
  } else if (has2) {
    return 1; // 1 pair
  } else {
    // all single cards, look for flush and straight
    const C1 = hist.indexOf(1);
    const C5 = hist.lastIndexOf(1);

    // check for straight (end - start = 4) or (A,2,3,4,5)
    const isStraight =
      C5 - C1 === 4 ||
      (hist[12] === 1 &&
        hist[0] === 1 &&
        hist[1] === 1 &&
        hist[2] === 1 &&
        hist[3] === 1);

    // check for flush
    let isFlush = true;
    for (let card of hand) {
      if (card.suit !== hand[0].suit) {
        isFlush = false;
        break;
      }
    }

    if (isStraight && isFlush) {
      return 8; // straight flush
    } else if (isFlush) {
      return 5; // flush
    } else if (isStraight) {
      return 4; // straight
    } else {
      return 0; // high card
    }
  }
};

/**
 * Compare hands to see who wins
 * @param {array} hand - array of card objects
 * Hands is assigned a weight based on hand, then card values
 * Compare values to see who wins
 * @return {number} value is a base 13 string, to be converted into base 10 for comparison
 */
const evaluate = hand => {
  const hist = getHistogram(hand);
  const rank = rankHand(hand, hist);

  let cards = [0, 0, 0, 0, 0];
  let total = 0;
  let weight = 4;
  let i = 0;
  let last = -1;

  // get card values and display them in order of importance
  while (total < 5) {
    const num = hist.indexOf(weight, last + 1);
    if (num === -1) {
      weight -= 1;
      last = -1;
    } else {
      cards[i] = num.toString(13);
      i += 1;
      total += weight;
      last = num;
    }
  }

  return `${rank}${cards[0]}${cards[1]}${cards[2]}${cards[3]}${cards[4]}`;
};

/* --------------------------------------------------
* Poker
* -------------------------------------------------- */
export class Poker extends Component {
  state = { hands: [] };

  /**
   * iterate through array, removing each index number from hand
   * then add new cards to the hand
   * @param {array} cards - array of index numbers
   * @param {number} p - player number
   */
  discard = (cards, p) => {
    const { hands } = this.state;
    cards.forEach(card => (hands[p][card] = Deck.deal(1)[0]));
    hands[p].sort(Deck.rankSort);
    this.setState({ hands });
  };

  /** computer play algorithm:
    PAIRS
    draw 0 on 4 of a kind
    draw 0 on full house
    draw 1 on 3 of a kind, keep higher of 2
    draw 1 on 2 pair
    draw 3 on 2 of a kind

    This is a nice to have, for now we only follow the first half
    STRAIGHT/FLUSH
    draw 0 on straight
    draw 0 on flush
    draw 0 on straight flush
    if 1 away from sf -> draw 1
    if 1 away from S -> draw 1 if 5+ players, else regular hand
    if 1 away from F -> draw 1 if 5+ players, else regular hand

    REGULAR HAND
    if K / A -> draw 4
    else draw 5
    */
  computer = (hand, turn) => {
    const hist = getHistogram(hand);
    const rank = rankHand(hand, hist);

    switch (rank) {
      case 0: {
        // draw 4-5 on high card
        const C5 = hist.lastIndexOf(1);
        if (C5 >= 11) {
          // if ace || king draw 4
          let temp = [];
          const C1 = hist.indexOf(1);
          const C2 = hist.indexOf(1, C1 + 1);
          const C3 = hist.indexOf(1, C2 + 1);
          const C4 = hist.indexOf(1, C3 + 1);
          for (let i = 0; i < hand.length; i += 1) {
            const x = hand[i].rank - 2;
            if (x === C1 || x === C2 || x === C3 || x === C4) {
              temp.push(i);
            }
          }
          this.discard(temp, turn);
          return evaluate(hand);
        } else {
          // otherwise, draw all 5
          this.discard([0, 1, 2, 3, 4], turn);
          return evaluate(hand);
        }
      }
      case 1: {
        // draw 3 on 2 of a kind
        let temp = [];
        const C1 = hist.indexOf(1);
        const C2 = hist.indexOf(1, C1 + 1);
        const C3 = hist.indexOf(1, C2 + 1);
        for (let i = 0; i < hand.length; i += 1) {
          const x = hand[i].rank - 2;
          if (C1 === x || C2 === x || C3 === x) {
            temp.push(i);
          }
        }
        this.discard(temp, turn);
        return evaluate(hand);
      }
      case 2: // draw 1 on 3 of a kind
      case 3: {
        // draw 1 on 2 Pair
        let temp = [];
        const C1 = hist.indexOf(1);
        for (let i = 0; i < hand.length; i += 1) {
          if (C1 === hand[i].rank - 2) {
            temp.push(i);
            break;
          }
        }
        this.discard(temp, turn);
        return evaluate(hand);
      }
      case 4: // draw 0 on straight
      case 5: // draw 0 on flush
      case 6: // draw 0 on full house
      case 7: // draw 0 on 4 of a kind
      case 8: {
        return evaluate(hand); // draw 0 on straight flush
      }
      default:
        return 0;
    }
  };

  add = (num, player) => {
    return player;
  };

  sub = (num, player) => {
    return player;
  };

  deal = num => {
    return Deck.deal(num);
  };

  shuffle = () => {
    Deck.shuffle();
    return;
  };

  rankSort = Deck.rankSort;

  // render standard board
  render() {
    return <h1>Placeholder for Future Poker Project</h1>;
  }
}
