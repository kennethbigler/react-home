import { createTheme } from "@mui/material/styles";
import { describe, expect, it } from "vitest";
import { getBudgetPieContent } from "./getBudgetPieContent";
import { buildBudgetFlow, getLatestBudgetIncome } from "./helpers";

const theme = createTheme();
const income = getLatestBudgetIncome(100_000, 10_000, 0, 0);
const expenseEntries = [
  { name: "Rent", category: "Housing", value: 2000 },
  { name: "Groceries", category: "Food", value: 250 },
];
const flow = buildBudgetFlow(income, expenseEntries);

describe("resume | finances | budgeting | getBudgetPieContent", () => {
  it("returns income overview when no category is selected", () => {
    const content = getBudgetPieContent(
      flow,
      flow.categories,
      null,
      expenseEntries,
      {},
      theme,
    );

    expect(content.title).toBe("Income Overview");
    expect(content.data.length).toBeGreaterThan(0);
  });

  it("returns payroll breakdown when payroll is selected", () => {
    const content = getBudgetPieContent(
      flow,
      flow.categories,
      "payroll",
      expenseEntries,
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
      expenseEntries,
      {},
      theme,
    );

    expect(content.title).toBe("Food Breakdown");
    expect(content.data).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "Groceries" })]),
    );
  });
});
