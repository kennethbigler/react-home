import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import Menu from "../Menu";

describe("games | Menu", () => {
  it("renders as expected", () => {
    render(<Menu />);

    expect(screen.getByText("Back to Resume")).toBeInTheDocument();
    expect(screen.getByText("Home - Games")).toBeInTheDocument();
    // Casino
    expect(screen.getByText("BlackJack")).toBeInTheDocument();
    expect(screen.getByText("Deal or No Deal")).toBeInTheDocument();
    expect(screen.getByText("Poker")).toBeInTheDocument();
    expect(screen.getByText("Slot Machine")).toBeInTheDocument();
    expect(screen.getByText("Yahtzee")).toBeInTheDocument();
    // Games
    expect(screen.getByText("Are You The One")).toBeInTheDocument();
    expect(screen.getByText("Connect4")).toBeInTheDocument();
    expect(screen.getByText("Family Feud")).toBeInTheDocument();
    expect(screen.getByText("Tic-Tac-Toe")).toBeInTheDocument();
    expect(screen.getByText("Type Checker")).toBeInTheDocument();
    // Social
    expect(screen.getByText("BotC")).toBeInTheDocument();
    expect(screen.getByText("Murder Mystery")).toBeInTheDocument();
    expect(screen.getByText("Werewolf")).toBeInTheDocument();
  });

  it("links to internal pages", () => {
    const handleItemClick = vi.fn();
    render(<Menu onItemClick={handleItemClick} />);

    fireEvent.click(screen.getByText("BlackJack"));
    expect(handleItemClick).toHaveBeenCalledWith("/games/blackjack");
  });

  it("links back to the resume half", () => {
    const handleItemClick = vi.fn();
    render(<Menu onItemClick={handleItemClick} />);

    fireEvent.click(screen.getByText("Back to Resume"));
    expect(handleItemClick).toHaveBeenCalledWith("/");
  });
});
