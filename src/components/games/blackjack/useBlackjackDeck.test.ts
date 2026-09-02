import { act } from "@testing-library/react";
import { renderHookWithHydratedAtoms } from "@/test-utils/renderWithHydratedAtoms";
import type { DBCard } from "@/jotai/deck-atom";
import useBlackjackDeck from "./useBlackjackDeck";

describe("games | blackjack | useBlackjackDeck", () => {
  it("shuffles the deck", async () => {
    const { result } = renderHookWithHydratedAtoms(() => useBlackjackDeck());

    await act(async () => {
      await result.current.shuffle();
    });

    expect(result.current.shuffle).toBeDefined();
  });

  it("deals the requested number of cards", async () => {
    const { result } = renderHookWithHydratedAtoms(() => useBlackjackDeck());

    await act(async () => {
      await result.current.shuffle();
    });

    let dealt: DBCard[] = [];
    await act(async () => {
      dealt = await result.current.deal(3);
    });

    expect(dealt).toHaveLength(3);
    dealt.forEach((card) => {
      expect(card).toMatchObject({
        name: expect.any(String),
        suit: expect.any(String),
        weight: expect.any(Number),
      });
    });
  });
});
