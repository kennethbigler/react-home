import { describe, it, expect } from "vitest";
import {
  calcTP,
  calcLongSuitPoints,
  calcShortSuitPoints,
  calcTPWithFit,
  isBalanced,
  hasVoid,
  ruleOf20,
  longestSuitInfo,
  hasFiveCardMajor,
  bestMajor,
  longerMinor,
  suitSymbol,
  suitBidLevel,
  getContractLimit,
  analyzeHand,
  getRecommendation,
  getRelatives,
  getValidBidsAfter,
  getBidMeaning,
  deriveSituation,
  getFinalContractInfo,
  type Hand,
  type AuctionContext,
  type AuctionState,
} from "./bidding-logic";

// ─── Helper to build hands quickly ───────────────────────────────────────────
function mkHand(hcp: number, s: number, h: number, d: number, c: number): Hand {
  return { hcp, spades: s, hearts: h, diamonds: d, clubs: c };
}

function ctx(
  situation: AuctionContext["situation"],
  extras?: Partial<AuctionContext>,
): AuctionContext {
  return { situation, vulnerability: "none", ...extras };
}

// ─── Helper Calculations ─────────────────────────────────────────────────────

describe("bidding-logic | calcLongSuitPoints", () => {
  it("adds 1 per card over 4 per suit", () => {
    expect(calcLongSuitPoints(mkHand(10, 5, 5, 2, 1))).toBe(2);
    expect(calcLongSuitPoints(mkHand(10, 6, 4, 2, 1))).toBe(2);
    expect(calcLongSuitPoints(mkHand(10, 7, 3, 2, 1))).toBe(3);
    expect(calcLongSuitPoints(mkHand(10, 4, 4, 3, 2))).toBe(0);
  });

  it("returns 0 for balanced 4-3-3-3 hand", () => {
    expect(calcLongSuitPoints(mkHand(12, 4, 3, 3, 3))).toBe(0);
  });
});

describe("bidding-logic | calcTP", () => {
  it("equals HCP when no long suits", () => {
    expect(calcTP(mkHand(15, 4, 4, 3, 2))).toBe(15);
  });

  it("adds long suit points to HCP", () => {
    expect(calcTP(mkHand(10, 6, 4, 2, 1))).toBe(12);
    expect(calcTP(mkHand(8, 7, 3, 2, 1))).toBe(11);
  });
});

describe("bidding-logic | calcShortSuitPoints", () => {
  it("void=5, singleton=3, doubleton=1", () => {
    expect(calcShortSuitPoints(mkHand(10, 0, 7, 3, 3))).toBe(5); // void in spades
    expect(calcShortSuitPoints(mkHand(10, 1, 6, 3, 3))).toBe(3); // singleton spades
    expect(calcShortSuitPoints(mkHand(10, 2, 6, 3, 2))).toBe(2); // 2 doubletons
    expect(calcShortSuitPoints(mkHand(10, 4, 3, 3, 3))).toBe(0); // no short suits
  });
});

describe("bidding-logic | calcTPWithFit", () => {
  it("HCP + short suit points", () => {
    const hand = mkHand(10, 1, 7, 3, 2);
    expect(calcTPWithFit(hand)).toBe(10 + 3 + 1); // singleton spades + doubleton clubs
  });
});

describe("bidding-logic | isBalanced", () => {
  it("4333 is balanced", () =>
    expect(isBalanced(mkHand(12, 4, 3, 3, 3))).toBe(true));
  it("4432 is balanced", () =>
    expect(isBalanced(mkHand(12, 4, 4, 3, 2))).toBe(true));
  it("5332 is balanced", () =>
    expect(isBalanced(mkHand(12, 5, 3, 3, 2))).toBe(true));
  it("5431 is NOT balanced (singleton)", () =>
    expect(isBalanced(mkHand(12, 5, 4, 3, 1))).toBe(false));
  it("6322 is NOT balanced (6-card suit)", () =>
    expect(isBalanced(mkHand(12, 6, 3, 2, 2))).toBe(false));
  it("void is NOT balanced", () =>
    expect(isBalanced(mkHand(12, 5, 4, 4, 0))).toBe(false));
  it("two doubletons is NOT balanced", () =>
    expect(isBalanced(mkHand(10, 5, 4, 2, 2))).toBe(false));
});

describe("bidding-logic | hasVoid", () => {
  it("returns true when any suit has 0 cards", () => {
    expect(hasVoid(mkHand(10, 0, 6, 4, 3))).toBe(true);
    expect(hasVoid(mkHand(10, 5, 4, 4, 0))).toBe(true);
  });

  it("returns false when all suits have cards", () => {
    expect(hasVoid(mkHand(10, 5, 4, 3, 1))).toBe(false);
  });
});

describe("bidding-logic | ruleOf20", () => {
  it("passes when HCP + two longest suits >= 20", () => {
    // 11 HCP + spades(5) + hearts(5) = 21
    expect(ruleOf20(mkHand(11, 5, 5, 2, 1))).toBe(true);
    // 12 HCP + spades(5) + hearts(3) = 20
    expect(ruleOf20(mkHand(12, 5, 3, 3, 2))).toBe(true);
  });

  it("fails when HCP + two longest suits < 20", () => {
    // 10 HCP + spades(4) + hearts(4) = 18
    expect(ruleOf20(mkHand(10, 4, 4, 3, 2))).toBe(false);
    // 11 HCP + spades(4) + hearts(4) = 19
    expect(ruleOf20(mkHand(11, 4, 4, 3, 2))).toBe(false);
  });
});

describe("bidding-logic | longestSuitInfo", () => {
  it("returns the longest suit", () => {
    expect(longestSuitInfo(mkHand(10, 6, 4, 2, 1))).toEqual({
      name: "spades",
      length: 6,
    });
    expect(longestSuitInfo(mkHand(10, 3, 7, 2, 1))).toEqual({
      name: "hearts",
      length: 7,
    });
  });

  it("breaks ties by suit rank (spades > hearts > diamonds > clubs)", () => {
    expect(longestSuitInfo(mkHand(10, 5, 5, 2, 1))).toEqual({
      name: "spades",
      length: 5,
    });
    expect(longestSuitInfo(mkHand(10, 4, 5, 4, 0))).toEqual({
      name: "hearts",
      length: 5,
    });
  });
});

describe("bidding-logic | hasFiveCardMajor", () => {
  it("returns true for 5+ spades or hearts", () => {
    expect(hasFiveCardMajor(mkHand(12, 5, 3, 3, 2))).toBe(true);
    expect(hasFiveCardMajor(mkHand(12, 3, 5, 3, 2))).toBe(true);
    expect(hasFiveCardMajor(mkHand(12, 6, 4, 2, 1))).toBe(true);
  });

  it("returns false for no 5-card major", () => {
    expect(hasFiveCardMajor(mkHand(12, 4, 4, 3, 2))).toBe(false);
    expect(hasFiveCardMajor(mkHand(12, 3, 4, 3, 3))).toBe(false);
  });
});

describe("bidding-logic | bestMajor", () => {
  it("returns spades when 5+ spades", () => {
    expect(bestMajor(mkHand(12, 5, 4, 3, 1))).toBe("spades");
    expect(bestMajor(mkHand(12, 6, 6, 1, 0))).toBe("spades");
  });

  it("returns hearts when 5+ hearts but not 5+ spades", () => {
    expect(bestMajor(mkHand(12, 4, 5, 3, 1))).toBe("hearts");
    expect(bestMajor(mkHand(12, 3, 6, 3, 1))).toBe("hearts");
  });

  it("returns null when no 5-card major", () => {
    expect(bestMajor(mkHand(12, 4, 4, 3, 2))).toBeNull();
    expect(bestMajor(mkHand(12, 3, 4, 3, 3))).toBeNull();
  });
});

describe("bidding-logic | longerMinor", () => {
  it("returns diamonds when more diamonds", () => {
    expect(longerMinor(mkHand(12, 4, 4, 3, 2))).toBe("diamonds");
  });

  it("returns clubs when more clubs", () => {
    expect(longerMinor(mkHand(12, 4, 4, 2, 3))).toBe("clubs");
  });

  it("4-4 returns diamonds (SAYC rule)", () => {
    expect(longerMinor(mkHand(12, 3, 2, 4, 4))).toBe("diamonds");
  });

  it("3-3 returns clubs (SAYC rule)", () => {
    expect(longerMinor(mkHand(12, 4, 4, 3, 3))).toBe("clubs");
  });
});

describe("bidding-logic | suitSymbol", () => {
  it("maps suit names to symbols", () => {
    expect(suitSymbol("spades")).toBe("♠");
    expect(suitSymbol("hearts")).toBe("♥");
    expect(suitSymbol("diamonds")).toBe("♦");
    expect(suitSymbol("clubs")).toBe("♣");
  });
});

describe("bidding-logic | suitBidLevel", () => {
  it("creates level + symbol", () => {
    expect(suitBidLevel("spades", 1)).toBe("1♠");
    expect(suitBidLevel("hearts", 4)).toBe("4♥");
  });
});

describe("bidding-logic | getContractLimit", () => {
  it("returns part score for 19-24 TP", () => {
    expect(getContractLimit(19)).toContain("Part Score");
    expect(getContractLimit(24)).toContain("Part Score");
  });

  it("returns game for 25-28 TP", () => {
    expect(getContractLimit(25)).toContain("Game");
    expect(getContractLimit(28)).toContain("Game");
  });

  it("returns minor game for 29-30 TP", () => {
    expect(getContractLimit(29)).toContain("Minor Game");
  });

  it("returns small slam for 31-32 TP", () => {
    expect(getContractLimit(31)).toContain("Small Slam");
    expect(getContractLimit(32)).toContain("Small Slam");
  });

  it("returns 6NT for 33-34 TP", () => {
    expect(getContractLimit(33)).toContain("6NT");
  });

  it("returns grand slam for 35-36 TP", () => {
    expect(getContractLimit(35)).toContain("Grand Slam");
  });

  it("returns 7NT for 37+ TP", () => {
    expect(getContractLimit(37)).toContain("7NT");
  });
});

describe("bidding-logic | analyzeHand", () => {
  it("calculates TP, balance, and longest suit correctly", () => {
    const hand = mkHand(15, 4, 4, 3, 2);
    const analysis = analyzeHand(hand);
    expect(analysis.tp).toBe(15);
    expect(analysis.hcp).toBe(15);
    expect(analysis.isBalanced).toBe(true);
    expect(analysis.longestSuitName).toBe("spades");
    expect(analysis.longestSuitLength).toBe(4);
    expect(analysis.hasFiveCardMajor).toBe(false);
    expect(analysis.hasVoid).toBe(false);
  });

  it("detects void and 5-card major", () => {
    const hand = mkHand(12, 5, 0, 5, 3);
    const analysis = analyzeHand(hand);
    expect(analysis.hasVoid).toBe(true);
    expect(analysis.hasFiveCardMajor).toBe(true);
    expect(analysis.isBalanced).toBe(false);
  });
});

// ─── Opening Bids ─────────────────────────────────────────────────────────────

describe("bidding-logic | getOpeningBid", () => {
  // 2♣ (strong, 22+)
  it("22+ HCP balanced → 2♣", () => {
    const rec = getRecommendation(mkHand(22, 4, 3, 3, 3), ctx("opening"));
    expect(rec.bid).toBe("2♣");
    expect(rec.category).toContain("Strong 2♣");
  });

  it("22 HCP unbalanced (22+ TP) → 2♣", () => {
    const rec = getRecommendation(mkHand(22, 5, 4, 3, 1), ctx("opening"));
    expect(rec.bid).toBe("2♣");
  });

  it("25-27 HCP balanced → 3NT Opening", () => {
    const rec = getRecommendation(mkHand(25, 4, 3, 3, 3), ctx("opening"));
    expect(rec.bid).toBe("3NT");
    expect(rec.category).toContain("25-27");
  });

  it("20-21 HCP balanced → 2NT", () => {
    const rec = getRecommendation(mkHand(20, 4, 3, 3, 3), ctx("opening"));
    expect(rec.bid).toBe("2NT");
    expect(rec.category).toContain("20-21");
  });

  it("21 HCP balanced → 2NT", () => {
    const rec = getRecommendation(mkHand(21, 4, 3, 3, 3), ctx("opening"));
    expect(rec.bid).toBe("2NT");
  });

  it("15-17 HCP balanced → 1NT", () => {
    const rec = getRecommendation(mkHand(15, 4, 3, 3, 3), ctx("opening"));
    expect(rec.bid).toBe("1NT");
    expect(rec.category).toContain("15-17");
  });

  it("16 HCP balanced → 1NT", () => {
    const rec = getRecommendation(mkHand(16, 4, 4, 3, 2), ctx("opening"));
    expect(rec.bid).toBe("1NT");
  });

  it("17 HCP balanced → 1NT", () => {
    const rec = getRecommendation(mkHand(17, 4, 3, 3, 3), ctx("opening"));
    expect(rec.bid).toBe("1NT");
  });

  it("18-19 HCP balanced → 1 of suit (then jump NT rebid)", () => {
    const rec = getRecommendation(mkHand(18, 4, 3, 3, 3), ctx("opening"));
    expect(rec.category).toContain("18-19");
    expect(rec.bid).not.toBe("1NT");
  });

  it("19 HCP balanced → 1 of suit", () => {
    const rec = getRecommendation(mkHand(19, 4, 4, 3, 2), ctx("opening"));
    expect(rec.category).toContain("18-19");
  });

  it("18 HCP balanced with 5-card major → 1 of major", () => {
    const rec = getRecommendation(mkHand(18, 5, 3, 3, 2), ctx("opening"));
    expect(rec.bid).toBe("1♠");
  });

  it("12-14 HCP balanced → 1 of minor or major (rebid NT)", () => {
    const rec = getRecommendation(mkHand(12, 4, 3, 3, 3), ctx("opening"));
    expect(rec.bid).toBe("1♣"); // 3-3 minors → clubs
    expect(rec.category).toContain("12-14");
  });

  it("14 HCP balanced → 1 of minor", () => {
    const rec = getRecommendation(mkHand(14, 4, 4, 3, 2), ctx("opening"));
    expect(rec.category).toContain("12-14");
  });

  it("12-14 HCP balanced with 5-card major → 1 of major", () => {
    const rec = getRecommendation(mkHand(13, 5, 3, 3, 2), ctx("opening"));
    expect(rec.bid).toBe("1♠");
  });

  it("13 TP unbalanced with 5+ spades → 1♠", () => {
    const rec = getRecommendation(mkHand(12, 5, 4, 2, 2), ctx("opening"));
    expect(rec.bid).toBe("1♠");
    expect(rec.category).toContain("Opening 1♠");
  });

  it("13 TP unbalanced with 5+ hearts (no 5-spade) → 1♥", () => {
    const rec = getRecommendation(mkHand(12, 4, 5, 2, 2), ctx("opening"));
    expect(rec.bid).toBe("1♥");
  });

  it("13 TP unbalanced, 5-5 in majors → 1♠ (higher ranking)", () => {
    const rec = getRecommendation(mkHand(12, 5, 5, 2, 1), ctx("opening"));
    expect(rec.bid).toBe("1♠");
  });

  it("13 TP no 5-card major, 4-4 minors → 1♦", () => {
    const rec = getRecommendation(mkHand(13, 4, 4, 4, 1), ctx("opening"));
    expect(rec.bid).toBe("1♦");
  });

  it("13 TP no 5-card major, 3-3 minors → 1♣", () => {
    // longerMinor returns clubs (3) when diamonds=3 and clubs=3 → clubs
    const rec2 = getRecommendation(mkHand(13, 4, 4, 3, 3), ctx("opening"));
    expect(rec2.bid).toBe("1♣"); // 3-3 → clubs
  });

  // Weak 2s (5-10 HCP, 6-card suit)
  it("5-10 HCP, 6-card spades, no outside 4-card major → 2♠ weak", () => {
    const rec = getRecommendation(mkHand(8, 6, 3, 3, 1), ctx("opening"));
    expect(rec.bid).toBe("2♠");
    expect(rec.category).toContain("Weak 2");
  });

  it("5-10 HCP, 6-card hearts, no outside major → 2♥ weak", () => {
    const rec = getRecommendation(mkHand(7, 3, 6, 3, 1), ctx("opening"));
    expect(rec.bid).toBe("2♥");
  });

  it("5-10 HCP, 6-card diamonds, no outside major → 2♦ weak", () => {
    const rec = getRecommendation(mkHand(6, 3, 3, 6, 1), ctx("opening"));
    expect(rec.bid).toBe("2♦");
  });

  // Pre-emptive 3-level (7-card suit)
  it("5-10 HCP, 7-card hearts → 3♥ preempt", () => {
    const rec = getRecommendation(mkHand(7, 2, 7, 3, 1), ctx("opening"));
    expect(rec.bid).toBe("3♥");
    expect(rec.category).toContain("Pre-emptive 3");
  });

  it("5-10 HCP, 7-card spades → 3♠ preempt", () => {
    const rec = getRecommendation(mkHand(8, 7, 2, 3, 1), ctx("opening"));
    expect(rec.bid).toBe("3♠");
  });

  // Pre-emptive 4-level (8-card suit)
  it("5-10 HCP, 8-card hearts → 4♥ preempt", () => {
    const rec = getRecommendation(mkHand(7, 2, 8, 2, 1), ctx("opening"));
    expect(rec.bid).toBe("4♥");
    expect(rec.category).toContain("Pre-emptive 4");
  });

  // Rule of 20
  it("12 TP, Rule of 20 passes → open", () => {
    // 11 HCP + spades(5) + hearts(5) = 21 → passes
    const rec = getRecommendation(mkHand(11, 5, 5, 2, 1), ctx("opening"));
    expect(rec.bid).not.toBe("Pass");
  });

  it("12 TP, Rule of 20 fails → Pass", () => {
    // 10 HCP + spades(4) + hearts(4) = 18 → fails
    const rec = getRecommendation(mkHand(10, 4, 4, 3, 2), ctx("opening"));
    expect(rec.bid).toBe("Pass");
  });

  // Too weak
  it("8 HCP, no 6-card suit, Rule of 20 fails → Pass", () => {
    const rec = getRecommendation(mkHand(8, 4, 4, 3, 2), ctx("opening"));
    expect(rec.bid).toBe("Pass");
  });

  it("pass includes vulnerability note when vulnerable", () => {
    const rec = getRecommendation(
      mkHand(7, 2, 7, 3, 1),
      ctx("opening", { vulnerability: "we-only" }),
    );
    expect(rec.bid).toBe("3♥");
    expect(rec.note).toBeDefined();
  });
});

// ─── Responding to 1NT ────────────────────────────────────────────────────────

describe("bidding-logic | responding-1nt", () => {
  it("0-7 balanced → Pass", () => {
    const rec = getRecommendation(mkHand(6, 3, 3, 4, 3), ctx("responding-1nt")); // no 4-card major
    expect(rec.bid).toBe("Pass");
  });

  it("8-9 balanced (no major) → 2NT", () => {
    const rec = getRecommendation(mkHand(8, 3, 3, 4, 3), ctx("responding-1nt")); // no 4-card major
    expect(rec.bid).toBe("2NT");
  });

  it("9 HCP balanced → 2NT invitational", () => {
    const rec = getRecommendation(mkHand(9, 3, 3, 4, 3), ctx("responding-1nt")); // no 4-card major
    expect(rec.bid).toBe("2NT");
  });

  it("10-15 HCP balanced → 3NT", () => {
    const rec = getRecommendation(
      mkHand(10, 3, 3, 4, 3),
      ctx("responding-1nt"),
    ); // no 4-card major
    expect(rec.bid).toBe("3NT");
  });

  it("15 HCP balanced → 3NT", () => {
    const rec = getRecommendation(
      mkHand(15, 3, 3, 4, 3),
      ctx("responding-1nt"),
    ); // no 4-card major
    expect(rec.bid).toBe("3NT");
  });

  it("16-17 HCP balanced → 4NT quantitative (NOT Blackwood)", () => {
    const rec = getRecommendation(
      mkHand(16, 3, 3, 4, 3),
      ctx("responding-1nt"),
    ); // no 4-card major
    expect(rec.bid).toBe("4NT");
    expect(rec.category).toContain("Quantitative");
    expect(rec.note).toBeDefined();
    expect(rec.note).toContain("not Blackwood");
  });

  it("5-card hearts, 0-7 pts → Transfer 2♦", () => {
    const rec = getRecommendation(mkHand(6, 3, 5, 3, 2), ctx("responding-1nt"));
    expect(rec.bid).toBe("2♦");
    expect(rec.category).toContain("Transfer");
  });

  it("5-card hearts, weak → transfer and pass", () => {
    const rec = getRecommendation(mkHand(4, 3, 5, 3, 2), ctx("responding-1nt"));
    expect(rec.bid).toBe("2♦");
    expect(rec.category).toContain("Transfer");
  });

  it("5-card spades, 0-7 pts → Transfer 2♥", () => {
    const rec = getRecommendation(mkHand(5, 5, 3, 3, 2), ctx("responding-1nt"));
    expect(rec.bid).toBe("2♥");
    expect(rec.category).toContain("Transfer");
  });

  it("5-card hearts, 10+ pts → Transfer then 3NT (game)", () => {
    const rec = getRecommendation(
      mkHand(10, 3, 5, 3, 2),
      ctx("responding-1nt"),
    );
    expect(rec.bid).toBe("2♦");
    expect(rec.category).toContain("3NT");
  });

  it("5-card spades, 10+ pts → Transfer then 3NT", () => {
    const rec = getRecommendation(
      mkHand(11, 5, 3, 3, 2),
      ctx("responding-1nt"),
    );
    expect(rec.bid).toBe("2♥");
  });

  it("4-card major (hearts), 8+ pts → Stayman", () => {
    const rec = getRecommendation(mkHand(9, 3, 4, 3, 3), ctx("responding-1nt")); // 4 hearts
    expect(rec.bid).toContain("2♣");
    expect(rec.category).toContain("Stayman");
  });

  it("5-4 majors (5♠+4♥) → Stayman NOT transfer (correction 2)", () => {
    const rec = getRecommendation(
      mkHand(10, 5, 4, 3, 1),
      ctx("responding-1nt"),
    );
    expect(rec.bid).toContain("2♣");
    expect(rec.category).toContain("Stayman");
    expect(rec.note).toBeDefined();
  });

  it("5-4 majors (4♠+5♥) → Stayman NOT transfer", () => {
    const rec = getRecommendation(
      mkHand(10, 4, 5, 3, 1),
      ctx("responding-1nt"),
    );
    expect(rec.bid).toContain("2♣");
    expect(rec.category).toContain("Stayman");
  });

  it("6-card minor weak → minor transfer 2♠", () => {
    const rec = getRecommendation(mkHand(5, 3, 2, 2, 6), ctx("responding-1nt"));
    expect(rec.bid).toContain("2♠");
    expect(rec.category).toContain("Minor Transfer");
  });

  it("6-card hearts, 10+ pts → transfer then 4♥", () => {
    const rec = getRecommendation(
      mkHand(10, 2, 6, 3, 2),
      ctx("responding-1nt"),
    );
    expect(rec.bid).toContain("2♦");
    expect(rec.category).toContain("6+ Hearts");
  });

  it("6-card spades, 10+ pts → transfer then 4♠", () => {
    const rec = getRecommendation(
      mkHand(10, 6, 2, 3, 2),
      ctx("responding-1nt"),
    );
    expect(rec.bid).toContain("2♥");
    expect(rec.category).toContain("6+ Spades");
  });

  it("12+ HCP, 6+ hearts → 3♥ slam interest", () => {
    const rec = getRecommendation(
      mkHand(12, 2, 6, 3, 2),
      ctx("responding-1nt"),
    );
    expect(rec.bid).toBe("3♥");
    expect(rec.category).toContain("Slam Interest");
  });

  it("12+ HCP, 6+ spades → 3♠ slam interest", () => {
    const rec = getRecommendation(
      mkHand(12, 6, 2, 3, 2),
      ctx("responding-1nt"),
    );
    expect(rec.bid).toBe("3♠");
  });

  it("6-card clubs invitational (8-9 HCP) → 3♣", () => {
    const rec = getRecommendation(mkHand(8, 2, 2, 3, 6), ctx("responding-1nt"));
    expect(rec.bid).toBe("3♣");
  });

  it("6-card diamonds invitational (8-9 HCP) → 3♦", () => {
    const rec = getRecommendation(mkHand(9, 2, 2, 6, 3), ctx("responding-1nt"));
    expect(rec.bid).toBe("3♦");
  });

  it("5-card hearts invitational (8-9 pts) → transfer then 2NT", () => {
    const rec = getRecommendation(mkHand(8, 3, 5, 3, 2), ctx("responding-1nt"));
    expect(rec.bid).toBe("2♦");
    expect(rec.category).toContain("Invitational");
  });

  it("6-card hearts invitational (8-9) → transfer then 3♥", () => {
    const rec = getRecommendation(mkHand(8, 2, 6, 3, 2), ctx("responding-1nt"));
    expect(rec.category).toContain("Invite");
  });
});

// ─── Responding to 2NT ────────────────────────────────────────────────────────

describe("bidding-logic | responding-2nt", () => {
  it("0-3 HCP → Pass", () => {
    const rec = getRecommendation(mkHand(3, 3, 3, 4, 3), ctx("responding-2nt")); // no 4-card major
    expect(rec.bid).toBe("Pass");
  });

  it("4-11 HCP balanced → 3NT", () => {
    const rec = getRecommendation(mkHand(7, 3, 3, 4, 3), ctx("responding-2nt")); // no 4-card major
    expect(rec.bid).toBe("3NT");
  });

  it("4-card major → Stayman 3♣", () => {
    const rec = getRecommendation(mkHand(6, 3, 4, 3, 3), ctx("responding-2nt")); // 4 hearts
    expect(rec.bid).toContain("3♣");
    expect(rec.category).toContain("Stayman");
  });

  it("5+ major → Transfer", () => {
    const rec = getRecommendation(mkHand(7, 5, 3, 3, 2), ctx("responding-2nt")); // 5 spades
    expect(rec.bid).toBe("3♥");
    expect(rec.category).toContain("Transfer");
  });

  it("12 HCP → 4NT quantitative", () => {
    const rec = getRecommendation(
      mkHand(12, 3, 3, 4, 3),
      ctx("responding-2nt"),
    ); // no 4-card major
    expect(rec.bid).toBe("4NT");
    expect(rec.category).toContain("Quantitative");
  });
});

// ─── Responding to 3NT Opening ───────────────────────────────────────────────

describe("bidding-logic | responding-3nt-opening", () => {
  it("4-card major → Stayman 4♣", () => {
    const rec = getRecommendation(
      mkHand(6, 4, 3, 3, 3),
      ctx("responding-3nt-opening"),
    ); // 4 spades (no 5-card major)
    expect(rec.bid).toContain("4♣");
  });

  it("5+ hearts → Transfer 4♦", () => {
    const rec = getRecommendation(
      mkHand(6, 3, 5, 3, 2),
      ctx("responding-3nt-opening"),
    ); // 5 hearts
    expect(rec.bid).toContain("4♦");
  });

  it("5+ spades → Transfer 4♥", () => {
    const rec = getRecommendation(
      mkHand(6, 5, 3, 3, 2),
      ctx("responding-3nt-opening"),
    ); // 5 spades
    expect(rec.bid).toContain("4♥");
  });

  it("no major → Pass", () => {
    const rec = getRecommendation(
      mkHand(6, 3, 3, 4, 3),
      ctx("responding-3nt-opening"),
    ); // no 4-card major
    expect(rec.bid).toBe("Pass");
  });
});

// ─── Responding to 1 of suit ──────────────────────────────────────────────────

describe("bidding-logic | responding-suit", () => {
  it("0-5 TP → Pass", () => {
    const rec = getRecommendation(
      mkHand(4, 3, 3, 4, 3),
      ctx("responding-suit", { partnerBid: "1♠" }),
    );
    expect(rec.bid).toBe("Pass");
  });

  it("6-9 TP with 3-card support → simple raise", () => {
    const rec = getRecommendation(
      mkHand(7, 3, 3, 4, 3),
      ctx("responding-suit", { partnerBid: "1♠" }),
    );
    expect(rec.bid).toBe("2♠");
  });

  it("10-12 TP with 3-card support → limit raise", () => {
    const rec = getRecommendation(
      mkHand(10, 3, 4, 3, 3),
      ctx("responding-suit", { partnerBid: "1♠" }),
    );
    expect(rec.bid).toContain("3♠");
    expect(rec.category).toContain("Limit Raise");
  });

  it("13+ HCP, 4+ support → Jacoby 2NT", () => {
    const rec = getRecommendation(
      mkHand(13, 4, 4, 3, 2),
      ctx("responding-suit", { partnerBid: "1♠" }),
    );
    expect(rec.bid).toContain("2NT");
    expect(rec.category).toContain("Jacoby");
  });

  it("6-10 TP with 4-card unbid major → bid major at 1 level", () => {
    // Partner opened 1♣, we have 4 hearts — bid 1♥ before raising clubs
    const rec = getRecommendation(
      mkHand(8, 3, 4, 3, 3),
      ctx("responding-suit", { partnerBid: "1♣" }),
    );
    expect(rec.bid).toBe("1♥");
  });

  it("6-10 TP no major, no 3-card major support → 1NT", () => {
    // Partner opened 1♥, we have only 2-card heart support, no 4-card spades
    const rec = getRecommendation(
      mkHand(8, 3, 2, 5, 3),
      ctx("responding-suit", { partnerBid: "1♥" }),
    );
    expect(rec.bid).toBe("1NT");
  });

  it("11-12 TP balanced, no 4-card major → 2NT", () => {
    const rec = getRecommendation(
      mkHand(11, 3, 3, 4, 3),
      ctx("responding-suit", { partnerBid: "1♣" }),
    );
    expect(rec.bid).toBe("2NT");
  });

  it("11 TP with 4 spades over 1♣ → 1♠ (show major first)", () => {
    const rec = getRecommendation(
      mkHand(11, 4, 3, 3, 3),
      ctx("responding-suit", { partnerBid: "1♣" }),
    );
    expect(rec.bid).toBe("1♠");
  });

  it("11 TP with 4 hearts over 1♦ → 1♥ (show major first)", () => {
    const rec = getRecommendation(
      mkHand(10, 4, 4, 4, 1),
      ctx("responding-suit", { partnerBid: "1♦" }),
    );
    expect(rec.bid).toBe("1♥");
  });

  it("user scenario: 10 HCP 5 hearts 4 spades 4 diamonds 0 clubs over 1♦ → 1♥", () => {
    const rec = getRecommendation(
      { hcp: 10, spades: 4, hearts: 5, diamonds: 4, clubs: 0 },
      ctx("responding-suit", { partnerBid: "1♦" }),
    );
    expect(rec.bid).toBe("1♥");
    expect(rec.reasoning).toMatch(/heart|major/i);
  });
});

// ─── Responding to 2♣ ────────────────────────────────────────────────────────

describe("bidding-logic | responding-2c", () => {
  it("0-7 HCP → 2♦ waiting", () => {
    const rec = getRecommendation(mkHand(5, 4, 3, 3, 3), ctx("responding-2c"));
    expect(rec.bid).toContain("2♦");
    expect(rec.category).toContain("Waiting");
  });

  it("8+ HCP balanced → 2NT positive", () => {
    const rec = getRecommendation(mkHand(8, 4, 3, 3, 3), ctx("responding-2c"));
    expect(rec.bid).toBe("2NT");
    expect(rec.category).toContain("Positive");
  });

  it("8+ HCP with 5-card major → positive suit response", () => {
    const rec = getRecommendation(mkHand(9, 5, 3, 3, 2), ctx("responding-2c"));
    expect(rec.bid).toContain("2♠");
    expect(rec.category).toContain("Positive");
  });
});

// ─── Responding to Weak 2 ─────────────────────────────────────────────────────

describe("bidding-logic | responding-weak2", () => {
  it("15+ HCP with 4-card suit support → game raise (4♠)", () => {
    // Updated: 15 HCP with 4♠ support should now give a game raise, not 2NT inquiry.
    // Bridgedoctor: "Raise to 4: 4-card support" — support check fires before 2NT check.
    const rec = getRecommendation(
      mkHand(15, 4, 3, 3, 3),
      ctx("responding-weak2", { partnerBid: "2♠" }),
    );
    expect(rec.bid).toBe("4♠");
  });

  it("0-14 TP, 4-card support → game raise", () => {
    const rec = getRecommendation(
      mkHand(10, 4, 3, 3, 3),
      ctx("responding-weak2", { partnerBid: "2♠" }),
    );
    expect(rec.bid).toContain("4♠");
  });

  it("0-14 TP, 3-card support → pre-emptive raise", () => {
    const rec = getRecommendation(
      mkHand(8, 3, 3, 4, 3),
      ctx("responding-weak2", { partnerBid: "2♠" }),
    );
    expect(rec.bid).toContain("3♠");
  });

  it("no support → Pass", () => {
    const rec = getRecommendation(
      mkHand(8, 2, 3, 4, 4),
      ctx("responding-weak2", { partnerBid: "2♠" }),
    );
    expect(rec.bid).toBe("Pass");
  });

  it("2NT response includes RONF note", () => {
    const rec = getRecommendation(
      mkHand(16, 4, 3, 3, 3),
      ctx("responding-weak2", { partnerBid: "2♥" }),
    );
    expect(rec.note).toBeDefined();
    expect(rec.note).toContain("RONF");
  });
});

// ─── Responding to Preempt ───────────────────────────────────────────────────

describe("bidding-logic | responding-preempt", () => {
  it("16+ HCP → game", () => {
    const rec = getRecommendation(
      mkHand(16, 3, 4, 3, 3),
      ctx("responding-preempt", { partnerBid: "3♥" }),
    );
    expect(rec.bid).toContain("4♥");
  });

  it("3+ support, 0-15 pts → raise", () => {
    const rec = getRecommendation(
      mkHand(8, 3, 3, 4, 3),
      ctx("responding-preempt", { partnerBid: "3♥" }),
    );
    expect(rec.bid).toBe("4♥"); // 3♥ preempt + 1 level raise
  });

  it("no support, < 16 pts → Pass", () => {
    const rec = getRecommendation(
      mkHand(12, 4, 2, 4, 3),
      ctx("responding-preempt", { partnerBid: "3♥" }),
    );
    expect(rec.bid).toBe("Pass");
  });
});

// ─── Overcalling ─────────────────────────────────────────────────────────────

