import React from "react";
import { screen, fireEvent, waitFor } from "@testing-library/react";
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

  it("plays a game and takes final deal", async () => {
    render(<DealOrNoDeal />);

    expect(screen.getByText("Your Case: ?")).toBeInTheDocument();
    expect(screen.getByText("Number of Cases to Open: 6")).toBeInTheDocument();
    expect(screen.getByText("Ken: $100")).toBeInTheDocument();
    let buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(26);

    // select case 7
    fireEvent.click(buttons[6]);

    expect(screen.getByText("Your Case: 7")).toBeInTheDocument();
    expect(screen.getByText("Number of Cases to Open: 6")).toBeInTheDocument();
    expect(screen.getByText("Ken: $0")).toBeInTheDocument();

    // open cases 1-6
    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[1]);
    fireEvent.click(buttons[2]);
    fireEvent.click(buttons[3]);
    fireEvent.click(buttons[4]);
    fireEvent.click(buttons[5]);
    // this one should not open
    fireEvent.click(buttons[7]);

    await waitFor(() => screen.getByText("Deal"));
    expect(screen.getByText("No Deal")).toBeInTheDocument();
    // there should only be 2 buttons now
    expect(screen.getAllByRole("button")).toHaveLength(2);
    expect(screen.getAllByText("$1")).toBeDefined();
    expect(screen.getAllByText("$1,000")).toBeDefined();
    expect(screen.getAllByText("$1,000,000")).toBeDefined();

    fireEvent.click(screen.getByText("No Deal"));

    await waitFor(() => expect(screen.getAllByRole("button")).toHaveLength(26));
    buttons = screen.getAllByRole("button");
    // open cases 8-12
    fireEvent.click(buttons[7]);
    fireEvent.click(buttons[8]);
    fireEvent.click(buttons[9]);
    fireEvent.click(buttons[10]);
    fireEvent.click(buttons[11]);

    await waitFor(() => screen.getByText("Deal"));
    expect(screen.getByText("No Deal")).toBeInTheDocument();
    // there should only be 2 buttons now
    expect(screen.getAllByRole("button")).toHaveLength(2);
    expect(screen.getAllByText("$1")).toBeDefined();
    expect(screen.getAllByText("$1,000")).toBeDefined();
    expect(screen.getAllByText("$1,000,000")).toBeDefined();

    fireEvent.click(screen.getByText("Deal"));

    await waitFor(() => expect(screen.getAllByRole("button")).toHaveLength(27));
    expect(screen.getByText("New Game")).toBeInTheDocument();

    fireEvent.click(screen.getByText("New Game"));

    expect(screen.getByText("Your Case: ?")).toBeInTheDocument();
    expect(screen.getByText("Number of Cases to Open: 6")).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(26);
  });
});
