// SAYC (Standard American Yellow Card) Bidding Advisor
// System: 5-card majors, 15-17 1NT, based on No Fear Bridge cheat sheet
// Additional conventions validated against ACBL SAYC and BridgeBum

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Hand {
  hcp: number;
  spades: number;
  hearts: number;
  diamonds: number;
  clubs: number;
  /** Optional: actual ace count (0-4). Shown in HandInput only during Blackwood auctions. */
  aces?: number;
  /** Optional: actual king count (0-4). Shown in HandInput only during Blackwood kings-ask. */
  kings?: number;
}

export type Vulnerability = "none" | "we-only" | "they-only" | "both";

export type Situation =
  // Opening
  | "opening"
  // Responding to partner's opening (no interference)
  | "responding-1nt"
  | "responding-2nt"
  | "responding-3nt-opening"
  | "responding-suit"
  | "responding-2c"
  | "responding-weak2"
  | "responding-preempt"
  // Competing
  | "overcalling"
  | "negative-double"
  // Responding to partner's competition
  | "responding-to-simple-oc"
  | "responding-to-jump-oc"
  | "responding-to-double"
  | "responding-to-preempt-oc"
  | "responding-to-1nt-oc"
  | "responding-to-michaels"
  | "responding-to-unusual-2nt"
  // Opener's rebids
  | "rebid-after-nt"
  | "rebid-after-suit"
  | "rebid-after-negative-double"
  | "jacoby-2nt-opener"
  | "protective-rebid"
  // Responding to partner's opening after opponent interference
  | "responding-suit-after-double"
  // Convention follow-ups
  | "stayman-response"
  | "transfer-response"
  | "minor-transfer-response"
  | "blackwood-response"
  | "gerber-response"
  | "blackwood-kings"
  | "grand-slam-force"
  | "grand-slam-force-response"
  | "stayman-opener-rebid"
  | "blackwood-ace-response"
  | "blackwood-kings-response"
  | "responder-nt-rebid"
  | "respond-to-partner-invitation";

export interface AuctionContext {
  situation: Situation;
  vulnerability?: Vulnerability;
  partnerBid?: string;
  rhoBid?: string;
  lhoBid?: string;
  myPreviousBid?: string;
  agreedSuit?: string;
  /** True when the opener's second bid was completing a Jacoby Transfer (not Stayman). */
  wasTransferCompletion?: boolean;
}

export interface ExpectedResponse {
  partnerBid: string;
  meaning: string;
  yourRebid?: string;
}

export interface HandAnalysis {
  tp: number;
  hcp: number;
  isBalanced: boolean;
  longestSuitName: string;
  longestSuitLength: number;
  hasFiveCardMajor: boolean;
  hasVoid: boolean;
  description: string;
}

export interface BidRecommendation {
  bid: string;
  category: string;
  reasoning: string;
  handAnalysis: HandAnalysis;
  whatYourBidTellsPartner: string;
  expectedResponses: ExpectedResponse[];
  confidence: "high" | "medium" | "low";
  note?: string;
  alternativeBid?: string;
}

// ─── Helper Calculations ─────────────────────────────────────────────────────

export function calcLongSuitPoints(hand: Hand): number {
  const suits = [hand.spades, hand.hearts, hand.diamonds, hand.clubs];
  return suits.reduce((pts, count) => pts + Math.max(0, count - 4), 0);
}

export function calcTP(hand: Hand): number {
  return hand.hcp + calcLongSuitPoints(hand);
}

export function calcShortSuitPoints(hand: Hand): number {
  const suits = [hand.spades, hand.hearts, hand.diamonds, hand.clubs];
  return suits.reduce((pts, count) => {
    if (count === 0) return pts + 5; // void
    if (count === 1) return pts + 3; // singleton
    if (count === 2) return pts + 1; // doubleton
    return pts;
  }, 0);
}

export function calcTPWithFit(hand: Hand): number {
  return hand.hcp + calcShortSuitPoints(hand);
}

export function isBalanced(hand: Hand): boolean {
  const suits = [hand.spades, hand.hearts, hand.diamonds, hand.clubs];
  const hasVoid = suits.some((c) => c === 0);
  const hasSingleton = suits.some((c) => c === 1);
  const doubletons = suits.filter((c) => c === 2).length;
  return !hasVoid && !hasSingleton && doubletons <= 1;
}

export function hasVoid(hand: Hand): boolean {
  return [hand.spades, hand.hearts, hand.diamonds, hand.clubs].some(
    (c) => c === 0,
  );
}

export function ruleOf20(hand: Hand): boolean {
  const suits = [
    { name: "spades", count: hand.spades },
    { name: "hearts", count: hand.hearts },
    { name: "diamonds", count: hand.diamonds },
    { name: "clubs", count: hand.clubs },
  ];
  suits.sort((a, b) => b.count - a.count);
  return hand.hcp + suits[0].count + suits[1].count >= 20;
}

export function longestSuitInfo(hand: Hand): { name: string; length: number } {
  const suits = [
    { name: "spades", count: hand.spades },
    { name: "hearts", count: hand.hearts },
    { name: "diamonds", count: hand.diamonds },
    { name: "clubs", count: hand.clubs },
  ];
  // Spades > hearts > diamonds > clubs for tie-breaking (higher-ranking first)
  suits.sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    const rankOrder = ["spades", "hearts", "diamonds", "clubs"];
    return rankOrder.indexOf(a.name) - rankOrder.indexOf(b.name);
  });
  return { name: suits[0].name, length: suits[0].count };
}

export function hasFiveCardMajor(hand: Hand): boolean {
  return hand.spades >= 5 || hand.hearts >= 5;
}

export function bestMajor(hand: Hand): string | null {
  if (hand.spades >= 5 && hand.spades >= hand.hearts) return "spades";
  if (hand.hearts >= 5) return "hearts";
  return null;
}

export function longerMinor(hand: Hand): string {
  if (hand.diamonds > hand.clubs) return "diamonds";
  if (hand.clubs > hand.diamonds) return "clubs";
  // tie: 4-4 → diamonds; 3-3 → clubs
  if (hand.diamonds === 4) return "diamonds";
  return "clubs";
}

export function suitSymbol(suit: string): string {
  const map: Record<string, string> = {
    spades: "♠",
    hearts: "♥",
    diamonds: "♦",
    clubs: "♣",
  };
  return map[suit] ?? suit;
}

export function suitBidLevel(suit: string, level: number): string {
  return `${level}${suitSymbol(suit)}`;
}

export function getContractLimit(combinedTP: number): string {
  if (combinedTP >= 37) return "7NT (Grand Slam in NT)";
  if (combinedTP >= 35) return "7 of suit (Grand Slam)";
  if (combinedTP >= 33) return "6NT (Small Slam in NT)";
  if (combinedTP >= 31) return "6 of suit (Small Slam)";
  if (combinedTP >= 29) return "5♣ or 5♦ (Minor Game)";
  if (combinedTP >= 25) return "3NT or 4♥/♠ (Game)";
  return "Part Score (non-game)";
}

export function analyzeHand(hand: Hand): HandAnalysis {
  const tp = calcTP(hand);
  const balanced = isBalanced(hand);
  const { name: longestName, length: longestLength } = longestSuitInfo(hand);
  const fiveCardMajor = hasFiveCardMajor(hand);
  const voidPresent = hasVoid(hand);

  const parts: string[] = [];
  parts.push(`${tp} TP (${hand.hcp} HCP)`);
  if (balanced) {
    parts.push("balanced");
  } else {
    parts.push("unbalanced");
  }
  if (longestLength >= 5) {
    parts.push(`${longestLength}-card ${longestName} suit`);
  }
  if (voidPresent) {
    parts.push("void present");
  }

  return {
    tp,
    hcp: hand.hcp,
    isBalanced: balanced,
    longestSuitName: longestName,
    longestSuitLength: longestLength,
    hasFiveCardMajor: fiveCardMajor,
    hasVoid: voidPresent,
    description: parts.join(", "),
  };
}

// ─── Opening Bids ────────────────────────────────────────────────────────────

