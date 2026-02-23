import { createStore } from "jotai";
import { describe, it, expect, beforeEach } from "vitest";
import {
  rankSort,
  shuffle,
  deckAtom,
  lastDealtCardsAtom,
  dealCardsAtom,
  shuffleAtom,
} from "./deck-state";

const cardNames = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
];
const cardSuits = ["♣", "♦", "♥", "♠"];

describe("jotai | deck-state", () => {
  describe("rankSort", () => {
    it("sorts by weight ascending", () => {
      const hand = [
        { name: "K", weight: 13, suit: "♣" },
        { name: "4", weight: 4, suit: "♠" },
      ];
      hand.sort(rankSort);
      expect(hand).toStrictEqual([
        { name: "4", weight: 4, suit: "♠" },
        { name: "K", weight: 13, suit: "♣" },
      ]);
    });

    it("leaves already-sorted hand unchanged", () => {
      const hand = [
        { name: "4", weight: 4, suit: "♠" },
        { name: "K", weight: 13, suit: "♣" },
      ];
      hand.sort(rankSort);
      expect(hand).toStrictEqual([
        { name: "4", weight: 4, suit: "♠" },
        { name: "K", weight: 13, suit: "♣" },
      ]);
    });
  });

  describe("shuffle", () => {
    it("returns 52 cards", () => {
      const deck = shuffle();
      expect(deck).toHaveLength(52);
    });

    it("returns cards with valid name and suit", () => {
      const deck = shuffle();
      deck.forEach((card) => {
        expect(cardNames).toContain(card.name);
        expect(cardSuits).toContain(card.suit);
        expect(card.weight).toBeGreaterThanOrEqual(2);
        expect(card.weight).toBeLessThanOrEqual(14);
      });
    });
  });

  describe("dealCardsAtom", () => {
    let store: ReturnType<typeof createStore>;

    beforeEach(() => {
      store = createStore();
      store.set(shuffleAtom);
    });

    it("deal(0) returns empty array and does not change deck length", () => {
      const initialDeck = store.get(deckAtom);
      store.set(dealCardsAtom, 0);
      const dealt = store.get(lastDealtCardsAtom);
      const deck = store.get(deckAtom);
      expect(dealt).toHaveLength(0);
      expect(deck).toHaveLength(initialDeck.length);
    });

    it("deal(1) returns one card and reduces deck by 1", () => {
      const initialLen = store.get(deckAtom).length;
      store.set(dealCardsAtom, 1);
      const dealt = store.get(lastDealtCardsAtom);
      const deck = store.get(deckAtom);
      expect(dealt).toHaveLength(1);
      expect(cardNames).toContain(dealt[0].name);
      expect(cardSuits).toContain(dealt[0].suit);
      expect(deck).toHaveLength(initialLen - 1);
    });

    it("deal(2) returns two cards and reduces deck by 2", () => {
      const initialLen = store.get(deckAtom).length;
      store.set(dealCardsAtom, 2);
      const dealt = store.get(lastDealtCardsAtom);
      const deck = store.get(deckAtom);
      expect(dealt).toHaveLength(2);
      expect(deck).toHaveLength(initialLen - 2);
    });

    it("sequential deals return different cards (no duplicate draws)", () => {
      store.set(dealCardsAtom, 1);
      const first = store.get(lastDealtCardsAtom)[0];
      store.set(dealCardsAtom, 1);
      const second = store.get(lastDealtCardsAtom)[0];
      expect(first).not.toEqual(second);
    });
  });
});
