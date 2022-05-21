import turnReducer, { incrPlayerTurn, incrHandTurn, resetTurn } from "../turn";

const state = { player: 0, hand: 0 };

describe("store | modules | turn", () => {
  test("reducer", () => {
    expect(turnReducer(state, incrPlayerTurn())).toEqual({
      ...state,
      ...{ player: state.player + 1, hand: 0 },
    });
    expect(turnReducer(state, incrHandTurn())).toEqual({
      ...state,
      ...{ hand: state.hand + 1 },
    });
    expect(turnReducer(state, resetTurn())).toEqual(state);
  });

  test("incorrect parameters", () => {
    expect(turnReducer(state, { type: undefined })).toEqual(state);
    expect(turnReducer(undefined, { type: undefined })).toEqual(state);
  });
});