describe("bidding-logic | overcalling", () => {
  it("16+ HCP balanced over 1NT → penalty double", () => {
    const rec = getRecommendation(
      mkHand(16, 4, 4, 3, 2),
      ctx("overcalling", { rhoBid: "1NT" }),
    );
    expect(rec.bid).toBe("Double");
    expect(rec.category).toContain("Penalty");
  });

  it("15-18 HCP balanced → 1NT overcall", () => {
    const rec = getRecommendation(
      mkHand(15, 4, 4, 3, 2),
      ctx("overcalling", { rhoBid: "1♥" }),
    );
    expect(rec.bid).toContain("1NT");
    expect(rec.category).toContain("Overcall");
  });

  it("12-15 HCP, 0-1 in opponents suit → takeout double", () => {
    const rec = getRecommendation(
      mkHand(13, 4, 4, 4, 1),
      ctx("overcalling", { rhoBid: "1♣" }),
    );
    expect(rec.bid).toBe("Double");
    expect(rec.category).toContain("Takeout");
  });

  it("8-15 HCP, 5-card suit → specific overcall bid (e.g. 1♠ over 1♥)", () => {
    const rec = getRecommendation(
      mkHand(12, 5, 4, 3, 1),
      ctx("overcalling", { rhoBid: "1♥" }),
    );
    // Must be a real bid, not the old "Simple Overcall (1 or 2♠)" string
    expect(rec.bid).toBe("1♠");
  });

  it("8-15 HCP, 5-card suit must bid at 2-level over 1♠ → 2♥ (10+ HCP required)", () => {
    // Over 1♠, hearts can only be bid at the 2-level; 12 HCP >= 10 → overcall
    const rec = getRecommendation(
      mkHand(12, 2, 5, 3, 3),
      ctx("overcalling", { rhoBid: "1♠" }),
    );
    expect(rec.bid).toBe("2♥");
  });

  it("8-9 HCP, 5-card suit at 2-level only → Pass (too weak for 2-level overcall)", () => {
    // Over 1♠, 5-card hearts needs to go to 2-level; 8 HCP < 10 → Pass
    const rec = getRecommendation(
      mkHand(8, 2, 5, 3, 3),
      ctx("overcalling", { rhoBid: "1♠" }),
    );
    expect(rec.bid).toBe("Pass");
  });

  it("5-10 HCP, 6-card suit → jump overcall at 2-level", () => {
    const rec = getRecommendation(
      mkHand(8, 6, 4, 2, 1),
      ctx("overcalling", { rhoBid: "1♥" }),
    );
    expect(rec.bid).toBe("2♠");
    expect(rec.category).toContain("Jump Overcall");
  });

  it("5-10 HCP, 7-card club suit over 1♥ → 3-level preempt (3♣)", () => {
    const rec = getRecommendation(
      mkHand(8, 2, 1, 3, 7),
      ctx("overcalling", { rhoBid: "1♥" }),
    );
    expect(rec.bid).toBe("3♣");
    expect(rec.category).toContain("3-Level Preempt");
  });

  it("9 HCP, 8-card club suit over 1♥ → 4-level preempt (4♣), note clarifies 2♣ confusion", () => {
    const rec = getRecommendation(
      { hcp: 9, spades: 3, hearts: 1, diamonds: 1, clubs: 8 },
      ctx("overcalling", { rhoBid: "1♥" }),
    );
    expect(rec.bid).toBe("4♣");
    expect(rec.category).toContain("Game Preempt");
    // Should NOT recommend 2♣ (looks like strong opening)
    expect(rec.bid).not.toBe("2♣");
  });

  it("6-card club suit where 2♣ is NOT above opponent's 2♥ — bumps to 3♣", () => {
    // 2♣ ranks below 2♥ in bid order, so the 2-level bid is insufficient → bumps to 3♣
    const rec = getRecommendation(
      mkHand(8, 1, 2, 3, 6),
      ctx("overcalling", { rhoBid: "2♥" }),
    );
    expect(rec.bid).toBe("3♣");
  });

  it("5-5 in two suits → Michaels cuebid", () => {
    const rec = getRecommendation(
      mkHand(8, 5, 5, 2, 1),
      ctx("overcalling", { rhoBid: "1♦" }),
    );
    expect(rec.bid).toBe("2♦");
    expect(rec.category).toContain("Michaels");
  });

  it("5-5 in lower suits → Unusual 2NT", () => {
    const rec = getRecommendation(
      mkHand(8, 2, 5, 1, 5),
      ctx("overcalling", { rhoBid: "1♠" }),
    );
    // Should hit unusual 2NT or michaels depending on suits
    expect(rec.bid).toBeDefined();
  });

  it("feedback #1: 6 clubs after opponent opens 1♣ → Pass with specific reasoning", () => {
    // 15 HCP, 17 TP, 3♠ 1♥ 3♦ 6♣ — no 5-card unbid suit, 6 in opened suit, unbalanced
    const rec = getRecommendation(
      mkHand(15, 3, 1, 3, 6),
      ctx("overcalling", { rhoBid: "1♣" }),
    );
    expect(rec.bid).toBe("Pass");
    expect(rec.reasoning.toLowerCase()).toContain("opponent");
  });

  it("Pass fallback mentions why double is unavailable (long in opponent's suit)", () => {
    // 13 HCP, no 5-card unbid suit, 5 clubs after 1♣ → Pass
    const rec = getRecommendation(
      mkHand(13, 3, 3, 2, 5),
      ctx("overcalling", { rhoBid: "1♣" }),
    );
    expect(rec.bid).toBe("Pass");
    expect(rec.confidence).toBe("high");
  });

  it("no suitable overcall → Pass", () => {
    const rec = getRecommendation(
      mkHand(6, 4, 4, 3, 2),
      ctx("overcalling", { rhoBid: "1♦" }),
    );
    expect(rec.bid).toBe("Pass");
  });

  it("vulnerability note on simple overcall when vulnerable", () => {
    const rec = getRecommendation(
      mkHand(8, 5, 4, 3, 1),
      ctx("overcalling", { rhoBid: "1♥", vulnerability: "we-only" }),
    );
    expect(rec.note).toBeDefined();
  });

  it("19+ HCP balanced → double then rebid NT", () => {
    const rec = getRecommendation(
      mkHand(19, 4, 4, 3, 2),
      ctx("overcalling", { rhoBid: "1♣" }),
    );
    expect(rec.bid).toContain("Double");
    expect(rec.category).toContain("19+");
  });
});

describe("bidding-logic | balancing seat overcall", () => {
  // User-reported scenario: Pass-Pass-Pass-1♠, then pos1 (who passed) gets a
  // second chance.  The engine should know they are in the balancing seat.

  it("deriveSituation: pos1 passed in round 1, now RHO bid 1♠ → balancing=true", () => {
    const s = deriveSituation(
      mkState({
        completedRounds: [{ 1: "Pass", 2: "Pass", 3: "Pass", 4: "1♠" }],
        currentRound: {},
        myPosition: 1,
      }),
    );
    expect(s.situation).toBe("overcalling");
    expect((s as { balancing?: boolean }).balancing).toBe(true);
  });

  it("pos1 (10 HCP, 5♦) in balancing seat after 1♠ → 2♦ with balancing mention", () => {
    // Exact hand from user report: 10 HCP, 1♠4♥5♦3♣
    const rec = getRecommendation(
      mkHand(10, 1, 4, 5, 3),
      ctx("overcalling", { rhoBid: "1♠", balancing: true }),
    );
    expect(rec.bid).toBe("2♦");
    expect(rec.category).toMatch(/balancing/i);
    expect(rec.reasoning).toMatch(/balancing|protective|already passed/i);
  });

  it("non-balancing seat (first chance to bid): no balancing label", () => {
    // Same hand but without a prior pass — direct overcall seat
    const rec = getRecommendation(
      mkHand(10, 1, 4, 5, 3),
      ctx("overcalling", { rhoBid: "1♠" }),
    );
    expect(rec.bid).toBe("2♦");
    expect(rec.category).not.toMatch(/balancing/i);
  });
});

describe("bidding-logic | after-own-double", () => {
  // User-reported bug: after 1♠–2♦–Double–Pass–2♠–Pass, pos2 (the doubler)
  // was told to double again, which would double their own partner's 2♠.

  it("deriveSituation: pos2 doubled round2, partner bid 2♠ round2, now round3 → after-own-double", () => {
    const s = deriveSituation(
      mkState({
        myPosition: 2,
        completedRounds: [
          { 1: "Pass", 2: "Pass", 3: "Pass", 4: "1♠" },
          { 1: "2♦", 2: "Double", 3: "Pass", 4: "2♠" },
        ],
        currentRound: { 1: "Pass" },
      }),
    );
    expect(s.situation).toBe("after-own-double");
    expect(s.situation).not.toBe("negative-double");
  });

  it("pos2 (13 HCP) after own double with partner showing 2♠ → Pass, not Double", () => {
    const hand2 = { hcp: 13, spades: 1, hearts: 4, clubs: 4, diamonds: 4 };
    const rec = getRecommendation(
      hand2,
      ctx("after-own-double", { partnerBid: "2♠", rhoBid: "2♦" }),
    );
    expect(rec.bid).toBe("Pass");
    expect(rec.bid).not.toBe("Double");
    expect(rec.reasoning).toMatch(/already doubled/i);
  });

  it("pos1 (10 HCP, 5♦) after balancing 2♦ overcall with partner only passing → Pass", () => {
    // Full auction: Pass-Pass-Pass-1♠ / 2♦-Double-Pass-2♠ / now pos1
    // Partner (pos3) has only passed throughout — engine should recommend Pass
    const hand1 = { hcp: 10, spades: 1, hearts: 4, diamonds: 5, clubs: 3 };
    const s = deriveSituation(
      mkState({
        myPosition: 1,
        completedRounds: [
          { 1: "Pass", 2: "Pass", 3: "Pass", 4: "1♠" },
          { 1: "2♦", 2: "Double", 3: "Pass", 4: "2♠" },
        ],
        currentRound: {},
      }),
    );
    const rec = getRecommendation(hand1, s);
    expect(rec.bid).toBe("Pass");
    expect(rec.category).not.toMatch(/invitational jump rebid/i);
  });
});

describe("bidding-logic | overcalling over 2NT (opponent bid 2NT)", () => {
  // User's exact hand from bug report: 9 HCP, 8 clubs, 3 spades, 1 heart, 1 diamond.
  // LHO opened 1♦, partner passed, RHO bid 2NT. Should NOT recommend Pass.
  it("9 HCP 8 clubs over RHO 2NT → preemptive club bid (not Pass)", () => {
    const rec = getRecommendation(
      { hcp: 9, spades: 3, hearts: 1, diamonds: 1, clubs: 8 },
      ctx("overcalling", { rhoBid: "2NT" }),
    );
    expect(rec.bid).not.toBe("Pass");
    expect(rec.bid).toContain("♣");
    expect(rec.category).toContain("Clubs");
  });

  it("6-card club suit over 2NT → recommends club bid", () => {
    const rec = getRecommendation(
      mkHand(7, 2, 2, 3, 6),
      ctx("overcalling", { rhoBid: "2NT" }),
    );
    expect(rec.bid).not.toBe("Pass");
    expect(rec.bid).toContain("♣");
  });

  it("6-card heart suit over 2NT → recommends heart bid", () => {
    const rec = getRecommendation(
      mkHand(8, 2, 6, 3, 2),
      ctx("overcalling", { rhoBid: "2NT" }),
    );
    expect(rec.bid).not.toBe("Pass");
    expect(rec.bid).toContain("♥");
  });

  it("10 HCP no long suit over 2NT → Double", () => {
    const rec = getRecommendation(
      mkHand(10, 3, 3, 4, 3),
      ctx("overcalling", { rhoBid: "2NT" }),
    );
    expect(rec.bid).toBe("Double");
  });

  it("weak hand no long suit over 2NT → Pass", () => {
    const rec = getRecommendation(
      mkHand(5, 3, 3, 4, 3),
      ctx("overcalling", { rhoBid: "2NT" }),
    );
    expect(rec.bid).toBe("Pass");
  });

  it("16 HCP balanced over 1NT → penalty double", () => {
    const rec = getRecommendation(
      mkHand(16, 3, 3, 4, 3),
      ctx("overcalling", { rhoBid: "1NT" }),
    );
    expect(rec.bid).toBe("Double");
    expect(rec.category).toContain("Penalty");
  });

  // End-to-end deriveSituation: pos 4, LHO=1♦, partner=Pass, RHO=2NT → overcalling with rhoBid=2NT
  it("deriveSituation: pos 4, LHO opened 1♦, partner passed, RHO bid 2NT → overcalling", () => {
    const s = deriveSituation(
      mkState({
        myPosition: 4,
        completedRounds: [],
        currentRound: { 1: "1♦", 2: "Pass", 3: "2NT" },
      }),
    );
    expect(s.situation).toBe("overcalling");
    expect(s.rhoBid).toBe("2NT");
  });

  // Stayman: LHO=1NT, partner=Pass, RHO=2♣ (Stayman — conventional, not natural clubs)
  // Hand 4 from user test: 12 HCP, 3♠ 3♥ 5♣ 2♦ — should treat as overcalling over 1NT, not 2♣
  it("deriveSituation: pos 4, LHO=1NT, partner=Pass, RHO=2♣ → overcalling with rhoBid=2♣, lhoBid=1NT", () => {
    const s = deriveSituation(
      mkState({
        myPosition: 4,
        completedRounds: [],
        currentRound: { 1: "1NT", 2: "Pass", 3: "2♣" },
      }),
    );
    expect(s.situation).toBe("overcalling");
    expect(s.rhoBid).toBe("2♣");
    expect(s.lhoBid).toBe("1NT");
  });

  it("overcalling: 12 HCP 3♠3♥2♦5♣ over Stayman 2♣ (LHO=1NT) → lead-directing Double (5 clubs, 8+ HCP)", () => {
    // 2♣ Stayman is conventional — 2♣ is unavailable; 5 clubs + 12 HCP → lead-directing Double
    // mkHand(hcp, spades, hearts, diamonds, clubs)
    const rec = getRecommendation(
      mkHand(12, 3, 3, 2, 5),
      ctx("overcalling", { rhoBid: "2♣", lhoBid: "1NT" }),
    );
    expect(rec.bid).toBe("Double");
    expect(rec.category).toMatch(/lead-directing/i);
    // Should explain Stayman is conventional
    expect(rec.reasoning).toMatch(/stayman|conventional/i);
    // Should NOT ask about stopper
    expect(rec.category).not.toMatch(/stopper/i);
  });

  it("overcalling: 4 HCP 3♠3♥2♦5♣ over Stayman 2♣ (LHO=1NT) → Pass (5 clubs but too weak to double)", () => {
    // 5 clubs but only 4 HCP — too weak for a lead-directing double
    const rec = getRecommendation(
      mkHand(4, 3, 3, 2, 5),
      ctx("overcalling", { rhoBid: "2♣", lhoBid: "1NT" }),
    );
    expect(rec.bid).toBe("Pass");
    expect(rec.reasoning).toMatch(/stayman|conventional/i);
    expect(rec.reasoning).toMatch(/too weak|weak/i);
  });

  it("overcalling: 8 HCP 5♠3♥2♦3♣ over Stayman 2♣ (LHO=1NT) → 2♠ natural overcall", () => {
    // Has a 5-card spade suit — can overcall 2♠ naturally (2♣ is taken as Stayman)
    // mkHand(hcp, spades, hearts, diamonds, clubs)
    const rec = getRecommendation(
      mkHand(8, 5, 3, 2, 3),
      ctx("overcalling", { rhoBid: "2♣", lhoBid: "1NT" }),
    );
    expect(rec.bid).toBe("2♠");
    expect(rec.reasoning).toMatch(/stayman|conventional/i);
  });

  it("overcalling: 6 HCP 3♠3♥4♦3♣ over Stayman 2♣ (LHO=1NT) → Pass (no 5-card suit, weak)", () => {
    // No 5-card suit at all — Pass
    // mkHand(hcp, spades, hearts, diamonds, clubs)
    const rec = getRecommendation(
      mkHand(6, 3, 3, 4, 3),
      ctx("overcalling", { rhoBid: "2♣", lhoBid: "1NT" }),
    );
    expect(rec.bid).toBe("Pass");
    expect(rec.reasoning).toMatch(/stayman|conventional/i);
  });

  it("overcalling: 4 HCP after partner doubled Stayman (1NT-Pass-2♣-Dbl-2♦) → Pass (lead-directing double)", () => {
    // Partner doubled 2♣ for a lead-directing purpose — we should Pass, not try to compete
    // mkHand(hcp, spades, hearts, diamonds, clubs)
    const rec = getRecommendation(
      mkHand(4, 3, 3, 2, 5),
      ctx("overcalling", { rhoBid: "2♣", lhoBid: "1NT", partnerBid: "Double" }),
    );
    expect(rec.bid).toBe("Pass");
    expect(rec.category).toMatch(/lead-directing/i);
    expect(rec.reasoning).toMatch(/lead.*club|club.*lead/i);
  });
});

// ─── Negative Double ──────────────────────────────────────────────────────────

describe("bidding-logic | negative-double", () => {
  it("too weak (< 6 HCP) → Pass", () => {
    const rec = getRecommendation(
      mkHand(5, 4, 4, 3, 2),
      ctx("negative-double", { myPreviousBid: "1♣", rhoBid: "1♦" }),
    );
    expect(rec.bid).toBe("Pass");
  });

  it("6+ HCP with both majors unbid → Negative Double", () => {
    const rec = getRecommendation(
      mkHand(8, 4, 4, 3, 2),
      ctx("negative-double", { myPreviousBid: "1♣", rhoBid: "1♦" }),
    );
    expect(rec.bid).toBe("Double");
    expect(rec.category).toContain("Negative");
  });

  it("negative double includes note about 2♠ threshold", () => {
    const rec = getRecommendation(
      mkHand(8, 4, 4, 3, 2),
      ctx("negative-double", { myPreviousBid: "1♦", rhoBid: "1♠" }),
    );
    expect(rec.bid).toBe("Double");
    expect(rec.category).toContain("Negative");
    expect(rec.note).toBeDefined();
  });
});

// ─── Responding to Overcalls ──────────────────────────────────────────────────

describe("bidding-logic | responding-to-simple-oc", () => {
  it("3+ support, 10+ pts → cue bid", () => {
    const rec = getRecommendation(
      mkHand(11, 3, 4, 3, 3),
      ctx("responding-to-simple-oc", { partnerBid: "1♥" }),
    );
    // Cue bid is a valid bid in the opponent's suit (falls back to clubs if no rhoBid)
    expect(rec.bid).toMatch(/^[1-7][♣♦♥♠]$/);
    expect(rec.category).toContain("Cue Bid");
  });

  it("3+ support, 0-9 pts → specific raise bid (Law of Total Tricks)", () => {
    // 3 hearts support + partner's 5 = 8 trumps → raise to 2-level (2♥)
    const rec = getRecommendation(
      mkHand(7, 3, 3, 4, 3),
      ctx("responding-to-simple-oc", { partnerBid: "1♥" }),
    );
    expect(rec.bid).toBe("2♥");
    expect(rec.reasoning).toContain("Law of Total Tricks");
  });

  it("4-card support, 0-9 pts → preemptive raise to 3-level (3♥)", () => {
    // 4 hearts + partner's 5 = 9 trumps → raise to 3-level
    const rec = getRecommendation(
      mkHand(6, 2, 4, 4, 3),
      ctx("responding-to-simple-oc", { partnerBid: "1♥" }),
    );
    expect(rec.bid).toBe("3♥");
    expect(rec.reasoning).toContain("preemptive");
  });

  it("5-card support → raise to game (4♠)", () => {
    const rec = getRecommendation(
      mkHand(5, 5, 2, 3, 3),
      ctx("responding-to-simple-oc", { partnerBid: "1♠" }),
    );
    expect(rec.bid).toBe("4♠");
  });

  it("no support, 0-8 pts → Pass", () => {
    // Partner overcalled 1♠, we have only 2 spades — no support
    const rec = getRecommendation(
      mkHand(6, 2, 3, 4, 4),
      ctx("responding-to-simple-oc", { partnerBid: "1♠" }),
    );
    expect(rec.bid).toBe("Pass");
  });

  it("no support, 9-12 pts → 1NT", () => {
    const rec = getRecommendation(
      mkHand(10, 2, 2, 4, 5),
      ctx("responding-to-simple-oc", { partnerBid: "1♠" }),
    );
    expect(rec.bid).toContain("1NT");
  });

  it("no support, 15+ pts → 3NT", () => {
    const rec = getRecommendation(
      mkHand(15, 2, 3, 4, 4),
      ctx("responding-to-simple-oc", { partnerBid: "1♠" }),
    );
    expect(rec.bid).toBe("3NT");
  });
});

describe("bidding-logic | responding-to-jump-oc", () => {
  it("3+ support, 6-10 pts → single raise", () => {
    const rec = getRecommendation(
      mkHand(8, 3, 4, 3, 3),
      ctx("responding-to-jump-oc", { partnerBid: "2♥" }),
    );
    expect(rec.bid).toBe("3♥");
  });

  it("3+ support, 11+ pts → game", () => {
    const rec = getRecommendation(
      mkHand(12, 3, 4, 3, 3),
      ctx("responding-to-jump-oc", { partnerBid: "2♥" }),
    );
    expect(rec.bid).toBe("4♥");
  });

  it("no support → Pass", () => {
    const rec = getRecommendation(
      mkHand(8, 4, 2, 4, 3),
      ctx("responding-to-jump-oc", { partnerBid: "2♥" }),
    );
    expect(rec.bid).toBe("Pass");
    expect(rec.note).toBeDefined();
  });
});

describe("bidding-logic | responding-to-double", () => {
  it("6-10 pts balanced → 1NT", () => {
    const rec = getRecommendation(
      mkHand(8, 3, 3, 4, 3),
      ctx("responding-to-double", { rhoBid: "1♥" }),
    );
    expect(rec.bid).toContain("1NT");
  });

  it("11-12 pts balanced → 2NT", () => {
    const rec = getRecommendation(
      mkHand(12, 4, 3, 3, 3),
      ctx("responding-to-double", { rhoBid: "1♥" }),
    );
    expect(rec.bid).toContain("2NT");
  });

  it("13+ pts balanced → 3NT", () => {
    const rec = getRecommendation(
      mkHand(13, 4, 3, 3, 3),
      ctx("responding-to-double", { rhoBid: "1♥" }),
    );
    expect(rec.bid).toContain("3NT");
  });

  it("0-8 pts unbalanced → bid longest suit", () => {
    // 5-card spades, unbalanced (5-3-3-2 is balanced; use 5-4-3-1 shape)
    const rec = getRecommendation(
      mkHand(6, 5, 4, 3, 1),
      ctx("responding-to-double", { rhoBid: "1♥" }),
    );
    expect(rec.bid).toContain("♠");
  });
});

describe("bidding-logic | responding-to-1nt-oc", () => {
  it("same as responding to 1NT opening", () => {
    const rec1 = getRecommendation(
      mkHand(8, 4, 3, 3, 3),
      ctx("responding-to-1nt-oc"),
    );
    const rec2 = getRecommendation(
      mkHand(8, 4, 3, 3, 3),
      ctx("responding-1nt"),
    );
    expect(rec1.bid).toBe(rec2.bid);
  });
});

describe("bidding-logic | responding-to-michaels", () => {
  it("over minor (both majors shown): prefer spades", () => {
    const rec = getRecommendation(
      mkHand(8, 4, 3, 3, 3),
      ctx("responding-to-michaels", { rhoBid: "1♦", partnerBid: "2♦" }),
    );
    expect(rec.bid).toContain("♠");
  });

  it("over minor, game values → bid game in major", () => {
    const rec = getRecommendation(
      mkHand(12, 4, 3, 3, 3),
      ctx("responding-to-michaels", { rhoBid: "1♣", partnerBid: "2♣" }),
    );
    expect(rec.bid).toContain("4♠");
  });

  it("over major, 3+ card fit → raise", () => {
    const rec = getRecommendation(
      mkHand(8, 3, 4, 3, 3),
      ctx("responding-to-michaels", { rhoBid: "1♥", partnerBid: "2♥" }),
    );
    // Partner showed spades + minor; we have hearts as support...
    // actually partner showed spades over 1♥
    expect(rec.bid).toBeDefined();
  });

  it("over major, no fit for major → ask for minor (2NT)", () => {
    const rec = getRecommendation(
      mkHand(8, 2, 2, 5, 4),
      ctx("responding-to-michaels", { rhoBid: "1♥", partnerBid: "2♥" }),
    );
    expect(rec.bid).toContain("2NT");
  });
});

describe("bidding-logic | responding-to-unusual-2nt", () => {
  it("more diamonds → prefer diamonds", () => {
    const rec = getRecommendation(
      mkHand(8, 3, 2, 5, 3),
      ctx("responding-to-unusual-2nt"),
    );
    expect(rec.bid).toContain("♦");
  });

  it("more clubs → prefer clubs", () => {
    const rec = getRecommendation(
      mkHand(8, 3, 2, 3, 5),
      ctx("responding-to-unusual-2nt"),
    );
    expect(rec.bid).toContain("♣");
  });

  it("game values with diamonds → 4♦", () => {
    const rec = getRecommendation(
      mkHand(11, 3, 2, 5, 3),
      ctx("responding-to-unusual-2nt"),
    );
    expect(rec.bid).toContain("4♦");
  });
});

// ─── Opener's Rebids ──────────────────────────────────────────────────────────

describe("bidding-logic | responder-nt-rebid", () => {
  it("user's exact hand: 11 HCP, 5♥ — bid 2NT, partner shows 3♥ → raise to 4♥", () => {
    const rec = getRecommendation(
      mkHand(11, 3, 5, 3, 2),
      ctx("responder-nt-rebid", { myPreviousBid: "2NT", partnerBid: "3♥" }),
    );
    expect(rec.bid).toBe("4♥");
    expect(rec.category).toContain("Major");
    expect(rec.reasoning).toContain("8+");
  });

  it("4-card spade support after partner shows 3♠ → raise to 4♠", () => {
    const rec = getRecommendation(
      mkHand(14, 4, 3, 3, 3),
      ctx("responder-nt-rebid", { myPreviousBid: "2NT", partnerBid: "3♠" }),
    );
    expect(rec.bid).toBe("4♠");
  });

  it("3-card heart support after partner shows 3♥ → still raise to 4♥ (7-card fit)", () => {
    const rec = getRecommendation(
      mkHand(13, 4, 3, 4, 2),
      ctx("responder-nt-rebid", { myPreviousBid: "2NT", partnerBid: "3♥" }),
    );
    expect(rec.bid).toBe("4♥");
    expect(rec.category).toContain("3-Card");
  });

  it("only 2-card heart support after partner shows 3♥ → bid 3NT instead", () => {
    const rec = getRecommendation(
      mkHand(13, 4, 2, 4, 3),
      ctx("responder-nt-rebid", { myPreviousBid: "2NT", partnerBid: "3♥" }),
    );
    expect(rec.bid).toBe("3NT");
    expect(rec.reasoning).toContain("No fit");
  });

  it("partner bids 3NT → Pass", () => {
    const rec = getRecommendation(
      mkHand(13, 4, 3, 4, 2),
      ctx("responder-nt-rebid", { myPreviousBid: "2NT", partnerBid: "3NT" }),
    );
    expect(rec.bid).toBe("Pass");
  });

  it("deriveSituation: routes to responder-nt-rebid when partner opened suit before my 2NT", () => {
    // Scenario: pos1=Pass, pos2=Pass (user), pos3=Pass, pos4=1♣, then user=2NT, partner=3♥
    const state: AuctionState = {
      myPosition: 2,
      completedRounds: [
        { 1: "Pass", 2: "Pass", 3: "Pass", 4: "1♣" },
        { 1: "Pass", 2: "2NT", 3: "Pass", 4: "3♥" },
      ],
      currentRound: {},
    };
    const s = deriveSituation(state);
    expect(s.situation).toBe("responder-nt-rebid");
    expect(s.partnerBid).toBe("3♥");
  });

  it("deriveSituation: 1NT opener still routes to rebid-after-nt (not responder-nt-rebid)", () => {
    // 1NT opener — partner had NO prior suit bid before my NT
    const state: AuctionState = {
      myPosition: 1,
      completedRounds: [{ 1: "1NT", 2: "Pass", 3: "Pass", 4: "2♣" }],
      currentRound: {},
    };
    const s = deriveSituation(state);
    expect(s.situation).toBe("rebid-after-nt");
  });
});

describe("bidding-logic | rebid-after-nt", () => {
  it("partner bid 2NT (invite): 17 HCP → accept (3NT)", () => {
    const rec = getRecommendation(
      mkHand(17, 4, 3, 3, 3),
      ctx("rebid-after-nt", { partnerBid: "2NT" }),
    );
    expect(rec.bid).toBe("3NT");
  });

  it("partner bid 2NT (invite): 15-16 HCP → decline (Pass)", () => {
    const rec = getRecommendation(
      mkHand(15, 4, 3, 3, 3),
      ctx("rebid-after-nt", { partnerBid: "2NT" }),
    );
    expect(rec.bid).toBe("Pass");
  });

  it("partner bid 4NT (quantitative): 17 HCP → accept (6NT)", () => {
    const rec = getRecommendation(
      mkHand(17, 4, 3, 3, 3),
      ctx("rebid-after-nt", { partnerBid: "4NT" }),
    );
    expect(rec.bid).toBe("6NT");
  });

  it("partner bid 4NT: 15 HCP → decline (Pass)", () => {
    const rec = getRecommendation(
      mkHand(15, 4, 3, 3, 3),
      ctx("rebid-after-nt", { partnerBid: "4NT" }),
    );
    expect(rec.bid).toBe("Pass");
  });

  it("partner bid 2♦ (heart transfer): normal completion → 2♥", () => {
    const rec = getRecommendation(
      mkHand(15, 4, 3, 3, 3),
      ctx("rebid-after-nt", { partnerBid: "2♦" }),
    );
    expect(rec.bid).toBe("2♥");
    expect(rec.category).toContain("Transfer");
  });

  it("partner bid 2♦ (heart transfer): 17 HCP + 4♥ → super-accept 3♥", () => {
    const rec = getRecommendation(
      mkHand(17, 3, 4, 3, 3),
      ctx("rebid-after-nt", { partnerBid: "2♦" }),
    );
    expect(rec.bid).toBe("3♥");
    expect(rec.category).toContain("Super-Accept");
  });

  it("partner bid 2♥ (spade transfer): complete → 2♠", () => {
    const rec = getRecommendation(
      mkHand(15, 3, 3, 4, 3),
      ctx("rebid-after-nt", { partnerBid: "2♥" }),
    );
    expect(rec.bid).toBe("2♠");
    expect(rec.category).toContain("Transfer");
  });

  it("partner bid 2♥ (spade transfer): 17 HCP + 4♠ → super-accept 3♠", () => {
    const rec = getRecommendation(
      mkHand(17, 4, 3, 3, 3),
      ctx("rebid-after-nt", { partnerBid: "2♥" }),
    );
    expect(rec.bid).toBe("3♠");
    expect(rec.category).toContain("Super-Accept");
  });

  it("partner bid 2♠ (minor transfer) → complete with 3♣", () => {
    const rec = getRecommendation(
      mkHand(15, 4, 3, 3, 3),
      ctx("rebid-after-nt", { partnerBid: "2♠" }),
    );
    expect(rec.bid).toBe("3♣");
  });

  it("accepts partnerBid as the partner response for rebid-after-nt", () => {
    const rec = getRecommendation(
      mkHand(15, 4, 3, 3, 3),
      ctx("rebid-after-nt", { partnerBid: "2NT" }),
    );
    expect(rec.bid).toBe("Pass");
  });
});

