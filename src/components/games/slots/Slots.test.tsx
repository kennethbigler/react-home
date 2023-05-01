import { fireEvent, screen } from "@testing-library/react";
import { vi } from "vitest";
import render from "../../../recoil-test-render";
import Slots from "./Slots";
import SlotMachine, { SlotOption as SO } from "../../../apis/SlotMachine";

const pullHandle = vi.spyOn(SlotMachine, "pullHandle");

describe("games | slots | Slots", () => {
  it("renders as expected", () => {
    pullHandle.mockImplementation(() => [
      [SO.EMPTY, SO.EMPTY, SO.EMPTY],
      [SO.EMPTY, SO.BAR, SO.EMPTY],
      [SO.EMPTY, SO.EMPTY, SO.BAR],
    ]);
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
    expect(screen.getByText("1666 : 1")).toBeInTheDocument();
    expect(screen.getByText("300 : 1")).toBeInTheDocument();
    expect(screen.getByText("100 : 1")).toBeInTheDocument();
    expect(screen.getByText("50 : 1")).toBeInTheDocument();
    expect(screen.getByText("25 : 1")).toBeInTheDocument();
    expect(screen.getAllByText("12 : 1")).toHaveLength(2);
    expect(screen.getByText("6 : 1")).toBeInTheDocument();
    expect(screen.getByText("3 : 1")).toBeInTheDocument();
    // spin the button
    fireEvent.click(screen.getByText("Spin"));
    expect(screen.getByText("You ", { exact: false })).toBeInTheDocument();
    pullHandle.mockRestore();
  });
});
