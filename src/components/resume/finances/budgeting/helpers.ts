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
import { computeProgressiveTax } from "../../../../constants/taxHelpers";
import type {
  BudgetCategoryColors,
  ExpenseEntry,
  ExpenseEntryColor,
  ExpensePercentSource,
} from "../../../../jotai/finances-atom";

export { FEDERAL_TAX_LABEL } from "../../../../constants/federalTaxBrackets";
export { STATE_TAX_LABEL } from "../../../../constants/caStateTaxBrackets";

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
  totalTax: number;
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
  const { federal, state, total } = computeTotalTax(income.gross);
  const categories = buildCategoryTotals(
    expenseEntries,
    income,
    categoryColors,
  );
  const totalAllocated = categories.reduce(
    (sum, category) => sum + category.total,
    0,
  );
  const net = income.gross - total;
  const unallocated = net - totalAllocated;

  return {
    income,
    federalTax: federal,
    stateTax: state,
    totalTax: total,
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
    unallocated: string;
    category: (categoryKey: string, color?: ExpenseEntryColor) => string;
  },
): BudgetSankeyData => {
  const { income, federalTax, stateTax, categories } = flow;
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

  if (federalTax > 0) {
    data.push({
      from: GROSS_INCOME_NODE,
      to: FEDERAL_TAX_LABEL,
      weight: federalTax,
    });
  }
  if (stateTax > 0) {
    data.push({
      from: GROSS_INCOME_NODE,
      to: STATE_TAX_LABEL,
      weight: stateTax,
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
