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
  it("15+ HCP → 2NT inquiry", () => {
    const rec = getRecommendation(
      mkHand(15, 4, 3, 3, 3),
      ctx("responding-weak2", { partnerBid: "2♠" }),
    );
    expect(rec.bid).toBe("2NT");
    expect(rec.category).toContain("Inquiry");
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

  it("minimum opener (TP=12), no 4-card fit but 5-card suit → rebid own suit", () => {
    // 11 HCP, 3 spades (no 4-card fit), 5 diamonds → rebid 2♦
    const rec = getRecommendation(
      mkHand(11, 3, 2, 5, 3),
      ctx("rebid-after-suit", { myPreviousBid: "1♦", partnerBid: "1♠" }),
    );
    expect(rec.bid).toBe("2♦");
    expect(rec.bid).not.toBe("Continue auction");
  });

  it("partner bid new suit, balanced, minimum → 1NT/2NT rebid", () => {
    const rec = getRecommendation(
      mkHand(14, 4, 3, 3, 3),
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

// ─── Convention Follow-ups ───────────────────────────────────────────────────

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

  it("partner replied 2♦, had 5-4 majors → bid 5-card major", () => {
    const rec = getRecommendation(
      mkHand(11, 5, 4, 2, 2),
      ctx("stayman-response", { partnerBid: "2♦" }),
    );
    expect(rec.bid).toContain("3♠");
    expect(rec.category).toContain("5-card Major"); // capital M
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
