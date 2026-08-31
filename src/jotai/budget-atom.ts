import { atom } from "jotai";
import compCalcAtom, { compCalcRead } from "./comp-calc-atom";
import persistentAtom from "./storage";
import sortByEntryDate from "../apis/sortByEntryDate";
import {
  buildBudgetFlow,
  getLatestBudgetIncome,
  type BudgetCategoryColors,
  type ExpenseEntry,
} from "../apis/budget";

export interface PartnerIncome {
  salary: number;
  bonus: number;
  stock: number;
}

export const budgetAtom = persistentAtom<ExpenseEntry[]>("budgetAtom", []);
export const budgetCategoryColorsAtom = persistentAtom<BudgetCategoryColors>(
  "budgetCategoryColorsAtom",
  {},
);
export const filingJointlyAtom = persistentAtom<boolean>(
  "filingJointlyAtom",
  false,
);
export const partnerIncomeAtom = persistentAtom<PartnerIncome>(
  "partnerIncomeAtom",
  { salary: 0, bonus: 0, stock: 0 },
);
export const itemizeDeductionsAtom = persistentAtom<boolean>(
  "itemizeDeductionsAtom",
  false,
);
export const itemizedDeductionAtom = persistentAtom<number>(
  "itemizedDeductionAtom",
  0,
);

export const budgetFlowRead = atom((get) => {
  const compCalcEntries = get(compCalcRead);
  const compEntries = sortByEntryDate(get(compCalcAtom));
  const expenseEntries = get(budgetAtom);
  const categoryColors = get(budgetCategoryColorsAtom);
  const filingJointly = get(filingJointlyAtom);
  const partnerIncome = get(partnerIncomeAtom);
  const itemizeDeductions = get(itemizeDeductionsAtom);
  const itemizedDeduction = get(itemizedDeductionAtom);

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
    filingJointly ? partnerIncome : undefined,
  );
  const flow = buildBudgetFlow(
    income,
    expenseEntries,
    categoryColors,
    filingJointly ? "mfj" : "single",
    itemizeDeductions ? itemizedDeduction : undefined,
  );

  return {
    hasCompData: true as const,
    flow,
    expenseEntries,
    categoryColors,
  };
});
budgetFlowRead.debugLabel = "budgetFlowRead";
