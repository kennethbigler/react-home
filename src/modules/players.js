// Deck API and initialState
import { Deck } from '../apis/Deck';
import initialState from './initialState';

// Immutable helper functions
function insertItem(players, player) {
  let newArray = players.slice();
  newArray.push(player);
  return newArray;
}

function updateObjectInArray(array, ins, key) {
  return array.map(item => {
    return item[key] !== ins[key] ? item : { ...item, ...ins };
  });
}

function updateArrayInArray(array, ins, idx) {
  return array.map((player, i) => {
    return i !== idx ? player : ins;
  });
}

function removeItem(players, id) {
  return players.filter(player => player.id !== id);
}

// --------------------     Actions     -------------------- //

const ADD = 'casino/player/ADD';
const REMOVE = 'casino/player/REMOVE';
const RESET = 'casino/player/RESET';
const UPDATE_NAME = 'casino/player/UPDATE_NAME';
const UPDATE_BET = 'casino/player/UPDATE_BET';
const FINISH_GAME = 'casino/player/FINISH_GAME';
const SPLIT_HAND = 'casino/player/SPLIT_HAND';
const DRAW_CARD = 'casino/player/DRAW_CARD';
const NEW_HAND = 'casino/player/NEW_HAND';

// -------------------- Action Creators     -------------------- //

/**
 * function to add a player to the state
 * @param {Object[]} players - to get unique id
 * @param {string} name - name of player is only var
 */
export function addPlayer(players, name) {
  const player = {
    id: players.length,
    name: name,
    money: 100,
    bet: 5,
    status: '',
    hands: []
  };
  return { type: ADD, player };
}

/**
 * function to remove player from player array
 * @param {number} id - id of player to remove
 */
export function removePlayer(id = 0) {
  return { type: REMOVE, id };
}

/**
 * function to update a player's name
 * @param {number} id - id of player
 * @param {string} name - new name of player
 */
export function updateName(id = 0, name = '') {
  return { type: UPDATE_NAME, player: { id, name } };
}

/**
 * function to update a player's bet
 * @param {number} id - id of player
 * @param {number} bet - current bet
 */
export function updateBet(id = 0, bet = 5) {
  return { type: UPDATE_BET, player: { id, bet } };
}

/**
 * function to pay the winners and take money from the losers
 * @param {number} id - id of player
 * @param {string} status - win or lose
 * @param {number} money - player's current money
 * @param {number} bet - player's bet
 */
export function payout(id, status, money, bet = 0) {
  switch (status) {
    case 'win':
    case 'dealer':
      money += bet;
      break;
    case 'lose':
      money -= bet;
      break;
    default:
      break;
  }
  return { type: FINISH_GAME, player: { id, status, money } };
}

/**
 * function to split players cards into 2 hands
 * @param {Object[]} hands - pass in player's hands to be mutated with new card
 * @param {number} id - tells us which player to update
 * @param {number} hNum - optional, if multiple hands
 * @param {function} weigh - optional, get weight of hand for game
 */
export function splitHand(hands, id, hNum, weigh) {
  const hand = hands[hNum];
  // split the hands into 2
  let hand1 = { cards: [hand.cards[0]] };
  let hand2 = { cards: [hand.cards[1]] };
  // add 1 card each
  hand1.cards.push(Deck.deal(1)[0]);
  hand2.cards.push(Deck.deal(1)[0]);
  // update the weights
  const { weight: weight1 } = weigh(hand1.cards);
  const { weight: weight2 } = weigh(hand2.cards);
  hand1.weight = weight1;
  hand2.weight = weight2;
  // update global hands
  let newHands = updateArrayInArray(hands, hand2, hNum);
  newHands.splice(hNum, 0, hand1);
  return { type: SPLIT_HAND, player: { id, hands: newHands } };
}

/**
 * function to have a player draw a card
 * @param {Object[]} hands - pass in player's hands to be mutated with new card
 * @param {number} id - tells us which player to update
 * @param {number} hNum - optional, if multiple hands
 * @param {function} weigh - optional, get weight of hand for game
 * @param {number} num - optional, number of cards, default 1
 */
export function drawCard(hands, id, hNum = 0, weigh, num = 1) {
  const cards = [...hands[hNum].cards, ...Deck.deal(num)];
  const { weight } = weigh ? weigh(cards) : { weight: 0 };
  const newHands = updateArrayInArray(hands, { cards, weight }, hNum);
  return { type: DRAW_CARD, player: { id, hands: newHands } };
}

/**
 * function to have a player draw a card
 * @param {number} id - optional, what player should get a new hand, default 0
 * @param {function} weigh - optional, get weight of hand for game
 * @param {number} num - optional, number of cards, default 1
 */
export function newHand(id = 0, weigh, num = 1) {
  const cards = Deck.deal(num).sort(Deck.rankSort);
  const { weight } = weigh(cards);
  return { type: NEW_HAND, player: { id, hands: [{ cards, weight }] } };
}

/**
 * function to reset player status
 * @param {number} id - optional, what player should get a new hand, default 0
 */
export function resetStatus(id = 0) {
  const status = id === 0 ? 'dealer' : '';
  return { type: RESET, player: { id, status, hands: [], bet: 5 } };
}

// --------------------     Reducer     -------------------- //

export default function reducer(state = initialState.players, action) {
  switch (action.type) {
    case RESET:
    case UPDATE_NAME:
    case UPDATE_BET:
    case FINISH_GAME:
    case SPLIT_HAND:
    case DRAW_CARD:
    case NEW_HAND:
      return updateObjectInArray(state, action.player, 'id');
    case ADD:
      return insertItem(state, action.player);
    case REMOVE:
      return removeItem(state, action.id);
    default:
      return state;
  }
}
