import playerReducer, {
  addPlayer,
  removePlayer,
  updateName,
  updateBot,
  updateBet,
  payout,
  updateHands,
  createNewHandAction,
  resetStatus,
  newPlayer,
} from "../players";

const state = [newPlayer(0, "Ken", false), newPlayer(1)];

const king = { name: "K", weight: 13, suit: "♣" };

describe("store | modules | players", () => {
  describe("reducer", () => {
    test("actions", () => {
      expect(playerReducer(state, addPlayer("Andrew"))).toHaveLength(3);
      expect(playerReducer(state, removePlayer(1))).toEqual([state[0]]);
      expect(
        playerReducer(state, updateName({ id: 1, name: "Andrew" }))
      ).toEqual([state[0], { ...state[1], name: "Andrew" }]);

      expect(playerReducer(state, updateBot({ id: 1, isBot: false }))).toEqual([
        state[0],
        { ...state[1], isBot: false },
      ]);

      expect(playerReducer(state, updateBet({ id: 1, bet: 69 }))).toEqual([
        state[0],
        { ...state[1], bet: 69 },
      ]);
      expect(playerReducer(state, updateBet({ id: 0 }))).toEqual([
        { ...state[0], bet: 5 },
        state[1],
      ]);

      expect(
        playerReducer(state, payout({ id: 1, status: "status", money: -31 }))
      ).toEqual([state[0], { ...state[1], status: "status", money: 69 }]);
      expect(
        playerReducer(state, updateHands({ id: 1, hands: [{ cards: [king] }] }))
      ).toEqual([state[0], { ...state[1], hands: [{ cards: [king] }] }]);
      expect(
        playerReducer(
          state,
          createNewHandAction({ id: 1, cards: [king], soft: true, weight: 10 })
        )
      ).toEqual([
        state[0],
        { ...state[1], hands: [{ soft: true, weight: 10, cards: [king] }] },
      ]);

      expect(
        playerReducer(
          [
            state[0],
            {
              ...state[1],
              status: "any",
              bet: 10,
              hands: [{ cards: [king] }],
            },
          ],
          resetStatus(1)
        )
      ).toEqual([
        state[0],
        {
          ...state[1],
          status: "",
          bet: 5,
          hands: [],
        },
      ]);
      expect(
        playerReducer(
          [
            {
              ...state[0],
              status: "any",
              bet: 10,
              hands: [{ cards: [king] }],
            },
            state[1],
          ],
          resetStatus(0)
        )
      ).toEqual([
        {
          ...state[0],
          status: "",
          bet: 5,
          hands: [],
        },
        state[1],
      ]);
    });

    test("incorrect parameters", () => {
      expect(playerReducer(state, { type: undefined })).toEqual(state);
      expect(playerReducer(undefined, { type: undefined })).toHaveLength(7);
    });

    test("when there is no valid user for payout, nothing happens", () => {
      expect(
        playerReducer(state, payout({ id: 3, status: "status", money: -31 }))
      ).toEqual(state);
    });
  });
});