function getOpeningBid(hand: Hand, vul: Vulnerability): BidRecommendation {
  const analysis = analyzeHand(hand);
  const { tp } = analysis;

  // Strong 2♣ (22+ HCP balanced or 22+ TP unbalanced)
  // NOTE: 25-27 HCP balanced goes 3NT, not 2♣; checked below first
  if (
    (analysis.isBalanced && hand.hcp >= 22 && hand.hcp <= 24) ||
    (!analysis.isBalanced && tp >= 22) ||
    (analysis.isBalanced && hand.hcp > 27) // >27 HCP (extremely rare)
  ) {
    return {
      bid: "2♣",
      category: "Strong 2♣ Opening",
      reasoning:
        "With 22+ total points you open 2♣, the strongest opening bid in SAYC. This is an artificial forcing bid — it says nothing about your clubs.",
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "You have a powerhouse hand (22+ TP or near-game in your own hand). Partner must respond and the auction is forcing to game unless partner bids 2♦ and you rebid 2NT.",
      expectedResponses: [
        {
          partnerBid: "2♦",
          meaning:
            "Artificial waiting response (0-7 pts, or any hand waiting to hear your rebid). Does NOT deny values.",
          yourRebid: "Bid your best suit or 2NT if 22-24 balanced",
        },
        {
          partnerBid: "2♥/2♠/3♣/3♦",
          meaning: "Positive response: natural, 5+ cards, 8+ pts, game-forcing",
        },
        {
          partnerBid: "2NT",
          meaning: "Positive response: balanced, 8+ HCP",
        },
      ],
      confidence: "high",
    };
  }

  // 3NT Opening (25-27 HCP balanced)
  if (analysis.isBalanced && hand.hcp >= 25 && hand.hcp <= 27) {
    return {
      bid: "3NT",
      category: "3NT Opening (25-27 HCP)",
      reasoning:
        "With 25-27 HCP balanced you open 3NT. This shows a very strong balanced hand just short of the 2♣ threshold.",
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "25-27 HCP balanced. Partner can pass, use Stayman (4♣), or use Jacoby Transfers (4♦→♥, 4♥→♠).",
      expectedResponses: [
        {
          partnerBid: "Pass",
          meaning: "Satisfied with 3NT as the final contract",
        },
        {
          partnerBid: "4♣",
          meaning: "Stayman — looking for a 4-card major fit",
        },
        { partnerBid: "4♦", meaning: "Jacoby Transfer to hearts" },
        { partnerBid: "4♥", meaning: "Jacoby Transfer to spades" },
      ],
      confidence: "high",
    };
  }

  // 2NT Opening (20-21 HCP balanced)
  if (analysis.isBalanced && hand.hcp >= 20 && hand.hcp <= 21) {
    return {
      bid: "2NT",
      category: "2NT Opening (20-21 HCP)",
      reasoning:
        "With 20-21 HCP balanced you open 2NT. This describes your strength precisely without going past game.",
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "20-21 HCP balanced. Partner needs only 4 HCP for game.",
      expectedResponses: [
        { partnerBid: "Pass", meaning: "0-3 pts — no game interest" },
        { partnerBid: "3♣", meaning: "Stayman — looking for a 4-card major" },
        { partnerBid: "3♦", meaning: "Jacoby Transfer to hearts" },
        { partnerBid: "3♥", meaning: "Jacoby Transfer to spades" },
        {
          partnerBid: "3NT",
          meaning: "4-11 pts balanced or long minor — to play",
        },
        { partnerBid: "4NT", meaning: "12 HCP — invitational to 6NT" },
      ],
      confidence: "high",
    };
  }

  // 1NT Opening (15-17 HCP balanced)
  if (analysis.isBalanced && hand.hcp >= 15 && hand.hcp <= 17) {
    return {
      bid: "1NT",
      category: "Opening 1NT (15-17 HCP)",
      reasoning:
        "With 15-17 HCP and a balanced hand you open 1NT. This precisely describes both your strength and shape in one bid.",
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "Exactly 15-17 HCP, balanced (no void, no singleton, at most one doubleton). Stayman and transfers are available.",
      expectedResponses: [
        { partnerBid: "Pass", meaning: "0-7 pts balanced — no game" },
        { partnerBid: "2♣", meaning: "Stayman — has a 4-card major (8+ pts)" },
        { partnerBid: "2♦", meaning: "Jacoby Transfer to hearts (5+ ♥)" },
        { partnerBid: "2♥", meaning: "Jacoby Transfer to spades (5+ ♠)" },
        {
          partnerBid: "2♠",
          meaning: "Minor transfer — weak hand with 6+ minor",
        },
        { partnerBid: "2NT", meaning: "8-9 pts balanced — invitational" },
        { partnerBid: "3NT", meaning: "10-15 pts balanced — game" },
        {
          partnerBid: "4♣",
          meaning: "Gerber — asking for aces (slam interest)",
        },
        {
          partnerBid: "4NT",
          meaning: "16-17 pts — quantitative invite to 6NT (NOT Blackwood)",
        },
      ],
      confidence: "high",
    };
  }

  // Balanced 18-19 HCP: open 1 of suit, jump rebid NT
  if (analysis.isBalanced && hand.hcp >= 18 && hand.hcp <= 19) {
    const suit = hasFiveCardMajor(hand) ? bestMajor(hand)! : longerMinor(hand);
    return {
      bid: suitBidLevel(suit, 1),
      category: "Balanced 18-19 HCP: Open 1, then jump rebid NT",
      reasoning:
        "With 18-19 HCP balanced you cannot open 1NT (15-17) or 2NT (20-21). Open 1 of your best suit and plan to jump rebid NT on your next turn.",
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "At least 12 pts with a biddable suit. Your strength (18-19 balanced) will be revealed when you jump rebid NT.",
      expectedResponses: [
        {
          partnerBid: "1♥/1♠",
          meaning: "4+ cards, 6+ pts — respond up the line",
        },
        { partnerBid: "1NT", meaning: "6-10 pts, no 4-card major available" },
        {
          partnerBid: "2 of suit",
          meaning: "New suit: 10+ pts; raise: 6-9 pts with support",
        },
      ],
      confidence: "high",
      note: "On your next turn, jump to 2NT (over a 1-level response) or 3NT (over a 2-level response) to show 18-19 balanced.",
    };
  }

  // Balanced 12-14 HCP: open 1 of minor, rebid NT
  if (analysis.isBalanced && hand.hcp >= 12 && hand.hcp <= 14) {
    const suit = hasFiveCardMajor(hand) ? bestMajor(hand)! : longerMinor(hand);
    return {
      bid: suitBidLevel(suit, 1),
      category: "Balanced 12-14 HCP: Open 1, rebid NT",
      reasoning:
        "With 12-14 HCP balanced you open 1 of your longest suit (prefer a 5-card major, otherwise the longer minor). Plan to rebid NT at the lowest level.",
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "12+ pts with a biddable suit. Your balanced minimum will be shown when you rebid NT.",
      expectedResponses: [
        { partnerBid: "1♥/1♠", meaning: "4+ cards, 6+ pts" },
        { partnerBid: "1NT", meaning: "6-10 pts, no available 4-card major" },
        {
          partnerBid: "2 of new suit",
          meaning: "10+ pts, game forcing interest",
        },
      ],
      confidence: "high",
      note: "Rebid NT at the lowest level available on your next turn to complete the picture of your balanced minimum.",
    };
  }

  // Unbalanced hands: check for preempts and weak 2s first (5-10 HCP)
  if (hand.hcp >= 5 && hand.hcp <= 10) {
    // Pre-emptive 4-level (8-card suit)
    const suits = [
      { name: "spades", count: hand.spades },
      { name: "hearts", count: hand.hearts },
      { name: "diamonds", count: hand.diamonds },
      { name: "clubs", count: hand.clubs },
    ];
    const eightCardSuit = suits.find((s) => s.count >= 8);
    if (eightCardSuit) {
      const vulNote =
        vul === "we-only" || vul === "both"
          ? "Be cautious — you are vulnerable. Aim to be within 2 tricks of your contract."
          : "Not vulnerable — you can be up to 3 tricks short.";
      return {
        bid: suitBidLevel(eightCardSuit.name, 4),
        category: "Pre-emptive 4-Opening",
        reasoning:
          "With 5-10 HCP and an 8-card suit you open at the 4-level as a pre-empt. This makes it very difficult for the opponents to find their best contract.",
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "5-10 HCP with an 8-card suit. Pre-emptive — not a strong hand.",
        expectedResponses: [
          { partnerBid: "Pass", meaning: "Respects the pre-empt" },
          { partnerBid: "New suit", meaning: "Forcing — looking for slam" },
        ],
        confidence: "high",
        note: vulNote,
      };
    }

    // Pre-emptive 3-level (7-card suit, no 4-card major outside)
    const sevenCardSuit = suits.find((s) => s.count >= 7);
    if (sevenCardSuit) {
      // A major can always preempt at the 3-level with 7 cards.
      // A minor can preempt only if there is no outside 4-card major (open 1♥/1♠ instead).
      const noOutsideMajor =
        sevenCardSuit.name === "spades" ||
        sevenCardSuit.name === "hearts" ||
        (hand.spades < 4 && hand.hearts < 4);
      if (noOutsideMajor) {
        const vulNote =
          vul === "we-only" || vul === "both"
            ? "Vulnerable: aim to be within 2 tricks of your contract."
            : "Not vulnerable: can be up to 3 tricks short.";
        return {
          bid: suitBidLevel(sevenCardSuit.name, 3),
          category: "Pre-emptive 3-Opening",
          reasoning:
            "With 5-10 HCP and a 7-card suit you open at the 3-level as a pre-empt. This crowds the bidding space for the opponents.",
          handAnalysis: analysis,
          whatYourBidTellsPartner:
            "5-10 HCP with a 7-card suit. Pre-emptive bid.",
          expectedResponses: [
            {
              partnerBid: "Pass",
              meaning: "0-15 pts with less than 3-card support",
            },
            {
              partnerBid: "Raise to 4",
              meaning: "3+ support, 0-15 pts (also pre-emptive)",
            },
            {
              partnerBid: "New suit",
              meaning: "16+ pts — forcing, looking for game or slam",
            },
          ],
          confidence: "high",
          note: vulNote,
        };
      }
    }

    // 3♣ preempt (6-card clubs, 5-10 HCP, no outside 4-card major)
    // 2♣ is reserved for a strong 22+ HCP artificial opening, so with 6 clubs + 5-10 HCP
    // we preempt at the 3-level instead.
    if (hand.clubs >= 6 && hand.spades < 4 && hand.hearts < 4) {
      const vulNote =
        vul === "we-only" || vul === "both"
          ? "Vulnerable: aim to be within 2 tricks of your contract."
          : "Not vulnerable: can be up to 3 tricks short.";
      return {
        bid: "3♣",
        category: "Pre-emptive 3♣ Opening (6-Card Clubs)",
        reasoning: `With ${hand.hcp} HCP and ${hand.clubs} clubs, open 3♣ as a pre-empt. Since 2♣ is reserved for strong hands (22+ HCP), 3♣ is the correct pre-emptive level for clubs. No outside 4-card major — otherwise open the major.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `5-10 HCP with ${hand.clubs}-card clubs. Pre-emptive — weak hand with long suit.`,
        expectedResponses: [
          {
            partnerBid: "Pass",
            meaning: "0-15 pts, no game interest — trust the pre-empt",
          },
          {
            partnerBid: "3NT",
            meaning: "15+ pts balanced — game in NT",
          },
          {
            partnerBid: "New suit",
            meaning: "16+ pts, forcing — looking for game or slam",
          },
        ],
        confidence: "high",
        note: vulNote,
      };
    }

    // Weak 2 (6-card suit, no outside 4-card major) — EXCLUDES clubs (2♣ is reserved)
    const sixCardSuit = suits.find((s) => s.count >= 6 && s.name !== "clubs");
    if (sixCardSuit && sixCardSuit.count === 6) {
      const noOutsideFourMajor =
        (sixCardSuit.name === "spades" || hand.spades < 4) &&
        (sixCardSuit.name === "hearts" || hand.hearts < 4);
      if (noOutsideFourMajor) {
        return {
          bid: suitBidLevel(sixCardSuit.name, 2),
          category: "Weak 2 Opening",
          reasoning: `With 5-10 HCP and a 6-card ${sixCardSuit.name} suit (with 2 honors if minimum points), open a Weak 2. Your suit should have at least 2 of the top 5 honors if on the lower end of the range.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner:
            "5-10 HCP, 6-card suit, no outside 4-card major. Weak pre-emptive opening.",
          expectedResponses: [
            {
              partnerBid: "Raise (3 level)",
              meaning:
                "0-14 pts, 3-card support — pre-emptive, not invitational",
            },
            {
              partnerBid: "Raise (4 level)",
              meaning:
                "0-14 pts, 4-card support or game certain opposite minimum",
            },
            {
              partnerBid: "2NT",
              meaning:
                "15+ pts — forcing inquiry. Shows interest in game or slam",
              yourRebid:
                "3 of own suit (minimum 5-7), or new suit with A/K (maximum 8-10)",
            },
            {
              partnerBid: "New suit",
              meaning: "15+ pts — game-forcing (RONF: Raise Only Non-Forcing)",
            },
            {
              partnerBid: "3NT",
              meaning: "15+ pts — game certain without suit fit",
            },
          ],
          confidence: "high",
          note: "Raises by partner are pre-emptive, not invitational. If partner raises, pass.",
        };
      }
    }
  }

  // Unbalanced opening bids (13-21 TP)
  if (tp >= 13 && tp <= 21) {
    // 5+ card major
    const major = bestMajor(hand);
    if (major) {
      return {
        bid: suitBidLevel(major, 1),
        category: `Opening 1${suitSymbol(major)}`,
        reasoning: `With 13-21 TP and a 5+ card ${major} suit, open 1${suitSymbol(major)}. With two equal-length majors, bid the higher-ranking one (spades) first.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `5+ card ${major} suit with 12-21 HCP. A game-forcing auction is possible if partner has 13+ pts.`,
        expectedResponses: [
          { partnerBid: "Pass", meaning: "0-5 pts — too weak to respond" },
          {
            partnerBid: `2${suitSymbol(major)}`,
            meaning: "6-9 pts, 3+ card support — simple raise",
          },
          {
            partnerBid: `3${suitSymbol(major)}`,
            meaning: "10-12 pts, 3+ card support — limit raise (invitational)",
          },
          {
            partnerBid: "2NT",
            meaning:
              "Jacoby 2NT: 13+ pts, 4+ card support — game forcing, slam try",
          },
          {
            partnerBid: "1 of new suit",
            meaning: "6-10 pts, 4+ cards — natural, one-round force",
          },
          {
            partnerBid: "1NT",
            meaning:
              "6-10 pts, no 3+ card support for major, no other suit at 1-level",
          },
          {
            partnerBid: "2 of new suit",
            meaning: "10+ pts, 4+ cards — game-forcing new suit",
          },
        ],
        confidence: "high",
      };
    }

    // No 5-card major: open longer minor
    const minor = longerMinor(hand);
    const minorLength = minor === "diamonds" ? hand.diamonds : hand.clubs;
    const minorReason =
      hand.diamonds === 4 && hand.clubs === 4
        ? "With 4-4 in the minors, SAYC requires opening 1♦."
        : hand.diamonds === 3 && hand.clubs === 3
          ? "With 3-3 in the minors, SAYC requires opening 1♣."
          : `With ${minorLength} ${minor}, bid the longer minor.`;

    return {
      bid: suitBidLevel(minor, 1),
      category: `Opening 1${suitSymbol(minor)} (no 5-card major)`,
      reasoning: `With 13-21 TP and no 5-card major, open your longer minor. ${minorReason} You may have as few as 3 cards in the bid suit.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `12-21 HCP, 3+ card ${minor} suit (possibly short). Looking for a major suit fit or NT game.`,
      expectedResponses: [
        { partnerBid: "Pass", meaning: "0-5 pts — too weak to respond" },
        {
          partnerBid: "1♦/1♥/1♠",
          meaning: "6+ pts, 4+ cards — bid up the line",
        },
        {
          partnerBid: "1NT",
          meaning: "6-10 pts, no 4-card major available at 1-level",
        },
        { partnerBid: "2NT", meaning: "11-12 pts balanced — invitational" },
        { partnerBid: "3NT", meaning: "13-15 pts balanced — game" },
        {
          partnerBid: `2${suitSymbol(minor)}`,
          meaning: "6-9 pts, 3+ card support",
        },
      ],
      confidence: "high",
    };
  }

  // Rule of 20 check (12 TP)
  if (tp === 12 || (hand.hcp >= 11 && tp <= 12)) {
    if (ruleOf20(hand)) {
      const suit = hasFiveCardMajor(hand)
        ? bestMajor(hand)!
        : longerMinor(hand);
      return {
        bid: suitBidLevel(suit, 1),
        category: "Rule of 20 Opening",
        reasoning: `With exactly 12 total points, apply the Rule of 20: HCP (${hand.hcp}) + cards in your 2 longest suits = ${
          hand.hcp +
          longestSuitInfo(hand).length +
          (() => {
            const sorted = [
              hand.spades,
              hand.hearts,
              hand.diamonds,
              hand.clubs,
            ].sort((a, b) => b - a);
            return sorted[1];
          })()
        } ≥ 20. You may open.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "12+ pts (by Rule of 20) with a biddable suit. Slightly sub-minimum opening.",
        expectedResponses: [
          { partnerBid: "1 of suit", meaning: "6+ pts, 4+ cards" },
          { partnerBid: "1NT", meaning: "6-10 pts, no available major" },
        ],
        confidence: "medium",
        note: "This is a borderline opening. Partner will not know you are minimum — bid cautiously on rebid.",
      };
    } else {
      return {
        bid: "Pass",
        category: "Pass (Rule of 20 fails)",
        reasoning:
          "With 12 total points and HCP + 2 longest suits < 20, do not open. Pass and wait to see if you can compete later.",
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "0-12 pts (pass shows nothing specific until partner or opponent bids).",
        expectedResponses: [],
        confidence: "high",
      };
    }
  }

  // Too weak to open — build specific reasoning based on whether a long suit was blocked
  const passReasoning = (() => {
    const suitsAll = [
      { name: "spades", count: hand.spades },
      { name: "hearts", count: hand.hearts },
      { name: "diamonds", count: hand.diamonds },
      { name: "clubs", count: hand.clubs },
    ];

    // 7+ card minor blocked by outside 4-card major
    const sevenPlusSuit = suitsAll.find((s) => s.count >= 7);
    if (
      sevenPlusSuit &&
      (sevenPlusSuit.name === "diamonds" || sevenPlusSuit.name === "clubs")
    ) {
      const outsideMajor =
        hand.spades >= 4 ? "spades" : hand.hearts >= 4 ? "hearts" : null;
      if (outsideMajor) {
        return `With ${hand.hcp} HCP and a ${sevenPlusSuit.count}-card ${sevenPlusSuit.name} suit, a 3-level pre-empt would normally apply, but an outside 4-card ${outsideMajor} suit makes this inadvisable in SAYC — partner might miss the ${outsideMajor} game. Pass.`;
      }
    }

    // 6-card non-club suit blocked by outside 4-card major (Weak 2 candidate)
    const sixCardNonClub = suitsAll.find(
      (s) => s.count >= 6 && s.name !== "clubs",
    );
    if (sixCardNonClub && hand.hcp >= 5 && hand.hcp <= 10) {
      const outsideMajor =
        sixCardNonClub.name !== "spades" && hand.spades >= 4
          ? "spades"
          : sixCardNonClub.name !== "hearts" && hand.hearts >= 4
            ? "hearts"
            : null;
      if (outsideMajor) {
        return `With ${hand.hcp} HCP and a ${sixCardNonClub.count}-card ${sixCardNonClub.name} suit, a Weak 2${suitSymbol(sixCardNonClub.name)} would normally apply, but an outside 4-card ${outsideMajor} suit makes this inadvisable in standard SAYC — partner might miss the ${outsideMajor} game. Pass.`;
      }
    }

    // 6-card clubs blocked by outside 4-card major (3♣ preempt candidate)
    if (hand.clubs >= 6 && hand.hcp >= 5 && hand.hcp <= 10) {
      const outsideMajor =
        hand.spades >= 4 ? "spades" : hand.hearts >= 4 ? "hearts" : null;
      if (outsideMajor) {
        return `With ${hand.hcp} HCP and a ${hand.clubs}-card clubs suit, a 3♣ pre-empt would normally apply, but an outside 4-card ${outsideMajor} suit makes this inadvisable in standard SAYC — partner might miss the ${outsideMajor} game. Pass.`;
      }
    }

    // 6+ card suit but HCP outside the 5-10 preempt range
    const longSuit = suitsAll.find((s) => s.count >= 6);
    if (longSuit && (hand.hcp < 5 || hand.hcp > 10)) {
      return `With ${hand.hcp} HCP and a ${longSuit.count}-card ${longSuit.name} suit, the hand falls outside the 5-10 HCP pre-empt range. With fewer than 12 total points but too strong for a pre-empt, pass.`;
    }

    return "With fewer than 12 total points and no qualifying long suit for a pre-empt, pass.";
  })();

  return {
    bid: "Pass",
    category: "Pass (too weak to open)",
    reasoning: passReasoning,
    handAnalysis: analysis,
    whatYourBidTellsPartner:
      "Pass shows fewer than 12 pts (no opening strength).",
    expectedResponses: [],
    confidence: "high",
  };
}

// ─── Responses to Partner's Opening ─────────────────────────────────────────

function getResponseToOneNT(hand: Hand): BidRecommendation {
  const analysis = analyzeHand(hand);
  const { hcp } = hand;

  // 5-4 or 4-5 in majors → Stayman (not transfers)
  const hasFourHearts = hand.hearts >= 4;
  const hasFourSpades = hand.spades >= 4;
  const hasFiveHearts = hand.hearts >= 5;
  const hasFiveSpades = hand.spades >= 5;
  const fiveAndFourMajors =
    (hasFiveHearts && hasFourSpades) || (hasFiveSpades && hasFourHearts);

  if (fiveAndFourMajors && hcp >= 8) {
    return {
      bid: "2♣",
      category: "Stayman with 5-4 Majors",
      reasoning:
        "With both a 5-card and a 4-card major, use Stayman (2♣) rather than a transfer. Stayman can find a fit in either major. If partner replies 2♦ (no major), then bid your 5-card major as a natural game-forcing bid.",
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "You have at least one 4-card major (8+ pts). You will clarify your shape on the next bid.",
      expectedResponses: [
        {
          partnerBid: "2♦",
          meaning: "No 4-card major",
          yourRebid: "Bid your 5-card major (game-forcing)",
        },
        {
          partnerBid: "2♥",
          meaning: "4+ hearts",
          yourRebid: "Raise to 3♥/4♥ or explore slam",
        },
        {
          partnerBid: "2♠",
          meaning: "4+ spades",
          yourRebid: "Raise to 3♠/4♠ or explore slam",
        },
      ],
      confidence: "high",
      note: "Per SAYC: always use Stayman (not a transfer) when you have both a 5-card and a 4-card major.",
    };
  }

  // Slam interest with 6+ card major (3♥/3♠ responses)
  if (hcp >= 12) {
    if (hand.hearts >= 6) {
      return {
        bid: "3♥",
        category: "Slam Interest: 6+ Hearts",
        reasoning:
          "With 12+ HCP and 6+ hearts, bid 3♥ directly — this shows a 6-card major with slam interest (stronger than just transferring and bidding game).",
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "6+ card heart suit with slam interest (12+ HCP). Not just a game bid.",
        expectedResponses: [
          { partnerBid: "4♥", meaning: "Minimum (15 HCP), accepts game only" },
          { partnerBid: "4NT", meaning: "Blackwood — slam interest confirmed" },
          { partnerBid: "3NT", meaning: "Good hand, no fit preference" },
        ],
        confidence: "high",
      };
    }
    if (hand.spades >= 6) {
      return {
        bid: "3♠",
        category: "Slam Interest: 6+ Spades",
        reasoning:
          "With 12+ HCP and 6+ spades, bid 3♠ directly — slam interest with a long major.",
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "6+ card spade suit with slam interest (12+ HCP).",
        expectedResponses: [
          { partnerBid: "4♠", meaning: "Minimum, accepts game only" },
          { partnerBid: "4NT", meaning: "Blackwood — slam interest confirmed" },
        ],
        confidence: "high",
      };
    }
  }

  // 6+ card major with game hand (transfer then bid game/invite)
  if (hand.hearts >= 6 && hcp >= 10) {
    return {
      bid: "2♦",
      category: "Transfer + Game (6+ Hearts)",
      reasoning:
        "Transfer to hearts with 2♦, then bid 4♥ directly to show a game-going hand with 6+ hearts.",
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "5+ hearts (6+ shown by bidding game after transfer). Game hand.",
      expectedResponses: [
        {
          partnerBid: "2♥",
          meaning: "Completing transfer (automatic)",
          yourRebid: "Bid 4♥ to show 6+ card game hand",
        },
        {
          partnerBid: "3♥",
          meaning: "Super-accept: 17 HCP + 4-card heart support",
        },
      ],
      confidence: "high",
    };
  }

  if (hand.spades >= 6 && hcp >= 10) {
    return {
      bid: "2♥",
      category: "Transfer + Game (6+ Spades)",
      reasoning:
        "Transfer to spades with 2♥, then bid 4♠ to show a game-going hand with 6+ spades.",
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "5+ spades (6+ shown by bidding game after transfer). Game hand.",
      expectedResponses: [
        {
          partnerBid: "2♠",
          meaning: "Completing transfer (automatic)",
          yourRebid: "Bid 4♠ to show 6+ card game hand",
        },
        {
          partnerBid: "3♠",
          meaning: "Super-accept: 17 HCP + 4-card spade support",
        },
      ],
      confidence: "high",
    };
  }

  // Invitational with 6-card major (transfer then invite)
  if (hand.hearts >= 6 && hcp >= 8 && hcp <= 9) {
    return {
      bid: "2♦",
      category: "Transfer + Invite (6+ Hearts)",
      reasoning:
        "Transfer to hearts, then bid 3♥ to invite game with 6+ hearts and 8-9 pts.",
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "5+ hearts, invitational strength with 6+ shown by rebid of 3♥.",
      expectedResponses: [
        {
          partnerBid: "2♥",
          meaning: "Completing transfer",
          yourRebid: "Bid 3♥ to invite",
        },
      ],
      confidence: "high",
    };
  }
  if (hand.spades >= 6 && hcp >= 8 && hcp <= 9) {
    return {
      bid: "2♥",
      category: "Transfer + Invite (6+ Spades)",
      reasoning:
        "Transfer to spades, then bid 3♠ to invite game with 6+ spades and 8-9 pts.",
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "5+ spades, invitational with 6+ shown by rebid of 3♠.",
      expectedResponses: [
        {
          partnerBid: "2♠",
          meaning: "Completing transfer",
          yourRebid: "Bid 3♠ to invite",
        },
      ],
      confidence: "high",
    };
  }

  // 5-card major, game hand (transfer then 3NT)
  if (hand.hearts === 5 && hcp >= 10) {
    return {
      bid: "2♦",
      category: "Transfer + 3NT (5 Hearts, Game)",
      reasoning:
        "Transfer to hearts, then bid 3NT. Shows exactly 5 hearts and game values. Partner can pass 3NT or correct to 4♥ with 3+ card support.",
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "Exactly 5 hearts, game-going hand. Partner chooses 3NT or 4♥.",
      expectedResponses: [
        {
          partnerBid: "2♥",
          meaning: "Completing transfer",
          yourRebid: "Bid 3NT",
        },
      ],
      confidence: "high",
    };
  }
  if (hand.spades === 5 && hcp >= 10) {
    return {
      bid: "2♥",
      category: "Transfer + 3NT (5 Spades, Game)",
      reasoning:
        "Transfer to spades, then bid 3NT. Shows exactly 5 spades and game values.",
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "Exactly 5 spades, game-going. Partner chooses 3NT or 4♠.",
      expectedResponses: [
        {
          partnerBid: "2♠",
          meaning: "Completing transfer",
          yourRebid: "Bid 3NT",
        },
      ],
      confidence: "high",
    };
  }

  // 5-card major, invitational (transfer then 2NT)
  if (hand.hearts === 5 && hcp >= 8 && hcp <= 9) {
    return {
      bid: "2♦",
      category: "Transfer + 2NT (5 Hearts, Invitational)",
      reasoning:
        "Transfer to hearts, then bid 2NT. Shows 5 hearts and invitational values (8-9 pts).",
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "5 hearts, invitational (8-9 pts). Partner can pass, bid 3♥, or bid 3NT.",
      expectedResponses: [
        {
          partnerBid: "2♥",
          meaning: "Completing transfer",
          yourRebid: "Bid 2NT to invite",
        },
      ],
      confidence: "high",
    };
  }
  if (hand.spades === 5 && hcp >= 8 && hcp <= 9) {
    return {
      bid: "2♥",
      category: "Transfer + 2NT (5 Spades, Invitational)",
      reasoning:
        "Transfer to spades, then bid 2NT. Shows 5 spades and invitational values.",
      handAnalysis: analysis,
      whatYourBidTellsPartner: "5 spades, invitational (8-9 pts).",
      expectedResponses: [
        {
          partnerBid: "2♠",
          meaning: "Completing transfer",
          yourRebid: "Bid 2NT to invite",
        },
      ],
      confidence: "high",
    };
  }

  // Weak hand with 5-card major (transfer and pass)
  if (hand.hearts >= 5 && hcp <= 7) {
    return {
      bid: "2♦",
      category: "Transfer to Hearts (Weak)",
      reasoning:
        "With a weak hand (0-7 pts) and 5+ hearts, transfer to hearts and PASS. The 1NT opener will have a better chance as declarer.",
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "5+ hearts. After completing transfer, you will pass.",
      expectedResponses: [
        { partnerBid: "2♥", meaning: "Transfer complete", yourRebid: "Pass" },
        { partnerBid: "3♥", meaning: "Super-accept (17 + 4 ♥)" },
      ],
      confidence: "high",
    };
  }
  if (hand.spades >= 5 && hcp <= 7) {
    return {
      bid: "2♥",
      category: "Transfer to Spades (Weak)",
      reasoning:
        "With a weak hand (0-7 pts) and 5+ spades, transfer to spades and PASS.",
      handAnalysis: analysis,
      whatYourBidTellsPartner: "5+ spades. After transfer, you will pass.",
      expectedResponses: [
        { partnerBid: "2♠", meaning: "Transfer complete", yourRebid: "Pass" },
      ],
      confidence: "high",
    };
  }

  // Stayman with 4-card major (8+ pts)
  if ((hasFourHearts || hasFourSpades) && hcp >= 8) {
    return {
      bid: "2♣",
      category: "Stayman (4-card major)",
      reasoning:
        "With a 4-card major and 8+ HCP, use Stayman (2♣) to look for a 4-4 major fit.",
      handAnalysis: analysis,
      whatYourBidTellsPartner: "You have at least one 4-card major and 8+ pts.",
      expectedResponses: [
        {
          partnerBid: "2♦",
          meaning: "No 4-card major",
          yourRebid: hcp >= 10 ? "Bid 3NT" : "Bid 2NT (invitational)",
        },
        {
          partnerBid: "2♥",
          meaning: "4+ hearts",
          yourRebid: "Raise to 4♥ if you have 4 hearts, else bid 2NT/3NT",
        },
        {
          partnerBid: "2♠",
          meaning: "4+ spades",
          yourRebid: "Raise to 4♠ if you have 4 spades, else bid 2NT/3NT",
        },
      ],
      confidence: "high",
    };
  }

  // Minor transfer (weak, 6+ minor)
  if (hand.clubs >= 6 && hcp <= 7) {
    return {
      bid: "2♠",
      category: "Minor Transfer to Clubs (Weak)",
      reasoning:
        "With a weak hand and 6+ clubs, bid 2♠ as a minor transfer. The 1NT opener bids 3♣, and you pass (or convert to 3♦ if that's your suit).",
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "Weak hand with 6+ minor suit. After 3♣, you will pass or bid 3♦.",
      expectedResponses: [
        {
          partnerBid: "3♣",
          meaning: "Completing minor transfer",
          yourRebid: "Pass (clubs) or bid 3♦ (diamonds)",
        },
      ],
      confidence: "high",
    };
  }
  if (hand.diamonds >= 6 && hcp <= 7) {
    return {
      bid: "2♠",
      category: "Minor Transfer to Diamonds (Weak)",
      reasoning:
        "With a weak hand and 6+ diamonds, bid 2♠. After 3♣ from partner, convert to 3♦.",
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "Weak hand with 6+ minor. After 3♣, you will convert to 3♦.",
      expectedResponses: [
        {
          partnerBid: "3♣",
          meaning: "Minor transfer complete",
          yourRebid: "Bid 3♦",
        },
      ],
      confidence: "high",
    };
  }

  // 6+ minor invitational (3♣/3♦)
  if (hand.clubs >= 6 && hcp >= 8 && hcp <= 9) {
    return {
      bid: "3♣",
      category: "6+ Clubs, Invitational",
      reasoning:
        "With 8-9 HCP and 6+ clubs, bid 3♣ as an invitational bid. Partner passes with minimum or bids 3NT with maximum.",
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "6+ clubs, invitational values (8-9 HCP). Partner decides on 3NT.",
      expectedResponses: [
        { partnerBid: "Pass", meaning: "15-16 HCP minimum — no game" },
        { partnerBid: "3NT", meaning: "17 HCP — accepts the invitation" },
      ],
      confidence: "high",
    };
  }
  if (hand.diamonds >= 6 && hcp >= 8 && hcp <= 9) {
    return {
      bid: "3♦",
      category: "6+ Diamonds, Invitational",
      reasoning: "With 8-9 HCP and 6+ diamonds, bid 3♦ invitational.",
      handAnalysis: analysis,
      whatYourBidTellsPartner: "6+ diamonds, invitational (8-9 HCP).",
      expectedResponses: [
        { partnerBid: "Pass", meaning: "Minimum" },
        { partnerBid: "3NT", meaning: "Maximum — accepts invitation" },
      ],
      confidence: "high",
    };
  }

  // Quantitative 4NT (16-17 HCP balanced)
  if (hcp >= 16 && hcp <= 17 && analysis.isBalanced) {
    return {
      bid: "4NT",
      category: "Quantitative 4NT (invite to 6NT)",
      reasoning:
        "With 16-17 HCP balanced, bid 4NT as a quantitative (non-Blackwood) invitation to 6NT. Partner accepts with 17 HCP (maximum) or passes with 15-16.",
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "16-17 HCP balanced. Inviting 6NT. This is NOT Blackwood — no suit is agreed.",
      expectedResponses: [
        { partnerBid: "Pass", meaning: "15-16 HCP — declines slam invite" },
        { partnerBid: "6NT", meaning: "17 HCP — accepts slam invite" },
      ],
      confidence: "high",
      note: "IMPORTANT: 4NT here is quantitative (not Blackwood) because no suit has been agreed and NT has been bid naturally. Use Gerber (4♣) if you want to ask for aces.",
    };
  }

  // 3NT (10-15 HCP balanced)
  if (hcp >= 10 && hcp <= 15 && analysis.isBalanced) {
    return {
      bid: "3NT",
      category: "3NT Response (Game)",
      reasoning:
        "With 10-15 HCP balanced (enough for game when combined with partner's 15-17), bid 3NT directly.",
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "10-15 HCP balanced. Game values, no 4-card major interest.",
      expectedResponses: [{ partnerBid: "Pass", meaning: "Accepts 3NT" }],
      confidence: "high",
    };
  }

  // 2NT (8-9 HCP balanced)
  if (hcp >= 8 && hcp <= 9 && analysis.isBalanced) {
    return {
      bid: "2NT",
      category: "2NT Response (Invitational)",
      reasoning:
        "With 8-9 HCP balanced, bid 2NT as an invitation. Partner accepts (bids 3NT) with 17 HCP or passes with 15-16.",
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "8-9 HCP balanced. Invitational — partner decides.",
      expectedResponses: [
        { partnerBid: "Pass", meaning: "15-16 HCP — no game" },
        { partnerBid: "3NT", meaning: "17 HCP — game on" },
      ],
      confidence: "high",
    };
  }

  // Pass (0-7 balanced or weak unbalanced without transfer)
  return {
    bid: "Pass",
    category: "Pass (Too Weak for Game Interest)",
    reasoning:
      "With 0-7 HCP and no 5-card major or 6-card minor to transfer, pass. There is no game available.",
    handAnalysis: analysis,
    whatYourBidTellsPartner: "0-7 pts — no interest in game.",
    expectedResponses: [],
    confidence: "high",
  };
}

function getResponseToTwoNT(hand: Hand): BidRecommendation {
  const analysis = analyzeHand(hand);
  const { hcp } = hand;

  if (hcp <= 3) {
    return {
      bid: "Pass",
      category: "Pass (Too Weak)",
      reasoning:
        "With 0-3 HCP, pass. Even partner's strong 2NT hand cannot produce game.",
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Very weak hand — no game potential.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  // 5+ major → Transfer (check BEFORE Stayman)
  if (hand.hearts >= 5 && hcp >= 4) {
    return {
      bid: "3♦",
      category: "Transfer to Hearts over 2NT",
      reasoning:
        "With 5+ hearts, transfer with 3♦. Partner bids 3♥. Then bid game or explore slam.",
      handAnalysis: analysis,
      whatYourBidTellsPartner: "5+ hearts. Will clarify strength on next bid.",
      expectedResponses: [
        {
          partnerBid: "3♥",
          meaning: "Transfer complete",
          yourRebid: hcp >= 10 ? "Bid 4♥ or explore slam" : "Pass or 3NT",
        },
      ],
      confidence: "high",
    };
  }
  if (hand.spades >= 5 && hcp >= 4) {
    return {
      bid: "3♥",
      category: "Transfer to Spades over 2NT",
      reasoning: "With 5+ spades, transfer with 3♥. Partner bids 3♠.",
      handAnalysis: analysis,
      whatYourBidTellsPartner: "5+ spades.",
      expectedResponses: [
        {
          partnerBid: "3♠",
          meaning: "Transfer complete",
          yourRebid: hcp >= 10 ? "4♠ or explore slam" : "Pass",
        },
      ],
      confidence: "high",
    };
  }

  // 4-card major → Stayman
  if ((hand.hearts >= 4 || hand.spades >= 4) && hcp >= 4) {
    return {
      bid: "3♣",
      category: "Stayman over 2NT",
      reasoning:
        "With a 4-card major and 4+ HCP, use Stayman (3♣) to look for a major fit.",
      handAnalysis: analysis,
      whatYourBidTellsPartner: "You have a 4-card major and some values.",
      expectedResponses: [
        { partnerBid: "3♦", meaning: "No 4-card major" },
        { partnerBid: "3♥", meaning: "4+ hearts" },
        { partnerBid: "3♠", meaning: "4+ spades" },
      ],
      confidence: "high",
    };
  }

  // Invitational to 6NT (12 HCP)
  if (hcp >= 12) {
    return {
      bid: "4NT",
      category: "Quantitative 4NT (invite to 6NT)",
      reasoning:
        "With 12 HCP, invite 6NT with 4NT. Partner accepts with 21 HCP (maximum).",
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "12 HCP balanced. Inviting 6NT (quantitative — NOT Blackwood).",
      expectedResponses: [
        { partnerBid: "Pass", meaning: "20 HCP — declines" },
        { partnerBid: "6NT", meaning: "21 HCP — accepts" },
      ],
      confidence: "high",
      note: "4NT is quantitative here, not Blackwood — no suit is agreed.",
    };
  }

  // 3NT (4-11 HCP balanced)
  return {
    bid: "3NT",
    category: "3NT Response to 2NT",
    reasoning:
      "With 4-11 HCP balanced, bid 3NT. Combined with partner's 20-21 HCP you have enough for game.",
    handAnalysis: analysis,
    whatYourBidTellsPartner:
      "4-11 HCP, no 4-card major, satisfied with NT game.",
    expectedResponses: [{ partnerBid: "Pass", meaning: "Accepts 3NT" }],
    confidence: "high",
  };
}

function getResponseTo3NTOpening(hand: Hand): BidRecommendation {
  const analysis = analyzeHand(hand);

  // 5+ major → Transfer BEFORE Stayman (Stayman catches 4-card majors too)
  if (hand.hearts >= 5) {
    return {
      bid: "4♦",
      category: "Transfer to Hearts over 3NT",
      reasoning: "With 5+ hearts, transfer to hearts with 4♦.",
      handAnalysis: analysis,
      whatYourBidTellsPartner: "5+ hearts.",
      expectedResponses: [{ partnerBid: "4♥", meaning: "Transfer complete" }],
      confidence: "high",
    };
  }
  if (hand.spades >= 5) {
    return {
      bid: "4♥",
      category: "Transfer to Spades over 3NT",
      reasoning: "With 5+ spades, transfer to spades with 4♥.",
      handAnalysis: analysis,
      whatYourBidTellsPartner: "5+ spades.",
      expectedResponses: [{ partnerBid: "4♠", meaning: "Transfer complete" }],
      confidence: "high",
    };
  }

  if (hand.hearts >= 4 || hand.spades >= 4) {
    return {
      bid: "4♣",
      category: "Stayman over 3NT Opening",
      reasoning:
        "With a 4-card major, use Stayman (4♣) to look for a major fit.",
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Looking for a 4-card major fit.",
      expectedResponses: [
        { partnerBid: "4♦", meaning: "No 4-card major" },
        { partnerBid: "4♥", meaning: "4+ hearts" },
        { partnerBid: "4♠", meaning: "4+ spades" },
      ],
      confidence: "high",
    };
  }
  return {
    bid: "Pass",
    category: "Pass (Satisfied with 3NT)",
    reasoning:
      "With no 4-card major and no long major to transfer, pass and play 3NT.",
    handAnalysis: analysis,
    whatYourBidTellsPartner: "No major suit interest. 3NT is the contract.",
    expectedResponses: [],
    confidence: "high",
  };
}

function getResponseToSuit(hand: Hand, partnerBid: string): BidRecommendation {
  const analysis = analyzeHand(hand);
  const { tp } = analysis;
  const isPartnerMajor = partnerBid === "1♥" || partnerBid === "1♠";
  const partnerSuit =
    partnerBid === "1♠"
      ? "spades"
      : partnerBid === "1♥"
        ? "hearts"
        : partnerBid === "1♦"
          ? "diamonds"
          : "clubs";
  const mySupport = hand[partnerSuit as keyof Hand] as number;

  if (tp <= 5) {
    return {
      bid: "Pass",
      category: "Pass (Too Weak)",
      reasoning:
        "With 0-5 total points, pass. You need at least 6 points to respond.",
      handAnalysis: analysis,
      whatYourBidTellsPartner: "0-5 pts — too weak to respond.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  // Jacoby 2NT (game-forcing raise of major with 13+ pts, 4+ card support)
  if (isPartnerMajor && mySupport >= 4 && hand.hcp >= 13) {
    return {
      bid: "2NT",
      category: "Jacoby 2NT (Game-Forcing Raise)",
      reasoning: `With 4+ card support for partner's ${partnerSuit} and 13+ HCP, bid Jacoby 2NT. This is a game-forcing raise that asks opener to describe shortness or extra strength for slam evaluation. NOT a natural NT bid.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `4+ card ${partnerSuit} support, 13+ pts (at least 11 HCP). Game force — slam is possible.`,
      expectedResponses: [
        {
          partnerBid: "3♣/3♦/3♥/3♠",
          meaning: "Singleton or void in bid suit (slam try)",
        },
        { partnerBid: "3NT", meaning: "14-15 balanced, no shortness" },
        {
          partnerBid: `4${suitSymbol(partnerSuit)}`,
          meaning: "Minimum balanced (12-14 pts), sign off",
        },
        {
          partnerBid: `3${suitSymbol(partnerSuit)}`,
          meaning: "16+ pts, slam interest, no other call",
        },
        {
          partnerBid: "4♣/4♦",
          meaning: "5+ card side suit with quality (A or K)",
        },
      ],
      confidence: "high",
      note: "Jacoby 2NT is OFF if opponents interfere. If RHO doubled, use Jordan 2NT instead.",
    };
  }

  // Limit raise (10-12 TP, 3+ card support)
  if (isPartnerMajor && mySupport >= 3 && tp >= 10 && tp <= 12) {
    return {
      bid: `3${suitSymbol(partnerSuit)}`,
      category: "Limit Raise (10-12 TP)",
      reasoning: `With 10-12 total points and 3+ card ${partnerSuit} support, jump to 3${suitSymbol(partnerSuit)} as a limit raise. This is invitational — opener accepts with maximum, passes with minimum.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `10-12 TP, 3+ card ${partnerSuit} support. Invitational — will you accept?`,
      expectedResponses: [
        {
          partnerBid: `Pass/4${suitSymbol(partnerSuit)}`,
          meaning: "Pass = 13-15 TP (minimum, no game); bid game = 16+ TP",
        },
      ],
      confidence: "high",
    };
  }

  // Simple raise (6-9 TP, 3+ card support) — only for MAJOR, or minor when no 4-card major available
  if (mySupport >= 3 && tp >= 6 && tp <= 9) {
    // When partner opened a minor, prefer bidding a 4-card major before raising
    if (!isPartnerMajor) {
      const unbidMajors = [];
      if (hand.hearts >= 4) unbidMajors.push("hearts");
      if (hand.spades >= 4) unbidMajors.push("spades");
      if (unbidMajors.length > 0) {
        const suit = unbidMajors[0];
        return {
          bid: `1${suitSymbol(suit)}`,
          category:
            "New Suit at 1 Level (6-9 TP, prefer major over minor raise)",
          reasoning: `Bid your 4+ card ${suit} suit before raising partner's minor. Always prefer to show a 4-card major over raising a minor.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: `4+ card ${suit} suit, 6+ pts.`,
          expectedResponses: [
            {
              partnerBid: `2${suitSymbol(suit)}`,
              meaning: "4-card support, minimum",
            },
            { partnerBid: "1NT", meaning: "No 4-card major support, minimum" },
          ],
          confidence: "high",
        };
      }
    }
    return {
      bid: `2${suitSymbol(partnerSuit)}`,
      category: "Simple Raise (6-9 TP)",
      reasoning: `With 6-9 total points and 3+ card ${partnerSuit} support, make a simple raise to 2${suitSymbol(partnerSuit)}.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `6-9 TP, 3+ card ${partnerSuit} support.`,
      expectedResponses: [
        {
          partnerBid: "Pass",
          meaning: "13-15 TP — no game interest",
        },
        {
          partnerBid: `3${suitSymbol(partnerSuit)}`,
          meaning: "16-18 TP — game try (invite)",
        },
        {
          partnerBid: `4${suitSymbol(partnerSuit)}`,
          meaning: "19+ TP — game is certain",
        },
      ],
      confidence: "high",
    };
  }

  // New suit at 1 level (6-10 TP, 4+ card suit)
  if (tp >= 6 && tp <= 10) {
    const unbidMajors = [];
    if (partnerBid !== "1♥" && partnerBid !== "1♠" && hand.hearts >= 4)
      unbidMajors.push("hearts");
    if (partnerBid !== "1♠" && hand.spades >= 4) unbidMajors.push("spades");
    if (unbidMajors.length > 0) {
      const suit = unbidMajors[0];
      return {
        bid: `1${suitSymbol(suit)}`,
        category: "New Suit at 1 Level (6-10 TP)",
        reasoning: `Bid your 4+ card ${suit} suit at the 1 level. Always prefer to bid a 4-card major at the 1-level before NT or raising a minor.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `4+ card ${suit} suit, 6+ pts. One-round force.`,
        expectedResponses: [
          {
            partnerBid: `2${suitSymbol(suit)}`,
            meaning: "4-card support, minimum",
          },
          { partnerBid: "1NT", meaning: "15-17 balanced, no 4-card major" },
          { partnerBid: "2 of new suit", meaning: "New suit, 13-18 TP" },
        ],
        confidence: "high",
      };
    }
    return {
      bid: "1NT",
      category: "1NT Response (6-10 TP)",
      reasoning:
        "With 6-10 TP and no available 4-card major at the 1-level, bid 1NT. This is semi-forcing (opener may pass with a minimum balanced hand).",
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "6-10 pts, no fit for partner's suit, no 4-card major available at 1-level.",
      expectedResponses: [
        {
          partnerBid: "Pass",
          meaning: "13-15 TP minimum balanced — accepts 1NT",
        },
        {
          partnerBid: "2 of suit",
          meaning: "16-18 TP — shows second suit or rebids",
        },
      ],
      confidence: "medium",
    };
  }

  // Game-forcing new suit (13+ TP) — check 4-card majors before NT
  if (tp >= 13) {
    // 2-over-1: 5+ hearts over partner's 1♠ (can't bid 1♥ — must go to 2-level)
    if (partnerBid === "1♠" && hand.hearts >= 5) {
      return {
        bid: "2♥",
        category: "2-Over-1 New Suit (13+ TP, 5+ Hearts)",
        reasoning: `With ${tp} TP and 5+ hearts after partner's 1♠, bid 2♥ (2-over-1). This is a one-round force showing 5+ hearts and 10+ HCP. It does not set hearts as trump — opener can show a second suit or NT on rebid.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "5+ hearts, 10+ TP. One-round force — game is likely.",
        expectedResponses: [
          { partnerBid: "2NT", meaning: "Minimum balanced, no heart fit" },
          { partnerBid: "3♥", meaning: "3-card heart support — fit found" },
          { partnerBid: "3♠", meaning: "Strong 6-card spade suit, minimum" },
        ],
        confidence: "high",
      };
    }
    if (hand.hearts >= 4 && partnerBid !== "1♥" && partnerBid !== "1♠") {
      return {
        bid: "1♥",
        category: "New Suit — Game Force (13+ TP)",
        reasoning:
          "With 13+ TP and 4+ hearts, bid 1♥. Always show a 4-card major before bidding NT. This creates a game-forcing auction.",
        handAnalysis: analysis,
        whatYourBidTellsPartner: "4+ hearts, 13+ pts — game is assured.",
        expectedResponses: [
          { partnerBid: "2♥", meaning: "4-card support, minimum" },
          { partnerBid: "1♠", meaning: "4-card spades, no heart fit" },
          { partnerBid: "1NT", meaning: "15-17 balanced, no 4-card major" },
        ],
        confidence: "high",
      };
    }
    if (hand.spades >= 4 && partnerBid !== "1♠") {
      return {
        bid: "1♠",
        category: "New Suit — Game Force (13+ TP)",
        reasoning:
          "With 13+ TP and 4+ spades, bid 1♠. This creates a game-forcing situation.",
        handAnalysis: analysis,
        whatYourBidTellsPartner: "4+ spades, 13+ pts — game is assured.",
        expectedResponses: [
          { partnerBid: "2♠", meaning: "4-card support, minimum" },
          { partnerBid: "2NT", meaning: "18-19 balanced" },
        ],
        confidence: "high",
      };
    }
    return {
      bid: "2NT",
      category: "2NT Response (13-14 TP)",
      reasoning:
        "With 13-14 TP balanced and no 4-card major to show at the 1-level, bid 2NT as an invitational raise.",
      handAnalysis: analysis,
      whatYourBidTellsPartner: "13-14 TP, balanced. Invitational to 3NT.",
      expectedResponses: [
        { partnerBid: "Pass", meaning: "13-15 TP minimum" },
        { partnerBid: "3NT", meaning: "16+ TP — game accepted" },
      ],
      confidence: "medium",
    };
  }

  // 11-12 TP: bid 4-card major first, otherwise 2NT
  if (tp >= 11 && tp <= 12) {
    // 2-over-1: 5+ hearts over partner's 1♠ (can't bid 1♥ — must go to 2-level)
    if (partnerBid === "1♠" && hand.hearts >= 5) {
      return {
        bid: "2♥",
        category: "2-Over-1 New Suit (11-12 TP, 5+ Hearts)",
        reasoning: `With ${tp} TP and 5+ hearts after partner's 1♠, bid 2♥ (2-over-1). This is a one-round force showing 5+ hearts and 10+ HCP.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: "5+ hearts, 10+ TP. One-round force.",
        expectedResponses: [
          { partnerBid: "2NT", meaning: "Minimum balanced, no heart fit" },
          { partnerBid: "3♥", meaning: "3-card heart support — fit found" },
          { partnerBid: "3♠", meaning: "Strong 6-card spade suit, minimum" },
        ],
        confidence: "high",
      };
    }
    if (hand.hearts >= 4 && partnerBid !== "1♥" && partnerBid !== "1♠") {
      return {
        bid: "1♥",
        category: "New Suit at 1 Level (11-12 TP)",
        reasoning:
          "With 11-12 TP and 4+ hearts, bid 1♥ before going to NT. Always show a 4-card major over a minor opening — this keeps the major-suit game in play.",
        handAnalysis: analysis,
        whatYourBidTellsPartner: "4+ hearts, 11-12 pts. One-round force.",
        expectedResponses: [
          { partnerBid: "2♥", meaning: "4-card support, minimum" },
          { partnerBid: "1NT", meaning: "15-17 balanced, no heart fit" },
          { partnerBid: "1♠", meaning: "4-card spades" },
        ],
        confidence: "high",
      };
    }
    if (hand.spades >= 4 && partnerBid !== "1♠") {
      return {
        bid: "1♠",
        category: "New Suit at 1 Level (11-12 TP)",
        reasoning:
          "With 11-12 TP and 4+ spades, bid 1♠ before going to NT. Always show a 4-card major over a minor opening.",
        handAnalysis: analysis,
        whatYourBidTellsPartner: "4+ spades, 11-12 pts. One-round force.",
        expectedResponses: [
          { partnerBid: "2♠", meaning: "4-card support, minimum" },
          { partnerBid: "1NT", meaning: "15-17 balanced, no spade fit" },
        ],
        confidence: "high",
      };
    }
    return {
      bid: "2NT",
      category: "2NT Response (11-12 TP)",
      reasoning:
        "With 11-12 TP balanced and no 4-card major, bid 2NT as invitational.",
      handAnalysis: analysis,
      whatYourBidTellsPartner: "11-12 TP balanced.",
      expectedResponses: [
        { partnerBid: "Pass", meaning: "13-15 TP minimum" },
        { partnerBid: "3NT", meaning: "16+ TP — game" },
      ],
      confidence: "medium",
    };
  }

  return {
    bid: "1NT",
    category: "1NT Response",
    reasoning: "With 6-10 TP and no other suitable bid, respond 1NT.",
    handAnalysis: analysis,
    whatYourBidTellsPartner: "6-10 pts, no fit or 4-card major available.",
    expectedResponses: [],
    confidence: "medium",
  };
}

