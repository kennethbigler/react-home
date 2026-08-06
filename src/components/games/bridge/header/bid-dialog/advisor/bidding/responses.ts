import { BID_ORDER, isRealBid } from "./bid-order";
import {
  analyzeHand,
  calcTPWithFit,
  isBalanced,
  longerMinor,
  longestSuitInfo,
  suitBidLevel,
  suitFromBid,
  suitSymbol,
} from "./hand-evaluation";
import type { BidRecommendation, Hand } from "./types";

// ─── Responses to Partner's Opening ─────────────────────────────────────────

export function getResponseToOneNT(
  hand: Hand,
  opponentBid?: string,
  /**
   * True when partner's 1NT was the auction's OPENING bid — only then is a
   * 2♣/2♦/2♥/2♠/2NT interference call CONVENTIONAL Cappelletti. When partner's
   * 1NT was their own OVERCALL (natural, over an opponent's suit opening), the
   * same-shaped interference is natural and the Cappelletti reading must not
   * apply. Defaults to true (opening) — the overcall call site passes false.
   */
  partnerNTWasOpening = true,
): BidRecommendation {
  const analysis = analyzeHand(hand);
  const { hcp } = hand;

  // ── Opponent used a CONVENTIONAL Cappelletti call over partner's 1NT ──────
  // 2♣/2♦/2♥/2♠/2NT directly over partner's 1NT OPENING are Cappelletti (SAYC
  // standard defense), NOT natural — their real suit(s) are unknown or
  // two-suited. Stayman/transfers are OFF either way (the auction has moved
  // past 1NT), but the natural "their suit" logic below does not apply since
  // there usually isn't one single known suit to judge a stopper against.
  if (
    opponentBid &&
    partnerNTWasOpening &&
    /^2[♣♦♥♠]$|^2NT$/.test(opponentBid) &&
    opponentBid !== "Pass"
  ) {
    const oppLevel = parseInt(opponentBid[0]);
    // Double shows values here (takeout-flavored — the opponents' shape is
    // unknown, so a double just says "I have the balance of power").
    if (hcp >= 9) {
      return {
        bid: "Double",
        category: "Double Over Cappelletti Interference (9+ HCP)",
        reasoning: `The opponents' ${opponentBid} over partner's 1NT is Cappelletti (conventional, not natural) — their exact suit(s) are unknown. With ${hcp} HCP, double shows extra values and competes for the balance of power; partner can pass (penalty-ish) or bid on.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `${hcp}+ HCP — competing over their conventional interference.`,
        expectedResponses: [],
        confidence: "medium",
      };
    }
    // With a good 5+ card suit, bid it naturally — the opponents' call does
    // not deny you a fit of your own.
    const { name: longestNameCapp, length: longestCountCapp } =
      longestSuitInfo(hand);
    if (longestCountCapp >= 5) {
      const suitFloorIdx = BID_ORDER.indexOf(opponentBid);
      const suitBidCapp =
        BID_ORDER.find(
          (b, i) => i > suitFloorIdx && b.endsWith(suitSymbol(longestNameCapp)),
        ) ?? `7${suitSymbol(longestNameCapp)}`;
      return {
        bid: suitBidCapp,
        category: `Natural ${suitBidCapp} Over Cappelletti Interference`,
        reasoning: `The opponents' ${opponentBid} over partner's 1NT is Cappelletti — Stayman/transfers are off. With ${longestCountCapp} ${longestNameCapp}, bid your own suit naturally; not forcing.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `Natural ${longestCountCapp}-card ${longestNameCapp} suit. Not forcing.`,
        expectedResponses: [],
        confidence: "medium",
      };
    }
    // With enough to compete in notrump and the level still reasonable,
    // bid on; otherwise pass and let partner's 1NT stand (or be doubled).
    if (
      hcp >= 8 &&
      oppLevel <= 2 &&
      BID_ORDER.indexOf("2NT") > BID_ORDER.indexOf(opponentBid)
    ) {
      return {
        bid: "2NT",
        category: "2NT Over Cappelletti Interference (Invitational)",
        reasoning: `The opponents' ${opponentBid} is Cappelletti (conventional) over partner's 1NT. With ${hcp} HCP and no clear suit of your own, bid 2NT to invite game in notrump — partner's 1NT strength still applies.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "8-9 HCP — inviting game despite the interference.",
        expectedResponses: [],
        confidence: "medium",
      };
    }
    return {
      bid: "Pass",
      category: "Pass Over Cappelletti Interference",
      reasoning: `The opponents' ${opponentBid} over partner's 1NT is Cappelletti (conventional). With ${hcp} HCP and no clear action, pass — partner's 1NT (or a later double) will stand.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "No clear action over their conventional interference.",
      expectedResponses: [],
      confidence: "medium",
    };
  }

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
    const opponentSuit = suitFromBid(opponentBid) ?? "clubs";
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

export function getResponseToTwoNT(
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
  const partnerMin = after2C ? 22 : 20;
  const partnerMax = after2C ? 24 : 21;
  const grandSlamGate = after2C ? 14 : 16;
  const smallSlamGate = after2C ? 11 : 13;
  const quantInviteHcp = 12;
  const quantAcceptHcp = after2C ? 23 : 21;
  const quantDeclineHcp = after2C ? 22 : 20;

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
              : hcp >= gameFloor
                ? `Bid 4♥ (or 3NT with only 5 hearts) — game opposite ${rangeText}`
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
              : hcp >= gameFloor
                ? `Bid 4♠ (or 3NT with only 5 spades) — game opposite ${rangeText}`
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

  // Grand-slam territory on power (16+ opposite 20-21, 14+ opposite 22-24).
  if (hcp >= grandSlamGate) {
    return {
      bid: "7NT",
      category: "7NT (Grand Slam on Combined Values)",
      reasoning: `With ${hcp} HCP opposite partner's ${rangeText}, the combined count is ${hcp + partnerMin}-${hcp + partnerMax} — at the 37-point grand-slam threshold. Bid 7NT.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `${grandSlamGate}+ HCP — combined 37: grand slam on power.`,
      expectedResponses: [{ partnerBid: "Pass", meaning: "To play" }],
      confidence: "medium",
      note: "With a specific suit in mind, Gerber 4♣ (ace ask) is a safer route than blasting.",
    };
  }

  // Small slam on power (13+ opposite 20-21, 11+ opposite 22-24).
  if (hcp >= smallSlamGate) {
    return {
      bid: "6NT",
      category: "6NT (Small Slam on Combined Values)",
      reasoning: `With ${hcp} HCP opposite partner's ${rangeText}, the combined count is ${hcp + partnerMin}-${hcp + partnerMax} — at or past the 33-point small-slam threshold. Bid 6NT directly.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `${smallSlamGate}+ HCP — combined 33+: small slam on power.`,
      expectedResponses: [{ partnerBid: "Pass", meaning: "To play" }],
      confidence: "high",
    };
  }

  // Invitational to 6NT (12 HCP)
  if (hcp >= quantInviteHcp) {
    return {
      bid: "4NT",
      category: "Quantitative 4NT (invite to 6NT)",
      reasoning: `With ${quantInviteHcp} HCP, invite 6NT with 4NT. Partner accepts with ${quantAcceptHcp} HCP (maximum).`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "12 HCP balanced. Inviting 6NT (quantitative — NOT Blackwood).",
      expectedResponses: [
        { partnerBid: "Pass", meaning: `${quantDeclineHcp} HCP — declines` },
        { partnerBid: "6NT", meaning: `${quantAcceptHcp} HCP — accepts` },
      ],
      confidence: "high",
      note: "4NT is quantitative here, not Blackwood — no suit is agreed.",
    };
  }

  // 3NT (4-11 HCP balanced)
  return {
    bid: "3NT",
    category: "3NT Response to 2NT",
    reasoning: `With 4-11 HCP balanced, bid 3NT. Combined with partner's ${rangeText} HCP you have enough for game.`,
    handAnalysis: analysis,
    whatYourBidTellsPartner:
      "4-11 HCP, no 4-card major, satisfied with NT game.",
    expectedResponses: [{ partnerBid: "Pass", meaning: "Accepts 3NT" }],
    confidence: "high",
  };
}

export function getResponseTo3NTOpening(hand: Hand): BidRecommendation {
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

export function getResponseToSuit(
  hand: Hand,
  partnerBid: string,
): BidRecommendation {
  const analysis = analyzeHand(hand);
  const { tp } = analysis;
  // When RAISING partner's suit you have a trump fit, so SAYC values the hand
  // with SHORT-suit (ruffing) points INSTEAD of long-suit points — void=5,
  // singleton=3, doubleton=1, added to HCP.  Use this for every raise decision;
  // keep the long-suit `tp` for new-suit and notrump responses (no fit).
  const supportTP = calcTPWithFit(hand);
  const isPartnerMajor = partnerBid === "1♥" || partnerBid === "1♠";
  const partnerSuit = suitFromBid(partnerBid) ?? "clubs";
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

  // Splinter (double jump in a new suit, 4+ trump support, WITH a singleton
  // or void in the bid suit) — a game-forcing raise that pinpoints shortness
  // for slam evaluation. This app's existing limit-raise handling already
  // covers shortness-boosted hands up to supportTP 12 (a 3-of-the-major jump
  // raise); Jacoby 2NT REQUIRES a "balanced-ish" hand (no singleton) at 13+,
  // so an UNBALANCED 13+ support-point hand must splinter instead of being
  // wrongly claimed by the Jacoby check below.
  if (
    isPartnerMajor &&
    mySupport >= 4 &&
    supportTP >= 13 &&
    !isBalanced(hand)
  ) {
    const shortSuitSp = (["spades", "hearts", "diamonds", "clubs"] as const)
      .filter((s) => s !== partnerSuit)
      .find((s) => (hand[s] as number) <= 1);
    if (shortSuitSp) {
      const shortLenSp = hand[shortSuitSp] as number;
      // A splinter is a DOUBLE JUMP: skip both the natural new-suit response
      // AND the single-jump (limit-raise-of-a-new-suit) level. Find the
      // cheapest legal bid in the short suit above partner's opening, then
      // take the one two steps further up.
      const openFloorSp = BID_ORDER.indexOf(`1${suitSymbol(partnerSuit)}`);
      const candidatesSp = BID_ORDER.filter(
        (b, i) => i > openFloorSp && b.endsWith(suitSymbol(shortSuitSp)),
      );
      const finalSplinterBid =
        candidatesSp[2] ?? candidatesSp[candidatesSp.length - 1];
      return {
        bid: finalSplinterBid,
        category: "Splinter (Game-Forcing Raise, Shortness Shown)",
        reasoning: `With ${supportTP} support points, 4+ card ${partnerSuit} support, and a singleton/void in ${shortSuitSp} (${shortLenSp} card${shortLenSp === 1 ? "" : "s"}), bid the splinter ${finalSplinterBid} — a double jump in ${shortSuitSp} agreeing ${partnerSuit} as trumps. This is game-forcing and pinpoints your shortness so partner can judge slam: wasted honors opposite it should sign off, useful controls should drive on.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `Game-forcing raise of ${partnerSuit} with a singleton/void in ${shortSuitSp} — NOT a natural ${shortSuitSp} suit.`,
        expectedResponses: [
          {
            partnerBid: `4${suitSymbol(partnerSuit)}`,
            meaning: "No extra slam interest — sign off in game",
          },
          {
            partnerBid: "Cuebid / new suit",
            meaning: "Control in that suit — slam investigation continues",
          },
        ],
        confidence: "high",
      };
    }
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

  // Limit raise (10-12 support points, 3+ card support). Note: SAYC's
  // textbook default technically wants 4+ trumps for a limit raise (3-card
  // support "should" be a plain single raise), but this app deliberately
  // follows the common, widely-taught variant of allowing a 3-card limit
  // raise with real values (matches external references, e.g. bridgedoctor.com,
  // and existing tests) — flag this as a named variant if asked, not a bug.
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
    // SAYC: bid the LONGER major first (e.g. 5 spades + 4 hearts → 1♠ first);
    // with equal length (4-4 or 5-5) bid "up the line" — the cheaper suit
    // (hearts) first, since responder can still show the other on the way.
    const unbidMajors: string[] = [];
    if (partnerBid !== "1♥" && partnerBid !== "1♠" && hand.hearts >= 4)
      unbidMajors.push("hearts");
    if (partnerBid !== "1♠" && hand.spades >= 4) unbidMajors.push("spades");
    if (unbidMajors.length > 0) {
      const suit =
        unbidMajors.length === 2 && hand.spades > hand.hearts
          ? "spades"
          : unbidMajors[0];
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
    // 2-over-1: 5+ hearts over partner's 1♠ (can't bid 1♥ — must go to 2-level).
    // Guard against an extreme-length hand reaching 13+ TP mostly via length
    // points while still under the 10+ HCP floor a 2-level new suit needs.
    if (partnerBid === "1♠" && hand.hearts >= 5 && hand.hcp >= 10) {
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
    // Bid the LONGER major first (5 spades + 4 hearts → 1♠, not 1♥); with
    // equal length (4-4/5-5) bid up the line — hearts (cheaper) first.
    if (
      hand.hearts >= 4 &&
      partnerBid !== "1♥" &&
      partnerBid !== "1♠" &&
      !(hand.spades >= 4 && hand.spades > hand.hearts)
    ) {
      return {
        bid: "1♥",
        category: "New Suit at the 1-Level (13+ TP)",
        reasoning:
          "With 13+ TP and 4+ hearts, bid 1♥. Always show a 4-card major before bidding NT. Like any new-suit response, this is forcing for one round — with your extra values, expect the auction to keep going toward game, but it is not an unconditional game force by itself.",
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "4+ hearts, 13+ pts — forcing one round; game is likely once your strength comes out.",
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
        category: "New Suit at the 1-Level (13+ TP)",
        reasoning:
          "With 13+ TP and 4+ spades, bid 1♠. Like any new-suit response, this is forcing for one round — with your extra values, expect the auction to keep going toward game, but it is not an unconditional game force by itself.",
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "4+ spades, 13+ pts — forcing one round; game is likely once your strength comes out.",
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
      // Unbalanced with no fit and no 4-card major to show: 3NT would
      // misdescribe the hand (3NT here promises balanced shape). Bid the
      // longer minor at the 2-level instead — natural, forcing one round,
      // and keeps a long/self-sufficient suit alive for opener to hear.
      if (!isBalanced(hand)) {
        return {
          bid: `2${suitSymbol(minor)}`,
          category: "Two-Over-One (13+ TP, Unbalanced, No Major Fit)",
          reasoning: `With ${tp} TP but an unbalanced hand (a singleton/void or two doubletons), 3NT would misdescribe your shape — it promises a balanced hand. Bid your ${minor} (2${suitSymbol(minor)}) instead — forcing one round — so partner hears about your long suit before you settle on the final contract.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: `10+ pts, unbalanced, ${hand[minor as keyof Hand]}+ card ${minor} — forcing, no major fit for partner shown yet.`,
          expectedResponses: [
            {
              partnerBid: "Rebid",
              meaning:
                "Describes shape/strength; you continue toward the best game",
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
    // 2-over-1: 5+ hearts over partner's 1♠ (can't bid 1♥ — must go to 2-level).
    // A 2-level new suit needs 10+ HCP specifically (not just 10+ TP padded
    // by length) — SAYC: "you may not bid a new suit at the 2 level on a
    // weak hand." Below that HCP floor, fall through to the forcing 1NT.
    if (partnerBid === "1♠" && hand.hearts >= 5 && hand.hcp >= 10) {
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

export function getResponseToTwoClub(hand: Hand): BidRecommendation {
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

export function getResponseToWeak2(
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
  const partnerSuit = suitFromBid(partnerBid) ?? "diamonds";
  const partnerSuitSym = suitSymbol(partnerSuit);
  const mySupport = hand[partnerSuit as keyof Hand] as number;

  // ── 4+ trump support: bid game directly regardless of HCP ─────────────────
  // Bridgedoctor: "Raise to 4: 4-card support OR 16+ TP with at least 2-card support"
  if (mySupport >= 4) {
    if (partnerSuit === "diamonds") {
      return {
        bid: "4♦",
        category: "Preemptive Raise of Weak 2 (4+ Diamond Support)",
        reasoning: `With ${mySupport}-card diamond support opposite partner's weak 2♦, raise to 4♦ — a pre-emptive partscore raise, not a game-forcing major raise.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "4+ card diamond support — pre-emptive raise in the minor.",
        expectedResponses: [
          { partnerBid: "Pass", meaning: "Accept the raise" },
        ],
        confidence: "high",
      };
    }
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

export function getResponseToPreempt(
  hand: Hand,
  partnerBid: string,
  /** The opponents' latest real bid AFTER partner's preempt, if any. */
  interferenceBid?: string,
): BidRecommendation {
  const analysis = analyzeHand(hand);
  const { hcp } = hand;
  const partnerSuit = suitFromBid(partnerBid) ?? "clubs";
  const mySupport = hand[partnerSuit as keyof Hand] as number;
  const preemptLevel = parseInt(partnerBid[0]) || 3;
  const partnerFloorIdx = BID_ORDER.indexOf(partnerBid);
  const bidAbovePartner = (bid: string) =>
    BID_ORDER.indexOf(bid) > partnerFloorIdx;

  // Very strong hand (16+ HCP): game over pre-empt
  if (hcp >= 16) {
    // If we have a long major, bid it (new suit = game-forcing over preempt)
    const longMajor =
      hand.spades >= 5 ? "spades" : hand.hearts >= 5 ? "hearts" : null;
    if (longMajor && longMajor !== partnerSuit) {
      const gameBid = `4${suitSymbol(longMajor)}`;
      if (bidAbovePartner(gameBid)) {
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
    } else {
      const gameBid = `4${suitSymbol(partnerSuit)}`;
      if (bidAbovePartner(gameBid)) {
        return {
          bid: gameBid,
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
    }
  }

  // Good hand (10-15 HCP): bid a 5-card major as a new forcing suit
  if (hcp >= 10) {
    const longMajor =
      hand.spades >= 5 ? "spades" : hand.hearts >= 5 ? "hearts" : null;
    if (longMajor && longMajor !== partnerSuit) {
      const bid = `${preemptLevel}${suitSymbol(longMajor)}`;
      if (bidAbovePartner(bid)) {
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
    }
    // No 5-card major but 10+ HCP — bid 3NT as game-invitational
    if (hcp >= 13 && analysis.isBalanced && bidAbovePartner("3NT")) {
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
