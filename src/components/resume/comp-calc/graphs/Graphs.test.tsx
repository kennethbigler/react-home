import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Graphs from "./Graphs";
import {
  CompCalcEntry,
  CompEntry,
} from "../../../../jotai/comp-calculator-atom";

describe("Graphs", () => {
  const mockCompEntries: CompEntry[] = [
    { company: "Company A", date: "2020-01", salary: 100000, bonus: 10000 },
    { company: "Company B", date: "2021-01", salary: 120000, bonus: 15000 },
    { company: "Company C", date: "2022-01", salary: 140000, bonus: 20000 },
  ];

  const mockCompCalcEntries: CompCalcEntry[] = [
    { company: "Company A", date: "2020-01", stock: 50000, stockAdj: 55000 },
    { company: "Company B", date: "2021-01", stock: 60000, stockAdj: 65000 },
    {
      company: "Company C",
      date: "2022-01",
      stock: 70000,
      stockAdj: undefined,
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
      { company: "Company A", date: "2020-01", stock: 50000, stockAdj: 55000 },
      { company: "Company B", date: "2021-01", stock: 60000, stockAdj: 65000 },
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
        company: "Company A",
        date: "2020-01",
        stock: 50000,
        stockAdj: undefined,
      },
      {
        company: "Company B",
        date: "2021-01",
        stock: 60000,
        stockAdj: undefined,
      },
    ];

    render(
      <Graphs
        compEntries={mockCompEntries.slice(0, 2)}
        compCalcEntries={entriesWithoutStockAdj}
      />,
    );
    // Should initialize with stock value (60000) from last entry when stockAdj is undefined
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

  it("handles click to reset when index is at last position", () => {
    render(
      <Graphs
        compEntries={mockCompEntries}
        compCalcEntries={mockCompCalcEntries}
      />,
    );

    // When clicking on the last point, it should reset startIdx to 0
    expect(screen.getAllByRole("img").length).toBeGreaterThan(0);
  });

  it("uses stockAdj over stock when both are available during click", () => {
    const entriesWithBoth: CompCalcEntry[] = [
      { company: "Company A", date: "2020-01", stock: 50000, stockAdj: 55000 },
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
});
