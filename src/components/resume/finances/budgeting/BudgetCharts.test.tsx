import { fireEvent, render, screen } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import { describe, expect, it } from "vitest";
import compCalcAtom, { budgetAtom } from "../../../../jotai/finances-atom";
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

  it("shows comp calculator alert when comp data is missing", () => {
    renderBudgetCharts({
      hasCompData: false,
      expenseEntries: [{ name: "Rent", category: "Housing", value: 2000 }],
    });

    expect(
      screen.getByText(/Add a comp entry in Comp Calculator/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Category breakdown requires comp calculator data."),
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

  it("shows income overview when there are no expense categories", () => {
    renderBudgetCharts({ expenseEntries: [] });

    expect(screen.getByTestId("category-pie")).toHaveTextContent(
      "Income Overview",
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

  it("shows a placeholder when a selected category has no pie data", () => {
    renderBudgetCharts({
      expenseEntries: [{ name: "Rent", category: "Housing", value: 2000 }],
    });

    fireEvent.click(screen.getByRole("button", { name: "Select Fun" }));

    expect(
      screen.getByText("Add expenses to see category breakdown."),
    ).toBeInTheDocument();
  });
});
