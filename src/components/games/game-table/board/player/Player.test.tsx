import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import Player from "./Player";
import { DBPlayer } from "../../../../../jotai/player-atom";
import { TurnState } from "../../../../../jotai/turn-atom";

const basePlayer: DBPlayer = {
  id: 1,
  name: "Ken",
  isBot: false,
  money: 100,
  bet: 10,
  status: "",
  hands: [{ cards: [], weight: 0, soft: false }],
};

const turn: TurnState = { player: 1, hand: 0 };

describe("games | game-table | Player", () => {
  it("renders player name and money", () => {
    render(
      <Player
        player={basePlayer}
        playerNo={1}
        turn={turn}
        cardsToDiscard={[]}
        hideHands={false}
        isBlackJack={false}
      />,
    );
    expect(screen.getByText("Ken: $100")).toBeInTheDocument();
  });

  it("calls betHandler with decreased value when decrement clicked (line 41-42 true branch)", () => {
    const betHandler = vi.fn();
    render(
      <Player
        player={{ ...basePlayer, bet: 20 }}
        playerNo={1}
        turn={null}
        cardsToDiscard={[]}
        hideHands={true}
        isBlackJack={true}
        betHandler={betHandler}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /decrease ken bet/i }));
    expect(betHandler).toHaveBeenCalledWith(1, 15);
  });

  it("calls betHandler with increased value when increment clicked (line 46-47 true branch)", () => {
    const betHandler = vi.fn();
    render(
      <Player
        player={{ ...basePlayer, bet: 20 }}
        playerNo={1}
        turn={null}
        cardsToDiscard={[]}
        hideHands={true}
        isBlackJack={true}
        betHandler={betHandler}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /increase ken bet/i }));
    expect(betHandler).toHaveBeenCalledWith(1, 25);
  });

  it("does not throw when bet buttons clicked without betHandler (lines 41-42, 46-47 false branches)", () => {
    render(
      <Player
        player={{ ...basePlayer, bet: 20 }}
        playerNo={1}
        turn={null}
        cardsToDiscard={[]}
        hideHands={true}
        isBlackJack={true}
      />,
    );
    const decr = screen.getByRole("button", { name: /decrease ken bet/i });
    const incr = screen.getByRole("button", { name: /increase ken bet/i });
    expect(() => fireEvent.click(decr)).not.toThrow();
    expect(() => fireEvent.click(incr)).not.toThrow();
  });
});
