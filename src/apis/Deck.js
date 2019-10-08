import localForage from 'localforage';
import assign from 'lodash/assign';
import map from 'lodash/map';

const NEW_DECK = [
  { name: '2', weight: 2, suit: '♣' }, { name: '3', weight: 3, suit: '♣' },
  { name: '4', weight: 4, suit: '♣' }, { name: '5', weight: 5, suit: '♣' },
  { name: '6', weight: 6, suit: '♣' }, { name: '7', weight: 7, suit: '♣' },
  { name: '8', weight: 8, suit: '♣' }, { name: '9', weight: 9, suit: '♣' },
  { name: '10', weight: 10, suit: '♣' }, { name: 'J', weight: 11, suit: '♣' },
  { name: 'Q', weight: 12, suit: '♣' }, { name: 'K', weight: 13, suit: '♣' },
  { name: 'A', weight: 14, suit: '♣' }, { name: '2', weight: 2, suit: '♦' },
  { name: '3', weight: 3, suit: '♦' }, { name: '4', weight: 4, suit: '♦' },
  { name: '5', weight: 5, suit: '♦' }, { name: '6', weight: 6, suit: '♦' },
  { name: '7', weight: 7, suit: '♦' }, { name: '8', weight: 8, suit: '♦' },
  { name: '9', weight: 9, suit: '♦' }, { name: '10', weight: 10, suit: '♦' },
  { name: 'J', weight: 11, suit: '♦' }, { name: 'Q', weight: 12, suit: '♦' },
  { name: 'K', weight: 13, suit: '♦' }, { name: 'A', weight: 14, suit: '♦' },
  { name: '2', weight: 2, suit: '♥' }, { name: '3', weight: 3, suit: '♥' },
  { name: '4', weight: 4, suit: '♥' }, { name: '5', weight: 5, suit: '♥' },
  { name: '6', weight: 6, suit: '♥' }, { name: '7', weight: 7, suit: '♥' },
  { name: '8', weight: 8, suit: '♥' }, { name: '9', weight: 9, suit: '♥' },
  { name: '10', weight: 10, suit: '♥' }, { name: 'J', weight: 11, suit: '♥' },
  { name: 'Q', weight: 12, suit: '♥' }, { name: 'K', weight: 13, suit: '♥' },
  { name: 'A', weight: 14, suit: '♥' }, { name: '2', weight: 2, suit: '♠' },
  { name: '3', weight: 3, suit: '♠' }, { name: '4', weight: 4, suit: '♠' },
  { name: '5', weight: 5, suit: '♠' }, { name: '6', weight: 6, suit: '♠' },
  { name: '7', weight: 7, suit: '♠' }, { name: '8', weight: 8, suit: '♠' },
  { name: '9', weight: 9, suit: '♠' }, { name: '10', weight: 10, suit: '♠' },
  { name: 'J', weight: 11, suit: '♠' }, { name: 'Q', weight: 12, suit: '♠' },
  { name: 'K', weight: 13, suit: '♠' }, { name: 'A', weight: 14, suit: '♠' },
];

/** immutably get a copy of new deck O(N) */
function getNewDeck() {
  return map(NEW_DECK, (card) => assign({}, card));
}

/** get immutable copy of deck O(N) */
function getDeck() {
  return localForage
    .getItem('deck')
    .then((data) => (data || getNewDeck()))
    .catch(() => getNewDeck());
}

/** immutably update deck O(N) */
function setDeck(deck) {
  return localForage
    .setItem('deck', deck)
    .catch((e) => console.log(e));
}

/** randomize order of the cards O(N + M) */
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
  return setDeck(shuffledDeck);
}

/** return an array of a specified length O(2N) */
function deal(num = 0) {
  const cards = [];
  return getDeck()
    .then((deck) => {
      // verify we have enough cards
      if (num > deck.length) {
        console.error('Not Enough Cards Left');
        return deck;
      }
      // get the cards
      for (let i = 0; i < num; i += 1) {
        cards.push(deck.pop());
      }
      return deck;
    })
    .then((deck) => setDeck(deck))
    .then(() => cards);
}

/** sort by card weight */
const rankSort = (a, b) => a.weight - b.weight;

export default { shuffle, deal, rankSort };
