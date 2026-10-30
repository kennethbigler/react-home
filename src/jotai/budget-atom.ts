import { atom } from "jotai";
import compCalcAtom, { compCalcRead } from "./comp-calc-atom";
import persistentAtom from "./storage";
import sortByEntryDate from "../apis/sortByEntryDate";
import {
  buildBudgetFlow,
  buildRecommendedTotals,
  getLatestBudgetIncome,
  mergeBudgetCategories,
  type BudgetCategory,
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
export const budgetCategoriesAtom = persistentAtom<BudgetCategory[]>(
  "budgetCategoriesAtom",
  [],
);
export const recommendedBudgetViewAtom = persistentAtom<boolean>(
  "recommendedBudgetViewAtom",
  false,
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

/** Defined categories plus any legacy free-text expense categories. */
export const budgetCategoryListRead = atom((get) =>
  mergeBudgetCategories(get(budgetCategoriesAtom), get(budgetAtom)),
);
budgetCategoryListRead.debugLabel = "budgetCategoryListRead";

/** Budget flow regrouped into recommended buckets when the toggle is on. */
export const budgetDisplayFlowRead = atom((get) => {
  const budgetFlow = get(budgetFlowRead);
  const recommended = get(recommendedBudgetViewAtom);

  if (!recommended || !budgetFlow.flow) {
    return { ...budgetFlow, recommended: false as const };
  }

  const categories = buildRecommendedTotals(
    budgetFlow.flow.categories,
    get(budgetCategoryListRead),
    budgetFlow.flow.net,
  );

  return {
    ...budgetFlow,
    recommended: true as const,
    flow: { ...budgetFlow.flow, categories },
  };
});
budgetDisplayFlowRead.debugLabel = "budgetDisplayFlowRead";