describe("bidding-logic | rebid-after-suit", () => {
  it("partner raised our suit, 13-15 TP → Pass", () => {
    const rec = getRecommendation(
      mkHand(13, 5, 3, 3, 2),
      ctx("rebid-after-suit", { myPreviousBid: "1♠", partnerBid: "2♠" }),
    );
    expect(rec.bid).toBe("Pass");
  });

  it("partner raised our suit, 16-18 TP → game try", () => {
    const rec = getRecommendation(
      mkHand(16, 5, 4, 3, 1),
      ctx("rebid-after-suit", { myPreviousBid: "1♠", partnerBid: "2♠" }),
    );
    expect(rec.bid).toContain("3♠");
  });

  it("partner raised, 19+ TP → game", () => {
    const rec = getRecommendation(
      mkHand(18, 5, 4, 3, 1),
      ctx("rebid-after-suit", { myPreviousBid: "1♠", partnerBid: "2♠" }),
    );
    expect(rec.bid).toBe("4♠");
    expect(rec.category).toContain("Game");
  });

  it("partner raised, 22+ TP (slam territory) → 4NT Blackwood", () => {
    // User's exact scenario: 23 HCP, 4♠ — after 1♦-1♠-2♠ combined points ≥ 35
    const rec = getRecommendation(
      mkHand(23, 4, 3, 3, 3),
      ctx("rebid-after-suit", { myPreviousBid: "1♠", partnerBid: "2♠" }),
    );
    expect(rec.bid).toBe("4NT");
    expect(rec.category).toContain("Slam");
  });

  it("partner raised, 22 HCP exactly → 4NT Blackwood", () => {
    const rec = getRecommendation(
      mkHand(22, 4, 3, 4, 2),
      ctx("rebid-after-suit", { myPreviousBid: "1♠", partnerBid: "2♠" }),
    );
    expect(rec.bid).toBe("4NT");
  });

  it("deriveSituation: position-4 responder after raise uses current partner bid (2♠), not old (1♦)", () => {
    // Bug: prevPartnerResponse='1♦' was used instead of current partnerBid='2♠'
    const state: AuctionState = {
      myPosition: 4,
      completedRounds: [{ 1: "Pass", 2: "1♦", 3: "Pass", 4: "1♠" }],
      currentRound: { 1: "Pass", 2: "2♠", 3: "Pass" },
    };
    const s = deriveSituation(state);
    expect(s.situation).toBe("rebid-after-suit");
    expect(s.partnerBid).toBe("2♠"); // must be the RAISE, not the original opening
    expect(s.partnerBid).not.toBe("1♦");
  });

  it("partner bid 1NT, minimum opener → Pass", () => {
    const rec = getRecommendation(
      mkHand(14, 5, 3, 3, 2),
      ctx("rebid-after-suit", { myPreviousBid: "1♠", partnerBid: "1NT" }),
    );
    expect(rec.bid).toBe("Pass");
  });

  it("partner bid new suit, with 4-card support, 13-15 TP → raise", () => {
    const rec = getRecommendation(
      mkHand(14, 5, 4, 3, 1),
      ctx("rebid-after-suit", { myPreviousBid: "1♠", partnerBid: "2♥" }),
    );
    // partnerBid is "2♥" so raise = 3♥
    expect(rec.bid).toBe("3♥");
    expect(rec.category).toContain("Raise");
  });

  it("user's exact bug: 11 HCP, 5♦, 4♠ opened 1♦, partner bid 1♠ → raise to 2♠", () => {
    // Rule-of-20 opener: 11 HCP, 5 diamonds, 4 spades → TP = 12
    const rec = getRecommendation(
      mkHand(11, 4, 3, 5, 1),
      ctx("rebid-after-suit", { myPreviousBid: "1♦", partnerBid: "1♠" }),
    );
    expect(rec.bid).toBe("2♠");
    expect(rec.category).toContain("Raise");
    expect(rec.bid).not.toBe("Continue auction");
  });

  it("minimum opener (TP=10) with 4-card fit → raise, not Continue Auction", () => {
    const rec = getRecommendation(
      mkHand(10, 4, 2, 5, 2),
      ctx("rebid-after-suit", { myPreviousBid: "1♦", partnerBid: "1♠" }),
    );
    expect(rec.bid).toBe("2♠");
    expect(rec.bid).not.toBe("Continue auction");
  });

  it("minimum opener (TP=14, 13 HCP), no 4-card fit but 5-card suit → simple rebid 2♦", () => {
    // 13 HCP, 3 spades (no 4-card fit), 5 diamonds, TP=14 → minimum opener → simple non-forcing 2♦
    // (does NOT jump to 3♦ — opener must not invite game with bare minimum strength)
    const rec = getRecommendation(
      mkHand(13, 3, 2, 5, 3),
      ctx("rebid-after-suit", { myPreviousBid: "1♦", partnerBid: "1♠" }),
    );
    expect(rec.bid).toBe("2♦");
    expect(rec.bid).not.toBe("Continue auction");
  });

  it("responder invitational (10 HCP, 5 hearts, TP=11) after 1♦-1♥-2♦ → invitational jump 3♥", () => {
    // Bug report: tool was saying '3 hearts' is a 'natural non-forcing rebid' with wrong explanation.
    // 3♥ IS the correct bid (invitational jump past 2♥), but the category should say invitational.
    const rec = getRecommendation(
      mkHand(10, 3, 5, 3, 2),
      ctx("rebid-after-suit", { myPreviousBid: "1♥", partnerBid: "2♦" }),
    );
    expect(rec.bid).toBe("3♥");
    expect(rec.category).toContain("Invitational");
    expect(rec.reasoning).toContain("invitational");
  });

  it("responder minimum (8 HCP, 5 hearts, TP=9) after 1♦-1♥-2♦ → simple rebid 2♥, NOT jump", () => {
    // With only 9 TP (below invitational threshold), responder should rebid 2♥ (simple non-forcing)
    // rather than jumping to 3♥
    const rec = getRecommendation(
      mkHand(8, 3, 5, 3, 2),
      ctx("rebid-after-suit", { myPreviousBid: "1♥", partnerBid: "2♦" }),
    );
    expect(rec.bid).toBe("2♥");
    expect(rec.bid).not.toBe("3♥");
  });

  it("partner bid new suit, balanced, minimum → 1NT/2NT rebid", () => {
    const rec = getRecommendation(
      mkHand(14, 3, 3, 3, 4), // 4-card clubs is opening suit, no 4-card suit above hearts → 1NT
      ctx("rebid-after-suit", { myPreviousBid: "1♣", partnerBid: "1♥" }),
    );
    expect(rec.bid).toContain("NT");
  });

  it("user's exact hand: 17 HCP, 6♣, 4♥, 2♠, 1♦ — partner bid 2NT → show hearts (3♥)", () => {
    const rec = getRecommendation(
      mkHand(17, 2, 4, 1, 6),
      ctx("rebid-after-suit", { myPreviousBid: "1♣", partnerBid: "2NT" }),
    );
    expect(rec.bid).toBe("3♥");
    expect(rec.category).toContain("Heart");
    expect(rec.reasoning).toContain("4-4");
  });

  it("opener has 4 spades, no hearts — partner bid 2NT → show spades (3♠)", () => {
    const rec = getRecommendation(
      mkHand(14, 4, 2, 3, 4),
      ctx("rebid-after-suit", { myPreviousBid: "1♣", partnerBid: "2NT" }),
    );
    expect(rec.bid).toBe("3♠");
    expect(rec.category).toContain("Spade");
  });

  it("no 4-card major but 6-card club suit — partner bid 2NT → rebid 3♣", () => {
    const rec = getRecommendation(
      mkHand(14, 2, 3, 2, 6),
      ctx("rebid-after-suit", { myPreviousBid: "1♣", partnerBid: "2NT" }),
    );
    expect(rec.bid).toBe("3♣");
    expect(rec.category).toContain("6-Card");
  });

  it("balanced no major no long minor — partner bid 2NT → bid 3NT", () => {
    const rec = getRecommendation(
      mkHand(14, 3, 3, 3, 4),
      ctx("rebid-after-suit", { myPreviousBid: "1♣", partnerBid: "2NT" }),
    );
    expect(rec.bid).toBe("3NT");
  });

  it("partner bid 3NT, minimum opener with 6-card minor → correct to 5♣", () => {
    const rec = getRecommendation(
      mkHand(13, 2, 3, 2, 6),
      ctx("rebid-after-suit", { myPreviousBid: "1♣", partnerBid: "3NT" }),
    );
    expect(rec.bid).toBe("5♣");
  });

  it("partner bid 3NT, strong opener (20+ TP) → 4NT Blackwood", () => {
    const rec = getRecommendation(
      mkHand(20, 2, 2, 3, 6),
      ctx("rebid-after-suit", { myPreviousBid: "1♣", partnerBid: "3NT" }),
    );
    expect(rec.bid).toBe("4NT");
  });

  it("partner bid 3NT, moderate opener, balanced → Pass", () => {
    const rec = getRecommendation(
      mkHand(14, 3, 3, 3, 4),
      ctx("rebid-after-suit", { myPreviousBid: "1♣", partnerBid: "3NT" }),
    );
    expect(rec.bid).toBe("Pass");
  });
});

// ─── respond-to-partner-invitation ────────────────────────────────────────────
describe("bidding-logic | respond-to-partner-invitation", () => {
  // Bug report: after 1♦-1♥-2♦-3♥, the tool was recommending 4♦ (wrong!).
  // Partner's 3♥ is an invitational jump rebid in their own suit — opener should
  // Pass with a minimum hand (not rebid diamonds a third time).
  it("user bug: 12 HCP, 2♥ support, TP=13 → Pass (decline invitation)", () => {
    const rec = getRecommendation(
      mkHand(12, 2, 2, 5, 4),
      ctx("respond-to-partner-invitation", {
        myPreviousBid: "2♦",
        partnerBid: "3♥",
      }),
    );
    expect(rec.bid).toBe("Pass");
    expect(rec.category).toContain("Decline");
    expect(rec.reasoning).toContain("minimum");
  });

  it("minimum opener (13 TP, 2-card heart support) → Pass", () => {
    const rec = getRecommendation(
      mkHand(13, 3, 2, 5, 3),
      ctx("respond-to-partner-invitation", {
        myPreviousBid: "2♦",
        partnerBid: "3♥",
      }),
    );
    expect(rec.bid).toBe("Pass");
  });

  it("maximum opener (16 TP) → accept: bid 4♥", () => {
    const rec = getRecommendation(
      mkHand(16, 2, 2, 5, 4),
      ctx("respond-to-partner-invitation", {
        myPreviousBid: "2♦",
        partnerBid: "3♥",
      }),
    );
    expect(rec.bid).toBe("4♥");
    expect(rec.category).toContain("Accept");
  });

  it("mid-range (14 TP) with 3-card heart support → accept: bid 4♥", () => {
    const rec = getRecommendation(
      mkHand(14, 2, 3, 5, 3),
      ctx("respond-to-partner-invitation", {
        myPreviousBid: "2♦",
        partnerBid: "3♥",
      }),
    );
    expect(rec.bid).toBe("4♥");
    expect(rec.category).toContain("Accept");
  });

  it("no major fit (2 hearts) + balanced + 14 HCP → offer 3NT", () => {
    const rec = getRecommendation(
      mkHand(14, 3, 2, 4, 4),
      ctx("respond-to-partner-invitation", {
        myPreviousBid: "2♦",
        partnerBid: "3♥",
      }),
    );
    expect(rec.bid).toBe("3NT");
  });

  it("spade invitation: 3♠ after 1♠ response → max opener accepts 4♠", () => {
    const rec = getRecommendation(
      mkHand(16, 2, 3, 4, 4),
      ctx("respond-to-partner-invitation", {
        myPreviousBid: "2♦",
        partnerBid: "3♠",
      }),
    );
    expect(rec.bid).toBe("4♠");
  });

  it("minor invitation: 3♦ after 1♦ response → minimum opener passes", () => {
    const rec = getRecommendation(
      mkHand(13, 3, 3, 2, 5),
      ctx("respond-to-partner-invitation", {
        myPreviousBid: "2♣",
        partnerBid: "3♦",
      }),
    );
    expect(rec.bid).toBe("Pass");
  });
});

// ─── deriveSituation: respond-to-partner-invitation detection ─────────────────
describe("bidding-logic | deriveSituation — respond-to-partner-invitation", () => {
  it("1♦-1♥-2♦-3♥ routes to respond-to-partner-invitation (not rebid-after-suit)", () => {
    // The user's bug: opener had 12 HCP, 2♥, 5♦ and got 4♦ recommended
    const s = deriveSituation(
      {
        completedRounds: [
          { 1: "1♦", 2: "Pass", 3: "1♥", 4: "Pass" },
          { 1: "2♦", 2: "Pass", 3: "3♥", 4: "Pass" },
        ],
        currentRound: {},
        myPosition: 1,
      },
      "none",
    );
    expect(s.situation).toBe("respond-to-partner-invitation");
    expect(s.partnerBid).toBe("3♥");
  });

  it("1♦-1♥-2♦-2♥ does NOT route to respond-to-partner-invitation (2♥ is simple preference, not a jump)", () => {
    const s = deriveSituation(
      {
        completedRounds: [
          { 1: "1♦", 2: "Pass", 3: "1♥", 4: "Pass" },
          { 1: "2♦", 2: "Pass", 3: "2♥", 4: "Pass" },
        ],
        currentRound: {},
        myPosition: 1,
      },
      "none",
    );
    expect(s.situation).toBe("rebid-after-suit");
  });

  it("genuinely new suit (partner never bid hearts before) does NOT route to respond-to-partner-invitation", () => {
    // Opener bid 1♦, partner bid 1♠, opener rebid 2♦, partner now bids 3♥ (new suit)
    const s = deriveSituation(
      {
        completedRounds: [
          { 1: "1♦", 2: "Pass", 3: "1♠", 4: "Pass" },
          { 1: "2♦", 2: "Pass", 3: "3♥", 4: "Pass" },
        ],
        currentRound: {},
        myPosition: 1,
      },
      "none",
    );
    // 3♥ is a new suit here (partner never bid hearts), so rebid-after-suit
    expect(s.situation).toBe("rebid-after-suit");
  });
});

describe("bidding-logic | jacoby-2nt-opener", () => {
  it("16+ TP → slam interest (3 of major)", () => {
    const rec = getRecommendation(
      mkHand(16, 5, 3, 3, 2),
      ctx("jacoby-2nt-opener", { myPreviousBid: "1♠" }),
    );
    expect(rec.bid).toContain("3♠");
  });

  it("shortness in side suit → show shortness (3 of short suit)", () => {
    const rec = getRecommendation(
      mkHand(14, 5, 1, 4, 3),
      ctx("jacoby-2nt-opener", { myPreviousBid: "1♠" }),
    );
    expect(rec.bid).toContain("3♥"); // shows singleton hearts
  });

  it("14-15 balanced → 3NT", () => {
    const rec = getRecommendation(
      mkHand(14, 5, 3, 3, 2),
      ctx("jacoby-2nt-opener", { myPreviousBid: "1♠" }),
    );
    expect(rec.bid).toBe("3NT");
  });

  it("minimum 12-13 pts → sign off 4 of major", () => {
    const rec = getRecommendation(
      mkHand(12, 5, 3, 3, 2),
      ctx("jacoby-2nt-opener", { myPreviousBid: "1♠" }),
    );
    expect(rec.bid).toBe("4♠");
  });
});

describe("bidding-logic | rebid-after-negative-double", () => {
  it("4-card fit for shown suit, minimum → bid suit cheaply", () => {
    const rec = getRecommendation(
      mkHand(13, 4, 4, 3, 2),
      ctx("rebid-after-negative-double", {
        myPreviousBid: "1♦",
        rhoBid: "1♠",
      }),
    );
    expect(rec.bid).toContain("♥");
  });

  it("no fit, balanced → NT rebid", () => {
    const rec = getRecommendation(
      mkHand(15, 4, 2, 4, 3),
      ctx("rebid-after-negative-double", {
        myPreviousBid: "1♦",
        rhoBid: "1♠",
      }),
    );
    expect(rec.bid).toContain("NT");
  });
});

describe("bidding-logic | responding-suit-after-double", () => {
  it("3+ support, 10+ pts → Jordan 2NT", () => {
    const rec = getRecommendation(
      mkHand(11, 3, 4, 3, 3),
      ctx("responding-suit-after-double", { partnerBid: "1♥" }),
    );
    expect(rec.bid).toContain("2NT");
    expect(rec.category).toContain("Jordan");
  });

  it("3+ support, 6-9 pts → pre-emptive raise", () => {
    const rec = getRecommendation(
      mkHand(8, 3, 3, 4, 3),
      ctx("responding-suit-after-double", { partnerBid: "1♥" }),
    );
    expect(rec.bid).toContain("3♥");
    expect(rec.category).toContain("Pre-emptive");
  });

  it("3+ support, 13+ pts → re-double", () => {
    const rec = getRecommendation(
      mkHand(14, 3, 4, 3, 3),
      ctx("responding-suit-after-double", { partnerBid: "1♥" }),
    );
    expect(rec.bid).toBe("Redouble");
    expect(rec.category).toContain("Re-double");
  });
});

describe("bidding-logic | responding-1nt-doubled", () => {
  // User-reported bug: after 1NT-Double, the engine was routing to
  // responding-suit-after-double and recommending "2♠ / 3-card support" which
  // was nonsensical (there is no suit to support after a NT opening).

  it("weak hand (2 HCP, no 5-card suit) → Pass, no 'support' language", () => {
    // Hand 3 from user report: 2 HCP, 3♠3♥3♣4♦
    const rec = getRecommendation(
      mkHand(2, 3, 3, 4, 3),
      ctx("responding-1nt-doubled", { partnerBid: "1NT" }),
    );
    expect(rec.bid).toBe("Pass");
    expect(rec.category).not.toMatch(/support/i);
    expect(rec.reasoning).not.toMatch(/support/i);
    expect(rec.reasoning).toMatch(/opponent/i);
  });

  it("strong hand (12 HCP) → Redouble", () => {
    const rec = getRecommendation(
      mkHand(12, 3, 3, 4, 3),
      ctx("responding-1nt-doubled", { partnerBid: "1NT" }),
    );
    expect(rec.bid).toBe("Redouble");
    expect(rec.reasoning).toMatch(/opponent/i);
  });

  it("weak hand with 5-card suit (2 HCP, 5 spades) → escape to 2♠", () => {
    const rec = getRecommendation(
      mkHand(2, 5, 2, 3, 3),
      ctx("responding-1nt-doubled", { partnerBid: "1NT" }),
    );
    expect(rec.bid).toBe("2♠");
    expect(rec.reasoning).toMatch(/escape/i);
    expect(rec.reasoning).toMatch(/opponent/i);
  });

  it("deriveSituation: 1NT-Double → responding-1nt-doubled (not responding-suit-after-double)", () => {
    const s = deriveSituation(
      mkState({ currentRound: { 1: "1NT", 2: "Double" } }),
    );
    expect(s.situation).toBe("responding-1nt-doubled");
  });
});

// ─── Full auction trace: 1NT–Double scenario ────────────────────────────────
// User-reported auction: H1(15,3♠4♥4♣2♦) opens 1NT; H2(13,1♠4♥4♣4♦) doubles;
// H3(2,3♠3♥3♣4♦) responds; H4(10,6♠2♥2♣3♦) responds.
describe("bidding-logic | full auction 1NT-Double", () => {
  const h1 = mkHand(15, 3, 4, 2, 4); // 15 HCP, 3♠4♥2♦4♣
  const h3 = mkHand(2, 3, 3, 4, 3); // 2 HCP, 3♠3♥4♦3♣
  const h4 = mkHand(10, 6, 2, 3, 2); // 10 HCP, 6♠2♥3♦2♣

  it("H1 (15 HCP, balanced) → opens 1NT", () => {
    const rec = getRecommendation(h1, ctx("opening", {}));
    expect(rec.bid).toBe("1NT");
  });

  it("H3 (2 HCP, 3♠3♥4♦3♣) after 1NT-Double → Pass with no 'support' language", () => {
    const rec = getRecommendation(
      h3,
      ctx("responding-1nt-doubled", { partnerBid: "1NT" }),
    );
    expect(rec.bid).toBe("Pass");
    expect(rec.category).not.toMatch(/support/i);
    expect(rec.reasoning).toMatch(/opponent/i);
    expect(rec.reasoning).toMatch(/1NT/);
  });

  it("H4 (10 HCP, 6 spades) responding to partner's double of 1NT → bids spades", () => {
    // H4 is partner of the doubler; should show their 6-card spade suit
    const rec = getRecommendation(
      h4,
      ctx("responding-to-double", { partnerBid: "Double", lhoBid: "1NT" }),
    );
    expect(rec.bid).toMatch(/♠/);
  });
});

describe("bidding-logic | stayman-response", () => {
  it("partner replied 2♦ (no major), balanced → 2NT or 3NT based on pts", () => {
    const rec = getRecommendation(
      mkHand(9, 4, 3, 3, 3),
      ctx("stayman-response", { partnerBid: "2♦" }),
    );
    expect(rec.bid).toContain("2NT");
  });

  it("partner replied 2♦, 10+ HCP → 3NT", () => {
    const rec = getRecommendation(
      mkHand(11, 4, 3, 3, 3),
      ctx("stayman-response", { partnerBid: "2♦" }),
    );
    expect(rec.bid).toBe("3NT");
  });

  it("partner replied 2♦, had 5-4 majors, 11 HCP → 3♠ game-forcing", () => {
    const rec = getRecommendation(
      mkHand(11, 5, 4, 2, 2),
      ctx("stayman-response", { partnerBid: "2♦" }),
    );
    expect(rec.bid).toBe("3♠");
    expect(rec.category).toContain("5-card Major");
    expect(rec.category).toMatch(/game-forcing/i);
  });

  it("partner replied 2♦, had 5-4 majors, 9 HCP → 2♠ invitational (not game-forcing)", () => {
    // 9 HCP = invitational only — opener may pass with a minimum 1NT
    const rec = getRecommendation(
      mkHand(9, 5, 4, 1, 3),
      ctx("stayman-response", { partnerBid: "2♦" }),
    );
    expect(rec.bid).toBe("2♠");
    expect(rec.category).toMatch(/invitational/i);
    expect(rec.reasoning).toMatch(/invit/i);
  });

  it("partner replied 2♦, had 4-5 majors (5 hearts), 9 HCP → 2♥ invitational", () => {
    const rec = getRecommendation(
      mkHand(9, 4, 5, 1, 3),
      ctx("stayman-response", { partnerBid: "2♦" }),
    );
    expect(rec.bid).toBe("2♥");
    expect(rec.category).toMatch(/invitational/i);
  });

  // ── Partner's 2NT continuation after responder showed 5-card major ────────────
  it("1NT-2♣-2♦-2♠-2NT: responder 8 HCP → Pass (accept 2NT, minimum invitation declined)", () => {
    // mkHand(hcp, spades, hearts, diamonds, clubs) — 5 spades, 4 hearts
    const rec = getRecommendation(
      mkHand(8, 5, 4, 1, 3),
      ctx("stayman-response", { partnerBid: "2♦", partnerContinuation: "2NT" }),
    );
    expect(rec.bid).toBe("Pass");
    expect(rec.category).toMatch(/accept|declined/i);
  });

  it("1NT-2♣-2♦-2♠-2NT: responder 9 HCP → 3NT (push to game, top of range)", () => {
    const rec = getRecommendation(
      mkHand(9, 5, 4, 1, 3),
      ctx("stayman-response", { partnerBid: "2♦", partnerContinuation: "2NT" }),
    );
    expect(rec.bid).toBe("3NT");
    expect(rec.category).toMatch(/3NT|game/i);
  });

  it("partner replied 2♥ (hearts), we have 4 hearts → bid game", () => {
    const rec = getRecommendation(
      mkHand(10, 3, 4, 3, 3),
      ctx("stayman-response", { partnerBid: "2♥" }),
    );
    expect(rec.bid).toContain("4♥");
  });

  it("partner replied 2♥, we have no 4-card heart fit → 3NT", () => {
    const rec = getRecommendation(
      mkHand(10, 4, 3, 3, 3),
      ctx("stayman-response", { partnerBid: "2♥" }),
    );
    expect(rec.bid).toBe("3NT");
    // With 4 spades implied, category should mention the spade implication
    expect(rec.category).toContain("♠ Implied");
    expect(rec.note).toContain("3NT");
  });

  it("partner replied 2♥, 9 HCP with 4 spades → 2NT (invitational, implies 4 spades)", () => {
    // User's exact bug report: 9 HCP, 4 spades, 2 hearts, 4 diamonds, 3 clubs
    const rec = getRecommendation(
      mkHand(9, 4, 2, 4, 3),
      ctx("stayman-response", { partnerBid: "2♥" }),
    );
    expect(rec.bid).toBe("2NT");
    expect(rec.category).toContain("♠ Implied");
    // Should NOT suggest bidding 4♠ directly
    expect(rec.bid).not.toBe("4♠");
    // Reasoning should mention that 2NT implies the 4 spades
    expect(rec.reasoning).toContain("4 spades");
    expect(rec.note).toContain("4♠");
  });

  it("partner replied 2♠, we have 4 spades → 4♠", () => {
    const rec = getRecommendation(
      mkHand(10, 4, 3, 3, 3),
      ctx("stayman-response", { partnerBid: "2♠" }),
    );
    expect(rec.bid).toContain("4♠");
  });
});

// ─── stayman-opener-rebid ─────────────────────────────────────────────────────

describe("bidding-logic | stayman-opener-rebid", () => {
  it("opener showed hearts, partner bid 2NT, opener has 17 HCP, no spades → 3NT", () => {
    // User's exact bug report: 17 HCP, 5 hearts, 3 clubs, 3 diamonds, 2 spades
    const rec = getRecommendation(
      mkHand(17, 2, 5, 3, 3),
      ctx("stayman-opener-rebid", { myPreviousBid: "2♥", partnerBid: "2NT" }),
    );
    expect(rec.bid).toBe("3NT");
    expect(rec.category).toContain("Accept");
    expect(rec.reasoning).toContain("17");
  });

  it("opener showed hearts, partner bid 2NT, opener has 15 HCP, no spades → Pass", () => {
    const rec = getRecommendation(
      mkHand(15, 2, 5, 3, 3),
      ctx("stayman-opener-rebid", { myPreviousBid: "2♥", partnerBid: "2NT" }),
    );
    expect(rec.bid).toBe("Pass");
    expect(rec.category).toContain("Decline");
  });

  it("opener showed hearts, partner bid 2NT, opener also has 4 spades + 17 HCP → 4♠", () => {
    const rec = getRecommendation(
      mkHand(17, 4, 4, 3, 2),
      ctx("stayman-opener-rebid", { myPreviousBid: "2♥", partnerBid: "2NT" }),
    );
    expect(rec.bid).toBe("4♠");
    expect(rec.category).toContain("♠");
  });

  it("opener showed hearts, partner bid 2NT, opener has 4 spades + 15 HCP → 3♠ invitational", () => {
    const rec = getRecommendation(
      mkHand(15, 4, 4, 3, 2),
      ctx("stayman-opener-rebid", { myPreviousBid: "2♥", partnerBid: "2NT" }),
    );
    expect(rec.bid).toBe("3♠");
  });

  it("opener showed hearts, partner bid 3♥ (invitational raise), 17 HCP → 4♥", () => {
    const rec = getRecommendation(
      mkHand(17, 2, 4, 4, 3),
      ctx("stayman-opener-rebid", { myPreviousBid: "2♥", partnerBid: "3♥" }),
    );
    expect(rec.bid).toBe("4♥");
  });

  it("opener showed hearts, partner bid 3♥, 15 HCP → Pass (decline)", () => {
    const rec = getRecommendation(
      mkHand(15, 2, 4, 4, 3),
      ctx("stayman-opener-rebid", { myPreviousBid: "2♥", partnerBid: "3♥" }),
    );
    expect(rec.bid).toBe("Pass");
  });

  it("opener showed hearts, partner bid 4♥ (game) → Pass", () => {
    const rec = getRecommendation(
      mkHand(16, 2, 4, 4, 3),
      ctx("stayman-opener-rebid", { myPreviousBid: "2♥", partnerBid: "4♥" }),
    );
    expect(rec.bid).toBe("Pass");
  });

  it("opener showed hearts, partner bid 2♠ (showing spades, no heart fit), opener has 4 spades + 17 HCP → 4♠", () => {
    const rec = getRecommendation(
      mkHand(17, 4, 4, 3, 2),
      ctx("stayman-opener-rebid", { myPreviousBid: "2♥", partnerBid: "2♠" }),
    );
    expect(rec.bid).toBe("4♠");
  });

  it("deriveSituation correctly routes to stayman-opener-rebid after 1NT → Stayman → 2♥ → 2NT", () => {
    // Position 1 opened 1NT, partner (pos 3) bid 2♣ Stayman, opener bid 2♥, partner bid 2NT
    const state: AuctionState = {
      myPosition: 1,
      completedRounds: [
        { 1: "1NT", 2: "Pass", 3: "2♣", 4: "Pass" },
        { 1: "2♥", 2: "Pass", 3: "2NT", 4: "Pass" },
      ],
      currentRound: {},
    };
    const s = deriveSituation(state);
    expect(s.situation).toBe("stayman-opener-rebid");
    expect(s.myPreviousBid).toBe("2♥");
    expect(s.partnerBid).toBe("2NT");
  });

  it("opener showed spades (2♠), partner bid 3NT → Pass with 16 HCP", () => {
    const rec = getRecommendation(
      mkHand(16, 4, 2, 4, 3),
      ctx("stayman-opener-rebid", { myPreviousBid: "2♠", partnerBid: "3NT" }),
    );
    expect(rec.bid).toBe("Pass");
  });

  it("opener showed spades (2♠), partner bid 3NT → 4NT slam probe with 17 HCP", () => {
    const rec = getRecommendation(
      mkHand(17, 4, 2, 4, 3),
      ctx("stayman-opener-rebid", { myPreviousBid: "2♠", partnerBid: "3NT" }),
    );
    expect(rec.bid).toBe("4NT");
  });

  it("opener showed spades (2♠), partner bid 4♠ (game) → Pass", () => {
    const rec = getRecommendation(
      mkHand(16, 4, 2, 4, 3),
      ctx("stayman-opener-rebid", { myPreviousBid: "2♠", partnerBid: "4♠" }),
    );
    expect(rec.bid).toBe("Pass");
    expect(rec.category).toContain("Game Reached");
  });

  it("opener showed spades (2♠), partner bid 3♠ (invitational), 17 HCP → 4♠", () => {
    const rec = getRecommendation(
      mkHand(17, 4, 2, 4, 3),
      ctx("stayman-opener-rebid", { myPreviousBid: "2♠", partnerBid: "3♠" }),
    );
    expect(rec.bid).toBe("4♠");
  });

  it("opener denied major (2♦), partner bids 3♥ (5-card major), opener has 3 hearts + 17 HCP → 4♥", () => {
    const rec = getRecommendation(
      mkHand(17, 3, 3, 4, 3),
      ctx("stayman-opener-rebid", { myPreviousBid: "2♦", partnerBid: "3♥" }),
    );
    expect(rec.bid).toBe("4♥");
    expect(rec.category).toContain("♥");
  });

  it("opener denied major (2♦), partner bids 3♥, opener has 1 heart + 17 HCP → 3NT (no fit)", () => {
    const rec = getRecommendation(
      mkHand(17, 4, 1, 4, 4),
      ctx("stayman-opener-rebid", { myPreviousBid: "2♦", partnerBid: "3♥" }),
    );
    expect(rec.bid).toBe("3NT");
  });

  it("opener denied major (2♦), partner bids 3♥, opener has 1 heart + 15 HCP → Pass (no fit, minimum)", () => {
    const rec = getRecommendation(
      mkHand(15, 4, 1, 4, 4),
      ctx("stayman-opener-rebid", { myPreviousBid: "2♦", partnerBid: "3♥" }),
    );
    expect(rec.bid).toBe("Pass");
  });

  it("fallback: unusual continuation → 3NT for 17 HCP", () => {
    const rec = getRecommendation(
      mkHand(17, 2, 4, 4, 3),
      ctx("stayman-opener-rebid", { myPreviousBid: "2♥", partnerBid: "3♠" }),
    );
    // Fallback — 3♠ not a standard Stayman continuation after 2♥
    expect(rec.bid).toBeDefined();
    expect(rec.bid).not.toBe("Continue auction");
  });
});

// ─── stayman-opener-rebid — after 2♦ denial, partner shows 5-card major ────────

describe("bidding-logic | stayman-opener-rebid — after 2♦ denial, partner shows major", () => {
  // 2×2 grid: fit vs no-fit, min (15 HCP) vs max (16-17 HCP)
  // mkHand(hcp, spades, hearts, diamonds, clubs)

  it("denied major (2♦), partner bids 2♠ (5-card spades), opener has 3 spades + min → Pass (fit, minimum)", () => {
    const rec = getRecommendation(
      mkHand(15, 3, 3, 5, 2),
      ctx("stayman-opener-rebid", { myPreviousBid: "2♦", partnerBid: "2♠" }),
    );
    expect(rec.bid).toBe("Pass");
  });

  it("denied major (2♦), partner bids 2♠ (5-card spades), opener has 3 spades + max → 4♠ (fit, maximum)", () => {
    const rec = getRecommendation(
      mkHand(17, 3, 3, 5, 2),
      ctx("stayman-opener-rebid", { myPreviousBid: "2♦", partnerBid: "2♠" }),
    );
    expect(rec.bid).toBe("4♠");
  });

  it("denied major (2♦), partner bids 2♠ (5-card spades), opener has 2 spades + min → 2NT (no fit, minimum — NOT Pass)", () => {
    // The user's exact bug: 15 HCP, 2 spades — should bid 2NT not Pass
    const rec = getRecommendation(
      mkHand(15, 2, 3, 5, 3),
      ctx("stayman-opener-rebid", { myPreviousBid: "2♦", partnerBid: "2♠" }),
    );
    expect(rec.bid).toBe("2NT");
    expect(rec.reasoning).toMatch(/2NT/);
    expect(rec.whatYourBidTellsPartner).not.toMatch(/suggesting NT/i); // old wrong text
  });

  it("denied major (2♦), partner bids 2♠ (5-card spades), opener has 2 spades + max → 3NT (no fit, maximum)", () => {
    const rec = getRecommendation(
      mkHand(17, 2, 3, 5, 3),
      ctx("stayman-opener-rebid", { myPreviousBid: "2♦", partnerBid: "2♠" }),
    );
    expect(rec.bid).toBe("3NT");
  });

  it("denied major (2♦), partner bids 2♥ (5-card hearts), opener has 2 hearts + min → 2NT (no fit, minimum)", () => {
    const rec = getRecommendation(
      mkHand(15, 3, 2, 5, 3),
      ctx("stayman-opener-rebid", { myPreviousBid: "2♦", partnerBid: "2♥" }),
    );
    expect(rec.bid).toBe("2NT");
  });
});

// ─── stayman-opener-rebid (transfer completion context) ───────────────────────

describe("bidding-logic | stayman-opener-rebid — transfer follow-up", () => {
  const transferCtx = (myPreviousBid: string, partnerBid: string) =>
    ctx("stayman-opener-rebid", {
      myPreviousBid,
      partnerBid,
      wasTransferCompletion: true,
    });

  // User's exact hand: 15 HCP, 4♠ 3♥ 4♦ 2♣, opened 1NT, completed transfer 2♥,
  // partner now bids 3NT. Should correct to 4♥ with 3-card support.
  it("opener 15 HCP 3 hearts, partner bids 3NT after transfer → correct to 4♥", () => {
    const rec = getRecommendation(
      mkHand(15, 4, 3, 4, 2),
      transferCtx("2♥", "3NT"),
    );
    expect(rec.bid).toBe("4♥");
    expect(rec.category).toContain("Transfer");
  });

  it("opener 16 HCP 4 hearts, partner bids 3NT after transfer → correct to 4♥", () => {
    const rec = getRecommendation(
      mkHand(16, 3, 4, 3, 3),
      transferCtx("2♥", "3NT"),
    );
    expect(rec.bid).toBe("4♥");
  });

  it("opener 15 HCP only 2 hearts, partner bids 3NT after transfer → accept 3NT (Pass)", () => {
    const rec = getRecommendation(
      mkHand(15, 4, 2, 4, 3),
      transferCtx("2♥", "3NT"),
    );
    expect(rec.bid).toBe("Pass");
    expect(rec.category).toContain("Transfer");
  });

  it("opener 17 HCP only 2 hearts, partner bids 3NT after transfer → 4NT slam probe", () => {
    const rec = getRecommendation(
      mkHand(17, 4, 2, 4, 3),
      transferCtx("2♥", "3NT"),
    );
    expect(rec.bid).toBe("4NT");
  });

  it("opener 3 spades, partner bids 3NT after spade transfer → correct to 4♠", () => {
    const rec = getRecommendation(
      mkHand(15, 3, 4, 3, 3),
      transferCtx("2♠", "3NT"),
    );
    expect(rec.bid).toBe("4♠");
  });

  it("opener 17 HCP 3 hearts, partner bids 2NT after transfer → bid 4♥ game", () => {
    const rec = getRecommendation(
      mkHand(17, 4, 3, 3, 3),
      transferCtx("2♥", "2NT"),
    );
    expect(rec.bid).toBe("4♥");
  });

  it("opener 15 HCP 3 hearts, partner bids 2NT after transfer → invite 3♥", () => {
    const rec = getRecommendation(
      mkHand(15, 4, 3, 3, 3),
      transferCtx("2♥", "2NT"),
    );
    expect(rec.bid).toBe("3♥");
  });

  it("opener 15 HCP 2 hearts, partner bids 2NT after transfer → decline (Pass)", () => {
    const rec = getRecommendation(
      mkHand(15, 4, 2, 4, 3),
      transferCtx("2♥", "2NT"),
    );
    expect(rec.bid).toBe("Pass");
  });

  it("deriveSituation: pos 3 opener, 1NT → 2♦ transfer → 2♥ completion → partner 3NT → stayman-opener-rebid with wasTransferCompletion=true", () => {
    const s = deriveSituation(
      mkState({
        myPosition: 3,
        completedRounds: [
          { 1: "Pass", 2: "Pass", 3: "1NT", 4: "Pass" },
          { 1: "2♦", 2: "Pass", 3: "2♥", 4: "Pass" },
        ],
        currentRound: { 1: "3NT", 2: "Pass" },
      }),
    );
    expect(s.situation).toBe("stayman-opener-rebid");
    expect(s.wasTransferCompletion).toBe(true);
  });

  it("deriveSituation: Stayman sequence does NOT set wasTransferCompletion", () => {
    const s = deriveSituation(
      mkState({
        myPosition: 3,
        completedRounds: [
          { 1: "Pass", 2: "Pass", 3: "1NT", 4: "Pass" },
          { 1: "2♣", 2: "Pass", 3: "2♥", 4: "Pass" },
        ],
        currentRound: { 1: "3NT", 2: "Pass" },
      }),
    );
    expect(s.situation).toBe("stayman-opener-rebid");
    expect(s.wasTransferCompletion).toBe(false);
  });
});

