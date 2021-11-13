import { newConnect4Game } from "../../initialState";
import { DBConnect4 } from "../../types";
import connect4Reducer, { newGame, updateTurn, updateEval } from "../connect4";

const state: DBConnect4 = newConnect4Game();

describe("store | modules | connect4", () => {
  test("reducer", () => {
    expect(
      connect4Reducer(
        {
          board: [[1]],
          winner: 1,
          line: [undefined, undefined, undefined],
          turn: 0,
        },
        newGame()
      )
    ).toEqual(state);
    expect(connect4Reducer(state, updateTurn(2))).toEqual({
      ...state,
      turn: 2,
    });
    expect(connect4Reducer(state, updateEval(0, [[1, 2]]))).toEqual({
      ...state,
      board: [[1, 2]],
      winner: 0,
    });
  });

  test("incorrect parameters", () => {
    // @ts-expect-error: for testing purposes, using fake action
    expect(connect4Reducer(state, { type: undefined })).toEqual(state);
    // @ts-expect-error: for testing purposes, using fake action
    expect(connect4Reducer(undefined, { type: undefined })).toEqual(state);
  });
});
