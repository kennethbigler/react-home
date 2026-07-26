import { describe, expect, it } from "vitest";
import { createStore, type Atom } from "jotai";
import compCalcAtom, {
  budgetAtom,
  budgetFlowRead,
  compCalcRead,
  filingJointlyAtom,
  itemizeDeductionsAtom,
  itemizedDeductionAtom,
  mergeNetWorthCategoryAmounts,
  netWorthAtom,
  netWorthCategoriesAtom,
  netWorthRead,
  partnerIncomeAtom,
  sortNetWorthEntriesByDate,
  syncNetWorthEntryAmounts,
} from "./finances-atom";
import stockAtom from "./stock-atom";

/** Read atomWithStorage via onMount so a fresh store hydrates from localStorage. */
const getHydrated = <Value>(anAtom: Atom<Value>): Value => {
  const store = createStore();
  const unsub = store.sub(anAtom, () => {});
  try {
    return store.get(anAtom);
  } finally {
    unsub();
  }
};

describe("jotai | finances-atom", () => {
  describe("budgetAtom", () => {
    it("initializes with an empty expense list", () => {
      const store = createStore();

      expect(store.get(budgetAtom)).toEqual([]);
    });

    it("persists expense entries", () => {
      localStorage.clear();
      const expenses = [{ name: "Rent", category: "Housing", value: 2000 }];

      createStore().set(budgetAtom, expenses);

      expect(getHydrated(budgetAtom)).toEqual(expenses);
    });
  });

  describe("filingJointlyAtom", () => {
    it("initializes to false", () => {
      const store = createStore();

      expect(store.get(filingJointlyAtom)).toBe(false);
    });

    it("persists filing jointly preference", () => {
      localStorage.clear();

      createStore().set(filingJointlyAtom, true);

      expect(getHydrated(filingJointlyAtom)).toBe(true);
    });
  });

  describe("partnerIncomeAtom", () => {
    it("initializes with zero salary, bonus, and stock", () => {
      const store = createStore();

      expect(store.get(partnerIncomeAtom)).toEqual({
        salary: 0,
        bonus: 0,
        stock: 0,
      });
    });

    it("persists partner income", () => {
      localStorage.clear();
      const income = { salary: 80_000, bonus: 5_000, stock: 1_000 };

      createStore().set(partnerIncomeAtom, income);

      expect(getHydrated(partnerIncomeAtom)).toEqual(income);
    });
  });

  describe("itemizeDeductionsAtom", () => {
    it("initializes to false", () => {
      const store = createStore();

      expect(store.get(itemizeDeductionsAtom)).toBe(false);
    });

    it("persists itemize deductions preference", () => {
      localStorage.clear();

      createStore().set(itemizeDeductionsAtom, true);

      expect(getHydrated(itemizeDeductionsAtom)).toBe(true);
    });
  });

  describe("itemizedDeductionAtom", () => {
    it("initializes to zero", () => {
      const store = createStore();

      expect(store.get(itemizedDeductionAtom)).toBe(0);
    });

    it("persists itemized deduction amount", () => {
      localStorage.clear();

      createStore().set(itemizedDeductionAtom, 25_000);

      expect(getHydrated(itemizedDeductionAtom)).toBe(25_000);
    });
  });

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
          taxBasis: "pretax",
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

    it("uses the latest dated comp entry instead of the last inserted entry", () => {
      const store = createStore();

      store.set(compCalcAtom, [
        {
          entryDate: "2022-01",
          salary: 200_000,
          bonus: 20_000,
          stockTick: "",
          priceThen: 0,
          grantDuration: 4,
          grantQty: 0,
        },
        {
          entryDate: "2020-01",
          salary: 100_000,
          bonus: 10_000,
          stockTick: "",
          priceThen: 0,
          grantDuration: 4,
          grantQty: 0,
        },
      ]);

      expect(store.get(budgetFlowRead).flow?.income.gross).toBe(220_000);
    });

    it("includes partner income and MFJ tax when filing jointly", () => {
      const store = createStore();

      store.set(compCalcAtom, [
        {
          entryDate: "2020-01",
          salary: 100_000,
          bonus: 0,
          stockTick: "",
          priceThen: 0,
          grantDuration: 4,
          grantQty: 0,
        },
      ]);
      store.set(filingJointlyAtom, true);
      store.set(partnerIncomeAtom, {
        salary: 80_000,
        bonus: 5_000,
        stock: 2_000,
      });

      const singleStore = createStore();
      singleStore.set(compCalcAtom, [
        {
          entryDate: "2020-01",
          salary: 100_000,
          bonus: 0,
          stockTick: "",
          priceThen: 0,
          grantDuration: 4,
          grantQty: 0,
        },
      ]);

      const joint = store.get(budgetFlowRead).flow;
      const single = singleStore.get(budgetFlowRead).flow;

      expect(joint?.income.gross).toBe(187_000);
      expect(joint?.income.partnerSalary).toBe(80_000);
      expect(joint?.totalTax).toBeDefined();
      expect(single?.totalTax).toBeDefined();
      // Combined 187k MFJ tax should differ from 100k single (not a simple sum).
      expect(joint?.federalTax).not.toBe(single?.federalTax);
    });

    it("uses standard deduction when itemize is off", () => {
      const store = createStore();

      store.set(compCalcAtom, [
        {
          entryDate: "2020-01",
          salary: 150_000,
          bonus: 0,
          stockTick: "",
          priceThen: 0,
          grantDuration: 4,
          grantQty: 0,
        },
      ]);
      store.set(itemizeDeductionsAtom, false);
      store.set(itemizedDeductionAtom, 50_000);

      const withItemizeOff = store.get(budgetFlowRead).flow;

      const standardStore = createStore();
      standardStore.set(compCalcAtom, [
        {
          entryDate: "2020-01",
          salary: 150_000,
          bonus: 0,
          stockTick: "",
          priceThen: 0,
          grantDuration: 4,
          grantQty: 0,
        },
      ]);

      expect(withItemizeOff?.totalTax).toBe(
        standardStore.get(budgetFlowRead).flow?.totalTax,
      );
    });

    it("uses itemized deduction when itemize is on", () => {
      const store = createStore();

      store.set(compCalcAtom, [
        {
          entryDate: "2020-01",
          salary: 150_000,
          bonus: 0,
          stockTick: "",
          priceThen: 0,
          grantDuration: 4,
          grantQty: 0,
        },
      ]);
      store.set(itemizeDeductionsAtom, true);
      store.set(itemizedDeductionAtom, 50_000);

      const itemized = store.get(budgetFlowRead).flow;

      const standardStore = createStore();
      standardStore.set(compCalcAtom, [
        {
          entryDate: "2020-01",
          salary: 150_000,
          bonus: 0,
          stockTick: "",
          priceThen: 0,
          grantDuration: 4,
          grantQty: 0,
        },
      ]);

      expect(itemized?.totalTax).toBeLessThan(
        standardStore.get(budgetFlowRead).flow?.totalTax ?? Infinity,
      );
    });
  });

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

  describe("sortNetWorthEntriesByDate", () => {
    it("sorts ascending by entryDate", () => {
      expect(
        sortNetWorthEntriesByDate([
          { entryDate: "2022-01", amounts: { Cash: 3 } },
          { entryDate: "2020-01", amounts: { Cash: 1 } },
          { entryDate: "2021-06", amounts: { Cash: 2 } },
        ]).map(({ entryDate }) => entryDate),
      ).toEqual(["2020-01", "2021-06", "2022-01"]);
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
