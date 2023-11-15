import { fireEvent, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import render from "../../../../recoil-test-render";
import Poker from "../Poker";
import Deck from "../../../../apis/Deck";

const deck = vi.spyOn(Deck, "deal");

const card = (name: string, suit: string) => {
  let weight = 0;
  switch (name) {
    case "A":
      weight = 14;
      break;
    case "K":
      weight = 13;
      break;
    case "Q":
      weight = 12;
      break;
    case "J":
      weight = 11;
      break;
    default:
      weight = parseInt(name, 10);
  }
  return { name, weight, suit };
};

describe("games | poker | Poker", () => {
  it("renders as expected & plays a game", async () => {
    deck
      .mockReset()
      .mockResolvedValueOnce([
        card("A", "♠"),
        card("K", "♠"),
        card("Q", "♠"),
        card("J", "♠"),
        card("9", "♠"),
      ])
      // draw 4
      .mockResolvedValueOnce([
        card("K", "♣"),
        card("8", "♠"),
        card("7", "♠"),
        card("6", "♠"),
        card("5", "♠"),
      ])
      // draw 3
      .mockResolvedValueOnce([
        card("4", "♠"),
        card("3", "♠"),
        card("2", "♠"),
        card("2", "♣"),
        card("5", "♣"),
      ])
      // draw 1
      .mockResolvedValueOnce([
        card("3", "♣"),
        card("3", "♦"),
        card("3", "♥"),
        card("4", "♣"),
        card("6", "♣"),
      ])
      // draw 0
      .mockResolvedValueOnce([
        card("7", "♣"),
        card("8", "♣"),
        card("9", "♣"),
        card("10", "♣"),
        card("J", "♣"),
      ])
      // user redraws 1
      .mockResolvedValueOnce([card("10", "♠")])
      // AI redraw 4
      .mockResolvedValueOnce([card("Q", "♣")])
      .mockResolvedValueOnce([card("A", "♣")])
      .mockResolvedValueOnce([card("A", "♥")])
      .mockResolvedValueOnce([card("K", "♥")])
      // AI redraw 3
      .mockResolvedValueOnce([card("Q", "♥")])
      .mockResolvedValueOnce([card("J", "♥")])
      .mockResolvedValueOnce([card("10", "♥")])
      // AI redraw 1
      .mockResolvedValueOnce([card("9", "♥")]);

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