function getResponseToTwoClub(hand: Hand): BidRecommendation {
  const analysis = analyzeHand(hand);
  const { hcp } = hand;

  // Positive response (8+ HCP or any Ace+King)
  const hasAceAndKing = hcp >= 7;
  if (hcp >= 8 || hasAceAndKing) {
    const bestSuit = longestSuitInfo(hand);
    if (bestSuit.length >= 5) {
      return {
        bid: `2${suitSymbol(bestSuit.name)}`,
        category: "Positive Response to 2♣",
        reasoning: `With 8+ pts and a 5-card ${bestSuit.name} suit, make a positive response. This is game-forcing.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `8+ pts, natural 5+ card ${bestSuit.name} suit. Game-forcing.`,
        expectedResponses: [],
        confidence: "high",
      };
    }
    return {
      bid: "2NT",
      category: "Positive Response (Balanced) to 2♣",
      reasoning:
        "With 8+ HCP balanced, bid 2NT as a positive response. This is game-forcing.",
      handAnalysis: analysis,
      whatYourBidTellsPartner: "8+ HCP balanced. Game-forcing.",
      expectedResponses: [
        { partnerBid: "3♣ (Stayman)", meaning: "Looking for major suit fit" },
        { partnerBid: "3♦/3♥ (Transfer)", meaning: "Transfer to major" },
      ],
      confidence: "high",
    };
  }

  // Negative/waiting response 2♦ (0-7 pts)
  return {
    bid: "2♦",
    category: "Waiting Response to 2♣",
    reasoning:
      "With 0-7 pts, bid 2♦ as an artificial waiting response. This does NOT promise diamonds or deny values — it just says you are waiting to hear opener's rebid.",
    handAnalysis: analysis,
    whatYourBidTellsPartner:
      "Waiting (0-7 pts). You will support opener's suit or bid NT on the next round.",
    expectedResponses: [
      { partnerBid: "2♥/2♠", meaning: "5+ card major — forcing to game" },
      {
        partnerBid: "2NT",
        meaning: "22-24 balanced — Stayman and transfers now apply",
      },
      { partnerBid: "3♣/3♦", meaning: "Strong minor suit — forcing to game" },
    ],
    confidence: "high",
    note: "All of opener's rebids (except 2NT) are forcing to game.",
  };
}

function getResponseToWeak2(hand: Hand, partnerBid: string): BidRecommendation {
  const analysis = analyzeHand(hand);
  const { hcp } = hand;
  const { tp } = analysis;
  const partnerSuit =
    partnerBid === "2♠"
      ? "spades"
      : partnerBid === "2♥"
        ? "hearts"
        : "diamonds";
  const partnerSuitSym = suitSymbol(partnerSuit);
  const mySupport = hand[partnerSuit as keyof Hand] as number;

  // ── 4+ trump support: bid game directly regardless of HCP ─────────────────
  // Bridgedoctor: "Raise to 4: 4-card support OR 16+ TP with at least 2-card support"
  if (mySupport >= 4) {
    const gameBid = `4${partnerSuitSym}`;
    return {
      bid: gameBid,
      category: `Game Raise of Weak 2 (${mySupport}-Card Support)`,
      reasoning: `With ${mySupport}-card ${partnerSuit} support, raise to ${gameBid}. A 10-card fit with partner's 6-card suit provides a solid foundation — game is likely even opposite a minimum weak 2.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `4+ card ${partnerSuit} support — bidding game. This may also be pre-emptive against opponents.`,
      expectedResponses: [
        { partnerBid: "Pass", meaning: "Accept the game contract" },
      ],
      confidence: "high",
    };
  }

  // ── Balanced hand with 16+ HCP and limited support: bid 3NT ───────────────
  // Bridgedoctor: "3NT: good hand, 16+ HCP, good cards in all outside suits"
  // Only for balanced hands — unbalanced hands with a long side suit bid that suit instead.
  if (hcp >= 16 && mySupport <= 2 && analysis.isBalanced) {
    return {
      bid: "3NT",
      category: "3NT Response to Weak 2 (16+ HCP, Balanced)",
      reasoning: `With ${hcp} HCP (balanced) and only ${mySupport}-card ${partnerSuit} support, bid 3NT — showing a game-going balanced hand with stoppers in all outside suits. Preferred over 2NT inquiry when you can guarantee game.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "16+ HCP, balanced, stoppers in outside suits — game in NT.",
      expectedResponses: [
        { partnerBid: "Pass", meaning: "Partner passes 3NT" },
        {
          partnerBid: `4${partnerSuitSym}`,
          meaning: "Partner corrects to suit game with a long solid suit",
        },
      ],
      confidence: "high",
    };
  }

  // ── New suit (forcing): 16+ TP with a 6-card side suit ────────────────────
  // Bridgedoctor: "New suit: Good suit, 16+ TP"
  if (tp >= 16) {
    const newSuit = (["clubs", "diamonds", "hearts", "spades"] as const).find(
      (s) => s !== partnerSuit && (hand[s as keyof Hand] as number) >= 6,
    );
    if (newSuit) {
      const newSuitBid = `3${suitSymbol(newSuit)}`;
      return {
        bid: newSuitBid,
        category: `New Suit over Weak 2 (${newSuitBid}, 16+ TP)`,
        reasoning: `With a ${hand[newSuit as keyof Hand] as number}-card ${newSuit} suit and ${tp} TP (${hcp} HCP), bid ${newSuitBid} — a forcing new suit. Partner supports ${newSuit} with 3+ cards or bids game in their own suit.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `6+ card ${newSuit} suit, game-going strength (16+ TP). Forcing — support or describe your hand.`,
        expectedResponses: [
          {
            partnerBid: `4${suitSymbol(newSuit)}`,
            meaning: `3+ card ${newSuit} support — game in ${newSuit}`,
          },
          {
            partnerBid: `4${partnerSuitSym}`,
            meaning: "No new suit support — returning to own suit game",
          },
        ],
        confidence: "high",
        note: "SAYC: New suit over weak 2 is forcing for one round.",
      };
    }
  }

  // ── 2NT forcing inquiry: 13+ HCP, want more info before committing to game ─
  // Bridgedoctor: "2NT: A FORCING inquiry as to partner's strength"
  // 13-14 HCP is game-going but uncertain without knowing partner's strength range.
  if (hcp >= 13) {
    return {
      bid: "2NT",
      category: "2NT Inquiry over Weak 2",
      reasoning: `With ${hcp} HCP, bid 2NT as a forcing inquiry. This asks partner to describe their hand: rebid the suit with a minimum (5-7 HCP), or show a side feature (A or K) with a maximum (8-10 HCP).`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "15 HCP — game interest. Describe your hand.",
      expectedResponses: [
        {
          partnerBid: `3${partnerSuitSym}`,
          meaning: "Minimum (5-7 HCP) — rebids own suit",
        },
        {
          partnerBid: "New suit with A/K",
          meaning: "Maximum (8-10 HCP) — shows a side suit feature",
        },
        { partnerBid: "3NT", meaning: "Maximum with 2 of top 3 trump honors" },
      ],
      confidence: "high",
      note: "RONF: Raises by responder are non-forcing. New suits by responder are game-forcing.",
    };
  }

  // ── Pre-emptive raise: 3-card support and ≤12 HCP ─────────────────────────
  if (mySupport >= 3) {
    return {
      bid: `3${partnerSuitSym}`,
      category: "Pre-emptive Raise of Weak 2",
      reasoning: `With ${mySupport}-card ${partnerSuit} support and ${hcp} HCP, raise to 3${partnerSuitSym} — a pre-emptive raise, not invitational. This further obstructs opponents while supporting partner's long suit.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "3-card support (≤12 HCP). Pre-emptive — not invitational.",
      expectedResponses: [
        {
          partnerBid: "Pass",
          meaning: "Raises are non-forcing — partner passes",
        },
      ],
      confidence: "high",
      note: "RONF: Opener should pass — raises are pre-emptive, not invitational.",
    };
  }

  return {
    bid: "Pass",
    category: "Pass (Weak 2 Response)",
    reasoning: `With ${hcp} HCP and only ${mySupport}-card ${partnerSuit} support, pass the Weak 2.`,
    handAnalysis: analysis,
    whatYourBidTellsPartner: "No support or game interest.",
    expectedResponses: [],
    confidence: "medium",
  };
}

function getResponseToPreempt(
  hand: Hand,
  partnerBid: string,
): BidRecommendation {
  const analysis = analyzeHand(hand);
  const { hcp } = hand;
  const partnerSuit = partnerBid.includes("♠")
    ? "spades"
    : partnerBid.includes("♥")
      ? "hearts"
      : partnerBid.includes("♦")
        ? "diamonds"
        : "clubs";
  const mySupport = hand[partnerSuit as keyof Hand] as number;
  const preemptLevel = parseInt(partnerBid[0]) || 3;

  // Very strong hand (16+ HCP): game over pre-empt
  if (hcp >= 16) {
    // If we have a long major, bid it (new suit = game-forcing over preempt)
    const longMajor =
      hand.spades >= 5 ? "spades" : hand.hearts >= 5 ? "hearts" : null;
    if (longMajor && longMajor !== partnerSuit) {
      const gameBid = `4${suitSymbol(longMajor)}`;
      return {
        bid: gameBid,
        category: "Bid Own Major over Pre-empt (16+ HCP)",
        reasoning: `With 16+ HCP and ${hand[longMajor as keyof Hand]}-card ${longMajor}, bid ${gameBid}. A new suit at game level is natural and shows a self-sufficient major suit.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `Self-sufficient ${longMajor} suit, 16+ HCP.`,
        expectedResponses: [
          {
            partnerBid: "Pass",
            meaning: "Pre-emptive opener doesn't bid again unless correcting",
          },
        ],
        confidence: "high",
      };
    }
    return {
      bid: `4${suitSymbol(partnerSuit)}`,
      category: "Game over Pre-empt",
      reasoning:
        "With 16+ HCP, bid game in partner's suit or bid a new suit (game-forcing).",
      handAnalysis: analysis,
      whatYourBidTellsPartner: "16+ pts — game values.",
      expectedResponses: [
        {
          partnerBid: "Pass",
          meaning:
            "Pre-emptive opener does not bid again unless you bid a new suit",
        },
      ],
      confidence: "high",
      note: "Be cautious about 3NT — opener will have very few side entries.",
    };
  }

  // Good hand (10-15 HCP): bid a 5-card major as a new forcing suit
  if (hcp >= 10) {
    const longMajor =
      hand.spades >= 5 ? "spades" : hand.hearts >= 5 ? "hearts" : null;
    if (longMajor && longMajor !== partnerSuit) {
      const bid = `${preemptLevel}${suitSymbol(longMajor)}`;
      return {
        bid,
        category: "New Suit over Pre-empt (Invitational, 10-15 HCP)",
        reasoning: `With ${hcp} HCP and 5+ ${longMajor}, bid ${bid} — a new suit over a preempt is game-forcing (or at least highly invitational). Partner should pass only with a complete minimum.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `5+ ${longMajor} suit, 10-15 HCP. Forcing.`,
        expectedResponses: [
          {
            partnerBid: `4${suitSymbol(longMajor)}`,
            meaning: "Fit for your major — bid game",
          },
          {
            partnerBid: "Pass",
            meaning: "Absolute minimum — accepts the contract",
          },
        ],
        confidence: "medium",
      };
    }
    // No 5-card major but 10+ HCP — bid 3NT as game-invitational
    if (hcp >= 13 && analysis.isBalanced) {
      return {
        bid: "3NT",
        category: "3NT over Pre-empt (13+ HCP Balanced)",
        reasoning: `With ${hcp} HCP balanced and no 5-card major, bid 3NT over partner's pre-empt. Combined strength is likely enough for 3NT game.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: "13+ HCP balanced — game in NT.",
        expectedResponses: [
          { partnerBid: "Pass", meaning: "Pre-empt opener doesn't bid again" },
        ],
        confidence: "high",
      };
    }
  }

  // Some support for partner's pre-empt suit: raise to further crowd opponents
  if (mySupport >= 3 && hcp <= 9) {
    const preemptSym = partnerBid.match(/[♣♦♥♠]/)?.[0] ?? "♠";
    const raisePreemptBid = `${preemptLevel + 1}${preemptSym}`;
    return {
      bid: raisePreemptBid,
      category: "Raise Pre-empt",
      reasoning: `With 3+ card support and 0-9 pts, raise the pre-empt by one level to ${raisePreemptBid} (further crowding the opponents).`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "3+ support — extending the pre-empt.",
      expectedResponses: [
        { partnerBid: "Pass", meaning: "Opener does not bid again" },
      ],
      confidence: "high",
    };
  }

  return {
    bid: "Pass",
    category: "Pass (Pre-empt Response)",
    reasoning: `With ${hcp} HCP, no 5-card major, and fewer than 3-card support for partner's ${partnerSuit}, pass. Game is unlikely with minimum values.`,
    handAnalysis: analysis,
    whatYourBidTellsPartner: "No support or game interest.",
    expectedResponses: [],
    confidence: "high",
  };
}

// ─── Overcalls ───────────────────────────────────────────────────────────────

function getOvercall(
  hand: Hand,
  opponentBid: string,
  vul: Vulnerability,
): BidRecommendation {
  const analysis = analyzeHand(hand);
  const { hcp } = hand;
  const { tp } = analysis;

  // For NT bids, there is no single "opponent suit" — treat as null so all suits remain
  // available for overcalling (the old default of "clubs" was silently filtering out clubs).
  const opponentIsNT = opponentBid.endsWith("NT");
  const opponentSuit = opponentIsNT
    ? null
    : opponentBid.includes("♠")
      ? "spades"
      : opponentBid.includes("♥")
        ? "hearts"
        : opponentBid.includes("♦")
          ? "diamonds"
          : "clubs";

  // ── Overcall over an NT bid (1NT/2NT/3NT from RHO) ──────────────────────────
  if (opponentIsNT) {
    const ntLevel = parseInt(opponentBid[0]);

    // Penalty double of 1NT (16+ HCP balanced)
    if (ntLevel === 1 && hcp >= 16 && analysis.isBalanced) {
      return {
        bid: "Double",
        category: "Penalty Double of 1NT",
        reasoning:
          "With 16+ HCP balanced over opponent's 1NT, double for penalty. Your combined strength exceeds theirs.",
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "16+ HCP balanced. Penalty double — pass unless very unbalanced.",
        expectedResponses: [
          {
            partnerBid: "Pass",
            meaning: "5+ pts — generally pass and collect the penalty",
          },
          {
            partnerBid: "Bid a suit",
            meaning: "0-4 pts and very unbalanced — escape to longest suit",
          },
        ],
        confidence: "high",
      };
    }

    // Find longest suit (all 4 suits eligible — no "opponent suit" to exclude)
    const allSuits = [
      { name: "spades", count: hand.spades },
      { name: "hearts", count: hand.hearts },
      { name: "diamonds", count: hand.diamonds },
      { name: "clubs", count: hand.clubs },
    ].sort((a, b) => b.count - a.count || b.count - a.count);

    const bestSuit = allSuits[0];
    // nextLevel is always ntLevel + 1: any suit bid at level N+1 is above an NT at level N
    const nextLevel = ntLevel + 1;
    const suitBid = `${nextLevel}${suitSymbol(bestSuit.name)}`;

    // Preemptive bid with very long suit (6+ cards)
    if (bestSuit.count >= 6 && tp >= 7) {
      return {
        bid: suitBid,
        category: `Preemptive Overcall over ${opponentBid} — Long ${bestSuit.name.charAt(0).toUpperCase() + bestSuit.name.slice(1)} Suit`,
        reasoning: `With ${bestSuit.count} ${bestSuit.name} and ${hcp} HCP, bid ${suitBid} over opponent's ${opponentBid}. This shows a long self-sufficient suit and makes it hard for the opponents to find their best spot. Your offensive trick count in ${bestSuit.name} is strong even without partner's help.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `Long ${bestSuit.name} suit (${bestSuit.count}+ cards), ${tp} total pts. Not a strong hand — distributional values.`,
        expectedResponses: [
          { partnerBid: "Pass", meaning: "Not enough to raise or bid game" },
          {
            partnerBid: `Raise to ${nextLevel + 1}${suitSymbol(bestSuit.name)}`,
            meaning: "Fit and some values",
          },
        ],
        confidence: "high",
        note: `Over ${opponentBid}, doubling is also an option to show values and interest in defending — partner can pass (penalty) or bid a suit.`,
      };
    }

    // Suit overcall with 5-card suit
    if (bestSuit.count >= 5 && hcp >= 8) {
      return {
        bid: suitBid,
        category: `Natural Overcall over ${opponentBid}`,
        reasoning: `With 5+ ${bestSuit.name} and ${hcp} HCP, bid ${suitBid} over opponent's ${opponentBid} to show your suit.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `5+ ${bestSuit.name}, ${hcp} HCP.`,
        expectedResponses: [
          { partnerBid: "Pass", meaning: "Weak or no fit" },
          { partnerBid: "Raise", meaning: "Fit and some values" },
        ],
        confidence: "medium",
      };
    }

    // Strong double (10+ HCP) over 2NT or any NT
    if (hcp >= 10) {
      return {
        bid: "Double",
        category: `Takeout/Penalty Double of ${opponentBid}`,
        reasoning: `With ${hcp} HCP over opponent's ${opponentBid}, double to show values. Partner can pass for penalty or bid their best suit.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `${hcp} HCP and interest in competing. Pass for penalty or bid a suit.`,
        expectedResponses: [
          { partnerBid: "Pass", meaning: "Willing to defend — penalty" },
          { partnerBid: "Bid a suit", meaning: "Prefers to compete" },
        ],
        confidence: "medium",
      };
    }

    // Default: Pass over NT with weak hand and no long suit
    return {
      bid: "Pass",
      category: `Pass Over Opponent's ${opponentBid}`,
      reasoning: `With only ${hcp} HCP and no long suit, passing over opponent's ${opponentBid} is safest. Entering the auction at the 3-level risks a large penalty.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "No action — limited hand.",
      expectedResponses: [],
      confidence: "medium",
    };
  }

  // Past this point we are handling a suit opening — opponentSuit is guaranteed non-null.
  const suitOpponent = opponentSuit as string;

  // Strong NT overcall (15-18 HCP balanced, stopper in opponent's suit)
  // After a 1-level opening bid 1NT; after a 2-level opening bid 2NT; after 3-level bid 3NT.
  if (hcp >= 15 && hcp <= 18 && analysis.isBalanced) {
    const opponentIdx = BID_ORDER.indexOf(opponentBid);
    let ntLevel = 1;
    while (BID_ORDER.indexOf(`${ntLevel}NT`) <= opponentIdx) {
      ntLevel++;
    }
    const ntBid = `${ntLevel}NT`;
    const is2PlusNT = ntLevel >= 2;
    return {
      bid: ntBid,
      category: `Strong ${ntBid} Overcall (15-18 HCP)`,
      reasoning: `With 15-18 HCP balanced and a stopper in the opponent's suit, bid ${ntBid}. Responses are the same as to a ${ntBid} opening.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `15-18 HCP balanced with a stopper in their suit.${is2PlusNT ? "" : " Stayman and transfers apply."}`,
      expectedResponses: is2PlusNT
        ? [
            { partnerBid: "3♣", meaning: "Stayman" },
            { partnerBid: "3♦", meaning: "Transfer to hearts" },
            { partnerBid: "3♥", meaning: "Transfer to spades" },
          ]
        : [
            { partnerBid: "2♣", meaning: "Stayman" },
            { partnerBid: "2♦", meaning: "Transfer to hearts" },
            { partnerBid: "2♥", meaning: "Transfer to spades" },
          ],
      confidence: "high",
      note: "You must have a stopper (A, Kx, Qxx, or Jxxx) in the opponent's suit to bid NT.",
    };
  }

  // Build suit lists for overcall checks (Michaels, jump overcall, simple overcall)
  const suits = [
    { name: "spades", count: hand.spades },
    { name: "hearts", count: hand.hearts },
    { name: "diamonds", count: hand.diamonds },
    { name: "clubs", count: hand.clubs },
  ].filter((s) => s.name !== suitOpponent);

  const inOpponentSuit = hand[suitOpponent as keyof Hand] as number;

  // Michaels cuebid (5-5 in two suits) — check BEFORE simple overcall
  const suitsList = suits.filter((s) => s.count >= 5);
  if (suitsList.length >= 2) {
    const michaelsMeaning =
      suitOpponent === "clubs" || suitOpponent === "diamonds"
        ? "both majors (5+ hearts and 5+ spades)"
        : suitOpponent === "hearts"
          ? "5+ spades + 5+ unspecified minor"
          : "5+ hearts + 5+ unspecified minor";
    return {
      bid: `2${suitSymbol(suitOpponent)}`,
      category: "Michaels Cuebid (5-5 Two-Suiter)",
      reasoning: `With 5+ cards in two suits, bid the Michaels cuebid (2${suitSymbol(suitOpponent)}). Over a minor opening, this shows ${michaelsMeaning}. No point minimum, but vulnerability matters.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `Two-suited hand (5-5+): ${michaelsMeaning}. Partner picks the best suit.`,
      expectedResponses: [
        {
          partnerBid: "Bid cheapest suit",
          meaning: "With equal length in both shown suits",
        },
        {
          partnerBid: "2NT",
          meaning: "Asks overcaller to name the minor (after major overcall)",
        },
        { partnerBid: "Cue bid", meaning: "Game or slam interest" },
      ],
      confidence: "medium",
      note:
        vul === "we-only" || vul === "both"
          ? "Vulnerable — be more conservative with minimum Michaels hands."
          : "Consider whether your suits have good quality before committing to Michaels.",
    };
  }

  // Jump overcall / preemptive overcall (5-10 HCP, 6+ card suit)
  // Scale the level to suit length: 6-cards → 2-level, 7-cards → 3-level, 8+ cards → 4-level
  const sixCardSuits = suits.filter((s) => s.count >= 6);
  if (sixCardSuits.length > 0 && hcp >= 5 && hcp <= 10) {
    const best = sixCardSuits[0];
    // Choose the natural preemptive level for the suit length
    const naturalLevel = best.count >= 8 ? 4 : best.count >= 7 ? 3 : 2;
    const opponentBidIdx = BID_ORDER.indexOf(opponentBid);
    // Ensure we bid above the opponent and at least at the natural preemptive level
    const suitSym = suitSymbol(best.name);
    let jumpBid = `${naturalLevel}${suitSym}`;
    if (BID_ORDER.indexOf(jumpBid) <= opponentBidIdx) {
      // Natural level is not above opponent — go one higher
      jumpBid = `${naturalLevel + 1}${suitSym}`;
    }
    const levelName =
      naturalLevel === 4
        ? "Game Preempt"
        : naturalLevel === 3
          ? "3-Level Preempt"
          : "Weak Jump Overcall";
    const isTwoClubs = jumpBid === "2♣";
    return {
      bid: jumpBid,
      category: `${levelName} (${best.count}-Card ${best.name.charAt(0).toUpperCase() + best.name.slice(1)})`,
      reasoning: `With ${hcp} HCP and ${best.count} ${best.name}, make a preemptive ${jumpBid} overcall. The preemptive level scales with suit length — 6 cards → 2-level, 7 cards → 3-level, 8+ cards → 4-level. Your ${best.count}-card suit offers strong offensive potential while making it hard for opponents to find their fit.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `${hcp} HCP, ${best.count}-card ${best.name} suit. Preemptive — not a strong hand.`,
      expectedResponses: [
        {
          partnerBid: `Raise to ${parseInt(jumpBid[0]) + 1}${suitSym}`,
          meaning: "Fit + values — push the preempt higher",
        },
        {
          partnerBid: "Pass",
          meaning: "No fit or minimal values — trust the preempt",
        },
        {
          partnerBid: `${parseInt(jumpBid[0]) + 2}${suitSym} or game`,
          meaning: "Strong fit — bid game or slam",
        },
      ],
      confidence: "high",
      note: isTwoClubs
        ? "2♣ as an OVERCALL is natural clubs — it is NOT the same as a 2♣ opening bid (which would be a strong 22+ HCP artificial bid). Overcalling 2♣ simply shows a long club suit."
        : vul === "we-only" || vul === "both"
          ? "Vulnerable — be sure your suit has at least two of the top three honors (A, K, Q)."
          : undefined,
    };
  }

  // Simple suit overcall (8-15 HCP, 5-card suit) — checked BEFORE takeout double
  // A specific suit overcall is more descriptive than a takeout double when available.
  const fiveCardSuits = suits.filter((s) => s.count >= 5);
  if (fiveCardSuits.length > 0 && hcp >= 8 && hcp <= 15) {
    const best = fiveCardSuits.sort((a, b) => b.count - a.count)[0];

    // Calculate the minimum level at which we can overcall this suit — must be
    // strictly above opponent's bid (handles 1-level, 2-level, and 3-level overcalls)
    const suitSym = suitSymbol(best.name);
    const opponentIdx = BID_ORDER.indexOf(opponentBid);
    let overcallLevel = 1;
    while (BID_ORDER.indexOf(`${overcallLevel}${suitSym}`) <= opponentIdx) {
      overcallLevel++;
    }
    const overcallBid = `${overcallLevel}${suitSym}`;

    // A 2-level or higher overcall requires at least 10 HCP — with 8–9 fall through to Pass
    if (overcallLevel >= 2 && hcp < 10) {
      // fall through to takeout double / pass below
    } else {
      const honorNote =
        hcp <= 10
          ? " Make sure your suit has at least 2 honors (NF Bridge requirement for minimum overcall)."
          : "";
      const vulNote =
        vul === "we-only" || vul === "both"
          ? " You are vulnerable — be more selective about overcalling with minimum values."
          : "";
      const levelName =
        overcallLevel === 1
          ? "1-Level"
          : overcallLevel === 2
            ? "2-Level"
            : `${overcallLevel}-Level`;
      return {
        bid: overcallBid,
        category: `${levelName} Overcall (${hcp} HCP, ${best.count}-Card ${best.name.charAt(0).toUpperCase() + best.name.slice(1)})`,
        reasoning: `With ${hcp} HCP and ${best.count} ${best.name}, overcall ${overcallBid}. A ${levelName.toLowerCase()} overcall shows a good ${best.count}-card suit and ${overcallLevel === 1 ? "8-15" : "10-15"} HCP.${honorNote}${vulNote}`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `${hcp} HCP, ${best.count}-card ${best.name} suit. ${overcallLevel >= 2 ? "10-15 HCP minimum for 2-level or higher." : ""}`,
        expectedResponses: [
          {
            partnerBid: "Raise (support + values)",
            meaning: "3+ card support, appropriate values",
          },
          {
            partnerBid: "Cue bid opponent's suit",
            meaning: "Strong hand — asking for clarification",
          },
          { partnerBid: "Pass", meaning: "No fit, no game values" },
        ],
        confidence: "high",
        note:
          best.count === 5
            ? "With exactly 5 cards: make sure they are headed by at least the King or Ace for a sound overcall."
            : undefined,
      };
    }
  }

  // Takeout Double (12-15 HCP, short in opponent's suit, good shape — 3+ cards in each unbid suit)
  // Requires hasGoodShape: a takeout double promises support for all unbid suits.
  // Only check the three suits NOT bid by the opponent.
  const unOpenedSuits = (
    ["spades", "hearts", "diamonds", "clubs"] as const
  ).filter((s) => s !== suitOpponent);
  const hasGoodShape =
    inOpponentSuit <= 1 &&
    unOpenedSuits.every((s) => (hand[s as keyof Hand] as number) >= 3);

  if (hcp >= 12 && hcp <= 15 && hasGoodShape) {
    return {
      bid: "Double",
      category: "Takeout Double (12-15 HCP)",
      reasoning: `With ${hcp} HCP, 0-1 card in opponent's ${suitOpponent}, and 3+ cards in every unbid suit, double for takeout. This is the classic takeout double shape (4441/5440 distribution) — you are asking partner to bid their best suit among the unbid suits.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `Opening strength (12-15 HCP) with 0-1 card in ${suitOpponent} and support for all unbid suits. Please bid your best suit.`,
      expectedResponses: [
        {
          partnerBid: "1NT (balanced + stopper)",
          meaning: "6-10 pts balanced with stopper in opponents' suit",
        },
        { partnerBid: "2NT (balanced + stopper)", meaning: "11-12 pts" },
        { partnerBid: "3NT (balanced + stopper)", meaning: "13-15 pts" },
        {
          partnerBid: "Bid a suit",
          meaning:
            "0-8 pts — bid longest suit (prefer 4+ card major over longer minor)",
        },
        { partnerBid: "Jump bid in suit", meaning: "9-12 pts" },
        { partnerBid: "Game", meaning: "13+ pts" },
      ],
      confidence: "high",
      note: "Do NOT bid again unless partner promises values (a jump or cue bid). Shape is less important with 16+ pts.",
    };
  }

  // High-strength double (16+) then rebid
  if (hcp >= 16 && hcp <= 18 && inOpponentSuit <= 1) {
    return {
      bid: "Double",
      category: "High-Strength Takeout Double (16-18 HCP)",
      reasoning:
        "With 16-18 HCP, double first to show a strong hand. On the next round, bid your long suit (or NT if balanced) to reveal extra strength beyond a normal overcall.",
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "Strong hand — double first reveals extra strength beyond 12-15.",
      expectedResponses: [],
      confidence: "high",
      note: "After partner responds, rebid your long suit or NT to show 16-18 HCP.",
    };
  }

  if (hcp >= 19 && analysis.isBalanced) {
    return {
      bid: "Double",
      category: "High-Strength Double (19+ HCP Balanced)",
      reasoning:
        "With 19+ HCP balanced, double first. On the next round, rebid NT at the lowest available level to show 19+ balanced — too strong for an immediate 1NT/2NT overcall.",
      handAnalysis: analysis,
      whatYourBidTellsPartner: "19+ HCP balanced — very strong hand.",
      expectedResponses: [],
      confidence: "high",
      note: "After partner responds, rebid the lowest available NT to show 19+ balanced.",
    };
  }

  // Unusual 2NT (5-5 in two lowest unbid suits)
  const lowest2Unbid = [
    { name: "clubs", count: hand.clubs },
    { name: "diamonds", count: hand.diamonds },
    { name: "hearts", count: hand.hearts },
  ].filter((s) => s.name !== suitOpponent && s.count >= 5);

  if (lowest2Unbid.length >= 2 && tp >= 5) {
    return {
      bid: "Unusual 2NT",
      category: "Unusual 2NT (5-5 in Lower Suits)",
      reasoning:
        "With 5-5 in the two lowest unbid suits, bid Unusual 2NT. Over 1♥/1♠ this shows clubs and diamonds (both minors).",
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "5+ cards in each of the two lowest unbid suits.",
      expectedResponses: [
        { partnerBid: "3♣/3♦", meaning: "Choose the better minor" },
      ],
      confidence: "medium",
      note:
        vul === "we-only" || vul === "both"
          ? "Vulnerable — this can be costly if doubled. Ensure good suit quality."
          : undefined,
    };
  }

  return {
    bid: "Pass",
    category: "Pass (No Good Overcall)",
    reasoning: (() => {
      const parts: string[] = [];
      if (inOpponentSuit >= 4) {
        parts.push(
          `Your longest suit is the opponent's suit (${inOpponentSuit} ${suitOpponent}) — you cannot make a natural overcall in it.`,
        );
      }
      if (!analysis.isBalanced) {
        parts.push(
          "Your hand is unbalanced (singleton or void), so a 1NT overcall (which requires a balanced hand) is not available.",
        );
      }
      if (inOpponentSuit > 1) {
        parts.push(
          `A takeout double requires shortness (0–1 cards) in the opponent's suit, but you hold ${inOpponentSuit} ${suitOpponent}.`,
        );
      }
      const minorHeart =
        hand.hearts <= 2 || hand.spades <= 2
          ? "With only " +
            (hand.hearts <= 2
              ? `${hand.hearts} heart${hand.hearts === 1 ? "" : "s"}`
              : `${hand.spades} spade${hand.spades === 1 ? "" : "s"}`) +
            ", doubling could leave partner stranded in a short major."
          : "";
      if (minorHeart) parts.push(minorHeart);
      const longestUnbid = suits.reduce(
        (best, s) => (s.count > best.count ? s : best),
        { name: "", count: 0 },
      );
      if (longestUnbid.count > 0 && longestUnbid.count < 5) {
        parts.push(
          `Your longest unbid suit has only ${longestUnbid.count} cards — a natural overcall requires 5+.`,
        );
      }
      parts.push(
        "Pass for now. If the opponents stop low you may get a chance to enter the auction later (balancing position).",
      );
      return parts.join(" ");
    })(),
    handAnalysis: analysis,
    whatYourBidTellsPartner: "No suitable overcall — passing.",
    expectedResponses: [],
    confidence: "high",
  };
}

// ─── Negative Double ─────────────────────────────────────────────────────────

