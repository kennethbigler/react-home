import { newConnect4Game } from '../../initialState';
import { DBConnect4 } from '../../types';
import connect4Reducer, { newGame, updateTurn, updateEval } from '../connect4';

const state: DBConnect4 = {
  board: [[1]],
  winner: 1,
  line: [undefined, undefined, undefined],
  turn: 0,
};

describe('store | modules | blackjack', () => {
  test('reducer', () => {
    expect(connect4Reducer(state, newGame())).toEqual(newConnect4Game());
    expect(connect4Reducer(state, updateTurn(2))).toEqual({
      board: [[1]],
      winner: 1,
      line: [undefined, undefined, undefined],
      turn: 2,
    });
    expect(connect4Reducer(state, updateEval(0, [[1, 2]]))).toEqual({
      board: [[1, 2]],
      winner: 0,
      line: [undefined, undefined, undefined],
      turn: 0,
    });
    // @ts-expect-error: for testing purposes, using fake action
    expect(connect4Reducer(state, { type: undefined })).toEqual({
      board: [[1]],
      winner: 1,
      line: [undefined, undefined, undefined],
      turn: 0,
    });
    // @ts-expect-error: for testing purposes, using fake action
    expect(connect4Reducer(undefined, { type: undefined })).toEqual(newConnect4Game());
  });
});