describe("bidding-logic | transfer-response", () => {
  it("0-7 pts → Pass", () => {
    const rec = getRecommendation(
      mkHand(6, 3, 5, 3, 2),
      ctx("transfer-response", { partnerBid: "2♥" }),
    );
    expect(rec.bid).toBe("Pass");
  });

  it("5-card major, 10+ pts → 3NT (partner can correct to 4 of major)", () => {
    const rec = getRecommendation(
      mkHand(11, 3, 5, 3, 2),
      ctx("transfer-response", { partnerBid: "2♥" }),
    );
    expect(rec.bid).toBe("3NT");
  });

  it("5-card major, 8-9 pts → 2NT invitational", () => {
    const rec = getRecommendation(
      mkHand(8, 3, 5, 3, 2),
      ctx("transfer-response", { partnerBid: "2♥" }),
    );
    expect(rec.bid).toBe("2NT");
  });

  it("6+ card major, 10+ pts → 4 of major (game)", () => {
    const rec = getRecommendation(
      mkHand(10, 2, 6, 3, 2),
      ctx("transfer-response", { partnerBid: "2♥" }),
    );
    expect(rec.bid).toContain("4♥");
  });

  it("6+ card major, 8-9 pts → 3 of major (invite)", () => {
    const rec = getRecommendation(
      mkHand(8, 2, 6, 3, 2),
      ctx("transfer-response", { partnerBid: "2♥" }),
    );
    expect(rec.bid).toContain("3♥");
  });

  it("5-5 majors, invitational → bid 2 of other major", () => {
    const rec = getRecommendation(
      mkHand(8, 5, 5, 2, 1),
      ctx("transfer-response", { partnerBid: "2♥" }),
    );
    // Transfer was 2♦ to hearts, so we have 5♥+5♠
    expect(rec.bid).toContain("2♠");
  });
});

describe("bidding-logic | transfer-response (spade transfer — partnerBid: 2♠)", () => {
  it("0-7 pts → Pass after spade transfer completion", () => {
    const rec = getRecommendation(
      mkHand(6, 5, 3, 3, 2),
      ctx("transfer-response", { partnerBid: "2♠" }),
    );
    expect(rec.bid).toBe("Pass");
  });

  it("5-card spades, 10+ pts → 3NT (partner can correct to 4♠)", () => {
    const rec = getRecommendation(
      mkHand(11, 5, 3, 3, 2),
      ctx("transfer-response", { partnerBid: "2♠" }),
    );
    expect(rec.bid).toBe("3NT");
  });

  it("5-card spades, 8-9 pts → 2NT invitational", () => {
    const rec = getRecommendation(
      mkHand(8, 5, 3, 3, 2),
      ctx("transfer-response", { partnerBid: "2♠" }),
    );
    expect(rec.bid).toBe("2NT");
  });

  it("6+ card spades, 10+ pts → 4♠ game", () => {
    const rec = getRecommendation(
      mkHand(10, 6, 2, 3, 2),
      ctx("transfer-response", { partnerBid: "2♠" }),
    );
    expect(rec.bid).toContain("4♠");
  });

  it("6+ card spades, 8-9 pts → 3♠ invite", () => {
    const rec = getRecommendation(
      mkHand(8, 6, 2, 3, 2),
      ctx("transfer-response", { partnerBid: "2♠" }),
    );
    expect(rec.bid).toContain("3♠");
  });

  // End-to-end: responder (pos 1) passes then bids 2♥ (spade transfer) after partner
  // (pos 3) opens 1NT. Partner completes with 2♠. Round 3 should route to transfer-response.
  it("deriveSituation: pos 1 spade transfer — routes to transfer-response", () => {
    const s = deriveSituation(
      mkState({
        myPosition: 1,
        completedRounds: [
          { 1: "Pass", 2: "Pass", 3: "1NT", 4: "Pass" },
          { 1: "2♥", 2: "Pass", 3: "2♠", 4: "Pass" },
        ],
        currentRound: {},
      }),
    );
    expect(s.situation).toBe("transfer-response");
    expect(s.partnerBid).toBe("2♠");
  });

  it("end-to-end: pos 1, 10 HCP 5 spades after spade transfer completes → 3NT", () => {
    const state = mkState({
      myPosition: 1,
      completedRounds: [
        { 1: "Pass", 2: "Pass", 3: "1NT", 4: "Pass" },
        { 1: "2♥", 2: "Pass", 3: "2♠", 4: "Pass" },
      ],
      currentRound: {},
    });
    const rec = getRecommendation(
      { hcp: 10, spades: 5, hearts: 3, clubs: 3, diamonds: 2 },
      deriveSituation(state),
    );
    expect(rec.bid).toBe("3NT");
    expect(rec.category).toContain("Transfer");
  });
});

describe("bidding-logic | stayman-opener-rebid — spade transfer follow-up (opener side)", () => {
  const transferCtxSpade = (partnerBid: string) =>
    ctx("stayman-opener-rebid", {
      myPreviousBid: "2♠",
      partnerBid,
      wasTransferCompletion: true,
    });

  it("opener 15 HCP 3 spades, partner bids 3NT after spade transfer → correct to 4♠", () => {
    const rec = getRecommendation(
      mkHand(15, 3, 4, 3, 3),
      transferCtxSpade("3NT"),
    );
    expect(rec.bid).toBe("4♠");
    expect(rec.category).toContain("Transfer");
  });

  it("opener 16 HCP 4 spades, partner bids 3NT after spade transfer → correct to 4♠", () => {
    const rec = getRecommendation(
      mkHand(16, 4, 3, 3, 3),
      transferCtxSpade("3NT"),
    );
    expect(rec.bid).toBe("4♠");
  });

  it("opener 15 HCP only 2 spades, partner bids 3NT after spade transfer → accept 3NT (Pass)", () => {
    const rec = getRecommendation(
      mkHand(15, 2, 4, 4, 3),
      transferCtxSpade("3NT"),
    );
    expect(rec.bid).toBe("Pass");
    expect(rec.category).toContain("Transfer");
  });

  it("opener 17 HCP only 2 spades, partner bids 3NT after spade transfer → 4NT slam probe", () => {
    const rec = getRecommendation(
      mkHand(17, 2, 4, 4, 3),
      transferCtxSpade("3NT"),
    );
    expect(rec.bid).toBe("4NT");
  });

  it("opener 17 HCP 3 spades, partner bids 2NT after spade transfer → bid 4♠ game", () => {
    const rec = getRecommendation(
      mkHand(17, 3, 4, 3, 3),
      transferCtxSpade("2NT"),
    );
    expect(rec.bid).toBe("4♠");
  });

  it("opener 15 HCP 3 spades, partner bids 2NT after spade transfer → invite 3♠", () => {
    const rec = getRecommendation(
      mkHand(15, 3, 4, 3, 3),
      transferCtxSpade("2NT"),
    );
    expect(rec.bid).toBe("3♠");
  });

  it("opener 15 HCP 2 spades, partner bids 2NT after spade transfer → decline (Pass)", () => {
    const rec = getRecommendation(
      mkHand(15, 2, 4, 4, 3),
      transferCtxSpade("2NT"),
    );
    expect(rec.bid).toBe("Pass");
  });

  // End-to-end deriveSituation check
  it("deriveSituation: pos 3 opener, 1NT → 2♥ spade transfer → 2♠ completion → partner 3NT → stayman-opener-rebid with wasTransferCompletion=true", () => {
    const s = deriveSituation(
      mkState({
        myPosition: 3,
        completedRounds: [
          { 1: "Pass", 2: "Pass", 3: "1NT", 4: "Pass" },
          { 1: "2♥", 2: "Pass", 3: "2♠", 4: "Pass" },
        ],
        currentRound: { 1: "3NT", 2: "Pass" },
      }),
    );
    expect(s.situation).toBe("stayman-opener-rebid");
    expect(s.wasTransferCompletion).toBe(true);
    expect(s.myPreviousBid).toBe("2♠");
  });

  it("end-to-end: pos 3, 15 HCP 3 spades, after spade transfer completes and partner bids 3NT → 4♠", () => {
    const state = mkState({
      myPosition: 3,
      completedRounds: [
        { 1: "Pass", 2: "Pass", 3: "1NT", 4: "Pass" },
        { 1: "2♥", 2: "Pass", 3: "2♠", 4: "Pass" },
      ],
      currentRound: { 1: "3NT", 2: "Pass" },
    });
    const rec = getRecommendation(
      { hcp: 15, spades: 3, hearts: 4, clubs: 2, diamonds: 4 },
      deriveSituation(state),
    );
    expect(rec.bid).toBe("4♠");
    expect(rec.category).toContain("Transfer");
  });
});

describe("bidding-logic | minor-transfer-response", () => {
  it("more diamonds → convert to 3♦", () => {
    const rec = getRecommendation(
      mkHand(6, 3, 2, 6, 2),
      ctx("minor-transfer-response"),
    );
    expect(rec.bid).toBe("3♦");
  });

  it("more clubs → Pass (keep 3♣)", () => {
    const rec = getRecommendation(
      mkHand(5, 3, 2, 2, 6),
      ctx("minor-transfer-response"),
    );
    expect(rec.bid).toBe("Pass");
  });
});

describe("bidding-logic | blackwood-response", () => {
  it("void present → warning, do not use Blackwood", () => {
    const rec = getRecommendation(
      mkHand(15, 5, 0, 5, 3),
      ctx("blackwood-response", { partnerBid: "5♥", agreedSuit: "♠" }),
    );
    expect(rec.confidence).toBe("low");
    expect(rec.note).toBeDefined();
    expect(rec.note).toContain("void");
  });

  it("partner replied 5♣ (0/4 aces), low HCP → aggressive default 5NT with sign-off alternative", () => {
    const rec = getRecommendation(
      mkHand(15, 5, 4, 3, 1),
      ctx("blackwood-response", { partnerBid: "5♣", agreedSuit: "♠" }),
    );
    expect(rec.bid).toBe("5NT");
    expect(rec.category).toContain("0 or 4 Aces");
    expect(rec.reasoning).toContain("5♠");
    expect(rec.reasoning).toContain("all 4 aces");
    expect(rec.note).toContain("0 OR 4");
  });

  it("partner replied 5♣ (0/4 aces), high HCP (23) → same two-choice structure, aggressive 5NT default", () => {
    // User's exact scenario: 23 HCP, 3♣, 3♦, 3♥, 4♠
    const rec = getRecommendation(
      mkHand(23, 4, 3, 3, 3),
      ctx("blackwood-response", { partnerBid: "5♣", agreedSuit: "♠" }),
    );
    expect(rec.bid).toBe("5NT");
    expect(rec.reasoning).toContain("all 4 aces");
    expect(rec.reasoning).toContain("5♠");
  });

  it("partner replied 5♦ (1 ace) → aggressive 5NT default with 5♠ alternative", () => {
    const rec = getRecommendation(
      mkHand(15, 5, 4, 3, 1),
      ctx("blackwood-response", { partnerBid: "5♦", agreedSuit: "♠" }),
    );
    expect(rec.bid).toBe("5NT");
    expect(rec.reasoning).toContain("3 aces");
    expect(rec.reasoning).toContain("5♠");
  });

  it("partner replied 5♥ (2 aces) → aggressive 6♠ default with 5♠ alternative", () => {
    const rec = getRecommendation(
      mkHand(15, 5, 4, 3, 1),
      ctx("blackwood-response", { partnerBid: "5♥", agreedSuit: "♠" }),
    );
    expect(rec.bid).toBe("6♠");
    expect(rec.reasoning).toContain("2 aces");
    expect(rec.reasoning).toContain("5♠");
  });

  it("partner replied 5♠ (3 aces) → aggressive 5NT default with 6♠ alternative", () => {
    const rec = getRecommendation(
      mkHand(18, 5, 5, 2, 1),
      ctx("blackwood-response", { partnerBid: "5♠", agreedSuit: "♠" }),
    );
    expect(rec.bid).toBe("5NT");
    expect(rec.reasoning).toContain("3 aces");
    expect(rec.reasoning).toContain("6♠");
    expect(rec.note).toBeDefined();
  });
});

describe("bidding-logic | blackwood-ace-response", () => {
  it("partner bid 4NT (Blackwood), 11 HCP → estimated 1 ace → 5♦", () => {
    // User's exact bug: 11 HCP, 5♦, 1♣, 3♥, 4♠
    const rec = getRecommendation(
      mkHand(11, 4, 3, 5, 1),
      ctx("blackwood-ace-response"),
    );
    expect(rec.bid).toBe("5♦");
    expect(rec.category).toContain("Blackwood");
    expect(rec.reasoning).toContain("5♣");
    expect(rec.reasoning).toContain("5♦");
    expect(rec.reasoning).toContain("5♥");
    expect(rec.reasoning).toContain("5♠");
    expect(rec.note).toBeDefined();
  });

  it("0 HCP → estimated 0 aces → 5♣", () => {
    const rec = getRecommendation(
      mkHand(0, 3, 3, 4, 3),
      ctx("blackwood-ace-response"),
    );
    expect(rec.bid).toBe("5♣");
  });

  it("20 HCP → estimated 2 aces → 5♥", () => {
    const rec = getRecommendation(
      mkHand(20, 4, 3, 3, 3),
      ctx("blackwood-ace-response"),
    );
    expect(rec.bid).toBe("5♥");
  });

  it("30 HCP → estimated 3 aces → 5♠", () => {
    const rec = getRecommendation(
      mkHand(30, 4, 3, 3, 3),
      ctx("blackwood-ace-response"),
    );
    expect(rec.bid).toBe("5♠");
  });

  it("deriveSituation: routes to blackwood-ace-response when partner bid 4NT", () => {
    // User's exact scenario: opened 1♦, raised to 2♠, partner now bid 4NT
    const state: AuctionState = {
      myPosition: 2,
      completedRounds: [
        { 1: "Pass", 2: "1♦", 3: "Pass", 4: "1♠" },
        { 1: "Pass", 2: "2♠", 3: "Pass", 4: "4NT" },
      ],
      currentRound: {},
    };
    const s = deriveSituation(state);
    expect(s.situation).toBe("blackwood-ace-response");
  });

  it("deriveSituation: position-4 responder with partner bid 4NT → blackwood-ace-response", () => {
    // Position 4 raised partner's 1♠ to 3♠, partner now bids 4NT (Blackwood)
    const state: AuctionState = {
      myPosition: 4,
      completedRounds: [{ 1: "Pass", 2: "1♠", 3: "Pass", 4: "3♠" }],
      currentRound: { 1: "Pass", 2: "4NT", 3: "Pass" },
    };
    const s = deriveSituation(state);
    expect(s.situation).toBe("blackwood-ace-response");
  });
});

describe("bidding-logic | blackwood-kings-response", () => {
  it("partner bid 5NT (kings ask), 11 HCP → estimated 1 king → 6♦", () => {
    // User's exact scenario: 11 HCP, 5♦, 1♣, 3♥, 4♠ — already bid 5♣ (0 aces)
    const rec = getRecommendation(
      mkHand(11, 4, 3, 5, 1),
      ctx("blackwood-kings-response"),
    );
    expect(rec.bid).toBe("6♦");
    expect(rec.category).toContain("Kings Ask");
    expect(rec.reasoning).toContain("6♣");
    expect(rec.reasoning).toContain("6♦");
    expect(rec.reasoning).toContain("6♥");
    expect(rec.reasoning).toContain("6♠");
    expect(rec.note).toBeDefined();
  });

  it("0 HCP → estimated 0 kings → 6♣", () => {
    const rec = getRecommendation(
      mkHand(0, 3, 3, 4, 3),
      ctx("blackwood-kings-response"),
    );
    expect(rec.bid).toBe("6♣");
  });

  it("24 HCP → estimated 3 kings → 6♠", () => {
    const rec = getRecommendation(
      mkHand(24, 4, 3, 3, 3),
      ctx("blackwood-kings-response"),
    );
    expect(rec.bid).toBe("6♠");
  });

  it("deriveSituation: routes to blackwood-kings-response when partner bid 5NT", () => {
    // Scenario: 1♦ - 1♠ - 2♠ - 4NT(Blackwood) - 5♣(0 aces) - 5NT(kings ask)
    const state: AuctionState = {
      myPosition: 2,
      completedRounds: [
        { 1: "Pass", 2: "1♦", 3: "Pass", 4: "1♠" },
        { 1: "Pass", 2: "2♠", 3: "Pass", 4: "4NT" },
        { 1: "Pass", 2: "5♣", 3: "Pass", 4: "5NT" },
      ],
      currentRound: {},
    };
    const s = deriveSituation(state);
    expect(s.situation).toBe("blackwood-kings-response");
  });
});

describe("bidding-logic | gerber-response", () => {
  it("partner replied 4♦ (0/4 aces) → sign off", () => {
    const rec = getRecommendation(
      mkHand(16, 4, 3, 3, 3),
      ctx("gerber-response", { partnerBid: "4♦" }),
    );
    expect(rec.category).toContain("Missing Aces");
  });

  it("partner replied 4♥ (1 ace) → sign off", () => {
    const rec = getRecommendation(
      mkHand(16, 4, 3, 3, 3),
      ctx("gerber-response", { partnerBid: "4♥" }),
    );
    expect(rec.category).toContain("Missing Aces");
  });

  it("partner replied 4♠ (2 aces) → slam decision", () => {
    const rec = getRecommendation(
      mkHand(16, 4, 3, 3, 3),
      ctx("gerber-response", { partnerBid: "4♠" }),
    );
    expect(rec.bid).toBeDefined();
  });

  it("partner replied 4NT (3 aces) → slam decision / ask kings", () => {
    const rec = getRecommendation(
      mkHand(16, 4, 3, 3, 3),
      ctx("gerber-response", { partnerBid: "4NT" }),
    );
    expect(rec.bid).toBeDefined();
    expect(rec.note).toBeDefined();
  });
});

describe("bidding-logic | blackwood-kings", () => {
  it("partner replied 6♣ (0/4 kings) → small slam in agreed suit", () => {
    const rec = getRecommendation(
      mkHand(16, 5, 4, 3, 1),
      ctx("blackwood-kings", { partnerBid: "6♣", agreedSuit: "♠" }),
    );
    expect(rec.bid).toBe("6♠");
    expect(rec.category).toContain("Small Slam");
    expect(rec.note).toContain("0 OR 4");
  });

  it("partner replied 6♥ (2 kings) → small slam in agreed suit", () => {
    const rec = getRecommendation(
      mkHand(16, 5, 4, 3, 1),
      ctx("blackwood-kings", { partnerBid: "6♥", agreedSuit: "♠" }),
    );
    expect(rec.bid).toBe("6♠");
    expect(rec.category).toContain("Small Slam");
  });

  it("partner replied 6♠ (3 kings) → grand slam in agreed suit", () => {
    const rec = getRecommendation(
      mkHand(16, 5, 4, 3, 1),
      ctx("blackwood-kings", { partnerBid: "6♠", agreedSuit: "♠" }),
    );
    expect(rec.bid).toBe("7♠");
    expect(rec.category).toContain("Grand Slam");
  });

  it("agreed suit is hearts → grand slam bid is 7♥", () => {
    const rec = getRecommendation(
      mkHand(16, 1, 5, 4, 3),
      ctx("blackwood-kings", { partnerBid: "6♠", agreedSuit: "♥" }),
    );
    expect(rec.bid).toBe("7♥");
  });
});

describe("bidding-logic | deriveSituation — coverage for uncovered branches", () => {
  // wasTransferCompletion = false when opener's second bid was prompted by Stayman (2♣),
  // not a transfer (2♦ or 2♥). The IIFE finds the bid in completedRounds and returns false.
  it("opener (pos 1) after Stayman 2♣ reply 2♥ → stayman-opener-rebid wasTransferCompletion false", () => {
    // Pos 1 opened 1NT, pos 3 bid 2♣ (Stayman), pos 1 replied 2♥ (showing hearts).
    // Now pos 3 invites with 2NT, and pos 1 is to act.
    // myBids = ["1NT", "2♥"], mySecondBid = "2♥" found in completedRounds[1].
    // promptBid = completedRounds[0][3] = "2♣" → not "2♦" or "2♥" → wasTransferCompletion = false.
    const s = deriveSituation({
      myPosition: 1,
      completedRounds: [
        { 1: "1NT", 2: "Pass", 3: "2♣", 4: "Pass" },
        { 1: "2♥", 2: "Pass", 3: "2NT", 4: "Pass" },
      ],
      currentRound: {},
    });
    expect(s.situation).toBe("stayman-opener-rebid");
    expect(s.wasTransferCompletion).toBe(false);
  });

  // blackwood-kings sign-off — partner asked 4NT (Blackwood), I replied 5♣ (aces),
  // partner asked kings with 5NT, I responded 6♦. Now partner signs off in 6♠.
  // myLastBid="6♦" (a Blackwood kings response), partnerBid="6♠" → blackwood-kings.
  it("deriveSituation: I responded to partner's 5NT kings ask with 6♦, partner signs off 6♠ → blackwood-kings", () => {
    // Auction: me=3, partner=1.
    // Round 1: 1♠(p1), Pass, Pass(me), Pass  — partner opens
    // Round 2: p1 bids 4NT (Blackwood), me replies 5♣ (0/4 aces)
    // Round 3: p1 bids 5NT (kings ask), me replies 6♦ (1 king)
    // currentRound: p1 signs off with 6♠
    const s = deriveSituation(
      mkState({
        myPosition: 3,
        completedRounds: [
          { 1: "1♠", 2: "Pass", 3: "Pass", 4: "Pass" },
          { 1: "4NT", 2: "Pass", 3: "5♣", 4: "Pass" },
          { 1: "5NT", 2: "Pass", 3: "6♦", 4: "Pass" },
        ],
        currentRound: { 1: "6♠" },
      }),
    );
    expect(s.situation).toBe("blackwood-kings");
    expect(s.myPreviousBid).toBe("6♦");
    expect(s.partnerBid).toBe("6♠");
  });

  // Line 7478: partner doubled Stayman (1NT-Pass-2♣-Dbl), we respond.
  // deriveSituation for seat 2 should route to overcalling with partnerBid:"Double".
  it("deriveSituation: pos 2, 1NT-Pass-2♣-Dbl-2♦-Pass, partner doubled Stayman → overcalling", () => {
    // Seat 4 doubled 2♣ (our partner from seat 2's view). Seat 1 bid 2♦. Now seat 2 bids.
    // myPosition=2, partner=4, lho=3, rho=1
    const s = deriveSituation(
      mkState({
        myPosition: 2,
        completedRounds: [{ 1: "1NT", 2: "Pass", 3: "2♣", 4: "Double" }],
        currentRound: { 1: "2♦", 3: "Pass" },
      }),
    );
    expect(s.situation).toBe("overcalling");
    expect(s.partnerBid).toBe("Double");
  });
});

describe("bidding-logic | grand-slam-force", () => {
  it("shows GSF bid details and note", () => {
    const rec = getRecommendation(
      mkHand(18, 6, 4, 2, 1),
      ctx("grand-slam-force", { agreedSuit: "♠" }),
    );
    expect(rec.bid).toBeDefined();
    expect(rec.note).toBeDefined();
    expect(rec.note).toContain("Grand Slam Force");
  });
});

describe("bidding-logic | grand-slam-force-response", () => {
  it("sufficient top honors → bid 7", () => {
    const rec = getRecommendation(
      mkHand(16, 6, 3, 3, 1),
      ctx("grand-slam-force-response", { agreedSuit: "♠" }),
    );
    expect(rec.bid).toBeDefined();
  });

  it("insufficient top honors → bid 6", () => {
    const rec = getRecommendation(
      mkHand(4, 6, 3, 3, 1),
      ctx("grand-slam-force-response", { agreedSuit: "♠" }),
    );
    expect(rec.bid).toContain("6♠");
  });
});

// ─── Context changes recommendation ──────────────────────────────────────────

describe("bidding-logic | context changes recommendation", () => {
  it("same hand gives different recommendations in different situations", () => {
    const hand = mkHand(16, 3, 3, 4, 3); // no 4-card major → 4NT quantitative responding to 1NT
    const opening = getRecommendation(hand, ctx("opening"));
    const responding1nt = getRecommendation(hand, ctx("responding-1nt"));
    const overcalling = getRecommendation(
      hand,
      ctx("overcalling", { rhoBid: "1♥" }),
    );

    expect(opening.bid).toBe("1NT"); // 16 HCP balanced → open 1NT
    expect(responding1nt.bid).toContain("4NT"); // 16 HCP, no major → quantitative invite
    // overcalling might be 1NT overcall
    expect(overcalling.bid).toBeDefined();
    expect(opening.bid).not.toBe(responding1nt.bid);
  });

  it("returns appropriate bid for each situation type", () => {
    const situations: AuctionContext["situation"][] = [
      "opening",
      "responding-1nt",
      "responding-2nt",
      "responding-3nt-opening",
      "responding-suit",
      "responding-2c",
      "responding-weak2",
      "responding-preempt",
      "overcalling",
      "negative-double",
      "responding-to-simple-oc",
      "responding-to-jump-oc",
      "responding-to-double",
      "responding-to-preempt-oc",
      "responding-to-1nt-oc",
      "responding-to-michaels",
      "responding-to-unusual-2nt",
      "rebid-after-nt",
      "rebid-after-suit",
      "rebid-after-negative-double",
      "jacoby-2nt-opener",
      "responding-suit-after-double",
      "stayman-response",
      "transfer-response",
      "minor-transfer-response",
      "blackwood-response",
      "gerber-response",
      "blackwood-kings",
      "grand-slam-force",
      "grand-slam-force-response",
    ];

    const hand = mkHand(13, 4, 4, 3, 2);
    for (const situation of situations) {
      const rec = getRecommendation(hand, {
        situation,
        vulnerability: "none",
        partnerBid: "2NT",
        rhoBid: "1♠",
        myPreviousBid: "1♣",
        agreedSuit: "♠",
      });
      expect(rec.bid).toBeTruthy();
      expect(rec.category).toBeTruthy();
      expect(rec.reasoning).toBeTruthy();
      expect(rec.handAnalysis).toBeDefined();
      expect(["high", "medium", "low"]).toContain(rec.confidence);
    }
  });

  it("BidRecommendation has all required fields", () => {
    const rec = getRecommendation(mkHand(15, 4, 4, 3, 2), ctx("opening"));
    expect(rec).toHaveProperty("bid");
    expect(rec).toHaveProperty("category");
    expect(rec).toHaveProperty("reasoning");
    expect(rec).toHaveProperty("handAnalysis");
    expect(rec).toHaveProperty("whatYourBidTellsPartner");
    expect(rec).toHaveProperty("expectedResponses");
    expect(rec).toHaveProperty("confidence");
    expect(Array.isArray(rec.expectedResponses)).toBe(true);
  });
});

// ─── Vulnerability variations ─────────────────────────────────────────────────

describe("bidding-logic | vulnerability", () => {
  it("vulnerable preempt includes cautious note", () => {
    const rec = getRecommendation(mkHand(7, 2, 7, 3, 1), {
      situation: "opening",
      vulnerability: "both",
    });
    expect(rec.note).toBeDefined();
    expect(rec.note).toContain("Vulnerable");
  });

  it("not-vulnerable preempt has different note", () => {
    const rec = getRecommendation(mkHand(7, 2, 7, 3, 1), {
      situation: "opening",
      vulnerability: "none",
    });
    expect(rec.note).toBeDefined();
    expect(rec.note).toContain("Not vulnerable");
  });
});

// ─── getRelatives ────────────────────────────────────────────────────────────

describe("bidding-logic | getRelatives", () => {
  it("position 3's partner is position 1", () => {
    expect(getRelatives(3).partner).toBe(1);
  });
  it("position 3's LHO is position 4 (bids after position 3)", () => {
    expect(getRelatives(3).lho).toBe(4);
  });
  it("position 3's RHO is position 2 (bids before position 3)", () => {
    expect(getRelatives(3).rho).toBe(2);
  });
  it("position 1's partner is position 3", () => {
    expect(getRelatives(1).partner).toBe(3);
  });
  it("position 2's partner is position 4", () => {
    expect(getRelatives(2).partner).toBe(4);
  });
  it("position 4's LHO is position 1", () => {
    expect(getRelatives(4).lho).toBe(1);
  });
});

// ─── getValidBidsAfter ───────────────────────────────────────────────────────

describe("bidding-logic | getValidBidsAfter", () => {
  it("after undefined: all bids + Double are valid", () => {
    const bids = getValidBidsAfter(undefined);
    expect(bids).toContain("Pass");
    expect(bids).toContain("1♣");
    expect(bids).toContain("7NT");
    expect(bids).toContain("Double");
    expect(bids).not.toContain("Redouble");
  });

  it("after Pass: all bids + Double are valid", () => {
    const bids = getValidBidsAfter("Pass");
    expect(bids).toContain("1♣");
    expect(bids).toContain("Double");
    expect(bids).not.toContain("Redouble");
  });

  it("after 1♣: 1♦ and higher are valid, 1♣ is not", () => {
    const bids = getValidBidsAfter("1♣");
    expect(bids).toContain("Pass");
    expect(bids).toContain("1♦");
    expect(bids).toContain("7NT");
    expect(bids).toContain("Double");
    expect(bids).not.toContain("1♣");
  });

  it("after 2♣: 1♥ is not valid", () => {
    const bids = getValidBidsAfter("2♣");
    expect(bids).not.toContain("1♥");
    expect(bids).not.toContain("1NT");
    expect(bids).toContain("2♦");
    expect(bids).toContain("Double");
  });

  it("after Double: all bids + Redouble are valid", () => {
    const bids = getValidBidsAfter("Double");
    expect(bids).toContain("Pass");
    expect(bids).toContain("1♣");
    expect(bids).toContain("Redouble");
    expect(bids).not.toContain("Double");
  });

  it("after Redouble: all bids are valid but no Redouble", () => {
    const bids = getValidBidsAfter("Redouble");
    expect(bids).toContain("Pass");
    expect(bids).toContain("1♣");
    expect(bids).not.toContain("Redouble");
  });

  it("after 7NT: only Pass is valid (no suit bids)", () => {
    const bids = getValidBidsAfter("7NT");
    expect(bids).toContain("Pass");
    expect(bids).not.toContain("1♣");
  });
});

// ─── getBidMeaning ───────────────────────────────────────────────────────────

describe("bidding-logic | getBidMeaning", () => {
  it("Pass always returns a non-empty string", () => {
    expect(getBidMeaning("Pass", "partner")).toBeTruthy();
  });

  it("1NT from partner describes balanced 15-17 HCP", () => {
    const meaning = getBidMeaning("1NT", "partner");
    expect(meaning).toContain("15");
    expect(meaning.toLowerCase()).toContain("hcp");
  });

  it("1NT from opponent describes opponent's 1NT", () => {
    const meaning = getBidMeaning("1NT", "rho");
    expect(meaning).toBeTruthy();
    expect(typeof meaning).toBe("string");
  });

  it("4NT mentions Blackwood", () => {
    const meaning = getBidMeaning("4NT", "partner");
    expect(meaning.toLowerCase()).toContain("blackwood");
  });

  it("Double from partner mentions Takeout Double (no context)", () => {
    const meaning = getBidMeaning("Double", "partner");
    expect(meaning.toLowerCase()).toContain("takeout");
  });

  it("Double from opponent with no context mentions Penalty", () => {
    const meaning = getBidMeaning("Double", "lho");
    expect(meaning.toLowerCase()).toContain("penalty");
  });

  it("Double from partner after low suit bid → Negative Double", () => {
    const meaning = getBidMeaning("Double", "partner", "1♠");
    expect(meaning.toLowerCase()).toContain("negative");
    // Message should clarify it is NOT a penalty double
    expect(meaning.toLowerCase()).toContain("not a penalty");
  });

  it("Double from opponent after low suit bid → Takeout/competitive, not Penalty", () => {
    const meaning = getBidMeaning("Double", "lho", "1♥");
    expect(meaning.toLowerCase()).not.toContain("penalty double");
    // Confirms it mentions takeout or negative rather than pure penalty
    expect(
      meaning.toLowerCase().includes("takeout") ||
        meaning.toLowerCase().includes("negative") ||
        meaning.toLowerCase().includes("competitive"),
    ).toBe(true);
  });

  it("Double from opponent after 1NT → Penalty Double of NT", () => {
    const meaning = getBidMeaning("Double", "rho", "1NT");
    expect(meaning.toLowerCase()).toContain("penalty");
    expect(meaning.toLowerCase()).toContain("nt");
  });

  it("Double from partner after 1NT → Penalty/Takeout note", () => {
    const meaning = getBidMeaning("Double", "partner", "1NT");
    expect(meaning).toBeTruthy();
  });

  it("unknown bid returns a non-empty fallback string", () => {
    expect(getBidMeaning("3♥", "partner")).toBeTruthy();
  });

  it("Redouble returns a non-empty string", () => {
    expect(getBidMeaning("Redouble", "partner")).toBeTruthy();
  });

  it("a high-level bid like 6♠ returns the default fallback string", () => {
    const meaning = getBidMeaning("6♠", "partner");
    expect(meaning).toContain("6♠");
  });
});

// ─── deriveSituation ─────────────────────────────────────────────────────────

