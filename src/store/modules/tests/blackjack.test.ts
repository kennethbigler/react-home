import blackjackReducer, {
  updateGameFunctions,
  updateHideHands,
  updateHasFunctions,
  newBlackjackGame,
} from "../blackjack";

const state = {
  gameFunctions: ["black", "jack"],
  hasFunctions: true,
  hideHands: true,
};

describe("store | modules | blackjack", () => {
  describe("reducer", () => {
    test("actions", () => {
      expect(
        blackjackReducer(state, updateGameFunctions(["hello", "world"]))
      ).toEqual({
        gameFunctions: ["hello", "world"],
        hasFunctions: true,
        hideHands: true,
      });
      expect(blackjackReducer(state, updateHideHands(false))).toEqual({
        gameFunctions: ["black", "jack"],
        hasFunctions: true,
        hideHands: false,
      });
      expect(blackjackReducer(state, updateHasFunctions(false))).toEqual({
        gameFunctions: ["black", "jack"],
        hasFunctions: false,
        hideHands: true,
      });
    });

    test("incorrect parameters", () => {
      expect(blackjackReducer(state, { type: undefined })).toEqual(state);
      expect(blackjackReducer(undefined, { type: undefined })).toEqual(
        newBlackjackGame()
      );
    });
  });
});
