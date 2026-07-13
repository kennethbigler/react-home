import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Budgeting from "./Budgeting";

describe("resume | finances | budgeting | Budgeting", () => {
  it("renders as expected", async () => {
    render(<Budgeting />);

    expect(
      screen.getByRole("button", { name: "+ Expense" }),
    ).toBeInTheDocument();

    // open new entry modal
    expect(screen.queryByText("New Expense Entry")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "+ Expense" }));
    expect(screen.getByText("New Expense Entry")).toBeInTheDocument();

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
    expect(
      screen.getByRole("button", { name: "Food ($250.00)" }),
    ).toBeInTheDocument();

    // open edit entry modal with pre-filled values
    expect(screen.queryByText("Edit Expense Entry")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Groceries: $250.00" }));
    expect(screen.getByText("Edit Expense Entry")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toHaveValue("Groceries");
    expect(screen.getByLabelText("Category")).toHaveValue("Food");
    expect(screen.getByLabelText("Value")).toHaveValue(250);

    fireEvent.change(screen.getByLabelText("Value"), {
      target: { value: 275 },
    });
    fireEvent.click(screen.getByRole("button", { name: "Update" }));
    await waitFor(() =>
      expect(screen.queryByText("Edit Expense Entry")).toBeNull(),
    );
    expect(screen.getByText("Groceries: $275.00")).toBeInTheDocument();

    // cancel closes dialog without saving
    fireEvent.click(screen.getByRole("button", { name: "+ Expense" }));
    expect(screen.getByText("New Expense Entry")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Draft" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    await waitFor(() =>
      expect(screen.queryByText("New Expense Entry")).toBeNull(),
    );
    expect(
      screen.queryByRole("button", { name: /Draft:/i }),
    ).not.toBeInTheDocument();
  });

  it("deletes an expense and removes its category when it was the last one", async () => {
    render(<Budgeting />);

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
      expect(screen.getByText("Groceries: $250.00")).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByRole("button", { name: "Groceries: $250.00" }));
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() =>
      expect(screen.queryByText("Groceries: $250.00")).toBeNull(),
    );
    expect(
      screen.queryByRole("button", { name: /Food \(/i }),
    ).not.toBeInTheDocument();
  });

  it("deletes one expense but keeps the category when others remain", async () => {
    render(<Budgeting />);

    fireEvent.click(screen.getByRole("button", { name: "+ Expense" }));
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Rent" },
    });
    fireEvent.change(screen.getByLabelText("Category"), {
      target: { value: "Housing" },
    });
    fireEvent.change(screen.getByLabelText("Value"), {
      target: { value: 2000 },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    fireEvent.click(screen.getByRole("button", { name: "+ Expense" }));
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "HOA" },
    });
    fireEvent.change(screen.getByLabelText("Category"), {
      target: { value: "Housing" },
    });
    fireEvent.change(screen.getByLabelText("Value"), {
      target: { value: 300 },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    fireEvent.click(screen.getByRole("button", { name: "Rent: $2,000.00" }));
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() =>
      expect(screen.queryByText("Rent: $2,000.00")).toBeNull(),
    );
    expect(screen.getByText("HOA: $300.00")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Housing ($300.00)" }),
    ).toBeInTheDocument();
  });

  it("clears category selection when deleting the last expense in a selected category", async () => {
    render(<Budgeting />);

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

    fireEvent.click(screen.getByRole("button", { name: "Food ($250.00)" }));
    fireEvent.click(screen.getByRole("button", { name: "Groceries: $250.00" }));
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() =>
      expect(screen.queryByText("Groceries: $250.00")).toBeNull(),
    );
    expect(
      screen.queryByRole("button", { name: /Food \(/i }),
    ).not.toBeInTheDocument();
  });
});
