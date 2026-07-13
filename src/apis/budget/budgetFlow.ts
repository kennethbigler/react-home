import { computeTotalPayrollDeductions } from "../../constants/payrollDeductions";
import { buildCategoryTotals } from "./expenses";
import { computeTotalTax } from "./tax";
import {
  BUDGET_MONTHS_PER_YEAR,
  type BudgetCategoryColors,
  type BudgetFlow,
  type BudgetIncome,
  type ExpenseEntry,
} from "./types";

export const getLatestBudgetIncome = (
  salary: number,
  bonus: number,
  stock: number,
  stockAdj: number,
): BudgetIncome => {
  const resolvedStockAdj = stockAdj || stock;

  return {
    salary,
    bonus,
    stockAdj: resolvedStockAdj,
    gross: salary + bonus + resolvedStockAdj,
  };
};

export const buildBudgetFlow = (
  income: BudgetIncome,
  expenseEntries: ExpenseEntry[],
  categoryColors: BudgetCategoryColors = {},
): BudgetFlow => {
  const { federal, state, total: totalTax } = computeTotalTax(income.gross);
  const {
    socialSecurity,
    medicare,
    caDisability,
    total: totalPayrollDeductions,
  } = computeTotalPayrollDeductions(income.gross);
  const totalWithholdings = totalTax + totalPayrollDeductions;
  const categories = buildCategoryTotals(
    expenseEntries,
    income,
    categoryColors,
  );
  const totalAllocated = categories.reduce(
    (sum, category) => sum + category.total,
    0,
  );
  const annualTotalAllocated = totalAllocated * BUDGET_MONTHS_PER_YEAR;
  const net = income.gross - totalWithholdings;
  const unallocated = net - annualTotalAllocated;

  return {
    income,
    federalTax: federal,
    stateTax: state,
    socialSecurity,
    medicare,
    caDisability,
    totalTax,
    totalPayrollDeductions,
    totalWithholdings,
    net,
    categories,
    totalAllocated,
    unallocated,
    isOverAllocated: unallocated < 0,
  };
};
