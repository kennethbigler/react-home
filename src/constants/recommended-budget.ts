import type { ExpenseEntryColor } from "@/apis/budget/types";

/**
 * Ramsey recommended budget percentages of take-home pay. Ranges use the low
 * end so the buckets total exactly 100%.
 * Source: https://www.ramseysolutions.com/budgeting/budget-percentages
 */
export const RECOMMENDED_BUDGET_CATEGORIES = [
  {
    key: "giving",
    label: "Giving",
    percent: 10,
    color: "success",
  },
  // Going over the saving target is a good thing, so it isn't flagged.
  {
    key: "saving",
    label: "Saving",
    percent: 10,
    color: "success",
    overIsGood: true,
  },
  {
    key: "housing",
    label: "Housing",
    percent: 25,
    color: "primary",
  },
  {
    key: "utilities",
    label: "Utilities",
    percent: 5,
    color: "primary",
  },
  {
    key: "food",
    label: "Food",
    percent: 10,
    color: "info",
  },
  {
    key: "transportation",
    label: "Transportation",
    percent: 10,
    color: "info",
  },
  {
    key: "health",
    label: "Health",
    percent: 5,
    color: "info",
  },
  {
    key: "insurance",
    label: "Insurance",
    percent: 10,
    color: "warning",
  },
  {
    key: "recreation",
    label: "Recreation",
    percent: 5,
    color: "error",
  },
  {
    key: "personal",
    label: "Personal",
    percent: 5,
    color: "error",
  },
  {
    key: "miscellaneous",
    label: "Miscellaneous",
    percent: 5,
    color: "warning",
  },
] as const satisfies ReadonlyArray<{
  key: string;
  label: string;
  percent: number;
  color: ExpenseEntryColor;
  overIsGood?: boolean;
}>;

export type RecommendedCategoryKey =
  (typeof RECOMMENDED_BUDGET_CATEGORIES)[number]["key"];

export const DEFAULT_RECOMMENDED_CATEGORY: RecommendedCategoryKey =
  "miscellaneous";
