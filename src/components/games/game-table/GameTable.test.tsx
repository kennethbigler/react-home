import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import GameTable from "./GameTable";

const ken = {
  id: 1,
  isBot: false,
  money: 1000,
  status: "coding",
  name: "Ken",
  bet: 5,
  hands: [{ cards: [{ name: "K", weight: 13, suit: "♠" }] }],
};

describe("games | game-table | GameTable", () => {
  it("renders as expected with minimal props", () => {
    render(
      <GameTable
        onClick={jest.fn()}
        players={[ken]}
        turn={{ player: 0, hand: 0 }}
      />
    );

    expect(screen.getByText("Ken: $1000").parentElement).toHaveStyle({
      background: "rgb(128, 222, 234)",
    });
    expect(screen.getByText("Ken: $1000")).toBeInTheDocument();
    expect(screen.getByText("Bet: $5")).toBeInTheDocument();
    expect(screen.getByText("Hand: 0")).toBeInTheDocument();
    expect(screen.getByText("K♠")).toBeInTheDocument();
    expect(screen.getByText("♠")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("hides hands", () => {
    render(
      <GameTable
        hideHands
        onClick={jest.fn()}
        players={[ken]}
        turn={{ player: 0, hand: 0 }}
      />
    );

    expect(screen.getByText("Ken: $1000")).toBeInTheDocument();
    expect(screen.getByText("Bet: $5")).toBeInTheDocument();
    expect(screen.queryByText("Hand: 0")).toBeNull();
    expect(screen.queryByText("K♠")).toBeNull();
    expect(screen.queryByText("♠")).toBeNull();
    expect(screen.queryByRole("main")).toBeNull();
  });

  it("supports multiple hands", () => {
    const multiHandKen = {
      ...ken,
      hands: [...ken.hands, { cards: [{ name: "Q", weight: 12, suit: "♥" }] }],
    };
    render(
      <GameTable
        onClick={jest.fn()}
        players={[multiHandKen]}
        turn={{ player: 0, hand: 0 }}
      />
    );

    expect(screen.getByText("Ken: $1000")).toBeInTheDocument();
    expect(screen.getByText("Bet: $5")).toBeInTheDocument();
    expect(screen.getAllByText("Hand: 0")).toHaveLength(2);
    expect(screen.getAllByRole("main")).toHaveLength(2);
    expect(screen.getByText("K♠")).toBeInTheDocument();
    expect(screen.getByText("♠")).toBeInTheDocument();
    expect(screen.getByText("Q♥")).toBeInTheDocument();
    expect(screen.getByText("♥")).toBeInTheDocument();
  });

  it("represents a bust", () => {
    const bustKen = { ...ken, hands: [{ ...ken.hands[0], weight: 22 }] };

    render(
      <GameTable
        onClick={jest.fn()}
        players={[bustKen]}
        turn={{ player: 0, hand: 0 }}
      />
    );

    expect(screen.queryByText("Hand: 0")).toBeNull();
    expect(screen.getByText("Bust: 22")).toBeInTheDocument();
  });

  it("calls cardClickHandler when card is clicked", () => {
    const handleCardClick = jest.fn();
    render(
      <GameTable
        cardClickHandler={handleCardClick}
        onClick={jest.fn()}
        players={[ken]}
        turn={{ player: 0, hand: 0 }}
      />
    );

    expect(handleCardClick).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("main"));
    expect(handleCardClick).toHaveBeenCalledWith(0, 0, 0);
  });

  it("changes color on win status", () => {
    const winningKen = { ...ken, status: "win" };
    render(
      <GameTable
        onClick={jest.fn()}
        players={[winningKen]}
        turn={{ player: 0, hand: 0 }}
      />
    );

    const player = screen.getByText("Ken: $1000").parentElement;
    expect(player).not.toHaveStyle({ background: "rgb(128, 222, 234)" });
    expect(player).toHaveStyle({ background: "rgb(129, 199, 132)" });
  });

  it("changes color on draw status", () => {
    const tiedKen = { ...ken, status: "draw" };
    render(
      <GameTable
        onClick={jest.fn()}
        players={[tiedKen]}
        turn={{ player: 0, hand: 0 }}
      />
    );

    const player = screen.getByText("Ken: $1000").parentElement;
    expect(player).not.toHaveStyle({ background: "rgb(128, 222, 234)" });
    expect(player).toHaveStyle({ background: "rgb(144, 164, 174)" });
  });

  it("changes color on lose status", () => {
    const losingKen = { ...ken, status: "lose" };
    render(
      <GameTable
        onClick={jest.fn()}
        players={[losingKen]}
        turn={{ player: 0, hand: 0 }}
      />
    );

    const player = screen.getByText("Ken: $1000").parentElement;
    expect(player).not.toHaveStyle({ background: "rgb(128, 222, 234)" });
    expect(player).toHaveStyle({ background: "rgb(229, 115, 115)" });
  });

  it("renders and clicks gameFunctions", () => {
    const handleClick = jest.fn();
    render(
      <GameTable
        gameFunctions={["hello", "world"]}
        onClick={handleClick}
        players={[ken]}
        turn={{ player: 0, hand: 0 }}
      />
    );

    expect(screen.getByText("hello")).toBeInTheDocument();
    expect(screen.getByText("world")).toBeInTheDocument();
    expect(handleClick).toHaveBeenCalledTimes(0);
    fireEvent.click(screen.getByText("hello"));
    expect(handleClick).toHaveBeenNthCalledWith(1, "hello");
    expect(handleClick).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText("world"));
    expect(handleClick).toHaveBeenNthCalledWith(2, "world");
    expect(handleClick).toHaveBeenCalledTimes(2);
  });
});
