import { rankSort } from "../../../../jotai/deck-state";
import Deck, { asyncForEach } from "./useDeck";

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

describe("apis | Deck", () => {
  test("shuffle", async () => {
    await Deck()
      .shuffle()
      .then((deck) => {
        expect(deck).toBeDefined();
        expect(cardNames).toContain(deck && deck[0].name);
        expect(cardSuits).toContain(deck && deck[0].suit);
        expect(deck && deck[0].weight).toBeLessThanOrEqual(14);
        expect(deck && deck[0].weight).toBeGreaterThanOrEqual(2);
      });
  });

  test("deal", async () => {
    await Deck()
      .deal(0)
      .then((deck) => {
        expect(deck).toBeDefined();
        expect(deck[0]).toBeUndefined();
        expect(deck).toHaveLength(0);
      });

    await Deck()
      .deal(1)
      .then((deck) => {
        expect(deck).toBeDefined();
        expect(cardNames).toContain(deck[0].name);
        expect(cardSuits).toContain(deck[0].suit);
        expect(deck[0].weight).toBeLessThanOrEqual(14);
        expect(deck[0].weight).toBeGreaterThanOrEqual(2);
        expect(deck).toHaveLength(1);
      });

    await Deck()
      .deal(2)
      .then((deck) => {
        expect(deck).toBeDefined();
        expect(cardNames).toContain(deck[0].name);
        expect(cardSuits).toContain(deck[0].suit);
        expect(deck[0].weight).toBeLessThanOrEqual(14);
        expect(deck[0].weight).toBeGreaterThanOrEqual(2);
        expect(deck).toHaveLength(2);
      });
  });

  test("rankSort working", () => {
    const mockHand = [
      { name: "K", weight: 13, suit: "♣" },
      { name: "4", weight: 4, suit: "♠" },
    ];

    mockHand.sort(rankSort);

    expect(mockHand).toStrictEqual([
      { name: "4", weight: 4, suit: "♠" },
      { name: "K", weight: 13, suit: "♣" },
    ]);

    expect(mockHand).not.toStrictEqual([
      { name: "K", weight: 13, suit: "♣" },
      { name: "4", weight: 4, suit: "♠" },
    ]);
  });

  test("rankSort obsolete", () => {
    const mockHand = [
      { name: "4", weight: 4, suit: "♠" },
      { name: "K", weight: 13, suit: "♣" },
    ];

    mockHand.sort(rankSort);

    expect(mockHand).toStrictEqual([
      { name: "4", weight: 4, suit: "♠" },
      { name: "K", weight: 13, suit: "♣" },
    ]);
  });

  test("asyncForEach works as expected", async () => {
    let x = 1;

    // @ts-expect-error: just testing
    await asyncForEach([1, 2, 3], (num) => {
      x += num;
    });
    expect(x).toEqual(7);
  });
});