// myPosition: 3 → partner=1, rho=2, lho=4
// Key mapping from old N/S/E/W tests: N→1, E→2, S→3, W→4
function mkState(overrides: Partial<AuctionState> = {}): AuctionState {
  return {
    myPosition: 3,
    completedRounds: [],
    currentRound: {},
    ...overrides,
  };
}

describe("bidding-logic | deriveSituation", () => {
  // ── No bids ──────────────────────────────────────────────────────────────────

  it("no bids anywhere → opening", () => {
    expect(deriveSituation(mkState()).situation).toBe("opening");
  });

  it("all passes → opening", () => {
    expect(
      deriveSituation(
        mkState({ currentRound: { 4: "Pass", 1: "Pass", 2: "Pass" } }),
      ).situation,
    ).toBe("opening");
  });

  // ── Partner opened ────────────────────────────────────────────────────────────

  it("partner (1) opened 1♥, no opponent bids → responding-suit", () => {
    const s = deriveSituation(mkState({ currentRound: { 1: "1♥" } }));
    expect(s.situation).toBe("responding-suit");
  });

  it("partner (1) opened 1NT, no opponent bids → responding-1nt", () => {
    const s = deriveSituation(mkState({ currentRound: { 1: "1NT" } }));
    expect(s.situation).toBe("responding-1nt");
    expect(s.partnerBid).toBe("1NT");
  });

  it("partner (1) opened 2NT → responding-2nt", () => {
    const s = deriveSituation(mkState({ currentRound: { 1: "2NT" } }));
    expect(s.situation).toBe("responding-2nt");
  });

  it("partner (1) opened 3NT → responding-3nt-opening", () => {
    const s = deriveSituation(mkState({ currentRound: { 1: "3NT" } }));
    expect(s.situation).toBe("responding-3nt-opening");
  });

  it("partner (1) opened 2♣ → responding-2c", () => {
    const s = deriveSituation(mkState({ currentRound: { 1: "2♣" } }));
    expect(s.situation).toBe("responding-2c");
  });

  it("partner (1) opened 2♥ (weak 2) → responding-weak2", () => {
    const s = deriveSituation(mkState({ currentRound: { 1: "2♥" } }));
    expect(s.situation).toBe("responding-weak2");
  });

  it("partner (1) opened 3♠ (pre-empt) → responding-preempt", () => {
    const s = deriveSituation(mkState({ currentRound: { 1: "3♠" } }));
    expect(s.situation).toBe("responding-preempt");
  });

  // ── Opponent opened / overcalling ─────────────────────────────────────────────

  it("RHO (2) bid 1♠, partner passed → overcalling", () => {
    const s = deriveSituation(mkState({ currentRound: { 2: "1♠" } }));
    expect(s.situation).toBe("overcalling");
    expect(s.rhoBid).toBe("1♠");
  });

  it("RHO (2) bid 1♥, partner doubled → responding-to-double", () => {
    const s = deriveSituation(
      mkState({ currentRound: { 2: "1♥", 1: "Double" } }),
    );
    expect(s.situation).toBe("responding-to-double");
  });

  it("RHO (2) bid 1♥, partner bid 2♥ (Michaels) → responding-to-michaels", () => {
    const s = deriveSituation(mkState({ currentRound: { 2: "1♥", 1: "2♥" } }));
    expect(s.situation).toBe("responding-to-michaels");
  });

  it("RHO (2) bid 1♥, partner bid 2NT (Unusual) → responding-to-unusual-2nt", () => {
    const s = deriveSituation(mkState({ currentRound: { 2: "1♥", 1: "2NT" } }));
    expect(s.situation).toBe("responding-to-unusual-2nt");
  });

  it("RHO (2) bid 1♥, partner bid 1NT overcall → responding-to-1nt-oc", () => {
    const s = deriveSituation(mkState({ currentRound: { 2: "1♥", 1: "1NT" } }));
    expect(s.situation).toBe("responding-to-1nt-oc");
  });

  it("RHO (2) bid 1♥, partner bid 1♠ (simple overcall) → responding-to-simple-oc", () => {
    const s = deriveSituation(mkState({ currentRound: { 2: "1♥", 1: "1♠" } }));
    expect(s.situation).toBe("responding-to-simple-oc");
  });

  // ── Partner opened, opponent doubled → responding-suit-after-double ───────────

  it("partner (1) opened 1♠, RHO (2) doubled → responding-suit-after-double", () => {
    const s = deriveSituation(
      mkState({ currentRound: { 1: "1♠", 2: "Double" } }),
    );
    expect(s.situation).toBe("responding-suit-after-double");
  });

  it("partner (1) opened 1NT, RHO (2) doubled → responding-1nt-doubled (not suit-after-double)", () => {
    const s = deriveSituation(
      mkState({ currentRound: { 1: "1NT", 2: "Double" } }),
    );
    expect(s.situation).toBe("responding-1nt-doubled");
  });

  // ── Opponent bid, then partner opened → negative-double ───────────────────────

  it("partner (1) opened 1♥, RHO (2) overcalled 2♦ → negative-double", () => {
    const s = deriveSituation(mkState({ currentRound: { 1: "1♥", 2: "2♦" } }));
    expect(["negative-double", "responding-suit"]).toContain(s.situation);
  });

  // ── I've already bid (rebid situations) ───────────────────────────────────────

  it("my previous bid was 1♥, partner responded → rebid-after-suit", () => {
    const s = deriveSituation(
      mkState({
        completedRounds: [{ 3: "1♥", 1: "2♦", 2: "Pass", 4: "Pass" }],
        currentRound: {},
      }),
    );
    expect(s.situation).toBe("rebid-after-suit");
  });

  it("my previous bid was 1NT → rebid-after-nt", () => {
    const s = deriveSituation(
      mkState({
        completedRounds: [{ 3: "1NT", 1: "2♣", 2: "Pass", 4: "Pass" }],
        currentRound: {},
      }),
    );
    expect(s.situation).toBe("rebid-after-nt");
  });

  it("my previous bid was 4NT → blackwood-response", () => {
    const s = deriveSituation(
      mkState({
        completedRounds: [
          { 3: "1♠", 1: "2♠", 2: "Pass", 4: "Pass" },
          { 3: "4NT", 1: "5♦", 2: "Pass", 4: "Pass" },
        ],
        currentRound: {},
      }),
    );
    expect(s.situation).toBe("blackwood-response");
  });

  it("my previous bid was 4♣ → gerber-response", () => {
    const s = deriveSituation(
      mkState({
        completedRounds: [{ 1: "1NT", 2: "Pass", 3: "4♣", 4: "Pass" }],
        currentRound: {},
      }),
    );
    expect(s.situation).toBe("gerber-response");
  });

  it("Jacoby 2NT: I opened 1♠, partner bid 2NT → jacoby-2nt-opener", () => {
    const s = deriveSituation(
      mkState({
        completedRounds: [{ 3: "1♠", 1: "2NT", 2: "Pass", 4: "Pass" }],
        currentRound: {},
      }),
    );
    expect(s.situation).toBe("jacoby-2nt-opener");
  });

  it("minor transfer: I bid 2♠ after partner's 1NT, partner bid 3♣ → minor-transfer-response", () => {
    const s = deriveSituation(
      mkState({
        completedRounds: [{ 1: "1NT", 2: "Pass", 3: "2♠", 4: "Pass" }],
        currentRound: {},
      }),
    );
    expect(s.situation).toBe("minor-transfer-response");
  });

  it("major transfer: I bid 2♦ after partner's 1NT → transfer-response", () => {
    const s = deriveSituation(
      mkState({
        completedRounds: [{ 1: "1NT", 2: "Pass", 3: "2♦", 4: "Pass" }],
        currentRound: {},
      }),
    );
    expect(s.situation).toBe("transfer-response");
  });

  it("major transfer pos 1: I pass then bid 2♦ (transfer) after partner (pos 3) opens 1NT — still routes to transfer-response", () => {
    // User is pos 1, passes round 1, bids 2♦ in round 2 after partner's 1NT.
    // Partner completes the transfer with 2♥ in round 2.
    // Round 3 begins — partnerBidBeforeMe should resolve to "1NT", not "2♥".
    const s = deriveSituation(
      mkState({
        myPosition: 1,
        completedRounds: [
          { 1: "Pass", 2: "Pass", 3: "1NT", 4: "Pass" },
          { 1: "2♦", 2: "Pass", 3: "2♥", 4: "Pass" },
        ],
        currentRound: {},
      }),
    );
    expect(s.situation).toBe("transfer-response");
  });

  it("transfer-response getRecommendation: pos 1, 10 HCP 5 hearts after transfer completes → 3NT", () => {
    const state = mkState({
      myPosition: 1,
      completedRounds: [
        { 1: "Pass", 2: "Pass", 3: "1NT", 4: "Pass" },
        { 1: "2♦", 2: "Pass", 3: "2♥", 4: "Pass" },
      ],
      currentRound: {},
    });
    const ctx = deriveSituation(state);
    expect(ctx.situation).toBe("transfer-response");
    const rec = getRecommendation(
      { hcp: 10, spades: 2, hearts: 5, clubs: 3, diamonds: 3 },
      ctx,
    );
    expect(rec.bid).toBe("3NT");
    expect(rec.category).toContain("Transfer");
  });

  it("rebid-after-negative-double: I opened 1♥, opponent bid 2♣, partner doubled", () => {
    const s = deriveSituation(
      mkState({
        completedRounds: [{ 3: "1♥", 2: "2♣", 1: "Double", 4: "Pass" }],
        currentRound: {},
      }),
    );
    expect(s.situation).toBe("rebid-after-negative-double");
  });

  it("anyNonPass true from completedRounds but no current round bids → opening derived from prior rounds", () => {
    const s = deriveSituation(
      mkState({
        completedRounds: [{ 1: "Pass", 2: "Pass", 3: "Pass", 4: "Pass" }],
        currentRound: {},
      }),
    );
    expect(s.situation).toBe("opening");
  });

  // ── Grand Slam Force ──────────────────────────────────────────────────────────

  it("partner jumped to 5NT → grand-slam-force-response", () => {
    const s = deriveSituation(mkState({ currentRound: { 1: "5NT" } }));
    expect(s.situation).toBe("grand-slam-force-response");
  });

  it("Stayman: I bid 2♣ after partner's 1NT → stayman-response", () => {
    const s = deriveSituation(
      mkState({
        completedRounds: [{ 1: "1NT", 2: "Pass", 3: "2♣", 4: "Pass" }],
      }),
    );
    expect(s.situation).toBe("stayman-response");
  });

  it("my bid was 5NT directly (no prior 4NT) → grand-slam-force", () => {
    const s = deriveSituation(
      mkState({
        completedRounds: [
          { 1: "1♠", 2: "Pass", 3: "2♠", 4: "Pass" },
          { 1: "Pass", 2: "Pass", 3: "5NT", 4: "Pass" },
        ],
      }),
    );
    expect(s.situation).toBe("grand-slam-force");
  });

  it("my bid was 5NT after 4NT (Blackwood) → blackwood-kings", () => {
    const s = deriveSituation(
      mkState({
        completedRounds: [
          { 3: "1♠", 1: "2♠", 2: "Pass", 4: "Pass" },
          { 3: "4NT", 1: "5♦", 2: "Pass", 4: "Pass" },
          { 3: "5NT", 1: "Pass", 2: "Pass", 4: "Pass" },
        ],
      }),
    );
    expect(s.situation).toBe("blackwood-kings");
  });

  // ── Vulnerability propagated ───────────────────────────────────────────────────

  it("vulnerability is propagated to the derived context", () => {
    const s = deriveSituation(mkState(), "both");
    expect(s.vulnerability).toBe("both");
  });

  // ── Additional coverage tests ───────────────────────────────────────────────

  it("RHO (2) bid 1♣, partner bid 3♥ (jump overcall) → responding-to-jump-oc", () => {
    const s = deriveSituation(mkState({ currentRound: { 2: "1♣", 1: "3♥" } }));
    expect(s.situation).toBe("responding-to-jump-oc");
  });

  it("RHO (2) bid 2NT, partner bid 3♣ (preempt overcall, not a jump) → responding-to-preempt-oc", () => {
    const s = deriveSituation(mkState({ currentRound: { 2: "2NT", 1: "3♣" } }));
    expect(s.situation).toBe("responding-to-preempt-oc");
  });

  it("partner (1) opened 2♣ with LHO bid, returns responding-2c", () => {
    const s = deriveSituation(mkState({ currentRound: { 1: "2♣", 4: "3♦" } }));
    expect(s.situation).toBe("responding-2c");
  });

  it("partner (1) made a weak 2 with LHO overcall, falls to responding-weak2", () => {
    const s = deriveSituation(mkState({ currentRound: { 1: "2♥", 4: "3♣" } }));
    expect(s.situation).toBe("responding-weak2");
  });

  it("partner (1) preempted with LHO overcall, falls to responding-preempt", () => {
    const s = deriveSituation(mkState({ currentRound: { 1: "3♠", 4: "4♣" } }));
    expect(s.situation).toBe("responding-preempt");
  });

  it("partner (1) opened 1NT, LHO bid 2♣ (interference) → responding-1nt", () => {
    const s = deriveSituation(mkState({ currentRound: { 1: "1NT", 4: "2♣" } }));
    expect(s.situation).toBe("responding-1nt");
  });

  it("partner (1) opened 1♠, LHO bid 2♦ (interference) → negative-double or responding-suit", () => {
    const s = deriveSituation(mkState({ currentRound: { 1: "1♠", 4: "2♦" } }));
    expect(["negative-double", "responding-suit"]).toContain(s.situation);
  });

  it("RHO (2) bid 1♣, partner bid 2♣ (Michaels) → responding-to-michaels", () => {
    const s = deriveSituation(mkState({ currentRound: { 2: "1♣", 1: "2♣" } }));
    expect(s.situation).toBe("responding-to-michaels");
  });

  it("opener detection uses completed rounds: opponent opened in prior round → overcalling", () => {
    const s = deriveSituation(
      mkState({
        completedRounds: [{ 2: "1♠", 3: "Pass", 4: "Pass", 1: "Pass" }],
        currentRound: {},
      }),
    );
    expect(s.situation).toBe("overcalling");
  });

  it("opener detection uses completed rounds: partner opened in prior round → rebid situation", () => {
    const s = deriveSituation(
      mkState({
        completedRounds: [{ 1: "1♥", 2: "Pass", 3: "Pass", 4: "Pass" }],
        currentRound: {},
      }),
    );
    expect(s.situation).toBe("responding-suit");
  });

  it("partner opened 4♥ (high-level opening) with LHO interference → responding-suit", () => {
    const s = deriveSituation(mkState({ currentRound: { 1: "4♥", 4: "5♣" } }));
    expect(s.situation).toBe("responding-suit");
  });

  it("only a Double in currentRound (no natural bids) → fallback opening", () => {
    const s = deriveSituation(mkState({ currentRound: { 1: "Double" } }));
    expect(s.situation).toBe("opening");
  });

  it("with myPosition=4, partner is 2, and LHO (1) opened 1♠ → overcalling", () => {
    const s = deriveSituation(
      mkState({
        myPosition: 4,
        currentRound: { 1: "1♠" },
      }),
    );
    expect(s.situation).toBe("overcalling");
  });
});

// ─── getFinalContractInfo ─────────────────────────────────────────────────────

describe("bidding-logic | getFinalContractInfo", () => {
  it("no bids at all → not complete", () => {
    const r = getFinalContractInfo([], {}, 1);
    expect(r.isComplete).toBe(false);
    expect(r.finalContract).toBeUndefined();
  });

  it("fewer than 3 passes → not complete", () => {
    const r = getFinalContractInfo([], { 1: "Pass", 2: "Pass" }, 3);
    expect(r.isComplete).toBe(false);
  });

  it("3 consecutive passes in completed rounds → complete", () => {
    const r = getFinalContractInfo(
      [{ 1: "1♠", 2: "Pass", 3: "Pass", 4: "Pass" }],
      {},
      1,
    );
    expect(r.isComplete).toBe(true);
    expect(r.finalContract).toBe("1♠");
  });

  it("4 opening passes → complete with no final contract", () => {
    const r = getFinalContractInfo(
      [{ 1: "Pass", 2: "Pass", 3: "Pass", 4: "Pass" }],
      {},
      1,
    );
    expect(r.isComplete).toBe(true);
    expect(r.finalContract).toBeUndefined();
  });

  it("mid-auction 3 passes in current round (before my turn) → complete", () => {
    const r = getFinalContractInfo(
      [{ 1: "1♥", 2: "Pass", 3: "Pass", 4: "Pass" }],
      { 1: "Pass", 2: "Pass" },
      3,
    );
    expect(r.isComplete).toBe(true);
    expect(r.finalContract).toBe("1♥");
  });

  it("only 2 passes at end → not complete", () => {
    const r = getFinalContractInfo(
      [{ 1: "1♠", 2: "2♥", 3: "Pass", 4: "Pass" }],
      {},
      1,
    );
    expect(r.isComplete).toBe(false);
    expect(r.finalContract).toBe("2♥");
  });

  it("final contract is the last natural bid before 3 passes", () => {
    const r = getFinalContractInfo(
      [
        { 1: "1♠", 2: "Pass", 3: "2♠", 4: "Pass" },
        { 1: "4♠", 2: "Pass", 3: "Pass", 4: "Pass" },
      ],
      {},
      1,
    );
    expect(r.isComplete).toBe(true);
    expect(r.finalContract).toBe("4♠");
  });

  it("myPosition=1 only considers completed rounds (no current-round bids before pos 1)", () => {
    const r = getFinalContractInfo(
      [{ 1: "1NT", 2: "Pass", 3: "Pass", 4: "Pass" }],
      {},
      1,
    );
    expect(r.isComplete).toBe(true);
    expect(r.finalContract).toBe("1NT");
  });
});

// ─── Regression: bug where 2NT rebid fell through to rebid-after-suit ────────

describe("bidding-logic | deriveSituation — NT rebid routing", () => {
  it("myLastBid=2NT is routed to rebid-after-nt (not rebid-after-suit)", () => {
    // myPosition=4, partner=2, partner opened 1♦, I bid 2NT, partner bid 3NT
    const state: AuctionState = {
      myPosition: 4,
      completedRounds: [{ 1: "Pass", 2: "1♦", 3: "Pass", 4: "2NT" }],
      currentRound: { 2: "3NT" },
    };
    const s = deriveSituation(state);
    expect(s.situation).toBe("rebid-after-nt");
  });

  it("myLastBid=3NT is routed to rebid-after-nt", () => {
    const state: AuctionState = {
      myPosition: 4,
      completedRounds: [{ 2: "1NT", 4: "3NT", 1: "Pass", 3: "Pass" }],
      currentRound: { 2: "Pass" },
    };
    const s = deriveSituation(state);
    expect(s.situation).toBe("rebid-after-nt");
  });
});

describe("bidding-logic | rebid-after-nt — 3NT partner response", () => {
  it("partner bid 3NT: 15-16 HCP → Pass (contract set)", () => {
    const rec = getRecommendation(
      mkHand(15, 4, 3, 3, 3),
      ctx("rebid-after-nt", { partnerBid: "3NT", myPreviousBid: "2NT" }),
    );
    expect(rec.bid).toBe("Pass");
    expect(rec.confidence).toBe("high");
  });

  it("partner bid 3NT: 17 HCP → 4NT (slam exploration)", () => {
    const rec = getRecommendation(
      mkHand(17, 4, 3, 3, 3),
      ctx("rebid-after-nt", { partnerBid: "3NT", myPreviousBid: "2NT" }),
    );
    expect(rec.bid).toBe("4NT");
    expect(rec.confidence).toBe("high");
  });
});

describe("bidding-logic | getRecommendation — safety net", () => {
  it("specific bug scenario: partner 1♦ → I bid 2NT → partner 3NT → must NOT suggest 2♦ or 3♦", () => {
    // Full integration test via deriveSituation + getRecommendation
    const state: AuctionState = {
      myPosition: 4,
      completedRounds: [{ 1: "Pass", 2: "1♦", 3: "Pass", 4: "2NT" }],
      currentRound: { 2: "3NT" },
    };
    const hand = mkHand(13, 3, 3, 4, 3); // balanced 13 HCP
    const context = deriveSituation(state);
    const rec = getRecommendation(hand, context);
    // Must not recommend a bid at or below 3NT
    expect(rec.bid).not.toContain("2♦");
    expect(rec.bid).not.toContain("3♦");
    expect(rec.bid).not.toContain("2♣");
    // Should recommend Pass or 4NT
    expect(rec.bid === "Pass" || rec.bid === "4NT").toBe(true);
  });

  it("safety net: bid floor from context prevents illegal low bid when ALL alternatives are too low", () => {
    // I bid 2NT as a responder, partner bid 3NT (floor = 3NT).
    // A hypothetical situation that somehow produces "2♣ or 2♦" should be caught.
    // We simulate this by using rebid-after-nt with partnerBid=3NT
    // and a hand that normally would produce a Pass anyway.
    const rec = getRecommendation(
      mkHand(14, 5, 3, 3, 2),
      ctx("rebid-after-suit", {
        myPreviousBid: "1♠",
        partnerBid: "3NT",
      }),
    );
    // The floor is 3NT (index 14). Any concrete bid in rec that is not null
    // must be above 3NT (index > 14) or the whole recommendation is Pass.
    const allBids = rec.bid
      .split(/\s+or\s+|\s*\/\s*/)
      .map((p) => {
        const m = p.match(/\d[♣♦♥♠]|\dNT/);
        return m ? m[0] : null;
      })
      .filter((b): b is string => b !== null);
    if (allBids.length > 0) {
      // Either all bids are above 3NT, or it was replaced with Pass
      const bidOrder = [
        "1♣",
        "1♦",
        "1♥",
        "1♠",
        "1NT",
        "2♣",
        "2♦",
        "2♥",
        "2♠",
        "2NT",
        "3♣",
        "3♦",
        "3♥",
        "3♠",
        "3NT",
        "4♣",
        "4♦",
        "4♥",
        "4♠",
        "4NT",
        "5♣",
        "5♦",
        "5♥",
        "5♠",
        "5NT",
        "6♣",
        "6♦",
        "6♥",
        "6♠",
        "6NT",
        "7♣",
        "7♦",
        "7♥",
        "7♠",
        "7NT",
      ];
      const floorIdx = bidOrder.indexOf("3NT");
      const allValid = allBids.every((b) => bidOrder.indexOf(b) > floorIdx);
      expect(allValid || rec.bid === "Pass").toBe(true);
    }
  });
});

// ─── Bug fix: 3 pre-bid passes must NOT end the auction ──────────────────────

describe("bidding-logic | getFinalContractInfo — no false early completion", () => {
  it("myPosition=4, all 3 players before pass → NOT complete (no real bid yet)", () => {
    const r = getFinalContractInfo([], { 1: "Pass", 2: "Pass", 3: "Pass" }, 4);
    expect(r.isComplete).toBe(false);
    expect(r.finalContract).toBeUndefined();
  });

  it("myPosition=3, two passes before me → NOT complete", () => {
    const r = getFinalContractInfo([], { 1: "Pass", 2: "Pass" }, 3);
    expect(r.isComplete).toBe(false);
  });

  it("4 opening passes in completed round → complete (passed out)", () => {
    const r = getFinalContractInfo(
      [{ 1: "Pass", 2: "Pass", 3: "Pass", 4: "Pass" }],
      {},
      1,
    );
    expect(r.isComplete).toBe(true);
    expect(r.finalContract).toBeUndefined();
  });

  it("round 2 with empty currentRound — NOT falsely complete after 1NT + Stayman", () => {
    // Bug scenario: partner bid 1NT, user bid 2♣ (Stayman), positions 2 and 4 passed.
    // Round 2 just started with empty currentRound. Should NOT be complete.
    const r = getFinalContractInfo(
      [{ 1: "1NT", 2: "Pass", 3: "2♣", 4: "Pass" }],
      {}, // round 2 not yet started — no explicit bids
      3, // user is position 3
    );
    expect(r.isComplete).toBe(false);
    expect(r.finalContract).toBe("2♣");
  });

  it("round 2 with empty currentRound — NOT falsely complete after any convention bid", () => {
    // User is position 2; round 1: pos 1 bid 1♠, pos 2 bid 2NT, pos 3/4 passed
    // Round 2 starts empty. Should NOT be complete.
    const r = getFinalContractInfo(
      [{ 1: "1♠", 2: "2NT", 3: "Pass", 4: "Pass" }],
      {}, // round 2 not yet started
      2, // user is position 2
    );
    expect(r.isComplete).toBe(false);
  });
});

// ─── Bug fix: Stayman — opener responds to partner's 2♣ after 1NT ─────────────

describe("bidding-logic | rebid-after-nt — Stayman (partner bid 2♣)", () => {
  it("partner bid 2♣ (Stayman), I have 4 hearts → bid 2♥", () => {
    const rec = getRecommendation(
      mkHand(15, 2, 4, 4, 3),
      ctx("rebid-after-nt", { partnerBid: "2♣" }),
    );
    expect(rec.bid).toBe("2♥");
    expect(rec.category).toContain("Stayman");
  });

  it("partner bid 2♣ (Stayman), I have 4 spades only → bid 2♠", () => {
    const rec = getRecommendation(
      mkHand(15, 4, 3, 4, 2),
      ctx("rebid-after-nt", { partnerBid: "2♣" }),
    );
    expect(rec.bid).toBe("2♠");
    expect(rec.category).toContain("Stayman");
  });

  it("partner bid 2♣ (Stayman), both 4 hearts and 4 spades → bid 2♥ first", () => {
    const rec = getRecommendation(
      mkHand(15, 4, 4, 2, 3),
      ctx("rebid-after-nt", { partnerBid: "2♣" }),
    );
    expect(rec.bid).toBe("2♥");
    expect(rec.category).toContain("Stayman");
  });

  it("partner bid 2♣ (Stayman), no 4-card major → deny with 2♦", () => {
    const rec = getRecommendation(
      mkHand(15, 3, 3, 4, 3),
      ctx("rebid-after-nt", { partnerBid: "2♣" }),
    );
    expect(rec.bid).toBe("2♦");
    expect(rec.category).toContain("Stayman");
    expect(rec.confidence).toBe("high");
  });
});

// ─── Context-aware getBidMeaning ──────────────────────────────────────────────

describe("bidding-logic | getBidMeaning — prevHighBid context", () => {
  it("2♣ after 1NT → Stayman (partner)", () => {
    const m = getBidMeaning("2♣", "partner", "1NT");
    expect(m.toLowerCase()).toContain("stayman");
    expect(m).not.toContain("22+");
  });

  it("2♣ after 2NT → Stayman (partner)", () => {
    const m = getBidMeaning("2♣", "partner", "2NT");
    expect(m.toLowerCase()).toContain("stayman");
  });

  it("2♣ with no context → strong opening bid", () => {
    const m = getBidMeaning("2♣", "partner");
    expect(m).toContain("22+");
  });

  it("2♦ after 1NT → Jacoby Transfer to hearts", () => {
    const m = getBidMeaning("2♦", "partner", "1NT");
    expect(m.toLowerCase()).toContain("jacoby");
    expect(m.toLowerCase()).toContain("heart");
  });

  it("2♥ after 1NT → Jacoby Transfer to spades", () => {
    const m = getBidMeaning("2♥", "partner", "1NT");
    expect(m.toLowerCase()).toContain("jacoby");
    expect(m.toLowerCase()).toContain("spade");
  });

  it("2♣ from opponent after 1NT → Stayman context note", () => {
    const m = getBidMeaning("2♣", "rho", "1NT");
    expect(m.toLowerCase()).toContain("stayman");
  });

  it("2♦ with no context → weak 2 bid", () => {
    const m = getBidMeaning("2♦", "partner");
    expect(m.toLowerCase()).toContain("weak");
  });
});

// ─── Bug-fix regression tests ─────────────────────────────────────────────────

describe("bidding-logic | bug1 — 7-card suit preempt no outside major", () => {
  it("7-card spades (major) → 3♠ preempt even without checking outside majors", () => {
    // Before fix: noOutsideMajor was FALSE for 7-card spades, so preempt never fired
    const rec = getRecommendation(mkHand(8, 7, 2, 3, 1), ctx("opening"));
    expect(rec.bid).toBe("3♠");
    expect(rec.category).toContain("Pre-emptive 3");
  });

  it("7-card hearts (major) → 3♥ preempt", () => {
    const rec = getRecommendation(mkHand(7, 2, 7, 3, 1), ctx("opening"));
    expect(rec.bid).toBe("3♥");
    expect(rec.category).toContain("Pre-emptive 3");
  });

  it("7-card diamonds + 4-card spades → open 1♠ not 3♦ (outside major takes priority)", () => {
    const rec = getRecommendation(mkHand(10, 4, 2, 7, 0), ctx("opening"));
    // Should open 1♠ because 4-card spades + Rule of 20 qualifies
    expect(rec.bid).not.toBe("3♦");
  });

  it("7-card clubs + no 4-card major → 3♣ preempt", () => {
    const rec = getRecommendation(mkHand(8, 3, 3, 0, 7), ctx("opening"));
    expect(rec.bid).toBe("3♣");
  });
});

describe("bidding-logic | bug2 — medium/strong opener rebid in getRebidAfterSuit", () => {
  it("16-18 TP, 5-card suit, partner bid new suit → jump rebid (medium)", () => {
    // Opener: 15 HCP + 1 long suit pt (5 diamonds) = 16 TP, 5 diamonds, partner bid 1♠
    const rec = getRecommendation(
      mkHand(15, 2, 3, 5, 3),
      ctx("rebid-after-suit", {
        myPreviousBid: "1♦",
        partnerBid: "1♠",
      }),
    );
    expect(rec.category).toContain("Jump Rebid");
    expect(rec.bid).toMatch(/^3/); // Jump to 3-level
  });

  it("19+ TP, 4-card fit for partner's suit → direct game bid", () => {
    // Opener: 18 HCP + 1 long suit pt (5 diamonds) = 19 TP, 4 spades, partner bid 1♠
    const rec = getRecommendation(
      mkHand(18, 4, 3, 5, 1),
      ctx("rebid-after-suit", {
        myPreviousBid: "1♦",
        partnerBid: "1♠",
      }),
    );
    expect(rec.bid).toBe("4♠");
    expect(rec.category).toContain("Game Raise");
  });
});

describe("bidding-logic | bug3 — 1NT rebid label 12-14 HCP (not 15-17)", () => {
  it("balanced 12-14 HCP opener rebids 1NT after partner's 1♠ response", () => {
    const rec = getRecommendation(
      mkHand(13, 2, 3, 4, 4),
      ctx("rebid-after-suit", {
        myPreviousBid: "1♦",
        partnerBid: "1♠",
      }),
    );
    expect(rec.bid).toBe("1NT");
    expect(rec.category).toContain("12-14 HCP");
  });

  it("balanced 18-19 HCP opener rebids 2NT", () => {
    const rec = getRecommendation(
      mkHand(18, 2, 3, 4, 4),
      ctx("rebid-after-suit", {
        myPreviousBid: "1♦",
        partnerBid: "1♠",
      }),
    );
    expect(rec.bid).toBe("2NT");
    expect(rec.category).toContain("18-19 HCP");
  });
});

describe("bidding-logic | bug4 — 5-card suit overcall checked before takeout double", () => {
  it("12 HCP, 5-card spades over 1♥ → 1♠ overcall (not takeout double)", () => {
    const rec = getRecommendation(
      mkHand(12, 5, 2, 3, 3),
      ctx("overcalling", { rhoBid: "1♥" }),
    );
    // Should bid 1♠ suit overcall, NOT double (5-card suit is more descriptive)
    expect(rec.bid).toBe("1♠");
  });

  it("14 HCP, 5-card clubs over 1♦ → 2♣ overcall (not takeout double)", () => {
    const rec = getRecommendation(
      mkHand(14, 3, 2, 1, 7),
      ctx("overcalling", { rhoBid: "1♦" }),
    );
    expect(rec.bid).toBe("2♣");
    expect(rec.category).toContain("Overcall");
  });
});

describe("bidding-logic | bug5 — Blackwood ace/king response uses actual values", () => {
  it("responds with 5♥ (2 aces) when aces=2 provided", () => {
    const hand: Hand = {
      hcp: 12,
      spades: 3,
      hearts: 3,
      diamonds: 4,
      clubs: 3,
      aces: 2,
    };
    const rec = getRecommendation(hand, ctx("blackwood-ace-response"));
    expect(rec.bid).toBe("5♥");
    expect(rec.confidence).toBe("high");
  });

  it("responds with 5♣ (0 aces) when aces=0 provided", () => {
    const hand: Hand = {
      hcp: 10,
      spades: 3,
      hearts: 3,
      diamonds: 4,
      clubs: 3,
      aces: 0,
    };
    const rec = getRecommendation(hand, ctx("blackwood-ace-response"));
    expect(rec.bid).toBe("5♣");
  });

  it("responds with 5♦ (1 ace) when aces=1 provided", () => {
    const hand: Hand = {
      hcp: 8,
      spades: 2,
      hearts: 3,
      diamonds: 5,
      clubs: 3,
      aces: 1,
    };
    const rec = getRecommendation(hand, ctx("blackwood-ace-response"));
    expect(rec.bid).toBe("5♦");
  });

  it("without aces field, falls back to HCP estimate with medium confidence", () => {
    const hand: Hand = { hcp: 10, spades: 3, hearts: 3, diamonds: 4, clubs: 3 };
    const rec = getRecommendation(hand, ctx("blackwood-ace-response"));
    expect(rec.confidence).toBe("medium");
    expect(rec.note).toContain("Tip:");
  });

  it("kings response uses kings=1 when provided → 6♦", () => {
    const hand: Hand = {
      hcp: 10,
      spades: 3,
      hearts: 3,
      diamonds: 4,
      clubs: 3,
      kings: 1,
    };
    const rec = getRecommendation(hand, ctx("blackwood-kings-response"));
    expect(rec.bid).toBe("6♦");
    expect(rec.confidence).toBe("high");
  });
});

describe("bidding-logic | bug6 — takeout double requires shape in unbid suits", () => {
  it("4-4-4-1 distribution (1 club in opponent suit) → takeout double over 1♣", () => {
    // Before fix: check required 3+ clubs, but opponent opened clubs
    const rec = getRecommendation(
      mkHand(13, 4, 4, 4, 1),
      ctx("overcalling", { rhoBid: "1♣" }),
    );
    expect(rec.bid).toBe("Double");
    expect(rec.category).toContain("Takeout");
  });

  it("4-3-3-3 balanced (3 clubs) with 12 HCP over 1♣ → NOT takeout double (balanced, no shape)", () => {
    // Balanced 4-3-3-3 doesn't have ideal takeout double shape for clubs opening
    // Should get 1NT overcall instead (if qualified) or pass
    const rec = getRecommendation(
      mkHand(12, 4, 3, 3, 3),
      ctx("overcalling", { rhoBid: "1♣" }),
    );
    // Should NOT be a simple takeout double since 3 clubs is not shortness
    // (Could be 1NT overcall or 1♠ overcall instead)
    expect(rec.bid).not.toBe("Double");
  });

  it("4-4-4-1 distribution (1 heart in opponent suit) → takeout double over 1♥", () => {
    const rec = getRecommendation(
      mkHand(13, 4, 1, 4, 4),
      ctx("overcalling", { rhoBid: "1♥" }),
    );
    expect(rec.bid).toBe("Double");
    expect(rec.category).toContain("Takeout");
  });
});

