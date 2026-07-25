import { render, screen } from "@testing-library/react";
import Hand from "./Hand";
import type { DBHand } from "../../../../jotai/player-atom";

describe("games | game-table | Hand", () => {
  const card = { name: "A", suit: "♠", weight: 14 };

  it("renders cards that are present", () => {
    const hand: DBHand = { cards: [card], weight: 14 };
    render(
      <Hand
        cardsToDiscard={[]}
        hand={hand}
        handNo={0}
        isBlackJack={false}
        isHandTurn={false}
        isMultiHand={false}
        isPlayerTurn={false}
        playerNo={0}
      />,
    );
    expect(screen.getByText("A♠")).toBeInTheDocument();
  });

  it("renders null for null cards in hand (line 59 false branch)", () => {
    const hand: DBHand = {
      cards: [null as unknown as typeof card, card],
      weight: 14,
    };
    render(
      <Hand
        cardsToDiscard={[]}
        hand={hand}
        handNo={0}
        isBlackJack={false}
        isHandTurn={false}
        isMultiHand={false}
        isPlayerTurn={false}
        playerNo={0}
      />,
    );
    // Only the real card renders; null slot produces nothing
    expect(screen.getByText("A♠")).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(1);
  });

  it("shows bust/hand weight header in blackjack mode", () => {
    const hand: DBHand = { cards: [card], weight: 22 };
    render(
      <Hand
        cardsToDiscard={[]}
        hand={hand}
        handNo={0}
        isBlackJack={true}
        isHandTurn={false}
        isMultiHand={false}
        isPlayerTurn={true}
        playerNo={0}
      />,
    );
    expect(screen.getByText("Bust: 22")).toBeInTheDocument();
  });
});
