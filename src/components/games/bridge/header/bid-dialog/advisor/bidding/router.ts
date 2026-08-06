import {
  getResponseTo1NTOvercall,
  getResponseToDouble,
  getResponseToJumpOC,
  getResponseToMichaels,
  getResponseToPreemptOC,
  getResponseToSimpleOC,
  getResponseToUnusual2NT,
} from "./advances";
import { BID_ORDER, isRealBid } from "./bid-order";
import {
  getBlackwoodAceResponse,
  getBlackwoodFollowUp,
  getBlackwoodKingsResponse,
  getGerberFollowUp,
  getGrandSlamForceResponse,
  getKingsFollowUp,
  getMinorTransferFollowUp,
  getStaymanFollowUp,
  getTransferFollowUp,
} from "./conventions";
import {
  getAfterOwnDouble,
  getRebidAfterNegativeDouble,
  getRespondingToSuitAfterDouble,
  getResponseTo1NTDoubled,
} from "./double-rebids";
import { analyzeHand } from "./hand-evaluation";
import {
  getRebidAfterNT,
  getResponderNTRebid,
  getStaymanOpenerRebid,
} from "./nt-rebids";
import {
  getJacoby2NTOpenerRebid,
  getRebidAfterSuit,
} from "./opener-suit-rebids";
import { getOpeningBid } from "./openings";
import {
  getCappellettiAdvance,
  getNegativeDouble,
  getOvercall,
} from "./overcalls";
import {
  getResponseTo3NTOpening,
  getResponseToOneNT,
  getResponseToPreempt,
  getResponseToSuit,
  getResponseToTwoClub,
  getResponseToTwoNT,
  getResponseToWeak2,
} from "./responses";
import {
  getAdvancerRebid,
  getOvercallerRebid,
  getProtectiveRebid,
  getRespondToPartnerInvitation,
  getResponderRebid,
} from "./second-turn-rebids";
import type { AuctionContext, BidRecommendation, Hand } from "./types";

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
      const w2Contested =
        isRealBid(context.rhoBid) ||
        isRealBid(context.lhoBid) ||
        context.rhoBid === "Double" ||
        context.lhoBid === "Double";
      return getResponseToWeak2(
        hand,
        context.partnerBid ?? "2♥",
        w2Contested,
        w2Interference,
      );
    }

    case "responding-preempt": {
      const preemptInterference = [context.lhoBid, context.rhoBid]
        .filter((b): b is string => isRealBid(b))
        .sort((a, b) => BID_ORDER.indexOf(b) - BID_ORDER.indexOf(a))[0];
      return getResponseToPreempt(
        hand,
        context.partnerBid ?? "3♥",
        preemptInterference,
      );
    }

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
        // The bid partner's Double actually sat over — when this differs
        // from the current floor, RHO has already ADVANCED past it (e.g.
        // Jordan 2NT over a takeout double), and the handler must not
        // misread that advance as "partner doubled a natural 2NT/3NT".
        context.doubledBid,
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

    case "advancing-cappelletti":
      return getCappellettiAdvance(
        hand,
        context.partnerBid ?? "2♣",
        context.interferenceOverCappelletti,
      );

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
        // An opponent DOUBLED my opening (not a real bid, so it never
        // appears in interferenceBid) — partner's 2NT response in this
        // auction is JORDAN (a limit raise of my suit), not a natural
        // balanced invite, and must be answered on that ladder instead.
        context.lhoBid === "Double" || context.rhoBid === "Double",
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
        context.lhoBid,
        context.rhoBid,
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
    const bestBid = validBids.reduce((a, b) =>
      BID_ORDER.indexOf(a) < BID_ORDER.indexOf(b) ? a : b,
    );
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
