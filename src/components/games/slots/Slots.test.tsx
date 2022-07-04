import React from "react";
import { screen } from "@testing-library/react";
import render from "../../../recoil-test-render";
import Slots from "./Slots";

describe("games | slots | Slots", () => {
  it("renders as expected", () => {
    render(<Slots />);

    expect(screen.getByText("Casino Slot Machine")).toBeInTheDocument();
    expect(screen.getByText("Spin")).toBeInTheDocument();
    // this is the spin button ^v
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByText("Player")).toBeInTheDocument();
    expect(screen.getByText("Money")).toBeInTheDocument();
    expect(screen.getByText("Ken")).toBeInTheDocument();
    expect(screen.getByText("House")).toBeInTheDocument();
    expect(screen.getAllByText("$100")).toHaveLength(2);
    expect(screen.getByText("Slot Roll")).toBeInTheDocument();
    expect(screen.getByText("Payout")).toBeInTheDocument();
    expect(screen.getByText("J J J")).toBeInTheDocument();
    expect(screen.getByText("1666 : 1")).toBeInTheDocument();
    expect(screen.getByText("7 7 7")).toBeInTheDocument();
    expect(screen.getByText("300 : 1")).toBeInTheDocument();
    expect(screen.getByText("Ξ Ξ Ξ")).toBeInTheDocument();
    expect(screen.getByText("100 : 1")).toBeInTheDocument();
    expect(screen.getByText("= = =")).toBeInTheDocument();
    expect(screen.getByText("50 : 1")).toBeInTheDocument();
    expect(screen.getByText("— — —")).toBeInTheDocument();
    expect(screen.getByText("25 : 1")).toBeInTheDocument();
    expect(screen.getByText("3 of any bar")).toBeInTheDocument();
    expect(screen.getByText("C C C")).toBeInTheDocument();
    expect(screen.getAllByText("12 : 1")).toHaveLength(2);
    expect(screen.getByText("C C")).toBeInTheDocument();
    expect(screen.getByText("6 : 1")).toBeInTheDocument();
    expect(screen.getAllByText("C")[0]).toBeInTheDocument();
    expect(screen.getByText("3 : 1")).toBeInTheDocument();
  });

  // CURRENTLY: we are running into an issue with testing and Redux Thunk, so full coverage will have to wait.
});
