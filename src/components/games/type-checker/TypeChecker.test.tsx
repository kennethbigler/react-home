import { fireEvent, render, screen } from "@testing-library/react";
import TypeChecker from ".";

describe("resume | type-checker", () => {
  it("renders as expected", () => {
    render(<TypeChecker />);

    expect(screen.getByText("Type Checker")).toBeInTheDocument();
  });

  it("sorts by row", () => {
    render(<TypeChecker />);

    // verify all buttons show up twice
    expect(screen.getAllByText("dragon")).toHaveLength(2);
    expect(screen.getAllByText("steel")).toHaveLength(2);
    expect(screen.getAllByText("fairy")).toHaveLength(2);
    // filter by dragon by clicking the side button
    fireEvent.click(screen.getAllByText("dragon")[1]);
    // dragon should show up twice
    expect(screen.getAllByText("dragon")).toHaveLength(2);
    // while other buttons only appear once
    expect(screen.getByText("steel")).toBeInTheDocument();
    expect(screen.getByText("fairy")).toBeInTheDocument();
    // reset filters by clicking side button again
    fireEvent.click(screen.getAllByText("dragon")[1]);
    // verify all buttons show up twice
    expect(screen.getAllByText("dragon")).toHaveLength(2);
    expect(screen.getAllByText("steel")).toHaveLength(2);
    expect(screen.getAllByText("fairy")).toHaveLength(2);
  });

  it("sorts by column", () => {
    render(<TypeChecker />);

    // verify all buttons show up twice
    expect(screen.getAllByText("dragon")).toHaveLength(2);
    expect(screen.getAllByText("fire")).toHaveLength(2);
    expect(screen.getAllByText("water")).toHaveLength(2);
    expect(screen.getAllByText("grass")).toHaveLength(2);
    expect(screen.getAllByText("electric")).toHaveLength(2);
    expect(screen.getAllByText("ice")).toHaveLength(2);
    expect(screen.getAllByText("fairy")).toHaveLength(2);
    // filter by dragon by clicking the side button
    fireEvent.click(screen.getAllByText("dragon")[0]);
    // dragon should show up twice
    expect(screen.getAllByText("dragon")).toHaveLength(2);
    // while other buttons only appear once
    expect(screen.getByText("fire")).toBeInTheDocument();
    expect(screen.getByText("water")).toBeInTheDocument();
    expect(screen.getByText("grass")).toBeInTheDocument();
    expect(screen.getByText("electric")).toBeInTheDocument();
    expect(screen.getByText("ice")).toBeInTheDocument();
    expect(screen.getByText("fairy")).toBeInTheDocument();

    // reset filters by clicking side button again
    fireEvent.click(screen.getAllByText("dragon")[0]);
    // verify all buttons show up twice
    expect(screen.getAllByText("dragon")).toHaveLength(2);
    expect(screen.getAllByText("fire")).toHaveLength(2);
    expect(screen.getAllByText("water")).toHaveLength(2);
    expect(screen.getAllByText("grass")).toHaveLength(2);
    expect(screen.getAllByText("electric")).toHaveLength(2);
    expect(screen.getAllByText("ice")).toHaveLength(2);
    expect(screen.getAllByText("fairy")).toHaveLength(2);
  });
});
