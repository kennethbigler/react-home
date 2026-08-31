import { describe, expect, it } from "vitest";
import { createStore } from "jotai";
import {
  mergeNetWorthCategoryAmounts,
  netWorthAtom,
  netWorthCategoriesAtom,
  netWorthRead,
  syncNetWorthEntryAmounts,
} from "./net-worth-atom";

describe("jotai | net-worth-atom", () => {
  describe("netWorthRead", () => {
    it("returns an empty array when there are no entries", () => {
      const store = createStore();

      expect(store.get(netWorthRead)).toEqual([]);
    });

    it("sums amounts for current categories and computes netDiff", () => {
      const store = createStore();

      store.set(netWorthCategoriesAtom, ["Cash", "Investments"]);
      store.set(netWorthAtom, [
        {
          entryDate: "2020-01",
          amounts: { Cash: 10_000, Investments: 40_000 },
        },
        {
          entryDate: "2021-01",
          amounts: { Cash: 12_000, Investments: 50_000 },
        },
      ]);

      expect(store.get(netWorthRead)).toEqual([
        { total: 50_000, netDiff: 0 },
        { total: 62_000, netDiff: 12_000 },
      ]);
    });

    it("treats missing category amounts as 0", () => {
      const store = createStore();

      store.set(netWorthCategoriesAtom, ["Cash", "Investments", "Home"]);
      store.set(netWorthAtom, [
        { entryDate: "2020-01", amounts: { Cash: 5_000 } },
      ]);

      expect(store.get(netWorthRead)).toEqual([{ total: 5_000, netDiff: 0 }]);
    });

    it("computes netDiff in date order even when storage is insertion-ordered", () => {
      const store = createStore();

      store.set(netWorthCategoriesAtom, ["Cash"]);
      store.set(netWorthAtom, [
        { entryDate: "2022-01", amounts: { Cash: 30_000 } },
        { entryDate: "2020-01", amounts: { Cash: 10_000 } },
        { entryDate: "2021-01", amounts: { Cash: 20_000 } },
      ]);

      expect(store.get(netWorthRead)).toEqual([
        { total: 10_000, netDiff: 0 },
        { total: 20_000, netDiff: 10_000 },
        { total: 30_000, netDiff: 10_000 },
      ]);
    });
  });

  describe("syncNetWorthEntryAmounts", () => {
    it("renames, drops removed categories, and defaults new ones to 0", () => {
      const entries = [
        {
          entryDate: "2020-01",
          amounts: { Cash: 100, Old: 50, Keep: 25 },
        },
      ];

      expect(
        syncNetWorthEntryAmounts(entries, [
          { name: "Liquid", previousName: "Cash" },
          { name: "Keep", previousName: "Keep" },
          { name: "New" },
        ]),
      ).toEqual([
        {
          entryDate: "2020-01",
          amounts: { Liquid: 100, Keep: 25, New: 0 },
        },
      ]);
    });
  });

  describe("mergeNetWorthCategoryAmounts", () => {
    it("adds source amounts into the target category across entries", () => {
      const entries = [
        {
          entryDate: "2020-01",
          amounts: { Cash: 100, Investments: 50, Home: 25 },
        },
        {
          entryDate: "2021-01",
          amounts: { Cash: 200, Investments: 75, Home: 10 },
        },
      ];

      expect(
        mergeNetWorthCategoryAmounts(entries, [
          { from: "Home", into: "Investments" },
        ]),
      ).toEqual([
        {
          entryDate: "2020-01",
          amounts: { Cash: 100, Investments: 75 },
        },
        {
          entryDate: "2021-01",
          amounts: { Cash: 200, Investments: 85 },
        },
      ]);
    });

    it("returns entries unchanged when there are no merges", () => {
      const entries = [{ entryDate: "2020-01", amounts: { Cash: 100 } }];

      expect(mergeNetWorthCategoryAmounts(entries, [])).toEqual(entries);
    });

    it("skips invalid merges and still applies valid ones", () => {
      const entries = [
        {
          entryDate: "2020-01",
          amounts: { Cash: 100, Investments: 50 },
        },
      ];

      expect(
        mergeNetWorthCategoryAmounts(entries, [
          { from: "", into: "Investments" },
          { from: "Cash", into: "" },
          { from: "Cash", into: "Cash" },
          { from: "Cash", into: "Investments" },
        ]),
      ).toEqual([
        {
          entryDate: "2020-01",
          amounts: { Investments: 150 },
        },
      ]);
    });
  });
});
