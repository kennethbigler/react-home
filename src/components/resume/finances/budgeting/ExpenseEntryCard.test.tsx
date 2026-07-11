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
        expenseEntryCount={3}
        onClick={onClick}
      />,
    );

    expect(screen.getByText("Name: Rent")).toBeInTheDocument();
    expect(screen.getByText("Category: Housing")).toBeInTheDocument();
    expect(screen.getByText("Amount: $2,000.00")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Name: Rent"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it.each([
    { expenseEntryCount: 3, label: "few entries" },
    { expenseEntryCount: 5, label: "more than four entries" },
    { expenseEntryCount: 7, label: "more than six entries" },
  ])("renders with $label", ({ expenseEntryCount }) => {
    render(
      <ExpenseEntryCard
        expenseEntry={expenseEntry}
        expenseEntryCount={expenseEntryCount}
        onClick={vi.fn()}
      />,
    );

    expect(screen.getByText("Amount: $2,000.00")).toBeInTheDocument();
  });
});
