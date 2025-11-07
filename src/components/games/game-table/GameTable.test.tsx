import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import GameTable from ".";

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
        onClick={vi.fn()}
        players={[ken]}
        turn={{ player: 0, hand: 0 }}
      />,
    );

    expect(screen.getByText("Ken: $1000").parentElement).toHaveStyle({
      background: "rgb(224, 224, 224)",
    });
    expect(screen.getByText("Ken: $1000")).toBeInTheDocument();
    expect(screen.getByText("Bet: $5")).toBeInTheDocument();
    expect(screen.getByText("Hand: 0")).toBeInTheDocument();
    expect(screen.getByText("K♠")).toBeInTheDocument();
    expect(screen.getByText("♠")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("hides hands", () => {
    render(
      <GameTable
        hideHands
        onClick={vi.fn()}
        players={[ken]}
        turn={{ player: 0, hand: 0 }}
      />,
    );

    expect(screen.getByText("Ken: $1000")).toBeInTheDocument();
    expect(screen.getByText("Bet: $5")).toBeInTheDocument();
    expect(screen.queryByText("Hand: 0")).toBeNull();
    expect(screen.queryByText("K♠")).toBeNull();
    expect(screen.queryByText("♠")).toBeNull();
  });

  it("supports multiple hands", () => {
    const multiHandKen = {
      ...ken,
      hands: [...ken.hands, { cards: [{ name: "Q", weight: 12, suit: "♥" }] }],
    };
    render(
      <GameTable
        onClick={vi.fn()}
        players={[multiHandKen]}
        turn={{ player: 0, hand: 0 }}
      />,
    );

    expect(screen.getByText("Ken: $1000")).toBeInTheDocument();
    expect(screen.getByText("Bet: $5")).toBeInTheDocument();
    expect(screen.getAllByText("Hand: 0")).toHaveLength(2);
    expect(screen.getAllByRole("button")).toHaveLength(2);
    expect(screen.getByText("K♠")).toBeInTheDocument();
    expect(screen.getByText("♠")).toBeInTheDocument();
    expect(screen.getByText("Q♥")).toBeInTheDocument();
    expect(screen.getByText("♥")).toBeInTheDocument();
  });

  it("represents a bust", () => {
    const bustKen = { ...ken, hands: [{ ...ken.hands[0], weight: 22 }] };

    render(
      <GameTable
        onClick={vi.fn()}
        players={[bustKen]}
        turn={{ player: 0, hand: 0 }}
      />,
    );

    expect(screen.queryByText("Hand: 0")).toBeNull();
    expect(screen.getByText("Bust: 22")).toBeInTheDocument();
  });

  it("calls cardClickHandler when card is clicked", () => {
    const handleCardClick = vi.fn();
    render(
      <GameTable
        cardClickHandler={handleCardClick}
        onClick={vi.fn()}
        players={[ken]}
        turn={{ player: 0, hand: 0 }}
      />,
    );

    expect(handleCardClick).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button"));
    expect(handleCardClick).toHaveBeenCalledWith(0, 0, 0);
  });

  it("changes color on win status", () => {
    const winningKen = { ...ken, status: "win" };
    render(
      <GameTable
        onClick={vi.fn()}
        players={[winningKen]}
        turn={{ player: 0, hand: 0 }}
      />,
    );

    const player = screen.getByText("Ken: $1000").parentElement;
    expect(player).not.toHaveStyle({ background: "rgb(128, 222, 234)" });
    expect(player).toHaveStyle({ background: "rgb(129, 199, 132)" });
  });

  it("changes color on draw status", () => {
    const tiedKen = { ...ken, status: "draw" };
    render(
      <GameTable
        onClick={vi.fn()}
        players={[tiedKen]}
        turn={{ player: 0, hand: 0 }}
      />,
    );

    const player = screen.getByText("Ken: $1000").parentElement;
    expect(player).not.toHaveStyle({ background: "rgb(128, 222, 234)" });
    expect(player).toHaveStyle({ background: "rgb(144, 164, 174)" });
  });

  it("changes color on lose status", () => {
    const losingKen = { ...ken, status: "lose" };
    render(
      <GameTable
        onClick={vi.fn()}
        players={[losingKen]}
        turn={{ player: 0, hand: 0 }}
      />,
    );

    const player = screen.getByText("Ken: $1000").parentElement;
    expect(player).not.toHaveStyle({ background: "rgb(128, 222, 234)" });
    expect(player).toHaveStyle({ background: "rgb(229, 115, 115)" });
  });

  it("renders and clicks gameFunctions", () => {
    const handleClick = vi.fn();
    render(
      <GameTable
        gameFunctions={["hello", "world"]}
        onClick={handleClick}
        players={[ken]}
        turn={{ player: 0, hand: 0 }}
      />,
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
