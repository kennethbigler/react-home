import { describe, expect, it } from "vitest";
import { createStore } from "jotai";
import compCalcAtom, {
  budgetAtom,
  budgetFlowRead,
  compCalcRead,
} from "./finances-atom";
import stockAtom from "./stock-atom";

describe("jotai | finances-atom", () => {
  describe("budgetAtom", () => {
    it("initializes with an empty expense list", () => {
      const store = createStore();

      expect(store.get(budgetAtom)).toEqual([]);
    });

    it("persists expense entries", () => {
      const store = createStore();
      const expenses = [{ name: "Rent", category: "Housing", value: 2000 }];

      store.set(budgetAtom, expenses);

      expect(store.get(budgetAtom)).toEqual(expenses);
    });
  });

  describe("compCalcRead", () => {
    it("returns an empty array when there are no comp entries", () => {
      const store = createStore();

      expect(store.get(compCalcRead)).toEqual([]);
    });

    it("calculates salary-only entries without stock vesting", () => {
      const store = createStore();

      store.set(compCalcAtom, [
        {
          entryDate: "2020-01",
          salary: 100000,
          bonus: 10000,
          stockTick: "AAPL",
          priceThen: 100,
          grantDuration: 4,
          grantQty: 0,
        },
      ]);
      store.set(stockAtom, { AAPL: 150 });

      expect(store.get(compCalcRead)).toEqual([
        {
          stock: 0,
          stockAdj: 0,
          total: 110000,
          totalAdj: 110000,
          netDiff: 0,
          grantThen: 0,
          grantNow: 0,
        },
      ]);
    });

    it("calculates active stock vesting for a single entry", () => {
      const store = createStore();

      store.set(compCalcAtom, [
        {
          entryDate: "2020-01",
          salary: 100000,
          bonus: 0,
          stockTick: "TSLA",
          priceThen: 10,
          grantDuration: 4,
          grantQty: 400,
        },
      ]);
      store.set(stockAtom, { TSLA: 20 });

      expect(store.get(compCalcRead)).toEqual([
        {
          stock: 1000,
          stockAdj: 2000,
          total: 101000,
          totalAdj: 102000,
          netDiff: 0,
          grantThen: 4000,
          grantNow: 8000,
        },
      ]);
    });

    it("uses zero when the stock ticker is missing from stockAtom", () => {
      const store = createStore();

      store.set(compCalcAtom, [
        {
          entryDate: "2021-01",
          salary: 100000,
          bonus: 0,
          stockTick: "UNKNOWN",
          priceThen: 5,
          grantDuration: 4,
          grantQty: 100,
        },
      ]);

      expect(store.get(compCalcRead)).toEqual([
        {
          stock: 125,
          stockAdj: 0,
          total: 100125,
          totalAdj: 100000,
          netDiff: 0,
          grantThen: 500,
          grantNow: 0,
        },
      ]);
    });

    it("accumulates grants for the same stock ticker across entries", () => {
      const store = createStore();

      store.set(compCalcAtom, [
        {
          entryDate: "2020-01",
          salary: 100000,
          bonus: 0,
          stockTick: "TSLA",
          priceThen: 10,
          grantDuration: 4,
          grantQty: 400,
        },
        {
          entryDate: "2021-01",
          salary: 110000,
          bonus: 0,
          stockTick: "TSLA",
          priceThen: 12,
          grantDuration: 4,
          grantQty: 200,
        },
      ]);
      store.set(stockAtom, { TSLA: 20 });

      expect(store.get(compCalcRead)).toEqual([
        {
          stock: 1000,
          stockAdj: 2000,
          total: 101000,
          totalAdj: 102000,
          netDiff: 0,
          grantThen: 4000,
          grantNow: 8000,
        },
        {
          stock: 1800,
          stockAdj: 3000,
          total: 111800,
          totalAdj: 113000,
          netDiff: 11000,
          grantThen: 2400,
          grantNow: 4000,
        },
      ]);
    });

    it("ignores expired grants when calculating stock value", () => {
      const store = createStore();

      store.set(compCalcAtom, [
        {
          entryDate: "2015-01",
          salary: 50000,
          bonus: 0,
          stockTick: "AAPL",
          priceThen: 100,
          grantDuration: 4,
          grantQty: 1000,
        },
        {
          entryDate: "2020-01",
          salary: 80000,
          bonus: 0,
          stockTick: "AAPL",
          priceThen: 120,
          grantDuration: 4,
          grantQty: 0,
        },
      ]);
      store.set(stockAtom, { AAPL: 150 });

      expect(store.get(compCalcRead)).toEqual([
        {
          stock: 25000,
          stockAdj: 37500,
          total: 75000,
          totalAdj: 87500,
          netDiff: 0,
          grantThen: 100000,
          grantNow: 150000,
        },
        {
          stock: 0,
          stockAdj: 0,
          total: 80000,
          totalAdj: 80000,
          netDiff: -7500,
          grantThen: 0,
          grantNow: 0,
        },
      ]);
    });
  });

  describe("budgetFlowRead", () => {
    it("returns hasCompData false when there are no comp entries", () => {
      const store = createStore();

      expect(store.get(budgetFlowRead)).toEqual({
        hasCompData: false,
        flow: null,
        expenseEntries: [],
        categoryColors: {},
      });
    });

    it("builds budget flow from the latest comp entry and expenses", () => {
      const store = createStore();

      store.set(compCalcAtom, [
        {
          entryDate: "2020-01",
          salary: 100_000,
          bonus: 10_000,
          stockTick: "AAPL",
          priceThen: 100,
          grantDuration: 4,
          grantQty: 0,
        },
      ]);
      store.set(budgetAtom, [
        { name: "Rent", category: "Housing", value: 2000 },
        {
          name: "401k",
          category: "Retirement",
          value: 9,
          valueMode: "percent",
          percentSources: ["salary"],
        },
      ]);

      const result = store.get(budgetFlowRead);

      expect(result.hasCompData).toBe(true);
      expect(result.flow?.income.gross).toBe(110_000);
      expect(result.flow?.categories).toHaveLength(2);
      expect(
        result.flow?.categories.find((c) => c.heading === "Retirement")?.total,
      ).toBe(750);
    });
  });
});
