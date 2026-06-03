import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Menu from "../Menu";

describe("games | Menu", () => {
  const renderMenu = (onItemClick?: (loc: string) => void) =>
    render(
      <MemoryRouter>
        <Menu onItemClick={onItemClick} />
      </MemoryRouter>,
    );

  it("renders as expected", () => {
    renderMenu();

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
    renderMenu(handleItemClick);

    const blackjackLink = screen.getByRole("menuitem", { name: "BlackJack" });
    expect(blackjackLink).toHaveAttribute("href", "/games/blackjack");
    fireEvent.click(blackjackLink);
    expect(handleItemClick).toHaveBeenCalledWith("/games/blackjack");
  });

  it("links back to the resume half", () => {
    const handleItemClick = vi.fn();
    renderMenu(handleItemClick);

    const resumeLink = screen.getByRole("menuitem", { name: "Back to Resume" });
    expect(resumeLink).toHaveAttribute("href", "/");
    fireEvent.click(resumeLink);
    expect(handleItemClick).toHaveBeenCalledWith("/");
  });
});
