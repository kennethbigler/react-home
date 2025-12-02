import { describe, it, expect } from "vitest";
import { createStore } from "jotai";
import bridgeAtom, { bridgeRead, newBridgeGame } from "./bridge-atom";

describe("Bridge Atom", () => {
  describe("newBridgeGame", () => {
    it("creates a new game with empty scores", () => {
      const game = newBridgeGame();

      expect(game.aboveScores).toEqual([
        [[], []],
        [[], []],
        [[], []],
      ]);
      expect(game.weBelow).toEqual([]);
      expect(game.theyBelow).toEqual([]);
    });

    it("does not include rubber counts", () => {
      const game = newBridgeGame();

      expect("weRubbers" in game).toBe(false);
      expect("theyRubbers" in game).toBe(false);
    });
  });

  describe("bridgeAtom", () => {
    it("initializes with default values", () => {
      const store = createStore();
      const state = store.get(bridgeAtom);

      expect(state.aboveScores).toEqual([
        [[], []],
        [[], []],
        [[], []],
      ]);
      expect(state.weBelow).toEqual([]);
      expect(state.theyBelow).toEqual([]);
      expect(state.weRubbers).toBe(0);
      expect(state.theyRubbers).toBe(0);
    });

    it("persists to localStorage (atomWithStorage)", () => {
      const store = createStore();

      store.set(bridgeAtom, {
        aboveScores: [
          [[100], []],
          [[], []],
          [[], []],
        ],
        bids: [],
        weBelow: [50],
        theyBelow: [],
        weRubbers: 1,
        theyRubbers: 0,
      });

      const state = store.get(bridgeAtom);
      expect(state.weRubbers).toBe(1);
      expect(state.aboveScores[0][0]).toEqual([100]);
    });
  });

  describe("bridgeRead", () => {
    it("calculates initial state correctly", () => {
      const store = createStore();
      const read = store.get(bridgeRead);

      expect(read.gameIdx).toBe(0);
      expect(read.weSum).toBe(0);
      expect(read.weWins).toBe(0);
      expect(read.weVulnerable).toBe(false);
      expect(read.theySum).toBe(0);
      expect(read.theyWins).toBe(0);
      expect(read.theyVulnerable).toBe(false);
    });

    it("calculates we win when above score >= 100 and higher than opponent", () => {
      const store = createStore();
      store.set(bridgeAtom, {
        aboveScores: [
          [[120], []],
          [[], []],
          [[], []],
        ],
        bids: [],
        weBelow: [],
        theyBelow: [],
        weRubbers: 0,
        theyRubbers: 0,
      });

      const read = store.get(bridgeRead);

      expect(read.weWins).toBe(1);
      expect(read.theyWins).toBe(0);
      expect(read.gameIdx).toBe(1);
      expect(read.weVulnerable).toBe(true);
      expect(read.theyVulnerable).toBe(false);
    });

    it("calculates they win when above score >= 100 and higher than opponent", () => {
      const store = createStore();
      store.set(bridgeAtom, {
        aboveScores: [
          [[], [120]],
          [[], []],
          [[], []],
        ],
        bids: [],
        weBelow: [],
        theyBelow: [],
        weRubbers: 0,
        theyRubbers: 0,
      });

      const read = store.get(bridgeRead);

      expect(read.weWins).toBe(0);
      expect(read.theyWins).toBe(1);
      expect(read.gameIdx).toBe(1);
      expect(read.weVulnerable).toBe(false);
      expect(read.theyVulnerable).toBe(true);
    });

    it("does not count win when score < 100", () => {
      const store = createStore();
      store.set(bridgeAtom, {
        aboveScores: [
          [[80], []],
          [[], []],
          [[], []],
        ],
        bids: [],
        weBelow: [],
        theyBelow: [],
        weRubbers: 0,
        theyRubbers: 0,
      });

      const read = store.get(bridgeRead);

      expect(read.weWins).toBe(0);
      expect(read.gameIdx).toBe(0);
    });

    it("does not count win when score = 100 but opponent score is higher", () => {
      const store = createStore();
      store.set(bridgeAtom, {
        aboveScores: [
          [[100], [120]],
          [[], []],
          [[], []],
        ],
        bids: [],
        weBelow: [],
        theyBelow: [],
        weRubbers: 0,
        theyRubbers: 0,
      });

      const read = store.get(bridgeRead);

      expect(read.weWins).toBe(0);
      expect(read.theyWins).toBe(1);
    });

    it("calculates total sum including above and below the line", () => {
      const store = createStore();
      store.set(bridgeAtom, {
        aboveScores: [
          [[40], [30]],
          [[20], [15]],
          [[], []],
        ],
        bids: [],
        weBelow: [50, 25],
        theyBelow: [40, 10],
        weRubbers: 0,
        theyRubbers: 0,
      });

      const read = store.get(bridgeRead);

      expect(read.weSum).toBe(135); // 40 + 20 + 50 + 25
      expect(read.theySum).toBe(95); // 30 + 15 + 40 + 10
    });

    it("calculates multiple wins correctly", () => {
      const store = createStore();
      store.set(bridgeAtom, {
        aboveScores: [
          [[120], []],
          [[120], []],
          [[], []],
        ],
        bids: [],
        weBelow: [],
        theyBelow: [],
        weRubbers: 0,
        theyRubbers: 0,
      });

      const read = store.get(bridgeRead);

      expect(read.weWins).toBe(2);
      expect(read.gameIdx).toBe(2);
    });

    it("sets vulnerability correctly based on wins", () => {
      const store = createStore();
      store.set(bridgeAtom, {
        aboveScores: [
          [[120], []],
          [[], [120]],
          [[], []],
        ],
        bids: [],
        weBelow: [],
        theyBelow: [],
        weRubbers: 0,
        theyRubbers: 0,
      });

      const read = store.get(bridgeRead);

      expect(read.weVulnerable).toBe(true);
      expect(read.theyVulnerable).toBe(true);
    });

    it("does not set vulnerability when no wins", () => {
      const store = createStore();
      store.set(bridgeAtom, {
        aboveScores: [
          [[80], [90]],
          [[], []],
          [[], []],
        ],
        bids: [],
        weBelow: [],
        theyBelow: [],
        weRubbers: 0,
        theyRubbers: 0,
      });

      const read = store.get(bridgeRead);

      expect(read.weVulnerable).toBe(false);
      expect(read.theyVulnerable).toBe(false);
    });

    it("increments gameIdx for each completed game", () => {
      const store = createStore();
      store.set(bridgeAtom, {
        aboveScores: [
          [[120], []],
          [[], [120]],
          [[120], []],
        ],
        bids: [],
        weBelow: [],
        theyBelow: [],
        weRubbers: 0,
        theyRubbers: 0,
      });

      const read = store.get(bridgeRead);

      expect(read.gameIdx).toBe(3);
      expect(read.weWins).toBe(2);
      expect(read.theyWins).toBe(1);
    });

    it("handles scores exactly at 100", () => {
      const store = createStore();
      store.set(bridgeAtom, {
        aboveScores: [
          [[100], [99]],
          [[], []],
          [[], []],
        ],
        bids: [],
        weBelow: [],
        theyBelow: [],
        weRubbers: 0,
        theyRubbers: 0,
      });

      const read = store.get(bridgeRead);

      expect(read.weWins).toBe(1);
      expect(read.theyWins).toBe(0);
      expect(read.gameIdx).toBe(1);
    });

    it("handles tied scores (no winner)", () => {
      const store = createStore();
      store.set(bridgeAtom, {
        aboveScores: [
          [[100], [100]],
          [[], []],
          [[], []],
        ],
        bids: [],
        weBelow: [],
        theyBelow: [],
        weRubbers: 0,
        theyRubbers: 0,
      });

      const read = store.get(bridgeRead);

      expect(read.weWins).toBe(0);
      expect(read.theyWins).toBe(0);
      expect(read.gameIdx).toBe(0);
    });

    it("sums multiple scores within a game", () => {
      const store = createStore();
      store.set(bridgeAtom, {
        aboveScores: [
          [
            [40, 30, 35],
            [25, 20],
          ], // We: 105, They: 45
          [[], []],
          [[], []],
        ],
        bids: [],
        weBelow: [],
        theyBelow: [],
        weRubbers: 0,
        theyRubbers: 0,
      });

      const read = store.get(bridgeRead);

      expect(read.weWins).toBe(1);
      expect(read.theyWins).toBe(0);
      expect(read.weSum).toBe(105);
      expect(read.theySum).toBe(45);
    });

    it("calculates wins across all three games", () => {
      const store = createStore();
      store.set(bridgeAtom, {
        aboveScores: [
          [[120], [80]],
          [[90], [120]],
          [[120], [90]],
        ],
        bids: [],
        weBelow: [],
        theyBelow: [],
        weRubbers: 0,
        theyRubbers: 0,
      });

      const read = store.get(bridgeRead);

      expect(read.weWins).toBe(2);
      expect(read.theyWins).toBe(1);
      expect(read.gameIdx).toBe(3);
    });
  });
});
