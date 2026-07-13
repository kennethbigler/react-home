import {
  BUDGET_MONTHS_PER_YEAR,
  type BudgetCategoryColors,
  type BudgetIncome,
  type CategoryTotal,
  type ExpenseEntry,
  type ExpensePercentSource,
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
      heading: formatCategoryName(expenseEntry.category),
      total: resolvedAmount,
      color: categoryColors[categoryKey],
      items: [item],
    });
  });

  return [...groups.values()];
};

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
