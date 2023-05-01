import { vi } from "vitest";
import { weighHand, playBot } from "./blackjackHelpers";

describe("games | blackjack | blackjackHelpers", () => {
  test("weighHand", () => {
    expect(
      weighHand([
        { name: "K", suit: "♠", weight: 13 },
        { name: "Q", suit: "♠", weight: 12 },
      ])
    ).toEqual({ weight: 20, soft: false });

    expect(
      weighHand([
        { name: "9", suit: "♠", weight: 9 },
        { name: "A", suit: "♠", weight: 14 },
      ])
    ).toEqual({ weight: 20, soft: true });

    expect(
      weighHand([
        { name: "9", suit: "♠", weight: 9 },
        { name: "A", suit: "♠", weight: 14 },
        { name: "4", suit: "♠", weight: 4 },
      ])
    ).toEqual({ weight: 14, soft: false });

    expect(
      weighHand([
        { name: "4", suit: "♠", weight: 4 },
        { name: "9", suit: "♠", weight: 9 },
        { name: "A", suit: "♠", weight: 14 },
      ])
    ).toEqual({ weight: 14, soft: false });

    // @ts-expect-error: for testing reasons
    expect(weighHand([{ name: "4", suit: "♠" }])).toEqual({
      weight: 0,
      soft: false,
    });

    expect(weighHand()).toEqual({ weight: 0, soft: false });
  });

  test("playBot | doubles", async () => {
    const double = vi.fn();
    const hit = vi.fn();
    const split = vi.fn();
    const stay = vi.fn();
    const dealer = {
      soft: false,
      cards: [{ name: "7", suit: "♠", weight: 7 }],
    };
    const player = {
      soft: false,
      cards: [
        { name: "7", suit: "♠", weight: 7 },
        { name: "7", suit: "♠", weight: 7 },
      ],
    };

    await playBot(player, dealer, double, hit, split, stay);
    expect(double).toHaveBeenCalledTimes(0);
    expect(hit).toHaveBeenCalledTimes(0);
    expect(split).toHaveBeenCalledTimes(1);
    expect(stay).toHaveBeenCalledTimes(0);
    dealer.cards = [{ name: "A", suit: "♠", weight: 14 }];
    await playBot(player, dealer, double, hit, split, stay);
    expect(double).toHaveBeenCalledTimes(0);
    expect(hit).toHaveBeenCalledTimes(1);
    expect(split).toHaveBeenCalledTimes(1);
    expect(stay).toHaveBeenCalledTimes(0);

    player.cards = [
      { name: "4", suit: "♠", weight: 4 },
      { name: "4", suit: "♠", weight: 4 },
    ];
    await playBot(player, dealer, double, hit, split, stay);
    expect(double).toHaveBeenCalledTimes(0);
    expect(hit).toHaveBeenCalledTimes(2);
    expect(split).toHaveBeenCalledTimes(1);
    expect(stay).toHaveBeenCalledTimes(0);
    dealer.cards = [{ name: "5", suit: "♠", weight: 5 }];
    await playBot(player, dealer, double, hit, split, stay);
    expect(double).toHaveBeenCalledTimes(0);
    expect(hit).toHaveBeenCalledTimes(2);
    expect(split).toHaveBeenCalledTimes(2);
    expect(stay).toHaveBeenCalledTimes(0);

    player.cards = [
      { name: "5", suit: "♠", weight: 5 },
      { name: "5", suit: "♠", weight: 5 },
    ];
    await playBot(player, dealer, double, hit, split, stay);
    expect(double).toHaveBeenCalledTimes(1);
    expect(hit).toHaveBeenCalledTimes(2);
    expect(split).toHaveBeenCalledTimes(2);
    expect(stay).toHaveBeenCalledTimes(0);
    dealer.cards = [{ name: "A", suit: "♠", weight: 14 }];
    await playBot(player, dealer, double, hit, split, stay);
    expect(double).toHaveBeenCalledTimes(1);
    expect(hit).toHaveBeenCalledTimes(3);
    expect(split).toHaveBeenCalledTimes(2);
    expect(stay).toHaveBeenCalledTimes(0);

    player.cards = [
      { name: "6", suit: "♠", weight: 6 },
      { name: "6", suit: "♠", weight: 6 },
    ];
    await playBot(player, dealer, double, hit, split, stay);
    expect(double).toHaveBeenCalledTimes(1);
    expect(hit).toHaveBeenCalledTimes(4);
    expect(split).toHaveBeenCalledTimes(2);
    expect(stay).toHaveBeenCalledTimes(0);
    dealer.cards = [{ name: "6", suit: "♠", weight: 6 }];
    await playBot(player, dealer, double, hit, split, stay);
    expect(double).toHaveBeenCalledTimes(1);
    expect(hit).toHaveBeenCalledTimes(4);
    expect(split).toHaveBeenCalledTimes(3);
    expect(stay).toHaveBeenCalledTimes(0);

    player.cards = [
      { name: "9", suit: "♠", weight: 9 },
      { name: "9", suit: "♠", weight: 9 },
    ];
    await playBot(player, dealer, double, hit, split, stay);
    expect(double).toHaveBeenCalledTimes(1);
    expect(hit).toHaveBeenCalledTimes(4);
    expect(split).toHaveBeenCalledTimes(4);
    expect(stay).toHaveBeenCalledTimes(0);
    dealer.cards = [{ name: "A", suit: "♠", weight: 14 }];
    await playBot(player, dealer, double, hit, split, stay);
    expect(double).toHaveBeenCalledTimes(1);
    expect(hit).toHaveBeenCalledTimes(4);
    expect(split).toHaveBeenCalledTimes(4);
    expect(stay).toHaveBeenCalledTimes(1);

    player.cards = [
      { name: "A", suit: "♠", weight: 14 },
      { name: "A", suit: "♠", weight: 14 },
    ];
    await playBot(player, dealer, double, hit, split, stay);
    expect(double).toHaveBeenCalledTimes(1);
    expect(hit).toHaveBeenCalledTimes(4);
    expect(split).toHaveBeenCalledTimes(5);
    expect(stay).toHaveBeenCalledTimes(1);

    player.cards = [
      { name: "K", suit: "♠", weight: 13 },
      { name: "K", suit: "♠", weight: 13 },
    ];
    await playBot(player, dealer, double, hit, split, stay);
    expect(double).toHaveBeenCalledTimes(1);
    expect(hit).toHaveBeenCalledTimes(4);
    expect(split).toHaveBeenCalledTimes(5);
    expect(stay).toHaveBeenCalledTimes(2);
  });

  test("playBot | soft hands", async () => {
    const double = vi.fn();
    const hit = vi.fn();
    const split = vi.fn();
    const stay = vi.fn();
    const dealer = {
      soft: false,
      cards: [{ name: "5", suit: "♠", weight: 5 }],
    };
    const player = {
      weight: 13,
      soft: true,
      cards: [
        { name: "A", suit: "♠", weight: 14 },
        { name: "2", suit: "♠", weight: 2 },
      ],
    };

    await playBot(player, dealer, double, hit, split, stay);
    expect(double).toHaveBeenCalledTimes(1);
    expect(hit).toHaveBeenCalledTimes(0);
    expect(stay).toHaveBeenCalledTimes(0);
    dealer.cards = [{ name: "A", suit: "♠", weight: 14 }];
    await playBot(player, dealer, double, hit, split, stay);
    expect(double).toHaveBeenCalledTimes(1);
    expect(hit).toHaveBeenCalledTimes(1);
    expect(stay).toHaveBeenCalledTimes(0);

    player.weight = 15;
    await playBot(player, dealer, double, hit, split, stay);
    expect(double).toHaveBeenCalledTimes(1);
    expect(hit).toHaveBeenCalledTimes(2);
    expect(stay).toHaveBeenCalledTimes(0);
    dealer.cards = [{ name: "5", suit: "♠", weight: 5 }];
    await playBot(player, dealer, double, hit, split, stay);
    expect(double).toHaveBeenCalledTimes(2);
    expect(hit).toHaveBeenCalledTimes(2);
    expect(stay).toHaveBeenCalledTimes(0);

    player.weight = 17;
    await playBot(player, dealer, double, hit, split, stay);
    expect(double).toHaveBeenCalledTimes(3);
    expect(hit).toHaveBeenCalledTimes(2);
    expect(stay).toHaveBeenCalledTimes(0);
    dealer.cards = [{ name: "A", suit: "♠", weight: 14 }];
    await playBot(player, dealer, double, hit, split, stay);
    expect(double).toHaveBeenCalledTimes(3);
    expect(hit).toHaveBeenCalledTimes(3);
    expect(stay).toHaveBeenCalledTimes(0);

    player.weight = 18;
    await playBot(player, dealer, double, hit, split, stay);
    expect(double).toHaveBeenCalledTimes(3);
    expect(hit).toHaveBeenCalledTimes(4);
    expect(stay).toHaveBeenCalledTimes(0);
    dealer.cards = [{ name: "7", suit: "♠", weight: 7 }];
    await playBot(player, dealer, double, hit, split, stay);
    expect(double).toHaveBeenCalledTimes(3);
    expect(hit).toHaveBeenCalledTimes(4);
    expect(stay).toHaveBeenCalledTimes(1);
    dealer.cards = [{ name: "6", suit: "♠", weight: 6 }];
    await playBot(player, dealer, double, hit, split, stay);
    expect(double).toHaveBeenCalledTimes(4);
    expect(hit).toHaveBeenCalledTimes(4);
    expect(stay).toHaveBeenCalledTimes(1);

    player.weight = 19;
    await playBot(player, dealer, double, hit, split, stay);
    expect(double).toHaveBeenCalledTimes(5);
    expect(hit).toHaveBeenCalledTimes(4);
    expect(stay).toHaveBeenCalledTimes(1);
    dealer.cards = [{ name: "A", suit: "♠", weight: 14 }];
    await playBot(player, dealer, double, hit, split, stay);
    expect(double).toHaveBeenCalledTimes(5);
    expect(hit).toHaveBeenCalledTimes(4);
    expect(stay).toHaveBeenCalledTimes(2);

    expect(split).toHaveBeenCalledTimes(0);
  });

  test("playBot | normal hands", async () => {
    const double = vi.fn();
    const hit = vi.fn();
    const split = vi.fn();
    const stay = vi.fn();
    const dealer = {
      soft: false,
      cards: [{ name: "5", suit: "♠", weight: 5 }],
    };
    const player = {
      weight: 5,
      soft: false,
      cards: [
        { name: "2", suit: "♠", weight: 2 },
        { name: "3", suit: "♠", weight: 3 },
      ],
    };

    await playBot(player, dealer, double, hit, split, stay);
    expect(double).toHaveBeenCalledTimes(0);
    expect(hit).toHaveBeenCalledTimes(1);
    expect(stay).toHaveBeenCalledTimes(0);

    player.weight = 9;
    await playBot(player, dealer, double, hit, split, stay);
    expect(double).toHaveBeenCalledTimes(1);
    expect(hit).toHaveBeenCalledTimes(1);
    expect(stay).toHaveBeenCalledTimes(0);
    dealer.cards = [{ name: "A", suit: "♠", weight: 14 }];
    await playBot(player, dealer, double, hit, split, stay);
    expect(double).toHaveBeenCalledTimes(1);
    expect(hit).toHaveBeenCalledTimes(2);
    expect(stay).toHaveBeenCalledTimes(0);

    player.weight = 10;
    await playBot(player, dealer, double, hit, split, stay);
    expect(double).toHaveBeenCalledTimes(1);
    expect(hit).toHaveBeenCalledTimes(3);
    expect(stay).toHaveBeenCalledTimes(0);
    dealer.cards = [{ name: "5", suit: "♠", weight: 5 }];
    await playBot(player, dealer, double, hit, split, stay);
    expect(double).toHaveBeenCalledTimes(2);
    expect(hit).toHaveBeenCalledTimes(3);
    expect(stay).toHaveBeenCalledTimes(0);

    player.weight = 11;
    await playBot(player, dealer, double, hit, split, stay);
    expect(double).toHaveBeenCalledTimes(3);
    expect(hit).toHaveBeenCalledTimes(3);
    expect(stay).toHaveBeenCalledTimes(0);

    player.weight = 12;
    await playBot(player, dealer, double, hit, split, stay);
    expect(double).toHaveBeenCalledTimes(3);
    expect(hit).toHaveBeenCalledTimes(3);
    expect(stay).toHaveBeenCalledTimes(1);
    dealer.cards = [{ name: "A", suit: "♠", weight: 14 }];
    await playBot(player, dealer, double, hit, split, stay);
    expect(double).toHaveBeenCalledTimes(3);
    expect(hit).toHaveBeenCalledTimes(4);
    expect(stay).toHaveBeenCalledTimes(1);

    player.weight = 15;
    await playBot(player, dealer, double, hit, split, stay);
    expect(double).toHaveBeenCalledTimes(3);
    expect(hit).toHaveBeenCalledTimes(5);
    expect(stay).toHaveBeenCalledTimes(1);
    dealer.cards = [{ name: "5", suit: "♠", weight: 5 }];
    await playBot(player, dealer, double, hit, split, stay);
    expect(double).toHaveBeenCalledTimes(3);
    expect(hit).toHaveBeenCalledTimes(5);
    expect(stay).toHaveBeenCalledTimes(2);

    player.weight = 19;
    await playBot(player, dealer, double, hit, split, stay);
    expect(double).toHaveBeenCalledTimes(3);
    expect(hit).toHaveBeenCalledTimes(5);
    expect(stay).toHaveBeenCalledTimes(3);

    player.weight = 23;
    await playBot(player, dealer, double, hit, split, stay);
    expect(double).toHaveBeenCalledTimes(3);
    expect(hit).toHaveBeenCalledTimes(5);
    expect(stay).toHaveBeenCalledTimes(4);

    expect(split).toHaveBeenCalledTimes(0);
  });
});
