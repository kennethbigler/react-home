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
  /**
   * Optional: does the player hold a stopper in the opponent's suit?
   * A stopper is A, Kx, Qxx, or Jxxx in the opponent's suit.
   * Shown in HandInput when there is an opponent suit in play.
   * When undefined, the engine cannot recommend NT bids that require a stopper.
   */
  hasStopperInOpponentSuit?: boolean;
  /**
   * Optional: is the player's LONGEST suit a "good" suit for a preemptive
   * opening — i.e. at least 2 of the top 3 honors (AK, AQ, KQ) or 3 of the top
   * 5 (e.g. QJT)?  SAYC weak-2 and 3-level preempt openings require a good
   * suit; length and HCP alone do not tell us whether the suit is biddable.
   * Shown in HandInput only when the answer would change the recommendation.
   * When undefined the engine assumes the suit is good (legacy behavior), so a
   * caller that never sets it sees the same advice as before.
   */
  goodSuitQuality?: boolean;
}

export type Vulnerability = "none" | "we-only" | "they-only" | "both";

type Situation =
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
  // My own bid was passed out — the auction is over in my contract
  | "auction-passed-out"
  // Responding to partner's opening after opponent interference
  | "responding-suit-after-double"
  | "responding-1nt-doubled"
  | "after-own-double"
  // Advancer's second turn (our side did not open; partner overcalled)
  | "advancer-rebid"
  // Overcaller's second turn (I overcalled; partner advanced)
  | "overcaller-rebid"
  // Responder's second bid after a suit response (partner opened and rebid)
  | "responder-rebid"
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
  /**
   * My most recent real (non-pass, non-double) bid in the auction.  Used by
   * the floor-collision safety net to detect "my last bid is at level X" and
   * prevent recommending a lower bid.
   */
  myPreviousBid?: string;
  /**
   * My ORIGINAL opening bid — the first real bid I made in the auction.  Used
   * by rebid handlers that need to know what suit I opened with (e.g. the
   * weak-2 2NT inquiry must check the original 2♥ opening, NOT a 2♥ rebid by
   * a 1♥ opener).  Falls back to myPreviousBid when not set.
   */
  myFirstBid?: string;
  agreedSuit?: string;
  /** True when the opener's second bid was completing a Jacoby Transfer (not Stayman). */
  wasTransferCompletion?: boolean;
  /**
   * For `stayman-response`: partner's follow-up bid after responder's rebid.
   * e.g. in 1NT–2♣–2♦–2♠–2NT, `partnerBid` = "2♦" (Stayman reply) and
   * `partnerContinuation` = "2NT" (partner's second bid declining the invitation).
   */
  partnerContinuation?: string;
  /**
   * True when the current player is in the balancing (protective) seat — i.e. they
   * already passed once earlier in the auction and are now getting a second chance
   * after an opponent has opened.  Standards for overcalling are slightly relaxed
   * in this seat (you are "protecting" partner who may have been trapped with values).
   */
  balancing?: boolean;
  /**
   * Partner's FIRST real bid in the auction (e.g. their original overcall).
   * Used by `advancer-rebid` to give preference between partner's two suits.
   */
  partnerFirstBid?: string;
  /**
   * Partner's earlier Blackwood ACE response (5♣/5♦/5♥/5♠), threaded into the
   * kings follow-up so a grand slam is never bid with aces missing.
   */
  partnerAceResponse?: string;
  /**
   * The most recent CALL in the auction (including Pass/Double/Redouble).
   * Used by the safety net to ensure Double/Redouble recommendations are
   * legal (you cannot double a double, or redouble out of turn).
   */
  lastCall?: string;
  /**
   * True when Stayman/transfers are OFF for partner's response because an
   * opponent made a real bid BEFORE that response.
   */
  systemsOff?: boolean;
  /**
   * For `after-own-double`: true when MY PARTNER opened the auction, i.e. my
   * earlier double was a NEGATIVE double (6+ pts, unbid suits) rather than a
   * takeout double (12+).  Drives the wording of the follow-up advice.
   */
  partnerOpened?: boolean;
  /**
   * The FIRST real bid of the whole auction (any seat).  Lets handlers tell a
   * conventional bid from a natural one — e.g. "1NT then 2♣" is Stayman only
   * when the 1NT was the OPENING, not when it was a response.
   */
  auctionOpeningBid?: string;
  /**
   * For `rebid-after-suit`: true when I have already opened AND rebid, and
   * partner's latest real bid is the one I already answered — my hand is
   * fully described and only opponents' interference returns the turn to me.
   */
  partnerHasNothingNew?: boolean;
  /**
   * For `rebid-after-suit`: true when partner's latest bid CUE-BIDS a suit an
   * opponent had shown BEFORE partner's call — the game-forcing raise in
   * competition, never a natural bid in the enemy suit.
   */
  partnerCuedTheirSuit?: boolean;
  /**
   * For `responding-to-1nt-oc`: the opponents' highest real bid made AFTER
   * partner's 1NT overcall — Stayman/transfers are off over it.
   */
  interferenceOverPartnerNT?: string;
  /**
   * For `after-own-double`: true when MY earlier double was a LEAD-DIRECTING
   * double of the opponents' Stayman 2♣ (shows clubs and asks for a club
   * lead) — not takeout and not negative.
   */
  doubleWasLeadDirecting?: boolean;
  /**
   * For `rebid-after-negative-double`: the bid partner actually DOUBLED (the
   * real bid immediately before their Double).  Decides negative-vs-penalty
   * (through 2♠) even when the opponents have raised since.
   */
  doubledBid?: string;
  /**
   * For `auction-passed-out`: an opponent DOUBLED my standing bid, so the
   * auction is NOT actually over — I may pass (play doubled), redouble, or
   * run.  The handler must not claim "auction complete".
   */
  myBidWasDoubled?: boolean;
  /**
   * For `responding-2nt`: partner's 2NT was the REBID after a strong 2♣
   * opening (22-24, not 20-21) — the response ladder shifts down ~2 points.
   */
  after2COpening?: boolean;
  /**
   * For `responder-rebid`: the auction's highest bid at the moment BEFORE
   * partner's latest rebid — jump detection must measure against this, not
   * against the opponents' CURRENT bids (which may have come later).
   */
  partnerRebidFloor?: string;
  /**
   * For `respond-to-partner-invitation`: partner was an OVERCALLER, not the
   * opener — their re-raise invite shows 14-15 support points and the
   * accept/decline thresholds shift to the 6-10 raise ladder.
   */
  partnerWasOvercaller?: boolean;
  /**
   * For `rebid-after-suit`: partner made a (negative) DOUBLE earlier in the
   * auction — their later raise of my suit is INVITATIONAL (11-13), never a
   * weak preemptive jump.
   */
  partnerDoubledEarlier?: boolean;
  /**
   * For `protective-rebid`: my first bid was an OVERCALL, not the auction's
   * opening — stories must say "overcall", not "opening bid".
   */
  iOvercalled?: boolean;
}

interface ExpectedResponse {
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
  // tie: 4-4 or longer (5-5, 6-6) → diamonds (open the higher-ranking suit); 3-3 → clubs
  if (hand.diamonds >= 4) return "diamonds";
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

  // Strong 2♣ (22+ HCP balanced or 22+ TP unbalanced).
  // SAYC has NO strong 3NT opening: 25-27 balanced opens 2♣ and rebids 3NT
  // (22-24 rebids 2NT).  A 3NT OPENING is "Gambling" — a solid running 7-card
  // minor — which this tool cannot verify from HCP + shape alone, so it never
  // recommends it.
  if (
    (analysis.isBalanced && hand.hcp >= 22) ||
    (!analysis.isBalanced && tp >= 22)
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
          yourRebid:
            "Bid your best suit; or rebid notrump with a balanced hand — 2NT with 22-24 HCP, 3NT with 25-27",
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

    // Pre-emptive 3-level (7-card suit, no 4-card major outside).
    // Requires a GOOD suit — skip when the player tells us the suit is weak
    // (goodSuitQuality === false); undefined/true keep the legacy behavior.
    // A two-suiter that satisfies the Rule of 20 is a 1-level OPENING, not a
    // preempt — opening 1-of-a-suit shows the values and keeps both suits live.
    const sevenCardSuit = suits.find((s) => s.count >= 7);
    if (
      sevenCardSuit &&
      hand.goodSuitQuality !== false &&
      !(ruleOf20(hand) && calcTP(hand) >= 13)
    ) {
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

    // NOTE: There is NO preemptive opening available for a 6-card club suit in SAYC.
    // 2♣ is reserved for strong 22+ HCP hands, and 3♣ requires 7+ clubs.
    // A 6-card club suit with a weak hand must Pass — there is no pre-empt available.

    // Weak 2 (6-card suit, no outside 4-card major) — EXCLUDES clubs (2♣ is reserved)
    const sixCardSuit = suits.find((s) => s.count >= 6 && s.name !== "clubs");
    if (
      sixCardSuit &&
      sixCardSuit.count === 6 &&
      hand.goodSuitQuality !== false &&
      !(ruleOf20(hand) && calcTP(hand) >= 13)
    ) {
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
        reasoning: `With 13-21 TP and a 5+ card ${major} suit, open 1${suitSymbol(major)}.${
          hand.spades >= 5 && hand.hearts >= 5
            ? " With two 5-card majors, open the higher-ranking one (spades) first so you can rebid hearts cheaply."
            : ""
        }`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `5+ card ${major} suit with 12-21 total pts. A game-forcing auction is possible if partner has 13+ pts.`,
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
      whatYourBidTellsPartner: `12-21 total pts, ${minor === "clubs" ? "3+ card clubs (may be a short 3-card suit)" : "usually 4+ diamonds (3 only with exactly 4-4-3-2 shape)"}. Looking for a major suit fit or NT game.`,
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
          meaning: "6-10 pts, 4+ card support (usually 5+)",
        },
      ],
      confidence: "high",
    };
  }

  // Rule of 20 check (12 TP).  Requires 10+ HCP — weaker shapely hands
  // (e.g. 9 HCP with a 7-card suit) belong in the preempt structure below.
  if ((tp === 12 || (hand.hcp >= 11 && tp <= 12)) && hand.hcp >= 10) {
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
      const sortedLengths = [
        hand.spades,
        hand.hearts,
        hand.diamonds,
        hand.clubs,
      ].sort((a, b) => b - a);
      const longest1 = sortedLengths[0];
      const longest2 = sortedLengths[1];
      const rule20Total = hand.hcp + longest1 + longest2;
      return {
        bid: "Pass",
        category: "Pass (Rule of 20 fails)",
        reasoning: `With ${tp} total points and HCP (${hand.hcp}) + 2 longest suits (${longest1}+${longest2}) = ${rule20Total} < 20, do not open. Pass and wait to see if you can compete later.`,
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

function getResponseToOneNT(
  hand: Hand,
  opponentBid?: string,
): BidRecommendation {
  const analysis = analyzeHand(hand);
  const { hcp } = hand;

  // ── Opponent overcalled over partner's 1NT ────────────────────────────────
  // When an opponent bids a suit over 1NT, Stayman and transfers are OFF.
  // SAYC options: Double (penalty, 8+ HCP), bid a natural suit (to play), or Pass.
  if (
    opponentBid &&
    !opponentBid.endsWith("NT") &&
    opponentBid !== "Pass" &&
    opponentBid !== "Double" &&
    opponentBid !== "Redouble"
  ) {
    const { name: longestName, length: longestCount } = longestSuitInfo(hand);
    const opponentSuit = opponentBid.includes("♠")
      ? "spades"
      : opponentBid.includes("♥")
        ? "hearts"
        : opponentBid.includes("♦")
          ? "diamonds"
          : "clubs";
    const opponentLevel = parseInt(opponentBid[0]) || 2;

    // Double for penalty with 8+ HCP and a stopper
    if (hcp >= 8 && hand.hasStopperInOpponentSuit !== false) {
      return {
        bid: "Double",
        category: "Penalty Double of Overcall (8+ HCP)",
        reasoning: `Opponent overcalled ${opponentBid} over partner's 1NT. With ${hcp} HCP and a stopper in their suit, double for penalty. This says "I think we can beat them — play it."`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `8+ HCP, wants to penalize ${opponentBid}. Partner should pass.`,
        expectedResponses: [
          { partnerBid: "Pass", meaning: "Partner accepts the penalty double" },
        ],
        confidence: hcp >= 10 ? "high" : "medium",
      };
    }

    // Bid a 5+ card suit (natural, to play — not forcing)
    if (longestCount >= 5 && opponentSuit !== longestName) {
      const nextLevel =
        opponentLevel +
        (BID_ORDER.indexOf(`${opponentLevel}${suitSymbol(longestName)}`) >
        BID_ORDER.indexOf(opponentBid)
          ? 0
          : 1);
      const suitBid = `${nextLevel}${suitSymbol(longestName)}`;
      return {
        bid: suitBid,
        category: `Natural ${suitBid} Over Interference (5+ suit)`,
        reasoning: `Opponent overcalled ${opponentBid} over partner's 1NT — Stayman and transfers are OFF. With ${longestCount} ${longestName} and ${hcp} HCP, bid your suit naturally (not forcing). Partner can raise or pass.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `Natural ${longestCount}-card ${longestName} suit. Not forcing.`,
        expectedResponses: [],
        confidence: "medium",
      };
    }

    // NT bid with a stopper in their suit
    if (hcp >= 10 && hand.hasStopperInOpponentSuit !== false) {
      const ntBid = hcp >= 13 ? "3NT" : "2NT";
      return {
        bid: ntBid,
        category: `${ntBid} Over Interference (${hcp >= 13 ? "Game" : "Invitational"})`,
        reasoning: `Opponent overcalled ${opponentBid}. With ${hcp} HCP and a stopper in their suit, bid ${ntBid} to ${hcp >= 13 ? "go to game" : "invite game"}.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `${hcp >= 13 ? "Game-going values with stopper." : "Invitational with stopper."}`,
        expectedResponses: [],
        confidence: hand.hasStopperInOpponentSuit ? "high" : "medium",
      };
    }

    // No good bid — pass
    return {
      bid: "Pass",
      category: "Pass Over Interference (Weak or No Stopper)",
      reasoning: `Opponent overcalled ${opponentBid} over partner's 1NT. With ${hcp} HCP and${hand.hasStopperInOpponentSuit === false ? " no stopper in their suit," : ""} no good bid is available. Pass and let partner decide.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Weak or no stopper — cannot compete safely.",
      expectedResponses: [],
      confidence: "high",
    };
  }

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

  // 6+ minor with slam interest: 3♣/3♦ is natural and FORCING in SAYC (a
  // slam-oriented bid, NOT an invitation opener may pass).
  if ((hand.clubs >= 6 || hand.diamonds >= 6) && hcp >= 14) {
    const minorName =
      hand.clubs >= 6 && hand.clubs >= hand.diamonds ? "clubs" : "diamonds";
    const minorBid = minorName === "clubs" ? "3♣" : "3♦";
    return {
      bid: minorBid,
      category: `${minorBid} Response (6+ ${minorName}, Forcing, Slam Interest)`,
      reasoning: `In SAYC a 3-of-a-minor response to 1NT is natural and FORCING, showing a good 6+ card suit with slam interest. With ${hcp} HCP and 6+ ${minorName}, start with ${minorBid} — partner describes their hand and you can move toward 3NT, 6${suitSymbol(minorName)}, or 6NT.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `6+ ${minorName}, slam interest. Forcing — do not pass.`,
      expectedResponses: [
        {
          partnerBid: "3NT",
          meaning: "No fit for the minor, stoppers everywhere",
        },
        {
          partnerBid: "New suit / raise",
          meaning: "Fit or cue — slam exploration continues",
        },
      ],
      confidence: "medium",
    };
  }

  // 18+ HCP: opposite 15-17 the combined total is 33+ — bid slam directly.
  if (hcp >= 18) {
    const bigBid = hcp >= 22 ? "7NT" : "6NT";
    return {
      bid: bigBid,
      category: `${bigBid} (Slam on Combined Values)`,
      reasoning: `With ${hcp} HCP opposite partner's 15-17, the combined count is ${hcp + 15}-${hcp + 17} — ${hcp >= 22 ? "grand-slam territory (37+)" : "at or past the 33-point small-slam threshold"}. Bid ${bigBid} directly.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `${hcp}+ HCP — enough combined strength for ${hcp >= 22 ? "a grand slam" : "a small slam"} on power.`,
      expectedResponses: [{ partnerBid: "Pass", meaning: "To play" }],
      confidence: "medium",
      note: "With a strong hand and a specific suit to set, Gerber 4♣ (ace ask) is an alternative route to slam.",
    };
  }

  // Quantitative 4NT (16-17 HCP)
  if (hcp >= 16 && hcp <= 17) {
    return {
      bid: "4NT",
      category: "Quantitative 4NT (invite to 6NT)",
      reasoning: `With ${hcp} HCP${analysis.isBalanced ? " balanced" : ""}, bid 4NT as a quantitative (non-Blackwood) invitation to 6NT. Partner accepts with 17 HCP (maximum) or passes with 15-16.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "16-17 HCP. Inviting 6NT. This is NOT Blackwood — no suit is agreed.",
      expectedResponses: [
        { partnerBid: "Pass", meaning: "15-16 HCP — declines slam invite" },
        { partnerBid: "6NT", meaning: "17 HCP — accepts slam invite" },
      ],
      confidence: "high",
      note: "IMPORTANT: 4NT here is quantitative (not Blackwood) because no suit has been agreed and NT has been bid naturally. Use Gerber (4♣) if you want to ask for aces.",
    };
  }

  // 3NT (10-15 HCP).  No major fit is possible by this point (Stayman /
  // transfer branches above), so 3NT is right even semi-balanced.
  if (hcp >= 10 && hcp <= 15) {
    return {
      bid: "3NT",
      category: "3NT Response (Game)",
      reasoning:
        "With 10-15 HCP (enough for game when combined with partner's 15-17) and no major-suit fit to look for, bid 3NT directly.",
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "10-15 HCP. Game values, no 4-card major interest.",
      expectedResponses: [{ partnerBid: "Pass", meaning: "Accepts 3NT" }],
      confidence: "high",
    };
  }

  // 2NT (8-9 HCP)
  if (hcp >= 8 && hcp <= 9) {
    return {
      bid: "2NT",
      category: "2NT Response (Invitational)",
      reasoning: `With 8-9 HCP, bid 2NT as an invitation. Partner accepts (bids 3NT) with 17 HCP or passes with 15-16.${hand.clubs >= 6 || hand.diamonds >= 6 ? " Your 6-card minor is a source of tricks for 3NT." : ""}`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "8-9 HCP. Invitational — partner decides.",
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

function getResponseToTwoNT(
  hand: Hand,
  /** True when partner's 2NT was the REBID after a strong 2♣ opening —
   *  22-24 HCP instead of 20-21, so every threshold drops ~2 points. */
  after2C = false,
): BidRecommendation {
  const analysis = analyzeHand(hand);
  const { hcp } = hand;
  const rangeText = after2C ? "22-24 (2♣ then 2NT)" : "20-21";
  // Opposite 22-24, game needs only ~2-3; opposite 20-21 it needs ~4-5.
  const gameFloor = after2C ? 2 : 4;

  // A 5-card major is worth showing even on a bust: transfer and pass leaves
  // partner in a better partscore than 2NT.
  if (hcp < gameFloor && hand.hearts < 5 && hand.spades < 5) {
    return {
      bid: "Pass",
      category: "Pass (Too Weak)",
      reasoning: `With ${hcp} HCP and no 5-card major, pass. Even partner's ${rangeText} hand cannot produce game opposite this.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Very weak hand — no game potential.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  // 5+ major → Transfer (check BEFORE Stayman)
  if (hand.hearts >= 5) {
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
          yourRebid:
            hcp >= 12
              ? "Explore slam"
              : hcp >= 5
                ? "Bid 4♥ (or 3NT with only 5 hearts) — game opposite 20-21"
                : "Pass",
        },
      ],
      confidence: "high",
    };
  }
  if (hand.spades >= 5) {
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
          yourRebid:
            hcp >= 12
              ? "Explore slam"
              : hcp >= 5
                ? "Bid 4♠ (or 3NT with only 5 spades) — game opposite 20-21"
                : "Pass",
        },
      ],
      confidence: "high",
    };
  }

  // 4-card major → Stayman
  if ((hand.hearts >= 4 || hand.spades >= 4) && hcp >= gameFloor) {
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

  // 16+ HCP: 20+16 = 36-37 — grand-slam territory on power.
  if (hcp >= 16) {
    return {
      bid: "7NT",
      category: "7NT (Grand Slam on Combined Values)",
      reasoning: `With ${hcp} HCP opposite partner's 20-21, the combined count is ${hcp + 20}-${hcp + 21} — at the 37-point grand-slam threshold. Bid 7NT.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "16+ HCP — combined 37: grand slam on power.",
      expectedResponses: [{ partnerBid: "Pass", meaning: "To play" }],
      confidence: "medium",
      note: "With a specific suit in mind, Gerber 4♣ (ace ask) is a safer route than blasting.",
    };
  }

  // 13-15 HCP: 20+13 = 33 — small slam is there on power; bid it.
  if (hcp >= 13) {
    return {
      bid: "6NT",
      category: "6NT (Small Slam on Combined Values)",
      reasoning: `With ${hcp} HCP opposite partner's 20-21, the combined count is ${hcp + 20}-${hcp + 21} — at or past the 33-point small-slam threshold. Bid 6NT directly.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "13-15 HCP — combined 33+: small slam on power.",
      expectedResponses: [{ partnerBid: "Pass", meaning: "To play" }],
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

  // SAYC: a 3NT OPENING is "Gambling" — a solid, running 7-card minor
  // (AKQxxxx or better) with LITTLE outside strength.  Responder's job is to
  // judge whether 3NT is safe: opener supplies ~7 tricks in the minor and
  // nothing else, so responder needs stoppers/values in the OTHER suits.
  //   • With decent values (likely covering the side suits): pass.
  //   • Weak hand: escape with 4♣, "pass-or-correct" (opener passes with
  //     clubs, corrects to 4♦ with diamonds).
  //   • Strong hand: raise the escape to the 5-level game the same way.
  if (hand.hcp >= 15) {
    return {
      bid: "5♣",
      category: "Raise Gambling 3NT to Game in the Minor (Pass-or-Correct)",
      reasoning: `Partner's 3NT opening is Gambling — a solid 7-card minor with little outside. With ${hand.hcp} HCP you have enough for an 11-trick game in the minor: bid 5♣ pass-or-correct (partner passes with clubs, corrects to 5♦ with diamonds).`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "Strong hand — play game in your long minor (pass 5♣ or correct to 5♦).",
      expectedResponses: [
        { partnerBid: "Pass", meaning: "The solid minor is clubs" },
        { partnerBid: "5♦", meaning: "The solid minor is diamonds" },
      ],
      confidence: "medium",
    };
  }
  if (hand.hcp >= 10) {
    return {
      bid: "Pass",
      category: "Pass (Gambling 3NT — Side Suits Covered)",
      reasoning: `Partner's 3NT opening is Gambling — a solid 7-card minor and little outside strength. With ${hand.hcp} HCP your values should stop the side suits while partner runs the minor. Pass and let 3NT play.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "Enough outside values to protect 3NT — playing it there.",
      expectedResponses: [],
      confidence: "medium",
    };
  }
  return {
    bid: "4♣",
    category: "Escape from Gambling 3NT (Pass-or-Correct)",
    reasoning: `Partner's 3NT opening is Gambling — a solid 7-card minor with little outside. With only ${hand.hcp} HCP you cannot protect the side suits, so 3NT is in danger. Bid 4♣ pass-or-correct: partner passes with clubs or corrects to 4♦ with diamonds.`,
    handAnalysis: analysis,
    whatYourBidTellsPartner:
      "Weak hand, no side stoppers — escaping to your minor at the 4-level.",
    expectedResponses: [
      { partnerBid: "Pass", meaning: "The solid minor is clubs" },
      { partnerBid: "4♦", meaning: "The solid minor is diamonds" },
    ],
    confidence: "medium",
  };
}

function getResponseToSuit(hand: Hand, partnerBid: string): BidRecommendation {
  const analysis = analyzeHand(hand);
  const { tp } = analysis;
  // When RAISING partner's suit you have a trump fit, so SAYC values the hand
  // with SHORT-suit (ruffing) points INSTEAD of long-suit points — void=5,
  // singleton=3, doubleton=1, added to HCP.  Use this for every raise decision;
  // keep the long-suit `tp` for new-suit and notrump responses (no fit).
  const supportTP = calcTPWithFit(hand);
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
  // A raisable fit is 3+ for a MAJOR but 4+ for a MINOR (the 1m opening may
  // be a 3-card suit).  Short-suit points only count when a raise is actually
  // available — otherwise a 5-count with a doubleton sneaks past the 6-point
  // response gate and bids 1NT on nothing.
  const haveFit = mySupport >= (isPartnerMajor ? 3 : 4);
  // Strength gauge: support points with a fit, total (long-suit) points without.
  const responseValue = haveFit ? supportTP : tp;

  if (responseValue <= 5) {
    return {
      bid: "Pass",
      category: "Pass (Too Weak)",
      reasoning: haveFit
        ? `With only ${responseValue} support points (${hand.hcp} HCP plus short-suit points for your ${partnerSuit} fit), pass. You need at least 6 to respond.`
        : "With 0-5 total points, pass. You need at least 6 points to respond.",
      handAnalysis: analysis,
      whatYourBidTellsPartner: "0-5 pts — too weak to respond.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  // Two 5-card majors over a MINOR opening: bid the higher-ranking (spades)
  // first so you can show both suits economically (then rebid/raise hearts).
  if (!isPartnerMajor && hand.spades >= 5 && hand.hearts >= 5 && tp >= 6) {
    return {
      bid: "1♠",
      category: "New Suit — 5-5 Majors (bid spades first)",
      reasoning:
        "With two 5-card majors, bid the higher-ranking suit (1♠) first, then bid hearts on the next round. This lets partner give preference and uses the least bidding space.",
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "5+ spades (and a second suit to come), 6+ pts. Forcing one round.",
      expectedResponses: [
        { partnerBid: "2♠", meaning: "3+ spade support" },
        {
          partnerBid: "1NT/2♣/2♦",
          meaning: "No spade fit — you bid hearts next",
        },
      ],
      confidence: "high",
    };
  }

  // Jacoby 2NT (game-forcing raise of major with 13+ support pts, 4+ card support)
  if (isPartnerMajor && mySupport >= 4 && supportTP >= 13) {
    return {
      bid: "2NT",
      category: "Jacoby 2NT (Game-Forcing Raise)",
      reasoning: `With 4+ card support for partner's ${partnerSuit} and ${supportTP} support points (${hand.hcp} HCP plus short-suit points for the fit, 13+), bid Jacoby 2NT. This is a game-forcing raise that asks opener to describe shortness or extra strength for slam evaluation. NOT a natural NT bid.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `4+ card ${partnerSuit} support, 13+ support points. Game force — slam is possible.`,
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

  // Limit raise (10-12 support points, 3+ card support)
  if (isPartnerMajor && mySupport >= 3 && supportTP >= 10 && supportTP <= 12) {
    return {
      bid: `3${suitSymbol(partnerSuit)}`,
      category: "Limit Raise (10-12 support pts)",
      reasoning: `With ${supportTP} support points (${hand.hcp} HCP plus short-suit points for your ${partnerSuit} fit) and 3+ card support, jump to 3${suitSymbol(partnerSuit)} as a limit raise. This is invitational — opener accepts with maximum, passes with minimum.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `10-12 support points, 3+ card ${partnerSuit} support. Invitational — will you accept?`,
      expectedResponses: [
        {
          partnerBid: `Pass/4${suitSymbol(partnerSuit)}`,
          meaning: "Pass = 13-15 TP (minimum, no game); bid game = 16+ TP",
        },
      ],
      confidence: "high",
    };
  }

  // Limit raise of a MINOR (10-12 support points, 4+ card support, no 4-card
  // major to show) — the invitational jump, mirroring the major version.
  // An unbalanced 10-12 hand must NOT drift into the "2NT balanced" response.
  if (
    !isPartnerMajor &&
    !isBalanced(hand) &&
    mySupport >= 4 &&
    supportTP >= 10 &&
    supportTP <= 12 &&
    hand.hearts < 4 &&
    hand.spades < 4
  ) {
    return {
      bid: `3${suitSymbol(partnerSuit)}`,
      category: "Limit Raise of the Minor (10-12 support pts)",
      reasoning: `With ${supportTP} support points (${hand.hcp} HCP plus short-suit points for your ${partnerSuit} fit), ${mySupport}-card support, and no 4-card major to show, jump to 3${suitSymbol(partnerSuit)} as a limit raise — invitational. Opener passes with a minimum, bids 3NT with stoppers, or 5${suitSymbol(partnerSuit)} with a shapely maximum.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `10-12 support points, ${mySupport}+ card ${partnerSuit} support, no 4-card major. Invitational.`,
      expectedResponses: [
        { partnerBid: "Pass", meaning: "Minimum — no game" },
        { partnerBid: "3NT", meaning: "Extras with stoppers — the NT game" },
        {
          partnerBid: `5${suitSymbol(partnerSuit)}`,
          meaning: "Shapely maximum — the minor game",
        },
      ],
      confidence: "high",
    };
  }

  // Simple raise (6-9 support points) — 3+ card support for a MAJOR, but 4+
  // for a MINOR: a 1♣/1♦ opening may be a 3-card suit (e.g. 4-4-3-2 with
  // 18-19 planning a NT rebid), so raising on a tripleton risks a 3-3 "fit".
  // With only 3-card minor support, fall through to 1NT / a new suit instead.
  if (
    mySupport >= (isPartnerMajor ? 3 : 4) &&
    supportTP >= 6 &&
    supportTP <= 9
  ) {
    // When partner opened a minor, prefer bidding a 4-card major before
    // raising — but ONLY with a real 6+ point response. Short-suit points
    // justify a RAISE (they need the fit); a NEW SUIT promises 6+ without it.
    if (!isPartnerMajor && tp >= 6) {
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
      category: "Simple Raise (6-9 support pts)",
      reasoning: `With ${supportTP} support points (${hand.hcp} HCP plus short-suit points for your ${partnerSuit} fit) and ${isPartnerMajor ? 3 : 4}+ card support, make a simple raise to 2${suitSymbol(partnerSuit)}.${isPartnerMajor ? "" : ` A minor-suit raise promises 4+ cards — partner's 1${suitSymbol(partnerSuit)} may be only a 3-card suit.`}`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `6-9 support points, ${isPartnerMajor ? 3 : 4}+ card ${partnerSuit} support.`,
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
          {
            partnerBid: "1NT",
            meaning:
              "12-14 balanced rebid, no 4-card major (15-17 would have opened 1NT)",
          },
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
          {
            partnerBid: "1NT",
            meaning:
              "12-14 balanced rebid, no 4-card major (15-17 would have opened 1NT)",
          },
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
    // No 4-card major to show.  The right call depends on whether partner
    // opened a MAJOR (2NT would be Jacoby, not natural) or a MINOR.
    if (isPartnerMajor) {
      const minor = longerMinor(hand);
      // 3-card support = a known 8-card major fit, but a DIRECT raise to 4 of
      // the major would be the SAYC PREEMPTIVE raise (5+ trumps, under 10
      // pts) and would conceal these values.  Book route: forcing new suit
      // first, then jump to the major game.
      if (mySupport >= 3 && tp <= 16) {
        return {
          bid: `2${suitSymbol(minor)}`,
          category: "Two-Over-One, Then Raise to Game (13-16, 3-Card Support)",
          reasoning: `With ${tp} TP and 3-card ${partnerSuit} support you have game values and a known 8-card fit — but a DIRECT 4${suitSymbol(partnerSuit)} would be the SAYC weak/preemptive raise (5+ trumps, under 10 pts) and would hide your strength. Bid a forcing 2${suitSymbol(minor)} first, then jump to 4${suitSymbol(partnerSuit)} next turn to show a real game raise.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: `10+ pts with ${minor} — forcing one round. The 4${suitSymbol(partnerSuit)} jump next turn shows the game-going raise.`,
          expectedResponses: [
            {
              partnerBid: "Any rebid",
              meaning: "Describes opener's hand",
              yourRebid: `Jump to 4${suitSymbol(partnerSuit)}`,
            },
          ],
          confidence: "high",
        };
      }
      // 17+ TP (with or without a fit): too strong to sign off — bid a forcing
      // 2-over-1 to keep the auction open below game and explore slam.
      if (tp >= 17) {
        return {
          bid: `2${suitSymbol(minor)}`,
          category: "Two-Over-One (17+ TP, slam interest)",
          reasoning: `With ${tp} TP and no 4-card major to show, bid a forcing 2-over-1 in your ${minor} suit rather than jumping to 3NT. This keeps the auction below game so you can explore slam${mySupport >= 3 ? ` and support partner's ${partnerSuit} next` : ""}.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner:
            "17+ TP, forcing — game is certain and slam is possible.",
          expectedResponses: [
            {
              partnerBid: "Rebid",
              meaning: "Describes shape/strength; you drive on",
            },
          ],
          confidence: "high",
        };
      }
      // 13-16 balanced, no fit: 3NT is the natural game (2NT here = Jacoby).
      return {
        bid: "3NT",
        category: "3NT Response (13-16 TP, balanced)",
        reasoning: `With ${tp} TP balanced, no 4-card major, and no 3-card support for partner's ${partnerSuit}, bid 3NT — the standard balanced game response. (A 2NT response here would be Jacoby, not natural.)`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: "13-16 TP, balanced, no major fit. To play.",
        expectedResponses: [
          { partnerBid: "Pass", meaning: "Accepts 3NT as final contract" },
          { partnerBid: "4♣/4♦", meaning: "Strong minor suit, slam interest" },
        ],
        confidence: "high",
      };
    }
    // Partner opened a MINOR — the natural notrump ladder applies.
    // 17+ is TOO STRONG for a direct 3NT (opener passes it with a minimum
    // and slam dies): bid a new suit first and drive.
    if (tp >= 17) {
      const slamSuitResp = (
        ["diamonds", "clubs", "hearts", "spades"] as const
      ).find(
        (sn) => sn !== partnerSuit && (hand[sn as keyof Hand] as number) >= 4,
      );
      if (slamSuitResp) {
        const slamRespBid = `${["hearts", "spades"].includes(slamSuitResp) ? 1 : 2}${suitSymbol(slamSuitResp)}`;
        return {
          bid: slamRespBid,
          category: "New Suit First (17+ TP — Too Strong for 3NT)",
          reasoning: `With ${tp} TP you are too strong for a direct 3NT (partner would pass it with a minimum and a slam could die). Bid your ${slamSuitResp} (${slamRespBid}) — forcing — and drive toward the right game or slam once partner describes their hand.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner:
            "A forcing new suit — this hand has real slam interest opposite extras.",
          expectedResponses: [
            {
              partnerBid: "Rebid",
              meaning: "Describes shape/strength; you drive on",
            },
          ],
          confidence: "high",
        };
      }
    }
    if (tp >= 15 && isBalanced(hand)) {
      return {
        bid: "3NT",
        category: "3NT Response (15-16 TP, Game Force)",
        reasoning: `With ${tp} TP balanced and no 4-card major, bid 3NT directly. This is a game-forcing response — partner opened at the 1-level and combined values are sufficient for game.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: "15-16 TP, balanced. Game force — play 3NT.",
        expectedResponses: [
          { partnerBid: "Pass", meaning: "Accepts 3NT as final contract" },
          { partnerBid: "4♣/4♦", meaning: "Strong minor suit, slam interest" },
        ],
        confidence: "high",
      };
    }
    // 13+ but unbalanced (or 13-14 balanced): bid a forcing 2-over-1 in the
    // longer minor / longest suit rather than misdescribing a flat 2NT/3NT.
    if (!isBalanced(hand)) {
      const longest = longestSuitInfo(hand);
      if (longest.name !== partnerSuit && longest.length >= 4) {
        return {
          bid: `2${suitSymbol(longest.name)}`,
          category: "Two-Over-One (13+ TP, unbalanced)",
          reasoning: `With ${tp} TP, an unbalanced hand, and no 4-card major, bid a forcing 2-over-1 in your ${longest.name} suit. 3NT would misrepresent your distribution.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: `13+ TP, 4+ ${longest.name} (usually 5+), forcing.`,
          expectedResponses: [
            { partnerBid: "Rebid", meaning: "Describes hand; game is assured" },
          ],
          confidence: "high",
        };
      }
    }
    return {
      bid: "2NT",
      category: "2NT Response (13-14 TP)",
      reasoning: `With ${tp} TP balanced and no 4-card major to show, bid 2NT as an invitational raise. Partner will bid 3NT with extra values or pass with minimum.`,
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
          { partnerBid: "1NT", meaning: "12-14 balanced rebid, no heart fit" },
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
          { partnerBid: "1NT", meaning: "12-14 balanced rebid, no spade fit" },
        ],
        confidence: "high",
      };
    }
    // Over a 1-MAJOR a 2NT response is Jacoby (artificial 4-card GF raise), so
    // an 11-12 balanced hand WITHOUT 4-card support cannot bid a natural 2NT.
    // Respond a forcing 1NT and show the invitational values on the next round.
    if (isPartnerMajor) {
      return {
        bid: "1NT",
        category: "Forcing 1NT (11-12 TP, no fit)",
        reasoning:
          "With 11-12 TP, no 4-card major to show, and fewer than 3-card support, respond a (semi-)forcing 1NT — a natural 2NT here would be Jacoby. Invite game by bidding 2NT on your next turn.",
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "6-12 pts, no fit, no biddable major — forcing one round; an invite follows.",
        expectedResponses: [
          {
            partnerBid: "2 of a suit",
            meaning: "Minimum rebid — you can invite",
          },
          {
            partnerBid: "Jump/strong rebid",
            meaning: "Extras — drive to game",
          },
        ],
        confidence: "high",
      };
    }
    if (!isBalanced(hand)) {
      // Unbalanced hands must not claim a balanced 2NT — with a fit the limit
      // raise (above) has already fired; otherwise show a suit or 1NT.
      const longestR2NT = longestSuitInfo(hand);
      const R2NT_RANK: Record<string, number> = {
        clubs: 1,
        diamonds: 2,
        hearts: 3,
        spades: 4,
      };
      if (longestR2NT.length >= 5 && longestR2NT.name !== partnerSuit) {
        const suitBidR2NT = `${(R2NT_RANK[longestR2NT.name] ?? 0) > (R2NT_RANK[partnerSuit] ?? 0) ? 1 : 2}${suitSymbol(longestR2NT.name)}`;
        return {
          bid: suitBidR2NT,
          category: "New Suit (11-12 TP, Unbalanced)",
          reasoning: `With 11-12 TP but an UNBALANCED hand, a natural 2NT would misdescribe the shape — bid your ${longestR2NT.length}-card ${longestR2NT.name} suit instead (forcing one round).`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: `${longestR2NT.length >= 5 ? "5" : "4"}+ ${longestR2NT.name}, 11-12 pts, forcing one round.`,
          expectedResponses: [],
          confidence: "medium",
        };
      }
      return {
        bid: "1NT",
        category: "Forcing 1NT (11-12 TP, Unbalanced — No Better Bid)",
        reasoning:
          "With 11-12 TP, an unbalanced hand, and no biddable suit, respond 1NT (semi-forcing) rather than misdescribe the shape with a natural 2NT. Plan to invite on the next round.",
        handAnalysis: analysis,
        whatYourBidTellsPartner: "6-12 pts, no fit — an invite may follow.",
        expectedResponses: [],
        confidence: "medium",
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

  // Positive response (8+ HCP)
  if (hcp >= 8) {
    const bestSuit = longestSuitInfo(hand);
    if (bestSuit.length >= 5) {
      // Majors are shown at the 2-level; minors at the 3-level (2♦ is the
      // artificial waiting bid and 2♣ is partner's own opening!).
      const posLevel =
        bestSuit.name === "clubs" || bestSuit.name === "diamonds" ? 3 : 2;
      return {
        bid: suitBidLevel(bestSuit.name, posLevel),
        category: "Positive Response to 2♣",
        reasoning: `With 8+ pts and a 5-card ${bestSuit.name} suit, make a positive response (majors at the 2-level, minors at the 3-level since 2♦ is the artificial waiting bid). This is game-forcing.`,
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

function getResponseToWeak2(
  hand: Hand,
  partnerBid: string,
  contested = false,
  /** The opponents' highest real bid, when they have intervened — raises must
   *  clear it and the pass/double judgment must acknowledge it. */
  interferenceBid?: string,
): BidRecommendation {
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
  if (
    hcp >= 16 &&
    mySupport <= 2 &&
    analysis.isBalanced &&
    hand.hasStopperInOpponentSuit !== false
  ) {
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

  // When an opponent has overcalled, the 2NT feature-inquiry is OFF (2NT would
  // be natural).  With game values and a fit, raise partner's major to game;
  // otherwise fall through to a natural raise / pass.
  if (contested && hcp >= 13 && mySupport >= 3 && partnerSuit !== "diamonds") {
    return {
      bid: `4${partnerSuitSym}`,
      category: "Raise Weak 2 to Game (Contested)",
      reasoning: `An opponent overcalled, so the 2NT inquiry is off. With ${hcp} HCP and ${mySupport}-card support for partner's weak 2${partnerSuitSym}, raise straight to game — you have the values and a known 8+ card fit.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `Game values with a ${partnerSuit} fit — to play.`,
      expectedResponses: [{ partnerBid: "Pass", meaning: "Accepting game" }],
      confidence: "high",
    };
  }

  // ── 2NT forcing inquiry: 13+ HCP, want more info before committing to game ─
  // Bridgedoctor: "2NT: A FORCING inquiry as to partner's strength"
  // (OFF when an opponent has overcalled — then 2NT is natural.)
  if (hcp >= 13 && !contested) {
    return {
      bid: "2NT",
      category: "2NT Inquiry over Weak 2",
      reasoning: `With ${hcp} HCP, bid 2NT as a forcing inquiry. This asks partner to describe their hand: rebid the suit with a minimum (5-7 HCP), or show a side feature (A or K) with a maximum (8-10 HCP).`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "13+ HCP — game interest. Describe your hand.",
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
  if (
    mySupport >= 3 &&
    (!interferenceBid ||
      BID_ORDER.indexOf(`3${partnerSuitSym}`) >
        BID_ORDER.indexOf(interferenceBid))
  ) {
    return {
      bid: `3${partnerSuitSym}`,
      category:
        hcp >= 13
          ? "Competitive Raise of Weak 2 (Good Hand, No Game Available)"
          : "Pre-emptive Raise of Weak 2",
      reasoning:
        hcp >= 13
          ? `You hold real values (${hcp} HCP), but opposite partner's 5-10 weak two${partnerSuit === "diamonds" ? " in a minor" : ""} no game is worth chasing here — raise to 3${partnerSuitSym} to compete for the partscore and crowd the opponents. Partner will read it as pre-emptive and pass.`
          : `With ${mySupport}-card ${partnerSuit} support and ${hcp} HCP, raise to 3${partnerSuitSym} — a pre-emptive raise, not invitational. This further obstructs opponents while supporting partner's long suit.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "3+ card support, competing — pre-emptive, not invitational.",
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

  if (interferenceBid && hcp >= 15 && mySupport <= 2) {
    return {
      bid: "Double",
      category: "Double of the Interference (Cards, 15+ HCP)",
      reasoning: `Partner's weak two is limited (5-10) and the opponents have bid ${interferenceBid} over it. With ${hcp} HCP and no fit, your side's high cards are mostly defensive — double to show a strong balanced-ish hand and interest in penalizing. Partner passes with a normal weak two.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "15+ HCP, no fit — penalty-oriented values over their bid.",
      expectedResponses: [
        { partnerBid: "Pass", meaning: "Normal weak two — defend" },
      ],
      confidence: "medium",
    };
  }
  return {
    bid: "Pass",
    category: "Pass (Weak 2 Response)",
    reasoning: interferenceBid
      ? `The opponents have bid ${interferenceBid} over partner's weak two. With ${hcp} HCP and only ${mySupport}-card ${partnerSuit} support, there is nothing constructive to say — pass and defend.`
      : `With ${hcp} HCP and only ${mySupport}-card ${partnerSuit} support, pass the Weak 2.`,
    handAnalysis: analysis,
    whatYourBidTellsPartner: "No support or game interest.",
    expectedResponses: [],
    confidence: "medium",
  };
}

function getResponseToPreempt(
  hand: Hand,
  partnerBid: string,
  /** The opponents' latest real bid AFTER partner's preempt, if any. */
  interferenceBid?: string,
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

  const preemptSuitIsMajor =
    partnerSuit === "hearts" || partnerSuit === "spades";
  const preemptAtGame = preemptLevel >= (preemptSuitIsMajor ? 4 : 5);
  // The opponents have OUTBID partner's preempt — the story is defend-or-
  // sacrifice, not "let partner play it".
  if (
    interferenceBid &&
    isRealBid(interferenceBid) &&
    BID_ORDER.indexOf(interferenceBid) > BID_ORDER.indexOf(partnerBid)
  ) {
    return {
      bid: "Pass",
      category: "Pass — Opponents Outbid the Preempt",
      reasoning: `The opponents have bid ${interferenceBid} over partner's ${partnerBid} preempt. The preempt did its job — it pushed them high. With ${hcp} HCP and no fit-based reason to sacrifice, pass and defend; partner (the preemptor) will not bid again.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Content to defend — no sacrifice interest.",
      expectedResponses: [],
      confidence: "high",
    };
  }
  return {
    bid: "Pass",
    category: "Pass (Pre-empt Response)",
    reasoning: preemptAtGame
      ? `Partner's ${partnerBid} preempt is already AT game — there is nothing to raise toward, and with ${hcp} HCP and no huge fit there is no slam interest. Pass and let partner play it.`
      : `With ${hcp} HCP, no 5-card major, and fewer than 3-card support for partner's ${partnerSuit}, pass. Game is unlikely with minimum values.`,
    handAnalysis: analysis,
    whatYourBidTellsPartner: preemptAtGame
      ? "Accepting the game preempt."
      : "No support or game interest.",
    expectedResponses: [],
    confidence: "high",
  };
}

// ─── Overcalls ───────────────────────────────────────────────────────────────

function getOvercall(
  hand: Hand,
  opponentBid: string,
  vul: Vulnerability,
  lhoBid?: string,
  partnerBid?: string,
  balancing?: boolean,
  /** The auction's first real bid — 2♣ over a 1NT is Stayman ONLY when the
   *  1NT was the OPENING (a 1NT response followed by 2♣ is a natural rebid). */
  auctionOpeningBid?: string,
): BidRecommendation {
  const analysis = analyzeHand(hand);
  const { hcp } = hand;
  const { tp } = analysis;

  // Detect conventional bids that look like suit bids but are not natural.
  // The most common case: RHO bids 2♣ (Stayman) after LHO OPENED 1NT.
  // 2♣ Stayman is not a real clubs bid — 2♣ is now unavailable and the position
  // is more dangerous (both opponents have shown values).  When the 1NT was a
  // RESPONSE (someone opened a suit first), a following 2♣ is natural — do NOT
  // apply the Stayman reading.
  const lhoIsNT = lhoBid?.endsWith("NT") ?? false;
  // Partner doubled the opponents' Stayman 2♣ for a club lead — regardless of
  // which seat's bid the context carries as "latest", a Double by partner in a
  // 1NT-opened auction where 2♣ appeared is that lead-directing double.
  if (
    partnerBid === "Double" &&
    (auctionOpeningBid === undefined || auctionOpeningBid === "1NT") &&
    (opponentBid === "2♣" || lhoBid === "2♣")
  ) {
    return {
      bid: "Pass",
      category: "Pass — Partner's Double Was Lead-Directing",
      reasoning: `Your partner doubled the opponents' Stayman 2♣ bid to ask for a club lead — this is a lead-directing double, not a takeout double asking you to bid. The opponents have signed off in a suit (or are about to). With ${hcp} HCP your side does not have the values to compete: the opponents (the 1NT opener showed 15-17 HCP; the Stayman bidder 8+ HCP with a 4-card major) hold the majority of the points. Pass and let the opponents play their contract. When it is your turn to lead, lead a club as partner requested.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "Pass — I understand your double was lead-directing. I will lead clubs.",
      expectedResponses: [],
      confidence: "high",
    };
  }
  // ── The opponents are MID-STAYMAN: 1NT - 2♣ - (2♦/2♥/2♠ reply). RHO's old
  // bid may sit under LHO's reply (or vice versa) — the standing bid and the
  // artificial reading both matter for an honest story.
  {
    const staymanReply = [opponentBid, lhoBid].find(
      (b) => !!b && /^2[♦♥♠]$/.test(b),
    );
    const sawStayman2C = opponentBid === "2♣" || lhoBid === "2♣";
    const longestLenOC = Math.max(
      hand.spades,
      hand.hearts,
      hand.diamonds,
      hand.clubs,
    );
    if (
      auctionOpeningBid === "1NT" &&
      sawStayman2C &&
      staymanReply &&
      isRealBid(partnerBid) === false &&
      partnerBid !== "Double" &&
      (longestLenOC < 5 || hcp < 8)
    ) {
      const replySuitName = staymanReply.includes("♦")
        ? "diamonds"
        : staymanReply.includes("♥")
          ? "hearts"
          : "spades";
      return {
        bid: "Pass",
        category: "Pass — No Action Over Their Stayman Auction",
        reasoning: `The opponents are mid-Stayman: the 1NT opener (15-17 HCP) answered 2♣ with ${staymanReply}${staymanReply === "2♦" ? " (artificial — denying a 4-card major, saying nothing about diamonds)" : ` (a real 4-card ${replySuitName} suit)`}. A double of ${staymanReply} here would be LEAD-DIRECTING, showing strong ${replySuitName} — not takeout. With ${hcp} HCP and no good 5+ card suit, you have no safe action against opponents who hold most of the strength. Pass.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "No safe action over their conventional auction.",
        expectedResponses: [],
        confidence: "high",
      };
    }
  }

  // ── The STANDING opposing bid may be LHO's, above RHO's older call (e.g.
  // RHO's Stayman reply 2♦ under LHO's 3NT).  Pass texts and level math must
  // key on the highest live bid — re-enter with roles straightened out.
  if (
    lhoBid &&
    isRealBid(lhoBid) &&
    isRealBid(opponentBid) &&
    BID_ORDER.indexOf(lhoBid) > BID_ORDER.indexOf(opponentBid)
  ) {
    return getOvercall(
      hand,
      lhoBid,
      vul,
      opponentBid,
      partnerBid,
      balancing,
      auctionOpeningBid,
    );
  }

  const isStayman =
    opponentBid === "2♣" &&
    lhoIsNT &&
    (auctionOpeningBid === undefined || auctionOpeningBid === "1NT");
  if (isStayman) {
    // The auction is: LHO=1NT, partner=Pass, RHO=2♣ (Stayman). Both opponents have
    // shown values (LHO: 15-17 HCP; RHO: 8+ HCP with a 4-card major). Combined they
    // hold 23-27 HCP. Competing is dangerous.
    //
    // SAYC options in this seat:
    //   • Double = lead-directing (shows ♣ with 3+ of top 5 honors, e.g. KQJ/AQJ/AKJ)
    //   • Natural suit bid at 2-level: requires a genuine 5-card suit (not clubs — taken)
    //   • Pass: always correct with no long suit / mediocre clubs
    //
    // This hand has 5 clubs: recommend a lead-directing Double only if the suit is strong
    // enough (we cannot assess honor quality from count alone, so we advise both options).
    const suitCounts = [
      { name: "spades", count: hand.spades },
      { name: "hearts", count: hand.hearts },
      { name: "diamonds", count: hand.diamonds },
    ];
    const bestNonClub = suitCounts.sort((a, b) => b.count - a.count)[0];
    // Both opponents have shown values (23-27 combined) — competing at the
    // 2-level needs a real suit AND at least a smattering of high cards.
    const hasLong5CardNonClub = bestNonClub.count >= 5 && hcp >= 6;

    if (hasLong5CardNonClub) {
      const sym = suitSymbol(bestNonClub.name);
      const bid = `2${sym}`;
      return {
        bid,
        category: "Natural Overcall After Stayman (2♣)",
        reasoning: `The opponents are using Stayman — LHO opened 1NT (15-17 HCP) and RHO bid 2♣ to ask for a 4-card major. This is a conventional bid, not a real club suit. With ${hand[bestNonClub.name as keyof Hand]} ${bestNonClub.name} and ${hcp} HCP you can overcall ${bid} naturally. Note: both opponents have shown values (combined 23-27 HCP), so compete only with sound suits. Note that 2♣ itself is unavailable (already bid as Stayman).`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `5+ ${bestNonClub.name}, values to compete. Not a strong hand — suggests this suit as a lead and possible contract.`,
        expectedResponses: [
          { partnerBid: "Pass", meaning: "Weak or no fit" },
          { partnerBid: "Raise", meaning: "Fit and some values" },
        ],
        confidence: "medium",
      };
    }

    if (hand.clubs >= 5) {
      // 5 clubs but 2♣ is taken. A Double is lead-directing (shows strong clubs).
      // Requires some values (8+ HCP) — doubling with a very weak hand gives partner
      // a false impression and may push them into a costly contract.
      if (hcp < 8) {
        return {
          bid: "Pass",
          category: "Pass — Too Weak to Double Stayman",
          reasoning: `The opponents are using Stayman — LHO opened 1NT (15-17 HCP) and RHO bid 2♣ (conventional, asking for a 4-card major). Your longest suit is clubs (${hand.clubs} cards), but 2♣ is unavailable. A lead-directing Double of Stayman shows a strong club suit and some values (8+ HCP). With only ${hcp} HCP your hand is too weak to enter the auction safely — both opponents have shown values and any action risks a penalty. Pass and wait.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner:
            "No safe action — too weak to double or overcall.",
          expectedResponses: [],
          confidence: "high",
        };
      }
      // 8+ HCP with 5 clubs — Double is lead-directing (honor quality still matters).
      return {
        bid: "Double",
        category: "Lead-Directing Double of Stayman (Strong Clubs)",
        reasoning: `The opponents are using Stayman — LHO opened 1NT (15-17 HCP) and RHO bid 2♣ (conventional, asking for a 4-card major). Your longest suit is clubs (${hand.clubs} cards), but 2♣ is unavailable as it was just bid as Stayman. A Double here is lead-directing: it tells partner to lead clubs if the opponents play in 3NT or another suit contract. It is NOT a penalty double and NOT an invitation to compete in clubs. To double, your clubs should include at least 3 of the top 5 honors (A, K, Q, J, 10) — e.g. ♣KQJ54 or ♣AQJ75. If your clubs are weaker (e.g. ♣Q8654), Pass is better. With ${hcp} HCP and 5 clubs, a lead-directing double is reasonable if your suit is strong enough.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "Strong clubs (3+ top honors) — please lead clubs. This is lead-directing only; do not compete in clubs unless you have exceptional support.",
        expectedResponses: [
          {
            partnerBid: "Pass",
            meaning: "Will lead clubs if opponents declare",
          },
          {
            partnerBid: "Bid a suit",
            meaning: "Very unbalanced — escaping to own suit (rare)",
          },
        ],
        confidence: "medium",
        note: "If your clubs lack 3 of the top 5 honors (A/K/Q/J/10), prefer Pass — doubling with a weak suit can mislead partner.",
      };
    }

    // No 5-card suit at all — Pass is clear
    return {
      bid: "Pass",
      category: "Pass — No Safe Bid After Stayman",
      reasoning: `The opponents are using Stayman — LHO opened 1NT (15-17 HCP) and RHO bid 2♣ (conventional, not natural clubs). Both opponents have shown values (combined ~23-27 HCP). With ${hcp} HCP and no 5-card suit, there is no safe bid: you cannot overcall 2♣ (it is taken), a suit overcall requires 5+ cards, and doubling Stayman is lead-directing (shows strong clubs, which you lack). Pass and wait — if the opponents stop low your partner may balance.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "No safe action — limited hand, no long suit to compete with.",
      expectedResponses: [],
      confidence: "high",
    };
  }

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

    // Double of 1NT (16+ HCP balanced).  Against a 1NT OPENING (15-17) it is
    // PENALTY; against a 1NT RESPONSE (6-10 — their side opened a suit) the
    // same double is a STRENGTH/values double: it cannot be penalty of a
    // 6-10 bid, it announces a hand too strong for a simple action.
    if (ntLevel === 1 && hcp >= 16 && analysis.isBalanced) {
      const ntWasOpeningPD =
        auctionOpeningBid === undefined || auctionOpeningBid === "1NT";
      return {
        bid: "Double",
        category: ntWasOpeningPD
          ? "Penalty Double of 1NT"
          : "Strength Double of the 1NT Response (16+)",
        reasoning: ntWasOpeningPD
          ? "With 16+ HCP balanced over opponent's 1NT, double for penalty. Your combined strength exceeds theirs."
          : `Their 1NT was a RESPONSE (6-10) to the ${auctionOpeningBid} opening, so this is not a penalty position — it is a STRENGTH double: with ${hcp} HCP you are far too strong for a simple overcall, and the double asks partner to bid (or pass for penalty with their suits stacked). Plan to show your strength with a notrump or suit rebid next.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: ntWasOpeningPD
          ? "16+ HCP balanced. Penalty double — pass unless very unbalanced."
          : "A very strong hand (16+, often much more) — bid your best suit; I will describe further.",
        expectedResponses: ntWasOpeningPD
          ? [
              {
                partnerBid: "Pass",
                meaning: "5+ pts — generally pass and collect the penalty",
              },
              {
                partnerBid: "Bid a suit",
                meaning: "0-4 pts and very unbalanced — escape to longest suit",
              },
            ]
          : [
              {
                partnerBid: "Bid a suit",
                meaning: "0+ pts — best unbid suit (forced unless stacked)",
              },
              {
                partnerBid: "Pass",
                meaning: "Their suits stacked — converting to penalty",
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
    // The bid must clear EVERY live opponent bid, not just the NT (their
    // partner may have bid on above it).
    const ntFloorIdxOC = Math.max(
      BID_ORDER.indexOf(opponentBid),
      lhoBid && isRealBid(lhoBid) ? BID_ORDER.indexOf(lhoBid) : -1,
    );
    const suitBid =
      BID_ORDER.find(
        (b, i) => i > ntFloorIdxOC && b.endsWith(suitSymbol(bestSuit.name)),
      ) ?? `7${suitSymbol(bestSuit.name)}`;
    const nextLevel = parseInt(suitBid[0]);

    // Preemptive bid with very long suit.  A 2-level entry takes a 6-card
    // suit; the 3-level a 7-card suit (6 non-vul); the 4-level an 8+ card
    // suit non-vulnerable.  Higher: never.
    const notVulnerable = vul !== "we-only" && vul !== "both";
    if (
      bestSuit.count >= 6 &&
      tp >= 7 &&
      hcp >= 5 &&
      (nextLevel <= 2 ||
        (nextLevel === 3 &&
          (bestSuit.count >= 7 || (bestSuit.count >= 6 && notVulnerable))) ||
        (nextLevel === 4 && bestSuit.count >= 8 && notVulnerable))
    ) {
      // The suit bid over their NT carries a WIDE range (roughly 5-17) — with
      // 11+ HCP it is a sound, constructive call, not a preempt.  The story
      // must match the hand or it contradicts the wide-range tooltip.
      const soundNTOvercall = hcp >= 11;
      return {
        bid: suitBid,
        category: soundNTOvercall
          ? `Natural Overcall over ${opponentBid} — Long ${bestSuit.name.charAt(0).toUpperCase() + bestSuit.name.slice(1)} Suit`
          : `Preemptive Overcall over ${opponentBid} — Long ${bestSuit.name.charAt(0).toUpperCase() + bestSuit.name.slice(1)} Suit`,
        reasoning: `With ${bestSuit.count} ${bestSuit.name} and ${hcp} HCP, bid ${suitBid} over opponent's ${opponentBid}. This shows a long self-sufficient suit and makes it hard for the opponents to find their best spot. Your offensive trick count in ${bestSuit.name} is strong even without partner's help.${soundNTOvercall ? " With your sound values this is constructive — partner may raise with a fit." : ""}`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `Long ${bestSuit.name} suit (${bestSuit.count}+ cards). The bid has a WIDE range (roughly 5-17 pts)${soundNTOvercall ? " — this hand is at the sound end with real values." : " — this hand is at the distributional end, competing on shape."}`,
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

    // Suit overcall with 5-card suit — only over 1NT (a 2-level call).
    // Bidding a 5-card suit at the 3- or 4-level over 2NT/3NT is far too rich.
    if (ntLevel === 1 && bestSuit.count >= 5 && hcp >= 8) {
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

    // Penalty double thresholds.  SAYC convention: opener has shown 15-17
    // (1NT) or 20-21 (2NT) — so partner has shown nothing yet, and your side
    // needs serious values to double.  Over 1NT, you need 16+ HCP; over 2NT
    // or 3NT, the opponents have shown even more, so you need ~14+ HCP plus
    // additional reason to believe you can defeat the contract.
    if (ntLevel === 1) {
      // Over 1NT: only double with 16+ HCP (penalty double — not already handled above
      // because that branch required balanced shape; this catches unbalanced 16+ HCP hands)
      if (hcp >= 16) {
        return {
          bid: "Double",
          category: "Penalty Double of 1NT",
          reasoning: `With ${hcp} HCP over opponent's 1NT, double for penalty. Your hand is stronger than theirs.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner:
            "16+ HCP — penalty double of 1NT. Pass unless very unbalanced.",
          expectedResponses: [
            {
              partnerBid: "Pass",
              meaning: "Has 5+ pts — generally pass and collect the penalty",
            },
            {
              partnerBid: "Bid a suit",
              meaning: "0-4 pts and very unbalanced — escape to longest suit",
            },
          ],
          confidence: "high",
        };
      }
      // 10-15 HCP over 1NT with no 5-card suit — Pass is correct in SAYC
      const ntWasOpening =
        auctionOpeningBid === undefined || auctionOpeningBid === "1NT";
      return {
        bid: "Pass",
        category: "Pass Over Opponent's 1NT",
        reasoning: ntWasOpening
          ? `With ${hcp} HCP and no 5-card suit, passing over opponent's 1NT is correct in SAYC. You need 16+ HCP to double for penalty, or a 5-card suit to overcall. Bidding at the 2-level with a 4-card suit is risky and non-standard.`
          : `The opponents' 1NT was a RESPONSE (their side opened a suit first), so both opponents are still describing their hands. Entering here (the "sandwich" seat) requires a good 5+ card suit and shape — with ${hcp} HCP and no 5-card suit, pass and defend.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "No clear action — limited hand, no long suit.",
        expectedResponses: [],
        confidence: "high",
      };
    }

    // Penalty double of 2NT/3NT: their auction shows game values (~25+ when
    // 3NT came via opener + responder), so raw HCP can NEVER justify it — a
    // double promises a SOURCE OF TRICKS: a good 6+ card suit to run (with an
    // entry), typically as a lead-director.  A flat 14 sits under their
    // strength and doubles a making game.
    {
      const longestNT2 = longestSuitInfo(hand);
      if (
        longestNT2.length >= 6 &&
        hand.goodSuitQuality !== false &&
        hcp >= 10
      ) {
        return {
          bid: "Double",
          category: `Lead-Directing Penalty Double of ${opponentBid}`,
          reasoning: `A double of the opponents' freely-bid ${opponentBid} promises a SOURCE OF TRICKS, not just points: your ${longestNT2.length}-card ${longestNT2.name} suit rates to run and defeat the contract. It also tells partner what to lead.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: `A running ${longestNT2.name} suit — lead it. We can beat ${opponentBid}.`,
          expectedResponses: [
            { partnerBid: "Pass", meaning: "Defending with your suit led" },
          ],
          confidence: "medium",
        };
      }
    }

    // Default: Pass over NT with weak hand and no long suit
    return {
      bid: "Pass",
      category: `Pass Over Opponent's ${opponentBid}`,
      reasoning: `With only ${hcp} HCP and no long suit, passing over opponent's ${opponentBid} is safest. Entering the auction at a higher level risks a large penalty.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "No action — limited hand.",
      expectedResponses: [],
      confidence: "medium",
    };
  }

  // Past this point we are handling a suit opening — opponentSuit is guaranteed non-null.
  const suitOpponent = opponentSuit as string;

  // Strong NT overcall (15-18 HCP balanced, stopper in opponent's suit).
  // 1NT directly over a 1-level opening; 2NT/3NT only over a LONE preempt
  // opening — when BOTH opponents have bid (opener + responder showing 20+
  // combined), a 15-18 balanced hand must not volunteer NT at the 3-level.
  const bothOpponentsBid =
    !!lhoBid &&
    lhoBid !== "Double" &&
    lhoBid !== opponentBid &&
    !["Pass"].includes(lhoBid);
  // In the BALANCING seat the 1NT range drops to 11-14 — a 15-18 balanced
  // hand there DOUBLES first and bids NT next, or partner (who reads the
  // balancing 1NT as 11-14) will pass out a game.
  if (
    balancing &&
    hcp >= 15 &&
    analysis.isBalanced &&
    hand.hasStopperInOpponentSuit !== false &&
    parseInt(opponentBid[0]) === 1
  ) {
    return {
      bid: "Double",
      category: "Balancing Double (Too Strong for the Balancing 1NT)",
      reasoning: `In the balancing (pass-out) seat, 1NT shows only 11-14 — with ${hcp} HCP balanced you are too strong for it. Double first and bid notrump next: that sequence shows 15+ balanced with their suit stopped, and keeps the game your side likely owns in the picture.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "Balancing double — bid your best suit; my notrump rebid next will show 15+ balanced with their suit stopped.",
      expectedResponses: [
        { partnerBid: "Bid a suit", meaning: "0+ pts — best unbid suit" },
      ],
      confidence: "medium",
      note: "After partner's advance, rebid the cheapest NT to show 15-18 balanced (jump with more).",
    };
  }
  if (
    !balancing &&
    hcp >= 15 &&
    hcp <= 18 &&
    analysis.isBalanced &&
    hand.hasStopperInOpponentSuit !== false &&
    (parseInt(opponentBid[0]) === 1 || !bothOpponentsBid)
  ) {
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

  // Balancing 1NT (protective seat over a 1-level opening): about 11-14 HCP
  // balanced with a stopper in their suit — a full king lighter than the direct
  // 15-18 overcall.  The opponents stopped low, so partner is marked with
  // values; reopen with 1NT rather than sell out.  Without a stopper, fall
  // through to Pass — which is exactly why the stopper is asked for here.
  if (
    balancing &&
    hcp >= 11 &&
    hcp <= 14 &&
    analysis.isBalanced &&
    hand.hasStopperInOpponentSuit !== false &&
    parseInt(opponentBid[0]) === 1
  ) {
    return {
      bid: "1NT",
      category: `Balancing 1NT (${hcp} HCP, Protective Seat)`,
      reasoning: `In the balancing (pass-out) seat over their ${opponentBid}, 1NT shows about 11-14 HCP balanced with a stopper in their suit — a king lighter than a direct 1NT overcall (which needs 15-18). The opponents found a fit and stopped low, so your partner is marked with values: reopen with 1NT rather than sell out. Pass instead if you have no stopper in their suit.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "11-14 HCP balanced with a stopper in their suit (balancing 1NT — a king lighter than a direct 1NT overcall). Stayman and transfers apply.",
      expectedResponses: [
        { partnerBid: "2♣", meaning: "Stayman" },
        { partnerBid: "2♦", meaning: "Transfer to hearts" },
        { partnerBid: "2♥", meaning: "Transfer to spades" },
      ],
      confidence: "high",
      note: "You must have a stopper (A, Kx, Qxx, or Jxxx) in the opponent's suit to bid NT. Without one, pass and defend.",
    };
  }

  // Build suit lists for overcall checks (Michaels, jump overcall, simple
  // overcall).  Exclude EVERY suit the opponents have shown naturally — not
  // just the latest bid: after (1♠)-…-(2♣) both spades and clubs are theirs.
  const oppShownSuits = new Set<string>();
  if (suitOpponent) oppShownSuits.add(suitOpponent);
  for (const b of [auctionOpeningBid, lhoBid]) {
    if (b && /^[1-7][♠♥♦♣]$/.test(b)) {
      oppShownSuits.add(
        b.includes("♠")
          ? "spades"
          : b.includes("♥")
            ? "hearts"
            : b.includes("♦")
              ? "diamonds"
              : "clubs",
      );
    }
  }
  const suits = [
    { name: "spades", count: hand.spades },
    { name: "hearts", count: hand.hearts },
    { name: "diamonds", count: hand.diamonds },
    { name: "clubs", count: hand.clubs },
  ].filter((s) => !oppShownSuits.has(s.name));

  const inOpponentSuit = hand[suitOpponent as keyof Hand] as number;

  // Michaels cuebid (5-5 in two SPECIFIC suits) — check BEFORE simple overcall.
  // Over a minor opening: shows BOTH MAJORS (5+ hearts AND 5+ spades).
  // Over a major opening: shows the OTHER major + an unspecified 5+ card minor.
  // A hand with two random 5-card suits (e.g. spades + diamonds over 1♣) does
  // NOT qualify — it should fall through to a simple overcall of its best suit.
  const michaelsQualifies =
    suitOpponent === "clubs" || suitOpponent === "diamonds"
      ? hand.hearts >= 5 && hand.spades >= 5
      : suitOpponent === "hearts"
        ? hand.spades >= 5 && (hand.clubs >= 5 || hand.diamonds >= 5)
        : hand.hearts >= 5 && (hand.clubs >= 5 || hand.diamonds >= 5);
  // Michaels is a DIRECT cuebid of the opponents' 1-level OPENING.  A suit bid
  // deep in their auction (e.g. opener's 2♣ rebid) is not a Michaels target —
  // cueing it would be meaningless (and can even be an illegal bid).
  const michaelsApplies =
    parseInt(opponentBid[0]) === 1 &&
    (auctionOpeningBid === undefined || opponentBid === auctionOpeningBid);
  if (michaelsQualifies && michaelsApplies) {
    const michaelsMeaning =
      suitOpponent === "clubs" || suitOpponent === "diamonds"
        ? "both majors (5+ hearts and 5+ spades)"
        : suitOpponent === "hearts"
          ? "5+ spades + 5+ unspecified minor"
          : "5+ hearts + 5+ unspecified minor";
    return {
      bid: `2${suitSymbol(suitOpponent)}`,
      category: "Michaels Cuebid (5-5 Two-Suiter)",
      reasoning: `With 5-5 in the two suits Michaels shows over this opening, bid the Michaels cuebid (2${suitSymbol(suitOpponent)}). Over ${suitOpponent === "clubs" || suitOpponent === "diamonds" ? "a minor" : "a major"} opening, this shows ${michaelsMeaning}. No point minimum, but vulnerability matters.`,
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

  // Jump overcall / preemptive overcall (5-10 HCP, 6+ card suit).
  // A weak jump overcall must be a TRUE JUMP: one level above the cheapest
  // legal bid in the suit (6 cards), two with 7, three with 8+ — e.g. over
  // 1♠ a 6-card diamond suit jumps to 3♦, NOT 2♦ (2♦ would be a simple
  // overcall promising 8-15 HCP).
  const sixCardSuits = suits.filter((s) => s.count >= 6);
  const preemptCandidate = sixCardSuits.length > 0 ? sixCardSuits[0] : null;
  // A weak jump overcall is measured RELATIVE to the cheapest legal bid in
  // the suit: a 6-card suit makes a SINGLE jump (one level above cheapest),
  // 7 cards a double jump, 8+ a triple jump — capped at the 4-level.  (An
  // absolute "6 cards → 2-level" rule breaks for minors over majors: over 1♠
  // the 6-card-diamond WJO is 3♦, since 2♦ is merely the cheapest overcall.)
  // Preempt level: the LENGTH-based level of an opening preempt (6 cards →
  // 2-level, 7 → 3-level, 8+ → 4-level), never below the cheapest legal bid
  // in the suit, capped at the 4-level.  When that lands ON the cheapest
  // legal bid it is not a jump — it plays as a LIGHT long-suit overcall and
  // must be labeled that way (needs 7+ HCP and a good suit).
  let skipPreempt = false;
  if (preemptCandidate && hcp >= 5 && hcp <= 10) {
    // A preempt PROMISES a good suit (2 of the top 3 honors, or 3 of the top
    // 5).  When the caller has told us the suit is ragged, do not preempt —
    // a ragged-suit jump can cost a large penalty and misdirects partner's
    // lead.  (undefined = quality unknown → keep the legacy behavior.)
    if (hand.goodSuitQuality === false) skipPreempt = true;
    // Like a weak two-bid, a WJO denies a 4-card MAJOR on the side — with one,
    // a simple overcall keeps that suit in play instead of burying it.
    if (
      (preemptCandidate.name !== "hearts" && hand.hearts >= 4) ||
      (preemptCandidate.name !== "spades" && hand.spades >= 4)
    )
      skipPreempt = true;
  }
  if (preemptCandidate && hcp >= 5 && hcp <= 10 && !skipPreempt) {
    const best = preemptCandidate;
    const wjoSuitSym = suitSymbol(best.name);
    const opponentBidIdxWJO = BID_ORDER.indexOf(opponentBid);
    const minLegalWJO = BID_ORDER.find(
      (b, i) => i > opponentBidIdxWJO && b.endsWith(wjoSuitSym),
    );
    if (minLegalWJO && parseInt(minLegalWJO[0]) <= 4) {
      const absoluteLvl = best.count >= 8 ? 4 : best.count >= 7 ? 3 : 2;
      const lvl = Math.min(4, Math.max(absoluteLvl, parseInt(minLegalWJO[0])));
      const jumpBid = `${lvl}${wjoSuitSym}`;
      const isTrueJump = jumpBid !== minLegalWJO;
      if (isTrueJump || hcp >= 7) {
        const levelName = !isTrueJump
          ? "Light Long-Suit Overcall"
          : lvl === 4
            ? "Game Preempt"
            : lvl === 3
              ? "3-Level Preempt"
              : "Weak Jump Overcall";
        const isTwoClubs = jumpBid === "2♣";
        return {
          bid: jumpBid,
          category: `${levelName} (${best.count}-Card ${best.name.charAt(0).toUpperCase() + best.name.slice(1)})`,
          reasoning: isTrueJump
            ? `With ${hcp} HCP and ${best.count} ${best.name}, make a preemptive ${jumpBid} overcall — a weak jump, pitched like an opening preempt (6 cards → 2-level, 7 → 3-level, 8+ → 4-level). Your ${best.count}-card suit offers strong offensive potential while making it hard for opponents to find their fit.`
            : `With ${hcp} HCP and a good ${best.count}-card ${best.name} suit, bid ${jumpBid} — the cheapest available call in the suit. This is a LIGHT overcall justified by the extra trump length (a 5-card suit at this level would need more high cards); it is obstructive and lead-directing, not a strong bid.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: `${hcp} HCP, ${best.count}-card ${best.name} suit. ${isTrueJump ? "Preemptive — not a strong hand." : "Light and long — competing on shape, not strength."}`,
          expectedResponses: [
            {
              partnerBid: `Raise to ${lvl + 1}${wjoSuitSym}`,
              meaning: "Fit + values — push the preempt higher",
            },
            {
              partnerBid: "Pass",
              meaning: "No fit or minimal values — trust the preempt",
            },
            {
              partnerBid: `${lvl + 2}${wjoSuitSym} or game`,
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
    }
  }

  // Simple suit overcall (1-level 8-16, higher 10-17 — per SAYC; with 17-18
  // and a good suit, overcall intending to bid again) — checked BEFORE takeout
  // double.  A specific suit overcall is more descriptive than a takeout
  // double when available.  NOTE: hands with takeout shape (shortness in their
  // suit) and 16+ are picked up by the strong-double branch below when no suit
  // bid fires; without shortness a strong hand MUST overcall — never pass 16+.
  const fiveCardSuits = suits.filter((s) => s.count >= 5);
  if (fiveCardSuits.length > 0 && hcp >= 8 && hcp <= 18) {
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

    // An overcall promises a GOOD suit — when the caller has told us this
    // (longest) suit is ragged (no 2 of the top 3 honors, nor 3 of the top
    // 5), a 5-card overcall is unsound: partner will raise and lead this
    // suit.  Fall through to double/pass.  (16+ hands still act — passing
    // that much strength is worse than a ragged suit; 6+ card length also
    // compensates.)
    const raggedFiveCardSuit =
      hand.goodSuitQuality === false &&
      best.count === 5 &&
      best.count ===
        Math.max(hand.spades, hand.hearts, hand.diamonds, hand.clubs) &&
      hcp <= 15;
    // A 2-level or higher overcall requires at least 10 HCP — with 8–9 fall
    // through to Pass.  A 3-level overcall needs 12+ with a 6-card suit, and a
    // simple overcall NEVER enters at the 4-level (over their game-level
    // preempt, double with the right shape or pass).
    if (
      raggedFiveCardSuit ||
      (overcallLevel >= 2 && hcp < 10) ||
      (overcallLevel >= 3 && hcp < 11 && best.count < 6) ||
      overcallLevel >= 4
    ) {
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
      const balancingPrefix = balancing ? "Balancing " : "";
      const balancingNote = balancing
        ? ' The opening was followed by two passes, putting you in the balancing (pass-out) seat — the last chance to keep the auction alive. Partner may have been "trapped" with values but no clear bid. In this seat SAYC allows you to compete with slightly less than a direct overcall would require.'
        : "";
      return {
        bid: overcallBid,
        category: `${balancingPrefix}${levelName} Overcall (${hcp} HCP, ${best.count}-Card ${best.name.charAt(0).toUpperCase() + best.name.slice(1)})`,
        reasoning: `With ${hcp} HCP and ${best.count} ${best.name}, overcall ${overcallBid}. A ${levelName.toLowerCase()} overcall shows a good ${best.count}-card suit and ${overcallLevel === 1 ? "8-16" : "10-17"} HCP.${hcp >= 16 ? " Your hand is a MAXIMUM for the overcall — plan to bid again (raise, new suit, or NT) to show the extra strength." : ""}${balancingNote}${honorNote}${vulNote}`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `${hcp} HCP, ${best.count}-card ${best.name} suit. ${overcallLevel >= 2 ? "10-17 HCP for 2-level or higher." : "8-16 HCP at the 1-level."}${balancing ? " (Balancing seat — may have slightly fewer values than a direct overcall.)" : ""}`,
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

  // Takeout / optional doubles are a LOW-LEVEL tool.  Over a freely-bid game
  // (the opponents at the 4-level or higher), a double is PENALTY — it shows
  // defensive tricks (trump length/strength), NOT shortness asking partner to
  // bid.  Do not recommend an automatic takeout double here; with a hand that
  // is short in their suit (no penalty double) and a partner who has shown
  // nothing, the sound action is to pass.
  const opponentLevel = parseInt(opponentBid[0]) || 0;
  if (opponentLevel >= 4) {
    return {
      bid: "Pass",
      category: "Pass (Double Would Be Penalty at the Game Level)",
      reasoning: `The opponents have bid to ${opponentBid}, a game-level contract. A takeout double only applies at low levels — a double of a freely-bid game is PENALTY, showing defensive tricks (length and strength in their trump suit), not shortness. With ${hcp} HCP and ${inOpponentSuit} card${inOpponentSuit === 1 ? "" : "s"} in their ${suitOpponent} suit, you do not have a penalty double, and your partner has not shown values. Pass and defend.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "No penalty double of their game and partner has shown nothing — passing to defend.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  // 19+ HCP balanced is too strong for a direct 1NT/2NT overcall.  Double first
  // (planning to rebid NT) — this is a STRENGTH-showing double, not takeout, so
  // it applies even with length in the opponent's suit.  A 19-count must never
  // pass an opponent's opening.
  if (hcp >= 19 && analysis.isBalanced && !opponentIsNT) {
    return {
      bid: "Double",
      category: "High-Strength Double (19+ HCP Balanced)",
      reasoning:
        "With 19+ HCP balanced you are too strong for a direct 1NT/2NT overcall. Double first; on your next turn rebid NT at the lowest level to show this powerhouse. (This is a strength-showing double — not takeout — so your length in their suit does not matter.)",
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "19+ HCP balanced — very strong; NT rebid to follow.",
      expectedResponses: [],
      confidence: "high",
      note: "After partner responds, rebid the lowest available NT to show 19+ balanced.",
    };
  }

  // Takeout Double (12-15 HCP, short in opponent's suit, good shape — 3+ cards in each unbid suit)
  // Requires hasGoodShape: a takeout double promises support for all unbid suits.
  // Only check the three suits NOT bid by the opponent.
  const unOpenedSuits = (
    ["spades", "hearts", "diamonds", "clubs"] as const
  ).filter((s) => s !== suitOpponent);
  const hasGoodShape =
    inOpponentSuit <= 2 &&
    unOpenedSuits.every((s) => (hand[s as keyof Hand] as number) >= 3);

  if (hcp >= 12 && hcp <= 15 && hasGoodShape) {
    return {
      bid: "Double",
      category: "Takeout Double (12-15 HCP)",
      reasoning: `With ${hcp} HCP, 0-2 cards in opponent's ${suitOpponent}, and 3+ cards in every unbid suit, double for takeout. This is the classic takeout double shape (e.g. 4441/5440, or a small doubleton in their suit) — you are asking partner to bid their best suit among the unbid suits.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `Opening strength (12-15 HCP) with 0-2 cards in ${suitOpponent} and support for all unbid suits. Please bid your best suit.`,
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

  // Strong double (16+ HCP) then rebid.  Any hand too strong for a simple
  // overcall doubles first, regardless of balance — shortness in the opponent's
  // suit (inOpponentSuit <= 2) is exactly what a takeout double wants.  This
  // also catches the 19-21 powerhouses that must NOT pass an opening.
  if (hcp >= 16 && inOpponentSuit <= 2) {
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
    const strongLabel = hcp >= 19 ? "19+" : "16-18";
    return {
      bid: "Double",
      category: `High-Strength Takeout Double (${strongLabel} HCP)`,
      reasoning: `With ${hcp} HCP, double first to show a strong hand. On the next round, bid your long suit (jump with 19+) to reveal extra strength beyond a normal overcall. A double is correct here — being short in the opponent's ${suitOpponent} is ideal for takeout.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "Strong hand (16+ HCP) — double first reveals extra strength beyond a simple overcall.",
      expectedResponses: [],
      confidence: "high",
      note: `After partner responds, ${hcp >= 19 ? "jump in" : "bid"} your long suit (or NT if balanced) to show ${strongLabel} HCP.`,
    };
  }

  // Unusual 2NT (5-5 in two lowest unbid suits)
  const lowest2Unbid = [
    { name: "clubs", count: hand.clubs },
    { name: "diamonds", count: hand.diamonds },
    { name: "hearts", count: hand.hearts },
  ].filter((s) => s.name !== suitOpponent && s.count >= 5);

  if (
    lowest2Unbid.length >= 2 &&
    tp >= 5 &&
    !opponentIsNT &&
    parseInt(opponentBid[0]) === 1 &&
    // Unusual 2NT is a DIRECT jump over the opponents' opening only.
    (auctionOpeningBid === undefined || opponentBid === auctionOpeningBid)
  ) {
    return {
      bid: "2NT",
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
      if (inOpponentSuit > 2) {
        parts.push(
          `A takeout double requires shortness (0–2 cards) in the opponent's suit, but you hold ${inOpponentSuit} ${suitOpponent}.`,
        );
      }
      // Explain the REAL reason a takeout double is unavailable: you lack 3-card
      // support for one or more unbid suits.  (Being short in the opponent's
      // suit is good for a double, so it is never the reason to pass.)
      const shortUnbid = unOpenedSuits.filter(
        (s) => (hand[s as keyof Hand] as number) < 3,
      );
      if (hcp >= 12 && inOpponentSuit <= 2 && shortUnbid.length > 0) {
        parts.push(
          `A takeout double promises 3+ cards in every unbid suit, but you hold only ${shortUnbid
            .map((s) => `${hand[s as keyof Hand]} ${s}`)
            .join(" and ")} — so double is not available.`,
        );
      }
      const longestUnbid = suits.reduce(
        (best, s) => (s.count > best.count ? s : best),
        { name: "", count: 0 },
      );
      if (longestUnbid.count > 0 && longestUnbid.count < 5) {
        parts.push(
          `Your longest unbid suit has only ${longestUnbid.count} cards — a natural overcall requires 5+.`,
        );
      } else if (longestUnbid.count >= 5) {
        // A 5+ card suit exists but a gate blocked it — say WHICH one
        // honestly instead of implying no suit was available.
        const oIdx = BID_ORDER.indexOf(opponentBid);
        let lvl = 1;
        while (
          lvl < 7 &&
          BID_ORDER.indexOf(`${lvl}${suitSymbol(longestUnbid.name)}`) <= oIdx
        )
          lvl++;
        const hcpGate = lvl >= 3 ? "11+" : lvl === 2 ? "10+" : "8+";
        const raggedLongest =
          hand.goodSuitQuality === false &&
          longestUnbid.count ===
            Math.max(hand.spades, hand.hearts, hand.diamonds, hand.clubs);
        if (raggedLongest && longestUnbid.count >= 6 && hcp <= 10) {
          parts.push(
            `Your ${longestUnbid.count}-card ${longestUnbid.name} suit has preempt length, but it is too RAGGED for a preemptive jump — a preempt promises a GOOD suit (2 of the top 3 honors, or 3 of the top 5) since partner will trust it for sacrifices and leads. A natural ${lvl}-level overcall needs ${hcpGate} HCP, which you also lack (${hcp} HCP).`,
          );
        } else if (raggedLongest) {
          parts.push(
            `Your ${longestUnbid.count}-card ${longestUnbid.name} suit is too RAGGED to overcall — an overcall promises a GOOD suit (2 of the top 3 honors, or 3 of the top 5); partner would raise with support and lead this suit against their contract.`,
          );
        } else {
          parts.push(
            `Your ${longestUnbid.count}-card ${longestUnbid.name} suit would have to come in at the ${lvl}-level, which needs ${hcpGate} HCP — with only ${hcp} HCP that overcall is too dangerous.`,
          );
        }
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
  vul: Vulnerability = "none",
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
    // A PREEMPTIVE raise needs shape, not HCP: with a big fit for partner's
    // suit (4+ for a major, 5+ for a minor) and real shortness, jump-raise
    // competitively — the Law of Total Tricks covers the level, and passing
    // hands the opponents an uncontested run.
    const openSuitNameND = openerBid.includes("♠")
      ? "spades"
      : openerBid.includes("♥")
        ? "hearts"
        : openerBid.includes("♦")
          ? "diamonds"
          : "clubs";
    const openIsMajorND =
      openSuitNameND === "spades" || openSuitNameND === "hearts";
    const fitLenND = hand[openSuitNameND as keyof Hand] as number;
    const shortestND = Math.min(
      hand.spades,
      hand.hearts,
      hand.diamonds,
      hand.clubs,
    );
    const jumpRaiseND = (() => {
      const oIdx = BID_ORDER.indexOf(overcall);
      const cheapest = BID_ORDER.find(
        (b, i) => i > oIdx && b.endsWith(suitSymbol(openSuitNameND)),
      );
      if (!cheapest) return undefined;
      const lvl = Math.min(parseInt(cheapest[0]) + 1, 4);
      // LOTT: bid to the trump total — 9 trumps → 3-level, 10+ → 4-level.
      const trumps = fitLenND + (openIsMajorND ? 5 : 3);
      const lottLvl = trumps - 6;
      const target = Math.min(lvl, lottLvl);
      const bid = `${target}${suitSymbol(openSuitNameND)}`;
      return BID_ORDER.indexOf(bid) > oIdx ? bid : undefined;
    })();
    if (fitLenND >= (openIsMajorND ? 4 : 5) && shortestND <= 1 && jumpRaiseND) {
      return {
        bid: jumpRaiseND,
        category: "Preemptive Jump Raise in Competition (Weak, Big Fit)",
        reasoning: `Too weak for a negative double (${hcp} HCP), but with ${fitLenND}-card support for partner's ${openSuitNameND} and a ${shortestND === 0 ? "void" : "singleton"}, a preemptive ${jumpRaiseND} beats passing: the Law of Total Tricks covers the level, and it takes the opponents' bidding space away. In competition a jump raise is WEAK — strong raises go through a cuebid.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `Weak (under 6 HCP) with ${fitLenND}+ card ${openSuitNameND} support and shape — purely obstructive. Do not bid on without a huge hand.`,
        expectedResponses: [
          { partnerBid: "Pass", meaning: "The normal action — preempt stands" },
        ],
        confidence: "medium",
      };
    }
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

  // ── RHO overcalled in NOTRUMP: there is no negative double here ────────────
  // A double of a 1NT overcall is PENALTY — it announces that our side holds
  // the balance of power (opener's 12+ plus ~9-10+ here beats the 15-18 the
  // overcall claims).  Suit bids are natural and to play.
  if (overcall.endsWith("NT")) {
    if (hcp >= 10) {
      return {
        bid: "Double",
        category: "Penalty Double of the 1NT Overcall (10+ HCP)",
        reasoning: `RHO's ${overcall} overcall claims 15-18 HCP, but partner opened (12+) and you hold ${hcp} — the math does not work for them. Double is PENALTY (not negative): your side holds the balance of power.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "10+ HCP — the deal belongs to us. Pass unless very distributional.",
        expectedResponses: [
          { partnerBid: "Pass", meaning: "Accepting the penalty" },
        ],
        confidence: "high",
      };
    }
    const ntNatural = (["spades", "hearts", "diamonds", "clubs"] as const).find(
      (s) =>
        !openerBid.includes(suitSymbol(s)) &&
        (hand[s as keyof Hand] as number) >= 5,
    );
    if (ntNatural && hcp >= 6) {
      const ntNatBid = `2${suitSymbol(ntNatural)}`;
      return {
        bid: ntNatBid,
        category: "Natural Suit Bid Over the 1NT Overcall",
        reasoning: `RHO overcalled ${overcall}. A double here would be penalty (10+), which you do not have. With ${hcp} HCP and a 5+ card ${ntNatural} suit, bid ${ntNatBid} — natural and to play, competing for the partscore.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `5+ ${ntNatural}, about 6-9 pts. Not forcing.`,
        expectedResponses: [],
        confidence: "medium",
      };
    }
    return {
      bid: "Pass",
      category: "Pass Over the 1NT Overcall",
      reasoning: `RHO overcalled ${overcall}. A double here would be PENALTY (about 10+ HCP), and with ${hcp} HCP and no 5-card suit to bid naturally, pass. Partner gets another chance.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Under 10 pts, no long suit — nothing to say.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  // ── Cuebid overcall (e.g. Michaels): RHO bid OUR suit — a negative double
  // makes no sense (the "overcall" shows two other suits).  Defend naturally.
  const openerSuitChar = openerBid.slice(1);
  if (!overcall.endsWith("NT") && overcall.slice(1) === openerSuitChar) {
    return {
      bid: "Pass",
      category: "Pass Over Opponent's Cuebid (Michaels)",
      reasoning: `RHO's ${overcall} is a cuebid of partner's suit (usually Michaels, showing a two-suiter — not natural). A negative double does not apply here. Pass for now: you can bid naturally or penalize their landing spot on the next round with full information.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "No clear action over the conventional cuebid yet — awaiting their landing spot.",
      expectedResponses: [],
      confidence: "medium",
    };
  }

  // ── SAYC ceiling: negative doubles apply only THROUGH 2♠ ────────────────────
  // Over a higher overcall (3♣ and up) a double is penalty-oriented, so the
  // negative double is OFF.  Act naturally instead: bid a good suit or raise
  // with real values, otherwise pass.
  if (
    isRealBid(overcall) &&
    BID_ORDER.indexOf(overcall) > BID_ORDER.indexOf("2♠")
  ) {
    const floorIdxHigh = BID_ORDER.indexOf(overcall);
    // Natural bid: 5+ card unbid suit with opening-ish values for the level.
    const highCandidates = (
      ["spades", "hearts", "diamonds", "clubs"] as const
    ).filter(
      (s) =>
        !openerBid.includes(suitSymbol(s)) &&
        !overcall.includes(suitSymbol(s)) &&
        (hand[s as keyof Hand] as number) >= 5,
    );
    for (const s of highCandidates) {
      const natBid = BID_ORDER.find(
        (b, i) => i > floorIdxHigh && b.endsWith(suitSymbol(s)),
      );
      if (!natBid) continue;
      const natLevel = parseInt(natBid[0]);
      const gameLevel = s === "hearts" || s === "spades" ? 4 : 5;
      if (hcp >= 13 && natLevel <= gameLevel) {
        return {
          bid: natBid,
          category: `Natural ${natBid} (Negative Double Off Above 2♠)`,
          reasoning: `RHO's ${overcall} is above 2♠, so a negative double is OFF — a double here would be penalty. With ${hcp} HCP and a 5+ card ${s} suit, bid it naturally at the level the preempt forces.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: `5+ ${s}, opening values (13+ pts). Natural and constructive at this level.`,
          expectedResponses: [],
          confidence: "medium",
        };
      }
    }
    // Raise partner with a real fit and near-invitational values.
    const fitSuitName = openerBid.includes("♠")
      ? "spades"
      : openerBid.includes("♥")
        ? "hearts"
        : openerBid.includes("♦")
          ? "diamonds"
          : "clubs";
    const fitLen = hand[fitSuitName as keyof Hand] as number;
    const tpFit = calcTPWithFit(hand);
    // Vulnerable, a high-level competitive raise needs real extras — going
    // for -200/-500 against a partscore is the classic vulnerable disaster.
    const weAreVul = vul === "we-only" || vul === "both";
    if (fitLen >= 4 && tpFit >= (weAreVul ? 13 : 11)) {
      const raiseBid = BID_ORDER.find(
        (b, i) => i > floorIdxHigh && b.endsWith(suitSymbol(fitSuitName)),
      );
      const raiseGame =
        fitSuitName === "hearts" || fitSuitName === "spades" ? 4 : 5;
      if (raiseBid && parseInt(raiseBid[0]) <= raiseGame) {
        return {
          bid: raiseBid,
          category: "Competitive Raise (Negative Double Off Above 2♠)",
          reasoning: `RHO's ${overcall} is above 2♠, so a negative double is OFF. With ${fitLen}-card support for partner's ${fitSuitName} and ${tpFit} support points, compete with a raise to ${raiseBid} rather than selling out to the preempt.${weAreVul ? " (You are vulnerable — this raise promises the extra values it shows.)" : " Not vulnerable, the raise also works as an advance sacrifice if the opponents can make their contract."}`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: `${fitLen}-card ${fitSuitName} support with competitive values (11+ support pts).`,
          expectedResponses: [],
          confidence: "medium",
        };
      }
    }
    return {
      bid: "Pass",
      category: "Pass (Negative Double Off Above 2♠)",
      reasoning: `SAYC negative doubles apply only through 2♠ — over RHO's ${overcall}, a double would be PENALTY, not takeout. With ${hcp} HCP and no suit strong enough to bid at this level (a new suit here shows roughly 13+ points and 5+ cards), pass. Partner still has a chance to act.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "Nothing promised — could be weak, or trapping with values the preempt shut out.",
      expectedResponses: [],
      confidence: "high",
      note: "Negative doubles are OFF above 2♠ in SAYC. A double of a 3-level (or higher) overcall is for penalty.",
    };
  }

  // ── Prefer a NATURAL bid when one is available ──────────────────────────────
  // SAYC: the negative double is for hands that CANNOT bid their suit directly.
  // With a 5+ card unbid suit and enough strength for the required level, bid it.
  const overcallIdxND = BID_ORDER.indexOf(overcall);
  const naturalCandidates = (
    ["spades", "hearts", "diamonds", "clubs"] as const
  ).filter(
    (s) =>
      !openerBid.includes(suitSymbol(s)) &&
      !overcall.includes(suitSymbol(s)) &&
      (hand[s as keyof Hand] as number) >= 5,
  );
  // …but the negative double still comes FIRST when it shows a 4-card unbid
  // MAJOR this hand actually holds — the major fit outranks a minor suit, and
  // a 2-level new suit needs a full 10+ points anyway.
  const dblWouldShowMyMajor = (["hearts", "spades"] as const).some(
    (m) =>
      !openerBid.includes(suitSymbol(m)) &&
      !overcall.includes(suitSymbol(m)) &&
      (hand[m] as number) >= 4 &&
      (hand[m] as number) <= 4,
  );
  for (const s of naturalCandidates) {
    const natBid = BID_ORDER.find(
      (b, i) => i > overcallIdxND && b.endsWith(suitSymbol(s)),
    );
    if (!natBid) continue;
    const natLevel = parseInt(natBid[0]);
    const natIsMinor = s === "clubs" || s === "diamonds";
    if (natIsMinor && dblWouldShowMyMajor) continue;
    if ((natLevel === 1 && hcp >= 6) || (natLevel === 2 && hcp >= 10)) {
      return {
        bid: natBid,
        category: `Natural ${natBid} (Prefer Suit Bid over Negative Double)`,
        reasoning: `You hold a 5+ card ${s} suit and enough strength (${hcp} HCP) to bid it directly at the ${natLevel}-level. The negative double is reserved for hands that CANNOT bid their suit — show this one naturally.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `5+ ${s}, ${natLevel === 2 ? "10+" : "6+"} pts. ${natLevel === 1 ? "One-round force." : "Constructive."}`,
        expectedResponses: [],
        confidence: "high",
      };
    }
  }

  // ── 4+ card support for partner's suit (after natural-suit preference) ────
  // With 4+ card support, a raise describes the hand better than a negative
  // double.  (3-card raises are a last resort — see fallback below.)
  const partnerSuitNameND = openerBid.includes("♠")
    ? "spades"
    : openerBid.includes("♥")
      ? "hearts"
      : openerBid.includes("♦")
        ? "diamonds"
        : openerBid.includes("♣")
          ? "clubs"
          : null;
  const partnerFitND = partnerSuitNameND
    ? (hand[partnerSuitNameND as keyof Hand] as number)
    : 0;
  if (
    partnerSuitNameND &&
    partnerFitND >= 4 &&
    (partnerSuitNameND === "hearts" ||
      partnerSuitNameND === "spades" ||
      partnerFitND >= 5) &&
    !overcall.endsWith("NT") &&
    overcall.slice(1) !== openerBid.slice(1)
  ) {
    const overcallIdxR = BID_ORDER.indexOf(overcall);
    const sym = suitSymbol(partnerSuitNameND);
    const minRaise = BID_ORDER.find(
      (b, i) => i > overcallIdxR && b.endsWith(sym),
    );
    // A fit with partner is established here, so re-value with SHORT-suit
    // (ruffing) support points, not long-suit TP.
    const tpND = calcTPWithFit(hand);
    // 10+ with support: the CUEBID of the overcalled suit is the
    // limit-raise-OR-BETTER — direct raises (including jumps) are weak/
    // competitive in competition, so all real raises go through the cue.
    if (tpND >= 10 && minRaise && parseInt(minRaise[0]) <= 3) {
      const cueBidND = BID_ORDER.find(
        (b, i) =>
          i > BID_ORDER.indexOf(overcall) && b.endsWith(overcall.slice(1)),
      );
      if (cueBidND && parseInt(cueBidND[0]) <= 3) {
        return {
          bid: cueBidND,
          category:
            tpND >= 13
              ? "Cuebid Raise (13+, Game Forcing)"
              : "Cuebid Raise (10-12, Limit Raise or Better)",
          reasoning: `Partner opened ${openerBid} and you hold ${partnerFitND}-card support with ${tpND} TP. In competition, direct raises — even jumps — are WEAK/preemptive, so the cuebid of the overcalled suit (${cueBidND}) carries every raise of limit strength or better.${tpND >= 13 ? " With game-going values you will insist on game." : " With 10-12, pass partner's minimum signoff."}`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: `${partnerFitND}-card ${partnerSuitNameND} support, ${tpND >= 13 ? "13+ pts — game-forcing" : "10-12 pts — limit raise"}.`,
          expectedResponses: [
            { partnerBid: "Return to the suit", meaning: "Minimum opener" },
            { partnerBid: "Game", meaning: "Accepting with extras" },
          ],
          confidence: "high",
        };
      }
    }
    if (minRaise && parseInt(minRaise[0]) <= 3) {
      return {
        bid: minRaise,
        category:
          tpND >= 13
            ? "Raise (Game-Going Hand — Will Bid Again)"
            : tpND >= 10
              ? "Raise (Limit Values, Cue Unavailable)"
              : "Competitive Raise",
        reasoning: `Partner opened ${openerBid} and you hold ${partnerFitND}-card support — raising describes this hand better than a negative double. ${tpND >= 13 ? `With ${tpND} TP the hand is game-going: the preempt removed the forcing cuebid, so raise now and bid again over partner's sign-off.` : tpND >= 10 ? `With ${tpND} TP, make a limit raise.` : "With under 10 points, raise once competitively."}`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `${partnerFitND}-card ${partnerSuitNameND} support, ${tpND >= 13 ? "13+ pts — I will bid again over a sign-off" : tpND >= 10 ? "10-12 pts (limit raise)" : "6-9 pts (competitive)"}.`,
        expectedResponses: [
          { partnerBid: "Pass", meaning: "Minimum opener" },
          { partnerBid: "Game", meaning: "Extra values" },
        ],
        confidence: "high",
      };
    }
  }

  // ── Shape check: a negative double PROMISES the unbid major(s) ─────────────
  const shapeOk =
    heartsUnbid && spadesUnbid
      ? hand.hearts >= 4 && hand.spades >= 4
      : heartsUnbid
        ? hand.hearts >= 4
        : spadesUnbid
          ? hand.spades >= 4
          : // no unbid major: double implies both unbid minors
            hand.diamonds >= 4 && hand.clubs >= 4;
  if (!shapeOk) {
    // ── Fallback: 3-card raise when no double/natural bid is available ─────────
    const partnerSuitNameND = openerBid.includes("♠")
      ? "spades"
      : openerBid.includes("♥")
        ? "hearts"
        : openerBid.includes("♦")
          ? "diamonds"
          : openerBid.includes("♣")
            ? "clubs"
            : null;
    const partnerFitND = partnerSuitNameND
      ? (hand[partnerSuitNameND as keyof Hand] as number)
      : 0;
    if (
      partnerSuitNameND &&
      partnerFitND >= 3 &&
      (partnerSuitNameND === "hearts" ||
        partnerSuitNameND === "spades" ||
        partnerFitND >= 4) &&
      !overcall.endsWith("NT") &&
      overcall.slice(1) !== openerBid.slice(1)
    ) {
      const overcallIdxR = BID_ORDER.indexOf(overcall);
      const sym = suitSymbol(partnerSuitNameND);
      const minRaise = BID_ORDER.find(
        (b, i) => i > overcallIdxR && b.endsWith(sym),
      );
      const tpND = analysis.tp;
      // 10+ with support: the CUEBID of the overcalled suit is the
      // limit-raise-OR-BETTER — direct raises (including jumps) are weak/
      // competitive in competition, so all real raises go through the cue.
      if (tpND >= 10 && minRaise && parseInt(minRaise[0]) <= 3) {
        const cueBidND = BID_ORDER.find(
          (b, i) =>
            i > BID_ORDER.indexOf(overcall) && b.endsWith(overcall.slice(1)),
        );
        if (cueBidND && parseInt(cueBidND[0]) <= 3) {
          return {
            bid: cueBidND,
            category:
              tpND >= 13
                ? "Cuebid Raise (13+, Game Forcing)"
                : "Cuebid Raise (10-12, Limit Raise or Better)",
            reasoning: `Partner opened ${openerBid} and you hold ${partnerFitND}-card support with ${tpND} TP. In competition, direct raises — even jumps — are WEAK/preemptive, so the cuebid of the overcalled suit (${cueBidND}) carries every raise of limit strength or better.${tpND >= 13 ? " With game-going values you will insist on game." : " With 10-12, pass partner's minimum signoff."}`,
            handAnalysis: analysis,
            whatYourBidTellsPartner: `${partnerFitND}-card ${partnerSuitNameND} support, ${tpND >= 13 ? "13+ pts — game-forcing" : "10-12 pts — limit raise"}.`,
            expectedResponses: [
              { partnerBid: "Return to the suit", meaning: "Minimum opener" },
              { partnerBid: "Game", meaning: "Accepting with extras" },
            ],
            confidence: "high",
          };
        }
      }
      if (minRaise && parseInt(minRaise[0]) <= 3) {
        return {
          bid: minRaise,
          category:
            tpND >= 13
              ? "Raise (Game-Going Hand — Will Bid Again)"
              : tpND >= 10
                ? "Raise (Limit Values, Cue Unavailable)"
                : "Competitive Raise",
          reasoning: `Partner opened ${openerBid} and you hold ${partnerFitND}-card support — raising describes this hand better than a negative double. ${tpND >= 13 ? `With ${tpND} TP the hand is game-going: the preempt removed the forcing cuebid, so raise now and bid again over partner's sign-off.` : tpND >= 10 ? `With ${tpND} TP, make a limit raise.` : "With under 10 points, raise once competitively."}`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: `${partnerFitND}-card ${partnerSuitNameND} support, ${tpND >= 13 ? "13+ pts — I will bid again over a sign-off" : tpND >= 10 ? "10-12 pts (limit raise)" : "6-9 pts (competitive)"}.`,
          expectedResponses: [
            { partnerBid: "Pass", meaning: "Minimum opener" },
            { partnerBid: "Game", meaning: "Extra values" },
          ],
          confidence: "high",
        };
      }
    }

    // Before passing: a 4+ card unbid major biddable at the 1-level is a natural,
    // forcing response — show it rather than passing with values.  (A negative
    // double would promise BOTH majors; with a single major you bid it.)
    const floorIdxND = Math.max(
      BID_ORDER.indexOf(openerBid),
      isRealBid(overcall) ? BID_ORDER.indexOf(overcall) : -1,
    );
    const oneLevelMajor: { name: string; bid: string } | null =
      spadesUnbid && hand.spades >= 4 && BID_ORDER.indexOf("1♠") > floorIdxND
        ? { name: "spades", bid: "1♠" }
        : heartsUnbid &&
            hand.hearts >= 4 &&
            BID_ORDER.indexOf("1♥") > floorIdxND
          ? { name: "hearts", bid: "1♥" }
          : null;
    if (oneLevelMajor && hcp >= 6) {
      return {
        bid: oneLevelMajor.bid,
        category: "New Suit at 1 Level After Overcall (4+ major)",
        reasoning: `After partner's ${openerBid} and the ${overcall} overcall, bid your 4+ card ${oneLevelMajor.name} suit at the 1-level. A new suit by responder is natural and forcing — show the major rather than passing or making a negative double (which would promise both majors).`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `4+ ${oneLevelMajor.name}, 6+ HCP. Forcing one round.`,
        expectedResponses: [
          {
            partnerBid: "Raise",
            meaning: `3+ card ${oneLevelMajor.name} support`,
          },
          { partnerBid: "Rebid", meaning: "Describes opener's hand" },
        ],
        confidence: "high",
      };
    }

    return {
      bid: "Pass",
      category: "Pass (Wrong Shape for Negative Double)",
      reasoning: `A negative double here promises ${heartsUnbid && spadesUnbid ? "4+ cards in BOTH majors" : heartsUnbid ? "4+ hearts" : spadesUnbid ? "4+ spades" : "both unbid minors"}, which this hand does not hold. With no suit to bid directly either, pass — partner gets another chance.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Nothing promised — could be weak or trapping.",
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
  /** The auction's opening bid — a "new suit" advance must never be the suit
   *  the opponents OPENED (partner reads that as a cuebid, not natural). */
  auctionOpeningBid?: string,
): BidRecommendation {
  const analysis = analyzeHand(hand);
  const { hcp } = hand;
  // Is the opponent's bid a real suit (not NT, Double, Pass, or absent)?
  // If so, a stopper in *their* suit is required for NT bids.
  const opponentBidSuit =
    opponentBid &&
    !opponentBid.endsWith("NT") &&
    opponentBid !== "Pass" &&
    opponentBid !== "Double" &&
    opponentBid !== "Redouble" &&
    /[♠♥♦♣]/.test(opponentBid);
  const partnerSuit = partnerBid.includes("♠")
    ? "spades"
    : partnerBid.includes("♥")
      ? "hearts"
      : partnerBid.includes("♦")
        ? "diamonds"
        : "clubs";
  const mySupport = hand[partnerSuit as keyof Hand] as number;

  if (mySupport >= 3) {
    // Over the opponents' NT (no suit to cue), a 10+ hand with support makes
    // a direct INVITATIONAL raise — the "cuebid = limit raise" tool needs an
    // enemy SUIT; defaulting the cue to clubs invented a bid in an unbid suit.
    if (hcp >= 10 && !opponentBidSuit) {
      const invRaiseNT = BID_ORDER.find(
        (b, i) =>
          i > BID_ORDER.indexOf(partnerBid) &&
          b.endsWith(suitSymbol(partnerSuit)),
      );
      if (invRaiseNT && parseInt(invRaiseNT[0]) <= 4) {
        return {
          bid: invRaiseNT,
          category: "Invitational Raise of the Overcall (10+ pts)",
          reasoning: `With ${hcp} HCP and ${mySupport}-card support for partner's ${partnerBid}, raise to ${invRaiseNT} — invitational. (The opponents bid notrump, so there is no enemy suit to cuebid; a direct raise carries the values message.)`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: `10+ pts with ${mySupport}-card support — invite game with a sound overcall.`,
          expectedResponses: [
            { partnerBid: "Game", meaning: "Sound overcall — accepting" },
            { partnerBid: "Pass", meaning: "Minimum — high enough" },
          ],
          confidence: "medium",
        };
      }
    }
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
      // The cue must clear the CURRENT floor — partner's overcall AND any
      // raise the opponents made on top of it (e.g. 1♣-(1♠)-2♣ → cue is 3♣,
      // available RIGHT NOW, not a round later).
      const floorIdx = Math.max(
        BID_ORDER.indexOf(partnerBid),
        opponentBid && !["Pass", "Double", "Redouble"].includes(opponentBid)
          ? BID_ORDER.indexOf(opponentBid)
          : -1,
      );
      const cueBid = BID_ORDER.find(
        (b, i) => i > floorIdx && b.endsWith(suitSymbol(opponentSuit)),
      );
      if (cueBid && parseInt(cueBid[0]) <= 3) {
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
      // No sensible cue available — fall through to the raise logic below.
    }

    // A single raise of partner's overcall promises real support values —
    // about 6-10 support points (HCP + shortness).  With only 3-card support
    // (an 8-card fit, where LoTT caps the side at the 2-level anyway) and a
    // near-bust, pass: raising on a flat minimum overstates the hand and can
    // push partner past a safe contract.  With 4+ trumps the extra trump and
    // shape justify a preemptive raise, so this floor only applies to a bare
    // 3-card raise.
    const supportPts = calcTPWithFit(hand);
    if (mySupport === 3 && supportPts < 6) {
      return {
        bid: "Pass",
        category: "Pass (Too Weak to Raise — 3-card support, under 6 pts)",
        reasoning: `You have 3-card support for partner's ${partnerBid} overcall, but only ${supportPts} support points (${hcp} HCP, no offsetting shortness). A single raise of an overcall shows about 6-10 support points; with a flat minimum this weak, raising overstates your hand and can push partner too high. Pass — partner's overcall is limited and you have no extra trumps or shape to bid on.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "Fewer than 6 support points with only 3 trumps — no raise; defending or awaiting developments.",
        expectedResponses: [],
        confidence: "high",
      };
    }

    // Law of Total Tricks: with N total trumps, your side is "safe" at the
    // (N − 6)-level (8 trumps → 2-level, 9 trumps → 3-level, 10 → 4-level).
    // If partner has already bid at or above the safe level, do NOT raise —
    // raising would put your side past where LoTT says you can make tricks.
    const partnerLevel = parseInt(partnerBid[0]) || 1;
    const suitSym = partnerBid.match(/[♣♦♥♠]/)?.[0] ?? "♠";
    const totalTrumps = 5 + mySupport;
    const lottSafeLevel = Math.min(4, Math.max(2, totalTrumps - 6));

    if (partnerLevel >= lottSafeLevel) {
      return {
        bid: "Pass",
        category: `Pass (Already At Safe Level — ${mySupport}-card support, 0-9 pts)`,
        reasoning: `Partner overcalled at the ${partnerLevel}-level.  With ${mySupport}-card support (est. ${totalTrumps} total trumps), the Law of Total Tricks says your side is safe at the ${lottSafeLevel}-level — partner is already there.  Raising further would commit to more tricks than your trump fit can usually take.  Pass and let partner play the contract.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `${mySupport}-card support, 0-9 pts — accepting partner's overcall as the final contract.`,
        expectedResponses: [],
        confidence: "high",
      };
    }

    // The raise must also clear the CURRENT floor (the opponents may have bid
    // over partner's overcall).  If the Law's safe level is already below the
    // floor, do not raise at all.
    const raiseFloorIdx = Math.max(
      BID_ORDER.indexOf(partnerBid),
      opponentBid && isRealBid(opponentBid)
        ? BID_ORDER.indexOf(opponentBid)
        : -1,
    );
    const raiseLevel = lottSafeLevel;
    const specificBid = `${raiseLevel}${suitSym}`;
    if (BID_ORDER.indexOf(specificBid) <= raiseFloorIdx) {
      return {
        bid: "Pass",
        category: `Pass (Opponents Above Our Safe Level — ${mySupport}-card support)`,
        reasoning: `With ${mySupport}-card support (est. ${totalTrumps} total trumps), the Law of Total Tricks says your side is safe only to the ${lottSafeLevel}-level — and the opponents have already bid past it. Raising now would commit to more tricks than the trump fit can usually deliver. Pass and let them play there (or let partner act with extra shape).`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `${mySupport}-card support but nothing to say above the Law's safe level.`,
        expectedResponses: [],
        confidence: "high",
      };
    }
    const lawExplanation =
      mySupport === 3
        ? `With 3-card support (est. ${totalTrumps} total trumps), the Law of Total Tricks says bid to the ${raiseLevel}-level.`
        : mySupport === 4
          ? `With 4-card support (est. ${totalTrumps} total trumps), a preemptive raise to ${raiseLevel} takes away opponent bidding space.`
          : `With ${mySupport}-card support (est. ${totalTrumps} total trumps), raise aggressively to ${raiseLevel}.`;

    return {
      bid: specificBid,
      category:
        hcp >= 10
          ? `Raise to ${raiseLevel}-Level (10+ pts, no cuebid available, ${mySupport}-card support)`
          : `Raise to ${raiseLevel}-Level (0-9 pts, ${mySupport}-card support)`,
      reasoning: `${lawExplanation} ${hcp >= 10 ? "You hold 10+ points but no convenient cuebid was available — raise now and judge whether to bid on later." : "This is a competitive raise — it shows support and limits your hand to 0-9 pts."}`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `${mySupport}-card support, ${hcp >= 10 ? "10+ pts (cuebid was unavailable — expect more than a normal competitive raise)" : "0-9 pts"} — competitive raise.`,
      expectedResponses: [],
      confidence: "high",
    };
  }

  // ── New-suit advance: I have my own good 5+ card suit (not partner's, not the
  // opponent's) and no fit for partner.  A new suit by the advancer is natural
  // and non-forcing (constructive), so showing it beats passing or bidding NT
  // with a singleton in partner's suit.  Bid it at the cheapest legal level.
  // Gated to UNBALANCED hands (a balanced hand prefers an NT advance), and the
  // no-stopper-vs-opponent-suit case is left to the dedicated branches below.
  const oppSuitName = opponentBidSuit
    ? opponentBid!.includes("♠")
      ? "spades"
      : opponentBid!.includes("♥")
        ? "hearts"
        : opponentBid!.includes("♦")
          ? "diamonds"
          : "clubs"
    : null;
  const noStopperCase =
    !!opponentBidSuit && hand.hasStopperInOpponentSuit === false;
  if (!analysis.isBalanced && !noStopperCase) {
    const openedSuitNameSOC =
      auctionOpeningBid && !auctionOpeningBid.endsWith("NT")
        ? auctionOpeningBid.includes("♠")
          ? "spades"
          : auctionOpeningBid.includes("♥")
            ? "hearts"
            : auctionOpeningBid.includes("♦")
              ? "diamonds"
              : "clubs"
        : null;
    const myCandidate = (["spades", "hearts", "diamonds", "clubs"] as const)
      .filter(
        (s) =>
          s !== partnerSuit &&
          s !== oppSuitName &&
          // Never advance "naturally" in the suit the opponents OPENED —
          // partner reads that as a cuebid (limit-raise-or-better).
          s !== openedSuitNameSOC &&
          (hand[s as keyof Hand] as number) >= 5,
      )
      // Prefer the longest such suit (ties: the natural array order is fine).
      .sort(
        (a, b) =>
          (hand[b as keyof Hand] as number) - (hand[a as keyof Hand] as number),
      )[0];
    if (myCandidate) {
      // The floor is the HIGHEST live call — partner's overcall AND anything
      // the opponents bid on top of it (e.g. after (1NT)-2♣-(2♠), a heart
      // advance must be 3♥, never an illegal 2♥).
      const floorIdx = Math.max(
        BID_ORDER.indexOf(partnerBid),
        opponentBid && isRealBid(opponentBid)
          ? BID_ORDER.indexOf(opponentBid)
          : -1,
      );
      const newSuitBid = BID_ORDER.find(
        (b, i) => i > floorIdx && b.endsWith(suitSymbol(myCandidate)),
      );
      const newSuitLevel = newSuitBid ? parseInt(newSuitBid[0]) : 99;
      // A 2/3-level new suit should describe a genuinely distributional hand —
      // a 6+ card suit or real shortness (singleton/void).  A flat 5-4-2-2 with
      // a 5-card minor is better shown as a 1NT advance, so it must NOT qualify.
      const distributionalEnough =
        (hand[myCandidate as keyof Hand] as number) >= 6 ||
        hasVoid(hand) ||
        [hand.spades, hand.hearts, hand.diamonds, hand.clubs].some(
          (c) => c === 1,
        );
      const enoughForLevel =
        (newSuitLevel === 1 && hcp >= 6) ||
        (newSuitLevel === 2 && hcp >= 10 && distributionalEnough) ||
        (newSuitLevel === 3 && hcp >= 10 && distributionalEnough);
      if (newSuitBid && enoughForLevel) {
        return {
          bid: newSuitBid,
          category: `New Suit Advance (${newSuitBid}, ${hand[myCandidate as keyof Hand]}-card suit)`,
          reasoning: `You have no fit for partner's ${partnerBid} (only ${mySupport} ${partnerSuit}) but hold a ${hand[myCandidate as keyof Hand]}-card ${myCandidate} suit. A new suit advancing partner's overcall is natural and non-forcing — bid ${newSuitBid} to show it. ${newSuitLevel === 1 ? "At the 1-level this is cheap and constructive (about 6+ pts)." : `At the ${newSuitLevel}-level it shows about 10+ pts and a good, shapely suit.`}`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: `${hand[myCandidate as keyof Hand]}-card ${myCandidate}, ${newSuitLevel === 1 ? "6+" : "10+"} pts, no fit for your ${partnerSuit}. Natural and non-forcing.`,
          expectedResponses: [],
          confidence: newSuitLevel >= 3 ? "medium" : "high",
        };
      }
    }
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
  const noFitNote = `You have only ${mySupport} ${partnerSuit} (need 3+ to support), so there is no trump fit with partner.`;

  // The opponents' suit (oppSuitName, computed above) and partner's suit are NOT
  // biddable as a "longest suit" — bidding into the enemy suit is a cuebid, not
  // natural.  Longest suit I can actually bid (not partner's, not opponents'):
  const myBiddableSuit = (["spades", "hearts", "diamonds", "clubs"] as const)
    .filter((s) => s !== partnerSuit && s !== oppSuitName)
    .sort((a, b) => (hand[b] as number) - (hand[a] as number))[0];
  const myBiddableLen = myBiddableSuit ? (hand[myBiddableSuit] as number) : 0;
  // Floor = the highest live call so far (partner's overcall and any opp bid).
  const advanceFloorIdx = Math.max(
    BID_ORDER.indexOf(partnerBid),
    opponentBid && isRealBid(opponentBid) ? BID_ORDER.indexOf(opponentBid) : -1,
  );
  // Cheapest legal natural bid of my biddable suit above that floor.
  const cheapestMySuit = myBiddableSuit
    ? BID_ORDER.find(
        (b, i) => i > advanceFloorIdx && b.endsWith(suitSymbol(myBiddableSuit)),
      )
    : undefined;

  // When NT is unavailable (no stopper) and I have no SAFE suit to introduce,
  // there is nothing to do — pass — rather than bid into the opponents' suit.
  // A suit needs 4+ cards to show at the 2/3 level, but introducing a new suit
  // at the 4-level needs a real 5+ card suit.
  const cheapestMySuitLevel = cheapestMySuit ? parseInt(cheapestMySuit[0]) : 99;
  const noSafeSuitBid =
    !cheapestMySuit ||
    cheapestMySuitLevel > 4 ||
    (cheapestMySuitLevel === 4 ? myBiddableLen < 5 : myBiddableLen < 4);

  // High-level advance: partner overcalled at the 3-level (or the auction is
  // otherwise past 2NT).  The natural 1NT/2NT response rungs below are no longer
  // available, so a balanced game-going hand WITH a stopper bids 3NT directly
  // (preferred over forcing a 4-level minor) rather than falling through to a
  // phantom "auction past" pass.  Without a stopper, the no-stopper branches
  // above/below handle it (safe suit or pass).
  const cheapestNTIdx = BID_ORDER.findIndex(
    (b, i) => i > advanceFloorIdx && b.endsWith("NT"),
  );
  const cheapestNT = cheapestNTIdx >= 0 ? BID_ORDER[cheapestNTIdx] : undefined;
  const partnerOvercallLvlAdv = parseInt(partnerBid[0]) || 1;
  if (
    cheapestNT === "3NT" &&
    hand.hasStopperInOpponentSuit !== false &&
    // Partner's own overcall must be HIGH (3-level = sound values) for 11 HCP
    // to make game; when only the OPPONENTS pushed the floor past 2NT,
    // partner's low overcall may be weak — 3NT then needs a full 15+.
    ((partnerOvercallLvlAdv >= 3 && hcp >= 11) || hcp >= 15)
  ) {
    return {
      bid: "3NT",
      category: "3NT Advance Over High-Level Overcall",
      reasoning: `Partner overcalled ${partnerBid}, showing a long suit${partnerOvercallLvlAdv >= 3 ? " and sound values" : ""}. With ${hcp} HCP, a stopper in the opponents' suit, and no fit for partner, bid 3NT — the natural game. ${noFitNote}`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "Game values with a stopper, no fit — choosing notrump game.",
      expectedResponses: [],
      confidence: "medium",
    };
  }

  if (hcp >= 9 && hcp <= 12) {
    if (opponentBidSuit && hand.hasStopperInOpponentSuit === false) {
      // No stopper in opponent's suit — cannot bid NT safely.  Bid my longest
      // BIDDABLE suit (never the opponents' suit) at the cheapest legal level;
      // if there is none, pass.
      if (noSafeSuitBid) {
        return {
          bid: "Pass",
          category: "Pass (No Stopper, No Biddable Suit)",
          reasoning: `With 9-12 pts but no stopper in the opponents' ${opponentBid} suit and no good unbid suit of your own to show, there is no safe action. ${noFitNote} Pass.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: "No stopper, no fit, no suit to show.",
          expectedResponses: [],
          confidence: "medium",
        };
      }
      return {
        bid: cheapestMySuit!,
        category: "Bid Longest Suit (No Stopper, 9-12 pts)",
        reasoning: `With 9-12 pts and no stopper in the opponent's ${opponentBid} suit, bidding NT is not safe. ${noFitNote} Bid your longest unbid suit (${cheapestMySuit}) to show values.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: "9-12 pts, no stopper — showing longest suit.",
        expectedResponses: [],
        confidence: "medium",
      };
    }
    const cheapestNTAdv = BID_ORDER.find(
      (b, i) => i > advanceFloorIdx && b.endsWith("NT"),
    );
    if (cheapestNTAdv !== "1NT") {
      // The auction is past 1NT — an NT advance would now show 13+ (2NT) or
      // more, which this hand does not have.  Pass.
      return {
        bid: "Pass",
        category: "Pass (NT Advance No Longer Fits the Hand)",
        reasoning: `With 9-12 pts, the natural advance of partner's overcall would be 1NT — but the auction is already past it (the cheapest notrump is ${cheapestNTAdv ?? "unavailable"}, which would promise 13+). ${noFitNote} Pass; partner's overcall was limited and nothing is forcing you to act.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "9-12 pts, no fit — nothing safe to say at this level.",
        expectedResponses: [],
        confidence: "high",
      };
    }
    return {
      bid: "1NT",
      category: "1NT Response to Overcall (9-12 pts)",
      reasoning: opponentBidSuit
        ? `With 9-12 pts and a stopper in the opponent's ${opponentBid} suit, bid 1NT. ${noFitNote}`
        : `With 9-12 pts, bid 1NT to show your balanced strength. ${noFitNote}`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: opponentBidSuit
        ? "9-12 pts, stopper in their suit, no fit."
        : "9-12 pts balanced, no fit for partner.",
      expectedResponses: [],
      confidence:
        opponentBidSuit && hand.hasStopperInOpponentSuit ? "high" : "medium",
    };
  }
  if (hcp >= 13 && hcp <= 14) {
    if (opponentBidSuit && hand.hasStopperInOpponentSuit === false) {
      if (noSafeSuitBid) {
        return {
          bid: "Pass",
          category: "Pass (No Stopper, No Biddable Suit)",
          reasoning: `With 13-14 pts but no stopper in the opponents' ${opponentBid} suit and no good unbid suit of your own to show, there is no safe action. ${noFitNote} Pass.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: "No stopper, no fit, no suit to show.",
          expectedResponses: [],
          confidence: "medium",
        };
      }
      return {
        bid: cheapestMySuit!,
        category: "Bid Longest Suit (No Stopper, 13-14 pts)",
        reasoning: `With 13-14 pts and no stopper in the opponent's ${opponentBid} suit, you cannot safely bid 2NT. ${noFitNote} Bid your longest unbid suit (${cheapestMySuit}) to show your values.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "13-14 pts, no stopper — showing longest suit.",
        expectedResponses: [],
        confidence: "medium",
      };
    }
    const cheapestNTAdv2 = BID_ORDER.find(
      (b, i) => i > advanceFloorIdx && b.endsWith("NT"),
    );
    const ntAdvBid2 =
      cheapestNTAdv2 && parseInt(cheapestNTAdv2[0]) <= 2
        ? cheapestNTAdv2
        : undefined;
    if (!ntAdvBid2) {
      return {
        bid: "Pass",
        category: "Pass (NT Advance No Longer Fits the Hand)",
        reasoning: `With 13-14 pts, the natural invitational advance would be 2NT — but the auction is already past it. ${noFitNote} Pass rather than overstate the hand at the 3-level.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "13-14 pts, no fit — nothing safe at this level.",
        expectedResponses: [],
        confidence: "medium",
      };
    }
    return {
      bid: ntAdvBid2,
      category: `${ntAdvBid2} Response to Overcall (13-14 pts)`,
      reasoning: opponentBidSuit
        ? `With 13-14 pts and a stopper in the opponent's ${opponentBid} suit, bid ${ntAdvBid2}. ${noFitNote}`
        : `With 13-14 pts, bid ${ntAdvBid2} to invite game. ${noFitNote}`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: opponentBidSuit
        ? "13-14 pts, stopper in their suit."
        : "13-14 pts balanced, inviting game.",
      expectedResponses: [],
      confidence:
        opponentBidSuit && hand.hasStopperInOpponentSuit ? "high" : "medium",
    };
  }
  if (opponentBidSuit && hand.hasStopperInOpponentSuit === false) {
    if (noSafeSuitBid) {
      return {
        bid: "Pass",
        category: "Pass (No Stopper, No Biddable Suit)",
        reasoning: `With 15+ pts but no stopper in the opponents' ${opponentBid} suit and no good unbid suit of your own to show, there is no safe game contract. ${noFitNote} Pass.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: "No stopper, no fit, no suit to show.",
        expectedResponses: [],
        confidence: "low",
      };
    }
    return {
      bid: cheapestMySuit!,
      category: "Bid Longest Suit (No Stopper, 15+ pts)",
      reasoning: `With 15+ pts and no stopper in the opponent's ${opponentBid} suit, you cannot safely bid 3NT. ${noFitNote} Bid your longest unbid suit (${cheapestMySuit}) to force game.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "15+ pts, no stopper — forcing in longest suit.",
      expectedResponses: [],
      confidence: "medium",
    };
  }
  const cheapestNTAdv3 = BID_ORDER.find(
    (b, i) => i > advanceFloorIdx && b.endsWith("NT"),
  );
  const ntAdvBid3 =
    cheapestNTAdv3 && parseInt(cheapestNTAdv3[0]) <= 3
      ? cheapestNTAdv3 === "1NT" || cheapestNTAdv3 === "2NT"
        ? "3NT"
        : cheapestNTAdv3
      : undefined;
  if (!ntAdvBid3) {
    return {
      bid: "Pass",
      category: "Pass (NT Game No Longer Available)",
      reasoning: `With 15+ pts the natural call would be 3NT, but the auction is already past it. ${noFitNote} Pass and take the penalty/plus score rather than guess at a higher contract.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "15+ pts, no fit — no safe game left to bid.",
      expectedResponses: [],
      confidence: "medium",
    };
  }
  return {
    bid: ntAdvBid3,
    category: `${ntAdvBid3} Response to Overcall (15+ pts)`,
    reasoning: opponentBidSuit
      ? `With 15+ pts and a stopper in the opponent's ${opponentBid} suit, bid ${ntAdvBid3}. ${noFitNote}`
      : `With 15+ pts, bid ${ntAdvBid3} to play game. ${noFitNote}`,
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
  const partnerSuit = partnerBid.includes("♠")
    ? "spades"
    : partnerBid.includes("♥")
      ? "hearts"
      : partnerBid.includes("♦")
        ? "diamonds"
        : "clubs";
  const mySupport = hand[partnerSuit as keyof Hand] as number;
  // Raising the jump overcall establishes a fit — value with short-suit points.
  const supportTP = calcTPWithFit(hand);

  const isMajorJOC = partnerSuit === "hearts" || partnerSuit === "spades";
  const jumpLevelJOC = parseInt(partnerBid[0]) || 2;

  // Partner's weak jump overcall shows ~5-11 HCP and a 6-card suit. Game
  // needs REAL values opposite that — about 16+ support points.
  if (mySupport >= 3 && supportTP >= 16) {
    const gameBid = isMajorJOC ? `4${suitSymbol(partnerSuit)}` : "3NT";
    return {
      bid: gameBid,
      category: "Game over Weak Jump Overcall (16+ support pts)",
      reasoning: `Partner's weak jump overcall showed about 5-11 HCP with a good 6-card ${partnerSuit} suit. With ${supportTP} support points (16+) and ${mySupport}-card support, the combined values justify game: bid ${gameBid}.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Real values (16+ support pts) — to play.",
      expectedResponses: [],
      confidence: "high",
      note: isMajorJOC
        ? undefined
        : "3NT needs stoppers in the unbid suits — with an unstopped suit, prefer raising partner's minor instead.",
    };
  }

  // Anything less: raises of a preempt are PREEMPTIVE (Law of Total Tricks),
  // not invitational — raise to the trump-count level, never to invite.
  if (mySupport >= 3) {
    const totalTrumps = 6 + mySupport;
    const lottLevel = Math.min(totalTrumps - 6, isMajorJOC ? 4 : 5);
    if (lottLevel > jumpLevelJOC) {
      const lottBid = `${lottLevel}${suitSymbol(partnerSuit)}`;
      return {
        bid: lottBid,
        category: "Preemptive Raise of Jump Overcall (Law of Total Tricks)",
        reasoning: `Partner's weak jump overcall showed a 6-card ${partnerSuit} suit; your ${mySupport}-card support makes ${totalTrumps} trumps, so the Law of Total Tricks says the ${lottLevel}-level is safe. Raise to ${lottBid} — this FURTHERS THE PREEMPT and is NOT invitational; partner must pass.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `${mySupport}-card support — extending the barrage per the Law of Total Tricks. Not invitational: do not bid again.`,
        expectedResponses: [
          { partnerBid: "Pass", meaning: "Always — the raise is to play" },
        ],
        confidence: "high",
      };
    }
    return {
      bid: "Pass",
      category: "Pass (Preempt Already at the Law Level)",
      reasoning: `With ${mySupport}-card support (${6 + mySupport} total trumps), the Law of Total Tricks says the ${lottLevel}-level is your side's safe height — partner's ${partnerBid} is already there. Without the 16+ support points game would need, pass.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "No safe raise available — the preempt stands.",
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
  opponentBid: string,
  /** Partner's FIRST real bid — when it was NOTRUMP (a 1NT overcall or
   *  opening), their later double of the opponents' runout is
   *  penalty-suggestive (maximum, their suit held), NOT takeout: the
   *  advancer sits with most hands instead of being forced to bid. */
  partnerFirstBid?: string,
  /** ALL of the opponents' real bids — the advance must avoid EVERY suit
   *  they bid (e.g. both the opening 1♣ and the doubled 1♥ response), not
   *  just the floor bid. */
  allOpponentBids?: string[],
): BidRecommendation {
  const analysis = analyzeHand(hand);
  const { hcp } = hand;
  // The opponent's bid is the floor an advance must clear.  In a REOPENING
  // double (e.g. 2♣-(2♠)-P-(P)-X) the floor can be at the 2-level, so a natural
  // 1NT/1-level suit advance is illegal — bids must be lifted above it.
  const oppIdx = isRealBid(opponentBid) ? BID_ORDER.indexOf(opponentBid) : -1;
  const clears = (bid: string) => BID_ORDER.indexOf(bid) > oppIdx;

  // ── Partner bid NOTRUMP earlier, then doubled the opponents' runout: the
  // double shows a MAXIMUM with their suit held (penalty-suggestive) — not
  // takeout.  Sit with almost everything; pull only a bust with a 6+ suit.
  if (partnerFirstBid?.endsWith("NT") && isRealBid(opponentBid)) {
    const longestPFB = (
      [
        ["spades", hand.spades],
        ["hearts", hand.hearts],
        ["diamonds", hand.diamonds],
        ["clubs", hand.clubs],
      ] as const
    ).reduce((a, b) => (b[1] > a[1] ? b : a));
    const pullBid = BID_ORDER.find(
      (b, i) => i > oppIdx && b.endsWith(suitSymbol(longestPFB[0])),
    );
    if (
      hcp <= 4 &&
      longestPFB[1] >= 6 &&
      pullBid &&
      parseInt(pullBid[0]) <= 3
    ) {
      return {
        bid: pullBid,
        category: "Pull Partner's Penalty-Suggestive Double (Bust + 6+ Suit)",
        reasoning: `Partner bid ${partnerFirstBid} and then doubled the opponents' ${opponentBid} — that shows a MAXIMUM with their suit held (penalty-suggestive), not takeout. Normally you pass and defend, but with a bust (${hcp} HCP) and a ${longestPFB[1]}-card ${longestPFB[0]} suit, ${pullBid} rates to be safer than defending with no entries.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `A bust with long ${longestPFB[0]} — pulling to safety, not showing values.`,
        expectedResponses: [
          { partnerBid: "Pass", meaning: "Accepting the escape" },
        ],
        confidence: "medium",
      };
    }
    return {
      bid: "Pass",
      category: "Sit for the Double (Partner's NT + Double = Penalty)",
      reasoning: `Partner bid ${partnerFirstBid} and then doubled the opponents' ${opponentBid}. After a notrump bid, that double is PENALTY-SUGGESTIVE — a maximum with their runout suit held — not takeout, so you are NOT forced to bid. Pass and defend; partner's strength plus your ${hcp} HCP should beat ${opponentBid} doubled.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Defending — happy to sit for the double.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  // ── Partner doubled the opponents' 1NT: that double is PENALTY (16+), not
  // takeout — nobody is forced to bid.  Sit with any values; scramble to a
  // long suit only with a BUST.
  if (opponentBid === "1NT") {
    const longestRTD = (
      [
        ["spades", hand.spades],
        ["hearts", hand.hearts],
        ["diamonds", hand.diamonds],
        ["clubs", hand.clubs],
      ] as const
    ).reduce((a, b) => (b[1] > a[1] ? b : a));
    if (hcp <= 5 && longestRTD[1] >= 5) {
      const scrBid = `2${suitSymbol(longestRTD[0])}`;
      return {
        bid: scrBid,
        category: "Scramble Out of the Penalty Double (Bust + Long Suit)",
        reasoning: `Partner's double of 1NT is PENALTY (16+ HCP) — not takeout, so you are NOT forced to bid. But with only ${hcp} HCP the doubled 1NT may make, and your ${longestRTD[1]}-card ${longestRTD[0]} suit offers a safer spot: scramble to ${scrBid}. With any real values you would pass and defend instead.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `A bust (0-5) with long ${longestRTD[0]} — pulling to safety, not showing values.`,
        expectedResponses: [
          { partnerBid: "Pass", meaning: "Accepting the escape" },
        ],
        confidence: "medium",
      };
    }
    return {
      bid: "Pass",
      category: "Sit for the Penalty Double of 1NT",
      reasoning: `Partner's double of their 1NT is PENALTY, showing 16+ HCP. With ${hcp} HCP your side holds the balance of strength — pass and defend 1NT doubled. Only a bust with a long suit would pull.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Happy to defend 1NT doubled.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  // ── Partner doubled the opponents' 2NT/3NT: PENALTY with a source of
  // tricks (and lead-directing).  Sit — pulling overrides a decision partner
  // made with tricks in hand.
  if (opponentBid === "2NT" || opponentBid === "3NT") {
    return {
      bid: "Pass",
      category: `Sit for Partner's Penalty Double of ${opponentBid}`,
      reasoning: `Partner's double of the opponents' ${opponentBid} is PENALTY — it promises a source of tricks (usually a long running suit) and asks for a specific lead, not for you to bid. Pass and defend; pulling would trade partner's sure plus for a guess.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Defending — your double, your tricks.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  // ── Partner doubled a HIGH-LEVEL bid (4-level+): the double is OPTIONAL
  // ("do something intelligent"), not a command to bid.  Sit for penalty by
  // default; pull only with shortness in their suit AND a 5+ card suit that
  // can be shown without leaving the 5-level.
  const oppLvlRTD = isRealBid(opponentBid) ? parseInt(opponentBid[0]) : 0;
  if (oppLvlRTD >= 4) {
    const oppSuitRTD = opponentBid.includes("♠")
      ? "spades"
      : opponentBid.includes("♥")
        ? "hearts"
        : opponentBid.includes("♦")
          ? "diamonds"
          : opponentBid.includes("♣")
            ? "clubs"
            : undefined;
    const myOppLenRTD = oppSuitRTD
      ? (hand[oppSuitRTD as keyof Hand] as number)
      : 3;
    const pullCandidates = (["spades", "hearts", "diamonds", "clubs"] as const)
      .filter((sn) => sn !== oppSuitRTD && (hand[sn] as number) >= 5)
      .sort((a, b) => (hand[b] as number) - (hand[a] as number));
    const pullSuit = pullCandidates[0];
    const pullBid = pullSuit
      ? BID_ORDER.find((b, i) => i > oppIdx && b.endsWith(suitSymbol(pullSuit)))
      : undefined;
    if (myOppLenRTD <= 2 && pullSuit && pullBid && parseInt(pullBid[0]) <= 5) {
      return {
        bid: pullBid,
        category: "Pull the Optional Double (Shortness + Long Suit)",
        reasoning: `Partner's double of ${opponentBid} is OPTIONAL — "do something intelligent." With only ${myOppLenRTD} card(s) in their suit you have no defensive trump tricks, and your ${hand[pullSuit]}-card ${pullSuit} suit gives your side a real place to play: bid ${pullBid}. Passing with this shape would defend on air.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `5+ ${pullSuit}, short in their suit — offense over defense.`,
        expectedResponses: [
          { partnerBid: "Pass", meaning: "Accepting your suit" },
          { partnerBid: "Raise", meaning: "Extra values — pushing on" },
        ],
        confidence: "medium",
      };
    }
    return {
      bid: "Pass",
      category: "Convert the Optional Double to Penalty",
      reasoning: `Partner's double of ${opponentBid} is OPTIONAL — pass converts it to penalty. With ${myOppLenRTD} card(s) in their suit and no long suit worth introducing at the 5-level, defending doubled is the percentage action.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Content to defend — no long suit to run to.",
      expectedResponses: [],
      confidence: "medium",
    };
  }

  if (analysis.isBalanced && hcp >= 6 && hcp <= 10 && clears("1NT")) {
    if (hand.hasStopperInOpponentSuit === false) {
      // No stopper — fall through to bid longest suit
    } else {
      return {
        bid: "1NT",
        category: "1NT Response to Takeout Double (6-10 pts)",
        reasoning:
          "With 6-10 pts balanced and a stopper in the opponent's suit, bid 1NT.",
        handAnalysis: analysis,
        whatYourBidTellsPartner: "6-10 pts balanced, stopper in their suit.",
        expectedResponses: [],
        confidence: hand.hasStopperInOpponentSuit ? "high" : "medium",
      };
    }
  }
  if (analysis.isBalanced && hcp >= 11 && hcp <= 12 && clears("2NT")) {
    if (hand.hasStopperInOpponentSuit === false) {
      // No stopper — fall through to bid longest suit
    } else {
      return {
        bid: "2NT",
        category: "2NT Response to Double (11-12 pts)",
        reasoning: "With 11-12 pts and a stopper, bid 2NT.",
        handAnalysis: analysis,
        whatYourBidTellsPartner: "11-12 pts balanced, stopper.",
        expectedResponses: [],
        confidence: hand.hasStopperInOpponentSuit ? "high" : "medium",
      };
    }
  }
  if (hcp >= 13 && analysis.isBalanced) {
    if (hand.hasStopperInOpponentSuit === false) {
      // No stopper — fall through to bid longest suit
    } else {
      return {
        bid: "3NT",
        category: "3NT Response to Double (13-15 pts)",
        reasoning: "With 13-15 pts and a stopper, bid 3NT.",
        handAnalysis: analysis,
        whatYourBidTellsPartner: "13-15 pts balanced, stopper.",
        expectedResponses: [],
        confidence: hand.hasStopperInOpponentSuit ? "high" : "medium",
      };
    }
  }

  // Suit advances of a takeout double are graded by strength (SAYC):
  //   0-8:  best suit at the CHEAPEST level (forced — can be 0 points)
  //   9-11: JUMP in the best suit (invitational, still not forcing)
  //   12+:  CUE-BID the opponents' suit (game-forcing, asks doubler to describe)
  // The advance must be an UNBID suit — bidding the doubled suit itself would
  // be a cuebid (values).  Prefer majors; a 3-card suit is fine when forced.
  const suitNameOfAdv = (b: string): string | null =>
    isRealBid(b) && !b.endsWith("NT")
      ? b.includes("♠")
        ? "spades"
        : b.includes("♥")
          ? "hearts"
          : b.includes("♦")
            ? "diamonds"
            : "clubs"
      : null;
  const oppSuitNamesAdv = new Set(
    (allOpponentBids?.length ? allOpponentBids : [opponentBid])
      .map(suitNameOfAdv)
      .filter((n): n is string => !!n),
  );
  const longestName = (["spades", "hearts", "diamonds", "clubs"] as const)
    .filter((sn) => !oppSuitNamesAdv.has(sn))
    .sort((a, b) => {
      const lenDiff =
        (hand[b as keyof Hand] as number) - (hand[a as keyof Hand] as number);
      if (lenDiff !== 0) return lenDiff;
      // Tie: prefer the major.
      const isMajor = (x: string) => x === "spades" || x === "hearts";
      return (isMajor(b) ? 1 : 0) - (isMajor(a) ? 1 : 0);
    })[0];
  const sym = suitSymbol(longestName);
  let minLevel = 1;
  while (minLevel < 7 && !clears(`${minLevel}${sym}`)) minLevel++;
  const minSuitBid = `${minLevel}${sym}`;

  if (hcp >= 12 && isRealBid(opponentBid) && !opponentBid.endsWith("NT")) {
    const oppSuitSym = opponentBid.slice(1);
    const cueLevel = parseInt(opponentBid[0]) + 1;
    const cueBid = `${cueLevel}${oppSuitSym}`;
    if (cueLevel <= 4) {
      return {
        bid: cueBid,
        category: "Cue-Bid Advance of the Double (12+, Game-Forcing)",
        reasoning: `With ${hcp} HCP opposite partner's takeout double (12+), your side has the values for game but no clear strain yet. Cue-bid the opponents' suit (${cueBid}) — artificial and game-forcing — asking partner to describe their hand.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "12+ pts, game-forcing. No clear suit yet — describe your hand.",
        expectedResponses: [
          {
            partnerBid: "Cheapest suit",
            meaning: "Doubler's best suit — keep describing",
          },
          { partnerBid: "NT", meaning: "Stopper in their suit, balanced" },
        ],
        confidence: "medium",
      };
    }
  }

  if (hcp >= 9) {
    const gameLevel =
      longestName === "hearts" || longestName === "spades" ? 4 : 5;
    const jumpLevel = minLevel + 1;
    if (jumpLevel <= gameLevel) {
      return {
        bid: `${jumpLevel}${sym}`,
        category: "Jump Advance of the Double (9-11, Invitational)",
        reasoning: `With ${hcp} HCP opposite partner's takeout double, a minimum-level suit bid could be made on nothing — JUMP to ${jumpLevel}${sym} to show real values (9-11) and a decent 4+ card ${longestName} suit. Invitational, not forcing.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `9-11 pts with a decent ${longestName} suit — invite game.`,
        expectedResponses: [
          { partnerBid: "Game", meaning: "Extras — accepting the invite" },
          { partnerBid: "Pass", meaning: "Minimum double" },
        ],
        confidence: "high",
      };
    }
  }

  return {
    bid: minSuitBid,
    category: "Bid Longest Suit (Responding to Double)",
    reasoning: `With ${hcp} HCP, bid your best UNBID suit (${longestName}, ${hand[longestName]} cards) at the ${minLevel} level — the cheapest level that clears the opponents' ${opponentBid}. A takeout double is forcing on the advancer, so this bid can be made on 0+ points (even a 3-card suit when nothing better exists); never bid THEIR suit — that would be a cuebid showing values.`,
    handAnalysis: analysis,
    whatYourBidTellsPartner: "0-8 pts — showing your best suit (forced).",
    expectedResponses: [],
    confidence: "high",
  };
}

function getResponseToPreemptOC(
  hand: Hand,
  partnerBid: string,
  interferenceBid?: string,
): BidRecommendation {
  return getResponseToPreempt(hand, partnerBid, interferenceBid);
}

function getResponseTo1NTOvercall(
  hand: Hand,
  /** True when partner's 1NT was a BALANCING (pass-out seat) action — only
   *  11-14 HCP, a king lighter than the direct 15-18 overcall. */
  balancing = false,
  /** The opponents' latest real bid AFTER partner's 1NT, if any — systems
   *  (Stayman/transfers) are off over it, and suit bids must clear it. */
  interferenceBid?: string,
): BidRecommendation {
  if (balancing) {
    const analysis = analyzeHand(hand);
    const { hcp } = hand;
    // Opposite 11-14 the whole ladder shifts up ~4 HCP versus a 15-18 1NT:
    // game needs ~13+, an invitation ~11-12, anything less passes (partner
    // "borrowed a king" from your hand to reopen — do not bid it again).
    if (hcp >= 13) {
      return {
        bid: "3NT",
        category: "Raise Balancing 1NT to Game (13+ HCP)",
        reasoning: `Partner's 1NT was in the BALANCING (pass-out) seat — only 11-14 HCP, a king lighter than a direct overcall. With ${hcp} HCP the combined count still reaches ~25: bid 3NT.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "13+ HCP — game opposite even a light balance.",
        expectedResponses: [{ partnerBid: "Pass", meaning: "To play" }],
        confidence: "medium",
      };
    }
    if (hcp >= 11) {
      return {
        bid: "2NT",
        category: "Invite Opposite the Balancing 1NT (11-12 HCP)",
        reasoning: `Partner's balancing 1NT shows only 11-14 HCP — remember, partner has already "borrowed a king" from your hand to reopen. With ${hcp} HCP, invite with 2NT; partner bids 3NT only with a maximum (13-14).`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: "11-12 HCP — invitational opposite 11-14.",
        expectedResponses: [
          { partnerBid: "Pass", meaning: "Minimum (11-12)" },
          { partnerBid: "3NT", meaning: "Maximum (13-14)" },
        ],
        confidence: "medium",
      };
    }
    return {
      bid: "Pass",
      category: "Pass Opposite the Balancing 1NT",
      reasoning: `Partner's 1NT was a BALANCING action (pass-out seat) showing only 11-14 HCP — partner has already counted on some of your values to reopen. With ${hcp} HCP there is no game: pass and take the plus score.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "Under 11 HCP — nothing to add opposite a light balance.",
      expectedResponses: [],
      confidence: "high",
    };
  }
  return getResponseToOneNT(hand, interferenceBid);
}

function getResponseToMichaels(
  hand: Hand,
  opponentBid: string,
  partnerCuebid: string,
): BidRecommendation {
  const analysis = analyzeHand(hand);
  // A Michaels cuebid shows a known two-suiter, so a fit is established the
  // moment we pick one of partner's suits — value with short-suit support pts.
  const supportTP = calcTPWithFit(hand);
  const overMinor = opponentBid.includes("♣") || opponentBid.includes("♦");
  // EVERY advance must clear the cuebid itself (and any later opponent bid):
  // over a 2♠ Michaels cue of a 1♠ opening, the heart preference is 3♥, not
  // 2♥ — a hard-coded level walks into the safety net and passes the cue.
  const michFloorIdx = Math.max(
    BID_ORDER.indexOf(partnerCuebid),
    isRealBid(opponentBid) ? BID_ORDER.indexOf(opponentBid) : -1,
  );
  const cheapestOver = (sym: string): string | undefined =>
    BID_ORDER.find((b, i) => i > michFloorIdx && b.endsWith(sym));

  if (overMinor) {
    // Partner showed both majors
    if (hand.spades >= hand.hearts) {
      const spGame = supportTP >= 15 || (supportTP >= 11 && hand.spades >= 4);
      const spPref = cheapestOver("♠") ?? "2♠";
      return {
        bid: spGame && BID_ORDER.indexOf("4♠") > michFloorIdx ? "4♠" : spPref,
        category: "Respond to Michaels (Partner has both majors)",
        reasoning: `Partner's Michaels cuebid over a minor shows both majors (5+/5+) but NO minimum strength — partner may be quite weak. With ${hand.spades} spades${spGame ? " and game-going values (11+ support pts with 4+ trumps, or 15+), bid game — the double fit plays well" : `, take the simple preference (${spPref}); game needs 11+ support pts with 4-card support or 15+`}.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `Prefer spades. ${supportTP >= 11 ? "Game values." : "Competitive."}`,
        expectedResponses: [],
        confidence: "high",
      };
    }
    const htGame = supportTP >= 15 || (supportTP >= 11 && hand.hearts >= 4);
    const htPref = cheapestOver("♥") ?? "2♥";
    return {
      bid: htGame && BID_ORDER.indexOf("4♥") > michFloorIdx ? "4♥" : htPref,
      category: "Respond to Michaels (Prefer Hearts)",
      reasoning: `Partner showed both majors but no minimum strength — Michaels may be quite weak. With more hearts than spades, give the heart preference (${htPref}); jump to game only with 15+ support points.`,
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
    const cheapestPref = cheapestOver(suitSym);
    // Support points ≥15 (or ≥11 with 4+ trumps) → game.  A free 3-level
    // raise wants the Law on its side (4+ trumps or 11+ support points), but
    // when the cuebid FORCES the preference to the 3-level (e.g. hearts over
    // a 2♠ cue), take it anyway — passing would leave partner in the
    // opponents' suit.
    const mfGame = supportTP >= 15 || (supportTP >= 11 && myMajorFit >= 4);
    const gameBidM = `4${suitSym}`;
    const raiseBid =
      mfGame && BID_ORDER.indexOf(gameBidM) > michFloorIdx
        ? gameBidM
        : (cheapestPref ?? gameBidM);
    const prefWasForced =
      !mfGame && cheapestPref && parseInt(cheapestPref[0]) >= 3;
    return {
      bid: raiseBid,
      category: "Respond to Michaels (Major fit)",
      reasoning: `Partner showed 5+ ${shownMajor} and 5+ unknown minor. With ${myMajorFit}-card support and ${supportTP} support points, ${mfGame ? "bid game (11+ with 4-card support, or 15+)" : prefWasForced ? `take the ${raiseBid} preference — the cuebid forces you to pick a suit even on a weak hand (passing would strand partner in the opponents' suit), and the known 8+ card fit covers the level` : "take the CHEAPEST preference — with only 3 trumps and modest values, Michaels may be quite weak"}.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `${myMajorFit}-card support for the major${mfGame ? " — game values" : " — a preference, no promises (the cue forced a pick)"}.`,
      expectedResponses: [],
      confidence: "high",
    };
  }

  const ntAsk = cheapestOver("NT");
  if (ntAsk && parseInt(ntAsk[0]) <= 3) {
    return {
      bid: ntAsk,
      category: "Ask for Minor (Michaels)",
      reasoning: `Without support for partner's shown major, bid ${ntAsk} to ask partner to name their 5-card minor suit.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "No fit for the major — show your minor.",
      expectedResponses: [
        { partnerBid: "Cheapest ♣ bid", meaning: "5+ clubs" },
        { partnerBid: "Cheapest ♦ bid", meaning: "5+ diamonds" },
      ],
      confidence: "high",
    };
  }
  // No NT ask available below game: fall back to the major preference even
  // on a doubleton — partner has 5 there and the cue must not be passed out.
  const fallbackPref = cheapestOver(suitSymbol(shownMajor));
  return {
    bid: fallbackPref ?? "Pass",
    category: "Forced Preference to the Michaels Major",
    reasoning: `No fit for either of partner's suits and the minor ask is no longer available — take the forced ${fallbackPref ?? "pass"} preference${fallbackPref ? ` (partner holds 5+ ${shownMajor})` : ""}.`,
    handAnalysis: analysis,
    whatYourBidTellsPartner: "No real fit — a forced preference.",
    expectedResponses: [],
    confidence: "low",
  };
}

function getResponseToUnusual2NT(hand: Hand): BidRecommendation {
  const analysis = analyzeHand(hand);
  // Picking one of partner's two shown minors agrees a fit — value the
  // game-vs-partscore decision with short-suit support points.
  const supportTP = calcTPWithFit(hand);

  // Partner showed clubs and diamonds (the two minors after a major opening)
  if (hand.diamonds >= hand.clubs) {
    return {
      bid: supportTP >= 11 ? "4♦" : "3♦",
      category: "Respond to Unusual 2NT (Prefer Diamonds)",
      reasoning: `Partner showed 5+ clubs and 5+ diamonds. With ${hand.diamonds} diamonds${supportTP >= 11 ? " and game values, bid 4♦" : ", bid 3♦"}.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Prefer diamonds.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  return {
    bid: supportTP >= 11 ? "5♣" : "3♣",
    category: "Respond to Unusual 2NT (Prefer Clubs)",
    reasoning: `Partner showed 5+ clubs and 5+ diamonds. With more clubs${supportTP >= 11 ? " and game values" : ""}, bid clubs.`,
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
  partnerFirstBid?: string,
  /** My OWN first real bid — a 2NT is only Jacoby if it was my first (direct) call. */
  myFirstBid?: string,
  /** The opponents' bids — needed so a rebid forced past interference is not
   *  misread as a jump shift. */
  interferenceLho?: string,
  interferenceRho?: string,
): BidRecommendation {
  const analysis = analyzeHand(hand);
  const { hcp } = hand;
  // Jacoby 2NT establishes a 4+ card major fit, so the slam-try valuation uses
  // SHORT-suit support points (ruffing values), not long-suit TP.
  const ntTp = calcTPWithFit(hand);

  // ── Partner has PLACED the contract at game (e.g. correcting your
  // choice-of-games 3NT to 4♠ with a fit) — accept it.  Below the slam zone
  // there is nothing left to say.
  if (
    partnerNaturalBid &&
    /^[1-7][♠♥♦♣]$/.test(partnerNaturalBid) &&
    parseInt(partnerNaturalBid[0]) >=
      (partnerNaturalBid.includes("♥") || partnerNaturalBid.includes("♠")
        ? 4
        : 5) &&
    // Below 16 support the game placement always stands.  It ALSO stands on
    // any strength when partner is correcting MY OWN transfer choice-of-games
    // 3NT to the major — my sequence already limited/placed the hand, and
    // re-raising partner's correction would bid the same values twice.
    (ntTp < 16 ||
      (partnerFirstBid?.endsWith("NT") &&
        /^[23][♦♥]$/.test(myFirstBid ?? ""))) &&
    // Partner jumping to game in THEIR OWN first suit (incl. Jacoby signoffs)
    // has richer, dedicated stories below — this guard covers corrections to
    // MY shown suit / choice-of-games placements only.
    !(
      partnerFirstBid &&
      /^[1-7][♠♥♦♣]$/.test(partnerFirstBid) &&
      partnerFirstBid.slice(1) === partnerNaturalBid.slice(1)
    )
  ) {
    return {
      bid: "Pass",
      category: "Accept Partner's Choice of Games",
      reasoning: `Partner's ${partnerNaturalBid} places the contract at game, knowing what your bidding showed (e.g. correcting your choice-of-games offer with a fit). With no slam ambitions, pass.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Accepting the game contract.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  // ── Jacoby 2NT continuation ─────────────────────────────────────────────────
  // My 2NT over partner's 1♥/1♠ OPENING was Jacoby (game-forcing raise).
  // Partner's reply describes their hand (3-level new suit = shortness,
  // 4-level new suit = strong side suit, 3M = extras, 4M = minimum).  The
  // auction may NOT die below game in the major.
  if (
    myNTBid === "2NT" &&
    // My 2NT is only Jacoby if it was my FIRST (direct) response to the major.
    // If I bid a suit first and 2NT later, that 2NT was a natural invitation.
    (myFirstBid === undefined || myFirstBid === "2NT") &&
    (partnerFirstBid === "1♥" || partnerFirstBid === "1♠") &&
    partnerNaturalBid &&
    partnerNaturalBid !== "Pass"
  ) {
    const majSym = partnerFirstBid.slice(1);
    const majName = majSym === "♥" ? "hearts" : "spades";
    const gameBid = `4${majSym}`;
    if (partnerNaturalBid === gameBid) {
      return {
        bid: "Pass",
        category: "Accept Jacoby Sign-Off (Minimum Opener)",
        reasoning: `Your 2NT was Jacoby (game-forcing ${majName} raise). Partner's direct ${gameBid} shows a MINIMUM opener with no slam interest — pass.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: "No extras beyond the game-forcing raise.",
        expectedResponses: [],
        confidence: "high",
      };
    }
    if (ntTp >= 18) {
      return {
        bid: "4NT",
        category: "Blackwood After Jacoby 2NT (Slam Try)",
        reasoning: `Your 2NT was Jacoby and partner's ${partnerNaturalBid} reply shows ${parseInt(partnerNaturalBid[0]) === 3 && partnerNaturalBid.slice(1) !== majSym ? "shortness" : "extra values/shape"}. With ${ntTp} support points, check aces with 4NT before slam in ${majName}.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "Slam try with the agreed major — asking for aces.",
        expectedResponses: [
          { partnerBid: "5♣", meaning: "0 or 4 aces" },
          { partnerBid: "5♦", meaning: "1 ace" },
          { partnerBid: "5♥", meaning: "2 aces" },
          { partnerBid: "5♠", meaning: "3 aces" },
        ],
        confidence: "medium",
      };
    }
    return {
      bid: gameBid,
      category: "Complete the Jacoby Game Force",
      reasoning: `Your 2NT was Jacoby — the auction is FORCING to game in ${majName}. Partner's ${partnerNaturalBid} described their hand; without slam ambitions, sign off in ${gameBid}.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "Game values only — no slam interest opposite your reply.",
      expectedResponses: [{ partnerBid: "Pass", meaning: "Accepting game" }],
      confidence: "high",
    };
  }

  // Partner passed after your NT response — auction is at a standstill, pass
  if (partnerNaturalBid === "Pass" || !partnerNaturalBid) {
    return {
      bid: "Pass",
      category: "Pass (Partner Passed)",
      reasoning: `You bid ${myNTBid} and partner passed, showing a minimum opener who is satisfied with the contract. Pass — the auction is over.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Accepting the contract.",
      expectedResponses: [],
      confidence: "high",
    };
  }

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

  // Partner bid 4NT over my natural NT — QUANTITATIVE slam invite (no suit is
  // agreed, so it is not Blackwood).  Accept only at the TOP of the range my
  // NT bid showed.
  if (partnerNaturalBid === "4NT") {
    const rangeTop = myNTBid === "1NT" ? 10 : myNTBid === "2NT" ? 12 : 15;
    const accept = hcp >= rangeTop;
    return {
      bid: accept ? "6NT" : "Pass",
      category: accept
        ? "Accept the Quantitative 4NT (Maximum)"
        : "Decline the Quantitative 4NT (Minimum)",
      reasoning: `Partner's 4NT over your natural ${myNTBid} is QUANTITATIVE — an invitation to 6NT, not Blackwood. With ${hcp} HCP you are at the ${accept ? "top" : "bottom"} of what your ${myNTBid} showed: ${accept ? "accept with 6NT." : "pass and play 4NT."}`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: accept
        ? "Maximum for my earlier bid — slam it is."
        : "Minimum for my earlier bid — 4NT is high enough.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  // ── Opener RAISED my 1NT response to 2NT (1x-1NT-2NT): that shows 18-19
  // balanced (a 12-14 opener would pass 1NT). My 1NT was 6-10 — accept the
  // invite with 8+, decline with 6-7.
  if (
    myNTBid === "1NT" &&
    partnerNaturalBid === "2NT" &&
    partnerFirstBid &&
    /^1[♠♥♦♣]$/.test(partnerFirstBid)
  ) {
    const acceptNT = hcp >= 8;
    return {
      bid: acceptNT ? "3NT" : "Pass",
      category: acceptNT
        ? "Accept Opener's 2NT Raise (8-10)"
        : "Decline Opener's 2NT Raise (6-7)",
      reasoning: `Partner opened ${partnerFirstBid} and raised your 1NT response to 2NT — that shows a balanced 18-19 HCP (with 12-14 they would simply pass 1NT). Your 1NT showed 6-10; with ${hcp} HCP you are ${acceptNT ? `in the top of the range (combined ${hcp + 18}+): bid 3NT.` : `a minimum (combined at most ${hcp + 19}): pass and play 2NT.`}`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: acceptNT
        ? "8-10 — accepting your 18-19 invite."
        : "6-7 — declining; 2NT is high enough.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  // ── My 1NT was the LIMITED 6-10 response — partner's suit rebid is a
  // partscore proposal (or a jump showing extras).  The right actions are
  // simple preference / pass / a single invitational raise — NEVER a leap to
  // game on a 6-10 hand.
  if (partnerSuit && myNTBid === "1NT") {
    // Partner has NOT actually rebid — their latest real bid is still the
    // opening, sitting BELOW my 1NT (they passed over the interference).
    // There is no "rebid" to interpret; my limited 1NT said it all.
    if (BID_ORDER.indexOf(partnerNaturalBid) < BID_ORDER.indexOf("1NT")) {
      return {
        bid: "Pass",
        category: "Pass — Partner Passed Over the Interference",
        reasoning: `Partner opened ${partnerNaturalBid} and has since passed — they heard the opponents' bid and chose not to compete, showing a minimum with nothing extra. Your 1NT response (6-10) already described your hand: pass.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: "Nothing beyond my 1NT — happy to defend.",
        expectedResponses: [],
        confidence: "high",
      };
    }
    const secondLen = hand[partnerSuit as keyof Hand] as number;
    const firstSuitName =
      partnerFirstBid && !partnerFirstBid.endsWith("NT")
        ? partnerFirstBid.includes("♠")
          ? "spades"
          : partnerFirstBid.includes("♥")
            ? "hearts"
            : partnerFirstBid.includes("♦")
              ? "diamonds"
              : "clubs"
        : null;
    const firstLen = firstSuitName
      ? (hand[firstSuitName as keyof Hand] as number)
      : 0;
    const rebidSameSuit = firstSuitName === partnerSuit;
    // The jump measure must clear any interference between my 1NT and
    // partner's rebid — a 3♣ forced past the opponents' 2♦ is NOT a jump.
    const ntRebidFloorIdx = Math.max(
      BID_ORDER.indexOf("1NT"),
      ...[interferenceLho, interferenceRho]
        .filter(
          (b): b is string =>
            !!b && b !== "Pass" && b !== "Double" && b !== "Redouble",
        )
        .filter(
          (b) => BID_ORDER.indexOf(b) < BID_ORDER.indexOf(partnerNaturalBid),
        )
        .map((b) => BID_ORDER.indexOf(b)),
    );
    const cheapestInPartnerSuit = BID_ORDER.find(
      (b, i) => i > ntRebidFloorIdx && b.endsWith(suitSymbol(partnerSuit)),
    );
    const partnerJumped =
      !!cheapestInPartnerSuit && cheapestInPartnerSuit !== partnerNaturalBid;
    const partnerIsMajor = partnerSuit === "hearts" || partnerSuit === "spades";

    if (partnerJumped && !rebidSameSuit) {
      // Jump shift by opener (e.g. 1♠-1NT-3♣): 19+, game-forcing — I must bid.
      const pref =
        firstSuitName && firstLen >= 3
          ? BID_ORDER.find(
              (b, i) =>
                i > BID_ORDER.indexOf(partnerNaturalBid) &&
                b.endsWith(suitSymbol(firstSuitName)),
            )
          : undefined;
      const forcedBid = pref ?? "3NT";
      return {
        bid: forcedBid,
        category: "Answer Opener's Jump Shift (Game-Forcing)",
        reasoning: `Partner's ${partnerNaturalBid} is a JUMP SHIFT — about 19+ points and game-forcing, so you cannot pass despite your limited 1NT (6-10). ${pref ? `With ${firstLen}-card support for partner's first suit (${firstSuitName}), give preference with ${forcedBid}.` : `With no fit for either suit, bid ${forcedBid}.`}`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: pref
          ? `Preference for ${firstSuitName}; still 6-10.`
          : "No fit for either suit; still 6-10.",
        expectedResponses: [],
        confidence: "medium",
      };
    }

    if (rebidSameSuit) {
      // e.g. 1♠-1NT-2♠ (6+ suit, minimum) or 3♠ jump (16-18 invite).
      const gameLvlRS = partnerIsMajor ? 4 : 5;
      if ((parseInt(partnerNaturalBid[0]) || 0) >= gameLvlRS) {
        // Partner jumped straight to GAME (19-21, self-sufficient suit) — that
        // is to play, not an invitation.  Pass.
        return {
          bid: "Pass",
          category: "Pass — Partner Jumped to Game",
          reasoning: `Partner's ${partnerNaturalBid} is a jump to GAME in their own suit (about 19-21 with a self-sufficient suit) — it is to play, not an invitation. Your 1NT already described your hand: pass.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: "Accepting the game contract.",
          expectedResponses: [],
          confidence: "high",
        };
      }
      if (partnerJumped) {
        const accept = hcp >= 8;
        const acceptBid = partnerIsMajor
          ? `4${suitSymbol(partnerSuit)}`
          : "3NT";
        return {
          bid: accept ? acceptBid : "Pass",
          category: accept
            ? "Accept Opener's Jump-Rebid Invitation"
            : "Decline Opener's Jump-Rebid Invitation",
          reasoning: `Partner's jump rebid of their own suit shows 16-18 with a good 6+ card ${partnerSuit} — invitational. With ${hcp} HCP you are at the ${accept ? "top" : "bottom"} of your 1NT response${hcp >= 11 ? " (the 11-12 forcing-NT variant — a clear accept)" : " (6-10)"}: ${accept ? `accept with ${acceptBid}` : "pass"}.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: accept
            ? "Maximum of the 1NT response — accepting game."
            : "Minimum of the 1NT response.",
          expectedResponses: [],
          confidence: "high",
        };
      }
      // The FORCING-NT variant (11-12) promised an invite: keep the promise
      // with 2NT when it is still available.
      if (
        hcp >= 11 &&
        secondLen <= 2 &&
        BID_ORDER.indexOf("2NT") > BID_ORDER.indexOf(partnerNaturalBid)
      ) {
        return {
          bid: "2NT",
          category: "Invite (Forcing 1NT Was the 11-12 Variant)",
          reasoning: `Your 1NT response carried 11-12 points (the forcing variant) with the plan to invite — partner's ${partnerNaturalBid} minimum rebid does not change that. Bid 2NT: partner passes with 12-13, bids game with 14-15.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: "11-12 balanced — inviting game.",
          expectedResponses: [
            { partnerBid: "Pass", meaning: "Dead minimum" },
            { partnerBid: "3NT / game", meaning: "14-15 — accepting" },
          ],
          confidence: "high",
        };
      }
      const raise = hcp >= 9 && secondLen >= 3;
      return {
        bid: raise ? `3${suitSymbol(partnerSuit)}` : "Pass",
        category: raise
          ? "Raise Opener's Rebid Suit (Maximum 1NT)"
          : "Pass Opener's Minimum Rebid",
        reasoning: `Partner's ${partnerNaturalBid} rebid shows a minimum opener with 6+ ${partnerSuit}. Your 1NT already told the story (6-10). ${raise ? `With ${hcp} HCP and ${secondLen}-card support, one invitational raise is enough.` : "Pass — this is a playable partscore and you have nothing extra."}`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: raise
          ? "Top of the 1NT response with a fit."
          : "Nothing beyond the 1NT response.",
        expectedResponses: [],
        confidence: "high",
      };
    }

    // Opener showed a SECOND suit (e.g. 1♠-1NT-2♣): pick the better partscore.
    if (secondLen >= 4 && hcp >= 9) {
      return {
        bid: `3${suitSymbol(partnerSuit)}`,
        category: "Invitational Raise of Opener's Second Suit",
        reasoning: `Partner showed a second suit (${partnerNaturalBid}). With ${secondLen}-card support and ${hcp} HCP — the top of what your 1NT response showed — raise once to ${`3${suitSymbol(partnerSuit)}`}: invitational, not forcing.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `4+ ${partnerSuit} support, top of the 1NT response (about 9-12).`,
        expectedResponses: [],
        confidence: "medium",
      };
    }
    if (
      firstSuitName &&
      firstLen >= 2 &&
      firstLen >= secondLen &&
      !rebidSameSuit
    ) {
      const prefBid = BID_ORDER.find(
        (b, i) =>
          i > BID_ORDER.indexOf(partnerNaturalBid) &&
          b.endsWith(suitSymbol(firstSuitName)),
      );
      if (prefBid && parseInt(prefBid[0]) <= 2) {
        return {
          bid: prefBid,
          category: "Simple Preference to Opener's First Suit",
          reasoning: `Partner showed two suits (${partnerFirstBid} then ${partnerNaturalBid}). With ${firstLen} ${firstSuitName} and only ${secondLen} ${partnerSuit}, give simple preference back to ${prefBid}. This promises NO extra values — it just picks the better fit.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: `Preference for ${firstSuitName}; still 6-10, nothing extra.`,
          expectedResponses: [],
          confidence: "high",
        };
      }
    }
    return {
      bid: "Pass",
      category: "Pass — Opener's Second Suit Is the Best Spot",
      reasoning: `Partner showed two suits (${partnerFirstBid ?? "a suit"} then ${partnerNaturalBid}). With ${secondLen} ${partnerSuit} and only ${firstLen} in partner's first suit, ${partnerNaturalBid} is the better partscore. Your 1NT already limited the hand — pass.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `Preferring ${partnerSuit}; nothing beyond the 1NT response.`,
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
    const myNTRange =
      myNTBid === "2NT" ? "11-12 HCP, invitational" : "13-15 HCP";

    // Partner returned to THEIR OWN suit at the 3-level over my 2NT invite:
    // that is a DECLINE signoff (minimum, 6+ suit) — pass, never 3NT.
    if (
      myNTBid === "2NT" &&
      partnerFirstBid &&
      /^[1-7][♠♥♦♣]$/.test(partnerFirstBid) &&
      partnerNaturalBid.slice(1) === partnerFirstBid.slice(1) &&
      parseInt(partnerNaturalBid[0]) === 3
    ) {
      return {
        bid: "Pass",
        category: "Pass — Partner Declined Your Invite (Suit Signoff)",
        reasoning: `Your 2NT invited game; partner's ${partnerNaturalBid} declines it, signing off in their long ${partnerSuit} with a minimum. Respect the signoff — pass.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "Accepting the declined invite — partscore it is.",
        expectedResponses: [],
        confidence: "high",
      };
    }

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
        whatYourBidTellsPartner: `${mySuitLen}-card ${partnerSuit} support — let's play game in ${partnerSuit}.`,
        expectedResponses: [{ partnerBid: "Pass", meaning: "Accepts game" }],
        confidence: "high",
      };
    }

    // 3-card fit for a 4-card major = only a 4-3.  Partner's suit bid showed
    // 4+ (not 5+), so prefer 3NT — nine tricks in notrump beat a 4-3 game.
    // (With a KNOWN 5-card suit this handler is not the route.)
    if (mySuitLen === 3 && isMajor && parseInt(myNTBid?.[0] ?? "2") === 2) {
      return {
        bid: "3NT",
        category: `Prefer 3NT Over the 4-3 ${partnerSuit
          .charAt(0)
          .toUpperCase()}${partnerSuit.slice(1)} Fit`,
        reasoning: `Partner's ${partnerNaturalBid} showed 4+ ${partnerSuit}, but with only 3-card support the fit may be 4-3 — a shaky trump suit for game. Bid 3NT instead: nine tricks in notrump beat ten on a 4-3. (Partner can still correct with a 5th ${partnerSuit.slice(0, -1)}.)`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `Only 3-card ${partnerSuit} support — offering 3NT; correct with 5+.`,
        expectedResponses: [
          { partnerBid: "Pass", meaning: "4-card suit — 3NT it is" },
          { partnerBid: gameBid, meaning: `5+ ${partnerSuit} — the real fit` },
        ],
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
    category: "Pass — Nothing More to Say",
    reasoning:
      "Your earlier bidding has already limited and described this hand, and nothing partner or the opponents have done changes the message. Pass — with values or shape to spare you would have had a clearer action above.",
    handAnalysis: analysis,
    whatYourBidTellsPartner: "Nothing beyond what my earlier bids showed.",
    expectedResponses: [],
    confidence: "medium",
  };
}

function getRebidAfterNT(
  hand: Hand,
  partnerResponse: string,
  interference = false,
  /** My NT opening (1NT/2NT/3NT) — over 2NT the conventions sit a level
   *  higher: 3♣ Stayman, 3♦/3♥ transfers. */
  myNTBid?: string,
  /** The opponents' highest live bid, if any — a Stayman answer or transfer
   *  completion must clear it (or pass honestly). */
  oppFloorBid?: string,
): BidRecommendation {
  const analysis = analyzeHand(hand);
  const { hcp } = hand;

  // ── Over MY 2NT opening (uncontested), 3♦/3♥ are JACOBY TRANSFERS and 3♣
  // is Stayman — never natural forcing suits.
  if (!interference && myNTBid === "2NT") {
    if (partnerResponse === "3♦" || partnerResponse === "3♥") {
      const target = partnerResponse === "3♦" ? "hearts" : "spades";
      const targetBid = `3${suitSymbol(target)}`;
      return {
        bid: targetBid,
        category: `Complete ${target.charAt(0).toUpperCase() + target.slice(1)} Transfer (over 2NT)`,
        reasoning: `Partner's ${partnerResponse} over your 2NT is a JACOBY TRANSFER showing 5+ ${target} — not a natural suit. Complete the transfer with ${targetBid}; partner will pass (weak), raise, or bid 3NT to offer a choice of games.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: "Transfer complete.",
        expectedResponses: [
          { partnerBid: "Pass", meaning: "Weak — play the partscore" },
          { partnerBid: "3NT", meaning: `Exactly 5 ${target} — pick a game` },
          {
            partnerBid: `4${suitSymbol(target)}`,
            meaning: `6+ ${target} — game`,
          },
        ],
        confidence: "high",
      };
    }
    if (partnerResponse === "3♣") {
      const has4H2 = hand.hearts >= 4;
      const has4S2 = hand.spades >= 4;
      const stayAns = has4H2 ? "3♥" : has4S2 ? "3♠" : "3♦";
      return {
        bid: stayAns,
        category: "Stayman over 2NT — Answer",
        reasoning: `Partner's 3♣ over your 2NT is STAYMAN, asking for a 4-card major. ${has4H2 ? "Bid 3♥ to show 4 hearts." : has4S2 ? "Bid 3♠ to show 4 spades (no 4 hearts)." : "With no 4-card major, deny with 3♦ (artificial)."}`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: has4H2
          ? "4+ hearts."
          : has4S2
            ? "4 spades, not 4 hearts."
            : "No 4-card major (artificial denial).",
        expectedResponses: [],
        confidence: "high",
      };
    }
  }

  // ── Interference: conventions are OFF ──────────────────────────────────────
  // Once an opponent overcalls your NT opening, partner's suit bids are
  // NATURAL (to play), not Stayman/transfers.  Pass with a doubleton, raise
  // only with a fit and a maximum.
  if (interference && /^[23][♠♥♦♣]$/.test(partnerResponse)) {
    const natSuit = partnerResponse.includes("♠")
      ? "spades"
      : partnerResponse.includes("♥")
        ? "hearts"
        : partnerResponse.includes("♦")
          ? "diamonds"
          : "clubs";
    const fit = hand[natSuit as keyof Hand] as number;
    const isMajorNat = natSuit === "spades" || natSuit === "hearts";
    const lvl = parseInt(partnerResponse[0]);
    if (
      fit >= 3 &&
      isMajorNat &&
      hcp >= 16 &&
      // Partner's suit bid over interference is a WEAK escape (0-7): a raise
      // may compete for the partscore but must never reach GAME.
      lvl + 1 < 4
    ) {
      return {
        bid: `${lvl + 1}${suitSymbol(natSuit)}`,
        category: "Raise Partner's Natural Suit (Systems Off)",
        reasoning: `The opponents' interference turned partner's ${partnerResponse} into a NATURAL bid (Stayman/transfers are off). With ${fit}-card support and a maximum (${hcp} HCP), raise once.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `3+ ${natSuit} support, maximum NT opening.`,
        expectedResponses: [],
        confidence: "medium",
      };
    }
    return {
      bid: "Pass",
      category: "Pass (Partner's Suit Is Natural Over Interference)",
      reasoning: `The opponents' interference turned partner's ${partnerResponse} into a NATURAL, to-play bid (Stayman and transfers are off in competition). Your NT opening already described your hand — pass.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "Nothing extra — accepting partner's natural escape.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  // Partner passed — opponents are competing over your 1NT
  // Your 1NT already described your hand fully (15-17 HCP balanced).
  // With no information from partner, pass and let the auction develop.
  if (partnerResponse === "Pass" || !partnerResponse) {
    const ntWasOpeningPP = myNTBid === undefined || myNTBid === "1NT";
    return {
      bid: "Pass",
      category: "Pass (Partner Passed Over Your NT Bid)",
      reasoning: ntWasOpeningPP
        ? "Your 1NT opening fully described your hand (15-17 HCP balanced). Partner has passed, showing no interest in game. The combined values are below game — pass and let the opponents play or allow partner to act if the opponents push the auction higher."
        : `Your ${myNTBid} bid fully described your range and shape, and partner has since passed — they heard it and chose not to continue. Pass; any further decision is partner's.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "Minimum 1NT opener. No additional information to add.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  // Partner bid 2NT (invitational, 8-9 pts).  This is a NOTRUMP decision — judge
  // by HCP only (a 1NT opener is balanced; distribution is irrelevant in NT).
  if (partnerResponse === "2NT") {
    return {
      bid: hand.hcp >= 16 ? "3NT" : "Pass",
      category: "Rebid after 1NT - 2NT",
      reasoning:
        hand.hcp >= 16
          ? `Partner invited game with 2NT (8-9 pts). With ${hand.hcp} HCP (maximum), accept and bid 3NT.`
          : "Partner invited game. With minimum values, decline by passing.",
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        hand.hcp >= 16 ? "Maximum 1NT opener." : "Minimum 1NT opener.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  // Partner bid 4NT (quantitative invite to 6NT)
  if (partnerResponse === "4NT") {
    return {
      bid: hcp >= 17 ? "6NT" : "Pass",
      category: "Rebid after 1NT - 4NT (Quantitative)",
      reasoning:
        hcp >= 17
          ? "Partner invites 6NT (quantitative 4NT with 16-17 HCP). With your maximum 17 HCP, accept."
          : "Partner invites 6NT. With 15-16 HCP, decline.",
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        hcp >= 17 ? "Accept slam invite." : "Decline slam invite.",
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
    // An opponent overcalled ON TOP of the Stayman ask: the cheap answers are
    // gone.  Bid a 4-card major a level up only with a MAXIMUM; otherwise
    // pass — responder keeps the auction alive with values.
    if (
      oppFloorBid &&
      isRealBid(oppFloorBid) &&
      BID_ORDER.indexOf(oppFloorBid) > BID_ORDER.indexOf("2♣")
    ) {
      const liftedAns = (
        [has4Hearts ? "♥" : null, has4Spades ? "♠" : null].filter(
          Boolean,
        ) as string[]
      )
        .map(
          (sym) =>
            BID_ORDER.find(
              (b, i) => i > BID_ORDER.indexOf(oppFloorBid) && b.endsWith(sym),
            )!,
        )
        .sort((a, b) => BID_ORDER.indexOf(a) - BID_ORDER.indexOf(b))[0];
      if (liftedAns && hcp >= 17 && parseInt(liftedAns[0]) <= 3) {
        return {
          bid: liftedAns,
          category: "Stayman Answer Lifted Over the Interference (Maximum)",
          reasoning: `The opponents' ${oppFloorBid} took your cheap Stayman answer away. With a MAXIMUM (${hcp} HCP) and the 4-card major, show it a level higher: ${liftedAns}. With a minimum you would pass instead.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner:
            "4-card major and a maximum — answering despite their overcall.",
          expectedResponses: [],
          confidence: "medium",
        };
      }
      return {
        bid: "Pass",
        category: "Pass — Their Overcall Took the Stayman Answer Away",
        reasoning: `Partner's 2♣ asked for a major, but the opponents' ${oppFloorBid} removed the cheap answers. With ${hcp} HCP (not a maximum), pass — free bids here promise extras. Partner knows the ask went unanswered and can double, bid a suit, or try notrump with their values.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "No cheap answer over their overcall and no maximum — your move.",
        expectedResponses: [],
        confidence: "medium",
      };
    }
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

  // ── Partner's direct 3-level suit response: natural, 6+ suit, FORCING ──────
  // (slam interest for a major; strong minor hand otherwise).  The opener may
  // NOT pass below game: raise with a fit, otherwise bid 3NT.
  if (!interference && /^3[♠♥♦♣]$/.test(partnerResponse)) {
    const respSuit = partnerResponse.includes("♠")
      ? "spades"
      : partnerResponse.includes("♥")
        ? "hearts"
        : partnerResponse.includes("♦")
          ? "diamonds"
          : "clubs";
    const respFit = hand[respSuit as keyof Hand] as number;
    const respIsMajor = respSuit === "spades" || respSuit === "hearts";
    if (respIsMajor && respFit >= 3) {
      return {
        bid: `4${suitSymbol(respSuit)}`,
        category: "Raise Partner's Forcing 3-Level Response",
        reasoning: `Partner's ${partnerResponse} over your NT is natural and FORCING — a 6+ card suit with slam interest. With ${respFit}-card support, set the trump suit by raising to game; partner may continue with a slam try.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `3+ card ${respSuit} support — happy to play game or hear a slam try.`,
        expectedResponses: [
          { partnerBid: "Pass", meaning: "Content with game" },
          { partnerBid: "4NT", meaning: "Blackwood — slam try" },
        ],
        confidence: "high",
      };
    }
    return {
      bid: "3NT",
      category: "3NT Over Partner's Forcing 3-Level Response",
      reasoning: `Partner's ${partnerResponse} is natural and forcing (6+ suit). Without ${respIsMajor ? "3-card support" : "a reason to prefer the minor"}, bid 3NT — partner can pass or continue toward slam.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `No great fit for ${respSuit} — offering 3NT as the game.`,
      expectedResponses: [
        { partnerBid: "Pass", meaning: "Accepting 3NT" },
        {
          partnerBid: `4${suitSymbol(respSuit)}`,
          meaning: "Insisting on the suit",
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
      bid: "Pass",
      category: "Pass — Contract Set at 3NT",
      reasoning:
        "Partner's 3NT is a sign-off — they have placed the contract knowing your NT range. Your hand is already fully described; pass. (Slam invitations come from PARTNER via 4NT quantitative, not from you.)",
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Accepting 3NT as the final contract.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  // Partner DOUBLED the interference over my 1NT — that is PENALTY.  My 1NT
  // already described the hand exactly; leave the double in.
  if (partnerResponse === "Double") {
    return {
      bid: "Pass",
      category: "Pass — Partner's Penalty Double Stands",
      reasoning:
        "Partner doubled the opponents' interference over your 1NT — that double is PENALTY (about 8+ HCP with their suit held). Your 1NT already described your hand precisely; pass and defend for the penalty.",
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "Accepting the penalty — nothing beyond the 1NT opening.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  // Partner may have placed a GAME (e.g. jumping to 4M over interference
  // after my NT rebid) — accept it; otherwise the NT bid said everything.
  const pRespLvlNT = parseInt(partnerResponse?.[0] ?? "0") || 0;
  const pRespAtGameNT =
    !!partnerResponse &&
    /^[1-7][♠♥♦♣]$/.test(partnerResponse) &&
    pRespLvlNT >=
      (partnerResponse.includes("♥") || partnerResponse.includes("♠") ? 4 : 5);
  return {
    bid: "Pass",
    category: pRespAtGameNT
      ? "Accept Partner's Game After Your NT Bid"
      : "Pass — NT Bid Said It All",
    reasoning: pRespAtGameNT
      ? `Partner's ${partnerResponse} places the game, chosen with full knowledge of your NT bid's exact range. Pass and let partner play it.`
      : "Your NT bid described this hand's range and shape precisely; nothing that has happened since changes the message. Pass — the decisions belong to partner now.",
    handAnalysis: analysis,
    whatYourBidTellsPartner: pRespAtGameNT
      ? "Accepting the game contract."
      : "Nothing beyond my NT bid.",
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
  /** True when partner has NOT bid since my convention answer (e.g. they
   *  transferred weak and only the OPPONENTS have acted) — partner is limited
   *  and I must not bid on unilaterally. */
  partnerHasNothingNew: boolean = false,
): BidRecommendation {
  const analysis = analyzeHand(hand);
  const { hcp } = hand;

  const iShowedHearts = myLastShowBid === "2♥" || myLastShowBid === "3♥";
  const iShowedSpades = myLastShowBid === "2♠" || myLastShowBid === "3♠";
  const iDeniedMajor = myLastShowBid === "2♦" || myLastShowBid === "3♦";

  // ── Partner has said nothing new — only the opponents have acted ───────────
  // A transfer-then-silence (or Stayman-then-silence) sequence marks partner
  // as WEAK: they were signing off.  Do not bid game on your own values; your
  // 1NT already showed them.
  if (partnerHasNothingNew) {
    return {
      bid: "Pass",
      category: "Pass (Partner Signed Off — Opponents Competing)",
      reasoning: `Partner's ${wasTransferCompletion ? "transfer followed by silence" : "convention sequence followed by silence"} marks a weak hand that was signing off, and only the opponents have bid since. Your 1NT already described this hand — bidding on (e.g. 3NT) would be counting your values twice opposite a known-weak partner. Pass and defend.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "Nothing beyond the 1NT — not punishing you for a weak signoff.",
      expectedResponses: [],
      confidence: "high",
      note: "With a clear fit for partner's shown suit and shortness elsewhere, a cheap competitive raise can be right — but never a unilateral game.",
    };
  }

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
      // 2-card support — accept 3NT. NEVER bid on: 1NT already announced
      // this hand's full range, so partner's 3NT signoff is FINAL — responder
      // is the captain and chose game knowing you could hold 17.
      return {
        bid: "Pass",
        category: "Transfer Follow-up: Accept 3NT (2-Card Fit)",
        reasoning: `Partner's 3NT shows 5 ${suit} and game values. With only ${suitLen}-card support, passing 3NT is correct. Even with a maximum, do not bid again — your NT bidding already told partner your exact range, and their 3NT is a signoff.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: "Accepting 3NT.",
        expectedResponses: [],
        confidence: "high",
      };
    }
    // Stayman context: partner's 3NT after my HEARTS answer IMPLIES 4 spades
    // (they went through Stayman holding a 4-card major that wasn't hearts).
    // With 4-4 majors I answered hearts first — holding 4 spades too, the
    // 4-4 spade fit exists: CORRECT to 4♠, do not pass.
    if (iShowedHearts && hand.spades >= 4) {
      return {
        bid: "4♠",
        category: "Stayman Follow-Up: Correct to 4♠ (4-4 Spade Fit)",
        reasoning: `Partner's 3NT after your hearts answer denies 4 hearts — but going through Stayman implies they hold 4 SPADES. With 4-4 in the majors you answered hearts first; since you also hold ${hand.spades} spades, the 4-4 spade fit exists: correct to 4♠, the safer game.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "I have 4 spades too — the 4-4 fit your Stayman implied. Playing 4♠.",
        expectedResponses: [{ partnerBid: "Pass", meaning: "To play" }],
        confidence: "high",
      };
    }
    // Otherwise the signoff is FINAL: the NT opening already showed the
    // range, so partner chose 3NT knowing your maximum — bidding 4NT would
    // count the same values twice.
    return {
      bid: "Pass",
      category: "Pass — 3NT is Final",
      reasoning:
        "Partner bid 3NT game. Pass — the auction is complete. Even with a maximum, do not bid on: your NT opening already announced your exact range, and partner signed off knowing it. Responder is the captain after an NT opening.",
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Accepting 3NT.",
      expectedResponses: [],
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
      const hasFit = fitLen >= 3;
      const isMax = hcp >= 16;
      const sym = suitSymbol(pMajor);
      // 2×2 grid (per SAYC / bridgebum / CMU):
      //   fit + max  → 4M (game in major)
      //   fit + min  → Pass (leave in 2M partial — 5-2+ fit is playable)
      //   no fit + max → 3NT (game in NT)
      //   no fit + min → 2NT (decline invitation, offer NT — do NOT pass into a 5-2 fit)
      const bid = hasFit ? (isMax ? `4${sym}` : "Pass") : isMax ? "3NT" : "2NT";
      const reasoning = hasFit
        ? isMax
          ? `You denied a 4-card major (2♦) but hold ${fitLen}-card ${pMajor} support. With a maximum (${hcp} HCP), raise to game: 4${sym}.`
          : `You denied a 4-card major (2♦) but hold ${fitLen}-card ${pMajor} support. With a minimum (${hcp} HCP), Pass — partner's invitation is declined, and 2${sym} is a playable partial with your fit.`
        : isMax
          ? `You denied a 4-card major (2♦) and have only ${fitLen}-card ${pMajor} support (no fit). With a maximum (${hcp} HCP), bid 3NT — game in NT is the right spot.`
          : `You denied a 4-card major (2♦) and have only ${fitLen}-card ${pMajor} support (no fit). With a minimum (${hcp} HCP), bid 2NT — this declines the game invitation and offers NT as the strain. Do NOT pass: leaving partner in 2${sym} on a 5-2 fit is worse than playing 2NT. Partner will pass 2NT with a minimum or bid 3NT with a maximum.`;
      const whatTellsPartner = hasFit
        ? isMax
          ? `${fitLen}-card ${pMajor} support — accepting game.`
          : `${fitLen}-card ${pMajor} support — minimum, declining game.`
        : isMax
          ? "No major fit — accepting game in NT."
          : "No major fit, minimum — declining game, suggesting 2NT as the final contract.";
      return {
        bid,
        category: `Partner Shows 5-Card ${pMajor === "hearts" ? "♥" : "♠"} After 2♦ Denial`,
        reasoning,
        handAnalysis: analysis,
        whatYourBidTellsPartner: whatTellsPartner,
        expectedResponses:
          hasFit || isMax
            ? []
            : [
                {
                  partnerBid: "Pass",
                  meaning: "Minimum invitational hand — happy to play 2NT",
                },
                {
                  partnerBid: "3NT",
                  meaning:
                    "Maximum invitational hand (top of 8-9 HCP range) — bids game",
                },
              ],
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
            ? "3NT"
            : "2NT",
      category: "Partner Shows 4 Spades After Opener's 2♥",
      reasoning: `Partner bid 2♠ showing 4 spades and no heart fit (they bid Stayman to find a major — no heart match means spades). ${hand.spades >= 4 ? `You also have 4 spades — ${hcp >= 16 ? "bid 4♠ game." : "bid 3♠ invitational."}` : `Without 4 spades, ${hcp >= 16 ? "bid 3NT to accept game in NT." : "bid 2NT — decline the game invitation with no major fit and a minimum. Partner can pass 2NT or bid 3NT with a maximum invitational hand."}`}`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        hand.spades >= 4
          ? "I have 4 spades too."
          : hcp >= 16
            ? "No spade fit — accepting game in NT."
            : "No spade fit, minimum — declining game, suggesting 2NT.",
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
  /** True when PARTNER was an overcaller (not the opener): their invite after
   *  my 6-10 raise shows a 14-15 support-point overcall — accept with 9-10. */
  partnerWasOvercaller = false,
  /** True when PARTNER was the auction's OPENER: their jump rebid is the
   *  16-18 TP opener invite, and I am the RESPONDER — accept with 9+ HCP. */
  partnerWasOpener = false,
): BidRecommendation {
  const analysis = analyzeHand(hand);
  const { tp, hcp } = analysis;
  // Accepting an invitation in partner's suit commits to that trump fit, so the
  // accept/decline decision is judged by SHORT-suit support points.
  const fitTP = calcTPWithFit(hand);

  // ── Opener context: PARTNER OPENED and jump-rebid their suit (16-18 TP
  // with a 6+ card suit).  I am the responder: accept with 9+ HCP, decline
  // below.  (The 10-12 "responder invite" ladder below does not apply.)
  if (partnerWasOpener && /^3[♠♥♦♣]$/.test(partnerInviteBid)) {
    const invSuitOP = partnerInviteBid.includes("♠")
      ? "spades"
      : partnerInviteBid.includes("♥")
        ? "hearts"
        : partnerInviteBid.includes("♦")
          ? "diamonds"
          : "clubs";
    const invIsMajorOP = invSuitOP === "spades" || invSuitOP === "hearts";
    const supportOP = hand[invSuitOP as keyof Hand] as number;
    if (hcp >= 9) {
      const acceptBid =
        invIsMajorOP && supportOP >= 2
          ? `4${partnerInviteBid.slice(1)}`
          : "3NT";
      return {
        bid: acceptBid,
        category: "Accept Opener's Jump-Rebid Invite (9+ HCP)",
        reasoning: `Partner opened and JUMP-REBID to ${partnerInviteBid} — an invitational 16-18 TP with a good 6+ card ${invSuitOP} suit. With ${hcp} HCP the combined total reaches game: accept with ${acceptBid}${acceptBid === "3NT" ? ` (nine tricks with partner's running ${invSuitOP} suit beat eleven in the minor)` : ` (partner's 6 + your ${supportOP} make a fit)`}.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: "9+ HCP — accepting your 16-18 invite.",
        expectedResponses: [{ partnerBid: "Pass", meaning: "To play" }],
        confidence: "medium",
      };
    }
    return {
      bid: "Pass",
      category: "Decline Opener's Jump-Rebid Invite (Under 9 HCP)",
      reasoning: `Partner opened and JUMP-REBID to ${partnerInviteBid} — an invitational 16-18 TP with a good 6+ card ${invSuitOP} suit, asking you to bid game with 9+ HCP. With only ${hcp} HCP the combined total falls short: decline by passing.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Under 9 HCP — declining your 16-18 invite.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  // ── Overcall context: partner's re-raise invites after MY 6-10 raise ──────
  if (partnerWasOvercaller && /^3[♠♥]$/.test(partnerInviteBid)) {
    const invSuitOC = partnerInviteBid.includes("♠") ? "spades" : "hearts";
    if (fitTP >= 9) {
      return {
        bid: `4${partnerInviteBid.slice(1)}`,
        category: "Accept the Overcaller's Invite (9-10 Support Pts)",
        reasoning: `Partner overcalled and, after your raise (6-10), re-raised to ${partnerInviteBid} — an invitation showing an above-minimum overcall (about 14-15 support points). With ${fitTP} support points you are at the TOP of what your raise promised: accept with 4${partnerInviteBid.slice(1)}.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `Maximum raise (9-10) — accepting your invite in ${invSuitOC}.`,
        expectedResponses: [{ partnerBid: "Pass", meaning: "To play" }],
        confidence: "medium",
      };
    }
    return {
      bid: "Pass",
      category: "Decline the Overcaller's Invite (Minimum Raise)",
      reasoning: `Partner overcalled and, after your raise (6-10), re-raised to ${partnerInviteBid} — an invitation showing about 14-15 support points. With only ${fitTP} support points you are at the bottom of your raise: decline by passing.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Minimum raise (6-8) — declining.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  // Partner passed — no invitation was actually made
  if (partnerInviteBid === "Pass" || !partnerInviteBid) {
    return {
      bid: "Pass",
      category: "Pass (Partner Passed)",
      reasoning:
        "Partner passed — no invitation was made. The auction is complete at the current contract. Pass.",
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Accepting the contract.",
      expectedResponses: [],
      confidence: "high",
    };
  }

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

  // The invite is the OPENER's game-try re-raise of a suit I RAISED
  // (1X-2X-3X): it shows 16-18, and I accept with the TOP of my 6-9 raise.
  const inviteIsOpenersGameTry =
    !partnerWasOvercaller &&
    !!_myLastBid &&
    /^[1-7][♠♥♦♣]$/.test(_myLastBid) &&
    _myLastBid.slice(1) === partnerInviteBid.slice(1);
  if (inviteIsOpenersGameTry) {
    if (fitTP >= 8) {
      return {
        bid: gameBid,
        category: `Accept the Game Try (${fitTP} support pts — Maximum Raise)`,
        reasoning: `Partner's ${partnerInviteBid} re-raise after your raise is a GAME TRY showing about 16-18 support points. With ${fitTP} support points you hold the top of your 6-9 raise: accept with ${gameBid}.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: "Maximum raise (8-9) — accepting the try.",
        expectedResponses: [],
        confidence: "high",
      };
    }
    return {
      bid: "Pass",
      category: "Decline the Game Try (Minimum Raise)",
      reasoning: `Partner's ${partnerInviteBid} re-raise after your raise is a GAME TRY showing about 16-18 support points. With only ${fitTP} support points you are at the bottom of your 6-9 raise: decline by passing.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Minimum raise (6-7) — declining the try.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  // Maximum opener (16+ support points): accept the invitation, bid game
  if (fitTP >= 16) {
    return {
      bid: gameBid,
      category: `Accept Partner's ${suitName} Invitation (${fitTP} support pts — Maximum)`,
      reasoning: `Partner's ${partnerInviteBid} is an invitational jump rebid (5+ ${invitedSuit}, 10–12 pts). With ${fitTP} support points (maximum opener), accept and bid game — ${gameBid}.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Accepting the invitation — game-going values.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  // Mid-range (14–15 support pts) with 3+ card support: accept with the fit
  if (fitTP >= 14 && fitTP <= 15 && supportCount >= 3) {
    return {
      bid: gameBid,
      category: `Accept Invitation — Good Fit (${fitTP} support pts, ${supportCount}-Card Support)`,
      reasoning: `Partner's ${partnerInviteBid} shows 5+ ${invitedSuit} and 10–12 pts. With ${supportCount}-card support and ${fitTP} support points, accept — ${gameBid}. The ${invitedSuit} fit and combined values make game reasonable.`,
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
// ─── Overcaller's second turn ────────────────────────────────────────────────
// I overcalled; partner has advanced.  Partner's advance is LIMITED (simple
// raise 6-10, new suit constructive, cuebid 10+), so act accordingly — never
// read it with opener semantics.
function getOvercallerRebid(
  hand: Hand,
  context: AuctionContext,
): BidRecommendation {
  const analysis = analyzeHand(hand);
  const { tp } = analysis;

  // ── Partner has said nothing new since my last real bid — my overcall and
  // rebid are fully described; do not repeat them over the opponents' action.
  if (context.partnerHasNothingNew) {
    return {
      bid: "Pass",
      category: "Pass — Overcall and Rebid Already Described This Hand",
      reasoning:
        "Your overcall and your rebid have already told partner this hand's story, and partner has added nothing since — only the opponents have acted. Bidding the same values again is how sides get too high. Pass; the decision is partner's.",
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Nothing new — over to you.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  // ── My overcall was a MICHAELS CUEBID and partner asked 2NT for the minor —
  // that ask is ARTIFICIAL and FORCING: answer 3♣/3♦, never pass it out.
  {
    const myFirst = context.myFirstBid;
    const openerBidMC = context.lhoBid; // derivation passes the opening here
    const iWasMichaels =
      !!myFirst &&
      !myFirst.endsWith("NT") &&
      !!openerBidMC &&
      !openerBidMC.endsWith("NT") &&
      myFirst.slice(1) === openerBidMC.slice(1);
    // Only when the cue is still my LATEST bid — once the ask is answered,
    // this branch must not fire again.
    if (
      iWasMichaels &&
      context.partnerBid === "2NT" &&
      context.myPreviousBid === myFirst
    ) {
      const minorName = hand.diamonds >= hand.clubs ? "diamonds" : "clubs";
      const minorAnswer = `3${suitSymbol(minorName)}`;
      return {
        bid: minorAnswer,
        category: "Answer the Michaels Minor Ask",
        reasoning: `Your ${myFirst} was Michaels, and partner's 2NT is the ARTIFICIAL, forcing ask for your minor. Answer ${minorAnswer} — your 5-card minor is ${minorName}. Never pass the ask: 2NT is not a contract proposal.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `My Michaels minor is ${minorName} (5+ cards).`,
        expectedResponses: [
          { partnerBid: "Pass", meaning: "Preferring your minor — partscore" },
          {
            partnerBid: "Raise / new bid",
            meaning: "Inviting or placing the contract with fit knowledge",
          },
        ],
        confidence: "high",
      };
    }

    // ── STRONG-variant Michaels (16+ TP): partner's simple preference shows
    // no extras, but MY hand was never limited — the strong variant plans to
    // bid again. Raise partner's preferred suit to game rather than sell out.
    if (
      iWasMichaels &&
      tp >= 16 &&
      context.partnerBid &&
      /^[1-7][♠♥♦♣]$/.test(context.partnerBid) &&
      context.partnerBid.slice(1) !== myFirst!.slice(1)
    ) {
      const prefSym = context.partnerBid.slice(1);
      const prefSuitName =
        prefSym === "♠"
          ? "spades"
          : prefSym === "♥"
            ? "hearts"
            : prefSym === "♦"
              ? "diamonds"
              : "clubs";
      const myLenInPref = prefSuitName
        ? (hand[prefSuitName as keyof Hand] as number)
        : 0;
      if (prefSuitName && myLenInPref >= 5) {
        const isMajorPref =
          prefSuitName === "hearts" || prefSuitName === "spades";
        const gameLvl = isMajorPref ? 4 : 5;
        const floorSM = [context.lhoBid, context.rhoBid, context.partnerBid]
          .filter((b): b is string => isRealBid(b))
          .sort((a, b) => BID_ORDER.indexOf(b) - BID_ORDER.indexOf(a))[0];
        let target = `${gameLvl}${context.partnerBid.slice(1)}`;
        if (
          floorSM &&
          BID_ORDER.indexOf(target) <= BID_ORDER.indexOf(floorSM)
        ) {
          const bumped = `${gameLvl + 1}${context.partnerBid.slice(1)}`;
          target =
            gameLvl + 1 <= 5 &&
            BID_ORDER.indexOf(bumped) > BID_ORDER.indexOf(floorSM)
              ? bumped
              : "";
        }
        if (target) {
          return {
            bid: target,
            category: "Strong Michaels — Bid On to Game",
            reasoning: `Your ${myFirst} Michaels cuebid had the STRONG variant (${tp} TP, 16+). Partner's ${context.partnerBid} preference showed which of your suits they prefer, not extra strength — but YOUR hand was never limited. With game values opposite even a minimum preference, bid ${target} rather than defend.`,
            handAnalysis: analysis,
            whatYourBidTellsPartner:
              "My Michaels was the strong variant (16+) — game in your preferred suit.",
            expectedResponses: [
              { partnerBid: "Pass", meaning: "Accepting the game contract" },
            ],
            confidence: "high",
          };
        }
      }
    }
  }

  const suitOf = (bid: string | undefined): string | undefined =>
    bid?.includes("♠")
      ? "spades"
      : bid?.includes("♥")
        ? "hearts"
        : bid?.includes("♦")
          ? "diamonds"
          : bid?.includes("♣")
            ? "clubs"
            : undefined;

  const myOcBid = context.myFirstBid ?? context.myPreviousBid;
  const myOcSuit = suitOf(myOcBid);
  const partnerLatest = context.partnerBid;
  const partnerSuit = suitOf(partnerLatest);
  const openerSuit = suitOf(context.lhoBid);
  const myOcLen = myOcSuit ? (hand[myOcSuit as keyof Hand] as number) : 0;
  const isMajor = myOcSuit === "hearts" || myOcSuit === "spades";
  // Once partner has shown support (a fit is agreed), re-value the hand with
  // SHORT-suit ruffing points rather than long-suit TP.
  const fitTP = calcTPWithFit(hand);

  // Partner raised my suit
  if (partnerLatest && partnerSuit && myOcSuit && partnerSuit === myOcSuit) {
    const raiseLevel = parseInt(partnerLatest[0]);
    // The OPPONENTS have outbid partner's raise — the decision is compete,
    // pass, or (rarely) bid game on values.  "Accept partner's raise" is the
    // wrong story once their bid stands above it.
    const oppStandingOCR = [context.lhoBid, context.rhoBid]
      .filter((b): b is string => isRealBid(b))
      .sort((a, b) => BID_ORDER.indexOf(b) - BID_ORDER.indexOf(a))[0];
    if (
      oppStandingOCR &&
      BID_ORDER.indexOf(oppStandingOCR) > BID_ORDER.indexOf(partnerLatest)
    ) {
      const impliedSupport = raiseLevel >= 4 ? 5 : raiseLevel === 3 ? 4 : 3;
      const totalTrumpsOCR = myOcLen + impliedSupport;
      const lottLvlOCR = Math.min(totalTrumpsOCR - 6, isMajor ? 4 : 5);
      const nextInSuit = BID_ORDER.find(
        (b, i) =>
          i > BID_ORDER.indexOf(oppStandingOCR) &&
          b.endsWith(suitSymbol(myOcSuit)),
      );
      const nextLvl = nextInSuit ? parseInt(nextInSuit[0]) : 9;
      // Strong values (18+ with the fit): bid on to the major game.
      if (fitTP >= 18 && isMajor && nextInSuit && nextLvl <= 4) {
        return {
          bid: nextInSuit,
          category: "Bid On Over Their Competition (Values)",
          reasoning: `The opponents' ${oppStandingOCR} outbid partner's ${partnerLatest} raise, but with ${fitTP} support points — a maximum overcall — and the known ${totalTrumpsOCR}-card fit, your side rates to make ${nextInSuit}. Bid it rather than defend.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner:
            "Maximum overcall — bidding to make, not sacrificing.",
          expectedResponses: [{ partnerBid: "Pass", meaning: "To play" }],
          confidence: "medium",
        };
      }
      if (nextInSuit && nextLvl <= lottLvlOCR) {
        return {
          bid: nextInSuit,
          category: "Compete to the Law Level Over Their Bid",
          reasoning: `The opponents' ${oppStandingOCR} outbid partner's raise. Your ${myOcLen} ${myOcSuit} plus partner's implied ${impliedSupport}+ support makes ${totalTrumpsOCR} trumps — the Law of Total Tricks says the ${lottLvlOCR}-level is safe. Bid ${nextInSuit}, competitive only.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner:
            "Competing on the trump fit — not extra strength. Do not raise.",
          expectedResponses: [
            { partnerBid: "Pass", meaning: "Always — competitive" },
          ],
          confidence: "medium",
        };
      }
      return {
        bid: "Pass",
        category: "Pass — Outbid; the Law Says Defend",
        reasoning: `The opponents' ${oppStandingOCR} stands above partner's ${partnerLatest} raise. With ${totalTrumpsOCR} total trumps the Law of Total Tricks puts your side's safe height at the ${lottLvlOCR}-level — bidding higher would trade a plus score for a penalty. Pass and defend; partner has already limited their hand.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "Not bidding beyond the Law level — defending.",
        expectedResponses: [],
        confidence: "medium",
      };
    }
    if (raiseLevel >= 4 || (!isMajor && raiseLevel >= 3)) {
      return {
        bid: "Pass",
        category: "Accept Partner's Raise",
        reasoning: `Partner has raised your ${myOcSuit} overcall to ${partnerLatest}. A raise in competition extends the barrage — it is to play, not an invitation. Your overcall already described this hand, and the preemptor/overcaller never bids again on their own: pass.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: "Nothing extra beyond the overcall.",
        expectedResponses: [],
        confidence: "medium",
      };
    }
    // Partner CUED the opener's suit earlier (limit-raise-or-better, 10+),
    // so their return to my suit now is LIMIT-based — not preemptive.  With
    // a sound overcall (14+ support pts) the combined 24+ takes the game.
    const partnerCuedEarlierOCR =
      !!context.partnerFirstBid &&
      !!context.lhoBid &&
      /^[1-7][♠♥♦♣]$/.test(context.partnerFirstBid) &&
      /^[1-7][♠♥♦♣]$/.test(context.lhoBid) &&
      context.partnerFirstBid !== context.lhoBid &&
      context.partnerFirstBid.slice(1) === context.lhoBid.slice(1);
    if (raiseLevel === 3 && isMajor && partnerCuedEarlierOCR) {
      if (fitTP >= 14) {
        return {
          bid: `4${suitSymbol(myOcSuit)}`,
          category: "Bid Game — Partner's Cue Showed Limit Values",
          reasoning: `Partner's earlier cuebid showed a limit raise or better (10+ support points); their ${partnerLatest} now confirms the ${myOcSuit} fit at limit strength. With ${fitTP} support points the combined values reach game: bid 4${suitSymbol(myOcSuit)}.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner:
            "Sound overcall (14+ support pts) — game opposite your limit raise.",
          expectedResponses: [{ partnerBid: "Pass", meaning: "To play" }],
          confidence: "medium",
        };
      }
      return {
        bid: "Pass",
        category: "Pass — Limit Raise, Minimum Overcall",
        reasoning: `Partner's earlier cuebid showed a limit raise or better and their ${partnerLatest} sets the ${myOcSuit} fit, but with a minimum overcall (${fitTP} support points) the combined values fall short of game. Pass.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "Minimum overcall — no game opposite a limit raise.",
        expectedResponses: [],
        confidence: "high",
      };
    }
    // Partner's JUMP raise to 3M in competition is PREEMPTIVE (0-9, 4+
    // trumps).  Bid the game only with a true maximum (19+ support points);
    // otherwise respect the barrage.
    if (raiseLevel === 3 && isMajor) {
      if (fitTP >= 19) {
        return {
          bid: `4${suitSymbol(myOcSuit)}`,
          category: "Raise the Preempt to Game (Maximum Overcall)",
          reasoning: `Partner's jump to ${partnerLatest} in competition is a PREEMPTIVE raise (about 0-9 with 4+ trumps). With ${fitTP} support points — a true maximum for the overcall — even a minimum preemptive raise should produce game: bid 4${suitSymbol(myOcSuit)}.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner:
            "Maximum overcall (19+ support pts) — game opposite your preemptive raise.",
          expectedResponses: [{ partnerBid: "Pass", meaning: "To play" }],
          confidence: "medium",
        };
      }
      return {
        bid: "Pass",
        category: "Respect the Preemptive Raise",
        reasoning: `Partner's jump to ${partnerLatest} in competition is PREEMPTIVE — about 0-9 points with 4+ trumps, extending the barrage. With ${fitTP} support points you have no reason to bid on: the raise was to play. Pass.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: "Nothing extra beyond the overcall.",
        expectedResponses: [],
        confidence: "high",
      };
    }
    if (raiseLevel === 2 && fitTP >= 16 && isMajor) {
      return {
        bid: `4${suitSymbol(myOcSuit)}`,
        category: "Bid Game After Partner's Raise (Maximum Overcall)",
        reasoning: `Partner's simple raise shows 6-10 support points. With ${fitTP} support points — a maximum overcall — the combined 22+ justifies game in your major.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `Maximum overcall (16+ support pts) with a good ${myOcSuit} suit.`,
        expectedResponses: [],
        confidence: "medium",
      };
    }
    if (raiseLevel === 2 && fitTP >= 14) {
      return {
        bid: `3${suitSymbol(myOcSuit)}`,
        category: "Invite After Partner's Raise",
        reasoning: `Partner's simple raise shows 6-10 support points. With ${fitTP} support points, invite — partner bids game with a maximum (9-10), passes with less.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "Above-minimum overcall (14-15 support pts), inviting game.",
        expectedResponses: [
          { partnerBid: "Pass", meaning: "Minimum raise (6-8)" },
          {
            partnerBid: isMajor ? `4${suitSymbol(myOcSuit)}` : "Game",
            meaning: "Maximum raise (9-10)",
          },
        ],
        confidence: "medium",
      };
    }
    return {
      bid: "Pass",
      category: "Accept Partner's Raise (Minimum Overcall)",
      reasoning: `Partner's raise shows 6-10 support points; with a minimum overcall (${tp} TP), the partscore is high enough. Pass.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Minimum overcall — nothing extra.",
      expectedResponses: [],
      confidence: "medium",
    };
  }

  // Partner cuebid the opener's suit: strong advance (10+ pts, support or values).
  // FORCING for one round — do not pass.  Describe the hand naturally.
  if (
    partnerLatest &&
    partnerSuit &&
    openerSuit &&
    partnerSuit === openerSuit
  ) {
    // Second suit to show?
    const second = (["spades", "hearts", "diamonds", "clubs"] as const).find(
      (s) =>
        s !== myOcSuit &&
        s !== openerSuit &&
        (hand[s as keyof Hand] as number) >= 5,
    );
    const latestIdx = Math.max(
      BID_ORDER.indexOf(partnerLatest),
      ...[context.lhoBid, context.rhoBid]
        .filter((b): b is string => isRealBid(b))
        .map((b) => BID_ORDER.indexOf(b)),
    );
    const cheapest = (sym: string): string | undefined =>
      BID_ORDER.find((b, i) => i > latestIdx && b.endsWith(sym));
    // With a second 5-card suit, show it first (below) so partner can pick the
    // better fit — don't bury a two-suiter by jumping to game in the first suit.
    if (myOcSuit && isMajor && fitTP >= 14 && myOcLen >= 5 && !second) {
      const game = `4${suitSymbol(myOcSuit)}`;
      return {
        bid: game,
        category: "Bid Game After Partner's Cuebid",
        reasoning: `Partner's cuebid of the opener's suit shows 10+ points with support. With ${fitTP} support points, combined values are enough for game in your major.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "Sound overcall (14+ TP) — accepting partner's game try.",
        expectedResponses: [],
        confidence: "medium",
      };
    }
    if (second) {
      const bid2 = cheapest(suitSymbol(second));
      if (bid2 && parseInt(bid2[0]) <= 3) {
        return {
          bid: bid2,
          category: "Show Second Suit After Partner's Cuebid",
          reasoning: `Partner's cuebid is forcing for one round (10+ points, fit or values). Show your second 5-card suit (${second}) — partner picks the final spot.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: `5+ ${myOcSuit ?? "cards in your first suit"} and 4-5+ ${second}. Minimum unless I bid again.`,
          expectedResponses: [],
          confidence: "medium",
        };
      }
    }
    const rebidMine = myOcSuit ? cheapest(suitSymbol(myOcSuit)) : undefined;
    // The cue is FORCING — the cheapest same-suit rebid is always available
    // up to game level (a high cue simply forces a high answer).
    const rebidMineGameLvl =
      myOcSuit === "hearts" || myOcSuit === "spades" ? 4 : 5;
    if (rebidMine && parseInt(rebidMine[0]) <= rebidMineGameLvl) {
      return {
        bid: rebidMine,
        category: "Rebid Suit After Partner's Cuebid (Minimum)",
        reasoning: `Partner's cuebid is forcing for one round. With a minimum overcall and no second suit, rebid your ${myOcSuit} cheaply — partner places the contract.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `${tp >= 14 ? "Sound overcall (14+ TP)" : "Minimum overcall (8-13 TP)"}, 5+ ${myOcSuit}.`,
        expectedResponses: [
          { partnerBid: "Raise / game", meaning: "Going on with extras" },
          { partnerBid: "Pass", meaning: "Stopping at the cheapest spot" },
        ],
        confidence: "medium",
      };
    }
  }

  // Partner bid a new suit or NT — limited and non-forcing.  Support with 3+,
  // otherwise pass.
  if (
    partnerLatest &&
    partnerSuit &&
    (hand[partnerSuit as keyof Hand] as number) >= 3 &&
    fitTP >= 14
  ) {
    const latestIdx = BID_ORDER.indexOf(partnerLatest);
    const raise = BID_ORDER.find(
      (b, i) => i > latestIdx && b.endsWith(suitSymbol(partnerSuit)),
    );
    if (raise && parseInt(raise[0]) <= 3) {
      return {
        bid: raise,
        category: "Raise Partner's Advance",
        reasoning: `Partner advanced in ${partnerSuit} (natural, limited). With 3+ card support and ${tp} TP, raise once.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `3+ ${partnerSuit} support, sound overcall (14+ TP).`,
        expectedResponses: [],
        confidence: "medium",
      };
    }
  }
  // ── HUGE extra trump length (7+ cards): the overcall showed only 5-6, so
  // one competitive rebid of the suit is in order rather than selling out —
  // the suit itself is nearly self-sufficient.
  if (myOcSuit && myOcLen >= 7 && tp >= 12) {
    const floorOCR = [context.lhoBid, context.rhoBid, context.partnerBid]
      .filter((b): b is string => isRealBid(b))
      .sort((a, b) => BID_ORDER.indexOf(b) - BID_ORDER.indexOf(a))[0];
    const floorIdxOCR = floorOCR ? BID_ORDER.indexOf(floorOCR) : -1;
    const rebidOCR = BID_ORDER.find(
      (b, i) => i > floorIdxOCR && b.endsWith(suitSymbol(myOcSuit)),
    );
    if (rebidOCR && parseInt(rebidOCR[0]) <= 4) {
      return {
        bid: rebidOCR,
        category: "Competitive Rebid — Huge Extra Length (7+ Cards)",
        reasoning: `Your overcall promised only 5-6 ${myOcSuit}; you hold ${myOcLen} — enormous undisclosed playing strength. Rather than sell out, rebid ${rebidOCR}: with that trump length the hand takes tricks on its own, and the Law of Total Tricks is comfortably on your side. Non-forcing.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `${myOcLen}-card ${myOcSuit} suit — competing on massive length, not extra high cards.`,
        expectedResponses: [
          { partnerBid: "Pass", meaning: "No fit, minimum — to play" },
          { partnerBid: "Raise", meaning: "Fit — extending the barrage" },
        ],
        confidence: "medium",
      };
    }
  }

  return {
    bid: "Pass",
    category: "Pass (Overcall Fully Described)",
    reasoning:
      "Your overcall already described this hand, and partner's advance is limited and non-forcing. With no extras to show, pass.",
    handAnalysis: analysis,
    whatYourBidTellsPartner: "Nothing beyond the original overcall.",
    expectedResponses: [],
    confidence: "medium",
  };
}

// ─── Responder's second bid (after a SUIT response) ──────────────────────────
// Partner opened, I responded in a suit, partner has rebid.  Classify partner's
// rebid range conservatively, then place the contract by combined strength.
function getResponderRebid(
  hand: Hand,
  context: AuctionContext,
): BidRecommendation {
  const analysis = analyzeHand(hand);
  const { tp } = analysis;

  // ── My previous bid was a WEAK natural ESCAPE over interference with
  // partner's 1NT opening (0-7) — the hand is already limited; bidding on
  // (especially game!) would count the same nothing twice.
  if (
    context.partnerFirstBid === "1NT" &&
    context.myPreviousBid &&
    /^[23][♠♥♦♣]$/.test(context.myPreviousBid) &&
    tp <= 11
  ) {
    const escSuitName = context.myPreviousBid.includes("♠")
      ? "spades"
      : context.myPreviousBid.includes("♥")
        ? "hearts"
        : context.myPreviousBid.includes("♦")
          ? "diamonds"
          : "clubs";
    const escLen = hand[escSuitName as keyof Hand] as number;
    const escFloor = [context.lhoBid, context.rhoBid, context.partnerBid]
      .filter((b): b is string => isRealBid(b))
      .sort((a, b) => BID_ORDER.indexOf(b) - BID_ORDER.indexOf(a))[0];
    const escNext = escFloor
      ? BID_ORDER.find(
          (b, i) =>
            i > BID_ORDER.indexOf(escFloor) &&
            b.endsWith(suitSymbol(escSuitName)),
        )
      : undefined;
    // A 7+ card suit may compete once more per the Law (7 + 2 = 9 trumps).
    if (
      escLen >= 7 &&
      escNext &&
      parseInt(escNext[0]) <= 3 &&
      escFloor &&
      escFloor !== context.partnerBid
    ) {
      return {
        bid: escNext,
        category: "Compete Once More (7+ Card Suit)",
        reasoning: `Your ${context.myPreviousBid} escape showed a weak hand, but a ${escLen}-card suit gives the Law of Total Tricks room for one more step — bid ${escNext}, competitive only.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `${escLen}-card ${escSuitName} — length, not strength.`,
        expectedResponses: [{ partnerBid: "Pass", meaning: "Always" }],
        confidence: "medium",
      };
    }
    return {
      bid: "Pass",
      category: "Pass — Weak Escape Already Limited This Hand",
      reasoning: `Your ${context.myPreviousBid} over the interference was a WEAK escape (roughly 0-7) — partner knows your hand within a couple of points. Whatever has happened since, bidding again would promise values you never had. Pass; partner (whose 1NT showed 15-17) makes any further decision.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Nothing beyond the weak escape — your call.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  // ── Partner's rebid was a REVERSE (new suit, 2-level, higher-ranking than
  // their opening): 17+ and forcing one round.  With a weak hand and a long
  // suit, the book rebid is my own suit at the cheapest level — a WEAK
  // signoff attempt, not an invitation.
  {
    const pFirstRV = context.partnerFirstBid;
    const pLatestRV = context.partnerBid;
    const myPrevRV = context.myPreviousBid;
    const isReverseRV =
      !!pFirstRV &&
      !!pLatestRV &&
      /^1[♠♥♦♣]$/.test(pFirstRV) &&
      /^2[♠♥♦♣]$/.test(pLatestRV) &&
      pLatestRV.slice(1) !== pFirstRV.slice(1) &&
      (!myPrevRV || pLatestRV.slice(1) !== myPrevRV.slice(1)) &&
      "♣♦♥♠".indexOf(pLatestRV.slice(1)) > "♣♦♥♠".indexOf(pFirstRV.slice(1));
    if (isReverseRV && tp < 10 && myPrevRV && /^[1-7][♠♥♦♣]$/.test(myPrevRV)) {
      const mySuitNameRV = myPrevRV.includes("♠")
        ? "spades"
        : myPrevRV.includes("♥")
          ? "hearts"
          : myPrevRV.includes("♦")
            ? "diamonds"
            : "clubs";
      const myLenRV = hand[mySuitNameRV as keyof Hand] as number;
      if (myLenRV >= 6) {
        const floorRVIdx = BID_ORDER.indexOf(pLatestRV);
        const rebidRV = BID_ORDER.find(
          (b, i) => i > floorRVIdx && b.endsWith(suitSymbol(mySuitNameRV)),
        );
        if (rebidRV && parseInt(rebidRV[0]) <= 3) {
          return {
            bid: rebidRV,
            category: "Rebid Long Suit After Reverse (Weak)",
            reasoning: `Partner's ${pLatestRV} is a REVERSE — 17+ points, forcing one round. With only ${tp} TP you cannot pass, but you owe partner the truth: rebid your ${myLenRV}-card ${mySuitNameRV} suit at the cheapest level (${rebidRV}). This shows a WEAK responding hand whose only feature is the long suit — partner may pass or continue with extras.`,
            handAnalysis: analysis,
            whatYourBidTellsPartner: `Minimum response (6-9) with a long ${mySuitNameRV} suit — nothing else to say.`,
            expectedResponses: [
              { partnerBid: "Pass", meaning: "Accepting the signoff" },
              { partnerBid: "3NT / raise", meaning: "Extras — bidding on" },
            ],
            confidence: "high",
          };
        }
      }
    }
  }

  // ── The opponents have driven the auction to game level and this hand has
  // no reserve strength — nothing constructive exists; pass cleanly rather
  // than compute a bid the floor forbids.
  {
    const respFloorRR = [context.lhoBid, context.rhoBid]
      .filter((b): b is string => isRealBid(b))
      .sort((a, b) => BID_ORDER.indexOf(b) - BID_ORDER.indexOf(a))[0];
    if (
      respFloorRR &&
      (parseInt(respFloorRR[0]) || 0) >= 4 &&
      tp >= 13 &&
      !respFloorRR.endsWith("NT") &&
      // Only when the OPPONENTS hold the standing bid — if partner has since
      // outbid them, accept partner's contract instead.
      (!isRealBid(context.partnerBid) ||
        BID_ORDER.indexOf(respFloorRR) > BID_ORDER.indexOf(context.partnerBid))
    ) {
      return {
        bid: "Double",
        category: "Values Double of Their Game-Level Jam",
        reasoning: `The opponents have jammed the auction to ${respFloorRR}, but your ${tp} TP plus partner's opening means YOUR side owns most of the strength — do not let them steal. Double shows those values: partner may pass for penalty or pull with great shape.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "Game-going values with no clear bid — sit or pull.",
        expectedResponses: [
          { partnerBid: "Pass", meaning: "Defending for penalty" },
          { partnerBid: "Bid", meaning: "Long suit / wild shape — pulling" },
        ],
        confidence: "medium",
      };
    }
    if (respFloorRR && (parseInt(respFloorRR[0]) || 0) >= 4 && tp < 13) {
      return {
        bid: "Pass",
        category: "Pass — Opponents at Game Level, Nothing to Add",
        reasoning: `The opponents have driven the auction to ${respFloorRR}. Your earlier bidding already showed this hand, and with ${tp} TP there is no strength in reserve to act at this level. Pass; the decision (double or bid on) belongs to partner.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: "Nothing in reserve — your call.",
        expectedResponses: [],
        confidence: "high",
      };
    }
  }

  // ── My earlier response/rebid already described this hand and partner has
  // added nothing since — only the opponents acted.  Do not repeat the same
  // values at a higher level; the decision belongs to partner now.
  if (context.partnerHasNothingNew) {
    const oppNowRR = [context.lhoBid, context.rhoBid]
      .filter((b): b is string => isRealBid(b))
      .sort((a, b) => BID_ORDER.indexOf(b) - BID_ORDER.indexOf(a))[0];
    return {
      bid: "Pass",
      category: "Pass — Your Earlier Bid Said It All",
      reasoning: `Your previous bid already showed this hand's strength and fit, and partner has said nothing new since${oppNowRR ? ` — only the opponents have acted (now at ${oppNowRR})` : ""}. Bidding the same values again at a higher level is how sides get too high. Pass; partner knows your hand and can still compete.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Nothing beyond my previous bid — over to you.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  const suitOf = (bid: string | undefined): string | undefined =>
    bid?.includes("♠")
      ? "spades"
      : bid?.includes("♥")
        ? "hearts"
        : bid?.includes("♦")
          ? "diamonds"
          : bid?.includes("♣")
            ? "clubs"
            : undefined;

  const partnerLatest = context.partnerBid;
  const partnerFirst = context.partnerFirstBid ?? partnerLatest;
  const myBid = context.myPreviousBid;
  const mySuit = suitOf(myBid);
  const pFirstSuit = suitOf(partnerFirst);
  const pLatestSuit = suitOf(partnerLatest);

  // Opener's minimum strength implied by their rebid
  const openerMin = (() => {
    if (!partnerLatest) return 12;
    // Partner opened with a PREEMPT (weak 2 or 3-level+): 5-9 HCP — their
    // rebids never show extra strength, no matter the level.
    const firstLvl = partnerFirst ? parseInt(partnerFirst[0]) : 1;
    const firstSuitChar = partnerFirst?.slice(1);
    const wasPreemptOpen =
      partnerFirst !== undefined &&
      !partnerFirst.endsWith("NT") &&
      (firstLvl >= 3 ||
        (firstLvl === 2 && ["♦", "♥", "♠"].includes(firstSuitChar ?? "")));
    if (wasPreemptOpen) return 6;
    // Strong artificial 2♣: the 3NT rebid over the 2♦ waiting response is
    // specifically 25-27 balanced (2NT would be 22-24).
    if (partnerFirst === "2♣") return partnerLatest === "3NT" ? 25 : 22;
    // Partner OPENED in notrump: the opening already defined the range
    // (1NT = 15-17, 2NT = 20-21) — later NT rebids (e.g. 3NT over my forcing
    // 3-level response) add NOTHING and must not be read as the 18-19 jump.
    if (partnerFirst === "1NT") return 15;
    if (partnerFirst === "2NT") return 20;
    // NT rebids: the CHEAPEST NT rebid shows 12-14; only a JUMP shows 18-19.
    // 2NT is a jump only when 1NT was still available — i.e. my response was
    // at the 1-level AND no opponent interference pushed the auction past 1NT.
    const myRespLvl = myBid ? parseInt(myBid[0]) || 1 : 1;
    const oppIdxs = [context.lhoBid, context.rhoBid]
      .filter(
        (b): b is string =>
          !!b && b !== "Pass" && b !== "Double" && b !== "Redouble",
      )
      .map((b) => BID_ORDER.indexOf(b));
    const maxOppIdx = oppIdxs.length ? Math.max(...oppIdxs) : -1;
    const oneNTWasAvailable =
      myRespLvl === 1 && maxOppIdx < BID_ORDER.indexOf("1NT");
    const twoNTWasAvailable = maxOppIdx < BID_ORDER.indexOf("2NT");
    if (partnerLatest === "1NT") return 12; // 12-14 balanced
    if (partnerLatest === "2NT") return oneNTWasAvailable ? 18 : 12;
    if (partnerLatest === "3NT")
      return oneNTWasAvailable || twoNTWasAvailable ? 18 : 12;
    const lvl = parseInt(partnerLatest[0]);
    // A 3-level rebid/raise shows 16+ only when it was a JUMP — if opponent
    // interference (or my own response) had already pushed the auction past
    // the cheaper level, the same call is the CHEAPEST available (12-15).
    const preRebidFloorIdx = context.partnerRebidFloor
      ? BID_ORDER.indexOf(context.partnerRebidFloor)
      : Math.max(maxOppIdx, myBid ? BID_ORDER.indexOf(myBid) : -1);
    const cheapestOf = (suitName: string): string | undefined =>
      BID_ORDER.find(
        (b, i) => i > preRebidFloorIdx && b.endsWith(suitSymbol(suitName)),
      );
    if (pLatestSuit && pLatestSuit === pFirstSuit && lvl >= 3)
      return cheapestOf(pLatestSuit) === partnerLatest ? 12 : 16; // jump rebid only if a jump
    if (pLatestSuit && mySuit && pLatestSuit === mySuit && lvl >= 3)
      return cheapestOf(pLatestSuit) === partnerLatest ? 12 : 16; // jump raise only if a jump
    return 12; // minimum rebid / simple raise / new suit
  })();

  // Fit determination (computed BEFORE the combined-points total so a suit fit
  // can be valued with short-suit ruffing points).
  const myLenIn = (s: string | undefined): number =>
    s ? (hand[s as keyof Hand] as number) : 0;
  const partnerRaisedMe = !!(mySuit && pLatestSuit === mySuit);
  const fitSuit = partnerRaisedMe
    ? mySuit
    : pFirstSuit &&
        myLenIn(pFirstSuit) >= 3 &&
        pFirstSuit !== "clubs" &&
        pFirstSuit !== "diamonds"
      ? pFirstSuit
      : mySuit && myLenIn(mySuit) >= 6
        ? mySuit
        : undefined;
  const fitIsMajor = fitSuit === "hearts" || fitSuit === "spades";

  // With a trump fit, value my hand with short-suit support (ruffing) points.
  // With no fit (heading for notrump) a long side suit is still a source of
  // tricks, so long-suit TP is the right measure there — NOT raw HCP, which
  // would undervalue the long suit, and NOT short-suit points, which credit
  // ruffing values that don't exist without a trump fit.
  const myValue = fitSuit ? calcTPWithFit(hand) : tp;
  const combined = myValue + openerMin;

  // Any bid must clear EVERY live call — partner's latest, my OWN previous
  // bid, and the opponents' bids.  Flooring on partner's bid alone re-offers
  // bids the auction (often my own earlier call!) has already consumed.
  const floorIdx = Math.max(
    BID_ORDER.indexOf(partnerLatest ?? "1NT"),
    myBid ? BID_ORDER.indexOf(myBid) : -1,
    ...[context.lhoBid, context.rhoBid].map((b) =>
      b && isRealBid(b) ? BID_ORDER.indexOf(b) : -1,
    ),
  );
  const cheapestIn = (sym: string): string | undefined =>
    BID_ORDER.find((b, i) => i > floorIdx && b.endsWith(sym));

  // ── Quantitative zone: partner's NT OPENING spans a 2-3 point range.  When
  // only partner's MAXIMUM reaches 33 combined, do not blast slam — invite
  // with a QUANTITATIVE 4NT (partner passes with a minimum, bids 6 with a
  // maximum).
  const ntOpenMax =
    partnerFirst === "1NT"
      ? 17
      : partnerFirst === "2NT"
        ? 21
        : partnerFirst === "2♣" && partnerLatest === "3NT"
          ? 27
          : undefined;
  // The artificial 2♣ counts as "only NT" — it says nothing about clubs, and
  // the NT rebid defines the hand exactly like an NT opening would.
  const partnerBidOnlyNT =
    (!pFirstSuit || partnerFirst?.endsWith("NT") || partnerFirst === "2♣") &&
    (!pLatestSuit || partnerLatest?.endsWith("NT"));
  if (
    ntOpenMax !== undefined &&
    partnerBidOnlyNT &&
    combined < 33 &&
    myValue + ntOpenMax >= 33
  ) {
    return {
      bid: "4NT",
      category: "Quantitative 4NT (Slam Only If Partner Is Maximum)",
      reasoning: `Partner's ${partnerFirst} opening shows ${partnerFirst === "1NT" ? "15-17" : "20-21"} HCP. With your ${myValue} points the combined total is ${combined}-${myValue + ntOpenMax} — slam (33+) only if partner is MAXIMUM. Bid a QUANTITATIVE 4NT: partner passes with a minimum, bids 6NT with a maximum. (This is not Blackwood — no suit is agreed.)`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `Inviting 6NT — pass with a minimum ${partnerFirst}, bid slam with a maximum.`,
      expectedResponses: [
        { partnerBid: "Pass", meaning: "Minimum — 4NT is high enough" },
        { partnerBid: "6NT", meaning: "Maximum — accepting the slam invite" },
      ],
      confidence: "high",
    };
  }

  // ── Slam zone (33+ combined): Blackwood with a fit, 6NT without ──
  if (combined >= 33) {
    // If partner has only bid NOTRUMP, a 4NT bid would be read as
    // QUANTITATIVE (not Blackwood) — partner with a minimum would pass below
    // slam.  Bid the slam directly instead.
    const partnerOnlyNT =
      (!pFirstSuit || partnerFirst?.endsWith("NT")) &&
      (!pLatestSuit || partnerLatest?.endsWith("NT"));
    if (partnerOnlyNT) {
      const mySlamSuit =
        mySuit &&
        myLenIn(mySuit) >= 6 &&
        (mySuit === "hearts" || mySuit === "spades")
          ? mySuit
          : undefined;
      return {
        bid: mySlamSuit ? `6${suitSymbol(mySlamSuit)}` : "6NT",
        category: "Bid the Slam (33+ Combined, NT Auction)",
        reasoning: `Partner's NT bidding shows a known range; with your ${tp} TP the combined total reaches the slam zone (33+). 4NT here would be QUANTITATIVE (partner could pass), so bid the slam directly${mySlamSuit ? ` in your long ${mySlamSuit} suit` : " in notrump"}.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "Enough combined strength for slam opposite your shown range.",
        expectedResponses: [
          { partnerBid: "Pass", meaning: "Accepting the slam" },
        ],
        confidence: "medium",
      };
    }
    if (fitSuit) {
      // Blackwood must be LEGAL — if partner's last bid already sits at or
      // above 4NT (e.g. a game bid FORCED by competition), there is no ace-ask
      // left, and a bid pushed there under pressure shows no extras anyway.
      const partnerLatestIdx = partnerLatest
        ? BID_ORDER.indexOf(partnerLatest)
        : -1;
      if (partnerLatestIdx >= BID_ORDER.indexOf("4NT")) {
        return {
          bid: "Pass",
          category: "Pass (Game Reached Under Pressure — No Slam Try Left)",
          reasoning: `Partner's ${partnerLatest} already sits above the 4NT ace-ask, and it was taken at the cheapest available level under the opponents' pressure — that shows NO extras. Slam after a forced game bid needs partner to move, not you. Pass.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner:
            "Content with game — my earlier bid already showed this strength.",
          expectedResponses: [],
          confidence: "high",
        };
      }
      // A VOID makes Blackwood unreliable (partner cannot tell WHICH aces
      // matter) — settle for the safe game; slam moves come from partner.
      if (hasVoid(hand) && fitSuit) {
        const voidGameBid = `${fitIsMajor ? 4 : 5}${suitSymbol(fitSuit)}`;
        // Partner may ALREADY be at (or above) that game — pass, don't re-bid.
        if (
          partnerLatest &&
          isRealBid(partnerLatest) &&
          BID_ORDER.indexOf(partnerLatest) >= BID_ORDER.indexOf(voidGameBid)
        ) {
          return {
            bid: "Pass",
            category: "Pass — Game Reached (Void Rules Out Blackwood)",
            reasoning: `The combined values flirt with slam, but your VOID makes Blackwood unreliable, and partner's ${partnerLatest} already stands at the safe game. Pass; slam moves must come from partner.`,
            handAnalysis: analysis,
            whatYourBidTellsPartner:
              "Content with game — my shape rules out a safe ace-ask.",
            expectedResponses: [],
            confidence: "medium",
          };
        }
        return {
          bid: voidGameBid,
          category: "Bid Game (Slam Values, but a Void — No Blackwood)",
          reasoning: `The combined ${combined}+ points are in the slam zone, but your VOID makes Blackwood unreliable — partner cannot tell which aces are working. Without cue-bidding agreements, bid the safe game ${voidGameBid}; partner may still move with extras.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner:
            "Strong raise to game — slam interest but no safe ask with my shape.",
          expectedResponses: [
            { partnerBid: "Pass", meaning: "Content with game" },
          ],
          confidence: "medium",
          note: "Tip: with a void, cue bids (first-round controls) beat Blackwood.",
        };
      }
      return {
        bid: "4NT",
        category: "Blackwood After Opener's Rebid (Slam Values)",
        reasoning: `Partner's rebid shows at least ${openerMin} points; with your ${tp} TP the combined ${combined}+ is in the slam zone. With a ${fitSuit} fit, bid 4NT (Blackwood) to check aces first.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "Slam interest with our established fit — asking for aces (5♣=0/4, 5♦=1, 5♥=2, 5♠=3).",
        expectedResponses: [
          { partnerBid: "5♣", meaning: "0 or 4 aces" },
          { partnerBid: "5♦", meaning: "1 ace" },
          { partnerBid: "5♥", meaning: "2 aces" },
          { partnerBid: "5♠", meaning: "3 aces" },
        ],
        confidence: "medium",
      };
    }
    return {
      bid: "6NT",
      category: "Slam in NT (33+ Combined, No Fit)",
      reasoning: `Partner's rebid shows at least ${openerMin} points; with your ${tp} TP the combined ${combined}+ reaches the small-slam threshold (33). With no suit fit, bid 6NT directly.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Enough combined strength for 6NT (33+ points).",
      expectedResponses: [],
      confidence: "medium",
    };
  }

  // ── Partner is ALREADY at (or above) game — accept it whatever the count:
  // partner chose game knowing what your bidding showed; below the slam zone
  // there is nothing to add.
  if (partnerLatest && isRealBid(partnerLatest)) {
    const pl = parseInt(partnerLatest[0]) || 0;
    const plGame = partnerLatest.endsWith("NT")
      ? pl >= 3
      : partnerLatest.includes("♥") || partnerLatest.includes("♠")
        ? pl >= 4
        : pl >= 5;
    if (plGame) {
      return {
        bid: "Pass",
        category: "Accept Partner's Game",
        reasoning: `Partner's ${partnerLatest} is a GAME bid, made knowing what your earlier bidding showed. With nothing beyond the slam zone to explore, pass and let partner play it.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: "Accepting the game contract.",
        expectedResponses: [],
        confidence: "high",
      };
    }
  }

  // ── Game zone (25+ combined) ──
  if (combined >= 25) {
    if (fitSuit && fitIsMajor) {
      // ONE bite: if I already raised/invited in this suit and partner did
      // not accept, my values are on the table — pass.  This applies ONLY
      // when PARTNER showed the suit first (my bid was the raise): when
      // partner raised MY suit (e.g. my 2/1 response), their raise is
      // constructive and the game decision is still mine.
      const partnerShowedFitFirst =
        !!partnerFirst &&
        /^[1-7][♠♥♦♣]$/.test(partnerFirst) &&
        partnerFirst.slice(1) === suitSymbol(fitSuit);
      if (
        partnerShowedFitFirst &&
        myBid &&
        /^[2-7][♠♥♦♣]$/.test(myBid) &&
        myBid.slice(1) === suitSymbol(fitSuit)
      ) {
        return {
          bid: "Pass",
          category: "Pass — Already Raised This Suit",
          reasoning: `Your ${myBid} already showed this hand's fit and strength; partner heard it and did not drive to game. Bidding ${4}${suitSymbol(fitSuit)} now would count the same values twice — pass.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: "Nothing beyond the earlier raise.",
          expectedResponses: [],
          confidence: "high",
        };
      }
      return {
        bid: `4${suitSymbol(fitSuit)}`,
        category: "Bid Major Game After Opener's Rebid",
        reasoning: `Partner's rebid shows at least ${openerMin} points; with your ${myValue} support points (HCP plus short-suit points for the ${fitSuit} fit) the combined ${combined}+ is enough for game. Bid 4${suitSymbol(fitSuit)} with the 8-card ${fitSuit} fit.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `Enough combined strength for game (≈${combined}+ together) with a ${fitSuit} fit. My exact strength depends on what your rebid showed.`,
        expectedResponses: [],
        confidence: "medium",
      };
    }
    if (
      partnerLatest === "3NT" ||
      (partnerLatest &&
        BID_ORDER.indexOf(partnerLatest) >= BID_ORDER.indexOf("3NT"))
    ) {
      return {
        bid: "Pass",
        category: "Accept Partner's Game",
        reasoning: `Partner's ${partnerLatest} already places the game your combined values point to. Nothing more to say — pass.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: "Accepting the game contract.",
        expectedResponses: [],
        confidence: "high",
      };
    }
    const fiveCardMajorRR =
      hand.hearts >= 5 ? "hearts" : hand.spades >= 5 ? "spades" : undefined;
    return {
      bid: "3NT",
      category: "Bid 3NT After Opener's Rebid (Game Values)",
      reasoning: `Partner's rebid shows at least ${openerMin} points; with your ${tp} TP the combined ${combined}+ is enough for game. With no guaranteed 8-card major fit, 3NT is the standard game.${fiveCardMajorRR ? ` (You do hold 5 ${fiveCardMajorRR} — partner's bidding denied 4-card support, though a 5-3 fit is still possible; checking back with a new-minor 2♣ first is a reasonable alternative.)` : ""}`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "Enough combined strength for game together, no major fit found. My exact strength depends on what your rebid showed.",
      expectedResponses: [],
      confidence: "medium",
    };
  }

  // ── Invitational zone (23-24 combined) ──
  if (combined >= 23) {
    if (fitSuit) {
      // ONE invite only: if my previous bid was already a raise/invite in
      // this suit and partner declined (rebid their own suit), pass.
      if (
        myBid &&
        /^[2-7][♠♥♦♣]$/.test(myBid) &&
        myBid.slice(1) === suitSymbol(fitSuit)
      ) {
        // Partner RAISED my bid in the same suit — that is a further GAME
        // TRY, not a decline.  Accept with a maximum for my earlier bid.
        const partnerRaisedMyInvite =
          partnerLatest &&
          /^[2-7][♠♥♦♣]$/.test(partnerLatest) &&
          partnerLatest.slice(1) === suitSymbol(fitSuit) &&
          BID_ORDER.indexOf(partnerLatest) > BID_ORDER.indexOf(myBid);
        if (partnerRaisedMyInvite) {
          const tryGameBid = `${fitIsMajor ? 4 : 5}${suitSymbol(fitSuit)}`;
          const tryAccept =
            calcTPWithFit(hand) >= 10 &&
            BID_ORDER.indexOf(tryGameBid) > BID_ORDER.indexOf(partnerLatest);
          return {
            bid: tryAccept ? tryGameBid : "Pass",
            category: tryAccept
              ? "Accept Partner's Game Try (Maximum for the Raise)"
              : "Decline Partner's Game Try (Minimum for the Raise)",
            reasoning: `Partner raised your ${myBid} to ${partnerLatest} — a GAME TRY over your earlier raise. With ${calcTPWithFit(hand)} support points you are at the ${tryAccept ? `top of what your raise showed: accept with ${tryGameBid}` : "bottom of what your raise showed: pass"}.`,
            handAnalysis: analysis,
            whatYourBidTellsPartner: tryAccept
              ? "Maximum for my earlier raise — accepting the try."
              : "Minimum for my earlier raise — declining.",
            expectedResponses: [],
            confidence: "medium",
          };
        }
        return {
          bid: "Pass",
          category: "Pass — Invite Declined, Nothing More to Say",
          reasoning: `Your ${myBid} already carried this hand's invitation and partner's rebid declined it. Re-inviting with the same ${tp} TP would be bidding the same values twice — pass.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: "Nothing beyond the earlier invite.",
          expectedResponses: [],
          confidence: "high",
        };
      }
      const inv = cheapestIn(suitSymbol(fitSuit));
      if (inv && parseInt(inv[0]) <= 3) {
        return {
          bid: inv,
          category: "Invitational Raise After Opener's Rebid",
          reasoning: `Partner's rebid shows at least ${openerMin} points; your ${tp} TP makes game possible if partner has extras. Invite with ${inv} — partner passes with a minimum, bids game with 14+.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: `Combined strength just short of game — inviting with a ${fitSuit} fit. Pass with a minimum, bid game with extras.`,
          expectedResponses: [
            { partnerBid: "Pass", meaning: "Minimum opener" },
            { partnerBid: "Game", meaning: "Extra values (14+)" },
          ],
          confidence: "medium",
        };
      }
      // No room to invite below game: partner already used the invitational
      // space (e.g. a jump raise to 3 of our major), so the cheapest raise in
      // the fit IS game.  Partner's jump already INVITED — accept with the top
      // of your range (combined ≥ 24, i.e. ~8+ opposite a 16+ invitation),
      // rather than passing out a making game.
      if (inv && parseInt(inv[0]) === 4 && fitIsMajor && combined >= 24) {
        return {
          bid: inv,
          category: "Accept Game After Opener's Invitational Jump Raise",
          reasoning: `Partner jumped to ${partnerLatest}, an invitational raise showing about ${openerMin}-18 points and a fit. With your ${tp} TP (near the top of the range you have shown), the combined ${combined}+ is enough — accept by bidding game (${inv}). Passing here would sell out below a making game.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: `Accepting your game invitation with a maximum and a ${fitSuit} fit.`,
          expectedResponses: [],
          confidence: "medium",
        };
      }
    }
    if (cheapestIn("NT") === "2NT") {
      return {
        bid: "2NT",
        category: "Invitational 2NT After Opener's Rebid",
        reasoning: `Partner's rebid shows at least ${openerMin} points; your ${tp} TP is invitational. With no fit to raise, invite with 2NT — partner passes with a minimum, bids 3NT with extras.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "Combined strength just short of game — invitational, fairly balanced, no fit.",
        expectedResponses: [
          { partnerBid: "Pass", meaning: "Minimum opener" },
          { partnerBid: "3NT", meaning: "Extra values (14+)" },
        ],
        confidence: "medium",
      };
    }
  }

  // ── Minimum (6-10): place the partscore ──
  // Preference between partner's two suits
  if (
    pFirstSuit &&
    pLatestSuit &&
    pFirstSuit !== pLatestSuit &&
    pLatestSuit !== mySuit &&
    myLenIn(pFirstSuit) > myLenIn(pLatestSuit)
  ) {
    const pref = cheapestIn(suitSymbol(pFirstSuit));
    if (pref && parseInt(pref[0]) <= 3) {
      return {
        bid: pref,
        category: "Preference to Opener's First Suit",
        reasoning: `Partner showed two suits (${pFirstSuit}, then ${pLatestSuit}). With more cards in ${pFirstSuit}, give simple preference (${pref}). This shows no extra strength.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "Better support for your first suit; no game interest. Simple preference, not a raise.",
        expectedResponses: [{ partnerBid: "Pass", meaning: "Minimum opener" }],
        confidence: "medium",
      };
    }
  }
  // Rebid my own 6-card suit cheaply
  if (mySuit && myLenIn(mySuit) >= 6) {
    const mine = cheapestIn(suitSymbol(mySuit));
    if (mine && parseInt(mine[0]) <= 2) {
      return {
        bid: mine,
        category: "Rebid Own 6-Card Suit (Minimum)",
        reasoning: `With a minimum response and a self-sufficient 6-card ${mySuit} suit, rebid it cheaply (${mine}) — this is a sign-off.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `6+ ${mySuit}, no game interest. Non-forcing sign-off.`,
        expectedResponses: [
          { partnerBid: "Pass", meaning: "Accepting the sign-off" },
        ],
        confidence: "medium",
      };
    }
  }
  // ── Partner's rebid was FORCING — responder may NOT pass ──────────────────
  // A REVERSE (new higher-ranking suit at the 2-level, e.g. 1♣-1♥-2♠) is
  // forcing for one round; a JUMP SHIFT (new suit one level higher than
  // necessary, e.g. 1♦-1♠-3♣) is game-forcing.  Make the cheapest descriptive
  // bid instead of passing: rebid a 5+ card suit, else give preference to
  // opener's first suit, else bid the cheapest NT.
  {
    const SUIT_RANK_RR: Record<string, number> = {
      clubs: 0,
      diamonds: 1,
      hearts: 2,
      spades: 3,
    };
    const openerNewSuit =
      !!pLatestSuit &&
      !!pFirstSuit &&
      !!partnerLatest &&
      !partnerLatest.endsWith("NT") &&
      pLatestSuit !== pFirstSuit &&
      pLatestSuit !== mySuit;
    const pLatestLvl = partnerLatest ? parseInt(partnerLatest[0]) || 0 : 0;
    const pFirstLvl = partnerFirst ? parseInt(partnerFirst[0]) || 0 : 0;
    const isReverse =
      openerNewSuit &&
      pFirstLvl === 1 &&
      pLatestLvl === 2 &&
      SUIT_RANK_RR[pLatestSuit!] > SUIT_RANK_RR[pFirstSuit!];
    const isOpenerJumpShift = (() => {
      if (!openerNewSuit || !myBid || !partnerLatest) return false;
      const floor = BID_ORDER.indexOf(myBid);
      const cheapest = BID_ORDER.find(
        (b, i) => i > floor && b.endsWith(suitSymbol(pLatestSuit!)),
      );
      return (
        !!cheapest &&
        BID_ORDER.indexOf(partnerLatest) > BID_ORDER.indexOf(cheapest)
      );
    })();
    if (isReverse || isOpenerJumpShift) {
      const forcingKind = isOpenerJumpShift
        ? "a jump shift (game-forcing)"
        : "a reverse (forcing for one round)";
      // Rebid own 5+ card suit
      if (mySuit && myLenIn(mySuit) >= 5) {
        const mine = cheapestIn(suitSymbol(mySuit));
        if (mine) {
          return {
            bid: mine,
            category: "Forced Rebid of Own Suit",
            reasoning: `Partner's ${partnerLatest} was ${forcingKind}, so you cannot pass. Rebid your ${myLenIn(mySuit)}-card ${mySuit} suit (${mine}) to describe your hand and keep the auction going.`,
            handAnalysis: analysis,
            whatYourBidTellsPartner: `5+ ${mySuit}; responding to your forcing bid (no extra strength promised).`,
            expectedResponses: [],
            confidence: "medium",
          };
        }
      }
      // Preference to opener's first suit
      const pref = pFirstSuit ? cheapestIn(suitSymbol(pFirstSuit)) : undefined;
      if (pref) {
        return {
          bid: pref,
          category: "Forced Preference to Opener's First Suit",
          reasoning: `Partner's ${partnerLatest} was ${forcingKind}, so you cannot pass. Give preference to opener's first suit (${pref}) — this promises no extra strength but keeps the forcing auction alive.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: `Preference for ${pFirstSuit}; no extra strength.`,
          expectedResponses: [],
          confidence: "medium",
        };
      }
      // Cheapest NT
      const nt = cheapestIn("NT");
      if (nt) {
        return {
          bid: nt,
          category: "Forced NT Bid",
          reasoning: `Partner's ${partnerLatest} was ${forcingKind}, so you cannot pass. With no suit to show or support, bid ${nt}.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner:
            "Minimum, balanced-ish; responding to your forcing bid.",
          expectedResponses: [],
          confidence: "low",
        };
      }
    }
  }

  // ── Big fit for partner's LATEST suit (their second suit / rebid) in a
  // CONTESTED auction: raise competitively instead of selling out — the Law
  // of Total Tricks covers the level, and passing with a 9-10 card fit hands
  // the opponents the auction.
  {
    const latestFitLen = pLatestSuit ? myLenIn(pLatestSuit) : 0;
    const contestedRR = [context.lhoBid, context.rhoBid].some((b) =>
      isRealBid(b),
    );
    const latestSupportTP = calcTPWithFit(hand);
    if (
      contestedRR &&
      pLatestSuit &&
      pLatestSuit !== mySuit &&
      (latestFitLen >= 5 || (latestFitLen >= 4 && latestSupportTP >= 10)) &&
      partnerLatest &&
      isRealBid(partnerLatest)
    ) {
      const compRaise = cheapestIn(suitSymbol(pLatestSuit));
      if (compRaise && parseInt(compRaise[0]) <= 4) {
        return {
          bid: compRaise,
          category: "Competitive Raise of Partner's Second Suit (Big Fit)",
          reasoning: `Partner's ${partnerLatest} showed ${pLatestSuit} and you hold ${latestFitLen}-card support (${latestSupportTP} support points with the fit) — at least a ${latestFitLen + 4}-card fit. The opponents are competing: raise to ${compRaise} rather than sell out; the Law of Total Tricks covers the level.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: `${latestFitLen}-card ${pLatestSuit} support — competing on the fit, not extra strength.`,
          expectedResponses: [
            { partnerBid: "Pass", meaning: "The normal action" },
          ],
          confidence: "medium",
        };
      }
    }
  }

  {
    // When the OPPONENTS hold the standing bid, "playable contract" is the
    // wrong story — we are passing to defend, not to play.
    const oppStandingRR = [context.lhoBid, context.rhoBid]
      .filter((b): b is string => isRealBid(b))
      .sort((a, b) => BID_ORDER.indexOf(b) - BID_ORDER.indexOf(a))[0];
    const partnerRealRR = isRealBid(context.partnerBid)
      ? context.partnerBid
      : undefined;
    if (
      oppStandingRR &&
      (!partnerRealRR ||
        BID_ORDER.indexOf(oppStandingRR) > BID_ORDER.indexOf(partnerRealRR))
    ) {
      return {
        bid: "Pass",
        category: "Pass (Minimum Response — Nothing to Add)",
        reasoning: `Your ${tp} TP leaves the combined total short of game, and the opponents hold the standing bid (${oppStandingRR}). With nothing to spare, pass — partner has seen your bidding and can still compete or double.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "No game interest opposite your shown strength, nothing more to show.",
        expectedResponses: [],
        confidence: "medium",
      };
    }
  }

  return {
    bid: "Pass",
    category: "Pass (Minimum Response, Contract Playable)",
    reasoning: `Partner's rebid shows at least ${openerMin} points but your ${tp} TP leaves the combined total short of game. Partner's last bid is a playable spot — pass.`,
    handAnalysis: analysis,
    whatYourBidTellsPartner:
      "No game interest opposite your shown strength, nothing more to show.",
    expectedResponses: [],
    confidence: "medium",
  };
}

// ─── Advancer's second turn ───────────────────────────────────────────────────
// Our side did NOT open: partner overcalled (possibly showing a second suit
// later) and we already advanced once.  Our first action limited the hand, so
// the default is to pass — with two exceptions:
//   • Partner showed TWO suits → give preference to the one we fit better
//     (a 3-card "false preference" back to the first suit is standard).
//   • We hold undisclosed extras (13+ TP) AND a fit → raise once, invitational.
function getAdvancerRebid(
  hand: Hand,
  partnerFirstBid: string | undefined,
  partnerLatestBid: string | undefined,
  auctionOpeningBid?: string,
  myPreviousBid?: string,
): BidRecommendation {
  const analysis = analyzeHand(hand);
  const { tp } = analysis;

  // ── I CUED the opening suit last time (limit-raise-or-better of partner's
  // overcall) and partner answered — the cue promised more than "already
  // described": I must now PLACE the contract.
  const iCuedAR =
    !!myPreviousBid &&
    !!auctionOpeningBid &&
    /^[1-7][♠♥♦♣]$/.test(myPreviousBid) &&
    /^[1-7][♠♥♦♣]$/.test(auctionOpeningBid) &&
    myPreviousBid !== auctionOpeningBid &&
    myPreviousBid.slice(1) === auctionOpeningBid.slice(1);
  if (
    iCuedAR &&
    partnerFirstBid &&
    partnerLatestBid &&
    /^[1-7][♠♥♦♣]$/.test(partnerFirstBid) &&
    /^[1-7][♠♥♦♣]$/.test(partnerLatestBid) &&
    partnerLatestBid.slice(1) === partnerFirstBid.slice(1)
  ) {
    const ocSuitAR = partnerFirstBid.includes("♠")
      ? "spades"
      : partnerFirstBid.includes("♥")
        ? "hearts"
        : partnerFirstBid.includes("♦")
          ? "diamonds"
          : "clubs";
    const fitTpAR = calcTPWithFit(hand);
    const gameLvlAR = ocSuitAR === "hearts" || ocSuitAR === "spades" ? 4 : 5;
    const latestLvlAR = parseInt(partnerLatestBid[0]);
    if (latestLvlAR >= gameLvlAR) {
      return {
        bid: "Pass",
        category: "Pass — Partner Accepted Your Cue at Game",
        reasoning: `Your cuebid forced to game and partner's ${partnerLatestBid} is it. Pass.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: "The game my cue asked for — done.",
        expectedResponses: [],
        confidence: "high",
      };
    }
    if (fitTpAR >= 15) {
      const gameBidAR = `${gameLvlAR}${suitSymbol(ocSuitAR)}`;
      return {
        bid: gameBidAR,
        category: "Raise to Game After Your Cuebid (15+ Support Pts)",
        reasoning: `Your cuebid showed a limit-raise-or-better of partner's ${ocSuitAR}; partner's ${partnerLatestBid} answered with a minimum. With ${fitTpAR} support points you were always going to game — bid ${gameBidAR}.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "The cue was game-going (15+ support pts) — bidding it now.",
        expectedResponses: [{ partnerBid: "Pass", meaning: "To play" }],
        confidence: "high",
      };
    }
    const declineViaPass = partnerLatestBid === partnerFirstBid;
    return {
      bid: "Pass",
      category: "Pass — Limit Cue, Partner Declined",
      reasoning: `Your cuebid invited game (limit raise or better); partner ${declineViaPass ? "passed over the interference — a minimum with nothing to spare" : `answered with a minimum ${partnerLatestBid}`}. With ${fitTpAR} support points (the limit-raise range, not more), respect the decision and pass.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "Limit-raise values only — accepting your minimum answer.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  const suitOf = (bid: string | undefined): string | undefined =>
    bid?.includes("♠")
      ? "spades"
      : bid?.includes("♥")
        ? "hearts"
        : bid?.includes("♦")
          ? "diamonds"
          : bid?.includes("♣")
            ? "clubs"
            : undefined;

  // Partner's first bid was a CUEBID of the opening suit (Michaels) — it was
  // artificial, NOT a natural suit. Treat only their later bids as natural.
  const firstWasCuebid =
    !!partnerFirstBid &&
    !!auctionOpeningBid &&
    /^[1-7][♠♥♦♣]$/.test(partnerFirstBid) &&
    /^[1-7][♠♥♦♣]$/.test(auctionOpeningBid) &&
    partnerFirstBid.slice(1) === auctionOpeningBid.slice(1) &&
    partnerFirstBid !== auctionOpeningBid;

  const sFirst = firstWasCuebid ? undefined : suitOf(partnerFirstBid);
  const sLatest = suitOf(partnerLatestBid);

  // Partner's Michaels cue → later real-suit bid AT GAME: they have placed
  // the contract in one of their shown suits. Our preference/raise already
  // spoke — pass. (Below game, fall through to the one-suit raise logic.)
  if (
    firstWasCuebid &&
    sLatest &&
    partnerLatestBid &&
    parseInt(partnerLatestBid[0]) >= 4
  ) {
    return {
      bid: "Pass",
      category: "Pass — Partner Placed the Contract (Michaels)",
      reasoning: `Partner's ${partnerFirstBid} was a Michaels cuebid (two-suiter), and their ${partnerLatestBid} now places the contract in ${sLatest} — your preferred suit. Your earlier preference already described your hand; pass and let partner play it.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "Nothing new — my preference said it all. Your contract.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  // Partner showed two different suits → preference
  if (sFirst && sLatest && sFirst !== sLatest && partnerLatestBid) {
    const lenFirst = hand[sFirst as keyof Hand] as number;
    const lenLatest = hand[sLatest as keyof Hand] as number;
    if (lenFirst > lenLatest) {
      // Go back to partner's first suit at the cheapest legal level
      const latestIdx = BID_ORDER.indexOf(partnerLatestBid);
      const prefIdx = BID_ORDER.findIndex(
        (b, i) => i > latestIdx && b.endsWith(suitSymbol(sFirst)),
      );
      const prefBid = prefIdx >= 0 ? BID_ORDER[prefIdx] : undefined;
      if (prefBid && parseInt(prefBid[0]) <= 3) {
        return {
          bid: prefBid,
          category: "Preference to Partner's First Suit",
          reasoning: `Partner showed two suits (${sFirst}, then ${sLatest}). With ${lenFirst} ${sFirst} and only ${lenLatest} ${sLatest}, give preference back to ${sFirst} at the cheapest level (${prefBid}). This is not a raise — even 3-card "false preference" is standard.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: `Preference for your first suit (${sFirst}) — usually 2-3 cards there and fewer in your second suit. No extra strength implied.`,
          expectedResponses: [
            {
              partnerBid: "Pass",
              meaning: "Minimum overcall — content to play here",
            },
          ],
          confidence: "medium",
        };
      }
    }
    return {
      bid: "Pass",
      category: "Accept Partner's Second Suit",
      reasoning: `Partner showed two suits (${sFirst}, then ${sLatest}). With ${lenLatest}-card support for the second suit (at least as long as your ${sFirst} holding), pass and play there.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "Equal-or-better fit for your second suit. No extra strength.",
      expectedResponses: [],
      confidence: "medium",
    };
  }

  // One suit shown: raise once with undisclosed extras + fit, otherwise pass
  if (sLatest && partnerLatestBid) {
    const fitLen = hand[sLatest as keyof Hand] as number;
    const latestLevel = parseInt(partnerLatestBid[0]);
    // Raising partner's suit establishes a fit — value with short-suit points.
    const fitTp = calcTPWithFit(hand);
    // ONE raise only — if my previous bid was already a raise of this suit,
    // my extras are on the table.
    const iAlreadyRaisedAR =
      !!myPreviousBid &&
      /^[1-7][♠♥♦♣]$/.test(myPreviousBid) &&
      myPreviousBid.slice(1) === suitSymbol(sLatest);
    if (fitLen >= 3 && fitTp >= 13 && latestLevel <= 3 && !iAlreadyRaisedAR) {
      const raiseBid = `${latestLevel + 1}${suitSymbol(sLatest)}`;
      return {
        bid: raiseBid,
        category: "Advancer Raise (Undisclosed Extras)",
        reasoning: `Partner is competing in ${sLatest}. With ${fitLen}-card support and ${tp} TP — more than your earlier action promised — raise once to ${raiseBid}. Non-forcing but encouraging.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `3+ card ${sLatest} support and extra values (13+ TP) beyond your first response.`,
        expectedResponses: [
          { partnerBid: "Pass", meaning: "Minimum — content to play here" },
          {
            partnerBid: "Game",
            meaning: "Extra values — accepting the invitation",
          },
        ],
        confidence: "medium",
      };
    }
  }

  return {
    bid: "Pass",
    category: "Pass (Hand Already Described)",
    reasoning:
      "Your earlier advance of partner's action (overcall or takeout double) already described your strength and shape, and partner has added nothing since. With nothing extra to show, pass — the decision is partner's.",
    handAnalysis: analysis,
    whatYourBidTellsPartner: "Nothing beyond what your earlier bid showed.",
    expectedResponses: [],
    confidence: "medium",
  };
}

function getProtectiveRebid(
  hand: Hand,
  myOpeningBid: string,
  lhoBid: string | undefined,
  rhoBid?: string,
  balancing?: boolean,
  /** True when my first bid was an OVERCALL, not the auction's opening —
   *  the stories must say "overcall", not "opening bid". */
  iOvercalled = false,
): BidRecommendation {
  const analysis = analyzeHand(hand);
  const { tp } = analysis;
  const { hcp } = hand;
  const myBidWord = iOvercalled ? "overcall" : "opening bid";
  // balancing === false → the auction is still LIVE (an opponent just bid in
  // front of us); reopening-double standards do NOT apply.  Undefined is
  // treated as balancing for backwards compatibility with direct callers.
  const isLiveAuction = balancing === false;

  const myOpenSuit = myOpeningBid.includes("♠")
    ? "spades"
    : myOpeningBid.includes("♥")
      ? "hearts"
      : myOpeningBid.includes("♦")
        ? "diamonds"
        : "clubs";
  const myOpenSuitSym = suitSymbol(myOpenSuit);
  const myOpenSuitLen = hand[myOpenSuit as keyof Hand] as number;

  // ── My earlier bid was a PREEMPT (weak hand, jump to the 2+/3+/4-level) —
  // the preemptor NEVER bids again: partner and the opponents both know the
  // hand within a point, so any further decision belongs to partner.
  // (Level 2 could be a sound 10-11 HCP simple overcall, so require ≤9 there;
  // at the 3-level and above ≤11 HCP with a 6+ suit is always a preempt.)
  const myOpenLvlProt = parseInt(myOpeningBid[0]) || 1;
  if (
    ((myOpenLvlProt >= 3 && hcp <= 11) || (myOpenLvlProt === 2 && hcp <= 9)) &&
    myOpenSuitLen >= 6
  ) {
    return {
      bid: "Pass",
      category: "Pass — Preemptor Never Bids Again",
      reasoning: `Your ${myOpeningBid} preempt told the whole story: a weak hand (${hcp} HCP) with a long ${myOpenSuit} suit. The preemptor NEVER bids again on their own — partner knows your hand almost exactly and makes every further decision. Pass whatever the opponents do.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "Nothing new — my preempt said it all. Every decision is yours.",
      expectedResponses: [],
      confidence: "high",
    };
  }

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

  // ── My earlier bid was NOTRUMP (a 1NT overcall or opening): the hand is
  // already described within a point or two.  Over the opponents' runout the
  // only message left is "I am MAXIMUM with their suit held" — a
  // penalty-suggestive double.  Anything else: pass, the NT bid said it all.
  if (myOpeningBid.endsWith("NT")) {
    const runoutSuitName = lhoBid.includes("♠")
      ? "spades"
      : lhoBid.includes("♥")
        ? "hearts"
        : lhoBid.includes("♦")
          ? "diamonds"
          : lhoBid.includes("♣")
            ? "clubs"
            : undefined;
    const runoutLen = runoutSuitName
      ? (hand[runoutSuitName as keyof Hand] as number)
      : 0;
    if (
      hcp >= 17 &&
      runoutLen >= 3 &&
      parseInt(lhoBid[0]) <= 3 &&
      hand.hasStopperInOpponentSuit !== false
    ) {
      return {
        bid: "Double",
        category: "Values Double After Your NT Bid (Maximum, Their Suit Held)",
        reasoning: `Your earlier ${myOpeningBid} showed a defined balanced range; the opponents have run to ${lhoBid} and partner passed. With ${hcp} HCP (a MAXIMUM) and ${runoutLen} cards in their ${runoutSuitName} suit, double — penalty-suggestive, showing the top of your range with their runout suit held. Partner passes to defend with most hands.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `Maximum for my ${myOpeningBid} with their ${lhoBid} suit held — pass and defend unless you are very distributional.`,
        expectedResponses: [
          { partnerBid: "Pass", meaning: "Defending — the normal action" },
          {
            partnerBid: "Long suit",
            meaning: "6+ card suit with a bust — pulling to play",
          },
        ],
        confidence: "medium",
      };
    }
    return {
      bid: "Pass",
      category: "Pass — Your NT Bid Said It All",
      reasoning: `Your ${myOpeningBid} already described this hand's range and shape precisely, and partner heard it and passed. Without a maximum AND their runout suit held (a penalty-suggestive double), there is nothing to add — pass.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Nothing beyond my NT bid.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  // Find the minimum legal rebid of opener's suit above the overcall
  const lhoBidIdx = BID_ORDER.indexOf(lhoBid);
  const minRebidIdx = BID_ORDER.findIndex(
    (bid, i) => i > lhoBidIdx && bid.endsWith(myOpenSuitSym),
  );
  const minRebidBid =
    minRebidIdx >= 0 ? BID_ORDER[minRebidIdx] : `2${myOpenSuitSym}`;

  // ── Live auction (NOT the balancing seat) ───────────────────────────────────
  // An opponent just bid in front of us and partner has shown nothing.  This is
  // ordinary competition: rebid a long suit cheaply, double only with real
  // extras + shortness at a low level, otherwise pass.  Repeated "protective"
  // doubles here would badly misdescribe the hand.
  if (isLiveAuction) {
    const realOppBids = [lhoBid, rhoBid].filter(
      (b): b is string =>
        !!b && b !== "Pass" && b !== "Double" && b !== "Redouble",
    );
    const oppBid = realOppBids.sort(
      (a, b) => BID_ORDER.indexOf(a) - BID_ORDER.indexOf(b),
    )[realOppBids.length - 1];
    const oppIdx = oppBid ? BID_ORDER.indexOf(oppBid) : -1;
    const liveMinRebidIdx = BID_ORDER.findIndex(
      (bid, i) => i > oppIdx && bid.endsWith(myOpenSuitSym),
    );
    const liveMinRebid =
      liveMinRebidIdx >= 0 ? BID_ORDER[liveMinRebidIdx] : undefined;

    // Real extras + shortness in their suit at a low level → competitive double
    const oppSuitName = oppBid?.includes("♠")
      ? "spades"
      : oppBid?.includes("♥")
        ? "hearts"
        : oppBid?.includes("♦")
          ? "diamonds"
          : oppBid?.includes("♣")
            ? "clubs"
            : undefined;
    const oppSuitLen = oppSuitName
      ? (hand[oppSuitName as keyof Hand] as number)
      : 0;
    // Prefer SHOWING a good second suit over an ambiguous double: with 5+
    // cards in an unbid suit and extras, the suit bid describes the hand.
    const myOpenedNT = myOpeningBid.endsWith("NT");
    const myOpenSuitNameCD = myOpenedNT
      ? undefined
      : myOpeningBid.includes("♠")
        ? "spades"
        : myOpeningBid.includes("♥")
          ? "hearts"
          : myOpeningBid.includes("♦")
            ? "diamonds"
            : "clubs";
    const secondSuitCD = (
      ["spades", "hearts", "diamonds", "clubs"] as const
    ).find(
      (su) =>
        su !== myOpenSuitNameCD &&
        su !== oppSuitName &&
        (hand[su as keyof Hand] as number) >= 5,
    );
    if (hcp >= 15 && secondSuitCD && oppBid) {
      const secondBidCD = BID_ORDER.find(
        (b, i) =>
          i > BID_ORDER.indexOf(oppBid) && b.endsWith(suitSymbol(secondSuitCD)),
      );
      if (secondBidCD && parseInt(secondBidCD[0]) <= 3) {
        return {
          bid: secondBidCD,
          category: myOpenedNT
            ? "Show the Long Suit After Your Notrump Bid"
            : "Show the Second Suit (Two-Suiter, Extras)",
          reasoning: myOpenedNT
            ? `The opponents are competing over your ${myOpeningBid} and partner has not acted. With ${hcp} HCP and a 5-card ${secondSuitCD} suit, bid ${secondBidCD} — offering the suit as a better strain than defending or doubling ambiguously.`
            : `The opponents are competing over your ${myOpeningBid} opening and partner has not acted. With ${hcp} HCP and a second 5-card ${secondSuitCD} suit, bid ${secondBidCD} — showing your two-suiter is far more descriptive than an ambiguous double, and gives partner a real choice of strains.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: myOpenedNT
            ? `A natural 5+ card ${secondSuitCD} suit alongside the strength my ${myOpeningBid} showed.`
            : `5+ ${myOpenSuitNameCD} and 5+ ${secondSuitCD} with extra values — pick the better fit.`,
          expectedResponses: [
            { partnerBid: "Preference", meaning: "Choose between the strains" },
          ],
          confidence: "medium",
        };
      }
    }
    // A competitive double promises TAKEOUT SHAPE: 3+ cards in every unbid
    // suit — never with a singleton somewhere partner may jump to.
    const unbidOkCD = (
      ["spades", "hearts", "diamonds", "clubs"] as const
    ).every(
      (su) =>
        (myOpenSuitNameCD !== undefined && su === myOpenSuitNameCD) ||
        su === oppSuitName ||
        (hand[su as keyof Hand] as number) >= 3,
    );
    if (
      hcp >= 16 &&
      oppBid &&
      parseInt(oppBid[0]) <= 2 &&
      (!oppSuitName || oppSuitLen <= 3) &&
      unbidOkCD
    ) {
      return {
        bid: "Double",
        category: "Competitive Double (Extra Values)",
        reasoning: `The opponents are competing over your ${myOpeningBid} opening and partner has not acted. With ${hcp} HCP (extras), shortness in their suit, and 3+ cards in every unbid suit, double to show a strong hand that can handle partner bidding any unbid suit.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "16+ HCP, extras for the opening bid, support for the unbid suits. Partner: bid your best suit or pass for penalties with length/strength in their suit.",
        expectedResponses: [
          {
            partnerBid: "New suit",
            meaning: "Bidding the best available suit",
          },
          { partnerBid: "Pass", meaning: "Converting to penalty" },
        ],
        confidence: "medium",
      };
    }

    // Rebid a 6+ card suit when it is still cheap (≤ 3-level)
    if (
      myOpenSuitLen >= 6 &&
      tp >= 13 &&
      liveMinRebid &&
      parseInt(liveMinRebid[0]) <= 3
    ) {
      return {
        bid: liveMinRebid,
        category: "Competitive Suit Rebid (6+ Cards)",
        reasoning: `The opponents are competing and partner has not acted. With a ${myOpenSuitLen}-card ${myOpenSuit} suit and ${tp} TP (${hcp} HCP), rebid ${liveMinRebid} to compete. This is non-forcing — partner may pass with a weak hand.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `A long ${myOpenSuit} suit (6+ cards), competing. Non-forcing.`,
        expectedResponses: [
          {
            partnerBid: "Pass",
            meaning: "Weak hand — content to defend or play here",
          },
          { partnerBid: "Raise", meaning: "Support and a few values" },
        ],
        confidence: "medium",
      };
    }

    return {
      bid: "Pass",
      category: "Pass (Competitive Auction — Nothing More to Show)",
      reasoning: `The opponents are competing and partner has shown nothing. Your ${myBidWord} already described this hand${hcp >= 16 ? ", and there is no safe way to show the extras right now" : ""}. Pass — bidding again would promise extra shape or strength you may not have.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `Nothing new — the ${myBidWord} said it all.`,
      expectedResponses: [],
      confidence: "medium",
    };
  }

  // Extra strength: double for penalty / reopening double.
  // Below the 4-level this needs only values; over a 4-LEVEL PREEMPT the
  // double is "optional" (do-something-intelligent) — make it only with 16+
  // and shortness (0-2) in their suit so partner can sit OR pull safely.
  const oppSuitNameProt = lhoBid.includes("♠")
    ? "spades"
    : lhoBid.includes("♥")
      ? "hearts"
      : lhoBid.includes("♦")
        ? "diamonds"
        : lhoBid.includes("♣")
          ? "clubs"
          : undefined;
  const oppSuitLenProt = oppSuitNameProt
    ? (hand[oppSuitNameProt as keyof Hand] as number)
    : 3;
  if (
    hcp >= 16 &&
    (parseInt(lhoBid[0]) <= 3 ||
      (parseInt(lhoBid[0]) === 4 && oppSuitLenProt <= 2))
  ) {
    const overPreempt = parseInt(lhoBid[0]) === 4;
    return {
      bid: "Double",
      category: overPreempt
        ? "Optional Double of Their Preempt (16+ HCP)"
        : "Protective Double (16+ HCP)",
      reasoning: overPreempt
        ? `Partner passed${overcallContext}. Doubling a preempt is OPTIONAL ("do something intelligent") — with ${hcp} HCP and only ${oppSuitLenProt} card(s) in their suit, you are too strong to sell out to ${lhoBid}. Partner may pass for penalty with trumps or trapping values, or bid a long suit.`
        : `Partner passed${overcallContext}. With ${hcp} HCP (${tp} TP), you have extra values for a reopening double. This gives partner a chance to bid or convert to penalty.`,
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

  // Long suit (6+ cards): rebid at the minimum level above the overcall —
  // but only through the 3-level.  Reopening at the 4-level (over the
  // opponents' game) would be a unilateral sacrifice, not a balancing action.
  if (
    myOpenSuitLen >= 6 &&
    tp >= 13 &&
    minRebidIdx >= 0 &&
    parseInt(minRebidBid[0]) <= 3
  ) {
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

  // No safe action: pass and let opponents play there
  return {
    bid: "Pass",
    category:
      hcp >= 16
        ? "Protective Pass (No Safe Action)"
        : `Protective Pass (Minimum ${iOvercalled ? "Overcall" : "Opener"})`,
    reasoning:
      hcp >= 16
        ? `Partner passed${overcallContext}. You hold extra values (${tp} TP, ${hcp} HCP), but with ${oppSuitLenProt}+ cards in their suit a double invites disaster (partner will often pull with the wrong hand) and no suit is safe to bid at this level. Pass and take your defensive tricks.`
        : `Partner passed${overcallContext}. With a minimum ${iOvercalled ? "overcall" : "opening"} (${tp} TP, ${hcp} HCP) and no strong long suit to rebid safely, pass. Competing at a higher level risks a poor result; defending the opponents' contract is fine.`,
    handAnalysis: analysis,
    whatYourBidTellsPartner: `Minimum ${iOvercalled ? "overcall" : "opener"} — not competing further.`,
    expectedResponses: [],
    confidence: "medium",
    note: `In balancing position ${iOvercalled ? "an overcaller" : "the opener"} should reopen only with extra length or extra values.`,
  };
}

function getRebidAfterSuit(
  hand: Hand,
  myOpeningBid: string,
  partnerResponse: string,
  contested = false,
  /**
   * The opponents' highest natural bid AFTER partner's response, if any (e.g.
   * the 3♦ in 1♠-2♦-2♥-3♦).  Rebid-level math must clear this — without it the
   * function computes a bid based only on partner's level and can return an
   * illegal call (e.g. 2♠ over 3♦), which then collapses to a phantom Pass.
   */
  interferenceBid?: string,
  /**
   * Partner's FIRST real bid.  When it differs from partnerResponse, a current
   * bid that matches opener's suit is a PREFERENCE back to it (after partner
   * showed another suit), NOT a fresh limit/jump raise — so it must not be
   * treated as invitational.
   */
  partnerFirstBid?: string,
  /**
   * True when I have ALREADY rebid (opened + made a second descriptive bid)
   * and partner has said nothing new since — their latest real bid is the one
   * I already answered.  My hand is fully described; only the opponents'
   * interference brings the turn back to me.
   */
  alreadyDescribed = false,
  /** True when partnerResponse is a CUEBID of a suit the opponents had shown
   *  BEFORE partner's call (order-checked in the derivation) — a game-forcing
   *  raise of my suit, never natural. */
  partnerCuedTheirSuit = false,
  /** My LATEST real bid (may differ from the opening) — lets the handler see
   *  that I already raised partner's suit, so a re-bid of it is not "new". */
  myLatestBid?: string,
  /** True when an opponent has shown a natural NOTRUMP hand anywhere in the
   *  auction (e.g. a 1NT overcall) — our side must not volunteer notrump. */
  oppShowedNT = false,
  /** Partner made a DOUBLE earlier — their raise of my suit is the
   *  invitational (11-13) continuation, never a weak preemptive jump. */
  partnerDoubledEarlier = false,
): BidRecommendation {
  const analysis = analyzeHand(hand);
  const { tp } = analysis;

  // ── Hand fully described, partner silent since, opponents intervening ──────
  // Opening + rebid painted the picture; bidding the same values a third time
  // is the classic "bidding your hand twice" error.  Pass and let partner —
  // who knows your whole hand — make the decision.
  // (Never applies after a strong 2♣ opening — that auction is game-forcing
  // and opener may not sell out.)
  if (alreadyDescribed && interferenceBid && myOpeningBid !== "2♣") {
    return {
      bid: "Pass",
      category: "Pass (Opening + Rebid Already Described This Hand)",
      reasoning: `Your opening and your rebid have already told partner your strength and shape, and partner has added nothing since. The opponents' ${interferenceBid} does not change your hand — bidding again would be counting the same values twice. Pass; partner knows your hand and can still act.${tp >= 17 ? " (With your extra strength, a DOUBLE to show a maximum is a reasonable alternative if you want to invite partner back in.)" : ""}`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "Nothing new — my opening and rebid said it all. The decision is yours.",
      expectedResponses: [],
      confidence: "high",
    };
  }
  // ── Partner CUE-BID the opponents' suit: a game-forcing raise of MY suit ───
  // In competition the cuebid replaces the limit/forcing raise (a direct raise
  // would be weaker).  Never read it as a natural bid in the enemy suit.
  // `partnerCuedTheirSuit` is computed order-correctly by the derivation.
  if (
    partnerCuedTheirSuit &&
    isRealBid(partnerResponse) &&
    !partnerResponse.endsWith("NT") &&
    interferenceBid &&
    !myOpeningBid.endsWith("NT") &&
    myOpeningBid !== "2♣" &&
    partnerResponse.slice(1) !== myOpeningBid.slice(1)
  ) {
    const myCueSym = myOpeningBid.slice(1);
    const myCueSuitName =
      myCueSym === "♠"
        ? "spades"
        : myCueSym === "♥"
          ? "hearts"
          : myCueSym === "♦"
            ? "diamonds"
            : "clubs";
    const cueFloorIdx = Math.max(
      BID_ORDER.indexOf(partnerResponse),
      isRealBid(interferenceBid) ? BID_ORDER.indexOf(interferenceBid) : -1,
    );
    const cheapestMine = BID_ORDER.find(
      (b, i) => i > cueFloorIdx && b.endsWith(myCueSym),
    );
    const gameLvlCue = myCueSym === "♥" || myCueSym === "♠" ? 4 : 5;
    const targetLvl = cheapestMine
      ? Math.max(gameLvlCue, parseInt(cheapestMine[0]))
      : gameLvlCue;
    const cueTP = calcTPWithFit(hand);
    // The cue is LIMIT-OR-BETTER (10+): with a bare minimum opener, sign off
    // at the cheapest level of my suit — partner passes with just 10-12.
    if (cueTP <= 13 && cheapestMine && parseInt(cheapestMine[0]) < gameLvlCue) {
      return {
        bid: cheapestMine,
        category: "Sign Off — Minimum Opener Facing the Cuebid Raise",
        reasoning: `Partner's ${partnerResponse} cuebid shows a limit raise OR BETTER (10+ support points) of your ${myCueSuitName}. With a minimum opener (${cueTP} support points), sign off at ${cheapestMine}; partner bids on only with the game-forcing version.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "Minimum opener — pass with a limit raise, bid on with 13+.",
        expectedResponses: [
          { partnerBid: "Pass", meaning: "Limit raise only (10-12)" },
          { partnerBid: "Game", meaning: "The game-forcing raise (13+)" },
        ],
        confidence: "high",
      };
    }
    if (targetLvl <= 7) {
      const cueGameBid = `${targetLvl}${myCueSym}`;
      return {
        bid: cueGameBid,
        category: "Bid Game — Partner's Cuebid Is a Forcing Raise",
        reasoning: `Partner's ${partnerResponse} is a CUEBID of the opponents' suit — the LIMIT-RAISE-OR-BETTER of your ${myCueSuitName} (a direct raise would have shown less). ${targetLvl > gameLvlCue ? `The opponents' ${interferenceBid} has pushed the auction, so the cheapest game is ${cueGameBid}.` : `Bid the game: ${cueGameBid}.`}${cueTP >= 17 ? " With your extra values, slam interest exists — a control cue-bid or Blackwood is a reasonable alternative." : ""}`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `Accepting the game force in ${myCueSuitName}${cueTP >= 17 ? " (extras — slam is not out of the question)" : " with no slam extras"}.`,
        expectedResponses: [
          { partnerBid: "Pass", meaning: "Game it is" },
          { partnerBid: "4NT", meaning: "Blackwood — slam try with extras" },
        ],
        confidence: "high",
      };
    }
  }

  // When opener SUPPORTS partner's suit (a fit is established), opener becomes
  // the raising hand and re-values with SHORT-suit (ruffing) points instead of
  // long-suit points — SAYC: void=5, singleton=3, doubleton=1 added to HCP.
  // Used only in the raise-of-partner branches below; other rebids keep `tp`.
  const supportTP = calcTPWithFit(hand);
  // A doubleton is a "soft" ruffing value: it counts toward the raise, but a
  // semi-balanced hand (no singleton/void) should INVITE rather than commit to
  // game on doubletons alone — committing to game opposite partner's promised
  // minimum needs real shortness or genuine extra high-card strength.
  const hasRealShortness =
    hasVoid(hand) ||
    [hand.spades, hand.hearts, hand.diamonds, hand.clubs].some((c) => c === 1);
  const canCommitGameFromSupport =
    supportTP >= 19 && (hasRealShortness || hand.hcp >= 18);

  // ── The opponents JAMMED to game level before my rebid ─────────────────────
  // No descriptive rebid exists below their bid; with a minimum, pass — my
  // opening plus partner's (forcing) response keeps partner in the auction.
  if (
    interferenceBid &&
    isRealBid(interferenceBid) &&
    !interferenceBid.endsWith("NT") &&
    (parseInt(interferenceBid[0]) || 0) >= 4 &&
    calcTPWithFit(hand) < 16
  ) {
    return {
      bid: "Pass",
      category: "Pass — Their Preempt Crowded Out the Rebid (Minimum)",
      reasoning: `The opponents' ${interferenceBid} removed every descriptive rebid. With a minimum opener there is nothing safe to volunteer at this level — pass. Partner heard your opening and their own response still speaks; the final decision (double or bid on) is theirs.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "Minimum opener with no clear action over the jam — your call.",
      expectedResponses: [],
      confidence: "medium",
    };
  }

  // ── I REVERSED and partner signed off in their own suit ────────────────────
  // Partner's cheapest same-suit rebid after my reverse shows a WEAK hand
  // (6-9) whose only feature is the long suit.  Respect the signoff: raise to
  // game only with a real fit and a maximum; otherwise pass.
  {
    const iReversedRB =
      !!myLatestBid &&
      /^2[♠♥♦♣]$/.test(myLatestBid) &&
      /^1[♠♥♦♣]$/.test(myOpeningBid) &&
      myLatestBid.slice(1) !== myOpeningBid.slice(1) &&
      // A raise of PARTNER's suit is not a reverse — the 2-level bid must be
      // my own second suit.
      (!partnerFirstBid || myLatestBid.slice(1) !== partnerFirstBid.slice(1)) &&
      "♣♦♥♠".indexOf(myLatestBid.slice(1)) >
        "♣♦♥♠".indexOf(myOpeningBid.slice(1));
    const partnerReboundOwnSuit =
      !!partnerFirstBid &&
      !!partnerResponse &&
      /^[1-7][♠♥♦♣]$/.test(partnerFirstBid) &&
      /^[23][♠♥♦♣]$/.test(partnerResponse) &&
      partnerResponse.slice(1) === partnerFirstBid.slice(1) &&
      partnerResponse !== partnerFirstBid;
    if (iReversedRB && partnerReboundOwnSuit) {
      const pSuitNameRB = partnerResponse!.includes("♠")
        ? "spades"
        : partnerResponse!.includes("♥")
          ? "hearts"
          : partnerResponse!.includes("♦")
            ? "diamonds"
            : "clubs";
      const myFitRB = hand[pSuitNameRB as keyof Hand] as number;
      const pIsMajorRB = pSuitNameRB === "hearts" || pSuitNameRB === "spades";
      if (myFitRB >= 3 && supportTP >= 20 && pIsMajorRB) {
        return {
          bid: `4${suitSymbol(pSuitNameRB)}`,
          category: "Raise Partner's Signoff to Game (Maximum Reverse + Fit)",
          reasoning: `Partner's ${partnerResponse} after your reverse shows a WEAK hand (6-9) with a long ${pSuitNameRB} suit. With ${myFitRB}-card support and ${supportTP} support points (a maximum reverse), even a weak long-suit hand should produce game — raise to 4${suitSymbol(pSuitNameRB)}.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner:
            "Maximum reverse with a real fit — game even opposite your signoff.",
          expectedResponses: [],
          confidence: "medium",
        };
      }
      return {
        bid: "Pass",
        category: "Pass — Partner Signed Off After Your Reverse",
        reasoning: `Your reverse showed 17+ and forced one round; partner's ${partnerResponse} answered with a WEAK hand (6-9) whose only feature is a long ${pSuitNameRB} suit. With ${myFitRB} card(s) in their suit there is no reason to press on — a misfit game needs much more. Pass. (3NT instead would need every side suit stopped AND partner's suit to run.)`,
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "Respecting the signoff — no game opposite a weak misfit.",
        expectedResponses: [],
        confidence: "medium",
      };
    }
  }

  // ── Strong 2♣ opener's rebid ────────────────────────────────────────────────
  // After 2♣ (artificial, 22+), partner's 2♦ is WAITING (not diamonds!) and
  // other responses are positive.  Opener's rebid: 2NT = 22-24 balanced
  // (systems on), 3NT = 25-27 balanced, otherwise bid the real suit naturally
  // (game-forcing).
  if (myOpeningBid === "2♣") {
    // The descriptive rebid happens ONCE — when 2♣ is still my latest bid.
    // Later turns (I already showed my suit/NT range) fall through to the
    // normal rebid logic; without this guard the branch re-fires and lifts
    // the "real suit" bid over partner's signoff (e.g. 7♣ over 6NT).
    if (myLatestBid !== undefined && myLatestBid !== "2♣") {
      // Partner has placed the contract at game or slam — accept it.
      if (
        partnerResponse &&
        isRealBid(partnerResponse) &&
        (parseInt(partnerResponse[0]) >= 6 ||
          partnerResponse === "3NT" ||
          (parseInt(partnerResponse[0]) >= 4 &&
            !partnerResponse.endsWith("NT")) ||
          partnerResponse === "4NT" ||
          partnerResponse === "5NT")
      ) {
        return {
          bid: "Pass",
          category: "Accept Partner's Placement After 2♣",
          reasoning: `Your 2♣ opening and rebid already described this powerhouse; partner's ${partnerResponse} places the contract knowing your strength. Pass.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: "Accepting your placement.",
          expectedResponses: [],
          confidence: "high",
        };
      }
    }
    if (myLatestBid === undefined || myLatestBid === "2♣") {
      // Partner may have made a POSITIVE response (e.g. 2♥/2♠/3♦) rather than the
      // 2♦ waiting bid, which raises the floor.  Every rebid below must clear
      // partner's call — the 2♣ auction is forcing to game, so we never pass.
      const twoCFloorIdx = partnerResponse
        ? BID_ORDER.indexOf(partnerResponse)
        : -1;
      const clearFloor2c = (bid: string): string => {
        if (BID_ORDER.indexOf(bid) > twoCFloorIdx) return bid;
        const sym = bid.endsWith("NT") ? "NT" : bid.slice(1);
        return (
          BID_ORDER.find((b, i) => i > twoCFloorIdx && b.endsWith(sym)) ?? bid
        );
      };
      if (analysis.isBalanced && hand.hcp <= 24) {
        const ntRebid2c = clearFloor2c("2NT");
        return {
          bid: ntRebid2c,
          category: `${ntRebid2c} Rebid After 2♣ (22-24 Balanced)`,
          reasoning: `Your 2♣ opening was artificial. With a balanced 22-24 HCP, rebid notrump at the cheapest level${ntRebid2c === "2NT" ? " — 2NT; partner may pass only with a hopeless hand; Stayman (3♣) and transfers apply" : ` — partner's response pushed it to ${ntRebid2c}; the range is still 22-24`}.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner:
            "Balanced 22-24 HCP. Stayman and Jacoby transfers are ON at the 3-level.",
          expectedResponses: [
            {
              partnerBid: "3♣",
              meaning: "Stayman — asking for a 4-card major",
            },
            { partnerBid: "3♦", meaning: "Transfer to hearts" },
            { partnerBid: "3♥", meaning: "Transfer to spades" },
            { partnerBid: "3NT", meaning: "To play — no major interest" },
          ],
          confidence: "high",
        };
      }
      if (analysis.isBalanced) {
        return {
          bid: clearFloor2c("3NT"),
          category: "3NT Rebid After 2♣ (25-27 Balanced)",
          reasoning:
            "Your 2♣ opening was artificial. With a balanced 25+ HCP, rebid 3NT to show the maximum balanced range.",
          handAnalysis: analysis,
          whatYourBidTellsPartner: "Balanced 25-27 HCP.",
          expectedResponses: [],
          confidence: "high",
        };
      }
      const longest2c = longestSuitInfo(hand);
      const naturalBid = clearFloor2c(
        suitBidLevel(
          longest2c.name,
          longest2c.name === "clubs" || longest2c.name === "diamonds" ? 3 : 2,
        ),
      );
      return {
        bid: naturalBid,
        category: "Natural Suit Rebid After 2♣ (Game Force)",
        reasoning: `Your 2♣ opening was artificial — now show your real suit. ${naturalBid} is natural (5+ ${longest2c.name}) and forcing to game.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `5+ ${longest2c.name}, 22+ total points. The auction is forcing to game.`,
        expectedResponses: [
          { partnerBid: "Raise", meaning: "3+ card support" },
          {
            partnerBid: "New suit / NT",
            meaning: "No fit yet — keep describing",
          },
        ],
        confidence: "high",
      };
    }
  }

  // ── Weak 2 rebid: partner's 2NT is a forcing inquiry (feature ask) ──────────
  // After a weak 2 OPENING (2♦/2♥/2♠) in an UNCONTESTED auction, partner's 2NT
  // response is NOT natural — it asks the weak 2 bidder to describe hand quality:
  //   • Minimum (5-7 HCP): rebid the suit at 3-level
  //   • Maximum (8-10 HCP) with a side feature (A or K): bid that suit
  //   • Maximum with 2 of top 3 trump honors: bid 3NT
  // NOTE: This does NOT apply in contested auctions (contested=true). If an opponent
  // bid first, our 2-level suit bid was an overcall, and partner's 2NT is natural
  // (showing values, to play). In that case we should pass.
  if (["2♦", "2♥", "2♠"].includes(myOpeningBid) && partnerResponse === "2NT") {
    if (contested) {
      // Partner's 2NT is natural (values, no fit) after the interference — pass.
      return {
        bid: "Pass",
        category: "Pass — Partner's 2NT Is Natural (Contested Auction)",
        reasoning: `You opened a weak ${myOpeningBid} and an opponent overcalled, so partner's 2NT is NATURAL (showing values, to play) — the 2NT feature-inquiry is OFF once an opponent has bid. With a minimum weak 2 (${hand.hcp} HCP), pass and let partner play 2NT.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: "Weak overcall — accepting partner's 2NT.",
        expectedResponses: [],
        confidence: "high",
      };
    }
    const weakSuit = myOpeningBid.includes("♠")
      ? "spades"
      : myOpeningBid.includes("♥")
        ? "hearts"
        : "diamonds";
    const weakSuitSym = suitSymbol(weakSuit);
    const isMaximum = hand.hcp >= 8;

    if (!isMaximum) {
      // Minimum — rebid suit to show no extra values
      return {
        bid: `3${weakSuitSym}`,
        category: "Minimum Weak 2 Response to 2NT Inquiry",
        reasoning: `Partner's 2NT is a forcing inquiry asking about your hand strength. With ${hand.hcp} HCP (minimum weak 2), rebid 3${weakSuitSym} to show a minimum hand (5-7 HCP) with no side feature.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "Minimum weak 2 — 5-7 HCP, no outside feature.",
        expectedResponses: [
          {
            partnerBid: "Pass",
            meaning: "Partner accepts the 3-level partial",
          },
          {
            partnerBid: "4" + weakSuitSym,
            meaning: "Partner has enough for game",
          },
          { partnerBid: "3NT", meaning: "Partner bids game in NT" },
        ],
        confidence: "high",
      };
    }

    // Maximum — look for a side feature (A or K in a side suit)
    // We don't track individual honor cards, so check if HCP suggest a feature outside the long suit.
    // Heuristic: if hcp >= 8 and a side suit has enough HCP density, show a feature.
    // Since we can't pinpoint exact side honors, recommend showing the longest side suit
    // and explain the feature concept to the beginner.
    const sideFeatureSuit = (["spades", "hearts", "diamonds", "clubs"] as const)
      .filter((s) => s !== weakSuit)
      .sort((a, b) => (hand[b] as number) - (hand[a] as number))[0];

    return {
      bid: `3${suitSymbol(sideFeatureSuit)}`,
      category: "Maximum Weak 2 Response — Show Feature",
      reasoning: `Partner's 2NT is a forcing inquiry asking about your hand strength. With ${hand.hcp} HCP (maximum weak 2, 8-10 HCP), show a side feature by bidding your best side suit — but ONLY if you hold an Ace or King in that suit. A feature is an A or K that can win tricks outside your long ${weakSuit} suit. If you have no outside A or K, rebid 3${weakSuitSym} instead to show minimum.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `Maximum weak 2 (8-10 HCP) with a feature in the bid suit (A or K). If no outside A/K, rebid 3${weakSuitSym} instead.`,
      expectedResponses: [
        {
          partnerBid: "4" + weakSuitSym,
          meaning: "Partner bids game in your suit",
        },
        { partnerBid: "3NT", meaning: "Partner bids game in NT" },
        {
          partnerBid: "Pass",
          meaning: "Partner is satisfied with the partial",
        },
      ],
      confidence: "medium",
      note: `Only bid a feature suit if you have an Ace or King there. Without an outside A/K, rebid 3${weakSuitSym} to show minimum.`,
    };
  }

  // Partner passed — your opening bid described your hand. Pass and wait.
  if (partnerResponse === "Pass" || !partnerResponse) {
    return {
      bid: "Pass",
      category: "Pass (Partner Passed)",
      reasoning:
        "Partner passed your opening bid, showing fewer than 6 points — they are too weak to respond. Pass. The opponents may still act, but you have no reason to rebid without more information from partner.",
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Minimum opener — accepting partner's pass.",
      expectedResponses: [],
      confidence: "high",
    };
  }

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
    // PREFERENCE, not a raise: if partner FIRST bid a different suit and is now
    // returning to opener's suit (e.g. 1♦-2♥-2♠-3♦, partner's 3♦ = preference
    // back to diamonds), it shows simple preference (~6-10), NOT a limit/jump
    // raise.  Opener must not treat it as invitational and leap to game.
    const partnerFirstSuit = partnerFirstBid
      ? partnerFirstBid.includes("♠")
        ? "spades"
        : partnerFirstBid.includes("♥")
          ? "hearts"
          : partnerFirstBid.includes("♦")
            ? "diamonds"
            : partnerFirstBid.includes("♣")
              ? "clubs"
              : null
      : null;
    const isMerePreference =
      !!partnerFirstSuit &&
      partnerFirstSuit !== myOpenSuit &&
      partnerBidLvl <= 3;
    if (isMerePreference && supportTP < 19) {
      return {
        bid: "Pass",
        category: "Pass Over Partner's Preference (Not a Raise)",
        reasoning: `Partner first bid ${partnerFirstBid}, then returned to your ${myOpenSuit} with ${partnerResponse} — that is a simple PREFERENCE (about 6-10 pts), not a limit or jump raise. With ${supportTP} support points you lack the extra values to drive past the partscore. Pass.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `Minimum-to-medium opener — accepting the ${partnerResponse} partscore after your preference.`,
        expectedResponses: [],
        confidence: "high",
      };
    }
    // A limit raise (partner bids at EXACTLY the 3-level, e.g. 3♠ over 1♠) shows 10-12 HCP.
    // A game jump (4-level, e.g. 4♠ over 1♠) shows opener had 19+ TP and is forcing game.
    // A simple raise (2-level) shows only 6-9 pts — need 19+ TP to commit to game.
    // BUT in a CONTESTED auction (an opponent doubled or overcalled), a jump
    // raise to the 3-level is PREEMPTIVE (weak, ~6-9), not a limit raise — so it
    // must not be treated as invitational.
    const isLimitRaise = partnerBidLvl === 3 && !contested;
    const isPreemptiveJumpRaise = partnerBidLvl === 3 && contested;
    const isGameJump = partnerBidLvl >= 4;
    const isMajorSuit = myOpenSuit === "hearts" || myOpenSuit === "spades";
    const gameLevelBid = isMajorSuit
      ? `4${suitSymbol(myOpenSuit)}`
      : `5${suitSymbol(myOpenSuit)}`;

    // Partner DOUBLED earlier: their raise now is a values-based CONTINUATION
    // (invitational relative to what my rebid showed), never a preemptive
    // jump — accept with a sound opener.  Applies to ANY below-game raise
    // (e.g. 4♣ over my 3♣ jump — game in a minor is the 5-level).
    if (
      partnerDoubledEarlier &&
      contested &&
      partnerBidLvl >= 3 &&
      partnerBidLvl < (isMajorSuit ? 4 : 5)
    ) {
      if (supportTP >= 14) {
        return {
          bid: gameLevelBid,
          category: "Accept the Invite After Partner's Double (14+ Support)",
          reasoning: `Partner's earlier negative double showed 6+, and this raise of your ${myOpenSuit} INVITES relative to what your bidding showed. With ${supportTP} support points, accept: ${gameLevelBid}.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: "Sound opener — accepting your invite.",
          expectedResponses: [{ partnerBid: "Pass", meaning: "To play" }],
          confidence: "high",
        };
      }
      return {
        bid: "Pass",
        category: "Decline the Invite After Partner's Double (Minimum)",
        reasoning: `Partner's negative double followed by this raise of your ${myOpenSuit} is an INVITE relative to what your bidding showed. With only ${supportTP} support points you have nothing extra: decline by passing.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: "Nothing extra — declining.",
        expectedResponses: [],
        confidence: "high",
      };
    }

    // Contested 3-level jump = preemptive raise (weak).  Opener passes unless a
    // genuine game-forcing hand (the 22+ slam branch and 19+ acceptance below
    // still apply via supportTP, but a routine opener has nothing extra to do).
    if (isPreemptiveJumpRaise && supportTP < 19) {
      return {
        bid: "Pass",
        category: "Pass Over Partner's Preemptive Raise (Competitive)",
        reasoning: `An opponent had acted, so partner's jump to ${partnerResponse} is a PREEMPTIVE raise — weak (about 6-9 pts) with extra trumps, made to crowd the opponents, NOT an invitation. With ${supportTP} support points you lack the values to drive to game opposite a weak raise. Pass.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `Accepting the ${partnerResponse} partscore — no game opposite a preemptive raise.`,
        expectedResponses: [],
        confidence: "high",
      };
    }

    // Partner used Jacoby 2NT first, then signed off in game (e.g. 1♥-2NT-3♥-4♥).
    // That 4M is a GAME-FORCING raise (13+ support pts, 4+ trumps) declining
    // slam — NOT a weak preemptive jump.  Opener has already described its hand
    // with the 3-level reply; pass (partner placed the contract and denied slam).
    if (isGameJump && partnerFirstBid === "2NT") {
      return {
        bid: "Pass",
        category: "Pass — Partner's Jacoby 2NT Signoff at Game",
        reasoning: `Partner started with Jacoby 2NT (a game-forcing raise, 13+ support points and 4+ trumps), then signed off in ${partnerResponse} after your description. That declines slam — it is NOT a weak preemptive raise. You have already shown your hand, so pass and play game.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "Respecting partner's game signoff after the Jacoby 2NT auction.",
        expectedResponses: [],
        confidence: "high",
      };
    }

    // Partner had already shown VALUES with an earlier new-suit response —
    // their arrival at game now is a values-based placement with a fit, NOT
    // the weak preemptive jump (which only applies to a DIRECT leap).
    if (
      isGameJump &&
      partnerFirstBid &&
      isRealBid(partnerFirstBid) &&
      partnerFirstBid !== partnerResponse &&
      partnerFirstBid.slice(1) !== partnerResponse.slice(1)
    ) {
      return {
        bid: "Pass",
        category: "Pass — Partner Chose Game After Showing Values",
        reasoning: `Partner first responded ${partnerFirstBid} (a new suit, showing real values), and now places the contract at ${partnerResponse} with a fit for your suit. That is a VALUES-based game decision — not a preemptive raise. Your rebid already described this hand: pass and play game.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `Accepting the ${partnerResponse} contract.`,
        expectedResponses: [],
        confidence: "high",
      };
    }

    // Partner jumped directly to game (e.g. 1♠ → 4♠).  In SAYC this raise is
    // PREEMPTIVE: 5+ trump support with a weak hand (fewer than 10 HCP) and
    // shape — strong raises go through a limit raise, 2/1, or Jacoby 2NT
    // instead.  Opener passes; bidding on (or 4NT!) misreads the raise.
    if (isGameJump) {
      const iOpenedPreemptGJ =
        (parseInt(myOpeningBid[0]) || 1) >= 2 && !myOpeningBid.endsWith("NT");
      return {
        bid: "Pass",
        category: iOpenedPreemptGJ
          ? "Pass — Raises of Your Preempt Are to Play (RONF)"
          : "Accept Partner's Game Jump (Preemptive Raise)",
        reasoning: iOpenedPreemptGJ
          ? `Partner raised your ${myOpeningBid} preempt to ${partnerResponse}. Raises of a weak two/preempt are TO PLAY — partner may hold real values (counting your known 6-card suit) or be extending the barrage; either way the preemptor NEVER bids again. Pass.`
          : `Partner jumped directly to ${partnerResponse}. In SAYC a direct jump to game in your suit is a PREEMPTIVE raise — 5-card support with a weak (under 10 HCP), shapely hand, designed to shut the opponents out. Partner is NOT showing a strong hand, so pass${tp >= 20 ? " — even with your extras, slam needs partner to have values they have denied" : ""}.`,
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

    // Strong opener accepting any raise at game level.  A fit is established,
    // so judge by SHORT-suit support points (HCP + ruffing values), not TP.
    // Distinguish a true RAISE from a forced PREFERENCE back to my suit after
    // my reverse — the preference shows only 6-9 and can be a 3-card holding.
    const raiseWasPreference =
      !!partnerFirstBid &&
      /^[1-7][♠♥♦♣]$/.test(partnerFirstBid) &&
      partnerFirstBid.slice(1) !== myOpeningBid.slice(1) &&
      !!myLatestBid &&
      /^2[♠♥♦♣]$/.test(myLatestBid) &&
      myLatestBid.slice(1) !== myOpeningBid.slice(1);
    // Balanced 18-19 that opened a MINOR planning the jump-NT rebid: after
    // partner's raise the game is still 3NT (9 tricks), not 5 of the minor
    // (11 tricks) — especially since the 1m opening may have been a 3-card
    // suit, so the "fit" can be as short as 7 cards. Contested auctions fall
    // through (3NT needs a stopper in the opponents' suit).
    if (
      !isMajorSuit &&
      !contested &&
      analysis.isBalanced &&
      hand.hcp >= 18 &&
      hand.hcp <= 19
    ) {
      return {
        bid: "3NT",
        category: "Rebid 3NT After Raise (18-19 Balanced)",
        reasoning: `You opened 1${suitSymbol(myOpenSuit)} with a balanced 18-19 HCP planning to jump in notrump. Partner's raise shows 6-9 support points, so the combined ${hand.hcp + 6}+ is enough for game — and with a balanced hand the right game is 3NT (9 tricks), not 5${suitSymbol(myOpenSuit)} (11 tricks). Bid 3NT.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "18-19 balanced — choosing 3NT over the 11-trick minor game.",
        expectedResponses: [
          { partnerBid: "Pass", meaning: "Balanced enough to play 3NT" },
          {
            partnerBid: `4${suitSymbol(myOpenSuit)}/5${suitSymbol(myOpenSuit)}`,
            meaning: "Very shapely hand unsuitable for notrump",
          },
        ],
        confidence: "high",
      };
    }
    if (supportTP >= 19) {
      return {
        bid: gameLevelBid,
        category: raiseWasPreference
          ? "Bid Game After the Forced Preference (19+ support pts)"
          : "Bid Game After Raise (19-21 support pts)",
        reasoning: raiseWasPreference
          ? `Partner's ${partnerResponse} was the forced PREFERENCE back to your ${myOpenSuit} after your reverse — about 6-9 points with 3+ card support. With ${supportTP} support points (${hand.hcp} HCP plus ruffing values) even that minimum brings the combined total to game: bid ${gameLevelBid}.`
          : `Partner raised your ${myOpenSuit}. With ${supportTP} support points (${hand.hcp} HCP plus short-suit ruffing values for the fit), bid game (${gameLevelBid}). Note: if partner has a maximum raise (12-15 pts), consider 4NT Blackwood first to explore slam.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: "Strong opener — game-forcing.",
        expectedResponses: [],
        confidence: "high",
      };
    }

    // Accept limit raise after partner's 3-level limit raise.  Fit established —
    // use short-suit support points.  Limit raise shows 10-12; combined game odds
    // are good once opener has ~14 support points.
    if (isLimitRaise && supportTP >= 14) {
      return {
        bid: gameLevelBid,
        category: `Accept Limit Raise (${supportTP} support pts)`,
        reasoning: `Partner made a limit raise to ${partnerResponse} showing 10-12 HCP and 3-4 card ${myOpenSuit} support. With ${supportTP} support points (${hand.hcp} HCP plus short-suit ruffing values), combined strength is enough for game. Accept the invitation and bid ${gameLevelBid}.`,
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

    // Medium opener after a simple raise — make a game try.  Fit established,
    // so measure with short-suit support points.  Over INTERFERENCE the same
    // 3-level re-raise is read as COMPETITIVE (no extra strength promised) —
    // the story must match that reading, not claim a pure game try.
    if (supportTP >= 16 && supportTP <= 18 && !isLimitRaise) {
      return {
        bid: `3${suitSymbol(myOpenSuit)}`,
        category: contested
          ? "Competitive Re-Raise (Try Values Concealed)"
          : "Game Try After Raise (16-18 support pts)",
        reasoning: contested
          ? `Partner made a simple raise and the opponents came in. Re-raising to 3${suitSymbol(myOpenSuit)} here is COMPETITIVE — it fights for the partscore and promises no extra strength. Your ${supportTP} support points are in fact game-try territory, but partner will read the bid as competitive: only a MAXIMUM raise (8-9) will go on.`
          : "Partner made a simple raise. With 16-18 support points (HCP plus short-suit ruffing values), make a game try by bidding 3 of your suit. Partner accepts with a maximum raise (8-9 pts).",
        handAnalysis: analysis,
        whatYourBidTellsPartner: contested
          ? "Competing for the partscore — no extra strength promised (bid game only with a maximum raise)."
          : "16-18 support points — game possible, partner decides.",
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

    {
      const oppStandingOR =
        interferenceBid && isRealBid(interferenceBid)
          ? interferenceBid
          : undefined;
      if (
        oppStandingOR &&
        BID_ORDER.indexOf(oppStandingOR) > BID_ORDER.indexOf(partnerResponse)
      ) {
        // With a 6th trump the Law of Total Tricks (9+ trumps → 3-level)
        // says compete once more before selling out.
        if (myOpenSuitLen >= 6) {
          const lottSafeLvl = Math.min(myOpenSuitLen + 3 - 6, 4);
          const compRebid = BID_ORDER.find(
            (b, i) =>
              i > BID_ORDER.indexOf(oppStandingOR) &&
              b.endsWith(suitSymbol(myOpenSuit)),
          );
          if (compRebid && parseInt(compRebid[0]) <= lottSafeLvl) {
            return {
              bid: compRebid,
              category: "Compete to the Law Level (6+ Trumps)",
              reasoning: `The opponents' ${oppStandingOR} outbid partner's raise, but your ${myOpenSuitLen}-card ${myOpenSuit} suit plus partner's promised 3+ support makes ${myOpenSuitLen + 3}+ trumps — the Law of Total Tricks says the ${lottSafeLvl}-level is your side's safe height. Bid ${compRebid} to compete; this shows extra LENGTH, not extra strength, and partner must not bid on.`,
              handAnalysis: analysis,
              whatYourBidTellsPartner: `A 6th ${myOpenSuit} — competing on trump length per the Law. Do not raise.`,
              expectedResponses: [
                { partnerBid: "Pass", meaning: "Always — competitive only" },
              ],
              confidence: "medium",
            };
          }
        }
        return {
          bid: "Pass",
          category: "Pass — Outbid After Partner's Raise",
          reasoning: `Partner ${isLimitRaise ? "made a limit raise" : "made a simple raise"}, but the opponents have since outbid your side (${oppStandingOR}). With ${supportTP} support points there is not enough to compete higher — pass and defend. Partner knows your side's combined strength and can still act.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner:
            "Minimum hand — not competing further; happy to defend.",
          expectedResponses: [],
          confidence: "high",
        };
      }
    }
    return {
      bid: "Pass",
      category: isLimitRaise
        ? "Decline Limit Raise (Minimum Opener)"
        : `Pass After Simple Raise (${supportTP} support pts)`,
      reasoning: isLimitRaise
        ? `Partner made a limit raise (${partnerResponse}) showing 10-12 HCP. With ${supportTP} support points (${hand.hcp} HCP plus short-suit ruffing values), combined is not quite enough to guarantee game. Pass and play the ${partnerResponse} partial.`
        : `Partner made a simple raise. With ${supportTP} support points, game requires roughly 25 combined points — partner's 6-9 pts fall short. Pass.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `Minimum hand — accepting the partial contract in ${myOpenSuit}.`,
      expectedResponses: [],
      confidence: "high",
    };
  }

  // Partner bid 2NT or 3NT (natural — game-invitational or game-forcing after minor opening)
  if (partnerResponse === "2NT" || partnerResponse === "3NT") {
    // House style: a natural 2NT is INVITATIONAL (11-12) everywhere.
    // After a major opening, Jacoby 2NT is routed separately — so here it's a natural 2NT.

    // Partner bid 3NT (game).  Consider slam only with extra strength;
    // otherwise PASS — opener almost always passes 3NT.
    if (partnerResponse === "3NT") {
      // Partner's 3NT is a notrump contract — judge slam by HCP only, not by
      // distributional points (ruffing/length values are worthless in NT).
      if (hand.hcp >= 17) {
        return {
          bid: "4NT",
          category: "Quantitative 4NT After Partner's 3NT",
          reasoning: `Partner bid 3NT. With your ${hand.hcp} HCP the combined total is near the 33-point slam zone. Bid 4NT — QUANTITATIVE (no suit is agreed, so this is not Blackwood): it invites 6NT and partner may pass with a minimum.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner:
            "Slam invitation on power — pass with a minimum for your 3NT, bid 6NT with a maximum.",
          expectedResponses: [
            { partnerBid: "Pass", meaning: "Minimum — 4NT is high enough" },
            { partnerBid: "6NT", meaning: "Maximum — accepting the invite" },
          ],
          confidence: "medium",
        };
      }
      // Only PULL 3NT to a minor-suit game with a genuinely distributional hand
      // — a singleton or void that makes notrump risky.  A balanced or
      // semi-balanced hand (even with a long minor, e.g. 6-3-2-2) belongs in
      // 3NT: the long suit supplies tricks there too, and 5m needs two more.
      // Pull a 3NT signoff to the minor game only with a distributional hand —
      // a singleton or void — where notrump may be at risk.  A balanced hand
      // passes (the long suit supplies tricks in NT too).
      // A single short suit is NOT enough — partner's 3NT promised stoppers,
      // and a long minor is the engine of NINE tricks in notrump (5m needs
      // eleven).  Pull only a genuinely WILD hand: a void, or two singletons.
      const singletonCount = [
        hand.spades,
        hand.hearts,
        hand.diamonds,
        hand.clubs,
      ].filter((c) => c === 1).length;
      const wildShape = hasVoid(hand) || singletonCount >= 2;
      if (myOpenSuitLen >= 6 && wildShape) {
        const minorGame = `5${suitSymbol(myOpenSuit)}`;
        return {
          bid: minorGame,
          category: "Correct to Minor Game After 3NT (Wild Shape)",
          reasoning: `Partner bid 3NT to play, but your hand is WILDLY distributional (a ${myOpenSuitLen}-card ${myOpenSuit} suit with ${hasVoid(hand) ? "a void" : "two singletons"}) — notrump can be defeated before your suit ever cashes. Correct to ${minorGame}, where the shape works for you instead. (With merely one short suit you would trust partner's stoppers and pass.)`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: `Long ${myOpenSuit} and extreme shape — the minor game over 3NT.`,
          expectedResponses: [
            { partnerBid: "Pass", meaning: "Accepts minor game" },
          ],
          confidence: "medium",
        };
      }
      return {
        bid: "Pass",
        category: "Pass Partner's 3NT",
        reasoning: `Partner bid 3NT to play — trust it: opener almost always passes here. With your ${tp} TP, notrump needs only 9 tricks while a minor game needs 11, and a long ${myOpenSuit} suit provides its tricks in notrump too. ${singletonCount === 1 ? "Even your singleton is no reason to run — partner chose 3NT knowing your bidding, and one short suit is covered by their stoppers. " : ""}(Pull to the minor game only with WILD shape — a void or two singletons.)`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: "Accepting game — passing 3NT.",
        expectedResponses: [],
        confidence: "high",
      };
    }

    // partnerResponse === "2NT" — house style: natural 2NT is INVITATIONAL
    // (11-12).  Decline with a minimum; accept (exploring 4-4 majors) with 14+.
    if (tp <= 13) {
      if (myOpenSuitLen >= 6) {
        const declineSignoff = `3${suitSymbol(myOpenSuit)}`;
        return {
          bid: declineSignoff,
          category: "Decline the 2NT Invite — Sign Off in the Long Suit",
          reasoning: `Partner's 2NT invites game (11-12 balanced). With a minimum (${tp} TP) decline — and with ${myOpenSuitLen} ${myOpenSuit} the hand plays better in the suit: sign off at ${declineSignoff}. Partner must pass.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: `Minimum with 6+ ${myOpenSuit} — to play. Do not bid on.`,
          expectedResponses: [{ partnerBid: "Pass", meaning: "Always" }],
          confidence: "high",
        };
      }
      return {
        bid: "Pass",
        category: "Decline the 2NT Invite (Minimum)",
        reasoning: `Partner's 2NT invites game (11-12 balanced). With a minimum (${tp} TP) the combined values fall short of 25 — pass and play 2NT.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: "Minimum opener — declining the invite.",
        expectedResponses: [],
        confidence: "high",
      };
    }

    // Accepting the invite (14+): show a 4-card major on the way — if partner
    // also has 4, the 4-4 major game beats 3NT.
    if (hand.hearts >= 4) {
      return {
        bid: "3♥",
        category: "Show 4-Card Heart Suit After 2NT",
        reasoning: `Partner's 2NT invites game (11-12 balanced) and with ${tp} TP you are ACCEPTING. Bid 3♥ on the way to check for a 4-4 heart fit: partner bids 4♥ with 4 hearts, otherwise 3NT.`,
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
        reasoning: `Partner's 2NT invites game (11-12 balanced) and with ${tp} TP you are ACCEPTING. With ${hand.spades} spades, bid 3♠ on the way to check for a 4-4 spade fit. If partner has 4 spades, play 4♠. Otherwise partner bids 3NT.`,
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
        reasoning: `Partner's 2NT invites game (11-12 balanced) and with ${tp} TP you are ACCEPTING. No 4-card major. With ${myOpenSuitLen} ${myOpenSuit}, bid ${minorRebid} to show the long suit — partner can choose 3NT or 5${suitSymbol(myOpenSuit)}.`,
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
      reasoning: `Partner's 2NT invites game (11-12 balanced) and with ${tp} TP you are ACCEPTING. With no 4-card major and no 6-card minor, take the natural game — bid 3NT.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Balanced, no major or long minor — game in NT.",
      expectedResponses: [{ partnerBid: "Pass", meaning: "Accepts 3NT" }],
      confidence: "high",
    };
  }

  // Partner bid 1NT
  if (partnerResponse === "1NT") {
    // Balanced 18-19 that opened 1-of-a-suit PLANNING the strength-showing NT
    // rebid: over partner's 1NT response that rebid is 2NT (invitational,
    // 18-19). Passing here would bury the extra 6-7 HCP the opening promised
    // to show. Contested auctions fall through (NT rebids need a stopper).
    if (!contested && analysis.isBalanced && hand.hcp >= 18 && hand.hcp <= 19) {
      return {
        bid: "2NT",
        category: "Rebid 2NT After 1NT Response (18-19 Balanced)",
        reasoning: `You opened 1${suitSymbol(myOpenSuit)} with a balanced ${hand.hcp} HCP planning to show the strength with a notrump rebid. Partner's 1NT shows 6-10, so game is possible (${hand.hcp + 6}-${hand.hcp + 10} combined): raise to 2NT to show 18-19 balanced and invite.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "18-19 balanced — too strong for a 1NT opening. Pass with 6-7, bid 3NT with 8-10.",
        expectedResponses: [
          { partnerBid: "Pass", meaning: "6-7 pts — no game" },
          { partnerBid: "3NT", meaning: "8-10 pts — game values" },
        ],
        confidence: "high",
      };
    }
    if (myOpenSuitLen >= 6) {
      // Same-suit rebid ladder after the 1NT response:
      //   simple rebid (2-level) = 12-15, jump (3-level) = 16-18 invitational,
      //   jump to game = 19-21 with a self-sufficient suit.
      const openIsMajor = myOpenSuit === "hearts" || myOpenSuit === "spades";
      if (tp >= 19) {
        const gameRebid = openIsMajor
          ? `4${suitSymbol(myOpenSuit)}`
          : `5${suitSymbol(myOpenSuit)}`;
        return {
          bid: gameRebid,
          category: "Jump to Game After 1NT (19+ TP)",
          reasoning: `Partner's 1NT shows 6-10+ pts. With ${tp} TP and a ${myOpenSuitLen}-card ${myOpenSuit} suit, game is on even opposite a minimum response — jump straight to ${gameRebid}. A simple rebid (12-15) or single jump (16-18) would risk being passed with game values present.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: `19-21 TP with a self-sufficient ${myOpenSuitLen}-card ${myOpenSuit} suit — game in hand.`,
          expectedResponses: [{ partnerBid: "Pass", meaning: "To play" }],
          confidence: openIsMajor ? "high" : "medium",
          note: openIsMajor
            ? undefined
            : "With stoppers in the unbid suits, 3NT may score better than the 5-level minor game — judge by your side-suit holdings.",
        };
      }
      if (tp >= 16) {
        return {
          bid: `3${suitSymbol(myOpenSuit)}`,
          category: "Jump Rebid After 1NT (16-18 TP)",
          reasoning: `Partner bid 1NT (6-10 pts). With a ${myOpenSuitLen}-card ${myOpenSuit} suit and ${tp} TP, JUMP to 3${suitSymbol(myOpenSuit)} — invitational. A simple 2-level rebid would show only 12-15 and partner would pass with game-going values.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: `6+ card ${myOpenSuit} suit, 16-18 TP. Invitational — bid game with 8+ pts.`,
          expectedResponses: [
            { partnerBid: "Pass", meaning: "Minimum (6-7) — no game" },
            {
              partnerBid: openIsMajor ? `4${suitSymbol(myOpenSuit)}` : "3NT",
              meaning: "8+ pts — accepting the invitation",
            },
          ],
          confidence: "high",
        };
      }
      return {
        bid: `2${suitSymbol(myOpenSuit)}`,
        category: "Rebid Suit after 1NT (Minimum, 6+ Cards)",
        reasoning: `Partner bid 1NT (6-10 pts). With a minimum opener (${tp} TP) and a ${myOpenSuitLen}-card ${myOpenSuit} suit, rebid 2${suitSymbol(myOpenSuit)} — the routine minimum rebid; the long suit plays better than 1NT.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `6+ card ${myOpenSuit} suit, minimum opener (12-15).`,
        expectedResponses: [
          { partnerBid: "Pass", meaning: "Accepting the partscore" },
        ],
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
        // The opponents' overcall may have taken this bid away (or sit above
        // it) — never propose an unavailable call.  When their overcall IS
        // your second suit, pass and defend: your length sits over them.
        if (
          interferenceBid &&
          isRealBid(interferenceBid) &&
          BID_ORDER.indexOf(newSuitBid) <= BID_ORDER.indexOf(interferenceBid)
        ) {
          // With EXTRA strength (16+), showing the suit a level higher is
          // exactly right — that is what the higher level promises.
          const liftedSecond = BID_ORDER.find(
            (b, i) =>
              i > BID_ORDER.indexOf(interferenceBid) &&
              b.endsWith(suitSymbol(lowerSideSuit)),
          );
          if (
            tp >= 16 &&
            liftedSecond &&
            parseInt(liftedSecond[0]) <= 3 &&
            interferenceBid.slice(1) !== suitSymbol(lowerSideSuit)
          ) {
            return {
              bid: liftedSecond,
              category: `Show Second Suit Over Interference (${liftedSecond}, Extra Values)`,
              reasoning: `The opponents' ${interferenceBid} took your cheap second-suit bid away, but with ${tp} TP you have the EXTRA strength the higher level promises — bid ${liftedSecond} to show the two-suiter and keep your side in the auction.`,
              handAnalysis: analysis,
              whatYourBidTellsPartner: `Two-suited with extra values (16+): 5+ ${myOpenSuit} and 4+ ${lowerSideSuit}.`,
              expectedResponses: [
                { partnerBid: "Preference / raise", meaning: "Pick a strain" },
              ],
              confidence: "medium",
            };
          }
          const theirSuitIsMySecond =
            !interferenceBid.endsWith("NT") &&
            interferenceBid.slice(1) === suitSymbol(lowerSideSuit);
          return {
            bid: "Pass",
            category: theirSuitIsMySecond
              ? "Pass — They Bid Your Second Suit"
              : "Pass — Second Suit Unavailable Over Interference",
            reasoning: theirSuitIsMySecond
              ? `You planned to show your ${lowerSideSuit} second suit, but the opponents' ${interferenceBid} IS that suit — your ${hand[lowerSideSuit]} cards there sit over the bidder. Pass and defend; partner's 1NT (6-10) plus your holding makes their contract a poor spot, and bidding on would only rescue them.`
              : `You planned to show your ${lowerSideSuit} second suit, but the opponents' ${interferenceBid} has taken that bid away, and promising a new suit a level higher would show strength you may not have. Pass — partner (6-10) can still act.`,
            handAnalysis: analysis,
            whatYourBidTellsPartner:
              "Nothing new — the interference took my natural rebid away.",
            expectedResponses: [],
            confidence: "medium",
          };
        }
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
      // Higher-ranking second suit at 2-level after 1NT = reverse, requires 17+ TP
      const higherSideSuit = (
        ["clubs", "diamonds", "hearts", "spades"] as const
      ).find(
        (s) =>
          s !== myOpenSuit &&
          (SUIT_RANK_NT[s] ?? 0) > mySuitRankNT &&
          (hand[s as keyof Hand] as number) >= 4,
      );
      if (higherSideSuit && tp >= 17) {
        const reverseBid = `2${suitSymbol(higherSideSuit)}`;
        return {
          bid: reverseBid,
          category: `Reverse After 1NT (${reverseBid})`,
          reasoning: `Partner bid 1NT. With 5+ ${myOpenSuit} and 4+ ${higherSideSuit} (a higher-ranking suit), bid ${reverseBid} — a reverse showing 17+ TP. This is forcing for one round.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: `Two-suited: 5+ ${myOpenSuit} and 4+ ${higherSideSuit}, 17+ TP. Reverse — please describe your hand.`,
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

    // ── I ALREADY RAISED this suit — partner's re-bid is competitive or
    // invitational, NOT a new forcing suit.  My raise told my whole story:
    // raising again on the same values is the classic "bidding your hand
    // twice".  Accept only with an undisclosed maximum.
    const iAlreadyRaised =
      !!myLatestBid &&
      isRealBid(myLatestBid) &&
      !myLatestBid.endsWith("NT") &&
      myLatestBid.slice(1) === suitSymbol(partnerSuit);
    // Distinguish WHO showed the suit first: if partner never bid this suit
    // before my call, my bid was my OWN second suit and partner is now
    // RAISING ME — the story must not claim "you already raised partner".
    const suitWasMineFirst =
      !partnerFirstBid ||
      partnerFirstBid.endsWith("NT") ||
      partnerFirstBid.slice(1) !== suitSymbol(partnerSuit);
    if (iAlreadyRaised && partnerBidLevel < gameLvl) {
      const acceptBidRR = `${Math.min(partnerBidLevel + 1, gameLvl)}${suitSymbol(partnerSuit)}`;
      const acceptLegal =
        !interferenceBid ||
        BID_ORDER.indexOf(acceptBidRR) > BID_ORDER.indexOf(interferenceBid);
      if (supportTP >= 16 && acceptLegal) {
        // For a MINOR the next step (4m) is still below game — that is a
        // further GAME TRY, not an acceptance; only 5m/4M is the accept.
        const acceptIsGame =
          parseInt(acceptBidRR[0]) === gameLvl ||
          acceptBidRR === `${gameLvl}${suitSymbol(partnerSuit)}`;
        return {
          bid: acceptBidRR,
          category: suitWasMineFirst
            ? acceptIsGame
              ? "Accept the Raise of Your Second Suit (Maximum)"
              : "Game Try Over the Raise of Your Second Suit"
            : "Accept — Maximum for the Earlier Raise",
          reasoning: suitWasMineFirst
            ? acceptIsGame
              ? `You showed ${partnerSuit} as a second suit and partner's ${partnerResponse} raise invites. With ${supportTP} support points you have undisclosed extras — accept with ${acceptBidRR}.`
              : `You showed ${partnerSuit} as a second suit and partner raised competitively to ${partnerResponse}. With ${supportTP} support points you have undisclosed extras — make one more GAME TRY with ${acceptBidRR}; partner bids the ${gameLvl}-level game with a maximum for the raise, otherwise passes.`
            : `You already raised partner's ${partnerSuit}; their ${partnerResponse} continues toward game. With ${supportTP} support points you are at the TOP of what your raise showed — accept with ${acceptBidRR}.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: acceptIsGame
            ? `Maximum for the earlier bidding (${supportTP} support pts).`
            : "Undisclosed extras — bid game with a maximum for your raise.",
          expectedResponses: acceptIsGame
            ? []
            : [
                {
                  partnerBid: `${gameLvl}${suitSymbol(partnerSuit)}`,
                  meaning: "Maximum for the raise — accepting",
                },
                { partnerBid: "Pass", meaning: "Minimum — high enough" },
              ],
          confidence: "medium",
        };
      }
      return {
        bid: "Pass",
        category: suitWasMineFirst
          ? "Decline the Raise of Your Second Suit (Minimum)"
          : "Pass — The Earlier Raise Said It All",
        reasoning: suitWasMineFirst
          ? `Your ${myLatestBid} showed this ${partnerSuit} second suit, and partner's ${partnerResponse} raise ${interferenceBid ? "competes over the interference and " : ""}invites. With ${supportTP} support points you have nothing beyond what your two bids already showed — decline by passing.`
          : `You already raised partner's ${partnerSuit}, which showed this hand's support and range. Partner's ${partnerResponse} ${interferenceBid ? "is competing over the opponents' interference" : "invites"}, and with ${supportTP} support points you have nothing beyond what the raise promised — bidding again would count the same values twice. Pass.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "Nothing beyond my earlier bidding — minimum for it.",
        expectedResponses: [],
        confidence: "high",
      };
    }

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

    // ── Contested 2-level MAJOR response: partner promised a 5+ card suit
    // (with only four they would double or pass over the interference), so
    // 3-card support completes an 8-card fit — raise it rather than retreat
    // to your own ragged suit or notrump.
    if (
      contested &&
      isMajorFit &&
      partnerBidLevel === 2 &&
      partnerSuitLen === 3 &&
      supportTP >= 12
    ) {
      const raise3Legal =
        !interferenceBid ||
        BID_ORDER.indexOf(raiseBid) > BID_ORDER.indexOf(interferenceBid);
      if (raise3Legal) {
        return {
          bid: raiseBid,
          category: "Raise Partner's 5-Card Major (3-Card Support)",
          reasoning: `Partner's 2-level ${partnerSuit} bid in competition promises a 5+ card suit, so your 3-card support completes an 8-card fit. Raise to ${raiseBid} — supporting the known major fit beats rebidding your own suit or guessing at notrump.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: `3-card ${partnerSuit} support, ${supportTP >= 16 ? "extra values" : "minimum opener"} — we have an 8-card fit.`,
          expectedResponses: [
            {
              partnerBid: `4${suitSymbol(partnerSuit)}`,
              meaning: "Enough for game opposite your raise",
            },
            { partnerBid: "Pass", meaning: "Minimum — partscore" },
          ],
          confidence: "high",
        };
      }
    }

    // ── STRONG: game values with 4-card fit (19+ support pts AND real values) ─
    if (partnerSuitLen >= 4 && canCommitGameFromSupport) {
      if (!isMajorFit && partnerBidLevel >= 2) {
        // MINOR fit after a 2-over-1 (10+, effectively game-bound): do NOT
        // blast 5 of the minor — that steamrolls past 3NT (9 tricks vs 11)
        // and any major fit.  A strong raise keeps every game in the picture;
        // responder's 10+ means the auction will not die below game.
        return {
          bid: raiseBid,
          category: `Strong ${partnerSuit.charAt(0).toUpperCase() + partnerSuit.slice(1)} Raise (${supportTP} support pts — Game Values)`,
          reasoning: `With 4+ card support for partner's ${partnerSuit} and ${supportTP} support points, game is certain — but do NOT jump to 5${suitSymbol(partnerSuit)}: an 11-trick minor game is the LAST choice when 3NT (9 tricks) or a major fit may be available. Raise to ${raiseBid}; partner's 10+ response guarantees another bid, and the partnership picks the best game next.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: `4+ card ${partnerSuit} support with game-going values — choose the final game (3NT, a major, or 5${suitSymbol(partnerSuit)}).`,
          expectedResponses: [
            {
              partnerBid: "3NT",
              meaning: "Stoppers in the unbid suits — the 9-trick game",
            },
            {
              partnerBid: "New suit",
              meaning: "Stopper/shape probe for 3NT or a major fit",
            },
            {
              partnerBid: `5${suitSymbol(partnerSuit)}`,
              meaning: "No stoppers, no major — the minor game",
            },
          ],
          confidence: "high",
        };
      }
      return {
        bid: partnerGameBid,
        category: `Game Raise (${supportTP} support pts — Strong Opener)`,
        reasoning: `With 4+ card support for partner's ${partnerSuit} and ${supportTP} support points (HCP plus short-suit ruffing points for the fit, 19+), bid game directly — ${partnerGameBid}. There is enough combined strength (opener 19+ + responder 6+) to make game.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `4+ card ${partnerSuit} support, ${supportTP} support points (19+). This is a game-level bid.`,
        expectedResponses: [
          { partnerBid: "Pass", meaning: "Minimum responder — game is enough" },
          { partnerBid: "4NT", meaning: "Slam interest — Blackwood" },
        ],
        confidence: "high",
      };
    }

    // ── Jump support (invitational): 16-18 support points, or 19 without the
    //    real shortness/strength needed to commit straight to game. ───────────
    if (partnerSuitLen >= 4 && supportTP >= 16) {
      const jumpSupportBid = `${raiseLvl + 1}${suitSymbol(partnerSuit)}`;
      return {
        bid: jumpSupportBid,
        category: "Jump Support (16-18 support pts)",
        reasoning: `With 4+ card support for partner's ${partnerSuit} and ${supportTP} support points (HCP plus short-suit ruffing points, 16-18), jump to ${jumpSupportBid} — an invitational jump raise. This invites partner to bid game with 9+ HCP.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `4+ card ${partnerSuit} support, 16-18 support points — strong opener. Bid game with 9+ HCP.`,
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

    // ── 4-card support: simple raise of partner's suit (13-15 support pts) ────
    if (partnerSuitLen >= 4 && supportTP <= 15) {
      return {
        bid: raiseBid,
        category: "Raise Partner's Suit (13-15 support pts)",
        reasoning: `Partner bid a new ${partnerSuit} suit (forcing). With 4-card support and ${supportTP} support points (HCP plus short-suit ruffing points, a minimum opener), raise to ${raiseBid}. This shows 4-card support and a non-forcing minimum.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `4-card ${partnerSuit} support, minimum opener (13-15 support points).`,
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
    // Fit established — gate on short-suit support points, matching the sibling
    // raise branches that use calcTPWithFit.
    if (
      isMajorFit &&
      partnerSuitLen === 3 &&
      supportTP <= 15 &&
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
    // Base simple level off partner's response …
    let simpleLevel = canBidAtSameLevel ? partnerBidLevel : partnerBidLevel + 1;
    // … but an opponent's intervening bid (e.g. 3♦ over partner's 2♥) raises
    // the floor: my suit rebid must be strictly higher than their call.  Bump
    // the level until a bid of my suit clears the interference.
    if (interferenceBid && interferenceBid !== "Pass") {
      const interferenceIdx = BID_ORDER.indexOf(interferenceBid);
      while (
        simpleLevel < 7 &&
        BID_ORDER.indexOf(`${simpleLevel}${suitSymbol(myOpenSuit)}`) <=
          interferenceIdx
      ) {
        simpleLevel += 1;
      }
    }
    simpleLevel = Math.min(simpleLevel, 7);
    const jumpLevel = Math.min(simpleLevel + 1, 7);

    // ── 1-level new suit: show a 4-card suit HIGHER than partner's suit at the 1-level.
    // This is NOT a reverse (partner can return to opener's first suit at the 2-level).
    // No extra strength required — available to any opener up to 16 TP.
    // With 17+ TP, the Reverse block below takes over (and itself falls back
    // to the 1-level bid when the suit is still available there and tp < 19).
    // Example: 1♦ – 1♥ – 1♠  (opener has 4 spades, bids at 1-level, no extra strength)
    if (partnerBidLevel === 1 && tp <= 16) {
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

    // ── Reverse bid (17+ TP, 4-card side suit ranking higher than opener's suit)
    // A reverse shows a two-suited hand where the second suit is higher-ranking
    // than the opening suit, forcing the response to the 2-level or higher.
    // Example: 1♦ – 1♥ – 2♠  (opener's reverse, showing 4+ spades, 17+ TP)
    if (tp >= 17 && partnerBidLevel <= 2) {
      const reverseSuit = (
        ["spades", "hearts", "diamonds", "clubs"] as const
      ).find(
        (s) =>
          s !== myOpenSuit &&
          s !== partnerSuit &&
          (SUIT_RANK[s] ?? 0) > mySuitRank &&
          (hand[s as keyof Hand] as number) >= 4 &&
          // The 2-level bid in this suit must actually be legal over
          // partner's response.
          BID_ORDER.indexOf(`2${suitSymbol(s)}`) >
            BID_ORDER.indexOf(partnerResponse),
      );
      if (reverseSuit) {
        const reverseBid = `2${suitSymbol(reverseSuit)}`;
        // If the suit was still biddable at the 1-LEVEL over partner's
        // response, a 2-level call SKIPS a level: that is a JUMP SHIFT
        // (19-21, game-forcing), not a reverse.
        const oneLevelAvailable =
          BID_ORDER.indexOf(`1${suitSymbol(reverseSuit)}`) >
          BID_ORDER.indexOf(partnerResponse);
        if (oneLevelAvailable && tp < 19) {
          // Too weak for the jump shift — just bid the suit at the 1-level.
          return {
            bid: `1${suitSymbol(reverseSuit)}`,
            category: `New Suit at 1-Level (1${suitSymbol(reverseSuit)})`,
            reasoning: `With 4+ ${reverseSuit} and partner's ${partnerResponse}, bid 1${suitSymbol(reverseSuit)} to show your second suit cheaply — a 2-level call here would be a jump shift promising 19+. Forcing for one round.`,
            handAnalysis: analysis,
            whatYourBidTellsPartner: `4+ ${reverseSuit}, two-suited hand.`,
            expectedResponses: [],
            confidence: "high",
          };
        }
        return {
          bid: reverseBid,
          category: oneLevelAvailable
            ? `Jump Shift (${tp} TP — Game Forcing)`
            : `Reverse Bid (${tp} TP)`,
          reasoning: oneLevelAvailable
            ? `With ${tp} TP and 4+ ${reverseSuit}, JUMP SHIFT to ${reverseBid} — skipping the available 1-level bid shows 19-21 and creates a game force. Partner must keep bidding until game.`
            : `With ${tp} TP and 4+ ${reverseSuit} (a suit ranking higher than your ${myOpenSuit} opening), bid the reverse ${reverseBid}. A reverse shows a two-suited hand of 17+ TP and is forcing for one round — partner must bid again. This paints a picture of extra values and good shape.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: oneLevelAvailable
            ? `Two-suited powerhouse (${myOpenSuit} + ${reverseSuit}), 19-21 — game-forcing.`
            : `Two-suited hand (${myOpenSuit} + ${reverseSuit}), 17+ TP. Forcing — please describe your hand further.`,
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
      // Cheapest legal bid of the lower suit: strictly above BOTH partner's
      // response and any opponent interference.  Computed straight from
      // BID_ORDER so it is correct regardless of suit ranks.
      const secondFloorIdx = Math.max(
        partnerResponse ? BID_ORDER.indexOf(partnerResponse) : -1,
        interferenceBid && interferenceBid !== "Pass"
          ? BID_ORDER.indexOf(interferenceBid)
          : -1,
      );
      const lowerSuitBid = lowerSuit
        ? BID_ORDER.find(
            (b, i) => i > secondFloorIdx && b.endsWith(suitSymbol(lowerSuit)),
          )
        : undefined;
      const lowerLevel = lowerSuitBid ? parseInt(lowerSuitBid[0]) : 99;
      // Show the lower second suit only if it does not force the auction past
      // the 3-level.  A minimum opener should not introduce a second suit at
      // the 4-level under competition — fall through to rebidding our own suit
      // / NT instead.
      const secondSuitLegal = !!lowerSuitBid && lowerLevel <= 3;
      if (lowerSuit && secondSuitLegal) {
        return {
          bid: lowerSuitBid!,
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

    // ── STRONG: jump TO GAME in own suit (19+ TP, SIX+ card suit) ────────────
    // SAYC opener-rebid ladder: simple rebid ≤15, JUMP rebid 16-18
    // (invitational, non-forcing), jump to GAME 19-21.  A 19+ hand must not
    // make the 16-18 invitational jump — partner would pass it.  Strong
    // balanced hands with only a 5-card suit rebid NT instead (see below).
    if (myOpenSuitLen >= 6 && tp >= 19) {
      const isMajorSuit = myOpenSuit === "hearts" || myOpenSuit === "spades";
      const gameLevelOwn = isMajorSuit ? 4 : 5;
      const gameBidOwn = `${Math.max(gameLevelOwn, jumpLevel)}${suitSymbol(myOpenSuit)}`;
      return {
        bid: gameBidOwn,
        category: "Jump to Game in Own Suit (19+ TP)",
        reasoning: `With a ${myOpenSuitLen}-card ${myOpenSuit} and ${tp} TP, jump straight to game (${gameBidOwn}). A single jump rebid would show only 16-18 and is NOT forcing — partner could pass it with game values present. Jumping to game shows 19-21 with a self-sufficient suit.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `${myOpenSuitLen}-card ${myOpenSuit}, 19-21 TP — game in hand opposite your 6+ points. Slam is possible with extras.`,
        expectedResponses: [
          { partnerBid: "Pass", meaning: "Minimum response — game is enough" },
          { partnerBid: "4NT", meaning: "Blackwood — slam interest" },
          {
            partnerBid: "Cue bid",
            meaning: "Slam try showing first-round control",
          },
        ],
        confidence: "high",
      };
    }

    // ── Balanced 12-14 minimum with a 5-card suit and partner responded at the
    // 1-level: rebid 1NT (the descriptive minimum), NOT a 5-card suit (which
    // promises 6).  Only when 1NT is still available (partner bid at the 1-level)
    // and the hand can't afford a 2NT — i.e. a true minimum.
    if (
      analysis.isBalanced &&
      myOpenSuitLen === 5 &&
      tp <= 15 &&
      parseInt(partnerResponse[0]) === 1 &&
      BID_ORDER.indexOf("1NT") > BID_ORDER.indexOf(partnerResponse)
    ) {
      return {
        bid: "1NT",
        category: "1NT Rebid (Balanced, 12-14 HCP)",
        reasoning: `With a balanced minimum (${hand.hcp} HCP) and only a 5-card ${myOpenSuit} suit, rebid 1NT — the descriptive minimum rebid. Rebidding the suit would promise 6.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: "Balanced 12-14 HCP, only 5 cards in my suit.",
        expectedResponses: [
          { partnerBid: "2♣", meaning: "Stayman / checkback" },
          { partnerBid: "Pass", meaning: "Minimum — content" },
        ],
        confidence: "high",
      };
    }

    // ── MEDIUM: jump rebid own suit (16-18 TP, 6+ card suit) ──────────────────
    // The jump rebid PROMISES a rebiddable 6+ card suit — with only 5, show a
    // second suit or notrump instead (a 5-card jump both overstates the suit
    // and buries a biddable side suit).
    if (myOpenSuitLen >= 6 && tp >= 16 && tp <= 18) {
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

    // ── Rebid own suit at the SIMPLE level (minimum opener, ≤15 TP) ───────────
    // A minimum opener NEVER jumps — a jump rebid shows 16-18 and is handled by
    // the branches above.  With a minimum, rebid the 5+ card suit at the
    // cheapest level (non-forcing), no jump.
    // Rebid own suit at the simple level (minimum opener, ≤15 TP).  Balanced
    // 5-card-suit minimums that should rebid 1NT were diverted above.
    if (myOpenSuitLen >= 5 && tp <= 15) {
      // ONE simple rebid says it all — if my latest bid was already a rebid
      // of this suit, saying it a third time is bidding the same values twice.
      if (
        myLatestBid &&
        /^[2-7][♠♥♦♣]$/.test(myLatestBid) &&
        myLatestBid.slice(1) === myOpeningBid.slice(1)
      ) {
        return {
          bid: "Pass",
          category: "Pass — The Suit Has Been Rebid Already",
          reasoning: `Your opening and your ${myLatestBid} rebid already showed this minimum hand with long ${myOpenSuit} — repeating the suit again would promise extra length or strength you do not have. Pass; the decision belongs to partner.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner:
            "Nothing beyond the rebid — no third bid from a minimum.",
          expectedResponses: [],
          confidence: "high",
        };
      }
      const rebidBid = `${simpleLevel}${suitSymbol(myOpenSuit)}`;
      return {
        bid: rebidBid,
        category: `Rebid Own Suit (${myOpenSuitLen}+ cards, ${tp <= 12 ? "Minimum" : "13–15 TP"})`,
        reasoning: `With a ${myOpenSuitLen}-card ${myOpenSuit} suit and no 4-card fit for partner's ${partnerSuit}, rebid ${rebidBid} — a simple, non-forcing minimum rebid at the cheapest level. A jump here would show 16-18; with a minimum you do not jump.`,
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
    // After a 1-level response: 1NT = 12-14, 2NT (jump) = 18-19.
    // After a 2-over-1 response: 2NT = 12-14, 3NT (jump) = 18-19.
    // (15-17 balanced opened 1NT directly.)
    // NEVER rebid notrump INTO an opponent's natural NT overcall — their
    // 15-18 sits over your minimum and NT-vs-NT partscores are a bloodbath.
    if (
      analysis.isBalanced &&
      ((interferenceBid && interferenceBid.endsWith("NT")) || oppShowedNT)
    ) {
      return {
        bid: "Pass",
        category: "Pass (Their 1NT Sits Over Your Minimum)",
        reasoning:
          "An opponent has shown a natural notrump hand (15-18 balanced with your suit stopped). Rebidding notrump with a balanced minimum walks into their strength — and partner's action was only competing. Pass; your opening already described this hand.",
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "Balanced minimum — nothing to add over their strong NT.",
        expectedResponses: [],
        confidence: "high",
      };
    }
    if (analysis.isBalanced) {
      const { hcp } = hand;
      const partnerLvl = parseInt(partnerResponse[0]) || 1;
      const base = partnerLvl >= 2 ? 2 : 1;
      const level = hcp >= 18 ? base + 1 : base;
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
  // Jacoby 2NT establishes a game-forcing major fit, so opener's slam evaluation
  // uses SHORT-suit support points (ruffing values count once the fit is known).
  const tp = calcTPWithFit(hand);
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

  // 14-15 TP unbalanced — extra values, bid 3 of major (slam interest)
  if (tp >= 14 && !analysis.isBalanced) {
    return {
      bid: `3${suitSymbol(majorSuit)}`,
      category: "Jacoby 2NT Rebid: Extra Values (14-15 TP)",
      reasoning: `With 14-15 TP and no shortness or 5-card side suit to show, bid 3${suitSymbol(majorSuit)} to indicate extra values. Partner can continue toward slam if appropriate.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "14-15 TP unbalanced, no shortness, no side suit — extra values, mild slam try.",
      expectedResponses: [
        {
          partnerBid: `4${suitSymbol(majorSuit)}`,
          meaning: "No slam interest — sign off",
        },
        { partnerBid: "4NT", meaning: "Blackwood — slam interest confirmed" },
      ],
      confidence: "medium",
    };
  }

  // Minimum (12-13) — jump to game
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
  /** The opponents' HIGHEST current bid (may be above the doubled bid when
   *  they raised) — all rebids must clear it. */
  currentFloorBid?: string,
  /** My previous bid — after I ANSWERED the double, partner may have raised
   *  that answer (an invite), which needs accept/decline logic, not a
   *  recomputed answer. */
  myPreviousBid?: string,
  /** Partner's latest real bid, if any (their Double routed here; a suit bid
   *  after it is their continuation). */
  partnerLatestBid?: string,
): BidRecommendation {
  const analysis = analyzeHand(hand);
  const { tp } = analysis;

  // ── Partner RAISED the suit I answered their double with — that raise is
  // INVITATIONAL (they hold more than the 6+ the double promised).  Accept
  // with a sound opener, decline with a bare minimum.  Never re-answer.
  if (
    myPreviousBid &&
    partnerLatestBid &&
    /^[1-7][♠♥♦♣]$/.test(myPreviousBid) &&
    /^[1-7][♠♥♦♣]$/.test(partnerLatestBid) &&
    myPreviousBid !== myOpeningBid &&
    partnerLatestBid.slice(1) === myPreviousBid.slice(1) &&
    BID_ORDER.indexOf(partnerLatestBid) > BID_ORDER.indexOf(myPreviousBid)
  ) {
    const invSuitSym = myPreviousBid.slice(1);
    const invIsMajor = invSuitSym === "♥" || invSuitSym === "♠";
    const invGameLvl = invIsMajor ? 4 : 5;
    const invLvl = parseInt(partnerLatestBid[0]);
    if (invLvl >= invGameLvl) {
      return {
        bid: "Pass",
        category: "Pass — Partner Bid Game Over Your Answer",
        reasoning: `Your answer to partner's negative double said what you have; partner's ${partnerLatestBid} places the contract at game. Pass.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: "Accepting your game decision.",
        expectedResponses: [],
        confidence: "high",
      };
    }
    if (tp >= 14) {
      const invGameBid = `${invGameLvl}${invSuitSym}`;
      return {
        bid: invGameBid,
        category: "Accept the Invite After Your Double Answer (14+ TP)",
        reasoning: `Your ${myPreviousBid} answered partner's negative double at the cheapest level (a minimum could do it), but partner's raise to ${partnerLatestBid} INVITES game — it shows real extra values beyond the 6+ their double promised. With ${tp} TP you are at the top of what you have shown: accept with ${invGameBid}.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: "Sound values for my answer — accepting game.",
        expectedResponses: [],
        confidence: "high",
      };
    }
    return {
      bid: "Pass",
      category: "Decline the Invite After Your Double Answer (Minimum)",
      reasoning: `Partner's raise to ${partnerLatestBid} invites game, but your ${myPreviousBid} answer to the negative double already showed this hand, and with only ${tp} TP there is nothing in reserve. Pass and play ${partnerLatestBid}.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Bare minimum — declining the invite.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  // ── I ALREADY answered the double and partner has added nothing new (only
  // the opponents kept bidding) — answering again would bid the same values
  // twice.  Pass; partner knows my hand and makes the next move.
  if (
    myPreviousBid &&
    /^[1-7][♠♥♦♣]$/.test(myPreviousBid) &&
    myPreviousBid !== myOpeningBid &&
    (!partnerLatestBid || !/^[1-7](?:[♠♥♦♣]|NT)$/.test(partnerLatestBid))
  ) {
    return {
      bid: "Pass",
      category: "Pass — Double Already Answered",
      reasoning: `Your ${myPreviousBid} already answered partner's negative double and described this hand; partner has said nothing since — only the opponents have bid on. Bidding again would count the same values twice. Pass; partner heard your answer and can still compete.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Nothing beyond my earlier answer — your call.",
      expectedResponses: [],
      confidence: "high",
    };
  }
  // The binding floor for LEVEL math: the higher of the doubled bid and any
  // later raise.  (The negative-vs-penalty judgment below keeps using the
  // DOUBLED bid itself.)
  const ndFloorBid =
    currentFloorBid &&
    isRealBid(currentFloorBid) &&
    BID_ORDER.indexOf(currentFloorBid) > BID_ORDER.indexOf(overcall)
      ? currentFloorBid
      : overcall;

  const openSuit = myOpeningBid.includes("♠")
    ? "spades"
    : myOpeningBid.includes("♥")
      ? "hearts"
      : myOpeningBid.includes("♦")
        ? "diamonds"
        : "clubs";

  // Opener MUST act over partner's (forcing) negative double — bids must clear
  // the overcall.  Lift a strain to the cheapest legal level above the overcall.
  const ndOvercallIdx = isRealBid(ndFloorBid)
    ? BID_ORDER.indexOf(ndFloorBid)
    : -1;
  const liftStrain = (minLevel: number, strainSym: string): string => {
    let l = Math.max(1, minLevel);
    while (l < 7 && BID_ORDER.indexOf(`${l}${strainSym}`) <= ndOvercallIdx) l++;
    return `${l}${strainSym}`;
  };

  // Guard: if the "overcall" we were handed is NT or a cuebid of our own
  // suit (e.g. partner doubled a Michaels cuebid), the negative-double
  // framework does not apply — partner's double shows values, not majors.
  if (overcall.endsWith("NT") || overcall.slice(1) === myOpeningBid.slice(1)) {
    return {
      bid: "Pass",
      category: "Pass (Partner's Double Shows Values)",
      reasoning: `Partner doubled ${overcall}, which is not a normal suit overcall — their double shows general values rather than specific majors. Your opening bid already described this hand; pass and let partner decide.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Nothing extra beyond the opening bid.",
      expectedResponses: [],
      confidence: "medium",
    };
  }

  // ── SAYC ceiling: partner's double of a bid ABOVE 2♠ is PENALTY ─────────────
  // Negative doubles apply only through 2♠, so a double of 3♣+ shows trump
  // tricks and a desire to defend.  Default is to LEAVE IT IN; pull only with
  // extreme offensive shape (shortness in their suit + a place to play + extras).
  if (
    isRealBid(overcall) &&
    BID_ORDER.indexOf(overcall) > BID_ORDER.indexOf("2♠")
  ) {
    const doubledSuitName = overcall.includes("♠")
      ? "spades"
      : overcall.includes("♥")
        ? "hearts"
        : overcall.includes("♦")
          ? "diamonds"
          : "clubs";
    const myLenInTheirSuit = hand[doubledSuitName as keyof Hand] as number;
    // Candidate strain to pull to: the longest side suit (my opened suit or an
    // unbid major with 4+ cards).
    const pullMajor =
      !overcall.includes("♥") && !myOpeningBid.includes("♥") && hand.hearts >= 4
        ? "hearts"
        : !overcall.includes("♠") &&
            !myOpeningBid.includes("♠") &&
            hand.spades >= 4
          ? "spades"
          : null;
    if (tp >= 18 && myLenInTheirSuit <= 1 && pullMajor) {
      const pullBid = liftStrain(1, suitSymbol(pullMajor));
      return {
        bid: pullBid,
        category: "Pull the Penalty Double (Extreme Shape)",
        reasoning: `Partner's double of ${overcall} is penalty-oriented (negative doubles apply only through 2♠). Normally you leave it in, but with ${tp} TP, ${myLenInTheirSuit === 0 ? "a void" : "a singleton"} in their ${doubledSuitName}, and ${hand[pullMajor as keyof Hand]} ${pullMajor}, your hand is far more offensive than defensive — pull to ${pullBid}.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `A very shapely, strong opener (${tp} TP) with little defense against ${doubledSuitName} — offense over defense.`,
        expectedResponses: [],
        confidence: "medium",
      };
    }
    return {
      bid: "Pass",
      category: "Pass (Partner's Double Is Penalty Above 2♠)",
      reasoning: `Partner's double of ${overcall} is penalty-oriented — negative doubles apply only through 2♠ in SAYC. Partner wants to defend; with no extreme distributional reason to pull, pass and collect the penalty.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Accepting the penalty double — we defend.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  // Determine which major partner showed with the negative double.
  // A major is "shown" only if NEITHER side has bid it — including ME (after
  // 1♥-(2♠)-X partner shows the MINORS, not my own hearts!).
  const overcalledSpades = overcall.includes("♠");
  const overcalledHearts = overcall.includes("♥");
  const iOpenedSpades = myOpeningBid.includes("♠");
  const iOpenedHearts = myOpeningBid.includes("♥");
  const shownSuit =
    !overcalledSpades && !iOpenedSpades
      ? "spades"
      : !overcalledHearts && !iOpenedHearts
        ? "hearts"
        : null;

  if (!shownSuit) {
    // Opponent overcalled both majors — negative double shows minors or an unusual hand.
    // Best response: bid NT with stoppers in opponent's suits, otherwise rebid own suit.
    const hasStoppers =
      hand.hasStopperInOpponentSuit !== false &&
      hand.spades >= 2 &&
      hand.hearts >= 2;
    // An NT rebid is a notrump decision: judge by HCP and require a balanced
    // hand.  Distributional points must not push a shapely hand into NT.
    const ntRebidOK = hasStoppers && analysis.isBalanced && hand.hcp >= 15;
    // Partner's double showed the minors.  A LONG self-sufficient suit of my
    // own outranks answering in a minor I may hold only 3 cards of — and an
    // "answer" in a minor requires a real 4+ card holding.
    const myOpenLenND2 = hand[openSuit as keyof Hand] as number;
    const myMinor = longerMinor(hand);
    const myMinorLen = hand[myMinor as keyof Hand] as number;
    if (!ntRebidOK && myOpenLenND2 >= 6) {
      const ownRebidND2 = liftStrain(
        tp >= 19 && (openSuit === "hearts" || openSuit === "spades") ? 4 : 2,
        suitSymbol(openSuit),
      );
      return {
        bid: ownRebidND2,
        category: "Rebid Long Suit Over the Negative Double",
        reasoning: `Partner's negative double implied the minors, but your ${myOpenLenND2}-card ${openSuit} suit is a far better trump suit than a possibly thin minor fit — rebid it (${ownRebidND2}).${parseInt(ownRebidND2[0]) >= 4 ? " With this playing strength that is the game." : ""}`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `${myOpenLenND2}-card ${openSuit} — the hand plays there regardless of your minors.`,
        expectedResponses: [],
        confidence: "medium",
      };
    }
    const rebidBid = ntRebidOK
      ? liftStrain(hand.hcp >= 18 ? 2 : 1, "NT")
      : myMinorLen >= 4
        ? liftStrain(tp >= 18 ? 2 : 1, suitSymbol(myMinor))
        : liftStrain(2, suitSymbol(openSuit));
    return {
      bid: rebidBid,
      category: "Rebid After Negative Double",
      reasoning: `Partner's negative double indicates both minors (or an unusual hand). ${ntRebidOK ? `With a balanced minimum and stoppers in both majors, bid ${rebidBid}.` : myMinorLen >= 4 ? `Bid your ${myMinorLen}-card ${myMinor} (partner's implied suit) at ${rebidBid} — opener must act over the negative double.` : `With no 4-card minor, rebid your ${openSuit} (${rebidBid}) — the least distortion.`}`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: ntRebidOK
        ? "Balanced minimum opener, stoppers in both majors."
        : myMinorLen >= 4
          ? `A real ${myMinor} holding for your implied minors.`
          : `Minimum opener — rebidding ${openSuit}.`,
      expectedResponses: [],
      confidence: "medium",
    };
  }

  const myFitLen = hand[shownSuit as keyof Hand] as number;

  if (myFitLen >= 4) {
    // Level of bid shows strength.  Compute the legal MINIMUM bid of partner's
    // shown suit over the overcall, then scale: simple = minimum, jump = +1
    // level (16-17), higher with more.
    const sym = suitSymbol(shownSuit);
    const overcallIdx = BID_ORDER.indexOf(ndFloorBid);
    const minShownBid =
      BID_ORDER.find((b, i) => i > overcallIdx && b.endsWith(sym)) ?? `2${sym}`;
    const minShownLevel = parseInt(minShownBid[0]);
    // The opponents' preemption may have pushed even the MINIMUM bid of
    // partner's suit to the 4-level.  Partner's double promised only 6+ —
    // a minimum opener must pass rather than bid game on hope.
    if (minShownLevel >= 4 && tp < 16) {
      return {
        bid: "Pass",
        category: "Pass (Preempt Took Our Room)",
        reasoning: `Partner's negative double showed ${shownSuit}, but the opponents' preemption means the cheapest ${shownSuit} bid is at the ${minShownLevel}-level — game. With a minimum opener (${tp} TP) opposite partner's 6+ points, bidding game is a gamble; pass (or convert the double to penalties).`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: "Minimum opener — content defending.",
        expectedResponses: [],
        confidence: "medium",
      };
    }
    // Never bid past game in the major on a negative double alone.
    const gameLvl = 4;
    const bid =
      tp >= 20
        ? `4${sym}`
        : tp >= 18
          ? `${Math.min(Math.max(3, minShownLevel + 1), gameLvl)}${sym}`
          : tp >= 15
            ? `${Math.min(minShownLevel + 1, gameLvl)}${sym}`
            : minShownBid;
    const range =
      tp >= 20
        ? "20-21 TP"
        : tp >= 18
          ? "18-19 TP"
          : tp >= 15
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

  // No fit — bid NT with stopper or rebid own suit.  NT level is an HCP
  // decision (the hand is already balanced here).
  if (analysis.isBalanced && hand.hasStopperInOpponentSuit !== false) {
    const ntBid = liftStrain(hand.hcp >= 18 ? 2 : 1, "NT");
    return {
      bid: ntBid,
      category: "NT Rebid After Negative Double",
      reasoning: `No 4-card fit for partner's shown suit. With a balanced hand and stopper in the overcalled suit, bid ${ntBid}.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `${hand.hcp >= 18 ? "18-19" : "12-14"} HCP balanced, stopper in their suit. (With 15-17 balanced you would have opened 1NT.)`,
      expectedResponses: [],
      confidence: hand.hasStopperInOpponentSuit ? "high" : "medium",
    };
  }

  // 3-card support: bid the shown suit at the 1-level (minimum) or 2-level (medium).
  // Per SAYC / bridgebum.com: "Bid partner's shown suit with only 3 cards (last resort)."
  // Showing 3-card support is preferred over rebidding a 5-card minor.
  if (myFitLen === 3) {
    const threeCardBid = liftStrain(tp >= 17 ? 2 : 1, suitSymbol(shownSuit));
    // The opponents' raise pushed the answer to the 3-level: with only a
    // 3-card fit (a 4-3 at best) and a minimum, the double is NOT forcing
    // over their bid — pass rather than stretch on 7 trumps.  At the 4-level
    // (their preemptive raise) a 3-card answer is out on ANY strength — that
    // is a 4-3 GAME on a hand partner never promised.
    if (
      parseInt(threeCardBid[0]) >= 4 ||
      (parseInt(threeCardBid[0]) >= 3 && tp < 15)
    ) {
      return {
        bid: "Pass",
        category: "Pass — Answer Pushed Too High (3-Card Fit, Minimum)",
        reasoning: `Partner's negative double asked for ${shownSuit}, but the opponents' raise means your 3-card answer would come at the ${threeCardBid[0]}-level — a 4-3 fit on ${tp} TP. The double is not forcing once the opponents bid on: pass, and partner (who heard their raise too) can still act.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "Minimum with no 4-card fit for your suit — nothing safe at this level.",
        expectedResponses: [],
        confidence: "medium",
      };
    }
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
  const ownSuitRebidND = liftStrain(2, suitSymbol(openSuit));
  // Level discipline: a 5-card suit may be rebid through the 3-level only;
  // the 4-level needs 6+ cards.  Beyond that (or with neither), pass —
  // partner's 6+ point double keeps them in the auction.
  const ndRebidLvl = parseInt(ownSuitRebidND[0]) || 9;
  if ((ndRebidLvl >= 4 && myOpenLen < 6) || ndRebidLvl >= 5) {
    return {
      bid: "Pass",
      category: "Pass — Too High to Rebid After the Negative Double",
      reasoning: `Partner's negative double showed the unbid major with 6+ points, but you have no fit for it and the opponents' bidding means your ${openSuit} suit could only be rebid at the ${ndRebidLvl}-level — too high for a ${myOpenLen}-card suit with a minimum. Pass; the double keeps partner in the auction and the decision comes back around.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "Minimum opener, no fit for your suit, nothing safe to bid.",
      expectedResponses: [],
      confidence: "medium",
    };
  }
  // Strength tiers: the CHEAPEST rebid caps the hand at ~15 — a 16-18 hand
  // must JUMP, and a 19+ hand jumps too (announcing the extra strength so
  // partner's 6+ point double drives to game).  Rebidding 2♣ on 20 HCP
  // buries a likely game.
  if (tp >= 16) {
    const ndJumpRebid = liftStrain(ndRebidLvl + 1, suitSymbol(openSuit));
    if (ndJumpRebid && parseInt(ndJumpRebid[0]) <= (myOpenLen >= 6 ? 4 : 3)) {
      const bigND = tp >= 19;
      return {
        bid: ndJumpRebid,
        category: bigND
          ? "Strong Jump Rebid After Negative Double (19+ TP)"
          : "Jump Rebid After Negative Double (16-18 TP)",
        reasoning: `No fit for the suit partner's double showed, but this hand is far too strong for the cheapest rebid (which would show only 12-15). With ${tp} TP and a ${myOpenLen}-card ${openSuit} suit, JUMP to ${ndJumpRebid} — ${bigND ? "and with 19+ plan to drive toward game over partner's next call" : "invitational (16-18); partner bids on with a little extra"}.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `Strong opener (16+ TP) with a long ${openSuit} suit and no fit for your suit${bigND ? " — game is very likely opposite your double" : ""}.`,
        expectedResponses: [
          { partnerBid: "3NT", meaning: "Stopper in their suit, 8+ pts" },
          { partnerBid: "Pass", meaning: "Bare minimum for the double" },
        ],
        confidence: "medium",
      };
    }
  }
  return {
    bid: ownSuitRebidND,
    category: "Rebid Own Suit After Negative Double",
    reasoning: `No fit for partner's shown suit. Rebid your ${openSuit} suit (${myOpenLen} cards) at the cheapest level — a minimum opener (about 12-15).`,
    handAnalysis: analysis,
    whatYourBidTellsPartner: `5-6 card ${openSuit} suit, minimum opener (12-15).`,
    expectedResponses: [],
    confidence: "medium",
  };
}

// ─── Response to 1NT after opponent doubles ──────────────────────────────────
// When partner opens 1NT and an opponent doubles (penalty-oriented in SAYC),
// the normal Stayman/Transfer structure is off.  Responder's options are:
//   • Redouble  – 10+ HCP, interested in playing 1NT ×× or penalising opponents
//   • Pass      – Too weak to act; let opener decide (opener may redouble or pass)
//   • 2-level suit – Natural escape: weak hand with a 5+ card suit
function getResponseTo1NTDoubled(hand: Hand): BidRecommendation {
  const analysis = analyzeHand(hand);
  const { hcp } = hand;
  const { tp } = analysis;

  // ── Redouble: 10+ HCP — confident the contract will make (or opponents will suffer) ──
  if (hcp >= 10) {
    return {
      bid: "Redouble",
      category: "Redouble After Opponent's Double of 1NT (10+ HCP)",
      reasoning: `After partner's 1NT was doubled by an opponent, with ${hcp} HCP you have enough strength to redouble. This warns the opponents that 1NT redoubled could score well for your side, or forces them to escape to a suit that you can penalise. Partner passes the redouble unless they need to run.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "10+ HCP — confident we can make 1NT (or more), or that opponents will be penalised if they run.",
      expectedResponses: [
        { partnerBid: "Pass", meaning: "Happy to play 1NT redoubled" },
        {
          partnerBid: "2♣/2♦/2♥/2♠",
          meaning: "Opponents run to a suit — partner passes or doubles",
        },
      ],
      confidence: "high",
    };
  }

  // ── Escape to 5-card suit: too weak to redouble but have a long suit ─────────
  const escapeSuit = (["spades", "hearts", "diamonds", "clubs"] as const).find(
    (s) => (hand[s as keyof Hand] as number) >= 5,
  );

  if (escapeSuit && tp >= 2) {
    const escapeBid = `2${suitSymbol(escapeSuit)}`;
    return {
      bid: escapeBid,
      category: `Escape to ${escapeSuit.charAt(0).toUpperCase() + escapeSuit.slice(1)} After Opponent's Double of 1NT`,
      reasoning: `After partner's 1NT was doubled by an opponent, with ${hcp} HCP and a ${hand[escapeSuit as keyof Hand] as number}-card ${escapeSuit} suit, escape to ${escapeBid}. This removes the double and shows a weak hand with a long suit — partner will normally pass.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `Weak hand (< 10 HCP) with 5+ ${escapeSuit}. Removing the double — please pass.`,
      expectedResponses: [
        { partnerBid: "Pass", meaning: "Accepts the escape" },
        {
          partnerBid: "2NT",
          meaning: "Very strong hand — slam interest regardless",
        },
      ],
      confidence: "high",
      note: "Normal Stayman/Transfer structure is OFF when opponent doubles 1NT.",
    };
  }

  // ── Pass: no escape suit and not strong enough to redouble ───────────────────
  return {
    bid: "Pass",
    category: "Pass After Opponent's Double of 1NT (Weak, No Escape)",
    reasoning: `After partner's 1NT was doubled by an opponent, with ${hcp} HCP and no 5-card escape suit, Pass is correct. Partner will redouble with a strong hand or may pass, leaving the doubled contract in place. Do not bid a short suit just to "rescue" partner — that often makes things worse.`,
    handAnalysis: analysis,
    whatYourBidTellsPartner:
      "Weak hand (< 10 HCP), no long suit — pass the decision back to partner.",
    expectedResponses: [
      {
        partnerBid: "Redouble",
        meaning: "Partner has a strong hand — confident in the contract",
      },
      { partnerBid: "Pass", meaning: "Defending 1NT doubled" },
    ],
    confidence: "high",
    note: "Normal Stayman/Transfer structure is OFF when opponent doubles 1NT.",
  };
}

// ─── After own Double: doubler gets a second turn ────────────────────────────
// When a player already doubled in a prior round and gets another chance to
// bid, the double has already described their hand.  The main decision is
// whether to accept partner's response (Pass) or invite/bid game with extras.
function getAfterOwnDouble(
  hand: Hand,
  partnerBid: string | undefined,
  opponentBid: string | undefined,
  /** True when my partner opened the auction — my double was NEGATIVE (6+),
   *  not a takeout double (12+).  Changes the narrative, not the action. */
  myDoubleWasNegative = false,
  /** Partner's opening bid (when they opened) — distinguishes "partner opened
   *  X and has passed since" from "partner has bid again". */
  partnerOpeningBid?: string,
  /** True when my double was a LEAD-DIRECTING double of the opponents'
   *  Stayman 2♣ — it showed clubs for the lead, not values or takeout. */
  leadDirecting = false,
  /** The bid my double hit — "1NT" marks a PENALTY double of a 1NT opening,
   *  whose suit pull by partner is a bust scramble, never a forced advance. */
  doubledBid?: string,
): BidRecommendation {
  const analysis = analyzeHand(hand);
  const { hcp } = hand;

  // ── My double was PENALTY of the opponents' 1NT and partner PULLED it to a
  // suit: that pull shows a BUST with a long suit (with any values partner
  // would sit for blood).  My double already told the story — pass.
  if (
    doubledBid === "1NT" &&
    !myDoubleWasNegative &&
    partnerBid &&
    /^[1-7][♠♥♦♣]$/.test(partnerBid)
  ) {
    return {
      bid: "Pass",
      category: "Pass — Partner Pulled Your Penalty Double",
      reasoning: `Your double of 1NT was PENALTY (16+ HCP), but partner pulled to ${partnerBid} — a scramble showing a BUST with a long suit (with any real values partner would have passed for penalties). Your strength is already on the table; raising opposite a known bust just digs deeper. Pass.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "Nothing new — my double said it all. Content with your escape suit.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  if (leadDirecting) {
    return {
      bid: "Pass",
      category: "Pass (Lead-Directing Double Has Done Its Job)",
      reasoning:
        "Your earlier double of the opponents' Stayman 2♣ was LEAD-DIRECTING — it showed strong clubs and asked partner to lead one, nothing more. It promised no general values and asks partner for no bid. The opponents have gone on with their auction; pass and (if you end up defending) enjoy the club lead.",
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "Nothing new — the double only asked for a club lead.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  const doubleDescription = myDoubleWasNegative
    ? "your negative double (6+ pts, the unbid suits)"
    : "your takeout double (12+ HCP, support for the unbid suits)";

  // ── The 19+ BALANCED strength-double: the plan was always "double, then
  // NT" — make the promised notrump rebid, never a raise of partner's
  // forced (0+ point) advance.
  if (
    !myDoubleWasNegative &&
    !leadDirecting &&
    analysis.isBalanced &&
    hcp >= 19 &&
    hand.hasStopperInOpponentSuit !== false &&
    partnerBid &&
    /^[1-7][♠♥♦♣]$/.test(partnerBid)
  ) {
    const ntFloorIdx = Math.max(
      BID_ORDER.indexOf(partnerBid),
      opponentBid && isRealBid(opponentBid)
        ? BID_ORDER.indexOf(opponentBid)
        : -1,
    );
    const ntRebidAOD = BID_ORDER.find(
      (b, i) => i > ntFloorIdx && b.endsWith("NT"),
    );
    if (ntRebidAOD && parseInt(ntRebidAOD[0]) <= 3) {
      return {
        bid: ntRebidAOD,
        category: "The Promised NT Rebid (19-21 Balanced After Double)",
        reasoning: `Your double was the STRENGTH double — 19+ balanced, too strong for a direct NT overcall — and the plan was always to rebid notrump. Partner's ${partnerBid} was forced (0+ points), so raising it promises a fit you never showed. Bid ${ntRebidAOD}: 19-21 balanced with their suit stopped.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "19-21 balanced with a stopper — raise toward 3NT with ~6+ points.",
        expectedResponses: [
          { partnerBid: "Pass", meaning: "A true bust" },
          { partnerBid: "Raise / 3NT", meaning: "6+ points — game" },
        ],
        confidence: "high",
      };
    }
  }
  // Raising partner's response to my takeout double agrees a fit — value with
  // short-suit support points.
  const supportTP = calcTPWithFit(hand);

  const partnerSuitName = !partnerBid
    ? undefined
    : partnerBid.includes("♠")
      ? "spades"
      : partnerBid.includes("♥")
        ? "hearts"
        : partnerBid.includes("♦")
          ? "diamonds"
          : partnerBid.includes("♣")
            ? "clubs"
            : undefined;

  const partnerLevel = partnerBid ? parseInt(partnerBid[0]) : undefined;

  // With 19+ support points / exceptional extras: partner's response + my
  // strength = possible game
  if (supportTP >= 19 && partnerSuitName && partnerLevel) {
    const gameTarget =
      partnerSuitName === "hearts" || partnerSuitName === "spades" ? 4 : 5;
    if (partnerLevel >= gameTarget) {
      return {
        bid: "Pass",
        category: "Pass After Own Double (Partner Already At Game)",
        reasoning: `You already doubled showing your strength, and partner's ${partnerBid} is already at or above game in ${partnerSuitName}. There is nothing sensible left to bid — pass.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: "Accepting partner's contract.",
        expectedResponses: [],
        confidence: "high",
      };
    }
    const gameBid = `${Math.min(partnerLevel + 2, gameTarget)}${suitSymbol(partnerSuitName)}`;
    return {
      bid: gameBid,
      category: "Raise to Game After Own Double (19+ TP)",
      reasoning: `You already doubled — ${doubleDescription}. With ${supportTP} support points and partner now in ${partnerBid}, you have enough combined strength to invite or bid game — raise to ${gameBid}.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "Extra values beyond minimum double (19+ support pts). Accepting their suit and bidding game.",
      expectedResponses: [
        { partnerBid: "Pass", meaning: "Minimum hand — content at game level" },
      ],
      confidence: "medium",
    };
  }

  const partnerResponded =
    !!partnerBid &&
    partnerBid !== "Pass" &&
    partnerBid !== "Double" &&
    partnerBid !== "Redouble";

  // Strong balanced doubler (19-21 HCP, stopper): the "double then bid NT"
  // sequence shows a hand too strong for a direct 1NT overcall.  Show it by
  // bidding notrump — BUT only when a natural NT bid is still available at the
  // 1NT/2NT/3NT level.  Once the auction is at the 3-level or higher, the
  // cheapest NT would be 4NT/5NT, which are CONVENTIONAL (Blackwood / Grand
  // Slam Force), not a range-showing natural bid — so this must not fire there.
  // (A full-auction simulation caught the engine bidding a phantom 5NT/grand
  // slam when this branch ran too high.)
  if (
    analysis.isBalanced &&
    hand.hcp >= 19 &&
    hand.hcp <= 21 &&
    hand.hasStopperInOpponentSuit !== false
  ) {
    const floorIdx = Math.max(
      opponentBid && isRealBid(opponentBid)
        ? BID_ORDER.indexOf(opponentBid)
        : -1,
      partnerResponded ? BID_ORDER.indexOf(partnerBid!) : -1,
    );
    const ntBid = BID_ORDER.find((b, i) => i > floorIdx && b.endsWith("NT"));
    const ntLevel = ntBid ? parseInt(ntBid[0]) : 99;
    if (ntBid && ntLevel <= 3) {
      return {
        bid: ntBid,
        category: `Notrump After Own Double (${hand.hcp} HCP Balanced)`,
        reasoning: `Your double, planning to bid notrump, shows a balanced hand too strong for the NT bid you skipped — 19-21 HCP over a direct overcall, or 15+ when the double was made in the balancing seat (where 1NT is only 11-14). With ${hand.hcp} HCP and a stopper in their suit, bid ${ntBid} now to show that range.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          'A balanced "double then notrump" hand — 19-21 directly, 15+ balancing — with a stopper. Raise toward game with values.',
        expectedResponses: [],
        confidence: "high",
      };
    }
    // NT no longer available below the 4-level — fall through to pass.
  }

  // ── Negative doubler: partner (the OPENER) has ANSWERED the double ─────────
  // Opener's answer carries a range: the cheapest bid of my implied suit is a
  // minimum (11-14), a JUMP shows 15-17.  My double promised only 6+, so the
  // game math is mine to finish: jump answer + ~10 support points = game.
  // Partner REBID THEIR OWN OPENED SUIT — that is NOT an answer to the double
  // (the double showed the UNBID major(s)); it just shows a minimum with extra
  // length and nothing to say about my suit.  Raise only with a real fit.
  if (
    myDoubleWasNegative &&
    partnerResponded &&
    partnerSuitName &&
    partnerOpeningBid &&
    !partnerOpeningBid.endsWith("NT") &&
    partnerBid!.slice(1) === partnerOpeningBid.slice(1) &&
    partnerBid !== partnerOpeningBid
  ) {
    const ownSuitLen = hand[partnerSuitName as keyof Hand] as number;
    // Was the own-suit rebid a JUMP?  The cheapest rebid above the overcall
    // shows a minimum (12-15); skipping a level shows 16-18+ and invites.
    const overcallForJump = doubledBid ?? opponentBid;
    const cheapestOwnRebidAOD =
      overcallForJump && isRealBid(overcallForJump)
        ? BID_ORDER.find(
            (b, i) =>
              i > BID_ORDER.indexOf(overcallForJump) &&
              b.endsWith(partnerOpeningBid.slice(1)),
          )
        : undefined;
    const openerJumpedAOD =
      !!cheapestOwnRebidAOD && partnerBid !== cheapestOwnRebidAOD;
    if (
      openerJumpedAOD &&
      ownSuitLen >= 4 &&
      supportTP >= 7 &&
      (partnerLevel ?? 9) <= 3
    ) {
      const raiseJump = `${(partnerLevel ?? 3) + 1}${suitSymbol(partnerSuitName)}`;
      return {
        bid: raiseJump,
        category: "Raise Opener's JUMP Rebid (Fit — Invite Accepted)",
        reasoning: `Partner could not answer your double but JUMPED in their own ${partnerSuitName} — that shows a strong opener (16-18+, long suit), not a minimum. With ${ownSuitLen}-card support and ${supportTP} support points beyond the bare 6 your double promised, raise to ${raiseJump}; a 19+ opener will carry on to game.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `Real ${partnerSuitName} fit with a little extra — go on with 19+.`,
        expectedResponses: [
          { partnerBid: "Pass", meaning: "16-18 — high enough" },
          { partnerBid: "Game", meaning: "19+ — accepting" },
        ],
        confidence: "medium",
      };
    }
    if (ownSuitLen >= 3 && supportTP >= 11 && (partnerLevel ?? 9) <= 3) {
      const raiseOwn = `${(partnerLevel ?? 2) + 1}${suitSymbol(partnerSuitName)}`;
      return {
        bid: raiseOwn,
        category: "Raise Opener's Long-Suit Rebid (Fit + Extras)",
        reasoning: `Partner could not answer your double and rebid their own ${partnerSuitName} (6+ cards${openerJumpedAOD ? ", 16-18+ for the jump" : ", minimum"}). With ${ownSuitLen}-card support and ${supportTP} support points — more than your double promised — raise once to ${raiseOwn}.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `Real ${partnerSuitName} tolerance and extra values — inviting.`,
        expectedResponses: [{ partnerBid: "Pass", meaning: "Dead minimum" }],
        confidence: "medium",
      };
    }
    return {
      bid: "Pass",
      category: "Pass — Opener Rebid Their Own Suit",
      reasoning: openerJumpedAOD
        ? `Your negative double asked for the unbid major, but partner JUMPED in their own ${partnerSuitName} — a strong opener (16-18+) with a long suit and no fit for your suit. Even so, with only ${supportTP} support points and ${ownSuitLen} card(s) in ${partnerSuitName}, you have nothing beyond the 6+ your double already promised — pass.`
        : `Your negative double asked for the unbid major, but partner rebid their own ${partnerSuitName} instead — a minimum opener with extra length and no fit for your suit. With ${ownSuitLen} card(s) in ${partnerSuitName}, there is no reason to bid on: your double already showed this hand. Pass.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "Nothing beyond my double — no great fit for your long suit.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  if (
    myDoubleWasNegative &&
    partnerResponded &&
    partnerSuitName &&
    partnerLevel
  ) {
    const isMajorAOD =
      partnerSuitName === "hearts" || partnerSuitName === "spades";
    const gameLvlAOD = isMajorAOD ? 4 : 5;
    const oppFloorAOD =
      opponentBid && isRealBid(opponentBid)
        ? BID_ORDER.indexOf(opponentBid)
        : -1;
    // Only measure jump-ness when partner's answer is still the highest call
    // (if the opponents bid again afterwards, stay conservative).
    const answerAboveOpp =
      BID_ORDER.indexOf(partnerBid!) > oppFloorAOD || oppFloorAOD === -1;
    const cheapestAnswer = BID_ORDER.find(
      (b, i) => i > oppFloorAOD && b.endsWith(suitSymbol(partnerSuitName)),
    );
    const openerJumped =
      answerAboveOpp && !!cheapestAnswer && cheapestAnswer !== partnerBid;
    if (partnerLevel < gameLvlAOD) {
      if (openerJumped && supportTP >= 10) {
        const gameBidAOD = `${gameLvlAOD}${suitSymbol(partnerSuitName)}`;
        return {
          bid: gameBidAOD,
          category: "Raise Opener's Jump Answer to Game",
          reasoning: `Your negative double showed ${partnerSuitName} with 6+ pts, and partner's JUMP to ${partnerBid} shows a maximum opener (about 15-17) with 4-card support. With ${supportTP} support points the combined count reaches game — bid ${gameBidAOD}.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner:
            "About 10+ support points — enough for game opposite your jump.",
          expectedResponses: [{ partnerBid: "Pass", meaning: "To play" }],
          confidence: "high",
        };
      }
      if (!openerJumped && answerAboveOpp && supportTP >= 13) {
        const inviteBidAOD = `${partnerLevel + 1}${suitSymbol(partnerSuitName)}`;
        const inviteIsGame = partnerLevel + 1 >= gameLvlAOD;
        return {
          bid: inviteBidAOD,
          category: inviteIsGame
            ? "Raise Opener's Answer to Game"
            : "Invite After Opener's Minimum Answer",
          reasoning: `Your negative double showed ${partnerSuitName}, and partner's ${partnerBid} is the CHEAPEST answer — a minimum opener (about 11-14). With ${supportTP} support points (well beyond the 6+ your double promised), ${inviteIsGame ? `the combined count reaches game — bid ${inviteBidAOD}` : `raise once to ${inviteBidAOD} to invite game`}.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: `About 13+ support points${inviteIsGame ? " — enough for game opposite a minimum answer." : " — game interest opposite even a minimum."}`,
          expectedResponses: inviteIsGame
            ? [{ partnerBid: "Pass", meaning: "To play" }]
            : [
                { partnerBid: "Pass", meaning: "Dead minimum" },
                {
                  partnerBid: `${gameLvlAOD}${suitSymbol(partnerSuitName)}`,
                  meaning: "Anything extra — game",
                },
              ],
          confidence: "medium",
        };
      }
    }
  }

  // Otherwise pass — the double has already described the hand.
  const opponentNote = opponentBid
    ? ` The opponents now stand at ${opponentBid}.`
    : "";
  const partnerNote =
    myDoubleWasNegative && partnerResponded && partnerBid === partnerOpeningBid
      ? ` Partner opened ${partnerOpeningBid} and has passed since — a minimum opener with no clear second bid.`
      : partnerResponded
        ? ` Partner has since bid ${partnerBid}.`
        : myDoubleWasNegative
          ? " Partner (the opener) has passed since — a minimum opener with no clear second bid."
          : " Partner has not been able to show values.";
  return {
    bid: "Pass",
    category: partnerResponded
      ? "Pass After Own Double (Partner Responded)"
      : "Pass After Own Double (Minimum)",
    reasoning: `You already doubled — ${doubleDescription}. With ${hcp} HCP (${supportTP} support pts), that double has described your hand.${partnerNote}${opponentNote} Pass — bidding again would promise significant extra values you do not have.`,
    handAnalysis: analysis,
    whatYourBidTellsPartner: myDoubleWasNegative
      ? "Nothing beyond the negative double — no extra values, content to defend."
      : "I have a minimum double (12–18 TP) — I am satisfied to defend or play here.",
    expectedResponses: [],
    confidence: "high",
    note: "To bid again after doubling, you typically need significant extras (19+ TP for a takeout double).  Bidding again with fewer values is a sign-off error.",
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
      : partnerSuit.includes("♦")
        ? "diamonds"
        : "clubs";
  const mySupport = hand[suit as keyof Hand] as number;
  // These are raises of partner's opened suit (a fit is established), so value
  // the hand with SHORT-suit support points rather than long-suit TP.
  const supportTP = calcTPWithFit(hand);

  if (mySupport >= 3 && supportTP >= 13) {
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

  // SAYC redouble: 10+ HCP, classically WITHOUT a fit — announces the balance
  // of power and suggests penalizing the opponents' runout.  (Fit hands with
  // 10+ use Jordan 2NT below instead.)
  if (hand.hcp >= 10 && mySupport < 3) {
    return {
      bid: "Redouble",
      category: "Redouble (10+ HCP, No Fit — Penalty Interest)",
      reasoning: `After partner opens 1${suitSymbol(suit)} and an opponent doubles, redouble with ${hand.hcp} HCP and no fit. This announces that the deal belongs to your side — partner is invited to double the opponents' escape suit for penalty.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "10+ HCP, usually no fit. Ready to penalize their runout — do not pull without a shapely hand.",
      expectedResponses: [
        { partnerBid: "Double of their runout", meaning: "Penalty" },
        { partnerBid: "Pass", meaning: "Waiting for your next action" },
      ],
      confidence: "high",
    };
  }

  // With a 5-card major and only partial support for partner's MINOR, show the
  // major (natural, non-forcing after the double) rather than burying it in a
  // minor raise.  A new suit here is to-play, not forcing.
  const partnerOpenedMinor = suit === "diamonds" || suit === "clubs";
  const my5Major =
    hand.spades >= 5 ? "spades" : hand.hearts >= 5 ? "hearts" : null;
  if (partnerOpenedMinor && my5Major && mySupport < 4 && tp >= 6 && tp <= 9) {
    // Both majors outrank a 1-minor, so the major is available at the 1-level.
    return {
      bid: `1${suitSymbol(my5Major)}`,
      category: "New Suit After Opponent's Double (5-card major)",
      reasoning: `After partner opens 1${suitSymbol(suit)} and an opponent doubles, bid your 5-card ${my5Major} suit. A new suit by responder over a takeout double is natural and non-forcing — showing the major is better than raising the minor on ${mySupport}-card support.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `5+ ${my5Major}, about 6-9 pts (10+ would redouble first). Natural, non-forcing.`,
      expectedResponses: [
        { partnerBid: "Raise", meaning: `3-card ${my5Major} support` },
        { partnerBid: "Rebid", meaning: "No fit — describes opener's hand" },
      ],
      confidence: "high",
    };
  }

  if (mySupport >= 3 && supportTP >= 10) {
    return {
      bid: "2NT",
      category: "Jordan 2NT (Limit Raise after Opponent's Double)",
      reasoning: `After partner opens 1${suitSymbol(suit)} and an opponent doubles, 2NT is Jordan convention — showing a limit raise (10+ pts, 3+ card ${suit} support). This is NOT a natural NT bid.`,
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

  // Pre-emptive jump raise.  For a MAJOR fit, 3-card support is enough (a common
  // obstructive treatment).  For a MINOR, require 4+ trumps (Law of Total Tricks:
  // 3-card support = 8 trumps belongs at the 2-level), so 3-card minor support
  // makes a simple raise instead (below).
  const suitIsMajor = suit === "hearts" || suit === "spades";
  if (
    (mySupport >= 4 || (mySupport >= 3 && suitIsMajor)) &&
    supportTP >= 6 &&
    supportTP <= 9
  ) {
    return {
      bid: `3${suitSymbol(suit)}`,
      category: "Pre-emptive Raise After Opponent's Double",
      reasoning: `After partner opens and an opponent doubles, a jump raise is PRE-EMPTIVE (not invitational). With ${mySupport}-card ${suit} support and 6-9 pts, raise to 3${suitSymbol(suit)} to make things difficult for the opponents.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "Pre-emptive raise (3+ support for a major, 4+ for a minor), 6-9 pts — not invitational.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  // 3-card MINOR support, 6-9 pts: a simple (non-jump) competitive raise.
  if (mySupport >= 3 && supportTP >= 6 && supportTP <= 9) {
    return {
      bid: `2${suitSymbol(suit)}`,
      category: "Simple Raise After Opponent's Double (3-card support)",
      reasoning: `After partner opens 1${suitSymbol(suit)} and an opponent doubles, with ${supportTP} support points and 3-card ${suit} support, make a simple raise to 2${suitSymbol(suit)} — a jump would promise 4+ trumps.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `3-card ${suit} support, 6-9 pts. Competitive raise.`,
      expectedResponses: [],
      confidence: "high",
    };
  }

  // Fallback cases: weak hand with 3+ support (too weak for pre-emptive raise), or no fit
  if (mySupport >= 3) {
    return {
      bid: `2${suitSymbol(suit)}`,
      category: "Weak Raise After Opponent's Double",
      reasoning: `After partner opens 1${suitSymbol(suit)} and an opponent doubles, with ${supportTP} support points and ${mySupport}-card ${suit} support, make a minimum raise to 2${suitSymbol(suit)} to show your fit and take away bidding space from the opponents.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `Minimum support (0–5 pts, 3+ ${suit}). Competitive raise.`,
      expectedResponses: [],
      confidence: "medium",
    };
  }

  if (tp < 6) {
    return {
      bid: "Pass",
      category: "Pass (Too Weak to Act After Opponent's Double)",
      reasoning: `After partner opens 1${suitSymbol(suit)} and an opponent doubles, with only ${tp} pts and no fit for partner's ${suit}, Pass is correct. Partner may redouble or let the auction develop.`,
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
    category: "Bid New Suit After Opponent's Double",
    reasoning: `After partner opens 1${suitSymbol(suit)} and an opponent doubles, with ${tp} pts but no fit for partner's ${suit}, bid your longest suit (${longestName}) at the ${tp >= 9 ? "2" : "1"}-level to compete and find a possible fit.`,
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
  partnerContinuation?: string,
  /** True when Stayman was 3♣ over a 2NT opening (20-21) — game needs only
   *  ~4-5 HCP and every follow-up is a level higher than over 1NT. */
  over2NT = false,
): BidRecommendation {
  const analysis = analyzeHand(hand);
  const { hcp } = hand;

  // ── Partner never ANSWERED Stayman (an overcall intervened and partner
  // passed): systems are dead.  Act on values + stoppers, honestly.
  const validReplies = over2NT
    ? ["3♦", "3♥", "3♠"]
    : ["2♦", "2♥", "2♠", "3♦", "3♥", "3♠"];
  if (!validReplies.includes(partnerReply)) {
    if (hcp >= 10 && hand.hasStopperInOpponentSuit === true) {
      return {
        bid: "3NT",
        category: "3NT — Stayman Went Unanswered (Values + Stopper)",
        reasoning: `The opponents' overcall took partner's Stayman answer away and partner passed (a minimum with no cheap call). With ${hcp} HCP and their suit stopped, bid the game your values always promised: 3NT.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: "Game values with their suit stopped.",
        expectedResponses: [],
        confidence: "medium",
      };
    }
    return {
      bid: "Pass",
      category: "Pass — Stayman Went Unanswered, No Stopper",
      reasoning:
        "The opponents' overcall silenced the Stayman machinery and partner passed. Without a sure stopper in their suit (or enough strength to insist), do not guess at notrump — pass and defend; partner (15-17) may still reopen.",
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "Values shown by Stayman, but no safe continuation over their suit.",
      expectedResponses: [],
      confidence: "medium",
    };
  }

  if (over2NT) {
    // ── Stayman over 2NT (opener 20-21) ─────────────────────────────────────
    if (partnerReply === "3♦") {
      // No 4-card major.
      const fiveMajor =
        hand.spades >= 5 ? "spades" : hand.hearts >= 5 ? "hearts" : null;
      if (fiveMajor) {
        return {
          bid: `3${suitSymbol(fiveMajor)}`,
          category: "Stayman over 2NT: Show 5-Card Major (Forcing)",
          reasoning: `Partner denied a 4-card major (3♦). With 5 ${fiveMajor}, bid 3${suitSymbol(fiveMajor)} — natural and forcing. Partner chooses 4${suitSymbol(fiveMajor)} with 3-card support or 3NT without.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: `5-card ${fiveMajor}, game-going. Pick 4${suitSymbol(fiveMajor)} or 3NT.`,
          expectedResponses: [
            {
              partnerBid: `4${suitSymbol(fiveMajor)}`,
              meaning: "3+ card support",
            },
            { partnerBid: "3NT", meaning: "Only a doubleton — NT game" },
          ],
          confidence: "high",
        };
      }
      if (hcp >= 13) {
        return {
          bid: "6NT",
          category: "Stayman over 2NT: 6NT (33+ Combined)",
          reasoning: `Partner denied a major. With ${hcp} HCP opposite 20-21, the combined count is ${hcp + 20}+ — at the 33-point slam threshold. Bid 6NT.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: "13+ HCP — small slam on power.",
          expectedResponses: [{ partnerBid: "Pass", meaning: "To play" }],
          confidence: "medium",
        };
      }
      if (hcp >= 11) {
        return {
          bid: "4NT",
          category: "Stayman over 2NT: Quantitative 4NT",
          reasoning: `Partner denied a major. With ${hcp} HCP opposite 20-21 the combined count is ${hcp + 20}-${hcp + 21} — invite slam quantitatively with 4NT (NOT Blackwood here).`,
          handAnalysis: analysis,
          whatYourBidTellsPartner:
            "11-12 HCP — slam invite; pass with 20, bid 6NT with 21.",
          expectedResponses: [
            { partnerBid: "Pass", meaning: "Minimum (20)" },
            { partnerBid: "6NT", meaning: "Maximum (21)" },
          ],
          confidence: "medium",
        };
      }
      return {
        bid: "3NT",
        category: "Stayman over 2NT: 3NT (No Major Fit)",
        reasoning: `Partner denied a 4-card major (3♦). With ${hcp} HCP opposite 20-21, sign off in the NT game — 3NT.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: "No major fit — playing 3NT.",
        expectedResponses: [{ partnerBid: "Pass", meaning: "To play" }],
        confidence: "high",
      };
    }
    // Partner showed a major with 3♥/3♠.
    const shownMajor2 = partnerReply.includes("♥") ? "hearts" : "spades";
    const fit2 = hand[shownMajor2 as keyof Hand] as number;
    if (fit2 >= 4) {
      const supportPts2 = calcTPWithFit(hand);
      if (supportPts2 >= 13) {
        return {
          bid: `6${suitSymbol(shownMajor2)}`,
          category: "Stayman over 2NT: Small Slam in the Major",
          reasoning: `Partner showed 4 ${shownMajor2} and you hold ${fit2} — an 8-card fit. With ${supportPts2} support points opposite 20-21, the combined count reaches the 33-point slam zone: bid 6${suitSymbol(shownMajor2)}. (With specific ace concerns, go through 4NT Blackwood instead.)`,
          handAnalysis: analysis,
          whatYourBidTellsPartner:
            "4-4 major fit and 13+ support points — slam values.",
          expectedResponses: [{ partnerBid: "Pass", meaning: "To play" }],
          confidence: "medium",
        };
      }
      return {
        bid: `4${suitSymbol(shownMajor2)}`,
        category: "Stayman over 2NT: Major Game",
        reasoning: `Partner showed 4 ${shownMajor2} and you hold ${fit2} — an 8-card fit. Opposite 20-21 any values make game: bid 4${suitSymbol(shownMajor2)}.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: "4-4 major fit — game.",
        expectedResponses: [{ partnerBid: "Pass", meaning: "To play" }],
        confidence: "high",
      };
    }
    return {
      bid: "3NT",
      category: "Stayman over 2NT: No Fit — 3NT",
      reasoning: `Partner showed 4 ${shownMajor2} but you have only ${fit2}. Sign off in 3NT — partner may still correct with extra shape.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `No ${shownMajor2} fit — playing 3NT.${hand[shownMajor2 === "hearts" ? "spades" : "hearts"] >= 4 ? " (Going through Stayman implies 4 cards in the other major.)" : ""}`,
      expectedResponses: [{ partnerBid: "Pass", meaning: "To play" }],
      confidence: "high",
    };
  }

  // ── Partner's continuation after responder showed a suit ────────────────────
  // e.g. 1NT–2♣–2♦–2♠–2NT: partner showed no fit (2♦) and declined with 2NT.
  // `partnerReply` = "2♦" (original Stayman reply, preserved correctly).
  // `partnerContinuation` = "2NT" (partner's second bid).
  if (partnerContinuation === "2NT") {
    // Partner said: minimum opener, no fit in the major responder showed.
    // Responder's options:
    //   Pass  — accept the 2NT partial (correct with minimum invitational, 8 HCP)
    //   3NT   — push to game (only worth it at top of invitational range, 9 HCP)
    const pushToGame = hcp >= 9;
    return {
      bid: pushToGame ? "3NT" : "Pass",
      category: pushToGame
        ? "Push to 3NT Over Partner's 2NT"
        : "Pass — Accept Partner's 2NT (Invitation Declined)",
      reasoning: pushToGame
        ? `You showed a 5-card ${partnerReply.includes("♥") ? "heart" : "spade"} suit and invited game. Partner declined with 2NT (minimum opener, no fit). With ${hcp} HCP at the top of your invitational range, you have enough to push to 3NT — the combined 15+9 = 24 HCP is borderline but reasonable.`
        : `You showed a 5-card ${partnerReply.includes("♥") ? "heart" : "spade"} suit and invited game. Partner declined with 2NT, showing a minimum opener (15 HCP) with no fit. With ${hcp} HCP at the bottom of your invitational range, respect partner's decline and Pass — 2NT is the right final contract.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: pushToGame
        ? "Maximum invitational values — pushing to game."
        : "Accepting your sign-off in 2NT.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  if (partnerReply === "2♦" || partnerReply === "3♦") {
    // No major found
    if (hand.hearts >= 5 || hand.spades >= 5) {
      // Had 5-4 majors, now bid the 5-card major.
      // Level depends on strength (per SAYC/bridgebum.com):
      //   2-level = invitational (~8-9 HCP) — opener may pass
      //   3-level = game-forcing (~10+ HCP) — opener must bid 4M or 3NT
      const suit = hand.spades >= 5 ? "spades" : "hearts";
      const sym = suitSymbol(suit);
      const isGameForce = hcp >= 10;
      const bid = isGameForce ? `3${sym}` : `2${sym}`;
      return {
        bid,
        category: isGameForce
          ? "Stayman 2♦ Reply: Bid 5-card Major (Game-Forcing)"
          : "Stayman 2♦ Reply: Bid 5-card Major (Invitational)",
        reasoning: isGameForce
          ? `Partner denied a 4-card major (2♦). With ${hcp} HCP and a 5-card ${suit} suit, bid ${bid} — game-forcing. Partner must bid 4${sym} with 3+ card support or 3NT with only a doubleton.`
          : `Partner denied a 4-card major (2♦). With ${hcp} HCP and a 5-card ${suit} suit, bid ${bid} — invitational, not game-forcing. This shows your 5-card suit and invites partner to bid 4${sym} with a maximum (16-17 HCP) or pass with a minimum (15 HCP).`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: isGameForce
          ? `5-card ${suit} suit — game-forcing. Bid 4${sym} with 3-card support or 3NT with only 2.`
          : `5-card ${suit} suit — invitational. Bid 4${sym} with a maximum (16-17 HCP) and 3-card support, or pass with a minimum.`,
        expectedResponses: isGameForce
          ? [
              {
                partnerBid: `4${sym}`,
                meaning: "3+ card support — accepts major",
              },
              {
                partnerBid: "3NT",
                meaning: "Only 2-card support — prefers NT",
              },
            ]
          : [
              {
                partnerBid: `4${sym}`,
                meaning:
                  "Maximum (16-17 HCP) with 3+ card support — accepts game",
              },
              {
                partnerBid: "Pass",
                meaning: "Minimum (15 HCP) — declines invitation",
              },
              {
                partnerBid: "3NT",
                meaning: "Maximum but only 2-card support — game in NT",
              },
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
    // A major fit is found — judge game vs invitation by SHORT-suit support
    // points (ruffing values count once a trump fit exists), not raw HCP.
    const supportPts = calcTPWithFit(hand);
    return {
      bid:
        supportPts >= 10
          ? `4${suitSymbol(partnerMajor)}`
          : `3${suitSymbol(partnerMajor)}`,
      category: "Major Fit Found After Stayman",
      reasoning: `Partner showed 4+ ${partnerMajor} and you have ${myFit} card support (${supportPts} support points). ${supportPts >= 10 ? "Bid game (4♥/4♠)" : "Bid 3 of major (invitational)"}.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `4-4 major fit — ${supportPts >= 10 ? "game" : "invitational"}.`,
      expectedResponses: [],
      confidence: "high",
    };
  }

  // No fit in shown major — check if we hold the OTHER major
  const otherMajor = partnerMajor === "hearts" ? "spades" : "hearts";
  const myOtherMajor = hand[otherMajor as keyof Hand] as number;

  if (myOtherMajor >= 4) {
    // Classic Stayman inference: bidding NT here IMPLIES 4 cards in the other
    // major.  A CORRECTION is only possible when partner showed HEARTS first
    // (they may also hold 4 spades) — a 2♠ answer explicitly DENIED 4 hearts,
    // so no fit can exist in either major after it.
    const correctionPossible = otherMajor === "spades";
    return {
      bid: hcp >= 10 ? "3NT" : "2NT",
      category: `Stayman — No Fit in ${partnerMajor === "hearts" ? "♥" : "♠"}, 4 ${otherMajor === "spades" ? "♠" : "♥"} Implied`,
      reasoning:
        hcp >= 10
          ? `Partner showed 4 ${partnerMajor} (2${suitSymbol(partnerMajor)}), but you have no fit there. You do hold 4 ${otherMajor}. Bid 3NT — by going through Stayman then jumping to 3NT, you IMPLY 4 ${otherMajor}. ${correctionPossible ? "Opener will correct to 4♠ if they also hold 4 spades (possible in SAYC where opener bids the lower major first); if they pass 3NT, they don't have them." : "Opener's 2♠ answer already DENIED 4 hearts, so no major fit exists — 3NT will end the auction; the sequence has honestly described your hand."}`
          : `Partner showed 4 ${partnerMajor} (2${suitSymbol(partnerMajor)}), but you have no fit there. You do hold 4 ${otherMajor}. With 8-9 pts, bid 2NT (invitational). This IMPLIES 4 ${otherMajor}. ${correctionPossible ? "Opener with 4 spades + a maximum will bid 3♠ or 4♠." : "Opener's 2♠ answer already denied 4 hearts, so opener will simply pass or raise NT on strength."}`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `Values for my NT bid, no fit in your ${partnerMajor} — but I hold 4 ${otherMajor}.${otherMajor === "spades" ? " You may correct to 3♠/4♠." : ""}`,
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
      note:
        otherMajor === "spades"
          ? "Do NOT bid 4♠ directly — use 2NT (invitational) or 3NT (game-forcing) to imply the 4-card spade suit. Opener decides if a spade fit exists."
          : undefined,
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
  /** True when the transfer was over a 2NT opening (20-21): completion is at
   *  the 3-level and game needs only ~4-5 HCP. */
  over2NT = false,
  /** True when partner's 2NT was the REBID after a strong 2♣ (22-24) — the
   *  game floor drops another ~2 points. */
  after2C = false,
): BidRecommendation {
  const analysis = analyzeHand(hand);
  const { hcp } = hand;
  const ntRange2 = after2C ? "22-24 (2♣ then 2NT)" : "20-21";
  const gameFloor2NT = after2C ? 2 : 4;
  const suit = transferredSuit.includes("♥") ? "hearts" : "spades";
  const suitLen = hand[suit as keyof Hand] as number;
  const otherMajor = suit === "hearts" ? "spades" : "hearts";
  const otherMajorLen = hand[otherMajor as keyof Hand] as number;

  if (over2NT) {
    // ── Transfer over 2NT (opener 20-21) ────────────────────────────────────
    if (hcp >= (after2C ? 11 : 13) && suitLen >= 6) {
      return {
        bid: `6${suitSymbol(suit)}`,
        category: "Transfer over 2NT: Small Slam",
        reasoning: `With ${hcp} HCP and a 6+ card ${suit} suit opposite ${ntRange2}, the combined values reach the 33-point slam zone with a known 8+ card fit. Bid 6${suitSymbol(suit)}. (Use 4NT Blackwood first if you need to check aces.)`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: "Slam values with a long major.",
        expectedResponses: [{ partnerBid: "Pass", meaning: "To play" }],
        confidence: "medium",
      };
    }
    if (hcp >= gameFloor2NT) {
      const gameChoice = suitLen >= 6 ? `4${suitSymbol(suit)}` : "3NT";
      return {
        bid: gameChoice,
        category:
          suitLen >= 6
            ? "Transfer over 2NT: Major Game"
            : "Transfer over 2NT: 3NT (Partner Chooses)",
        reasoning:
          suitLen >= 6
            ? `Opposite a ${ntRange2} 2NT, even ${hcp} HCP is enough for game with a 6-card ${suit} suit — bid 4${suitSymbol(suit)}.`
            : `Opposite a ${ntRange2} 2NT, ${hcp} HCP is enough for game. With exactly 5 ${suit}, bid 3NT — partner corrects to 4${suitSymbol(suit)} with 3-card support.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          suitLen >= 6
            ? `6+ ${suit} — game in the major.`
            : `Exactly 5 ${suit}, game values — choose 3NT or 4${suitSymbol(suit)}.`,
        expectedResponses:
          suitLen >= 6
            ? [{ partnerBid: "Pass", meaning: "To play" }]
            : [
                { partnerBid: "Pass", meaning: "Doubleton — 3NT" },
                {
                  partnerBid: `4${suitSymbol(suit)}`,
                  meaning: "3+ card support",
                },
              ],
        confidence: "high",
      };
    }
    return {
      bid: "Pass",
      category: "Transfer over 2NT: Pass (Very Weak)",
      reasoning: `With ${hcp} HCP even partner's ${ntRange2} cannot make game a favorite. Pass and play 3${suitSymbol(suit)}.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "0-3 pts — the transfer was an escape.",
      expectedResponses: [],
      confidence: "medium",
    };
  }

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
          "Blackwood king ask — your side has all the aces and partner is exploring a grand slam",
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
 * Respond: 6♣=0 or 4 kings, 6♦=1 king, 6♥=2 kings, 6♠=3 kings.
 * Uses hand.kings if provided; otherwise falls back to HCP estimate.
 */
function getBlackwoodKingsResponse(hand: Hand): BidRecommendation {
  const analysis = analyzeHand(hand);
  const { hcp } = hand;

  const kingsBidChart =
    "6♣ = 0 or 4 kings  |  6♦ = 1 king  |  6♥ = 2 kings  |  6♠ = 3 kings";

  const usingActual = hand.kings !== undefined;
  const kingCount = usingActual
    ? (hand.kings as number)
    : Math.min(4, Math.max(0, Math.round(hcp / 8)));

  const kingsResponseBid =
    kingCount === 0 || kingCount === 4
      ? "6♣" // 0 and 4 share 6♣ (like Blackwood's 5♣)
      : kingCount === 1
        ? "6♦"
        : kingCount === 2
          ? "6♥"
          : "6♠"; // 3 kings

  const kingsLabel =
    kingsResponseBid === "6♣"
      ? "0 (or 4) kings"
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
    // Partner's answer may already BE the signoff spot — pass, never re-bid it.
    if (BID_ORDER.indexOf(signOff) <= BID_ORDER.indexOf(partnerReply)) {
      return {
        bid: "Pass",
        category: "Blackwood Warning: Void Present — Pass the Signoff Spot",
        reasoning: `You have a void, which makes Blackwood unreliable — and partner's ${partnerReply} answer conveniently already stands at your safe signoff spot. Pass and play it.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: "Signing off — suit game is the contract.",
        expectedResponses: [],
        confidence: "medium",
        note: "Tip: With a void, use cue bids to show first-round control instead of Blackwood.",
      };
    }
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
    if (BID_ORDER.indexOf(defaultSignOff) <= BID_ORDER.indexOf(partnerReply)) {
      return {
        bid: "Pass",
        category: "Blackwood: Unrecognized Response — Pass",
        reasoning: `Partner's bid (${partnerReply}) was not a standard Blackwood response, and the safe signoff spot is already behind us. Pass.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: "Sign off — cannot determine ace count.",
        expectedResponses: [],
        confidence: "low",
      };
    }
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
    : suitSymbol(longestSuitInfo(hand).name);

  const kingsChart =
    "6♣ = 0 or 4 kings  |  6♦ = 1 king  |  6♥ = 2 kings  |  6♠ = 3 kings";

  // ── Ace-aware decision (the app asks for your ace count during Blackwood) ──
  // With your own ace count known, the 0/4 ambiguity resolves and the right
  // action is forced: missing 2+ aces → sign off at 5; missing 1 → small slam;
  // missing 0 → 5NT king-ask toward a grand slam.
  if (hand.aces !== undefined) {
    // 5♣ shows 0 OR 4: if you hold any ace, partner cannot hold 4.  With 0
    // aces yourself, read it conservatively as 0 (a 4-ace partner would drive
    // the auction themselves).
    const partnerAces = aceCount === 0 ? (hand.aces > 0 ? 0 : 0) : aceCount;
    const missing = 4 - Math.min(4, hand.aces + partnerAces);
    if (missing >= 2) {
      return {
        bid: `5${suitSym}`,
        category: `Blackwood: Sign Off at 5${suitSym} (Missing ${missing} Aces)`,
        reasoning: `Partner's ${partnerReply} shows ${partnerAces} ace${partnerAces === 1 ? "" : "s"}; with your ${hand.aces}, the partnership is missing ${missing} aces. Slam would lose two cashing tricks — sign off at 5${suitSym}.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `Too many aces missing for slam — stopping at 5${suitSym}.`,
        expectedResponses: [
          { partnerBid: "Pass", meaning: "Accepting the sign-off" },
        ],
        confidence: "high",
        note:
          aceCount === 0 && hand.aces === 0
            ? "5♣ technically shows 0 OR 4 aces. With 0 yourself it is read as 0 — a 4-ace partner would keep bidding."
            : undefined,
      };
    }
    if (missing === 1) {
      return {
        bid: `6${suitSym}`,
        category: "Blackwood: Small Slam (Missing 1 Ace)",
        reasoning: `Partner's ${partnerReply} shows ${partnerAces} ace${partnerAces === 1 ? "" : "s"}; with your ${hand.aces}, the partnership holds 3 of 4 aces. Bid the small slam — 6${suitSym} — but a grand is off (one ace is missing).`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `Exactly one ace missing — small slam in ${suitSym}, no grand.`,
        expectedResponses: [{ partnerBid: "Pass", meaning: "Accepting 6" }],
        confidence: "high",
      };
    }
    return {
      bid: "5NT",
      category: "Blackwood: All 4 Aces — King Ask (5NT)",
      reasoning: `Partner's ${partnerReply} plus your ${hand.aces} aces = all 4 aces. Bid 5NT to ask for kings and judge whether a GRAND slam is on. ${kingsChart}`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "All four aces held — asking for kings, grand slam interest.",
      expectedResponses: [
        { partnerBid: "6♣", meaning: "0 or 4 kings" },
        { partnerBid: "6♦", meaning: "1 king" },
        { partnerBid: "6♥", meaning: "2 kings" },
        { partnerBid: "6♠", meaning: "3 kings" },
      ],
      confidence: "high",
    };
  }

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
    bid: analysis.tp >= 35 ? "5♣" : "6NT",
    category:
      analysis.tp >= 35 ? "Gerber: 3+ Aces — 5♣ King Ask" : "Gerber: 3+ Aces",
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
  myPreviousBid?: string,
  partnerAceResponse?: string,
): BidRecommendation {
  const analysis = analyzeHand(hand);

  // ── Detect sign-off: I gave the kings response, now partner signs off in the suit ──
  // Scenario: I bid 5NT (kings ask) → partner bid 6♦ (1 king) → I bid... wait, that's
  // the ASKER not the responder.
  // Correct scenario here: partner bid 5NT → I responded kings (e.g. 6♦) → partner
  // now signs off in the agreed suit (e.g. 6♠). myPreviousBid = "6♦" (my kings response).
  // We know we're in sign-off mode when myPreviousBid is itself a kings response bid.
  const blackwoodKingsResponseBids = ["6♣", "6♦", "6♥", "6♠"];
  const iAlreadyGaveKingsResponse =
    myPreviousBid && blackwoodKingsResponseBids.includes(myPreviousBid);
  if (iAlreadyGaveKingsResponse && /^[67][♠♥♦♣]$/.test(partnerReply)) {
    const level = partnerReply[0]; // "6" or "7"
    return {
      bid: "Pass",
      category: `Accept Partner's ${partnerReply} Sign-Off`,
      reasoning: `Partner has signed off in ${partnerReply}, completing the Blackwood auction. You showed your kings (${myPreviousBid}), partner evaluated the combined holdings and decided ${level === "7" ? "a grand slam" : "a small slam"} is the right contract. Pass and play ${partnerReply}.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Accepting the slam contract.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  const kingCount = decodeKingCount(partnerReply, wasGerber);

  // Fall back to the hand's longest suit (NOT a blanket "spades") when no
  // agreed suit could be determined.
  const fallbackSuit = suitSymbol(longestSuitInfo(hand).name);
  const suitSym = agreedSuit
    ? agreedSuit.includes("♠")
      ? "♠"
      : agreedSuit.includes("♥")
        ? "♥"
        : agreedSuit.includes("♦")
          ? "♦"
          : "♣"
    : fallbackSuit;

  // Aces missing?  A grand slam must NEVER be bid with an ace outstanding.
  // Partner's earlier ace response plus your own count (if entered) decide.
  const partnerAces = partnerAceResponse
    ? decodeAceCount(partnerAceResponse, wasGerber)
    : null;
  const acesKnown = partnerAces !== null && hand.aces !== undefined;
  const missingAces = acesKnown
    ? 4 - Math.min(4, (hand.aces ?? 0) + (partnerAces ?? 0))
    : undefined;

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

  // Factor in your own kings if you entered them
  const myKings = hand.kings ?? 0;
  const totalKings = kingCount + myKings;
  const kingsNote =
    myKings > 0
      ? ` You hold ${myKings} king${myKings !== 1 ? "s" : ""}, partner has ${kingCount === 0 ? "0 or 4" : kingCount} — total: ${totalKings}.`
      : ` Partner has ${kingCount === 0 ? "0 or 4" : kingCount} king${kingCount !== 1 ? "s" : ""}.`;

  if (totalKings >= 3 && missingAces !== undefined && missingAces > 0) {
    return {
      bid: `6${suitSym}`,
      category: "Small Slam (Ace Missing — No Grand)",
      reasoning: `Kings are plentiful (${totalKings} accounted for), but the partnership is missing ${missingAces} ace${missingAces === 1 ? "" : "s"} — a grand slam would lose a cashing ace. Settle for the small slam, 6${suitSym}.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `Stopping in 6${suitSym} — an ace is missing, so no grand.`,
      expectedResponses: [{ partnerBid: "Pass", meaning: "Accepting 6" }],
      confidence: "high",
    };
  }

  // A grand slam needs EVERY key card: all four aces (checked above) AND all
  // four kings.  With 3 kings one is outstanding — it may be the trump king
  // or cash on the opening lead, so settle for the small slam.
  if (totalKings >= 4) {
    return {
      bid: `7${suitSym}`,
      category: "Grand Slam!",
      reasoning: `${kingsNote} With all four aces and all four kings accounted for between you and partner, every key card is covered — bid the grand slam (7${suitSym})!`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Grand slam — all key cards accounted for.",
      expectedResponses: [],
      confidence: "high",
    };
  }
  if (totalKings === 3) {
    return {
      bid: `6${suitSym}`,
      category: "Small Slam (A King Is Missing — No Grand)",
      reasoning: `${kingsNote} One king is still outstanding — it could be the trump king or cash against a grand slam. Sign off in the small slam, 6${suitSym}.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `Stopping in 6${suitSym} — a king is missing, so no grand.`,
      expectedResponses: [{ partnerBid: "Pass", meaning: "Accepting 6" }],
      confidence: "high",
    };
  }

  // 6♣ = 0 or 4 kings (same ambiguity as 5♣ for aces)
  const ambiguityNote =
    kingCount === 0 && myKings === 0
      ? " Note: 6♣ = 0 OR 4 kings from partner. If you hold any kings yourself, enter them in the hand input to get a more accurate recommendation."
      : undefined;

  return {
    bid: `6${suitSym}`,
    category: `Small Slam (${totalKings} King${totalKings !== 1 ? "s" : ""} Total — Grand Slam Not Warranted)`,
    reasoning: `${kingsNote} With only ${totalKings} king${totalKings !== 1 ? "s" : ""} total, a grand slam is not warranted — settle for the small slam (6${suitSym}).`,
    handAnalysis: analysis,
    whatYourBidTellsPartner: "Small slam — grand slam not warranted.",
    expectedResponses: [],
    confidence: hand.kings !== undefined ? "high" : "medium",
    note: ambiguityNote,
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
      return getResponseToOneNT(hand, context.rhoBid);

    case "responding-2nt":
      return getResponseToTwoNT(hand, context.after2COpening ?? false);

    case "responding-3nt-opening":
      return getResponseTo3NTOpening(hand);

    case "responding-suit":
      return getResponseToSuit(hand, context.partnerBid ?? "1♠");

    case "responding-2c":
      return getResponseToTwoClub(hand);

    case "responding-weak2": {
      const w2Interference = [context.lhoBid, context.rhoBid]
        .filter((b): b is string => isRealBid(b))
        .sort((a, b) => BID_ORDER.indexOf(b) - BID_ORDER.indexOf(a))[0];
      return getResponseToWeak2(
        hand,
        context.partnerBid ?? "2♥",
        isRealBid(context.rhoBid) || isRealBid(context.lhoBid),
        w2Interference,
      );
    }

    case "responding-preempt":
      return getResponseToPreempt(hand, context.partnerBid ?? "3♥");

    case "overcalling":
      return getOvercall(
        hand,
        context.rhoBid ?? "1♠",
        vul,
        context.lhoBid,
        context.partnerBid,
        context.balancing,
        context.auctionOpeningBid,
      );

    case "negative-double":
      return getNegativeDouble(
        hand,
        context.myPreviousBid ?? "1♣",
        context.rhoBid ?? "1♠",
        vul,
      );

    case "responding-to-simple-oc":
      return getResponseToSimpleOC(
        hand,
        context.partnerBid ?? "1♠",
        // The opener's suit lives in rhoBid when RHO acted last, otherwise in
        // lhoBid (e.g. LHO opened and RHO passed) — never default to clubs.
        context.rhoBid ?? context.lhoBid,
        context.auctionOpeningBid,
      );

    case "responding-to-jump-oc":
      return getResponseToJumpOC(hand, context.partnerBid ?? "2♠");

    case "responding-to-double": {
      // The floor an advance must clear is the opponents' HIGHEST bid — the
      // doubled bid may be LHO's (e.g. their raise), not RHO's older call.
      const rtdFloor = [context.lhoBid, context.rhoBid]
        .filter((b): b is string => isRealBid(b))
        .sort((a, b) => BID_ORDER.indexOf(b) - BID_ORDER.indexOf(a))[0];
      return getResponseToDouble(
        hand,
        rtdFloor ?? context.rhoBid ?? "1♠",
        context.partnerFirstBid,
        [context.lhoBid, context.rhoBid].filter((b): b is string =>
          isRealBid(b),
        ),
      );
    }

    case "responding-to-preempt-oc": {
      const preemptOCInterference = [context.lhoBid, context.rhoBid]
        .filter((b): b is string => isRealBid(b))
        .sort((a, b) => BID_ORDER.indexOf(b) - BID_ORDER.indexOf(a))[0];
      return getResponseToPreemptOC(
        hand,
        context.partnerBid ?? "3♠",
        preemptOCInterference,
      );
    }

    case "responding-to-1nt-oc":
      return getResponseTo1NTOvercall(
        hand,
        context.balancing ?? false,
        // Interference AFTER partner's 1NT turns systems off; suit escapes
        // must clear it (computed order-correctly in the derivation).
        context.interferenceOverPartnerNT,
      );

    case "responding-to-michaels":
      return getResponseToMichaels(
        hand,
        context.lhoBid ?? context.rhoBid ?? "1♣",
        context.partnerBid ?? "2♣",
      );

    case "responding-to-unusual-2nt":
      return getResponseToUnusual2NT(hand);

    case "rebid-after-nt": {
      const ntInterference = [context.lhoBid, context.rhoBid]
        .filter((b): b is string => isRealBid(b))
        .sort((a, b) => BID_ORDER.indexOf(b) - BID_ORDER.indexOf(a))[0];
      return getRebidAfterNT(
        hand,
        context.partnerBid ?? "Pass",
        // Systems (Stayman/transfers) are OFF only when an opponent made a
        // real bid BEFORE partner's response (timing computed in derivation).
        context.systemsOff ?? false,
        // My NT bid: the latest of my bids that IS notrump — a 2♣ opener's
        // 2NT rebid must read as "2NT", not as the artificial 2♣.
        [context.myPreviousBid, context.myFirstBid].find((b) =>
          b?.endsWith("NT"),
        ) ?? context.myFirstBid,
        ntInterference,
      );
    }

    case "responder-nt-rebid":
      return getResponderNTRebid(
        hand,
        context.myPreviousBid ?? "2NT",
        context.partnerBid ?? "Pass",
        context.partnerFirstBid,
        context.myFirstBid,
        context.lhoBid,
        context.rhoBid,
      );

    case "rebid-after-suit": {
      // The binding interference floor is the opponents' HIGHEST bid (so a
      // rebid clears it).  Passed through so level math isn't blind to it.
      const oppBids = [context.lhoBid, context.rhoBid].filter(
        (b): b is string => isRealBid(b),
      );
      const interferenceBid =
        oppBids.length > 0
          ? oppBids.sort(
              (a, b) => BID_ORDER.indexOf(b) - BID_ORDER.indexOf(a),
            )[0]
          : undefined;
      return getRebidAfterSuit(
        hand,
        // Use the ORIGINAL opening bid here, not the latest rebid: handlers
        // like the weak-2 2NT inquiry must compare against what I OPENED with,
        // not what I rebid afterwards.
        context.myFirstBid ?? context.myPreviousBid ?? "1♠",
        context.partnerBid ?? "2♠",
        !!(context.lhoBid || context.rhoBid),
        interferenceBid,
        context.partnerFirstBid,
        context.partnerHasNothingNew ?? false,
        context.partnerCuedTheirSuit ?? false,
        context.myPreviousBid,
        [context.lhoBid, context.rhoBid].some(
          (b) => !!b && isRealBid(b) && b.endsWith("NT"),
        ),
        context.partnerDoubledEarlier ?? false,
      );
    }

    case "auction-passed-out":
      if (context.myBidWasDoubled) {
        return {
          bid: "Pass",
          category: "Pass — Play It Doubled",
          reasoning: `The opponents have DOUBLED your ${context.myPreviousBid}. Your bid already described this hand, and partner has heard the double too — pass. Redoubling or running is for extreme hands only (a redouble invites a bigger penalty; running admits the bid was a mistake).`,
          handAnalysis: analyzeHand(hand),
          whatYourBidTellsPartner:
            "Standing my ground — content to play it doubled.",
          expectedResponses: [
            {
              partnerBid: "Pass",
              meaning: "Accepting — or pulling with a surprise",
            },
          ],
          confidence: "high",
        };
      }
      return {
        bid: "Pass",
        category: "Pass (Auction Complete)",
        reasoning: `Your ${context.myPreviousBid} was passed out — the other three players all passed. The auction is over; pass and proceed to play in ${context.myPreviousBid}.`,
        handAnalysis: analyzeHand(hand),
        whatYourBidTellsPartner: "Auction is over — no further action needed.",
        expectedResponses: [],
        confidence: "high",
      };

    case "protective-rebid":
      return getProtectiveRebid(
        hand,
        context.myFirstBid ?? context.myPreviousBid ?? "1♣",
        context.lhoBid,
        context.rhoBid,
        context.balancing,
        context.iOvercalled ?? false,
      );

    case "advancer-rebid":
      return getAdvancerRebid(
        hand,
        context.partnerFirstBid,
        context.partnerBid,
        context.auctionOpeningBid,
        context.myPreviousBid,
      );

    case "overcaller-rebid":
      return getOvercallerRebid(hand, context);

    case "responder-rebid":
      return getResponderRebid(hand, context);

    case "respond-to-partner-invitation":
      return getRespondToPartnerInvitation(
        hand,
        context.myPreviousBid ?? "1♠",
        context.partnerBid ?? "Pass",
        context.partnerWasOvercaller ?? false,
        context.partnerOpened ?? false,
      );

    case "rebid-after-negative-double": {
      const ndFloor = [context.lhoBid, context.rhoBid]
        .filter((b): b is string => isRealBid(b))
        .sort((a, b) => BID_ORDER.indexOf(b) - BID_ORDER.indexOf(a))[0];
      return getRebidAfterNegativeDouble(
        hand,
        context.myFirstBid ?? context.myPreviousBid ?? "1♣",
        // The bid partner DOUBLED (negative-vs-penalty judgment)…
        context.doubledBid ?? context.rhoBid ?? "1♠",
        // …and the opponents' current highest bid (level math floor).
        ndFloor,
        context.myPreviousBid,
        context.partnerBid,
      );
    }

    case "jacoby-2nt-opener":
      return getJacoby2NTOpenerRebid(
        hand,
        context.myFirstBid ?? context.myPreviousBid ?? "1♠",
      );

    case "responding-suit-after-double":
      return getRespondingToSuitAfterDouble(hand, context.partnerBid ?? "1♠");

    case "responding-1nt-doubled":
      return getResponseTo1NTDoubled(hand);

    case "after-own-double": {
      // The pressure point is the HIGHER of the two opponents' bids — the
      // advice refers to where the opponents now stand, not merely to RHO's
      // earlier overcall.
      const oppHighAOD = [context.rhoBid, context.lhoBid]
        .filter((b): b is string => isRealBid(b))
        .sort((a, b) => BID_ORDER.indexOf(b) - BID_ORDER.indexOf(a))[0];
      return getAfterOwnDouble(
        hand,
        context.partnerBid,
        oppHighAOD ?? context.rhoBid,
        context.partnerOpened ?? false,
        context.partnerFirstBid,
        context.doubleWasLeadDirecting ?? false,
        context.doubledBid,
      );
    }

    case "stayman-response":
      return getStaymanFollowUp(
        hand,
        context.partnerBid ?? "2♦",
        context.partnerContinuation,
        context.partnerFirstBid === "2NT",
      );

    case "stayman-opener-rebid":
      return getStaymanOpenerRebid(
        hand,
        context.myPreviousBid ?? "2♦",
        context.partnerBid ?? "2NT",
        context.wasTransferCompletion ?? false,
        context.partnerHasNothingNew ?? false,
      );

    case "transfer-response":
      return getTransferFollowUp(
        hand,
        context.partnerBid ?? "2♥",
        context.partnerFirstBid === "2NT",
        context.after2COpening ?? false,
      );

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
        context.myPreviousBid,
        context.partnerAceResponse,
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

/**
 * Returns a clean Pass recommendation whose text does not reference any
 * abandoned/withdrawn earlier suggestion.  Use whenever the safety net needs
 * to fall back to Pass — never spread a stale recommendation into the result.
 */
function cleanPass(
  hand: Hand,
  reasoning: string,
  category = "Pass",
): BidRecommendation {
  return {
    bid: "Pass",
    category,
    reasoning,
    handAnalysis: analyzeHand(hand),
    whatYourBidTellsPartner: "Pass — no action this round.",
    expectedResponses: [],
    confidence: "low",
  };
}

/**
 * Try to escalate a balanced-NT recommendation to the cheapest legal NT bid
 * above the current auction floor when the original recommendation is no
 * longer available.  Returns undefined if no sensible escalation is possible
 * (e.g. recommendation wasn't NT-based, or the cheapest legal NT would be
 * absurd given the hand).
 */
function tryEscalateNT(
  rec: BidRecommendation,
  hand: Hand,
  floorIdx: number,
): BidRecommendation | undefined {
  // Only escalate if the original concrete bid was a NT bid (1NT/2NT/3NT).
  const originalBids = extractAllConcreteBids(rec.bid);
  const wasNT = originalBids.some((b) => b.endsWith("NT"));
  if (!wasNT) return undefined;

  // Find cheapest legal NT bid above the floor.
  const legalNT = BID_ORDER.find(
    (b, i) => i > floorIdx && b.endsWith("NT") && b !== "4NT" && b !== "5NT",
  );
  if (!legalNT) return undefined;

  // Don't escalate beyond 3NT — past that, we'd be guessing at a slam bid.
  if (BID_ORDER.indexOf(legalNT) > BID_ORDER.indexOf("3NT")) return undefined;

  // Sanity check: do we have enough HCP to support the new level?  Each NT
  // step roughly needs +5-6 HCP.  Be conservative: a minimum hand that wanted
  // to bid 1NT should NOT be pushed to 2NT (partner will read it as extra
  // strength) — those hands fall through to the clean Pass instead.
  const targetLevel = parseInt(legalNT[0]);
  const minHcpForLevel: Record<number, number> = { 1: 6, 2: 13, 3: 15 };
  if (hand.hcp < (minHcpForLevel[targetLevel] ?? 99)) return undefined;

  return {
    ...rec,
    bid: legalNT,
    reasoning: `${rec.reasoning} The auction has reached ${BID_ORDER[floorIdx]}, so the suggested low-level NT bid is no longer legal — bid ${legalNT} instead, the cheapest legal NT bid that still describes a balanced hand.`,
    whatYourBidTellsPartner: `${rec.whatYourBidTellsPartner} (Bid one level higher than normal only because the auction forced it — partner should not read extra strength into the raised level.)`,
    confidence: "medium" as const,
  };
}

export function getRecommendation(
  hand: Hand,
  context: AuctionContext,
): BidRecommendation {
  const rec = getRecommendationRaw(hand, context);

  // Safety net for Double/Redouble legality: you cannot double when the last
  // significant call was already a Double/Redouble (or when nothing has been
  // bid), and you can only redouble immediately over a Double.
  if (rec.bid === "Double") {
    const lc = context.lastCall;
    // (undefined = context built without auction history — cannot verify)
    if (lc === "Double" || lc === "Redouble") {
      return cleanPass(
        hand,
        "A double is not available here — the last significant call was already a double/redouble (or there is nothing to double). Pass instead; your values have either been shown or can be shown later.",
        "Pass (Double Not Available)",
      );
    }
  }
  if (
    rec.bid === "Redouble" &&
    context.lastCall !== undefined &&
    context.lastCall !== "Double"
  ) {
    return cleanPass(
      hand,
      "A redouble is only available directly over an opponent's double. Pass instead.",
      "Pass (Redouble Not Available)",
    );
  }

  // Safety net: ensure the recommended bid is legal in the current auction.
  // Only fires when EVERY concrete bid in the recommendation is at or below
  // the current bid floor — this preserves "2♥ or 3♥" style recommendations
  // where at least one alternative is still valid.
  const floor = getBidFloorFromContext(context);
  if (!floor) return rec;

  const floorIdx = BID_ORDER.indexOf(floor);
  const concreteBids = extractAllConcreteBids(rec.bid).filter(
    (b) => b !== "Pass" && b !== "Double" && b !== "Redouble",
  );
  if (concreteBids.length === 0) return rec; // Pass / Double / Redouble — already legal

  const tooLow = concreteBids.filter((b) => {
    const bidIdx = BID_ORDER.indexOf(b);
    return bidIdx >= 0 && bidIdx <= floorIdx;
  });
  const validBids = concreteBids.filter((b) => BID_ORDER.indexOf(b) > floorIdx);

  // Some options legal — use the lowest legal alternative (the most
  // conservative restatement of the original advice).
  if (tooLow.length > 0 && validBids.length > 0) {
    const bestBid = validBids[0];
    return {
      ...rec,
      bid: bestBid,
      reasoning: `${rec.reasoning} (The auction has progressed past the original bid; ${bestBid} is the cheapest legal alternative from the same recommendation.)`,
      confidence: "medium" as const,
    };
  }

  // All options too low — try a sensible NT escalation first.
  if (tooLow.length === concreteBids.length) {
    const escalated = tryEscalateNT(rec, hand, floorIdx);
    if (escalated) return escalated;

    // No safe escalation — fall back to a CLEAN Pass.  Critically, do NOT
    // spread the abandoned recommendation: its "tells partner" and
    // "expected responses" describe a bid we are not making.
    return cleanPass(
      hand,
      `The bid this hand wanted to make (${concreteBids.join("/")}) is no longer available — the auction has already reached ${floor}. Bidding on at this level would promise strength or shape you have not shown. With nothing clearly right to say, pass; partner can still act.`,
      "Pass (Intended Bid No Longer Available)",
    );
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
 * - Suit/NT bids must be strictly higher than the last *suit/NT* bid (Double and
 *   Redouble do not raise the floor — the floor is set by the most recent real bid).
 * - Double is valid after any suit/NT bid (not after Pass, Double, or Redouble).
 * - Redouble is valid only immediately after a Double.
 *
 * `lastSuitBid` is the most recent suit/NT bid (skipping Double/Redouble). Pass
 * this separately when the immediately preceding bid was Double or Redouble so
 * the suit floor is computed correctly.
 */
export function getValidBidsAfter(
  lastBid: string | undefined,
  lastSuitBid?: string,
): string[] {
  const result: string[] = ["Pass"];

  // Determine the floor for suit/NT bids — Double/Redouble don't raise it.
  // Use lastSuitBid if provided, otherwise fall back to lastBid if it's a suit/NT bid.
  const suitFloor =
    lastSuitBid ??
    (lastBid &&
    lastBid !== "Pass" &&
    lastBid !== "Double" &&
    lastBid !== "Redouble"
      ? lastBid
      : undefined);

  const floorIdx = suitFloor ? BID_ORDER.indexOf(suitFloor) : -1;
  const higherSuitBids =
    floorIdx >= 0 ? BID_ORDER.slice(floorIdx + 1) : BID_ORDER;

  if (!lastBid || lastBid === "Pass") {
    result.push(...BID_ORDER, "Double");
    return result;
  }
  if (lastBid === "Double") {
    result.push(...higherSuitBids, "Redouble");
    return result;
  }
  if (lastBid === "Redouble") {
    result.push(...higherSuitBids);
    return result;
  }
  // lastBid is a suit/NT bid
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
  /**
   * The bidder's OWN previous real bid in this auction, if any.  This is what
   * separates "2♠ weak-two OPENING" from "2♠ REBID of the spades they already
   * showed" — without it the static table mislabels every rebid.
   */
  bidderPreviousBid?: string,
  /**
   * The bidder's PARTNER's previous real bid, if any — lets the tooltip
   * recognize a RAISE (bidding the suit partner already showed) and decide
   * whether an NT bid in front of the bidder was partner's (conventions ON)
   * or the opponents' (natural defense).  Pass the string "none" when the
   * partner is KNOWN to have made no real bid; `undefined` means the caller
   * has no history and convention readings are assumed (legacy behavior).
   */
  bidderPartnerPreviousBid?: string,
  /**
   * The FIRST real bid of the whole auction.  Since bid values are unique in
   * an auction, comparing against this identifies openings exactly: the
   * hovered bid is an opening iff it EQUALS this value.
   */
  auctionOpeningBid?: string,
  /**
   * The bidder's PARTNER's FIRST real bid, when it differs from their latest —
   * lets the tooltip recognize a raise of partner's FIRST suit after partner
   * showed a second (e.g. 1♥-1♠-2♦-4♥: the 4♥ raises the 1♥, not "a new suit").
   */
  bidderPartnerFirstBid?: string,
  /**
   * True when the call IMMEDIATELY before this bid (skipping passes) was an
   * opponent's DOUBLE.  Over a doubled NT bid the systems are OFF: a suit
   * bid is a natural ESCAPE, never Stayman or a transfer.
   */
  oppDoubledJustBefore = false,
): string {
  const isPartner = relationship === "partner";
  const isOpponent = relationship === "lho" || relationship === "rho";

  // ── Escapes after a DOUBLE of partner's NT: systems are OFF ────────────────
  if (
    oppDoubledJustBefore &&
    prevHighBid?.endsWith("NT") &&
    bidderPartnerPreviousBid === prevHighBid &&
    /^[23][♠♥♦♣]$/.test(bid)
  ) {
    const escSuitName = bid.includes("♠")
      ? "spades"
      : bid.includes("♥")
        ? "hearts"
        : bid.includes("♦")
          ? "diamonds"
          : "clubs";
    return isPartner
      ? `${bid} after the opponents' DOUBLE of your ${prevHighBid}: a natural ESCAPE — Stayman and transfers are OFF once the NT bid is doubled. It shows a weak hand with a 5+ card ${escSuitName} suit, removing the double. Normally pass.`
      : `${bid} from opponent after the double of their partner's ${prevHighBid}: a natural escape (systems off) — weak with 5+ ${escSuitName}.`;
  }

  // ── Blackwood / kings responses (recognizable from the previous high bid) ──
  if (prevHighBid === "4NT" && /^5[♣♦♥♠]$/.test(bid)) {
    const aceMap: Record<string, string> = {
      "5♣": "0 or 4 aces",
      "5♦": "1 ace",
      "5♥": "2 aces",
      "5♠": "3 aces",
    };
    return `Blackwood response to 4NT: ${aceMap[bid]}.`;
  }
  if (prevHighBid === "5NT" && /^6[♣♦♥♠]$/.test(bid)) {
    const kingMap: Record<string, string> = {
      "6♣": "0 or 4 kings",
      "6♦": "1 king",
      "6♥": "2 kings",
      "6♠": "3 kings",
    };
    return `Blackwood kings response to 5NT: ${kingMap[bid]}.`;
  }

  // ── Raises: bidding the suit the bidder's PARTNER already showed ───────────
  const partnerShownSuit =
    bidderPartnerPreviousBid && !bidderPartnerPreviousBid.endsWith("NT")
      ? bidderPartnerPreviousBid.slice(1)
      : undefined;
  // Partner's FIRST suit also counts as "shown" — a jump back to it after
  // partner introduced a second suit is a (delayed) RAISE, not a new suit.
  const partnerFirstSuit =
    bidderPartnerFirstBid && /^[1-7][♠♥♦♣]$/.test(bidderPartnerFirstBid)
      ? bidderPartnerFirstBid.slice(1)
      : undefined;
  if (
    /^[2-5][♠♥♦♣]$/.test(bid) &&
    ((partnerShownSuit && bid.slice(1) === partnerShownSuit) ||
      (partnerFirstSuit && bid.slice(1) === partnerFirstSuit))
  ) {
    // The partner bid this raise actually supports (latest match wins).
    const matchedPartnerSuitBid =
      partnerShownSuit && bid.slice(1) === partnerShownSuit
        ? bidderPartnerPreviousBid!
        : bidderPartnerFirstBid!;
    // The bidder had shown this suit THEMSELVES and partner raised it — the
    // re-raise is a GAME TRY by the suit-shower (16-18), not a limited raise.
    if (
      bidderPreviousBid &&
      !bidderPreviousBid.endsWith("NT") &&
      bidderPreviousBid !== "Pass" &&
      bidderPreviousBid !== "Double" &&
      bidderPreviousBid !== "Redouble" &&
      bidderPreviousBid.slice(1) === partnerShownSuit &&
      parseInt(bid[0]) < (["♣", "♦"].includes(partnerShownSuit) ? 5 : 4)
    ) {
      // If the last bid before this one was the partnership's own raise, it is
      // a true GAME TRY; if the opponents have intervened (last bid in another
      // suit), the cheapest re-raise is COMPETITIVE.
      const uncontestedTry =
        !!prevHighBid &&
        !prevHighBid.endsWith("NT") &&
        prevHighBid.slice(1) === partnerShownSuit;
      if (uncontestedTry) {
        // An OVERCALLER's re-raise try shows ~14-15 (a maximum overcall);
        // an opener's shows 16-18.  The bidder's side overcalled if neither
        // hand made the auction's opening bid.
        const sideOvercalledGT =
          !!auctionOpeningBid &&
          bidderPreviousBid !== auctionOpeningBid &&
          bidderPartnerFirstBid !== auctionOpeningBid;
        const gtRange = sideOvercalledGT ? "14-15" : "16-18";
        return isPartner
          ? `${bid}: after partner raised the suit the bidder had shown, this re-raise is a GAME TRY — about ${gtRange} support points${sideOvercalledGT ? " (a maximum overcall)" : ""}, asking partner to bid game with a maximum raise and pass with a minimum.`
          : `${bid} from opponent: a game-try re-raise of their own suit after their partner's raise — about ${gtRange} support points.`;
      }
      return isPartner
        ? `${bid}: re-bidding the suit partner raised, over the opponents' interference — COMPETITIVE, fighting for the partscore, not a promise of extra strength.`
        : `${bid} from opponent: a competitive re-bid of the raised suit over the interference — no extra strength promised.`;
    }
    const lvl = parseInt(bid[0]);
    const prevLvl = parseInt(matchedPartnerSuitBid[0]) || 1;
    const jumped = lvl > prevLvl + 1;
    const raiseIsMinor = bid.slice(1) === "♣" || bid.slice(1) === "♦";
    const raiseAtGame = lvl >= (raiseIsMinor ? 5 : 4);
    const who = isPartner ? "Partner" : "The opponent";
    // A 1NT OPENER raising responder's natural suit bid (systems off over
    // interference): support + a maximum — competitive/invitational, NOT the
    // near-game-forcing 2-over-1 story (responder may be very weak).
    if (
      bidderPreviousBid === "1NT" &&
      auctionOpeningBid === "1NT" &&
      /^2[♠♥♦♣]$/.test(bidderPartnerPreviousBid!) &&
      !jumped &&
      !raiseAtGame
    ) {
      return isPartner
        ? `${bid}: the 1NT opener raising the natural suit you bid over the interference — good support (usually 4 cards) with a maximum. Competitive/invitational, NOT forcing: your suit bid could have been very weak, so pass with nothing extra.`
        : `${bid} from opponent: the 1NT opener raising their partner's natural suit bid (systems were off over the interference) — 4-card support, maximum NT opening. Not forcing.`;
    }
    // The OPENER raising responder's 1-LEVEL suit: 4-card support with a
    // minimum-range opener (about 12-15 support points) — NOT the responder's
    // limited 6-9 single raise.
    if (
      bidderPreviousBid &&
      auctionOpeningBid === bidderPreviousBid &&
      !auctionOpeningBid.endsWith("NT") &&
      /^1[♠♥♦♣]$/.test(bidderPartnerPreviousBid!) &&
      !jumped &&
      !raiseAtGame
    ) {
      return isPartner
        ? `${bid}: the OPENER raising your 1-level response — usually 4-card support with a minimum opener (about 12-15 support points). Not forcing; invite with ~11+, bid game with ~13+.`
        : `${bid} from opponent: the opener raising their partner's response — 4-card support, minimum opener (about 12-15).`;
    }
    // The OPENER raising responder's 2-over-1 (10+) is a constructive raise
    // in a near-game-forcing auction — not the limited 6-9 single raise.
    if (
      bidderPreviousBid &&
      auctionOpeningBid === bidderPreviousBid &&
      !auctionOpeningBid.endsWith("NT") &&
      /^2[♠♥♦♣]$/.test(bidderPartnerPreviousBid!) &&
      !jumped &&
      !raiseAtGame
    ) {
      return isPartner
        ? `${bid}: the OPENER raising your two-over-one response — support (4+, or 3 cards when your bid promised a 5-card suit in competition) in an auction your 10+ points made near-game-forcing. Constructive: pick the best game (3NT, a major, or the minor) next.`
        : `${bid} from opponent: the opener raising their partner's two-over-one response — 3-4+ card support, game-bound auction.`;
    }
    // The raiser's previous call was a (negative) DOUBLE and they now raise
    // the suit partner answered with: INVITATIONAL — real extras beyond the
    // 6+ points the double itself promised.
    if (bidderPreviousBid === "Double" && !jumped && !raiseAtGame) {
      // The double hit a 1NT opening → it was PENALTY; raising partner's
      // scramble afterwards shows a strong doubling hand with a real fit.
      if (auctionOpeningBid?.endsWith("NT")) {
        return isPartner
          ? `${bid}: raising your escape suit after doubling the opponents' NT — a strong doubling hand (16+) with a good fit for your suit, inviting. You showed a bust, so pass with nothing extra.`
          : `${bid} from opponent: raising their partner's escape suit after the penalty double — strong hand with a fit.`;
      }
      return isPartner
        ? `${bid}: raising the suit you answered their double with — INVITATIONAL, about 11-13 support points (clearly more than the 6+ their double promised). Bid game with a sound opener, pass with a bare minimum.`
        : `${bid} from opponent: raising the suit their partner answered the double with — invitational values (about 11-13), more than the double alone promised.`;
    }
    // A raiser who already LIMITED their hand with an NT response is showing
    // the TOP of that range, not the generic 6-9 single raise.
    const raiserLimitedWithNT =
      bidderPreviousBid === "1NT" || bidderPreviousBid === "2NT";
    return `${bid}: a RAISE of ${isPartner ? "their partner's" : "their partner's"} ${matchedPartnerSuitBid} — ${raiseAtGame ? "to GAME: to play, based on fit and playing strength (could be strong, or extending a preempt in competition)" : jumped ? "support for the suit with invitational-to-preemptive values (jump raise: 10-12 constructive, or weak with extra trumps in competition)" : raiserLimitedWithNT ? `support for the suit at the TOP of the range their earlier ${bidderPreviousBid} showed (about 9-12) — invitational` : "support for the suit with a limited hand (single raise ≈ 6-9 support points; raising an overcall in competition can be 0-9 with 4 trumps)"}. ${who} is showing a fit, not a new suit.`;
  }

  // ── Overcalls: a 1-level suit bid AFTER someone else already bid is an
  //    overcall (8-15ish), not an opening ─────────────────────────────────────
  const prevIsRealBid =
    !!prevHighBid &&
    prevHighBid !== "Pass" &&
    prevHighBid !== "Double" &&
    prevHighBid !== "Redouble";
  const bidderIsFirstAction =
    !bidderPreviousBid ||
    bidderPreviousBid === "Pass" ||
    bidderPreviousBid === "Double" ||
    bidderPreviousBid === "Redouble";
  // The bidder's PARTNER is known to have been silent (so the side has shown
  // nothing — a first bid over the opponents is an OVERCALL, not a response).
  const partnerKnownSilent = bidderPartnerPreviousBid === "none";
  // Partner is known to have made a real bid → the bidder is RESPONDING.
  const partnerKnownBid =
    !!bidderPartnerPreviousBid &&
    bidderPartnerPreviousBid !== "none" &&
    bidderPartnerPreviousBid !== "Pass" &&
    bidderPartnerPreviousBid !== "Double" &&
    bidderPartnerPreviousBid !== "Redouble";

  // ── Advances of partner's takeout DOUBLE ────────────────────────────────────
  if (
    prevIsRealBid &&
    bidderIsFirstAction &&
    bidderPartnerPreviousBid === "Double"
  ) {
    if (/^[1-5][♠♥♦♣]$/.test(bid)) {
      // Partner doubled the opponents' NT: penalty — a suit bid pulls it,
      // showing a bust with a long suit, never a forced takeout advance.
      if (prevHighBid!.endsWith("NT")) {
        return isPartner
          ? `${bid}: pulling your PENALTY double of ${prevHighBid} — a BUST (about 0-5) with a long ${bid.slice(1)} suit, scrambling to safety. With any real values they would have passed for penalties. Do not raise.`
          : `${bid} from opponent: pulling their partner's penalty double of ${prevHighBid} — a bust with a long suit, not a constructive bid.`;
      }
      // Partner doubled a HIGH bid (4-level+): that double was OPTIONAL, so a
      // suit bid here is a PULL — offense over defense, not a forced advance.
      if (parseInt(prevHighBid![0]) >= 4) {
        return isPartner
          ? `${bid}: PULLING your double of ${prevHighBid} — a long suit with shortness in their suit, choosing offense over defense. Not forced: a pass would have converted your double to penalty.`
          : `${bid} from opponent: pulling their partner's double of ${prevHighBid} to a long suit — no defensive interest.`;
      }
      const minIdxD = BID_ORDER.findIndex(
        (b, i) =>
          i > BID_ORDER.indexOf(prevHighBid!) && b.endsWith(bid.slice(1)),
      );
      const jumpedD = minIdxD >= 0 && BID_ORDER[minIdxD] !== bid;
      return jumpedD
        ? isPartner
          ? `${bid} JUMP advance of your takeout double: invitational — about 9-12 pts with a decent 4+ card suit.`
          : `${bid} from opponent: jump advance of their partner's takeout double — about 9-12 pts.`
        : isPartner
          ? `${bid} advance of your takeout double: their best unbid suit at the cheapest level. This bid is FORCED — it can be made on 0+ pts, so do not raise without extras.`
          : `${bid} from opponent: forced advance of their partner's takeout double — best suit, can be very weak (0+ pts).`;
    }
    if (/^[1-3]NT$/.test(bid)) {
      const ntRangeD =
        bid === "1NT" ? "6-10 pts" : bid === "2NT" ? "11-12 pts" : "13+ pts";
      return isPartner
        ? `${bid} advance of your takeout double: natural — ${ntRangeD} with at least one stopper in their suit (an NT advance is NOT forced, so it promises real values).`
        : `${bid} from opponent advancing the double: natural, ${ntRangeD} with a stopper.`;
    }
  }

  // ── Responses: bidder's first action when PARTNER already bid ──────────────
  if (prevIsRealBid && bidderIsFirstAction && partnerKnownBid) {
    const partnerBidIsNT = bidderPartnerPreviousBid!.endsWith("NT");
    // Partner's bid was a CUEBID of the opening suit (Michaels): 2NT asks for
    // the minor, raises of the shown major are preference.
    const partnerCuebidMichaels =
      !partnerBidIsNT &&
      auctionOpeningBid !== undefined &&
      !auctionOpeningBid.endsWith("NT") &&
      bidderPartnerPreviousBid !== auctionOpeningBid &&
      bidderPartnerPreviousBid!.slice(1) === auctionOpeningBid.slice(1);
    // 2NT over partner's WEAK TWO opening: the forcing feature-ask inquiry
    if (
      bid === "2NT" &&
      bidderPartnerPreviousBid === auctionOpeningBid &&
      ["2♦", "2♥", "2♠"].includes(bidderPartnerPreviousBid!)
    ) {
      return isPartner
        ? "2NT over your weak two: ARTIFICIAL forcing inquiry (feature ask) — about 15+ pts, asking you to show an outside ace/king (or rebid the suit with a minimum). If an opponent doubled in between, it is Jordan-style instead: 10-12 pts with a fit."
        : "2NT from opponent over their partner's weak two: artificial forcing inquiry (about 15+ pts; 10-12 pts Jordan-style if doubled).";
    }
    if (partnerCuebidMichaels && /^[2-4][♠♥♦♣]$/.test(bid)) {
      const michaelsGameJump =
        (bid[1] === "♥" || bid[1] === "♠") && bid[0] === "4";
      if (michaelsGameJump) {
        return isPartner
          ? `${bid} after your Michaels cuebid: TO PLAY — a jump to game in one of your suits. It can be values-based (about 11+ support points with 4+ trumps) or purely preemptive with a big fit; either way it is not forcing and you should pass.`
          : `${bid} from opponent after their partner's Michaels cuebid: to play — a game jump in a shown suit, values-based or preemptive with a big fit.`;
      }
      return isPartner
        ? `${bid} after your Michaels cuebid: PREFERENCE for one of the two suits you showed — promises no strength (jumps below game are preemptive; only a cuebid suggests slam-going strength).`
        : `${bid} from opponent after their partner's Michaels cuebid: simple preference for one of the shown suits — can be very weak (0+ pts).`;
    }
    if (partnerCuebidMichaels && bid === "2NT") {
      return isPartner
        ? "2NT after your Michaels cuebid: ARTIFICIAL — asks you to name your minor (3♣/3♦). Promises no particular strength."
        : "2NT from opponent after their partner's Michaels cuebid: artificial — asking for the minor, no strength promised.";
    }
    if (partnerBidIsNT) {
      // Uncontested responses to partner's NT are conventions — handled by
      // the cases below (Stayman, transfers).  Over interference, systems are
      // off and suit bids are natural weak escapes.
      const uncontested = prevHighBid === bidderPartnerPreviousBid;
      // Unusual 2NT by partner (their 2NT was NOT the opening): 3♣/3♦ is a
      // forced preference, promising nothing.
      if (
        bidderPartnerPreviousBid === "2NT" &&
        auctionOpeningBid !== undefined &&
        auctionOpeningBid !== "2NT" &&
        (bid === "3♣" || bid === "3♦")
      ) {
        return isPartner
          ? `${bid}: a forced PREFERENCE between the two suits your Unusual 2NT showed — says nothing about strength (can be 0 points).`
          : `${bid} from opponent: forced preference for one of the two suits shown by their partner's Unusual 2NT — no strength implied.`;
      }
      // Over a 2NT opening, transfers live at the 3-level (3♣ Stayman, 3♦→♥,
      // 3♥→♠), so a 3-level suit bid is conventional, NOT a natural slam try.
      if (uncontested && bidderPartnerPreviousBid === "2NT") {
        if (bid === "3♣") {
          return isPartner
            ? "3♣ over your 2NT: STAYMAN — asks for a 4-card major (game-forcing values). Not natural clubs."
            : "3♣ from opponent over their partner's 2NT: Stayman, asking for a 4-card major.";
        }
        if (bid === "3♦") {
          return isPartner
            ? "3♦ over your 2NT: JACOBY TRANSFER to hearts — shows 5+ hearts. Partner bids 3♥; you then clarify strength. Not natural diamonds."
            : "3♦ from opponent over their partner's 2NT: Jacoby transfer to hearts (5+ hearts).";
        }
        if (bid === "3♥") {
          return isPartner
            ? "3♥ over your 2NT: JACOBY TRANSFER to spades — shows 5+ spades. Partner bids 3♠. Not natural hearts."
            : "3♥ from opponent over their partner's 2NT: Jacoby transfer to spades (5+ spades).";
        }
        // 3♠ has no standard transfer/Stayman meaning over 2NT — leave it to
        // the natural reading below.
      }
      if (uncontested && /^3[♠♥♦♣]$/.test(bid)) {
        return isPartner
          ? `${bid} over your NT: natural and FORCING — a 6+ card suit with slam interest (game-forcing). Raise with 3-card support, otherwise bid 3NT.`
          : `${bid} from opponent over their partner's NT: natural 6+ suit, forcing with slam interest.`;
      }
      if (uncontested && bid === "2NT") {
        return isPartner
          ? "2NT facing your 1NT: natural INVITATION to 3NT — about 8-9 pts, no 4-card major worth showing. (Facing a BALANCING 1NT of 11-14, the invite shows more: about 11-12.)"
          : "2NT from opponent facing their partner's NT: natural invitation, about 8-9 pts (11-12 facing a balancing 1NT).";
      }
      if (!uncontested && /^[23][♠♥♦♣]$/.test(bid)) {
        return isPartner
          ? `${bid} over interference with partner's ${bidderPartnerPreviousBid}: NATURAL escape — a 5+ card suit, usually weak (systems like Stayman/transfers are off in competition).`
          : `${bid} from opponent: natural 5+ card suit over the interference with their partner's ${bidderPartnerPreviousBid} — usually weak.`;
      }
      if (bid === "3NT") {
        const facingRange =
          bidderPartnerPreviousBid === "2NT" ? "4-11 pts" : "10-15 pts";
        return isPartner
          ? `3NT facing partner's ${bidderPartnerPreviousBid}: to play — enough combined strength for game (about ${facingRange} opposite that range).`
          : `3NT from opponent: to play, facing their partner's ${bidderPartnerPreviousBid} (about ${facingRange}).`;
      }
      // fall through to the convention cases in the switch below
    } else if (
      bidderPartnerPreviousBid === "2♣" &&
      auctionOpeningBid === "2♣"
    ) {
      // Responses to the strong artificial 2♣ opening
      if (bid === "2♦")
        return "2♦ response to the strong 2♣: artificial WAITING bid (0-7 pts, or no clear positive) — says nothing about diamonds.";
      if (bid === "2NT")
        return "2NT response to the strong 2♣: positive, balanced, 8+ HCP. Game-forcing.";
      if (/^[23][♠♥♦♣]$/.test(bid))
        return `${bid} response to the strong 2♣: a POSITIVE — natural 5+ card suit with 8+ pts. Game-forcing.`;
    }
    if (
      bid === "2NT" &&
      (bidderPartnerPreviousBid === "1♥" ||
        bidderPartnerPreviousBid === "1♠") &&
      auctionOpeningBid === bidderPartnerPreviousBid
    ) {
      return isPartner
        ? `2NT over your ${bidderPartnerPreviousBid} opening: with 4+ trump support it is JACOBY — a game-forcing raise (13+ pts; reply with shortness/side-suit/range). Without support it is a natural, balanced response of about 11-12 pts (invitational). Ask which applies from the rest of their bidding.`
        : `2NT from opponent over their partner's ${bidderPartnerPreviousBid}: Jacoby game-forcing raise (4+ trumps, 13+ pts) or a natural balanced 11-12 pts.`;
    }
    if (
      !partnerBidIsNT &&
      /^[1-3][♠♥♦♣]$/.test(bid) &&
      bid.slice(1) !== bidderPartnerPreviousBid!.slice(1)
    ) {
      // CUEBID of the opponents' suit (the bid matches the last enemy bid's
      // suit, which is NOT partner's): the forcing raise in competition.
      if (
        prevHighBid &&
        !prevHighBid.endsWith("NT") &&
        /^[1-7][♠♥♦♣]$/.test(prevHighBid) &&
        bid.slice(1) === prevHighBid.slice(1)
      ) {
        return isPartner
          ? `${bid}: a CUEBID of the opponents' suit — the LIMIT-RAISE-OR-BETTER of your ${bidderPartnerPreviousBid} in competition (about 10+ support points — limit raise or better; a direct raise would have been weak/competitive). It says nothing about ${bid.slice(1)}.`
          : `${bid} from opponent: a cuebid of their opponents' suit — a limit-raise-or-better of their partner's ${bidderPartnerPreviousBid} (10+ support points), not natural.`;
      }
      const lvlR = bid[0];
      // Was the bidder's partner the OPENER, or an overcaller?  A new suit
      // facing an OVERCALL is an ADVANCE (constructive, non-forcing) — not the
      // forcing response structure.
      const partnerWasOpener =
        auctionOpeningBid === undefined ||
        auctionOpeningBid === bidderPartnerPreviousBid;
      // Is this the CHEAPEST available level for the suit?  Measure against
      // the LAST bid before it (prevHighBid — interference may have raised the
      // floor), not merely against partner's bid.  If not cheapest, it is a
      // JUMP.
      const jumpFloor = prevHighBid ?? bidderPartnerPreviousBid!;
      const cheapestNewSuit = BID_ORDER.find(
        (b, i) => i > BID_ORDER.indexOf(jumpFloor) && b.endsWith(bid.slice(1)),
      );
      const isJumpShiftResp = !!cheapestNewSuit && cheapestNewSuit !== bid;
      if (!partnerWasOpener) {
        // The advancer bidding the OPENER's suit is a CUEBID — the
        // limit-raise-or-better of partner's overcall, never natural.
        if (
          auctionOpeningBid &&
          /^[1-7][♠♥♦♣]$/.test(auctionOpeningBid) &&
          bid.slice(1) === auctionOpeningBid.slice(1)
        ) {
          return isPartner
            ? `${bid}: a CUEBID of the opener's suit — the limit-raise-or-better of your overcall (about 10+ support points with a fit). It says nothing about ${bid.slice(1)}; a direct raise instead would have been merely competitive.`
            : `${bid} from opponent: a cuebid of the opening suit — a limit-raise-or-better of their partner's overcall (10+ support points), not natural.`;
        }
        return isPartner
          ? `${bid} ADVANCE of your overcall in a new suit: natural and constructive, NOT forcing — ${isJumpShiftResp ? "the JUMP shows a good suit with invitational values (about 9-12 pts)" : `a decent 5+ card suit with ${lvlR === "1" ? "about 6+" : "about 10+"} pts`} and no fit for your suit.`
          : `${bid} from opponent: a new-suit advance of their partner's overcall — natural, ${isJumpShiftResp ? "jump = invitational (9-12 pts)" : lvlR === "1" ? "6+ pts" : "10+ pts"}, non-forcing.`;
      }
      if (isJumpShiftResp) {
        return isPartner
          ? `${bid} JUMP SHIFT response to their partner's ${bidderPartnerPreviousBid}: a strong, game-forcing new suit — about 17+ pts with a good 5+ card suit. (A non-jump new suit would have been available cheaper.)`
          : `${bid} from opponent: jump-shift response — strong (17+ pts), game-forcing, good 5+ card suit.`;
      }
      return isPartner
        ? `${bid} RESPONSE to their partner's ${bidderPartnerPreviousBid}: a natural new suit (4+ cards) with ${lvlR === "1" ? "6+ pts (forcing one round)" : "about 10+ pts (new suit at the cheapest level above 1)"}. Not an opening or overcall.`
        : `${bid} from opponent: a natural new-suit response to their partner's ${bidderPartnerPreviousBid} — 4+ cards, ${lvlR === "1" ? "6+" : "10+"} pts.`;
    }
    if (bid === "1NT") {
      const partnerOpenedIt =
        auctionOpeningBid === undefined ||
        auctionOpeningBid === bidderPartnerPreviousBid;
      if (!partnerOpenedIt) {
        return isPartner
          ? "1NT ADVANCE of your overcall: natural — about 8-12 pts, balanced, with a stopper in the opener's suit. (Stronger than the 6-10 response to an opening.)"
          : "1NT from opponent advancing their partner's overcall: about 8-12 pts with a stopper.";
      }
      return isPartner
        ? "1NT RESPONSE to partner's suit opening: 6-10 pts, no fit and no 4-card major to show at the 1-level. Not the 15-17 opening."
        : "1NT response from opponent: 6-10 pts, balanced-ish, no fit for their partner's suit.";
    }
    if (bid === "2NT" || bid === "3NT") {
      const partnerOpenedIt2 =
        auctionOpeningBid === undefined ||
        auctionOpeningBid === bidderPartnerPreviousBid;
      if (!partnerOpenedIt2) {
        return isPartner
          ? `${bid} ADVANCE of your overcall: natural — ${bid === "2NT" ? "invitational, about 13-14 pts" : "to play, about 11+ pts counting on your long suit for tricks"}, with the opener's suit stopped.`
          : `${bid} from opponent advancing the overcall: natural, ${bid === "2NT" ? "about 13-14 pts" : "about 11+ pts"} with a stopper.`;
      }
      return isPartner
        ? `${bid} RESPONSE to partner's opening: balanced with ${bid === "2NT" ? "game-interest values (typically 11-15 pts — invitational to game-forcing by agreement)" : "game values (13+ pts, typically 13-18)"}. Not an opening NT range.`
        : `${bid} from opponent: a natural NT response — balanced, ${bid === "2NT" ? "roughly 11-15 pts" : "13+ pts"}.`;
    }
  }

  if (
    prevIsRealBid &&
    bidderIsFirstAction &&
    partnerKnownSilent &&
    /^1[♠♥♦♣]$/.test(bid)
  ) {
    const suitName = bid.includes("♠")
      ? "spades"
      : bid.includes("♥")
        ? "hearts"
        : bid.includes("♦")
          ? "diamonds"
          : "clubs";
    return isPartner
      ? `${bid} OVERCALL (someone had already opened): a good 5+ card ${suitName} suit with roughly 8-16 HCP. This is NOT an opening bid — it is competing over the opponents' opening.`
      : `${bid} overcall from opponent: good 5+ card ${suitName} suit, roughly 8-16 HCP.`;
  }
  if (
    prevIsRealBid &&
    bidderIsFirstAction &&
    partnerKnownSilent &&
    bid === "2NT"
  ) {
    const overOneLevel =
      prevHighBid![0] === "1" && !prevHighBid!.endsWith("NT");
    if (overOneLevel) {
      return isPartner
        ? "2NT directly over a 1-level opening: the UNUSUAL 2NT — a 5-5 two-suiter in the two lowest unbid suits. Strength is UNLIMITED (5+ pts): often weak and obstructive, occasionally very strong. (Some pairs play natural 20-21 instead — confirm the agreement; the engine bids it as Unusual.)"
        : "2NT from opponent: Unusual 2NT overcall — 5-5 in the two lowest unbid suits (usually both minors), unlimited strength (5+ pts, often weak).";
    }
    return isPartner
      ? "2NT over their higher opening (e.g. a weak two): NATURAL — about 15-18 HCP, balanced, with a stopper in their suit. Systems (Stayman/transfers one level up) usually apply."
      : "2NT from opponent over the preempt: natural, about 15-18 HCP with a stopper.";
  }
  if (
    prevIsRealBid &&
    bidderIsFirstAction &&
    partnerKnownSilent &&
    bid === "3NT"
  ) {
    return isPartner
      ? "3NT OVERCALL: to play — a strong hand (roughly 16-21 pts) with the opponents' suit stopped, often built on a long running minor."
      : "3NT overcall from opponent: to play — roughly 16-21 pts with a stopper, often a long running suit.";
  }
  if (
    prevIsRealBid &&
    bidderIsFirstAction &&
    partnerKnownSilent &&
    bid === "1NT"
  ) {
    return isPartner
      ? "1NT OVERCALL: balanced 15-18 HCP with a stopper in the opener's suit (slightly stronger than a 1NT opening). Stayman and transfers usually still apply. (In the BALANCING/pass-out seat it is about a king lighter: 11-14 HCP.)"
      : "1NT overcall from opponent: balanced 15-18 HCP with a stopper in partner's suit (11-14 if made in the balancing/pass-out seat).";
  }
  // 2/3-level first actions in competition: cuebid, weak jump overcall, or
  // simple overcall — but NOT a weak-two/preempt OPENING.  (Conventional bids
  // over the bidder's PARTNER's NT — Stayman/transfers — are handled by the
  // cases below instead.)
  const conventionOverPartnerNT =
    !!prevHighBid &&
    prevHighBid.endsWith("NT") &&
    (bidderPartnerPreviousBid === undefined ||
      bidderPartnerPreviousBid === prevHighBid);
  if (
    prevIsRealBid &&
    bidderIsFirstAction &&
    partnerKnownSilent &&
    !conventionOverPartnerNT &&
    !(
      prevHighBid === "2♣" &&
      bid === "2♦" &&
      bidderPreviousBid === undefined
    ) &&
    /^[2-4][♠♥♦♣]$/.test(bid)
  ) {
    const suitSym2 = bid.slice(1);
    if (!prevHighBid!.endsWith("NT") && prevHighBid!.slice(1) === suitSym2) {
      // Name the exact two-suiter Michaels shows for the cued suit:
      //   cue a MINOR → both majors (5-5); cue a MAJOR → the OTHER major + an
      //   unspecified 5+ card minor.
      const michaelsShows =
        suitSym2 === "♣" || suitSym2 === "♦"
          ? "BOTH MAJORS — at least 5 hearts and 5 spades"
          : suitSym2 === "♥"
            ? "5+ spades and 5+ of an unspecified minor (clubs or diamonds)"
            : "5+ hearts and 5+ of an unspecified minor (clubs or diamonds)";
      const advanceTip =
        suitSym2 === "♣" || suitSym2 === "♦"
          ? "Pick the major you prefer; jump with a fit and extra values."
          : `Bid ${suitSym2 === "♥" ? "spades" : "hearts"} with a fit, or bid 2NT to ask which minor they hold.`;
      return isPartner
        ? `${bid}: a MICHAELS CUEBID of the opponents' suit — artificial, NOT natural in ${suitSym2}. It shows a two-suiter: ${michaelsShows}. Strength is either weak-competitive (~6-11 pts) or strong (16+) — rarely in between. ${advanceTip} (Later in the auction a cuebid instead shows a strong raise.)`
        : `${bid} from opponent: a Michaels cuebid — artificial two-suiter showing ${michaelsShows}, not natural.`;
    }
    if (prevHighBid!.endsWith("NT")) {
      return isPartner
        ? `${bid} over the opponents' NT: natural — a good suit (usually 5-6+ cards) with a WIDE range, roughly 5-17 pts: anything from a weak obstructive hand to a strong hand that preferred its suit to a penalty double. Judge by the auction's development.`
        : `${bid} from opponent over the NT: natural good suit (5-6+ cards), wide range (roughly 5-17 pts).`;
    }
    const minIdx2 = BID_ORDER.findIndex(
      (b, i) => i > BID_ORDER.indexOf(prevHighBid!) && b.endsWith(suitSym2),
    );
    const isJump2 = minIdx2 >= 0 && BID_ORDER[minIdx2] !== bid;
    if (isJump2) {
      // Suit length scales with the size of the jump: a single jump shows a
      // good 6-card suit, a double jump 7, a triple jump 8.
      const jumpDist = Math.max(
        1,
        parseInt(bid[0]) - parseInt(BID_ORDER[minIdx2][0]),
      );
      // Single jump → 6-card suit, double jump → 7, triple → 8.
      const wjoLvlTT = parseInt(bid[0]) || 2;
      const wjoLen = Math.min(
        Math.max(wjoLvlTT + 4, Math.min(5 + jumpDist, 8)),
        8,
      );
      return isPartner
        ? `${bid} WEAK JUMP OVERCALL: preemptive — about 5-10 HCP with a good ${wjoLen}-card suit. Not an opening bid; it jumps ${jumpDist === 1 ? "a level" : `${jumpDist} levels`} to crowd the opponents.`
        : `${bid} from opponent: weak jump overcall — 5-10 HCP, ${wjoLen}-card suit, preemptive.`;
    }
    return isPartner
      ? `${bid} OVERCALL in competition: natural, good 5+ card suit (often 6 at the 3-level) with roughly ${bid[0] === "2" ? "10-17" : "11-17"} HCP directly (can be lighter — roughly 7+ — with a good 6+ card suit, or 6+ HCP in the balancing/pass-out seat). This is NOT a weak-two or preempt opening — someone had already bid.`
      : `${bid} overcall from opponent: natural 5+ card suit, roughly ${bid[0] === "2" ? "10-17" : "11-17"} HCP (lighter with a good 6+ card suit or when balancing).`;
  }

  // ── Rebids: the bidder has already made a real bid, so this CANNOT be an
  //    opening (weak two, preempt, strong 2♣, 15-17 1NT, …) ──────────────────
  const bidderHasBidBefore =
    !!bidderPreviousBid &&
    bidderPreviousBid !== "Pass" &&
    bidderPreviousBid !== "Double" &&
    bidderPreviousBid !== "Redouble";

  if (bidderHasBidBefore && /^[1-7](?:[♠♥♦♣]|NT)$/.test(bid)) {
    // Conventional continuations that stay meaningful on a second bid:
    // The OPENER of 1♥/1♠ answering partner's Jacoby 2NT with a 3-level new
    // suit: SHORTNESS (singleton/void), a slam try — never a natural suit.
    if (
      bidderPartnerPreviousBid === "2NT" &&
      (bidderPreviousBid === "1♥" || bidderPreviousBid === "1♠") &&
      auctionOpeningBid === bidderPreviousBid &&
      /^3[♠♥♦♣]$/.test(bid) &&
      bid.slice(1) !== bidderPreviousBid.slice(1)
    ) {
      return isPartner
        ? `${bid}: answering your Jacoby 2NT — a SINGLETON OR VOID in ${bid.slice(1)} (slam try). Not a natural second suit; evaluate your holdings opposite the shortness.`
        : `${bid} from opponent: answering their partner's Jacoby 2NT — shows a singleton or void in ${bid.slice(1)}, not a natural suit.`;
    }
    if (
      bidderPreviousBid === "1NT" &&
      prevHighBid === "2♣" &&
      (bid === "2♥" || bid === "2♠")
    ) {
      return `Stayman reply from the 1NT opener: ${bid === "2♥" ? "4+ hearts" : "4+ spades (and fewer than 4 hearts)"}.`;
    }
    if (bidderPreviousBid === "1NT" && prevHighBid === "2♣" && bid === "2♦") {
      return "Stayman denial from the 1NT opener — no 4-card major. Artificial; says nothing about diamonds.";
    }
    // Responder's major after the Stayman 2♦ denial: a natural 5-card suit
    // (Stayman with 5-4 majors), invitational at the 2-level, GF at the 3-level.
    if (
      bidderPreviousBid === "2♣" &&
      bidderPartnerPreviousBid === "2♦" &&
      auctionOpeningBid === "1NT" &&
      /^[23][♥♠]$/.test(bid)
    ) {
      return `${bid} after the Stayman 2♦ denial: a natural 5-card ${bid.includes("♥") ? "heart" : "spade"} suit (Stayman was chosen with 5-4 majors) — ${bid[0] === "2" ? "INVITATIONAL; the NT opener passes with a minimum, raises or bids game with a maximum" : "game-forcing"}.`;
    }
    // The same conventions sit one level higher over a 2NT opening/rebid.
    if (
      bidderPreviousBid === "2NT" &&
      prevHighBid === "3♣" &&
      (bid === "3♥" || bid === "3♠")
    ) {
      return `Stayman reply from the 2NT bidder: ${bid === "3♥" ? "4+ hearts" : "4+ spades (and fewer than 4 hearts)"}.`;
    }
    if (bidderPreviousBid === "2NT" && prevHighBid === "3♣" && bid === "3♦") {
      return "Stayman denial from the 2NT bidder — no 4-card major. Artificial; says nothing about diamonds.";
    }
    if (
      bidderPreviousBid === "3♣" &&
      auctionOpeningBid !== "3♣" &&
      (bid === "3NT" || bid === "4NT")
    ) {
      return bid === "3NT"
        ? "3NT after their Stayman 3♣ (over 2NT): to play — no major fit found."
        : "4NT after their Stayman 3♣: QUANTITATIVE slam invite — no major fit.";
    }
    if (
      bidderPreviousBid === "2♣" &&
      (auctionOpeningBid === "1NT" || auctionOpeningBid === "2NT") &&
      (bid === "2NT" || bid === "3NT")
    ) {
      return bid === "2NT"
        ? "2NT after their Stayman 2♣: INVITATIONAL — about 8-9 pts, no major fit found. The NT bidder passes with a minimum, bids 3NT with a maximum."
        : "3NT after their Stayman 2♣: to play — game values (about 10-15 pts), no major fit found.";
    }
    if (
      bidderPreviousBid === "1NT" &&
      ((prevHighBid === "2♦" && bid === "2♥") ||
        (prevHighBid === "2♥" && bid === "2♠"))
    ) {
      return "Completing the Jacoby transfer — says nothing extra about the 1NT opener's hand.";
    }
    // Responder's NT continuation after their OWN transfer: exactly 5 of the
    // transferred major with an invitational (2NT) or game-going (3NT) hand.
    if (
      (bidderPreviousBid === "2♦" || bidderPreviousBid === "2♥") &&
      (bidderPartnerPreviousBid === "2♥" ||
        bidderPartnerPreviousBid === "2♠") &&
      auctionOpeningBid === "1NT" &&
      (bid === "2NT" || bid === "3NT")
    ) {
      const transferMajorTT = bidderPreviousBid === "2♦" ? "hearts" : "spades";
      return bid === "2NT"
        ? `2NT after your transfer completion: INVITATIONAL — exactly 5 ${transferMajorTT} with 8-9 points. Pass or 3${transferMajorTT === "hearts" ? "♥" : "♠"} with a minimum; 3NT or 4 of the major with a maximum.`
        : `3NT after your transfer completion: GAME values with exactly 5 ${transferMajorTT} — a choice of games. Pass with a doubleton; correct to 4 of the major with 3+ support.`;
    }
    if (
      bidderPreviousBid === "2NT" &&
      ((prevHighBid === "3♦" && bid === "3♥") ||
        (prevHighBid === "3♥" && bid === "3♠"))
    ) {
      return "Completing the Jacoby transfer (over 2NT) — says nothing extra about the 2NT bidder's hand.";
    }
    if (
      bidderPreviousBid === "2♣" &&
      (auctionOpeningBid === undefined || auctionOpeningBid === "2♣")
    ) {
      return bid.endsWith("NT")
        ? `${bid} after the artificial 2♣ opening: ${bid === "2NT" ? "balanced 22-24 HCP (a 3NT rebid over 2♦ would show 25-27). Stayman and transfers apply one level up." : "balanced — 25-27 HCP when bid freely over 2♦; after a 3-level positive response it is also the CHEAPEST rebid for a 22-24 balanced hand, so the range is 22-27 there."}`
        : `${bid} after the artificial 2♣ opening: their REAL suit (5+ cards), forcing to game.`;
    }
    // 5NT directly after the bidder's own 4NT is the KING ASK (grand-slam
    // try, promising all four aces) — not a placement.
    if (bid === "5NT" && bidderPreviousBid === "4NT") {
      return "5NT after their own 4NT ace ask: the Blackwood KING ASK — promises the partnership holds ALL FOUR ACES and invites a grand slam. Responses: 6♣=0/4 kings, 6♦=1, 6♥=2, 6♠=3.";
    }
    if (bidderPreviousBid === "4NT" || bidderPreviousBid === "5NT") {
      return `${bid}: placing the contract after the ${bidderPreviousBid === "4NT" ? "Blackwood ace ask" : "king ask"} — a sign-off based on the response.`;
    }
    if (bid.endsWith("NT")) {
      if (bid === "3NT") {
        return isPartner
          ? `3NT REBID (they bid ${bidderPreviousBid} earlier): choosing game in notrump — an opener shows 18-19 HCP; a responder simply has enough for game opposite what you showed (0+ pts facing a strong 2♣ or 2NT sequence, up to ~16 facing a minimum). Not an opening NT range.`
          : "3NT from opponent: an NT rebid placing the game — opener 18-19 HCP, or a responder with enough for game opposite their partner (0+ pts facing strong sequences).";
      }
      if (/^[4-7]NT$/.test(bid)) {
        return isPartner
          ? `${bid} REBID: a slam-zone notrump bid — quantitative or a placement based on combined strength (a responder typically holds 17+ pts opposite an opening for 6NT). Check the agreed conventions: 4NT directly after NT bids is quantitative, after suit agreement it is Blackwood.`
          : `${bid} from opponent: slam-zone NT — quantitative invite or placement (typically 17+ pts opposite an opening hand).`;
      }
      // Opener RAISING the 1NT response (1x-1NT-2NT): 18-19 balanced invite —
      // a 12-14 balanced opener would simply PASS 1NT, so "cheapest = 12-14"
      // does not apply here.
      if (
        bid === "2NT" &&
        /^1[♠♥♦♣]$/.test(bidderPreviousBid) &&
        bidderPartnerPreviousBid === "1NT"
      ) {
        return isPartner
          ? `2NT RAISE of your 1NT response (they opened ${bidderPreviousBid}): 18-19 balanced, INVITATIONAL — too strong for a 1NT opening. Pass with 6-7; bid 3NT with 8-10. (A 12-14 balanced opener would have passed 1NT.)`
          : "2NT from opponent raising their partner's 1NT response: 18-19 balanced, invitational (a 12-14 opener would pass 1NT).";
      }
      return isPartner
        ? `${bid} REBID (they bid ${bidderPreviousBid} earlier): natural and balanced — NOT an opening NT range. By an opener the cheapest NT shows 12-14 HCP (a jump shows 18-19 HCP); by a responder it is invitational, about 10-12 pts.`
        : `${bid} from opponent: an NT REBID after their earlier ${bidderPreviousBid} — balanced; opener 12-14 HCP (jump 18-19 HCP) or responder 10-12 pts invitational. Not an opening NT range.`;
    }
    const bidSuitSym = bid.slice(1);
    const prevSuitSym = bidderPreviousBid.endsWith("NT")
      ? null
      : bidderPreviousBid.slice(1);
    // The bidder's PARTNER doubled: a new suit now is the ANSWER to that
    // (negative/takeout) double — bidding the implied suit, with the level
    // showing the range.
    if (
      bidderPartnerPreviousBid === "Double" &&
      prevSuitSym !== bidSuitSym &&
      /^[1-7][♠♥♦♣]$/.test(bid)
    ) {
      const cheapestAnswerT = prevHighBid
        ? BID_ORDER.find(
            (b, i) =>
              i > BID_ORDER.indexOf(prevHighBid) && b.endsWith(bidSuitSym),
          )
        : undefined;
      const answerJumpedT = !!cheapestAnswerT && cheapestAnswerT !== bid;
      const rangeT = answerJumpedT
        ? "a JUMP — a maximum (about 15-17)"
        : "the cheapest level — a minimum (about 11-14)";
      return isPartner
        ? `${bid}: ANSWERING your double — bidding the suit your double implied, at ${rangeT}. Raise with the values your double did not already promise.`
        : `${bid} from opponent: answering their partner's double in the implied suit — ${answerJumpedT ? "jump shows about 15-17" : "cheapest level shows about 11-14"}.`;
    }
    if (prevSuitSym === bidSuitSym) {
      // Partner's last bid CUED the enemy suit (it matches the last enemy
      // bid's suit, not the bidder's own): this same-suit rebid is the FORCED
      // acceptance of that game-forcing raise — its level shows nothing extra.
      if (
        bidderPartnerPreviousBid &&
        /^[1-7][♠♥♦♣]$/.test(bidderPartnerPreviousBid) &&
        bidderPartnerPreviousBid.slice(1) !== bidSuitSym &&
        // Partner's bid was a CUE only if that suit belongs to the OPPONENTS:
        // either the auction's opening (not made by this side) or the last
        // high bid (not partner's own call).
        (() => {
          const cueSuitT = bidderPartnerPreviousBid.slice(1);
          const viaOpening =
            !!auctionOpeningBid &&
            /^[1-7][♠♥♦♣]$/.test(auctionOpeningBid) &&
            auctionOpeningBid.slice(1) === cueSuitT &&
            auctionOpeningBid !== bidderPreviousBid &&
            auctionOpeningBid !== bidderPartnerPreviousBid;
          const viaPrevHigh =
            !!prevHighBid &&
            /^[1-7][♠♥♦♣]$/.test(prevHighBid) &&
            prevHighBid.slice(1) === cueSuitT &&
            prevHighBid !== bidderPartnerPreviousBid &&
            prevHighBid !== bidderPreviousBid;
          return viaOpening || viaPrevHigh;
        })()
      ) {
        const cueAnsAtGame =
          parseInt(bid[0]) >=
          (bidSuitSym === "♥" || bidSuitSym === "♠" ? 4 : 5);
        return cueAnsAtGame
          ? isPartner
            ? `${bid}: accepting your CUEBID raise — partner is simply taking the game your cuebid forced, at the level the opponents' interference allows. The level itself shows NO extra strength.`
            : `${bid} from opponent: completing the game their partner's cuebid raise forced — the level shows no extra strength.`
          : isPartner
            ? `${bid}: the MINIMUM answer to your cuebid raise — nothing extra beyond the original bid. Pass with just a limit raise (10-12); bid on with the game-forcing version.`
            : `${bid} from opponent: the minimum answer to their partner's cuebid raise — no extra strength shown.`;
      }
      // Same-suit bid PULLING partner's 3NT signoff: a correction to play in
      // the long suit (extreme shape), NOT a strength-showing jump.
      if (
        bidderPartnerPreviousBid === "3NT" &&
        /^[45][♣♦]$/.test(bid) &&
        bid.slice(1) === bidderPreviousBid.slice(1)
      ) {
        return isPartner
          ? `${bid}: PULLING your 3NT to their long ${bid.includes("♦") ? "diamond" : "club"} suit — a wildly distributional hand (void or two singletons) where notrump is at risk. To play; no extra strength shown.`
          : `${bid} from opponent: pulling their partner's 3NT to the long minor — extreme shape, to play.`;
      }
      // 4M in the suit the bidder COMPLETED A TRANSFER to, over partner's
      // choice-of-games 3NT: a correction showing 3+ card support, no extras.
      if (
        bidderPartnerPreviousBid === "3NT" &&
        /^4[♥♠]$/.test(bid) &&
        bid.slice(1) === bidderPreviousBid.slice(1) &&
        /^[23][♥♠]$/.test(bidderPreviousBid)
      ) {
        return isPartner
          ? `${bid}: CORRECTING your choice-of-games 3NT to the major — 3+ card support for the suit you transferred to. The level shows a fit, not extra strength.`
          : `${bid} from opponent: correcting their partner's choice-of-games 3NT to the major with 3+ card support — no extra strength.`;
      }
      // Grade the rebid by its jump size: simple = minimum (≤15), single jump
      // = 16-18 invitational, jump to game+ = 19-21.
      const cheapestRebid = prevHighBid
        ? BID_ORDER.find(
            (b, i) =>
              i > BID_ORDER.indexOf(prevHighBid) && b.endsWith(bidSuitSym),
          )
        : undefined;
      const rebidJump =
        !!cheapestRebid && parseInt(bid[0]) - parseInt(cheapestRebid[0]) >= 1;
      const bidLvl = parseInt(bid[0]);
      const isMinorSuitR = bidSuitSym === "♣" || bidSuitSym === "♦";
      const atGame = bidLvl >= (isMinorSuitR ? 5 : 4);
      const strengthText = atGame
        ? "a JUMP TO GAME in their own suit — about 19-21 pts with a self-sufficient 6-7 card suit (or, if partner's last bid was a cuebid of an enemy suit, simply accepting that forcing raise with no extra strength)"
        : rebidJump
          ? "a JUMP rebid — 16-18 pts with a good 6+ card suit, invitational (non-forcing)"
          : "minimum/competitive values (about 12-15) with extra length (usually a 6+ card suit, occasionally a good 5 when no other rebid fits)";
      return isPartner
        ? `${bid} REBID of the same suit (they bid ${bidderPreviousBid} earlier): natural — ${strengthText}. NOT a weak-two or preempt opening.`
        : `${bid} from opponent: a REBID of the suit they already bid (${bidderPreviousBid}) — natural, ${atGame ? "19-21 pts, self-sufficient suit" : rebidJump ? "16-18 pts, good 6+ suit (invitational)" : "extra length, minimum values"}. Not an opening bid.`;
    }
    if (bidderPreviousBid.endsWith("NT")) {
      return isPartner
        ? `${bid}: a natural suit shown AFTER their earlier ${bidderPreviousBid} — a 5+ card suit offered as a strain (running from notrump or competing). Not an opening bid.`
        : `${bid} from opponent: a natural 5+ card suit shown after their earlier ${bidderPreviousBid} — offering the suit as the strain.`;
    }
    return isPartner
      ? `${bid}: a SECOND suit (they bid ${bidderPreviousBid} earlier) — natural, usually 4+ cards here with the first suit at least as long. Not an opening bid. (If this is a suit the opponents bid, it is a cuebid showing a strong raise instead.)`
      : `${bid} from opponent: a second suit alongside their earlier ${bidderPreviousBid} — natural, not an opening bid.`;
  }

  switch (bid) {
    case "Pass":
      return "No bid — shows either a weak hand or a desire to defend.";

    case "1♣":
      return isPartner
        ? "Opening 1♣: typically 12–21 pts, often 3+ clubs or a balanced hand with no 5-card major."
        : "Opening 1♣ from opponent: 12–21 pts, natural clubs or balanced.";
    case "1♦":
      return isPartner
        ? "Opening 1♦: 12–21 pts, no 5-card major. Usually 4+ diamonds (3 only with exactly 4-4-3-2 shape)."
        : "Opening 1♦ from opponent: 12–21 pts, natural diamonds (usually 4+).";
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
      // The auction's FIRST bid is an opening — the Unusual 2NT reading only
      // exists over an opponent's earlier opening.
      if (!prevHighBid || bid === auctionOpeningBid) {
        return "2NT opening from opponent: balanced 20–21 HCP.";
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
        ? "3NT opening: GAMBLING (SAYC) — a solid running 7-card minor (AKQxxxx+) with little outside strength. Pass with the side suits stopped; bid 4♣ pass-or-correct without them. (25-27 balanced hands open 2♣ and rebid 3NT instead.)"
        : "3NT opening from opponent: Gambling — a solid 7-card minor, little outside strength.";

    case "4♣":
      return "4♣: likely Gerber convention — asks partner how many aces they hold. Responses: 4♦=0/4, 4♥=1, 4♠=2, 4NT=3.";
    case "4♦":
      return "4♦: likely a Gerber ace-response (0 or 4 aces if partner bid 4♣), or a natural pre-empt with long diamonds.";
    case "4♥":
      if (bid === auctionOpeningBid) {
        return isPartner
          ? "4♥ OPENING: preemptive — a 7-8 card heart suit with a weak hand (under opening values). Shape-based blocking bid, not strength."
          : "4♥ opening from opponent: preempt — 7-8 card heart suit, weak hand.";
      }
      return isPartner
        ? "4♥: game bid in hearts. Strong hand with a fit in hearts, usually 5+ hearts and 10+ total pts combined."
        : "4♥ from opponent: game pre-empt, 8-card heart suit.";
    case "4♠":
      if (bid === auctionOpeningBid) {
        return isPartner
          ? "4♠ OPENING: preemptive — a 7-8 card spade suit with a weak hand (under opening values). Shape-based blocking bid, not strength."
          : "4♠ opening from opponent: preempt — 7-8 card spade suit, weak hand.";
      }
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
      const who = isPartner ? "Partner's" : "The opponent's";
      // A NEGATIVE double requires that the DOUBLER'S OWN SIDE opened the
      // auction and an opponent then overcalled — i.e. the doubler's partner
      // already made a real bid.  A double of an opponent's OPENING (the
      // doubler's side has not bid) is a TAKEOUT double.  We can only tell the
      // two apart when the caller threads the doubler's partner's prior action:
      //   "none"        → partner is known silent → takeout
      //   a real bid    → partner opened → negative
      //   undefined     → unknown context → describe both possibilities
      const dpb = bidderPartnerPreviousBid;
      const doublerSideOpened =
        !!dpb &&
        dpb !== "none" &&
        dpb !== "Pass" &&
        dpb !== "Double" &&
        dpb !== "Redouble";
      const doublerPartnerKnownSilent = dpb === "none";
      const takeoutText = `${who} Takeout Double: a double of the opponents' bid showing opening values (12+) with shortness in that suit and support for the unbid suits — asking partner to bid their best unbid suit. (With 19+ balanced, the doubler plans to bid notrump next.)`;
      // The DOUBLER personally opened the auction (e.g. 1♦ ... Double): their
      // double is a REOPENING/OPTIONAL double, not negative and not pure
      // penalty — different story from a responder's double.
      const doublerWasOpener =
        !!auctionOpeningBid &&
        bidderPreviousBid === auctionOpeningBid &&
        isRealBid(auctionOpeningBid);
      const negativeText = `${who} Negative Double (Sputnik): their side opened and an opponent overcalled, so this double shows the UNBID suit(s) (often the unbid major[s]) — NOT penalty. About 6+ pts, asking partner to bid a best unbid suit.`;

      // The doubler's side opened in NOTRUMP: a double of the interference is
      // PENALTY (bidding stays natural over our own 1NT), never negative.
      if (doublerSideOpened && dpb!.endsWith("NT")) {
        return `${who} Penalty Double: their side opened ${dpb}, so a double of the interference is PENALTY — about 8+ HCP, often with length/strength in the overcalled suit. ${isPartner ? "Pass and collect unless you are very distributional." : "Their partner is expected to pass."}`;
      }
      // The DOUBLER personally bid NOTRUMP earlier (a 1NT overcall or
      // opening) and now doubles the opponents' runout: penalty-suggestive —
      // a MAXIMUM with their suit held, NOT takeout (the NT bid already
      // described the hand; there is no shortness to show).
      if (prevIsSuit && bidderPreviousBid?.endsWith("NT")) {
        return isPartner
          ? `${who} Double After Their Own ${bidderPreviousBid}: having already shown a balanced range, this double of the ${prevHighBid} runout is PENALTY-SUGGESTIVE — a maximum with their suit held. Pass and defend with most hands; pull only a bust with a long suit.`
          : `${who} Double After Their Own ${bidderPreviousBid}: they showed a balanced range earlier, so this double of the ${prevHighBid} runout shows a maximum with the suit held — penalty-suggestive; their partner usually passes.`;
      }
      if (prevIsSuit && prevLevel <= 2) {
        if (doublerWasOpener)
          return `${who === "Partner's" ? "Partner's" : "The opponent's"} Reopening Double: the opener doubling the overcall — extra values with tolerance for the unbid suits, inviting partner to bid a suit or convert to penalty with length in the overcalled suit.`;
        if (doublerSideOpened) return negativeText;
        if (doublerPartnerKnownSilent) return takeoutText;
        // Unknown who-opened context: describe both, leaning takeout.
        return "Likely a Takeout or Negative Double: after a low-level suit bid this shows the unbid suits, not penalty. If the doubler's side opened it is a negative double (~6+ pts); if the opponents opened it is a takeout double (12+ pts). Either way, bid your best unbid suit.";
      }
      // Above 2♠: the story depends on WHO doubles. The OPENER doubling the
      // opponents' preempt is OPTIONAL ("do something intelligent") — SAYC
      // treats doubles of preempts as takeout-flavored, not pure penalty.
      if (prevIsSuit && doublerWasOpener && prevLevel >= 3) {
        return `${who} Optional Double of the preempt: the opener showing EXTRA values (16+) with shortness in the preempt suit — "do something intelligent." Partner passes for penalty with trump tricks or a flat hand, or pulls to a long suit with shape. Doubles of preempts are takeout-flavored in SAYC, not pure penalty.`;
      }
      // A RESPONDER's double above 2♠: negative doubles are off, so it is
      // penalty-oriented, showing trump tricks and a desire to defend.
      if (prevIsSuit && doublerSideOpened) {
        return `${who} Penalty-Oriented Double: their side opened, but negative doubles apply only through 2♠ in SAYC — a double of ${prevHighBid} shows trump tricks and defensive values, suggesting the contract goes down. (Some pairs agree to play negative doubles through 3♠; check the partnership agreement.)`;
      }
      // The DOUBLER had previously OVERCALLED a suit: this later double shows
      // EXTRA values ("action double") — takeout-flavored, not pure penalty.
      if (
        prevIsSuit &&
        bidderPreviousBid &&
        /^[1-7][♠♥♦♣]$/.test(bidderPreviousBid) &&
        bidderPreviousBid !== auctionOpeningBid
      ) {
        return isPartner
          ? `${who} Action Double: having already overcalled ${bidderPreviousBid}, this double shows a MAXIMUM hand with extra values — takeout-flavored ("do something"). Bid a suit with shape, or pass to defend with length in their suit.`
          : `${who} Action Double: they overcalled ${bidderPreviousBid} earlier, so this double shows extra values (a maximum overcall) inviting their partner to bid or defend — not pure penalty.`;
      }
      // A higher-level suit double from PARTNER is treated as takeout (modern
      // style doubles of suit contracts through ~4 of a minor are takeout-ish).
      if (isPartner && prevIsSuit) {
        return takeoutText;
      }
      // No suit context at all: a bare double from partner reads as takeout by
      // default; from an opponent it reads as penalty.
      if (!prevHighBid) {
        return isPartner
          ? takeoutText
          : "Penalty Double: opponent believes they can defeat the contract — shows strong holdings in the bid suit.";
      }
      if (prevHighBid.includes("NT")) {
        // A double of a 1NT RESPONSE (their side opened a suit first) is a
        // STRENGTH double, not penalty of a 6-10 bid.
        if (
          prevHighBid === "1NT" &&
          auctionOpeningBid &&
          /^[1-7][♠♥♦♣]$/.test(auctionOpeningBid)
        ) {
          return isPartner
            ? "Partner's Strength Double of the 1NT response: their 1NT showed only 6-10, so this double announces a very strong hand (16+, often more) — bid your best unbid suit; partner will describe further (a notrump rebid shows 19-21 balanced)."
            : "The opponent's Strength Double of the 1NT response: a very strong hand (16+), asking their partner to bid — not a penalty double of the 6-10 response.";
        }
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

/**
 * True when `doublerSeat`'s most recent Double was a LEAD-DIRECTING double of
 * the opponents' Stayman 2♣: the real bid immediately before the Double was
 * 2♣, and the auction's opening bid was 1NT by an opponent of the doubler.
 */
function wasDoubleOfStayman(
  completedRounds: BidRound[],
  currentRound: BidRound,
  myPosition: BiddingPosition,
  doublerSeat: BiddingPosition,
): boolean {
  const flat: { seat: BiddingPosition; call: string }[] = [];
  for (const r of completedRounds) {
    for (const p of POSITIONS) {
      const b = r[p];
      if (b !== undefined) flat.push({ seat: p, call: b });
    }
  }
  for (const p of POSITIONS) {
    if (p < myPosition && currentRound[p] !== undefined)
      flat.push({ seat: p, call: currentRound[p]! });
  }
  let dblIdx = -1;
  for (let i = flat.length - 1; i >= 0; i--) {
    if (flat[i].seat === doublerSeat && flat[i].call === "Double") {
      dblIdx = i;
      break;
    }
  }
  if (dblIdx < 0) return false;
  let prevReal: { seat: BiddingPosition; call: string } | undefined;
  for (let i = dblIdx - 1; i >= 0; i--) {
    if (isRealBid(flat[i].call)) {
      prevReal = flat[i];
      break;
    }
  }
  if (!prevReal || prevReal.call !== "2♣") return false;
  const openingEntry = flat.find((e) => isRealBid(e.call));
  if (!openingEntry || openingEntry.call !== "1NT") return false;
  const doublerPartner = getRelatives(doublerSeat).partner;
  return (
    openingEntry.seat !== doublerSeat && openingEntry.seat !== doublerPartner
  );
}

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
    (myBid === "2♣" && priorPartnerBid === "1NT") ||
    (myBid === "3♣" && priorPartnerBid === "2NT")
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
  if (after1NT && (myBid === "2♦" || myBid === "2♥")) return true;
  if (after2NT && (myBid === "3♦" || myBid === "3♥")) return true;
  if (after1NT && myBid === "2♠") return true; // minor transfer
  return false;
}

/** Returns true if the last bid in BID_ORDER sense is a jump overcall */
/**
 * Returns true if partnerBid is a JUMP overcall — i.e. partnerBid is at a
 * level higher than the cheapest legal overcall in that strain at the moment
 * the bid was made.
 *
 * The "auction floor" is the highest suit/NT bid in the auction BEFORE
 * partner's overcall.  Pass in the actual floor — measuring against just the
 * original opener's bid is wrong when intervening bids have raised the floor
 * (e.g. 1♠–Pass–2♠–3♣: 3♣ is the cheapest club bid over 2♠, so it's a SIMPLE
 * overcall, not a jump, even though it's two levels above the natural
 * minimum 2♣ over the original 1♠).
 */
function isJumpOvercall(partnerBid: string, auctionFloor: string): boolean {
  const pIdx = BID_ORDER.indexOf(partnerBid);
  const fIdx = BID_ORDER.indexOf(auctionFloor);
  if (pIdx < 0 || fIdx < 0) return false;

  // Cheapest legal bid in partner's strain that is strictly above the floor.
  const suitSuffix = partnerBid.slice(1); // "♥", "♠", "♦", "♣", "NT"
  const minOvercallIdx = BID_ORDER.findIndex(
    (bid, i) => i > fIdx && bid.endsWith(suitSuffix),
  );
  if (minOvercallIdx < 0) return false;

  return pIdx > minOvercallIdx;
}

/**
 * Returns the highest suit/NT bid that occurred in the auction BEFORE the
 * specified seat's most recent bid.  This is what "auction floor" means at
 * the moment of that bid.  Returns undefined if no prior suit/NT bid exists.
 */
/**
 * Identifies which seat OPENED the auction (made its first real bid).
 * Scans for the first round containing a real bid; within that round the
 * opening bid is the LOWEST real bid (all later bids in a round must be
 * higher), which makes this robust regardless of seat ordering.
 */
function findAuctionOpenerSeat(
  completedRounds: BidRound[],
  currentRound: BidRound,
  myPosition: BiddingPosition,
): BiddingPosition | undefined {
  const cur: BidRound = {};
  for (const p of POSITIONS) if (p < myPosition) cur[p] = currentRound[p];
  for (const r of [...completedRounds, cur]) {
    const real = POSITIONS.filter((p) => isRealBid(r[p]));
    if (real.length > 0) {
      let best = real[0];
      for (const p of real) {
        if (BID_ORDER.indexOf(r[p]!) < BID_ORDER.indexOf(r[best]!)) best = p;
      }
      return best;
    }
  }
  return undefined;
}

function auctionFloorBeforeSeatBid(
  completedRounds: BidRound[],
  currentRound: BidRound,
  seat: BiddingPosition,
  seatBid: string,
): string | undefined {
  let lastSuitBid: string | undefined;
  for (let r = 0; r < completedRounds.length; r++) {
    for (const s of POSITIONS) {
      if (s === seat && completedRounds[r][s] === seatBid) return lastSuitBid;
      const b = completedRounds[r][s];
      if (b && b !== "Pass" && b !== "Double" && b !== "Redouble") {
        lastSuitBid = b;
      }
    }
  }
  for (const s of POSITIONS) {
    if (s === seat && currentRound[s] === seatBid) return lastSuitBid;
    const b = currentRound[s];
    if (b && b !== "Pass" && b !== "Double" && b !== "Redouble") {
      lastSuitBid = b;
    }
  }
  return lastSuitBid;
}

/**
 * True when MY most recent real bid is the standing contract and every call
 * since (around to my current turn) has been a Pass — i.e. the auction has been
 * passed out in my contract and I should simply pass.  Works regardless of
 * whether partner's "latest bid" resolves to a stale earlier bid, so it must be
 * checked BEFORE role-based routing (which can misread a stale opening as a new
 * suit to act on).
 */
function isMyBidPassedOut(
  completedRounds: BidRound[],
  currentRound: BidRound,
  myPosition: BiddingPosition,
  myLastBid: string | undefined,
): boolean {
  if (!myLastBid) return false;
  // The auction must be FORMALLY complete (three consecutive real passes after a
  // bid) AND the seat holding the final contract must be me.  Requiring true
  // completion distinguishes a genuine pass-out from a forcing bid still
  // awaiting partner's reply (e.g. a Jacoby transfer or a Blackwood ask, where
  // the passes have not gone all the way around).  getFinalContractInfo /
  // ...DeclarerSeat order calls by real bidding sequence, robust to who opened.
  const { isComplete, finalContract } = getFinalContractInfo(
    completedRounds,
    currentRound,
    myPosition,
  );
  if (!isComplete || !finalContract) return false;
  const declarerSeat = getFinalContractDeclarerSeat(
    completedRounds,
    currentRound,
    myPosition,
  );
  return declarerSeat === myPosition && finalContract === myLastBid;
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

  // Track any non-pass action by myPosition, including Double/Redouble.
  // isRealBid excludes these, so myBids misses them — but we still need to know
  // whether I've already acted (e.g. doubled) so we don't re-route to a first-bid
  // situation and accidentally recommend doubling my own partner.
  const myLastNonPassAction: string | undefined = (() => {
    // Walk backwards through completed rounds + currentRound
    const allRounds = [
      ...completedRounds,
      currentRound as { [k: number]: string | undefined },
    ];
    for (let i = allRounds.length - 1; i >= 0; i--) {
      const b = allRounds[i][myPosition];
      if (b && b !== "Pass") return b;
    }
    return undefined;
  })();

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
    // ── Passed out in MY contract (checked FIRST) ──────────────────────────────
    // If my last real bid is the standing contract and everyone has passed since,
    // the auction is over.  This must precede role-routing: otherwise a stale
    // "partnerBid" (e.g. partner's opening before my NT response, now passed) is
    // misread as a fresh suit to support — producing phantom bids like raising to
    // a minor-suit game.
    if (
      isMyBidPassedOut(completedRounds, currentRound, myPosition, myLastBid)
    ) {
      return {
        situation: "auction-passed-out",
        myPreviousBid: myLastBid,
        vulnerability: vul,
      };
    }

    // My most recent bid determines the situation
    const prevPartnerResponse = prevPartnerBid;

    // Convention follow-ups — what did I bid LAST?
    // A JACOBY 2NT auction agrees the OPENED MAJOR — later suit bids by our
    // side (3-level shortness replies, 4-level side-suit shows) are
    // ARTIFICIAL and must never be read as the agreed suit.
    const jacobyAgreedMajor = (() => {
      const firstRealOf = (p: BiddingPosition): string | undefined => {
        for (const r of completedRounds) {
          const b = r[p];
          if (isRealBid(b)) return b;
        }
        return undefined;
      };
      const mine = firstRealOf(myPosition);
      const partners = firstRealOf(partner);
      if ((mine === "1♥" || mine === "1♠") && partners === "2NT")
        return mine.slice(1);
      if ((partners === "1♥" || partners === "1♠") && mine === "2NT")
        return partners.slice(1);
      return undefined;
    })();
    if (myLastBid === "4NT") {
      // Agreed suit: explicit override, else the Jacoby major, else the last
      // real SUIT bid by our side before the 4NT ask (never a blanket
      // "spades" default downstream).
      const ourSuitBids4NT = completedRounds
        .flatMap((r) => [r[myPosition], r[partner]])
        .filter((b): b is string => isRealBid(b) && !b.endsWith("NT"));
      const derivedAgreed4NT = ourSuitBids4NT.length
        ? ourSuitBids4NT[ourSuitBids4NT.length - 1].slice(1)
        : undefined;
      return {
        situation: "blackwood-response",
        partnerBid,
        vulnerability: vul,
        agreedSuit: agreedSuit ?? jacobyAgreedMajor ?? derivedAgreed4NT,
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
        // Agreed suit: the last real SUIT bid by our side before the 4NT ask.
        const ourSuitBids = completedRounds
          .flatMap((r) => [r[myPosition], r[partner]])
          .filter((b): b is string => isRealBid(b) && !b.endsWith("NT"));
        const derivedAgreed = ourSuitBids.length
          ? ourSuitBids[ourSuitBids.length - 1].slice(1)
          : undefined;
        // Partner's ACE response was their real bid before the current kings
        // reply (typically last completed round).
        const partnerReal = completedRounds
          .map((r) => r[partner])
          .filter(isRealBid);
        const partnerAceResponse = partnerReal
          .filter((b) => /^5[♣♦♥♠]$/.test(b))
          .slice(-1)[0];
        return {
          situation: "blackwood-kings",
          partnerBid,
          vulnerability: vul,
          agreedSuit: agreedSuit ?? jacobyAgreedMajor ?? derivedAgreed,
          partnerAceResponse,
        };
      }
      return { situation: "grand-slam-force", vulnerability: vul };
    }

    // Find what partner opened (their last real bid BEFORE my first real bid).
    // Walk the auction strictly in seat order (round → seat 1..4) and stop the
    // moment we reach my first bid; the most recent partner bid before that
    // point is the answer.  Crucially, if partner sits AFTER me in the same
    // round as my first bid, their bid in that round came LATER and must NOT
    // be returned (the previous bug: a weak-2 opener in seat 1 was reading
    // partner's same-round 2NT as if it had preceded the opening, causing
    // wasTransfer("2♥","2NT") to fire incorrectly).
    // After partner's strong 2♣ (and 2NT rebid), my artificial 2♦ WAITING
    // response is not a convention bid — the Stayman/transfer analysis
    // applies to my NEXT bid, made over the 2NT.
    const partnerOpened2CConv = (() => {
      for (const r of completedRounds) {
        const b = r[partner];
        if (b && isRealBid(b)) return b === "2♣";
        if (b && b !== "Pass") return false;
      }
      return false;
    })();
    const myBidsConv =
      partnerOpened2CConv && myBids[0] === "2♦" ? myBids.slice(1) : myBids;
    const myFirstBid = myBidsConv[0];
    const partnerBidBeforeMe = (() => {
      if (myFirstBid === undefined) return undefined;
      let lastPartnerBidSoFar: string | undefined;
      for (let r = 0; r < completedRounds.length; r++) {
        for (const seat of POSITIONS) {
          // Stop the moment we see my first real bid — anything later is not
          // "before me" even if it's earlier in seat order in a later round.
          if (seat === myPosition && completedRounds[r][seat] === myFirstBid) {
            return lastPartnerBidSoFar;
          }
          if (seat === partner) {
            const b = completedRounds[r][partner];
            if (b && b !== "Pass") lastPartnerBidSoFar = b;
          }
        }
      }
      return lastPartnerBidSoFar;
    })();

    // Stayman / Transfer follow-ups apply ONLY when my Stayman/transfer bid
    // is still my MOST RECENT bid (i.e., partner just replied and now it's my
    // turn).  Once I've already made a follow-up bid (e.g. 2NT inviting after
    // a Stayman denial), I'm in a normal rebid situation and the Stayman
    // routing must NOT fire again — otherwise the engine tries to recommend
    // the same 2NT it already bid, then falls back to Pass with confusing
    // reasoning.
    const stillInStaymanFollowUpSeat = myBidsConv.length === 1;
    // Stayman/transfers are OFF once an opponent made a real bid between
    // partner's NT and my call — my 2♣/2♦/2♥/2♠ was then NATURAL (an escape),
    // so the convention follow-up handlers must not fire.
    const systemsWereOnForMyBid = (() => {
      if (myFirstBid === undefined) return true;
      const flatSys: { seat: BiddingPosition; call: string }[] = [];
      for (const r of completedRounds) {
        for (const p of POSITIONS) {
          const b = r[p];
          if (b !== undefined) flatSys.push({ seat: p, call: b });
        }
      }
      const myIdxSys = flatSys.findIndex(
        (e) => e.seat === myPosition && e.call === myFirstBid,
      );
      if (myIdxSys < 0) return true;
      let ntIdxSys = -1;
      for (let i = myIdxSys - 1; i >= 0; i--) {
        if (flatSys[i].seat === partner && isRealBid(flatSys[i].call)) {
          ntIdxSys = i;
          break;
        }
      }
      if (ntIdxSys < 0) return true;
      for (let i = ntIdxSys + 1; i < myIdxSys; i++) {
        if (
          flatSys[i].seat !== partner &&
          flatSys[i].seat !== myPosition &&
          isRealBid(flatSys[i].call)
        )
          return false;
      }
      return true;
    })();
    if (
      stillInStaymanFollowUpSeat &&
      systemsWereOnForMyBid &&
      wasStayman(myFirstBid ?? "", partnerBidBeforeMe)
    ) {
      // Find the original Stayman reply (the first real bid partner made AFTER my 2♣).
      // In seat order: if partner sits before me (e.g. partner=1, me=3), their Stayman
      // reply is in the round AFTER the round containing my 2♣.
      // If partner sits after me (e.g. partner=4, me=3 — rare), it's in the same round.
      // `partnerBid` (from latestBid) may already be a later continuation (e.g. 2NT
      // declining an invitation) — we need the first reply separately.
      const staymanReply = (() => {
        for (let i = 0; i < completedRounds.length; i++) {
          // myFirstBid is the Stayman bid itself: 2♣ over 1NT, 3♣ over 2NT.
          if (completedRounds[i][myPosition] === myFirstBid) {
            if (partner < myPosition) {
              // Partner bids before me in each round — their Stayman reply is in the
              // NEXT completed round (round i+1), or in currentRound if not yet completed.
              const nextRound = completedRounds[i + 1]?.[partner];
              if (nextRound && nextRound !== "Pass") return nextRound;
              const inCurrent = currentRound[partner];
              if (inCurrent && inCurrent !== "Pass") return inCurrent;
            } else {
              // Partner bids after me — reply is in the same round.
              const sameRound = completedRounds[i][partner];
              if (sameRound && sameRound !== "Pass") return sameRound;
            }
          }
        }
        return undefined;
      })();
      // If partner has since made a continuation bid (e.g. 2NT after 2♦-2♠), store it.
      const staymanContinuation =
        staymanReply && partnerBid !== staymanReply ? partnerBid : undefined;
      return {
        situation: "stayman-response",
        partnerBid: staymanReply ?? partnerBid,
        partnerContinuation: staymanContinuation,
        // The NT opening Stayman was used over (1NT or 2NT) — the follow-up
        // ranges and levels depend on it.
        partnerFirstBid: partnerBidBeforeMe,
        vulnerability: vul,
      };
    }
    if (
      stillInStaymanFollowUpSeat &&
      systemsWereOnForMyBid &&
      wasTransfer(myFirstBid ?? "", partnerBidBeforeMe)
    ) {
      const transferred = myFirstBid === "2♠" ? "minor" : "major";
      if (transferred === "minor") {
        return {
          situation: "minor-transfer-response",
          partnerBid,
          vulnerability: vul,
        };
      }
      return {
        situation: "transfer-response",
        partnerBid,
        partnerFirstBid: partnerBidBeforeMe,
        vulnerability: vul,
        ...(partnerOpened2CConv && { after2COpening: true }),
      };
    }

    // Opener/responder rebids — any NT bid goes to the NT rebid handler.
    // EXCEPTION: if partner opened a suit *before* my NT response, partner's current
    // bid is a natural suit showing — route to the responder-specific handler.
    {
      // Route NT rebids by ROLE: the auction's opener gets rebid-after-nt,
      // the opener's partner gets responder-nt-rebid, and when the OPPONENTS
      // opened we fall through to the role-aware router below (advancer /
      // overcaller logic) instead of misapplying opener semantics.
      const ntOpenerSeat = findAuctionOpenerSeat(
        completedRounds,
        currentRound,
        myPosition,
      );
      if (
        myLastBid.endsWith("NT") &&
        ntOpenerSeat !== lho &&
        ntOpenerSeat !== rho
      ) {
        // Detect if partner had a prior suit bid that's a natural showing
        // (rather than a convention ack like 2♣ Stayman over my 1NT).
        const partnerOpenedSuitBeforeMyNT =
          ntOpenerSeat === partner &&
          completedRounds
            // Partner's bid in the round of my NT came BEFORE mine when they
            // sit earlier in the rotation — include that round in the scan.
            .slice(
              0,
              partner < myPosition
                ? completedRounds.length
                : completedRounds.length - 1,
            )
            .some((r) => {
              const b = r[partner];
              return b && b !== "Pass" && !b.endsWith("NT");
            });

        if (partnerOpenedSuitBeforeMyNT) {
          let ntPartnerFirstBid: string | undefined;
          for (const r of completedRounds) {
            const b = r[partner];
            if (isRealBid(b)) {
              ntPartnerFirstBid = b;
              break;
            }
          }
          return {
            situation: "responder-nt-rebid",
            myPreviousBid: myLastBid,
            partnerBid,
            partnerFirstBid: ntPartnerFirstBid,
            vulnerability: vul,
          };
        }
        // Did an OPPONENT make a real bid BEFORE partner's latest response?
        // Only then are Stayman/transfers off for that response.
        const systemsOff = (() => {
          if (!partnerBid || !isRealBid(partnerBid)) return false;
          const floorBefore = auctionFloorBeforeSeatBid(
            completedRounds,
            currentRound,
            partner,
            partnerBid,
          );
          // floorBefore is the last real bid before partner's response; if it
          // was made by an opponent (i.e. it isn't one of MY bids), systems off.
          if (floorBefore && !new Set(myBids).has(floorBefore)) return true;
          // An opponent's DOUBLE of my NT bid also kills the systems —
          // partner's suit bids become natural ESCAPES, never transfers.
          const flatSO: { seat: BiddingPosition; call: string }[] = [];
          for (const r of completedRounds) {
            for (const p of POSITIONS) {
              const b = r[p];
              if (b !== undefined) flatSO.push({ seat: p, call: b });
            }
          }
          for (const p of POSITIONS) {
            if (p < myPosition && currentRound[p] !== undefined)
              flatSO.push({ seat: p, call: currentRound[p]! });
          }
          let myNTIdxSO = -1;
          for (let i = flatSO.length - 1; i >= 0; i--) {
            if (
              flatSO[i].seat === myPosition &&
              flatSO[i].call.endsWith("NT")
            ) {
              myNTIdxSO = i;
              break;
            }
          }
          if (myNTIdxSO < 0) return false;
          for (let i = myNTIdxSO + 1; i < flatSO.length; i++) {
            const e = flatSO[i];
            if (e.seat === partner && isRealBid(e.call)) break;
            if (
              e.seat !== partner &&
              e.seat !== myPosition &&
              e.call === "Double"
            )
              return true;
          }
          return false;
        })();
        // Only partner calls made AFTER my NT bid are a response to it — a
        // stale Double from earlier rounds must not read as "partner doubled
        // the interference over my NT".
        const partnerCallAfterMyNT = (() => {
          const flatNTR: { seat: BiddingPosition; call: string }[] = [];
          for (const r of completedRounds) {
            for (const p of POSITIONS) {
              const b = r[p];
              if (b !== undefined) flatNTR.push({ seat: p, call: b });
            }
          }
          for (const p of POSITIONS) {
            if (p < myPosition && currentRound[p] !== undefined)
              flatNTR.push({ seat: p, call: currentRound[p]! });
          }
          let myIdxNTR = -1;
          for (let i = flatNTR.length - 1; i >= 0; i--) {
            if (
              flatNTR[i].seat === myPosition &&
              flatNTR[i].call === myLastBid
            ) {
              myIdxNTR = i;
              break;
            }
          }
          for (let i = flatNTR.length - 1; i > myIdxNTR; i--) {
            if (flatNTR[i].seat === partner && flatNTR[i].call !== "Pass")
              return flatNTR[i].call;
          }
          return undefined;
        })();
        return {
          situation: "rebid-after-nt",
          myPreviousBid: myLastBid,
          partnerBid:
            partnerCallAfterMyNT ??
            (partnerBid === "Double" ? "Pass" : partnerBid),
          vulnerability: vul,
          systemsOff,
        };
      }
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

    // NT-range opener continuing after a Stayman/Transfer response they
    // already answered: a 1NT/2NT opening, or a strong 2♣ whose 2NT rebid
    // turned systems on one level up.  Exclude Blackwood/Gerber NT bids.
    const iAmNTRangeOpener =
      (myFirstBid?.endsWith("NT") &&
        myFirstBid !== "4NT" &&
        myFirstBid !== "5NT") ||
      (myFirstBid === "2♣" && myBids[1] === "2NT");
    if (iAmNTRangeOpener && myBids.length >= 2) {
      // My conventions sit at the 2NT level when 2NT was my opening OR my
      // rebid after the strong 2♣.
      const myNTIsTwoNT =
        myFirstBid === "2NT" || (myFirstBid === "2♣" && myBids[1] === "2NT");
      // Detect whether MY LATEST bid was a transfer completion: find what
      // partner bid in the round I made it — a transfer prompt (2♦→♥, 2♥→♠;
      // one level up over 2NT) flags suit-game preference logic rather than
      // the Stayman "no fit" logic.  (A 2♦ WAITING response to 2♣ is NOT a
      // transfer — only the 3-level prompts count for the 2♣-then-2NT hand.)
      const wasTransferCompletion = (() => {
        for (let i = 0; i < completedRounds.length; i++) {
          if (completedRounds[i][myPosition] === myLastBid) {
            const promptBid =
              partner < myPosition
                ? completedRounds[i][partner]
                : completedRounds[i - 1]?.[partner];
            return (
              (myFirstBid === "1NT" &&
                (promptBid === "2♦" || promptBid === "2♥")) ||
              (myNTIsTwoNT && (promptBid === "3♦" || promptBid === "3♥"))
            );
          }
        }
        return false;
      })();
      // Has partner bid since MY convention answer?  If not (e.g. they
      // transferred weak and the OPPONENTS competed), partner is limited —
      // the handler must not bid on unilaterally.
      const staymanPartnerNothingNew = (() => {
        const flatSO: { seat: BiddingPosition; call: string }[] = [];
        for (const r of completedRounds) {
          for (const p of POSITIONS) {
            const b = r[p];
            if (b !== undefined) flatSO.push({ seat: p, call: b });
          }
        }
        for (const p of POSITIONS) {
          if (p < myPosition && currentRound[p] !== undefined)
            flatSO.push({ seat: p, call: currentRound[p]! });
        }
        const lastRealIdxSO = (seat: BiddingPosition) => {
          for (let i = flatSO.length - 1; i >= 0; i--) {
            if (flatSO[i].seat === seat && isRealBid(flatSO[i].call)) return i;
          }
          return -1;
        };
        const mineSO = lastRealIdxSO(myPosition);
        const partnerSO = lastRealIdxSO(partner);
        return partnerSO >= 0 && mineSO >= 0 && partnerSO < mineSO;
      })();
      return {
        situation: "stayman-opener-rebid",
        myPreviousBid: myLastBid,
        partnerBid,
        vulnerability: vul,
        wasTransferCompletion,
        ...(staymanPartnerNothingNew && { partnerHasNothingNew: true }),
      };
    }
    // Jacoby 2NT applies ONLY when MY 1♥/1♠ was the auction's OPENING bid.
    // A responder's 1♠ followed by partner's natural 2NT jump rebid (18-19)
    // must NOT be read as Jacoby.
    const iOpenedTheAuction =
      findAuctionOpenerSeat(completedRounds, currentRound, myPosition) ===
      myPosition;
    if (
      prevPartnerResponse === "2NT" &&
      (myLastBid === "1♥" || myLastBid === "1♠") &&
      iOpenedTheAuction
    ) {
      return {
        situation: "jacoby-2nt-opener",
        myPreviousBid: myLastBid,
        vulnerability: vul,
      };
    }
    if (
      (prevPartnerBid === "Double" ||
        prevPartnerResponse === "Double" ||
        // Partner's negative double may sit several rounds back (they passed
        // since while the opponents kept raising) — it is still the context my
        // rebid answers as long as it is their latest non-pass action.
        partnerBid === "Double") &&
      // A NEGATIVE double exists only when MY SIDE opened and I am the opener
      // — an advancer whose partner made a TAKEOUT double belongs elsewhere.
      findAuctionOpenerSeat(completedRounds, currentRound, myPosition) ===
        myPosition
    ) {
      // Two DIFFERENT bids matter here and must not be conflated:
      //   • the bid partner actually DOUBLED (the real bid immediately before
      //     their Double) — this decides negative-vs-penalty (through 2♠);
      //   • the opponents' HIGHEST bid — the floor the rebid must clear.
      const oppRealBids = [lhoBid, rhoBid].filter((b): b is string =>
        isRealBid(b),
      );
      const highestOpp =
        oppRealBids.length > 0
          ? oppRealBids.sort(
              (a, b) => BID_ORDER.indexOf(b) - BID_ORDER.indexOf(a),
            )[0]
          : rhoBid;
      const doubledBid = (() => {
        const flatND: { seat: BiddingPosition; call: string }[] = [];
        for (const r of completedRounds) {
          for (const p of POSITIONS) {
            const b = r[p];
            if (b !== undefined) flatND.push({ seat: p, call: b });
          }
        }
        for (const p of POSITIONS) {
          if (p < myPosition && currentRound[p] !== undefined)
            flatND.push({ seat: p, call: currentRound[p]! });
        }
        for (let i = flatND.length - 1; i >= 0; i--) {
          if (flatND[i].seat === partner && flatND[i].call === "Double") {
            for (let j = i - 1; j >= 0; j--) {
              if (isRealBid(flatND[j].call)) return flatND[j].call;
            }
            return undefined;
          }
        }
        return undefined;
      })();
      return {
        situation: "rebid-after-negative-double",
        myPreviousBid: myLastBid,
        rhoBid: highestOpp,
        vulnerability: vul,
        ...(doubledBid && { doubledBid }),
      };
    }

    // Detect Blackwood kings sign-off: my last bid was a kings response (6♣/6♦/6♥/6♠)
    // and partner has now bid a slam contract in our agreed suit.  This is NOT an
    // invitation — partner is simply signing off after the kings ask.  Pass.
    const blackwoodKingsResponses = ["6♣", "6♦", "6♥", "6♠"];
    if (
      myLastBid &&
      blackwoodKingsResponses.includes(myLastBid) &&
      partnerBid &&
      /^[67][♠♥♦♣]$/.test(partnerBid)
    ) {
      return {
        situation: "blackwood-kings",
        myPreviousBid: myLastBid,
        partnerBid,
        agreedSuit: partnerBid.slice(1), // "♠" from "6♠" — mark as sign-off in agreed suit
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
      // Only a TRUE jump is an invitation — EXCEPT when the "floor" that made
      // partner's rebid the cheapest legal bid was OUR OWN side's call (e.g.
      // 1♣-1♥-2♥-3♥: the 3♥ re-raise over my 2♥ raise is still the classic
      // invitation).  Only an OPPONENT's interference demotes the rebid to
      // mere competition.
      const floorBeforePartnerBid = auctionFloorBeforeSeatBid(
        completedRounds,
        currentRound,
        partner,
        partnerBid,
      );
      const isTrueJump = (() => {
        if (!floorBeforePartnerBid) return true;
        const floorIdx = BID_ORDER.indexOf(floorBeforePartnerBid);
        const cheapest = BID_ORDER.find(
          (b, i) => i > floorIdx && b.endsWith(partnerSuitSym),
        );
        if (cheapest !== partnerBid) return true;
        // Cheapest-legal rebid: invitation stands if the floor bid was ours.
        const flatInv: { seat: BiddingPosition; call: string }[] = [];
        for (const r of completedRounds) {
          for (const p of POSITIONS) {
            const b = r[p];
            if (b !== undefined) flatInv.push({ seat: p, call: b });
          }
        }
        for (const p of POSITIONS) {
          if (p < myPosition && currentRound[p] !== undefined)
            flatInv.push({ seat: p, call: currentRound[p]! });
        }
        let pIdxInv = -1;
        for (let i = flatInv.length - 1; i >= 0; i--) {
          if (flatInv[i].seat === partner && flatInv[i].call === partnerBid) {
            pIdxInv = i;
            break;
          }
        }
        for (let i = pIdxInv - 1; i >= 0; i--) {
          if (isRealBid(flatInv[i].call)) {
            // The our-side exception applies only when OUR floor bid was in
            // partner's OWN suit (a raise, e.g. 1♣-1♥-2♥-3♥).  If my bid was
            // a DIFFERENT suit (e.g. a reverse), partner was FORCED to this
            // level — their cheapest same-suit rebid shows weakness, not an
            // invitational jump.
            return (
              (flatInv[i].seat === myPosition || flatInv[i].seat === partner) &&
              !flatInv[i].call.endsWith("NT") &&
              flatInv[i].call.slice(1) === partnerSuitSym
            );
          }
        }
        return false;
      })();
      // A bid at or above GAME level is a placement/acceptance, never an
      // invitation (invitations by definition stop below game).
      const partnerGameLvl =
        partnerSuitSym === "♥" || partnerSuitSym === "♠" ? 4 : 5;
      if (
        partnerPrevSuitLevel >= 0 &&
        partnerBidLevel > partnerPrevSuitLevel + 1 &&
        partnerBidLevel < partnerGameLvl &&
        isTrueJump
      ) {
        // Was partner the auction's OPENER, or an overcaller?  Their invite
        // reads differently (opener rebid ladder vs 14-15 overcall).
        const inviteOpenerSeat = findAuctionOpenerSeat(
          completedRounds,
          currentRound,
          myPosition,
        );
        return {
          situation: "respond-to-partner-invitation",
          myPreviousBid: myLastBid,
          partnerBid,
          vulnerability: vul,
          ...(inviteOpenerSeat !== partner &&
            inviteOpenerSeat !== myPosition && {
              partnerWasOvercaller: true,
            }),
          // Partner OPENED: their jump rebid is the 16-18 opener invite and
          // I am the responder — a different ladder from a responder invite.
          ...(inviteOpenerSeat === partner && { partnerOpened: true }),
        };
      }
    }

    // ── I DOUBLED earlier (reopening/takeout) and partner has since responded —
    // continue as the doubler, never as an opener reading a free raise.
    if (
      (myLastNonPassAction === "Double" ||
        myLastNonPassAction === "Redouble") &&
      isRealBid(partnerBid)
    ) {
      const aodOpp = [lhoBid, rhoBid]
        .filter((b): b is string => isRealBid(b))
        .sort((a, b) => BID_ORDER.indexOf(b) - BID_ORDER.indexOf(a))[0];
      return {
        situation: "after-own-double",
        partnerBid,
        rhoBid: aodOpp,
        vulnerability: vul,
      };
    }

    // ── Advancer of partner's TAKEOUT DOUBLE, rebidding ────────────────────────
    // The opponents opened, partner's only action is a Double, and I already
    // advanced once — my advance said it all; route to the advancer fallback
    // instead of the opener handlers below.
    {
      const advOpenerSeat = findAuctionOpenerSeat(
        completedRounds,
        currentRound,
        myPosition,
      );
      if (
        partnerBid === "Double" &&
        (advOpenerSeat === lho || advOpenerSeat === rho) &&
        isRealBid(myLastBid)
      ) {
        return {
          situation: "advancer-rebid",
          myPreviousBid: myLastBid,
          partnerBid: undefined,
          partnerFirstBid: undefined,
          lhoBid,
          rhoBid,
          vulnerability: vul,
        };
      }
    }

    // ── Role-aware routing for later turns ─────────────────────────────────────
    // Everything below this block assumes OPENER semantics (e.g. "1NT rebid =
    // 12-14").  Work out who actually opened the auction; if it was an
    // opponent, I am the overcaller or the advancer; if it was partner, I am
    // the responder.  Each of those roles gets its own rebid logic.
    {
      const openerSeat = findAuctionOpenerSeat(
        completedRounds,
        currentRound,
        myPosition,
      );
      // Partner's first real bid (their original overcall / opening / response)
      let partnerFirstBid: string | undefined;
      for (const r of completedRounds) {
        const b = r[partner];
        if (isRealBid(b)) {
          partnerFirstBid = b;
          break;
        }
      }
      const opponentsOpened = openerSeat === lho || openerSeat === rho;
      // I am the ADVANCER only if partner's first real bid (the overcall) came
      // BEFORE my own first real bid.  If I bid first, I am the overcaller and
      // partner is responding to ME.
      // Chronology proxy: earlier round first; within a round the LOWER bid
      // came first (legal auctions ascend within a round).  For PARTNER, a
      // Double/Redouble also counts as their first action — answering
      // partner's takeout double makes me the ADVANCER, not an overcaller.
      const firstActionTurn = (
        p: BiddingPosition,
        includeDoubles: boolean,
      ): number => {
        for (let r = 0; r < completedRounds.length; r++) {
          const b = completedRounds[r][p];
          if (isRealBid(b)) return r * 100 + BID_ORDER.indexOf(b);
          if (includeDoubles && (b === "Double" || b === "Redouble"))
            return r * 100; // earliest possible slot in the round
        }
        const cb = currentRound[p];
        if (p < myPosition && isRealBid(cb))
          return completedRounds.length * 100 + BID_ORDER.indexOf(cb);
        if (
          p < myPosition &&
          includeDoubles &&
          (cb === "Double" || cb === "Redouble")
        )
          return completedRounds.length * 100;
        return Number.MAX_SAFE_INTEGER;
      };
      const iAmAdvancer =
        opponentsOpened &&
        firstActionTurn(partner, true) <= firstActionTurn(myPosition, false);

      if (
        opponentsOpened &&
        iAmAdvancer &&
        partnerBid &&
        isRealBid(partnerBid)
      ) {
        return {
          situation: "advancer-rebid",
          myPreviousBid: myLastBid,
          partnerBid,
          partnerFirstBid,
          lhoBid,
          rhoBid,
          vulnerability: vul,
        };
      }
      if (
        opponentsOpened &&
        !iAmAdvancer &&
        partnerBid &&
        isRealBid(partnerBid)
      ) {
        // Systems apply over a 1NT OVERCALL (same as over a 1NT opening):
        // partner's 2♣ is Stayman and 2♦/2♥ are transfers.  The overcaller
        // MUST answer them — never treat them as natural, passable advances.
        if (
          myBids.length === 1 &&
          myBids[0] === "1NT" &&
          ["2♣", "2♦", "2♥"].includes(partnerBid)
        ) {
          return {
            situation: "rebid-after-nt",
            myPreviousBid: myLastBid,
            partnerBid,
            vulnerability: vul,
          };
        }
        // I overcalled; partner has advanced.  Opener semantics do not apply.
        // The opponents' opening suit identifies partner's cuebid.
        const openerFirstBid = (() => {
          for (const r of completedRounds) {
            for (const p of POSITIONS) {
              const b = r[p];
              if (isRealBid(b)) return b;
            }
          }
          return undefined;
        })();
        // Partner silent since my latest real bid → my hand is described.
        const ocrNothingNew = (() => {
          if (myBids.length < 2) return false;
          const flatOCR: { seat: BiddingPosition; call: string }[] = [];
          for (const r of completedRounds) {
            for (const p of POSITIONS) {
              const b = r[p];
              if (b !== undefined) flatOCR.push({ seat: p, call: b });
            }
          }
          for (const p of POSITIONS) {
            if (p < myPosition && currentRound[p] !== undefined)
              flatOCR.push({ seat: p, call: currentRound[p]! });
          }
          const lastRealOCR = (seat: BiddingPosition) => {
            for (let i = flatOCR.length - 1; i >= 0; i--) {
              if (flatOCR[i].seat === seat && isRealBid(flatOCR[i].call))
                return i;
            }
            return -1;
          };
          const m = lastRealOCR(myPosition);
          const pt = lastRealOCR(partner);
          return pt >= 0 && m >= 0 && pt < m;
        })();
        return {
          situation: "overcaller-rebid",
          myPreviousBid: myLastBid,
          myFirstBid: myBids[0],
          partnerBid,
          partnerFirstBid,
          ...(ocrNothingNew && { partnerHasNothingNew: true }),
          lhoBid: openerFirstBid,
          rhoBid,
          vulnerability: vul,
        };
      }
      if (openerSeat === partner && partnerBid && isRealBid(partnerBid)) {
        // Partner opened a STRONG 2♣ and rebid 2NT (22-24 balanced) over my
        // waiting 2♦ — Stayman and transfers apply one level up, exactly as
        // over a 2NT opening.  Route to the 2NT-response systems.
        if (
          partnerFirstBid === "2♣" &&
          partnerBid === "2NT" &&
          myLastBid === "2♦"
        ) {
          return {
            situation: "responding-2nt",
            partnerBid,
            vulnerability: vul,
            after2COpening: true,
          };
        }
        // Partner opened, I responded in a suit, partner has rebid — I am the
        // RESPONDER making my second bid.  If partner has said nothing new
        // since MY last real bid (only the opponents acted), my earlier bid
        // already described this hand — flag it so the handler does not bid
        // the same values twice.
        const respNothingNew = (() => {
          const flatRR: { seat: BiddingPosition; call: string }[] = [];
          for (const r of completedRounds) {
            for (const p of POSITIONS) {
              const b = r[p];
              if (b !== undefined) flatRR.push({ seat: p, call: b });
            }
          }
          for (const p of POSITIONS) {
            if (p < myPosition && currentRound[p] !== undefined)
              flatRR.push({ seat: p, call: currentRound[p]! });
          }
          const lastRealRR = (seat: BiddingPosition) => {
            for (let i = flatRR.length - 1; i >= 0; i--) {
              if (flatRR[i].seat === seat && isRealBid(flatRR[i].call))
                return i;
            }
            return -1;
          };
          const mineRR = lastRealRR(myPosition);
          const partRR = lastRealRR(partner);
          return (
            myBids.length >= 2 && partRR >= 0 && mineRR >= 0 && partRR < mineRR
          );
        })();
        const rebidFloorRR = auctionFloorBeforeSeatBid(
          completedRounds,
          currentRound,
          partner,
          partnerBid,
        );
        return {
          situation: "responder-rebid",
          myPreviousBid: myLastBid,
          partnerBid,
          partnerFirstBid,
          lhoBid,
          rhoBid,
          vulnerability: vul,
          ...(respNothingNew && { partnerHasNothingNew: true }),
          ...(rebidFloorRR && { partnerRebidFloor: rebidFloorRR }),
        };
      }
    }

    // ── Protective / balancing position ────────────────────────────────────────
    // Partner has never bid (only passed) — this is NOT a normal opener rebid.
    // The opener is in the "protective seat" ONLY when the auction is about to
    // die: the two calls immediately before this turn were both passes (e.g.
    // 1♥-(2♦)-Pass-(Pass)-back to opener).  When the auction is still live
    // (RHO just bid), this is ordinary competition — reopening-double standards
    // do NOT apply, so the handler must know which seat it is in.
    if (!partnerBid) {
      // (The "passed out in my contract" case is handled earlier, before
      // role-routing — see isMyBidPassedOut at the top of this block.)
      // Flatten all calls made so far, in seat order, to find the two calls
      // immediately preceding this turn.
      const flatCalls: string[] = [];
      for (const r of completedRounds) {
        for (const p of POSITIONS) flatCalls.push(r[p] ?? "Pass");
      }
      for (const p of POSITIONS) {
        if (p < myPosition) {
          const b = currentRound[p];
          if (b !== undefined) flatCalls.push(b);
        }
      }
      // If MY last bid is still the highest live call (no opponent has bid over
      // it), my own side holds the contract — there is nothing to reopen.  This
      // is not a protective seat; pass and play it.  (Without this, a sequence
      // like 1♦-(1NT me)-P-P back toward me would phantom a reopening double of
      // my own contract.)
      const myLastIdx = myLastBid ? BID_ORDER.indexOf(myLastBid) : -1;
      const highestOppIdx = Math.max(
        isRealBid(lhoBid) ? BID_ORDER.indexOf(lhoBid) : -1,
        isRealBid(rhoBid) ? BID_ORDER.indexOf(rhoBid) : -1,
      );
      if (myLastIdx >= 0 && myLastIdx > highestOppIdx) {
        // An opponent DOUBLE after my last bid keeps the auction alive — I may
        // pass, redouble, or run.  Flag it so the handler tells that story
        // instead of "auction over".
        const myLastCallPos = flatCalls.lastIndexOf(myLastBid!);
        const doubledSince =
          myLastCallPos >= 0 &&
          flatCalls.slice(myLastCallPos + 1).includes("Double");
        return {
          situation: "auction-passed-out",
          myPreviousBid: myLastBid,
          vulnerability: vul,
          myBidWasDoubled: doubledSince || undefined,
        };
      }
      const lastTwo = flatCalls.slice(-2);
      const inBalancingSeat =
        lastTwo.length === 2 && lastTwo.every((b) => b === "Pass");
      return {
        situation: "protective-rebid",
        myPreviousBid: myLastBid,
        // Use whichever opponent bid — could be LHO (typical overcall) or RHO
        // (balancing bid after two passes, e.g. 1♥-Pass-Pass-2♦-back to opener).
        lhoBid: lhoBid ?? rhoBid ?? undefined,
        rhoBid,
        vulnerability: vul,
        balancing: inBalancingSeat,
        // My first bid was an overcall if I was not the auction's opener —
        // the handler's stories must not call it an "opening bid".
        ...(findAuctionOpenerSeat(completedRounds, currentRound, myPosition) !==
          myPosition && { iOvercalled: true }),
      };
    }

    // Partner's FIRST real bid (so the rebid handler can tell a genuine raise of
    // opener's suit from a mere PREFERENCE back to it after partner showed a
    // different suit first — e.g. 1♦-2♥-2♠-3♦, where 3♦ is preference, not a
    // limit raise).
    let rebidPartnerFirstBid: string | undefined;
    for (const r of completedRounds) {
      const b = r[partner];
      if (isRealBid(b)) {
        rebidPartnerFirstBid = b;
        break;
      }
    }
    // Flatten the calls in table order — used both for "partner has nothing
    // new" and for order-correct cuebid detection.
    const flatRAS: { seat: BiddingPosition; call: string }[] = [];
    for (const r of completedRounds) {
      for (const p of POSITIONS) {
        const b = r[p];
        if (b !== undefined) flatRAS.push({ seat: p, call: b });
      }
    }
    for (const p of POSITIONS) {
      if (p < myPosition && currentRound[p] !== undefined)
        flatRAS.push({ seat: p, call: currentRound[p]! });
    }
    const lastRealIdxRAS = (seat: BiddingPosition) => {
      for (let i = flatRAS.length - 1; i >= 0; i--) {
        if (flatRAS[i].seat === seat && isRealBid(flatRAS[i].call)) return i;
      }
      return -1;
    };
    // Have I already rebid (2+ real bids) with partner adding NOTHING since?
    // If partner's last real bid came before mine, I already answered it and
    // my hand is fully described.
    const mineIdxRAS = lastRealIdxRAS(myPosition);
    const partnerIdxRAS = lastRealIdxRAS(partner);
    const alreadyDescribed =
      myBids.length >= 2 &&
      partnerIdxRAS >= 0 &&
      mineIdxRAS >= 0 &&
      partnerIdxRAS < mineIdxRAS;
    // Did partner's latest bid CUE a suit an opponent had shown BEFORE it?
    const partnerCuedTheirSuit = (() => {
      if (partnerIdxRAS < 0) return false;
      const pBid = flatRAS[partnerIdxRAS].call;
      if (!isRealBid(pBid) || pBid.endsWith("NT")) return false;
      const pSuit = pBid.slice(1);
      for (let i = 0; i < partnerIdxRAS; i++) {
        const e = flatRAS[i];
        if (
          e.seat !== partner &&
          e.seat !== myPosition &&
          isRealBid(e.call) &&
          !e.call.endsWith("NT") &&
          e.call.slice(1) === pSuit
        )
          return true;
      }
      return false;
    })();
    // Partner made a DOUBLE earlier: their later raise of my suit is the
    // invitational 11-13 continuation, never a weak preemptive jump.
    const partnerDoubledEarlierRAS = flatRAS.some(
      (e, i) => e.seat === partner && e.call === "Double" && i < partnerIdxRAS,
    );
    return {
      situation: "rebid-after-suit",
      myPreviousBid: myLastBid,
      partnerBid,
      partnerFirstBid: rebidPartnerFirstBid,
      // Forward opponent interference so the rebid handler knows the auction was
      // contested (e.g. a jump raise after a double is preemptive, not a limit
      // raise) and so its level math clears the opponents' bids.
      lhoBid,
      rhoBid,
      vulnerability: vul,
      ...(alreadyDescribed && { partnerHasNothingNew: true }),
      ...(partnerCuedTheirSuit && { partnerCuedTheirSuit: true }),
      ...(partnerDoubledEarlierRAS && { partnerDoubledEarlier: true }),
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

      // If partner's latest bid differs from their opening bid they have already
      // rebid once — this is a continuation, NOT a first response to their opener.
      // Route to responding-suit using the most-recent bid so the player gets
      // advice that matches the actual auction level.  (This prevents e.g. a 2♣
      // opener's 2♠ rebid from being treated as a pre-emptive weak 2♠ opener.)
      if (isRealBid(partnerBid) && partnerBid !== partnerOpenBid) {
        return { situation: "responding-suit", partnerBid, vulnerability: vul };
      }

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
      // When partner opened 1NT and opponent doubled, that is NOT a suit-support
      // situation.  Use a dedicated handler so we don't confuse NT responses with
      // "Weak Raise … 3-card support" messaging.
      if (partnerOpenBid === "1NT") {
        return {
          situation: "responding-1nt-doubled",
          partnerBid,
          rhoBid: opponentBid,
          vulnerability: vul,
        };
      }
      // If I already acted (doubled/redoubled) earlier in this auction, my
      // strength is shown — never recommend a second Redouble.
      if (
        myLastNonPassAction === "Double" ||
        myLastNonPassAction === "Redouble"
      ) {
        return {
          situation: "after-own-double",
          partnerBid,
          rhoBid: opponentBid,
          vulnerability: vul,
          partnerOpened: true,
        };
      }
      // Partner opened a WEAK 2 / preempt and the opponent doubled: this is
      // preempt-response territory (raise per the Law or pass), never the
      // Jordan-2NT flow (whose 1-level new-suit math walks into the safety
      // net over a 2-level opening).
      if (WEAK2_BIDS.includes(partnerOpenBid)) {
        return {
          situation: "responding-weak2",
          partnerBid,
          rhoBid: opponentBid,
          vulnerability: vul,
        };
      }
      if (PREEMPT_BIDS.includes(partnerOpenBid)) {
        return {
          situation: "responding-preempt",
          partnerBid,
          rhoBid: opponentBid,
          vulnerability: vul,
        };
      }
      // Partner opened a suit, opponent doubled → Jordan 2NT territory
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
      // Partner OPENED and has since DOUBLED the opponents' bid (reopening /
      // optional double) — I must answer the double (sit or pull), not sit in
      // a phantom negative-double seat.
      if (partnerBid === "Double") {
        return {
          situation: "responding-to-double",
          rhoBid: opponentBid,
          vulnerability: vul,
          partnerOpened: true,
          partnerFirstBid: partnerOpenBid,
        };
      }
      // Partner opened 1-of-suit, opponent overcalled → negative double territory.
      // BUT: if I already made a Double/Redouble in a prior round, I am NOT in
      // the negative-double seat.  I already showed my hand; the current bid is
      // partner's response to my earlier action.  Pass unless I have extra values.
      if (
        myLastNonPassAction === "Double" ||
        myLastNonPassAction === "Redouble"
      ) {
        return {
          situation: "after-own-double",
          partnerBid: partnerBid ?? undefined,
          rhoBid: opponentBid,
          vulnerability: vul,
          partnerOpened: true,
          // The opening bid, so the handler can tell "partner opened 1♦ and
          // has passed since" apart from "partner has bid again".
          partnerFirstBid: partnerOpenBid,
        };
      }
      // Partner opened 1-of-suit, opponent overcalled → negative double territory
      return {
        situation: "negative-double",
        myPreviousBid: partnerOpenBid,
        rhoBid: opponentBid,
        vulnerability: vul,
      };
    }
    // Partner REOPENED with a double after the opponent's overcall (e.g.
    // 2♣-(2♠)-P-(P)-Double).  That double is takeout/cards asking me to bid —
    // advance it (bid my best suit), do NOT fall back to "respond to the
    // opening", which would ignore the double and pass below the contract.
    // Pass partner's FIRST real bid through: after partner's own NT bid the
    // double is penalty-suggestive, and the handler must not force a bid.
    if (partnerBid === "Double") {
      let partnerFirstRealRTD: string | undefined;
      for (const r of completedRounds) {
        const b = r[partner];
        if (isRealBid(b)) {
          partnerFirstRealRTD = b;
          break;
        }
      }
      return {
        situation: "responding-to-double",
        rhoBid: opponentBid,
        vulnerability: vul,
        ...(partnerFirstRealRTD && { partnerFirstBid: partnerFirstRealRTD }),
      };
    }

    // Partner opened pre-empt or 2, opponent bid → just respond to partner
    // Pass through the opponent's bid so the UI can ask about stoppers when needed.
    // First: if partner has REBID (their latest bid ≠ their opening bid), treat as
    // a continuation and route to responding-suit using the most-recent bid.
    if (isRealBid(partnerBid) && partnerBid !== partnerOpenBid) {
      return { situation: "responding-suit", partnerBid, vulnerability: vul };
    }
    if (partnerOpenBid === "1NT")
      return {
        situation: "responding-1nt",
        partnerBid,
        rhoBid: opponentBid,
        vulnerability: vul,
      };
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
      // Include lhoBid so getOvercall can detect conventional bids
      // (e.g. 2♣ Stayman when LHO opened 1NT)
      const lhoBidForContext =
        firstOpenerSeat === lho ? opponentOpenBid : lhoBid;

      // Detect the balancing (protective) seat — the PASS-OUT seat ONLY: the
      // two calls immediately before my turn are both passes, so a pass by me
      // would end the auction (e.g. 1♠-P-P-?).  In this seat the standards for
      // competing are relaxed by about a king — partner may have been trapped
      // with values, so I "borrow a king" to reopen rather than sell out.
      // NOTE: merely having PASSED EARLIER does not make this the balancing
      // seat — a passed hand sitting DIRECTLY over the opener must still meet
      // full direct-seat standards.
      const callsBeforeMe: string[] = [];
      for (const round of completedRounds) {
        for (const p of POSITIONS) callsBeforeMe.push(round[p] ?? "Pass");
      }
      for (const p of POSITIONS) {
        if (p < myPosition) callsBeforeMe.push(currentRound[p] ?? "Pass");
      }
      let trailingPasses = 0;
      for (let i = callsBeforeMe.length - 1; i >= 0; i--) {
        if (callsBeforeMe[i] === "Pass") trailingPasses++;
        else break;
      }
      const anyRealBidBeforeMe = callsBeforeMe.some(
        (c) => c !== "Pass" && c !== "Double" && c !== "Redouble",
      );
      const inPassOutSeat = anyRealBidBeforeMe && trailingPasses === 2;

      // If I already doubled, I have shown my hand — re-routing to
      // "overcalling" would recommend doubling again forever.
      if (
        myLastNonPassAction === "Double" ||
        myLastNonPassAction === "Redouble"
      ) {
        return {
          situation: "after-own-double",
          partnerBid,
          rhoBid: effectiveRhoBid,
          vulnerability: vul,
          ...(wasDoubleOfStayman(
            completedRounds,
            currentRound,
            myPosition,
            myPosition,
          ) && { doubleWasLeadDirecting: true }),
        };
      }

      return {
        situation: "overcalling",
        rhoBid: effectiveRhoBid,
        lhoBid: lhoBidForContext,
        vulnerability: vul,
        ...(inPassOutSeat && { balancing: true }),
      };
    }

    // Partner has bid after opponent — I'm responding to partner's action
    if (partnerBid === "Double") {
      // Special case: partner doubled Stayman (2♣ over the opponents' 1NT
      // opening).  This is a lead-directing double, NOT a takeout double —
      // checked order-aware so later rounds still read it correctly.
      const lhoBidForDouble =
        firstOpenerSeat === lho ? opponentOpenBid : lhoBid;
      const isPartnerDoubledStayman =
        (lhoBidForDouble === "2♣" && effectiveRhoBid?.endsWith("NT")) ||
        wasDoubleOfStayman(completedRounds, currentRound, myPosition, partner);
      if (isPartnerDoubledStayman) {
        return {
          situation: "overcalling",
          rhoBid: lhoBidForDouble, // "2♣" — the doubled bid
          lhoBid: effectiveRhoBid, // "1NT" — the NT opener
          partnerBid: "Double", // signal that partner already doubled
          vulnerability: vul,
        };
      }
      // Partner's FIRST real bid matters: after partner's own NT bid a later
      // double is penalty-suggestive, and the handler must not force a bid.
      let partnerFirstRealRTD2: string | undefined;
      for (const r of completedRounds) {
        const b = r[partner];
        if (isRealBid(b)) {
          partnerFirstRealRTD2 = b;
          break;
        }
      }
      return {
        situation: "responding-to-double",
        rhoBid: effectiveRhoBid,
        vulnerability: vul,
        ...(partnerFirstRealRTD2 && { partnerFirstBid: partnerFirstRealRTD2 }),
      };
    }

    // PARTNER's only action is a (takeout) DOUBLE, the opponents opened, and
    // I have already advanced once — my earlier advance said it all; route to
    // the advancer-rebid logic (its fallback pass), never to opener handlers.
    if (
      partnerBid === "Double" &&
      isRealBid(myLastBid) &&
      findAuctionOpenerSeat(completedRounds, currentRound, myPosition) !==
        myPosition &&
      findAuctionOpenerSeat(completedRounds, currentRound, myPosition) !==
        partner
    ) {
      return {
        situation: "advancer-rebid",
        myPreviousBid: myLastBid,
        partnerBid: undefined,
        partnerFirstBid: undefined,
        lhoBid,
        rhoBid,
        vulnerability: vul,
      };
    }

    // I DOUBLED earlier and partner has since made a real bid — I am
    // continuing after my OWN double (e.g. a penalty double of 1NT that
    // partner pulled), not advancing a partner overcall.
    if (
      (myLastNonPassAction === "Double" ||
        myLastNonPassAction === "Redouble") &&
      isRealBid(partnerBid)
    ) {
      return {
        situation: "after-own-double",
        partnerBid,
        rhoBid: effectiveRhoBid,
        vulnerability: vul,
        ...(opponentOpenBid === "1NT" && { doubledBid: "1NT" }),
      };
    }

    // Detect Michaels (partner cuebid the opponents' suit).  You never overcall
    // the opponents' own suit naturally, so a 2-level bid by partner IN a suit
    // an opponent has bid is an artificial two-suiter (Michaels) — NOT a natural
    // overcall.  Classic Michaels cues the OPENING suit; a cue of the
    // responder's suit (e.g. 1♦-1♠ … 2♠) is the same idea.  Pass the cued suit
    // to the handler so it infers the right two-suiter (cue a minor → both
    // majors; cue a major → the other major + an unspecified minor).
    // A cuebid means partner bid a suit the opponents had shown BEFORE
    // partner's call.  An opponent bidding the same suit LATER (e.g. their
    // own cuebid of partner's natural overcall) must NOT be counted — order
    // matters.  Walk the auction in table order up to partner's latest real
    // bid and collect only the opponent suits shown before it.
    // Michaels is a DIRECT cuebid: the LAST real bid before partner's call
    // must itself be the bid partner cued.  A delayed 2♣ over the opener's
    // later 1NT rebid (1♣-P-1♠-P-1NT-2♣) is NATURAL — 1♣ can be three cards
    // and the moment has passed.
    const lastRealBeforePartner = (() => {
      if (!isRealBid(partnerBid)) return undefined;
      const flatMC: { seat: BiddingPosition; call: string }[] = [];
      for (const r of completedRounds) {
        for (const p of POSITIONS) {
          const b = r[p];
          if (b !== undefined) flatMC.push({ seat: p, call: b });
        }
      }
      for (const p of POSITIONS) {
        if (p < myPosition && currentRound[p] !== undefined)
          flatMC.push({ seat: p, call: currentRound[p]! });
      }
      let partnerIdxMC = -1;
      for (let i = flatMC.length - 1; i >= 0; i--) {
        if (flatMC[i].seat === partner && flatMC[i].call === partnerBid) {
          partnerIdxMC = i;
          break;
        }
      }
      if (partnerIdxMC < 0) return undefined;
      for (let i = partnerIdxMC - 1; i >= 0; i--) {
        const e = flatMC[i];
        if (e.seat !== partner && e.seat !== myPosition && isRealBid(e.call))
          return e.call;
      }
      return undefined;
    })();
    const partnerCueSuitChar =
      isRealBid(partnerBid) && !partnerBid.endsWith("NT")
        ? partnerBid.slice(1)
        : undefined;
    if (
      partnerCueSuitChar !== undefined &&
      lastRealBeforePartner !== undefined &&
      !lastRealBeforePartner.endsWith("NT") &&
      lastRealBeforePartner.slice(1) === partnerCueSuitChar &&
      parseInt(partnerBid[0]) === 2
    ) {
      return {
        situation: "responding-to-michaels",
        lhoBid: partnerBid, // the cued suit carries the info the handler needs
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
      // Was partner's 1NT a BALANCING (pass-out seat) action?  Flatten the
      // calls and check whether the two calls immediately before partner's
      // 1NT were both passes with a real bid before them — a balancing 1NT
      // shows only 11-14, a full king lighter than the direct 15-18.
      const flatForBal: { seat: BiddingPosition; call: string }[] = [];
      for (const r of completedRounds) {
        for (const p of POSITIONS)
          flatForBal.push({ seat: p, call: r[p] ?? "Pass" });
      }
      for (const p of POSITIONS) {
        if (p < myPosition && currentRound[p] !== undefined)
          flatForBal.push({ seat: p, call: currentRound[p]! });
      }
      const ntIdx = flatForBal.map((e) => e.call).lastIndexOf("1NT");
      const partnerBalanced =
        ntIdx >= 3 &&
        flatForBal[ntIdx - 1].call === "Pass" &&
        flatForBal[ntIdx - 2].call === "Pass" &&
        flatForBal.slice(0, ntIdx - 2).some((e) => isRealBid(e.call));
      // Opponents' highest real bid AFTER partner's 1NT — systems are off
      // over it, and suit escapes must clear it.
      let interferenceAfter1NT: string | undefined;
      for (let i = ntIdx + 1; i < flatForBal.length; i++) {
        const e = flatForBal[i];
        if (
          e.seat !== partner &&
          e.seat !== myPosition &&
          isRealBid(e.call) &&
          (!interferenceAfter1NT ||
            BID_ORDER.indexOf(e.call) > BID_ORDER.indexOf(interferenceAfter1NT))
        ) {
          interferenceAfter1NT = e.call;
        }
      }
      return {
        situation: "responding-to-1nt-oc",
        rhoBid: effectiveRhoBid,
        vulnerability: vul,
        ...(partnerBalanced && { balancing: true }),
        ...(interferenceAfter1NT && {
          interferenceOverPartnerNT: interferenceAfter1NT,
        }),
      };
    }

    // Jump or simple overcall?  Measure jump-ness against the auction floor
    // at the moment partner overcalled (NOT against RHO's first bid — see
    // isJumpOvercall doc).
    //
    // A 3-level or 4-level bid is a PREEMPT only if it was a JUMP at the
    // moment partner bid it.  Without this check, e.g. 1♠–Pass–2♠–3♣ would
    // mis-classify partner's forced simple 3♣ overcall as a pre-empt.
    const partnerOvercallFloor =
      auctionFloorBeforeSeatBid(
        completedRounds,
        currentRound,
        partner,
        partnerBid,
      ) ?? effectiveRhoBid;
    const partnerOvercallIsJump = isJumpOvercall(
      partnerBid,
      partnerOvercallFloor,
    );
    if (partnerOvercallIsJump) {
      // Route 3-level / 4-level jumps to the preempt handler when level >= 3,
      // otherwise the standard jump-overcall handler.  Both are jumps, but
      // preempts get specialized advice.
      const partnerLevel = parseInt(partnerBid[0]) || 0;
      if (
        partnerLevel >= 3 &&
        ["3♣", "3♦", "3♥", "3♠", "4♣", "4♦", "4♥", "4♠"].includes(partnerBid)
      ) {
        return {
          situation: "responding-to-preempt-oc",
          partnerBid,
          vulnerability: vul,
        };
      }
      return {
        situation: "responding-to-jump-oc",
        partnerBid,
        rhoBid: effectiveRhoBid,
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
  const myRealBids = completedRounds
    .map((r) => r[myPosition])
    .filter((b): b is string => !!b && !stdBids.has(b));
  const myLastBid = myRealBids.slice(-1)[0];
  // My ORIGINAL opening bid — the first real bid I made.  Distinct from
  // myLastBid in any auction with a rebid; rebid handlers must use this to
  // reason about my opening suit (e.g. weak-2 inquiry detection).
  const myOriginalOpeningBid = myRealBids[0];

  const latestPartnerBid = latestNonPass(partner);

  // For stayman-response, `partnerBid` must stay as the ORIGINAL Stayman reply
  // (2♦, 2♥, or 2♠) so getStaymanFollowUp knows what major partner showed/denied.
  // If partner has since made a continuation bid (e.g. 2NT declining an invitation),
  // that goes into `partnerContinuation` instead.
  const isStaymanResponse = ctx.situation === "stayman-response";
  const partnerBidOut = isStaymanResponse
    ? ctx.partnerBid // preserve original Stayman reply
    : (latestPartnerBid ?? ctx.partnerBid);
  const partnerContinuation =
    isStaymanResponse && latestPartnerBid !== ctx.partnerBid
      ? latestPartnerBid
      : ctx.partnerContinuation;

  // The most recent call overall (flattened seat order), for Double/Redouble
  // legality in the safety net.
  const flatAll: string[] = [];
  for (const r of completedRounds) {
    for (const p of POSITIONS) flatAll.push(r[p] ?? "Pass");
  }
  for (const p of POSITIONS) {
    if (p < myPosition && currentRound[p] !== undefined)
      flatAll.push(currentRound[p]!);
  }
  const lastNonPassCall = [...flatAll].reverse().find((b) => b !== "Pass");

  // The auction's first real bid — identifies openings vs responses for
  // convention detection (e.g. Stayman requires the 1NT to be the OPENING).
  const auctionOpeningBid = (() => {
    for (const r of [...completedRounds, currentRound]) {
      for (const p of POSITIONS) {
        const b = r[p];
        if (b && !stdBids.has(b)) return b;
      }
    }
    return undefined;
  })();

  return {
    ...ctx,
    partnerBid: partnerBidOut,
    partnerContinuation,
    rhoBid: latestNonPass(rho) ?? ctx.rhoBid,
    lhoBid: latestNonPass(lho) ?? ctx.lhoBid,
    myPreviousBid: ctx.myPreviousBid ?? myLastBid,
    myFirstBid: ctx.myFirstBid ?? myOriginalOpeningBid,
    lastCall: lastNonPassCall,
    auctionOpeningBid,
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
): {
  isComplete: boolean;
  finalContract: string | undefined;
  /** "doubled" / "redoubled" when the final contract was left in a Double /
   *  Redouble; undefined otherwise.  Kept separate from `finalContract` so
   *  contract parsing stays simple. */
  doubling?: "doubled" | "redoubled";
} {
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

  // Determine the last real bid (the final contract candidate) and whether a
  // Double/Redouble followed it (and was never superseded by a new bid).
  let finalContract: string | undefined;
  let doubling: "doubled" | "redoubled" | undefined;
  for (let i = allBids.length - 1; i >= 0; i--) {
    const b = allBids[i];
    if (b === "Redouble" && doubling === undefined) doubling = "redoubled";
    else if (b === "Double" && doubling === undefined) doubling = "doubled";
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

  return { isComplete, finalContract, doubling };
}

/**
 * The seat (1-4) that made the final contract bid, or undefined if the deal was
 * passed out.  Used to decide which side declares when handing the contract off
 * to the score sheet.  Mirrors getFinalContractInfo's bid-flattening order.
 */
export function getFinalContractDeclarerSeat(
  completedRounds: BidRound[],
  currentRound: BidRound,
  myPosition: BiddingPosition,
): BiddingPosition | undefined {
  const seq: { seat: BiddingPosition; bid: string }[] = [];
  for (const round of completedRounds) {
    for (const pos of POSITIONS) {
      seq.push({ seat: pos, bid: round[pos] ?? "Pass" });
    }
  }
  for (let p = 1; p < myPosition; p++) {
    const bid = currentRound[p as BiddingPosition];
    if (bid !== undefined) seq.push({ seat: p as BiddingPosition, bid });
  }
  for (let i = seq.length - 1; i >= 0; i--) {
    const { seat, bid } = seq[i];
    if (bid !== "Pass" && bid !== "Double" && bid !== "Redouble") return seat;
  }
  return undefined;
}
