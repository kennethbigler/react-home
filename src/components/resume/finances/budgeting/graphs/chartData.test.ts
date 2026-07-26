import { describe, expect, it } from "vitest";
import {
  buildBudgetFlow,
  buildCategoryTotals,
  getLatestBudgetIncome,
  resolveExpenseAmount,
  type ExpenseEntry,
} from "../../../../../apis/budget";
import {
  buildBudgetSankeyData,
  buildCategoryPieData,
  buildExpensePieData,
  buildIncomeOverviewPieData,
  buildPayrollPieData,
  getSankeyNodeClassName,
  getSankeyNodeSum,
  GROSS_INCOME_NODE,
  INCOME_NODE_LABELS,
  isCategorySankeyNode,
  isPayrollSankeyNode,
  partitionBudgetCategoriesForCharts,
  UNALLOCATED_NODE,
} from "./chartData";
import { FEDERAL_TAX_LABEL } from "../../../../../constants/federalTaxBrackets";
import { STATE_TAX_LABEL } from "../../../../../constants/caStateTaxBrackets";
import {
  CA_DISABILITY_LABEL,
  MEDICARE_LABEL,
  PAYROLL_NODE_LABEL,
  PAYROLL_WITHHOLDINGS_LABEL,
  SOCIAL_SECURITY_LABEL,
} from "../../../../../constants/payrollDeductions";

const sampleIncome = getLatestBudgetIncome(100_000, 20_000, 1_000, 2_000);

const sankeyNodeColors = {
  salary: "#a",
  bonus: "#b",
  stockAdj: "#c",
  partnerSalary: "#aa",
  partnerBonus: "#bb",
  partnerStockAdj: "#cc",
  gross: "#d",
  federalTax: "#e",
  stateTax: "#f",
  payroll: "#i",
  unallocated: "#g",
  category: () => "#h",
};

