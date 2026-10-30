import { createTheme } from "@mui/material/styles";
import { describe, expect, it } from "vitest";
import { getBudgetPieContent } from "./getBudgetPieContent";
import {
  buildBudgetFlow,
  buildRecommendedTotals,
  getLatestBudgetIncome,
} from "@/apis/budget";

const theme = createTheme();
const income = getLatestBudgetIncome(100_000, 10_000, 0, 0);
const expenseEntries = [
  { name: "Rent", category: "Housing", value: 2000 },
  { name: "Groceries", category: "Food", value: 250 },
];
const flow = buildBudgetFlow(income, expenseEntries);

describe("resume | finances | budgeting | getBudgetPieContent", () => {
  it("returns income overview when no category is selected", () => {
    const content = getBudgetPieContent(flow, flow.categories, null, {}, theme);

    expect(content.title).toBe("Income Overview");
    expect(content.data.length).toBeGreaterThan(0);
  });

  it("omits taxes from income overview when hideTaxes is true", () => {
    const content = getBudgetPieContent(
      flow,
      flow.categories,
      null,
      {},
      theme,
      true,
    );

    expect(content.title).toBe("Income Overview");
    expect(content.data.map(({ name }) => name)).not.toContain("Fed Tax");
    expect(content.data.map(({ name }) => name)).not.toContain("CA Tax");
    expect(content.data.map(({ name }) => name)).not.toContain("Payroll");
    expect(content.data.map(({ name }) => name)).toEqual(
      expect.arrayContaining(["Food", "Housing"]),
    );
  });

  it("returns payroll breakdown when payroll is selected", () => {
    const content = getBudgetPieContent(
      flow,
      flow.categories,
      "payroll",
      {},
      theme,
    );

    expect(content.title).toBe("Payroll Breakdown");
    expect(content.data.length).toBeGreaterThan(0);
  });

  it("returns category breakdown when a category is selected", () => {
    const content = getBudgetPieContent(
      flow,
      flow.categories,
      "food",
      {},
      theme,
    );

    expect(content.title).toBe("Food Breakdown");
    expect(content.data).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "Groceries" })]),
    );
  });

  it("falls back to a generic title when the selected category is missing", () => {
    const content = getBudgetPieContent(
      flow,
      flow.categories,
      "missing",
      {},
      theme,
    );

    expect(content.title).toBe("Category Breakdown");
    expect(content.data).toEqual([]);
  });

  it("breaks a recommended bucket into its expenses", () => {
    const buckets = buildRecommendedTotals(
      flow.categories,
      [{ name: "Food", recommended: "food" }],
      flow.net,
    );
    const content = getBudgetPieContent(
      { ...flow, categories: buckets },
      buckets,
      "food",
      {},
      theme,
    );

    expect(content.title).toBe("Food Breakdown");
    expect(content.data.map(({ name }) => name)).toEqual(["Groceries"]);
  });
});
