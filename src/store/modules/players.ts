import { Action } from 'redux';
import asyncForEach from '../../helpers/asyncForEach';
import Deck from '../../apis/Deck';
import {
  removeItem, updateArrayInArray, updateObjectInArray, insertItem,
} from '../immutableHelpers';
import { DBCard, DBHand, DBPlayer } from '../types';
import initialState, { newPlayer } from '../initialState';

// --------------------     Actions     -------------------- //
const REMOVE = '@casino/player/REMOVE';
enum pa {
  'ADD' = '@casino/player/ADD',
  'RESET' = '@casino/player/RESET',
  'UPDATE_NAME' = '@casino/player/UPDATE_NAME',
  'UPDATE_BOT' = '@casino/player/UPDATE_BOT',
  'UPDATE_BET' = '@casino/player/UPDATE_BET',
  'PAY_PLAYER' = '@casino/player/PAY_PLAYER',
  'SPLIT_HAND' = '@casino/player/SPLIT_HAND',
  'DRAW_CARD' = '@casino/player/DRAW_CARD',
  'SWAP_CARD' = '@casino/player/SWAP_CARD',
  'NEW_HAND' = '@casino/player/NEW_HAND',
}
const {
  ADD, RESET, UPDATE_NAME,
  UPDATE_BOT, UPDATE_BET, PAY_PLAYER, SPLIT_HAND,
  DRAW_CARD, SWAP_CARD, NEW_HAND,
} = pa;

interface PlayerAction extends Action<pa> { player: Partial<DBPlayer> }

// -------------------- Action Creators     -------------------- //
/** function to add a player to the state */
export function addPlayer(players: DBPlayer[], name: string): PlayerAction {
  const player = newPlayer(players.length, name);
  return { type: ADD, player };
}

interface RemovePlayerAction extends Action<typeof REMOVE> { id: number }
/** function to remove player from player array */
export function removePlayer(id: number): RemovePlayerAction {
  return { type: REMOVE, id };
}

/** function to update a player's name */
export function updateName(id: number, name: string): PlayerAction {
  return { type: UPDATE_NAME, player: { id, name }};
}

/** function to update a player's bot status */
export function updateBot(id: number, isBot = true): PlayerAction {
  return { type: UPDATE_BOT, player: { id, isBot }};
}

/** function to update a player's bet */
export function updateBet(id = 0, bet = 5): PlayerAction {
  return { type: UPDATE_BET, player: { id, bet }};
}

/** function to pay the winners and take money from the losers */
export function payout(id: number, status: string, money: number): PlayerAction {
  return { type: PAY_PLAYER, player: { id, status, money }};
}

function createSplitHandAction(id: number, newHands: DBHand[]): PlayerAction {
  return { type: SPLIT_HAND, player: { id, hands: newHands }};
}

function createDrawCardAction(id: number, newHands: DBHand[]): PlayerAction {
  return { type: DRAW_CARD, player: { id, hands: newHands }};
}

function createSwapCardsAction(id: number, updatedHands: DBHand[]): PlayerAction {
  return { type: SWAP_CARD, player: { id, hands: updatedHands }};
}

function createNewHandAction(id: number, cards: DBCard[], soft: boolean, weight: number): PlayerAction {
  return { type: NEW_HAND, player: { id, hands: [{ cards, weight, soft }]}};
}

/** function to reset player status
 * @param {number} id - optional, what player should get a new hand, default 0
 * @return {Object}
 */
export function resetStatus(id = 0): PlayerAction {
  return {
    type: RESET,
    player: {
      id, status: '', hands: [], bet: 5,
    },
  };
}

// --------------------     Reducer     -------------------- //
type PlayerActions = PlayerAction | RemovePlayerAction;
export default function reducer(state: DBPlayer[] = initialState.players, action: PlayerActions): DBPlayer[] {
  switch (action.type) {
    case RESET:
    case UPDATE_NAME:
    case UPDATE_BOT:
    case UPDATE_BET:
    case SPLIT_HAND:
    case DRAW_CARD:
    case SWAP_CARD:
    case NEW_HAND:
      return updateObjectInArray(state, action.player, 'id') as DBPlayer[];
    case PAY_PLAYER: {
      const { id, status, money } = action.player;
      const player = state.find((obj) => obj.id === id);

      if (player !== undefined) {
        const playerMoney = player.money || 0;
        const addedMoney = money || 0;
        const updatedPlayer = { ...player, money: (playerMoney + addedMoney), status };
        return updateObjectInArray(state, updatedPlayer, 'id') as DBPlayer[];
      }
      return state;
    }
    case ADD:
      return insertItem(state, action.player) as DBPlayer[];
    case REMOVE:
      return removeItem(state, action.id);
    default:
      return state;
  }
}

