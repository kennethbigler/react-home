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
      // even when zero-value slices are omitted from the pie.
      color: getCategoryColor(i),
    }))
    .filter(({ name, y }) => y > 0 && !hiddenCategories.has(name));
