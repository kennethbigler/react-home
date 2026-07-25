import { fireEvent, render, screen, within } from "@testing-library/react";
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
      entryDate: "2020-06",
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

  it("rejects zero grant duration", () => {
    const addCompEntry = vi.fn();
    render(
      <CompEntryDialog open onClose={vi.fn()} addCompEntry={addCompEntry} />,
    );

    fireEvent.change(screen.getByLabelText("Grant Duration"), {
      target: { value: 0 },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Grant duration must be greater than zero.",
    );
    expect(addCompEntry).not.toHaveBeenCalled();
  });

  it("requires a ticker when a stock grant is entered", () => {
    const addCompEntry = vi.fn();
    render(
      <CompEntryDialog open onClose={vi.fn()} addCompEntry={addCompEntry} />,
    );

    fireEvent.change(screen.getByLabelText("Grant Quantity"), {
      target: { value: 10 },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Enter a stock ticker when grant quantity is greater than zero.",
    );
    expect(addCompEntry).not.toHaveBeenCalled();
  });

  it("calls onClose when cancel is clicked", () => {
    const onClose = vi.fn();

    render(<CompEntryDialog open onClose={onClose} addCompEntry={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("shows delete when editing and calls onDelete", () => {
    const onDelete = vi.fn();

    render(
      <CompEntryDialog
        open
        compEntry={compEntry}
        onClose={vi.fn()}
        addCompEntry={vi.fn()}
        onDelete={onDelete}
      />,
    );

    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Add" }),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    const confirmation = screen.getByRole("dialog", {
      name: "Delete compensation entry?",
    });
    fireEvent.click(
      within(confirmation).getByRole("button", { name: "Delete entry" }),
    );

    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it("does not delete when confirmation is cancelled", () => {
    const onDelete = vi.fn();

    render(
      <CompEntryDialog
        open
        compEntry={compEntry}
        onClose={vi.fn()}
        addCompEntry={vi.fn()}
        onDelete={onDelete}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    const confirmation = screen.getByRole("dialog", {
      name: "Delete compensation entry?",
    });
    fireEvent.click(
      within(confirmation).getByRole("button", { name: "Cancel" }),
    );

    expect(onDelete).not.toHaveBeenCalled();
  });

  it("does not show delete when creating a new comp entry", () => {
    render(<CompEntryDialog open onClose={vi.fn()} addCompEntry={vi.fn()} />);

    expect(
      screen.queryByRole("button", { name: "Delete" }),
    ).not.toBeInTheDocument();
  });
});
