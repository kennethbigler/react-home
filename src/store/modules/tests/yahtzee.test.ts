import yahtzeeReducer, {
  addScore,
  newGame,
  diceClick,
  updateTop,
  updateBottom,
  updateRoll,
  newYahtzee,
} from "../yahtzee";

const state = { ...newYahtzee(), scores: [] };

describe("store | modules | yahtzee", () => {
  test("reducer", () => {
    expect(yahtzeeReducer(state, addScore(100))).toEqual({
      ...state,
      scores: [100],
    });
    expect(yahtzeeReducer(state, newGame())).toEqual(state);
    expect(
      yahtzeeReducer(state, diceClick({ values: [1], saved: [2] }))
    ).toEqual({
      ...state,
      values: [1],
      saved: [2],
    });
    expect(yahtzeeReducer(state, updateTop([100]))).toEqual({
      ...state,
      showScoreButtons: false,
      topScores: [100],
    });
    expect(yahtzeeReducer(state, updateBottom([100]))).toEqual({
      ...state,
      showScoreButtons: false,
      bottomScores: [100],
    });
    expect(
      yahtzeeReducer(state, updateRoll({ values: [1], saved: [2], roll: 3 }))
    ).toEqual({
      ...state,
      values: [1],
      saved: [2],
      roll: 3,
      showScoreButtons: true,
    });
  });

  test("incorrect parameters", () => {
    expect(yahtzeeReducer(state, { type: undefined })).toEqual(state);
    expect(yahtzeeReducer(undefined, { type: undefined })).toEqual(state);
  });
});
