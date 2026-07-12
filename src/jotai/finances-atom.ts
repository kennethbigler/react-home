import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import stockAtom from "./stock-atom";
import dateHelper, { DateObj } from "../apis/DateHelper";
import {
  buildBudgetFlow,
  getLatestBudgetIncome,
} from "../components/resume/finances/budgeting/helpers";

/* --------------------     Types and constants     -------------------- */

export interface CompEntry {
  entryDate: string;
  salary: number;
  bonus: number;
  stockTick: string;
  priceThen: number;
  grantDuration: number; // YEARS
  grantQty: number; // STOCKS
}

export interface CompCalcEntry {
  stock: number;
  stockAdj: number;
  total: number;
  totalAdj: number;
  netDiff: number;
  grantThen: number;
  grantNow: number;
}

interface PrevStock {
  grantQty: number;
  grantDuration: number;
  exp: DateObj;
}

export const expenseEntryColors = [
  "success",
  "info",
  "warning",
  "error",
  "primary",
  "secondary",
] as const;

export type ExpenseEntryColor = (typeof expenseEntryColors)[number];

export type BudgetCategoryColors = Partial<Record<string, ExpenseEntryColor>>;

export type ExpenseValueMode = "dollar" | "percent";
export type ExpensePercentSource = "salary" | "bonus" | "stockAdj";

export interface ExpenseEntry {
  name: string;
  category: string;
  value: number;
  valueMode?: ExpenseValueMode;
  /** @deprecated use percentSources */
  percentSource?: ExpensePercentSource;
  percentSources?: ExpensePercentSource[];
}

/* --------------------     Atoms     -------------------- */

const compCalcAtom = atomWithStorage<CompEntry[]>("compCalcAtom", []);
export const budgetAtom = atomWithStorage<ExpenseEntry[]>("budgetAtom", []);
export const budgetCategoryColorsAtom = atomWithStorage<BudgetCategoryColors>(
  "budgetCategoryColorsAtom",
  {},
);

/* --------------------     Comp Calc State     -------------------- */
export const compCalcRead = atom((get) => {
  // access state
  const compEntries = get(compCalcAtom);
  const stockEntries = get(stockAtom);

  const prevStockAcc: { [key: string]: PrevStock[] } = {};

  const compCalcEntriesNoNet: Omit<CompCalcEntry, "netDiff">[] =
    compEntries.map(
      ({
        bonus,
        entryDate,
        grantDuration,
        grantQty,
        priceThen,
        salary,
        stockTick,
      }) => {
        const priceNow = stockEntries[stockTick] || 0;
        let stock = 0;
        let stockAdj = 0;

        const exp = dateHelper(entryDate);
        exp.year += grantDuration;

        if (!prevStockAcc[stockTick]) {
          prevStockAcc[stockTick] = [];
        }
        if (grantQty > 0) {
          prevStockAcc[stockTick].push({ grantQty, grantDuration, exp });
        }
        prevStockAcc[stockTick].forEach((s) => {
          if (dateHelper(entryDate).diff(s.exp, "days") < 0) {
            stock += (priceThen * s.grantQty) / s.grantDuration;
            stockAdj += (priceNow * s.grantQty) / s.grantDuration;
          }
        });

        const total = salary + bonus + stock;
        const totalAdj = salary + bonus + stockAdj;
        const grantThen = priceThen * grantQty;
        const grantNow = priceNow * grantQty;

        return {
          stock,
          stockAdj,
          total,
          totalAdj,
          grantThen,
          grantNow,
        };
      },
    );

  const compCalcEntries: CompCalcEntry[] = compCalcEntriesNoNet.map(
    ({ totalAdj, ...rest }, i) => {
      const netDiff =
        i === 0 ? 0 : totalAdj - compCalcEntriesNoNet[i - 1].totalAdj;

      return { totalAdj, netDiff, ...rest };
    },
  );

  return compCalcEntries;
});

/* --------------------     Budget Flow State     -------------------- */
export const budgetFlowRead = atom((get) => {
  const compCalcEntries = get(compCalcRead);
  const compEntries = get(compCalcAtom);
  const expenseEntries = get(budgetAtom);
  const categoryColors = get(budgetCategoryColorsAtom);

  if (compEntries.length === 0 || compCalcEntries.length === 0) {
    return {
      hasCompData: false as const,
      flow: null,
      expenseEntries,
      categoryColors,
    };
  }

  const latestCompEntry = compEntries[compEntries.length - 1];
  const latestCompCalcEntry = compCalcEntries[compCalcEntries.length - 1];
  const income = getLatestBudgetIncome(
    latestCompEntry.salary,
    latestCompEntry.bonus,
    latestCompCalcEntry.stock,
    latestCompCalcEntry.stockAdj,
  );
  const flow = buildBudgetFlow(income, expenseEntries, categoryColors);

  return {
    hasCompData: true as const,
    flow,
    expenseEntries,
    categoryColors,
  };
});

/* --------------------     Export     -------------------- */

export default compCalcAtom;
