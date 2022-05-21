import pokerReducer, {
  newPokerGame,
  startPokerGame,
  endPokerTurn,
  endPokerGame,
  discardCards,
  updateCardsToDiscard,
  PokerGameFunctions as PGF,
  newPokerGameState,
} from "../poker";

const state = newPokerGameState();

describe("store | modules | poker", () => {
  describe("reducer", () => {
    test("actions", () => {
      expect(
        pokerReducer(
          {
            gameFunctions: [PGF.START_GAME],
            cardsToDiscard: [],
            hideHands: true,
            gameOver: true,
          },
          newPokerGame([])
        )
      ).toEqual(state);
      expect(pokerReducer(state, startPokerGame())).toEqual({
        ...state,
        gameFunctions: [PGF.DISCARD_CARDS],
        hideHands: false,
      });
      expect(pokerReducer(state, endPokerTurn())).toEqual({
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

    test("incorrect parameters", () => {
      expect(pokerReducer(state, { type: undefined })).toEqual(state);
      expect(pokerReducer(undefined, { type: undefined })).toEqual(state);
    });
  });
});
