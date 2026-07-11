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

    render(<ExpenseEntryCard expenseEntry={expenseEntry} onClick={onClick} />);

    expect(screen.getByText("Name: Rent")).toBeInTheDocument();
    expect(screen.getByText("Category: Housing")).toBeInTheDocument();
    expect(screen.getByText("Amount:")).toBeInTheDocument();
    expect(screen.getByText("$2,000.00")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Name: Rent"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders optional color styling", () => {
    render(
      <ExpenseEntryCard
        expenseEntry={expenseEntry}
        color="success"
        onClick={vi.fn()}
      />,
    );

    expect(screen.getByText("$2,000.00")).toBeInTheDocument();
  });
});
