import { BID_ORDER, isRealBid } from "./bid-order";
import {
  analyzeHand,
  calcTPWithFit,
  longerMinor,
  longestSuitInfo,
  suitSymbol,
} from "./hand-evaluation";
import type { BidRecommendation, Hand } from "./types";

export function getRebidAfterNegativeDouble(
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
  const spadesUnbid = !overcalledSpades && !iOpenedSpades;
  const heartsUnbid = !overcalledHearts && !iOpenedHearts;
  // When the overcall was a MINOR, BOTH majors are unbid and genuinely shown
  // by the double — prefer whichever one I actually hold 4+ cards in (I can
  // only show one suit at a time); if I hold both equally, spades outranks.
  // A single unbid major (overcall was itself a major) has only one answer.
  const shownSuit =
    spadesUnbid && heartsUnbid
      ? hand.hearts >= 4 && hand.spades < 4
        ? "hearts"
        : "spades"
      : spadesUnbid
        ? "spades"
        : heartsUnbid
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
  // A hand too strong for the cheapest rebid (16+ TP) sometimes has NO safe
  // way to show it: the jump is blocked by suit length (a 5-card suit can
  // only jump to the 3-level, not 4), there's no fit for partner's suit, and
  // no stopper for a natural NT bid.  The bid stays at the cheap level, but
  // the story must NOT falsely claim "minimum (12-15)" for a genuinely
  // stronger hand — that would misdescribe it to partner (and to the user).
  if (tp >= 16) {
    return {
      bid: ownSuitRebidND,
      category: "Rebid Own Suit — Cheapest Legal Level (Extras Undisclosed)",
      reasoning: `No fit for partner's shown suit, no stopper for NT, and with only ${myOpenLen} ${openSuit} the auction has no room for a safe jump (that would need a 6+ card suit or a fit). With ${tp} TP you are too strong for a true minimum, but ${ownSuitRebidND} is the only safe rebid available — plan to bid again over partner's next call to show the extra strength.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `${openSuit} suit rebid at the cheapest level — undisclosed extras (${tp} TP); expect another bid from me.`,
      expectedResponses: [],
      confidence: "medium",
    };
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
export function getResponseTo1NTDoubled(hand: Hand): BidRecommendation {
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
export function getAfterOwnDouble(
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

export function getRespondingToSuitAfterDouble(
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
