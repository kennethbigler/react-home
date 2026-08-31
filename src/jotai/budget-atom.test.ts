import { describe, expect, it } from "vitest";
import { createStore } from "jotai";
import compCalcAtom from "./comp-calc-atom";
import getHydratedAtomValue from "../test-utils/getHydratedAtomValue";
import {
  budgetAtom,
  budgetFlowRead,
  filingJointlyAtom,
  itemizeDeductionsAtom,
  itemizedDeductionAtom,
  partnerIncomeAtom,
} from "./budget-atom";

describe("jotai | budget-atom", () => {
  describe("budgetAtom", () => {
    it("initializes with an empty expense list", () => {
      const store = createStore();

      expect(store.get(budgetAtom)).toEqual([]);
    });

    it("persists expense entries", () => {
      localStorage.clear();
      const expenses = [{ name: "Rent", category: "Housing", value: 2000 }];

      createStore().set(budgetAtom, expenses);

      expect(getHydratedAtomValue(budgetAtom)).toEqual(expenses);
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

      expect(getHydratedAtomValue(filingJointlyAtom)).toBe(true);
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

      expect(getHydratedAtomValue(partnerIncomeAtom)).toEqual(income);
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

      expect(getHydratedAtomValue(itemizeDeductionsAtom)).toBe(true);
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

      expect(getHydratedAtomValue(itemizedDeductionAtom)).toBe(25_000);
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

      // Same combined $187k gross as the joint case; only filing status differs.
      const singleStore = createStore();
      singleStore.set(filingJointlyAtom, false);
      singleStore.set(compCalcAtom, [
        {
          entryDate: "2020-01",
          salary: 187_000,
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
      expect(single?.income.gross).toBe(187_000);
      expect(joint?.income.partnerSalary).toBe(80_000);
      expect(Number.isFinite(joint?.federalTax)).toBe(true);
      expect(Number.isFinite(single?.federalTax)).toBe(true);
      expect(joint!.federalTax).toBeLessThan(single!.federalTax);
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

      const withItemizeOffTax = store.get(budgetFlowRead).flow?.totalTax;

      const standardStore = createStore();
      standardStore.set(itemizeDeductionsAtom, false);
      standardStore.set(itemizedDeductionAtom, 0);
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
      const standardTax = standardStore.get(budgetFlowRead).flow?.totalTax;

      expect(Number.isFinite(withItemizeOffTax)).toBe(true);
      expect(Number.isFinite(standardTax)).toBe(true);
      expect(withItemizeOffTax).toBe(standardTax);
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

      const itemizedTax = store.get(budgetFlowRead).flow?.totalTax;

      const standardStore = createStore();
      standardStore.set(itemizeDeductionsAtom, false);
      standardStore.set(itemizedDeductionAtom, 0);
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
      const standardTax = standardStore.get(budgetFlowRead).flow?.totalTax;

      expect(Number.isFinite(itemizedTax)).toBe(true);
      expect(Number.isFinite(standardTax)).toBe(true);
      expect(itemizedTax!).toBeLessThan(standardTax!);
    });
  });
});
