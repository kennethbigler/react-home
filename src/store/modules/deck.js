import assign from 'lodash/assign';
import map from 'lodash/map';
import initialState, { getNewDeck } from '../initialState';

// --------------------     Actions     -------------------- //
// TODO: this is only in progress
const SHUFFLE = 'games/deck/SHUFFLE';
const DEAL = 'games/deck/DEAL';

// --------------------     Action Creators     -------------------- //
/** randomize order of the cards O(N + M) */
export const shuffle = () => ({ type: SHUFFLE });
/** return an array of a specified length O(2N) */
export const deal = (num) => ({ type: DEAL, num });

// --------------------     Reducers     -------------------- //
export default function reducer(deck = initialState.deck, action) {
  switch (action.type) {
    case SHUFFLE: {
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
      return shuffledDeck;
    }
    case DEAL: {
      // verify we have enough cards
      if (action.num > deck.length) {
        /* eslint-disable no-console */
        console.error('Not Enough Cards Left');
        /* eslint-enable no-console */
        return null;
      }
      // create array to return
      const newDeck = map(deck, (card) => assign({}, card));
      const cards = [];
      // get the cards
      for (let i = 0; i < action.num; i += 1) {
        cards.push(newDeck.pop());
      }
      // return the card(s)
      // return cards;
      return newDeck;
    }
    default:
      return deck;
  }
}

// --------------------     Thunks     -------------------- //
