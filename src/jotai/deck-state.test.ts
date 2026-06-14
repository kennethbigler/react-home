import { createStore } from "jotai";
import { describe, it, expect, beforeEach } from "vitest";
import {
  rankSort,
  shuffle,
  deckAtom,
  lastDealtCardsAtom,
  dealCardsAtom,
  dealPokerAtom,
  shuffleAtom,
} from "./deck-state";
import playerAtom from "./player-atom";

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

  describe("dealPokerAtom", () => {
    let store: ReturnType<typeof createStore>;

    beforeEach(() => {
      store = createStore();
      store.set(shuffleAtom);
    });

    it("deals cards to player when deck has enough (lines 125-132 true branch)", () => {
      const players = store.get(playerAtom);
      const playerId = players[0].id;
      store.set(dealPokerAtom, 2, playerId, []);
      const updatedPlayers = store.get(playerAtom);
      const player = updatedPlayers.find((p) => p.id === playerId)!;
      expect(player.hands[0].cards).toHaveLength(2);
    });

    it("does not deal when deck is empty (lines 125-132 false branch)", () => {
      const players = store.get(playerAtom);
      const playerId = players[0].id;
      // Empty the deck
      store.set(deckAtom, []);
      store.set(dealPokerAtom, 5, playerId, []);
      const updatedPlayers = store.get(playerAtom);
      const player = updatedPlayers.find((p) => p.id === playerId)!;
      expect(player.hands[0].cards).toHaveLength(0);
    });

    it("preserves prevCards when dealing (dealPokerAtom with prevCards)", () => {
      const players = store.get(playerAtom);
      const playerId = players[0].id;
      const prevCard = { name: "K", suit: "♠", weight: 13 };
      store.set(dealPokerAtom, 1, playerId, [prevCard]);
      const updatedPlayers = store.get(playerAtom);
      const player = updatedPlayers.find((p) => p.id === playerId)!;
      expect(player.hands[0].cards.length).toBeGreaterThanOrEqual(1);
      expect(player.hands[0].cards.some((c) => c.name === "K" && c.suit === "♠")).toBe(true);
    });
  });
});