describe("resume | finances | budgeting | graphs | chartData", () => {
  it("annualizes pre-tax percent expenses in the sankey", () => {
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

  it("annualizes post-tax percent expenses using net income", () => {
    const income = getLatestBudgetIncome(282_000, 50_000, 0, 32_281.78);
    const entry: ExpenseEntry = {
      name: "Invest",
      category: "Investing",
      value: 100,
      valueMode: "percent",
      percentSources: ["stockAdj"],
      taxBasis: "posttax",
    };
    const flow = buildBudgetFlow(income, [entry]);
    const monthly = resolveExpenseAmount(entry, income, flow.net);
    const { data } = buildBudgetSankeyData(flow, sankeyNodeColors);
    const expectedAnnual = (32_281.78 * flow.net) / income.gross;

    expect(monthly).toBeCloseTo(expectedAnnual / 12, 2);
    expect(data.find((link) => link.to === "Investing")?.weight).toBeCloseTo(
      expectedAnnual,
      2,
    );
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

      expect(data.find((link) => link.to === "Housing")?.weight).toBe(36_000);
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
      expect(data.some((link) => link.to === "Spend")).toBe(false);
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

    it("adds partner income links into Income when non-zero", () => {
      const income = getLatestBudgetIncome(100_000, 0, 0, 0, {
        salary: 80_000,
        bonus: 10_000,
        stock: 5_000,
      });
      const flow = buildBudgetFlow(income, [], {}, "mfj");
      const { data } = buildBudgetSankeyData(flow, sankeyNodeColors);

      expect(getSankeyNodeSum(INCOME_NODE_LABELS.salary, data)).toBe(100_000);
      expect(getSankeyNodeSum(INCOME_NODE_LABELS.partnerSalary, data)).toBe(
        80_000,
      );
      expect(getSankeyNodeSum(INCOME_NODE_LABELS.partnerBonus, data)).toBe(
        10_000,
      );
      expect(getSankeyNodeSum(INCOME_NODE_LABELS.partnerStockAdj, data)).toBe(
        5_000,
      );
      expect(data.filter((link) => link.to === FEDERAL_TAX_LABEL)).toHaveLength(
        1,
      );
      expect(data.filter((link) => link.to === STATE_TAX_LABEL)).toHaveLength(
        1,
      );
      expect(
        data.filter(
          (link) =>
            link.to === PAYROLL_NODE_LABEL && link.from === GROSS_INCOME_NODE,
        ).length,
      ).toBeGreaterThanOrEqual(1);
    });

    it("omits partner income links when partner amounts are zero", () => {
      const flow = buildBudgetFlow(sampleIncome, []);
      const { data } = buildBudgetSankeyData(flow, sankeyNodeColors);

      expect(
        data.some((link) => link.from === INCOME_NODE_LABELS.partnerSalary),
      ).toBe(false);
      expect(
        data.some((link) => link.from === INCOME_NODE_LABELS.partnerBonus),
      ).toBe(false);
      expect(
        data.some((link) => link.from === INCOME_NODE_LABELS.partnerStockAdj),
      ).toBe(false);
    });

    it("omits payroll link when gross income is zero", () => {
      const income = getLatestBudgetIncome(0, 0, 0, 0);
      const flow = buildBudgetFlow(income, []);
      const { data } = buildBudgetSankeyData(flow, sankeyNodeColors);

      expect(data.some((link) => link.to === PAYROLL_NODE_LABEL)).toBe(false);
    });

    it("routes payroll expenses into the Payroll node just below withholdings", () => {
      const flow = buildBudgetFlow(sampleIncome, [
        { name: "Groceries", category: "Food", value: 400 },
        { name: "Rent", category: "Housing", value: 3000 },
        { name: "401k", category: "Payroll", value: 500 },
        { name: "Transit", category: "Transport", value: 200 },
      ]);
      const { nodes, data } = buildBudgetSankeyData(flow, sankeyNodeColors);
      const column2NodeIds = nodes
        .filter((node) => node.column === 2)
        .map((node) => node.id);
      const incomeLinkTargets = data
        .filter((link) => link.from === GROSS_INCOME_NODE)
        .map((link) => link.to);
      const payrollLinkIndexes = incomeLinkTargets
        .map((target, index) => (target === PAYROLL_NODE_LABEL ? index : -1))
        .filter((index) => index >= 0);

      expect(column2NodeIds.filter((id) => id === PAYROLL_NODE_LABEL)).toEqual([
        PAYROLL_NODE_LABEL,
      ]);
      expect(column2NodeIds.indexOf(FEDERAL_TAX_LABEL)).toBeLessThan(
        column2NodeIds.indexOf(STATE_TAX_LABEL),
      );
      expect(column2NodeIds.indexOf(STATE_TAX_LABEL)).toBeLessThan(
        column2NodeIds.indexOf(PAYROLL_NODE_LABEL),
      );
      expect(column2NodeIds.indexOf(PAYROLL_NODE_LABEL)).toBeLessThan(
        column2NodeIds.indexOf("Housing"),
      );
      expect(column2NodeIds.indexOf("Housing")).toBeLessThan(
        column2NodeIds.indexOf("Food"),
      );
      expect(column2NodeIds.indexOf("Food")).toBeLessThan(
        column2NodeIds.indexOf("Transport"),
      );
      expect(payrollLinkIndexes).toHaveLength(2);
      expect(payrollLinkIndexes[1]).toBe(payrollLinkIndexes[0]! + 1);
      expect(incomeLinkTargets.indexOf("Housing")).toBe(
        payrollLinkIndexes[1]! + 1,
      );
      expect(getSankeyNodeSum(PAYROLL_NODE_LABEL, data)).toBeCloseTo(
        flow.totalPayrollDeductions + 500 * 12,
        2,
      );
    });
  });

  describe("partitionBudgetCategoriesForCharts", () => {
    it("pins payroll and sorts other categories by total descending", () => {
      const categories = buildCategoryTotals(
        [
          { name: "Groceries", category: "Food", value: 400 },
          { name: "401k", category: "Payroll", value: 500 },
          { name: "Rent", category: "Housing", value: 3000 },
        ],
        sampleIncome,
      );
      const { payrollCategory, otherCategories } =
        partitionBudgetCategoriesForCharts(categories);

      expect(payrollCategory?.categoryKey).toBe("payroll");
      expect(otherCategories.map(({ heading }) => heading)).toEqual([
        "Housing",
        "Food",
      ]);
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
          PAYROLL_WITHHOLDINGS_LABEL,
          "Housing",
          UNALLOCATED_NODE,
        ]),
      );
      expect(pie.find(({ name }) => name === "Housing")?.y).toBe(24_000);
    });

    it("orders withholdings, then categories by total including payroll", () => {
      const flow = buildBudgetFlow(sampleIncome, [
        { name: "Groceries", category: "Food", value: 400 },
        { name: "Rent", category: "Housing", value: 3000 },
        { name: "401k", category: "Payroll", value: 500 },
      ]);
      const pieNames = buildIncomeOverviewPieData(flow).map(({ name }) => name);
      const withholdingsPayroll = pieNames.indexOf(PAYROLL_WITHHOLDINGS_LABEL);
      const categoryPayroll = pieNames.indexOf("Payroll");

      expect(pieNames.indexOf(FEDERAL_TAX_LABEL)).toBeLessThan(
        pieNames.indexOf(STATE_TAX_LABEL),
      );
      expect(pieNames.indexOf(STATE_TAX_LABEL)).toBeLessThan(
        withholdingsPayroll,
      );
      expect(withholdingsPayroll).toBeLessThan(pieNames.indexOf("Housing"));
      expect(pieNames.indexOf("Housing")).toBeLessThan(categoryPayroll);
      expect(categoryPayroll).toBeLessThan(pieNames.indexOf("Food"));
      expect(
        pieNames.filter((name) => name === PAYROLL_WITHHOLDINGS_LABEL),
      ).toHaveLength(1);
      expect(pieNames.filter((name) => name === "Payroll")).toHaveLength(1);
    });

    it("includes withholdings even when there are no expense categories", () => {
      const flow = buildBudgetFlow(sampleIncome, []);
      const pie = buildIncomeOverviewPieData(flow);

      expect(pie.map(({ name }) => name)).toEqual(
        expect.arrayContaining([
          FEDERAL_TAX_LABEL,
          STATE_TAX_LABEL,
          PAYROLL_WITHHOLDINGS_LABEL,
          UNALLOCATED_NODE,
        ]),
      );
    });

    it("omits taxes and payroll when hideTaxes is true", () => {
      const flow = buildBudgetFlow(sampleIncome, [
        { name: "Rent", category: "Housing", value: 2000 },
      ]);
      const pie = buildIncomeOverviewPieData(flow, { hideTaxes: true });

      expect(pie.map(({ name }) => name)).not.toContain(FEDERAL_TAX_LABEL);
      expect(pie.map(({ name }) => name)).not.toContain(STATE_TAX_LABEL);
      expect(pie.map(({ name }) => name)).not.toContain(
        PAYROLL_WITHHOLDINGS_LABEL,
      );
      expect(pie.map(({ name }) => name)).toEqual(
        expect.arrayContaining(["Housing", UNALLOCATED_NODE]),
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
      expect(pie.some(({ name }) => name === "Spend")).toBe(true);
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

    it("appends user payroll expenses after withholdings", () => {
      const flow = buildBudgetFlow(sampleIncome, [
        { name: "401k", category: "Payroll", value: 500 },
      ]);
      const pie = buildPayrollPieData(flow);

      expect(pie.slice(0, 3)).toEqual([
        { name: SOCIAL_SECURITY_LABEL, y: flow.socialSecurity },
        { name: MEDICARE_LABEL, y: flow.medicare },
        { name: CA_DISABILITY_LABEL, y: flow.caDisability },
      ]);
      expect(pie[3]).toEqual({ name: "401k", y: 6000 });
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

  describe("isCategorySankeyNode", () => {
    it("matches sankey nodes by category heading", () => {
      const categories = buildCategoryTotals(
        [{ name: "Rent", category: "Housing", value: 2000 }],
        sampleIncome,
      );

      expect(isCategorySankeyNode("Housing", categories)).toBe(true);
      expect(isCategorySankeyNode("Fed Tax", categories)).toBe(false);
    });

    it("does not treat the payroll category heading as a category node", () => {
      const categories = buildCategoryTotals(
        [{ name: "401k", category: "Payroll", value: 500 }],
        sampleIncome,
      );

      expect(isCategorySankeyNode("Payroll", categories)).toBe(false);
    });
  });

  describe("getSankeyNodeClassName", () => {
    const categories = buildCategoryTotals(
      [{ name: "Rent", category: "Housing", value: 2000 }],
      sampleIncome,
    );

    it("returns selected class for a matching category node", () => {
      expect(getSankeyNodeClassName("Housing", categories, "housing")).toBe(
        "budget-sankey-selected",
      );
    });

    it("returns selected class for payroll when payroll is selected", () => {
      expect(
        getSankeyNodeClassName(PAYROLL_NODE_LABEL, categories, "payroll"),
      ).toBe("budget-sankey-selected");
    });

    it("returns undefined when nothing is selected", () => {
      expect(
        getSankeyNodeClassName("Housing", categories, null),
      ).toBeUndefined();
      expect(getSankeyNodeClassName("Housing", categories)).toBeUndefined();
    });

    it("returns undefined when another category is selected", () => {
      expect(
        getSankeyNodeClassName("Housing", categories, "food"),
      ).toBeUndefined();
    });
  });
});
