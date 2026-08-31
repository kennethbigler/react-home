import { fireEvent, render, screen } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import { describe, expect, it } from "vitest";
import compCalcAtom from "@/jotai/comp-calc-atom";
import { budgetAtom } from "@/jotai/budget-atom";
import BudgetCharts from "./BudgetCharts";

vi.mock("./graphs/BudgetSankeyGraph", () => ({
  default: ({
    onCategorySelect,
  }: {
    onCategorySelect: (categoryKey: string | null) => void;
  }) => (
    <div data-testid="budget-sankey">
      <button type="button" onClick={() => onCategorySelect("food")}>
        Select Food
      </button>
      <button type="button" onClick={() => onCategorySelect("payroll")}>
        Select Payroll
      </button>
      <button type="button" onClick={() => onCategorySelect("fun")}>
        Select Fun
      </button>
    </div>
  ),
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

const sampleCompEntry = {
  entryDate: "2020-01",
  salary: 100_000,
  bonus: 0,
  stockTick: "AAPL",
  priceThen: 100,
  grantDuration: 4,
  grantQty: 0,
};

const sampleEntries = [
  { name: "Groceries", category: "Food", value: 250 },
  { name: "Dining Out", category: "food", value: 100 },
  { name: "Rent", category: "Housing", value: 2000 },
];

const renderBudgetCharts = ({
  hasCompData = true,
  expenseEntries = sampleEntries,
}: {
  hasCompData?: boolean;
  expenseEntries?: typeof sampleEntries;
} = {}) => {
  const store = createStore();
  if (hasCompData) {
    store.set(compCalcAtom, [sampleCompEntry]);
  }
  store.set(budgetAtom, expenseEntries);

  return render(
    <Provider store={store}>
      <BudgetCharts />
    </Provider>,
  );
};

describe("resume | finances | budgeting | BudgetCharts", () => {
  it("renders sankey and income overview pie", () => {
    renderBudgetCharts();

    expect(screen.getByTestId("budget-sankey")).toBeInTheDocument();
    expect(screen.getByTestId("category-pie")).toHaveTextContent(
      "Income Overview",
    );
  });

  it("shows alert needing both when comp and budget data are missing", () => {
    renderBudgetCharts({
      hasCompData: false,
      expenseEntries: [],
    });

    expect(
      screen.getByText(
        "Add a comp entry in Comp Calculator and budget expenses to see budget flow.",
      ),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("budget-sankey")).not.toBeInTheDocument();
  });

  it("shows comp calculator alert when only budget data exists", () => {
    renderBudgetCharts({
      hasCompData: false,
      expenseEntries: [{ name: "Rent", category: "Housing", value: 2000 }],
    });

    expect(
      screen.getByText(
        "Add a comp entry in Comp Calculator to see budget flow.",
      ),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("budget-sankey")).not.toBeInTheDocument();
  });

  it("shows budget expenses alert when only comp data exists", () => {
    renderBudgetCharts({ expenseEntries: [] });

    expect(
      screen.getByText("Add budget expenses to see budget flow."),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("budget-sankey")).not.toBeInTheDocument();
  });

  it("warns when annual expenses exceed net income", () => {
    renderBudgetCharts({
      expenseEntries: [{ name: "Housing", category: "Housing", value: 20_000 }],
    });

    expect(
      screen.getByText(/Budget is over-allocated by .* per year\./),
    ).toBeInTheDocument();
  });

  it("shows category breakdown when a category is selected on the chart", () => {
    renderBudgetCharts();

    fireEvent.click(screen.getByRole("button", { name: "Select Food" }));

    expect(screen.getByTestId("category-pie")).toHaveTextContent(
      "Food Breakdown",
    );
  });

  it("shows payroll breakdown when payroll is selected on the chart", () => {
    renderBudgetCharts();

    fireEvent.click(screen.getByRole("button", { name: "Select Payroll" }));

    expect(screen.getByTestId("category-pie")).toHaveTextContent(
      "Payroll Breakdown",
    );
  });

  it("hides tax and payroll slices from income overview when hideTaxes is on", () => {
    renderBudgetCharts();

    fireEvent.click(screen.getByRole("switch", { name: "Hide taxes" }));

    expect(screen.getByTestId("category-pie")).toHaveTextContent(
      "Income Overview",
    );
    expect(screen.queryByText("Fed Tax")).not.toBeInTheDocument();
    expect(screen.queryByText("CA Tax")).not.toBeInTheDocument();
    expect(screen.queryByText("Payroll Withholdings")).not.toBeInTheDocument();
    expect(screen.getByText("Food")).toBeInTheDocument();
    expect(screen.getByText("Housing")).toBeInTheDocument();
  });

  it("shows tax and payroll slices in income overview by default", () => {
    renderBudgetCharts();

    expect(screen.getByText("Fed Tax")).toBeInTheDocument();
    expect(screen.getByText("CA Tax")).toBeInTheDocument();
    expect(screen.getByText("Payroll Withholdings")).toBeInTheDocument();
  });

  it("toggles the hide taxes switch", () => {
    renderBudgetCharts();

    const hideTaxesSwitch = screen.getByRole("switch", {
      name: "Hide taxes",
    });
    expect(hideTaxesSwitch).not.toBeChecked();

    fireEvent.click(hideTaxesSwitch);
    expect(hideTaxesSwitch).toBeChecked();
  });

  it("resets selection when the selected category no longer exists", () => {
    renderBudgetCharts({
      expenseEntries: [{ name: "Rent", category: "Housing", value: 2000 }],
    });

    fireEvent.click(screen.getByRole("button", { name: "Select Fun" }));

    expect(screen.getByTestId("category-pie")).toHaveTextContent(
      "Income Overview",
    );
  });
});
