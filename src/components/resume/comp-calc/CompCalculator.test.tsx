import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import CompCalculator from ".";

describe("resume | comp-calc | CompCalculator", () => {
  it("renders as expected", async () => {
    render(<CompCalculator />);

    expect(screen.getByText("Comp Calculator")).toBeInTheDocument();

    // open entry modal
    expect(screen.queryByText("New Comp Entry")).toBeNull();
    fireEvent.click(screen.getByText("+ Entry"));
    expect(screen.getByText("New Comp Entry")).toBeInTheDocument();
    // enter info
    expect(screen.queryByText("TSLA")).toBeNull();
    fireEvent.change(screen.getByLabelText("Salary"), {
      target: { value: 10000 },
    });
    fireEvent.change(screen.getByLabelText("Stock Ticker"), {
      target: { value: "TSLA" },
    });
    fireEvent.click(screen.getByText("Add"));
    await waitFor(() => expect(screen.queryByText("Add")).toBeNull());
    expect(screen.getByText("Salary: $10,000.00")).toBeInTheDocument();

    // open edit entry modal
    expect(screen.queryByText("Edit Comp Entry")).toBeNull();
    fireEvent.click(screen.getByText("Salary: $10,000.00"));
    expect(screen.getByText("Edit Comp Entry")).toBeInTheDocument();
    // enter info
    fireEvent.change(screen.getByLabelText("Grant Quantity"), {
      target: { value: 1 },
    });
    fireEvent.click(screen.getByText("Update"));
    await waitFor(() => expect(screen.queryByText("Update")).toBeNull());
    expect(screen.getByText("TSLA")).toBeInTheDocument();

    // open stock modal
    expect(screen.queryByText("New Stock Entry")).toBeNull();
    fireEvent.click(screen.getByText("+ Stock"));
    expect(screen.getByText("New Stock Entry")).toBeInTheDocument();
    // enter info
    expect(screen.queryByText("TSLA: $666.00")).toBeNull();
    fireEvent.change(screen.getByLabelText("Stock"), {
      target: { value: "TSLA" },
    });
    fireEvent.change(screen.getByLabelText("Price Now"), {
      target: { value: 666 },
    });
    fireEvent.click(screen.getByText("Add"));
    await waitFor(() => expect(screen.queryByText("Add")).toBeNull());
    expect(screen.getByText("TSLA: $666.00")).toBeInTheDocument();

    // open edit stock modal
    expect(screen.queryByText("Edit Stock Entry")).toBeNull();
    fireEvent.click(screen.getByText("TSLA: $666.00"));
    expect(screen.getByText("Edit Stock Entry")).toBeInTheDocument();
    // enter info
    expect(screen.queryByText("TSLA: $665.00")).toBeNull();
    fireEvent.change(screen.getByLabelText("Price Now"), {
      target: { value: 665 },
    });
    fireEvent.click(screen.getByText("Update"));
    await waitFor(() => expect(screen.queryByText("Update")).toBeNull());
    expect(screen.getByText("TSLA: $665.00")).toBeInTheDocument();
    expect(screen.queryByText("TSLA: $666.00")).toBeNull();

    // open edit stock modal
    fireEvent.click(screen.getByText("TSLA: $665.00"));
    expect(screen.getByText("Edit Stock Entry")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Delete"));
    expect(screen.queryByText("TSLA: $665.00")).toBeNull();
  });
});
