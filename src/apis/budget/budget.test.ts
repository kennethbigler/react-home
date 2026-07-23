import { describe, expect, it } from "vitest";
import { buildBudgetSankeyData } from "../../components/resume/finances/budgeting/graphs/chartData";
import {
  buildBudgetFlow,
  buildCategoryTotals,
  computeCaliforniaTax,
  computeFederalTax,
  computeTotalTax,
  formatCategoryName,
  formatPercentSources,
  formatTaxBasis,
  getLatestBudgetIncome,
  getPercentSources,
  getTaxBasis,
  resolveExpenseAmount,
  type ExpenseEntry,
} from "./index";

const sampleIncome = getLatestBudgetIncome(100_000, 20_000, 1_000, 2_000);

const sankeyNodeColors = {
  salary: "#a",
  bonus: "#b",
  stockAdj: "#c",
  gross: "#d",
  federalTax: "#e",
  stateTax: "#f",
  payroll: "#i",
  unallocated: "#g",
  category: () => "#h",
};

describe("apis | budget", () => {
  describe("computeFederalTax", () => {
    it("returns zero when gross is below the standard deduction", () => {
      expect(computeFederalTax(10_000)).toBe(0);
    });

    it("computes tax at a mid-bracket income", () => {
      const tax = computeFederalTax(100_000);
      expect(tax).toBeGreaterThan(0);
      expect(tax).toBeLessThan(100_000);
    });
  });

  describe("computeCaliforniaTax", () => {
    it("returns zero when gross is below the CA standard deduction", () => {
      expect(computeCaliforniaTax(5_000)).toBe(0);
    });

    it("adds mental health surcharge above one million taxable", () => {
      const belowSurcharge = computeCaliforniaTax(900_000);
      const withSurcharge = computeCaliforniaTax(1_200_000);

      expect(withSurcharge).toBeGreaterThan(belowSurcharge);
    });
  });

  describe("computeTotalTax", () => {
    it("sums federal and state tax", () => {
      const { federal, state, total } = computeTotalTax(150_000);

      expect(total).toBeCloseTo(federal + state, 2);
    });
  });

  describe("resolveExpenseAmount", () => {
    it("returns fixed dollar amounts", () => {
      const entry: ExpenseEntry = {
        name: "Rent",
        category: "Housing",
        value: 2500,
      };

      expect(resolveExpenseAmount(entry, sampleIncome)).toBe(2500);
    });

    it("resolves percent of salary", () => {
      const entry: ExpenseEntry = {
        name: "401k",
        category: "Retirement",
        value: 9,
        valueMode: "percent",
        percentSources: ["salary"],
        taxBasis: "pretax",
      };

      expect(resolveExpenseAmount(entry, sampleIncome)).toBe(750);
    });

    it("resolves post-tax percent using net income when provided", () => {
      const entry: ExpenseEntry = {
        name: "Invest",
        category: "Investing",
        value: 100,
        valueMode: "percent",
        percentSources: ["stockAdj"],
      };
      const flow = buildBudgetFlow(sampleIncome, []);

      expect(resolveExpenseAmount(entry, sampleIncome, flow.net)).toBeCloseTo(
        ((100 / 100) * ((2_000 * flow.net) / sampleIncome.gross)) / 12,
        2,
      );
    });

    it("resolves percent of stock", () => {
      const entry: ExpenseEntry = {
        name: "Invest",
        category: "Investing",
        value: 100,
        valueMode: "percent",
        percentSources: ["stockAdj"],
        taxBasis: "pretax",
      };

      expect(resolveExpenseAmount(entry, sampleIncome)).toBeCloseTo(
        2000 / 12,
        2,
      );
    });

    it("resolves percent across multiple income sources", () => {
      const entry: ExpenseEntry = {
        name: "401k",
        category: "Retirement",
        value: 9,
        valueMode: "percent",
        percentSources: ["salary", "bonus"],
        taxBasis: "pretax",
      };

      expect(resolveExpenseAmount(entry, sampleIncome)).toBe(900);
    });

    it("uses gross base for post-tax percent when net income is omitted", () => {
      const entry: ExpenseEntry = {
        name: "Invest",
        category: "Investing",
        value: 10,
        valueMode: "percent",
        percentSources: ["salary"],
      };

      expect(resolveExpenseAmount(entry, sampleIncome)).toBeCloseTo(833.33, 2);
    });

    it("uses gross base when income is zero", () => {
      const zeroIncome = getLatestBudgetIncome(0, 0, 0, 0);
      const entry: ExpenseEntry = {
        name: "Invest",
        category: "Investing",
        value: 10,
        valueMode: "percent",
        percentSources: ["salary"],
      };

      expect(resolveExpenseAmount(entry, zeroIncome, 0)).toBe(0);
    });

    it("annualizes to the correct annual percent in the sankey", () => {
      const income = getLatestBudgetIncome(282_000, 50_000, 0, 32_281.78);
      const entry: ExpenseEntry = {
        name: "401k",
        category: "Retirement",
        value: 9,
        valueMode: "percent",
        percentSources: ["salary", "bonus"],
        taxBasis: "pretax",
      };
      const monthly = resolveExpenseAmount(entry, income);
      const flow = buildBudgetFlow(income, [entry]);
      const { data } = buildBudgetSankeyData(flow, sankeyNodeColors);

      expect(monthly).toBeCloseTo((0.09 * (282_000 + 50_000)) / 12, 2);
      expect(data.find((link) => link.to === "Retirement")?.weight).toBeCloseTo(
        0.09 * (282_000 + 50_000),
        2,
      );
    });
  });

  describe("formatCategoryName", () => {
    it("title-cases category labels", () => {
      expect(formatCategoryName("utilities")).toBe("Utilities");
      expect(formatCategoryName("FUN")).toBe("Fun");
      expect(formatCategoryName("  dining out  ")).toBe("Dining Out");
    });

    it("returns Uncategorized for blank input", () => {
      expect(formatCategoryName("   ")).toBe("Uncategorized");
    });
  });

  describe("buildCategoryTotals", () => {
    it("groups expenses case-insensitively", () => {
      const entries: ExpenseEntry[] = [
        { name: "Rent", category: "housing", value: 2000 },
        { name: "HOA", category: "Housing", value: 300 },
      ];

      const totals = buildCategoryTotals(entries, sampleIncome);

      expect(totals).toHaveLength(1);
      expect(totals[0]?.total).toBe(2300);
      expect(totals[0]?.heading).toBe("Housing");
    });

    it("uses an uncategorized heading for blank categories", () => {
      const totals = buildCategoryTotals(
        [{ name: "Misc", category: "   ", value: 50 }],
        sampleIncome,
      );

      expect(totals[0]?.heading).toBe("Uncategorized");
    });

    it("sorts categories by total descending", () => {
      const totals = buildCategoryTotals(
        [
          { name: "Groceries", category: "Food", value: 400 },
          { name: "401k", category: "Payroll", value: 500 },
          { name: "Rent", category: "Housing", value: 3000 },
        ],
        sampleIncome,
      );

      expect(totals.map(({ heading }) => heading)).toEqual([
        "Housing",
        "Payroll",
        "Food",
      ]);
    });
  });

  describe("buildBudgetFlow", () => {
    it("computes unallocated net after withholdings and expenses", () => {
      const flow = buildBudgetFlow(sampleIncome, [
        { name: "Rent", category: "Housing", value: 3000 },
      ]);

      expect(flow.totalWithholdings).toBeCloseTo(
        flow.totalTax + flow.totalPayrollDeductions,
        2,
      );
      expect(flow.net).toBe(sampleIncome.gross - flow.totalWithholdings);
      expect(flow.unallocated).toBeCloseTo(flow.net - 3000 * 12, 2);
      expect(flow.isOverAllocated).toBe(false);
    });

    it("includes payroll deductions on gross wages", () => {
      const flow = buildBudgetFlow(sampleIncome, []);

      expect(flow.socialSecurity).toBeGreaterThan(0);
      expect(flow.medicare).toBeGreaterThan(0);
      expect(flow.caDisability).toBeGreaterThan(0);
      expect(flow.totalPayrollDeductions).toBeCloseTo(
        flow.socialSecurity + flow.medicare + flow.caDisability,
        2,
      );
    });

    it("flags over-allocation when expenses exceed net", () => {
      const flow = buildBudgetFlow(sampleIncome, [
        { name: "Everything", category: "Spend", value: 500_000 },
      ]);

      expect(flow.isOverAllocated).toBe(true);
      expect(flow.unallocated).toBeLessThan(0);
    });
  });

  describe("getLatestBudgetIncome", () => {
    it("prefers stockAdj over stock", () => {
      expect(getLatestBudgetIncome(100, 0, 50, 75)).toEqual({
        salary: 100,
        bonus: 0,
        stockAdj: 75,
        gross: 175,
      });
    });

    it("falls back to stock when stockAdj is zero", () => {
      expect(getLatestBudgetIncome(100, 0, 50, 0)).toEqual({
        salary: 100,
        bonus: 0,
        stockAdj: 50,
        gross: 150,
      });
    });
  });

  describe("getPercentSources", () => {
    it("prefers percentSources when present", () => {
      expect(
        getPercentSources({
          percentSources: ["bonus", "stockAdj"],
        }),
      ).toEqual(["bonus", "stockAdj"]);
    });

    it("falls back to legacy percentSource", () => {
      expect(getPercentSources({ percentSource: "stockAdj" })).toEqual([
        "stockAdj",
      ]);
    });

    it("defaults to salary when no sources are provided", () => {
      expect(getPercentSources({})).toEqual(["salary"]);
    });
  });

  describe("formatPercentSources", () => {
    it("formats all supported income sources", () => {
      expect(formatPercentSources(["salary", "bonus", "stockAdj"])).toBe(
        "salary + bonus + stock",
      );
    });
  });

  describe("getTaxBasis", () => {
    it("defaults to post-tax when taxBasis is omitted", () => {
      expect(getTaxBasis({})).toBe("posttax");
    });

    it("returns the stored tax basis", () => {
      expect(getTaxBasis({ taxBasis: "pretax" })).toBe("pretax");
    });
  });

  describe("formatTaxBasis", () => {
    it("formats tax basis labels", () => {
      expect(formatTaxBasis("pretax")).toBe("pre-tax");
      expect(formatTaxBasis("posttax")).toBe("post-tax");
    });
  });
});
