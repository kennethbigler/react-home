import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import render from "../../../../redux-test-render";
import DealOrNoDeal from "../DealOrNoDeal";

describe("games | deal-or-no-deal | DealOrNoDeal", () => {
  it("renders as expected", () => {
    render(<DealOrNoDeal />);

    expect(screen.getByText("Deal or No Deal")).toBeInTheDocument();
    expect(screen.getByText("Your Case: ?")).toBeInTheDocument();
    expect(screen.getByText("Number of Cases to Open: 6")).toBeInTheDocument();
    expect(screen.getByText("Ken: $100")).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(26);
  });

  it("plays a game and takes final deal", () => {
    jest.useFakeTimers();
    render(<DealOrNoDeal />);
    jest.clearAllTimers();
    jest.runOnlyPendingTimers();

    expect(screen.getByText("Your Case: ?")).toBeInTheDocument();
    expect(screen.getByText("Number of Cases to Open: 6")).toBeInTheDocument();
    expect(screen.getByText("Ken: $100")).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(26);

    // select case 7
    fireEvent.click(screen.getAllByRole("button")[6]);

    expect(screen.getByText("Your Case: 7")).toBeInTheDocument();
    expect(screen.getByText("Number of Cases to Open: 6")).toBeInTheDocument();
    expect(screen.getByText("Ken: $0")).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(26);

    // open cases 1-6
    fireEvent.click(screen.getAllByRole("button")[0]);
    fireEvent.click(screen.getAllByRole("button")[1]);
    fireEvent.click(screen.getAllByRole("button")[2]);
    fireEvent.click(screen.getAllByRole("button")[3]);
    fireEvent.click(screen.getAllByRole("button")[4]);
    fireEvent.click(screen.getAllByRole("button")[5]);
    // this one should not open
    fireEvent.click(screen.getAllByRole("button")[7]);

    jest.runOnlyPendingTimers();

    expect(screen.getAllByText("$1")).toBeDefined();
    expect(screen.getAllByText("$10")).toBeDefined();
    expect(screen.getAllByText("$100")).toBeDefined();
    expect(screen.getAllByText("$1,000")).toBeDefined();
    expect(screen.getAllByText("$10,000")).toBeDefined();
    expect(screen.getAllByText("$100,000")).toBeDefined();
    expect(screen.getAllByText("$1,000,000")).toBeDefined();
    expect(screen.getByText("Deal")).toBeInTheDocument();
    expect(screen.getByText("No Deal")).toBeInTheDocument();
    // there should only be 2 buttons now
    expect(screen.getAllByRole("button")).toHaveLength(2);

    fireEvent.click(screen.getByText("No Deal"));

    jest.runOnlyPendingTimers();

    expect(screen.getAllByRole("button")).toHaveLength(26);

    // open cases 8-12
    fireEvent.click(screen.getAllByRole("button")[7]);
    fireEvent.click(screen.getAllByRole("button")[8]);
    fireEvent.click(screen.getAllByRole("button")[9]);
    fireEvent.click(screen.getAllByRole("button")[10]);
    fireEvent.click(screen.getAllByRole("button")[11]);

    jest.runOnlyPendingTimers();

    expect(screen.getAllByText("$1")).toBeDefined();
    expect(screen.getAllByText("$10")).toBeDefined();
    expect(screen.getAllByText("$100")).toBeDefined();
    expect(screen.getAllByText("$1,000")).toBeDefined();
    expect(screen.getAllByText("$10,000")).toBeDefined();
    expect(screen.getAllByText("$100,000")).toBeDefined();
    expect(screen.getAllByText("$1,000,000")).toBeDefined();
    expect(screen.getByText("Deal")).toBeInTheDocument();
    expect(screen.getByText("No Deal")).toBeInTheDocument();
    // there should only be 2 buttons now
    expect(screen.getAllByRole("button")).toHaveLength(2);

    fireEvent.click(screen.getByText("Deal"));

    jest.runOnlyPendingTimers();

    expect(screen.getByText("New Game")).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(27);

    fireEvent.click(screen.getByText("New Game"));

    expect(screen.getByText("Your Case: ?")).toBeInTheDocument();
    expect(screen.getByText("Number of Cases to Open: 6")).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(26);
  });
});
