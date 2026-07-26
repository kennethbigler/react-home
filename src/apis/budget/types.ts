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
export type ExpensePercentSource =
  | "salary"
  | "bonus"
  | "stockAdj"
  | "partnerSalary"
  | "partnerBonus"
  | "partnerStockAdj";
export type ExpenseTaxBasis = "pretax" | "posttax";

export type TaxFilingStatus = "single" | "mfj";

export interface ExpenseEntry {
  name: string;
  category: string;
  value: number;
  valueMode?: ExpenseValueMode;
  /** @deprecated use percentSources */
  percentSource?: ExpensePercentSource;
  percentSources?: ExpensePercentSource[];
  /** Defaults to post-tax; pre-tax percent uses gross income sources. */
  taxBasis?: ExpenseTaxBasis;
}

/** Budget expenses are monthly; comp calculator income and taxes are annual. */
export const BUDGET_MONTHS_PER_YEAR = 12;

export interface PartnerIncomeInput {
  salary: number;
  bonus: number;
  stock: number;
}

export interface BudgetIncome {
  salary: number;
  bonus: number;
  stockAdj: number;
  partnerSalary: number;
  partnerBonus: number;
  partnerStockAdj: number;
  gross: number;
}

export interface ResolvedExpense {
  expenseEntry: ExpenseEntry;
  index: number;
  resolvedAmount: number;
}

export interface CategoryTotal {
  categoryKey: string;
  heading: string;
  total: number;
  color?: ExpenseEntryColor;
  items: ResolvedExpense[];
}

export interface BudgetFlow {
  income: BudgetIncome;
  federalTax: number;
  stateTax: number;
  socialSecurity: number;
  medicare: number;
  caDisability: number;
  totalTax: number;
  totalPayrollDeductions: number;
  totalWithholdings: number;
  net: number;
  categories: CategoryTotal[];
  totalAllocated: number;
  unallocated: number;
  isOverAllocated: boolean;
}
