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
const UPDATE_NAME = 'casino/player/UPDATE_NAME';
const FINISH_GAME = 'casino/player/FINISH_GAME';
const SPLIT_HAND = 'casino/player/SPLIT_HAND';
const DRAW_CARD = 'casino/player/DRAW_CARD';
const NEW_HAND = 'casino/player/NEW_HAND';

// -------------------- Action Creators     -------------------- //

/**
 * function to add a player to the state
 * @input: players - to get unique id
 * @input: name - name of player is only var
 * @return new player to add to array
 */
export function addPlayer(players, name) {
  const player = {
    id: players.length,
    name: name,
    money: 100,
    hands: []
  };
  return { type: ADD, player };
}

/**
 * function to remove player from player array
 * @return id to remove player
 */
export function removePlayer(id = 0) {
  return { type: REMOVE, id };
}

/**
 *
 */
export function updatePlayerName(id = 0, name = '') {
  return { type: UPDATE_NAME, id, name };
}

/**
 *
 */
export function payout(id, status, money, bet = 0) {
  switch (status) {
    case 'win':
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
 * @input: hands - pass in player's hands to be mutated with new card
 * @input: id - tells us which player to update
 * @input: hNum - optional, if multiple hands
 * @input: weigh - optional, get weight of hand for game
 * @return: update state of player
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
  return { type: SPLIT_HAND, player: { id: id, hands: newHands } };
}

/**
 * function to have a player draw a card
 * @input: hands - pass in player's hands to be mutated with new card
 * @input: id - tells us which player to update
 * @input: hNum - optional, if multiple hands
 * @input: weigh - optional, get weight of hand for game
 * @input: num - optional, number of cards, default 1
 * @return: update state of player
 */
export function drawCard(hands, id, hNum = 0, weigh, num = 1) {
  const cards = [...hands[hNum].cards, ...Deck.deal(num)];
  const { weight } = weigh ? weigh(cards) : { weight: 0 };
  const newHands = updateArrayInArray(hands, { cards, weight }, hNum);
  return { type: DRAW_CARD, player: { id: id, hands: newHands } };
}

/**
 * function to have a player draw a card
 * @input: id - optional, what player should get a new hand, default 0
 * @input: weigh - optional, get weight of hand for game
 * @input: num - optional, number of cards, default 1
 * @return: update state of player
 */
export function newHand(id = 0, weigh, num = 1) {
  const cards = Deck.deal(num).sort(Deck.rankSort);
  const { weight } = weigh(cards);
  return {
    type: NEW_HAND,
    player: { id: id, status: '', hands: [{ cards, weight }] }
  };
}

// --------------------     Reducer     -------------------- //

export default function reducer(state = initialState.players, action) {
  switch (action.type) {
    case SPLIT_HAND:
    case NEW_HAND:
    case DRAW_CARD:
    case FINISH_GAME:
      return updateObjectInArray(state, action.player, 'id');
    case ADD:
      return insertItem(state, action.player);
    case REMOVE:
      return removeItem(state, action.id);
    default:
      return state;
  }
}
