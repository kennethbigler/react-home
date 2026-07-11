import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CompEntryDialog from "./CompEntryDialog";

const compEntry = {
  entryDate: "2020-06",
  salary: 120000,
  bonus: 15000,
  stockTick: "AAPL",
  priceThen: 100,
  grantDuration: 4,
  grantQty: 500,
};

describe("resume | finances | comp-calc | CompEntryDialog", () => {
  it("submits a new comp entry with selected month and year", async () => {
    const addCompEntry = vi.fn();
    const onClose = vi.fn();

    render(
      <CompEntryDialog open onClose={onClose} addCompEntry={addCompEntry} />,
    );

    expect(screen.getByText("New Comp Entry")).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByLabelText("Month"));
    fireEvent.click(screen.getByText("June"));
    fireEvent.mouseDown(screen.getByLabelText("Year"));
    fireEvent.click(screen.getByText("2020"));
    fireEvent.change(screen.getByLabelText("Salary"), {
      target: { value: 90000 },
    });
    fireEvent.change(screen.getByLabelText("Bonus"), {
      target: { value: 5000 },
    });
    fireEvent.change(screen.getByLabelText("Stock Ticker"), {
      target: { value: "MSFT" },
    });
    fireEvent.change(screen.getByLabelText("Grant Quantity"), {
      target: { value: 100 },
    });
    fireEvent.change(screen.getByLabelText("Grant Duration"), {
      target: { value: 3 },
    });
    fireEvent.change(screen.getByLabelText("Stock Price Then"), {
      target: { value: 250 },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(addCompEntry).toHaveBeenCalledWith({
      entryDate: "2020-6",
      salary: 90000,
      bonus: 5000,
      stockTick: "MSFT",
      priceThen: 250,
      grantDuration: 3,
      grantQty: 100,
    });
  });

  it("updates an existing comp entry", async () => {
    const addCompEntry = vi.fn();

    render(
      <CompEntryDialog
        open
        compEntry={compEntry}
        onClose={vi.fn()}
        addCompEntry={addCompEntry}
      />,
    );

    expect(screen.getByText("Edit Comp Entry")).toBeInTheDocument();
    expect(screen.getByLabelText("Salary")).toHaveValue(120000);

    fireEvent.change(screen.getByLabelText("Salary"), {
      target: { value: 125000 },
    });
    fireEvent.click(screen.getByRole("button", { name: "Update" }));

    expect(addCompEntry).toHaveBeenCalledWith({
      ...compEntry,
      salary: 125000,
    });
  });

  it("calls onClose when cancel is clicked", () => {
    const onClose = vi.fn();

    render(<CompEntryDialog open onClose={onClose} addCompEntry={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
