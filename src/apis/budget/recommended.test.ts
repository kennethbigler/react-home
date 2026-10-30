import { describe, expect, it } from "vitest";
import {
  RECOMMENDED_BUDGET_CATEGORIES,
  type RecommendedCategoryKey,
} from "@/constants/recommended-budget";
import { buildCategoryTotals, getLatestBudgetIncome } from "./index";
import {
  buildRecommendedTotals,
  getRecommendedLabel,
  isRecommendedCategory,
  mergeBudgetCategories,
} from "./recommended";

const income = getLatestBudgetIncome(120_000, 0, 0, 0);

describe("apis | budget | recommended", () => {
  it("recommended percentages total 100%", () => {
    expect(
      RECOMMENDED_BUDGET_CATEGORIES.reduce(
        (sum, { percent }) => sum + percent,
        0,
      ),
    ).toBe(100);
  });

  describe("mergeBudgetCategories", () => {
    it("adds undefined expense categories mapped to miscellaneous", () => {
      const merged = mergeBudgetCategories(
        [{ name: "Rent", recommended: "housing" }],
        [
          { name: "Rent", category: "rent", value: 1 },
          { name: "Movies", category: "fun stuff", value: 1 },
          { name: "Dinner", category: "food", value: 1 },
        ],
      );

      expect(merged).toEqual([
        { name: "Food", recommended: "food" },
        { name: "Fun Stuff", recommended: "miscellaneous" },
        { name: "Rent", recommended: "housing" },
      ]);
    });
  });

  describe("buildRecommendedTotals", () => {
    const categoryTotals = buildCategoryTotals(
      [
        { name: "Rent", category: "Rent", value: 3000 },
        { name: "Movies", category: "Fun", value: 100 },
        { name: "Mystery", category: "Other", value: 50 },
      ],
      income,
    );

    it("groups categories into buckets with targets from net income", () => {
      const totals = buildRecommendedTotals(
        categoryTotals,
        [
          { name: "Rent", recommended: "housing" },
          { name: "Fun", recommended: "recreation" },
          // Stale persisted key falls back to misc.
          {
            name: "Other",
            recommended: "not-a-bucket" as RecommendedCategoryKey,
          },
        ],
        120_000,
      );
      const byKey = Object.fromEntries(
        totals.map((total) => [total.categoryKey, total]),
      );

      expect(totals).toHaveLength(RECOMMENDED_BUDGET_CATEGORIES.length);
      expect(byKey.housing).toMatchObject({
        heading: "Housing",
        percent: 25,
        target: 2500,
        total: 3000,
        remaining: -500,
        color: "primary",
      });
      expect(byKey.recreation).toMatchObject({ total: 100, remaining: 400 });
      expect(byKey.miscellaneous).toMatchObject({
        total: 50,
        color: "warning",
        overIsGood: false,
      });
      expect(byKey.saving.overIsGood).toBe(true);
      expect(totals.every(isRecommendedCategory)).toBe(true);
      expect(isRecommendedCategory(categoryTotals[0])).toBe(false);
      expect(byKey.housing.items.map(({ index }) => index)).toEqual([0]);
    });

    it("treats negative net income as zero targets", () => {
      const totals = buildRecommendedTotals([], [], -1000);

      expect(totals.every(({ target }) => target === 0)).toBe(true);
    });
  });

  describe("getRecommendedLabel", () => {
    it("returns the mapped bucket label, or misc when undefined", () => {
      const categories = [{ name: "Rent", recommended: "housing" as const }];

      expect(getRecommendedLabel("rent", categories)).toBe("Housing");
      expect(getRecommendedLabel("Unknown", categories)).toBe("Miscellaneous");
    });
  });
});
