import { FEDERAL_TAX_LABEL } from "../../../../../constants/federalTaxBrackets";
import { STATE_TAX_LABEL } from "../../../../../constants/caStateTaxBrackets";
import type { ExpenseEntryColor } from "../../../../../apis/budget";

export const PAYROLL_CATEGORY_KEY = "payroll";

export const BUDGET_WITHHOLDING_NODE_LABELS = [
  FEDERAL_TAX_LABEL,
  STATE_TAX_LABEL,
] as const;

export const GROSS_INCOME_NODE = "Income";
export const UNALLOCATED_NODE = "Unallocated";

export const INCOME_NODE_LABELS = {
  salary: "Salary",
  bonus: "Bonus",
  stockAdj: "Stock",
  partnerSalary: "P Salary",
  partnerBonus: "P Bonus",
  partnerStockAdj: "P Stock",
} as const;

export interface PiePoint {
  name: string;
  y: number;
  color?: string;
}

interface SankeyNode {
  id: string;
  column?: number;
  color?: string;
}

interface SankeyLink {
  from: string;
  to: string;
  weight: number;
}

export interface BudgetSankeyData {
  nodes: SankeyNode[];
  data: SankeyLink[];
}

export interface BudgetSankeyNodeColors {
  salary: string;
  bonus: string;
  stockAdj: string;
  partnerSalary: string;
  partnerBonus: string;
  partnerStockAdj: string;
  gross: string;
  federalTax: string;
  stateTax: string;
  payroll: string;
  unallocated: string;
  category: (categoryKey: string, color?: ExpenseEntryColor) => string;
}
