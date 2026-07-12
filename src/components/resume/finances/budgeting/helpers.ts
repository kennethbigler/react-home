import {
  CA_MENTAL_HEALTH_SURCHARGE,
  CA_STANDARD_DEDUCTION,
  caStateTaxBrackets,
  STATE_TAX_LABEL,
} from "../../../../constants/caStateTaxBrackets";
import {
  FEDERAL_STANDARD_DEDUCTION,
  FEDERAL_TAX_LABEL,
  federalTaxBrackets,
} from "../../../../constants/federalTaxBrackets";
import {
  CA_DISABILITY_LABEL,
  computeTotalPayrollDeductions,
  MEDICARE_LABEL,
  PAYROLL_NODE_LABEL,
  SOCIAL_SECURITY_LABEL,
} from "../../../../constants/payrollDeductions";
import { computeProgressiveTax } from "../../../../constants/taxHelpers";
import type {
  BudgetCategoryColors,
  ExpenseEntry,
  ExpenseEntryColor,
  ExpensePercentSource,
} from "../../../../jotai/finances-atom";

export const PAYROLL_CATEGORY_KEY = "payroll";

export const BUDGET_WITHHOLDING_NODE_LABELS = [
  FEDERAL_TAX_LABEL,
  STATE_TAX_LABEL,
] as const;

export const GROSS_INCOME_NODE = "Income";
export const UNALLOCATED_NODE = "Unallocated";

/** Budget expenses are monthly; comp calculator income and taxes are annual. */
const BUDGET_MONTHS_PER_YEAR = 12;

export const INCOME_NODE_LABELS = {
  salary: "Salary",
  bonus: "Bonus",
  stockAdj: "Stock Adj",
} as const;

export interface BudgetIncome {
  salary: number;
  bonus: number;
  stockAdj: number;
  gross: number;
}

