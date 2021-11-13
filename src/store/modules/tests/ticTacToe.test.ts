import { newTicTacToe } from "../../initialState";
import tttReducer, { playTurn, newGame } from "../ticTacToe";

const state = newTicTacToe();

describe("store | modules | ticTacToe", () => {
  test("reducer", () => {
    expect(
      tttReducer(
        state,
        playTurn({ history: [{ board: ["X"] }], turn: "O", step: 1 })
      )
    ).toEqual({ history: [{ board: ["X"] }], turn: "O", step: 1 });
    expect(
      tttReducer({ history: [{ board: ["X"] }], turn: "O", step: 1 }, newGame())
    ).toEqual(state);
  });

  test("incorrect parameters", () => {
    // @ts-expect-error: fake action for testing purposes
    expect(tttReducer(state, { type: undefined })).toEqual(state);
    // @ts-expect-error: fake action for testing purposes
    expect(tttReducer(undefined, { type: undefined })).toEqual(state);
  });
});
