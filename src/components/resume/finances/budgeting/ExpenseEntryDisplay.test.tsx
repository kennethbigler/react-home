import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "jotai";
import { describe, expect, it, vi } from "vitest";
import ExpenseEntryDisplay from "./ExpenseEntryDisplay";

const renderExpenseEntryDisplay = (
  expenseEntries: Parameters<typeof ExpenseEntryDisplay>[0]["expenseEntries"],
  onClick = vi.fn((index: number) => () => index),
) =>
  render(
    <Provider>
      <ExpenseEntryDisplay expenseEntries={expenseEntries} onClick={onClick} />
    </Provider>,
  );

describe("resume | finances | budgeting | ExpenseEntryDisplay", () => {
  it("groups expenses into category columns with all-caps headings", () => {
    const onClick = vi.fn((index: number) => () => index);

    renderExpenseEntryDisplay(
      [
        { name: "Groceries", category: "Food", value: 250 },
        { name: "Dining Out", category: "food", value: 100 },
        { name: "Rent", category: "Housing", value: 2000 },
      ],
      onClick,
    );

    expect(
      screen.getByRole("heading", { name: "FOOD ($350.00)" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "HOUSING ($2,000.00)" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Name: Groceries")).toBeInTheDocument();
    expect(screen.getByText("Name: Dining Out")).toBeInTheDocument();
    expect(screen.getByText("Name: Rent")).toBeInTheDocument();
  });

  it("preserves entry index when opening an expense", () => {
    const onClick = vi.fn((index: number) => () => index);

    renderExpenseEntryDisplay(
      [
        { name: "Groceries", category: "Food", value: 250 },
        { name: "Rent", category: "Housing", value: 2000 },
      ],
      onClick,
    );

    fireEvent.click(screen.getByText("Name: Rent"));
    expect(onClick).toHaveBeenCalledWith(1);
  });

  it("renders a category color select below each heading", () => {
    renderExpenseEntryDisplay([
      { name: "Electric", category: "Utilities", value: 120 },
    ]);

    expect(screen.getByLabelText("Color")).toBeInTheDocument();
  });
});
