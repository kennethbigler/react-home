import { createStore } from "jotai";
import { describe, it, expect } from "vitest";
import yahtzeeState, { yahtzeeRead } from "./yahtzee-state";

const makeStore = () => createStore();

describe("jotai | yahtzee-state", () => {
  describe("yahtzeeRead", () => {
    it("topSum < 63 → no bonus, finalTopSum = topSum", () => {
      const store = makeStore();
      const base = store.get(yahtzeeState);
      store.set(yahtzeeState, {
        ...base,
        topScores: [3, 6, 9, 12, 15, 0], // sum = 45 < 63
        bottomScores: [-1, -1, -1, -1, -1, -1, -1],
        money: 100,
      });
      const read = store.get(yahtzeeRead);
      expect(read.topSum).toBe(45);
      expect(read.finalTopSum).toBe(45);
    });

    it("topSum >= 63 → adds 35 bonus (line 60-62 true branch)", () => {
      const store = makeStore();
      const base = store.get(yahtzeeState);
      store.set(yahtzeeState, {
        ...base,
        topScores: [3, 6, 9, 12, 15, 18], // sum = 63
        bottomScores: [-1, -1, -1, -1, -1, -1, -1],
        money: 100,
      });
      const read = store.get(yahtzeeRead);
      expect(read.topSum).toBe(63);
      expect(read.finalTopSum).toBe(98); // 63 + 35
    });

    it("finish is true when all 13 scores filled", () => {
      const store = makeStore();
      const base = store.get(yahtzeeState);
      store.set(yahtzeeState, {
        ...base,
        topScores: [3, 6, 9, 12, 15, 18],       // 6 scores
        bottomScores: [25, 30, 40, 50, 0, 0, 10], // 7 scores → total 13
        money: 100,
      });
      const read = store.get(yahtzeeRead);
      expect(read.finish).toBe(true);
    });

    it("finish is false when not all 13 scores filled", () => {
      const store = makeStore();
      const base = store.get(yahtzeeState);
      store.set(yahtzeeState, {
        ...base,
        topScores: [-1, -1, -1, -1, -1, -1],
        bottomScores: [-1, -1, -1, -1, -1, -1, -1],
        money: 100,
      });
      const read = store.get(yahtzeeRead);
      expect(read.finish).toBe(false);
    });

    it("scores with -1 values are excluded from count and sum", () => {
      const store = makeStore();
      const base = store.get(yahtzeeState);
      store.set(yahtzeeState, {
        ...base,
        topScores: [5, -1, -1, -1, -1, -1], // only 1 filled
        bottomScores: [25, -1, -1, -1, -1, -1, -1], // only 1 filled
        money: 100,
      });
      const read = store.get(yahtzeeRead);
      expect(read.topSum).toBe(5);
      expect(read.bottomSum).toBe(25);
      expect(read.finish).toBe(false);
    });
  });
});
