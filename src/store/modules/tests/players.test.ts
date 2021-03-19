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
  newPlayer(1, 'Ken', false),
  newPlayer(2),
];

const king = { name: 'K', weight: 13, suit: '♣' };
const queen = { name: 'Q', weight: 12, suit: '♣' };
const jack = { name: 'J', weight: 11, suit: '♣' };

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('store | modules | players', () => {
  test('reducer', () => {
    expect(playerReducer(state, addPlayer(state, 'Andrew'))).toHaveLength(3);
    expect(playerReducer(state, removePlayer(2))).toEqual([state[0]]);
    expect(playerReducer(state, updateName(2, 'Andrew'))).toEqual([state[0], { ...state[1], name: 'Andrew' }]);
    expect(playerReducer(state, updateBot(2, false))).toEqual([state[0], { ...state[1], isBot: false }]);
    expect(playerReducer(state, updateBet(2, 69))).toEqual([state[0], { ...state[1], bet: 69 }]);
    expect(playerReducer(state, payout(2, 'status', -31))).toEqual([state[0], { ...state[1], status: 'status', money: 69 }]);
    expect(playerReducer(state, createSplitHandAction(2, [{ cards: [king]}])))
      .toEqual([state[0], { ...state[1], hands: [{ cards: [king]}]}]);
    expect(playerReducer(state, createDrawCardAction(2, [{ cards: [king]}])))
      .toEqual([state[0], { ...state[1], hands: [{ cards: [king]}]}]);
    expect(playerReducer(state, createSwapCardsAction(2, [{ cards: [king]}])))
      .toEqual([state[0], { ...state[1], hands: [{ cards: [king]}]}]);
    expect(playerReducer(state, createNewHandAction(2, [king], true, 10)))
      .toEqual([state[0], { ...state[1], hands: [{ soft: true, weight: 10, cards: [king]}]}]);
    expect(playerReducer([state[0], {
      ...state[1], status: 'any', bet: 10, hands: [{ cards: [king]}],
    }], resetStatus(2)))
      .toEqual([state[0], {
        ...state[1], status: '', bet: 5, hands: [],
      }]);
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

  describe('async thunk actions', () => {
    it('creates a newHand', async () => {
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

    it('draws a card', async () => {
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

    it.skip('splits a hand', async () => {
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

    it('swaps cards', async () => {
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
