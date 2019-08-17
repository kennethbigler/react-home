import assign from 'lodash/assign';
import map from 'lodash/map';

// used to reset the cards
const NEW_DECK = [
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
  { name: 'A', weight: 14, suit: '♠' },
];

// immutably get a copy an array O(N)
function getImmutableArray(arr) {
  return map(arr, (val) => assign({}, val));
}

// immutably get a copy of new deck O(N)
function getNewDeck() {
  return getImmutableArray(NEW_DECK);
}

// deck used
let deck = [];

// get immutable copy of deck O(N)
function getDeck() {
  return getImmutableArray(deck);
}

// immutably update deck O(N)
function setDeck(newDeck) {
  deck = getImmutableArray(newDeck);
}

// randomize order of the cards O(N + M)
function shuffle() {
  // get a new deck
  const shuffledDeck = getNewDeck();
  // number of shuffles
  const n = 100;
  // shuffle the cards
  for (let i = 0; i < n; i += 1) {
    const j = Math.floor(Math.random() * 52);
    const k = Math.floor(Math.random() * 52);
    // swap
    const temp = shuffledDeck[j];
    shuffledDeck[j] = shuffledDeck[k];
    shuffledDeck[k] = temp;
  }
  // update deck state
  setDeck(shuffledDeck);
}

// return an array of a specified length O(2N)
function deal(num = 0) {
  // verify we have enough cards
  if (num > deck.length) {
    /* eslint-disable no-console */
    console.error('Not Enough Cards Left');
    /* eslint-enable no-console */
    return null;
  }
  // create array to return
  const newDeck = getDeck();
  const cards = [];
  // get the cards
  for (let i = 0; i < num; i += 1) {
    cards.push(newDeck.pop());
  }
  // update deck state
  setDeck(newDeck);
  // return the card(s)
  return cards;
}

// sort functions by weight
const rankSort = (a, b) => a.weight - b.weight;

// sort cards by suit
const suitSort = (a, b) => {
  let ta;
  let tb;
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
  }
  return ta + a.weight - (tb + b.weight);
};

export default {
  shuffle,
  deal,
  rankSort,
  suitSort,
};
