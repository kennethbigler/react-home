import { vi } from "vitest";
import { DBPlayer } from "../../../../jotai/player-atom";
import {
  rankHand,
  getHistogram,
  evaluate,
  getCardsToDiscard,
  computer,
} from "../helpers";

const hand = [
  { name: "K", weight: 13, suit: "♠" },
  { name: "Q", weight: 12, suit: "♠" },
  { name: "J", weight: 11, suit: "♠" },
  { name: "10", weight: 10, suit: "♠" },
  { name: "9", weight: 9, suit: "♥" },
];

describe("games | poker | helpers", () => {
  test("rankHand", () => {
    expect(rankHand(hand, [4])).toEqual(7);
    expect(rankHand(hand, [3, 2])).toEqual(6);
    expect(rankHand(hand, [3, 1])).toEqual(3);
    expect(rankHand(hand, [2, 2, 1])).toEqual(2);
    expect(rankHand(hand, [2, 1, 1])).toEqual(1);
    expect(rankHand(hand, [1, 1, 1, 1, 1])).toEqual(4);
    expect(rankHand(hand, [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1])).toEqual(4);
    expect(rankHand(hand.slice(0, 3), [1, 1, 1, 1, 1])).toEqual(8);
    expect(rankHand(hand.slice(0, 3), [0])).toEqual(5);
    expect(rankHand(hand, [0])).toEqual(0);
  });

  test("getHistogram", () => {
    expect(getHistogram([{ name: "K", weight: 13, suit: "♠" }])).toEqual([
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0,
    ]);
  });

  test("evaluate", () => {
    expect(evaluate(hand)).toEqual("4789ab");
  });

  test("getCardsToDiscard", () => {
    /* draw 4-5 on high card */
    expect(
      getCardsToDiscard(
        4,
        [0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0],
        [...hand.slice(0, 4), { name: "8", weight: 8, suit: "♥" }],
      ),
    ).toEqual([1, 2, 3, 4]);
    /* draw 3 on 2 of a kind */
    expect(
      getCardsToDiscard(
        3,
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 2, 0],
        [{ name: "K", weight: 13, suit: "♥" }, ...hand.slice(0, 4)],
      ),
    ).toEqual([2, 3, 4]);
    /* draw 1 on 3 of a kind */
    expect(
      getCardsToDiscard(
        1,
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 3, 0],
        [
          { name: "K", weight: 13, suit: "♦" },
          { name: "K", weight: 13, suit: "♥" },
          ...hand.slice(0, 3),
        ],
      ),
    ).toEqual([4]);
    /* draw 1 on 2 Pair */
    expect(
      getCardsToDiscard(
        1,
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 0],
        [
          { name: "K", weight: 13, suit: "♥" },
          { name: "Q", weight: 12, suit: "♥" },
          ...hand.slice(0, 3),
        ],
      ),
    ).toEqual([4]);
  });

  test("computer", () => {
    const player: DBPlayer = {
      hands: [
        {
          cards: [
            { name: "7", weight: 7, suit: "♠" },
            { name: "5", weight: 5, suit: "♠" },
            { name: "4", weight: 4, suit: "♠" },
            { name: "3", weight: 3, suit: "♠" },
            { name: "2", weight: 2, suit: "♥" },
          ],
        },
      ],
      id: 1,
      isBot: false,
      money: 100,
      status: "",
      name: "",
      bet: 5,
    };

    const discard = vi.fn().mockImplementation(() => {
      throw new Error("test");
    });

    // eslint-disable-next-line no-console
    const oldConsole = console.error;
    // eslint-disable-next-line no-console
    console.error = vi.fn();

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    computer(player, discard);

    // eslint-disable-next-line no-console
    expect(console.error).toHaveBeenCalled();

    // eslint-disable-next-line no-console
    console.error = oldConsole;
  });
});
