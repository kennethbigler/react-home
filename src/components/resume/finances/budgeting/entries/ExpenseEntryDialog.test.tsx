import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ExpenseEntryDialog from "./ExpenseEntryDialog";

describe("resume | finances | budgeting | ExpenseEntryDialog", () => {
  it("submits a dollar expense and resets the form", () => {
    const addExpenseEntry = vi.fn();
    const onClose = vi.fn();

    render(
      <ExpenseEntryDialog
        open
        addExpenseEntry={addExpenseEntry}
        onClose={onClose}
      />,
    );

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Groceries" },
    });
    fireEvent.change(screen.getByLabelText("Category"), {
      target: { value: "Food" },
    });
    fireEvent.change(screen.getByLabelText("Value"), {
      target: { value: "250" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(addExpenseEntry).toHaveBeenCalledWith({
      name: "Groceries",
      category: "Food",
      value: 250,
      valueMode: "dollar",
    });
    expect(screen.getByLabelText("Name")).toHaveValue("");
  });

  it("allows clearing the value field and submits empty as 0", () => {
    const addExpenseEntry = vi.fn();

    render(
      <ExpenseEntryDialog
        open
        addExpenseEntry={addExpenseEntry}
        onClose={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Rent" },
    });
    fireEvent.change(screen.getByLabelText("Category"), {
      target: { value: "Housing" },
    });
    fireEvent.change(screen.getByLabelText("Value"), {
      target: { value: "2000" },
    });
    fireEvent.change(screen.getByLabelText("Value"), {
      target: { value: "" },
    });
    expect(screen.getByLabelText("Value")).toHaveValue(null);

    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(addExpenseEntry).toHaveBeenCalledWith({
      name: "Rent",
      category: "Housing",
      value: 0,
      valueMode: "dollar",
    });
  });

  it("title-cases the category when submitting", () => {
    const addExpenseEntry = vi.fn();

    render(
      <ExpenseEntryDialog
        open
        addExpenseEntry={addExpenseEntry}
        onClose={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Tickets" },
    });
    fireEvent.change(screen.getByLabelText("Category"), {
      target: { value: "fun" },
    });
    fireEvent.change(screen.getByLabelText("Value"), {
      target: { value: "50" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(addExpenseEntry).toHaveBeenCalledWith(
      expect.objectContaining({ category: "Fun" }),
    );
  });

  it("submits a percent expense with default salary source", () => {
    const addExpenseEntry = vi.fn();

    render(
      <ExpenseEntryDialog
        open
        addExpenseEntry={addExpenseEntry}
        onClose={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "401k" },
    });
    fireEvent.change(screen.getByLabelText("Category"), {
      target: { value: "Retirement" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Percent of income/i }));
    fireEvent.change(screen.getByLabelText("Value"), {
      target: { value: "9" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(addExpenseEntry).toHaveBeenCalledWith({
      name: "401k",
      category: "Retirement",
      value: 9,
      valueMode: "percent",
      percentSources: ["salary"],
      taxBasis: "posttax",
    });
  });

  it("submits percent updates with multiple income sources", () => {
    const addExpenseEntry = vi.fn();

    render(
      <ExpenseEntryDialog
        open
        expenseEntry={{
          name: "401k",
          category: "Retirement",
          value: 9,
          valueMode: "percent",
          percentSources: ["salary", "bonus"],
        }}
        addExpenseEntry={addExpenseEntry}
        onClose={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Update" }));

    expect(addExpenseEntry).toHaveBeenCalledWith({
      name: "401k",
      category: "Retirement",
      value: 9,
      valueMode: "percent",
      percentSources: ["salary", "bonus"],
      taxBasis: "posttax",
    });
  });

  it("submits pre-tax percent expenses when selected", () => {
    const addExpenseEntry = vi.fn();

    render(
      <ExpenseEntryDialog
        open
        addExpenseEntry={addExpenseEntry}
        onClose={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "401k" },
    });
    fireEvent.change(screen.getByLabelText("Category"), {
      target: { value: "Retirement" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Percent of income/i }));
    fireEvent.change(screen.getByLabelText("Value"), {
      target: { value: "9" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Pre-tax" }));
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(addExpenseEntry).toHaveBeenCalledWith({
      name: "401k",
      category: "Retirement",
      value: 9,
      valueMode: "percent",
      percentSources: ["salary"],
      taxBasis: "pretax",
    });
  });

  it("defaults tax basis to post-tax in percent mode", () => {
    render(
      <ExpenseEntryDialog open addExpenseEntry={vi.fn()} onClose={vi.fn()} />,
    );

    expect(
      screen.queryByRole("button", { name: "Post-tax" }),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Percent of income/i }));

    expect(screen.getByRole("button", { name: "Post-tax" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("prefills pre-tax tax basis when editing", () => {
    render(
      <ExpenseEntryDialog
        open
        expenseEntry={{
          name: "401k",
          category: "Retirement",
          value: 9,
          valueMode: "percent",
          percentSources: ["salary"],
          taxBasis: "pretax",
        }}
        addExpenseEntry={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "Pre-tax" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("shows income sources when percent mode is selected", () => {
    render(
      <ExpenseEntryDialog open addExpenseEntry={vi.fn()} onClose={vi.fn()} />,
    );

    expect(screen.queryByLabelText("Income Sources")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Percent of income/i }));
    expect(screen.getByLabelText("Income Sources")).toBeInTheDocument();
  });

  it("prefills edit values from a legacy percent source", () => {
    render(
      <ExpenseEntryDialog
        open
        expenseEntry={{
          name: "401k",
          category: "Retirement",
          value: 9,
          valueMode: "percent",
          percentSource: "bonus",
        }}
        addExpenseEntry={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByText("Edit Expense Entry")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toHaveValue("401k");
    expect(screen.getByLabelText("Category")).toHaveValue("Retirement");
    expect(screen.getByLabelText("Value")).toHaveValue(9);
    expect(screen.getByLabelText("Income Sources")).toHaveTextContent("Bonus");
  });

  it("blocks submit when dollar amount is negative", () => {
    render(
      <ExpenseEntryDialog open addExpenseEntry={vi.fn()} onClose={vi.fn()} />,
    );

    fireEvent.change(screen.getByLabelText("Value"), {
      target: { value: "-50" },
    });

    expect(
      screen.getByText("Amount must be zero or greater."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add" })).toBeDisabled();
  });

  it("blocks submit when percent is outside 0 to 100", () => {
    render(
      <ExpenseEntryDialog open addExpenseEntry={vi.fn()} onClose={vi.fn()} />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Percent of income/i }));
    fireEvent.change(screen.getByLabelText("Value"), {
      target: { value: "150" },
    });

    expect(
      screen.getByText("Percent must be between 0 and 100."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add" })).toBeDisabled();
  });

  it("requires at least one income source in percent mode", () => {
    render(
      <ExpenseEntryDialog open addExpenseEntry={vi.fn()} onClose={vi.fn()} />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Percent of income/i }));
    fireEvent.mouseDown(screen.getByLabelText("Income Sources"));
    fireEvent.click(screen.getByRole("option", { name: "Salary" }));

    expect(
      screen.getByText("Select at least one income source."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add", hidden: true }),
    ).toBeDisabled();
  });

  it("calls onClose when cancel is clicked", () => {
    const onClose = vi.fn();

    render(
      <ExpenseEntryDialog open addExpenseEntry={vi.fn()} onClose={onClose} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("shows delete when editing and calls onDelete", () => {
    const onDelete = vi.fn();

    render(
      <ExpenseEntryDialog
        open
        expenseEntry={{
          name: "Rent",
          category: "Housing",
          value: 2000,
        }}
        addExpenseEntry={vi.fn()}
        onClose={vi.fn()}
        onDelete={onDelete}
      />,
    );

    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Add" }),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it("does not show delete when creating a new expense", () => {
    render(
      <ExpenseEntryDialog open addExpenseEntry={vi.fn()} onClose={vi.fn()} />,
    );

    expect(
      screen.queryByRole("button", { name: "Delete" }),
    ).not.toBeInTheDocument();
  });

  it("blocks submit when name or category is blank", () => {
    render(
      <ExpenseEntryDialog open addExpenseEntry={vi.fn()} onClose={vi.fn()} />,
    );

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "   " },
    });
    fireEvent.change(screen.getByLabelText("Category"), {
      target: { value: "Food" },
    });
    fireEvent.change(screen.getByLabelText("Value"), {
      target: { value: "100" },
    });

    expect(screen.getByRole("button", { name: "Add" })).toBeDisabled();
  });

  it("resynchronizes form state when expenseEntry changes", () => {
    const { rerender } = render(
      <ExpenseEntryDialog
        key="rent"
        open
        expenseEntry={{
          name: "Rent",
          category: "Housing",
          value: 2000,
          valueMode: "dollar",
        }}
        addExpenseEntry={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("Name")).toHaveValue("Rent");
    expect(screen.getByLabelText("Category")).toHaveValue("Housing");
    expect(screen.getByLabelText("Value")).toHaveValue(2000);

    rerender(
      <ExpenseEntryDialog
        key="401k"
        open
        expenseEntry={{
          name: "401k",
          category: "Retirement",
          value: 9,
          valueMode: "percent",
          percentSources: ["salary", "bonus"],
        }}
        addExpenseEntry={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("Name")).toHaveValue("401k");
    expect(screen.getByLabelText("Category")).toHaveValue("Retirement");
    expect(screen.getByLabelText("Value")).toHaveValue(9);
    expect(screen.getByLabelText("Income Sources")).toHaveTextContent(
      "Salary, Bonus",
    );
  });
});