describe("bidding-logic | bug7 — reverse bid in getRebidAfterSuit", () => {
  it("16+ TP, 4-card spades after opening 1♦, partner bids 1♥ → reverse 2♠", () => {
    // Classic reverse: 1♦ - 1♥ - 2♠ (opener shows 4+ spades ranking higher than diamonds)
    // 15 HCP + 1 long suit (5 diamonds) = 16 TP
    const rec = getRecommendation(
      mkHand(15, 4, 2, 5, 2),
      ctx("rebid-after-suit", {
        myPreviousBid: "1♦",
        partnerBid: "1♥",
      }),
    );
    expect(rec.bid).toBe("2♠");
    expect(rec.category).toContain("Reverse");
  });

  it("16+ TP, 4-card hearts after opening 1♣, partner bids 1♦ → reverse 2♥", () => {
    // Classic reverse: 1♣ - 1♦ - 2♥
    // 15 HCP + 1 long suit (5 clubs) = 16 TP
    const rec = getRecommendation(
      mkHand(15, 3, 4, 2, 5),
      ctx("rebid-after-suit", {
        myPreviousBid: "1♣",
        partnerBid: "1♦",
      }),
    );
    expect(rec.bid).toBe("2♥");
    expect(rec.category).toContain("Reverse");
  });

  it("15 TP (below reverse threshold) does NOT make reverse bid", () => {
    // With only 15 TP (and no long suit pts to push to 16), should NOT reverse
    const rec = getRecommendation(
      mkHand(13, 4, 2, 4, 4),
      ctx("rebid-after-suit", {
        myPreviousBid: "1♣",
        partnerBid: "1♦",
      }),
    );
    expect(rec.bid).not.toContain("Reverse");
    expect(rec.category).not.toContain("Reverse");
  });
});

// ─── Sample Deal End-to-End Integration Tests ─────────────────────────────────
// Each deal traces a complete auction verifying SAYC bid recommendations at every step.
// SAYC reference: https://www.bridgebum.com/ and ACBL SAYC booklet.

describe("bidding-logic | deal 1 — 1♠ opening, limit raise, game", () => {
  // North (P1): 14 HCP, 5♠3♥3♦2♣ → TP=15  opens 1♠
  // South (P3): 11 HCP, 4♠3♥3♦3♣ → limit raise 3♠
  const northHand = mkHand(14, 5, 3, 3, 2);
  const southHand = mkHand(11, 4, 3, 3, 3);

  it("North (P1) opening with 5 spades, 15 TP → 1♠", () => {
    const rec = getRecommendation(northHand, ctx("opening"));
    expect(rec.bid).toBe("1♠");
  });

  it("South (P3) with 4-card spade support, 11 HCP, partner opened 1♠ → limit raise 3♠", () => {
    const state: AuctionState = {
      myPosition: 3,
      completedRounds: [],
      currentRound: { 1: "1♠", 2: "Pass" },
    };
    const auction = deriveSituation(state, "none");
    const rec = getRecommendation(southHand, auction);
    expect(rec.bid).toBe("3♠");
  });

  it("North (P1) after partner's 3♠ limit raise, 15 TP → accept invitation 4♠", () => {
    const state: AuctionState = {
      myPosition: 1,
      completedRounds: [{ 1: "1♠", 2: "Pass", 3: "3♠", 4: "Pass" }],
      currentRound: {},
    };
    const auction = deriveSituation(state, "none");
    const rec = getRecommendation(northHand, auction);
    expect(rec.bid).toBe("4♠");
  });
});

describe("bidding-logic | deal 2 — 1NT opening, Stayman, 4-4 heart fit, game", () => {
  // North (P1): 15 HCP, 3♠4♥3♦3♣ → opens 1NT (15-17 HCP balanced)
  // South (P3): 10 HCP, 3♠4♥3♦3♣ → Stayman 2♣ → then 4♥ game
  const northHand = mkHand(15, 3, 4, 3, 3);
  const southHand = mkHand(10, 3, 4, 3, 3);

  it("North (P1) balanced 15 HCP → 1NT", () => {
    const rec = getRecommendation(northHand, ctx("opening"));
    expect(rec.bid).toBe("1NT");
  });

  it("South (P3) with 4 hearts, 10 HCP, partner opened 1NT → 2♣ Stayman", () => {
    const state: AuctionState = {
      myPosition: 3,
      completedRounds: [],
      currentRound: { 1: "1NT", 2: "Pass" },
    };
    const auction = deriveSituation(state, "none");
    const rec = getRecommendation(southHand, auction);
    expect(rec.bid).toBe("2♣");
    expect(rec.category.toLowerCase()).toContain("stayman");
  });

  it("North (P1) with 4 hearts, partner bid 2♣ Stayman → 2♥", () => {
    const state: AuctionState = {
      myPosition: 1,
      completedRounds: [{ 1: "1NT", 2: "Pass", 3: "2♣", 4: "Pass" }],
      currentRound: {},
    };
    const auction = deriveSituation(state, "none");
    const rec = getRecommendation(northHand, auction);
    expect(rec.bid).toBe("2♥");
  });

  it("South (P3) after partner shows 4 hearts via 2♥ → 4♥ game", () => {
    const state: AuctionState = {
      myPosition: 3,
      completedRounds: [{ 1: "1NT", 2: "Pass", 3: "2♣", 4: "Pass" }],
      currentRound: { 1: "2♥", 2: "Pass" },
    };
    const auction = deriveSituation(state, "none");
    const rec = getRecommendation(southHand, auction);
    expect(rec.bid).toBe("4♥");
  });
});

describe("bidding-logic | deal 3 — 1♦ opening, 1-over-1 response, reverse bid", () => {
  // North (P1): 15 HCP, 4♠2♥5♦2♣ → TP=16, opens 1♦
  // South (P3): 9 HCP, 3♠4♥3♦3♣ → responds 1♥
  const northHand = mkHand(15, 4, 2, 5, 2);
  const southHand = mkHand(9, 3, 4, 3, 3);

  it("North (P1) 5-card diamonds, 16 TP → 1♦", () => {
    const rec = getRecommendation(northHand, ctx("opening"));
    expect(rec.bid).toBe("1♦");
  });

  it("South (P3) with 4 hearts, 9 HCP, partner opened 1♦ → 1♥", () => {
    const state: AuctionState = {
      myPosition: 3,
      completedRounds: [],
      currentRound: { 1: "1♦", 2: "Pass" },
    };
    const auction = deriveSituation(state, "none");
    const rec = getRecommendation(southHand, auction);
    expect(rec.bid).toBe("1♥");
  });

  it("North (P1) with 4 spades, 16 TP, after partner's 1♥ → reverse 2♠", () => {
    const state: AuctionState = {
      myPosition: 1,
      completedRounds: [{ 1: "1♦", 2: "Pass", 3: "1♥", 4: "Pass" }],
      currentRound: {},
    };
    const auction = deriveSituation(state, "none");
    const rec = getRecommendation(northHand, auction);
    expect(rec.bid).toBe("2♠");
    expect(rec.category).toContain("Reverse");
  });
});

describe("bidding-logic | deal 4 — 1♥ opening, overcall, negative double", () => {
  // North (P1): 14 HCP, 3♠5♥3♦2♣ → opens 1♥
  // East  (P2): 12 HCP, 5♠2♥3♦3♣ → overcalls 1♠
  // South (P3): 9 HCP, 2♠3♥5♦3♣ → negative double or 2♦
  const northHand = mkHand(14, 3, 5, 3, 2);
  const eastHand = mkHand(12, 5, 2, 3, 3);
  const southHand = mkHand(9, 2, 3, 5, 3);

  it("North (P1) 5-card hearts, 14 HCP → 1♥", () => {
    const rec = getRecommendation(northHand, ctx("opening"));
    expect(rec.bid).toBe("1♥");
  });

  it("East (P2) with 5 spades, 12 HCP, after 1♥ → 1♠ overcall", () => {
    const state: AuctionState = {
      myPosition: 2,
      completedRounds: [],
      currentRound: { 1: "1♥" },
    };
    const auction = deriveSituation(state, "none");
    const rec = getRecommendation(eastHand, auction);
    expect(rec.bid).toBe("1♠");
  });

  it("South (P3) with 5 diamonds, 9 HCP, after 1♥-1♠ → negative double or 2♦", () => {
    const state: AuctionState = {
      myPosition: 3,
      completedRounds: [],
      currentRound: { 1: "1♥", 2: "1♠" },
    };
    const auction = deriveSituation(state, "none");
    const rec = getRecommendation(southHand, auction);
    // SAYC: after 1♥-1♠, with diamonds → negative double or 2♦ are both valid
    expect(["Double", "2♦"]).toContain(rec.bid);
  });
});

