import { createTheme, ThemeProvider } from "@mui/material/styles";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import BudgetCategorySection from "./BudgetCategorySection";
import type { CategoryTotal, RecommendedCategoryTotal } from "@/apis/budget";

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
  it("renders heading and expense cards", () => {
    const onExpenseClick = vi.fn(() => vi.fn());

    render(
      <BudgetCategorySection
        category={sampleCategory}
        categoryCount={3}
        onExpenseClick={onExpenseClick}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Food ($350.00)" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Food ($350.00)" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Edit Food category" }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Groceries: $250.00")).toBeInTheDocument();
    expect(screen.getByText("Dining Out: $100.00")).toBeInTheDocument();
  });

  it("opens an expense when its card is clicked", () => {
    const openExpense = vi.fn();
    const onExpenseClick = vi.fn(() => openExpense);

    render(
      <BudgetCategorySection
        category={sampleCategory}
        categoryCount={1}
        onExpenseClick={onExpenseClick}
      />,
    );

    expect(onExpenseClick).toHaveBeenCalledWith(0);
    expect(openExpense).not.toHaveBeenCalled();

    fireEvent.click(
      screen.getByRole("button", { name: "Edit Groceries: $250.00" }),
    );
    expect(openExpense).toHaveBeenCalledTimes(1);
  });

  it("applies category color to the heading when provided", () => {
    render(
      <ThemeProvider theme={theme}>
        <BudgetCategorySection
          category={sampleCategory}
          categoryCount={2}
          categoryColor="success"
          onExpenseClick={vi.fn(() => vi.fn())}
        />
      </ThemeProvider>,
    );

    const heading = screen.getByRole("heading", { name: "Food ($350.00)" });
    expect(heading).toHaveStyle({ color: theme.palette.success.main });
  });

  it.each([1, 2, 3, 4, 6, 12] as const)(
    "supports responsive sizing for categoryCount=%s",
    (categoryCount) => {
      const { container } = render(
        <BudgetCategorySection
          category={sampleCategory}
          categoryCount={categoryCount}
          onExpenseClick={vi.fn(() => vi.fn())}
        />,
      );

      expect(container.firstChild).toBeTruthy();
      expect(
        screen.getByRole("heading", { name: "Food ($350.00)" }),
      ).toBeInTheDocument();
    },
  );

  it("calls onEditCategory from the edit button", () => {
    const onEditCategory = vi.fn();

    render(
      <BudgetCategorySection
        category={sampleCategory}
        categoryCount={1}
        onExpenseClick={vi.fn(() => vi.fn())}
        onEditCategory={onEditCategory}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Edit Food category" }));
    expect(onEditCategory).toHaveBeenCalledTimes(1);
  });

  it.each([
    {
      target: 500,
      remaining: 150,
      overIsGood: false,
      text: "$350.00 of $500.00 · $150.00 left",
      color: "Primary",
    },
    {
      target: 300,
      remaining: -50,
      overIsGood: false,
      text: "$350.00 of $300.00 · $50.00 over",
      color: "Error",
    },
    {
      target: 300,
      remaining: -50,
      overIsGood: true,
      text: "$350.00 of $300.00 · $50.00 over",
      color: "Success",
    },
    {
      target: 0,
      remaining: -350,
      overIsGood: false,
      text: "$350.00 of $0.00 · $350.00 over",
      color: "Error",
    },
  ])(
    "shows $color recommended progress for target $target (overIsGood=$overIsGood)",
    ({ target, remaining, overIsGood, text, color }) => {
      const bucket: RecommendedCategoryTotal = {
        ...sampleCategory,
        percent: 10,
        target,
        remaining,
        overIsGood,
      };

      render(
        <BudgetCategorySection
          category={bucket}
          categoryCount={1}
          onExpenseClick={vi.fn(() => vi.fn())}
        />,
      );

      expect(
        screen.getByRole("heading", { name: "Food (10%)" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("progressbar", { name: "Food spent of target" }),
      ).toHaveClass(`MuiLinearProgress-color${color}`);
      expect(screen.getByText(text)).toBeInTheDocument();
    },
  );
});
