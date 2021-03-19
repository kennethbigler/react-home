import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { newPlayer } from '../../initialState';
import playerReducer, {
  pa,
  addPlayer, removePlayer, updateName, updateBot, updateBet,
  payout, createSplitHandAction, createDrawCardAction,
  createSwapCardsAction, createNewHandAction, resetStatus,
  newHand, drawCard, splitHand, swapCards,
} from '../players';
import Deck from '../../../apis/Deck';

const state = [
  newPlayer(0, 'Ken', false),
  newPlayer(1),
];

const king = { name: 'K', weight: 13, suit: '♣' };
const queen = { name: 'Q', weight: 12, suit: '♣' };
const jack = { name: 'J', weight: 11, suit: '♣' };

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('store | modules | players', () => {
  describe('reducer', () => {
    test('actions', () => {
      expect(playerReducer(state, addPlayer(state, 'Andrew'))).toHaveLength(3);
      expect(playerReducer(state, removePlayer(1))).toEqual([state[0]]);
      expect(playerReducer(state, updateName(1, 'Andrew'))).toEqual([state[0], { ...state[1], name: 'Andrew' }]);

      expect(playerReducer(state, updateBot(1, false))).toEqual([state[0], { ...state[1], isBot: false }]);
      expect(playerReducer(state, updateBot(1))).toEqual([state[0], { ...state[1], isBot: true }]);

      expect(playerReducer(state, updateBet(1, 69))).toEqual([state[0], { ...state[1], bet: 69 }]);
      expect(playerReducer(state, updateBet())).toEqual([{ ...state[0], bet: 5 }, state[1]]);

      expect(playerReducer(state, payout(1, 'status', -31))).toEqual([state[0], { ...state[1], status: 'status', money: 69 }]);
      expect(playerReducer(state, createSplitHandAction(1, [{ cards: [king]}])))
        .toEqual([state[0], { ...state[1], hands: [{ cards: [king]}]}]);
      expect(playerReducer(state, createDrawCardAction(1, [{ cards: [king]}])))
        .toEqual([state[0], { ...state[1], hands: [{ cards: [king]}]}]);
      expect(playerReducer(state, createSwapCardsAction(1, [{ cards: [king]}])))
        .toEqual([state[0], { ...state[1], hands: [{ cards: [king]}]}]);
      expect(playerReducer(state, createNewHandAction(1, [king], true, 10)))
        .toEqual([state[0], { ...state[1], hands: [{ soft: true, weight: 10, cards: [king]}]}]);

      expect(playerReducer([state[0], {
        ...state[1], status: 'any', bet: 10, hands: [{ cards: [king]}],
      }], resetStatus(1)))
        .toEqual([state[0], {
          ...state[1], status: '', bet: 5, hands: [],
        }]);
      expect(playerReducer([{
        ...state[0], status: 'any', bet: 10, hands: [{ cards: [king]}],
      }, state[1]], resetStatus()))
        .toEqual([{
          ...state[0], status: '', bet: 5, hands: [],
        }, state[1]]);
    });

    test('incorrect parameters', () => {
      // @ts-expect-error: fake action for testing purposes
      expect(playerReducer(state, { type: undefined })).toEqual(state);
      // @ts-expect-error: fake action for testing purposes
      expect(playerReducer(undefined, { type: undefined })).toHaveLength(7);
    });

    test('when there is no valid user for payout, nothing happens', () => {
      expect(playerReducer(state, payout(3, 'status', -31))).toEqual(state);
    });
  });

  describe('async thunk actions', () => {
    test('newHand', () => {
      const cards = [king];
      jest.spyOn(Deck, 'deal').mockResolvedValue(cards);
      const expectedActions = [
        { type: pa.NEW_HAND, player: { id: 0, hands: [{ cards, weight: 0, soft: false }]}},
      ];
      const store = mockStore({ players: state });
      // @ts-expect-error: no idea why dispatch has this issue
      return store.dispatch(newHand()).then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    test('drawCard', () => {
      jest.spyOn(Deck, 'deal').mockResolvedValue([king]);
      const expectedActions = [
        { type: pa.DRAW_CARD, player: { id: 0, hands: [{ cards: [queen, king], weight: 0, soft: false }]}},
      ];
      const store = mockStore({ players: state });
      // @ts-expect-error: no idea why dispatch has this issue
      return store.dispatch(drawCard([{ cards: [queen]}], 0)).then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    test.skip('splitHand', () => {
      jest.spyOn(Deck, 'deal').mockResolvedValue([king]);
      const expectedActions = [
        { type: pa.SPLIT_HAND, player: { id: 0, hands: [{ cards: [queen, king]}, { cards: [jack, king]}]}},
      ];
      const store = mockStore({ todos: []});
      // @ts-expect-error: no idea why dispatch has this issue
      return store.dispatch(splitHand([{ cards: [queen, jack]}], 0)).then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    test('swapCards', () => {
      jest.spyOn(Deck, 'deal').mockResolvedValue([king]);
      const expectedActions = [
        { type: pa.SWAP_CARD, player: { id: 0, hands: [{ cards: [queen, king]}]}},
      ];
      const store = mockStore({ players: state });
      // @ts-expect-error: no idea why dispatch has this issue
      return store.dispatch(swapCards([{ cards: [queen, jack]}], 0, [1])).then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
});
