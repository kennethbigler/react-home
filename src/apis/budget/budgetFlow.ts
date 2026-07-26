import { computeTotalPayrollDeductions } from "../../constants/payrollDeductions";
import { buildCategoryTotals } from "./expenses";
import { computeTotalTax } from "./tax";
import {
  BUDGET_MONTHS_PER_YEAR,
  type BudgetCategoryColors,
  type BudgetFlow,
  type BudgetIncome,
  type ExpenseEntry,
  type PartnerIncomeInput,
  type TaxFilingStatus,
} from "./types";

export const getLatestBudgetIncome = (
  salary: number,
  bonus: number,
  stock: number,
  stockAdj: number,
  partner?: PartnerIncomeInput,
): BudgetIncome => {
  const resolvedStockAdj = stockAdj || stock;
  const partnerSalary = partner?.salary ?? 0;
  const partnerBonus = partner?.bonus ?? 0;
  const partnerStockAdj = partner?.stock ?? 0;

  return {
    salary,
    bonus,
    stockAdj: resolvedStockAdj,
    partnerSalary,
    partnerBonus,
    partnerStockAdj,
    gross:
      salary +
      bonus +
      resolvedStockAdj +
      partnerSalary +
      partnerBonus +
      partnerStockAdj,
  };
};

const getPrimaryWages = (income: BudgetIncome): number =>
  income.salary + income.bonus + income.stockAdj;

const getPartnerWages = (income: BudgetIncome): number =>
  income.partnerSalary + income.partnerBonus + income.partnerStockAdj;

export const buildBudgetFlow = (
  income: BudgetIncome,
  expenseEntries: ExpenseEntry[],
  categoryColors: BudgetCategoryColors = {},
  filingStatus: TaxFilingStatus = "single",
  itemizedDeduction?: number,
): BudgetFlow => {
  const {
    federal,
    state,
    total: totalTax,
  } = computeTotalTax(income.gross, filingStatus, itemizedDeduction);
  const primaryPayroll = computeTotalPayrollDeductions(getPrimaryWages(income));
  const partnerPayroll = computeTotalPayrollDeductions(getPartnerWages(income));
  const socialSecurity =
    primaryPayroll.socialSecurity + partnerPayroll.socialSecurity;
  const medicare = primaryPayroll.medicare + partnerPayroll.medicare;
  const caDisability =
    primaryPayroll.caDisability + partnerPayroll.caDisability;
  const totalPayrollDeductions = primaryPayroll.total + partnerPayroll.total;
  const totalWithholdings = totalTax + totalPayrollDeductions;
  const net = income.gross - totalWithholdings;
  const categories = buildCategoryTotals(
    expenseEntries,
    income,
    categoryColors,
    net,
  );
  const totalAllocated = categories.reduce(
    (sum, category) => sum + category.total,
    0,
  );
  const annualTotalAllocated = totalAllocated * BUDGET_MONTHS_PER_YEAR;
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
