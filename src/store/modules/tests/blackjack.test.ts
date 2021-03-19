import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { newBlackjackGame, newPlayer } from '../../initialState';
import blackjackReducer, {
  updateGameFunctions, updateHideHands, updateHasFunctions,
  setNewGame, splitHand, hitHand, stayHand, doubleHand,
  UPDATE_GAME_FUNCTIONS, UPDATE_HIDE_HANDS, UPDATE_HAS_FUNCTIONS,
} from '../blackjack';
import { ta } from '../turn';
import { pa, defaultWeigh } from '../players';
import { GameFunctions } from '../../types';
import Deck from '../../../apis/Deck';

const state = {
  gameFunctions: ['black', 'jack'],
  hasFunctions: true,
  hideHands: true,
};

const players = [
  newPlayer(1, 'Ken', false),
  newPlayer(2),
];

const king = { name: 'K', weight: 13, suit: '♣' };
const queen = { name: 'Q', weight: 12, suit: '♣' };
const jack = { name: 'J', weight: 11, suit: '♣' };

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('store | modules | blackjack', () => {
  describe('reducer', () => {
    test('actions', () => {
      expect(blackjackReducer(state, updateGameFunctions(['hello', 'world']))).toEqual({
        gameFunctions: ['hello', 'world'],
        hasFunctions: true,
        hideHands: true,
      });
      expect(blackjackReducer(state, updateHideHands(false))).toEqual({
        gameFunctions: ['black', 'jack'],
        hasFunctions: true,
        hideHands: false,
      });
      expect(blackjackReducer(state, updateHasFunctions(false))).toEqual({
        gameFunctions: ['black', 'jack'],
        hasFunctions: false,
        hideHands: true,
      });
    });

    test('incorrect parameters', () => {
      // @ts-expect-error: for testing purposes, using fake action
      expect(blackjackReducer(state, { type: undefined })).toEqual(state);
      // @ts-expect-error: for testing purposes, using fake action
      expect(blackjackReducer(undefined, { type: undefined })).toEqual(newBlackjackGame());
    });
  });

  describe('async thunk actions', () => {
    test('setNewGame', () => {
      const expectedActions = [
        { type: UPDATE_GAME_FUNCTIONS, gameFunctions: [GameFunctions.FINISH_BETTING]},
        { type: UPDATE_HAS_FUNCTIONS, hasFunctions: false },
        { type: UPDATE_HIDE_HANDS, hideHands: true },
        { type: ta.RESET },
        {
          type: pa.RESET,
          player: {
            id: 1, status: '', hands: [], bet: 5,
          },
        },
        {
          type: pa.RESET,
          player: {
            id: 2, status: '', hands: [], bet: 5,
          },
        },
      ];
      const store = mockStore({});
      // @ts-expect-error: no idea why dispatch has this issue
      return store.dispatch(setNewGame(players)).then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    test('splitHand', () => {
      jest.spyOn(Deck, 'deal').mockResolvedValue([king]);
      const expectedActions = [
        {
          type: pa.SPLIT_HAND,
          player: {
            id: 0,
            hands: [
              { cards: [queen, king], soft: false, weight: 0 },
              { cards: [jack, king], soft: false, weight: 0 },
            ],
          },
        },
        { type: UPDATE_HAS_FUNCTIONS, hasFunctions: false },
      ];
      const store = mockStore({});
      // @ts-expect-error: no idea why dispatch has this issue
      return store.dispatch(splitHand([{ cards: [queen, jack]}], 0, 0, defaultWeigh)).then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    test('hitHand', () => {
      jest.spyOn(Deck, 'deal').mockResolvedValue([king]);
      const expectedActions = [
        { type: pa.DRAW_CARD, player: { id: 0, hands: [{ cards: [queen, king], weight: 0, soft: false }]}},
        { type: UPDATE_HAS_FUNCTIONS, hasFunctions: false },
      ];
      const store = mockStore({});
      // @ts-expect-error: no idea why dispatch has this issue
      return store.dispatch(hitHand([{ cards: [queen]}], 0, 0, defaultWeigh)).then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    test('stayHand(true)', () => {
      const expectedActions = [
        { type: ta.INCR_HAND },
        { type: UPDATE_HAS_FUNCTIONS, hasFunctions: false },
      ];
      const store = mockStore({});
      // @ts-expect-error: no idea why dispatch has this issue
      return store.dispatch(stayHand(true)).then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    test('stayHand(false)', () => {
      const expectedActions = [
        { type: ta.INCR_PLAYER },
        { type: UPDATE_HAS_FUNCTIONS, hasFunctions: false },
      ];
      const store = mockStore({});
      // @ts-expect-error: no idea why dispatch has this issue
      return store.dispatch(stayHand(false)).then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    test('doubleHand', () => {
      jest.spyOn(Deck, 'deal').mockResolvedValue([king]);
      const expectedActions = [
        { type: UPDATE_HAS_FUNCTIONS, hasFunctions: true },
        { type: pa.UPDATE_BET, player: { id: 1, bet: 10 }},
        { type: pa.DRAW_CARD, player: { id: 1, hands: [{ cards: [queen, king], weight: 0, soft: false }]}},
        { type: ta.INCR_PLAYER },
        { type: UPDATE_HAS_FUNCTIONS, hasFunctions: false },
      ];
      const store = mockStore({});
      // @ts-expect-error: no idea why dispatch has this issue
      return store.dispatch(doubleHand({ ...players[0], hands: [{ cards: [queen], weight: 0, soft: false }]}, { player: 0, hand: 0 }, defaultWeigh)).then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
});
