import { weighHand } from "./blackjackHelpers";

describe("games | blackjack | blackjackHelpers", () => {
  test("weighHand", () => {
    expect(
      weighHand([
        { name: "K", suit: "♠", weight: 13 },
        { name: "Q", suit: "♠", weight: 12 },
      ]),
    ).toEqual({ weight: 20, soft: false });

    expect(
      weighHand([
        { name: "9", suit: "♠", weight: 9 },
        { name: "A", suit: "♠", weight: 14 },
      ]),
    ).toEqual({ weight: 20, soft: true });

    expect(
      weighHand([
        { name: "9", suit: "♠", weight: 9 },
        { name: "A", suit: "♠", weight: 14 },
        { name: "4", suit: "♠", weight: 4 },
      ]),
    ).toEqual({ weight: 14, soft: false });

    expect(
      weighHand([
        { name: "4", suit: "♠", weight: 4 },
        { name: "9", suit: "♠", weight: 9 },
        { name: "A", suit: "♠", weight: 14 },
      ]),
    ).toEqual({ weight: 14, soft: false });

    // @ts-expect-error: for testing reasons
    expect(weighHand([{ name: "4", suit: "♠" }])).toEqual({
      weight: 0,
      soft: false,
    });

    expect(weighHand()).toEqual({ weight: 0, soft: false });
  });
});