// --------------------     Thunks     -------------------- //
export type WeighFunc = (cards: DBCard[]) => { weight: number; soft: boolean };
const defaultWeigh: WeighFunc = () => ({ weight: 0, soft: false });

/** function to have a player draw a card
 * @param {number} id - optional, what player should get a new hand, default 0
 * @param {number} num - optional, number of cards, default 1
 * @param {function} weigh - optional, get weight of hand for game
 * @return {Object}
 */
export function newHand(id = 0, num = 1, weigh = defaultWeigh) {
  return (dispatch: Function): Promise<void> => Deck.deal(num)
    .then((cards) => {
      cards.sort(Deck.rankSort);
      const { weight, soft } = weigh(cards);
      return { weight, soft, cards };
    })
    .then(({ weight, soft, cards }) => dispatch(createNewHandAction(id, cards, soft, weight)));
}

/** function to have a player draw a card
 * @param {Object[]} hands - pass in player's hands to be mutated with new card
 * @param {number} id - tells us which player to update
 * @param {number} hNum - optional, if multiple hands
 * @param {number} num - optional, number of cards, default 1
 * @param {function} weigh - optional, get weight of hand for game
 * @return {Object}
 */
export function drawCard(hands: DBHand[], id: number, hNum = 0, num = 1, weigh = defaultWeigh) {
  return (dispatch: Function): Promise<void> => Deck.deal(num)
    .then((drawnCards) => {
      const cards = [...hands[hNum].cards, ...drawnCards];
      const { weight, soft } = weigh(cards);
      const newHands = updateArrayInArray(hands, { cards, weight, soft }, hNum);
      return newHands;
    })
    .then((newHands) => dispatch(createDrawCardAction(id, newHands)));
}

/** function to split players cards into 2 hands
 * @param {Object[]} hands - pass in player's hands to be mutated with new card
 * @param {number} id - tells us which player to update
 * @param {number} hNum - optional, if multiple hands
 * @param {function} weigh - optional, get weight of hand for game
 * @return {Object}
 */
export function splitHand(hands: DBHand[], id: number, hNum: number, weigh = defaultWeigh) {
  return (dispatch: Function): Promise<void> => {
    const hand = hands[hNum];
    // split the hands into 2
    const hand1: DBHand = { cards: [hand.cards[0]]};
    const hand2: DBHand = { cards: [hand.cards[1]]};

    return Deck.deal(1)
      .then((cards) => {
        hand1.cards.push(cards[0]);
      })
      .then(() => {
        Deck.deal(1)
          .then((cards) => {
            hand2.cards.push(cards[0]);

            // update the weights
            Object.assign(hand1, weigh(hand1.cards));
            Object.assign(hand2, weigh(hand2.cards));
            // update global hands
            const newHands: DBHand[] = updateArrayInArray(hands, hand2, hNum);
            newHands.splice(hNum, 0, hand1);
            return newHands;
          })
          .then((newHands) => dispatch(createSplitHandAction(id, newHands)));
      });
  };
}

/** iterate through array, removing each index number from hand
 * then add new cards to the hand
 * @param {Object[]} hands - pass in player's hands to be mutated with new card
 * @param {number} id - tells us which player to update
 * @param {array} cardsToDiscard - array of index numbers
 * @return {Object}
 */
export function swapCards(hands: DBHand[], id: number, cardsToDiscard: number[]) {
  return (dispatch: Function): Promise<void> => {
    const cards = [...hands[0].cards];
    return asyncForEach(cardsToDiscard, async (idx: number) => {
      [cards[idx]] = await Deck.deal(1);
    }).then(() => {
      cards.sort(Deck.rankSort);
      const updatedHands: DBHand[] = updateArrayInArray(hands, { cards }, 0);
      dispatch(createSwapCardsAction(id, updatedHands));
    });
  };
}
