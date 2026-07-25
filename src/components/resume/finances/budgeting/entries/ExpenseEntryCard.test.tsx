import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ExpenseEntryCard from "./ExpenseEntryCard";

const expenseEntry = {
  name: "Rent",
  category: "Housing",
  value: 2000,
};

describe("resume | finances | budgeting | ExpenseEntryCard", () => {
  it("renders expense details and handles click", () => {
    const onClick = vi.fn();

    render(
      <ExpenseEntryCard
        expenseEntry={expenseEntry}
        resolvedAmount={2000}
        onClick={onClick}
      />,
    );

    expect(screen.getByText("Rent: $2,000.00")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Edit Rent: $2,000.00" }),
    );
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders percent allocation details", () => {
    render(
      <ExpenseEntryCard
        expenseEntry={{
          name: "401k",
          category: "Retirement",
          value: 9,
          valueMode: "percent",
          percentSources: ["salary"],
        }}
        resolvedAmount={750}
        onClick={vi.fn()}
      />,
    );

    expect(
      screen.getByText("401k: $750.00 (9% of salary)"),
    ).toBeInTheDocument();
  });

  it("renders multiple percent income sources", () => {
    render(
      <ExpenseEntryCard
        expenseEntry={{
          name: "401k",
          category: "Retirement",
          value: 9,
          valueMode: "percent",
          percentSources: ["salary", "bonus"],
        }}
        resolvedAmount={900}
        onClick={vi.fn()}
      />,
    );

    expect(
      screen.getByText("401k: $900.00 (9% of salary + bonus)"),
    ).toBeInTheDocument();
  });

  it("renders stock in percent allocation details", () => {
    render(
      <ExpenseEntryCard
        expenseEntry={{
          name: "Invest",
          category: "Investing",
          value: 5,
          valueMode: "percent",
          percentSources: ["stockAdj"],
        }}
        resolvedAmount={100}
        onClick={vi.fn()}
      />,
    );

    expect(
      screen.getByText("Invest: $100.00 (5% of stock)"),
    ).toBeInTheDocument();
  });

  it("renders optional color styling", () => {
    render(
      <ExpenseEntryCard
        expenseEntry={expenseEntry}
        resolvedAmount={2000}
        color="success"
        onClick={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Edit Rent: $2,000.00" }),
    ).toHaveClass("MuiChip-colorSuccess");
  });
});
