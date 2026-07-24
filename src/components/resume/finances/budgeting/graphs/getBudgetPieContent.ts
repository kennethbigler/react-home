import type { Theme } from "@mui/material/styles";
import type {
  BudgetFlow,
  CategoryTotal,
  ExpenseEntry,
  ExpenseEntryColor,
} from "../../../../../apis/budget";
import {
  colorizeBreakdownPieData,
  colorizeIncomeOverviewPieData,
} from "./chartColors";
import {
  buildExpensePieData,
  buildIncomeOverviewPieData,
  buildPayrollPieData,
  PAYROLL_CATEGORY_KEY,
  type PiePoint,
} from "./chartData";

export interface BudgetPieContent {
  title: string;
  data: PiePoint[];
}

export const getBudgetPieContent = (
  flow: BudgetFlow,
  categories: CategoryTotal[],
  selectedCategoryKey: string | null,
  expenseEntries: ExpenseEntry[],
  categoryColors: Partial<Record<string, ExpenseEntryColor>>,
  theme: Theme,
  hideTaxes = false,
): BudgetPieContent => {
  if (selectedCategoryKey === PAYROLL_CATEGORY_KEY) {
    return {
      title: "Payroll Breakdown",
      data: colorizeBreakdownPieData(theme, "error", buildPayrollPieData(flow)),
    };
  }

  if (selectedCategoryKey) {
    const selectedCategory = categories.find(
      ({ categoryKey }) => categoryKey === selectedCategoryKey,
    );
    const data = buildExpensePieData(
      selectedCategoryKey,
      expenseEntries,
      flow.income,
      flow.net,
    );

    return {
      title: selectedCategory
        ? `${selectedCategory.heading} Breakdown`
        : "Category Breakdown",
      data: colorizeBreakdownPieData(
        theme,
        selectedCategory?.color ?? categoryColors[selectedCategoryKey],
        data,
      ),
    };
  }

  return {
    title: "Income Overview",
    data: colorizeIncomeOverviewPieData(
      theme,
      categories,
      buildIncomeOverviewPieData(flow, { hideTaxes }),
    ),
  };
};
