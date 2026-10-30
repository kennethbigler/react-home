import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { createStore, Provider } from "jotai";
import { describe, expect, it } from "vitest";
import compCalcAtom from "@/jotai/comp-calc-atom";
import {
  budgetAtom,
  budgetCategoriesAtom,
  budgetCategoryColorsAtom,
  filingJointlyAtom,
  itemizeDeductionsAtom,
  itemizedDeductionAtom,
  partnerIncomeAtom,
  recommendedBudgetViewAtom,
} from "@/jotai/budget-atom";
import type { ExpenseEntry } from "@/apis/budget";
import BudgetExpenses from "./BudgetExpenses";

const sampleEntries: ExpenseEntry[] = [
  { name: "Groceries", category: "Food", value: 250 },
  { name: "Dining Out", category: "food", value: 100 },
  { name: "Rent", category: "Housing", value: 2000 },
];

const renderBudgetExpenses = (
  entries: ExpenseEntry[] = sampleEntries,
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

const sampleCompEntry = {
  entryDate: "2026-01",
  salary: 120_000,
  bonus: 0,
  stockTick: "",
  priceThen: 0,
  grantDuration: 4,
  grantQty: 0,
};

const selectOption = (label: string, name: string) => {
  fireEvent.mouseDown(screen.getByRole("combobox", { name: label }));
  fireEvent.click(screen.getByRole("option", { name }));
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

    fireEvent.click(
      screen.getByRole("button", { name: "Edit Rent: $2,000.00" }),
    );

    expect(screen.getByText("Edit Expense Entry")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toHaveValue("Rent");
    expect(
      screen.getByRole("combobox", { name: "Category" }),
    ).toHaveTextContent("Housing");
    expect(screen.getByLabelText("Value")).toHaveValue(2000);
  });

  it("renders an edit button for each category", () => {
    renderBudgetExpenses([
      { name: "Electric", category: "Utilities", value: 120 },
    ]);

    expect(
      screen.getByRole("button", { name: "Edit Utilities category" }),
    ).toBeInTheDocument();
  });

  it("shows category columns when comp data is missing", () => {
    renderBudgetExpenses([{ name: "Rent", category: "Housing", value: 2000 }]);

    expect(
      screen.getByRole("heading", { name: "Housing ($2,000.00)" }),
    ).toBeInTheDocument();
  });

  it("warns that percentage expenses require comp data", () => {
    renderBudgetExpenses([
      {
        name: "401k",
        category: "Retirement",
        value: 10,
        valueMode: "percent",
        percentSources: ["salary"],
      },
    ]);

    expect(
      screen.getByText(
        "Add a comp entry to calculate percentage-based expense amounts.",
      ),
    ).toBeInTheDocument();
  });

  it("opens the new expense dialog when the add button is clicked", () => {
    renderBudgetExpenses();

    fireEvent.click(screen.getByRole("button", { name: "+ Expense" }));
    expect(screen.getByText("New Expense Entry")).toBeInTheDocument();
  });

  it("hides partner income fields when filing jointly is off", () => {
    renderBudgetExpenses();

    expect(screen.getByLabelText("Filing jointly MFJ")).not.toBeChecked();
    expect(screen.queryByLabelText("Partner Salary")).not.toBeInTheDocument();
  });

  it("shows partner income fields when filing jointly is enabled", () => {
    const store = createStore();
    store.set(filingJointlyAtom, true);
    store.set(partnerIncomeAtom, {
      salary: 80_000,
      bonus: 5_000,
      stock: 1_000,
    });
    renderBudgetExpenses(sampleEntries, store);

    expect(screen.getByLabelText("Filing jointly MFJ")).toBeChecked();
    expect(screen.getByLabelText("Partner Salary")).toHaveValue(80_000);
    expect(screen.getByLabelText("Partner Bonus")).toHaveValue(5_000);
    expect(screen.getByLabelText("Partner Stock")).toHaveValue(1_000);
  });

  it("updates partner income when fields change", () => {
    const store = createStore();
    store.set(filingJointlyAtom, true);
    renderBudgetExpenses([], store);

    fireEvent.change(screen.getByLabelText("Partner Salary"), {
      target: { value: "90000" },
    });

    expect(store.get(partnerIncomeAtom).salary).toBe(90_000);
  });

  it("rejects negative partner income and itemized deduction values", () => {
    const store = createStore();
    store.set(filingJointlyAtom, true);
    store.set(itemizeDeductionsAtom, true);
    store.set(partnerIncomeAtom, {
      salary: 80_000,
      bonus: 5_000,
      stock: 1_000,
    });
    store.set(itemizedDeductionAtom, 20_000);
    renderBudgetExpenses([], store);

    fireEvent.change(screen.getByLabelText("Partner Salary"), {
      target: { value: "-100" },
    });
    fireEvent.change(screen.getByLabelText("Partner Bonus"), {
      target: { value: "-50" },
    });
    fireEvent.change(screen.getByLabelText("Partner Stock"), {
      target: { value: "-25" },
    });
    fireEvent.change(screen.getByRole("spinbutton", { name: "Deductions" }), {
      target: { value: "-1000" },
    });

    expect(store.get(partnerIncomeAtom)).toEqual({
      salary: 0,
      bonus: 0,
      stock: 0,
    });
    expect(store.get(itemizedDeductionAtom)).toBe(0);
  });

  it("hides deductions field when itemize deductions is off", () => {
    renderBudgetExpenses();

    expect(
      screen.getByRole("switch", { name: "Itemize Deductions" }),
    ).not.toBeChecked();
    expect(
      screen.queryByRole("spinbutton", { name: "Deductions" }),
    ).not.toBeInTheDocument();
  });

  it("shows deductions field when itemize deductions is enabled", () => {
    const store = createStore();
    store.set(itemizeDeductionsAtom, true);
    store.set(itemizedDeductionAtom, 20_000);
    renderBudgetExpenses(sampleEntries, store);

    expect(
      screen.getByRole("switch", { name: "Itemize Deductions" }),
    ).toBeChecked();
    expect(screen.getByRole("spinbutton", { name: "Deductions" })).toHaveValue(
      20_000,
    );
  });

  it("shows an error when deductions are below the standard deduction", () => {
    const store = createStore();
    store.set(itemizeDeductionsAtom, true);
    store.set(itemizedDeductionAtom, 10_000);
    renderBudgetExpenses(sampleEntries, store);

    expect(screen.getByText("Use Standard Deduction")).toBeInTheDocument();
  });

  it("uses the MFJ standard when comparing itemized deductions", () => {
    const store = createStore();
    store.set(filingJointlyAtom, true);
    store.set(itemizeDeductionsAtom, true);
    store.set(itemizedDeductionAtom, 20_000);
    renderBudgetExpenses(sampleEntries, store);

    expect(screen.getByText("Use Standard Deduction")).toBeInTheDocument();
  });

  it("hides the standard deduction error when deductions meet the standard", () => {
    const store = createStore();
    store.set(itemizeDeductionsAtom, true);
    store.set(itemizedDeductionAtom, 20_000);
    renderBudgetExpenses(sampleEntries, store);

    expect(
      screen.queryByText("Use Standard Deduction"),
    ).not.toBeInTheDocument();
  });

  it("updates itemized deduction when the field changes", () => {
    const store = createStore();
    store.set(itemizeDeductionsAtom, true);
    renderBudgetExpenses([], store);

    fireEvent.change(screen.getByRole("spinbutton", { name: "Deductions" }), {
      target: { value: "25000" },
    });

    expect(store.get(itemizedDeductionAtom)).toBe(25_000);
  });

  it("stores zero when itemized deduction input is cleared", () => {
    const store = createStore();
    store.set(itemizeDeductionsAtom, true);
    store.set(itemizedDeductionAtom, 20_000);
    renderBudgetExpenses([], store);

    fireEvent.change(screen.getByRole("spinbutton", { name: "Deductions" }), {
      target: { value: "" },
    });

    expect(store.get(itemizedDeductionAtom)).toBe(0);
  });

  it("toggles itemize deductions on and off", () => {
    const { store } = renderBudgetExpenses();

    fireEvent.click(screen.getByRole("switch", { name: "Itemize Deductions" }));
    expect(store.get(itemizeDeductionsAtom)).toBe(true);
    expect(
      screen.getByRole("spinbutton", { name: "Deductions" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("switch", { name: "Itemize Deductions" }));
    expect(store.get(itemizeDeductionsAtom)).toBe(false);
    expect(
      screen.queryByRole("spinbutton", { name: "Deductions" }),
    ).not.toBeInTheDocument();
  });

  it("toggles filing jointly on and off", () => {
    const { store } = renderBudgetExpenses();

    fireEvent.click(screen.getByRole("switch", { name: "Filing jointly MFJ" }));
    expect(store.get(filingJointlyAtom)).toBe(true);
    expect(screen.getByLabelText("Partner Salary")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("switch", { name: "Filing jointly MFJ" }));
    expect(store.get(filingJointlyAtom)).toBe(false);
    expect(screen.queryByLabelText("Partner Salary")).not.toBeInTheDocument();
  });

  it("stores zero when partner income input is cleared", () => {
    const store = createStore();
    store.set(filingJointlyAtom, true);
    store.set(partnerIncomeAtom, { salary: 80_000, bonus: 0, stock: 0 });
    renderBudgetExpenses([], store);

    fireEvent.change(screen.getByLabelText("Partner Salary"), {
      target: { value: "" },
    });

    expect(store.get(partnerIncomeAtom).salary).toBe(0);
  });

  it("adds an expense entry from the dialog", async () => {
    const store = createStore();
    store.set(budgetCategoriesAtom, [{ name: "Food", recommended: "food" }]);
    renderBudgetExpenses([], store);

    fireEvent.click(screen.getByRole("button", { name: "+ Expense" }));
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Groceries" },
    });
    selectOption("Category", "Food");
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

  it("updates an existing expense from the edit dialog", async () => {
    const { store } = renderBudgetExpenses([
      { name: "Rent", category: "Housing", value: 2000 },
    ]);

    fireEvent.click(
      screen.getByRole("button", { name: "Edit Rent: $2,000.00" }),
    );
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

  it("deletes an expense but keeps its category", async () => {
    const store = createStore();
    store.set(budgetCategoryColorsAtom, { food: "success" });
    renderBudgetExpenses(
      [{ name: "Groceries", category: "Food", value: 250 }],
      store,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Edit Groceries: $250.00" }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    fireEvent.click(screen.getByRole("button", { name: "Delete entry" }));

    await waitFor(() =>
      expect(screen.queryByText("Groceries: $250.00")).toBeNull(),
    );
    expect(store.get(budgetAtom)).toEqual([]);
    expect(store.get(budgetCategoryColorsAtom)).toEqual({ food: "success" });
  });

  it("adds a category from the + Category dialog", async () => {
    const { store } = renderBudgetExpenses([]);

    fireEvent.click(screen.getByRole("button", { name: "+ Category" }));
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "rent" },
    });
    selectOption("Recommended Category", "Housing (25%)");
    selectOption("Color (Optional)", "Success");
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    await waitFor(() => expect(screen.queryByText("New Category")).toBeNull());
    expect(store.get(budgetCategoriesAtom)).toEqual([
      { name: "Rent", recommended: "housing" },
    ]);
    expect(store.get(budgetCategoryColorsAtom)).toEqual({ rent: "success" });
    expect(
      screen.getByRole("heading", { name: "Rent ($0.00)" }),
    ).toBeInTheDocument();
  });

  it("renames a category and moves its expenses and color", async () => {
    const store = createStore();
    store.set(budgetCategoriesAtom, [
      { name: "Housing", recommended: "housing" },
    ]);
    store.set(budgetCategoryColorsAtom, { housing: "success" });
    renderBudgetExpenses(
      [{ name: "Rent", category: "Housing", value: 2000 }],
      store,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Edit Housing category" }),
    );
    expect(screen.getByRole("button", { name: "Delete" })).toBeDisabled();
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Home" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Update" }));

    await waitFor(() =>
      expect(store.get(budgetCategoryColorsAtom)).toEqual({ home: "success" }),
    );
    expect(store.get(budgetCategoriesAtom)).toEqual([
      { name: "Home", recommended: "housing" },
    ]);
    expect(store.get(budgetAtom)).toEqual([
      { name: "Rent", category: "Home", value: 2000 },
    ]);
  });

  it("deletes an unused category and its color", async () => {
    const store = createStore();
    store.set(budgetCategoriesAtom, [
      { name: "Fun", recommended: "recreation" },
    ]);
    store.set(budgetCategoryColorsAtom, { fun: "info" });
    renderBudgetExpenses([], store);

    fireEvent.click(screen.getByRole("button", { name: "Edit Fun category" }));
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    fireEvent.click(screen.getByRole("button", { name: "Delete category" }));

    await waitFor(() => expect(store.get(budgetCategoriesAtom)).toEqual([]));
    expect(store.get(budgetCategoryColorsAtom)).toEqual({});
  });

  it("offers only recommended buckets for expenses in recommended view", async () => {
    const store = createStore();
    store.set(compCalcAtom, [sampleCompEntry]);
    store.set(recommendedBudgetViewAtom, true);
    store.set(budgetCategoriesAtom, [{ name: "Rent", recommended: "housing" }]);
    renderBudgetExpenses(
      [{ name: "Rent", category: "Rent", value: 2000 }],
      store,
    );

    fireEvent.click(screen.getByRole("button", { name: "+ Expense" }));
    fireEvent.mouseDown(screen.getByRole("combobox", { name: "Category" }));
    expect(
      screen.getAllByRole("option").map(({ textContent }) => textContent),
    ).toEqual([
      "Giving",
      "Saving",
      "Housing",
      "Utilities",
      "Food",
      "Transportation",
      "Health",
      "Insurance",
      "Recreation",
      "Personal",
      "Miscellaneous",
    ]);
    fireEvent.click(screen.getByRole("option", { name: "Food" }));
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Groceries" },
    });
    fireEvent.change(screen.getByLabelText("Value"), {
      target: { value: 300 },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    await waitFor(() =>
      expect(screen.queryByText("New Expense Entry")).toBeNull(),
    );
    expect(store.get(budgetAtom)[1]).toMatchObject({ category: "Food" });
    expect(
      screen.getByRole("heading", { name: "Food (10%)" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Groceries: $300.00")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Edit Rent: $2,000.00" }),
    );
    expect(
      screen.getByRole("combobox", { name: "Category" }),
    ).toHaveTextContent("Housing");
  });

  it("asks for comp data when recommended view has none", () => {
    const store = createStore();
    store.set(recommendedBudgetViewAtom, true);
    renderBudgetExpenses(sampleEntries, store);

    expect(
      screen.getByText("Add a comp entry to see recommended budget targets."),
    ).toBeInTheDocument();
  });

  it("regroups categories into recommended buckets when toggled", () => {
    const store = createStore();
    store.set(compCalcAtom, [sampleCompEntry]);
    store.set(budgetCategoriesAtom, [
      { name: "Housing", recommended: "housing" },
    ]);
    renderBudgetExpenses(sampleEntries, store);

    fireEvent.click(
      screen.getByRole("switch", { name: "Show recommended budget" }),
    );

    expect(store.get(recommendedBudgetViewAtom)).toBe(true);
    expect(
      screen.getByRole("heading", { name: "Housing (25%)" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Miscellaneous (5%)" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Groceries: $250.00")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /category$/ }),
    ).not.toBeInTheDocument();
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

    fireEvent.click(
      screen.getByRole("button", { name: "Edit Groceries: $250.00" }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    fireEvent.click(screen.getByRole("button", { name: "Delete entry" }));

    await waitFor(() =>
      expect(screen.queryByText("Groceries: $250.00")).toBeNull(),
    );
    expect(screen.getByText("Dining Out: $100.00")).toBeInTheDocument();
    expect(store.get(budgetCategoryColorsAtom)).toEqual({ food: "success" });
  });
});
