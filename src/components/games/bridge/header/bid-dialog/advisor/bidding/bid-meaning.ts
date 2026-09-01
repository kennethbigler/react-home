import { BID_ORDER, isRealBid } from "./bid-order";
import { suitSymbol } from "./hand-evaluation";

export interface BidMeaningContext {
  /** Most recent non-pass bid before this one */
  prevHighBid?: string;
  /** Bidder's own previous real bid in this auction */
  bidderPreviousBid?: string;
  /** Bidder's partner's previous real bid (`"none"` when partner made no real bid) */
  bidderPartnerPreviousBid?: string;
  /** First real bid of the whole auction */
  auctionOpeningBid?: string;
  /** Partner's first real bid when it differs from their latest */
  bidderPartnerFirstBid?: string;
  /** True when the call immediately before this bid was an opponent's double */
  oppDoubledJustBefore?: boolean;
}

// ─── Bid meaning lookup ───────────────────────────────────────────────────────

/**
 * Returns a short plain-English interpretation of what `bid` likely means,
 * given who made it relative to the user.
 *
 * Pass contextual fields via `context` to unlock context-aware interpretations
 * for conventional bids (e.g. Stayman, Jacoby Transfers).
 */
export function getBidMeaning(
  bid: string,
  relationship: "partner" | "lho" | "rho",
  {
    prevHighBid,
    bidderPreviousBid,
    bidderPartnerPreviousBid,
    auctionOpeningBid,
    bidderPartnerFirstBid,
    oppDoubledJustBefore = false,
  }: BidMeaningContext = {},
): string {
  const isPartner = relationship === "partner";
  const isOpponent = relationship === "lho" || relationship === "rho";

  // ── Advancing/completing a CAPPELLETTI call over the opponents' 1NT ────────
  // If the bidder's OWN partner's first (or only) real call was Cappelletti
  // (2♣/2♦/2♥/2♠/2NT directly over the auction's opening 1NT — i.e. NOT the
  // bidder's side's own NT), this bidder's suit call is choosing/advancing
  // that convention — not a natural rebid, preempt, Gerber, or anything the
  // generic level-based tables below would otherwise guess.
  {
    const partnerCapp = bidderPartnerFirstBid ?? bidderPartnerPreviousBid;
    const partnerMadeCappelletti =
      auctionOpeningBid === "1NT" &&
      !!partnerCapp &&
      /^2[♣♦♥♠]$|^2NT$/.test(partnerCapp) &&
      partnerCapp !== auctionOpeningBid &&
      // Cappelletti is a DEFENSE to the 1NT opening — it exists only on the
      // side OPPOSING the opener. If the bidder's own earlier call was the
      // opening 1NT itself (or the bidder is otherwise that side), partner's
      // "2-level call" is a natural escape/rebid on the 1NT-opening side, not
      // Cappelletti.
      bidderPreviousBid !== "1NT" &&
      bidderPreviousBid !== auctionOpeningBid &&
      // If the BIDDER's own previous call was itself a Cappelletti-qualifying
      // call, partner's "2X" is answering/relaying to THEM, not making a new
      // Cappelletti call for the bidder to advance — e.g. I bid 2♣
      // (Cappelletti one-suiter), partner relays 2♦, and I now name my real
      // suit. That is "completing my own convention," not "advancing
      // partner's" — the generic wording below would have it backwards.
      !/^2[♣♦♥♠]$|^2NT$/.test(bidderPreviousBid ?? "");
    if (
      partnerMadeCappelletti &&
      /^[2-4][♠♥♦♣]$/.test(bid) &&
      bid !== partnerCapp
    ) {
      const suitNameCA = bid.includes("♠")
        ? "spades"
        : bid.includes("♥")
          ? "hearts"
          : bid.includes("♦")
            ? "diamonds"
            : "clubs";
      // A 2♦ reply to partner's Cappelletti 2♣ (one-suiter, suit unknown) is
      // the artificial RELAY asking opener to reveal their real suit — it is
      // never a natural pick of diamonds, unlike advances of the two-suited
      // Cappelletti calls (2♥/2♠/2NT), which genuinely do choose a suit.
      if (partnerCapp === "2♣" && bid === "2♦") {
        return isPartner
          ? "2♦: the Cappelletti RELAY asking partner to reveal their real one-suiter. Artificial — says nothing about diamonds."
          : "2♦ from opponent: the Cappelletti relay asking their partner to reveal their real suit. Artificial — not natural diamonds.";
      }
      return isPartner
        ? `${bid}: choosing/advancing your Cappelletti ${partnerCapp} — naming or picking ${suitNameCA} as the suit to play. Says nothing about extra strength; the level reflects competition, not values.`
        : `${bid} from opponent: choosing/advancing their partner's Cappelletti ${partnerCapp} — naming or picking ${suitNameCA} to play, not extra strength.`;
    }
  }

  // ── Completing MY OWN Cappelletti 2♣ (one-suiter) after partner's 2♦ relay
  // ── The bidder made the original Cappelletti 2♣ call over the opponents'
  // 1NT, partner replied with the artificial 2♦ relay asking for the real
  // suit, and this bid names it. This is the mirror image of the branch
  // above (there, PARTNER made Cappelletti; here, the BIDDER did) — it is
  // never a natural competitive rebid and promises no extra strength.
  if (
    auctionOpeningBid === "1NT" &&
    bidderPreviousBid === "2♣" &&
    bidderPartnerPreviousBid === "2♦" &&
    // The real suit can be named as cheaply as 2♥/2♠ (still 2-level — only
    // clubs needs to jump to 3♣, since 2♣ was already used for Cappelletti).
    /^[23][♠♥♦♣]$/.test(bid) &&
    bid !== "2♦"
  ) {
    const suitNameCC = bid.includes("♠")
      ? "spades"
      : bid.includes("♥")
        ? "hearts"
        : bid.includes("♦")
          ? "diamonds"
          : "clubs";
    return isPartner
      ? `${bid}: naming your real suit over partner's Cappelletti relay (2♦) — your earlier 2♣ was a concealed one-suiter, and this reveals it as ${suitNameCC}. Says nothing about extra strength; the level is forced by the relay, not a promise of values.`
      : `${bid} from opponent: naming their real suit over their partner's Cappelletti relay (2♦) — their earlier 2♣ was a concealed one-suiter. Says nothing about extra strength.`;
  }

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

  // ── Jacoby 2NT completion: the bidder's OWN 2NT (game-forcing raise of
  // partner's opened major) was answered by partner's shortness/range reply,
  // and this bid returns to the agreed major.  It is a SIGNOFF or slam
  // decision within an already-forced auction — never a generic competitive
  // "raise to game" (which could be a preempt) or a fresh limit/jump raise.
  if (
    bidderPreviousBid === "2NT" &&
    bidderPartnerFirstBid &&
    /^1[♥♠]$/.test(bidderPartnerFirstBid) &&
    /^[3-4][♥♠]$/.test(bid) &&
    bid.slice(1) === bidderPartnerFirstBid.slice(1)
  ) {
    const jacobyMajor =
      bidderPartnerFirstBid.slice(1) === "♥" ? "hearts" : "spades";
    const isGameSignoff = bid[0] === "4";
    return isPartner
      ? `${bid}: completing the Jacoby 2NT auction (your earlier 2NT was a game-forcing raise of ${jacobyMajor}) — ${isGameSignoff ? "a SIGNOFF at game, declining slam after partner's shortness/range reply" : "a slam try below game, describing more of the hand"}. Not a natural bid or a fresh raise; the game force was set by the 2NT.`
      : `${bid} from opponent: completing their Jacoby 2NT auction — ${isGameSignoff ? "a signoff at game" : "a slam try"} after their partner's shortness/range reply, not a fresh raise.`;
  }

  // ── Jacoby 2NT completion, OPENER's side: the bidder OPENED 1♥/1♠, partner
  // answered with a game-forcing Jacoby 2NT raise, and this bid returns to
  // (or stays in) the agreed major. Same "signoff or slam try" logic as
  // above, mirrored for the opener's perspective.
  if (
    !!bidderPreviousBid &&
    /^1[♥♠]$/.test(bidderPreviousBid) &&
    bidderPartnerPreviousBid === "2NT" &&
    /^[3-4][♥♠]$/.test(bid) &&
    bid.slice(1) === bidderPreviousBid.slice(1)
  ) {
    const jacobyMajorO =
      bidderPreviousBid.slice(1) === "♥" ? "hearts" : "spades";
    const isGameSignoffO = bid[0] === "4";
    return isPartner
      ? `${bid}: your rebid after partner's Jacoby 2NT (a game-forcing raise of your ${jacobyMajorO} opening) — ${isGameSignoffO ? "a MINIMUM sign-off at game, no shortness or extra strength to show" : "a slam try below game, describing more of your hand"}. Not a natural/competitive rebid; the game force was set by partner's 2NT.`
      : `${bid} from opponent: their rebid after their partner's Jacoby 2NT — ${isGameSignoffO ? "a minimum sign-off at game" : "a slam try"}, not a natural/competitive rebid.`;
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
      // USUALLY a true GAME TRY; if the opponents have intervened with a bid
      // in another suit, the cheapest re-raise is COMPETITIVE instead.  Note:
      // an opponent's DOUBLE further back in the auction (e.g. a takeout
      // double of the opening, before partner's raise) is a form of
      // interference too, but it doesn't register as a "different suit" here
      // and this function has no view of the full auction timeline to detect
      // it — so the story hedges rather than asserting game-try with
      // certainty.
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
          ? `${bid}: after partner raised the suit the bidder had shown, this re-raise is USUALLY a GAME TRY — about ${gtRange} support points${sideOvercalledGT ? " (a maximum overcall)" : ""}, asking partner to bid game with a maximum raise and pass with a minimum. (If an opponent doubled earlier in the auction, this re-raise is COMPETITIVE instead, promising no extra strength.)`
          : `${bid} from opponent: usually a game-try re-raise of their own suit after their partner's raise — about ${gtRange} support points (competitive instead if an opponent doubled earlier in the auction).`;
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
    // Responder returning to partner's FIRST suit after partner showed a
    // SECOND suit is a simple PREFERENCE — picking the better of partner's
    // two suits, often with only 2-3 cards. Not a constructive raise.
    if (
      !jumped &&
      !raiseAtGame &&
      partnerShownSuit &&
      bid.slice(1) !== partnerShownSuit &&
      partnerFirstSuit &&
      bid.slice(1) === partnerFirstSuit &&
      bidderPreviousBid &&
      /^[1-7][♠♥♦♣]$/.test(bidderPreviousBid) &&
      bidderPreviousBid.slice(1) !== bid.slice(1)
    ) {
      return isPartner
        ? `${bid}: a simple PREFERENCE back to your FIRST suit after you showed two suits — just picking the better of your suits, often with only 2-3 card support. About 6-10 pts; NOT a constructive raise, not forcing.`
        : `${bid} from opponent: a preference back to their partner's first suit after two suits were shown — 2-3 card support is enough, about 6-10 pts, not forcing.`;
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
    // The raiser's previous call was a (negative/takeout) DOUBLE and they now
    // raise the suit partner answered with: INVITATIONAL — real extras beyond
    // the 6+ points the double itself promised.  NOTE: do not gate on
    // `!jumped` — partner's advance was forced (0+ points, often at the
    // cheapest level), so a "big jump" in level terms is still just an
    // ordinary invitational raise here, not a preemptive jump raise.
    if (bidderPreviousBid === "Double" && !raiseAtGame) {
      // The double hit a 1NT opening → it was PENALTY; raising partner's
      // scramble afterwards shows a strong doubling hand with a real fit.
      if (auctionOpeningBid?.endsWith("NT")) {
        return isPartner
          ? `${bid}: raising your escape suit after doubling the opponents' NT — a strong doubling hand (16+) with a good fit for your suit, inviting. You showed a bust, so pass with nothing extra.`
          : `${bid} from opponent: raising their partner's escape suit after the penalty double — strong hand with a fit.`;
      }
      // The exact point threshold differs by double type — a negative
      // double's own invite fires around 13+ support points, a takeout
      // double's around 19+ (it can also make the promised NT rebid
      // instead) — so describe the shape without pinning one range.
      return isPartner
        ? `${bid}: raising the suit partner answered your double with — INVITATIONAL, showing real extras beyond what the double alone promised. Bid game with a sound hand, pass with a bare minimum.`
        : `${bid} from opponent: raising the suit their partner answered the double with — invitational, more extras than the double alone promised.`;
    }
    // A raiser who already LIMITED their hand with a natural NT RESPONSE is
    // showing the TOP of that range, not the generic 6-9 single raise. This
    // must NOT fire when the earlier "1NT"/"2NT" was instead a strong
    // OVERCALL (15-18) or the auction's own opening 1NT/2NT (15-17 / 20-21) —
    // those show a completely different range than a 6-12 NT response.
    const raiserLimitedWithNT =
      (bidderPreviousBid === "1NT" || bidderPreviousBid === "2NT") &&
      auctionOpeningBid !== undefined &&
      !auctionOpeningBid.endsWith("NT") &&
      bidderPreviousBid !== auctionOpeningBid;
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
      // An OPPONENT'S DOUBLE sat between partner's opening and this bid: the
      // classic jump-shift theory (economize space, force to game) does not
      // apply once RHO has already shown their hand via the double — a
      // REDOUBLE is the strength-showing call here instead. A new suit
      // (jumped or not) after the double is natural and competitive/
      // non-forcing, not a 17+ game force.
      if (oppDoubledJustBefore) {
        return isPartner
          ? `${bid} after the opponents' DOUBLE of your partner's ${bidderPartnerPreviousBid}: natural, competing to find a fit — NOT a jump-shift game force (redouble is the strength-showing call once RHO has doubled). About 9-11 pts with a decent 5+ card suit.`
          : `${bid} from opponent after the double of their partner's ${bidderPartnerPreviousBid}: natural new suit competing after the double, not a forcing jump-shift.`;
      }
      // An opponent's 1NT OVERCALL sits between partner's opening and this
      // bid: a new suit here is natural and COMPETITIVE (about 6-9, not
      // forcing) — the 10+ new-suit response structure is off once RHO has
      // shown a strong balanced hand.
      if (
        prevHighBid === "1NT" &&
        bidderPartnerPreviousBid &&
        !bidderPartnerPreviousBid.endsWith("NT")
      ) {
        return isPartner
          ? `${bid} after the opponents' 1NT overcall of your partner's ${bidderPartnerPreviousBid}: a natural 5+ card suit, COMPETITIVE (about 6-9 pts) and not forcing — with 10+ they would double the 1NT for penalty instead.`
          : `${bid} from opponent after their partner's ${bidderPartnerPreviousBid} was overcalled with 1NT: natural 5+ card suit, competitive (about 6-9 pts), non-forcing.`;
      }
      if (isJumpShiftResp) {
        // A DOUBLE jump (two levels above the cheapest available call in the
        // suit) is a SPLINTER — a game-forcing raise of partner's opening
        // suit with shortness here — not a strong jump shift.
        const jumpSizeResp = cheapestNewSuit
          ? parseInt(bid[0]) - parseInt(cheapestNewSuit[0])
          : 0;
        if (
          jumpSizeResp >= 2 &&
          bidderPartnerPreviousBid &&
          /^1[♠♥♦♣]$/.test(bidderPartnerPreviousBid)
        ) {
          const agreedSuitSp = bidderPartnerPreviousBid.includes("♠")
            ? "spades"
            : bidderPartnerPreviousBid.includes("♥")
              ? "hearts"
              : bidderPartnerPreviousBid.includes("♦")
                ? "diamonds"
                : "clubs";
          return isPartner
            ? `${bid}: a SPLINTER — a DOUBLE jump agreeing your ${bidderPartnerPreviousBid} opening as trumps (4+ support, game-forcing) and showing a singleton or void in ${bid.slice(1)}. NOT a natural ${bid.slice(1)} suit; judge slam by how well your honors fit opposite the shortness.`
            : `${bid} from opponent: a splinter — a game-forcing raise of their partner's ${agreedSuitSp} with a singleton/void in ${bid.slice(1)}, not a natural suit.`;
        }
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
      // Partner's opening was DOUBLED by an opponent immediately before this
      // 2NT: that is JORDAN, a conventional limit raise of partner's suit
      // (10+ pts, 3+ card support) — never a natural balanced NT response,
      // and 2NT is never the final contract here.
      if (
        bid === "2NT" &&
        partnerOpenedIt2 &&
        oppDoubledJustBefore &&
        bidderPartnerPreviousBid &&
        /^1[♠♥♦♣]$/.test(bidderPartnerPreviousBid)
      ) {
        return isPartner
          ? `2NT after the opponents' DOUBLE of your partner's ${bidderPartnerPreviousBid}: JORDAN convention — a limit raise of their suit (10+ pts, 3+ card support), NOT a natural NT bid. 2NT is never the final contract; partner signs off in the suit with a minimum or bids game with extras.`
          : `2NT from opponent after the double of their partner's ${bidderPartnerPreviousBid}: Jordan convention — a limit raise of their partner's suit (10+ pts, 3+ card support), not natural NT.`;
      }
      if (!partnerOpenedIt2) {
        return isPartner
          ? `${bid} ADVANCE of your overcall: natural — ${bid === "2NT" ? "invitational, about 13-14 pts" : "to play, about 11+ pts counting on your long suit for tricks"}, with the opener's suit stopped.`
          : `${bid} from opponent advancing the overcall: natural, ${bid === "2NT" ? "about 13-14 pts" : "about 11+ pts"} with a stopper.`;
      }
      // A raise of partner's NOTRUMP opening is quantitative, keyed to the
      // opening's range — not the 11-15 response to a suit opening.
      if (bidderPartnerPreviousBid === "1NT") {
        return bid === "2NT"
          ? isPartner
            ? "2NT RAISE of your 1NT opening: a natural, INVITATIONAL raise — about 8-9 HCP, balanced, no 4-card major worth showing. Pass with 15, bid 3NT with 16-17."
            : "2NT from opponent: an invitational raise of their partner's 1NT — about 8-9 HCP, balanced."
          : isPartner
            ? "3NT RAISE of your 1NT opening: to play — about 10-15 HCP, balanced, no 4-card major worth showing. Not forcing; pass."
            : "3NT from opponent: raising their partner's 1NT to game — about 10-15 HCP, balanced.";
      }
      if (bidderPartnerPreviousBid === "2NT") {
        return isPartner
          ? `${bid === "3NT" ? "3NT RAISE of your 2NT opening: to play — about 4-10 HCP, balanced." : `${bid} over your 2NT opening: natural, quantitative.`}`
          : `${bid} from opponent: a natural raise of their partner's 2NT opening.`;
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
    if (prevHighBid === "1NT") {
      // Direct 2NT over the opponents' 1NT OPENING is Cappelletti (SAYC
      // standard defense) — both minors (5-4 or 5-5), NOT natural notrump.
      return isPartner
        ? "2NT directly over their 1NT opening: CAPPELLETTI — shows both minors (5-4 or 5-5), NOT natural notrump. Pick the better minor (or ask further); says nothing about balanced strength."
        : "2NT from opponent over their partner's 1NT: Cappelletti — both minors (5-4 or 5-5), not natural notrump.";
    }
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
      bidderPartnerPreviousBid === "none" ||
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
    // The OPENER rebidding the AGREED MAJOR ITSELF at the 3-level after
    // partner's Jacoby 2NT: a general slam try (16+ TP, no shortness/side
    // suit to show) — NOT a plain competitive rebid of the suit.
    if (
      bidderPartnerPreviousBid === "2NT" &&
      (bidderPreviousBid === "1♥" || bidderPreviousBid === "1♠") &&
      auctionOpeningBid === bidderPreviousBid &&
      bid === `3${bidderPreviousBid.slice(1)}`
    ) {
      return isPartner
        ? `${bid}: your Jacoby 2NT set a game force in ${bid.slice(1) === "♥" ? "hearts" : "spades"} — this REBID of the agreed suit shows 16+ TP with no shortness or 5-card side suit to show, a general slam try. NOT a competitive/minimum rebid (the game force is already locked in).`
        : `${bid} from opponent: rebidding the suit their partner's Jacoby 2NT agreed — 16+ TP, a general slam try, not a competitive minimum.`;
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
    // A REBID by the RESPONDER in a strong-2♣ auction (their own previous
    // bid was the positive response, e.g. 3♦, not 2♣ itself) — the whole
    // auction is game-forcing already, so their NT/suit rebid is simply
    // continuing to describe values, never an "opening NT range" story.
    if (
      auctionOpeningBid === "2♣" &&
      bidderPreviousBid !== "2♣" &&
      bidderPreviousBid !== undefined
    ) {
      return bid.endsWith("NT")
        ? `${bid} after the strong 2♣ opening: the auction is already game-forcing — this places or explores the contract based on the combined strength shown so far, not a standalone opening NT range.`
        : `${bid} after the strong 2♣ opening: continuing to describe values in a game-forcing auction — not a fresh opening bid.`;
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
      // does not apply here. Only when the bidder IS the opener: a RESPONDER
      // bidding 2NT over the opener's 1NT rebid is a normal 11-12 invite.
      if (
        bid === "2NT" &&
        /^1[♠♥♦♣]$/.test(bidderPreviousBid) &&
        bidderPartnerPreviousBid === "1NT"
      ) {
        const bidderWasOpener2NT =
          auctionOpeningBid === undefined ||
          auctionOpeningBid === bidderPreviousBid;
        if (bidderWasOpener2NT) {
          return isPartner
            ? `2NT RAISE of your 1NT response (they opened ${bidderPreviousBid}): 18-19 balanced, INVITATIONAL — too strong for a 1NT opening. Pass with 6-7; bid 3NT with 8-10. (A 12-14 balanced opener would have passed 1NT.)`
            : "2NT from opponent raising their partner's 1NT response: 18-19 balanced, invitational (a 12-14 opener would pass 1NT).";
        }
        return isPartner
          ? `2NT by the RESPONDER over your 1NT rebid (they responded ${bidderPreviousBid} to your opening): a natural INVITATION — about 11-12 pts, balanced. Pass with a bare 12-13; bid 3NT with more.`
          : "2NT from opponent: the responder inviting over their partner's 1NT rebid — about 11-12 pts, balanced, non-forcing.";
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
      // The cheapest level USUALLY shows a minimum (11-14), but a 3-CARD
      // answer holds this same level even with real extras — showing the
      // exact support length takes priority over jumping to show strength,
      // so the bid alone can't rule out a stronger hand stuck here.
      const rangeT = answerJumpedT
        ? "a JUMP — a maximum (about 15-17)"
        : "the cheapest level — usually a minimum (about 11-14), though a 3-card answer can hold extras there too (showing the exact support took priority over a jump)";
      return isPartner
        ? `${bid}: ANSWERING your double — bidding the suit your double implied, at ${rangeT}. Raise with the values your double did not already promise.`
        : `${bid} from opponent: answering their partner's double in the implied suit — ${answerJumpedT ? "jump shows about 15-17" : "cheapest level usually shows about 11-14, though extras with 3-card support are possible"}.`;
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
          : // A non-jumped rebid USUALLY shows a minimum (about 12-15), but
            // occasionally a stronger hand (16+) is stuck here too — no fit for
            // partner's suit, no stopper for NT, and a jump blocked by suit
            // length (5 cards can't safely jump to game). Don't over-promise a
            // specific range; the level alone can't rule out undisclosed extras.
            "usually minimum/competitive values (about 12-15) with extra length (a 6+ card suit, occasionally a good 5) — but if no other safe call exists (no fit, no NT stopper, jump blocked by length), a stronger hand can be stuck here too, planning to bid again";
      return isPartner
        ? `${bid} REBID of the same suit (they bid ${bidderPreviousBid} earlier): natural — ${strengthText}. NOT a weak-two or preempt opening.`
        : `${bid} from opponent: a REBID of the suit they already bid (${bidderPreviousBid}) — natural, ${atGame ? "19-21 pts, self-sufficient suit" : rebidJump ? "16-18 pts, good 6+ suit (invitational)" : "usually extra length with minimum values, though a stronger hand stuck without a safe alternative is possible too"}. Not an opening bid.`;
    }
    if (bidderPreviousBid.endsWith("NT")) {
      return isPartner
        ? `${bid}: a natural suit shown AFTER their earlier ${bidderPreviousBid} — a 5+ card suit offered as a strain (running from notrump or competing). Not an opening bid.`
        : `${bid} from opponent: a natural 5+ card suit shown after their earlier ${bidderPreviousBid} — offering the suit as the strain.`;
    }
    // An opener's second suit may carry a strength message in its LEVEL:
    // skipping a still-available cheaper call in the suit = JUMP SHIFT
    // (19-21, game-forcing); a non-jump 2-level call in a suit ranking above
    // the opening = REVERSE (17+, forcing one round).
    {
      const bidderIsOpener =
        !!auctionOpeningBid &&
        bidderPreviousBid === auctionOpeningBid &&
        // A bid in a suit someone else has already shown is a CUEBID, not a
        // natural second suit — leave that to the generic text below.
        (!prevHighBid || prevHighBid.slice(1) !== bidSuitSym);
      const cheapestNewSuitT = prevHighBid
        ? BID_ORDER.find(
            (b, i) =>
              i > BID_ORDER.indexOf(prevHighBid) && b.endsWith(bidSuitSym),
          )
        : undefined;
      const isJumpShiftT =
        !!cheapestNewSuitT &&
        BID_ORDER.indexOf(bid) > BID_ORDER.indexOf(cheapestNewSuitT);
      const isReverseT =
        !isJumpShiftT &&
        /^2[♠♥♦♣]$/.test(bid) &&
        /^1[♠♥♦♣]$/.test(bidderPreviousBid) &&
        "♣♦♥♠".indexOf(bidSuitSym) > "♣♦♥♠".indexOf(bidderPreviousBid.slice(1));
      if (bidderIsOpener && isJumpShiftT) {
        return isPartner
          ? `${bid}: a JUMP SHIFT (they skipped a cheaper available bid in this suit after opening ${bidderPreviousBid}) — a natural second suit with 19-21 pts, GAME-FORCING. Neither partner may pass below game.`
          : `${bid} from opponent: a JUMP SHIFT — a second suit alongside their ${bidderPreviousBid} opening, 19-21 pts and game-forcing for their side.`;
      }
      if (bidderIsOpener && isReverseT) {
        return isPartner
          ? `${bid}: a REVERSE (a 2-level second suit ranking above their ${bidderPreviousBid} opening) — natural, 17+ pts, forcing for one round. The first suit is longer than the second.`
          : `${bid} from opponent: a REVERSE — a second suit above their ${bidderPreviousBid} opening, showing 17+ pts, forcing one round for their side.`;
      }
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
    case "1NT": {
      // This is only an OVERCALL when a real bid preceded it; with nothing
      // before it, 1NT is an OPENING and the overcall range/stopper language
      // does not apply (it also can't be an overcall if partner opened it —
      // bidderPartnerPreviousBid would then be a real bid too).
      const wasOpening = !prevHighBid;
      return isPartner
        ? "Opening 1NT: balanced hand, exactly 15–17 HCP, no singleton/void."
        : wasOpening
          ? "Opening 1NT from opponent: balanced hand, exactly 15–17 HCP, no singleton/void."
          : "1NT from opponent: balanced 15–18 HCP (overcall range) with a stopper in partner's suit.";
    }

    case "2♣": {
      // Stayman only when the 1NT/2NT belongs to the BIDDER's own side (their
      // partner opened it) — when the 1NT was the bidder's OPPONENT's opening
      // instead, this direct 2♣ is CAPPELLETTI (one-suiter), not Stayman.
      const capp1NT =
        prevHighBid === "1NT" &&
        prevHighBid === auctionOpeningBid &&
        bidderPartnerPreviousBid !== undefined &&
        bidderPartnerPreviousBid !== "1NT";
      if (capp1NT) {
        return isPartner
          ? "2♣ directly over their 1NT opening: CAPPELLETTI — a one-suited hand (any suit), NOT natural clubs and NOT Stayman. Bid 2♦ to ask which suit if unsure."
          : "2♣ from opponent over their partner's 1NT: Cappelletti — a one-suiter (any suit), not natural clubs.";
      }
      // Stayman applies only when the 1NT/2NT belongs to the BIDDER's own
      // side (their partner bid it) — a natural NT bid elsewhere in the
      // auction (e.g. a 1NT RESPONSE to a suit opening) is not conventions-on.
      const staymanBase =
        bidderPartnerPreviousBid === undefined ||
        bidderPartnerPreviousBid === "none" ||
        bidderPartnerPreviousBid === prevHighBid;
      if ((prevHighBid === "1NT" || prevHighBid === "2NT") && staymanBase) {
        return isPartner
          ? `Stayman — asking if you (opener of ${prevHighBid}) hold a 4-card major. Respond: 2♥ (hearts), 2♠ (spades, no hearts), or 2♦ (no 4-card major).`
          : `Stayman over your partner's ${prevHighBid} — the opponent is asking opener for a 4-card major.`;
      }
      if (prevHighBid === "1NT" && !staymanBase) {
        return isPartner
          ? "2♣ OVERCALL over the 1NT (a natural response elsewhere in the auction, not partner's opening) — natural clubs or Michaels-style, not Stayman."
          : "2♣ from opponent: over a 1NT response (not an opening) — natural, not Stayman.";
      }
      return isPartner
        ? "2♣ opening: strong artificial forcing bid — 22+ HCP balanced OR 22+ total pts unbalanced. Demands a response."
        : isOpponent
          ? "2♣ from opponent: could be a natural club bid OR the Michaels cuebid (over your 1♣ opening) showing both majors."
          : "2♣: artificial strong opening (22+ pts) or Michaels cuebid showing both majors.";
    }
    case "2♦": {
      const capp1NTd =
        prevHighBid === "1NT" &&
        prevHighBid === auctionOpeningBid &&
        bidderPartnerPreviousBid !== undefined &&
        bidderPartnerPreviousBid !== "1NT";
      if (capp1NTd) {
        return isPartner
          ? "2♦ directly over their 1NT opening: CAPPELLETTI — shows BOTH MAJORS (5-4 or 5-5), NOT a transfer and not natural diamonds. Pick your better major."
          : "2♦ from opponent over their partner's 1NT: Cappelletti — both majors (5-4 or 5-5), not a transfer.";
      }
      // Jacoby Transfer to hearts — only when the 1NT/2NT belongs to the
      // BIDDER's own side (their partner bid it); a natural NT bid elsewhere
      // in the auction is not conventions-on.
      const transferBaseD =
        bidderPartnerPreviousBid === undefined ||
        bidderPartnerPreviousBid === "none" ||
        bidderPartnerPreviousBid === prevHighBid;
      if ((prevHighBid === "1NT" || prevHighBid === "2NT") && transferBaseD) {
        return isPartner
          ? `Jacoby Transfer to hearts — partner is asking you (${prevHighBid} opener) to bid 2♥, transferring to their heart suit.`
          : `Transfer to hearts over ${prevHighBid} — the opponent holds 5+ hearts and is asking opener to bid 2♥.`;
      }
      if (prevHighBid === "1NT" && !transferBaseD) {
        return isPartner
          ? "2♦ OVERCALL over the 1NT (a natural response elsewhere in the auction, not partner's opening) — natural diamonds, not a transfer."
          : "2♦ from opponent: over a 1NT response (not an opening) — natural, not a transfer.";
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
    }
    case "2♥": {
      const capp1NTh =
        prevHighBid === "1NT" &&
        prevHighBid === auctionOpeningBid &&
        bidderPartnerPreviousBid !== undefined &&
        bidderPartnerPreviousBid !== "1NT";
      if (capp1NTh) {
        return isPartner
          ? "2♥ directly over their 1NT opening: CAPPELLETTI — hearts plus a minor suit, NOT a transfer and not a plain natural heart overcall."
          : "2♥ from opponent over their partner's 1NT: Cappelletti — hearts plus a minor, not a transfer.";
      }
      // Jacoby Transfer to spades — only when the NT bid belongs to the
      // bidder's PARTNER (a 1NT/2NT opening or a natural 1NT OVERCALL both
      // carry transfers). A partner known to be silent ("none") means the 1NT
      // was an opponent's — the 2♥ is then natural, never a transfer.
      const transferBaseH =
        bidderPartnerPreviousBid === undefined ||
        bidderPartnerPreviousBid === prevHighBid;
      if ((prevHighBid === "1NT" || prevHighBid === "2NT") && transferBaseH) {
        return isPartner
          ? `Jacoby Transfer to spades — partner is asking you (the ${prevHighBid} bidder) to bid 2♠, transferring to their spade suit.`
          : `Transfer to spades over ${prevHighBid} — the opponent holds 5+ spades.`;
      }
      if (prevHighBid === "1NT" && !transferBaseH) {
        return isPartner
          ? "2♥ OVERCALL over the 1NT (a natural response elsewhere in the auction, not partner's opening) — natural hearts, not a transfer."
          : "2♥ from opponent: over a 1NT response (not an opening) — natural, not a transfer.";
      }
      return isPartner
        ? "Weak 2♥: 5–10 HCP, 6-card heart suit. Pre-emptive opening."
        : "2♥ from opponent: Weak 2 bid (5–10 HCP, 6 hearts). Disrupts your bidding space.";
    }
    case "2♠": {
      const capp1NTs =
        prevHighBid === "1NT" &&
        prevHighBid === auctionOpeningBid &&
        bidderPartnerPreviousBid !== undefined &&
        bidderPartnerPreviousBid !== "1NT";
      if (capp1NTs) {
        return isPartner
          ? "2♠ directly over their 1NT opening: CAPPELLETTI — spades plus a minor suit, NOT a minor-suit transfer and not a plain natural spade overcall."
          : "2♠ from opponent over their partner's 1NT: Cappelletti — spades plus a minor, not a transfer.";
      }
      // Minor-suit transfer after 1NT — only when that 1NT was the BIDDER's
      // own side's opening/rebid (conventions on); a natural 1NT elsewhere in
      // the auction (e.g. a 1NT RESPONSE to a suit opening) makes this a
      // natural weak-two-style overcall/opening instead, not a transfer.
      // Partner's own 1NT (opening OR natural overcall) carries the minor
      // transfer; a silent partner ("none") means the 1NT was an opponent's.
      const transferBase1NT =
        bidderPartnerPreviousBid === undefined ||
        bidderPartnerPreviousBid === "1NT";
      if (prevHighBid === "1NT" && transferBase1NT) {
        return isPartner
          ? "Minor-suit transfer — partner holds 6+ clubs or diamonds and is asking you to bid 3♣ (they will pass for clubs or correct to 3♦ for diamonds)."
          : "Minor-suit transfer over 1NT — the opponent holds a long minor.";
      }
      if (prevHighBid === "1NT" && !transferBase1NT) {
        return isPartner
          ? "2♠ OVERCALL over the 1NT (a natural response elsewhere in the auction, not partner's opening) — natural, good 5+ card spade suit, roughly 8-16 HCP. Not a transfer."
          : "2♠ from opponent: natural overcall over a 1NT response — good 5+ card spade suit, roughly 8-16 HCP. Not a transfer.";
      }
      return isPartner
        ? "Weak 2♠: 5–10 HCP, 6-card spade suit. Pre-emptive opening."
        : "2♠ from opponent: Weak 2 bid (5–10 HCP, 6 spades).";
    }
    case "2NT": {
      const capp2NT =
        prevHighBid === "1NT" &&
        prevHighBid === auctionOpeningBid &&
        bidderPartnerPreviousBid !== undefined &&
        bidderPartnerPreviousBid !== "1NT";
      if (capp2NT) {
        return isPartner
          ? "2NT directly over their 1NT opening: CAPPELLETTI — shows BOTH MINORS (5-4 or 5-5), NOT natural notrump."
          : "2NT from opponent over their partner's 1NT: Cappelletti — both minors (5-4 or 5-5), not natural notrump.";
      }
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
    }

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
    case "4♦": {
      // A SPLINTER: a double jump in a new (non-opening) suit, made as the
      // bidder's FIRST response to partner's 1-of-a-major/minor opening,
      // agreeing that opening suit as trumps and showing a singleton/void in
      // the bid suit. Distinguish from Gerber (asks for aces, doesn't AGREE a
      // new trump suit) by checking prevHighBid was a 1-level suit OPENING
      // and this is the bidder's first real call in a NEW suit.
      const splinterFloorHi =
        !!prevHighBid &&
        /^1[♠♥♦♣]$/.test(prevHighBid) &&
        prevHighBid === auctionOpeningBid &&
        bidderPreviousBid === undefined &&
        bid.slice(1) !== prevHighBid.slice(1);
      if (splinterFloorHi) {
        const openSuitName = prevHighBid!.includes("♠")
          ? "spades"
          : prevHighBid!.includes("♥")
            ? "hearts"
            : prevHighBid!.includes("♦")
              ? "diamonds"
              : "clubs";
        const shortSuitName = bid.includes("♣") ? "clubs" : "diamonds";
        return isPartner
          ? `${bid}: a SPLINTER — a game-forcing raise of your ${openSuitName} opening (4+ trump support) showing a singleton or void in ${shortSuitName}. NOT Gerber, NOT natural — the level is entirely about shortness, not strength beyond the game-force minimum.`
          : `${bid} from opponent: a splinter raise of their partner's ${openSuitName} opening, showing shortness in ${shortSuitName} — not Gerber, not natural.`;
      }
      return bid === "4♣"
        ? "4♣: likely Gerber convention — asks partner how many aces they hold. Responses: 4♦=0/4, 4♥=1, 4♠=2, 4NT=3."
        : "4♦: likely a Gerber ace-response (0 or 4 aces if partner bid 4♣), or a natural pre-empt with long diamonds.";
    }
    case "4♥":
    case "4♠": {
      if (bid === auctionOpeningBid) {
        const suitNm = bid === "4♥" ? "heart" : "spade";
        return isPartner
          ? `${bid} OPENING: preemptive — a 7-8 card ${suitNm} suit with a weak hand (under opening values). Shape-based blocking bid, not strength.`
          : `${bid} opening from opponent: preempt — 7-8 card ${suitNm} suit, weak hand.`;
      }
      // A splinter over partner's 1-level opening (e.g. 1♦-4♥ or 1♠-4♥),
      // made as the bidder's first response: a DOUBLE jump in a new suit
      // agrees the opening suit as trumps and shows shortness in the bid
      // suit — not a natural game bid in it. (4♠ over 1♥ is a TRIPLE jump —
      // preemptive to play — so require exactly a double jump.)
      const splinterFloorMaj =
        !!prevHighBid &&
        /^1[♠♥♦♣]$/.test(prevHighBid) &&
        prevHighBid === auctionOpeningBid &&
        bidderPreviousBid === undefined &&
        bid.slice(1) !== prevHighBid.slice(1) &&
        (() => {
          const cheapest = BID_ORDER.find(
            (b, i) =>
              i > BID_ORDER.indexOf(prevHighBid!) && b.endsWith(bid.slice(1)),
          );
          return !!cheapest && parseInt(bid[0]) - parseInt(cheapest[0]) === 2;
        })();
      if (splinterFloorMaj) {
        const openSuitName3 = prevHighBid!.includes("♠")
          ? "spades"
          : prevHighBid!.includes("♥")
            ? "hearts"
            : prevHighBid!.includes("♣")
              ? "clubs"
              : "diamonds";
        const shortSuitName2 = bid === "4♥" ? "hearts" : "spades";
        return isPartner
          ? `${bid}: a SPLINTER — a game-forcing raise of your ${openSuitName3} opening (4+ trump support) showing a singleton or void in ${shortSuitName2}. NOT a natural game bid in ${shortSuitName2}.`
          : `${bid} from opponent: a splinter raise of their partner's ${openSuitName3} opening, showing shortness in ${shortSuitName2} — not a natural game bid.`;
      }
      const suitNm2 = bid === "4♥" ? "hearts" : "spades";
      return isPartner
        ? `${bid}: game bid in ${suitNm2}. Strong hand with a fit in ${suitNm2}, usually 5+ ${suitNm2} and 10+ total pts combined.`
        : `${bid} from opponent: game pre-empt, 8-card ${suitNm2} suit.`;
    }
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
      // Compute which suits are actually unbid (neither the doubler's side's
      // opening nor the opponents' overcall) — a generic "often the unbid
      // major(s)" parenthetical is wrong whenever both majors are already
      // bid (leaving only the minors unbid) or only one major is unbid.
      const unbidSuitNames = (
        ["spades", "hearts", "diamonds", "clubs"] as const
      ).filter(
        (s) =>
          !auctionOpeningBid?.includes(suitSymbol(s)) &&
          !prevHighBid?.includes(suitSymbol(s)),
      );
      const unbidDesc =
        unbidSuitNames.length > 0
          ? `the unbid suit${unbidSuitNames.length > 1 ? "s" : ""} (${unbidSuitNames.join(" and ")})`
          : "the unbid suit(s)";
      const negativeText = `${who} Negative Double (Sputnik): their side opened and an opponent overcalled, so this double shows ${unbidDesc} — NOT penalty. About 6+ pts, asking partner to bid a best unbid suit.`;

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
