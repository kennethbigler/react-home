import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import Board from "../Board";

const board = [
  { on: true, loc: 1, val: 1 },
  { on: true, loc: 2, val: 2 },
];

describe("games | deal-or-no-deal | Board", () => {
  it("calls onClick when a case is clicked", () => {
    const handleClick = vi.fn();
    render(
      <Board
        board={board}
        isOver={false}
        onClick={handleClick}
        playerChoice={{ on: true, loc: 2, val: 2 }}
      />,
    );

    expect(handleClick).toHaveBeenCalledTimes(0);
    fireEvent.click(screen.getByText("1"));
    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith(0);
  });
});