interface ResolvedExpense {
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

const normalizeCategoryKey = (category: string) =>
  category.trim().toLowerCase();

const categoryHeading = (category: string) =>
  category.trim().toUpperCase() || "UNCATEGORIZED";

/** Federal and CA taxes are computed independently (visualization approximation). */
export const computeFederalTax = (grossIncome: number): number =>
  computeProgressiveTax(
    grossIncome,
    FEDERAL_STANDARD_DEDUCTION,
    federalTaxBrackets,
  );

export const computeCaliforniaTax = (grossIncome: number): number =>
  computeProgressiveTax(
    grossIncome,
    CA_STANDARD_DEDUCTION,
    caStateTaxBrackets,
    CA_MENTAL_HEALTH_SURCHARGE,
  );

export const computeTotalTax = (grossIncome: number) => {
  const federal = computeFederalTax(grossIncome);
  const state = computeCaliforniaTax(grossIncome);

  return { federal, state, total: federal + state };
};

export const resolveExpenseAmount = (
  entry: ExpenseEntry,
  income: BudgetIncome,
): number => {
  const valueMode = entry.valueMode ?? "dollar";

  if (valueMode === "dollar") {
    return entry.value;
  }

  const sources = getPercentSources(entry);
  const annualBaseIncome = sources.reduce(
    (sum, source) => sum + income[source],
    0,
  );

  // Comp income is annual; budget entries are monthly (9% of salary = 9% of annual / 12 per month).
  return (entry.value / 100) * (annualBaseIncome / BUDGET_MONTHS_PER_YEAR);
};

export const getPercentSources = (
  entry: Pick<ExpenseEntry, "percentSource" | "percentSources">,
): ExpensePercentSource[] => {
  if (entry.percentSources?.length) {
    return entry.percentSources;
  }

  if (entry.percentSource) {
    return [entry.percentSource];
  }

  return ["salary"];
};

export const buildCategoryTotals = (
  expenseEntries: ExpenseEntry[],
  income: BudgetIncome,
  categoryColors: BudgetCategoryColors = {},
): CategoryTotal[] => {
  const groups = new Map<string, CategoryTotal>();

  expenseEntries.forEach((expenseEntry, index) => {
    const categoryKey = normalizeCategoryKey(expenseEntry.category);
    const resolvedAmount = resolveExpenseAmount(expenseEntry, income);
    const item: ResolvedExpense = { expenseEntry, index, resolvedAmount };
    const existingGroup = groups.get(categoryKey);

    if (existingGroup) {
      existingGroup.items.push(item);
      existingGroup.total += resolvedAmount;
      return;
    }

    groups.set(categoryKey, {
      categoryKey,
      heading: categoryHeading(expenseEntry.category),
      total: resolvedAmount,
      color: categoryColors[categoryKey],
      items: [item],
    });
  });

  return [...groups.values()];
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
  const net = income.gross - totalWithholdings;
  const unallocated = net - totalAllocated;

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

export const getSankeyNodeSum = (
  nodeId: string,
  data: Array<{ from: string; to: string; weight: number }>,
): number => {
  const outgoing = data
    .filter((link) => link.from === nodeId)
    .reduce((sum, link) => sum + link.weight, 0);
  const incoming = data
    .filter((link) => link.to === nodeId)
    .reduce((sum, link) => sum + link.weight, 0);

  return Math.max(outgoing, incoming);
};

export const buildBudgetSankeyData = (
  flow: BudgetFlow,
  nodeColors: {
    salary: string;
    bonus: string;
    stockAdj: string;
    gross: string;
    federalTax: string;
    stateTax: string;
    payroll: string;
    unallocated: string;
    category: (categoryKey: string, color?: ExpenseEntryColor) => string;
  },
): BudgetSankeyData => {
  const {
    income,
    federalTax,
    stateTax,
    socialSecurity,
    medicare,
    caDisability,
    categories,
  } = flow;
  const annualTotalAllocated = flow.totalAllocated * BUDGET_MONTHS_PER_YEAR;
  const annualUnallocated = flow.net - annualTotalAllocated;
  const data: SankeyLink[] = [];

  if (income.salary > 0) {
    data.push({
      from: INCOME_NODE_LABELS.salary,
      to: GROSS_INCOME_NODE,
      weight: income.salary,
    });
  }
  if (income.bonus > 0) {
    data.push({
      from: INCOME_NODE_LABELS.bonus,
      to: GROSS_INCOME_NODE,
      weight: income.bonus,
    });
  }
  if (income.stockAdj > 0) {
    data.push({
      from: INCOME_NODE_LABELS.stockAdj,
      to: GROSS_INCOME_NODE,
      weight: income.stockAdj,
    });
  }

  const incomeTaxWithholdings: Array<{ amount: number; label: string }> = [
    { amount: federalTax, label: FEDERAL_TAX_LABEL },
    { amount: stateTax, label: STATE_TAX_LABEL },
  ];

  incomeTaxWithholdings.forEach(({ amount, label }) => {
    if (amount > 0) {
      data.push({
        from: GROSS_INCOME_NODE,
        to: label,
        weight: amount,
      });
    }
  });

  const payrollTotal = socialSecurity + medicare + caDisability;
  if (payrollTotal > 0) {
    data.push({
      from: GROSS_INCOME_NODE,
      to: PAYROLL_NODE_LABEL,
      weight: payrollTotal,
    });
  }

  categories.forEach(({ heading, total }) => {
    const annualTotal = total * BUDGET_MONTHS_PER_YEAR;

    if (annualTotal > 0) {
      data.push({
        from: GROSS_INCOME_NODE,
        to: heading,
        weight: annualTotal,
      });
    }
  });

  const unallocatedWeight = Math.max(0, annualUnallocated);
  if (unallocatedWeight > 0) {
    data.push({
      from: GROSS_INCOME_NODE,
      to: UNALLOCATED_NODE,
      weight: unallocatedWeight,
    });
  }

  const nodes: SankeyNode[] = [
    {
      id: INCOME_NODE_LABELS.salary,
      column: 0,
      color: nodeColors.salary,
    },
    {
      id: INCOME_NODE_LABELS.bonus,
      column: 0,
      color: nodeColors.bonus,
    },
    {
      id: INCOME_NODE_LABELS.stockAdj,
      column: 0,
      color: nodeColors.stockAdj,
    },
    {
      id: GROSS_INCOME_NODE,
      column: 1,
      color: nodeColors.gross,
    },
    {
      id: FEDERAL_TAX_LABEL,
      column: 2,
      color: nodeColors.federalTax,
    },
    {
      id: STATE_TAX_LABEL,
      column: 2,
      color: nodeColors.stateTax,
    },
    {
      id: PAYROLL_NODE_LABEL,
      column: 2,
      color: nodeColors.payroll,
    },
    ...categories.map(({ heading, categoryKey, color }) => ({
      id: heading,
      column: 2,
      color: nodeColors.category(categoryKey, color),
    })),
    {
      id: UNALLOCATED_NODE,
      column: 2,
      color: nodeColors.unallocated,
    },
  ];

  return { nodes, data };
};

export const buildPayrollPieData = (flow: BudgetFlow): PiePoint[] =>
  [
    { name: SOCIAL_SECURITY_LABEL, y: flow.socialSecurity },
    { name: MEDICARE_LABEL, y: flow.medicare },
    { name: CA_DISABILITY_LABEL, y: flow.caDisability },
  ].filter(({ y }) => y > 0);

export const buildIncomeOverviewPieData = (flow: BudgetFlow): PiePoint[] => {
  const slices: PiePoint[] = [];

  if (flow.federalTax > 0) {
    slices.push({ name: FEDERAL_TAX_LABEL, y: flow.federalTax });
  }
  if (flow.stateTax > 0) {
    slices.push({ name: STATE_TAX_LABEL, y: flow.stateTax });
  }
  if (flow.totalPayrollDeductions > 0) {
    slices.push({ name: PAYROLL_NODE_LABEL, y: flow.totalPayrollDeductions });
  }

  flow.categories.forEach(({ heading, total }) => {
    const annualTotal = total * BUDGET_MONTHS_PER_YEAR;

    if (annualTotal > 0) {
      slices.push({ name: heading, y: annualTotal });
    }
  });

  const annualUnallocated =
    flow.net - flow.totalAllocated * BUDGET_MONTHS_PER_YEAR;
  const unallocated = Math.max(0, annualUnallocated);

  if (unallocated > 0) {
    slices.push({ name: UNALLOCATED_NODE, y: unallocated });
  }

  return slices;
};

export const isPayrollSankeyNode = (nodeId: string) =>
  nodeId === PAYROLL_NODE_LABEL;

export const buildCategoryPieData = (categories: CategoryTotal[]): PiePoint[] =>
  categories
    .filter(({ total }) => total > 0)
    .map(({ heading, total }) => ({ name: heading, y: total }));

export const buildExpensePieData = (
  categoryKey: string,
  expenseEntries: ExpenseEntry[],
  income: BudgetIncome,
): PiePoint[] => {
  const normalizedKey = normalizeCategoryKey(categoryKey);

  return expenseEntries
    .map((expenseEntry, index) => ({
      expenseEntry,
      index,
      resolvedAmount: resolveExpenseAmount(expenseEntry, income),
    }))
    .filter(
      ({ expenseEntry }) =>
        normalizeCategoryKey(expenseEntry.category) === normalizedKey,
    )
    .filter(({ resolvedAmount }) => resolvedAmount > 0)
    .map(({ expenseEntry, resolvedAmount }) => ({
      name: expenseEntry.name,
      y: resolvedAmount,
    }));
};

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

export const isCategorySankeyNode = (
  nodeId: string,
  categories: CategoryTotal[],
) => categories.some(({ heading }) => heading === nodeId);

export const formatPercentSources = (sources: ExpensePercentSource[]): string =>
  sources
    .map((source) => {
      switch (source) {
        case "salary":
          return "salary";
        case "bonus":
          return "bonus";
        case "stockAdj":
          return "stock adj";
      }
    })
    .join(" + ");
