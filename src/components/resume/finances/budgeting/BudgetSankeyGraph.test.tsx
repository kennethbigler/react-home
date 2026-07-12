import { clickSankeyNode } from "./tests/highchartsMocks";
import { render, screen } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import { describe, expect, it, vi } from "vitest";
import themeAtom, { lightTheme } from "../../../../jotai/theme-atom";
import BudgetSankeyGraph from "./BudgetSankeyGraph";
import {
  buildBudgetFlow,
  getLatestBudgetIncome,
  GROSS_INCOME_NODE,
  INCOME_NODE_LABELS,
  PAYROLL_CATEGORY_KEY,
} from "./helpers";
import { PAYROLL_NODE_LABEL } from "../../../../constants/payrollDeductions";

const sampleFlow = buildBudgetFlow(
  getLatestBudgetIncome(100_000, 10_000, 0, 0),
  [{ name: "Rent", category: "Housing", value: 2000 }],
);

describe("resume | finances | budgeting | BudgetSankeyGraph", () => {
  it("renders the budget sankey chart", () => {
    render(
      <Provider>
        <BudgetSankeyGraph flow={sampleFlow} onCategorySelect={vi.fn()} />
      </Provider>,
    );

    expect(screen.getByText("Budget Flow (Annual)")).toBeInTheDocument();
    expect(screen.getByTestId("highcharts-series")).toHaveAttribute(
      "data-type",
      "sankey",
    );
  });

  it("forwards category node clicks to onCategorySelect", () => {
    const onCategorySelect = vi.fn();

    render(
      <Provider>
        <BudgetSankeyGraph
          flow={sampleFlow}
          onCategorySelect={onCategorySelect}
        />
      </Provider>,
    );

    clickSankeyNode({ id: "HOUSING" });

    expect(onCategorySelect).toHaveBeenCalledWith("housing");
  });

  it("clears selection when a tax node is clicked", () => {
    const onCategorySelect = vi.fn();

    render(
      <Provider>
        <BudgetSankeyGraph
          flow={sampleFlow}
          onCategorySelect={onCategorySelect}
        />
      </Provider>,
    );

    clickSankeyNode({ id: "Fed Tax" });

    expect(onCategorySelect).toHaveBeenCalledWith(null);
  });

  it("forwards payroll node clicks to onCategorySelect", () => {
    const onCategorySelect = vi.fn();

    render(
      <Provider>
        <BudgetSankeyGraph
          flow={sampleFlow}
          onCategorySelect={onCategorySelect}
        />
      </Provider>,
    );

    clickSankeyNode({ id: PAYROLL_NODE_LABEL });

    expect(onCategorySelect).toHaveBeenCalledWith(PAYROLL_CATEGORY_KEY);
  });

  it("ignores non-node sankey clicks", () => {
    const onCategorySelect = vi.fn();

    render(
      <Provider>
        <BudgetSankeyGraph
          flow={sampleFlow}
          onCategorySelect={onCategorySelect}
        />
      </Provider>,
    );

    clickSankeyNode({ id: "HOUSING", isNode: false });

    expect(onCategorySelect).not.toHaveBeenCalled();
  });

  it("clears selection when income or gross nodes are clicked", () => {
    const onCategorySelect = vi.fn();

    render(
      <Provider>
        <BudgetSankeyGraph
          flow={sampleFlow}
          onCategorySelect={onCategorySelect}
        />
      </Provider>,
    );

    clickSankeyNode({ id: INCOME_NODE_LABELS.salary });
    clickSankeyNode({ id: GROSS_INCOME_NODE });

    expect(onCategorySelect).toHaveBeenCalledTimes(2);
    expect(onCategorySelect).toHaveBeenNthCalledWith(1, null);
    expect(onCategorySelect).toHaveBeenNthCalledWith(2, null);
  });

  it("renders with light theme title styling", () => {
    const store = createStore();
    store.set(themeAtom, lightTheme);

    render(
      <Provider store={store}>
        <BudgetSankeyGraph flow={sampleFlow} onCategorySelect={vi.fn()} />
      </Provider>,
    );

    expect(screen.getByText("Budget Flow (Annual)")).toBeInTheDocument();
  });

  it("ignores unknown sankey node ids", () => {
    const onCategorySelect = vi.fn();

    render(
      <Provider>
        <BudgetSankeyGraph
          flow={sampleFlow}
          onCategorySelect={onCategorySelect}
        />
      </Provider>,
    );

    clickSankeyNode({ id: "UNKNOWN" });

    expect(onCategorySelect).not.toHaveBeenCalled();
  });

  it("ignores sankey nodes without an id", () => {
    const onCategorySelect = vi.fn();

    render(
      <Provider>
        <BudgetSankeyGraph
          flow={sampleFlow}
          onCategorySelect={onCategorySelect}
        />
      </Provider>,
    );

    clickSankeyNode({ id: "" });

    expect(onCategorySelect).not.toHaveBeenCalled();
  });
});
