import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Menu from "../Menu";

describe("games | Menu", () => {
  it("renders as expected", () => {
    render(<Menu />);

    expect(screen.getByText("Back to Resume")).toBeInTheDocument();
    expect(screen.getByText("Home - Games")).toBeInTheDocument();
    expect(screen.getByText("BlackJack")).toBeInTheDocument();
    expect(screen.getByText("Connect4")).toBeInTheDocument();
    expect(screen.getByText("Deal or No Deal")).toBeInTheDocument();
    expect(screen.getByText("Poker")).toBeInTheDocument();
    expect(screen.getByText("Slot Machine")).toBeInTheDocument();
    expect(screen.getByText("Tic-Tac-Toe")).toBeInTheDocument();
    expect(screen.getByText("Yahtzee")).toBeInTheDocument();
  });

  it("links to internal pages", () => {
    const handleItemClick = jest.fn();
    render(<Menu onItemClick={handleItemClick} />);

    fireEvent.click(screen.getByText("BlackJack"));
    expect(handleItemClick).toHaveBeenCalledWith("/games/blackjack");
  });

  it("links back to the resume half", () => {
    const handleItemClick = jest.fn();
    render(<Menu onItemClick={handleItemClick} />);

    fireEvent.click(screen.getByText("Back to Resume"));
    expect(handleItemClick).toHaveBeenCalledWith("/");
  });
});
