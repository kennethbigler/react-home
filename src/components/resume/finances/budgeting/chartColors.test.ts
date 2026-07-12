import { createTheme } from "@mui/material/styles";
import { describe, expect, it } from "vitest";
import {
  buildCategoryColorShades,
  colorizeBreakdownPieData,
  colorizeCategoryPieData,
  colorizeIncomeOverviewPieData,
  getBudgetSankeyNodeColors,
  mixHexColors,
} from "./chartColors";
import { buildBudgetFlow, getLatestBudgetIncome } from "./helpers";
import { FEDERAL_TAX_LABEL } from "../../../../constants/federalTaxBrackets";
import { PAYROLL_NODE_LABEL } from "../../../../constants/payrollDeductions";

const theme = createTheme();

describe("budgeting | chartColors", () => {
  it("mixes two hex colors", () => {
    expect(mixHexColors("#000000", "#ffffff", 0.5)).toBe("#808080");
  });

  it("clamps mix ratios outside the 0 to 1 range", () => {
    expect(mixHexColors("#000000", "#ffffff", -1)).toBe("#000000");
    expect(mixHexColors("#000000", "#ffffff", 2)).toBe("#ffffff");
  });

  it("returns no shades when count is zero", () => {
    expect(buildCategoryColorShades(theme, "success", 0)).toEqual([]);
  });

  it("returns a single main color when count is one", () => {
    expect(buildCategoryColorShades(theme, "success", 1)).toEqual([
      theme.palette.success.main,
    ]);
  });

  it("defaults to grey shades when no category color is provided", () => {
    expect(buildCategoryColorShades(theme, undefined, 2)).toEqual([
      theme.palette.grey[300],
      theme.palette.grey[700],
    ]);
  });

  it("builds distinct shades for a palette color", () => {
    const shades = buildCategoryColorShades(theme, "error", 3);

    expect(shades).toHaveLength(3);
    expect(new Set(shades).size).toBe(3);
    expect(shades[0]).toBe(theme.palette.error.light);
    expect(shades[2]).toBe(theme.palette.error.dark);
  });

  it("applies category colors to the overview pie", () => {
    const data = colorizeCategoryPieData(
      theme,
      [
        {
          categoryKey: "housing",
          heading: "HOUSING",
          total: 2000,
          color: "success",
          items: [],
        },
      ],
      [{ name: "HOUSING", y: 2000 }],
    );

    expect(data[0]?.color).toBe(theme.palette.success.main);
  });

  it("falls back to grey when a category color is missing", () => {
    const data = colorizeCategoryPieData(
      theme,
      [],
      [{ name: "UNKNOWN", y: 100 }],
    );

    expect(data[0]?.color).toBe(theme.palette.grey[500]);
  });

  it("applies fixed colors for taxes, payroll, and unallocated in the overview pie", () => {
    const flow = buildBudgetFlow(getLatestBudgetIncome(100_000, 0, 0, 0), [
      { name: "Rent", category: "Housing", value: 2000 },
    ]);
    const data = colorizeIncomeOverviewPieData(theme, flow.categories, [
      { name: FEDERAL_TAX_LABEL, y: flow.federalTax },
      { name: PAYROLL_NODE_LABEL, y: flow.totalPayrollDeductions },
      { name: "HOUSING", y: 24_000 },
    ]);

    expect(data[0]?.color).toBe(theme.palette.error.main);
    expect(data[1]?.color).toBe(theme.palette.error.main);
    expect(data[2]?.color).toBe(theme.palette.grey[500]);
  });

  it("uses grey shades for an uncolored category breakdown", () => {
    const data = colorizeBreakdownPieData(theme, undefined, [
      { name: "401k", y: 900 },
      { name: "IRA", y: 300 },
    ]);

    expect(data[0]?.color).toBe(theme.palette.grey[300]);
    expect(data[1]?.color).toBe(theme.palette.grey[700]);
  });

  it("applies shades for a selected category breakdown", () => {
    const data = colorizeBreakdownPieData(theme, "error", [
      { name: "401k", y: 900 },
      { name: "IRA", y: 300 },
    ]);

    expect(data).toHaveLength(2);
    expect(data[0]?.color).not.toBe(data[1]?.color);
    expect(data[0]?.color).toBe(theme.palette.error.light);
    expect(data[1]?.color).toBe(theme.palette.error.dark);
  });

  it("builds sankey node colors from the theme and comp palette", () => {
    const colors = getBudgetSankeyNodeColors(theme);

    expect(colors.salary).toBeTruthy();
    expect(colors.federalTax).toBe(theme.palette.error.main);
    expect(colors.unallocated).toBe(theme.palette.grey[500]);
    expect(colors.category("housing")).toBe(theme.palette.error.main);
    expect(colors.category("housing", "success")).toBe(
      theme.palette.success.main,
    );
  });
});
