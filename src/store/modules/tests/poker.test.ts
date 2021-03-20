import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { newPokerGameState, newPlayer } from '../../initialState';
import { PokerGameFunctions as PGF } from '../../types';
import pokerReducer, {
  pa as pokerActions,
  newGame, startPokerGame, endTurn, endPokerGame, discardCards, updateCardsToDiscard,
  newPokerGame, endPokerTurn,
} from '../poker';
import { ta } from '../turn';
import { pa } from '../players';

const state = newPokerGameState();
const ken = newPlayer(1, 'Ken', false);

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('store | modules | poker', () => {
  describe('reducer', () => {
    test('actions', () => {
      expect(pokerReducer({
        gameFunctions: [PGF.START_GAME],
        cardsToDiscard: [],
        hideHands: true,
        gameOver: true,
      }, newGame())).toEqual(state);
      expect(pokerReducer(state, startPokerGame())).toEqual({
        ...state,
        gameFunctions: [PGF.DISCARD_CARDS],
        hideHands: false,
      });
      expect(pokerReducer(state, endTurn())).toEqual({
        ...state,
        gameFunctions: [PGF.DISCARD_CARDS],
        cardsToDiscard: [],
      });
      expect(pokerReducer(state, endPokerGame())).toEqual({
        ...state,
        gameFunctions: [PGF.NEW_GAME],
        gameOver: true,
      });
      expect(pokerReducer(state, discardCards())).toEqual({
        ...state,
        gameFunctions: [PGF.END_TURN],
        cardsToDiscard: [],
      });
      expect(pokerReducer(state, updateCardsToDiscard([1]))).toEqual({
        ...state,
        cardsToDiscard: [1],
      });
    });

    test('incorrect parameters', () => {
    // @ts-expect-error: fake action for testing purposes
      expect(pokerReducer(state, { type: undefined })).toEqual(state);
      // @ts-expect-error: fake action for testing purposes
      expect(pokerReducer(undefined, { type: undefined })).toEqual(state);
    });
  });

  describe('async thunk actions', () => {
    test('newPokerGame', () => {
      const expectedActions = [
        { type: pokerActions.NEW_GAME },
        { type: ta.RESET },
        {
          type: pa.RESET,
          player: {
            id: 1, status: '', hands: [], bet: 5,
          },
        },
      ];
      const store = mockStore({});
      // @ts-expect-error: no idea why dispatch has this issue
      return store.dispatch(newPokerGame([ken])).then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    test('endPokerTurn', () => {
      const expectedActions = [
        { type: pokerActions.END_TURN },
        { type: ta.INCR_PLAYER },
      ];
      const store = mockStore({});
      // @ts-expect-error: no idea why dispatch has this issue
      return store.dispatch(endPokerTurn()).then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
});
