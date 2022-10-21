import React from "react";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { axe } from "jest-axe";
import render from "../../../recoil-test-render";
import Deck from "../../../apis/Deck";
import Blackjack from "./Blackjack";

const deck = jest.spyOn(Deck, "deal");

const ace = { name: "A", weight: 14, suit: "♣" };
const king = { name: "K", weight: 13, suit: "♣" };
const queen = { name: "Q", weight: 12, suit: "♣" };
const jack = { name: "J", weight: 11, suit: "♣" };
const nine = { name: "9", weight: 9, suit: "♣" };
const eight = { name: "8", weight: 8, suit: "♣" };

describe("games | blackjack | Blackjack", () => {
  it("renders as expected", async () => {
    const { container } = render(<Blackjack />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();

    expect(screen.getByText("Blackjack (21)")).toBeInTheDocument();
    expect(screen.getByText("Rules")).toBeInTheDocument();
    expect(screen.getByText("Ken: $100")).toBeInTheDocument();
    expect(screen.getAllByText("Bet: $5")).toHaveLength(6);
    expect(screen.getByText("Bot-2: $100")).toBeInTheDocument();
    expect(screen.getByText("Dealer: $100")).toBeInTheDocument();
    expect(screen.getByText("Finish Betting")).toBeInTheDocument();
  });

  it("opens the rules modal", () => {
    render(<Blackjack />);

    expect(screen.queryByText("Objective:")).toBeNull();
    expect(screen.queryByText("Close")).toBeNull();

    fireEvent.click(screen.getByText("Rules"));
    expect(screen.getByText("Objective:")).toBeInTheDocument();
    expect(screen.getByText("Close")).toBeInTheDocument();
  });

  it("can't HIT on a blackjack", async () => {
    deck
      .mockReset()
      .mockResolvedValueOnce([king, ace])
      .mockResolvedValueOnce([king, queen])
      .mockResolvedValueOnce([king, queen])
      .mockResolvedValueOnce([king, queen])
      .mockResolvedValueOnce([king, queen])
      .mockResolvedValueOnce([king, queen])
      .mockResolvedValueOnce([king])
      .mockResolvedValue([jack]);

    render(<Blackjack />);

    fireEvent.click(screen.getByText("Finish Betting"));
    await waitFor(() => screen.getByText("Hand: 21"));
    expect(screen.getByText("Stay")).toBeInTheDocument();
    expect(screen.queryByText("Hit")).toBeNull();
    expect(screen.queryByText("Double")).toBeNull();
    expect(screen.queryByText("Split")).toBeNull();
    await waitFor(() =>
      expect(screen.getAllByText("Hand: 20")).toHaveLength(5)
    );
    await waitFor(() => screen.getByText("Hand: 10"));
    fireEvent.click(screen.getByText("Stay"));
    await waitFor(() => screen.getByText("New Game"));
    fireEvent.click(screen.getByText("New Game"));
  });

  it("can HIT on a hand, stay, then start a new game", async () => {
    deck
      .mockReset()
      .mockResolvedValueOnce([king, queen])
      .mockResolvedValueOnce([king, queen])
      .mockResolvedValueOnce([king, queen])
      .mockResolvedValueOnce([king, queen])
      .mockResolvedValueOnce([king, queen])
      .mockResolvedValueOnce([king, queen])
      .mockResolvedValueOnce([king])
      .mockResolvedValue([jack]);

    render(<Blackjack />);

    fireEvent.click(screen.getByText("Finish Betting"));
    await waitFor(() =>
      expect(screen.getAllByText("Hand: 20")).toHaveLength(6)
    );
    await waitFor(() => screen.getByText("Hand: 10"));
    fireEvent.click(screen.getByText("Hit"));
    await waitFor(() => screen.getByText("Bust: 30"));
    fireEvent.click(screen.getByText("Stay"));
    await waitFor(() => screen.getByText("New Game"));
    fireEvent.click(screen.getByText("New Game"));
  });

  it("can DOUBLE on a hand, then start a new game", async () => {
    deck
      .mockReset()
      .mockResolvedValueOnce([king, queen])
      .mockResolvedValueOnce([king, queen])
      .mockResolvedValueOnce([king, queen])
      .mockResolvedValueOnce([king, queen])
      .mockResolvedValueOnce([king, queen])
      .mockResolvedValueOnce([king, queen])
      .mockResolvedValueOnce([king])
      .mockResolvedValue([jack]);

    render(<Blackjack />);

    fireEvent.click(screen.getByText("Finish Betting"));
    await waitFor(() =>
      expect(screen.getAllByText("Hand: 20")).toHaveLength(6)
    );
    await waitFor(() => screen.getByText("Hand: 10"));
    expect(screen.getAllByText("Bet: $5")).toHaveLength(6);
    fireEvent.click(screen.getByText("Double"));
    await waitFor(() => screen.getByText("Bust: 30"));
    await waitFor(() => expect(screen.getAllByText("Bet: $5")).toHaveLength(5));
    expect(screen.getByText("Bet: $10")).toBeInTheDocument();
    await waitFor(() => screen.getByText("New Game"));
    fireEvent.click(screen.getByText("New Game"));
  });

  it("can SPLIT on a hand, then start a new game", async () => {
    deck
      .mockReset()
      .mockResolvedValueOnce([king, queen])
      .mockResolvedValueOnce([king, queen])
      .mockResolvedValueOnce([king, queen])
      .mockResolvedValueOnce([king, queen])
      .mockResolvedValueOnce([king, queen])
      .mockResolvedValueOnce([king, queen])
      .mockResolvedValueOnce([king])
      .mockResolvedValue([nine, eight]);

    render(<Blackjack />);

    fireEvent.click(screen.getByText("Finish Betting"));
    await waitFor(() => screen.getByText("Hand: 10"));
    expect(screen.getAllByText("Hand: 20")).toHaveLength(6);

    // TODO: 1 act issue
    fireEvent.click(screen.getByText("Split"));
    await waitFor(() => screen.getByText("Hand: 18"));
    await waitFor(() => screen.getByText("Hand: 19"));

    fireEvent.click(screen.getByText("Stay"));
    fireEvent.click(screen.getByText("Stay"));
    await waitFor(() => screen.getByText("New Game"));
    fireEvent.click(screen.getByText("New Game"));

    // TODO: adds 4 act issues
    fireEvent.click(screen.getByText("Finish Betting"));
  });
});
