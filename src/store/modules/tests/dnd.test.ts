import dndReducer, {
  newDNDGame,
  newGame,
  setPlayerChoice,
  setOpenCase,
  setOpenOffer,
  setNoDeal,
  setFinishGame,
} from "../dnd";

const state = newDNDGame();

describe("store | modules | dnd", () => {
  describe("reducer", () => {
    test("actions", () => {
      expect(dndReducer(state, newGame())).not.toEqual(state);
      expect(
        dndReducer(
          state,
          setPlayerChoice({ id: 0, playerChoice: { on: true, loc: 0, val: 0 } })
        )
      ).toEqual({ ...state, playerChoice: { on: true, loc: 0, val: 0 } });
      expect(
        dndReducer(
          state,
          setOpenCase({
            board: [{ on: true, loc: 0, val: 0 }],
            caseNum: 0,
            sum: 1,
            numCases: 1,
            casesToOpen: 1,
          })
        )
      ).toEqual({
        ...state,
        board: [{ on: false, loc: 0, val: 0 }],
        sum: 1,
        numCases: 1,
        casesToOpen: 1,
      });
      expect(
        dndReducer(state, setOpenOffer({ offer: 1, casesToOpen: 2 }))
      ).toEqual({
        ...state,
        offer: 1,
        casesToOpen: 2,
        dndOpen: true,
      });
      expect(dndReducer(state, setNoDeal(6))).toEqual({ ...state, turn: 7 });
      expect(dndReducer(state, setFinishGame({ id: 0, offer: 7 }))).toEqual({
        ...state,
        dndOpen: false,
        isOver: true,
        offer: 7,
      });
    });

    test("incorrect parameters", () => {
      expect(dndReducer(state, { type: undefined })).toEqual(state);
      expect(dndReducer(undefined, { type: undefined })).toMatchObject({
        turn: 1,
      });
    });
  });
});
