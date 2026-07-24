import {
  BUDGET_MONTHS_PER_YEAR,
  type BudgetCategoryColors,
  type BudgetIncome,
  type CategoryTotal,
  type ExpenseEntry,
  type ExpensePercentSource,
  type ExpenseTaxBasis,
  type ResolvedExpense,
} from "./types";

export const normalizeCategoryKey = (category: string) =>
  category.trim().toLowerCase();

/** Title-case category labels for charts and stored expense categories. */
export const formatCategoryName = (category: string): string => {
  const trimmed = category.trim();

  if (!trimmed) {
    return "Uncategorized";
  }

  return trimmed
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

/** Largest total first; heading as a stable tiebreaker. */
export const sortCategoriesByTotal = (
  categories: CategoryTotal[],
): CategoryTotal[] =>
  categories.toSorted(
    (a, b) => b.total - a.total || a.heading.localeCompare(b.heading),
  );

export const getTaxBasis = (
  entry: Pick<ExpenseEntry, "taxBasis">,
): ExpenseTaxBasis => entry.taxBasis ?? "posttax";

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

export const resolveExpenseAmount = (
  entry: ExpenseEntry,
  income: BudgetIncome,
  netIncome?: number,
): number => {
  const valueMode = entry.valueMode ?? "dollar";

  if (valueMode === "dollar") {
    return entry.value;
  }

  const sources = getPercentSources(entry);
  const annualGrossBase = sources.reduce(
    (sum, source) => sum + income[source],
    0,
  );
  const taxBasis = getTaxBasis(entry);
  const annualBaseIncome =
    taxBasis === "posttax" && netIncome !== undefined && income.gross > 0
      ? annualGrossBase * (netIncome / income.gross)
      : annualGrossBase;

  // Comp income is annual; budget entries are monthly (9% of salary = 9% of annual / 12 per month).
  return (entry.value / 100) * (annualBaseIncome / BUDGET_MONTHS_PER_YEAR);
};

export const buildCategoryTotals = (
  expenseEntries: ExpenseEntry[],
  income: BudgetIncome,
  categoryColors: BudgetCategoryColors = {},
  netIncome?: number,
): CategoryTotal[] => {
  const groups = new Map<string, CategoryTotal>();

  expenseEntries.forEach((expenseEntry, index) => {
    const categoryKey = normalizeCategoryKey(expenseEntry.category);
    const resolvedAmount = resolveExpenseAmount(
      expenseEntry,
      income,
      netIncome,
    );
    const item: ResolvedExpense = { expenseEntry, index, resolvedAmount };
    const existingGroup = groups.get(categoryKey);

    if (existingGroup) {
      existingGroup.items.push(item);
      existingGroup.total += resolvedAmount;
      return;
    }

    groups.set(categoryKey, {
      categoryKey,
      heading: formatCategoryName(expenseEntry.category),
      total: resolvedAmount,
      color: categoryColors[categoryKey],
      items: [item],
    });
  });

  return sortCategoriesByTotal([...groups.values()]);
};

export const formatTaxBasis = (taxBasis: ExpenseTaxBasis): string =>
  taxBasis === "pretax" ? "pre-tax" : "post-tax";

export const formatPercentSources = (sources: ExpensePercentSource[]): string =>
  sources
    .map((source) => {
      switch (source) {
        case "salary":
          return "salary";
        case "bonus":
          return "bonus";
        case "stockAdj":
          return "stock";
      }
    })
    .join(" + ");
