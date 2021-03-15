import blackjackReducer, { updateGameFunctions, updateHideHands, updateHasFunctions } from '../blackjack';

const state = {
  gameFunctions: ['black', 'jack'],
  hasFunctions: true,
  hideHands: true,
};

describe('store | modules | blackjack', () => {
  test('reducer', () => {
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
    // @ts-expect-error: for testing purposes, using fake action
    expect(blackjackReducer(state, { type: undefined })).toEqual({
      gameFunctions: ['black', 'jack'],
      hasFunctions: true,
      hideHands: true,
    });
  });
});
