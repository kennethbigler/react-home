import { describe, expect, it } from "vitest";
import { createStore } from "jotai";
import compCalcAtom, { compCalcRead } from "./comp-calc-atom";
import stockAtom from "./stock-atom";

describe("jotai | comp-calc-atom", () => {
  describe("compCalcRead", () => {
    it("returns an empty array when there are no comp entries", () => {
      const store = createStore();

      expect(store.get(compCalcRead)).toEqual([]);
    });

    it("ignores invalid zero-duration grants without producing non-finite totals", () => {
      const store = createStore();

      store.set(compCalcAtom, [
        {
          entryDate: "2020-01",
          salary: 100_000,
          bonus: 0,
          stockTick: "AAPL",
          priceThen: 10,
          grantDuration: 0,
          grantQty: 100,
        },
      ]);

      const [result] = store.get(compCalcRead);
      expect(result.stock).toBe(0);
      expect(result.stockAdj).toBe(0);
      expect(Number.isFinite(result.total)).toBe(true);
      expect(Number.isFinite(result.totalAdj)).toBe(true);
    });

    it("calculates entries and net differences in chronological order", () => {
      const store = createStore();

      store.set(compCalcAtom, [
        {
          entryDate: "2022-01",
          salary: 300_000,
          bonus: 0,
          stockTick: "",
          priceThen: 0,
          grantDuration: 4,
          grantQty: 0,
        },
        {
          entryDate: "2020-01",
          salary: 100_000,
          bonus: 0,
          stockTick: "",
          priceThen: 0,
          grantDuration: 4,
          grantQty: 0,
        },
        {
          entryDate: "2021-01",
          salary: 200_000,
          bonus: 0,
          stockTick: "",
          priceThen: 0,
          grantDuration: 4,
          grantQty: 0,
        },
      ]);

      expect(
        store
          .get(compCalcRead)
          .map(({ total, netDiff }) => ({ total, netDiff })),
      ).toEqual([
        { total: 100_000, netDiff: 0 },
        { total: 200_000, netDiff: 100_000 },
        { total: 300_000, netDiff: 100_000 },
      ]);
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

    it("falls back to the latest entry price when stockAtom has no ticker", () => {
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
          stockAdj: 125,
          total: 100125,
          totalAdj: 100125,
          netDiff: 0,
          grantThen: 500,
          grantNow: 500,
        },
      ]);
    });

    it("uses the latest matching ticker priceThen when stockAtom is empty", () => {
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

      expect(store.get(compCalcRead)).toEqual([
        {
          stock: 1000,
          stockAdj: 1200,
          total: 101000,
          totalAdj: 101200,
          netDiff: 0,
          grantThen: 4000,
          grantNow: 4800,
        },
        {
          stock: 1800,
          stockAdj: 1800,
          total: 111800,
          totalAdj: 111800,
          netDiff: 10600,
          grantThen: 2400,
          grantNow: 2400,
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
});
