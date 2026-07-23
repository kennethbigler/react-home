import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import NetWorthEntryDialog from "./NetWorthEntryDialog";

const entry = {
  entryDate: "2020-06",
  amounts: { Cash: 10000, Investments: 40000 },
};

describe("resume | finances | net-worth | NetWorthEntryDialog", () => {
  it("submits a new entry with selected month, year, and amounts", () => {
    const addEntry = vi.fn();

    render(
      <NetWorthEntryDialog
        open
        categories={["Cash", "Investments"]}
        onClose={vi.fn()}
        addEntry={addEntry}
      />,
    );

    expect(screen.getByText("New Net Worth Entry")).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByLabelText("Month"));
    fireEvent.click(screen.getByText("June"));
    fireEvent.mouseDown(screen.getByLabelText("Year"));
    fireEvent.click(screen.getByText("2020"));
    fireEvent.change(screen.getByLabelText("Cash"), {
      target: { value: 9000 },
    });
    fireEvent.change(screen.getByLabelText("Investments"), {
      target: { value: 5000 },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(addEntry).toHaveBeenCalledWith({
      entryDate: "2020-06",
      amounts: { Cash: 9000, Investments: 5000 },
    });
  });

  it("prefills edit values and submits an update", () => {
    const addEntry = vi.fn();

    render(
      <NetWorthEntryDialog
        open
        entry={entry}
        categories={["Cash", "Investments"]}
        onClose={vi.fn()}
        addEntry={addEntry}
      />,
    );

    expect(screen.getByText("Edit Net Worth Entry")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Cash"), {
      target: { value: 12000 },
    });
    fireEvent.click(screen.getByRole("button", { name: "Update" }));

    expect(addEntry).toHaveBeenCalledWith({
      entryDate: "2020-06",
      amounts: { Cash: 12000, Investments: 40000 },
    });
  });

  it("rejects negative amounts", () => {
    const addEntry = vi.fn();

    render(
      <NetWorthEntryDialog
        open
        categories={["Cash"]}
        onClose={vi.fn()}
        addEntry={addEntry}
      />,
    );

    fireEvent.change(screen.getByLabelText("Cash"), {
      target: { value: -1 },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(
      screen.getByText("Amounts must be zero or greater."),
    ).toBeInTheDocument();
    expect(addEntry).not.toHaveBeenCalled();
  });

  it("allows clearing an amount field and submits empty as 0", () => {
    const addEntry = vi.fn();

    render(
      <NetWorthEntryDialog
        open
        categories={["Cash"]}
        onClose={vi.fn()}
        addEntry={addEntry}
      />,
    );

    fireEvent.change(screen.getByLabelText("Cash"), {
      target: { value: "100" },
    });
    fireEvent.change(screen.getByLabelText("Cash"), {
      target: { value: "" },
    });
    expect(screen.getByLabelText("Cash")).toHaveValue(null);

    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(addEntry).toHaveBeenCalledWith(
      expect.objectContaining({
        amounts: { Cash: 0 },
      }),
    );
  });

  it("shows delete when editing and calls onDelete", () => {
    const onDelete = vi.fn();

    render(
      <NetWorthEntryDialog
        open
        entry={entry}
        categories={["Cash", "Investments"]}
        onClose={vi.fn()}
        addEntry={vi.fn()}
        onDelete={onDelete}
      />,
    );

    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it("hides delete for new entries", () => {
    render(
      <NetWorthEntryDialog
        open
        categories={["Cash"]}
        onClose={vi.fn()}
        addEntry={vi.fn()}
      />,
    );

    expect(
      screen.queryByRole("button", { name: "Delete" }),
    ).not.toBeInTheDocument();
  });
});
