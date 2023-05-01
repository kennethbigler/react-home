import * as React from "react";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import Modal from "../Modal";

const board = [
  { on: true, loc: 1, val: 1 },
  { on: true, loc: 2, val: 2 },
];

describe("games | deal-or-no-deal | Modal", () => {
  it("renders as expected", () => {
    render(
      <Modal
        deal={vi.fn()}
        noDeal={vi.fn()}
        numCases={1}
        offer={10000}
        open
        swap={vi.fn()}
        board={board}
      />
    );

    expect(screen.getByText("$10,000 - Deal or No Deal?")).toBeInTheDocument();
    expect(screen.getByText("$1")).toBeInTheDocument();
    expect(screen.getByText("$2")).toBeInTheDocument();
    expect(screen.getByText("Deal")).toBeInTheDocument();
    expect(screen.getByText("My Case")).toBeInTheDocument();
    expect(screen.getByText("Other Case")).toBeInTheDocument();
  });
});
