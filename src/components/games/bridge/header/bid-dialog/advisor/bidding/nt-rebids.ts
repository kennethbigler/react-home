import { BID_ORDER, isRealBid } from "./bid-order";
import {
  analyzeHand,
  calcTPWithFit,
  suitFromBid,
  suitSymbol,
} from "./hand-evaluation";
import type { BidRecommendation, Hand } from "./types";

// ─── Opener's Rebids ──────────────────────────────────────────────────────────

// ─── Responder rebids after a 2NT/3NT response to partner's suit opening ──────

/**
 * I responded 2NT (or 3NT) to partner's suit opening.
 * Partner's current bid is a NATURAL suit rebid (showing a suit), not a convention.
 * Determine whether to raise, bid 3NT, or pass.
 */
export function getResponderNTRebid(
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
    const signOffBid =
      /^4/.test(partnerNaturalBid) &&
      BID_ORDER.indexOf(partnerNaturalBid) > BID_ORDER.indexOf(gameBid)
        ? partnerNaturalBid
        : gameBid;
    return {
      bid: signOffBid,
      category: "Complete the Jacoby Game Force",
      reasoning: `Your 2NT was Jacoby — the auction is FORCING to game in ${majName}. Partner's ${partnerNaturalBid} described their hand; without slam ambitions, sign off in ${signOffBid}.`,
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

  const partnerSuit = suitFromBid(partnerNaturalBid) ?? null;

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
        ? (suitFromBid(partnerFirstBid) ?? null)
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
      // cheapestInPartnerSuit === partnerNaturalBid means the level wasn't a
      // jump — but if interference already lifted that cheapest level above
      // the true natural rebid (2-of-the-suit), the level alone can't prove
      // a minimum; it could be an unrelated stronger hand stuck there too.
      const rebidLifted =
        (!!interferenceLho || !!interferenceRho) &&
        cheapestInPartnerSuit !== `2${suitSymbol(partnerSuit)}`;
      const rebidStrengthText = rebidLifted
        ? "was lifted a level by interference, so it does not clearly show a minimum — it could be a stronger hand stuck there too"
        : `shows a minimum opener with 6+ ${partnerSuit}`;
      return {
        bid: raise ? `3${suitSymbol(partnerSuit)}` : "Pass",
        category: raise
          ? "Raise Opener's Rebid Suit (Maximum 1NT)"
          : "Pass Opener's Minimum Rebid",
        reasoning: `Partner's ${partnerNaturalBid} rebid ${rebidStrengthText}. Your 1NT already told the story (6-10). ${raise ? `With ${hcp} HCP and ${secondLen}-card support, one invitational raise is enough.` : "Pass — this is a playable partscore and you have nothing extra."}`,
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

export function getRebidAfterNT(
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
    const natSuit = suitFromBid(partnerResponse)!;
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
      {
        const noFourCardMajor = !has4Hearts && !has4Spades;
        const belowMaxReason = noFourCardMajor
          ? "no 4-card major to show"
          : `${hcp} HCP, not a maximum`;
        return {
          bid: "Pass",
          category: "Pass — Their Overcall Took the Stayman Answer Away",
          reasoning: `Partner's 2♣ asked for a major, but the opponents' ${oppFloorBid} removed the cheap answers. With ${belowMaxReason}, pass — free bids here promise extras. Partner knows the ask went unanswered and can double, bid a suit, or try notrump with their values.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: `${noFourCardMajor ? "No 4-card major to show" : "No maximum"} over their overcall — your move.`,
          expectedResponses: [],
          confidence: "medium",
        };
      }
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
    const respSuit = suitFromBid(partnerResponse)!;
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
    const hasMinorFit = !respIsMajor && respFit >= 3;
    return {
      bid: "3NT",
      category: "3NT Over Partner's Forcing 3-Level Response",
      reasoning: hasMinorFit
        ? `Partner's ${partnerResponse} is natural and forcing (6+ suit), and you do hold ${respFit}-card ${respSuit} support — but 3NT (9 tricks) still outscores 5-of-a-minor (11 tricks) whenever notrump is playable. Bid 3NT; partner can convert to the minor or try for slam knowing you have the fit.`
        : `Partner's ${partnerResponse} is natural and forcing (6+ suit). Without ${respIsMajor ? "3-card support" : "a reason to prefer the minor"}, bid 3NT — partner can pass or continue toward slam.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: hasMinorFit
        ? `${respFit}-card ${respSuit} support noted, but offering 3NT as the higher-scoring game.`
        : `No great fit for ${respSuit} — offering 3NT as the game.`,
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
export function getStaymanOpenerRebid(
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
    const contSuit = suitFromBid(partnerContinuation);
    const pMajor =
      contSuit === "hearts" || contSuit === "spades" ? contSuit : null;
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
