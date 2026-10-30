import {
  DEFAULT_RECOMMENDED_CATEGORY,
  RECOMMENDED_BUDGET_CATEGORIES,
  type RecommendedCategoryKey,
} from "@/constants/recommended-budget";
import { formatCategoryName, normalizeCategoryKey } from "./expenses";
import {
  BUDGET_MONTHS_PER_YEAR,
  type BudgetCategory,
  type CategoryTotal,
  type ExpenseEntry,
  type RecommendedCategoryTotal,
} from "./types";

const isRecommendedKey = (key: string): key is RecommendedCategoryKey =>
  RECOMMENDED_BUDGET_CATEGORIES.some((bucket) => bucket.key === key);

/** Bucket whose label matches a category name, e.g. "Housing" → housing. */
const findRecommendedKeyByName = (name: string) =>
  RECOMMENDED_BUDGET_CATEGORIES.find(
    ({ label }) => normalizeCategoryKey(label) === normalizeCategoryKey(name),
  )?.key;

/** Bucket a category maps to; misc when undefined or stored with a stale key. */
const getRecommendedKey = (
  categoryName: string,
  categories: BudgetCategory[],
): RecommendedCategoryKey => {
  const recommended = categories.find(
    ({ name }) =>
      normalizeCategoryKey(name) === normalizeCategoryKey(categoryName),
  )?.recommended;

  return recommended && isRecommendedKey(recommended)
    ? recommended
    : DEFAULT_RECOMMENDED_CATEGORY;
};

export const isRecommendedCategory = (
  category: CategoryTotal,
): category is RecommendedCategoryTotal => "target" in category;

/** Label of the bucket a category maps to. */
export const getRecommendedLabel = (
  categoryName: string,
  categories: BudgetCategory[],
): string => {
  const key = getRecommendedKey(categoryName, categories);

  return (
    RECOMMENDED_BUDGET_CATEGORIES.find((bucket) => bucket.key === key)?.label ??
    categoryName
  );
};

/**
 * Stored categories plus any expense categories not yet defined. An undefined
 * category named like a bucket (added in recommended view) maps to that
 * bucket; anything else maps to misc.
 */
export const mergeBudgetCategories = (
  categories: BudgetCategory[],
  expenseEntries: ExpenseEntry[],
): BudgetCategory[] => {
  const merged = new Map<string, BudgetCategory>();

  categories.forEach((category) =>
    merged.set(normalizeCategoryKey(category.name), category),
  );
  expenseEntries.forEach(({ category }) => {
    const key = normalizeCategoryKey(category);
    if (!merged.has(key)) {
      merged.set(key, {
        name: formatCategoryName(category),
        recommended:
          findRecommendedKeyByName(category) ?? DEFAULT_RECOMMENDED_CATEGORY,
      });
    }
  });

  return [...merged.values()].toSorted((a, b) => a.name.localeCompare(b.name));
};

/** Regroup user categories into buckets with monthly targets from annual net. */
export const buildRecommendedTotals = (
  categoryTotals: CategoryTotal[],
  categories: BudgetCategory[],
  annualNet: number,
): RecommendedCategoryTotal[] => {
  const monthlyNet = Math.max(0, annualNet) / BUDGET_MONTHS_PER_YEAR;

  return RECOMMENDED_BUDGET_CATEGORIES.map((bucket) => {
    const { key, label, percent, color } = bucket;
    const mapped = categoryTotals.filter(
      ({ heading }) => getRecommendedKey(heading, categories) === key,
    );
    const total = mapped.reduce((sum, category) => sum + category.total, 0);
    const target = (percent / 100) * monthlyNet;

    return {
      categoryKey: key,
      heading: label,
      total,
      color,
      items: mapped
        .flatMap(({ items }) => items)
        .toSorted((a, b) => a.index - b.index),
      percent,
      target,
      remaining: target - total,
      overIsGood: "overIsGood" in bucket && bucket.overIsGood,
    };
  });
};
