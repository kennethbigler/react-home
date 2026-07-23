import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { createStore, Provider } from "jotai";
import { describe, expect, it } from "vitest";
import {
  budgetAtom,
  budgetCategoryColorsAtom,
} from "../../../../../jotai/finances-atom";
import BudgetExpenses from "./BudgetExpenses";

const sampleEntries = [
  { name: "Groceries", category: "Food", value: 250 },
  { name: "Dining Out", category: "food", value: 100 },
  { name: "Rent", category: "Housing", value: 2000 },
];

const renderBudgetExpenses = (
  entries = sampleEntries,
  store = createStore(),
) => {
  store.set(budgetAtom, entries);
  const view = render(
    <Provider store={store}>
      <BudgetExpenses />
    </Provider>,
  );

  return { ...view, store };
};

describe("resume | finances | budgeting | BudgetExpenses", () => {
  it("groups expenses into category columns with resolved totals", () => {
    renderBudgetExpenses();

    expect(
      screen.getByRole("heading", { name: "Food ($350.00)" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Housing ($2,000.00)" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Groceries: $250.00")).toBeInTheDocument();
    expect(screen.getByText("Dining Out: $100.00")).toBeInTheDocument();
    expect(screen.getByText("Rent: $2,000.00")).toBeInTheDocument();
  });

  it("opens the selected expense in the edit dialog", () => {
    renderBudgetExpenses([
      { name: "Groceries", category: "Food", value: 250 },
      { name: "Rent", category: "Housing", value: 2000 },
    ]);

    fireEvent.click(screen.getByRole("button", { name: "Rent: $2,000.00" }));

    expect(screen.getByText("Edit Expense Entry")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toHaveValue("Rent");
    expect(screen.getByLabelText("Category")).toHaveValue("Housing");
    expect(screen.getByLabelText("Value")).toHaveValue(2000);
  });

  it("renders a category color select below each heading", () => {
    renderBudgetExpenses([
      { name: "Electric", category: "Utilities", value: 120 },
    ]);

    expect(screen.getByLabelText("Color (Optional)")).toBeInTheDocument();
  });

  it("shows category columns when comp data is missing", () => {
    renderBudgetExpenses([{ name: "Rent", category: "Housing", value: 2000 }]);

    expect(
      screen.getByRole("heading", { name: "Housing ($2,000.00)" }),
    ).toBeInTheDocument();
  });

  it("opens the new expense dialog when the add button is clicked", () => {
    renderBudgetExpenses();

    fireEvent.click(screen.getByRole("button", { name: "+ Expense" }));
    expect(screen.getByText("New Expense Entry")).toBeInTheDocument();
  });

  it("adds an expense entry from the dialog", async () => {
    const { store } = renderBudgetExpenses([]);

    fireEvent.click(screen.getByRole("button", { name: "+ Expense" }));
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Groceries" },
    });
    fireEvent.change(screen.getByLabelText("Category"), {
      target: { value: "Food" },
    });
    fireEvent.change(screen.getByLabelText("Value"), {
      target: { value: 250 },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    await waitFor(() =>
      expect(screen.queryByText("New Expense Entry")).toBeNull(),
    );
    expect(screen.getByText("Groceries: $250.00")).toBeInTheDocument();
    expect(store.get(budgetAtom)).toEqual([
      { name: "Groceries", category: "Food", value: 250, valueMode: "dollar" },
    ]);
  });

  it("renders category headings as non-interactive text", () => {
    renderBudgetExpenses();

    expect(
      screen.queryByRole("button", { name: "Food ($350.00)" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Food ($350.00)" }),
    ).toBeInTheDocument();
  });

  it("renders category headings without a color", () => {
    const darkTheme = createTheme({ palette: { mode: "dark" } });
    const store = createStore();
    store.set(budgetAtom, [{ name: "Tickets", category: "Fun", value: 50 }]);

    render(
      <ThemeProvider theme={darkTheme}>
        <Provider store={store}>
          <BudgetExpenses />
        </Provider>
      </ThemeProvider>,
    );

    expect(
      screen.getByRole("heading", { name: "Fun ($50.00)" }),
    ).toBeInTheDocument();
  });

  it("updates and clears category colors", () => {
    const { store } = renderBudgetExpenses([
      { name: "Electric", category: "Utilities", value: 120 },
    ]);

    const colorSelect = screen.getByRole("combobox", {
      name: "Color (Optional)",
    });

    fireEvent.mouseDown(colorSelect);
    fireEvent.click(screen.getByRole("option", { name: "Success" }));
    expect(store.get(budgetCategoryColorsAtom)).toEqual({
      utilities: "success",
    });

    fireEvent.mouseDown(colorSelect);
    fireEvent.click(screen.getByRole("option", { name: "Default (None)" }));
    expect(store.get(budgetCategoryColorsAtom)).toEqual({});
  });

  it("deletes an expense and clears its category color when last in category", async () => {
    const store = createStore();
    store.set(budgetCategoryColorsAtom, { food: "success" });
    renderBudgetExpenses(
      [{ name: "Groceries", category: "Food", value: 250 }],
      store,
    );

    fireEvent.click(screen.getByRole("button", { name: "Groceries: $250.00" }));
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() =>
      expect(screen.queryByText("Groceries: $250.00")).toBeNull(),
    );
    expect(store.get(budgetAtom)).toEqual([]);
    expect(store.get(budgetCategoryColorsAtom)).toEqual({});
  });

  it("updates an existing expense from the edit dialog", async () => {
    const { store } = renderBudgetExpenses([
      { name: "Rent", category: "Housing", value: 2000 },
    ]);

    fireEvent.click(screen.getByRole("button", { name: "Rent: $2,000.00" }));
    fireEvent.change(screen.getByLabelText("Value"), {
      target: { value: 2100 },
    });
    fireEvent.click(screen.getByRole("button", { name: "Update" }));

    await waitFor(() =>
      expect(screen.getByText("Rent: $2,100.00")).toBeInTheDocument(),
    );
    expect(store.get(budgetAtom)).toEqual([
      expect.objectContaining({
        name: "Rent",
        category: "Housing",
        value: 2100,
      }),
    ]);
  });

  it("keeps category color when deleting one expense from a multi-item category", async () => {
    const store = createStore();
    store.set(budgetCategoryColorsAtom, { food: "success" });
    renderBudgetExpenses(
      [
        { name: "Groceries", category: "Food", value: 250 },
        { name: "Dining Out", category: "Food", value: 100 },
      ],
      store,
    );

    fireEvent.click(screen.getByRole("button", { name: "Groceries: $250.00" }));
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() =>
      expect(screen.queryByText("Groceries: $250.00")).toBeNull(),
    );
    expect(screen.getByText("Dining Out: $100.00")).toBeInTheDocument();
    expect(store.get(budgetCategoryColorsAtom)).toEqual({ food: "success" });
  });
});