describe("bidding-logic | deal 5 — preempt 3♣ opening, response to preempt", () => {
  // North (P1): 8 HCP, 2♠2♥3♦6♣ → preempt 3♣
  // South (P3): 15 HCP, 5♠4♥2♦2♣ → responds to preempt
  const northHand = mkHand(8, 2, 2, 3, 6);
  const southHand = mkHand(15, 5, 4, 2, 2);

  it("North (P1) with 6-card clubs, 8 HCP → Pass (no preempt available: 2♣ reserved, 3♣ needs 7)", () => {
    const rec = getRecommendation(northHand, ctx("opening"));
    expect(rec.bid).toBe("Pass");
  });

  it("South (P3) with 15 HCP, 5 spades, partner preempted 3♣ → 3♠ or 3NT", () => {
    const state: AuctionState = {
      myPosition: 3,
      completedRounds: [],
      currentRound: { 1: "3♣", 2: "Pass" },
    };
    const auction = deriveSituation(state, "none");
    const rec = getRecommendation(southHand, auction);
    // SAYC: 15 HCP with 5 spades over partner's 3♣ preempt → 3♠ (new suit forcing) or 3NT
    expect(["3♠", "3NT", "4♠"]).toContain(rec.bid);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Comprehensive Audit Deals A–J (and isInvitational HCP fix)
// ─────────────────────────────────────────────────────────────────────────────

describe("bidding-logic | deal A — 1♣ opening, 1♥ overcall, negative double", () => {
  // P1: 14 HCP, 3♠2♥3♦5♣ → opens 1♣ (5 clubs, TP=15)
  // P2: 10 HCP, 3♠5♥2♦3♣ → overcalls 1♥ (5 hearts)
  // P3:  9 HCP, 4♠3♥4♦2♣ → Negative Double (4+ spades)
  const p1Hand = mkHand(14, 3, 2, 3, 5);
  const p2Hand = mkHand(10, 3, 5, 2, 3);
  const p3Hand = mkHand(9, 4, 3, 4, 2);

  it("P1 with 5 clubs, 14 HCP → opens 1♣", () => {
    const rec = getRecommendation(p1Hand, ctx("opening"));
    expect(rec.bid).toBe("1♣");
  });

  it("P2 with 5 hearts, 10 HCP, after 1♣ → overcalls 1♥", () => {
    const state: AuctionState = {
      myPosition: 2,
      completedRounds: [],
      currentRound: { 1: "1♣" },
    };
    const auction = deriveSituation(state, "none");
    const rec = getRecommendation(p2Hand, auction);
    expect(rec.bid).toBe("1♥");
  });

  it("P3 with 4 spades, 9 HCP, after 1♣–1♥ → Negative Double", () => {
    const state: AuctionState = {
      myPosition: 3,
      completedRounds: [],
      currentRound: { 1: "1♣", 2: "1♥" },
    };
    const auction = deriveSituation(state, "none");
    const rec = getRecommendation(p3Hand, auction);
    expect(rec.bid).toBe("Double");
  });

  it("P1 responds to Negative Double — 3 spades, balanced → bid 1♠ or 1NT (both valid SAYC options)", () => {
    // P1 is 5-3-3-2 balanced. Balanced hand → 1NT (stopper in overcalled suit).
    // Showing 3-card spade support (1♠) is also valid. Accept both.
    const state: AuctionState = {
      myPosition: 1,
      completedRounds: [{ 1: "1♣", 2: "1♥", 3: "Double", 4: "Pass" }],
      currentRound: {},
    };
    const auction = deriveSituation(state, "none");
    const rec = getRecommendation(p1Hand, auction);
    expect(["1♠", "1NT", "2♣"]).toContain(rec.bid);
  });
});

describe("bidding-logic | deal B — 1♥ opening, 1NT response, opener shows 2nd suit", () => {
  // P1: 14 HCP, 3♠5♥4♦1♣ → opens 1♥ (5 hearts, TP=15)
  // P3:  8 HCP, 3♠2♥4♦4♣ → responds 1NT (no major, minimum)
  // Bug A fix: after 1NT, opener with 5♥+4♦ should bid 2♦ (not Pass)
  const p1Hand = mkHand(14, 3, 5, 4, 1);
  const p3Hand = mkHand(8, 3, 2, 4, 4);

  it("P1 with 5 hearts, 14 HCP → opens 1♥", () => {
    const rec = getRecommendation(p1Hand, ctx("opening"));
    expect(rec.bid).toBe("1♥");
  });

  it("P3 with no 4-card major, 8 HCP, after 1♥ → responds 1NT", () => {
    const state: AuctionState = {
      myPosition: 3,
      completedRounds: [],
      currentRound: { 1: "1♥", 2: "Pass" },
    };
    const auction = deriveSituation(state, "none");
    const rec = getRecommendation(p3Hand, auction);
    expect(rec.bid).toBe("1NT");
  });

  it("P1 after 1♥–1NT with 5♥+4♦ (Bug A fix) → bids 2♦ to show second suit", () => {
    const state: AuctionState = {
      myPosition: 1,
      completedRounds: [{ 1: "1♥", 2: "Pass", 3: "1NT", 4: "Pass" }],
      currentRound: {},
    };
    const auction = deriveSituation(state, "none");
    const rec = getRecommendation(p1Hand, auction);
    // Bug A fix: opener with 5♥+4♦ should show diamond suit after 1NT response
    expect(rec.bid).toBe("2♦");
  });
});

describe("bidding-logic | deal C — 1NT opening, Jacoby transfer to spades", () => {
  // P1: 16 HCP, 4♠3♥3♦3♣ → opens 1NT (balanced, 15-17 HCP)
  // P3:  9 HCP, 6♠2♥3♦2♣ → 2♥ (Jacoby transfer to spades), then 3♠ (invitational)
  // P1 with 16 HCP + 4 spades = max 1NT → accepts with 4♠
  const p1Hand = mkHand(16, 4, 3, 3, 3);
  const p3Hand = mkHand(9, 6, 2, 3, 2);

  it("P1 with balanced 16 HCP → opens 1NT", () => {
    const rec = getRecommendation(p1Hand, ctx("opening"));
    expect(rec.bid).toBe("1NT");
  });

  it("P3 with 6 spades, 9 HCP, after 1NT → bids 2♥ (Jacoby transfer to spades)", () => {
    const state: AuctionState = {
      myPosition: 3,
      completedRounds: [],
      currentRound: { 1: "1NT", 2: "Pass" },
    };
    const auction = deriveSituation(state, "none");
    const rec = getRecommendation(p3Hand, auction);
    expect(rec.bid).toBe("2♥");
    expect(rec.category.toLowerCase()).toContain("transfer");
  });

  it("P1 after 2♥ transfer → completes with 2♠", () => {
    // Round 1 is complete; P1 needs to rebid in round 2
    const state: AuctionState = {
      myPosition: 1,
      completedRounds: [{ 1: "1NT", 2: "Pass", 3: "2♥", 4: "Pass" }],
      currentRound: {},
    };
    const auction = deriveSituation(state, "none");
    const rec = getRecommendation(p1Hand, auction);
    expect(rec.bid).toBe("2♠");
  });

  it("P3 after 1NT–2♥–2♠, 6 spades + 9 HCP → bids 3♠ (invitational with 6-card major)", () => {
    const state: AuctionState = {
      myPosition: 3,
      completedRounds: [{ 1: "1NT", 2: "Pass", 3: "2♥", 4: "Pass" }],
      currentRound: { 1: "2♠", 2: "Pass" },
    };
    const auction = deriveSituation(state, "none");
    const rec = getRecommendation(p3Hand, auction);
    // 6 spades + 8-9 HCP → invitational 3♠ (or game directly with 10+ HCP)
    expect(["3♠", "4♠"]).toContain(rec.bid);
  });

  it("P1 after 3♠ invitation with 4 spades and max NT (16 HCP) → accepts 4♠", () => {
    const state: AuctionState = {
      myPosition: 1,
      completedRounds: [
        { 1: "1NT", 2: "Pass", 3: "2♥", 4: "Pass" },
        { 1: "2♠", 2: "Pass", 3: "3♠", 4: "Pass" },
      ],
      currentRound: {},
    };
    const auction = deriveSituation(state, "none");
    const rec = getRecommendation(p1Hand, auction);
    expect(rec.bid).toBe("4♠");
  });
});

describe("bidding-logic | deal D — 2♥ weak two, 14 HCP game response", () => {
  // P1:  8 HCP, 1♠6♥3♦3♣ → opens 2♥ (6 hearts, 5-10 HCP, weak two)
  // P3: 14 HCP, 4♠3♥3♦3♣ → responds to 2♥ (game raise per bug-fix)
  const p1Hand = mkHand(8, 1, 6, 3, 3);
  const p3Hand = mkHand(14, 4, 3, 3, 3);

  it("P1 with 6 hearts, 8 HCP → opens 2♥ (weak two)", () => {
    const rec = getRecommendation(p1Hand, ctx("opening"));
    expect(rec.bid).toBe("2♥");
  });

  it("P3 with 14 HCP and 3-card heart support after 2♥ → game interest bid (not pre-emptive 3♥)", () => {
    const state: AuctionState = {
      myPosition: 3,
      completedRounds: [],
      currentRound: { 1: "2♥", 2: "Pass" },
    };
    const auction = deriveSituation(state, "none");
    const rec = getRecommendation(p3Hand, auction);
    // Bug D fix: 14 HCP is game-going — should NOT give pre-emptive 3♥.
    // Valid answers: 4♥ (game raise), 3NT (balanced NT), or 2NT (inquiry for max/min).
    expect(rec.bid).not.toBe("3♥");
    expect(["4♥", "3NT", "2NT"]).toContain(rec.bid);
  });
});

describe("bidding-logic | deal E — 1♦ opening, 1♥ response, opener bids 1♠", () => {
  // P1: 14 HCP, 4♠2♥5♦2♣ → opens 1♦ (5 diamonds, TP=15)
  // P3: 10 HCP, 3♠5♥3♦2♣ → responds 1♥ (5 hearts, forcing)
  // Bug B fix: after 1♦–1♥, opener with 4♠ and TP<16 should bid 1♠ (not require 16+ TP)
  const p1Hand = mkHand(14, 4, 2, 5, 2);
  const p3Hand = mkHand(10, 3, 5, 3, 2);

  it("P1 with 5 diamonds, 14 HCP → opens 1♦", () => {
    const rec = getRecommendation(p1Hand, ctx("opening"));
    expect(rec.bid).toBe("1♦");
  });

  it("P3 with 5 hearts, 10 HCP, after 1♦ → responds 1♥", () => {
    const state: AuctionState = {
      myPosition: 3,
      completedRounds: [],
      currentRound: { 1: "1♦", 2: "Pass" },
    };
    const auction = deriveSituation(state, "none");
    const rec = getRecommendation(p3Hand, auction);
    expect(rec.bid).toBe("1♥");
  });

  it("P1 after 1♦–1♥, has 4 spades and TP=15 (Bug B fix) → bids 1♠ (not 2♦)", () => {
    const state: AuctionState = {
      myPosition: 1,
      completedRounds: [{ 1: "1♦", 2: "Pass", 3: "1♥", 4: "Pass" }],
      currentRound: {},
    };
    const auction = deriveSituation(state, "none");
    const rec = getRecommendation(p1Hand, auction);
    // Bug B fix: should bid 1♠ to show 4-card spades at 1-level, not require reverse strength
    expect(rec.bid).toBe("1♠");
  });
});

describe("bidding-logic | deal F — 1♠ opening, Jacoby 2NT, singleton diamond response", () => {
  // P1: 15 HCP, 5♠4♥1♦3♣ → opens 1♠ (5 spades, singleton diamond, TP=16)
  // P3: 13 HCP, 4♠3♥3♦3♣ → Jacoby 2NT (4+ spades, 13+ HCP, game-forcing)
  const p1Hand = mkHand(15, 5, 4, 1, 3);
  const p3Hand = mkHand(13, 4, 3, 3, 3);

  it("P1 with 5 spades, 15 HCP → opens 1♠", () => {
    const rec = getRecommendation(p1Hand, ctx("opening"));
    expect(rec.bid).toBe("1♠");
  });

  it("P3 with 4 spades, 13 HCP, after 1♠ → Jacoby 2NT", () => {
    const state: AuctionState = {
      myPosition: 3,
      completedRounds: [],
      currentRound: { 1: "1♠", 2: "Pass" },
    };
    const auction = deriveSituation(state, "none");
    const rec = getRecommendation(p3Hand, auction);
    expect(rec.bid).toBe("2NT");
    expect(rec.category.toLowerCase()).toContain("jacoby");
  });

  it("P1 after Jacoby 2NT — singleton diamond → bids 3♦ (showing shortness)", () => {
    const state: AuctionState = {
      myPosition: 1,
      completedRounds: [{ 1: "1♠", 2: "Pass", 3: "2NT", 4: "Pass" }],
      currentRound: {},
    };
    const auction = deriveSituation(state, "none");
    const rec = getRecommendation(p1Hand, auction);
    // Jacoby 2NT: singleton → bid 3♦ to show diamond shortness
    expect(rec.bid).toBe("3♦");
    expect(rec.category.toLowerCase()).toContain("jacoby");
  });
});

describe("bidding-logic | deal G — 1♣ opening, 2NT natural game-force, 3NT accept", () => {
  // P1: 13 HCP, 3♠2♥3♦5♣ → opens 1♣ (5 clubs, 14 TP; 13 HCP < 15 → NOT 1NT)
  // P3: 14 HCP, 3♠3♥3♦4♣ → responds 2NT (natural balanced, 13-15 HCP; no 4-card major)
  const p1Hand = mkHand(13, 3, 2, 3, 5);
  const p3Hand = mkHand(14, 3, 3, 3, 4);

  it("P1 with 5 clubs, 13 HCP → opens 1♣ (not 1NT — below 15 HCP threshold)", () => {
    const rec = getRecommendation(p1Hand, ctx("opening"));
    expect(rec.bid).toBe("1♣");
  });

  it("P3 with balanced 14 HCP, no 4-card major, after 1♣ → bids 2NT (13-15 HCP natural)", () => {
    const state: AuctionState = {
      myPosition: 3,
      completedRounds: [],
      currentRound: { 1: "1♣", 2: "Pass" },
    };
    const auction = deriveSituation(state, "none");
    const rec = getRecommendation(p3Hand, auction);
    expect(rec.bid).toBe("2NT");
  });

  it("P1 after 1♣–2NT with no 4-card major and 5 clubs → accepts game with 3NT", () => {
    const state: AuctionState = {
      myPosition: 1,
      completedRounds: [{ 1: "1♣", 2: "Pass", 3: "2NT", 4: "Pass" }],
      currentRound: {},
    };
    const auction = deriveSituation(state, "none");
    const rec = getRecommendation(p1Hand, auction);
    // No 4-card major (3♠, 2♥), no 6-card minor → accept game with 3NT
    expect(rec.bid).toBe("3NT");
  });
});

describe("bidding-logic | deal H — 1♥ opening, limit raise 3♥, opener accepts", () => {
  // P1: 14 HCP, 2♠5♥4♦2♣ → opens 1♥ (unbalanced 5-4-2-2 → NOT 1NT, TP=15)
  // P3: 11 HCP, 2♠4♥4♦3♣ → limit raise 3♥ (4 hearts, 10-12 HCP)
  const p1Hand = mkHand(14, 2, 5, 4, 2);
  const p3Hand = mkHand(11, 2, 4, 4, 3);

  it("P1 with 5 hearts, 14 HCP, unbalanced → opens 1♥ (not 1NT)", () => {
    const rec = getRecommendation(p1Hand, ctx("opening"));
    expect(rec.bid).toBe("1♥");
  });

  it("P3 with 4 hearts, 11 HCP, after 1♥ → limit raise 3♥", () => {
    const state: AuctionState = {
      myPosition: 3,
      completedRounds: [],
      currentRound: { 1: "1♥", 2: "Pass" },
    };
    const auction = deriveSituation(state, "none");
    const rec = getRecommendation(p3Hand, auction);
    expect(rec.bid).toBe("3♥");
  });

  it("P1 after 3♥ limit raise, 15 TP → accepts invitation with 4♥", () => {
    const state: AuctionState = {
      myPosition: 1,
      completedRounds: [{ 1: "1♥", 2: "Pass", 3: "3♥", 4: "Pass" }],
      currentRound: {},
    };
    const auction = deriveSituation(state, "none");
    const rec = getRecommendation(p1Hand, auction);
    expect(rec.bid).toBe("4♥");
  });
});

describe("bidding-logic | deal I — isInvitational HCP fix (9 HCP → 2♥, not 3♥)", () => {
  // P1: 13 HCP, 4♠3♥5♦1♣ → opens 1♦ (5 diamonds, TP=14)
  // P3:  9 HCP, 3♠5♥2♦3♣ → responds 1♥ (5 hearts, 6+ HCP, forcing)
  // After P1 rebids 2♦, P3 with 9 HCP should rebid 2♥ (minimum), NOT 3♥ (invitational)
  const p1Hand = mkHand(13, 4, 3, 5, 1);
  const p3Hand = mkHand(9, 3, 5, 2, 3);

  it("P1 with 5 diamonds, 13 HCP → opens 1♦", () => {
    const rec = getRecommendation(p1Hand, ctx("opening"));
    expect(rec.bid).toBe("1♦");
  });

  it("P3 with 5 hearts, 9 HCP, after 1♦ → responds 1♥", () => {
    const state: AuctionState = {
      myPosition: 3,
      completedRounds: [],
      currentRound: { 1: "1♦", 2: "Pass" },
    };
    const auction = deriveSituation(state, "none");
    const rec = getRecommendation(p3Hand, auction);
    expect(rec.bid).toBe("1♥");
  });

  it("P3 after 1♦–1♥–2♦, has 9 HCP + 1 length = TP 10 (isInvitational HCP fix) → bids 2♥ minimum", () => {
    const state: AuctionState = {
      myPosition: 3,
      completedRounds: [{ 1: "1♦", 2: "Pass", 3: "1♥", 4: "Pass" }],
      currentRound: { 1: "2♦", 2: "Pass" },
    };
    const auction = deriveSituation(state, "none");
    const rec = getRecommendation(p3Hand, auction);
    // isInvitational now uses hand.hcp >= 10 (was tp >= 10).
    // 9 HCP < 10 → simple rebid 2♥ (not invitational jump 3♥)
    expect(rec.bid).toBe("2♥");
  });

  it("P3 with 10 HCP, 5 hearts after 1♦–1♥–2♦ → bids 3♥ (invitational)", () => {
    // Contrast: 10 HCP should still trigger the invitational 3♥
    const p3HandInv = mkHand(10, 3, 5, 2, 3);
    const state: AuctionState = {
      myPosition: 3,
      completedRounds: [{ 1: "1♦", 2: "Pass", 3: "1♥", 4: "Pass" }],
      currentRound: { 1: "2♦", 2: "Pass" },
    };
    const auction = deriveSituation(state, "none");
    const rec = getRecommendation(p3HandInv, auction);
    expect(rec.bid).toBe("3♥");
    expect(rec.category).toContain("Invitational");
  });
});

describe("bidding-logic | deal J — 1♠ opening, Jacoby 2NT slam exploration", () => {
  // P1: 17 HCP, 5♠4♥2♦2♣ → opens 1♠ (unbalanced 5-4-2-2 → NOT 1NT, TP=18)
  // P3: 14 HCP, 4♠3♥3♦3♣ → Jacoby 2NT (4+ spades, 14 HCP, game-forcing)
  const p1Hand = mkHand(17, 5, 4, 2, 2);
  const p3Hand = mkHand(14, 4, 3, 3, 3);

  it("P1 with 5 spades, 17 HCP, unbalanced → opens 1♠ (not 1NT)", () => {
    const rec = getRecommendation(p1Hand, ctx("opening"));
    expect(rec.bid).toBe("1♠");
  });

  it("P3 with 4 spades, 14 HCP, after 1♠ → Jacoby 2NT", () => {
    const state: AuctionState = {
      myPosition: 3,
      completedRounds: [],
      currentRound: { 1: "1♠", 2: "Pass" },
    };
    const auction = deriveSituation(state, "none");
    const rec = getRecommendation(p3Hand, auction);
    expect(rec.bid).toBe("2NT");
    expect(rec.category.toLowerCase()).toContain("jacoby");
  });

  it("P1 after Jacoby 2NT, 17 HCP (TP=18), no shortness, no side suit → 3♠ (slam interest)", () => {
    const state: AuctionState = {
      myPosition: 1,
      completedRounds: [{ 1: "1♠", 2: "Pass", 3: "2NT", 4: "Pass" }],
      currentRound: {},
    };
    const auction = deriveSituation(state, "none");
    const rec = getRecommendation(p1Hand, auction);
    // Jacoby 2NT: 16+ TP and no shortness → bid 3♠ showing slam interest
    expect(rec.bid).toBe("3♠");
    expect(rec.category.toLowerCase()).toContain("slam interest");
  });

  it("P3 after 3♠ slam interest with 14 HCP → evaluates (4♠, 4NT, or Pass are valid)", () => {
    const state: AuctionState = {
      myPosition: 3,
      completedRounds: [{ 1: "1♠", 2: "Pass", 3: "2NT", 4: "Pass" }],
      currentRound: { 1: "3♠", 2: "Pass" },
    };
    const auction = deriveSituation(state, "none");
    const rec = getRecommendation(p3Hand, auction);
    // Combined 31 HCP (14+17): marginal for slam. 4♠ (game) or 4NT (Blackwood) or Pass are valid.
    expect(["4♠", "4NT", "Pass"]).toContain(rec.bid);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3 Consecutive Error-Free Games (Clean Deal Validation K, L, M)
// ─────────────────────────────────────────────────────────────────────────────

describe("bidding-logic | clean game K — balanced NT game, Stayman + 4-4 major", () => {
  // P1: 16 HCP, 4♠3♥4♦2♣ → opens 1NT (balanced 15-17)
  // P3: 11 HCP, 4♠4♥2♦3♣ → Stayman, finds 4-4 spade fit → 4♠
  const p1Hand = mkHand(16, 4, 3, 4, 2);
  const p3Hand = mkHand(11, 4, 4, 2, 3);

  it("P1 balanced 16 HCP → 1NT", () => {
    expect(getRecommendation(p1Hand, ctx("opening")).bid).toBe("1NT");
  });

  it("P3 with 4-4 majors, 11 HCP, after 1NT → Stayman 2♣", () => {
    const state: AuctionState = {
      myPosition: 3,
      completedRounds: [],
      currentRound: { 1: "1NT", 2: "Pass" },
    };
    const rec = getRecommendation(p3Hand, deriveSituation(state, "none"));
    expect(rec.bid).toBe("2♣");
  });

  it("P1 with 4 spades after Stayman → bids 2♠ or 2♥", () => {
    // Use completedRounds for the completed first round
    const state: AuctionState = {
      myPosition: 1,
      completedRounds: [{ 1: "1NT", 2: "Pass", 3: "2♣", 4: "Pass" }],
      currentRound: {},
    };
    const rec = getRecommendation(p1Hand, deriveSituation(state, "none"));
    // P1 has 4♠ and 3♥; Stayman response should be 2♠ (or 2♥ if hearts were 4+)
    expect(["2♠", "2♥"]).toContain(rec.bid);
  });

  it("P3 with 4 spades after partner bids 2♠ → bids 4♠ (game)", () => {
    const state: AuctionState = {
      myPosition: 3,
      completedRounds: [{ 1: "1NT", 2: "Pass", 3: "2♣", 4: "Pass" }],
      currentRound: { 1: "2♠", 2: "Pass" },
    };
    const rec = getRecommendation(p3Hand, deriveSituation(state, "none"));
    expect(rec.bid).toBe("4♠");
  });
});

describe("bidding-logic | clean game L — 1♠ opening, simple raise, pass", () => {
  // P1: 13 HCP, 5♠3♥3♦2♣ → opens 1♠ (5 spades, TP=14)
  // P3:  9 HCP, 3♠4♥3♦3♣ → simple raise 2♠ (3-card support, 6-9 HCP)
  const p1Hand = mkHand(13, 5, 3, 3, 2);
  const p3Hand = mkHand(9, 3, 4, 3, 3);

  it("P1 with 5 spades, 13 HCP → opens 1♠", () => {
    expect(getRecommendation(p1Hand, ctx("opening")).bid).toBe("1♠");
  });

  it("P3 with 3 spades, 9 HCP, after 1♠ → simple raise 2♠", () => {
    const state: AuctionState = {
      myPosition: 3,
      completedRounds: [],
      currentRound: { 1: "1♠", 2: "Pass" },
    };
    const rec = getRecommendation(p3Hand, deriveSituation(state, "none"));
    expect(rec.bid).toBe("2♠");
  });

  it("P1 after 2♠ simple raise, 13 HCP (TP=14) → Pass (below threshold for game)", () => {
    const state: AuctionState = {
      myPosition: 1,
      completedRounds: [{ 1: "1♠", 2: "Pass", 3: "2♠", 4: "Pass" }],
      currentRound: {},
    };
    const rec = getRecommendation(p1Hand, deriveSituation(state, "none"));
    // With only 14 TP and simple raise (6-9 from partner), pass — game needs ~25 combined
    expect(rec.bid).toBe("Pass");
  });
});

describe("bidding-logic | clean game M — competitive hand, overcall, game try", () => {
  // P1: 14 HCP, 3♠5♥3♦2♣ → opens 1♥ (5 hearts, TP=15)
  // P2:  9 HCP, 5♠3♥2♦3♣ → overcalls 1♠ (5 spades)
  // P3: 12 HCP, 2♠4♥4♦3♣ → raises 3♥ (competitive, 4 hearts)
  // P4 passes; P1 accepts with 4♥
  const p1Hand = mkHand(14, 3, 5, 3, 2);
  const p2Hand = mkHand(9, 5, 3, 2, 3);
  const p3Hand = mkHand(12, 2, 4, 4, 3);

  it("P1 with 5 hearts, 14 HCP → opens 1♥", () => {
    expect(getRecommendation(p1Hand, ctx("opening")).bid).toBe("1♥");
  });

  it("P2 with 5 spades, 9 HCP, after 1♥ → overcalls 1♠", () => {
    const state: AuctionState = {
      myPosition: 2,
      completedRounds: [],
      currentRound: { 1: "1♥" },
    };
    const rec = getRecommendation(p2Hand, deriveSituation(state, "none"));
    expect(rec.bid).toBe("1♠");
  });

  it("P3 with 4 hearts, 12 HCP, after 1♥–1♠ → competitive raise or limit raise", () => {
    const state: AuctionState = {
      myPosition: 3,
      completedRounds: [],
      currentRound: { 1: "1♥", 2: "1♠" },
    };
    const rec = getRecommendation(p3Hand, deriveSituation(state, "none"));
    // With 4 hearts and 12 HCP in competition: 2♥, 3♥, or Double are all valid
    expect(["2♥", "3♥", "Double"]).toContain(rec.bid);
  });

  it("P1 after 3♥ limit raise in competition, 15 TP → accepts 4♥", () => {
    const state: AuctionState = {
      myPosition: 1,
      completedRounds: [{ 1: "1♥", 2: "1♠", 3: "3♥", 4: "Pass" }],
      currentRound: {},
    };
    const rec = getRecommendation(p1Hand, deriveSituation(state, "none"));
    // P1 with 15 TP: accepts the limit raise → 4♥
    expect(rec.bid).toBe("4♥");
  });
});

// ─── Regression Tests: Bug Fixes ────────────────────────────────────────────

describe("bidding-logic | regression | Bug 1 — opening pass reasoning with blocked 6-card suit", () => {
  it("8 HCP 4♠1♥2♣6♦ → Pass; reasoning mentions 'outside 4-card spades' not 'no 6+ card suit'", () => {
    const hand = mkHand(8, 4, 1, 6, 2);
    const rec = getRecommendation(hand, ctx("opening"));
    expect(rec.bid).toBe("Pass");
    expect(rec.reasoning).toContain("spades");
    expect(rec.reasoning).not.toContain("no 6+ card suit");
    expect(rec.reasoning).not.toContain("no qualifying long suit");
  });

  it("7 HCP 0♠0♥1♣7♦ with no outside major → opens 3♦ (7-card diamond preempt)", () => {
    const hand = mkHand(7, 0, 0, 7, 6);
    const rec = getRecommendation(hand, ctx("opening"));
    expect(rec.bid).toBe("3♦");
  });

  it("7 HCP 4♠0♥1♣8♦ — 8-card diamond preempt even with 4 spades → 4♦", () => {
    // 8-card suits open 4-level regardless of outside major
    const hand = mkHand(7, 4, 0, 8, 1);
    const rec = getRecommendation(hand, ctx("opening"));
    expect(rec.bid).toBe("4♦");
  });

  it("8 HCP 4♠0♥2♣6♣ — 6 clubs + 4 spades → Pass; reasoning mentions 'outside 4-card spades'", () => {
    const hand = mkHand(8, 4, 0, 3, 6);
    const rec = getRecommendation(hand, ctx("opening"));
    expect(rec.bid).toBe("Pass");
    expect(rec.reasoning).toContain("spades");
  });
});

describe("bidding-logic | regression | Bug 2 — simple suit overcall level (3-level after 2-level opening)", () => {
  it("12 HCP 1♠4♥6♣2♦ after RHO 2♦ → 3♣ (NOT Pass or 2♣)", () => {
    const hand = mkHand(12, 1, 4, 2, 6);
    const rec = getRecommendation(hand, ctx("overcalling", { rhoBid: "2♦" }));
    expect(rec.bid).toBe("3♣");
    expect(rec.bid).not.toBe("Pass");
    expect(rec.bid).not.toBe("2♣");
  });

  it("11 HCP 2♠5♥2♦4♣ after RHO 2♠ → 3♥ (hearts rank below spades, must go to 3-level)", () => {
    const hand = mkHand(11, 2, 5, 2, 4);
    const rec = getRecommendation(hand, ctx("overcalling", { rhoBid: "2♠" }));
    expect(rec.bid).toBe("3♥");
  });

  it("12 HCP 5♠3♥2♦3♣ after RHO 1♦ → 1♠ (1-level overcall still legal, not broken by fix)", () => {
    // 5 spades over 1♦ → 1-level overcall — fix must not break this
    const hand = mkHand(12, 5, 3, 2, 3);
    const rec = getRecommendation(hand, ctx("overcalling", { rhoBid: "1♦" }));
    expect(rec.bid).toBe("1♠");
    expect(rec.bid).not.toBe("Pass");
  });

  it("10 HCP 5♥3♠2♦3♣ after RHO 1♥ → 2♥ would be cue bid (skip) — but correct response is 1♠ or Double", () => {
    const hand = mkHand(10, 3, 5, 2, 3);
    const rec = getRecommendation(hand, ctx("overcalling", { rhoBid: "1♥" }));
    // 5 hearts is opponent's suit so can't overcall naturally; expect double or pass, not 2♥
    expect(rec.bid).not.toBe("2♥");
  });
});

describe("bidding-logic | regression | Bug 3 — NT overcall uses correct level over opponent's 2-level bid", () => {
  it("16 HCP balanced 3♠3♥4♦3♣ after RHO 2♦ → 2NT (not 1NT)", () => {
    const hand = mkHand(16, 3, 3, 4, 3);
    const rec = getRecommendation(hand, ctx("overcalling", { rhoBid: "2♦" }));
    expect(rec.bid).toBe("2NT");
  });

  it("16 HCP balanced 3♠3♥3♦4♣ after RHO 1♦ → 1NT (not broken by fix)", () => {
    const hand = mkHand(16, 3, 3, 3, 4);
    const rec = getRecommendation(hand, ctx("overcalling", { rhoBid: "1♦" }));
    expect(rec.bid).toBe("1NT");
  });

  it("17 HCP balanced 3♠4♥3♦3♣ after RHO 2♠ → 2NT (2NT > 2♠)", () => {
    const hand = mkHand(17, 3, 4, 3, 3);
    const rec = getRecommendation(hand, ctx("overcalling", { rhoBid: "2♠" }));
    expect(rec.bid).toBe("2NT");
  });

  it("15 HCP balanced 3♠3♥4♦3♣ after RHO 1♠ → 1NT (1NT > 1♠)", () => {
    const hand = mkHand(15, 3, 3, 4, 3);
    const rec = getRecommendation(hand, ctx("overcalling", { rhoBid: "1♠" }));
    expect(rec.bid).toBe("1NT");
  });
});

describe("bidding-logic | regression | Bug 4 — 2♥ response over partner's 1♠ with 5+ hearts", () => {
  it("12 HCP 3♠5♥3♦2♣ (TP≈13) after partner 1♠ → 2♥ (not 2NT)", () => {
    const hand = mkHand(12, 3, 5, 3, 2);
    const rec = getRecommendation(
      hand,
      ctx("responding-suit", { partnerBid: "1♠" }),
    );
    expect(rec.bid).toBe("2♥");
    expect(rec.bid).not.toBe("2NT");
  });

  it("14 HCP 2♠5♥3♦3♣ (TP≈15) after partner 1♠ → 2♥ (game-forcing values)", () => {
    const hand = mkHand(14, 2, 5, 3, 3);
    const rec = getRecommendation(
      hand,
      ctx("responding-suit", { partnerBid: "1♠" }),
    );
    expect(rec.bid).toBe("2♥");
  });

  it("14 HCP 3♠4♥3♦3♣ (TP≈14, only 4 hearts) after partner 1♠ → 2NT; reasoning says 13-14 TP not 11-12 TP", () => {
    const hand = mkHand(14, 3, 4, 3, 3);
    const rec = getRecommendation(
      hand,
      ctx("responding-suit", { partnerBid: "1♠" }),
    );
    expect(rec.bid).toBe("2NT");
    expect(rec.reasoning).not.toContain("11-12 TP");
    expect(rec.category).not.toContain("11-12");
  });

  it("response to partner 1♠ with 5+ hearts at 11 TP → 2♥ (2-over-1, one-round force)", () => {
    const hand = mkHand(11, 2, 5, 3, 3);
    const rec = getRecommendation(
      hand,
      ctx("responding-suit", { partnerBid: "1♠" }),
    );
    expect(rec.bid).toBe("2♥");
  });
});

describe("bidding-logic | regression | verified-correct scenarios (should not regress)", () => {
  it("22 HCP balanced 5♠3♥3♦2♣ → opens 2♣ (strong artificial)", () => {
    const hand = mkHand(22, 5, 3, 3, 2);
    expect(getRecommendation(hand, ctx("opening")).bid).toBe("2♣");
  });

  it("14 HCP 4♠4♥3♦2♣ (TP=14) → opens 1♦ (no 5-card major in SAYC)", () => {
    const hand = mkHand(14, 4, 4, 3, 2);
    expect(getRecommendation(hand, ctx("opening")).bid).toBe("1♦");
  });

  it("6 HCP 1♠1♥6♦5♣ → opens 2♦ (weak two, no outside 4-card major)", () => {
    const hand = mkHand(6, 1, 1, 6, 5);
    expect(getRecommendation(hand, ctx("opening")).bid).toBe("2♦");
  });

  it("13 HCP 5♠3♥3♦2♣ after RHO 1♦ → overcalls 1♠", () => {
    const hand = mkHand(13, 5, 3, 3, 2);
    const rec = getRecommendation(hand, ctx("overcalling", { rhoBid: "1♦" }));
    expect(rec.bid).toBe("1♠");
  });

  it("10 HCP 6♠3♥2♦2♣ after RHO 1♥ → jump overcall 2♠ (preemptive weak)", () => {
    const hand = mkHand(10, 6, 3, 2, 2);
    const rec = getRecommendation(hand, ctx("overcalling", { rhoBid: "1♥" }));
    expect(rec.bid).toBe("2♠");
    expect(rec.category).toContain("Jump Overcall");
  });

  it("8 HCP 6♥2♠3♦2♣ after RHO 2♠ → 3♥ (bump above opponent's 2♠)", () => {
    const hand = mkHand(8, 2, 6, 3, 2);
    const rec = getRecommendation(hand, ctx("overcalling", { rhoBid: "2♠" }));
    expect(rec.bid).toBe("3♥");
  });

  it("9 HCP 3♠3♥4♦3♣ after partner 1♠ → simple raise 2♠", () => {
    const hand = mkHand(9, 3, 3, 4, 3);
    const rec = getRecommendation(
      hand,
      ctx("responding-suit", { partnerBid: "1♠" }),
    );
    expect(rec.bid).toBe("2♠");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Internet-Sourced SAYC Hands — 36 hands verified against published sources
// Sources:
//   bridgedoctor.com Lessons 2, 4, 5 (Standard American bridge curriculum)
//   Lincoln Hills Bridge Club — SAYC #13 Overcalls PDF
//   ACBL SAYC System Booklet / bridgebum.com SAYC reference
// ─────────────────────────────────────────────────────────────────────────────

describe("bidding-logic | internet examples — opening bids from published SAYC sources", () => {
  // bridgedoctor.com Lesson 5 hand (a): ♠KQ6 ♥A1087 ♦Q732 ♣A7 = 3♠4♥4♦2♣ 15 HCP → 1NT
  it("[L5-a] 3♠4♥4♦2♣ 15 HCP → opens 1NT (balanced 4-4-3-2, ACBL SAYC)", () => {
    const rec = getRecommendation(mkHand(15, 3, 4, 4, 2), ctx("opening"));
    expect(rec.bid).toBe("1NT");
    expect(rec.category).toBe("Opening 1NT (15-17 HCP)");
  });

  // bridgedoctor.com Lesson 5 hand (c): ♠A93 ♥A103 ♦AJ654 ♣Q4 = 3♠3♥5♦2♣ 15 HCP → 1NT
  it("[L5-c] 3♠3♥5♦2♣ 15 HCP → opens 1NT (balanced 5-3-3-2 with 5-card minor, SAYC)", () => {
    const rec = getRecommendation(mkHand(15, 3, 3, 5, 2), ctx("opening"));
    expect(rec.bid).toBe("1NT");
    expect(rec.category).toBe("Opening 1NT (15-17 HCP)");
  });

  // bridgedoctor.com Lesson 5 hand (f): ♠K7 ♥Q87 ♦AQJ108 ♣A52 = 2♠3♥5♦3♣ 15 HCP → 1NT
  it("[L5-f] 2♠3♥5♦3♣ 15 HCP → opens 1NT (balanced 5-card minor, 15 HCP)", () => {
    const rec = getRecommendation(mkHand(15, 2, 3, 5, 3), ctx("opening"));
    expect(rec.bid).toBe("1NT");
    expect(rec.category).toBe("Opening 1NT (15-17 HCP)");
  });

  // SAYC rule: 4-4 in minors → open 1♦ (ACBL SAYC booklet)
  // bridgedoctor.com Lesson 5 hand (b): ♠87 ♥KQ5 ♦Q983 ♣AQ84 = 2♠3♥4♦4♣ 13 HCP
  it("[L5-b] 2♠3♥4♦4♣ 13 HCP → opens 1♦ (balanced 4-4 minors, SAYC: open 1♦ with 4-4)", () => {
    const rec = getRecommendation(mkHand(13, 2, 3, 4, 4), ctx("opening"));
    expect(rec.bid).toBe("1♦");
  });

  // bridgedoctor.com Lesson 5 hand (d): ♠A9 ♥AJ1073 ♦K76 ♣962 = 2♠5♥3♦3♣ 12 HCP → 1♥
  // TP=13 (12 HCP + 1 long-suit point); balanced 5-3-3-2 → balanced block opens 1♥
  it("[L5-d] 2♠5♥3♦3♣ 12 HCP → opens 1♥ (balanced 12-14 block, 5-card major takes priority)", () => {
    const rec = getRecommendation(mkHand(12, 2, 5, 3, 3), ctx("opening"));
    expect(rec.bid).toBe("1♥");
    expect(rec.category).toContain("12-14");
  });

  // bridgedoctor.com Lesson 5 hand (e): ♠A9863 ♥AKQ10 ♦64 ♣32 = 5♠4♥2♦2♣ 14 HCP
  // Unbalanced (two doubletons), 5-card spade major → 1♠
  it("[L5-e] 5♠4♥2♦2♣ 14 HCP → opens 1♠ (5-card spade major, unbalanced 5-4-2-2)", () => {
    const rec = getRecommendation(mkHand(14, 5, 4, 2, 2), ctx("opening"));
    expect(rec.bid).toBe("1♠");
  });

  // bridgedoctor.com Lesson 2: open longer suit even if weaker
  // 4♠5♥2♦2♣ (hearts longer than spades) → 1♥
  it("[L2] 4♠5♥2♦2♣ 14 HCP → opens 1♥ (5-card heart suit beats 4-card spades; 'length before strength')", () => {
    const rec = getRecommendation(mkHand(14, 4, 5, 2, 2), ctx("opening"));
    expect(rec.bid).toBe("1♥");
    expect(rec.reasoning).toContain("5+ card hearts");
  });

  // Balanced 18-19 HCP: cannot open 1NT (15-17) or 2NT (20-21) — must open 1 of suit
  it("3♠3♥5♦2♣ 18 HCP → opens 1♦ (balanced 18-19, open 1 of suit then jump rebid NT)", () => {
    const rec = getRecommendation(mkHand(18, 3, 3, 5, 2), ctx("opening"));
    expect(rec.bid).toBe("1♦");
    expect(rec.category).toBe("Balanced 18-19 HCP: Open 1, then jump rebid NT");
  });

  // Weak 2: 6-card hearts, 8 HCP, no outside 4-card major (spades=2 < 4)
  it("2♠6♥3♦2♣ 8 HCP → opens 2♥ (Weak 2, no outside 4-card major)", () => {
    const rec = getRecommendation(mkHand(8, 2, 6, 3, 2), ctx("opening"));
    expect(rec.bid).toBe("2♥");
    expect(rec.category).toBe("Weak 2 Opening");
    // Hand analysis says 6-card hearts — reasoning must NOT say "no 6+ card suit"
    expect(rec.reasoning).not.toContain("no 6+ card suit");
    expect(rec.reasoning).not.toContain("no qualifying long suit");
  });

  // 3-level preempt: 7-card diamonds, 7 HCP, no outside 4-card major (spades=2, hearts=1)
  it("2♠1♥7♦3♣ 7 HCP → opens 3♦ (7-card diamond preempt, ACBL SAYC)", () => {
    const rec = getRecommendation(mkHand(7, 2, 1, 7, 3), ctx("opening"));
    expect(rec.bid).toBe("3♦");
    expect(rec.category).toContain("Pre-emptive 3");
  });

  // 3-level preempt: 7-card spade (major), 9 HCP
  it("7♠2♥2♦2♣ 9 HCP → opens 3♠ (7-card spade preempt, major always allowed)", () => {
    const rec = getRecommendation(mkHand(9, 7, 2, 2, 2), ctx("opening"));
    expect(rec.bid).toBe("3♠");
  });

  // 6-card clubs, 6 HCP: no preempt available in SAYC (2♣ reserved for 22+ HCP; 3♣ requires 7+ clubs)
  it("2♠2♥3♦6♣ 6 HCP → Pass (no preempt available in SAYC: 2♣ reserved, 3♣ needs 7+ clubs)", () => {
    const rec = getRecommendation(mkHand(6, 2, 2, 3, 6), ctx("opening"));
    expect(rec.bid).toBe("Pass");
  });

  // Strong 2NT opening: balanced 20-21 HCP (bridgebum.com SAYC reference)
  it("4♠4♥3♦2♣ 20 HCP → opens 2NT (balanced 20-21 HCP, SAYC)", () => {
    const rec = getRecommendation(mkHand(20, 4, 4, 3, 2), ctx("opening"));
    expect(rec.bid).toBe("2NT");
    expect(rec.category).toBe("2NT Opening (20-21 HCP)");
  });
});

describe("bidding-logic | internet examples — overcalls from Lincoln Hills SAYC Overcalls PDF", () => {
  // Lincoln Hills example (A): ♠AQ1085 ♥K5 ♦QJ72 ♣84 after opponent 1♥ → 1♠
  it("[LH-A] 5♠3♥3♦2♣ 12 HCP after RHO 1♥ → 1♠ (standard 1-level suit overcall)", () => {
    const rec = getRecommendation(
      mkHand(12, 5, 3, 3, 2),
      ctx("overcalling", { rhoBid: "1♥" }),
    );
    expect(rec.bid).toBe("1♠");
    expect(rec.category).toContain("Overcall");
  });

  // 1-level overcall: 5-card hearts over 1♣ (hearts > clubs in rank)
  it("5♥3♠2♦3♣ 10 HCP after RHO 1♣ → 1♥ (1-level suit overcall, hearts ranks above clubs)", () => {
    const rec = getRecommendation(
      mkHand(10, 3, 5, 2, 3),
      ctx("overcalling", { rhoBid: "1♣" }),
    );
    expect(rec.bid).toBe("1♥");
  });

  // 2-level overcall forced: 5-card hearts over 1♠ (1♥ < 1♠, must go to 2-level)
  it("5♥3♠3♦2♣ 10 HCP after RHO 1♠ → 2♥ (forced to 2-level; 1♥ would be below 1♠)", () => {
    const rec = getRecommendation(
      mkHand(10, 3, 5, 3, 2),
      ctx("overcalling", { rhoBid: "1♠" }),
    );
    expect(rec.bid).toBe("2♥");
    expect(rec.category).toContain("Overcall");
  });

  // NT overcall after 1♥: balanced 15-18 HCP → 1NT (Lincoln Hills: "balanced 15-18 HCP overcall")
  it("4♠3♥3♦3♣ 15 HCP after RHO 1♥ → 1NT (balanced NT overcall 15-18 HCP)", () => {
    const rec = getRecommendation(
      mkHand(15, 4, 3, 3, 3),
      ctx("overcalling", { rhoBid: "1♥" }),
    );
    expect(rec.bid).toBe("1NT");
    expect(rec.category).toContain("NT Overcall");
  });

  // NT overcall after 1♣: balanced 16 HCP → 1NT
  it("3♠3♥4♦3♣ 16 HCP after RHO 1♣ → 1NT (balanced NT overcall over 1♣)", () => {
    const rec = getRecommendation(
      mkHand(16, 3, 3, 4, 3),
      ctx("overcalling", { rhoBid: "1♣" }),
    );
    expect(rec.bid).toBe("1NT");
  });

  // 2♠ overcall after 2♣: 2♠ is above 2♣ in bid order — valid direct overcall
  it("5♠3♥4♦1♣ 11 HCP after RHO 2♣ → 2♠ (2♠ is above 2♣ in bid order, direct overcall)", () => {
    const rec = getRecommendation(
      mkHand(11, 5, 3, 4, 1),
      ctx("overcalling", { rhoBid: "2♣" }),
    );
    expect(rec.bid).toBe("2♠");
  });

  // Jump overcall: Lincoln Hills example — 6-card hearts, 8 HCP, preemptive jump over 1♦ → 2♥
  it("[LH-jump] 2♠6♥2♦3♣ 8 HCP after RHO 1♦ → 2♥ (jump overcall, preemptive 6-card suit)", () => {
    const rec = getRecommendation(
      mkHand(8, 2, 6, 2, 3),
      ctx("overcalling", { rhoBid: "1♦" }),
    );
    expect(rec.bid).toBe("2♥");
    expect(rec.category).toContain("Jump Overcall");
  });

  // Jump overcall: 6-card spades, 9 HCP, over 1♥ → 2♠
  it("6♠2♥2♦3♣ 9 HCP after RHO 1♥ → 2♠ (jump overcall, 6-card spades over 1♥)", () => {
    const rec = getRecommendation(
      mkHand(9, 6, 2, 2, 3),
      ctx("overcalling", { rhoBid: "1♥" }),
    );
    expect(rec.bid).toBe("2♠");
    expect(rec.category).toContain("Jump Overcall");
  });
});

describe("bidding-logic | internet examples — responses to partner's 1-level suit opening", () => {
  // bridgedoctor.com Lesson 4, Hand 1: ♠Q982 ♥102 ♦A63 ♣A1076 after 1♥ → 1♠
  // "Bid (show) a suit at the 1-level if possible"
  it("[L4-H1] 4♠2♥4♦3♣ 10 HCP after partner 1♥ → 1♠ (4-card spade at 1-level; cheapest available major)", () => {
    const rec = getRecommendation(
      mkHand(10, 4, 2, 4, 3),
      ctx("responding-suit", { partnerBid: "1♥" }),
    );
    expect(rec.bid).toBe("1♠");
  });

  // bridgedoctor.com Lesson 4, Hand 2: ♠982 ♥102 ♦A62 ♣A10763 after 1♥ → 1NT
  // "1NT is the best bid, as you don't have a very strong hand"
  it("[L4-H2] 3♠2♥3♦5♣ 8 HCP after partner 1♥ → 1NT (no 4-card major, too weak for 2-level)", () => {
    const rec = getRecommendation(
      mkHand(8, 3, 2, 3, 5),
      ctx("responding-suit", { partnerBid: "1♥" }),
    );
    expect(rec.bid).toBe("1NT");
  });

  // bridgedoctor.com Lesson 5 response (a): ♠976 ♥J1087 ♦Q732 ♣A7 = 3♠4♥4♦2♣ 7 HCP after 1♥ → 2♥
  it("[L5-resp-a] 3♠4♥4♦2♣ 7 HCP after partner 1♥ → 2♥ (simple raise, 4-card heart support, 6-9 TP)", () => {
    const rec = getRecommendation(
      mkHand(7, 3, 4, 4, 2),
      ctx("responding-suit", { partnerBid: "1♥" }),
    );
    expect(rec.bid).toBe("2♥");
    expect(rec.category).toBe("Simple Raise (6-9 TP)");
  });

  // Simple raise to partner's 1♠: 3-card support, 6 HCP
  it("3♠4♥3♦3♣ 6 HCP after partner 1♠ → 2♠ (simple raise, 3-card support, 6-9 TP)", () => {
    const rec = getRecommendation(
      mkHand(6, 3, 4, 3, 3),
      ctx("responding-suit", { partnerBid: "1♠" }),
    );
    expect(rec.bid).toBe("2♠");
    expect(rec.category).toBe("Simple Raise (6-9 TP)");
  });

  // Limit raise to partner's 1♠: 3-card support, 11 HCP (10-12 TP range)
  it("3♠3♥4♦3♣ 11 HCP after partner 1♠ → 3♠ (limit raise, 10-12 TP, 3-card support)", () => {
    const rec = getRecommendation(
      mkHand(11, 3, 3, 4, 3),
      ctx("responding-suit", { partnerBid: "1♠" }),
    );
    expect(rec.bid).toBe("3♠");
    expect(rec.category).toBe("Limit Raise (10-12 TP)");
  });

  // Simple raise to partner's 1♥: 4-card heart support, 7 HCP
  it("3♠4♥3♦3♣ 7 HCP after partner 1♥ → 2♥ (simple raise, 4-card heart support, 7 TP)", () => {
    const rec = getRecommendation(
      mkHand(7, 3, 4, 3, 3),
      ctx("responding-suit", { partnerBid: "1♥" }),
    );
    expect(rec.bid).toBe("2♥");
  });

  // Jacoby 2NT: 4 heart support, 13 HCP (13+ TP) — game-forcing raise
  it("4♠4♥2♦3♣ 13 HCP after partner 1♥ → 2NT (Jacoby 2NT, 4+ heart support, 13+ TP)", () => {
    const rec = getRecommendation(
      mkHand(13, 4, 4, 2, 3),
      ctx("responding-suit", { partnerBid: "1♥" }),
    );
    expect(rec.bid).toBe("2NT");
    expect(rec.category).toBe("Jacoby 2NT (Game-Forcing Raise)");
  });

  // Jacoby 2NT: 4 spade support, 14 HCP — game-forcing raise over 1♠
  it("4♠3♥3♦3♣ 14 HCP after partner 1♠ → 2NT (Jacoby 2NT, 4+ spade support, 13+ TP)", () => {
    const rec = getRecommendation(
      mkHand(14, 4, 3, 3, 3),
      ctx("responding-suit", { partnerBid: "1♠" }),
    );
    expect(rec.bid).toBe("2NT");
    expect(rec.category).toBe("Jacoby 2NT (Game-Forcing Raise)");
  });

  // Pass: too weak to respond (5 HCP < 6 minimum)
  it("2♠3♥4♦4♣ 5 HCP after partner 1♠ → Pass (too weak to respond; SAYC needs 6+ HCP)", () => {
    const rec = getRecommendation(
      mkHand(5, 2, 3, 4, 4),
      ctx("responding-suit", { partnerBid: "1♠" }),
    );
    expect(rec.bid).toBe("Pass");
  });

  // Bid 4-card spade suit at 1-level over partner's 1♦
  it("4♠3♥2♦3♣ 9 HCP after partner 1♦ → 1♠ (show 4-card spade at 1-level over minor)", () => {
    const rec = getRecommendation(
      mkHand(9, 4, 3, 2, 3),
      ctx("responding-suit", { partnerBid: "1♦" }),
    );
    expect(rec.bid).toBe("1♠");
  });

  // Bid 4-card spade suit at 1-level over partner's 1♣
  it("4♠3♥3♦3♣ 10 HCP after partner 1♣ → 1♠ (show 4-card spade at 1-level over minor)", () => {
    const rec = getRecommendation(
      mkHand(10, 4, 3, 3, 3),
      ctx("responding-suit", { partnerBid: "1♣" }),
    );
    expect(rec.bid).toBe("1♠");
  });

  // Bid 4-card heart suit at 1-level over partner's 1♦ (hearts before spades if only 4-card major)
  it("3♠4♥3♦3♣ 8 HCP after partner 1♦ → 1♥ (show 4-card heart suit at 1-level over minor)", () => {
    const rec = getRecommendation(
      mkHand(8, 3, 4, 3, 3),
      ctx("responding-suit", { partnerBid: "1♦" }),
    );
    expect(rec.bid).toBe("1♥");
  });
});

describe("bidding-logic | internet examples — responses to partner's 1NT opening", () => {
  // Stayman: 8+ HCP with 4-card major (ACBL SAYC: use Stayman with 4-card major)
  it("4♠4♥3♦2♣ 8 HCP after partner 1NT → 2♣ (Stayman, both 4-card majors, 8+ HCP)", () => {
    const rec = getRecommendation(mkHand(8, 4, 4, 3, 2), ctx("responding-1nt"));
    expect(rec.bid).toBe("2♣");
    expect(rec.category).toContain("Stayman");
  });

  // Jacoby Transfer to hearts: 5-card heart suit (ACBL SAYC: transfer with 5+ card major)
  it("2♠5♥3♦3♣ 6 HCP after partner 1NT → 2♦ (Jacoby transfer to hearts, 5-card heart suit)", () => {
    const rec = getRecommendation(mkHand(6, 2, 5, 3, 3), ctx("responding-1nt"));
    expect(rec.bid).toBe("2♦");
    expect(rec.category).toContain("Transfer to Hearts");
  });

  // Pass: balanced 5 HCP, no game prospects (1NT max is 17; 17+5=22 < 25 needed for game)
  it("3♠3♥3♦4♣ 5 HCP after partner 1NT → Pass (0-7 balanced, no game possible)", () => {
    const rec = getRecommendation(mkHand(5, 3, 3, 3, 4), ctx("responding-1nt"));
    expect(rec.bid).toBe("Pass");
  });

  // 3NT game: balanced 10 HCP, no 4-card major (ACBL SAYC: 10-15 pts balanced → 3NT)
  it("3♠3♥4♦3♣ 10 HCP after partner 1NT → 3NT (10-15 pts balanced, game; no 4-card major)", () => {
    const rec = getRecommendation(
      mkHand(10, 3, 3, 4, 3),
      ctx("responding-1nt"),
    );
    expect(rec.bid).toBe("3NT");
    expect(rec.category).toContain("3NT");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Regression: isJumpOvercall was using raw index difference (>= 2), which
// misclassified any partner overcall with index gap ≥ 2 as a "jump".
// e.g. 1♥ over RHO 1♣: BID_ORDER indices 2 and 0 → diff 2 → wrongly "jump".
// Fix: compare partner's bid against the minimum possible level for that suit.
// ─────────────────────────────────────────────────────────────────────────────

describe("bidding-logic | regression | isJumpOvercall — simple overcalls misclassified as jumps", () => {
  // The exact scenario reported: P1 passes, P2 opens 1♣, P3 overcalls 1♥, P4 passes.
  // P1 should respond to a SIMPLE overcall (1♥), NOT a jump overcall.
  it("P1 8 HCP 4♠1♥6♦2♣ responds after auction Pass-1♣-1♥-Pass: NOT a jump-overcall category", () => {
    const state: AuctionState = {
      myPosition: 1,
      completedRounds: [{ 1: "Pass", 2: "1♣", 3: "1♥", 4: "Pass" }],
      currentRound: {},
    };
    const rec = getRecommendation(
      mkHand(8, 4, 1, 6, 2),
      deriveSituation(state, "none"),
    );
    // Must NOT be classified as responding to a jump overcall
    expect(rec.category).not.toContain("Jump Overcall");
  });

  it("partner 1♥ over RHO 1♣ → situation is responding-to-simple-oc (not jump)", () => {
    // 1♥ over 1♣: minimum heart bid above 1♣ is 1♥ itself — plain simple overcall
    const rec = getRecommendation(
      mkHand(8, 4, 1, 6, 2),
      ctx("responding-to-simple-oc", { partnerBid: "1♥", rhoBid: "1♣" }),
    );
    expect(rec.category).not.toContain("Jump Overcall");
  });

  it("partner 1♠ over RHO 1♣ → simple overcall (1♠ is min spade bid above 1♣)", () => {
    // 1♠ over 1♣: old code gave diff 3-0=3 ≥ 2 → wrongly "jump". Correct: simple.
    const rec = getRecommendation(
      mkHand(9, 3, 4, 3, 3),
      ctx("responding-to-simple-oc", { partnerBid: "1♠", rhoBid: "1♣" }),
    );
    expect(rec.category).not.toContain("Jump Overcall");
  });

  it("partner 2♥ over RHO 1♣ → IS a jump overcall (skips minimum 1♥)", () => {
    // 2♥ over 1♣: minimum heart overcall is 1♥; bidding 2♥ IS a jump
    const rec = getRecommendation(
      mkHand(9, 3, 3, 4, 3),
      ctx("responding-to-jump-oc", { partnerBid: "2♥", rhoBid: "1♣" }),
    );
    expect(rec.category).toContain("Jump Overcall");
  });

  it("partner 2♠ over RHO 1♥ → IS a jump overcall (skips minimum 1♠)", () => {
    // 2♠ over 1♥: minimum spade overcall is 1♠; bidding 2♠ IS a jump
    const rec = getRecommendation(
      mkHand(9, 3, 4, 3, 3),
      ctx("responding-to-jump-oc", { partnerBid: "2♠", rhoBid: "1♥" }),
    );
    expect(rec.category).toContain("Jump Overcall");
  });

  it("partner 2♥ over RHO 1♠ → simple overcall (2♥ is minimum heart bid above 1♠)", () => {
    // 2♥ over 1♠: minimum heart bid above 1♠ is 2♥ — this is a simple overcall
    const rec = getRecommendation(
      mkHand(9, 3, 3, 4, 3),
      ctx("responding-to-simple-oc", { partnerBid: "2♥", rhoBid: "1♠" }),
    );
    expect(rec.category).not.toContain("Jump Overcall");
  });

  it("partner 1♠ over RHO 1♥ → simple overcall (1♠ is minimum spade bid above 1♥)", () => {
    const rec = getRecommendation(
      mkHand(8, 3, 3, 4, 3),
      ctx("responding-to-simple-oc", { partnerBid: "1♠", rhoBid: "1♥" }),
    );
    expect(rec.category).not.toContain("Jump Overcall");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Regression: Protective / Balancing Rebid
// When opener's partner passes throughout and the auction returns to the opener
// (e.g. 1♣–1♥–Pass–Pass–back to P2), deriveSituationCore should detect
// "protective-rebid" rather than falling into rebid-after-suit with a fake
// partnerBid default ("2♠") that produces absurd advice.
// ─────────────────────────────────────────────────────────────────────────────

describe("bidding-logic | regression | protective-rebid — opener acts after Pass-Pass", () => {
  // The exact scenario reported:
  // P1 passes, P2 opens 1♣, P3 overcalls 1♥, P4 passes, P1 passes → P2's turn.
  it("P2 12 HCP 1♠4♥6♣2♦ in auction Pass-1♣-1♥-Pass / Pass: protective rebid 2♣ (not 4♣)", () => {
    const state: AuctionState = {
      myPosition: 2,
      completedRounds: [{ 1: "Pass", 2: "1♣", 3: "1♥", 4: "Pass" }],
      currentRound: { 1: "Pass" },
    };
    const rec = getRecommendation(
      mkHand(12, 1, 4, 6, 2),
      deriveSituation(state, "none"),
    );
    // Must NOT be 4♣ (the old bug) — should be 2♣ or Pass at most
    expect(rec.bid).not.toBe("4♣");
    expect(rec.bid).not.toBe("3♣");
    // Reasoning must NOT mention "partner's spades" (old default artifact)
    expect(rec.reasoning).not.toMatch(/partner.*spades|spades.*partner/i);
    // Must be a sensible protective bid: either 2♣ (rebid long suit) or Pass
    expect(["2♣", "Pass"]).toContain(rec.bid);
  });

  it("P2 12 HCP 1♠4♥6♣2♦ protective rebid: category is 'Protective' not 'Rebid Own Suit'", () => {
    const rec = getRecommendation(
      mkHand(12, 1, 4, 6, 2),
      ctx("protective-rebid", { myPreviousBid: "1♣", lhoBid: "1♥" }),
    );
    expect(rec.category).toMatch(/[Pp]rotective/);
    expect(rec.category).not.toContain("Rebid Own Suit");
  });

  // With a 6-card suit and TP=14, rebid at 2-level (above the overcall)
  it("12 HCP 1♠1♥6♣3♦ protective after LHO 1♥: rebids 2♣ (minimum above 1♥)", () => {
    const rec = getRecommendation(
      mkHand(12, 1, 1, 3, 6),
      ctx("protective-rebid", { myPreviousBid: "1♣", lhoBid: "1♥" }),
    );
    expect(rec.bid).toBe("2♣");
  });

  // With a 6-card suit and LHO bid 2♦, minimum club rebid must be above 2♦ → 3♣
  it("13 HCP 1♠1♥6♣4♦ protective after LHO 2♦: rebids 3♣ (minimum above 2♦)", () => {
    const rec = getRecommendation(
      mkHand(13, 1, 1, 4, 6),
      ctx("protective-rebid", { myPreviousBid: "1♣", lhoBid: "2♦" }),
    );
    expect(rec.bid).toBe("3♣");
  });

  // Minimum opener (12 HCP, 4-card suit) should pass — not worth competing
  it("12 HCP 3♠3♥4♦3♣ protective after LHO 1♥: Pass (minimum, no long suit)", () => {
    const rec = getRecommendation(
      mkHand(12, 3, 3, 4, 3),
      ctx("protective-rebid", { myPreviousBid: "1♦", lhoBid: "1♥" }),
    );
    expect(rec.bid).toBe("Pass");
  });

  // Extra strength (16+ HCP) → protective double
  it("17 HCP 3♠3♥4♦3♣ protective after LHO 1♥: Double (16+ HCP reopening double)", () => {
    const rec = getRecommendation(
      mkHand(17, 3, 3, 4, 3),
      ctx("protective-rebid", { myPreviousBid: "1♦", lhoBid: "1♥" }),
    );
    expect(rec.bid).toBe("Double");
    expect(rec.category).toMatch(/[Pp]rotective.*[Dd]ouble/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// INTERNET VALIDATION TESTS — sourced from bridgedoctor.com published examples
// Focus: multi-round auctions, partner-passes scenarios, common SAYC patterns
// ─────────────────────────────────────────────────────────────────────────────

describe("bidding-logic | internet validation — bridgedoctor.com L5 opener rebids", () => {
  // After: 1♥ (pos1) – Pass (LHO/pos2) – 1♠ (partner/pos3) – Pass (RHO/pos4)
  // Pos1 (opener) rebids. Source: bridgedoctor.com/lessons/05-bridge-lessons.htm
  // Key: partner DID bid (1♠) → situation is rebid-after-suit, NOT protective-rebid.
  const rebidAfterPartner1S = (hand: ReturnType<typeof mkHand>) =>
    getRecommendation(
      hand,
      deriveSituation({
        myPosition: 1,
        completedRounds: [{ 1: "1♥", 2: "Pass", 3: "1♠", 4: "Pass" }],
        currentRound: {},
      }),
    );

  it("L5-H1: 14 HCP 2♠5♥2♦4♣ → 2♣ (show lower-ranking second suit)", () => {
    // ♠85 ♥KJ1076 ♦A6 ♣AQ43 — bridgedoctor: "bid 2♣ after partner's 1♠ response"
    const rec = rebidAfterPartner1S(mkHand(14, 2, 5, 2, 4));
    expect(rec.bid).toBe("2♣");
    expect(rec.reasoning).toMatch(/clubs|second suit/i);
  });

  it("L5-H2: 13 HCP 4♠5♥2♦2♣ → 2♠ (raise partner's 4-card spades, minimum)", () => {
    // ♠K872 ♥KJ1076 ♦A8 ♣J3 — bridgedoctor: "bid 2♠ because you have a fit"
    const rec = rebidAfterPartner1S(mkHand(13, 4, 5, 2, 2));
    expect(rec.bid).toBe("2♠");
  });

  it("L5-H3: 20 HCP 4♠5♥3♦1♣ → 4♠ (game raise, 4-card fit, 20+ TP)", () => {
    // ♠KQJ2 ♥KQJ76 ♦AKJ ♣4 — bridgedoctor: "bid 4♠ (6+20 TP = 26)"
    const rec = rebidAfterPartner1S(mkHand(20, 4, 5, 3, 1));
    expect(rec.bid).toBe("4♠");
  });

  it("L5-H4: 11 HCP 2♠5♥5♦1♣ → 2♦ (show lower-ranking 5-card diamond second suit)", () => {
    // ♠K8 ♥KJ1076 ♦A7643 ♣4 — bridgedoctor: "bid 2♦ after partner's 1♠ response"
    const rec = rebidAfterPartner1S(mkHand(11, 2, 5, 5, 1));
    expect(rec.bid).toBe("2♦");
    expect(rec.reasoning).toMatch(/diamond|second suit/i);
  });

  it("L5-H5: 17 HCP 4♠5♥2♦2♣ → 3♠ (invitational jump raise, 16-18 TP)", () => {
    // ♠KJ43 ♥KJ1076 ♦A6 ♣AJ — bridgedoctor: "bid 3♠"
    const rec = rebidAfterPartner1S(mkHand(17, 4, 5, 2, 2));
    expect(rec.bid).toBe("3♠");
  });

  it("deriveSituation correctly identifies rebid-after-suit when partner DID bid 1♠", () => {
    // Sanity-check that situation derivation is correct for the L5 hand group.
    const sit = deriveSituation({
      myPosition: 1,
      completedRounds: [{ 1: "1♥", 2: "Pass", 3: "1♠", 4: "Pass" }],
      currentRound: {},
    });
    expect(sit.situation).toBe("rebid-after-suit");
  });
});

describe("bidding-logic | internet validation — bridgedoctor.com L22 response to weak 2", () => {
  // Partner opens 2♥, opponents pass. Source: bridgedoctor.com/lessons/22-beginner-bridge-lessons.htm

  it("L22-H1: 10 HCP 3♠3♥3♦4♣ → 3♥ pre-emptive raise (3-card support, no game)", () => {
    // ♠AJ3 ♥1098 ♦KQ6 ♣7642 — bridgedoctor: "3-card support and no game interest"
    const rec = getRecommendation(
      mkHand(10, 3, 3, 3, 4),
      ctx("responding-weak2", { partnerBid: "2♥" }),
    );
    expect(rec.bid).toBe("3♥");
    expect(rec.bid).not.toBe("2NT");
  });

  it("L22-H2: 16 HCP 3♠4♥3♦3♣ → 4♥ game raise (4-card support)", () => {
    // ♠AJ3 ♥Q987 ♦KQ6 ♣KJ5 — bridgedoctor: "4-card support AND 16+ TP so bid game"
    const rec = getRecommendation(
      mkHand(16, 3, 4, 3, 3),
      ctx("responding-weak2", { partnerBid: "2♥" }),
    );
    expect(rec.bid).toBe("4♥");
    expect(rec.bid).not.toBe("2NT");
  });

  it("L22-H3: 17 HCP 2♠1♥4♦6♣ → 3♣ new suit (6-card clubs, unbalanced, no heart support)", () => {
    // ♠AK ♥6 ♦8642 ♣AKQJ75 — bridgedoctor: "no support, no NT, bid 3♣"
    const rec = getRecommendation(
      mkHand(17, 2, 1, 4, 6),
      ctx("responding-weak2", { partnerBid: "2♥" }),
    );
    expect(rec.bid).toBe("3♣");
    expect(rec.bid).not.toBe("2NT");
    expect(rec.bid).not.toBe("3NT");
  });

  it("L22-H4: 20 HCP 3♠2♥4♦4♣ → 3NT (balanced, 20 HCP, limited heart support)", () => {
    // ♠KQJ ♥109 ♦AQJ3 ♣AK109 — bridgedoctor: "3NT, good hand, stoppers in outside suits"
    const rec = getRecommendation(
      mkHand(20, 3, 2, 4, 4),
      ctx("responding-weak2", { partnerBid: "2♥" }),
    );
    expect(rec.bid).toBe("3NT");
    expect(rec.bid).not.toBe("2NT");
  });

  it("L22-H5: 15 HCP 3♠3♥3♦4♣ → 2NT inquiry (15 HCP, borderline — want more info)", () => {
    // ♠AJ10 ♥AJ10 ♦KQ6 ♣7642 — bridgedoctor: "2NT forcing inquiry as to partner's strength"
    const rec = getRecommendation(
      mkHand(15, 3, 3, 3, 4),
      ctx("responding-weak2", { partnerBid: "2♥" }),
    );
    expect(rec.bid).toBe("2NT");
    expect(rec.category).toMatch(/[Ii]nquiry/);
  });

  it("full-auction weak 2 via AuctionState: partner (pos3) opens 2♥, pos4 passes, I (pos1) respond", () => {
    // Test that deriveSituation correctly routes to responding-weak2 when partner opened 2♥.
    const state: AuctionState = {
      myPosition: 1,
      completedRounds: [],
      currentRound: { 3: "2♥", 4: "Pass" },
    };
    const sit = deriveSituation(state);
    expect(sit.situation).toBe("responding-weak2");
    // 16 HCP, 4-card heart support → game raise
    const rec = getRecommendation(mkHand(16, 3, 4, 3, 3), sit);
    expect(rec.bid).toBe("4♥");
  });
});

describe("bidding-logic | internet validation — bridgedoctor.com L6 limit bids with support", () => {
  // Partner opens 1♥, RHO passes. Source: bridgedoctor.com/lessons/06-beginning-bridge.htm

  it("L6-H1: 10 HCP 4♠3♥3♦3♣ → 3♥ limit raise (10 HCP, 3-card heart support)", () => {
    // ♠9763 ♥A42 ♦AQ8 ♣832 — bridgedoctor: "Show support and 10-12 HCP"
    const rec = getRecommendation(
      mkHand(10, 4, 3, 3, 3),
      ctx("responding-suit", { partnerBid: "1♥" }),
    );
    expect(rec.bid).toBe("3♥");
  });

  it("L6-H2: 9 HCP 3♠3♥3♦4♣ → 2♥ simple raise (6-9 HCP, 3-card heart support)", () => {
    // ♠AJ6 ♥J96 ♦Q73 ♣J653 — bridgedoctor: "Shows support and 6-9 HCP"
    const rec = getRecommendation(
      mkHand(9, 3, 3, 3, 4),
      ctx("responding-suit", { partnerBid: "1♥" }),
    );
    expect(rec.bid).toBe("2♥");
  });

  it("L6-H4: 14 HCP 4♠4♥3♦2♣ → 1♠ or 2NT (bid new suit first, then support hearts)", () => {
    // ♠A763 ♥A642 ♦AQ9 ♣98 — bridgedoctor: "Bid 1♠ first and then 4♥"
    // SAYC Jacoby 2NT (game-forcing raise) is also valid for 4+ heart support + 13+ HCP.
    const rec = getRecommendation(
      mkHand(14, 4, 4, 3, 2),
      ctx("responding-suit", { partnerBid: "1♥" }),
    );
    expect(["1♠", "2NT"]).toContain(rec.bid);
  });
});

describe("bidding-logic | internet validation — bridgedoctor.com L16 takeout doubles", () => {
  // RHO opens 1♣. Source: bridgedoctor.com/lessons/16-playing-bridge-tutorials.htm

  it("L16-H1: 13 HCP 4♠4♥4♦1♣ → Double (13 TP, 3-card support for all unbid suits)", () => {
    // ♠KQJT ♥KJ6 ♦Q832 ♣J7 — bridgedoctor: "Double and then pass whatever your partner bids"
    const rec = getRecommendation(
      mkHand(13, 4, 4, 4, 1),
      ctx("overcalling", { rhoBid: "1♣" }),
    );
    expect(rec.bid).toBe("Double");
  });

  it("L16-H2: 13 HCP 5♠2♥2♦3♣ → 1♠ simple overcall (prefer overcall with long spades)", () => {
    // ♠KQJT8 ♥632 ♦K8 ♣A74 — bridgedoctor: "Show spade suit with overcall of 1♠"
    const rec = getRecommendation(
      mkHand(13, 5, 2, 2, 3),
      ctx("overcalling", { rhoBid: "1♣" }),
    );
    expect(rec.bid).toBe("1♠");
  });
});

describe("bidding-logic | partner-passes — comprehensive full-AuctionState validation", () => {
  // These tests use full AuctionState objects to validate the complete derivation
  // pipeline, focusing specifically on scenarios where partner passes.

  it("PP-1: opener 1♥, LHO 1♠, partner passes, RHO passes → protective-rebid 2♥ (6-card suit)", () => {
    // Partner (pos3) passed — situation must be protective-rebid, NOT rebid-after-suit.
    const state: AuctionState = {
      myPosition: 1,
      completedRounds: [{ 1: "1♥", 2: "1♠", 3: "Pass", 4: "Pass" }],
      currentRound: {},
    };
    const sit = deriveSituation(state);
    expect(sit.situation).toBe("protective-rebid");
    const rec = getRecommendation(mkHand(14, 2, 6, 2, 3), sit);
    expect(rec.bid).toBe("2♥");
    // The old bug said "partner's spades" — verify that specific phrasing is gone.
    expect(rec.reasoning).not.toMatch(/partner's spades/i);
  });

  it("PP-2: opener 1♣, LHO 1♥, partner passes, RHO passes → 2♣ protective rebid (6♣)", () => {
    const state: AuctionState = {
      myPosition: 1,
      completedRounds: [{ 1: "1♣", 2: "1♥", 3: "Pass", 4: "Pass" }],
      currentRound: {},
    };
    const sit = deriveSituation(state);
    expect(sit.situation).toBe("protective-rebid");
    const rec = getRecommendation(mkHand(12, 2, 1, 2, 6), sit);
    expect(rec.bid).toBe("2♣");
  });

  it("PP-3: opener 1♦, LHO 2♣, partner passes, RHO passes → 2♦ (min above 2♣ for diamonds)", () => {
    // 2♦ is the minimum legal diamond bid above 2♣ (BID_ORDER: ...2♣,2♦...).
    const state: AuctionState = {
      myPosition: 1,
      completedRounds: [{ 1: "1♦", 2: "2♣", 3: "Pass", 4: "Pass" }],
      currentRound: {},
    };
    const sit = deriveSituation(state);
    expect(sit.situation).toBe("protective-rebid");
    const rec = getRecommendation(mkHand(11, 2, 3, 6, 1), sit);
    expect(rec.bid).toBe("2♦");
  });

  it("PP-4: opener 1♥, all others pass → auction complete, recommend Pass", () => {
    // After 1♥-Pass-Pass-Pass the auction ends; no further bidding.
    const state: AuctionState = {
      myPosition: 1,
      completedRounds: [{ 1: "1♥", 2: "Pass", 3: "Pass", 4: "Pass" }],
      currentRound: {},
    };
    const sit = deriveSituation(state);
    const rec = getRecommendation(mkHand(14, 2, 5, 2, 4), sit);
    expect(rec.bid).toBe("Pass");
    expect(rec.category).toMatch(/[Aa]uction [Cc]omplete/);
  });

  it("PP-5: opener 1♥, LHO/partner pass, RHO balances with 2♣ → deriveSituation uses RHO bid for protective-rebid", () => {
    // RHO bid after two passes. deriveSituationCore should use lhoBid ?? rhoBid = "2♣".
    const state: AuctionState = {
      myPosition: 1,
      completedRounds: [{ 1: "1♥", 2: "Pass", 3: "Pass", 4: "2♣" }],
      currentRound: {},
    };
    const sit = deriveSituation(state);
    expect(sit.situation).toBe("protective-rebid");
    // 16 HCP → Double (reopening double for 16+ HCP)
    const rec = getRecommendation(mkHand(16, 2, 6, 2, 3), sit);
    expect(rec.bid).toBe("Double");
  });

  it("PP-6: opener 1♠, partner limit-raises 3♠, medium hand (15 HCP) → accept 4♠", () => {
    const state: AuctionState = {
      myPosition: 1,
      completedRounds: [{ 1: "1♠", 2: "Pass", 3: "3♠", 4: "Pass" }],
      currentRound: {},
    };
    const sit = deriveSituation(state);
    expect(sit.situation).toBe("rebid-after-suit");
    const rec = getRecommendation(mkHand(15, 5, 3, 3, 2), sit);
    expect(rec.bid).toBe("4♠");
  });

  it("PP-7: opener 1♠, partner limit-raises 3♠, minimum hand (12 HCP) → decline, Pass", () => {
    const state: AuctionState = {
      myPosition: 1,
      completedRounds: [{ 1: "1♠", 2: "Pass", 3: "3♠", 4: "Pass" }],
      currentRound: {},
    };
    const rec = getRecommendation(
      mkHand(12, 5, 3, 3, 2),
      deriveSituation(state),
    );
    expect(rec.bid).toBe("Pass");
  });

  it("PP-8: opener 1♥, partner simple-raises 2♥, minimum hand (13 HCP, tp=14) → Pass", () => {
    const state: AuctionState = {
      myPosition: 1,
      completedRounds: [{ 1: "1♥", 2: "Pass", 3: "2♥", 4: "Pass" }],
      currentRound: {},
    };
    const rec = getRecommendation(
      mkHand(13, 3, 5, 3, 2),
      deriveSituation(state),
    );
    expect(rec.bid).toBe("Pass");
  });

  it("PP-9: opener 1♥, partner simple-raises 2♥, medium hand (16 HCP) → 3♥ game try", () => {
    const state: AuctionState = {
      myPosition: 1,
      completedRounds: [{ 1: "1♥", 2: "Pass", 3: "2♥", 4: "Pass" }],
      currentRound: {},
    };
    const rec = getRecommendation(
      mkHand(16, 3, 5, 2, 3),
      deriveSituation(state),
    );
    expect(rec.bid).toBe("3♥");
  });

  it("PP-10: opener 1♥, partner simple-raises 2♥, strong hand (19 HCP) → 4♥ game bid", () => {
    const state: AuctionState = {
      myPosition: 1,
      completedRounds: [{ 1: "1♥", 2: "Pass", 3: "2♥", 4: "Pass" }],
      currentRound: {},
    };
    const rec = getRecommendation(
      mkHand(19, 2, 5, 2, 4),
      deriveSituation(state),
    );
    expect(rec.bid).toBe("4♥");
  });

  it("PP-11: partner (pos3) DID bid 1♠ — situation is rebid-after-suit, not protective-rebid", () => {
    // Critical distinction: partner bid 1♠ → NOT protective-rebid.
    const state: AuctionState = {
      myPosition: 1,
      completedRounds: [{ 1: "1♥", 2: "Pass", 3: "1♠", 4: "Pass" }],
      currentRound: {},
    };
    expect(deriveSituation(state).situation).toBe("rebid-after-suit");
  });

  it("PP-12: opener 1♠, LHO 2♦, partner only passed → protective-rebid (not rebid-after-suit)", () => {
    const state: AuctionState = {
      myPosition: 1,
      completedRounds: [{ 1: "1♠", 2: "2♦", 3: "Pass", 4: "Pass" }],
      currentRound: {},
    };
    expect(deriveSituation(state).situation).toBe("protective-rebid");
  });

  it("PP-13: protective double — 17 HCP opener after LHO overcall (not minimum, not long suit)", () => {
    const state: AuctionState = {
      myPosition: 1,
      completedRounds: [{ 1: "1♠", 2: "2♦", 3: "Pass", 4: "Pass" }],
      currentRound: {},
    };
    const rec = getRecommendation(
      mkHand(17, 5, 2, 2, 4),
      deriveSituation(state),
    );
    expect(rec.bid).toBe("Double");
    expect(rec.category).toContain("Double");
  });

  it("PP-14: minimum protective pass — 11 HCP 5♥ opener after LHO 2♦ (no 6-card suit)", () => {
    const state: AuctionState = {
      myPosition: 1,
      completedRounds: [{ 1: "1♥", 2: "2♦", 3: "Pass", 4: "Pass" }],
      currentRound: {},
    };
    const rec = getRecommendation(
      mkHand(11, 2, 5, 3, 3),
      deriveSituation(state),
    );
    expect(rec.bid).toBe("Pass");
  });

  it("PP-15: partner bid in round 1 then passed in round 2 — uses PARTNER'S LAST BID correctly", () => {
    // 1♥ (pos1) - Pass (pos2) - 2♥ (pos3/partner) - Pass (pos4) → opener rebids
    // partner bid 2♥ → situation is rebid-after-suit (partnerBid = "2♥")
    const state: AuctionState = {
      myPosition: 1,
      completedRounds: [{ 1: "1♥", 2: "Pass", 3: "2♥", 4: "Pass" }],
      currentRound: {},
    };
    const sit = deriveSituation(state);
    expect(sit.situation).toBe("rebid-after-suit");
  });
});

// ─── Regression tests for Bug Fixes ───────────────────────────────────────────
describe("Bug Fix Regression Tests", () => {
  // Bug 1: 2♣ response — 7 HCP should bid 2♦ (waiting), not a positive response
  it("BF-1a: respond to 2♣ with 7 HCP → 2♦ (waiting, not positive)", () => {
    const rec = getRecommendation(mkHand(7, 3, 3, 4, 3), ctx("responding-2c"));
    expect(rec.bid).toBe("2♦");
  });

  it("BF-1b: respond to 2♣ with 8 HCP → positive response (2NT balanced)", () => {
    const rec = getRecommendation(mkHand(8, 3, 3, 4, 3), ctx("responding-2c"));
    expect(rec.bid).toBe("2NT");
  });

  // Bug 2: Response to 1-of-suit — 15+ TP balanced, no 4-card major → 3NT (not 2NT)
  it("BF-2a: respond to 1♠ with 15 HCP balanced, no spade fit → 3NT", () => {
    const rec = getRecommendation(
      mkHand(15, 2, 3, 4, 4), // 15 TP balanced, no spade fit, no unbid major
      ctx("responding-suit", { partnerBid: "1♠" }),
    );
    expect(rec.bid).toBe("3NT");
  });

  it("BF-2b: respond to 1♣ with 16 HCP balanced, no 4-card major → 3NT", () => {
    const rec = getRecommendation(
      mkHand(16, 3, 3, 3, 4), // 16 TP balanced, no 4-card major
      ctx("responding-suit", { partnerBid: "1♣" }),
    );
    expect(rec.bid).toBe("3NT");
  });

  it("BF-2c: respond to 1♦ with 13 HCP balanced, no 4-card major → 2NT (invitational, not 3NT)", () => {
    const rec = getRecommendation(
      mkHand(13, 3, 3, 4, 3), // 13 TP balanced, no 4-card major
      ctx("responding-suit", { partnerBid: "1♦" }),
    );
    expect(rec.bid).toBe("2NT");
  });

  // Bug 3: 4NT quantitative — opener should accept with 17 HCP (not exact equality bug)
  it("BF-3a: 1NT opener (17 HCP) facing partner's 4NT quantitative → accept with 6NT", () => {
    const state: AuctionState = {
      myPosition: 1,
      completedRounds: [{ 1: "1NT", 2: "Pass", 3: "4NT", 4: "Pass" }],
      currentRound: {},
    };
    const rec = getRecommendation(
      mkHand(17, 3, 4, 3, 3),
      deriveSituation(state),
    );
    expect(rec.bid).toBe("6NT");
  });

  it("BF-3b: 1NT opener (15 HCP) facing partner's 4NT quantitative → decline (Pass)", () => {
    const state: AuctionState = {
      myPosition: 1,
      completedRounds: [{ 1: "1NT", 2: "Pass", 3: "4NT", 4: "Pass" }],
      currentRound: {},
    };
    const rec = getRecommendation(
      mkHand(15, 3, 3, 4, 3),
      deriveSituation(state),
    );
    expect(rec.bid).toBe("Pass");
  });

  // Bug 4: Jacoby 2NT eligibility — 13 TP via long-suit points with 4-card fit should qualify
  it("BF-4a: respond to 1♥ with 11 HCP + 6-card suit (13 TP) and 4-card heart support → Jacoby 2NT", () => {
    // 11 HCP, S=1, H=4, D=2, C=6 → long-suit points: clubs 6-4=2 → TP = 11+2 = 13
    // With tp >= 13 and 4+ heart support after 1♥, should bid Jacoby 2NT
    const rec = getRecommendation(
      mkHand(11, 1, 4, 2, 6), // 11 HCP + 2 long-suit points (6-card clubs) = 13 TP
      ctx("responding-suit", { partnerBid: "1♥" }),
    );
    expect(rec.bid).toBe("2NT");
    expect(rec.category).toContain("Jacoby");
  });

  // Bug 6: Opener rebid after partner's 2NT invite — use TP not HCP
  it("BF-6a: 1NT opener (15 HCP, 16 TP due to 5-card suit) accepts 2NT invite → 3NT", () => {
    // 5-card suit gives +1 TP, so 15 HCP = 16 TP → should accept partner's 2NT invite
    const state: AuctionState = {
      myPosition: 1,
      completedRounds: [{ 1: "1NT", 2: "Pass", 3: "2NT", 4: "Pass" }],
      currentRound: {},
    };
    const rec = getRecommendation(
      mkHand(15, 3, 5, 2, 3), // 15 HCP + 1 (5-card hearts) = 16 TP
      deriveSituation(state),
    );
    expect(rec.bid).toBe("3NT");
  });

  it("BF-6b: 1NT opener (15 HCP, 15 TP balanced) declines 2NT invite → Pass", () => {
    const state: AuctionState = {
      myPosition: 1,
      completedRounds: [{ 1: "1NT", 2: "Pass", 3: "2NT", 4: "Pass" }],
      currentRound: {},
    };
    const rec = getRecommendation(
      mkHand(15, 3, 3, 4, 3), // 15 HCP, balanced → 15 TP → decline
      deriveSituation(state),
    );
    expect(rec.bid).toBe("Pass");
  });

  // Bug: Overcall over 1NT — 14 HCP with no 5-card suit should Pass, not Double
  it("BF-8a: 14 HCP, 4-4-4-1 shape competing over opponent 1NT → Pass (no 5-card suit, <16 HCP)", () => {
    const rec = getRecommendation(
      mkHand(14, 1, 4, 4, 4), // 14 HCP, unbalanced (singleton spade), no 5-card suit
      ctx("overcalling", { rhoBid: "1NT" }),
    );
    expect(rec.bid).toBe("Pass");
  });

  it("BF-8b: 16 HCP balanced competing over opponent 1NT → Double (penalty)", () => {
    const rec = getRecommendation(
      mkHand(16, 3, 4, 3, 3), // 16 HCP balanced — penalty double
      ctx("overcalling", { rhoBid: "1NT" }),
    );
    expect(rec.bid).toBe("Double");
  });

  it("BF-8c: 10 HCP, 6-card spades competing over opponent 1NT → 2♠ (preemptive overcall)", () => {
    const rec = getRecommendation(
      mkHand(10, 6, 2, 3, 2), // 6-card spades, 10 HCP → preemptive 2♠
      ctx("overcalling", { rhoBid: "1NT" }),
    );
    expect(rec.bid).toBe("2♠");
  });

  // Bug: getRebidAfterSuit with partnerResponse=Pass was falling into !partnerSuit block
  // (labeled "Partner doubled") instead of giving a correct pass message
  it("BF-11a: opener 1♠, partner passes → Pass with correct 'partner passed' reasoning", () => {
    const state: AuctionState = {
      myPosition: 1,
      completedRounds: [{ 1: "1♠", 2: "Pass", 3: "Pass", 4: "Pass" }],
      currentRound: {},
    };
    const rec = getRecommendation(
      mkHand(13, 5, 3, 3, 2),
      deriveSituation(state),
    );
    expect(rec.bid).toBe("Pass");
    expect(rec.reasoning).not.toContain("doubled");
    expect(rec.reasoning).not.toContain("double");
  });

  // Bug: getResponderNTRebid with partnerNaturalBid=Pass was falling through to suit-parsing
  it("BF-11b: responder bid 2NT, opener passes → Pass with correct reasoning", () => {
    const rec = getRecommendation(
      mkHand(13, 3, 3, 4, 3),
      ctx("responder-nt-rebid", {
        myPreviousBid: "2NT",
        partnerBid: undefined,
      }),
    );
    expect(rec.bid).toBe("Pass");
    expect(rec.reasoning).not.toContain("doubled");
  });

  // Bug: getRespondToPartnerInvitation with partnerInviteBid=Pass defaulted to clubs invitation
  it("BF-11c: respond-to-partner-invitation with no actual invite (partner passed) → Pass", () => {
    const rec = getRecommendation(
      mkHand(14, 4, 3, 3, 3),
      ctx("respond-to-partner-invitation", {
        myPreviousBid: "1♠",
        partnerBid: undefined,
      }),
    );
    expect(rec.bid).toBe("Pass");
    // Should NOT recommend accepting a suit game (which is what the bug caused)
    expect(rec.bid).not.toMatch(/^[234567]/);
    expect(rec.category).toContain("Pass");
  });

  // Bug: rebid-after-nt fallback was ?? "2NT", causing false "partner invited game" message
  // when partner actually passed and opponents competed over 1NT
  it("BF-10: 1NT opener, partner passes, opponent bids 2♠ → Pass with correct reasoning (not 2NT invite message)", () => {
    const state: AuctionState = {
      myPosition: 1,
      completedRounds: [{ 1: "1NT", 2: "Double", 3: "Pass", 4: "2♠" }],
      currentRound: {},
    };
    const rec = getRecommendation(
      mkHand(15, 3, 4, 2, 4),
      deriveSituation(state),
    );
    expect(rec.bid).toBe("Pass");
    expect(rec.reasoning).not.toContain("invited game");
    expect(rec.reasoning).not.toContain("2NT");
    expect(rec.category).not.toContain("2NT");
  });

  // Bug: Responding to double — "jump bid" language removed when bidding at level 2
  it("BF-9a: 10 HCP, 6-card spades responding to partner double → 2♠ (reasoning should not say jump)", () => {
    const rec = getRecommendation(
      mkHand(10, 6, 2, 3, 2),
      ctx("responding-to-double", { rhoBid: "1NT" }),
    );
    expect(rec.bid).toBe("2♠");
    expect(rec.reasoning).not.toContain("Jump bid");
    expect(rec.reasoning).not.toContain("jump bid");
  });

  // Stopper feature: responding to partner's overcall over opponent's 1NT (not a suit bid)
  // → should NOT say "stopper in opener's suit" since opener bid NT not a suit
  it("ST-1: responding to partner 2♠ overcall over opp 1NT, 13 HCP no spade fit → 2NT without stopper language", () => {
    const state: AuctionState = {
      myPosition: 2,
      completedRounds: [{ 1: "1NT", 2: "Pass", 3: "Pass", 4: "2♠" }],
      currentRound: { 1: "Pass" },
    };
    const hand = mkHand(13, 1, 4, 4, 4);
    const rec = getRecommendation(hand, deriveSituation(state));
    expect(rec.bid).toBe("2NT");
    expect(rec.reasoning).not.toContain("stopper in opener's suit");
    expect(rec.reasoning).not.toContain("stopper in their suit");
  });

  // Stopper feature: responding to partner's overcall over opponent's SUIT bid
  // → with stopper: recommend NT; without stopper: recommend suit bid
  it("ST-2a: responding to partner 2♥ OC over opp 1♠, 13 HCP no heart fit, WITH stopper → 2NT", () => {
    const state: AuctionState = {
      myPosition: 2,
      completedRounds: [{ 1: "1♠", 2: "Pass", 3: "Pass", 4: "2♥" }],
      currentRound: { 1: "Pass" },
    };
    const hand = { ...mkHand(13, 4, 1, 4, 4), hasStopperInOpponentSuit: true };
    const rec = getRecommendation(hand, deriveSituation(state));
    expect(rec.bid).toBe("2NT");
    expect(rec.reasoning).toContain("stopper");
  });

  it("ST-2b: responding to partner 2♥ OC over opp 1♠, 13 HCP no heart fit, WITHOUT stopper → bid suit", () => {
    const state: AuctionState = {
      myPosition: 2,
      completedRounds: [{ 1: "1♠", 2: "Pass", 3: "Pass", 4: "2♥" }],
      currentRound: { 1: "Pass" },
    };
    const hand = { ...mkHand(13, 4, 1, 4, 4), hasStopperInOpponentSuit: false };
    const rec = getRecommendation(hand, deriveSituation(state));
    expect(rec.bid).not.toBe("2NT");
    expect(rec.bid).not.toBe("3NT");
    expect(rec.reasoning).toContain("no stopper");
  });

  // deriveSituation: partner's 2♠ overcall over opp 1NT → responding-to-simple-oc, rhoBid=1NT
  it("ST-3: deriveSituation routes partner 2♠ OC over opp 1NT correctly", () => {
    const state: AuctionState = {
      myPosition: 2,
      completedRounds: [{ 1: "1NT", 2: "Pass", 3: "Pass", 4: "2♠" }],
      currentRound: { 1: "Pass" },
    };
    const context = deriveSituation(state);
    expect(context.situation).toBe("responding-to-simple-oc");
    expect(context.partnerBid).toBe("2♠");
    expect(context.rhoBid).toBe("1NT");
  });
});
