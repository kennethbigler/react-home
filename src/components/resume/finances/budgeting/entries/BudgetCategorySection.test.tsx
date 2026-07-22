import { createTheme, ThemeProvider } from "@mui/material/styles";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import BudgetCategorySection from "./BudgetCategorySection";
import type { CategoryTotal } from "../../../../../apis/budget";

const theme = createTheme();

const sampleCategory: CategoryTotal = {
  categoryKey: "food",
  heading: "Food",
  total: 350,
  color: undefined,
  items: [
    {
      expenseEntry: { name: "Groceries", category: "Food", value: 250 },
      index: 0,
      resolvedAmount: 250,
    },
    {
      expenseEntry: { name: "Dining Out", category: "Food", value: 100 },
      index: 1,
      resolvedAmount: 100,
    },
  ],
};

describe("resume | finances | budgeting | BudgetCategorySection", () => {
  it("renders heading, color select, and expense cards", () => {
    const onExpenseClick = vi.fn(() => vi.fn());

    render(
      <BudgetCategorySection
        category={sampleCategory}
        categoryCount={3}
        onExpenseClick={onExpenseClick}
        onCategoryColorChange={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Food ($350.00)" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Food ($350.00)" }),
    ).not.toBeInTheDocument();
    expect(screen.getByLabelText("Color (Optional)")).toBeInTheDocument();
    expect(screen.getByText("Groceries: $250.00")).toBeInTheDocument();
    expect(screen.getByText("Dining Out: $100.00")).toBeInTheDocument();
  });

  it("opens an expense when its card is clicked", () => {
    const onExpenseClick = vi.fn(() => vi.fn());

    render(
      <BudgetCategorySection
        category={sampleCategory}
        categoryCount={1}
        onExpenseClick={onExpenseClick}
        onCategoryColorChange={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Groceries: $250.00" }));
    expect(onExpenseClick).toHaveBeenCalledWith(0);
  });

  it("applies category color to the heading when provided", () => {
    render(
      <ThemeProvider theme={theme}>
        <BudgetCategorySection
          category={sampleCategory}
          categoryCount={2}
          categoryColor="success"
          onExpenseClick={vi.fn(() => vi.fn())}
          onCategoryColorChange={vi.fn()}
        />
      </ThemeProvider>,
    );

    const heading = screen.getByRole("heading", { name: "Food ($350.00)" });
    expect(heading).toHaveStyle({ color: theme.palette.success.main });
  });
});
