// functions
import assign from 'lodash/assign';
import forEach from 'lodash/forEach';
import find from 'lodash/find';
import {Deck} from '../../apis/Deck';
import {
  removeItem,
  updateArrayInArray,
  updateObjectInArray,
  insertItem,
} from '../immutableHelpers';

// initialState
import initialState, {newPlayer} from '../initialState';

// --------------------     Actions     -------------------- //

const ADD = 'casino/player/ADD';
const REMOVE = 'casino/player/REMOVE';
const RESET = 'casino/player/RESET';
const UPDATE_NAME = 'casino/player/UPDATE_NAME';
const UPDATE_BOT = 'casino/player/UPDATE_BOT';
const UPDATE_BET = 'casino/player/UPDATE_BET';
const PAY_PLAYER = 'casino/player/PAY_PLAYER';
const SPLIT_HAND = 'casino/player/SPLIT_HAND';
const DRAW_CARD = 'casino/player/DRAW_CARD';
const SWAP_CARD = 'casino/player/SWAP_CARD';
const NEW_HAND = 'casino/player/NEW_HAND';

// -------------------- Action Creators     -------------------- //

/**
 * function to add a player to the state
 * @param {Object[]} players - to get unique id
 * @param {string} name - name of player is only var
 * @return {Object}
 */
export function addPlayer(players, name) {
  const player = newPlayer(players.length, name);
  return {type: ADD, player};
}

/**
 * function to remove player from player array
 * @param {number} id - id of player to remove
 * @return {Object}
 */
export function removePlayer(id) {
  return {type: REMOVE, id};
}

/**
 * function to update a player's name
 * @param {number} id - id of player
 * @param {string} name - new name of player
 * @return {Object}
 */
export function updateName(id, name) {
  return {type: UPDATE_NAME, player: {id, name}};
}

/**
 * function to update a player's bot status
 * @param {number} id - id of player
 * @param {boolean} isBot - is the player a bot
 * @return {Object}
 */
export function updateBot(id, isBot = true) {
  return {type: UPDATE_BOT, player: {id, isBot}};
}

/**
 * function to update a player's bet
 * @param {number} id - id of player
 * @param {number} bet - current bet
 * @return {Object}
 */
export function updateBet(id = 0, bet = 5) {
  return {type: UPDATE_BET, player: {id, bet}};
}

/**
 * function to pay the winners and take money from the losers
 * @param {number} id - id of player
 * @param {string} status - win or lose
 * @param {number} money - net money gained or lost
 * @return {Object}
 */
export function payout(id, status, money) {
  return {type: PAY_PLAYER, player: {id, status, money}};
}

/**
 * function to split players cards into 2 hands
 * @param {Object[]} hands - pass in player's hands to be mutated with new card
 * @param {number} id - tells us which player to update
 * @param {number} hNum - optional, if multiple hands
 * @param {function} weigh - optional, get weight of hand for game
 * @return {Object}
 */
export function splitHand(hands, id, hNum, weigh = null) {
  const hand = hands[hNum];
  // split the hands into 2
  let hand1 = {cards: [hand.cards[0]]};
  let hand2 = {cards: [hand.cards[1]]};
  // add 1 card each
  hand1.cards.push(Deck.deal(1)[0]);
  hand2.cards.push(Deck.deal(1)[0]);
  // update the weights
  assign(hand1, weigh(hand1.cards));
  assign(hand2, weigh(hand2.cards));
  // update global hands
  let newHands = updateArrayInArray(hands, hand2, hNum);
  newHands.splice(hNum, 0, hand1);
  return {type: SPLIT_HAND, player: {id, hands: newHands}};
}

/**
 * function to have a player draw a card
 * @param {Object[]} hands - pass in player's hands to be mutated with new card
 * @param {number} id - tells us which player to update
 * @param {number} hNum - optional, if multiple hands
 * @param {number} num - optional, number of cards, default 1
 * @param {function} weigh - optional, get weight of hand for game
 * @return {Object}
 */
export function drawCard(hands, id, hNum = 0, num = 1, weigh = null) {
  const cards = [...hands[hNum].cards, ...Deck.deal(num)];
  const {weight, soft} = weigh ? weigh(cards) : {weight: 0};
  const newHands = updateArrayInArray(hands, {cards, weight, soft}, hNum);
  return {type: DRAW_CARD, player: {id, hands: newHands}};
}

/**
 * iterate through array, removing each index number from hand
 * then add new cards to the hand
 * @param {Object[]} hands - pass in player's hands to be mutated with new card
 * @param {number} id - tells us which player to update
 * @param {array} cardsToDiscard - array of index numbers
 * @return {Object}
 */
export function swapCards(hands, id, cardsToDiscard) {
  const cards = [...hands[0].cards];
  forEach(cardsToDiscard, (i) => (cards[i] = Deck.deal(1)[0]));
  cards.sort(Deck.rankSort);
  const newHand = updateArrayInArray(hands, {cards}, 0);
  return {type: SWAP_CARD, player: {id, hands: newHand}};
}

/**
 * function to have a player draw a card
 * @param {number} id - optional, what player should get a new hand, default 0
 * @param {number} num - optional, number of cards, default 1
 * @param {function} weigh - optional, get weight of hand for game
 * @return {Object}
 */
export function newHand(id = 0, num = 1, weigh = null) {
  const cards = Deck.deal(num).sort(Deck.rankSort);
  const {weight, soft} = weigh ? weigh(cards) : {weight: 0};
  return {type: NEW_HAND, player: {id, hands: [{cards, weight, soft}]}};
}

/**
 * function to reset player status
 * @param {number} id - optional, what player should get a new hand, default 0
 * @return {Object}
 */
export function resetStatus(id = 0) {
  return {type: RESET, player: {id, status: '', hands: [], bet: 5}};
}

// --------------------     Reducer     -------------------- //

export default function reducer(state = initialState.players, action) {
  switch (action.type) {
    case RESET:
    case UPDATE_NAME:
    case UPDATE_BOT:
    case UPDATE_BET:
    case SPLIT_HAND:
    case DRAW_CARD:
    case SWAP_CARD:
    case NEW_HAND:
      return updateObjectInArray(state, action.player, 'id');
    case PAY_PLAYER: {
      const {id, status, money} = action.player;
      const player = find(state, ['id', id]);

      const updatedPlayer = assign({}, player, {
        money: (player.money += money),
        status,
      });

      return updateObjectInArray(state, updatedPlayer, 'id');
    }
    case ADD:
      return insertItem(state, action.player);
    case REMOVE:
      return removeItem(state, action.id);
    default:
      return state;
  }
}
