import { describe, expect, it } from "vitest";
import {
  buildBudgetFlow,
  buildBudgetSankeyData,
  buildCategoryPieData,
  buildCategoryTotals,
  buildExpensePieData,
  buildIncomeOverviewPieData,
  buildPayrollPieData,
  computeCaliforniaTax,
  computeFederalTax,
  computeTotalTax,
  formatPercentSources,
  getLatestBudgetIncome,
  getPercentSources,
  getSankeyNodeSum,
  GROSS_INCOME_NODE,
  INCOME_NODE_LABELS,
  isCategorySankeyNode,
  isPayrollSankeyNode,
  resolveExpenseAmount,
  UNALLOCATED_NODE,
} from "./helpers";
import { FEDERAL_TAX_LABEL } from "../../../../constants/federalTaxBrackets";
import { STATE_TAX_LABEL } from "../../../../constants/caStateTaxBrackets";
import {
  CA_DISABILITY_LABEL,
  MEDICARE_LABEL,
  PAYROLL_NODE_LABEL,
  SOCIAL_SECURITY_LABEL,
} from "../../../../constants/payrollDeductions";
import type { ExpenseEntry } from "../../../../jotai/finances-atom";

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

describe("budgeting | helpers", () => {
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
      };

      expect(resolveExpenseAmount(entry, sampleIncome)).toBe(750);
    });

    it("resolves percent of stock adj", () => {
      const entry: ExpenseEntry = {
        name: "Invest",
        category: "Investing",
        value: 100,
        valueMode: "percent",
        percentSources: ["stockAdj"],
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
      };

      expect(resolveExpenseAmount(entry, sampleIncome)).toBe(900);
    });

    it("annualizes to the correct annual percent in the sankey", () => {
      const income = getLatestBudgetIncome(282_000, 50_000, 0, 32_281.78);
      const entry: ExpenseEntry = {
        name: "401k",
        category: "Retirement",
        value: 9,
        valueMode: "percent",
        percentSources: ["salary", "bonus"],
      };
      const monthly = resolveExpenseAmount(entry, income);
      const flow = buildBudgetFlow(income, [entry]);
      const { data } = buildBudgetSankeyData(flow, sankeyNodeColors);

      expect(monthly).toBeCloseTo((0.09 * (282_000 + 50_000)) / 12, 2);
      expect(data.find((link) => link.to === "RETIREMENT")?.weight).toBeCloseTo(
        0.09 * (282_000 + 50_000),
        2,
      );
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
      expect(totals[0]?.heading).toBe("HOUSING");
    });

    it("uses an uncategorized heading for blank categories", () => {
      const totals = buildCategoryTotals(
        [{ name: "Misc", category: "   ", value: 50 }],
        sampleIncome,
      );

      expect(totals[0]?.heading).toBe("UNCATEGORIZED");
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

  describe("buildBudgetSankeyData", () => {
    it("includes tax and grouped payroll nodes with correct labels", () => {
      const flow = buildBudgetFlow(sampleIncome, [
        { name: "Rent", category: "Housing", value: 3000 },
      ]);
      const { nodes, data } = buildBudgetSankeyData(flow, sankeyNodeColors);

      expect(nodes.map((node) => node.id)).toEqual(
        expect.arrayContaining([
          FEDERAL_TAX_LABEL,
          STATE_TAX_LABEL,
          PAYROLL_NODE_LABEL,
        ]),
      );
      expect(data.some((link) => link.to === FEDERAL_TAX_LABEL)).toBe(true);
      expect(data.some((link) => link.to === STATE_TAX_LABEL)).toBe(true);
      expect(data.some((link) => link.to === PAYROLL_NODE_LABEL)).toBe(true);
      expect(data.some((link) => link.to === SOCIAL_SECURITY_LABEL)).toBe(
        false,
      );
      expect(data.some((link) => link.to === MEDICARE_LABEL)).toBe(false);
      expect(data.some((link) => link.to === CA_DISABILITY_LABEL)).toBe(false);
      expect(getSankeyNodeSum(PAYROLL_NODE_LABEL, data)).toBeCloseTo(
        flow.totalPayrollDeductions,
        2,
      );
      expect(data.some((link) => link.to === GROSS_INCOME_NODE)).toBe(true);
    });

    it("sums income source nodes from outgoing links", () => {
      const flow = buildBudgetFlow(sampleIncome, []);
      const { data } = buildBudgetSankeyData(flow, sankeyNodeColors);

      expect(getSankeyNodeSum(INCOME_NODE_LABELS.salary, data)).toBe(100_000);
      expect(getSankeyNodeSum(INCOME_NODE_LABELS.bonus, data)).toBe(20_000);
      expect(getSankeyNodeSum(INCOME_NODE_LABELS.stockAdj, data)).toBe(2_000);
      expect(getSankeyNodeSum(GROSS_INCOME_NODE, data)).toBe(122_000);
    });

    it("annualizes monthly category totals for the sankey", () => {
      const flow = buildBudgetFlow(sampleIncome, [
        { name: "Rent", category: "Housing", value: 3000 },
      ]);
      const { data } = buildBudgetSankeyData(flow, sankeyNodeColors);

      expect(data.find((link) => link.to === "HOUSING")?.weight).toBe(36_000);
    });

    it("includes unallocated when net exceeds allocated expenses", () => {
      const flow = buildBudgetFlow(sampleIncome, []);
      const { data } = buildBudgetSankeyData(flow, sankeyNodeColors);

      expect(data.some((link) => link.to === UNALLOCATED_NODE)).toBe(true);
    });

    it("omits zero-weight income, tax, category, and unallocated links", () => {
      const income = getLatestBudgetIncome(5_000, 0, 0, 0);
      const flow = buildBudgetFlow(income, [
        { name: "Empty", category: "Spend", value: 0 },
      ]);
      const { data } = buildBudgetSankeyData(flow, sankeyNodeColors);

      expect(data.some((link) => link.from === INCOME_NODE_LABELS.bonus)).toBe(
        false,
      );
      expect(
        data.some((link) => link.from === INCOME_NODE_LABELS.stockAdj),
      ).toBe(false);
      expect(data.some((link) => link.to === FEDERAL_TAX_LABEL)).toBe(false);
      expect(data.some((link) => link.to === STATE_TAX_LABEL)).toBe(false);
      expect(data.some((link) => link.to === "SPEND")).toBe(false);
    });

    it("omits unallocated when expenses consume all net income", () => {
      const income = getLatestBudgetIncome(100_000, 0, 0, 0);
      const probeFlow = buildBudgetFlow(income, []);
      const flow = buildBudgetFlow(income, [
        {
          name: "Everything",
          category: "Spend",
          value: probeFlow.net / 12,
        },
      ]);
      const { data } = buildBudgetSankeyData(flow, sankeyNodeColors);

      expect(data.some((link) => link.to === UNALLOCATED_NODE)).toBe(false);
    });

    it("omits salary link when salary is zero", () => {
      const income = getLatestBudgetIncome(0, 50_000, 10_000, 0);
      const flow = buildBudgetFlow(income, []);
      const { data } = buildBudgetSankeyData(flow, sankeyNodeColors);

      expect(data.some((link) => link.from === INCOME_NODE_LABELS.salary)).toBe(
        false,
      );
      expect(data.some((link) => link.from === INCOME_NODE_LABELS.bonus)).toBe(
        true,
      );
    });

    it("omits payroll link when gross income is zero", () => {
      const income = getLatestBudgetIncome(0, 0, 0, 0);
      const flow = buildBudgetFlow(income, []);
      const { data } = buildBudgetSankeyData(flow, sankeyNodeColors);

      expect(data.some((link) => link.to === PAYROLL_NODE_LABEL)).toBe(false);
    });
  });

  describe("buildIncomeOverviewPieData", () => {
    it("includes taxes, payroll, categories, and unallocated on annual scale", () => {
      const flow = buildBudgetFlow(sampleIncome, [
        { name: "Rent", category: "Housing", value: 2000 },
      ]);
      const pie = buildIncomeOverviewPieData(flow);

      expect(pie.map(({ name }) => name)).toEqual(
        expect.arrayContaining([
          FEDERAL_TAX_LABEL,
          STATE_TAX_LABEL,
          PAYROLL_NODE_LABEL,
          "HOUSING",
          UNALLOCATED_NODE,
        ]),
      );
      expect(pie.find(({ name }) => name === "HOUSING")?.y).toBe(24_000);
    });

    it("includes withholdings even when there are no expense categories", () => {
      const flow = buildBudgetFlow(sampleIncome, []);
      const pie = buildIncomeOverviewPieData(flow);

      expect(pie.map(({ name }) => name)).toEqual(
        expect.arrayContaining([
          FEDERAL_TAX_LABEL,
          STATE_TAX_LABEL,
          PAYROLL_NODE_LABEL,
          UNALLOCATED_NODE,
        ]),
      );
    });

    it("omits taxes, payroll, zero categories, and unallocated when not applicable", () => {
      const zeroIncome = getLatestBudgetIncome(0, 0, 0, 0);
      const flow = buildBudgetFlow(zeroIncome, [
        { name: "Empty", category: "Spend", value: 0 },
      ]);
      const pie = buildIncomeOverviewPieData(flow);

      expect(pie).toEqual([]);
    });

    it("omits unallocated when expenses consume all net income", () => {
      const income = getLatestBudgetIncome(100_000, 0, 0, 0);
      const probeFlow = buildBudgetFlow(income, []);
      const flow = buildBudgetFlow(income, [
        {
          name: "Everything",
          category: "Spend",
          value: probeFlow.net / 12,
        },
      ]);
      const pie = buildIncomeOverviewPieData(flow);

      expect(pie.map(({ name }) => name)).not.toContain(UNALLOCATED_NODE);
      expect(pie.some(({ name }) => name === "SPEND")).toBe(true);
    });
  });

  describe("buildPayrollPieData", () => {
    it("returns payroll deduction slices for the pie breakdown", () => {
      const flow = buildBudgetFlow(sampleIncome, []);
      const pie = buildPayrollPieData(flow);

      expect(pie).toEqual([
        { name: SOCIAL_SECURITY_LABEL, y: flow.socialSecurity },
        { name: MEDICARE_LABEL, y: flow.medicare },
        { name: CA_DISABILITY_LABEL, y: flow.caDisability },
      ]);
    });
  });

  describe("isPayrollSankeyNode", () => {
    it("matches the grouped payroll sankey node", () => {
      expect(isPayrollSankeyNode(PAYROLL_NODE_LABEL)).toBe(true);
      expect(isPayrollSankeyNode(SOCIAL_SECURITY_LABEL)).toBe(false);
    });
  });

  describe("buildCategoryPieData", () => {
    it("returns category slices", () => {
      const categories = buildCategoryTotals(
        [
          { name: "Rent", category: "Housing", value: 1000 },
          { name: "Food", category: "Food", value: 500 },
        ],
        sampleIncome,
      );

      const pie = buildCategoryPieData(categories);

      expect(pie).toHaveLength(2);
    });
  });

  describe("buildExpensePieData", () => {
    it("returns line items for a selected category", () => {
      const entries: ExpenseEntry[] = [
        { name: "Rent", category: "Housing", value: 2000 },
        { name: "HOA", category: "Housing", value: 300 },
        { name: "Groceries", category: "Food", value: 400 },
      ];

      const pie = buildExpensePieData("housing", entries, sampleIncome);

      expect(pie).toEqual([
        { name: "Rent", y: 2000 },
        { name: "HOA", y: 300 },
      ]);
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
        "salary + bonus + stock adj",
      );
    });
  });

  describe("isCategorySankeyNode", () => {
    it("matches sankey nodes by category heading", () => {
      const categories = buildCategoryTotals(
        [{ name: "Rent", category: "Housing", value: 2000 }],
        sampleIncome,
      );

      expect(isCategorySankeyNode("HOUSING", categories)).toBe(true);
      expect(isCategorySankeyNode("Fed Tax", categories)).toBe(false);
    });
  });
});
