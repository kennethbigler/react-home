import connect4Reducer, {
  newGame,
  updateTurn,
  updateBoard,
  updateWinner,
  Connect4State,
  newConnect4Game,
} from "../connect4";

const state: Connect4State = newConnect4Game();

describe("store | modules | connect4", () => {
  test("reducer", () => {
    expect(
      connect4Reducer({ board: [[1]], winner: 1, turn: 0 }, newGame())
    ).toEqual(state);
    expect(connect4Reducer(state, updateTurn(2))).toEqual({
      ...state,
      turn: 2,
    });
    expect(connect4Reducer(state, updateWinner(0))).toEqual({
      ...state,
      winner: 0,
    });
    expect(connect4Reducer(state, updateBoard([[1, 2]]))).toEqual({
      ...state,
      board: [[1, 2]],
    });
  });

  test("incorrect parameters", () => {
    expect(connect4Reducer(state, { type: undefined })).toEqual(state);
    expect(connect4Reducer(undefined, { type: undefined })).toEqual(state);
  });
});
