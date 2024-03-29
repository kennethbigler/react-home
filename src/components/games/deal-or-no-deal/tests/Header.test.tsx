import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import Header from "../Header";

describe("games | deal-or-no-deal | Header", () => {
  it("renders as expected", () => {
    render(
      <Header
        casesToOpen={1}
        isOver={0}
        newGame={vi.fn()}
        name="Ken"
        money={1000}
      />,
    );

    expect(screen.getByText("Your Case: ?")).toBeInTheDocument();
    expect(screen.getByText("Number of Cases to Open: 1")).toBeInTheDocument();
    expect(screen.getByText("Ken: $1,000")).toBeInTheDocument();
  });

  it("changes appearance when over", () => {
    render(
      <Header
        casesToOpen={1}
        isOver={1}
        newGame={vi.fn()}
        name="Ken"
        money={1000}
      />,
    );
    // removed
    expect(screen.queryByText("Your Case: ?")).toBeNull();
    expect(screen.queryByText("Number of Cases to Open: 1")).toBeNull();
    // stays in both displays
    expect(screen.getByText("Ken: $1,000")).toBeInTheDocument();
    // new
    expect(screen.getByText("Your Case: ? - $0")).toBeInTheDocument();
    expect(screen.getByText("You Won $1")).toBeInTheDocument();
    expect(screen.getByText("New Game")).toBeInTheDocument();
  });

  it("changes appearance with a players choice", () => {
    render(
      <Header
        casesToOpen={1}
        isOver={1}
        newGame={vi.fn()}
        name="Ken"
        money={1000}
        playerChoice={{ on: true, loc: 1, val: 1000 }}
      />,
    );
    // removed from isOver=false
    expect(screen.queryByText("Your Case: ?")).toBeNull();
    expect(screen.queryByText("Number of Cases to Open: 1")).toBeNull();
    // removed from isOver=true
    expect(screen.queryByText("Your Case: ? - $0")).toBeNull();
    // stays
    expect(screen.getByText("Ken: $1,000")).toBeInTheDocument();
    expect(screen.getByText("You Won $1")).toBeInTheDocument();
    expect(screen.getByText("New Game")).toBeInTheDocument();
    // new
    expect(screen.getByText("Your Case: 1 - $1,000")).toBeInTheDocument();
  });
});
