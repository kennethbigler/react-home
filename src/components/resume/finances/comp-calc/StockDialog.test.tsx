import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import StockDialog from "./StockDialog";

const renderStockDialog = (
  props: Partial<React.ComponentProps<typeof StockDialog>> = {},
) => {
  const addStockEntry = vi.fn();
  const removeStockEntry = vi.fn(() => vi.fn());

  render(
    <StockDialog
      open
      onClose={vi.fn()}
      addStockEntry={addStockEntry}
      removeStockEntry={removeStockEntry}
      {...props}
    />,
  );

  return { addStockEntry, removeStockEntry };
};

describe("resume | finances | comp-calc | StockDialog", () => {
  it("normalizes and submits a new stock entry", () => {
    const { addStockEntry } = renderStockDialog();

    fireEvent.change(screen.getByLabelText("Stock"), {
      target: { value: " tsla " },
    });
    fireEvent.change(screen.getByLabelText("Price Now"), {
      target: { value: 123.45 },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(addStockEntry).toHaveBeenCalledWith("TSLA", 123.45);
  });

  it("rejects an empty ticker", () => {
    const { addStockEntry } = renderStockDialog();

    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Enter a stock ticker.",
    );
    expect(addStockEntry).not.toHaveBeenCalled();
  });

  it("rejects a negative price", () => {
    const { addStockEntry } = renderStockDialog();

    fireEvent.change(screen.getByLabelText("Stock"), {
      target: { value: "TSLA" },
    });
    fireEvent.change(screen.getByLabelText("Price Now"), {
      target: { value: -1 },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Stock price must be zero or greater.",
    );
    expect(addStockEntry).not.toHaveBeenCalled();
  });

  it("clears the validation error once the ticker is corrected", () => {
    renderStockDialog();

    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    expect(screen.getByRole("alert")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Stock"), {
      target: { value: "AAPL" },
    });
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("shows delete for an existing stock and removes it", () => {
    const removeTick = vi.fn();
    const removeStockEntry = vi.fn(() => removeTick);
    renderStockDialog({ stock: "AAPL", price: 100, removeStockEntry });

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(removeStockEntry).toHaveBeenCalledWith("AAPL");
    expect(removeTick).toHaveBeenCalledTimes(1);
  });
});
