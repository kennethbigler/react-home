import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import Poker from "..";

describe("games | poker | Poker", () => {
  it("renders as expected & plays a game", async () => {
    render(<Poker />);

    // renders as expected
    expect(screen.getByText("5 Card Draw Poker")).toBeInTheDocument();
    expect(screen.getByText("Ken: $100")).toBeInTheDocument();
    expect(screen.getByText("Bot-2: $100")).toBeInTheDocument();
    expect(screen.getByText("Start Game")).toBeInTheDocument();

    // starts the game
    fireEvent.click(screen.getByText("Start Game"));
    await waitFor(() => screen.getAllByText(/♣|♦|♥|♠/i));

    // can select a card to discard
    const cardToDiscard = screen.getAllByText(/♣|♦|♥|♠/i)[0];
    fireEvent.click(cardToDiscard);
    await waitFor(() =>
      expect(screen.getAllByText(/♣|♦|♥|♠/i)[0]).not.toHaveStyle(
        "background-color: white",
      ),
    );

    // discards the card
    fireEvent.click(screen.getByText("Discard Cards"));
    await waitFor(() => screen.getByText("End Turn"));

    // ensures we got a new card
    expect(cardToDiscard.innerHTML).not.toEqual(
      screen.getAllByText(/♣|♦|♥|♠/i)[0].innerHTML,
    );
  });
});
