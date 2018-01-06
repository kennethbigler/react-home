/* --------------------------------------------------
 * Deck
 * -------------------------------------------------- */

const machine = [
  { symbol: 'cherry', start: 1, stop: 2 },
  { symbol: '', start: 3, stop: 7 },
  { symbol: '—', start: 8, stop: 12 },
  { symbol: '', start: 13, stop: 17 },
  { symbol: '7', start: 18, stop: 25 },
  { symbol: '', start: 26, stop: 30 },
  { symbol: '—', start: 31, stop: 35 },
  { symbol: '', start: 36, stop: 41 },
  { symbol: 'cherry', start: 42, stop: 43 },
  { symbol: '', start: 44, stop: 49 },
  { symbol: '==', start: 50, stop: 56 },
  { symbol: '', start: 57, stop: 62 },
  { symbol: 'cherry', start: 63, stop: 63 },
  { symbol: '', start: 64, stop: 69 },
  { symbol: '=', start: 70, stop: 75 },
  { symbol: '', start: 76, stop: 81 },
  { symbol: '-', start: 82, stop: 87 },
  { symbol: '', start: 88, stop: 93 },
  { symbol: 'ΞΞ', start: 94, stop: 104 },
  { symbol: '', start: 105, stop: 115 },
  { symbol: 'jackpot', start: 116, stop: 117 },
  { symbol: '', start: 118, stop: 128 }
];

export const SlotMachine = {
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
