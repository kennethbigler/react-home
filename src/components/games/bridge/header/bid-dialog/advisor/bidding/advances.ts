import { BID_ORDER, isRealBid } from "./bid-order";
import {
  analyzeHand,
  calcTPWithFit,
  hasVoid,
  suitSymbol,
} from "./hand-evaluation";
import { getResponseToOneNT, getResponseToPreempt } from "./responses";
import type { BidRecommendation, Hand } from "./types";

// ─── Responding to Partner's Overcall ────────────────────────────────────────

export function getResponseToSimpleOC(
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
  // Once a trump fit for partner's overcall is known, VALUE with short-suit
  // support points (not raw HCP) — a singleton/void opposite the fit is a
  // real asset (ruffing value), and gating on raw HCP alone understates a
  // hand like 9 HCP + a singleton (12 support points).
  const supportPtsGate = calcTPWithFit(hand);

  if (mySupport >= 3) {
    // Over the opponents' NT (no suit to cue), a 10+ hand with support makes
    // a direct INVITATIONAL raise — the "cuebid = limit raise" tool needs an
    // enemy SUIT; defaulting the cue to clubs invented a bid in an unbid suit.
    if (supportPtsGate >= 10 && !opponentBidSuit) {
      const invRaiseNT = BID_ORDER.find(
        (b, i) =>
          i > BID_ORDER.indexOf(partnerBid) &&
          b.endsWith(suitSymbol(partnerSuit)),
      );
      if (invRaiseNT && parseInt(invRaiseNT[0]) <= 4) {
        return {
          bid: invRaiseNT,
          category: "Invitational Raise of the Overcall (10+ pts)",
          reasoning: `With ${supportPtsGate} support points (${hcp} HCP plus short-suit points for the fit) and ${mySupport}-card support for partner's ${partnerBid}, raise to ${invRaiseNT} — invitational. (The opponents bid notrump, so there is no enemy suit to cuebid; a direct raise carries the values message.)`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: `10+ support points with ${mySupport}-card support — invite game with a sound overcall.`,
          expectedResponses: [
            { partnerBid: "Game", meaning: "Sound overcall — accepting" },
            { partnerBid: "Pass", meaning: "Minimum — high enough" },
          ],
          confidence: "medium",
        };
      }
    }
    if (supportPtsGate >= 10) {
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
          category: "Cue Bid (10+ support pts, 3+ support)",
          reasoning: `With ${supportPtsGate} support points (${hcp} HCP plus short-suit points for the fit) and 3+ card support for partner's overcall, cue bid opener's suit (${cueBid}) to show game interest.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner:
            "10+ support points with support. Looking for game.",
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
    const supportPts = supportPtsGate;
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
        category: `Pass (Auction Above Our Safe Level — ${mySupport}-card support)`,
        reasoning: `With ${mySupport}-card support (est. ${totalTrumps} total trumps), the Law of Total Tricks says your side is safe only to the ${lottSafeLevel}-level — and the auction has already passed that level (whether from a genuine competing bid or a forcing cuebid on the other side). Raising now would commit to more tricks than the trump fit can usually deliver. Pass and let the auction develop (or let partner act with extra shape).`,
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

export function getResponseToJumpOC(
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

export function getResponseToDouble(
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
  /** The bid partner's DOUBLE actually sat over (the real call immediately
   *  before it), when this differs from `opponentBid` (the current floor).
   *  RHO may have ADVANCED past the doubled bid before my turn (e.g. Jordan
   *  2NT answering a takeout double of an opening) — that advance is not
   *  itself "doubled", so the 1NT/2NT/3NT penalty-double branches below must
   *  judge against the true doubled bid, not the current floor, or an
   *  advance gets misread as "partner doubled a natural 2NT/3NT". */
  actualDoubledBid?: string,
): BidRecommendation {
  const analysis = analyzeHand(hand);
  const { hcp } = hand;
  // The opponent's bid is the floor an advance must clear.  In a REOPENING
  // double (e.g. 2♣-(2♠)-P-(P)-X) the floor can be at the 2-level, so a natural
  // 1NT/1-level suit advance is illegal — bids must be lifted above it.
  const oppIdx = isRealBid(opponentBid) ? BID_ORDER.indexOf(opponentBid) : -1;
  const clears = (bid: string) => BID_ORDER.indexOf(bid) > oppIdx;

  // ── RHO has already ADVANCED past the doubled bid (it is no longer the
  // current floor) before my turn: the opponents answered on my partner's
  // behalf, so I am no longer FORCED to bid (a bust may now pass) — but
  // partner's takeout double still wants my best unbid suit, and a FREE BID
  // here shows only ~6+ points, not extras. Pass only weak hands or hands
  // with nothing safe to say at the lifted level.
  if (
    actualDoubledBid &&
    isRealBid(actualDoubledBid) &&
    actualDoubledBid !== opponentBid &&
    isRealBid(opponentBid)
  ) {
    const doubleWasPenalty = actualDoubledBid.endsWith("NT");
    const advSuitName = opponentBid.endsWith("NT")
      ? undefined
      : opponentBid.includes("♠")
        ? "spades"
        : opponentBid.includes("♥")
          ? "hearts"
          : opponentBid.includes("♦")
            ? "diamonds"
            : "clubs";
    const doubledSuitName = doubleWasPenalty
      ? undefined
      : actualDoubledBid.includes("♠")
        ? "spades"
        : actualDoubledBid.includes("♥")
          ? "hearts"
          : actualDoubledBid.includes("♦")
            ? "diamonds"
            : "clubs";
    // 12+ opposite a takeout double is game-going: cue-bid the doubled suit
    // (game-forcing, asks the doubler to keep describing).
    if (!doubleWasPenalty && doubledSuitName && hcp >= 12) {
      const cueBidAdv = BID_ORDER.find(
        (b, i) => i > oppIdx && b.endsWith(suitSymbol(doubledSuitName)),
      );
      if (cueBidAdv && parseInt(cueBidAdv[0]) <= 4) {
        return {
          bid: cueBidAdv,
          category: "Cue-Bid After the Opponents' Advance (12+, Game-Going)",
          reasoning: `Partner's double of ${actualDoubledBid} asked for takeout, and the opponents' ${opponentBid} answered it on their own side's behalf. With ${hcp} HCP opposite partner's opening-strength double, your side still has game — cue-bid their suit (${cueBidAdv}), forcing, and let partner describe.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner:
            "12+ HCP opposite your double — forcing; pick our best suit or bid notrump with their suit stopped.",
          expectedResponses: [
            {
              partnerBid: "Best unbid suit / NT",
              meaning: "Judge game from there",
            },
          ],
          confidence: "medium",
        };
      }
    }
    // Free bid: best suit outside the doubled suit and the opponents' advance
    // suit, at the cheapest level. Roughly 6+ at the 2-level; the 3-level
    // needs a little more (10+, or 8+ with a 5-card suit).
    const freeCandidates = (["spades", "hearts", "diamonds", "clubs"] as const)
      .filter((s) => s !== doubledSuitName && s !== advSuitName)
      .map((s) => ({ name: s, count: hand[s] as number }))
      .sort((a, b) => b.count - a.count);
    const bestFree = freeCandidates[0];
    const minFreeLen = doubleWasPenalty ? 5 : 4;
    const freeBid =
      bestFree && bestFree.count >= minFreeLen
        ? BID_ORDER.find(
            (b, i) => i > oppIdx && b.endsWith(suitSymbol(bestFree.name)),
          )
        : undefined;
    const freeLevel = freeBid ? parseInt(freeBid[0]) : 99;
    const canFreeBid =
      !!freeBid &&
      (freeLevel <= 2
        ? hcp >= 6
        : freeLevel === 3 && (hcp >= 10 || (hcp >= 8 && bestFree.count >= 5)));
    if (canFreeBid && freeBid) {
      return {
        bid: freeBid,
        category: "Free Bid Over the Opponents' Advance (~6+ pts)",
        reasoning: `Partner's double of ${actualDoubledBid} ${doubleWasPenalty ? "was penalty, and the opponents ran" : "asked for takeout, and the opponents answered"} with ${opponentBid} before your turn — so you are no longer forced to bid. But with ${hcp} HCP and ${bestFree.count} ${bestFree.name}, a free bid of ${freeBid} is still right: it competes for the contract and shows real (if modest) values, since passing was available.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `~6+ points with a ${bestFree.count}-card ${bestFree.name} suit — a free (unforced) bid over their advance.`,
        expectedResponses: [
          {
            partnerBid: "Raise / Pass",
            meaning: "Judge from the double's strength",
          },
        ],
        confidence: "medium",
      };
    }
    // Big balanced hand with no suit to show: compete in notrump.
    if (hcp >= 16) {
      const ntCompete = BID_ORDER.find(
        (b, i) => i > oppIdx && b.endsWith("NT"),
      );
      if (ntCompete && parseInt(ntCompete[0]) <= 3) {
        return {
          bid: ntCompete,
          category: "Compete Over the Opponents' Advance (Real Extras)",
          reasoning: `Partner's double of ${actualDoubledBid} showed a real hand, and the opponents' ${opponentBid} answered it on their own side's behalf. With ${hcp} HCP and no suit worth naming, ${ntCompete} competes in notrump — your side holds the balance of power.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: `Real extras beyond a simple advance — competing over the opponents' ${opponentBid}.`,
          expectedResponses: [
            { partnerBid: "Pass or raise", meaning: "Judge from there" },
          ],
          confidence: "medium",
        };
      }
    }
    return {
      bid: "Pass",
      category: "Pass — Opponents Answered the Double",
      reasoning: `Partner doubled ${actualDoubledBid}${doubleWasPenalty ? " (penalty)" : " for takeout"}, and the opponents responded with ${opponentBid} before your turn — they answered the double on their own side's behalf, so you are no longer forced to bid. With ${hcp} HCP and no suit safe to show at this level, pass and let partner (who already showed their hand with the double) decide the next move.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "No free bid available — content to defend or await partner's next call.",
      expectedResponses: [],
      confidence: "medium",
    };
  }

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

export function getResponseToPreemptOC(
  hand: Hand,
  partnerBid: string,
  interferenceBid?: string,
): BidRecommendation {
  return getResponseToPreempt(hand, partnerBid, interferenceBid);
}

export function getResponseTo1NTOvercall(
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
  return getResponseToOneNT(hand, interferenceBid, false);
}

export function getResponseToMichaels(
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

export function getResponseToUnusual2NT(hand: Hand): BidRecommendation {
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
