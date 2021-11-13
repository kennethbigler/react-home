import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

import { newDNDGame } from "../../initialState";
import dndReducer, {
  PLAYER_CHOICE,
  FINISH_GAME,
  newGame,
  updatePlayerChoice,
  setOpenCase,
  setOpenOffer,
  setNoDeal,
  finishGame,
  setPlayerChoice,
  setFinishGame,
} from "../dnd";
import { PA } from "../players";

const state = newDNDGame();

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("store | modules | dnd", () => {
  describe("reducer", () => {
    test("actions", () => {
      expect(dndReducer(state, newGame())).not.toEqual(state);
      expect(
        dndReducer(state, updatePlayerChoice({ on: true, loc: 0, val: 0 }))
      ).toEqual({ ...state, playerChoice: { on: true, loc: 0, val: 0 } });
      expect(
        dndReducer(state, setOpenCase([{ on: true, loc: 0, val: 0 }], 1, 1, 1))
      ).toEqual({
        ...state,
        board: [{ on: true, loc: 0, val: 0 }],
        sum: 1,
        numCases: 1,
        casesToOpen: 1,
      });
      expect(dndReducer(state, setOpenOffer(1, 2))).toEqual({
        ...state,
        offer: 1,
        casesToOpen: 2,
        dndOpen: true,
      });
      expect(dndReducer(state, setNoDeal(6))).toEqual({ ...state, turn: 7 });
      expect(dndReducer(state, finishGame(7))).toEqual({
        ...state,
        dndOpen: false,
        isOver: true,
        offer: 7,
      });
    });

    test("incorrect parameters", () => {
      // @ts-expect-error: for testing purposes, using fake action
      expect(dndReducer(state, { type: undefined })).toEqual(state);
      // @ts-expect-error: for testing purposes, using fake action
      expect(dndReducer(undefined, { type: undefined })).toMatchObject({
        turn: 1,
      });
    });
  });

  describe("async thunk actions", () => {
    test("setPlayerChoice", () => {
      const expectedActions = [
        { type: PLAYER_CHOICE, playerChoice: { on: true, loc: 27, val: 69 } },
        { type: PA.PAY_PLAYER, player: { id: 1, status: "lose", money: -100 } },
      ];
      const store = mockStore({});
      return store // @ts-expect-error: no idea why dispatch has this issue
        .dispatch(setPlayerChoice(1, { on: true, loc: 27, val: 69 }))
        .then(() => {
          // return of async actions
          expect(store.getActions()).toEqual(expectedActions);
        });
    });

    test("setFinishGame", () => {
      const expectedActions = [
        { type: PA.PAY_PLAYER, player: { id: 1, status: "win", money: 169 } },
        { type: FINISH_GAME, offer: 169000 },
      ];
      const store = mockStore({});
      // @ts-expect-error: no idea why dispatch has this issue
      return store.dispatch(setFinishGame(1, 169000)).then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
});
