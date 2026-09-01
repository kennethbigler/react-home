import {
  analyzeHand,
  bestMajor,
  calcTP,
  hasFiveCardMajor,
  longerMinor,
  ruleOf20,
  suitBidLevel,
  suitDescriptors,
  suitSymbol,
} from "./hand-evaluation";
import type { BidRecommendation, Hand, Vulnerability } from "./types";

// ─── Opening Bids ────────────────────────────────────────────────────────────

export function getOpeningBid(
  hand: Hand,
  vul: Vulnerability,
): BidRecommendation {
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
    // 5+ card major — but SAYC opens the LONGEST suit first: a minor strictly
    // longer than the best major (e.g. 5 spades with 7 clubs) is opened ahead
    // of it; the major is shown on later rounds.
    const major = bestMajor(hand);
    const majorLen = major ? (hand[major as keyof Hand] as number) : 0;
    const longerMinorLen = Math.max(hand.diamonds, hand.clubs);
    if (major && longerMinorLen > majorLen) {
      const longMinorName = hand.clubs > hand.diamonds ? "clubs" : "diamonds";
      return {
        bid: suitBidLevel(longMinorName, 1),
        category: `Opening 1${suitSymbol(longMinorName)} (Longest Suit First)`,
        reasoning: `You hold a 5+ card ${major} suit, but your ${longerMinorLen}-card ${longMinorName} suit is LONGER — SAYC opens the longest suit first. Open 1${suitSymbol(longMinorName)} and show the ${major} on your next turn; opening the shorter major would misdescribe the hand's shape.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `12-21 total pts with a real ${longMinorName} suit. The ${major} suit will come out on the next bid.`,
        expectedResponses: [
          { partnerBid: "Pass", meaning: "0-5 pts — too weak to respond" },
          {
            partnerBid: "1 of new suit",
            meaning: "6+ pts, 4+ cards — natural, one-round force",
          },
          {
            partnerBid: "1NT",
            meaning: "6-10 pts, no suit to show at the 1-level",
          },
        ],
        confidence: "high",
      };
    }
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
  const sortedLengths = [
    hand.spades,
    hand.hearts,
    hand.diamonds,
    hand.clubs,
  ].sort((a, b) => b - a);
  const longest1 = sortedLengths[0];
  const longest2 = sortedLengths[1];
  const rule20Total = hand.hcp + longest1 + longest2;
  if ((tp === 12 || (hand.hcp >= 11 && tp <= 12)) && hand.hcp >= 10) {
    if (ruleOf20(hand)) {
      const suit = hasFiveCardMajor(hand)
        ? bestMajor(hand)!
        : longerMinor(hand);
      return {
        bid: suitBidLevel(suit, 1),
        category: "Rule of 20 Opening",
        reasoning: `With exactly 12 total points, apply the Rule of 20: HCP (${hand.hcp}) + cards in your 2 longest suits = ${rule20Total} ≥ 20. You may open.`,
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
    const suitsAll = suitDescriptors(hand);

    // 7+ card minor blocked by outside 4+ card major
    const sevenPlusSuit = suitsAll.find((s) => s.count >= 7);
    if (
      sevenPlusSuit &&
      (sevenPlusSuit.name === "diamonds" || sevenPlusSuit.name === "clubs")
    ) {
      const outsideMajor =
        hand.spades >= 4 ? "spades" : hand.hearts >= 4 ? "hearts" : null;
      if (outsideMajor) {
        const outsideLen = hand[outsideMajor as keyof Hand] as number;
        return `With ${hand.hcp} HCP and a ${sevenPlusSuit.count}-card ${sevenPlusSuit.name} suit, a 3-level pre-empt would normally apply, but an outside ${outsideLen}-card ${outsideMajor} suit makes this inadvisable in SAYC — partner might miss the ${outsideMajor} game. Pass.`;
      }
    }

    // 6-card non-club suit blocked by outside 4+ card major (Weak 2 candidate)
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
        const outsideLen = hand[outsideMajor as keyof Hand] as number;
        return `With ${hand.hcp} HCP and a ${sixCardNonClub.count}-card ${sixCardNonClub.name} suit, a Weak 2${suitSymbol(sixCardNonClub.name)} would normally apply, but an outside ${outsideLen}-card ${outsideMajor} suit makes this inadvisable in standard SAYC — partner might miss the ${outsideMajor} game. Pass.`;
      }
    }

    // 6-card clubs blocked by outside 4+ card major (3♣ preempt candidate)
    if (hand.clubs >= 6 && hand.hcp >= 5 && hand.hcp <= 10) {
      const outsideMajor =
        hand.spades >= 4 ? "spades" : hand.hearts >= 4 ? "hearts" : null;
      if (outsideMajor) {
        const outsideLen = hand[outsideMajor as keyof Hand] as number;
        return `With ${hand.hcp} HCP and a ${hand.clubs}-card clubs suit, a 3♣ pre-empt requires at least seven clubs and therefore does not apply here${outsideMajor ? `; an outside ${outsideLen}-card ${outsideMajor} suit is a secondary reason to pass rather than pre-empt` : ""}. Pass.`;
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
