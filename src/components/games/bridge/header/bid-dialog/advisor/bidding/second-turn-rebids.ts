import { BID_ORDER, isRealBid } from "./bid-order";
import {
  analyzeHand,
  calcTPWithFit,
  hasVoid,
  suitFromBid,
  suitSymbol,
} from "./hand-evaluation";
import type { AuctionContext, BidRecommendation, Hand } from "./types";

// ─── Respond to Partner's Invitational Jump Rebid ────────────────────────────
// Called when partner re-bids their own previously-shown suit at a jump level.
// Example: 1♦ — 1♥ — 2♦ — 3♥: partner showed hearts in round 1 and now invites game.
// Per SAYC: responder's jump rebid in own suit = invitational (10–12 TP, 5+ cards).
// Opener's decision: accept (bid game) if maximum; decline (Pass) if minimum.
export function getRespondToPartnerInvitation(
  hand: Hand,
  myLastBid: string,
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
    !!myLastBid &&
    /^[1-7][♠♥♦♣]$/.test(myLastBid) &&
    myLastBid.slice(1) === partnerInviteBid.slice(1);
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
export function getOvercallerRebid(
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

  // ── My overcall was CAPPELLETTI 2♣ (one-suiter, suit unknown to partner)
  // and partner's advance is the 2♦ RELAY — I MUST name my real suit now
  // (pass would falsely leave the auction in diamonds, a suit I never
  // showed). Only 2♦ demands an answer; a direct raise/pick of my suit
  // (2♥/2♠/3♣ etc., skipping the relay) needs no correction from me.
  if (
    context.myFirstBid === "2♣" &&
    context.lhoBid === "1NT" &&
    context.partnerBid === "2♦" &&
    context.myPreviousBid === "2♣"
  ) {
    const suitsCapp = [
      { name: "spades", count: hand.spades },
      { name: "hearts", count: hand.hearts },
      { name: "diamonds", count: hand.diamonds },
      { name: "clubs", count: hand.clubs },
    ];
    const realSuit = suitsCapp.reduce((best, s) =>
      s.count > best.count ? s : best,
    );
    if (realSuit.name === "diamonds") {
      return {
        bid: "Pass",
        category: "Pass — Diamonds Was the Real Suit",
        reasoning:
          "Partner's 2♦ relay asked which suit your Cappelletti 2♣ concealed. Diamonds happens to be your real suit, so 2♦ already names it — pass.",
        handAnalysis: analysis,
        whatYourBidTellsPartner: "My one-suiter is diamonds.",
        expectedResponses: [],
        confidence: "high",
      };
    }
    // The floor to clear is the highest LIVE call — the relay (2♦) itself,
    // or any opponent bid since (e.g. RHO overcalling the relay) — matching
    // the approach used for the Michaels-answer branch above.
    const floorCappBid = [context.lhoBid, context.rhoBid, "2♦"]
      .filter((b): b is string => isRealBid(b))
      .sort((a, b) => BID_ORDER.indexOf(b) - BID_ORDER.indexOf(a))[0];
    const floorCapp = BID_ORDER.indexOf(floorCappBid);
    // Reveal is forced at 2-level (majors/minor) or 3♣ (clubs consumed 2♣) —
    // same level cap as the Michaels minor answer (3-level) above.
    const nameSuit = BID_ORDER.find(
      (b, i) =>
        i > floorCapp &&
        /^[23]/.test(b) &&
        b.endsWith(suitSymbol(realSuit.name)),
    );
    if (nameSuit) {
      return {
        bid: nameSuit,
        category: "Name Your Real Suit Over the Cappelletti Relay",
        reasoning: `Partner's 2♦ is the artificial relay asking which suit your Cappelletti 2♣ concealed. You cannot pass 2♦ — that would wrongly leave the contract in diamonds. Correct to ${nameSuit} to show your real ${realSuit.count}-card ${realSuit.name} suit.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `My one-suiter is ${realSuit.name} (${realSuit.count}+ cards).`,
        expectedResponses: [
          { partnerBid: "Pass", meaning: "Happy to play your suit" },
          { partnerBid: "Raise", meaning: "Support and extra values" },
        ],
        confidence: "high",
      };
    }
    return {
      bid: "Pass",
      category: "Pass — Cappelletti Relay Blocked",
      reasoning: `Partner's 2♦ is the artificial relay asking which suit your Cappelletti 2♣ concealed — it is not a natural diamond advance. The opponents' ${floorCappBid} has taken away every legal reveal of your ${realSuit.count}-card ${realSuit.name} at the 2–3 level, so you cannot correct the relay; pass and let partner decide.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "Nothing new — relay blocked, no valid suit reveal available.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  const myOcBid = context.myFirstBid ?? context.myPreviousBid;
  const myOcSuit = suitFromBid(myOcBid);
  const partnerLatest = context.partnerBid;
  const partnerSuit = suitFromBid(partnerLatest);
  const openerSuit = suitFromBid(context.lhoBid);
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
    const latestIdx = Math.max(
      BID_ORDER.indexOf(partnerLatest),
      ...[context.lhoBid, context.rhoBid]
        .filter((b): b is string => isRealBid(b))
        .map((b) => BID_ORDER.indexOf(b)),
    );
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
export function getResponderRebid(
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
    // A REVERSE requires the opener's rebid suit to be UNAVAILABLE at the
    // 1-level GIVEN THE ACTUAL AUCTION — i.e. 1-of-that-suit would no longer
    // be a legal call once my own response (which may itself outrank it) is
    // on the table. That is what forces the level up and demands 17+. When
    // the 1-level call in that suit was genuinely still open at the moment
    // opener bid (opener skipped it to jump straight to 2-of-the-suit), the
    // bid is a JUMP SHIFT (19+, game-forcing) instead. Comparing only against
    // pFirstRV (opener's own opening) ignores my intervening response, which
    // can itself have consumed that rank — e.g. 1♦–1♠–2♥: hearts ranks BELOW
    // spades, so 1♥ is no longer legal once 1♠ was bid, making 2♥ a genuine
    // reverse, not a jump shift, even though 1♥ ranks above 1♦.
    const secondSuitSymRV = pLatestRV?.slice(1);
    const rebidFloorRV = Math.max(
      BID_ORDER.indexOf(pFirstRV ?? ""),
      myPrevRV ? BID_ORDER.indexOf(myPrevRV) : -1,
    );
    const oneLevelOfSecondSuitWasOpen =
      !!secondSuitSymRV && BID_ORDER.indexOf(`1${secondSuitSymRV}`) >= 0
        ? BID_ORDER.indexOf(`1${secondSuitSymRV}`) > rebidFloorRV
        : false;
    const isReverseRV =
      !!pFirstRV &&
      !!pLatestRV &&
      /^1[♠♥♦♣]$/.test(pFirstRV) &&
      /^2[♠♥♦♣]$/.test(pLatestRV) &&
      pLatestRV.slice(1) !== pFirstRV.slice(1) &&
      (!myPrevRV || pLatestRV.slice(1) !== myPrevRV.slice(1)) &&
      "♣♦♥♠".indexOf(pLatestRV.slice(1)) > "♣♦♥♠".indexOf(pFirstRV.slice(1)) &&
      !oneLevelOfSecondSuitWasOpen;
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
    // A JUMP SHIFT (opener skipped an available cheap same-suit call to jump
    // straight to 2-of-a-new-suit): 19+ TP, GAME-FORCING. Unlike a reverse,
    // responder may NOT sign off below game even with a minimum — the auction
    // is forced to game regardless of what responder holds.
    const isJumpShiftRV =
      !!pFirstRV &&
      !!pLatestRV &&
      /^1[♠♥♦♣]$/.test(pFirstRV) &&
      /^2[♠♥♦♣]$/.test(pLatestRV) &&
      pLatestRV.slice(1) !== pFirstRV.slice(1) &&
      (!myPrevRV || pLatestRV.slice(1) !== myPrevRV.slice(1)) &&
      oneLevelOfSecondSuitWasOpen;
    if (isJumpShiftRV && myPrevRV && /^[1-7][♠♥♦♣]$/.test(myPrevRV)) {
      const mySuitNameJS = myPrevRV.includes("♠")
        ? "spades"
        : myPrevRV.includes("♥")
          ? "hearts"
          : myPrevRV.includes("♦")
            ? "diamonds"
            : "clubs";
      const myLenJS = hand[mySuitNameJS as keyof Hand] as number;
      const floorJSIdx = BID_ORDER.indexOf(pLatestRV);
      const secondSuitSymJS = pLatestRV.slice(1);
      const secondSuitNameJS =
        secondSuitSymJS === "♠"
          ? "spades"
          : secondSuitSymJS === "♥"
            ? "hearts"
            : secondSuitSymJS === "♦"
              ? "diamonds"
              : "clubs";
      const myFitJS2 = hand[secondSuitNameJS as keyof Hand] as number;
      const preferenceJS = BID_ORDER.find(
        (b, i) => i > floorJSIdx && b.endsWith(secondSuitSymJS),
      );
      // Priorities: RAISE partner's jump-shift suit with 4+ support (their
      // suit is 4+, so that is a guaranteed 8-card fit — never hide it);
      // else keep describing shape by rebidding a 5+ card suit of my own;
      // else the cheapest preference.
      const raiseJS = myFitJS2 >= 4 ? preferenceJS : undefined;
      const rebidJS =
        !raiseJS && myLenJS >= 5
          ? BID_ORDER.find(
              (b, i) => i > floorJSIdx && b.endsWith(suitSymbol(mySuitNameJS)),
            )
          : undefined;
      const fallbackJS = raiseJS ?? rebidJS ?? preferenceJS;
      if (fallbackJS) {
        return {
          bid: fallbackJS,
          category:
            "Keep the Force Alive After Jump Shift (19-21, Game-Forcing)",
          reasoning: `Partner's ${pLatestRV} is a JUMP SHIFT — 19-21 TP, a game-forcing two-suiter. Even with only ${tp} TP you must NOT sign off below game: this auction is forced. ${raiseJS ? `With ${myFitJS2}-card support for partner's ${secondSuitNameJS} (they promised 4+), raise to ${fallbackJS} — an 8-card fit is guaranteed.` : rebidJS ? `Rebid your ${myLenJS}-card ${mySuitNameJS} suit (${fallbackJS}) to keep describing your hand.` : `Bid ${fallbackJS} to keep the auction alive while partner continues to describe their hand.`}`,
          handAnalysis: analysis,
          whatYourBidTellsPartner:
            "Continuing to describe the hand — the auction is forced to game regardless of my exact strength.",
          expectedResponses: [
            {
              partnerBid: "Any rebid",
              meaning: "Describes opener's hand further — keep going to game",
            },
          ],
          confidence: "medium",
        };
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

  const partnerLatest = context.partnerBid;
  const partnerFirst = context.partnerFirstBid ?? partnerLatest;
  const myBid = context.myPreviousBid;
  const mySuit = suitFromBid(myBid);
  const pFirstSuit = suitFromBid(partnerFirst);
  const pLatestSuit = suitFromBid(partnerLatest);

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
  // Partner choosing NT (e.g. 3NT over my forcing new suit), rebidding/
  // jumping in THEIR OWN first suit again, OR showing a DIFFERENT new suit
  // that is neither my suit nor their own first suit (e.g. opener's second
  // suit) is a decision that does NOT agree my long suit as trumps — my suit
  // has no ruffing value without an agreed fit, so it must NOT count as "the
  // fit" here. Only an actual raise of my suit, or partner staying silent on
  // strain (no real bid beyond the opening), lets my own long suit stand in
  // as the fit.
  const partnerDeclinedMySuit = !!(
    mySuit &&
    !partnerRaisedMe &&
    isRealBid(partnerLatest) &&
    (partnerLatest?.endsWith("NT") || (!!pLatestSuit && pLatestSuit !== mySuit))
  );
  const fitSuit = partnerRaisedMe
    ? mySuit
    : pFirstSuit &&
        myLenIn(pFirstSuit) >= 3 &&
        pFirstSuit !== "clubs" &&
        pFirstSuit !== "diamonds"
      ? pFirstSuit
      : // Partner's SECOND suit (their latest bid, e.g. a 1♠ rebid) promises
        // 4+ cards — 4-card support completes a guaranteed 8-card major fit.
        pLatestSuit &&
          pLatestSuit !== mySuit &&
          pLatestSuit !== pFirstSuit &&
          (pLatestSuit === "hearts" || pLatestSuit === "spades") &&
          myLenIn(pLatestSuit) >= 4
        ? pLatestSuit
        : mySuit && myLenIn(mySuit) >= 6 && !partnerDeclinedMySuit
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
      const myFitLen = myLenIn(fitSuit);
      const minCombinedFit = myFitLen + (partnerRaisedMe ? 3 : 4);
      return {
        bid: `4${suitSymbol(fitSuit)}`,
        category: "Bid Major Game After Opener's Rebid",
        reasoning: `Partner's rebid shows at least ${openerMin} points; with your ${myValue} support points (HCP plus short-suit points for the ${fitSuit} fit) the combined ${combined}+ is enough for game. Bid 4${suitSymbol(fitSuit)} with the at-least-${minCombinedFit}-card ${fitSuit} fit.`,
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
      reasoning: `Partner's rebid shows at least ${openerMin} points; with your ${tp} TP the combined ${combined}+ is enough for game. With no guaranteed 8-card major fit, 3NT is the standard game.${fiveCardMajorRR ? ` (You do hold ${myLenIn(fiveCardMajorRR)} ${fiveCardMajorRR} — partner's bidding denied 4-card support, though a ${myLenIn(fiveCardMajorRR)}-${myLenIn(fiveCardMajorRR) >= 6 ? "2" : "3"} fit is still possible; checking back with a new-minor 2♣ first is a reasonable alternative.)` : ""}`,
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
    // 2NT is the invitational NT bid whether or not 1NT is also still
    // available (a cheap 1NT would show a weak 6-10 hand instead). Over a
    // suit the OPPONENTS have bid, it still promises a stopper there.
    {
      const cheapNTInv = cheapestIn("NT");
      const oppBidSuitInv = [context.lhoBid, context.rhoBid].some(
        (b) => !!b && isRealBid(b) && !b.endsWith("NT"),
      );
      if (
        (cheapNTInv === "1NT" || cheapNTInv === "2NT") &&
        (!oppBidSuitInv || hand.hasStopperInOpponentSuit !== false)
      ) {
        return {
          bid: "2NT",
          category: "Invitational 2NT After Opener's Rebid",
          reasoning: `Partner's rebid shows at least ${openerMin} points; your ${tp} TP is invitational. With no fit to raise, invite with 2NT — partner passes with a minimum, bids 3NT with extras.${cheapNTInv === "1NT" ? " (A cheap 1NT instead would show a weak 6-10 hand.)" : ""}`,
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
  }

  // ── Minimum (6-10): place the partscore ──
  // Preference between partner's two suits. With EQUAL length (e.g. 3-3),
  // still prefer the FIRST suit — partner's first suit is at least as long
  // as the second (the classic "false preference").
  if (
    pFirstSuit &&
    pLatestSuit &&
    pFirstSuit !== pLatestSuit &&
    pLatestSuit !== mySuit &&
    (myLenIn(pFirstSuit) > myLenIn(pLatestSuit) ||
      // Equal length: false preference needs a real holding (3+ cards).
      (myLenIn(pFirstSuit) === myLenIn(pLatestSuit) &&
        myLenIn(pFirstSuit) >= 3))
  ) {
    const pref = cheapestIn(suitSymbol(pFirstSuit));
    if (pref && parseInt(pref[0]) <= 3) {
      return {
        bid: pref,
        category: "Preference to Opener's First Suit",
        reasoning: `Partner showed two suits (${pFirstSuit}, then ${pLatestSuit}). With ${myLenIn(pFirstSuit) > myLenIn(pLatestSuit) ? "more cards in" : `equal length (${myLenIn(pFirstSuit)}-${myLenIn(pLatestSuit)}) — and partner's FIRST suit is at least as long as the second, so prefer`} ${pFirstSuit}, give simple preference (${pref}). This shows no extra strength.`,
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

  // Even with a minimum, RAISE partner's second suit once with 4-card
  // support (their new suit promised 4+, so the 8-card fit is known) — the
  // single raise (6-9) improves the partscore and shows the fit; passing
  // buries it.
  {
    const secondSuitRaiseRR =
      pLatestSuit &&
      pFirstSuit &&
      pLatestSuit !== pFirstSuit &&
      pLatestSuit !== mySuit &&
      myLenIn(pLatestSuit) >= 4
        ? cheapestIn(suitSymbol(pLatestSuit))
        : undefined;
    if (secondSuitRaiseRR && parseInt(secondSuitRaiseRR[0]) <= 2) {
      return {
        bid: secondSuitRaiseRR,
        category: "Single Raise of Partner's Second Suit (6-9)",
        reasoning: `Partner's second suit promised 4+ ${pLatestSuit}, and you hold ${myLenIn(pLatestSuit)} — a known 8-card fit. Even with a minimum (${tp} TP), give the single raise to ${secondSuitRaiseRR}: it shows the fit, improves the partscore, and makes it harder for the opponents to balance. Passing would bury the fit.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `4-card ${pLatestSuit} support, 6-9 — a minimum raise; pass without extras.`,
        expectedResponses: [
          { partnerBid: "Pass", meaning: "Minimum opener — high enough" },
          { partnerBid: "Game try", meaning: "Extras — inviting" },
        ],
        confidence: "high",
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
export function getAdvancerRebid(
  hand: Hand,
  partnerFirstBid: string | undefined,
  partnerLatestBid: string | undefined,
  auctionOpeningBid?: string,
  myPreviousBid?: string,
  lhoBid?: string,
  rhoBid?: string,
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

  // Partner's first bid was a CUEBID of the opening suit (Michaels) — it was
  // artificial, NOT a natural suit. Treat only their later bids as natural.
  const firstWasCuebid =
    !!partnerFirstBid &&
    !!auctionOpeningBid &&
    /^[1-7][♠♥♦♣]$/.test(partnerFirstBid) &&
    /^[1-7][♠♥♦♣]$/.test(auctionOpeningBid) &&
    partnerFirstBid.slice(1) === auctionOpeningBid.slice(1) &&
    partnerFirstBid !== auctionOpeningBid;

  const sFirst = firstWasCuebid ? undefined : suitFromBid(partnerFirstBid);
  const sLatest = suitFromBid(partnerLatestBid);

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
      const floorIdx = Math.max(
        BID_ORDER.indexOf(partnerLatestBid),
        ...[lhoBid, rhoBid]
          .filter((b): b is string => isRealBid(b))
          .map((b) => BID_ORDER.indexOf(b)),
      );
      const prefIdx = BID_ORDER.findIndex(
        (b, i) => i > floorIdx && b.endsWith(suitSymbol(sFirst)),
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
      const floorIdx = Math.max(
        BID_ORDER.indexOf(partnerLatestBid),
        ...[lhoBid, rhoBid]
          .filter((b): b is string => isRealBid(b))
          .map((b) => BID_ORDER.indexOf(b)),
      );
      const raiseBid = BID_ORDER.find(
        (b, i) => i > floorIdx && b.endsWith(suitSymbol(sLatest)),
      );
      if (raiseBid && parseInt(raiseBid[0]) <= 4) {
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

export function getProtectiveRebid(
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
    const realOppBids = [lhoBid, rhoBid].filter((b): b is string =>
      isRealBid(b),
    );
    const oppBid = realOppBids.sort(
      (a, b) => BID_ORDER.indexOf(a) - BID_ORDER.indexOf(b),
    )[realOppBids.length - 1];
    const oppIdx = oppBid ? BID_ORDER.indexOf(oppBid) : -1;
    const liveMinRebidIdx =
      oppIdx >= 0
        ? BID_ORDER.findIndex(
            (bid, i) => i > oppIdx && bid.endsWith(myOpenSuitSym),
          )
        : -1;
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
    // Two ways in: 16+ HCP with tolerable shape, OR a normal opening with
    // PERFECT takeout shape — a singleton/void in their suit and 3+ cards in
    // every unbid suit (e.g. 4-1-4-4 over their raised hearts). SAYC openers
    // compete with the shape double rather than selling out at a low level.
    const perfectShapeCD =
      !!oppSuitName && oppSuitLen <= 1 && unbidOkCD && hcp >= 12;
    if (
      oppBid &&
      parseInt(oppBid[0]) <= 2 &&
      ((hcp >= 16 && (!oppSuitName || oppSuitLen <= 3) && unbidOkCD) ||
        perfectShapeCD)
    ) {
      return {
        bid: "Double",
        category:
          hcp >= 16
            ? "Competitive Double (Extra Values)"
            : "Competitive Double (Takeout Shape)",
        reasoning:
          hcp >= 16
            ? `The opponents are competing over your ${myOpeningBid} opening and partner has not acted. With ${hcp} HCP (extras), shortness in their suit, and 3+ cards in every unbid suit, double to show a strong hand that can handle partner bidding any unbid suit.`
            : `The opponents are competing over your ${myOpeningBid} opening and partner has not acted. With a ${oppSuitLen === 0 ? "void" : "singleton"} in their suit and 3+ cards in every unbid suit, this is a PERFECT takeout double — competing beats selling out at the 2-level, and partner (who may have been shut out) picks the strain.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          hcp >= 16
            ? "16+ HCP, extras for the opening bid, support for the unbid suits. Partner: bid your best suit or pass for penalties with length/strength in their suit."
            : "Opening values with shortness in their suit and support for every unbid suit — takeout. Bid your best suit; pass only to convert to penalty.",
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
