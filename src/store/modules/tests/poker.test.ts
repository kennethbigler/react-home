import { newPokerGameState } from '../../initialState';
import { PokerGameFunctions as PGF } from '../../types';
import pokerReducer, {
  newGame, startPokerGame, endTurn, endPokerGame, discardCards, updateCardsToDiscard,
} from '../poker';

const state = newPokerGameState();

describe('store | modules | poker', () => {
  test('reducer', () => {
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
