/* --------------------------------------------------
 * Deck
 * -------------------------------------------------- */

let deck = [];
const newDeck = [
  { name: '2', weight: 2, suit: '♣' },
  { name: '3', weight: 3, suit: '♣' },
  { name: '4', weight: 4, suit: '♣' },
  { name: '5', weight: 5, suit: '♣' },
  { name: '6', weight: 6, suit: '♣' },
  { name: '7', weight: 7, suit: '♣' },
  { name: '8', weight: 8, suit: '♣' },
  { name: '9', weight: 9, suit: '♣' },
  { name: '10', weight: 10, suit: '♣' },
  { name: 'J', weight: 11, suit: '♣' },
  { name: 'Q', weight: 12, suit: '♣' },
  { name: 'K', weight: 13, suit: '♣' },
  { name: 'A', weight: 14, suit: '♣' },
  { name: '2', weight: 2, suit: '♦' },
  { name: '3', weight: 3, suit: '♦' },
  { name: '4', weight: 4, suit: '♦' },
  { name: '5', weight: 5, suit: '♦' },
  { name: '6', weight: 6, suit: '♦' },
  { name: '7', weight: 7, suit: '♦' },
  { name: '8', weight: 8, suit: '♦' },
  { name: '9', weight: 9, suit: '♦' },
  { name: '10', weight: 10, suit: '♦' },
  { name: 'J', weight: 11, suit: '♦' },
  { name: 'Q', weight: 12, suit: '♦' },
  { name: 'K', weight: 13, suit: '♦' },
  { name: 'A', weight: 14, suit: '♦' },
  { name: '2', weight: 2, suit: '♥' },
  { name: '3', weight: 3, suit: '♥' },
  { name: '4', weight: 4, suit: '♥' },
  { name: '5', weight: 5, suit: '♥' },
  { name: '6', weight: 6, suit: '♥' },
  { name: '7', weight: 7, suit: '♥' },
  { name: '8', weight: 8, suit: '♥' },
  { name: '9', weight: 9, suit: '♥' },
  { name: '10', weight: 10, suit: '♥' },
  { name: 'J', weight: 11, suit: '♥' },
  { name: 'Q', weight: 12, suit: '♥' },
  { name: 'K', weight: 13, suit: '♥' },
  { name: 'A', weight: 14, suit: '♥' },
  { name: '2', weight: 2, suit: '♠' },
  { name: '3', weight: 3, suit: '♠' },
  { name: '4', weight: 4, suit: '♠' },
  { name: '5', weight: 5, suit: '♠' },
  { name: '6', weight: 6, suit: '♠' },
  { name: '7', weight: 7, suit: '♠' },
  { name: '8', weight: 8, suit: '♠' },
  { name: '9', weight: 9, suit: '♠' },
  { name: '10', weight: 10, suit: '♠' },
  { name: 'J', weight: 11, suit: '♠' },
  { name: 'Q', weight: 12, suit: '♠' },
  { name: 'K', weight: 13, suit: '♠' },
  { name: 'A', weight: 14, suit: '♠' }
];

const getNewDeck = () => {
  let ret = [];
  newDeck.forEach(card => {
    ret.push(Object.assign({}, card));
  });
  return ret;
};

export const Deck = {
  // randomize order of the cards
  shuffle: () => {
    // reset the old deck
    deck = getNewDeck();
    // number of shuffles
    const n = 100;
    // shuffle the cards
    for (let i = 0; i < n; i += 1) {
      const j = Math.floor(Math.random() * 52);
      const k = Math.floor(Math.random() * 52);
      // swap
      const temp = deck[j];
      deck[j] = deck[k];
      deck[k] = temp;
    }
  },

  // return an array of a specified length
  deal: (num = 0) => {
    // verify we have enough cards
    if (num > deck.length) {
      console.error('Not Enough Cards Left');
      return;
    }
    // create array to return
    let cards = [];
    // get the cards
    for (let i = 0; i < num; i += 1) {
      cards.push(deck.pop());
    }
    // return the card(s)
    return cards;
  },

  // sort functions by weight
  rankSort: (a, b) => {
    return a.weight - b.weight;
  },

  // sort cards by suit
  suitSort: (a, b) => {
    let ta, tb;
    switch (a.suit) {
      case '♣':
        ta = 20;
        break;
      case '♦':
        ta = 40;
        break;
      case '♥':
        ta = 60;
        break;
      case '♠':
        ta = 80;
        break;
      default:
        ta = 0;
        console.error('Error! Suit is ' + a.suit);
    }
    switch (b.suit) {
      case '♣':
        tb = 20;
        break;
      case '♦':
        tb = 40;
        break;
      case '♥':
        tb = 60;
        break;
      case '♠':
        tb = 80;
        break;
      default:
        tb = 0;
        console.error('Error! Suit is ' + b.suit);
    }
    return ta + a.weight - (tb + b.weight);
  }
};

// when switching to support multiple games, consider looking into https://facebook.github.io/react/docs/composition-vs-inheritance.html
// you could pass <Board><BlackJack /></Board>
