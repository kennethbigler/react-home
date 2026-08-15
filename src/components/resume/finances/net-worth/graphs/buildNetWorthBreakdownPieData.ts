import { getCategoryColor } from "./colors";

export const buildNetWorthBreakdownPieData = (
  categories: string[],
  amounts: Record<string, number>,
  hiddenCategories: ReadonlySet<string> = new Set(),
) =>
  categories
    .map((name, i) => ({
      name,
      y: amounts[name] ?? 0,
      // Color by full sorted-category index so it matches the area chart
      // even when zero-value slices are included in the pie.
      color: getCategoryColor(i),
    }))
    .filter(({ name }) => !hiddenCategories.has(name));
