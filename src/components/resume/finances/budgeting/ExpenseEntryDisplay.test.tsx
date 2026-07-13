import { fireEvent, render, screen } from "@testing-library/react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { createStore, Provider } from "jotai";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import { budgetCategoryColorsAtom } from "../../../../jotai/finances-atom";
import ExpenseEntryDisplay from "./ExpenseEntryDisplay";
import { buildBudgetFlow, getLatestBudgetIncome } from "./helpers";

vi.mock("./graphs/BudgetSankeyGraph", () => ({
  default: () => <div data-testid="budget-sankey">Sankey</div>,
}));

vi.mock("./graphs/CategoryBreakdownPie", () => ({
  default: ({
    title,
    data,
  }: {
    title: string;
    data: Array<{ name: string }>;
  }) => (
    <div data-testid="category-pie">
      <span>{title}</span>
      {data.map((point) => (
        <span key={point.name}>{point.name}</span>
      ))}
    </div>
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
        hideTaxes={props.hideTaxes}
        onHideTaxesChange={props.onHideTaxesChange ?? vi.fn()}
        onAddExpense={props.onAddExpense ?? vi.fn()}
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
      screen.getByRole("button", { name: "Food ($350.00)" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Housing ($2,000.00)" }),
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
      screen.getByRole("button", { name: "Housing ($2,000.00)" }),
    ).toBeInTheDocument();
  });

  it("shows category breakdown when a category is selected", () => {
    renderExpenseEntryDisplay({
      selectedCategoryKey: "food",
    });

    expect(screen.getByTestId("category-pie")).toHaveTextContent(
      "Food Breakdown",
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

  it("hides tax and payroll slices from income overview when hideTaxes is true", () => {
    renderExpenseEntryDisplay({ hideTaxes: true });

    expect(screen.getByTestId("category-pie")).toHaveTextContent(
      "Income Overview",
    );
    expect(screen.queryByText("Fed Tax")).not.toBeInTheDocument();
    expect(screen.queryByText("CA Tax")).not.toBeInTheDocument();
    expect(screen.queryByText("Payroll")).not.toBeInTheDocument();
    expect(screen.getByText("Food")).toBeInTheDocument();
    expect(screen.getByText("Housing")).toBeInTheDocument();
  });

  it("shows tax and payroll slices in income overview by default", () => {
    renderExpenseEntryDisplay();

    expect(screen.getByText("Fed Tax")).toBeInTheDocument();
    expect(screen.getByText("CA Tax")).toBeInTheDocument();
    expect(screen.getByText("Payroll")).toBeInTheDocument();
  });

  it("calls onAddExpense when the add button is clicked", () => {
    const onAddExpense = vi.fn();

    renderExpenseEntryDisplay({ onAddExpense });

    fireEvent.click(screen.getByRole("button", { name: "+ Expense" }));
    expect(onAddExpense).toHaveBeenCalledTimes(1);
  });

  it("calls onHideTaxesChange when the hide taxes switch is toggled", () => {
    const onHideTaxesChange = vi.fn();

    renderExpenseEntryDisplay({ onHideTaxesChange });

    fireEvent.click(screen.getByRole("switch", { name: "Hide taxes" }));
    expect(onHideTaxesChange).toHaveBeenCalledWith(true);
  });

  it("shows a placeholder when a selected category has no pie data", () => {
    renderExpenseEntryDisplay({
      selectedCategoryKey: "fun",
      expenseEntries: [{ name: "Rent", category: "Housing", value: 2000 }],
      flow: buildBudgetFlow(getLatestBudgetIncome(100_000, 0, 0, 0), [
        { name: "Rent", category: "Housing", value: 2000 },
      ]),
    });

    expect(
      screen.getByText("Add expenses to see category breakdown."),
    ).toBeInTheDocument();
  });

  it("selects a category when its heading is clicked", () => {
    const onCategorySelect = vi.fn();

    renderExpenseEntryDisplay({ onCategorySelect });

    fireEvent.click(screen.getByRole("button", { name: "Food ($350.00)" }));

    expect(onCategorySelect).toHaveBeenCalledWith("food");
  });

  it("uses theme text color for category headings without a color", () => {
    const darkTheme = createTheme({ palette: { mode: "dark" } });
    const store = createStore();

    render(
      <ThemeProvider theme={darkTheme}>
        <Provider store={store}>
          <ExpenseEntryDisplay
            hasCompData
            flow={buildBudgetFlow(getLatestBudgetIncome(100_000, 0, 0, 0), [
              { name: "Tickets", category: "Fun", value: 50 },
            ])}
            expenseEntries={[{ name: "Tickets", category: "Fun", value: 50 }]}
            selectedCategoryKey={null}
            onAddExpense={vi.fn()}
            onCategorySelect={vi.fn()}
            onClick={vi.fn(() => () => undefined)}
          />
        </Provider>
      </ThemeProvider>,
    );

    const heading = screen.getByRole("button", { name: "Fun ($50.00)" });

    expect(heading).toHaveStyle({ color: darkTheme.palette.text.primary });
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
      screen.getByRole("button", { name: "Utilities ($120.00)" }),
    );
    fireEvent.mouseDown(colorSelect);
    fireEvent.click(screen.getByRole("option", { name: "Default (None)" }));
    expect(store.get(budgetCategoryColorsAtom)).toEqual({});
  });
});