function getNegativeDouble(
  hand: Hand,
  openerBid: string,
  overcall: string,
): BidRecommendation {
  const analysis = analyzeHand(hand);
  const { hcp } = hand;
  const overcallLevel = parseInt(overcall.charAt(0)) || 1;

  // Determine which majors are unbid
  const openedHearts = openerBid.includes("♥");
  const openedSpades = openerBid.includes("♠");
  const overcalledHearts = overcall.includes("♥");
  const overcalledSpades = overcall.includes("♠");

  const heartsUnbid = !openedHearts && !overcalledHearts;
  const spadesUnbid = !openedSpades && !overcalledSpades;

  if (hcp < 6) {
    return {
      bid: "Pass",
      category: "Pass (Too Weak for Negative Double)",
      reasoning:
        "With fewer than 6 HCP, pass. You need at least 6 pts for a negative double.",
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Too weak to act.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  let shownSuits = "";
  if (heartsUnbid && spadesUnbid) {
    shownSuits = "4+ hearts AND 4+ spades (both majors at 1-level)";
  } else if (heartsUnbid) {
    shownSuits = "4+ hearts";
    if (overcallLevel >= 2)
      shownSuits += " (or a hand too weak to bid hearts directly)";
  } else if (spadesUnbid) {
    shownSuits = "4+ spades";
  } else {
    shownSuits = "4+ cards in at least one unbid suit";
  }

  return {
    bid: "Double",
    category: "Negative Double (Sputnik)",
    reasoning: `After partner opens and RHO overcalls, double through 2♠ is a NEGATIVE (not penalty) double. With ${hcp} HCP and the right shape, this shows ${shownSuits} and asks partner to bid your suit.`,
    handAnalysis: analysis,
    whatYourBidTellsPartner: `${shownSuits} with 6+ pts. You cannot bid the suit directly (wrong level or hand too weak).`,
    expectedResponses: [
      {
        partnerBid: "Bid shown suit at cheapest level",
        meaning: "Minimum opener (11-14 TP)",
      },
      { partnerBid: "Jump in shown suit", meaning: "15-17 TP — strong" },
      { partnerBid: "Game in shown suit", meaning: "18-19 TP — game-forcing" },
      {
        partnerBid: "NT bid",
        meaning: "Has a stopper in overcalled suit, no 4-card fit",
      },
    ],
    confidence: "high",
    note: "Negative doubles are OFF if the opponents bid above 2♠. In that case, a double would be for penalty.",
  };
}

// ─── Responding to Partner's Overcall ────────────────────────────────────────

function getResponseToSimpleOC(
  hand: Hand,
  partnerBid: string,
  opponentBid?: string,
): BidRecommendation {
  const analysis = analyzeHand(hand);
  const { hcp } = hand;
  const partnerSuit = partnerBid.includes("♠")
    ? "spades"
    : partnerBid.includes("♥")
      ? "hearts"
      : partnerBid.includes("♦")
        ? "diamonds"
        : "clubs";
  const mySupport = hand[partnerSuit as keyof Hand] as number;

  if (mySupport >= 3) {
    if (hcp >= 10) {
      // Compute the cue bid: opener's suit at cheapest level above partner's overcall
      const opponentSuit = opponentBid
        ? opponentBid.includes("♠")
          ? "spades"
          : opponentBid.includes("♥")
            ? "hearts"
            : opponentBid.includes("♦")
              ? "diamonds"
              : "clubs"
        : "clubs";
      const partnerLevel = parseInt(partnerBid[0]) || 1;
      // Cue bid is in the opponent's suit; it must be above the last bid
      const cueBidLevel =
        BID_ORDER.indexOf(`${partnerLevel}${suitSymbol(opponentSuit)}`) >
        BID_ORDER.indexOf(partnerBid)
          ? partnerLevel
          : partnerLevel + 1;
      const cueBid = `${cueBidLevel}${suitSymbol(opponentSuit)}`;
      return {
        bid: cueBid,
        category: "Cue Bid (10+ pts, 3+ support)",
        reasoning: `With 10+ pts and 3+ card support for partner's overcall, cue bid opener's suit (${cueBid}) to show game interest.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: "10+ pts with support. Looking for game.",
        expectedResponses: [],
        confidence: "high",
      };
    }

    // Law of Total Tricks: partner has ~5 trumps; total = 5 + mySupport
    const partnerLevel = parseInt(partnerBid[0]) || 1;
    const suitSym = partnerBid.match(/[♣♦♥♠]/)?.[0] ?? "♠";
    const totalTrumps = 5 + mySupport;
    const raiseLevel = Math.min(
      4,
      totalTrumps <= 8
        ? partnerLevel + 1
        : totalTrumps <= 9
          ? partnerLevel + 2
          : 4,
    );
    const specificBid = `${raiseLevel}${suitSym}`;
    const lawExplanation =
      mySupport === 3
        ? `With 3-card support (est. ${totalTrumps} total trumps), the Law of Total Tricks says bid to the ${raiseLevel}-level.`
        : mySupport === 4
          ? `With 4-card support (est. ${totalTrumps} total trumps), a preemptive raise to ${raiseLevel} takes away opponent bidding space.`
          : `With ${mySupport}-card support (est. ${totalTrumps} total trumps), raise aggressively to ${raiseLevel}.`;

    return {
      bid: specificBid,
      category: `Raise to ${raiseLevel}-Level (0-9 pts, ${mySupport}-card support)`,
      reasoning: `${lawExplanation} This is a competitive raise — it shows support and limits your hand to 0-9 pts.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `${mySupport}-card support, 0-9 pts — competitive raise.`,
      expectedResponses: [],
      confidence: "high",
    };
  }

  // No support
  if (hcp <= 8) {
    return {
      bid: "Pass",
      category: "Pass (No Support, Weak)",
      reasoning: "Without 3-card support and 0-8 pts, pass.",
      handAnalysis: analysis,
      whatYourBidTellsPartner: "No support, no values.",
      expectedResponses: [],
      confidence: "high",
    };
  }
  if (hcp >= 9 && hcp <= 12) {
    return {
      bid: "1NT",
      category: "1NT Response to Overcall (9-12 pts)",
      reasoning:
        "With 9-12 pts, no support, and a stopper in opener's suit, bid 1NT.",
      handAnalysis: analysis,
      whatYourBidTellsPartner: "9-12 pts, stopper in their suit, no fit.",
      expectedResponses: [],
      confidence: "medium",
    };
  }
  if (hcp >= 13 && hcp <= 14) {
    return {
      bid: "2NT",
      category: "2NT Response to Overcall (13-14 pts)",
      reasoning: "With 13-14 pts and a stopper in opener's suit, bid 2NT.",
      handAnalysis: analysis,
      whatYourBidTellsPartner: "13-14 pts, stopper in their suit.",
      expectedResponses: [],
      confidence: "medium",
    };
  }
  return {
    bid: "3NT",
    category: "3NT Response to Overcall (15+ pts)",
    reasoning: "With 15+ pts and a stopper, bid 3NT.",
    handAnalysis: analysis,
    whatYourBidTellsPartner: "15+ pts, game-going.",
    expectedResponses: [],
    confidence: "high",
  };
}

function getResponseToJumpOC(
  hand: Hand,
  partnerBid: string,
): BidRecommendation {
  const analysis = analyzeHand(hand);
  const { hcp } = hand;
  const partnerSuit = partnerBid.includes("♠")
    ? "spades"
    : partnerBid.includes("♥")
      ? "hearts"
      : partnerBid.includes("♦")
        ? "diamonds"
        : "clubs";
  const mySupport = hand[partnerSuit as keyof Hand] as number;

  if (mySupport >= 3 && hcp >= 11) {
    const isMajor = partnerSuit === "hearts" || partnerSuit === "spades";
    const gameBid = isMajor ? `4${suitSymbol(partnerSuit)}` : "3NT";
    return {
      bid: gameBid,
      category: "Game over Jump Overcall (11+ pts)",
      reasoning: `With 11+ pts and 3+ support for the jump overcall, bid game (${gameBid}).`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Game-going values.",
      expectedResponses: [],
      confidence: "high",
    };
  }
  if (mySupport >= 3 && hcp >= 6) {
    const jumpLevel = parseInt(partnerBid[0]) || 2;
    const raisedLevel = Math.min(jumpLevel + 1, 7);
    const singleRaiseBid = `${raisedLevel}${suitSymbol(partnerSuit)}`;
    return {
      bid: singleRaiseBid,
      category: "Single Raise of Jump Overcall (6-10 pts)",
      reasoning: `With 3+ support and 6-10 pts, give a single raise to ${singleRaiseBid}.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "3+ support, 6-10 pts.",
      expectedResponses: [],
      confidence: "high",
    };
  }
  return {
    bid: "Pass",
    category: "Pass (No Support, Jump Overcall)",
    reasoning:
      "Without support for the jump overcall, pass. Do NOT bid your own suit.",
    handAnalysis: analysis,
    whatYourBidTellsPartner: "No support.",
    expectedResponses: [],
    confidence: "high",
    note: "Do NOT bid a new suit over a jump overcall without 3-card support and 11+ pts.",
  };
}

function getResponseToDouble(
  hand: Hand,
  _opponentBid: string,
): BidRecommendation {
  const analysis = analyzeHand(hand);
  const { hcp } = hand;

  if (analysis.isBalanced && hcp >= 6 && hcp <= 10) {
    return {
      bid: "1NT",
      category: "1NT Response to Takeout Double (6-10 pts)",
      reasoning:
        "With 6-10 pts balanced and a stopper in the opponent's suit, bid 1NT.",
      handAnalysis: analysis,
      whatYourBidTellsPartner: "6-10 pts balanced, stopper in their suit.",
      expectedResponses: [],
      confidence: "high",
    };
  }
  if (analysis.isBalanced && hcp >= 11 && hcp <= 12) {
    return {
      bid: "2NT",
      category: "2NT Response to Double (11-12 pts)",
      reasoning: "With 11-12 pts and a stopper, bid 2NT.",
      handAnalysis: analysis,
      whatYourBidTellsPartner: "11-12 pts balanced, stopper.",
      expectedResponses: [],
      confidence: "high",
    };
  }
  if (hcp >= 13 && analysis.isBalanced) {
    return {
      bid: "3NT",
      category: "3NT Response to Double (13-15 pts)",
      reasoning: "With 13-15 pts and a stopper, bid 3NT.",
      handAnalysis: analysis,
      whatYourBidTellsPartner: "13-15 pts balanced, stopper.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  // Bid longest suit
  const { name: longestName } = longestSuitInfo(hand);
  const level = hcp >= 9 ? 2 : 1;
  return {
    bid: `${level}${suitSymbol(longestName)}`,
    category: "Bid Longest Suit (Responding to Double)",
    reasoning: `With ${hcp} HCP, bid your longest suit at the ${level === 1 ? "1" : "2"} level. Prefer a 4+ card major over a longer minor.${hcp >= 9 ? " Jump bid shows 9-12 pts." : ""}`,
    handAnalysis: analysis,
    whatYourBidTellsPartner: `${hcp <= 8 ? "0-8 pts" : "9-12 pts"} — forced to bid your best suit.`,
    expectedResponses: [],
    confidence: hcp <= 8 ? "high" : "medium",
  };
}

function getResponseToPreemptOC(
  hand: Hand,
  partnerBid: string,
): BidRecommendation {
  return getResponseToPreempt(hand, partnerBid);
}

function getResponseTo1NTOvercall(hand: Hand): BidRecommendation {
  return getResponseToOneNT(hand);
}

function getResponseToMichaels(
  hand: Hand,
  opponentBid: string,
  _partnerCuebid: string,
): BidRecommendation {
  const analysis = analyzeHand(hand);
  const { hcp } = hand;
  const overMinor = opponentBid.includes("♣") || opponentBid.includes("♦");

  if (overMinor) {
    // Partner showed both majors
    if (hand.spades >= hand.hearts) {
      return {
        bid: hcp >= 11 ? "4♠" : "2♠",
        category: "Respond to Michaels (Partner has both majors)",
        reasoning: `Partner's Michaels cuebid over a minor shows both majors (5+/5+). With ${hand.spades} spades${hcp >= 11 ? " and 11+ pts, bid game" : ", bid 2♠ to play"}.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `Prefer spades. ${hcp >= 11 ? "Game values." : "Competitive."}`,
        expectedResponses: [],
        confidence: "high",
      };
    }
    return {
      bid: hcp >= 11 ? "4♥" : "2♥",
      category: "Respond to Michaels (Prefer Hearts)",
      reasoning:
        "Partner showed both majors. With equal or more hearts, bid hearts.",
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Prefer hearts.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  // Partner showed one major + one unspecified minor
  const shownMajor = opponentBid.includes("♥") ? "spades" : "hearts";
  const myMajorFit = hand[shownMajor as keyof Hand] as number;

  if (myMajorFit >= 3) {
    const suitSym = suitSymbol(shownMajor);
    // hcp >= 11: bid game (4-level); hcp 6-10: competitive raise (3-level); < 6: minimum (2-level)
    const raiseBid =
      hcp >= 11 ? `4${suitSym}` : hcp >= 6 ? `3${suitSym}` : `2${suitSym}`;
    return {
      bid: raiseBid,
      category: "Respond to Michaels (Major fit)",
      reasoning: `Partner showed 5+ ${shownMajor} and 5+ unknown minor. With ${myMajorFit}-card support and ${hcp} HCP, ${hcp >= 11 ? "bid game" : hcp >= 6 ? "raise competitively to 3" : "show minimal support at 2"}-level.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `${myMajorFit}-card support for the major.`,
      expectedResponses: [],
      confidence: "high",
    };
  }

  return {
    bid: "2NT",
    category: "Ask for Minor (Michaels)",
    reasoning:
      "Without support for partner's shown major, bid 2NT to ask partner to name their 5-card minor suit.",
    handAnalysis: analysis,
    whatYourBidTellsPartner: "No fit for the major — show your minor.",
    expectedResponses: [
      { partnerBid: "3♣", meaning: "5+ clubs" },
      { partnerBid: "3♦", meaning: "5+ diamonds" },
    ],
    confidence: "high",
  };
}

function getResponseToUnusual2NT(hand: Hand): BidRecommendation {
  const analysis = analyzeHand(hand);
  const { hcp } = hand;

  // Partner showed clubs and diamonds (the two minors after a major opening)
  if (hand.diamonds >= hand.clubs) {
    return {
      bid: hcp >= 11 ? "4♦" : "3♦",
      category: "Respond to Unusual 2NT (Prefer Diamonds)",
      reasoning: `Partner showed 5+ clubs and 5+ diamonds. With ${hand.diamonds} diamonds${hcp >= 11 ? " and game values, bid 4♦" : ", bid 3♦"}.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Prefer diamonds.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  return {
    bid: hcp >= 11 ? "5♣" : "3♣",
    category: "Respond to Unusual 2NT (Prefer Clubs)",
    reasoning: `Partner showed 5+ clubs and 5+ diamonds. With more clubs${hcp >= 11 ? " and game values" : ""}, bid clubs.`,
    handAnalysis: analysis,
    whatYourBidTellsPartner: "Prefer clubs.",
    expectedResponses: [],
    confidence: "high",
  };
}

// ─── Opener's Rebids ──────────────────────────────────────────────────────────

// ─── Responder rebids after a 2NT/3NT response to partner's suit opening ──────

/**
 * I responded 2NT (or 3NT) to partner's suit opening.
 * Partner's current bid is a NATURAL suit rebid (showing a suit), not a convention.
 * Determine whether to raise, bid 3NT, or pass.
 */
function getResponderNTRebid(
  hand: Hand,
  myNTBid: string,
  partnerNaturalBid: string,
): BidRecommendation {
  const analysis = analyzeHand(hand);
  const { hcp } = hand;

  const partnerSuit = partnerNaturalBid.includes("♠")
    ? "spades"
    : partnerNaturalBid.includes("♥")
      ? "hearts"
      : partnerNaturalBid.includes("♦")
        ? "diamonds"
        : partnerNaturalBid.includes("♣")
          ? "clubs"
          : null;

  // Partner bid 3NT — accept game
  if (partnerNaturalBid === "3NT") {
    return {
      bid: "Pass",
      category: "Accept Partner's 3NT",
      reasoning:
        "Partner bid 3NT, accepting the game. The contract is set — Pass.",
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Accepting 3NT.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  if (partnerSuit) {
    const mySuitLen = hand[partnerSuit as keyof Hand] as number;
    const isMajor = partnerSuit === "hearts" || partnerSuit === "spades";
    const gameBid = isMajor
      ? `4${suitSymbol(partnerSuit)}`
      : `5${suitSymbol(partnerSuit)}`;
    const myNTRange = myNTBid === "2NT" ? "13–15 HCP" : "16–17 HCP";

    // Very good fit (4+ cards) — raise to game
    if (mySuitLen >= 4) {
      return {
        bid: gameBid,
        category: `Raise to ${isMajor ? "Major" : "Minor"} Game — ${mySuitLen}-Card Support`,
        reasoning:
          `After your ${myNTBid} (${myNTRange}, balanced), partner bid ${partnerNaturalBid} to show 4+ ${partnerSuit}. ` +
          `With ${mySuitLen}-card ${partnerSuit} support, you have a confirmed 8+ card fit — raise to game (${gameBid}). ` +
          "Combined strength is well within game range.",
        handAnalysis: analysis,
        whatYourBidTellsPartner: `${mySuitLen}-card ${partnerSuit} support — let's play game in the major.`,
        expectedResponses: [{ partnerBid: "Pass", meaning: "Accepts game" }],
        confidence: "high",
      };
    }

    // 3-card fit in a major — still raise if game values are there
    if (mySuitLen === 3 && isMajor) {
      return {
        bid: gameBid,
        category: `Raise Major with 3-Card Support After ${myNTBid}`,
        reasoning:
          `Partner bid ${partnerNaturalBid} showing 4+ ${partnerSuit}. With 3-card support (7-card fit) and game values from your ${myNTBid}, ` +
          `raise to ${gameBid}. A 7-card major fit is playable for game.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `3-card ${partnerSuit} support — choosing major game over NT.`,
        expectedResponses: [{ partnerBid: "Pass", meaning: "Accepts game" }],
        confidence: "medium",
      };
    }

    // Poor fit (0-2 cards) — bid 3NT instead
    const ntBid = parseInt(myNTBid[0]) === 2 ? "3NT" : "Pass";
    return {
      bid: ntBid,
      category: `No Fit for Partner's ${suitSymbol(partnerSuit)} — Bid ${ntBid}`,
      reasoning:
        `Partner bid ${partnerNaturalBid} showing ${partnerSuit}, but you hold only ${mySuitLen} card${mySuitLen !== 1 ? "s" : ""} in that suit. ` +
        `No fit — ${ntBid === "3NT" ? "bid 3NT to play the notrump game" : "pass, as 3NT is already the contract"}.` +
        `${hcp >= 14 ? " Combined values are in game range." : ""}`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `No ${partnerSuit} fit — prefer notrump.`,
      expectedResponses: [
        { partnerBid: "Pass", meaning: "Accepts notrump game" },
      ],
      confidence: "high",
    };
  }

  // Fallback for unusual partner bids
  return {
    bid: "Pass",
    category: "Continue Auction",
    reasoning: "Evaluate partner's bid in context and respond accordingly.",
    handAnalysis: analysis,
    whatYourBidTellsPartner: "Continuing auction.",
    expectedResponses: [],
    confidence: "low",
  };
}

function getRebidAfterNT(
  hand: Hand,
  partnerResponse: string,
): BidRecommendation {
  const analysis = analyzeHand(hand);
  const { hcp } = hand;

  // Partner bid 2NT (invitational, 8-9 pts)
  if (partnerResponse === "2NT") {
    return {
      bid: hcp >= 16 ? "3NT" : "Pass",
      category: "Rebid after 1NT - 2NT",
      reasoning:
        hcp >= 16
          ? `Partner invited game with 2NT (8-9 pts). With ${hcp} HCP (maximum), accept and bid 3NT.`
          : "Partner invited game. With 15 HCP (minimum), decline by passing.",
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        hcp >= 16 ? "Maximum 1NT opener." : "Minimum 1NT opener.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  // Partner bid 4NT (quantitative invite to 6NT)
  if (partnerResponse === "4NT") {
    return {
      bid: hcp === 17 ? "6NT" : "Pass",
      category: "Rebid after 1NT - 4NT (Quantitative)",
      reasoning:
        hcp === 17
          ? "Partner invites 6NT (quantitative 4NT with 16-17 HCP). With your maximum 17 HCP, accept."
          : "Partner invites 6NT. With 15-16 HCP, decline.",
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        hcp === 17 ? "Accept slam invite." : "Decline slam invite.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  // Partner transferred to hearts (2♦ → complete with 2♥)
  if (partnerResponse === "2♦") {
    if (hcp === 17 && hand.hearts >= 4) {
      return {
        bid: "3♥",
        category: "Super-Accept of Heart Transfer",
        reasoning:
          "With 17 HCP (maximum) and 4-card heart support, super-accept by jumping to 3♥ instead of completing normally with 2♥.",
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "Maximum 1NT (17 HCP) with 4-card heart support.",
        expectedResponses: [],
        confidence: "high",
      };
    }
    return {
      bid: "2♥",
      category: "Complete Heart Transfer",
      reasoning: "Complete the Jacoby Transfer by bidding 2♥.",
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Transfer complete.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  // Partner transferred to spades (2♥ → complete with 2♠)
  if (partnerResponse === "2♥") {
    if (hcp === 17 && hand.spades >= 4) {
      return {
        bid: "3♠",
        category: "Super-Accept of Spade Transfer",
        reasoning:
          "With 17 HCP and 4-card spade support, super-accept with 3♠.",
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "Maximum 1NT (17 HCP) with 4-card spade support.",
        expectedResponses: [],
        confidence: "high",
      };
    }
    return {
      bid: "2♠",
      category: "Complete Spade Transfer",
      reasoning: "Complete the Jacoby Transfer by bidding 2♠.",
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Transfer complete.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  // Minor transfer (2♠ → bid 3♣)
  if (partnerResponse === "2♠") {
    return {
      bid: "3♣",
      category: "Complete Minor Transfer",
      reasoning:
        "Partner bid 2♠ as a minor transfer. Bid 3♣ — partner will pass (clubs) or convert to 3♦ (diamonds).",
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Minor transfer completed.",
      expectedResponses: [
        { partnerBid: "Pass", meaning: "Partner has clubs" },
        { partnerBid: "3♦", meaning: "Partner has diamonds" },
      ],
      confidence: "high",
    };
  }

  // Partner bid 2♣ — Stayman, asking for a 4-card major
  if (partnerResponse === "2♣") {
    const has4Hearts = hand.hearts >= 4;
    const has4Spades = hand.spades >= 4;
    if (has4Hearts && has4Spades) {
      return {
        bid: "2♥",
        category: "Stayman Response — Both Majors (Bid Hearts First)",
        reasoning:
          "Partner bid Stayman (2♣) asking for a 4-card major. With both 4 hearts and 4 spades, bid 2♥ first. Partner will continue to 2♠ if they prefer spades.",
        handAnalysis: analysis,
        whatYourBidTellsPartner: "I have 4+ hearts (may also have 4 spades).",
        expectedResponses: [
          { partnerBid: "2NT", meaning: "8–9 pts, no major fit" },
          { partnerBid: "3♥", meaning: "4-card heart support, invitational" },
          { partnerBid: "4♥", meaning: "4-card heart support, game-forcing" },
          { partnerBid: "2♠", meaning: "Prefers spades — 4-card spade suit" },
        ],
        confidence: "high",
      };
    }
    if (has4Hearts) {
      return {
        bid: "2♥",
        category: "Stayman Response — 4 Hearts",
        reasoning:
          "Partner bid Stayman (2♣) asking for a 4-card major. Bid 2♥ to show exactly 4 hearts.",
        handAnalysis: analysis,
        whatYourBidTellsPartner: "I have exactly 4 hearts.",
        expectedResponses: [
          { partnerBid: "Pass", meaning: "Happy to play 2♥" },
          { partnerBid: "3♥", meaning: "Invitational with heart support" },
          { partnerBid: "4♥", meaning: "Game — 4-card heart support" },
          { partnerBid: "2NT", meaning: "Invitational, no heart fit" },
          { partnerBid: "3NT", meaning: "Game, no heart fit" },
        ],
        confidence: "high",
      };
    }
    if (has4Spades) {
      return {
        bid: "2♠",
        category: "Stayman Response — 4 Spades (No Hearts)",
        reasoning:
          "Partner bid Stayman (2♣) asking for a 4-card major. Bid 2♠ to show 4 spades without 4 hearts.",
        handAnalysis: analysis,
        whatYourBidTellsPartner: "I have 4 spades but not 4 hearts.",
        expectedResponses: [
          { partnerBid: "Pass", meaning: "Happy to play 2♠" },
          { partnerBid: "3♠", meaning: "Invitational with spade support" },
          { partnerBid: "4♠", meaning: "Game — 4-card spade support" },
          { partnerBid: "2NT", meaning: "Invitational, no spade fit" },
          { partnerBid: "3NT", meaning: "Game, no spade fit" },
        ],
        confidence: "high",
      };
    }
    return {
      bid: "2♦",
      category: "Stayman Response — No 4-Card Major",
      reasoning:
        "Partner bid Stayman (2♣) asking for a 4-card major. With no 4-card major, deny with 2♦ (artificial). Partner will likely bid 2NT (invitational) or 3NT (game).",
      handAnalysis: analysis,
      whatYourBidTellsPartner: "I have no 4-card major (artificial 2♦ denial).",
      expectedResponses: [
        { partnerBid: "Pass", meaning: "Weak — was exploring" },
        { partnerBid: "2NT", meaning: "Invitational — 8–9 pts" },
        { partnerBid: "3NT", meaning: "Game — 10+ pts, no major fit" },
        {
          partnerBid: "3♣/3♦",
          meaning: "Slam interest in a minor (uncommon)",
        },
      ],
      confidence: "high",
    };
  }

  // Partner passed (1NT was final contract)
  if (partnerResponse === "Pass") {
    return {
      bid: "—",
      category: "Auction over",
      reasoning: "Partner passed 1NT. The contract is 1NT.",
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Auction complete.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  // Partner bid 3NT — accepted game invitation or jumped to game
  if (partnerResponse === "3NT") {
    return {
      bid: hcp >= 17 ? "4NT" : "Pass",
      category:
        hcp >= 17 ? "Slam Exploration after 3NT" : "Pass — Contract Set at 3NT",
      reasoning:
        hcp >= 17
          ? "Partner accepted the game invitation with 3NT. With your maximum (17 HCP), you can probe for slam with 4NT (Blackwood). With 15-16 HCP, simply pass."
          : "Partner bid 3NT, accepting the invitation. The contract is set — Pass.",
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        hcp >= 17
          ? "Maximum hand — exploring slam possibilities."
          : "Accepting 3NT as the final contract.",
      expectedResponses:
        hcp >= 17
          ? [
              { partnerBid: "5♣", meaning: "0 or 4 aces" },
              { partnerBid: "5♦", meaning: "1 ace" },
              { partnerBid: "5♥", meaning: "2 aces" },
              { partnerBid: "5♠", meaning: "3 aces" },
            ]
          : [],
      confidence: "high",
    };
  }

  return {
    bid: "Pass",
    category: "Rebid after 1NT",
    reasoning: "Continue the auction based on partner's specific response.",
    handAnalysis: analysis,
    whatYourBidTellsPartner: "Responding to partner's action.",
    expectedResponses: [],
    confidence: "medium",
  };
}

// ─── NT Opener: continuing after Stayman/Transfer response ───────────────────

/**
 * Called when the 1NT (or 2NT) opener has already made a convention response
 * (e.g., answered Stayman with 2♥, or completed a transfer with 2♠) and now
 * needs to act again after partner's continuation.
 *
 * myLastShowBid = what the opener bid last round (2♦/2♥/2♠ etc.)
 * partnerContinuation = partner's current bid
 */
function getStaymanOpenerRebid(
  hand: Hand,
  myLastShowBid: string,
  partnerContinuation: string,
  wasTransferCompletion: boolean = false,
): BidRecommendation {
  const analysis = analyzeHand(hand);
  const { hcp } = hand;

  const iShowedHearts = myLastShowBid === "2♥" || myLastShowBid === "3♥";
  const iShowedSpades = myLastShowBid === "2♠" || myLastShowBid === "3♠";
  const iDeniedMajor = myLastShowBid === "2♦" || myLastShowBid === "3♦";

  // ── Partner bid 2NT (invitational, no fit in shown major) ───────────────────
  if (partnerContinuation === "2NT") {
    // Transfer context: partner's 2NT shows 5 hearts/spades (8-9 HCP) asking opener to
    // choose between accepting the major game vs 3NT based on suit fit.
    if (wasTransferCompletion) {
      const suit = iShowedHearts ? "hearts" : "spades";
      const suitSym = iShowedHearts ? "♥" : "♠";
      const suitLen = iShowedHearts ? hand.hearts : hand.spades;
      if (suitLen >= 3) {
        return {
          bid: hcp >= 16 ? `4${suitSym}` : `3${suitSym}`,
          category: `Transfer Follow-up: ${hcp >= 16 ? "Game" : "Invitational"} with 3+ ${suit.charAt(0).toUpperCase() + suit.slice(1)} Fit`,
          reasoning: `Partner transferred to ${suit} and then bid 2NT (invitational, 8-9 pts, exactly 5 ${suit}). You have ${suitLen}-card support — a ${suitLen >= 3 ? "fit" : "possible fit"} exists. ${hcp >= 16 ? `With maximum 1NT (${hcp} HCP) bid 4${suitSym} game.` : `With 15 HCP (minimum), bid 3${suitSym} (invitational) — partner with a maximum will raise to 4${suitSym}.`}`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: `I have ${suitLen}-card ${suit} support — ${hcp >= 16 ? "game!" : "inviting game."}`,
          expectedResponses:
            hcp >= 16
              ? []
              : [
                  {
                    partnerBid: `4${suitSym}`,
                    meaning: "Maximum — accepts game",
                  },
                  { partnerBid: "Pass", meaning: "Minimum — declines" },
                ],
          confidence: "high",
        };
      }
      // 2-card support only — fall through to accept/decline in NT
      return {
        bid: hcp >= 16 ? "3NT" : "Pass",
        category: `Transfer Follow-up: ${hcp >= 16 ? "Accept" : "Decline"} Invitation (Only 2-Card Fit)`,
        reasoning: `Partner bid 2NT (invitational, 5-card ${suit}, 8-9 pts). With only 2-card ${suit} support, NT is better. ${hcp >= 16 ? `With maximum 1NT (${hcp} HCP), accept with 3NT.` : "With 15 HCP (minimum), decline by passing."}`,
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          hcp >= 16 ? "Maximum — game on in NT." : "Minimum — declining.",
        expectedResponses: [],
        confidence: "high",
      };
    }
    // Stayman context: After Stayman hearts: 2NT implies 4 spades (SAYC convention —
    // partner used Stayman so must hold a 4-card major; no heart fit means spades).
    if (iShowedHearts && hand.spades >= 4) {
      return {
        bid: hcp >= 16 ? "4♠" : "3♠",
        category: `Stayman: Partner's 2NT Implies 4 ♠ — ${hcp >= 16 ? "Bid Game" : "Invitational"}`,
        reasoning: `You showed hearts and partner bid 2NT (invitational). In SAYC, when responder goes through Stayman and then bids 2NT after opener's major, it IMPLIES 4 cards in the other major (spades). You also hold 4 spades, so a 4-4 spade fit exists. ${hcp >= 16 ? `With maximum 1NT (${hcp} HCP), bid 4♠ game.` : "With 15 HCP (minimum), bid 3♠ (invitational) — partner with a maximum will raise to 4♠."}`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `I have 4 spades too — ${hcp >= 16 ? "game on!" : "do you have a maximum?"}`,
        expectedResponses:
          hcp >= 16
            ? []
            : [
                { partnerBid: "4♠", meaning: "Maximum — accepts spade game" },
                { partnerBid: "Pass", meaning: "Minimum — declines" },
              ],
        confidence: "high",
      };
    }
    // No spade fit (or denied major) — standard accept/decline
    return {
      bid: hcp >= 16 ? "3NT" : "Pass",
      category: `${hcp >= 16 ? "Accept" : "Decline"} Game Invitation (2NT)`,
      reasoning: `Partner bid 2NT (invitational, 8-9 pts, no fit in your shown suit). ${hcp >= 16 ? `With maximum 1NT (${hcp} HCP), accept with 3NT.` : "With 15 HCP (minimum), decline by passing — combined points fall short of game."}`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        hcp >= 16 ? "Maximum 1NT — game on." : "Minimum 1NT — declining.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  // ── Partner bid 3NT (game, asking opener to choose 3NT or 4M) ───────────────
  if (partnerContinuation === "3NT") {
    // Transfer context: partner's 3NT shows exactly 5 hearts/spades and game values,
    // asking opener to Pass (2-card support → play 3NT) or bid 4M (3+ card support).
    if (wasTransferCompletion) {
      const suit = iShowedHearts ? "hearts" : "spades";
      const suitSym = iShowedHearts ? "♥" : "♠";
      const suitLen = iShowedHearts ? hand.hearts : hand.spades;
      if (suitLen >= 3) {
        return {
          bid: `4${suitSym}`,
          category: `Transfer Follow-up: Correct to 4${suitSym} (3+ ${suit.charAt(0).toUpperCase() + suit.slice(1)} Fit)`,
          reasoning: `Partner transferred to ${suit} and then bid 3NT (exactly 5 ${suit}, game values). This asks you to choose: Pass with only 2-card support (play 3NT) or bid 4${suitSym} with 3+ card support. With ${suitLen} ${suit}, bid 4${suitSym} — the major-suit game is usually safer than 3NT when you have a known fit.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: `I have ${suitLen}-card ${suit} support — let's play the major game.`,
          expectedResponses: [],
          confidence: "high",
        };
      }
      // 2-card support — accept 3NT
      return {
        bid: hcp === 17 ? "4NT" : "Pass",
        category:
          hcp === 17
            ? "Transfer Follow-up: Slam Probe (Max, No Fit)"
            : "Transfer Follow-up: Accept 3NT (2-Card Fit)",
        reasoning:
          hcp === 17
            ? `Partner's 3NT shows 5 ${suit} and game values. With only ${suitLen}-card support, 3NT is the right strain. With maximum 17 HCP, bid 4NT (quantitative) to explore slam.`
            : `Partner's 3NT shows 5 ${suit} and game values. With only ${suitLen}-card support, passing 3NT is correct.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          hcp === 17 ? "Maximum hand — interested in slam." : "Accepting 3NT.",
        expectedResponses:
          hcp === 17
            ? [
                { partnerBid: "5♣", meaning: "0 or 4 aces" },
                { partnerBid: "5♦", meaning: "1 ace" },
                { partnerBid: "5♥", meaning: "2 aces" },
                { partnerBid: "5♠", meaning: "3 aces" },
              ]
            : [],
        confidence: "high",
      };
    }
    // Stayman context: partner bid 3NT (game, no major fit)
    return {
      bid: hcp === 17 ? "4NT" : "Pass",
      category:
        hcp === 17 ? "Slam Exploration After 3NT" : "Pass — 3NT is Final",
      reasoning:
        hcp === 17
          ? "Partner bid 3NT game. With your maximum 17 HCP and partner's game-forcing values, you have combined slam potential. Bid 4NT (quantitative) to invite slam."
          : "Partner bid 3NT game. Pass — the auction is complete.",
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        hcp === 17 ? "Maximum opener — slam possible." : "Accepting 3NT.",
      expectedResponses:
        hcp === 17
          ? [
              { partnerBid: "6NT", meaning: "Accepts slam" },
              { partnerBid: "Pass", meaning: "Declines slam" },
            ]
          : [],
      confidence: "high",
    };
  }

  // ── Partner raised the shown major (invitational) ───────────────────────────
  //   e.g., opener showed 2♥, partner bids 3♥ = invitational with fit
  const shownMajor = iShowedHearts ? "hearts" : iShowedSpades ? "spades" : null;
  if (shownMajor && partnerContinuation === `3${suitSymbol(shownMajor)}`) {
    return {
      bid: hcp >= 16 ? `4${suitSymbol(shownMajor)}` : "Pass",
      category: `${hcp >= 16 ? "Accept" : "Decline"} ${shownMajor === "hearts" ? "♥" : "♠"} Raise`,
      reasoning: `Partner raised your ${shownMajor} to 3 (invitational — 4-card fit, 8-9 pts). ${hcp >= 16 ? `With maximum 1NT (${hcp} HCP), accept game with 4${suitSymbol(shownMajor)}.` : "With 15 HCP (minimum), decline by passing."}`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        hcp >= 16 ? "Maximum — game accepted." : "Minimum — declining.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  // ── Partner bid game in shown major ─────────────────────────────────────────
  //   e.g., opener showed 2♥, partner bids 4♥ = game
  if (shownMajor && partnerContinuation === `4${suitSymbol(shownMajor)}`) {
    return {
      bid: "Pass",
      category: "Game Reached — Pass",
      reasoning: `Partner bid game (4${suitSymbol(shownMajor)}). The contract is set — pass.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Accepting game.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  // ── After showing spades, partner bid 4♥ (cuebid / preference) ──────────────
  // ── After denying major, partner bids a natural major suit ──────────────────
  if (iDeniedMajor) {
    // Partner had a 5-card major and is now showing it naturally
    const pMajor = partnerContinuation.includes("♥")
      ? "hearts"
      : partnerContinuation.includes("♠")
        ? "spades"
        : null;
    if (pMajor) {
      const fitLen = hand[pMajor as keyof Hand] as number;
      return {
        bid:
          fitLen >= 3
            ? hcp >= 16
              ? `4${suitSymbol(pMajor)}`
              : `3${suitSymbol(pMajor)}`
            : hcp >= 16
              ? "3NT"
              : "Pass",
        category: `Partner Shows 5-Card ${pMajor === "hearts" ? "♥" : "♠"} After 2♦ Denial`,
        reasoning: `You denied a 4-card major (2♦) and partner is now showing a 5-card ${pMajor}. ${fitLen >= 3 ? `With ${fitLen}-card support, raise: ${hcp >= 16 ? "bid game" : "invitational raise"}.` : `Without support (${fitLen} cards), bid ${hcp >= 16 ? "3NT (game)" : "Pass"}.`}`,
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          fitLen >= 3
            ? `${fitLen}-card ${pMajor} support.`
            : "No fit — suggesting NT.",
        expectedResponses: [],
        confidence: "high",
      };
    }
  }

  // ── After showing hearts, partner bids 2♠ (showing 4 spades, no heart fit) ──
  if (iShowedHearts && partnerContinuation === "2♠") {
    return {
      bid:
        hand.spades >= 4
          ? hcp >= 16
            ? "4♠"
            : "3♠"
          : hcp >= 16
            ? "2NT"
            : "Pass",
      category: "Partner Shows 4 Spades After Opener's 2♥",
      reasoning: `Partner bid 2♠ showing 4 spades and no heart fit (they bid Stayman to find a major — no heart match means spades). ${hand.spades >= 4 ? `You also have 4 spades — ${hcp >= 16 ? "bid 4♠ game." : "bid 3♠ invitational."}` : `Without 4 spades, ${hcp >= 16 ? "bid 2NT to accept game in NT." : "pass (no major fit, minimum)."}`}`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        hand.spades >= 4
          ? "I have 4 spades too."
          : "No spade fit — NT from here.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  // ── Fallback ─────────────────────────────────────────────────────────────────
  return {
    bid: hcp >= 16 ? "3NT" : "Pass",
    category: "NT Opener Continuing After Conventions",
    reasoning: `The auction has gone beyond the most common Stayman/Transfer continuations. As a ${hcp >= 16 ? "maximum" : "minimum"} 1NT opener: ${hcp >= 16 ? "bid 3NT if game values seem present" : "pass unless you have a clear fit or strong holding"}.`,
    handAnalysis: analysis,
    whatYourBidTellsPartner: "Continuing the NT auction.",
    expectedResponses: [],
    confidence: "medium",
  };
}

// ─── Respond to Partner's Invitational Jump Rebid ────────────────────────────
// Called when partner re-bids their own previously-shown suit at a jump level.
// Example: 1♦ — 1♥ — 2♦ — 3♥: partner showed hearts in round 1 and now invites game.
// Per SAYC: responder's jump rebid in own suit = invitational (10–12 TP, 5+ cards).
// Opener's decision: accept (bid game) if maximum; decline (Pass) if minimum.
function getRespondToPartnerInvitation(
  hand: Hand,
  _myLastBid: string,
  partnerInviteBid: string,
): BidRecommendation {
  const analysis = analyzeHand(hand);
  const { tp, hcp } = analysis;

  // Extract invited suit from partner's bid (e.g. "3♥" → hearts)
  const invitedSuit = partnerInviteBid.includes("♠")
    ? "spades"
    : partnerInviteBid.includes("♥")
      ? "hearts"
      : partnerInviteBid.includes("♦")
        ? "diamonds"
        : "clubs";
  const isMajor = invitedSuit === "hearts" || invitedSuit === "spades";
  const suitSym = suitSymbol(invitedSuit);
  const suitName = invitedSuit.charAt(0).toUpperCase() + invitedSuit.slice(1);
  const supportCount = hand[invitedSuit as keyof Hand] as number;
  const gameBid = isMajor ? `4${suitSym}` : `5${suitSym}`;

  // Maximum opener (16+ TP): accept the invitation, bid game
  if (tp >= 16) {
    return {
      bid: gameBid,
      category: `Accept Partner's ${suitName} Invitation (${tp} TP — Maximum)`,
      reasoning: `Partner's ${partnerInviteBid} is an invitational jump rebid (5+ ${invitedSuit}, 10–12 TP). With ${tp} TP (maximum opener), accept and bid game — ${gameBid}. Combined points (${tp} + ~10) are sufficient for game.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Accepting the invitation — game-going values.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  // Mid-range (14–15 TP) with 3+ card support: accept with the fit
  if (tp >= 14 && tp <= 15 && supportCount >= 3) {
    return {
      bid: gameBid,
      category: `Accept Invitation — Good Fit (${tp} TP, ${supportCount}-Card Support)`,
      reasoning: `Partner's ${partnerInviteBid} shows 5+ ${invitedSuit} and 10–12 TP. With ${supportCount}-card support and ${tp} TP, accept — ${gameBid}. The ${invitedSuit} fit and combined values make game reasonable.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Accepting invitation — fit and values present.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  // Balanced hand with values (14+ HCP) but no major fit: try 3NT instead of a major game
  if (isMajor && supportCount <= 2 && analysis.isBalanced && hcp >= 14) {
    return {
      bid: "3NT",
      category: `Decline Major Invitation — Offer 3NT (No Fit, ${hcp} HCP)`,
      reasoning: `Partner's ${partnerInviteBid} invites game in ${invitedSuit}. With only ${supportCount} ${invitedSuit} (no game-level fit), but a balanced ${hcp} HCP hand, bid 3NT — offering an alternative game in notrump. Partner can pass if they have NT stoppers or correct to ${gameBid} with a long suit.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `No ${invitedSuit} fit, but enough for 3NT — pick the best game.`,
      expectedResponses: [
        { partnerBid: "Pass", meaning: "Accepts 3NT — has notrump shape" },
        {
          partnerBid: gameBid,
          meaning: `Prefers ${invitedSuit} game — has very long suit or good distribution`,
        },
      ],
      confidence: "medium",
    };
  }

  // Default: decline the invitation — minimum opener and/or insufficient support
  return {
    bid: "Pass",
    category: `Decline Partner's ${suitName} Invitation (Minimum Opener)`,
    reasoning: `Partner's ${partnerInviteBid} is an invitational jump rebid showing 5+ ${invitedSuit} and 10–12 TP. With ${tp} TP (minimum opener) and only ${supportCount}-card ${invitedSuit} support, decline the invitation — Pass. The ${partnerInviteBid} contract is safe; bidding ${gameBid} would need ~25 combined points which you likely don't have.`,
    handAnalysis: analysis,
    whatYourBidTellsPartner:
      "Declining the invitation — minimum opener, cannot commit to game.",
    expectedResponses: [],
    confidence: "high",
  };
}

// ─── Protective / Balancing Rebid ────────────────────────────────────────────
// Called when the opener's partner passed throughout and the auction has
// returned to the opener (e.g. 1♣ – 1♥ overcall – Pass – Pass – back to opener).
// The partner is known to be weak; the opener decides whether to compete.
function getProtectiveRebid(
  hand: Hand,
  myOpeningBid: string,
  lhoBid: string | undefined,
): BidRecommendation {
  const analysis = analyzeHand(hand);
  const { tp } = analysis;
  const { hcp } = hand;

  const myOpenSuit = myOpeningBid.includes("♠")
    ? "spades"
    : myOpeningBid.includes("♥")
      ? "hearts"
      : myOpeningBid.includes("♦")
        ? "diamonds"
        : "clubs";
  const myOpenSuitSym = suitSymbol(myOpenSuit);
  const myOpenSuitLen = hand[myOpenSuit as keyof Hand] as number;

  // If no opponent bid at all (all three players passed), the auction is already
  // complete — three passes after an opening bid ends the auction.  In that
  // scenario the engine should simply pass rather than recommend a phantom rebid.
  if (!lhoBid) {
    return {
      bid: "Pass",
      category: "Pass (Auction Complete)",
      reasoning: `After your ${myOpeningBid} opening, the other three players all passed — the auction is complete. No further bidding is needed; proceed to play in ${myOpeningBid}.`,
      handAnalysis: analyzeHand(hand),
      whatYourBidTellsPartner: "Auction is over — no further action needed.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  const overcallContext = ` after an opponent bid ${lhoBid}`;

  // Find the minimum legal rebid of opener's suit above the overcall
  const lhoBidIdx = BID_ORDER.indexOf(lhoBid);
  const minRebidIdx = BID_ORDER.findIndex(
    (bid, i) => i > lhoBidIdx && bid.endsWith(myOpenSuitSym),
  );
  const minRebidBid =
    minRebidIdx >= 0 ? BID_ORDER[minRebidIdx] : `2${myOpenSuitSym}`;

  // Extra strength: double for penalty / reopening double
  if (hcp >= 16) {
    return {
      bid: "Double",
      category: "Protective Double (16+ HCP)",
      reasoning: `Partner passed${overcallContext}. With ${hcp} HCP (${tp} TP), you have extra values for a reopening double. This gives partner a chance to bid or convert to penalty.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "16+ HCP — competing. You may pass for penalty or show your best suit.",
      expectedResponses: [
        {
          partnerBid: "Pass",
          meaning: "Penalty — comfortable defending doubled",
        },
        {
          partnerBid: "New suit",
          meaning: "Showing values and a suit",
        },
      ],
      confidence: "medium",
    };
  }

  // Long suit (6+ cards): rebid at the minimum level above the overcall
  if (myOpenSuitLen >= 6 && tp >= 13) {
    return {
      bid: minRebidBid,
      category: "Protective Suit Rebid (6+ Cards)",
      reasoning: `Partner passed${overcallContext}, showing fewer than 6 HCP. With a ${myOpenSuitLen}-card ${myOpenSuit} suit and ${tp} TP (${hcp} HCP), rebid ${minRebidBid} to reopen the auction. Partner may have a trap pass with good values and prefer your suit.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `A long ${myOpenSuit} suit (6+ cards). You can raise with 3-card support or pass with a weak hand.`,
      expectedResponses: [
        { partnerBid: "Pass", meaning: "Minimum hand — content to play here" },
        {
          partnerBid: "Raise",
          meaning: "3+ support and invitational values",
        },
      ],
      confidence: "medium",
      note: "Protective bid — partner has already passed, so this bid is non-forcing.",
    };
  }

  // Minimum opener: pass and let opponents play at a low level
  return {
    bid: "Pass",
    category: "Protective Pass (Minimum Opener)",
    reasoning: `Partner passed${overcallContext}. With a minimum opening (${tp} TP, ${hcp} HCP) and no strong long suit to rebid safely, pass. Competing at a higher level risks a poor result — the opponents are in a low contract.`,
    handAnalysis: analysis,
    whatYourBidTellsPartner: "Minimum opener — not competing further.",
    expectedResponses: [],
    confidence: "medium",
    note: "In balancing position the opener should reopen only with extra length or extra values.",
  };
}

function getRebidAfterSuit(
  hand: Hand,
  myOpeningBid: string,
  partnerResponse: string,
): BidRecommendation {
  const analysis = analyzeHand(hand);
  const { tp } = analysis;

  const myOpenSuit = myOpeningBid.includes("♠")
    ? "spades"
    : myOpeningBid.includes("♥")
      ? "hearts"
      : myOpeningBid.includes("♦")
        ? "diamonds"
        : "clubs";

  const partnerSuit = partnerResponse.includes("♠")
    ? "spades"
    : partnerResponse.includes("♥")
      ? "hearts"
      : partnerResponse.includes("♦")
        ? "diamonds"
        : partnerResponse.includes("♣")
          ? "clubs"
          : null;

  const myOpenSuitLen = hand[myOpenSuit as keyof Hand] as number;
  const partnerSuitLen = partnerSuit
    ? (hand[partnerSuit as keyof Hand] as number)
    : 0;

  // Partner raised our suit
  if (partnerSuit === myOpenSuit) {
    const partnerBidLvl = parseInt(partnerResponse[0]) || 2;
    // A limit raise (partner bids at EXACTLY the 3-level, e.g. 3♠ over 1♠) shows 10-12 HCP.
    // A game jump (4-level, e.g. 4♠ over 1♠) shows opener had 19+ TP and is forcing game.
    // A simple raise (2-level) shows only 6-9 pts — need 19+ TP to commit to game.
    const isLimitRaise = partnerBidLvl === 3;
    const isGameJump = partnerBidLvl >= 4;
    const isMajorSuit = myOpenSuit === "hearts" || myOpenSuit === "spades";
    const gameLevelBid = isMajorSuit
      ? `4${suitSymbol(myOpenSuit)}`
      : `5${suitSymbol(myOpenSuit)}`;

    // Partner jumped directly to game (e.g. 1♠ → 4♠): partner is showing 19+ TP.
    // Responder should accept unless they have slam-going values.
    if (isGameJump) {
      const suitStr = suitSymbol(myOpenSuit);
      if (tp >= 16 && isMajorSuit) {
        return {
          bid: "4NT",
          category: "Slam Exploration After Partner's Game Jump",
          reasoning: `Partner jumped directly to game (${partnerResponse}) showing 19+ TP. With your ${tp} TP (${hand.hcp} HCP), combined strength is ${tp + 19}–${tp + 21} — slam territory. Bid 4NT (Blackwood) to ask for aces before committing to slam.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: `Asking for aces — we have slam potential. Respond: 5♣=0/4 aces, 5♦=1 ace, 5♥=2 aces, 5${suitStr}=3 aces.`,
          expectedResponses: [
            { partnerBid: "5♣", meaning: "0 or 4 aces" },
            { partnerBid: "5♦", meaning: "1 ace" },
            { partnerBid: "5♥", meaning: "2 aces" },
            { partnerBid: "5♠", meaning: "3 aces" },
          ],
          confidence: "high",
        };
      }
      return {
        bid: "Pass",
        category: "Accept Partner's Game Jump",
        reasoning: `Partner jumped directly to ${partnerResponse}, showing a strong hand (19+ TP) with ${myOpenSuit} support. With your ${tp} TP (${hand.hcp} HCP), combined strength is roughly ${tp + 19}+ — game is the right contract. Accept and pass.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `Accepting the ${partnerResponse} contract.`,
        expectedResponses: [],
        confidence: "high",
      };
    }

    // Very strong opener (22+ TP): regardless of partner's level, explore slam
    if (tp >= 22 && isMajorSuit) {
      return {
        bid: "4NT",
        category: "Slam Exploration After Raise (22+ TP — Blackwood)",
        reasoning: `Partner raised your ${myOpenSuit} (showing ${isLimitRaise ? "10-12" : "6-9"} pts and 3-4 card support). With ${tp} TP, combined is at least ${tp + 10} — well into slam territory. Bid 4NT (Blackwood) to ask for aces before committing to a slam level.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "Asking for aces — we have slam potential. Respond: 5♣=0/4 aces, 5♦=1 ace, 5♥=2 aces, 5♠=3 aces.",
        expectedResponses: [
          {
            partnerBid: "5♣",
            meaning: "0 or 4 aces — bid 6♠ if you have all aces",
          },
          { partnerBid: "5♦", meaning: "1 ace — likely stop at 4♠" },
          { partnerBid: "5♥", meaning: "2 aces — bid 6♠" },
          { partnerBid: "5♠", meaning: "3 aces — bid 6♠ or explore 7♠" },
        ],
        confidence: "high",
      };
    }

    // Strong opener accepting any raise at game level (19-21 TP)
    if (tp >= 19) {
      return {
        bid: gameLevelBid,
        category: "Bid Game After Raise (19-21 TP)",
        reasoning: `Partner raised your ${myOpenSuit}. With 19-21 TP, bid game (${gameLevelBid}). Note: if partner has a maximum raise (12-15 TP), consider 4NT Blackwood first to explore slam.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: "Strong opener — game-forcing.",
        expectedResponses: [],
        confidence: "high",
      };
    }

    // Accept limit raise (14-18 TP after partner's 3-level limit raise)
    // Limit raise shows 10-12 HCP: combined 14+10=24 is borderline but game odds are good.
    if (isLimitRaise && tp >= 14) {
      return {
        bid: gameLevelBid,
        category: `Accept Limit Raise (${tp} TP)`,
        reasoning: `Partner made a limit raise to ${partnerResponse} showing 10-12 HCP and 3-4 card ${myOpenSuit} support. With ${tp} TP (${hand.hcp} HCP), combined strength is ${hand.hcp + 10}–${hand.hcp + 12} — enough for game. Accept the invitation and bid ${gameLevelBid}.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `Accepting the limit raise — bidding game in ${myOpenSuit}.`,
        expectedResponses: [
          { partnerBid: "Pass", meaning: "Accepts the game contract" },
          {
            partnerBid: "4NT",
            meaning: "Slam interest (partner has a maximum)",
          },
        ],
        confidence: "high",
      };
    }

    // Medium opener (16-18 TP) after simple raise — make a game try
    if (tp >= 16 && tp <= 18 && !isLimitRaise) {
      return {
        bid: `3${suitSymbol(myOpenSuit)}`,
        category: "Game Try After Raise (16-18 TP)",
        reasoning:
          "Partner made a simple raise. With 16-18 TP, make a game try by bidding 3 of your suit. Partner accepts with a maximum raise (8-9 pts).",
        handAnalysis: analysis,
        whatYourBidTellsPartner: "16-18 TP — game possible, partner decides.",
        expectedResponses: [
          { partnerBid: "Pass", meaning: "Minimum raise (6 TP)" },
          {
            partnerBid: `4${suitSymbol(myOpenSuit)}`,
            meaning: "Maximum raise (7-9 TP)",
          },
        ],
        confidence: "high",
      };
    }

    return {
      bid: "Pass",
      category: isLimitRaise
        ? "Decline Limit Raise (Minimum Opener)"
        : `Pass After Simple Raise (${tp} TP)`,
      reasoning: isLimitRaise
        ? `Partner made a limit raise (${partnerResponse}) showing 10-12 HCP. With ${tp} TP (${hand.hcp} HCP), combined is ${hand.hcp + 10}–${hand.hcp + 12} — not quite enough to guarantee game. Pass and play the ${partnerResponse} partial.`
        : `Partner made a simple raise. With ${tp} TP, game requires roughly 25 combined points — partner's 6-9 pts fall short. Pass.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `Minimum hand — accepting the partial contract in ${myOpenSuit}.`,
      expectedResponses: [],
      confidence: "high",
    };
  }

  // Partner bid 2NT or 3NT (natural — game-invitational or game-forcing after minor opening)
  if (partnerResponse === "2NT" || partnerResponse === "3NT") {
    const partnerLevel = parseInt(partnerResponse[0]);
    // After a minor opening, 2NT = 13-15 HCP balanced (game force).
    // After a major opening, Jacoby 2NT is routed separately — so here it's a natural 2NT.
    const partnerMinHCP = partnerLevel === 3 ? 16 : 13;
    const partnerMaxHCP = partnerLevel === 3 ? 18 : 15;
    const combinedMin = analysis.hcp + partnerMinHCP;
    const combinedMax = analysis.hcp + partnerMaxHCP;

    // If partner already jumped to 3NT (game), consider slam only with extra strength
    if (partnerResponse === "3NT") {
      if (tp >= 20) {
        return {
          bid: "4NT",
          category: "Slam Interest After Partner's 3NT",
          reasoning: `Partner jumped to 3NT (${partnerMinHCP}-${partnerMaxHCP} HCP, balanced). With your ${tp} TP, combined is ${combinedMin}-${combinedMax} — slam territory. Bid 4NT (Blackwood) to explore.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: "Asking for aces — we may have slam.",
          expectedResponses: [
            { partnerBid: "5♣", meaning: "0 or 4 aces" },
            { partnerBid: "5♦", meaning: "1 ace" },
            { partnerBid: "5♥", meaning: "2 aces" },
            { partnerBid: "5♠", meaning: "3 aces" },
          ],
          confidence: "high",
        };
      }
      if (myOpenSuitLen >= 6) {
        const minorGame = `5${suitSymbol(myOpenSuit)}`;
        return {
          bid: minorGame,
          category: "Correct to Minor Game After 3NT",
          reasoning: `Partner jumped to 3NT. With your ${myOpenSuitLen}-card ${myOpenSuit} suit, consider correcting to ${minorGame} — it may be a safer contract if your hand is distributional.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: `Long ${myOpenSuit} — prefer the minor game.`,
          expectedResponses: [
            { partnerBid: "Pass", meaning: "Accepts minor game" },
          ],
          confidence: "medium",
        };
      }
      return {
        bid: "Pass",
        category: "Accept Partner's 3NT",
        reasoning: `Partner jumped to 3NT (${partnerMinHCP}-${partnerMaxHCP} HCP, balanced). With your ${tp} TP, combined is ${combinedMin}-${combinedMax} — game is the limit. Accept and pass.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: "Accepting game.",
        expectedResponses: [],
        confidence: "high",
      };
    }

    // partnerResponse === "2NT" — partner is game-forcing (13-15 HCP balanced)

    // Show a 4-card major — if partner also has 4, we find a superior major-suit game
    if (hand.hearts >= 4) {
      return {
        bid: "3♥",
        category: "Show 4-Card Heart Suit After 2NT",
        reasoning: `Partner bid 2NT (${partnerMinHCP}-${partnerMaxHCP} HCP, balanced, game-forcing). With ${hand.hearts} hearts, bid 3♥ to check for a 4-4 heart fit. If partner has 4 hearts, play 4♥. Otherwise partner bids 3NT (or 3♠ if they have spades).`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: "4+ hearts — looking for a major-suit game.",
        expectedResponses: [
          { partnerBid: "4♥", meaning: "4-card heart fit — major game" },
          { partnerBid: "3NT", meaning: "No heart fit — game in NT" },
          {
            partnerBid: "3♠",
            meaning: "No hearts but 4 spades — checking spades",
          },
        ],
        confidence: "high",
      };
    }
    if (hand.spades >= 4) {
      return {
        bid: "3♠",
        category: "Show 4-Card Spade Suit After 2NT",
        reasoning: `Partner bid 2NT (${partnerMinHCP}-${partnerMaxHCP} HCP, balanced, game-forcing). With ${hand.spades} spades, bid 3♠ to check for a 4-4 spade fit. If partner has 4 spades, play 4♠. Otherwise partner bids 3NT.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: "4+ spades — looking for a major-suit game.",
        expectedResponses: [
          { partnerBid: "4♠", meaning: "4-card spade fit — major game" },
          { partnerBid: "3NT", meaning: "No spade fit — game in NT" },
        ],
        confidence: "high",
      };
    }

    // No 4-card major — rebid a 6-card minor to offer the minor game alternative
    if (myOpenSuitLen >= 6) {
      const minorRebid = `3${suitSymbol(myOpenSuit)}`;
      return {
        bid: minorRebid,
        category: `Rebid 6-Card ${myOpenSuit === "clubs" ? "Club" : "Diamond"} Suit After 2NT`,
        reasoning: `Partner bid 2NT (${partnerMinHCP}-${partnerMaxHCP} HCP, game-forcing). No 4-card major. With ${myOpenSuitLen} ${myOpenSuit}, bid ${minorRebid} to show the long suit — partner can choose 3NT or 5${suitSymbol(myOpenSuit)}.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `6+ ${myOpenSuit}, no 4-card major — choose 3NT or minor game.`,
        expectedResponses: [
          { partnerBid: "3NT", meaning: "Prefers notrump game" },
          {
            partnerBid: `5${suitSymbol(myOpenSuit)}`,
            meaning: "Prefers minor game",
          },
        ],
        confidence: "high",
      };
    }

    // Balanced, no long suit — accept 3NT
    return {
      bid: "3NT",
      category: "Accept Game in 3NT After 2NT",
      reasoning: `Partner bid 2NT (${partnerMinHCP}-${partnerMaxHCP} HCP, balanced, game-forcing). With no 4-card major and no 6-card minor, accept the natural game — bid 3NT.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Balanced, no major or long minor — game in NT.",
      expectedResponses: [{ partnerBid: "Pass", meaning: "Accepts 3NT" }],
      confidence: "high",
    };
  }

  // Partner bid 1NT
  if (partnerResponse === "1NT") {
    if (myOpenSuitLen >= 6) {
      return tp >= 16
        ? {
            bid: `2${suitSymbol(myOpenSuit)}`,
            category: "Rebid Suit after 1NT",
            reasoning:
              "Partner bid 1NT (6-10 pts). With 6+ card suit and 16+ TP, rebid your suit.",
            handAnalysis: analysis,
            whatYourBidTellsPartner: "6+ card suit, 16+ TP.",
            expectedResponses: [],
            confidence: "high",
          }
        : {
            bid: "Pass",
            category: "Pass after 1NT (Minimum)",
            reasoning:
              "Partner bid 1NT (6-10 pts). With a minimum opener and a 6-card suit, pass.",
            handAnalysis: analysis,
            whatYourBidTellsPartner: "Minimum opener — accepting 1NT.",
            expectedResponses: [],
            confidence: "high",
          };
    }
    // With a 5-card opening suit and a second 4-card suit lower in rank, bid the second suit
    // at the 2-level to show the two-suited hand. No extra strength is required because
    // the second suit is lower-ranking than the opening suit (partner can return to opener's
    // first suit without going higher). Example: 1♥–1NT → 2♦ (5♥+4♦, minimum OK).
    const SUIT_RANK_NT: Record<string, number> = {
      clubs: 0,
      diamonds: 1,
      hearts: 2,
      spades: 3,
    };
    const mySuitRankNT = SUIT_RANK_NT[myOpenSuit] ?? 0;
    if (myOpenSuitLen >= 5) {
      const lowerSideSuit = (
        ["clubs", "diamonds", "hearts", "spades"] as const
      ).find(
        (s) =>
          s !== myOpenSuit &&
          (SUIT_RANK_NT[s] ?? 0) < mySuitRankNT &&
          (hand[s as keyof Hand] as number) >= 4,
      );
      if (lowerSideSuit) {
        const newSuitBid = `2${suitSymbol(lowerSideSuit)}`;
        return {
          bid: newSuitBid,
          category: `Show Second Suit After 1NT (${newSuitBid})`,
          reasoning: `Partner bid 1NT (6-10 pts). With ${myOpenSuitLen} ${myOpenSuit} and 4+ ${lowerSideSuit}, bid ${newSuitBid} to show your two-suited hand. No extra strength is needed — partner can return to ${suitSymbol(myOpenSuit)} or choose ${lowerSideSuit}. This helps partner find the best contract.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: `Two-suited: 5+ ${myOpenSuit} and 4+ ${lowerSideSuit}. Choose the better fit.`,
          expectedResponses: [
            {
              partnerBid: `2${suitSymbol(myOpenSuit)}`,
              meaning: "Prefers your first suit (simple preference)",
            },
            {
              partnerBid: `3${suitSymbol(lowerSideSuit)}`,
              meaning: "Fit in second suit, invitational",
            },
            {
              partnerBid: "Pass",
              meaning: "Content to play 2" + suitSymbol(lowerSideSuit),
            },
          ],
          confidence: "high",
        };
      }
      // Higher-ranking second suit at 2-level after 1NT = reverse, requires 16+ TP
      const higherSideSuit = (
        ["clubs", "diamonds", "hearts", "spades"] as const
      ).find(
        (s) =>
          s !== myOpenSuit &&
          (SUIT_RANK_NT[s] ?? 0) > mySuitRankNT &&
          (hand[s as keyof Hand] as number) >= 4,
      );
      if (higherSideSuit && tp >= 16) {
        const reverseBid = `2${suitSymbol(higherSideSuit)}`;
        return {
          bid: reverseBid,
          category: `Reverse After 1NT (${reverseBid})`,
          reasoning: `Partner bid 1NT. With 5+ ${myOpenSuit} and 4+ ${higherSideSuit} (a higher-ranking suit), bid ${reverseBid} — a reverse showing 16+ TP. This is forcing for one round.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: `Two-suited: 5+ ${myOpenSuit} and 4+ ${higherSideSuit}, 16+ TP. Reverse — please describe your hand.`,
          expectedResponses: [],
          confidence: "high",
        };
      }
    }
    return {
      bid: "Pass",
      category: "Pass after 1NT",
      reasoning:
        "Partner bid 1NT showing 6-10 pts. With a minimum opener and fewer than 6 cards in your suit, pass.",
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Minimum opener.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  // Partner bid a new suit (forcing)
  if (partnerSuit && partnerSuit !== myOpenSuit) {
    const partnerBidLevel = parseInt(partnerResponse[0]) || 1;
    // If partner is already at game or above, just accept and pass
    const isMajorFit = partnerSuit === "hearts" || partnerSuit === "spades";
    const gameLvl = isMajorFit ? 4 : 5;
    const raiseLvl = Math.min(partnerBidLevel + 1, 7); // never above 7
    const raiseBid = `${raiseLvl}${suitSymbol(partnerSuit)}`;
    const partnerGameBid = isMajorFit
      ? `4${suitSymbol(partnerSuit)}`
      : `5${suitSymbol(partnerSuit)}`;

    // Partner already at or above game level — accept and pass
    if (partnerBidLevel >= gameLvl) {
      return {
        bid: "Pass",
        category: `Accept Partner's ${partnerBidLevel >= 6 ? "Slam" : "Game"} Bid`,
        reasoning: `Partner bid ${partnerResponse} which is already at or above game level. Accept the contract and pass.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `Accepting the ${partnerResponse} contract.`,
        expectedResponses: [],
        confidence: "high",
      };
    }

    // ── STRONG: game bid with 4-card fit (19+ TP) ─────────────────────────────
    if (partnerSuitLen >= 4 && tp >= 19) {
      return {
        bid: partnerGameBid,
        category: `Game Raise (${tp} TP — Strong Opener)`,
        reasoning: `With 4+ card support for partner's ${partnerSuit} and ${tp} TP (strong opener), bid game directly — ${partnerGameBid}. There is enough combined strength (opener 19+ + responder 6+) to make game.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `4+ card ${partnerSuit} support, strong opener (19+ TP). This is a game-level bid.`,
        expectedResponses: [
          { partnerBid: "Pass", meaning: "Minimum responder — game is enough" },
          { partnerBid: "4NT", meaning: "Slam interest — Blackwood" },
        ],
        confidence: "high",
      };
    }

    // ── Jump support (16-18 TP) ───────────────────────────────────────────────
    if (partnerSuitLen >= 4 && tp >= 16 && tp <= 18) {
      const jumpSupportBid = `${raiseLvl + 1}${suitSymbol(partnerSuit)}`;
      return {
        bid: jumpSupportBid,
        category: "Jump Support (16-18 TP)",
        reasoning: `With 4+ card support for partner's ${partnerSuit} and ${tp} TP (medium opener), jump to ${jumpSupportBid} — an invitational jump raise showing 16-18 TP. This invites partner to bid game with 9+ HCP.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `4+ card ${partnerSuit} support, 16-18 TP — strong opener. Bid game with 9+ HCP.`,
        expectedResponses: [
          {
            partnerBid: partnerGameBid,
            meaning: "9+ HCP — accepting the game invitation",
          },
          { partnerBid: "Pass", meaning: "Minimum (6-8 HCP) — declining" },
        ],
        confidence: "high",
      };
    }

    // ── 4-card support: raise partner's suit (13-15 TP) ──────────────────────
    if (partnerSuitLen >= 4 && tp <= 15) {
      const isMinimum = tp <= 12;
      return {
        bid: raiseBid,
        category: `Raise Partner's ${isMinimum ? "New" : ""} Suit (${isMinimum ? "10-12" : "13-15"} TP)`,
        reasoning: `Partner bid a new ${partnerSuit} suit (forcing). With 4-card support and ${isMinimum ? "a minimum opener (10-12 TP, likely Rule of 20)" : "13-15 TP"}, raise to ${raiseBid}. This shows 3-4 card support and a ${isMinimum ? "minimum" : "non-forcing"} hand.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `4-card ${partnerSuit} support, ${isMinimum ? "minimum" : "non-forcing"} opener.`,
        expectedResponses: [
          {
            partnerBid: `4${suitSymbol(partnerSuit)}`,
            meaning: "Partner has 16+ pts — bidding game",
          },
          {
            partnerBid: `3${suitSymbol(partnerSuit)}`,
            meaning: "Game try (14-15 pts)",
          },
          { partnerBid: "Pass", meaning: "Minimum response (6-9 pts)" },
        ],
        confidence: "high",
      };
    }

    // ── 3-card support for a major, no better rebid available ────────────────
    if (
      isMajorFit &&
      partnerSuitLen === 3 &&
      tp <= 15 &&
      myOpenSuitLen < 5 &&
      !analysis.isBalanced
    ) {
      return {
        bid: raiseBid,
        category: "3-Card Major Support Raise",
        reasoning: `Partner bid 1${suitSymbol(partnerSuit)} (forcing). With 3-card ${partnerSuit} support and no better rebid (hand is not balanced, opening suit has fewer than 5 cards), raise to ${raiseBid}. Supporting a major is generally preferred over showing a weak hand in NT.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `3-card ${partnerSuit} support, minimum opener.`,
        expectedResponses: [],
        confidence: "medium",
      };
    }

    // Shared suit rank lookup used by rebid-own-suit and reverse-bid paths
    const SUIT_RANK: Record<string, number> = {
      clubs: 0,
      diamonds: 1,
      hearts: 2,
      spades: 3,
    };
    const mySuitRank = SUIT_RANK[myOpenSuit] ?? 0;
    const partnerSuitRank = SUIT_RANK[partnerSuit] ?? -1;
    const canBidAtSameLevel = mySuitRank > partnerSuitRank;
    const simpleLevel = Math.min(
      canBidAtSameLevel ? partnerBidLevel : partnerBidLevel + 1,
      7,
    );
    const jumpLevel = Math.min(simpleLevel + 1, 7);

    // ── 1-level new suit: show a 4-card suit HIGHER than partner's suit at the 1-level.
    // This is NOT a reverse (partner can return to opener's first suit at the 2-level).
    // No extra strength required — available to any minimum opener (TP < 16).
    // With 16+ TP, use the Reverse bid block below to show the extra values at 2-level.
    // Example: 1♦ – 1♥ – 1♠  (opener has 4 spades, bids at 1-level, no extra strength)
    if (partnerBidLevel === 1 && tp < 16) {
      // Iterate low→high so we bid the cheapest qualifying suit (up-the-line)
      const oneLevelSuit = (
        ["clubs", "diamonds", "hearts", "spades"] as const
      ).find(
        (s) =>
          s !== myOpenSuit &&
          s !== partnerSuit &&
          (SUIT_RANK[s] ?? 0) > partnerSuitRank &&
          (hand[s as keyof Hand] as number) >= 4,
      );
      if (oneLevelSuit) {
        const oneLevelBid = `1${suitSymbol(oneLevelSuit)}`;
        return {
          bid: oneLevelBid,
          category: `New Suit at 1-Level (${oneLevelBid})`,
          reasoning: `With 4+ ${oneLevelSuit} and partner's ${partnerResponse}, bid ${oneLevelBid} to show your second suit at the 1-level. This is a natural non-forcing bid (sometimes forcing in some partnerships, but in SAYC it's forcing for one round) — no extra strength required beyond a standard opening.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: `4+ ${oneLevelSuit}, two-suited hand. Partner can show a fit or describe their hand further.`,
          expectedResponses: [
            {
              partnerBid: `2${suitSymbol(oneLevelSuit)}`,
              meaning: "4-card fit for your new suit",
            },
            {
              partnerBid: "1NT",
              meaning: "No fit for new suit, minimum values",
            },
            {
              partnerBid: `2${suitSymbol(myOpenSuit)}`,
              meaning: "Preference back to opener's first suit",
            },
          ],
          confidence: "high",
        };
      }
    }

    // ── Reverse bid (16+ TP, 4-card side suit ranking higher than opener's suit)
    // A reverse shows a two-suited hand where the second suit is higher-ranking
    // than the opening suit, forcing the response to the 2-level or higher.
    // Example: 1♦ – 1♥ – 2♠  (opener's reverse, showing 4+ spades, 16+ TP)
    if (tp >= 16 && partnerBidLevel === 1) {
      const reverseSuit = (
        ["spades", "hearts", "diamonds", "clubs"] as const
      ).find(
        (s) =>
          s !== myOpenSuit &&
          s !== partnerSuit &&
          (SUIT_RANK[s] ?? 0) > mySuitRank &&
          (hand[s as keyof Hand] as number) >= 4,
      );
      if (reverseSuit) {
        const reverseBid = `2${suitSymbol(reverseSuit)}`;
        return {
          bid: reverseBid,
          category: `Reverse Bid (${tp} TP)`,
          reasoning: `With ${tp} TP and 4+ ${reverseSuit} (a suit ranking higher than your ${myOpenSuit} opening), bid the reverse ${reverseBid}. A reverse shows a two-suited hand of 16+ TP and is forcing for one round — partner must bid again. This paints a picture of extra values and good shape.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: `Two-suited hand (${myOpenSuit} + ${reverseSuit}), 16+ TP. Forcing — please describe your hand further.`,
          expectedResponses: [
            {
              partnerBid: "2NT",
              meaning: "Minimum response with stopper in unbid suits",
            },
            {
              partnerBid: `Raise to 3${suitSymbol(reverseSuit)}`,
              meaning: "3+ card fit for the reverse suit",
            },
            {
              partnerBid: "Rebid own suit",
              meaning: "6+ card suit, weak hand",
            },
          ],
          confidence: "high",
          note: "A reverse is NOT a jump — it is simply bidding a higher-ranking suit at the 2-level after a 1-level opening. It forces partner to the 3-level if they prefer your first suit.",
        };
      }
    }

    // ── Show second suit at 2-level (lower-ranking than opening suit) ─────────
    // A "non-reverse" second suit bid: the new suit ranks LOWER than the opening suit,
    // so partner can still return to the opening suit at the 2-level (not forced to 3).
    // Only applies to UNBALANCED hands — balanced hands prefer a NT rebid instead.
    // No extra strength required — any minimum opener can show this suit.
    // Example: 1♥ – 1♠ – 2♣  (opener has 4+ clubs, clubs ranks lower than hearts)
    // Example: 1♥ – 1♠ – 2♦  (opener has 4+ diamonds, diamonds ranks lower than hearts)
    if (!analysis.isBalanced) {
      const lowerSuit = (
        ["spades", "hearts", "diamonds", "clubs"] as const
      ).find(
        (s) =>
          s !== myOpenSuit &&
          s !== partnerSuit &&
          (SUIT_RANK[s] ?? 0) < mySuitRank &&
          (hand[s as keyof Hand] as number) >= 4,
      );
      if (lowerSuit) {
        const lowerSuitBid = `${simpleLevel}${suitSymbol(lowerSuit)}`;
        return {
          bid: lowerSuitBid,
          category: `Show Second Suit (${lowerSuitBid})`,
          reasoning: `With 4+ ${lowerSuit} and a ${myOpenSuitLen}-card ${myOpenSuit} opening, bid ${lowerSuitBid} to show your second suit. This is not a reverse — ${lowerSuit} ranks lower than ${myOpenSuit}, so partner can prefer ${myOpenSuit} at the 2-level. No extra strength required.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: `Two-suited hand: ${myOpenSuitLen}+ ${myOpenSuit} and 4+ ${lowerSuit}. No extra values implied — partner may support ${lowerSuit}, prefer ${myOpenSuit}, or bid NT.`,
          expectedResponses: [
            {
              partnerBid: `2${suitSymbol(lowerSuit)}`,
              meaning: `4-card fit for ${lowerSuit}`,
            },
            {
              partnerBid: `2${suitSymbol(myOpenSuit)}`,
              meaning: `Preference back to ${myOpenSuit}`,
            },
            { partnerBid: "2NT", meaning: "Balanced, no fit for either suit" },
          ],
          confidence: "high",
        };
      }
    }

    // ── STRONG: jump shift or rebid own suit (19+ TP, 5-card suit) ───────────
    if (myOpenSuitLen >= 5 && tp >= 19) {
      const jumpShiftBid = `${jumpLevel}${suitSymbol(myOpenSuit)}`;
      return {
        bid: jumpShiftBid,
        category: `Strong Jump Rebid (${tp} TP)`,
        reasoning: `With a ${myOpenSuitLen}-card ${myOpenSuit} and ${tp} TP (strong opener), jump to ${jumpShiftBid} — a forcing jump rebid. This shows a powerful hand and a solid suit, typically inviting slam. Partner may cue-bid or ask for aces.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `${myOpenSuitLen}-card ${myOpenSuit}, strong hand (19+ TP). Slam is possible.`,
        expectedResponses: [
          { partnerBid: "4NT", meaning: "Blackwood — slam interest" },
          {
            partnerBid: `Game in ${myOpenSuit}`,
            meaning: "Minimum — signing off at game",
          },
          {
            partnerBid: "Cue bid",
            meaning: "Slam try showing first-round control",
          },
        ],
        confidence: "high",
      };
    }

    // ── MEDIUM: jump rebid own suit (16-18 TP, 5-card suit) ──────────────────
    if (myOpenSuitLen >= 5 && tp >= 16 && tp <= 18) {
      const jumpRebidBid = `${jumpLevel}${suitSymbol(myOpenSuit)}`;
      return {
        bid: jumpRebidBid,
        category: `Jump Rebid (${tp} TP — Medium Opener)`,
        reasoning: `With a ${myOpenSuitLen}-card ${myOpenSuit} suit and ${tp} TP (medium opener), bid ${jumpRebidBid} — a jump rebid showing 16-18 TP and a solid suit. This is invitational to game; partner passes with a minimum or bids game with 9+ HCP.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `${myOpenSuitLen}-card ${myOpenSuit}, 16-18 TP. Invitational jump — bid game with 9+ HCP.`,
        expectedResponses: [
          {
            partnerBid: `4${suitSymbol(myOpenSuit)}`,
            meaning: "9+ HCP — accepting the game invitation",
          },
          {
            partnerBid: "Pass",
            meaning: "Minimum (6-8 HCP) — declining the invitation",
          },
          {
            partnerBid: "3NT",
            meaning: "Balanced 10+ HCP with no fit for opener's suit",
          },
        ],
        confidence: "high",
      };
    }

    // ── Rebid own suit (5+ cards, tp ≤ 15) ────────────────────────────────────
    if (myOpenSuitLen >= 5 && tp <= 15) {
      // hcp 10–12: invitational range — jump rebid to invite game.
      // hcp ≤ 9: minimum — simple rebid.
      // tp 13–15: minimum opener — simple rebid.
      // SAYC invitational ranges are defined in HCP not TP. Using TP here would
      // incorrectly upgrade a 9 HCP + 1 length-point (TP=10) hand to invitational.
      const isInvitational = hand.hcp >= 10 && hand.hcp <= 12;
      const rebidLevel = isInvitational ? jumpLevel : simpleLevel;
      const rebidBid = `${rebidLevel}${suitSymbol(myOpenSuit)}`;

      if (isInvitational && myOpenSuitLen < 6) {
        return {
          bid: rebidBid,
          category: `Invitational Jump Rebid (${myOpenSuitLen}-Card ${myOpenSuit.charAt(0).toUpperCase() + myOpenSuit.slice(1)})`,
          reasoning: `With ${myOpenSuitLen} ${myOpenSuit} and ${hand.hcp} HCP (invitational range), bid ${rebidBid} — an invitational jump, skipping the simple ${partnerBidLevel}${suitSymbol(myOpenSuit)} rebid. This tells partner "I have values and a good suit; please bid game if you have a maximum." Partner bids game with maximum, passes with minimum.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: `${myOpenSuitLen}-card ${myOpenSuit}, invitational strength (10–12 HCP). Bid game with a maximum; pass with a minimum.`,
          expectedResponses: [
            {
              partnerBid: `4${suitSymbol(myOpenSuit)}`,
              meaning: "Maximum — accepting the invitation",
            },
            {
              partnerBid: "Pass",
              meaning: "Minimum — declining the invitation",
            },
          ],
          confidence: "high",
        };
      }

      return {
        bid: rebidBid,
        category: `Rebid Own Suit (${myOpenSuitLen}+ cards, ${tp <= 9 ? "Minimum" : "13–15 TP"})`,
        reasoning: `With a ${myOpenSuitLen}-card ${myOpenSuit} suit and no 4-card fit for partner's ${partnerSuit}, rebid ${rebidBid} — a simple, non-forcing rebid at the same level as partner. This shows your suit without jumping (no extra values to show).`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `${myOpenSuitLen}-card ${myOpenSuit}, no ${partnerSuit} fit, minimum values.`,
        expectedResponses: [
          { partnerBid: "Pass", meaning: "Minimum hand — happy to play here" },
          {
            partnerBid: `3${suitSymbol(myOpenSuit)}`,
            meaning: "Invitational — good hand",
          },
        ],
        confidence: "high",
      };
    }

    // ── NT rebid (balanced, no fit) ───────────────────────────────────────────
    // After opening a suit, 1NT rebid shows 12-14 HCP (minimum opener).
    // With 18-19 HCP balanced you rebid 2NT; with 15-17 you opened 1NT directly.
    if (analysis.isBalanced) {
      const { hcp } = hand;
      const level = hcp >= 18 ? 2 : 1;
      const hcpRange = hcp >= 18 ? "18-19 HCP" : "12-14 HCP";
      return {
        bid: `${level}NT`,
        category: `${level}NT Rebid (Balanced, ${hcpRange})`,
        reasoning: `With a balanced hand and ${hcp} HCP, rebid ${level}NT — showing a balanced minimum opener (12-14 HCP) or a very strong balanced hand (18-19 HCP). Note: hands with 15-17 HCP typically open 1NT directly.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `Balanced hand, ${hcpRange}.`,
        expectedResponses: [
          {
            partnerBid: "2♣",
            meaning: "Stayman — looking for a 4-4 major fit",
          },
          { partnerBid: "2♦", meaning: "Transfer to hearts" },
          { partnerBid: "2♥", meaning: "Transfer to spades" },
          { partnerBid: "Pass", meaning: "Satisfied — no game interest" },
        ],
        confidence: "medium",
      };
    }
  }

  // ── partnerSuit is null: partner bid Double, Redouble, or a non-suit action ──
  // (e.g. partner penalty-doubled an opponent's overcall, or partner redoubled)
  // Balanced hands can still describe their shape with an NT rebid.
  // Unbalanced hands with no clear action should pass.
  if (!partnerSuit) {
    if (analysis.isBalanced) {
      const { hcp } = hand;
      const level = hcp >= 18 ? 2 : 1;
      const hcpRange = hcp >= 18 ? "18-19 HCP" : "12-14 HCP";
      return {
        bid: `${level}NT`,
        category: `${level}NT Rebid After Partner's Double (${hcpRange})`,
        reasoning: `Partner doubled an opponent's bid (or made another non-suit action). With a balanced hand and ${hcp} HCP, rebid ${level}NT to describe your shape and let partner know you are balanced.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `Balanced hand, ${hcpRange}.`,
        expectedResponses: [],
        confidence: "medium",
      };
    }
    if (myOpenSuitLen >= 5) {
      const rebidBid = `2${suitSymbol(myOpenSuit)}`;
      return {
        bid: rebidBid,
        category: "Rebid Own Suit After Partner's Double",
        reasoning: `Partner doubled (or made a non-suit bid). With ${myOpenSuitLen} ${myOpenSuit} and an unbalanced hand, rebid ${rebidBid} to show your suit length.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `${myOpenSuitLen}-card ${myOpenSuit}, continuing to show my suit.`,
        expectedResponses: [],
        confidence: "medium",
      };
    }
    return {
      bid: "Pass",
      category: "Pass After Partner's Double",
      reasoning:
        "Partner doubled an opponent's bid (or made a non-suit bid). Without a clear rebid, pass to let partner's action stand — you've already described your hand with the opening bid.",
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "Minimum opener with no clear rebid — supporting partner's action.",
      expectedResponses: [],
      confidence: "medium",
    };
  }

  return {
    bid: "Pass",
    category: "Pass (No Clear Rebid Available)",
    reasoning:
      "No standard rebid pattern matches this auction. Pass is the safest action — let partner describe their hand further before committing to a higher contract.",
    handAnalysis: analysis,
    whatYourBidTellsPartner: "Minimum opener with no additional suit to show.",
    expectedResponses: [],
    confidence: "low",
  };
}

function getJacoby2NTOpenerRebid(
  hand: Hand,
  myMajor: string,
): BidRecommendation {
  const analysis = analyzeHand(hand);
  const { tp } = analysis;
  const majorSuit = myMajor.includes("♥") ? "hearts" : "spades";

  // Check for singleton or void in side suits (slam try — highest priority)
  const suits = [
    { name: "spades", count: hand.spades },
    { name: "hearts", count: hand.hearts },
    { name: "diamonds", count: hand.diamonds },
    { name: "clubs", count: hand.clubs },
  ].filter((s) => s.name !== majorSuit);

  const shortSuit = suits.find((s) => s.count <= 1);
  if (shortSuit && tp >= 13) {
    return {
      bid: `3${suitSymbol(shortSuit.name)}`,
      category: "Jacoby 2NT Rebid: Show Shortness",
      reasoning: `Partner made a game-forcing Jacoby 2NT raise. With a singleton or void in ${shortSuit.name}, bid 3${suitSymbol(shortSuit.name)} to show shortness (slam try).`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `Singleton or void in ${shortSuit.name}. Slam is possible if partner has first-round control there.`,
      expectedResponses: [
        {
          partnerBid: `4${suitSymbol(majorSuit)}`,
          meaning: "No slam interest — sign off in game",
        },
        { partnerBid: "4NT", meaning: "Blackwood — slam interest confirmed" },
        {
          partnerBid: "New suit",
          meaning: "First-round control (A or void) — slam investigation",
        },
      ],
      confidence: "high",
    };
  }

  // 5-card side suit with quality
  const qualitySideSuit = suits.find((s) => s.count >= 5);
  if (qualitySideSuit && tp >= 13) {
    return {
      bid: `4${suitSymbol(qualitySideSuit.name)}`,
      category: "Jacoby 2NT Rebid: 5-Card Side Suit",
      reasoning: `Show your 5-card ${qualitySideSuit.name} side suit. Ensure it has at least the Ace or King.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `5+ card ${qualitySideSuit.name} side suit with quality (A or K minimum).`,
      expectedResponses: [],
      confidence: "high",
    };
  }

  // Balanced 14-15 (3NT)
  if (analysis.isBalanced && hand.hcp >= 14 && hand.hcp <= 15) {
    return {
      bid: "3NT",
      category: "Jacoby 2NT Rebid: 3NT (14-15 Balanced)",
      reasoning:
        "With 14-15 balanced points and no shortness or side suit to show, bid 3NT.",
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "14-15 pts balanced, no singleton, no 5-card side suit.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  // 16+ slam interest (3 of agreed major)
  if (tp >= 16) {
    return {
      bid: `3${suitSymbol(majorSuit)}`,
      category: "Jacoby 2NT Rebid: Slam Interest (16+ pts)",
      reasoning: `With 16+ pts and no shortness or 5-card side suit to show, bid 3${suitSymbol(majorSuit)} to show extra strength and slam interest.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "16+ TP, no shortness, no side suit — general slam try.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  // Minimum (12-14) — jump to game
  return {
    bid: `4${suitSymbol(majorSuit)}`,
    category: "Jacoby 2NT Rebid: Minimum (Sign Off)",
    reasoning: `With 12-14 pts (minimum opener) and no shortness or strong side suit, sign off in game at 4${suitSymbol(majorSuit)}.`,
    handAnalysis: analysis,
    whatYourBidTellsPartner: "Minimum opener (12-14 pts). No slam interest.",
    expectedResponses: [],
    confidence: "high",
  };
}

function getRebidAfterNegativeDouble(
  hand: Hand,
  myOpeningBid: string,
  overcall: string,
): BidRecommendation {
  const analysis = analyzeHand(hand);
  const { tp } = analysis;

  const openSuit = myOpeningBid.includes("♠")
    ? "spades"
    : myOpeningBid.includes("♥")
      ? "hearts"
      : myOpeningBid.includes("♦")
        ? "diamonds"
        : "clubs";

  // Determine which major partner showed with the negative double
  const overcalledSpades = overcall.includes("♠");
  const overcalledHearts = overcall.includes("♥");
  const shownSuit = !overcalledSpades
    ? "spades"
    : !overcalledHearts
      ? "hearts"
      : null;

  if (!shownSuit) {
    // Opponent overcalled both majors — negative double shows minors or an unusual hand.
    // Best response: bid NT with a stopper in opponent's suit, otherwise rebid own suit.
    const hasStoppers = hand.spades >= 2 && hand.hearts >= 2;
    const rebidLevel = tp >= 18 ? 2 : 1;
    const rebidBid =
      hasStoppers && tp >= 15 ? "1NT" : `${rebidLevel}${suitSymbol(openSuit)}`;
    return {
      bid: rebidBid,
      category: "Rebid After Negative Double",
      reasoning: `Partner's negative double indicates both minors (or an unusual hand). ${hasStoppers && tp >= 15 ? "With stoppers in both majors, bid 1NT to show a balanced minimum." : `Rebid your ${openSuit} to show a minimum opener with no clear fit.`}`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        hasStoppers && tp >= 15
          ? "Minimum opener, stoppers in both majors."
          : `Minimum opener — rebidding ${openSuit}.`,
      expectedResponses: [],
      confidence: "medium",
    };
  }

  const myFitLen = hand[shownSuit as keyof Hand] as number;

  if (myFitLen >= 4) {
    // Level of bid shows strength
    const bid =
      tp >= 20
        ? `4${suitSymbol(shownSuit)}`
        : tp >= 18
          ? `3${suitSymbol(shownSuit)}`
          : tp >= 16
            ? `2${suitSymbol(shownSuit)} (jump)`
            : `2${suitSymbol(shownSuit)}`;
    const range =
      tp >= 20
        ? "20-21 TP"
        : tp >= 18
          ? "18-19 TP"
          : tp >= 16
            ? "15-17 TP"
            : "11-14 TP";
    return {
      bid,
      category: `Bid Partner's Suit (${range})`,
      reasoning: `Partner's negative double showed ${shownSuit}. With ${myFitLen} card support and ${tp} TP, bid ${bid}.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `${range} with ${myFitLen}-card ${shownSuit} support.`,
      expectedResponses: [],
      confidence: "high",
    };
  }

  // No fit — bid NT with stopper or rebid own suit
  if (analysis.isBalanced) {
    return {
      bid: tp >= 18 ? "2NT" : "1NT",
      category: "NT Rebid After Negative Double",
      reasoning: `No 4-card fit for partner's shown suit. With a balanced hand and stopper in the overcalled suit, bid ${tp >= 18 ? "2NT" : "1NT"}.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `${tp >= 18 ? "18-19" : "15-17"} HCP balanced, stopper in their suit.`,
      expectedResponses: [],
      confidence: "medium",
    };
  }

  // 3-card support: bid the shown suit at the 1-level (minimum) or 2-level (medium).
  // Per SAYC / bridgebum.com: "Bid partner's shown suit with only 3 cards (last resort)."
  // Showing 3-card support is preferred over rebidding a 5-card minor.
  if (myFitLen === 3) {
    const threeCardBid =
      tp >= 17 ? `2${suitSymbol(shownSuit)}` : `1${suitSymbol(shownSuit)}`;
    return {
      bid: threeCardBid,
      category: `3-Card ${shownSuit.charAt(0).toUpperCase() + shownSuit.slice(1)} Support After Negative Double`,
      reasoning: `Partner's negative double showed ${shownSuit}. With 3-card ${shownSuit} support (the minimum needed to show) and ${tp} TP, bid ${threeCardBid}. Showing 3-card support is preferred over rebidding a 5-card minor when no better bid is available.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `3-card ${shownSuit} support, ${tp >= 17 ? "medium (17+ TP)" : "minimum"} hand.`,
      expectedResponses: [
        {
          partnerBid: `2${suitSymbol(shownSuit)}`,
          meaning: "Invitational raise",
        },
        { partnerBid: "Pass", meaning: "Minimum — content to play here" },
      ],
      confidence: "medium",
    };
  }

  const myOpenLen = hand[openSuit as keyof Hand] as number;
  return {
    bid: suitBidLevel(openSuit, 2),
    category: "Rebid Own Suit After Negative Double",
    reasoning: `No fit for partner's shown suit. Rebid your ${openSuit} suit (${myOpenLen} cards).`,
    handAnalysis: analysis,
    whatYourBidTellsPartner: `5-6 card ${openSuit} suit.`,
    expectedResponses: [],
    confidence: "medium",
  };
}

function getRespondingToSuitAfterDouble(
  hand: Hand,
  partnerSuit: string,
): BidRecommendation {
  const analysis = analyzeHand(hand);
  const { tp } = analysis;
  const suit = partnerSuit.includes("♠")
    ? "spades"
    : partnerSuit.includes("♥")
      ? "hearts"
      : "spades";
  const mySupport = hand[suit as keyof Hand] as number;

  if (mySupport >= 3 && tp >= 13) {
    return {
      bid: "Redouble",
      category: "Re-double (13+ pts, Strong Raise)",
      reasoning:
        "With 13+ pts and 3+ support, re-double first to show strength, then support partner's suit on the next bid.",
      handAnalysis: analysis,
      whatYourBidTellsPartner: "13+ pts — you will clarify on the next bid.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  if (mySupport >= 3 && tp >= 10) {
    return {
      bid: "2NT",
      category: "Jordan 2NT (Limit Raise after Double)",
      reasoning: `After partner opens 1${suitSymbol(suit)} and RHO doubles, 2NT is Jordan convention — showing a limit raise (10+ pts, 3+ card ${suit} support). This is NOT a natural NT bid.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `3+ card ${suit} support, limit raise values (10+ pts).`,
      expectedResponses: [
        { partnerBid: `4${suitSymbol(suit)}`, meaning: "Accepts with 16+ TP" },
        {
          partnerBid: `3${suitSymbol(suit)}`,
          meaning: "Minimum opener (13-15 TP)",
        },
      ],
      confidence: "high",
      note: "Jordan 2NT is used instead of Jacoby 2NT when there is interference (RHO doubled).",
    };
  }

  if (mySupport >= 3 && tp >= 6 && tp <= 9) {
    return {
      bid: `3${suitSymbol(suit)}`,
      category: "Pre-emptive Raise After Double",
      reasoning: `After partner opens and RHO doubles, a jump raise is PRE-EMPTIVE (not invitational). With 3+ support and 6-9 pts, raise to 3${suitSymbol(suit)}.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "3+ card support, 6-9 pts. Pre-emptive raise — not invitational.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  // Fallback cases: weak hand with 3+ support (too weak for pre-emptive raise), or no fit
  if (mySupport >= 3) {
    return {
      bid: `2${suitSymbol(suit)}`,
      category: "Weak Raise After Double",
      reasoning: `With ${tp} pts and ${mySupport}-card support, make a minimum raise to 2${suitSymbol(suit)} to show fit without invitational values.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `Minimum support (2–5 pts, 3+ ${suit}). Competitive raise.`,
      expectedResponses: [],
      confidence: "medium",
    };
  }

  if (tp < 6) {
    return {
      bid: "Pass",
      category: "Pass (Too Weak to Respond After Double)",
      reasoning: `With only ${tp} pts and no fit for partner's ${suit}, the hand is too weak to respond. Pass and let the auction develop.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Weak hand — no fit for your suit.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  // Moderate strength but no fit — bid longest suit
  const { name: longestName } = longestSuitInfo(hand);
  const newSuitBid = `${tp >= 9 ? 2 : 1}${suitSymbol(longestName)}`;
  return {
    bid: newSuitBid,
    category: "Bid New Suit After Double",
    reasoning: `With ${tp} pts but no fit for partner's ${suit}, bid your longest suit (${longestName}) at the ${tp >= 9 ? "2" : "1"}-level.`,
    handAnalysis: analysis,
    whatYourBidTellsPartner: "No fit for your suit — showing my longest suit.",
    expectedResponses: [],
    confidence: "medium",
  };
}

// ─── Convention Follow-Ups ───────────────────────────────────────────────────

function getStaymanFollowUp(
  hand: Hand,
  partnerReply: string,
): BidRecommendation {
  const analysis = analyzeHand(hand);
  const { hcp } = hand;

  if (partnerReply === "2♦" || partnerReply === "3♦") {
    // No major found
    if (hand.hearts >= 5 || hand.spades >= 5) {
      // Had 5-4 majors, now bid the 5-card major
      const suit = hand.spades >= 5 ? "spades" : "hearts";
      return {
        bid: `3${suitSymbol(suit)}`,
        category: "Stayman 2♦ Reply: Bid 5-card Major",
        reasoning: `Partner denied a 4-card major (2♦). You held a 5-4 combination in majors, so now bid your 5-card ${suit} naturally. This is game-forcing.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `5-card ${suit} suit — game-forcing.`,
        expectedResponses: [
          {
            partnerBid: `4${suitSymbol(suit)}`,
            meaning: "3+ card support — accepts major",
          },
          { partnerBid: "3NT", meaning: "Only 2-card support — prefers NT" },
        ],
        confidence: "high",
      };
    }

    if (hcp <= 7 && (hand.hearts >= 4 || hand.spades >= 4)) {
      // 4-5/5-4 majors, weak: bid the major
      const suit = hand.spades >= 4 ? "spades" : "hearts";
      return {
        bid: `2${suitSymbol(suit)}`,
        category: "Stayman: Bid Major After 2♦ (Weak, 4-5/5-4)",
        reasoning:
          "Partner denied a major. With a 4-5 or 5-4 major combination (0-7 pts), bid your major. This is a weak signoff.",
        handAnalysis: analysis,
        whatYourBidTellsPartner: "4-5 or 5-4 majors, weak hand — signoff.",
        expectedResponses: [
          { partnerBid: "Pass", meaning: "Accepts the signoff" },
        ],
        confidence: "high",
      };
    }

    return {
      bid: hcp >= 10 ? "3NT" : "2NT",
      category: "Stayman: NT After 2♦ (No Major Fit)",
      reasoning: `Partner denied a 4-card major. With ${hcp >= 10 ? "10+" : "8-9"} HCP and no major fit, bid ${hcp >= 10 ? "3NT" : "2NT"}.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `No major fit — ${hcp >= 10 ? "game in NT" : "invitational"}.`,
      expectedResponses: [],
      confidence: "high",
    };
  }

  // Partner showed a major (2♥ or 2♠)
  const partnerMajor = partnerReply.includes("♥") ? "hearts" : "spades";
  const myFit = hand[partnerMajor as keyof Hand] as number;

  if (myFit >= 4) {
    return {
      bid:
        hcp >= 10
          ? `4${suitSymbol(partnerMajor)}`
          : `3${suitSymbol(partnerMajor)}`,
      category: "Major Fit Found After Stayman",
      reasoning: `Partner showed 4+ ${partnerMajor} and you have ${myFit} card support. ${hcp >= 10 ? "Bid game (4♥/4♠)" : "Bid 3 of major (invitational)"}.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `4-4 major fit — ${hcp >= 10 ? "game" : "invitational"}.`,
      expectedResponses: [],
      confidence: "high",
    };
  }

  // No fit in shown major — check if we hold the OTHER major
  const otherMajor = partnerMajor === "hearts" ? "spades" : "hearts";
  const myOtherMajor = hand[otherMajor as keyof Hand] as number;

  if (myOtherMajor >= 4) {
    // Classic Stayman inference: bidding NT here IMPLIES 4 cards in the other major.
    // Opener can correct to 4♠/4♥ if they also hold that major (they may have shown
    // hearts first but also hold 4 spades in SAYC).
    return {
      bid: hcp >= 10 ? "3NT" : "2NT",
      category: `Stayman — No Fit in ${partnerMajor === "hearts" ? "♥" : "♠"}, 4 ${otherMajor === "spades" ? "♠" : "♥"} Implied`,
      reasoning:
        hcp >= 10
          ? `Partner showed 4 ${partnerMajor} (2${suitSymbol(partnerMajor)}), but you have no fit there. You do hold 4 ${otherMajor}. Bid 3NT — by going through Stayman then jumping to 3NT, you IMPLY 4 ${otherMajor}. Opener will correct to 4${suitSymbol(otherMajor)} if they also hold 4 ${otherMajor} (possible in SAYC where opener bids the lower major first). If they pass 3NT, they don't have 4 ${otherMajor}.`
          : `Partner showed 4 ${partnerMajor} (2${suitSymbol(partnerMajor)}), but you have no fit there. You do hold 4 ${otherMajor}. With 8-9 pts, bid 2NT (invitational). This IMPLIES 4 ${otherMajor} — you used Stayman to look for a major, so bidding NT now tells opener you have the other major. Opener with 4 ${otherMajor} + a maximum 1NT will bid 3${suitSymbol(otherMajor)} or 4${suitSymbol(otherMajor)}.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `Invitational values, no fit in your ${partnerMajor} — but I hold 4 ${otherMajor}. You may correct to ${otherMajor === "spades" ? "3♠/4♠" : "3♥/4♥"}.`,
      expectedResponses:
        hcp >= 10
          ? [
              {
                partnerBid: `4${suitSymbol(otherMajor)}`,
                meaning: `Partner also has 4 ${otherMajor} — 4-4 major fit found!`,
              },
              {
                partnerBid: "Pass",
                meaning:
                  "Partner accepts 3NT as final contract (no 4-card fit in other major)",
              },
            ]
          : [
              {
                partnerBid: `4${suitSymbol(otherMajor)}`,
                meaning: `Partner has 4 ${otherMajor} + maximum 1NT — accepts`,
              },
              {
                partnerBid: `3${suitSymbol(otherMajor)}`,
                meaning: `Partner has 4 ${otherMajor} + minimum/medium 1NT — invitational`,
              },
              {
                partnerBid: "3NT",
                meaning:
                  "Partner accepts NT game, no 4-card fit in other major",
              },
              {
                partnerBid: "Pass",
                meaning: "Partner declines — minimum 1NT, no other major fit",
              },
            ],
      confidence: "high",
      note: `Do NOT bid 4${suitSymbol(otherMajor)} directly — use 2NT (invitational) or 3NT (game-forcing) to imply the 4-card ${otherMajor} suit. Opener decides if a ${otherMajor} fit exists.`,
    };
  }

  // No fit in shown major, no other major either — bid NT
  return {
    bid: hcp >= 10 ? "3NT" : "2NT",
    category: "Stayman — No Major Fit Found, Bid NT",
    reasoning: `Partner showed 4 ${partnerMajor} but you have no fit there, and you don't hold 4 ${otherMajor} either. Bid ${hcp >= 10 ? "3NT (game)" : "2NT (invitational)"}.`,
    handAnalysis: analysis,
    whatYourBidTellsPartner: `No major fit — ${hcp >= 10 ? "game in NT" : "invitational NT"}.`,
    expectedResponses: [],
    confidence: "high",
  };
}

function getTransferFollowUp(
  hand: Hand,
  transferredSuit: string,
): BidRecommendation {
  const analysis = analyzeHand(hand);
  const { hcp } = hand;
  const suit = transferredSuit.includes("♥") ? "hearts" : "spades";
  const suitLen = hand[suit as keyof Hand] as number;
  const otherMajor = suit === "hearts" ? "spades" : "hearts";
  const otherMajorLen = hand[otherMajor as keyof Hand] as number;

  // Weak — pass
  if (hcp <= 7) {
    return {
      bid: "Pass",
      category: "Transfer: Pass (Weak Hand)",
      reasoning:
        "With 0-7 pts, pass after the transfer completes. The hand plays better from partner's side.",
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "Weak hand — 1NT play in the major was the goal.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  // 5 of major + 5 of other major, invitational (bid other major)
  if (suitLen >= 5 && otherMajorLen >= 5 && hcp >= 8 && hcp <= 9) {
    return {
      bid: `2${suitSymbol(otherMajor)}`,
      category: "Transfer: 5-5 Majors, Invitational",
      reasoning: `With 5 ${suit} and 5 ${otherMajor} (8-9 pts), bid 2${suitSymbol(otherMajor)} to show the second major. Invitational.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `5 ${suit} and 5 ${otherMajor}, invitational (8-9 pts).`,
      expectedResponses: [],
      confidence: "high",
    };
  }

  // Game with 6+ cards in major
  if (suitLen >= 6 && hcp >= 10) {
    return {
      bid: `4${suitSymbol(suit)}`,
      category: "Transfer: Game with 6+ Card Major",
      reasoning: `With 6+ ${suit} and 10+ pts, bid game directly (4${suitSymbol(suit)}).`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `6+ card ${suit} suit, game values.`,
      expectedResponses: [],
      confidence: "high",
    };
  }

  // Invitational with 6+ cards
  if (suitLen >= 6 && hcp >= 8 && hcp <= 9) {
    return {
      bid: `3${suitSymbol(suit)}`,
      category: "Transfer: Invitational with 6+ Card Major",
      reasoning: `With 6+ ${suit} and 8-9 pts, bid 3${suitSymbol(suit)} to invite game.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `6+ card ${suit}, invitational.`,
      expectedResponses: [],
      confidence: "high",
    };
  }

  // Game with 5-card major (3NT, partner can correct to 4 of major)
  if (suitLen === 5 && hcp >= 10) {
    return {
      bid: "3NT",
      category: "Transfer: 5-Card Major, Game (Bid 3NT)",
      reasoning: `With exactly 5 ${suit} and 10+ pts, bid 3NT. Partner can pass or correct to 4${suitSymbol(suit)} with 3+ card support.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `Exactly 5 ${suit}, game-going. Choose between 3NT and 4${suitSymbol(suit)}.`,
      expectedResponses: [
        { partnerBid: "Pass", meaning: "Only 2-card support — prefers 3NT" },
        {
          partnerBid: `4${suitSymbol(suit)}`,
          meaning: "3+ card support — prefers major",
        },
      ],
      confidence: "high",
    };
  }

  // Invitational with 5 cards
  if (suitLen === 5 && hcp >= 8 && hcp <= 9) {
    return {
      bid: "2NT",
      category: "Transfer: 5-Card Major, Invitational (2NT)",
      reasoning: `With exactly 5 ${suit} and 8-9 pts, bid 2NT to invite. Partner can pass, bid 3${suitSymbol(suit)}, or bid 3NT.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `5 ${suit}, invitational (8-9 pts).`,
      expectedResponses: [
        { partnerBid: "Pass", meaning: "15-16 HCP — no game" },
        {
          partnerBid: `3${suitSymbol(suit)}`,
          meaning: "17 HCP with 3+ support",
        },
        { partnerBid: "3NT", meaning: "17 HCP, only 2-card support" },
      ],
      confidence: "high",
    };
  }

  return {
    bid: "Pass",
    category: "Transfer: Pass",
    reasoning: "Weak hand — pass after transfer.",
    handAnalysis: analysis,
    whatYourBidTellsPartner: "Weak hand.",
    expectedResponses: [],
    confidence: "high",
  };
}

function getMinorTransferFollowUp(hand: Hand): BidRecommendation {
  const analysis = analyzeHand(hand);
  if (hand.diamonds > hand.clubs) {
    return {
      bid: "3♦",
      category: "Minor Transfer: Convert to Diamonds",
      reasoning:
        "Partner bid 3♣ completing the minor transfer. With more diamonds than clubs, convert to 3♦.",
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Diamonds is the target suit — pass 3♦.",
      expectedResponses: [{ partnerBid: "Pass", meaning: "Accepts 3♦" }],
      confidence: "high",
    };
  }
  return {
    bid: "Pass",
    category: "Minor Transfer: Pass in Clubs",
    reasoning: "Partner bid 3♣. If clubs is your long suit, pass and play 3♣.",
    handAnalysis: analysis,
    whatYourBidTellsPartner: "Clubs is fine — playing 3♣.",
    expectedResponses: [],
    confidence: "high",
  };
}

function decodeAceCount(bid: string, isGerber: boolean): number | null {
  if (isGerber) {
    if (bid === "4♦") return 0;
    if (bid === "4♥") return 1;
    if (bid === "4♠") return 2;
    if (bid === "4NT") return 3;
  } else {
    if (bid === "5♣") return 0;
    if (bid === "5♦") return 1;
    if (bid === "5♥") return 2;
    if (bid === "5♠") return 3;
  }
  return null;
}

function decodeKingCount(bid: string, isGerber: boolean): number | null {
  if (isGerber) {
    if (bid === "5♦") return 0;
    if (bid === "5♥") return 1;
    if (bid === "5♠") return 2;
    if (bid === "5NT") return 3;
  } else {
    if (bid === "6♣") return 0;
    if (bid === "6♦") return 1;
    if (bid === "6♥") return 2;
    if (bid === "6♠") return 3;
  }
  return null;
}

// ─── Respond to partner's Blackwood 4NT ask ───────────────────────────────────

/**
 * Called when partner bid 4NT (Blackwood), asking for ace count.
 * Uses hand.aces if provided (entered by user); otherwise falls back to HCP estimate.
 */
function getBlackwoodAceResponse(hand: Hand): BidRecommendation {
  const analysis = analyzeHand(hand);
  const { hcp } = hand;

  const aceBidChart =
    "5♣ = 0 or 4 aces  |  5♦ = 1 ace  |  5♥ = 2 aces  |  5♠ = 3 aces";

  // Use the actual ace count if the user entered it; otherwise estimate from HCP
  const usingActual = hand.aces !== undefined;
  const aceCount = usingActual
    ? (hand.aces as number)
    : Math.min(4, Math.max(0, Math.round(hcp / 10)));

  const aceResponseBid =
    aceCount === 0 || aceCount === 4
      ? "5♣"
      : aceCount === 1
        ? "5♦"
        : aceCount === 2
          ? "5♥"
          : "5♠"; // 3 aces

  const aceLabel =
    aceResponseBid === "5♣"
      ? "0 or 4 aces"
      : aceResponseBid === "5♦"
        ? "1 ace"
        : aceResponseBid === "5♥"
          ? "2 aces"
          : "3 aces";

  const reasoning = usingActual
    ? `Partner bid 4NT — Blackwood, asking how many aces you hold. You entered ${aceCount} ace${aceCount !== 1 ? "s" : ""}, so respond ${aceResponseBid}.\n\n${aceBidChart}`
    : `Partner bid 4NT — this is Blackwood, asking how many aces you hold. COUNT YOUR ACTUAL ACES and respond:\n\n${aceBidChart}\n\nBased on your ${hcp} HCP, you likely have ~${aceCount} ace${aceCount !== 1 ? "s" : ""}, suggesting ${aceResponseBid} — but count your actual aces to be sure. Enter your ace count in the "Aces" field above for an accurate response.`;

  return {
    bid: aceResponseBid,
    category: "Respond to Blackwood (Partner's 4NT)",
    reasoning,
    handAnalysis: analysis,
    whatYourBidTellsPartner: `${aceLabel}${usingActual ? "" : " (estimated — enter actual ace count for accuracy)"}.`,
    expectedResponses: [
      {
        partnerBid: "Pass",
        meaning:
          "Partner has all the information needed — likely signs off at game",
      },
      {
        partnerBid: "5NT",
        meaning:
          "Partner asks for kings (Grand Slam Force) — you have enough aces",
      },
      {
        partnerBid: "6 of agreed suit",
        meaning: "Partner bids small slam directly",
      },
      {
        partnerBid: "7 of agreed suit",
        meaning: "Partner bids grand slam",
      },
    ],
    confidence: usingActual ? "high" : "medium",
    note: usingActual
      ? aceBidChart
      : `${aceBidChart}\n\nTip: Enter your exact ace count in the "Aces in hand" field for a precise response.`,
  };
}

// ─── Respond to partner's Blackwood 5NT kings ask ────────────────────────────

/**
 * Called when partner bid 5NT after my Blackwood ace response, asking for kings.
 * Respond: 6♣=0 kings, 6♦=1 king, 6♥=2 kings, 6♠=3 kings.
 * Uses hand.kings if provided; otherwise falls back to HCP estimate.
 */
function getBlackwoodKingsResponse(hand: Hand): BidRecommendation {
  const analysis = analyzeHand(hand);
  const { hcp } = hand;

  const kingsBidChart =
    "6♣ = 0 kings  |  6♦ = 1 king  |  6♥ = 2 kings  |  6♠ = 3 kings";

  const usingActual = hand.kings !== undefined;
  const kingCount = usingActual
    ? (hand.kings as number)
    : Math.min(4, Math.max(0, Math.round(hcp / 8)));

  const kingsResponseBid =
    kingCount === 0
      ? "6♣"
      : kingCount === 1
        ? "6♦"
        : kingCount === 2
          ? "6♥"
          : "6♠"; // 3 or 4 kings

  const kingsLabel =
    kingsResponseBid === "6♣"
      ? "0 kings"
      : kingsResponseBid === "6♦"
        ? "1 king"
        : kingsResponseBid === "6♥"
          ? "2 kings"
          : "3 kings";

  const reasoning = usingActual
    ? `Partner bid 5NT — asking how many kings you hold. You entered ${kingCount} king${kingCount !== 1 ? "s" : ""}, so respond ${kingsResponseBid}.\n\n${kingsBidChart}`
    : `Partner bid 5NT — after your ace response, they are now asking how many kings you hold. COUNT YOUR ACTUAL KINGS and respond:\n\n${kingsBidChart}\n\nBased on your ${hcp} HCP, you likely have ~${kingCount} king${kingCount !== 1 ? "s" : ""}, suggesting ${kingsResponseBid} — but count your actual kings to be sure. Enter your king count in the "Kings" field above for an accurate response.`;

  return {
    bid: kingsResponseBid,
    category: "Respond to Blackwood Kings Ask (Partner's 5NT)",
    reasoning,
    handAnalysis: analysis,
    whatYourBidTellsPartner: `${kingsLabel}${usingActual ? "" : " (estimated — enter actual king count for accuracy)"}.`,
    expectedResponses: [
      {
        partnerBid: "Pass",
        meaning: "Partner signs off at the 6-level small slam",
      },
      {
        partnerBid: "7 of agreed suit",
        meaning:
          "Partner bids grand slam — they have all aces and enough kings",
      },
    ],
    confidence: usingActual ? "high" : "medium",
    note: usingActual
      ? kingsBidChart
      : `${kingsBidChart}\n\nTip: Enter your exact king count in the "Kings in hand" field for a precise response.`,
  };
}

function getBlackwoodFollowUp(
  hand: Hand,
  partnerReply: string,
  agreedSuit: string,
): BidRecommendation {
  const analysis = analyzeHand(hand);
  const aceCount = decodeAceCount(partnerReply, false);

  if (hasVoid(hand)) {
    // You bid Blackwood but hold a void — partner can't tell which aces you're actually missing.
    // Sign off conservatively at 5 of the agreed suit.
    const signOff = `5${agreedSuit?.includes("♥") ? "♥" : agreedSuit?.includes("♦") ? "♦" : agreedSuit?.includes("♣") ? "♣" : "♠"}`;
    return {
      bid: signOff,
      category: "Blackwood Warning: Void Present — Sign Off",
      reasoning: `You have a void in your hand, which makes Blackwood unreliable — partner cannot tell which aces are truly "missing." Sign off at ${signOff} to play game safely.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Signing off — suit game is the contract.",
      expectedResponses: [],
      confidence: "low",
      note: "Tip: With a void, use cue bids to show first-round control instead of Blackwood.",
    };
  }

  if (aceCount === null) {
    // Partner's bid was not a recognized Blackwood response (may be competition or an edge case).
    // Default: sign off in 5 of the agreed suit to stay safe.
    const defaultSignOff = `5${agreedSuit?.includes("♥") ? "♥" : agreedSuit?.includes("♦") ? "♦" : agreedSuit?.includes("♣") ? "♣" : "♠"}`;
    return {
      bid: defaultSignOff,
      category: "Blackwood: Unrecognized Response — Sign Off",
      reasoning: `Partner's bid (${partnerReply}) was not a standard Blackwood response (5♣=0/4 aces, 5♦=1, 5♥=2, 5♠=3). This may be due to competition interfering. Sign off at ${defaultSignOff} to be safe.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Sign off — cannot determine ace count.",
      expectedResponses: [],
      confidence: "low",
      note: "Standard Blackwood responses: 5♣=0/4 aces, 5♦=1 ace, 5♥=2 aces, 5♠=3 aces.",
    };
  }

  const suitSym = agreedSuit
    ? agreedSuit.includes("♠")
      ? "♠"
      : agreedSuit.includes("♥")
        ? "♥"
        : agreedSuit.includes("♦")
          ? "♦"
          : "♣"
    : "♠";

  const kingsChart =
    "6♣ = 0 or 4 kings  |  6♦ = 1 king  |  6♥ = 2 kings  |  6♠ = 3 kings";

  // ── 5♣: 0 OR 4 aces (ambiguous) ──────────────────────────────────────────
  if (aceCount === 0) {
    return {
      bid: "5NT",
      category: "Blackwood: 5♣ Response — 0 or 4 Aces",
      reasoning:
        "Partner bid 5♣, which means 0 OR 4 aces — the two cases require different actions:\n\n" +
        "• If YOU hold all 4 aces → partner has 0. Combined = 4 aces. " +
        "Bid 5NT to ask for kings and continue toward slam.\n" +
        `• If you hold 3 or fewer aces → sign off at 5${suitSym} (too many aces missing for slam).\n\n` +
        `The suggested bid (5NT) is the aggressive path. Change it to 5${suitSym} if you do not hold all 4 aces.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "Asking for kings — we have enough aces for slam.",
      expectedResponses: [
        { partnerBid: "6♣", meaning: "0 or 4 kings" },
        { partnerBid: "6♦", meaning: "1 king" },
        { partnerBid: "6♥", meaning: "2 kings" },
        { partnerBid: "6♠", meaning: "3 kings" },
      ],
      confidence: "medium",
      note: `KEY: 5♣ = 0 OR 4 aces. There are only 4 aces in the deck — if you hold any aces yourself, partner must have 0 (not 4). Change to 5${suitSym} if you hold 3 or fewer aces.  ${kingsChart}`,
    };
  }

  // ── 5♦: 1 ace ─────────────────────────────────────────────────────────────
  if (aceCount === 1) {
    return {
      bid: "5NT",
      category: "Blackwood: 5♦ Response — 1 Ace",
      reasoning:
        "Partner has 1 ace. Here is how to decide your next bid:\n\n" +
        "• If YOU hold 3 aces → combined = 4 aces. Bid 5NT to ask for kings (grand slam possible).\n" +
        `• If you hold 2 or fewer aces → combined ≤ 3. Sign off at 5${suitSym}.\n\n` +
        `The suggested bid (5NT) is the aggressive path. Change it to 5${suitSym} if you hold 2 or fewer aces.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "Asking for kings — combined 4 aces allows slam consideration.",
      expectedResponses: [
        { partnerBid: "6♣", meaning: "0 or 4 kings" },
        { partnerBid: "6♦", meaning: "1 king" },
        { partnerBid: "6♥", meaning: "2 kings" },
        { partnerBid: "6♠", meaning: "3 kings" },
      ],
      confidence: "medium",
      note: `Change to 5${suitSym} (sign off) if you hold 2 or fewer aces. ${kingsChart}`,
    };
  }

  // ── 5♥: 2 aces ────────────────────────────────────────────────────────────
  if (aceCount === 2) {
    return {
      bid: `6${suitSym}`,
      category: "Blackwood: 5♥ Response — 2 Aces",
      reasoning:
        "Partner has 2 aces. Here is how to decide your next bid:\n\n" +
        `• If YOU hold 2 aces → combined = 4 aces. Bid 6${suitSym} for small slam. ` +
        "(If you also have grand slam values, bid 5NT to ask for kings first.)\n" +
        `• If you hold 1 or 0 aces → combined ≤ 3. Sign off at 5${suitSym}.\n\n` +
        `The suggested bid (6${suitSym}) is the aggressive path. Change to 5${suitSym} if you hold 1 or fewer aces.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `Bidding small slam in ${suitSym}.`,
      expectedResponses: [
        { partnerBid: "Pass", meaning: "Accepts small slam" },
      ],
      confidence: "medium",
      note: `Change to 5${suitSym} (sign off) if you hold 1 or fewer aces. Bid 5NT instead if you have grand slam strength (33+ combined points).`,
    };
  }

  // ── 5♠: 3 aces ────────────────────────────────────────────────────────────
  return {
    bid: "5NT",
    category: "Blackwood: 5♠ Response — 3 Aces",
    reasoning:
      "Partner has 3 aces. Combined aces = 3 + yours. Here is how to decide:\n\n" +
      "• If YOU hold 1+ ace → combined = 4 aces. Bid 5NT to ask for kings and explore grand slam.\n" +
      `• If you hold 0 aces → combined = 3. Bid 6${suitSym} for small slam (missing 1 ace).\n\n` +
      `The suggested bid (5NT) is the aggressive path. Change to 6${suitSym} if you hold 0 aces.`,
    handAnalysis: analysis,
    whatYourBidTellsPartner: "Asking for kings — grand slam possible.",
    expectedResponses: [
      { partnerBid: "6♣", meaning: "0 or 4 kings" },
      { partnerBid: "6♦", meaning: "1 king" },
      { partnerBid: "6♥", meaning: "2 kings" },
      { partnerBid: "6♠", meaning: "3 kings" },
    ],
    confidence: "high",
    note: `Change to 6${suitSym} (small slam) if you hold 0 aces. ${kingsChart}`,
  };
}

function getGerberFollowUp(
  hand: Hand,
  partnerReply: string,
): BidRecommendation {
  const analysis = analyzeHand(hand);
  const aceCount = decodeAceCount(partnerReply, true);

  if (aceCount === null) {
    return {
      bid: "Pass",
      category: "Gerber: Unrecognized Response — Sign Off",
      reasoning: `Partner's bid (${partnerReply}) was not a standard Gerber response (4♦=0/4 aces, 4♥=1, 4♠=2, 4NT=3). This may be due to competition or a non-standard reply. Pass to sign off safely.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "Sign off — cannot determine ace count from partner's bid.",
      expectedResponses: [],
      confidence: "low",
      note: "Standard Gerber responses: 4♦=0/4 aces, 4♥=1 ace, 4♠=2 aces, 4NT=3 aces.",
    };
  }

  if (aceCount <= 1) {
    return {
      bid: "4NT",
      category: "Gerber: Missing Aces — Sign Off",
      reasoning: `Partner showed ${aceCount === 0 ? "0 or 4" : "1"} ace. ${aceCount === 0 ? "With the ambiguous 0/4 ace response, sign off at 4NT unless you hold all 4 aces yourself." : "Too many aces missing for slam."} Bid 4NT to sign off in game.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Sign off — slam not available.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  if (aceCount === 2) {
    return {
      bid: analysis.tp >= 33 ? "6NT" : "4NT",
      category: "Gerber: 2 Aces",
      reasoning: `Partner has 2 aces. ${analysis.tp >= 33 ? "Bid 6NT (small slam)." : "Combined aces and points may fall short of slam. Sign off at 4NT (game in NT)."}`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Slam decision.",
      expectedResponses: [],
      confidence: "medium",
    };
  }

  return {
    bid: analysis.tp >= 35 ? "5♣ (Ask Kings)" : "6NT",
    category: "Gerber: 3+ Aces",
    reasoning: `Partner has 3 (or 4) aces. ${analysis.tp >= 35 ? "Bid 5♣ to ask for kings — grand slam possible." : "Bid 6NT (small slam)."}`,
    handAnalysis: analysis,
    whatYourBidTellsPartner: "Slam exploration.",
    expectedResponses:
      analysis.tp >= 35
        ? [
            { partnerBid: "5♦", meaning: "0 or 4 kings" },
            { partnerBid: "5♥", meaning: "1 king" },
            { partnerBid: "5♠", meaning: "2 kings" },
            { partnerBid: "5NT", meaning: "3 kings" },
          ]
        : [],
    confidence: "high",
    note: "Only ask for kings (5♣) if you know you have grand slam strength. Use Gerber only over NT contracts.",
  };
}

function getKingsFollowUp(
  hand: Hand,
  partnerReply: string,
  wasGerber: boolean,
  agreedSuit?: string,
): BidRecommendation {
  const analysis = analyzeHand(hand);
  const kingCount = decodeKingCount(partnerReply, wasGerber);

  const suitSym = agreedSuit
    ? agreedSuit.includes("♠")
      ? "♠"
      : agreedSuit.includes("♥")
        ? "♥"
        : agreedSuit.includes("♦")
          ? "♦"
          : "♣"
    : "♠";

  if (kingCount === null) {
    // Partner's bid was not a recognized kings response. Sign off at small slam.
    return {
      bid: `6${suitSym}`,
      category: "Kings Follow-Up: Unrecognized Response — Sign Off",
      reasoning: `Partner's bid (${partnerReply}) was not a recognized kings response (${wasGerber ? "5♦=0/4, 5♥=1, 5♠=2, 5NT=3" : "6♣=0/4, 6♦=1, 6♥=2, 6♠=3"}). Signing off at 6${suitSym} (small slam) to be safe.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "Small slam — cannot determine exact king count.",
      expectedResponses: [],
      confidence: "low",
    };
  }

  if (kingCount >= 3) {
    return {
      bid: `7${suitSym}`,
      category: "Grand Slam!",
      reasoning: `Partner has 3 kings. With all aces and 3 kings accounted for, bid the grand slam (7${suitSym}).`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Grand slam — all key cards accounted for.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  // 6♣ = 0 or 4 kings (same ambiguity as 5♣ for aces)
  const kingNote =
    kingCount === 0
      ? `6♣ = 0 OR 4 kings. If you hold kings yourself, partner has 0. With ${hand.hcp} HCP you likely hold at least 1 king — confirm before deciding grand slam.`
      : undefined;

  return {
    bid: `6${suitSym}`,
    category: `Small Slam (${kingCount} King${kingCount !== 1 ? "s" : ""} — Grand Slam Not Warranted)`,
    reasoning: `Partner has ${kingCount === 0 ? "0 or 4" : kingCount} king${kingCount !== 1 ? "s" : ""}. ${kingCount === 0 ? "Not enough confirmed kings for a grand slam" : "Not enough kings for a grand slam"} — settle for the small slam (6${suitSym}).`,
    handAnalysis: analysis,
    whatYourBidTellsPartner: "Small slam — grand slam not warranted.",
    expectedResponses: [],
    confidence: "high",
    note: kingNote,
  };
}

function getGrandSlamForceResponse(
  hand: Hand,
  agreedSuit: string,
): BidRecommendation {
  const analysis = analyzeHand(hand);
  const suit = agreedSuit.includes("♠")
    ? "spades"
    : agreedSuit.includes("♥")
      ? "hearts"
      : agreedSuit.includes("♦")
        ? "diamonds"
        : "clubs";
  const suitLen = hand[suit as keyof Hand] as number;
  const suitSym = suitSymbol(suit);

  // Check if HCP is consistent with having 2 of 3 top honors (A=4, K=3, Q=2)
  // A+K = 7 HCP in that suit, A+Q = 6, K+Q = 5 — use 7 as a rough proxy
  const hasTwoOfTopThree = hand.hcp >= 7 && suitLen >= 5;

  return {
    bid: hasTwoOfTopThree ? `7${suitSym}` : `6${suitSym}`,
    category: "Grand Slam Force Response",
    reasoning: `Partner jumped to 5NT as the Grand Slam Force. ${hasTwoOfTopThree ? "With 2 of the top 3 trump honors (A, K, Q), bid the grand slam (7)." : "Without 2 of the top 3 trump honors, sign off at the 6-level."}`,
    handAnalysis: analysis,
    whatYourBidTellsPartner: hasTwoOfTopThree
      ? "2 of top 3 trump honors — grand slam confirmed."
      : "Less than 2 of top 3 honors — small slam only.",
    expectedResponses: [],
    confidence: "medium",
    note: "Grand Slam Force (5NT jump without prior 4NT) asks specifically for 2 of 3 top trump honors (A, K, Q). This is different from Blackwood.",
  };
}

// ─── Main Router ─────────────────────────────────────────────────────────────

function getRecommendationRaw(
  hand: Hand,
  context: AuctionContext,
): BidRecommendation {
  const vul = context.vulnerability ?? "none";

  switch (context.situation) {
    case "opening":
      return getOpeningBid(hand, vul);

    case "responding-1nt":
      return getResponseToOneNT(hand);

    case "responding-2nt":
      return getResponseToTwoNT(hand);

    case "responding-3nt-opening":
      return getResponseTo3NTOpening(hand);

    case "responding-suit":
      return getResponseToSuit(hand, context.partnerBid ?? "1♠");

    case "responding-2c":
      return getResponseToTwoClub(hand);

    case "responding-weak2":
      return getResponseToWeak2(hand, context.partnerBid ?? "2♥");

    case "responding-preempt":
      return getResponseToPreempt(hand, context.partnerBid ?? "3♥");

    case "overcalling":
      return getOvercall(hand, context.rhoBid ?? "1♠", vul);

    case "negative-double":
      return getNegativeDouble(
        hand,
        context.myPreviousBid ?? "1♣",
        context.rhoBid ?? "1♠",
      );

    case "responding-to-simple-oc":
      return getResponseToSimpleOC(
        hand,
        context.partnerBid ?? "1♠",
        context.rhoBid,
      );

    case "responding-to-jump-oc":
      return getResponseToJumpOC(hand, context.partnerBid ?? "2♠");

    case "responding-to-double":
      return getResponseToDouble(hand, context.rhoBid ?? "1♠");

    case "responding-to-preempt-oc":
      return getResponseToPreemptOC(hand, context.partnerBid ?? "3♠");

    case "responding-to-1nt-oc":
      return getResponseTo1NTOvercall(hand);

    case "responding-to-michaels":
      return getResponseToMichaels(
        hand,
        context.lhoBid ?? context.rhoBid ?? "1♣",
        context.partnerBid ?? "2♣",
      );

    case "responding-to-unusual-2nt":
      return getResponseToUnusual2NT(hand);

    case "rebid-after-nt":
      return getRebidAfterNT(hand, context.partnerBid ?? "2NT");

    case "responder-nt-rebid":
      return getResponderNTRebid(
        hand,
        context.myPreviousBid ?? "2NT",
        context.partnerBid ?? "3♥",
      );

    case "rebid-after-suit":
      return getRebidAfterSuit(
        hand,
        context.myPreviousBid ?? "1♠",
        context.partnerBid ?? "2♠",
      );

    case "protective-rebid":
      return getProtectiveRebid(
        hand,
        context.myPreviousBid ?? "1♣",
        context.lhoBid,
      );

    case "respond-to-partner-invitation":
      return getRespondToPartnerInvitation(
        hand,
        context.myPreviousBid ?? "1♠",
        context.partnerBid ?? "3♥",
      );

    case "rebid-after-negative-double":
      return getRebidAfterNegativeDouble(
        hand,
        context.myPreviousBid ?? "1♣",
        context.rhoBid ?? "1♠",
      );

    case "jacoby-2nt-opener":
      return getJacoby2NTOpenerRebid(hand, context.myPreviousBid ?? "1♠");

    case "responding-suit-after-double":
      return getRespondingToSuitAfterDouble(hand, context.partnerBid ?? "1♠");

    case "stayman-response":
      return getStaymanFollowUp(hand, context.partnerBid ?? "2♦");

    case "stayman-opener-rebid":
      return getStaymanOpenerRebid(
        hand,
        context.myPreviousBid ?? "2♦",
        context.partnerBid ?? "2NT",
        context.wasTransferCompletion ?? false,
      );

    case "transfer-response":
      return getTransferFollowUp(hand, context.partnerBid ?? "2♥");

    case "minor-transfer-response":
      return getMinorTransferFollowUp(hand);

    case "blackwood-response":
      return getBlackwoodFollowUp(
        hand,
        context.partnerBid ?? "5♣",
        context.agreedSuit ?? "♠",
      );

    case "blackwood-ace-response":
      return getBlackwoodAceResponse(hand);

    case "blackwood-kings-response":
      return getBlackwoodKingsResponse(hand);

    case "gerber-response":
      return getGerberFollowUp(hand, context.partnerBid ?? "4♦");

    case "blackwood-kings":
      return getKingsFollowUp(
        hand,
        context.partnerBid ?? "6♣",
        false,
        context.agreedSuit,
      );

    case "grand-slam-force":
      return {
        bid: "7 of agreed suit or 7NT",
        category: "Grand Slam Force (5NT Jump)",
        reasoning:
          "A jump to 5NT (without prior 4NT Blackwood) is the Grand Slam Force — asking partner to bid 7 of the agreed suit with 2 of the top 3 trump honors, otherwise 6 of the suit.",
        handAnalysis: analyzeHand(hand),
        whatYourBidTellsPartner:
          "I have slam values — bid 7 if you hold 2 of the top 3 trump honors (A, K, Q).",
        expectedResponses: [
          { partnerBid: "7 of suit", meaning: "Has 2 of top 3 trump honors" },
          { partnerBid: "6 of suit", meaning: "Has fewer than 2 top honors" },
        ],
        confidence: "high",
        note: "The Grand Slam Force (5NT jump) is DIFFERENT from Blackwood 5NT (which asks for kings after 4NT ace inquiry).",
      };

    case "grand-slam-force-response":
      return getGrandSlamForceResponse(hand, context.agreedSuit ?? "♠");

    default:
      return {
        bid: "Pass",
        category: "Pass (Situation Not Recognized)",
        reasoning:
          "This auction reached a situation the advisor does not yet fully model. Passing is the safest action — consult the cheat sheet for detailed guidance on this sequence.",
        handAnalysis: analyzeHand(hand),
        whatYourBidTellsPartner: "",
        expectedResponses: [],
        confidence: "low",
      };
  }
}

// ─── Bid-level safety net ─────────────────────────────────────────────────────

/**
 * Extract ALL concrete bridge bids from a recommendation string that may
 * list alternatives like "2♥ or 3♥" or "4♣ / 4♦".
 */
function extractAllConcreteBids(bidStr: string): string[] {
  const parts = bidStr.split(/\s+or\s+|\s*\/\s*/);
  return parts
    .map((p) => {
      const t = p.trim();
      if (t === "Pass" || t === "Double" || t === "Redouble") return t;
      const m = t.match(/\d[♣♦♥♠]|\dNT/);
      return m ? m[0] : null;
    })
    .filter((b): b is string => b !== null);
}

/**
 * Returns the highest real bid currently in play, derived from the bids
 * already recorded in the AuctionContext (partner/lho/rho and my previous bid).
 * This is the minimum level that any new bid must exceed.
 */
function getBidFloorFromContext(context: AuctionContext): string | undefined {
  const rawBids = [
    context.partnerBid,
    context.rhoBid,
    context.lhoBid,
    context.myPreviousBid,
  ];
  const bids: string[] = [];
  for (const raw of rawBids) {
    if (!raw) continue;
    if (BID_ORDER.includes(raw)) {
      bids.push(raw);
    } else {
      // Handle bids with parenthetical labels like "2♠ (jump)" — extract the core bid
      const extracted = extractAllConcreteBids(raw).filter((b) =>
        BID_ORDER.includes(b),
      );
      bids.push(...extracted);
    }
  }
  if (bids.length === 0) return undefined;
  const maxIdx = Math.max(...bids.map((b) => BID_ORDER.indexOf(b)));
  return maxIdx >= 0 ? BID_ORDER[maxIdx] : undefined;
}

export function getRecommendation(
  hand: Hand,
  context: AuctionContext,
): BidRecommendation {
  const rec = getRecommendationRaw(hand, context);

  // Safety net: ensure the recommended bid is legal in the current auction.
  // Only fires when EVERY concrete bid in the recommendation is at or below the
  // current bid floor — this preserves "2♥ or 3♥" style recommendations where
  // at least one alternative is still valid.
  const floor = getBidFloorFromContext(context);
  if (floor) {
    const floorIdx = BID_ORDER.indexOf(floor);
    const concreteBids = extractAllConcreteBids(rec.bid).filter(
      (b) => b !== "Pass" && b !== "Double" && b !== "Redouble",
    );
    const tooLow = concreteBids.filter((b) => {
      const bidIdx = BID_ORDER.indexOf(b);
      return bidIdx >= 0 && bidIdx <= floorIdx;
    });
    const allTooLow =
      concreteBids.length > 0 && tooLow.length === concreteBids.length;

    if (allTooLow) {
      return {
        ...rec,
        bid: "Pass",
        category: "Pass (suggested bid below current auction level)",
        reasoning: `The suggested bid (${rec.bid}) would be at or below the current auction level (${floor}). Pass — the situation may be more complex than the advisor can handle; consult the cheat sheet.`,
        confidence: "low",
      };
    }

    // If SOME options are too low but at least one is valid, simplify to the highest valid bid.
    if (tooLow.length > 0 && tooLow.length < concreteBids.length) {
      const validBids = concreteBids.filter(
        (b) => BID_ORDER.indexOf(b) > floorIdx,
      );
      if (validBids.length > 0) {
        const bestBid = validBids[validBids.length - 1]; // highest valid bid
        return {
          ...rec,
          bid: bestBid,
          reasoning: `${rec.reasoning} (Note: the original suggestion included lower options that are no longer valid at this auction level; ${bestBid} is the best remaining option.)`,
          confidence: "medium" as const,
        };
      }
    }
  }

  return rec;
}

// ─── Auction State types ──────────────────────────────────────────────────────

/** Bidding order position: 1 = dealer/first to bid, 4 = last to bid in a round */
export type BiddingPosition = 1 | 2 | 3 | 4;
export type BidRound = Partial<Record<BiddingPosition, string>>;

/** External-facing auction model: what the UI sends instead of a hand-coded Situation */
export interface AuctionState {
  /** Position in the bidding order: 1 (dealer) through 4 */
  myPosition: BiddingPosition;
  /** Fully completed rounds (all 4 players bid, including my previous bids) */
  completedRounds: BidRound[];
  /** Current round — only the other players' bids before my turn */
  currentRound: BidRound;
  /** Optional override for Blackwood / GSF agreed suit when auto-derivation is ambiguous */
  agreedSuit?: string;
}

// ─── Position helpers ─────────────────────────────────────────────────────────

/** Bidding positions in clockwise order */
const POSITIONS: BiddingPosition[] = [1, 2, 3, 4];

export function getRelatives(position: BiddingPosition): {
  partner: BiddingPosition;
  lho: BiddingPosition;
  rho: BiddingPosition;
} {
  const idx = position - 1;
  return {
    partner: POSITIONS[(idx + 2) % 4],
    lho: POSITIONS[(idx + 1) % 4],
    rho: POSITIONS[(idx + 3) % 4],
  };
}

// ─── Bid ordering ─────────────────────────────────────────────────────────────

const BID_ORDER: string[] = [
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

/**
 * Returns the list of valid bids that may follow `lastBid` in a Bridge auction.
 * - Pass is always valid.
 * - Suit/NT bids must be strictly higher than `lastBid`.
 * - Double is valid after any suit/NT bid (not after Pass or Double/Redouble).
 * - Redouble is valid only immediately after a Double.
 */
export function getValidBidsAfter(lastBid: string | undefined): string[] {
  const result: string[] = ["Pass"];
  if (!lastBid || lastBid === "Pass") {
    result.push(...BID_ORDER, "Double");
    return result;
  }
  if (lastBid === "Double") {
    result.push(...BID_ORDER, "Redouble");
    return result;
  }
  if (lastBid === "Redouble") {
    result.push(...BID_ORDER);
    return result;
  }
  const idx = BID_ORDER.indexOf(lastBid);
  if (idx >= 0) {
    result.push(...BID_ORDER.slice(idx + 1), "Double");
  } else {
    result.push(...BID_ORDER, "Double");
  }
  return result;
}

// ─── Bid meaning lookup ───────────────────────────────────────────────────────

/**
 * Returns a short plain-English interpretation of what `bid` likely means,
 * given who made it relative to the user.
 *
 * Pass `prevHighBid` (the most recent non-pass bid before this one) to unlock
 * context-aware interpretations for conventional bids (e.g. Stayman, Jacoby
 * Transfers) that have a different meaning depending on what was bid before.
 */
export function getBidMeaning(
  bid: string,
  relationship: "partner" | "lho" | "rho",
  prevHighBid?: string,
): string {
  const isPartner = relationship === "partner";
  const isOpponent = relationship === "lho" || relationship === "rho";

  switch (bid) {
    case "Pass":
      return "No bid — shows either a weak hand or a desire to defend.";

    case "1♣":
      return isPartner
        ? "Opening 1♣: typically 12–21 pts, often 3+ clubs or a balanced hand with no 5-card major."
        : "Opening 1♣ from opponent: 12–21 pts, natural clubs or balanced.";
    case "1♦":
      return isPartner
        ? "Opening 1♦: typically 12–21 pts, 4+ diamonds or the longer minor in a balanced hand."
        : "Opening 1♦ from opponent: 12–21 pts, natural diamonds.";
    case "1♥":
      return isPartner
        ? "Opening 1♥: 12–21 pts, exactly 5+ hearts (SAYC 5-card major)."
        : "Opening 1♥ from opponent: 12–21 pts, 5+ hearts.";
    case "1♠":
      return isPartner
        ? "Opening 1♠: 12–21 pts, exactly 5+ spades (SAYC 5-card major)."
        : "Opening 1♠ from opponent: 12–21 pts, 5+ spades.";
    case "1NT":
      return isPartner
        ? "Opening 1NT: balanced hand, exactly 15–17 HCP, no singleton/void."
        : "1NT from opponent: balanced 15–18 HCP (overcall range) with a stopper in partner's suit.";

    case "2♣":
      // Stayman after 1NT or 2NT
      if (prevHighBid === "1NT" || prevHighBid === "2NT") {
        return isPartner
          ? `Stayman — asking if you (opener of ${prevHighBid}) hold a 4-card major. Respond: 2♥ (hearts), 2♠ (spades, no hearts), or 2♦ (no 4-card major).`
          : `Stayman over your partner's ${prevHighBid} — the opponent is asking opener for a 4-card major.`;
      }
      return isPartner
        ? "2♣ opening: strong artificial forcing bid — 22+ HCP balanced OR 22+ total pts unbalanced. Demands a response."
        : isOpponent
          ? "2♣ from opponent: could be a natural club bid OR the Michaels cuebid (over your 1♣ opening) showing both majors."
          : "2♣: artificial strong opening (22+ pts) or Michaels cuebid showing both majors.";
    case "2♦":
      // Jacoby Transfer to hearts after 1NT/2NT
      if (prevHighBid === "1NT" || prevHighBid === "2NT") {
        return isPartner
          ? `Jacoby Transfer to hearts — partner is asking you (${prevHighBid} opener) to bid 2♥, transferring to their heart suit.`
          : `Transfer to hearts over ${prevHighBid} — the opponent holds 5+ hearts and is asking opener to bid 2♥.`;
      }
      // Artificial 2♦ denial after Stayman
      if (prevHighBid === "2♣") {
        return isPartner
          ? "Stayman denial — no 4-card major. Partner will now know there is no major-suit fit."
          : "Stayman denial from opponent — no 4-card major.";
      }
      return isPartner
        ? "Weak 2♦: 5–10 HCP, 6-card diamond suit. Pre-emptive — limits hand and blocks opponents."
        : "2♦ from opponent: likely a Weak 2 (5–10 HCP, 6 diamonds) or possibly a convention.";
    case "2♥":
      // Jacoby Transfer to spades after 1NT/2NT
      if (prevHighBid === "1NT" || prevHighBid === "2NT") {
        return isPartner
          ? `Jacoby Transfer to spades — partner is asking you (${prevHighBid} opener) to bid 2♠, transferring to their spade suit.`
          : `Transfer to spades over ${prevHighBid} — the opponent holds 5+ spades.`;
      }
      return isPartner
        ? "Weak 2♥: 5–10 HCP, 6-card heart suit. Pre-emptive opening."
        : "2♥ from opponent: Weak 2 bid (5–10 HCP, 6 hearts). Disrupts your bidding space.";
    case "2♠":
      // Minor-suit transfer after 1NT
      if (prevHighBid === "1NT") {
        return isPartner
          ? "Minor-suit transfer — partner holds 6+ clubs or diamonds and is asking you to bid 3♣ (they will pass for clubs or correct to 3♦ for diamonds)."
          : "Minor-suit transfer over 1NT — the opponent holds a long minor.";
      }
      return isPartner
        ? "Weak 2♠: 5–10 HCP, 6-card spade suit. Pre-emptive opening."
        : "2♠ from opponent: Weak 2 bid (5–10 HCP, 6 spades).";
    case "2NT":
      if (isPartner) {
        // If a suit opening came before this 2NT, it's a response (13-15 HCP), not a 2NT opening
        if (prevHighBid && /^1[♣♦♥♠]$/.test(prevHighBid)) {
          return "2NT response to partner's opening: 13–15 HCP, balanced. Game-forcing — showing enough for game opposite a minimum opener.";
        }
        return "2NT opening: balanced 20–21 HCP. Responds similarly to 1NT but at a higher level.";
      }
      // Opponent's 2NT
      if (prevHighBid && /^1[♣♦♥♠]$/.test(prevHighBid)) {
        return "2NT response from opponent: 13–15 HCP, balanced (game-forcing).";
      }
      return "2NT from opponent: Unusual 2NT overcall — shows the two lowest unbid suits (usually both minors), 5-5 or better.";

    case "3♣":
    case "3♦":
    case "3♥":
    case "3♠":
      return isPartner
        ? `Pre-emptive ${bid} opening: 5–10 HCP, 7-card suit. Designed to crowd the opponents out of the auction.`
        : `Pre-emptive ${bid} from opponent: 7-card suit, 5–10 HCP. Blocking bid.`;
    case "3NT":
      return isPartner
        ? "3NT opening: balanced 25–27 HCP (SAYC). A very strong hand seeking game or slam."
        : "3NT from opponent: solid long minor suit (7+ cards) needing no outside help, or a very strong balanced hand.";

    case "4♣":
      return "4♣: likely Gerber convention — asks partner how many aces they hold. Responses: 4♦=0/4, 4♥=1, 4♠=2, 4NT=3.";
    case "4♦":
      return "4♦: likely a Gerber ace-response (0 or 4 aces if partner bid 4♣), or a natural pre-empt with long diamonds.";
    case "4♥":
      return isPartner
        ? "4♥: game bid in hearts. Strong hand with a fit in hearts, usually 5+ hearts and 10+ total pts combined."
        : "4♥ from opponent: game pre-empt, 8-card heart suit.";
    case "4♠":
      return isPartner
        ? "4♠: game bid in spades. Strong hand with a fit in spades."
        : "4♠ from opponent: game pre-empt, 8-card spade suit.";
    case "4NT":
      return "4NT: Blackwood — asks partner how many aces they hold. Responses: 5♣=0/4, 5♦=1, 5♥=2, 5♠=3. OR a quantitative invite to 6NT if no suit has been agreed.";

    case "5NT":
      return "5NT: either a Blackwood king ask (after 4NT ace ask) — responses 6♣=0/4, 6♦=1, 6♥=2, 6♠=3 — OR the Grand Slam Force if jumped to directly (asks partner to bid 7 with 2 of top 3 trump honors).";

    case "Double": {
      const prevIsSuit = !!prevHighBid && !prevHighBid.includes("NT");
      const prevLevel = prevHighBid ? parseInt(prevHighBid[0]) || 1 : 0;
      if (isPartner && prevIsSuit && prevLevel <= 2) {
        return "Negative Double (Sputnik): after an opponent overcalls a suit, this shows the unbid suits — often both majors when a minor was overcalled. NOT a penalty double. Shows 6+ pts and asks you to bid your best unbid suit.";
      }
      if (isPartner) {
        return "Takeout Double: partner is short in the opponent's bid suit (12+ pts) and asks you to bid your best unbid suit. With 16+, they may double then rebid their suit.";
      }
      if (prevIsSuit && prevLevel <= 2) {
        return "Likely a Takeout or Negative Double: after a low-level natural suit bid, this typically shows the unbid suits rather than penalty values. The doubler is asking their partner to pick the best unbid suit.";
      }
      if (prevHighBid?.includes("NT")) {
        return "Penalty Double of NT: opponent believes they can defeat the notrump contract — shows 14+ HCP with strong holdings. Generally, pass and collect the penalty.";
      }
      return "Penalty Double: opponent believes they can defeat the contract — shows strong holdings in the bid suit. Could also be lead-directing in slam auctions.";
    }
    case "Redouble":
      return "Redouble: shows 10+ HCP and suggests you/partner can make the doubled contract. Also used as SOS redouble to ask partner to pick another suit.";

    default:
      return `${bid}: a bid showing values in the named suit or notrump at that level.`;
  }
}

// ─── deriveSituation ─────────────────────────────────────────────────────────

const WEAK2_BIDS = ["2♦", "2♥", "2♠"];
const PREEMPT_BIDS = ["3♣", "3♦", "3♥", "3♠"];

/** Returns true if the bid is a non-pass, non-double/redouble natural bid */
function isRealBid(bid: string | undefined): bid is string {
  return (
    !!bid &&
    bid !== "Pass" &&
    bid !== "Double" &&
    bid !== "Redouble" &&
    bid !== "Interpret response"
  );
}

/** Returns true if this looks like a Stayman bid (2♣ after partner opened 1NT/2NT/3NT) */
function wasStayman(
  myBid: string,
  priorPartnerBid: string | undefined,
): boolean {
  return (
    myBid === "2♣" &&
    (priorPartnerBid === "1NT" ||
      priorPartnerBid === "2NT" ||
      priorPartnerBid === "3NT")
  );
}

/** Returns true if this looks like a Jacoby or minor-suit transfer */
function wasTransfer(
  myBid: string,
  priorPartnerBid: string | undefined,
): boolean {
  if (!priorPartnerBid) return false;
  const after1NT = priorPartnerBid === "1NT";
  const after2NT = priorPartnerBid === "2NT";
  const after3NT = priorPartnerBid === "3NT";
  if ((after1NT || after2NT || after3NT) && (myBid === "2♦" || myBid === "2♥"))
    return true;
  if (after1NT && myBid === "2♠") return true; // minor transfer
  return false;
}

/** Returns true if the last bid in BID_ORDER sense is a jump overcall */
function isJumpOvercall(partnerBid: string, rhoBid: string): boolean {
  const pIdx = BID_ORDER.indexOf(partnerBid);
  const rIdx = BID_ORDER.indexOf(rhoBid);
  if (pIdx < 0 || rIdx < 0) return false;

  // A jump overcall bids a suit at a level ABOVE its natural minimum.
  // The natural minimum is the lowest bid with the same suit suffix that
  // is strictly above rhoBid.  e.g. for "1♥" over "1♣": minimum heart
  // overcall is "1♥" (index 2); bidding exactly "1♥" is NOT a jump.
  // For "2♥" over "1♣": min is still "1♥" (index 2); bidding "2♥"
  // (index 7) IS a jump.
  const suitSuffix = partnerBid.slice(1); // "♥", "♠", "♦", "♣", "NT"
  const minOvercallIdx = BID_ORDER.findIndex(
    (bid, i) => i > rIdx && bid.endsWith(suitSuffix),
  );
  if (minOvercallIdx < 0) return false;

  return pIdx > minOvercallIdx;
}

/**
 * Derives the AuctionContext (including Situation) from an AuctionState.
 * This replaces the manual Situation dropdown.
 */
function deriveSituationCore(
  state: AuctionState,
  vulnerability: Vulnerability = "none",
): AuctionContext {
  const { myPosition, completedRounds, currentRound, agreedSuit } = state;
  const { partner, lho, rho } = getRelatives(myPosition);
  const vul = vulnerability;

  // ── Flatten timeline into per-player last bids ──────────────────────────────

  const myBids = completedRounds.map((r) => r[myPosition]).filter(isRealBid);
  const myLastBid = myBids[myBids.length - 1];

  // Most recent bid from each player across all completed rounds + current round
  const latestBid = (pos: BiddingPosition): string | undefined => {
    const current = currentRound[pos];
    if (current && current !== "Pass" && isRealBid(current)) return current;
    if (current === "Double" || current === "Redouble") return current;
    // Walk back through completed rounds
    for (let i = completedRounds.length - 1; i >= 0; i--) {
      const b = completedRounds[i][pos];
      if (b && b !== "Pass" && isRealBid(b)) return b;
      if (b === "Double" || b === "Redouble") return b;
    }
    return undefined;
  };

  const partnerBid = latestBid(partner);
  const rhoBid = latestBid(rho);
  const lhoBid = latestBid(lho);

  // The bid by each player in the round just before the current one (for rebid context)
  const prevRound = completedRounds[completedRounds.length - 1];
  const prevPartnerBid = prevRound?.[partner];
  // The partner's bid from TWO rounds back (their opening, before my rebid)

  // ── Case: I've already bid (rebid / convention follow-up situations) ─────────

  if (myLastBid) {
    // My most recent bid determines the situation
    const prevPartnerResponse = prevPartnerBid;

    // Convention follow-ups — what did I bid LAST?
    if (myLastBid === "4NT") {
      return {
        situation: "blackwood-response",
        partnerBid,
        vulnerability: vul,
        agreedSuit,
      };
    }
    if (myLastBid === "4♣") {
      // Gerber is only valid in uncontested NT auctions (SAYC).
      // With competition (rhoBid / lhoBid) or if partner never bid NT, treat 4♣ as natural.
      const partnerBidNT = completedRounds
        .map((r) => r[partner])
        .filter(isRealBid)
        .some((b) => b.includes("NT"));
      const hasInterference = !!(rhoBid || lhoBid);
      if (!hasInterference && partnerBidNT) {
        return { situation: "gerber-response", partnerBid, vulnerability: vul };
      }
      // Otherwise fall through to regular rebid handling
    }
    if (myLastBid === "5NT") {
      // Could be blackwood-kings OR grand-slam-force based on whether prior bid was 4NT
      const priorMyBid = myBids[myBids.length - 2];
      if (priorMyBid === "4NT") {
        return { situation: "blackwood-kings", partnerBid, vulnerability: vul };
      }
      return { situation: "grand-slam-force", vulnerability: vul };
    }

    // Find what partner opened (their bid before I first responded)
    const myFirstBid = myBids[0];
    const partnerBidBeforeMe = (() => {
      // Find the bid partner made BEFORE my first real bid.
      // If partner's seat number is lower than mine, they bid before me in the
      // same round — use the same-round entry.
      // If partner's seat number is higher, they bid AFTER me in the same round,
      // so their "preceding" bid is actually from the previous round.
      for (let i = 0; i < completedRounds.length; i++) {
        if (completedRounds[i][myPosition] === myFirstBid) {
          if (partner < myPosition) {
            return (
              completedRounds[i][partner] ?? completedRounds[i - 1]?.[partner]
            );
          } else {
            return (
              completedRounds[i - 1]?.[partner] ?? completedRounds[i][partner]
            );
          }
        }
      }
      return undefined;
    })();

    if (wasStayman(myFirstBid ?? "", partnerBidBeforeMe)) {
      return { situation: "stayman-response", partnerBid, vulnerability: vul };
    }
    if (wasTransfer(myFirstBid ?? "", partnerBidBeforeMe)) {
      const transferred = myFirstBid === "2♠" ? "minor" : "major";
      if (transferred === "minor") {
        return {
          situation: "minor-transfer-response",
          partnerBid,
          vulnerability: vul,
        };
      }
      return { situation: "transfer-response", partnerBid, vulnerability: vul };
    }

    // Opener/responder rebids — any NT bid goes to the NT rebid handler.
    // EXCEPTION: if partner opened a suit *before* my NT response, partner's current
    // bid is a natural suit showing — route to the responder-specific handler.
    if (myLastBid.endsWith("NT")) {
      // Detect if partner had a prior suit bid (meaning I'm the responder, not opener)
      const partnerOpenedSuitBeforeMyNT = completedRounds
        .slice(0, completedRounds.length - 1)
        .some((r) => {
          const b = r[partner];
          return b && b !== "Pass" && !b.endsWith("NT");
        });
      if (partnerOpenedSuitBeforeMyNT) {
        return {
          situation: "responder-nt-rebid",
          myPreviousBid: myLastBid,
          partnerBid,
          vulnerability: vul,
        };
      }
      return {
        situation: "rebid-after-nt",
        myPreviousBid: myLastBid,
        partnerBid,
        vulnerability: vul,
      };
    }

    // Partner bid 4NT (Blackwood) after a suit was established — respond with ace count.
    // Exception: if my last bid was NT, treat it as quantitative (handled by rebid-after-nt above).
    if (partnerBid === "4NT") {
      return { situation: "blackwood-ace-response", vulnerability: vul };
    }

    // Partner bid 5NT (Blackwood kings ask) after I showed aces — respond with king count.
    if (partnerBid === "5NT") {
      return { situation: "blackwood-kings-response", vulnerability: vul };
    }

    // 1NT (or 2NT) opener continuing after a Stayman/Transfer response they already made.
    // e.g. 1NT → 2♣(Stayman) → opener bid 2♥ → partner bid 2NT → opener needs to act.
    if (myFirstBid?.endsWith("NT") && myBids.length >= 2) {
      // Detect whether the opener's second bid was a transfer completion.
      // Find what partner bid in the round where opener made their second bid — if it
      // was a transfer bid (2♦ → hearts, 2♥ → spades) then flag it so the handler
      // knows to offer suit-game preference rather than the Stayman "no fit" logic.
      const mySecondBid = myBids[1];
      const wasTransferCompletion = (() => {
        for (let i = 0; i < completedRounds.length; i++) {
          if (completedRounds[i][myPosition] === mySecondBid) {
            const promptBid =
              partner < myPosition
                ? completedRounds[i][partner]
                : completedRounds[i - 1]?.[partner];
            return promptBid === "2♦" || promptBid === "2♥";
          }
        }
        return false;
      })();
      return {
        situation: "stayman-opener-rebid",
        myPreviousBid: myLastBid,
        partnerBid,
        vulnerability: vul,
        wasTransferCompletion,
      };
    }
    if (
      prevPartnerResponse === "2NT" &&
      (myLastBid === "1♥" || myLastBid === "1♠")
    ) {
      return {
        situation: "jacoby-2nt-opener",
        myPreviousBid: myLastBid,
        vulnerability: vul,
      };
    }
    if (prevPartnerBid === "Double" || prevPartnerResponse === "Double") {
      const overcall = rhoBid;
      return {
        situation: "rebid-after-negative-double",
        myPreviousBid: myLastBid,
        rhoBid: overcall,
        vulnerability: vul,
      };
    }

    // Detect when partner is rebidding their own previously-shown suit as an invitation.
    // Example: 1♦-1♥-2♦-3♥ — partner bid "1♥" in round 1, now jumps to "3♥" (a jump of 2
    // levels, skipping past 2♥).  This is an invitational jump, NOT a new suit.
    // The tell: partner's current bid is the same suit they bid earlier, BUT at a level
    // more than 1 higher than that earlier bid.
    if (
      partnerBid &&
      partnerBid !== "Pass" &&
      partnerBid !== "Double" &&
      !partnerBid.endsWith("NT")
    ) {
      const partnerSuitSym = partnerBid.slice(1); // "♥" from "3♥"
      const partnerBidLevel = parseInt(partnerBid[0]);
      let partnerPrevSuitLevel = -1;
      for (let i = 0; i < completedRounds.length - 1; i++) {
        const bid = completedRounds[i][partner];
        if (
          bid &&
          bid !== "Pass" &&
          bid !== "Double" &&
          !bid.endsWith("NT") &&
          bid.includes(partnerSuitSym)
        ) {
          partnerPrevSuitLevel = parseInt(bid[0]);
          break;
        }
      }
      if (
        partnerPrevSuitLevel >= 0 &&
        partnerBidLevel > partnerPrevSuitLevel + 1
      ) {
        return {
          situation: "respond-to-partner-invitation",
          myPreviousBid: myLastBid,
          partnerBid,
          vulnerability: vul,
        };
      }
    }

    // ── Protective / balancing position ────────────────────────────────────────
    // Partner has never bid (only passed) — this is NOT a normal opener rebid.
    // The opener is in the "protective seat": LHO overcalled, partner passed,
    // RHO passed, and the auction comes back to the opener.  Routing to
    // rebid-after-suit with a fake partnerBid default produces nonsensical advice.
    if (!partnerBid) {
      return {
        situation: "protective-rebid",
        myPreviousBid: myLastBid,
        // Use whichever opponent bid — could be LHO (typical overcall) or RHO
        // (balancing bid after two passes, e.g. 1♥-Pass-Pass-2♦-back to opener).
        lhoBid: lhoBid ?? rhoBid ?? undefined,
        vulnerability: vul,
      };
    }

    return {
      situation: "rebid-after-suit",
      myPreviousBid: myLastBid,
      partnerBid,
      vulnerability: vul,
    };
  }

  // Any bid (including Double/Redouble) counts as non-pass for opening detection
  const anyNonPass =
    [partnerBid, rhoBid, lhoBid].some((b) => b && b !== "Pass") ||
    completedRounds.some((r) =>
      Object.values(r).some((b) => b && b !== "Pass"),
    );

  if (!anyNonPass) {
    return { situation: "opening", vulnerability: vul };
  }

  // ── Case: Grand Slam Force response (partner jumped to 5NT) ────────────────

  if (partnerBid === "5NT") {
    return {
      situation: "grand-slam-force-response",
      vulnerability: vul,
      agreedSuit: agreedSuit ?? "♠",
    };
  }

  // ── Determine who opened the auction ─────────────────────────────────────
  // For completed rounds: iterate POSITIONS to find first non-pass bid
  // For current round: use bid level (lower bid = earlier in auction) since
  //   the display order doesn't match auction sequence

  let auctionOpenedByPartner = false;
  let auctionOpenedByOpponent = false;
  let firstOpenerSeat: BiddingPosition | undefined;
  let firstOpenerBid: string | undefined;

  // Check completed rounds first
  outerLoop: for (const round of completedRounds) {
    for (const seat of POSITIONS) {
      const bid = round[seat];
      if (bid && bid !== "Pass") {
        firstOpenerSeat = seat;
        firstOpenerBid = bid;
        if (seat === partner) auctionOpenedByPartner = true;
        else auctionOpenedByOpponent = true;
        break outerLoop;
      }
    }
  }

  // If no completed rounds, check current round using bid levels
  if (!auctionOpenedByPartner && !auctionOpenedByOpponent) {
    const partnerBidIdx = isRealBid(partnerBid)
      ? BID_ORDER.indexOf(partnerBid!)
      : 999;
    const rhoBidIdx = isRealBid(rhoBid) ? BID_ORDER.indexOf(rhoBid!) : 999;
    const lhoBidIdx = isRealBid(lhoBid) ? BID_ORDER.indexOf(lhoBid!) : 999;

    if (
      isRealBid(partnerBid) &&
      partnerBidIdx < rhoBidIdx &&
      partnerBidIdx < lhoBidIdx
    ) {
      auctionOpenedByPartner = true;
      firstOpenerSeat = partner;
      firstOpenerBid = partnerBid;
    } else if (isRealBid(rhoBid) || isRealBid(lhoBid)) {
      auctionOpenedByOpponent = true;
      if (isRealBid(rhoBid) && (!isRealBid(lhoBid) || rhoBidIdx <= lhoBidIdx)) {
        firstOpenerSeat = rho;
        firstOpenerBid = rhoBid;
      } else {
        firstOpenerSeat = lho;
        firstOpenerBid = lhoBid;
      }
    }
  }

  const isPartnerFirst = auctionOpenedByPartner;
  const isOpponentFirst = auctionOpenedByOpponent;

  // ── Partner opened ──────────────────────────────────────────────────────────

  if (isPartnerFirst) {
    const partnerOpenBid = firstOpenerBid ?? partnerBid ?? "";

    // Did an opponent make ANY bid after partner (including Double)?
    const opponentActed =
      (rhoBid && rhoBid !== "Pass") || (lhoBid && lhoBid !== "Pass");

    if (!opponentActed) {
      // Clean response to partner's opening
      if (partnerOpenBid === "1NT")
        return { situation: "responding-1nt", partnerBid, vulnerability: vul };
      if (partnerOpenBid === "2NT")
        return { situation: "responding-2nt", partnerBid, vulnerability: vul };
      if (partnerOpenBid === "3NT")
        return {
          situation: "responding-3nt-opening",
          partnerBid,
          vulnerability: vul,
        };
      if (partnerOpenBid === "2♣")
        return { situation: "responding-2c", partnerBid, vulnerability: vul };
      if (WEAK2_BIDS.includes(partnerOpenBid))
        return {
          situation: "responding-weak2",
          partnerBid,
          vulnerability: vul,
        };
      if (PREEMPT_BIDS.includes(partnerOpenBid))
        return {
          situation: "responding-preempt",
          partnerBid,
          vulnerability: vul,
        };
      if (["1♣", "1♦", "1♥", "1♠"].includes(partnerOpenBid)) {
        return { situation: "responding-suit", partnerBid, vulnerability: vul };
      }
    }

    // Opponent intervened after partner
    const opponentBid = rhoBid ?? lhoBid;

    if (opponentBid === "Double") {
      // Partner opened, opponent doubled → Jordan 2NT territory
      return {
        situation: "responding-suit-after-double",
        partnerBid,
        rhoBid: opponentBid,
        vulnerability: vul,
      };
    }
    if (
      isRealBid(opponentBid) &&
      ["1♣", "1♦", "1♥", "1♠"].includes(partnerOpenBid)
    ) {
      // Partner opened 1-of-suit, opponent overcalled → negative double territory
      return {
        situation: "negative-double",
        myPreviousBid: partnerOpenBid,
        rhoBid: opponentBid,
        vulnerability: vul,
      };
    }
    // Partner opened pre-empt or 2, opponent bid → just respond to partner
    if (partnerOpenBid === "1NT")
      return { situation: "responding-1nt", partnerBid, vulnerability: vul };
    if (partnerOpenBid === "2♣")
      return { situation: "responding-2c", partnerBid, vulnerability: vul };
    if (partnerOpenBid === "2NT")
      return { situation: "responding-2nt", partnerBid, vulnerability: vul };
    if (partnerOpenBid === "3NT")
      return {
        situation: "responding-3nt-opening",
        partnerBid,
        vulnerability: vul,
      };
    if (WEAK2_BIDS.includes(partnerOpenBid))
      return { situation: "responding-weak2", partnerBid, vulnerability: vul };
    if (PREEMPT_BIDS.includes(partnerOpenBid))
      return {
        situation: "responding-preempt",
        partnerBid,
        vulnerability: vul,
      };
    return { situation: "responding-suit", partnerBid, vulnerability: vul };
  }

  // ── Opponent opened / bid first ─────────────────────────────────────────────

  if (isOpponentFirst) {
    const opponentOpenBid = firstOpenerBid ?? rhoBid ?? lhoBid ?? "";
    const effectiveRhoBid =
      firstOpenerSeat === rho ? opponentOpenBid : (rhoBid ?? opponentOpenBid);

    // I haven't bid yet — what did partner do?
    if (!partnerBid || partnerBid === "Pass") {
      // Partner passed/hasn't bid — I need to decide whether/how to compete
      return {
        situation: "overcalling",
        rhoBid: effectiveRhoBid,
        vulnerability: vul,
      };
    }

    // Partner has bid after opponent — I'm responding to partner's action
    if (partnerBid === "Double") {
      return {
        situation: "responding-to-double",
        rhoBid: effectiveRhoBid,
        vulnerability: vul,
      };
    }

    // Detect Michaels (partner cuebid opponent's suit)
    if (
      partnerBid === opponentOpenBid ||
      partnerBid === `2${opponentOpenBid.slice(1)}`
    ) {
      return {
        situation: "responding-to-michaels",
        lhoBid: opponentOpenBid,
        partnerBid,
        vulnerability: vul,
      };
    }

    // Detect Unusual 2NT
    if (partnerBid === "2NT") {
      return {
        situation: "responding-to-unusual-2nt",
        rhoBid: effectiveRhoBid,
        vulnerability: vul,
      };
    }

    // Partner overcalled
    if (partnerBid === "1NT") {
      return {
        situation: "responding-to-1nt-oc",
        rhoBid: effectiveRhoBid,
        vulnerability: vul,
      };
    }

    // Jump or simple overcall?
    if (isJumpOvercall(partnerBid, effectiveRhoBid)) {
      return {
        situation: "responding-to-jump-oc",
        partnerBid,
        rhoBid: effectiveRhoBid,
        vulnerability: vul,
      };
    }
    if (["3♣", "3♦", "3♥", "3♠", "4♣", "4♦", "4♥", "4♠"].includes(partnerBid)) {
      return {
        situation: "responding-to-preempt-oc",
        partnerBid,
        vulnerability: vul,
      };
    }
    return {
      situation: "responding-to-simple-oc",
      partnerBid,
      rhoBid: effectiveRhoBid,
      vulnerability: vul,
    };
  }

  // Fallback
  return { situation: "opening", vulnerability: vul };
}

/**
 * Public entry point for auction situation derivation.
 * Always enriches the context with rhoBid and lhoBid (from the full auction
 * state) so that getBidFloorFromContext can compute the correct bid floor
 * even when the internal routing omits opponent bids from the returned context.
 */
export function deriveSituation(
  state: AuctionState,
  vulnerability: Vulnerability = "none",
): AuctionContext {
  const ctx = deriveSituationCore(state, vulnerability);

  // Compute opponent bids and the caller's own last bid directly from the auction
  // state so that getBidFloorFromContext always has the full picture.
  const { myPosition, completedRounds, currentRound } = state;
  const { partner, lho, rho } = getRelatives(myPosition);

  const stdBids = new Set(["Pass", "Double", "Redouble", "Interpret response"]);
  const latestNonPass = (pos: BiddingPosition): string | undefined => {
    const c = currentRound[pos];
    if (c && !stdBids.has(c)) return c;
    for (let i = completedRounds.length - 1; i >= 0; i--) {
      const b = completedRounds[i][pos];
      if (b && !stdBids.has(b)) return b;
    }
    return undefined;
  };

  // My own last real bid (needed for floor calculation when context omits myPreviousBid)
  const myLastBid = completedRounds
    .map((r) => r[myPosition])
    .filter((b): b is string => !!b && !stdBids.has(b))
    .slice(-1)[0];

  return {
    ...ctx,
    partnerBid: latestNonPass(partner) ?? ctx.partnerBid,
    rhoBid: latestNonPass(rho) ?? ctx.rhoBid,
    lhoBid: latestNonPass(lho) ?? ctx.lhoBid,
    myPreviousBid: ctx.myPreviousBid ?? myLastBid,
  };
}

// ─── Final contract detection ─────────────────────────────────────────────────

/**
 * Determines whether bidding is complete (3 consecutive passes) and what the
 * final contract is. Inputs remain editable so this recomputes reactively.
 */
export function getFinalContractInfo(
  completedRounds: BidRound[],
  currentRound: BidRound,
  myPosition: BiddingPosition,
): { isComplete: boolean; finalContract: string | undefined } {
  const allBids: string[] = [];

  // Flatten completed rounds in position order 1→4
  for (const round of completedRounds) {
    for (const pos of POSITIONS) {
      allBids.push(round[pos] ?? "Pass");
    }
  }

  // Add current-round bids (only positions before me, only if explicitly entered)
  for (let p = 1; p < myPosition; p++) {
    const bid = currentRound[p as BiddingPosition];
    if (bid !== undefined) {
      allBids.push(bid);
    }
  }

  // Determine the last real bid (the final contract candidate)
  let finalContract: string | undefined;
  for (let i = allBids.length - 1; i >= 0; i--) {
    const b = allBids[i];
    if (b !== "Pass" && b !== "Double" && b !== "Redouble") {
      finalContract = b;
      break;
    }
  }

  const isComplete =
    allBids.length >= 3 &&
    allBids.slice(-3).every((b) => b === "Pass") &&
    // Only "bidding complete" when a real bid was made before the passes
    // (or all 4 players opened with a pass — a full passed-out round).
    (finalContract !== undefined || allBids.length >= 4);

  return { isComplete, finalContract };
}
