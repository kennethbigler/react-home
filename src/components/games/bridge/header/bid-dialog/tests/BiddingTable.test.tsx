import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import BiddingTable from "../BiddingTable";

describe("games | bridge | BiddingTable", () => {
  it("renders table elements", () => {
    render(<BiddingTable />);

    // BiddingTable renders two tables: one for BalancedHands/UnbalancedHands, one for Overcalls/Overleaf
    const tables = screen.getAllByRole("table");
    expect(tables.length).toBe(2);
  });

  it("renders all three bidding sections", () => {
    render(<BiddingTable />);

    // BalancedHands section - appears in multiple places, use getAllByText
    const balancedTexts = screen.getAllByText(/balanced hands/i);
    expect(balancedTexts.length).toBeGreaterThanOrEqual(1);

    // UnbalancedHands section
    expect(screen.getByText(/unbalanced hands/i)).toBeInTheDocument();

    // Overcalls section - use getAllByRole since "Overcalls" appears in multiple headers
    const overcallsHeadings = screen.getAllByRole("heading", {
      name: /overcalls/i,
    });
    expect(overcallsHeadings.length).toBeGreaterThanOrEqual(1);
  });

  it("has correct table structure with headers", () => {
    render(<BiddingTable />);

    // Check main column headers are present (multiple instances)
    const openingBidsHeadings = screen.getAllByRole("heading", {
      name: /opening bids/i,
    });
    expect(openingBidsHeadings.length).toBeGreaterThanOrEqual(1);

    const respondingBidsHeadings = screen.getAllByRole("heading", {
      name: /responding bids/i,
    });
    expect(respondingBidsHeadings.length).toBeGreaterThanOrEqual(1);

    const openerRebidsHeadings = screen.getAllByRole("heading", {
      name: /opener's rebids/i,
    });
    expect(openerRebidsHeadings.length).toBeGreaterThanOrEqual(1);
  });

  it("renders table cells and rows", () => {
    render(<BiddingTable />);

    // Check that there are table rows
    const rows = screen.getAllByRole("row");
    expect(rows.length).toBeGreaterThan(10);

    // Check for column headers
    const columnHeaders = screen.getAllByRole("columnheader");
    expect(columnHeaders.length).toBeGreaterThan(0);
  });

  it("applies correct styling to the tables", () => {
    render(<BiddingTable />);

    const tables = screen.getAllByRole("table");
    // All tables should have MUI Table class
    tables.forEach((table) => {
      expect(table).toHaveClass("MuiTable-root");
    });
  });

  it("renders point ranges for balanced hands", () => {
    render(<BiddingTable />);

    // These values appear multiple times, so use getAllByText
    const range1214 = screen.getAllByText("12-14");
    expect(range1214.length).toBeGreaterThanOrEqual(1);

    const range1517 = screen.getAllByText("15-17");
    expect(range1517.length).toBeGreaterThanOrEqual(1);

    const range1819 = screen.getAllByText("18-19");
    expect(range1819.length).toBeGreaterThanOrEqual(1);

    const range2021 = screen.getAllByText("20-21");
    expect(range2021.length).toBeGreaterThanOrEqual(1);
  });

  it("renders Hand Valuation section", () => {
    render(<BiddingTable />);

    // Use getAllByRole since there may be multiple matches
    const valuationHeadings = screen.getAllByRole("heading", {
      name: /hand valuation/i,
    });
    expect(valuationHeadings.length).toBeGreaterThanOrEqual(1);

    expect(
      screen.getByText(/ace=4, king=3, queen=2, jack=1/i),
    ).toBeInTheDocument();
  });

  it("renders Contract Limit Guide section", () => {
    render(<BiddingTable />);

    expect(
      screen.getByRole("heading", { name: /contract limit guide/i }),
    ).toBeInTheDocument();

    // These appear multiple times
    const range25 = screen.getAllByText("25+");
    expect(range25.length).toBeGreaterThanOrEqual(1);
  });
});
