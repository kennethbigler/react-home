import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import stockAtom from "./stock-atom";
import dateHelper, { DateObj } from "../apis/DateHelper";
import {
  buildBudgetFlow,
  getLatestBudgetIncome,
  type BudgetCategoryColors,
  type ExpenseEntry,
  type ExpenseEntryColor,
  type ExpensePercentSource,
  type ExpenseTaxBasis,
  type ExpenseValueMode,
  expenseEntryColors,
} from "../apis/budget";

/* --------------------     Types and constants     -------------------- */

export type {
  BudgetCategoryColors,
  ExpenseEntry,
  ExpenseEntryColor,
  ExpensePercentSource,
  ExpenseTaxBasis,
  ExpenseValueMode,
};

export { expenseEntryColors };

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

export interface NetWorthEntry {
  entryDate: string;
  amounts: Record<string, number>;
}

export interface NetWorthCalcEntry {
  total: number;
  netDiff: number;
}

interface PrevStock {
  grantQty: number;
  grantDuration: number;
  exp: DateObj;
}

/* --------------------     Atoms     -------------------- */

const compCalcAtom = atomWithStorage<CompEntry[]>("compCalcAtom", []);
export const budgetAtom = atomWithStorage<ExpenseEntry[]>("budgetAtom", []);
export const budgetCategoryColorsAtom = atomWithStorage<BudgetCategoryColors>(
  "budgetCategoryColorsAtom",
  {},
);
export const netWorthCategoriesAtom = atomWithStorage<string[]>(
  "netWorthCategoriesAtom",
  [],
);
export const netWorthAtom = atomWithStorage<NetWorthEntry[]>(
  "netWorthAtom",
  [],
);

/* --------------------     Comp Calc State     -------------------- */
export const compCalcRead = atom((get) => {
  // access state
  const compEntries = get(compCalcAtom);
  const stockEntries = get(stockAtom);

  const latestPriceByTicker: { [key: string]: number } = {};
  compEntries.forEach(({ stockTick, priceThen }) => {
    if (stockTick) {
      latestPriceByTicker[stockTick] = priceThen;
    }
  });

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
        const priceNow =
          stockEntries[stockTick] || latestPriceByTicker[stockTick] || 0;
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

/* --------------------     Net Worth State     -------------------- */
export const mergeNetWorthCategoryAmounts = (
  entries: NetWorthEntry[],
  merges: { from: string; into: string }[],
): NetWorthEntry[] => {
  if (merges.length === 0) {
    return entries;
  }

  return entries.map((entry) => {
    const amounts = { ...entry.amounts };
    merges.forEach(({ from, into }) => {
      if (!from || !into || from === into) {
        return;
      }
      amounts[into] = (amounts[into] ?? 0) + (amounts[from] ?? 0);
      delete amounts[from];
    });
    return { ...entry, amounts };
  });
};

export const syncNetWorthEntryAmounts = (
  entries: NetWorthEntry[],
  categoryMappings: { name: string; previousName?: string }[],
): NetWorthEntry[] =>
  entries.map((entry) => {
    const amounts: Record<string, number> = {};
    categoryMappings.forEach(({ name, previousName }) => {
      if (
        previousName !== undefined &&
        entry.amounts[previousName] !== undefined
      ) {
        amounts[name] = entry.amounts[previousName];
      } else {
        amounts[name] = entry.amounts[name] ?? 0;
      }
    });
    return { ...entry, amounts };
  });

export const netWorthRead = atom((get) => {
  const entries = get(netWorthAtom);
  const categories = get(netWorthCategoriesAtom);

  const withTotals = entries.map((entry) => ({
    total: categories.reduce((sum, cat) => sum + (entry.amounts[cat] ?? 0), 0),
  }));

  return withTotals.map(
    ({ total }, i): NetWorthCalcEntry => ({
      total,
      netDiff: i === 0 ? 0 : total - withTotals[i - 1].total,
    }),
  );
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
