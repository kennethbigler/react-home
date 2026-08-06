import { BID_ORDER } from "./bid-order";
import {
  analyzeHand,
  calcTPWithFit,
  hasVoid,
  longestSuitInfo,
  suitSymbol,
} from "./hand-evaluation";
import type { BidRecommendation, Hand } from "./types";

// ─── Convention Follow-Ups ───────────────────────────────────────────────────

export function getStaymanFollowUp(
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

export function getTransferFollowUp(
  hand: Hand,
  /** Partner's completed transfer bid (e.g. 2♥ after 2♦ ask), or the transfer ask when completion is not yet reflected. */
  completedSuitBid: string,
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
  const suit = completedSuitBid.includes("♠")
    ? "spades"
    : completedSuitBid.includes("♥") || completedSuitBid.includes("♦")
      ? "hearts"
      : "spades";
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
    const otherMajorBid = `2${suitSymbol(otherMajor)}`;
    if (
      BID_ORDER.indexOf(otherMajorBid) > BID_ORDER.indexOf(completedSuitBid)
    ) {
      return {
        bid: otherMajorBid,
        category: "Transfer: 5-5 Majors, Invitational",
        reasoning: `With 5 ${suit} and 5 ${otherMajor} (8-9 pts), bid ${otherMajorBid} to show the second major. Invitational.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `5 ${suit} and 5 ${otherMajor}, invitational (8-9 pts).`,
        expectedResponses: [],
        confidence: "high",
      };
    }
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

export function getMinorTransferFollowUp(hand: Hand): BidRecommendation {
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
export function getBlackwoodAceResponse(hand: Hand): BidRecommendation {
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
export function getBlackwoodKingsResponse(hand: Hand): BidRecommendation {
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

export function getBlackwoodFollowUp(
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
    const partnerAces = aceCount === 0 ? 0 : aceCount;
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

export function getGerberFollowUp(
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

export function getKingsFollowUp(
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

  const slamSignOff = (
    level: 6 | 7,
    categorySuffix: string,
    reasoningSuffix: string,
  ): BidRecommendation | null => {
    const signOff = `${level}${suitSym}`;
    if (BID_ORDER.indexOf(signOff) <= BID_ORDER.indexOf(partnerReply)) {
      return {
        bid: "Pass",
        category: `Kings Follow-Up: Pass — Partner Already at ${partnerReply}`,
        reasoning: `Partner's ${partnerReply} already reaches or exceeds your ${signOff} sign-off${reasoningSuffix}. Pass and play it.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: categorySuffix,
        expectedResponses: [],
        confidence: "high",
      };
    }
    return null;
  };

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
    const passAtSix = slamSignOff(
      6,
      "Accepting partner's sign-off.",
      " after an unrecognized kings reply",
    );
    if (passAtSix) return passAtSix;
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
    const passAtSeven = slamSignOff(
      7,
      "Accepting partner's grand-slam sign-off.",
      "",
    );
    if (passAtSeven) return passAtSeven;
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
    const passAtSix = slamSignOff(
      6,
      "Accepting partner's small-slam sign-off.",
      " with only three kings total",
    );
    if (passAtSix) return passAtSix;
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

  const passAtSix = slamSignOff(
    6,
    "Accepting partner's small-slam sign-off.",
    ` with only ${totalKings} king${totalKings !== 1 ? "s" : ""} total`,
  );
  if (passAtSix) return passAtSix;

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

export function getGrandSlamForceResponse(
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
