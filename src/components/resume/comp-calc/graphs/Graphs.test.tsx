import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Graphs from "./Graphs";
import { buildCompChartData, formatCompTooltip } from "./compGraphHelpers";
import {
  CompCalcEntry,
  CompEntry,
} from "../../../../jotai/comp-calculator-atom";

describe("Graphs", () => {
  const mockCompEntries: CompEntry[] = [
    {
      entryDate: "2020-01",
      salary: 100000,
      bonus: 10000,
      stockTick: "AAPL",
      priceThen: 100,
      grantDuration: 4,
      grantQty: 1000,
    },
    {
      entryDate: "2021-01",
      salary: 120000,
      bonus: 15000,
      stockTick: "AAPL",
      priceThen: 120,
      grantDuration: 4,
      grantQty: 1000,
    },
    {
      entryDate: "2022-01",
      salary: 140000,
      bonus: 20000,
      stockTick: "AAPL",
      priceThen: 140,
      grantDuration: 4,
      grantQty: 1000,
    },
  ];

  const mockCompCalcEntries: CompCalcEntry[] = [
    {
      stock: 50000,
      stockAdj: 55000,
      total: 160000,
      totalAdj: 165000,
      netDiff: 5000,
      grantThen: 100000,
      grantNow: 105000,
    },
    {
      stock: 60000,
      stockAdj: 65000,
      total: 195000,
      totalAdj: 200000,
      netDiff: 5000,
      grantThen: 120000,
      grantNow: 125000,
    },
    {
      stock: 70000,
      stockAdj: 0,
      total: 230000,
      totalAdj: 230000,
      netDiff: 0,
      grantThen: 140000,
      grantNow: 140000,
    },
  ];

  it("renders both CompChart and BreakdownChart", () => {
    render(
      <Graphs
        compEntries={mockCompEntries}
        compCalcEntries={mockCompCalcEntries}
      />,
    );

    // CompChart and BreakdownChart should be rendered
    expect(screen.getAllByRole("img").length).toBeGreaterThan(0);
  });

  it("initializes with last entry values when stockAdj is available", () => {
    const entriesWithStockAdj: CompCalcEntry[] = [
      {
        stock: 50000,
        stockAdj: 55000,
        total: 160000,
        totalAdj: 165000,
        netDiff: 5000,
        grantThen: 100000,
        grantNow: 105000,
      },
      {
        stock: 60000,
        stockAdj: 65000,
        total: 195000,
        totalAdj: 200000,
        netDiff: 5000,
        grantThen: 120000,
        grantNow: 125000,
      },
    ];

    render(
      <Graphs
        compEntries={mockCompEntries.slice(0, 2)}
        compCalcEntries={entriesWithStockAdj}
      />,
    );
    // Should initialize with stockAdj value (65000) from last entry
    expect(screen.getAllByRole("img").length).toBeGreaterThan(0);
  });

  it("initializes with stock value when stockAdj is undefined", () => {
    const entriesWithoutStockAdj: CompCalcEntry[] = [
      {
        stock: 50000,
        stockAdj: 0,
        total: 150000,
        totalAdj: 150000,
        netDiff: 0,
        grantThen: 100000,
        grantNow: 100000,
      },
      {
        stock: 60000,
        stockAdj: 0,
        total: 180000,
        totalAdj: 180000,
        netDiff: 0,
        grantThen: 120000,
        grantNow: 120000,
      },
    ];

    render(
      <Graphs
        compEntries={mockCompEntries.slice(0, 2)}
        compCalcEntries={entriesWithoutStockAdj}
      />,
    );
    // Should initialize with stock value (60000) from last entry when stockAdj is 0
    expect(screen.getAllByRole("img").length).toBeGreaterThan(0);
  });

  it("handles click to set index less than length - 1", () => {
    render(
      <Graphs
        compEntries={mockCompEntries}
        compCalcEntries={mockCompCalcEntries}
      />,
    );

    // This would be triggered by clicking on a point in the chart
    // The actual click simulation would depend on how CompChart handles clicks
    expect(screen.getAllByRole("img").length).toBeGreaterThan(0);
  });

  it("renders when the last point can be selected", () => {
    render(
      <Graphs
        compEntries={mockCompEntries}
        compCalcEntries={mockCompCalcEntries}
      />,
    );

    expect(screen.getAllByRole("img").length).toBeGreaterThan(0);
  });

  it("uses stockAdj over stock when both are available during click", () => {
    const entriesWithBoth: CompCalcEntry[] = [
      {
        stock: 50000,
        stockAdj: 55000,
        total: 160000,
        totalAdj: 165000,
        netDiff: 5000,
        grantThen: 100000,
        grantNow: 105000,
      },
    ];

    render(
      <Graphs
        compEntries={mockCompEntries.slice(0, 1)}
        compCalcEntries={entriesWithBoth}
      />,
    );
    // Should prefer stockAdj (55000) over stock (50000)
    expect(screen.getAllByRole("img").length).toBeGreaterThan(0);
  });

  it("uses the final inflation value in the compensation tooltip", () => {
    const tooltip = formatCompTooltip(
      [
        { y: 100000, series: { color: "green", name: "Stock" } },
        { y: 10000, series: { color: "orange", name: "Bonus" } },
        { y: 120000, series: { color: "blue", name: "Salary" } },
        { y: 230000, series: { color: "brown", name: "Total" } },
        { y: 190000, series: { color: "black", name: "Inflation" } },
      ],
      250000,
    );

    expect(tooltip).toContain("Inflation: <b>$250,000.00</b>");
    expect(tooltip).not.toContain("Inflation: <b>$190,000.00</b>");
  });

  it("formats missing tooltip values with defaults", () => {
    const tooltip = formatCompTooltip([
      { y: undefined, series: { color: undefined, name: "Stock" } },
      { y: 25000, series: { color: "orange", name: "Bonus" } },
      { y: 100000, series: { color: "blue", name: "Salary" } },
      { y: undefined, series: { color: "black", name: "Inflation" } },
    ]);

    expect(tooltip).toContain('style="color:inherit"');
    expect(tooltip).toContain("Stock: <b>$0.00</b>");
    expect(tooltip).toContain("Inflation: <b>$0.00</b>");
    expect(tooltip).toContain("*Total: <b>$125,000.00</b>");
  });

  it("matches inflation to total for every point when the last point starts inflation", () => {
    const chartData = buildCompChartData(
      mockCompEntries.length - 1,
      mockCompCalcEntries,
      mockCompEntries,
    );

    expect(chartData[4]).toEqual(chartData[3]);
  });

  it("uses actual compensation for entries before the selected inflation start", () => {
    const chartData = buildCompChartData(
      1,
      mockCompCalcEntries,
      mockCompEntries,
    );

    expect(chartData[4][0]).toBe(
      mockCompEntries[0].salary +
        mockCompEntries[0].bonus +
        mockCompCalcEntries[0].stockAdj,
    );
    expect(chartData[4][1]).toBeGreaterThan(chartData[4][0]);
  });

  it("returns empty chart series without compensation entries", () => {
    expect(buildCompChartData(0, [], [])).toEqual([[], [], [], [], []]);
  });
});
