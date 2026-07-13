import { FEDERAL_TAX_LABEL } from "../../../../../constants/federalTaxBrackets";
import { STATE_TAX_LABEL } from "../../../../../constants/caStateTaxBrackets";
import {
  CA_DISABILITY_LABEL,
  MEDICARE_LABEL,
  PAYROLL_NODE_LABEL,
  SOCIAL_SECURITY_LABEL,
} from "../../../../../constants/payrollDeductions";
import {
  BUDGET_MONTHS_PER_YEAR,
  normalizeCategoryKey,
  resolveExpenseAmount,
  type BudgetFlow,
  type CategoryTotal,
  type ExpenseEntry,
} from "../../../../../apis/budget";
import {
  GROSS_INCOME_NODE,
  INCOME_NODE_LABELS,
  PAYROLL_CATEGORY_KEY,
  UNALLOCATED_NODE,
  type BudgetSankeyData,
  type BudgetSankeyNodeColors,
  type PiePoint,
} from "./types";

export {
  BUDGET_WITHHOLDING_NODE_LABELS,
  GROSS_INCOME_NODE,
  INCOME_NODE_LABELS,
  PAYROLL_CATEGORY_KEY,
  UNALLOCATED_NODE,
} from "./types";
export type {
  BudgetSankeyData,
  BudgetSankeyNodeColors,
  PiePoint,
} from "./types";

const getAnnualUnallocated = (flow: BudgetFlow): number =>
  Math.max(0, flow.net - flow.totalAllocated * BUDGET_MONTHS_PER_YEAR);

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
  nodeColors: BudgetSankeyNodeColors,
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
  const data: BudgetSankeyData["data"] = [];

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

  const unallocatedWeight = getAnnualUnallocated(flow);
  if (unallocatedWeight > 0) {
    data.push({
      from: GROSS_INCOME_NODE,
      to: UNALLOCATED_NODE,
      weight: unallocatedWeight,
    });
  }

  const nodes: BudgetSankeyData["nodes"] = [
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

export const buildIncomeOverviewPieData = (
  flow: BudgetFlow,
  options?: { hideTaxes?: boolean },
): PiePoint[] => {
  const hideTaxes = options?.hideTaxes ?? false;
  const slices: PiePoint[] = [];

  if (!hideTaxes && flow.federalTax > 0) {
    slices.push({ name: FEDERAL_TAX_LABEL, y: flow.federalTax });
  }
  if (!hideTaxes && flow.stateTax > 0) {
    slices.push({ name: STATE_TAX_LABEL, y: flow.stateTax });
  }
  if (!hideTaxes && flow.totalPayrollDeductions > 0) {
    slices.push({ name: PAYROLL_NODE_LABEL, y: flow.totalPayrollDeductions });
  }

  flow.categories.forEach(({ heading, total }) => {
    const annualTotal = total * BUDGET_MONTHS_PER_YEAR;

    if (annualTotal > 0) {
      slices.push({ name: heading, y: annualTotal });
    }
  });

  const unallocated = getAnnualUnallocated(flow);

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
  income: BudgetFlow["income"],
  netIncome?: number,
): PiePoint[] => {
  const normalizedKey = normalizeCategoryKey(categoryKey);

  return expenseEntries
    .map((expenseEntry, index) => ({
      expenseEntry,
      index,
      resolvedAmount: resolveExpenseAmount(expenseEntry, income, netIncome),
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

export const isCategorySankeyNode = (
  nodeId: string,
  categories: CategoryTotal[],
) => categories.some(({ heading }) => heading === nodeId);

export const getSankeyNodeClassName = (
  nodeId: string,
  categories: CategoryTotal[],
  selectedCategoryKey?: string | null,
): string | undefined => {
  if (
    selectedCategoryKey &&
    (categories.find(({ heading }) => heading === nodeId)?.categoryKey ===
      selectedCategoryKey ||
      (selectedCategoryKey === PAYROLL_CATEGORY_KEY &&
        isPayrollSankeyNode(nodeId)))
  ) {
    return "budget-sankey-selected";
  }

  return undefined;
};
