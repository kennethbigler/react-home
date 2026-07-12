import { fireEvent, render, screen } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import { budgetCategoryColorsAtom } from "../../../../jotai/finances-atom";
import ExpenseEntryDisplay from "./ExpenseEntryDisplay";
import { buildBudgetFlow, getLatestBudgetIncome } from "./helpers";

vi.mock("./BudgetSankeyGraph", () => ({
  default: () => <div data-testid="budget-sankey">Sankey</div>,
}));

vi.mock("./CategoryBreakdownPie", () => ({
  default: ({ title }: { title: string }) => (
    <div data-testid="category-pie">{title}</div>
  ),
}));

const sampleFlow = buildBudgetFlow(getLatestBudgetIncome(100_000, 0, 0, 0), [
  { name: "Groceries", category: "Food", value: 250 },
  { name: "Dining Out", category: "food", value: 100 },
  { name: "Rent", category: "Housing", value: 2000 },
]);

const renderExpenseEntryDisplay = (
  props: Partial<ComponentProps<typeof ExpenseEntryDisplay>> = {},
  onClick = vi.fn((index: number) => () => index),
  store = createStore(),
) => {
  const view = render(
    <Provider store={store}>
      <ExpenseEntryDisplay
        hasCompData={props.hasCompData ?? true}
        flow={props.flow ?? sampleFlow}
        expenseEntries={
          props.expenseEntries ?? [
            { name: "Groceries", category: "Food", value: 250 },
            { name: "Dining Out", category: "food", value: 100 },
            { name: "Rent", category: "Housing", value: 2000 },
          ]
        }
        selectedCategoryKey={props.selectedCategoryKey ?? null}
        onCategorySelect={props.onCategorySelect ?? vi.fn()}
        onClick={onClick}
      />
    </Provider>,
  );

  return { ...view, store };
};

describe("resume | finances | budgeting | ExpenseEntryDisplay", () => {
  it("groups expenses into category columns with resolved totals", () => {
    const onClick = vi.fn((index: number) => () => index);

    renderExpenseEntryDisplay({}, onClick);

    expect(screen.getByTestId("budget-sankey")).toBeInTheDocument();
    expect(screen.getByTestId("category-pie")).toHaveTextContent(
      "Income Overview",
    );
    expect(
      screen.getByRole("heading", { name: "FOOD ($350.00)" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "HOUSING ($2,000.00)" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Groceries: $250.00")).toBeInTheDocument();
    expect(screen.getByText("Dining Out: $100.00")).toBeInTheDocument();
    expect(screen.getByText("Rent: $2,000.00")).toBeInTheDocument();
  });

  it("preserves entry index when opening an expense", () => {
    const onClick = vi.fn((index: number) => () => index);

    renderExpenseEntryDisplay(
      {
        expenseEntries: [
          { name: "Groceries", category: "Food", value: 250 },
          { name: "Rent", category: "Housing", value: 2000 },
        ],
        flow: buildBudgetFlow(getLatestBudgetIncome(100_000, 0, 0, 0), [
          { name: "Groceries", category: "Food", value: 250 },
          { name: "Rent", category: "Housing", value: 2000 },
        ]),
      },
      onClick,
    );

    fireEvent.click(screen.getByRole("button", { name: "Rent: $2,000.00" }));
    expect(onClick).toHaveBeenCalledWith(1);
  });

  it("renders a category color select below each heading", () => {
    renderExpenseEntryDisplay({
      expenseEntries: [{ name: "Electric", category: "Utilities", value: 120 }],
      flow: buildBudgetFlow(getLatestBudgetIncome(100_000, 0, 0, 0), [
        { name: "Electric", category: "Utilities", value: 120 },
      ]),
    });

    expect(screen.getByLabelText("Color (Optional)")).toBeInTheDocument();
  });

  it("shows comp calculator alert when comp data is missing", () => {
    renderExpenseEntryDisplay({
      hasCompData: false,
      flow: null,
      expenseEntries: [{ name: "Rent", category: "Housing", value: 2000 }],
    });

    expect(
      screen.getByText(/Add a comp entry in Comp Calculator/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Category breakdown requires comp calculator data."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "HOUSING ($2,000.00)" }),
    ).toBeInTheDocument();
  });

  it("shows category breakdown when a category is selected", () => {
    renderExpenseEntryDisplay({
      selectedCategoryKey: "food",
    });

    expect(screen.getByTestId("category-pie")).toHaveTextContent(
      "FOOD Breakdown",
    );
  });

  it("shows payroll breakdown when payroll is selected", () => {
    renderExpenseEntryDisplay({
      selectedCategoryKey: "payroll",
    });

    expect(screen.getByTestId("category-pie")).toHaveTextContent(
      "Payroll Breakdown",
    );
  });

  it("shows income overview when there are no expense categories", () => {
    renderExpenseEntryDisplay({
      expenseEntries: [],
      flow: buildBudgetFlow(getLatestBudgetIncome(100_000, 0, 0, 0), []),
    });

    expect(screen.getByTestId("category-pie")).toHaveTextContent(
      "Income Overview",
    );
  });

  it("updates and clears category colors", () => {
    const { store } = renderExpenseEntryDisplay({
      expenseEntries: [{ name: "Electric", category: "Utilities", value: 120 }],
      flow: buildBudgetFlow(getLatestBudgetIncome(100_000, 0, 0, 0), [
        { name: "Electric", category: "Utilities", value: 120 },
      ]),
    });

    const colorSelect = screen.getByRole("combobox", {
      name: "Color (Optional)",
    });

    fireEvent.mouseDown(colorSelect);
    fireEvent.click(screen.getByRole("option", { name: "Success" }));
    expect(store.get(budgetCategoryColorsAtom)).toEqual({
      utilities: "success",
    });

    fireEvent.click(
      screen.getByRole("heading", { name: "UTILITIES ($120.00)" }),
    );
    fireEvent.mouseDown(colorSelect);
    fireEvent.click(screen.getByRole("option", { name: "Default (None)" }));
    expect(store.get(budgetCategoryColorsAtom)).toEqual({});
  });
});
