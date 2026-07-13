import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CompEntryCard from "./CompEntryCard";

const baseCompEntry = {
  entryDate: "2020-01",
  salary: 100000,
  bonus: 10000,
  stockTick: "AAPL",
  priceThen: 100,
  grantDuration: 4,
  grantQty: 1000,
};

const baseCompCalcEntry = {
  stock: 50000,
  stockAdj: 55000,
  total: 160000,
  totalAdj: 165000,
  netDiff: 5000,
  grantThen: 100000,
  grantNow: 105000,
};

describe("resume | finances | comp-calc | CompEntryCard", () => {
  it("renders salary, stock grant, and positive net diff details", () => {
    const onClick = vi.fn();

    render(
      <CompEntryCard
        compEntry={baseCompEntry}
        compCalcEntry={baseCompCalcEntry}
        compEntryCount={3}
        onClick={onClick}
      />,
    );

    expect(screen.getByText("Salary")).toBeInTheDocument();
    expect(screen.getByText("Stock Grant")).toBeInTheDocument();
    expect(screen.getByText("Salary: $100,000.00")).toBeInTheDocument();
    expect(screen.getByText("Net:")).toBeInTheDocument();
    expect(screen.getByText("$5,000.00")).toBeInTheDocument();
    expect(screen.getByText("Price: $100.00")).toBeInTheDocument();
    expect(screen.getByText("Grant Qty: 1000")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Salary: $100,000.00"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders negative net diff with error styling branch", () => {
    render(
      <CompEntryCard
        compEntry={baseCompEntry}
        compCalcEntry={{ ...baseCompCalcEntry, netDiff: -2500 }}
        compEntryCount={3}
        onClick={vi.fn()}
      />,
    );

    expect(screen.getByText("-$2,500.00")).toBeInTheDocument();
  });

  it("hides net diff when it is zero", () => {
    render(
      <CompEntryCard
        compEntry={baseCompEntry}
        compCalcEntry={{ ...baseCompCalcEntry, netDiff: 0 }}
        compEntryCount={3}
        onClick={vi.fn()}
      />,
    );

    expect(screen.queryByText("Net:")).toBeNull();
  });

  it("renders salary-only layout without stock grant details", () => {
    render(
      <CompEntryCard
        compEntry={{
          ...baseCompEntry,
          stockTick: "",
          priceThen: 0,
          grantQty: 0,
        }}
        compCalcEntry={baseCompCalcEntry}
        compEntryCount={3}
        onClick={vi.fn()}
      />,
    );

    expect(screen.queryByText("Stock Grant")).toBeNull();
    expect(screen.queryByText("Grant Qty: 1000")).toBeNull();
  });

  it("omits grant details when quantity is zero", () => {
    render(
      <CompEntryCard
        compEntry={{ ...baseCompEntry, grantQty: 0, priceThen: 0 }}
        compCalcEntry={baseCompCalcEntry}
        compEntryCount={3}
        onClick={vi.fn()}
      />,
    );

    expect(screen.getByText("AAPL")).toBeInTheDocument();
    expect(screen.queryByText("Grant Qty: 1000")).toBeNull();
    expect(screen.queryByText("Price: $100.00")).toBeNull();
  });

  it.each([
    { compEntryCount: 3, label: "few entries" },
    { compEntryCount: 5, label: "more than four entries" },
    { compEntryCount: 7, label: "more than six entries" },
  ])("renders with $label", ({ compEntryCount }) => {
    render(
      <CompEntryCard
        compEntry={baseCompEntry}
        compCalcEntry={baseCompCalcEntry}
        compEntryCount={compEntryCount}
        onClick={vi.fn()}
      />,
    );

    expect(screen.getByText("Salary: $100,000.00")).toBeInTheDocument();
  });
});
