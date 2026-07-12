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
      screen.getByRole("heading", { name: "FOOD ($250.00)" }),
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
    expect(screen.queryByText("Name: Draft")).toBeNull();
    expect(screen.queryByText("Draft:")).toBeNull();
  });
});
