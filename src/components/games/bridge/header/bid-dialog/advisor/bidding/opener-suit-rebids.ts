import { BID_ORDER, isRealBid } from "./bid-order";
import {
  analyzeHand,
  calcTPWithFit,
  hasVoid,
  longestSuitInfo,
  suitBidLevel,
  suitFromBid,
  suitSymbol,
} from "./hand-evaluation";
import type { BidRecommendation, Hand } from "./types";

export function getRebidAfterSuit(
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
  /** An OPPONENT doubled my opening bid — partner's 2NT response in this
   *  auction is JORDAN (a limit raise of my suit, 10+ pts, 3+ card support),
   *  never a natural balanced invite, and gets a different response ladder. */
  oppDoubledMyOpening = false,
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
    const myCueSuitName = suitFromBid(myOpeningBid) ?? "clubs";
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
      const pSuitNameRB = suitFromBid(partnerResponse!) ?? "clubs";
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

  const myOpenSuit = suitFromBid(myOpeningBid) ?? "clubs";

  const partnerSuit = suitFromBid(partnerResponse) ?? null;

  const myOpenSuitLen = hand[myOpenSuit as keyof Hand] as number;
  const partnerSuitLen = partnerSuit
    ? (hand[partnerSuit as keyof Hand] as number)
    : 0;

  // ── Partner's response was a SPLINTER (double jump in a NEW suit agreeing
  // my opening as trumps) — a game-forcing raise with 4+ support and a
  // singleton/void in the bid suit. Detected by: a real suit response, NOT
  // my opening suit, at a level too high to be a natural new-suit response
  // (skips both the natural AND single-jump levels). Must be checked before
  // any natural-new-suit reading below.
  if (
    !contested &&
    !partnerCuedTheirSuit &&
    partnerFirstBid === undefined &&
    partnerSuit &&
    partnerSuit !== myOpenSuit &&
    /^[1-7][♠♥♦♣]$/.test(partnerResponse)
  ) {
    const openFloorSpl = BID_ORDER.indexOf(myOpeningBid);
    const candidatesSpl = BID_ORDER.filter(
      (b, i) => i > openFloorSpl && b.endsWith(suitSymbol(partnerSuit)),
    );
    const isDoubleJumpSpl =
      candidatesSpl.length >= 3 && candidatesSpl[2] === partnerResponse;
    if (isDoubleJumpSpl) {
      const gameLevelSpl =
        myOpenSuit === "hearts" || myOpenSuit === "spades" ? 4 : 5;
      const gameBidSpl = `${gameLevelSpl}${suitSymbol(myOpenSuit)}`;
      // Slam interest only with real extras opposite the splinter's top range
      // (~14) — otherwise sign off in game; a cuebid explores controls first.
      if (tp >= 17) {
        return {
          bid: gameBidSpl,
          category: "Splinter Response: Slam Try (17+ TP)",
          reasoning: `Partner's ${partnerResponse} is a SPLINTER — a game-forcing raise of ${myOpenSuit} showing a singleton/void in ${partnerSuit}. With ${tp} TP you have extra values opposite it — sign off in ${gameBidSpl} for now (or explore further with a control-showing cuebid if the auction allows); slam interest is worth investigating but game is guaranteed either way.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner:
            "Extra values opposite partner's splinter — game secured, weighing slam.",
          expectedResponses: [],
          confidence: "medium",
        };
      }
      return {
        bid: gameBidSpl,
        category: "Splinter Response: Sign Off in Game",
        reasoning: `Partner's ${partnerResponse} is a SPLINTER — a game-forcing raise of ${myOpenSuit} (4+ support) showing a singleton or void in ${partnerSuit}, NOT a natural ${partnerSuit} suit. With ${tp} TP and no extra slam interest, sign off in ${gameBidSpl}.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "Accepting the splinter's game force — no extra slam interest shown.",
        expectedResponses: [],
        confidence: "high",
      };
    }
  }

  // Partner raised our suit
  if (partnerSuit === myOpenSuit) {
    const partnerBidLvl = parseInt(partnerResponse[0]) || 2;
    // PREFERENCE, not a raise: if partner FIRST bid a different suit and is now
    // returning to opener's suit (e.g. 1♦-2♥-2♠-3♦, partner's 3♦ = preference
    // back to diamonds), it shows simple preference (~6-10), NOT a limit/jump
    // raise.  Opener must not treat it as invitational and leap to game.
    const partnerFirstSuit = partnerFirstBid
      ? (suitFromBid(partnerFirstBid) ?? null)
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
    // A genuine reverse needs 17+ TP; a same-shaped 2-level second suit under
    // that threshold was instead LIFTED there by opponent interference (no
    // extra strength implied) — the story must not claim "after your reverse"
    // for a hand that never had reverse values.
    // The general fact "partner is giving PREFERENCE (not a raise) because I
    // showed a second suit" — true whether that second suit was a genuine
    // reverse (17+) or one LIFTED there by interference (no extra strength).
    const partnerGaveMerePreference =
      !!partnerFirstBid &&
      /^[1-7][♠♥♦♣]$/.test(partnerFirstBid) &&
      partnerFirstBid.slice(1) !== myOpeningBid.slice(1) &&
      !!myLatestBid &&
      /^2[♠♥♦♣]$/.test(myLatestBid) &&
      myLatestBid.slice(1) !== myOpeningBid.slice(1);
    const raiseWasPreference = partnerGaveMerePreference && tp >= 17;
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
          : partnerGaveMerePreference
            ? "Bid Game After the Interference-Lifted Preference (19+ support pts)"
            : "Bid Game After Raise (19-21 support pts)",
        reasoning: raiseWasPreference
          ? `Partner's ${partnerResponse} was the forced PREFERENCE back to your ${myOpenSuit} after your reverse — about 6-9 points with 3+ card support. With ${supportTP} support points (${hand.hcp} HCP plus ruffing values) even that minimum brings the combined total to game: bid ${gameLevelBid}.`
          : partnerGaveMerePreference
            ? `Partner's ${partnerResponse} is PREFERENCE back to your ${myOpenSuit}, not a raise — you showed a second suit only because the opponents' interference took away the cheap 1-level call, so the preference still shows only about 6-9 points with 3+ card support. With ${supportTP} support points (${hand.hcp} HCP plus ruffing values) even that minimum brings the combined total to game: bid ${gameLevelBid}.`
            : `Partner raised your ${myOpenSuit}. With ${supportTP} support points (${hand.hcp} HCP plus short-suit ruffing values for the fit), bid game (${gameLevelBid}). Note: if partner has a maximum simple raise (8-9 support pts), consider 4NT Blackwood first to explore slam.`,
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

    // ── Partner's 2NT is JORDAN, not a natural invite: an opponent doubled my
    // opening, so 2NT is a conventional LIMIT RAISE of my suit (10+ pts, 3+
    // card support) — never played as notrump.  Sign off in my suit with a
    // minimum (13-15), bid game with extras (16+).
    if (
      oppDoubledMyOpening &&
      partnerResponse === "2NT" &&
      !myOpeningBid.endsWith("NT")
    ) {
      const jordanGameBid =
        myOpenSuit === "hearts" || myOpenSuit === "spades"
          ? `4${suitSymbol(myOpenSuit)}`
          : `5${suitSymbol(myOpenSuit)}`;
      const jordanSignoff = `3${suitSymbol(myOpenSuit)}`;
      if (tp >= 16) {
        return {
          bid: jordanGameBid,
          category: "Accept Jordan 2NT (16+ TP)",
          reasoning: `Partner's 2NT is Jordan — a limit raise of your ${myOpenSuit} (10+ pts, 3+ card support) after the opponents' double, NOT a natural NT bid. With ${tp} TP you have enough for game: bid ${jordanGameBid}.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: `Accepting the Jordan raise — game in ${myOpenSuit}.`,
          expectedResponses: [],
          confidence: "high",
        };
      }
      return {
        bid: jordanSignoff,
        category: "Sign Off After Jordan 2NT (13-15 TP)",
        reasoning: `Partner's 2NT is Jordan — a limit raise of your ${myOpenSuit} (10+ pts, 3+ card support) after the opponents' double, NOT a natural NT bid (2NT is never the final contract here). With a minimum opener (${tp} TP), sign off at ${jordanSignoff}.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `Minimum opener (13-15) — signing off in ${myOpenSuit} rather than playing 2NT.`,
        expectedResponses: [
          { partnerBid: "Pass", meaning: "Accepting the partscore" },
        ],
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
      // Interference (e.g. RHO overcalls between partner's 1NT and my turn)
      // can make the 2-level rebid ILLEGAL, lifting the cheapest available
      // call to 3-level — that 3-level call is then FORCED, not a genuine
      // invitational jump, and must not be mislabeled as 16-18.
      const twoLevelRebid = `2${suitSymbol(myOpenSuit)}`;
      const cheapestLegalRebid = interferenceBid
        ? BID_ORDER.find(
            (b, i) =>
              i > BID_ORDER.indexOf(interferenceBid) &&
              b.endsWith(suitSymbol(myOpenSuit)),
          )
        : twoLevelRebid;
      const twoLevelBlocked = cheapestLegalRebid !== twoLevelRebid;
      const openIsMajor = myOpenSuit === "hearts" || myOpenSuit === "spades";
      if (twoLevelBlocked && tp < 19) {
        return {
          bid: cheapestLegalRebid ?? twoLevelRebid,
          category:
            "Rebid Own Suit — Lifted by Interference (Cheapest Available)",
          reasoning: `Partner bid 1NT (6-12 pts), but the opponents' ${interferenceBid} took away the natural ${twoLevelRebid} rebid — ${cheapestLegalRebid ?? twoLevelRebid} is the cheapest ${myOpenSuit} call still available. The level rose only because of their interference, so this needs no extra strength beyond a standard opening (roughly 12-18 — the level alone can't separate a minimum from an invitational hand here).`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: `6+ card ${myOpenSuit} suit, shown a level higher only due to interference. Partner should not read this as an invitational jump.`,
          expectedResponses: [
            { partnerBid: "Pass", meaning: "Content with the partscore" },
          ],
          confidence: "medium",
        };
      }
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
          reasoning: `Partner bid 1NT (6-12 pts — a semi-forcing 6-10, or the 11-12 forcing variant). With a ${myOpenSuitLen}-card ${myOpenSuit} suit and ${tp} TP, JUMP to 3${suitSymbol(myOpenSuit)} — invitational. A simple 2-level rebid would show only 12-15 and partner would pass with game-going values.`,
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
        reasoning: `Partner bid 1NT (6-12 pts — a semi-forcing 6-10, or the 11-12 forcing variant). With a minimum opener (${tp} TP) and a ${myOpenSuitLen}-card ${myOpenSuit} suit, rebid 2${suitSymbol(myOpenSuit)} — the routine minimum rebid; the long suit plays better than 1NT.`,
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
          reasoning: `Partner bid 1NT (6-12 pts — a semi-forcing 6-10, or the 11-12 forcing variant). With ${myOpenSuitLen} ${myOpenSuit} and 4+ ${lowerSideSuit}, bid ${newSuitBid} to show your two-suited hand. No extra strength is needed — partner can return to ${suitSymbol(myOpenSuit)} or choose ${lowerSideSuit}. This helps partner find the best contract.`,
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
        "Partner bid 1NT showing 6-12 pts (a semi-forcing 6-10, or the 11-12 forcing variant with no other bid available). With a minimum opener and fewer than 6 cards in your suit, pass either way — you have nothing extra to add.",
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
    const raiseBidLegal =
      !interferenceBid ||
      !isRealBid(interferenceBid) ||
      BID_ORDER.indexOf(raiseBid) > BID_ORDER.indexOf(interferenceBid);

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
      const raise3Legal = raiseBidLegal;
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
        if (raiseBidLegal) {
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
      }
      if (raiseBidLegal) {
        return {
          bid: partnerGameBid,
          category: `Game Raise (${supportTP} support pts — Strong Opener)`,
          reasoning: `With 4+ card support for partner's ${partnerSuit} and ${supportTP} support points (HCP plus short-suit ruffing points for the fit, 19+), bid game directly — ${partnerGameBid}. There is enough combined strength (opener 19+ + responder 6+) to make game.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: `4+ card ${partnerSuit} support, ${supportTP} support points (19+). This is a game-level bid.`,
          expectedResponses: [
            {
              partnerBid: "Pass",
              meaning: "Minimum responder — game is enough",
            },
            { partnerBid: "4NT", meaning: "Slam interest — Blackwood" },
          ],
          confidence: "high",
        };
      }
    }

    // ── Jump support (invitational): 16-18 support points, or 19 without the
    //    real shortness/strength needed to commit straight to game. ───────────
    if (partnerSuitLen >= 4 && supportTP >= 16) {
      const jumpSupportBid = `${raiseLvl + 1}${suitSymbol(partnerSuit)}`;
      const jumpSupportLegal =
        !interferenceBid ||
        !isRealBid(interferenceBid) ||
        BID_ORDER.indexOf(jumpSupportBid) > BID_ORDER.indexOf(interferenceBid);
      if (jumpSupportLegal) {
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
    }

    // ── 4-card support: simple raise of partner's suit (13-15 support pts) ────
    if (partnerSuitLen >= 4 && supportTP <= 15 && raiseBidLegal) {
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
      !analysis.isBalanced &&
      raiseBidLegal
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
    if (interferenceBid && isRealBid(interferenceBid)) {
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
        // The auction may have moved past the 1-level (e.g. RHO advanced with
        // 1NT before my turn) — the natural landing spot for this suit is
        // then the CHEAPEST level that clears the interference, not a blind
        // "1-level" call, which would be illegal and fall to a phantom pass.
        const oneLevelFloorIdx =
          interferenceBid && isRealBid(interferenceBid)
            ? BID_ORDER.indexOf(interferenceBid)
            : BID_ORDER.indexOf(`1${suitSymbol(oneLevelSuit)}`) - 1;
        const oneLevelBid = BID_ORDER.find(
          (b, i) =>
            i > oneLevelFloorIdx && b.endsWith(suitSymbol(oneLevelSuit)),
        );
        if (oneLevelBid && parseInt(oneLevelBid[0]) <= 2) {
          const wasLifted = oneLevelBid[0] !== "1";
          return {
            bid: oneLevelBid,
            category: `New Suit at ${wasLifted ? "the 2-Level (Lifted by Interference)" : `1-Level (${oneLevelBid})`}`,
            reasoning: wasLifted
              ? `With 4+ ${oneLevelSuit} and partner's ${partnerResponse}, you would show it at the 1-level, but the opponents' ${interferenceBid} took that away — bid ${oneLevelBid} instead. The level rose only because of their interference, so this still needs no extra strength beyond a standard opening.`
              : `With 4+ ${oneLevelSuit} and partner's ${partnerResponse}, bid ${oneLevelBid} to show your second suit at the 1-level. A cheap new suit like this is natural and NOT forcing — no extra strength required beyond a standard opening; partner may pass with a minimum.`,
            handAnalysis: analysis,
            whatYourBidTellsPartner: `4+ ${oneLevelSuit}, two-suited hand${wasLifted ? " (shown a level higher only due to interference)" : ""}. Partner can show a fit or describe their hand further.`,
            expectedResponses: [
              {
                partnerBid: `${parseInt(oneLevelBid[0]) + 1}${suitSymbol(oneLevelSuit)}`,
                meaning: "Fit for your new suit",
              },
              {
                partnerBid: "Pass",
                meaning: "No fit for new suit, minimum values",
              },
            ],
            confidence: "high",
          };
        }
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
      // If the suit was still biddable at the 1-LEVEL over partner's
      // response, a 2-level call SKIPS a level: that is a JUMP SHIFT
      // (19-21, game-forcing), not a reverse — its shape requirement is
      // separate/looser than a true reverse's.
      const oneLevelAvailableRV =
        !!reverseSuit &&
        BID_ORDER.indexOf(`1${suitSymbol(reverseSuit)}`) >
          BID_ORDER.indexOf(partnerResponse);
      // A genuine REVERSE additionally requires the OPENING suit to be
      // LONGER than the second suit (e.g. 5+ diamonds and 4 hearts) — equal
      // length (4-4) does not qualify, since responder couldn't safely give
      // simple preference back to a suit no longer than the one just shown.
      const reverseShapeOk =
        !!reverseSuit && myOpenSuitLen > (hand[reverseSuit] as number);
      if (reverseSuit && (oneLevelAvailableRV || reverseShapeOk)) {
        const reverseBid = `2${suitSymbol(reverseSuit)}`;
        const oneLevelAvailable = oneLevelAvailableRV;
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
    const interferenceFloorIdx =
      interferenceBid && isRealBid(interferenceBid)
        ? BID_ORDER.indexOf(interferenceBid)
        : -1;
    const cheapestAbove = (sym: string) =>
      BID_ORDER.find((b, i) => i > interferenceFloorIdx && b.endsWith(sym));
    if (analysis.isBalanced) {
      const { hcp } = hand;
      const preferredLevel = hcp >= 18 ? 2 : 1;
      const preferredNT = `${preferredLevel}NT`;
      const ntBid =
        BID_ORDER.indexOf(preferredNT) > interferenceFloorIdx
          ? preferredNT
          : (BID_ORDER.find(
              (b, i) => i > interferenceFloorIdx && b.endsWith("NT"),
            ) ?? preferredNT);
      const hcpRange = hcp >= 18 ? "18-19 HCP" : "12-14 HCP";
      return {
        bid: ntBid,
        category: `${ntBid} Rebid After Partner's Double (${hcpRange})`,
        reasoning: `Partner doubled an opponent's bid (or made another non-suit action). With a balanced hand and ${hcp} HCP, rebid ${ntBid} to describe your shape and let partner know you are balanced.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `Balanced hand, ${hcpRange}.`,
        expectedResponses: [],
        confidence: "medium",
      };
    }
    if (myOpenSuitLen >= 5) {
      const rebidBid =
        interferenceBid && isRealBid(interferenceBid)
          ? (cheapestAbove(suitSymbol(myOpenSuit)) ??
            `2${suitSymbol(myOpenSuit)}`)
          : `2${suitSymbol(myOpenSuit)}`;
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

  // Last resort: partner's new-suit response was FORCING for one round (SAYC:
  // any new suit by an unpassed responder demands a rebid), so Pass is not
  // legal here even with an awkward hand (e.g. a doubleton in partner's suit,
  // no 4-card fit anywhere else, too weak/wrong-shaped for a reverse or NT).
  // Rebidding the opening suit at the cheapest level is the standard
  // least-distortion escape — it says nothing beyond "minimum, no better call."
  if (
    partnerSuit &&
    partnerSuit !== myOpenSuit &&
    /^[1-2][♠♥♦♣]$/.test(partnerResponse)
  ) {
    const cheapestOwnIdx = Math.max(
      BID_ORDER.indexOf(partnerResponse),
      interferenceBid && isRealBid(interferenceBid)
        ? BID_ORDER.indexOf(interferenceBid)
        : -1,
    );
    const cheapestOwn = BID_ORDER.find(
      (b, i) => i > cheapestOwnIdx && b.endsWith(suitSymbol(myOpenSuit)),
    );
    if (cheapestOwn && parseInt(cheapestOwn[0]) <= 3) {
      return {
        bid: cheapestOwn,
        category: "Rebid Opening Suit (Forced — No Better Call)",
        reasoning: `Partner's ${partnerResponse} is a new suit — forcing for one round, so you may not pass. With no 4-card fit for ${partnerSuit}, no reverse or jump available, and no balanced NT shape, rebid your ${myOpenSuit} (${cheapestOwn}) at the cheapest level — the standard least-distortion escape for an awkward minimum hand.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `Minimum opener with no clear second suit or fit — repeating ${myOpenSuit} as the least-bad option.`,
        expectedResponses: [],
        confidence: "low",
      };
    }
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

export function getJacoby2NTOpenerRebid(
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
