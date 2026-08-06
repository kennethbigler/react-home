import { BID_ORDER, isRealBid } from "./bid-order";
import {
  analyzeHand,
  calcTPWithFit,
  longestSuitInfo,
  suitFromBid,
  suitSymbol,
} from "./hand-evaluation";
import type { BidRecommendation, Hand, Vulnerability } from "./types";

// ─── Cappelletti (defense to an opponent's 1NT opening) ─────────────────────
// SAYC's standard convention card default: Double = penalty (handled by the
// caller before this runs); 2♣ = one-suiter (any suit, partner bids 2♦ to
// ask, overcaller passes/corrects to the real suit); 2♦ = both majors (5-4 or
// 5-5); 2♥ = hearts + a minor; 2♠ = spades + a minor; 2NT = both minors.
function getCappellettiOvercall(
  hand: Hand,
  opponentBid: string,
  lhoBid?: string,
): BidRecommendation | null {
  const analysis = analyzeHand(hand);
  const { hcp, spades, hearts, diamonds, clubs } = hand;
  // A partner's or opponents' call may already sit above the 1NT (rare direct
  // seat — but be safe against a re-derivation from a later vantage point).
  const floorIdx = Math.max(
    BID_ORDER.indexOf(opponentBid),
    lhoBid && isRealBid(lhoBid) ? BID_ORDER.indexOf(lhoBid) : -1,
  );
  if (floorIdx >= BID_ORDER.indexOf("2♣")) return null; // no Cappelletti room left

  const bothMajors = spades >= 4 && hearts >= 4 && (spades >= 5 || hearts >= 5);
  const bothMinors =
    diamonds >= 4 && clubs >= 4 && (diamonds >= 5 || clubs >= 5);
  const suits = [
    { name: "spades", sym: "♠", count: spades },
    { name: "hearts", sym: "♥", count: hearts },
    { name: "diamonds", sym: "♦", count: diamonds },
    { name: "clubs", sym: "♣", count: clubs },
  ];
  const longest = suits.reduce((a, b) => (b.count > a.count ? b : a));

  // ── Two-suiters take priority over a one-suiter reading of the same shape ──
  if (bothMajors) {
    return {
      bid: "2♦",
      category: "Cappelletti 2♦ (Both Majors)",
      reasoning: `Over the opponents' 1NT opening, SAYC's standard defense is Cappelletti: 2♦ is CONVENTIONAL, showing both majors (5-4 or 5-5), not natural diamonds. With ${spades} spades and ${hearts} hearts, bid 2♦ — partner picks the better major (or asks with 2♥ if unsure).`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "Both majors, 5-4 or 5-5 shape. Pick your better major, or bid 2♥ to ask which is longer.",
      expectedResponses: [
        {
          partnerBid: "2♥",
          meaning: "Prefers hearts (or asking which is longer)",
        },
        { partnerBid: "2♠", meaning: "Prefers spades" },
      ],
      confidence: "high",
      note: "2♦ says NOTHING about diamonds — it is artificial (both-majors ask).",
    };
  }
  if (bothMinors && hcp >= 5) {
    return {
      bid: "2NT",
      category: "Cappelletti 2NT (Both Minors)",
      reasoning: `Over the opponents' 1NT opening, Cappelletti 2NT shows both minors (5-4 or 5-5) — NOT a natural notrump bid. With ${diamonds} diamonds and ${clubs} clubs, bid 2NT; partner picks the better minor.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "Both minors, 5-4 or 5-5 shape. Pick your better minor at the 3-level.",
      expectedResponses: [
        {
          partnerBid: "3♣",
          meaning: "Prefers clubs (or minimum, picking cheaper)",
        },
        { partnerBid: "3♦", meaning: "Prefers diamonds" },
      ],
      confidence: "high",
      note: "2NT here is artificial (both-minors ask) — it is NOT natural notrump, which is unavailable as a direct overcall of 1NT.",
    };
  }
  // A single major (5+) with an unspecified/short minor side suit.
  if (spades >= 5 && !bothMajors) {
    return {
      bid: "2♠",
      category: "Cappelletti 2♠ (Spades + a Minor)",
      reasoning: `Over the opponents' 1NT opening, Cappelletti 2♠ shows spades plus a minor suit (a two-suiter) — NOT a plain natural spade overcall. With ${spades} spades, bid 2♠; partner can raise spades or ask for your minor.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "Spades plus a minor suit. Raise spades with support, or bid 2NT to ask which minor.",
      expectedResponses: [
        {
          partnerBid: "Pass/raise spades",
          meaning: "Happy to play the known major",
        },
        { partnerBid: "2NT", meaning: "Asking which minor you also hold" },
      ],
      confidence: "high",
    };
  }
  if (hearts >= 5 && !bothMajors) {
    return {
      bid: "2♥",
      category: "Cappelletti 2♥ (Hearts + a Minor)",
      reasoning: `Over the opponents' 1NT opening, Cappelletti 2♥ shows hearts plus a minor suit (a two-suiter) — NOT a plain natural heart overcall. With ${hearts} hearts, bid 2♥; partner can raise hearts or ask for your minor.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "Hearts plus a minor suit. Raise hearts with support, or bid 2NT to ask which minor.",
      expectedResponses: [
        {
          partnerBid: "Pass/raise hearts",
          meaning: "Happy to play the known major",
        },
        { partnerBid: "2NT", meaning: "Asking which minor you also hold" },
      ],
      confidence: "high",
    };
  }
  // One-suiter: any single suit, typically 6+ (a strong 5 is acceptable with
  // good shape/quality since 2♣ commits partner to a preference at the
  // 2-level only).
  if (longest.count >= 6 || (longest.count >= 5 && hand.goodSuitQuality)) {
    // Partner's 2♦ relay asks which suit; the reply just passes 2♦ if
    // diamonds WAS the real suit (nothing to correct), otherwise names it at
    // the cheapest available level (2♥/2♠, or 3♣ for clubs — passing the
    // relay would wrongly pick diamonds).
    const correctionText =
      longest.sym === "♣"
        ? "3♣ to show your real suit (passing 2♦ would pick diamonds)"
        : longest.sym === "♦"
          ? "Pass (2♦ already matches your real suit)"
          : `${longest.sym === "♥" ? "2♥" : "2♠"} to show your real suit`;
    return {
      bid: "2♣",
      category: "Cappelletti 2♣ (One-Suiter)",
      reasoning: `Over the opponents' 1NT opening, Cappelletti 2♣ is CONVENTIONAL — it shows a one-suited hand (any suit), not natural clubs. With a ${longest.count}-card ${longest.name} suit, bid 2♣; if partner bids 2♦ (the relay), correct with ${correctionText}.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `A one-suited hand (${longest.count}+ card ${longest.name}) — not natural clubs. Bid 2♦ to ask which suit, or raise/pass if you also hold ${longest.name === "clubs" ? "clubs" : "a fit"}.`,
      expectedResponses: [
        {
          partnerBid: "2♦ (relay)",
          meaning: "Asking which suit — correct to your real suit",
        },
        {
          partnerBid: "Raise your suit directly",
          meaning: "Partner has support and skips the relay",
        },
      ],
      confidence: "high",
    };
  }
  return null;
}

/**
 * Advancer's reply to partner's Cappelletti call over the opponents' 1NT
 * opening.  Cappelletti is a two-way convention: 2♣ = one-suiter (relay with
 * 2♦ to ask), 2♦ = both majors, 2♥ = hearts+minor, 2♠ = spades+minor, 2NT =
 * both minors.  With NO fit/interest, advancer's job is simply to pick the
 * cheapest safe landing spot — Cappelletti hands are pre-limited by shape,
 * not HCP, so there is no "raise for values" ladder like a natural overcall.
 */
export function getCappellettiAdvance(
  hand: Hand,
  partnerBid: string,
  interferenceBid?: string,
): BidRecommendation {
  const analysis = analyzeHand(hand);
  const { hcp, spades, hearts, diamonds, clubs } = hand;
  const floorIdx = Math.max(
    BID_ORDER.indexOf(partnerBid),
    interferenceBid ? BID_ORDER.indexOf(interferenceBid) : -1,
  );
  const cheapestIn = (sym: string): string =>
    BID_ORDER.find((b, i) => i > floorIdx && b.endsWith(sym)) ?? `7${sym}`;

  if (partnerBid === "2♣") {
    // One-suiter, suit UNKNOWN — it could be any of the four suits, not
    // necessarily clubs. The standard, textbook-correct advance is ALWAYS to
    // relay with 2♦ to find out which suit partner actually holds; passing
    // 2♣ on the (unconfirmed) hope that clubs happens to be the real suit
    // defeats the whole point of the convention and will misplay hands where
    // partner's real suit is spades/hearts/diamonds. Only skip the relay when
    // the auction has taken it away.
    const relay = cheapestIn("♦");
    if (BID_ORDER.indexOf(relay) - floorIdx <= 1) {
      return {
        bid: relay,
        category: "Cappelletti Relay (2♦ Asks the Suit)",
        reasoning: `Partner's 2♣ is Cappelletti (one-suiter, suit unknown). With ${hcp} HCP and no clear club fit, bid 2♦ — an artificial relay asking partner to name their real suit.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "Artificial — asking which suit partner holds. Says nothing about diamonds.",
        expectedResponses: [
          { partnerBid: "Pass/2♥/2♠/3♣", meaning: "Names the real suit" },
        ],
        confidence: "high",
      };
    }
    return {
      bid: "Pass",
      category: "Pass — No Room to Relay",
      reasoning: `Partner's 2♣ was Cappelletti, but the opponents' ${interferenceBid} took away the 2♦ relay. With ${hcp} HCP and nothing clear to do, pass.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "No safe action available.",
      expectedResponses: [],
      confidence: "medium",
    };
  }

  if (partnerBid === "2♦") {
    // Both majors (5-4 or 5-5).  Pick the longer major; with EQUAL length
    // bid hearts (the cheaper) — partner passes with equal/longer hearts or
    // corrects to spades, so no fit is lost.
    if (spades > hearts) {
      const bid = cheapestIn("♠");
      return {
        bid,
        category: "Choose Spades Over Cappelletti 2♦",
        reasoning: `Partner's 2♦ is Cappelletti, showing both majors (5-4 or 5-5) — not natural diamonds. With ${spades} spades vs ${hearts} hearts, prefer spades: bid ${bid}.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `Choosing spades as the trump suit (${spades} cards).`,
        expectedResponses: [],
        confidence: "high",
      };
    }
    const bid = cheapestIn("♥");
    return {
      bid,
      category: "Choose Hearts Over Cappelletti 2♦",
      reasoning: `Partner's 2♦ is Cappelletti, showing both majors (5-4 or 5-5) — not natural diamonds. With ${hearts} hearts vs ${spades} spades, ${hearts === spades ? "bid the cheaper major (hearts) — partner passes or corrects to spades with longer spades" : "prefer hearts"}: bid ${bid}.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `Choosing hearts as the trump suit (${hearts} cards).`,
      expectedResponses: [],
      confidence: "high",
    };
  }

  if (partnerBid === "2♥" || partnerBid === "2♠") {
    // Hearts/spades + an unspecified minor.  Raise the known major with
    // support; otherwise ask for the minor with 2NT (if room), else pass.
    const majorLen = partnerBid === "2♥" ? hearts : spades;
    const majorSym = partnerBid === "2♥" ? "♥" : "♠";
    const majorName = partnerBid === "2♥" ? "hearts" : "spades";
    if (majorLen >= 3) {
      // Cappelletti hands are shape-limited, not HCP-limited (partner could
      // hold anywhere from 0 to a good hand) — raise one level to compete,
      // not a game jump based on advancer's HCP alone.
      const raise = cheapestIn(majorSym);
      return {
        bid: raise,
        category: `Raise Partner's Known ${majorName === "hearts" ? "Hearts" : "Spades"}`,
        reasoning: `Partner's ${partnerBid} is Cappelletti (${majorName} + an unspecified minor). With ${majorLen}-card support, raise to ${raise} — you have a known fit and do not need to find the minor. (Cappelletti hands are shape-limited, not HCP-limited, so do not jump to game on your own count alone.)`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `${majorLen}-card ${majorName} support — happy to play the known major.`,
        expectedResponses: [],
        confidence: "high",
      };
    }
    const askBid = cheapestIn("NT");
    if (BID_ORDER.indexOf(askBid) - floorIdx <= 1) {
      return {
        bid: askBid,
        category: "Ask for Partner's Minor (2NT)",
        reasoning: `Partner's ${partnerBid} is Cappelletti (${majorName} + an unspecified minor). With only ${majorLen}-card ${majorName}, bid 2NT to ask which minor partner also holds.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `No ${majorName} fit — asking for the minor suit instead.`,
        expectedResponses: [
          { partnerBid: "3♣/3♦", meaning: "Names the minor" },
        ],
        confidence: "medium",
      };
    }
    return {
      bid: "Pass",
      category: `Pass Cappelletti ${partnerBid}`,
      reasoning: `Partner's ${partnerBid} is Cappelletti (${majorName} + an unspecified minor). With no ${majorName} fit and no room to ask for the minor, pass and let partner play ${partnerBid}.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "No fit shown — passing to keep the level low.",
      expectedResponses: [],
      confidence: "medium",
    };
  }

  // partnerBid === "2NT": both minors (5-4 or 5-5).
  if (clubs >= diamonds) {
    const bid = cheapestIn("♣");
    return {
      bid,
      category: "Choose Clubs Over Cappelletti 2NT",
      reasoning: `Partner's 2NT is Cappelletti, showing both minors (5-4 or 5-5) — not natural notrump. With ${clubs} clubs vs ${diamonds} diamonds, prefer clubs: bid ${bid}.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `Choosing clubs as the trump suit (${clubs} cards).`,
      expectedResponses: [],
      confidence: "high",
    };
  }
  const bid = cheapestIn("♦");
  return {
    bid,
    category: "Choose Diamonds Over Cappelletti 2NT",
    reasoning: `Partner's 2NT is Cappelletti, showing both minors (5-4 or 5-5) — not natural notrump. With ${diamonds} diamonds vs ${clubs} clubs, prefer diamonds: bid ${bid}.`,
    handAnalysis: analysis,
    whatYourBidTellsPartner: `Choosing diamonds as the trump suit (${diamonds} cards).`,
    expectedResponses: [],
    confidence: "high",
  };
}

// ─── Overcalls ───────────────────────────────────────────────────────────────

export function getOvercall(
  hand: Hand,
  opponentBid: string,
  vul: Vulnerability,
  lhoBid?: string,
  partnerBid?: string,
  balancing?: boolean,
  /** The auction's first real bid — 2♣ over a 1NT is Stayman ONLY when the
   *  1NT was the OPENING (a 1NT response followed by 2♣ is a natural rebid). */
  auctionOpeningBid?: string,
): BidRecommendation {
  const analysis = analyzeHand(hand);
  const { hcp } = hand;
  const { tp } = analysis;

  // Detect conventional bids that look like suit bids but are not natural.
  // The most common case: RHO bids 2♣ (Stayman) after LHO OPENED 1NT.
  // 2♣ Stayman is not a real clubs bid — 2♣ is now unavailable and the position
  // is more dangerous (both opponents have shown values).  When the 1NT was a
  // RESPONSE (someone opened a suit first), a following 2♣ is natural — do NOT
  // apply the Stayman reading.
  const lhoIsNT = lhoBid?.endsWith("NT") ?? false;
  // Partner doubled the opponents' Stayman 2♣ for a club lead — regardless of
  // which seat's bid the context carries as "latest", a Double by partner in a
  // 1NT-opened auction where 2♣ appeared is that lead-directing double.
  if (
    partnerBid === "Double" &&
    (auctionOpeningBid === undefined || auctionOpeningBid === "1NT") &&
    (opponentBid === "2♣" || lhoBid === "2♣")
  ) {
    return {
      bid: "Pass",
      category: "Pass — Partner's Double Was Lead-Directing",
      reasoning: `Your partner doubled the opponents' Stayman 2♣ bid to ask for a club lead — this is a lead-directing double, not a takeout double asking you to bid. The opponents have signed off in a suit (or are about to). With ${hcp} HCP your side does not have the values to compete: the opponents (the 1NT opener showed 15-17 HCP; the Stayman bidder 8+ HCP with a 4-card major) hold the majority of the points. Pass and let the opponents play their contract. When it is your turn to lead, lead a club as partner requested.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "Pass — I understand your double was lead-directing. I will lead clubs.",
      expectedResponses: [],
      confidence: "high",
    };
  }
  // ── The opponents are MID-STAYMAN: 1NT - 2♣ - (2♦/2♥/2♠ reply). RHO's old
  // bid may sit under LHO's reply (or vice versa) — the standing bid and the
  // artificial reading both matter for an honest story.
  {
    const staymanReply = [opponentBid, lhoBid].find(
      (b) => !!b && /^2[♦♥♠]$/.test(b),
    );
    const sawStayman2C = opponentBid === "2♣" || lhoBid === "2♣";
    const longestLenOC = Math.max(
      hand.spades,
      hand.hearts,
      hand.diamonds,
      hand.clubs,
    );
    if (
      auctionOpeningBid === "1NT" &&
      sawStayman2C &&
      staymanReply &&
      isRealBid(partnerBid) === false &&
      partnerBid !== "Double" &&
      (longestLenOC < 5 || hcp < 8)
    ) {
      const replySuitName = staymanReply.includes("♦")
        ? "diamonds"
        : staymanReply.includes("♥")
          ? "hearts"
          : "spades";
      return {
        bid: "Pass",
        category: "Pass — No Action Over Their Stayman Auction",
        reasoning: `The opponents are mid-Stayman: the 1NT opener (15-17 HCP) answered 2♣ with ${staymanReply}${staymanReply === "2♦" ? " (artificial — denying a 4-card major, saying nothing about diamonds)" : ` (a real 4-card ${replySuitName} suit)`}. A double of ${staymanReply} here would be LEAD-DIRECTING, showing strong ${replySuitName} — not takeout. With ${hcp} HCP and no good 5+ card suit, you have no safe action against opponents who hold most of the strength. Pass.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "No safe action over their conventional auction.",
        expectedResponses: [],
        confidence: "high",
      };
    }
  }

  // ── The STANDING opposing bid may be LHO's, above RHO's older call (e.g.
  // RHO's Stayman reply 2♦ under LHO's 3NT).  Pass texts and level math must
  // key on the highest live bid — re-enter with roles straightened out.
  if (
    lhoBid &&
    isRealBid(lhoBid) &&
    isRealBid(opponentBid) &&
    BID_ORDER.indexOf(lhoBid) > BID_ORDER.indexOf(opponentBid)
  ) {
    return getOvercall(
      hand,
      lhoBid,
      vul,
      opponentBid,
      partnerBid,
      balancing,
      auctionOpeningBid,
    );
  }

  const isStayman =
    opponentBid === "2♣" &&
    lhoIsNT &&
    (auctionOpeningBid === undefined || auctionOpeningBid === "1NT");
  if (isStayman) {
    // The auction is: LHO=1NT, partner=Pass, RHO=2♣ (Stayman). Both opponents have
    // shown values (LHO: 15-17 HCP; RHO: 8+ HCP with a 4-card major). Combined they
    // hold 23-27 HCP. Competing is dangerous.
    //
    // SAYC options in this seat:
    //   • Double = lead-directing (shows ♣ with 3+ of top 5 honors, e.g. KQJ/AQJ/AKJ)
    //   • Natural suit bid at 2-level: requires a genuine 5-card suit (not clubs — taken)
    //   • Pass: always correct with no long suit / mediocre clubs
    //
    // This hand has 5 clubs: recommend a lead-directing Double only if the suit is strong
    // enough (we cannot assess honor quality from count alone, so we advise both options).
    const suitCounts = [
      { name: "spades", count: hand.spades },
      { name: "hearts", count: hand.hearts },
      { name: "diamonds", count: hand.diamonds },
    ];
    const bestNonClub = suitCounts.sort((a, b) => b.count - a.count)[0];
    // Both opponents have shown values (23-27 combined) — competing at the
    // 2-level needs a real suit AND at least a smattering of high cards.
    const hasLong5CardNonClub = bestNonClub.count >= 5 && hcp >= 6;

    if (hasLong5CardNonClub) {
      const sym = suitSymbol(bestNonClub.name);
      const bid = `2${sym}`;
      return {
        bid,
        category: "Natural Overcall After Stayman (2♣)",
        reasoning: `The opponents are using Stayman — LHO opened 1NT (15-17 HCP) and RHO bid 2♣ to ask for a 4-card major. This is a conventional bid, not a real club suit. With ${hand[bestNonClub.name as keyof Hand]} ${bestNonClub.name} and ${hcp} HCP you can overcall ${bid} naturally. Note: both opponents have shown values (combined 23-27 HCP), so compete only with sound suits. Note that 2♣ itself is unavailable (already bid as Stayman).`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `5+ ${bestNonClub.name}, values to compete. Not a strong hand — suggests this suit as a lead and possible contract.`,
        expectedResponses: [
          { partnerBid: "Pass", meaning: "Weak or no fit" },
          { partnerBid: "Raise", meaning: "Fit and some values" },
        ],
        confidence: "medium",
      };
    }

    if (hand.clubs >= 5) {
      // 5 clubs but 2♣ is taken. A Double is lead-directing (shows strong clubs).
      // Requires some values (8+ HCP) — doubling with a very weak hand gives partner
      // a false impression and may push them into a costly contract.
      if (hcp < 8) {
        return {
          bid: "Pass",
          category: "Pass — Too Weak to Double Stayman",
          reasoning: `The opponents are using Stayman — LHO opened 1NT (15-17 HCP) and RHO bid 2♣ (conventional, asking for a 4-card major). Your longest suit is clubs (${hand.clubs} cards), but 2♣ is unavailable. A lead-directing Double of Stayman shows a strong club suit and some values (8+ HCP). With only ${hcp} HCP your hand is too weak to enter the auction safely — both opponents have shown values and any action risks a penalty. Pass and wait.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner:
            "No safe action — too weak to double or overcall.",
          expectedResponses: [],
          confidence: "high",
        };
      }
      // 8+ HCP with 5 clubs — Double is lead-directing (honor quality still matters).
      return {
        bid: "Double",
        category: "Lead-Directing Double of Stayman (Strong Clubs)",
        reasoning: `The opponents are using Stayman — LHO opened 1NT (15-17 HCP) and RHO bid 2♣ (conventional, asking for a 4-card major). Your longest suit is clubs (${hand.clubs} cards), but 2♣ is unavailable as it was just bid as Stayman. A Double here is lead-directing: it tells partner to lead clubs if the opponents play in 3NT or another suit contract. It is NOT a penalty double and NOT an invitation to compete in clubs. To double, your clubs should include at least 3 of the top 5 honors (A, K, Q, J, 10) — e.g. ♣KQJ54 or ♣AQJ75. If your clubs are weaker (e.g. ♣Q8654), Pass is better. With ${hcp} HCP and 5 clubs, a lead-directing double is reasonable if your suit is strong enough.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "Strong clubs (3+ top honors) — please lead clubs. This is lead-directing only; do not compete in clubs unless you have exceptional support.",
        expectedResponses: [
          {
            partnerBid: "Pass",
            meaning: "Will lead clubs if opponents declare",
          },
          {
            partnerBid: "Bid a suit",
            meaning: "Very unbalanced — escaping to own suit (rare)",
          },
        ],
        confidence: "medium",
        note: "If your clubs lack 3 of the top 5 honors (A/K/Q/J/10), prefer Pass — doubling with a weak suit can mislead partner.",
      };
    }

    // No 5-card suit at all — Pass is clear
    return {
      bid: "Pass",
      category: "Pass — No Safe Bid After Stayman",
      reasoning: `The opponents are using Stayman — LHO opened 1NT (15-17 HCP) and RHO bid 2♣ (conventional, not natural clubs). Both opponents have shown values (combined ~23-27 HCP). With ${hcp} HCP and no 5-card suit, there is no safe bid: you cannot overcall 2♣ (it is taken), a suit overcall requires 5+ cards, and doubling Stayman is lead-directing (shows strong clubs, which you lack). Pass and wait — if the opponents stop low your partner may balance.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "No safe action — limited hand, no long suit to compete with.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  // For NT bids, there is no single "opponent suit" — treat as null so all suits remain
  // available for overcalling (the old default of "clubs" was silently filtering out clubs).
  const opponentIsNT = opponentBid.endsWith("NT");
  const opponentSuit = opponentIsNT
    ? null
    : opponentBid.includes("♠")
      ? "spades"
      : opponentBid.includes("♥")
        ? "hearts"
        : opponentBid.includes("♦")
          ? "diamonds"
          : "clubs";

  // ── Overcall over an NT bid (1NT/2NT/3NT from RHO) ──────────────────────────
  if (opponentIsNT) {
    const ntLevel = parseInt(opponentBid[0]);

    // Double of 1NT (16+ HCP balanced).  Against a 1NT OPENING (15-17) it is
    // PENALTY; against a 1NT RESPONSE (6-10 — their side opened a suit) the
    // same double is a STRENGTH/values double: it cannot be penalty of a
    // 6-10 bid, it announces a hand too strong for a simple action.
    if (ntLevel === 1 && hcp >= 16 && analysis.isBalanced) {
      const ntWasOpeningPD =
        auctionOpeningBid === undefined || auctionOpeningBid === "1NT";
      return {
        bid: "Double",
        category: ntWasOpeningPD
          ? "Penalty Double of 1NT"
          : "Strength Double of the 1NT Response (16+)",
        reasoning: ntWasOpeningPD
          ? "With 16+ HCP balanced over opponent's 1NT, double for penalty. Your combined strength exceeds theirs."
          : `Their 1NT was a RESPONSE (6-10) to the ${auctionOpeningBid} opening, so this is not a penalty position — it is a STRENGTH double: with ${hcp} HCP you are far too strong for a simple overcall, and the double asks partner to bid (or pass for penalty with their suits stacked). Plan to show your strength with a notrump or suit rebid next.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: ntWasOpeningPD
          ? "16+ HCP balanced. Penalty double — pass unless very unbalanced."
          : "A very strong hand (16+, often much more) — bid your best suit; I will describe further.",
        expectedResponses: ntWasOpeningPD
          ? [
              {
                partnerBid: "Pass",
                meaning: "5+ pts — generally pass and collect the penalty",
              },
              {
                partnerBid: "Bid a suit",
                meaning: "0-4 pts and very unbalanced — escape to longest suit",
              },
            ]
          : [
              {
                partnerBid: "Bid a suit",
                meaning: "0+ pts — best unbid suit (forced unless stacked)",
              },
              {
                partnerBid: "Pass",
                meaning: "Their suits stacked — converting to penalty",
              },
            ],
        confidence: "high",
      };
    }

    // ── Cappelletti defense to a genuine 1NT OPENING ────────────────────────
    // SAYC's standard defense to an opponent's 1NT opening is a CONVENTION
    // (Cappelletti / Hamilton), not natural suit bids: 2♣ = one-suiter (any
    // suit), 2♦ = both majors, 2♥ = hearts + a minor, 2♠ = spades + a minor,
    // 2NT = both minors. This does NOT apply when the 1NT was a RESPONSE
    // elsewhere in the auction (their side opened a suit first) — that stays
    // natural, per the sandwich-seat handling below.
    const ntWasOpeningOC =
      auctionOpeningBid === undefined || auctionOpeningBid === "1NT";
    if (ntLevel === 1 && ntWasOpeningOC) {
      // Cappelletti needs sound-overcall values (~8+ HCP with real shape) —
      // acting over a strong 1NT on a weak hand invites a large penalty.
      const cappRec =
        hcp >= 8 ? getCappellettiOvercall(hand, opponentBid, lhoBid) : null;
      if (cappRec) return cappRec;
      // Either too weak, or no shape qualifies for ANY Cappelletti call (not
      // a one-suiter, not a two-suiter). Over a genuine 1NT OPENING there is
      // no natural-suit fallback — a direct suit bid here would BE a
      // Cappelletti call and misdescribe this hand's shape. Pass (the
      // Double-for-penalty branch above already handled 16+ balanced hands).
      return {
        bid: "Pass",
        category: "Pass Over Opponent's 1NT Opening (No Cappelletti Shape)",
        reasoning:
          hcp < 8
            ? `Over the opponents' 1NT opening, SAYC's standard defense is Cappelletti — but with only ${hcp} HCP you are too weak for a sound action against their announced 15-17: any call risks a large penalty. Pass and defend.`
            : `Over the opponents' 1NT opening, SAYC's standard defense is Cappelletti — but your hand doesn't fit any of its shapes (no 6+ card one-suiter, no 5-4/5-5 two-suiter). With ${hcp} HCP and no clean conventional call, pass and defend.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "No safe action — hand doesn't fit Cappelletti's shape requirements.",
        expectedResponses: [],
        confidence: "medium",
      };
    }

    // Find longest suit (all 4 suits eligible — no "opponent suit" to exclude)
    const allSuits = [
      { name: "spades", count: hand.spades },
      { name: "hearts", count: hand.hearts },
      { name: "diamonds", count: hand.diamonds },
      { name: "clubs", count: hand.clubs },
    ].sort((a, b) => {
      const lenDiff = b.count - a.count;
      if (lenDiff !== 0) return lenDiff;
      const isMajor = (name: string) => name === "spades" || name === "hearts";
      return (isMajor(b.name) ? 1 : 0) - (isMajor(a.name) ? 1 : 0);
    });

    const bestSuit = allSuits[0];
    // The bid must clear EVERY live opponent bid, not just the NT (their
    // partner may have bid on above it).
    const ntFloorIdxOC = Math.max(
      BID_ORDER.indexOf(opponentBid),
      lhoBid && isRealBid(lhoBid) ? BID_ORDER.indexOf(lhoBid) : -1,
    );
    const suitBid =
      BID_ORDER.find(
        (b, i) => i > ntFloorIdxOC && b.endsWith(suitSymbol(bestSuit.name)),
      ) ?? `7${suitSymbol(bestSuit.name)}`;
    const nextLevel = parseInt(suitBid[0]);

    // Preemptive bid with very long suit.  A 2-level entry takes a 6-card
    // suit; the 3-level a 7-card suit (6 non-vul); the 4-level an 8+ card
    // suit non-vulnerable.  Higher: never.
    const notVulnerable = vul !== "we-only" && vul !== "both";
    if (
      bestSuit.count >= 6 &&
      tp >= 7 &&
      hcp >= 5 &&
      (nextLevel <= 2 ||
        (nextLevel === 3 &&
          (bestSuit.count >= 7 || (bestSuit.count >= 6 && notVulnerable))) ||
        (nextLevel === 4 && bestSuit.count >= 8 && notVulnerable))
    ) {
      // The suit bid over their NT carries a WIDE range (roughly 5-17) — with
      // 11+ HCP it is a sound, constructive call, not a preempt.  The story
      // must match the hand or it contradicts the wide-range tooltip.
      const soundNTOvercall = hcp >= 11;
      return {
        bid: suitBid,
        category: soundNTOvercall
          ? `Natural Overcall over ${opponentBid} — Long ${bestSuit.name.charAt(0).toUpperCase() + bestSuit.name.slice(1)} Suit`
          : `Preemptive Overcall over ${opponentBid} — Long ${bestSuit.name.charAt(0).toUpperCase() + bestSuit.name.slice(1)} Suit`,
        reasoning: `With ${bestSuit.count} ${bestSuit.name} and ${hcp} HCP, bid ${suitBid} over opponent's ${opponentBid}. This shows a long self-sufficient suit and makes it hard for the opponents to find their best spot. Your offensive trick count in ${bestSuit.name} is strong even without partner's help.${soundNTOvercall ? " With your sound values this is constructive — partner may raise with a fit." : ""}`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `Long ${bestSuit.name} suit (${bestSuit.count}+ cards). The bid has a WIDE range (roughly 5-17 pts)${soundNTOvercall ? " — this hand is at the sound end with real values." : " — this hand is at the distributional end, competing on shape."}`,
        expectedResponses: [
          { partnerBid: "Pass", meaning: "Not enough to raise or bid game" },
          {
            partnerBid: `Raise to ${nextLevel + 1}${suitSymbol(bestSuit.name)}`,
            meaning: "Fit and some values",
          },
        ],
        confidence: "high",
        note: `Over ${opponentBid}, doubling is also an option to show values and interest in defending — partner can pass (penalty) or bid a suit.`,
      };
    }

    // Suit overcall with 5-card suit — only over 1NT (a 2-level call).
    // Bidding a 5-card suit at the 3- or 4-level over 2NT/3NT is far too rich.
    if (ntLevel === 1 && bestSuit.count >= 5 && hcp >= 8) {
      return {
        bid: suitBid,
        category: `Natural Overcall over ${opponentBid}`,
        reasoning: `With 5+ ${bestSuit.name} and ${hcp} HCP, bid ${suitBid} over opponent's ${opponentBid} to show your suit.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `5+ ${bestSuit.name}, ${hcp} HCP.`,
        expectedResponses: [
          { partnerBid: "Pass", meaning: "Weak or no fit" },
          { partnerBid: "Raise", meaning: "Fit and some values" },
        ],
        confidence: "medium",
      };
    }

    // Penalty double thresholds.  SAYC convention: opener has shown 15-17
    // (1NT) or 20-21 (2NT) — so partner has shown nothing yet, and your side
    // needs serious values to double.  Over 1NT, you need 16+ HCP; over 2NT
    // or 3NT, the opponents have shown even more, so you need ~14+ HCP plus
    // additional reason to believe you can defeat the contract.
    if (ntLevel === 1) {
      // Over 1NT: only double with 16+ HCP (penalty double — not already handled above
      // because that branch required balanced shape; this catches unbalanced 16+ HCP hands)
      if (hcp >= 16) {
        return {
          bid: "Double",
          category: "Penalty Double of 1NT",
          reasoning: `With ${hcp} HCP over opponent's 1NT, double for penalty. Your hand is stronger than theirs.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner:
            "16+ HCP — penalty double of 1NT. Pass unless very unbalanced.",
          expectedResponses: [
            {
              partnerBid: "Pass",
              meaning: "Has 5+ pts — generally pass and collect the penalty",
            },
            {
              partnerBid: "Bid a suit",
              meaning: "0-4 pts and very unbalanced — escape to longest suit",
            },
          ],
          confidence: "high",
        };
      }
      // 10-15 HCP over 1NT with no 5-card suit — Pass is correct in SAYC
      const ntWasOpening =
        auctionOpeningBid === undefined || auctionOpeningBid === "1NT";
      return {
        bid: "Pass",
        category: "Pass Over Opponent's 1NT",
        reasoning: ntWasOpening
          ? `With ${hcp} HCP and no 5-card suit, passing over opponent's 1NT is correct in SAYC. You need 16+ HCP to double for penalty, or a 5-card suit to overcall. Bidding at the 2-level with a 4-card suit is risky and non-standard.`
          : `The opponents' 1NT was a RESPONSE (their side opened a suit first), so both opponents are still describing their hands. Entering here (the "sandwich" seat) requires a good 5+ card suit and shape — with ${hcp} HCP and no 5-card suit, pass and defend.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "No clear action — limited hand, no long suit.",
        expectedResponses: [],
        confidence: "high",
      };
    }

    // Penalty double of 2NT/3NT: their auction shows game values (~25+ when
    // 3NT came via opener + responder), so raw HCP can NEVER justify it — a
    // double promises a SOURCE OF TRICKS: a good 6+ card suit to run (with an
    // entry), typically as a lead-director.  A flat 14 sits under their
    // strength and doubles a making game.
    {
      const longestNT2 = longestSuitInfo(hand);
      if (
        longestNT2.length >= 6 &&
        hand.goodSuitQuality !== false &&
        hcp >= 10
      ) {
        return {
          bid: "Double",
          category: `Lead-Directing Penalty Double of ${opponentBid}`,
          reasoning: `A double of the opponents' freely-bid ${opponentBid} promises a SOURCE OF TRICKS, not just points: your ${longestNT2.length}-card ${longestNT2.name} suit rates to run and defeat the contract. It also tells partner what to lead.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: `A running ${longestNT2.name} suit — lead it. We can beat ${opponentBid}.`,
          expectedResponses: [
            { partnerBid: "Pass", meaning: "Defending with your suit led" },
          ],
          confidence: "medium",
        };
      }
    }

    // Default: Pass over NT with weak hand and no long suit
    return {
      bid: "Pass",
      category: `Pass Over Opponent's ${opponentBid}`,
      reasoning: `With only ${hcp} HCP and no long suit, passing over opponent's ${opponentBid} is safest. Entering the auction at a higher level risks a large penalty.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "No action — limited hand.",
      expectedResponses: [],
      confidence: "medium",
    };
  }

  // Past this point we are handling a suit opening — opponentSuit is guaranteed non-null.
  const suitOpponent = opponentSuit as string;

  // Strong NT overcall (15-18 HCP balanced, stopper in opponent's suit).
  // 1NT directly over a 1-level opening; 2NT/3NT only over a LONE preempt
  // opening — when BOTH opponents have bid (opener + responder showing 20+
  // combined), a 15-18 balanced hand must not volunteer NT at the 3-level.
  const bothOpponentsBid =
    !!lhoBid &&
    lhoBid !== "Double" &&
    lhoBid !== opponentBid &&
    !["Pass"].includes(lhoBid);
  // In the BALANCING seat the 1NT range drops to 11-14 — a 15-18 balanced
  // hand there DOUBLES first and bids NT next, or partner (who reads the
  // balancing 1NT as 11-14) will pass out a game.
  if (
    balancing &&
    hcp >= 15 &&
    analysis.isBalanced &&
    hand.hasStopperInOpponentSuit !== false &&
    parseInt(opponentBid[0]) === 1
  ) {
    return {
      bid: "Double",
      category: "Balancing Double (Too Strong for the Balancing 1NT)",
      reasoning: `In the balancing (pass-out) seat, 1NT shows only 11-14 — with ${hcp} HCP balanced you are too strong for it. Double first and bid notrump next: that sequence shows 15+ balanced with their suit stopped, and keeps the game your side likely owns in the picture.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "Balancing double — bid your best suit; my notrump rebid next will show 15+ balanced with their suit stopped.",
      expectedResponses: [
        { partnerBid: "Bid a suit", meaning: "0+ pts — best unbid suit" },
      ],
      confidence: "medium",
      note: "After partner's advance, rebid the cheapest NT to show 15-18 balanced (jump with more).",
    };
  }
  if (
    !balancing &&
    hcp >= 15 &&
    hcp <= 18 &&
    analysis.isBalanced &&
    hand.hasStopperInOpponentSuit !== false &&
    (parseInt(opponentBid[0]) === 1 || !bothOpponentsBid)
  ) {
    const opponentIdx = BID_ORDER.indexOf(opponentBid);
    let ntLevel = 1;
    while (BID_ORDER.indexOf(`${ntLevel}NT`) <= opponentIdx) {
      ntLevel++;
    }
    const ntBid = `${ntLevel}NT`;
    const is2PlusNT = ntLevel >= 2;
    return {
      bid: ntBid,
      category: `Strong ${ntBid} Overcall (15-18 HCP)`,
      reasoning: `With 15-18 HCP balanced and a stopper in the opponent's suit, bid ${ntBid}. Responses are the same as to a ${ntBid} opening.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `15-18 HCP balanced with a stopper in their suit.${is2PlusNT ? "" : " Stayman and transfers apply."}`,
      expectedResponses: is2PlusNT
        ? [
            { partnerBid: "3♣", meaning: "Stayman" },
            { partnerBid: "3♦", meaning: "Transfer to hearts" },
            { partnerBid: "3♥", meaning: "Transfer to spades" },
          ]
        : [
            { partnerBid: "2♣", meaning: "Stayman" },
            { partnerBid: "2♦", meaning: "Transfer to hearts" },
            { partnerBid: "2♥", meaning: "Transfer to spades" },
          ],
      confidence: "high",
      note: "You must have a stopper (A, Kx, Qxx, or Jxxx) in the opponent's suit to bid NT.",
    };
  }

  // Balancing 1NT (protective seat over a 1-level opening): about 11-14 HCP
  // balanced with a stopper in their suit — a full king lighter than the direct
  // 15-18 overcall.  The opponents stopped low, so partner is marked with
  // values; reopen with 1NT rather than sell out.  Without a stopper, fall
  // through to Pass — which is exactly why the stopper is asked for here.
  if (
    balancing &&
    hcp >= 11 &&
    hcp <= 14 &&
    analysis.isBalanced &&
    hand.hasStopperInOpponentSuit !== false &&
    parseInt(opponentBid[0]) === 1
  ) {
    return {
      bid: "1NT",
      category: `Balancing 1NT (${hcp} HCP, Protective Seat)`,
      reasoning: `In the balancing (pass-out) seat over their ${opponentBid}, 1NT shows about 11-14 HCP balanced with a stopper in their suit — a king lighter than a direct 1NT overcall (which needs 15-18). The opponents found a fit and stopped low, so your partner is marked with values: reopen with 1NT rather than sell out. Pass instead if you have no stopper in their suit.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "11-14 HCP balanced with a stopper in their suit (balancing 1NT — a king lighter than a direct 1NT overcall). Stayman and transfers apply.",
      expectedResponses: [
        { partnerBid: "2♣", meaning: "Stayman" },
        { partnerBid: "2♦", meaning: "Transfer to hearts" },
        { partnerBid: "2♥", meaning: "Transfer to spades" },
      ],
      confidence: "high",
      note: "You must have a stopper (A, Kx, Qxx, or Jxxx) in the opponent's suit to bid NT. Without one, pass and defend.",
    };
  }

  // Build suit lists for overcall checks (Michaels, jump overcall, simple
  // overcall).  Exclude EVERY suit the opponents have shown naturally — not
  // just the latest bid: after (1♠)-…-(2♣) both spades and clubs are theirs.
  const oppShownSuits = new Set<string>();
  if (suitOpponent) oppShownSuits.add(suitOpponent);
  for (const b of [auctionOpeningBid, lhoBid]) {
    if (b && /^[1-7][♠♥♦♣]$/.test(b)) {
      oppShownSuits.add(
        b.includes("♠")
          ? "spades"
          : b.includes("♥")
            ? "hearts"
            : b.includes("♦")
              ? "diamonds"
              : "clubs",
      );
    }
  }
  const suits = [
    { name: "spades", count: hand.spades },
    { name: "hearts", count: hand.hearts },
    { name: "diamonds", count: hand.diamonds },
    { name: "clubs", count: hand.clubs },
  ].filter((s) => !oppShownSuits.has(s.name));

  const inOpponentSuit = hand[suitOpponent as keyof Hand] as number;

  // Michaels cuebid (5-5 in two SPECIFIC suits) — check BEFORE simple overcall.
  // Over a minor opening: shows BOTH MAJORS (5+ hearts AND 5+ spades).
  // Over a major opening: shows the OTHER major + an unspecified 5+ card minor.
  // A hand with two random 5-card suits (e.g. spades + diamonds over 1♣) does
  // NOT qualify — it should fall through to a simple overcall of its best suit.
  const michaelsQualifies =
    suitOpponent === "clubs" || suitOpponent === "diamonds"
      ? hand.hearts >= 5 && hand.spades >= 5
      : suitOpponent === "hearts"
        ? hand.spades >= 5 && (hand.clubs >= 5 || hand.diamonds >= 5)
        : hand.hearts >= 5 && (hand.clubs >= 5 || hand.diamonds >= 5);
  // Michaels is a DIRECT cuebid of the opponents' 1-level OPENING.  A suit bid
  // deep in their auction (e.g. opener's 2♣ rebid) is not a Michaels target —
  // cueing it would be meaningless (and can even be an illegal bid).
  const michaelsApplies =
    parseInt(opponentBid[0]) === 1 &&
    (auctionOpeningBid === undefined || opponentBid === auctionOpeningBid);
  if (michaelsQualifies && michaelsApplies) {
    const michaelsMeaning =
      suitOpponent === "clubs" || suitOpponent === "diamonds"
        ? "both majors (5+ hearts and 5+ spades)"
        : suitOpponent === "hearts"
          ? "5+ spades + 5+ unspecified minor"
          : "5+ hearts + 5+ unspecified minor";
    return {
      bid: `2${suitSymbol(suitOpponent)}`,
      category: "Michaels Cuebid (5-5 Two-Suiter)",
      reasoning: `With 5-5 in the two suits Michaels shows over this opening, bid the Michaels cuebid (2${suitSymbol(suitOpponent)}). Over ${suitOpponent === "clubs" || suitOpponent === "diamonds" ? "a minor" : "a major"} opening, this shows ${michaelsMeaning}. No point minimum, but vulnerability matters.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `Two-suited hand (5-5+): ${michaelsMeaning}. Partner picks the best suit.`,
      expectedResponses: [
        {
          partnerBid: "Bid cheapest suit",
          meaning: "With equal length in both shown suits",
        },
        {
          partnerBid: "2NT",
          meaning: "Asks overcaller to name the minor (after major overcall)",
        },
        { partnerBid: "Cue bid", meaning: "Game or slam interest" },
      ],
      confidence: "medium",
      note:
        vul === "we-only" || vul === "both"
          ? "Vulnerable — be more conservative with minimum Michaels hands."
          : "Consider whether your suits have good quality before committing to Michaels.",
    };
  }

  // Jump overcall / preemptive overcall (5-10 HCP, 6+ card suit).
  // A weak jump overcall must be a TRUE JUMP: one level above the cheapest
  // legal bid in the suit (6 cards), two with 7, three with 8+ — e.g. over
  // 1♠ a 6-card diamond suit jumps to 3♦, NOT 2♦ (2♦ would be a simple
  // overcall promising 8-15 HCP).
  const sixCardSuits = suits.filter((s) => s.count >= 6);
  const preemptCandidate = sixCardSuits.length > 0 ? sixCardSuits[0] : null;
  // A weak jump overcall is measured RELATIVE to the cheapest legal bid in
  // the suit: a 6-card suit makes a SINGLE jump (one level above cheapest),
  // 7 cards a double jump, 8+ a triple jump — capped at the 4-level.  (An
  // absolute "6 cards → 2-level" rule breaks for minors over majors: over 1♠
  // the 6-card-diamond WJO is 3♦, since 2♦ is merely the cheapest overcall.)
  // Preempt level: the LENGTH-based level of an opening preempt (6 cards →
  // 2-level, 7 → 3-level, 8+ → 4-level), never below the cheapest legal bid
  // in the suit, capped at the 4-level.  When that lands ON the cheapest
  // legal bid it is not a jump — it plays as a LIGHT long-suit overcall and
  // must be labeled that way (needs 7+ HCP and a good suit).
  let skipPreempt = false;
  if (preemptCandidate && hcp >= 5 && hcp <= 10) {
    // A preempt PROMISES a good suit (2 of the top 3 honors, or 3 of the top
    // 5).  When the caller has told us the suit is ragged, do not preempt —
    // a ragged-suit jump can cost a large penalty and misdirects partner's
    // lead.  (undefined = quality unknown → keep the legacy behavior.)
    if (hand.goodSuitQuality === false) skipPreempt = true;
    // Like a weak two-bid, a WJO denies a 4-card MAJOR on the side — with one,
    // a simple overcall keeps that suit in play instead of burying it.
    if (
      (preemptCandidate.name !== "hearts" && hand.hearts >= 4) ||
      (preemptCandidate.name !== "spades" && hand.spades >= 4)
    )
      skipPreempt = true;
  }
  if (preemptCandidate && hcp >= 5 && hcp <= 10 && !skipPreempt) {
    const best = preemptCandidate;
    const wjoSuitSym = suitSymbol(best.name);
    const opponentBidIdxWJO = BID_ORDER.indexOf(opponentBid);
    const minLegalWJO = BID_ORDER.find(
      (b, i) => i > opponentBidIdxWJO && b.endsWith(wjoSuitSym),
    );
    if (minLegalWJO && parseInt(minLegalWJO[0]) <= 4) {
      const absoluteLvl = best.count >= 8 ? 4 : best.count >= 7 ? 3 : 2;
      const lvl = Math.min(4, Math.max(absoluteLvl, parseInt(minLegalWJO[0])));
      const jumpBid = `${lvl}${wjoSuitSym}`;
      const isTrueJump = jumpBid !== minLegalWJO;
      if (isTrueJump || hcp >= 7) {
        const levelName = !isTrueJump
          ? "Light Long-Suit Overcall"
          : lvl === 4
            ? "Game Preempt"
            : lvl === 3
              ? "3-Level Preempt"
              : "Weak Jump Overcall";
        const isTwoClubs = jumpBid === "2♣";
        return {
          bid: jumpBid,
          category: `${levelName} (${best.count}-Card ${best.name.charAt(0).toUpperCase() + best.name.slice(1)})`,
          reasoning: isTrueJump
            ? `With ${hcp} HCP and ${best.count} ${best.name}, make a preemptive ${jumpBid} overcall — a weak jump, pitched like an opening preempt (6 cards → 2-level, 7 → 3-level, 8+ → 4-level). Your ${best.count}-card suit offers strong offensive potential while making it hard for opponents to find their fit.`
            : `With ${hcp} HCP and a good ${best.count}-card ${best.name} suit, bid ${jumpBid} — the cheapest available call in the suit. This is a LIGHT overcall justified by the extra trump length (a 5-card suit at this level would need more high cards); it is obstructive and lead-directing, not a strong bid.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: `${hcp} HCP, ${best.count}-card ${best.name} suit. ${isTrueJump ? "Preemptive — not a strong hand." : "Light and long — competing on shape, not strength."}`,
          expectedResponses: [
            {
              partnerBid: `Raise to ${lvl + 1}${wjoSuitSym}`,
              meaning: "Fit + values — push the preempt higher",
            },
            {
              partnerBid: "Pass",
              meaning: "No fit or minimal values — trust the preempt",
            },
            {
              partnerBid: `${lvl + 2}${wjoSuitSym} or game`,
              meaning: "Strong fit — bid game or slam",
            },
          ],
          confidence: "high",
          note: isTwoClubs
            ? "2♣ as an OVERCALL is natural clubs — it is NOT the same as a 2♣ opening bid (which would be a strong 22+ HCP artificial bid). Overcalling 2♣ simply shows a long club suit."
            : vul === "we-only" || vul === "both"
              ? "Vulnerable — be sure your suit has at least two of the top three honors (A, K, Q)."
              : undefined,
        };
      }
    }
  }

  // Simple suit overcall (1-level 8-16, higher 10-17 — per SAYC; with 17-18
  // and a good suit, overcall intending to bid again) — checked BEFORE takeout
  // double.  A specific suit overcall is more descriptive than a takeout
  // double when available.  NOTE: hands with takeout shape (shortness in their
  // suit) and 16+ are picked up by the strong-double branch below when no suit
  // bid fires; without shortness a strong hand MUST overcall — never pass 16+.
  const fiveCardSuits = suits.filter((s) => s.count >= 5);
  if (fiveCardSuits.length > 0 && hcp >= 8 && hcp <= 18) {
    const best = fiveCardSuits.sort((a, b) => b.count - a.count)[0];

    // Calculate the minimum level at which we can overcall this suit — must be
    // strictly above opponent's bid (handles 1-level, 2-level, and 3-level overcalls)
    const suitSym = suitSymbol(best.name);
    const opponentIdx = BID_ORDER.indexOf(opponentBid);
    let overcallLevel = 1;
    while (BID_ORDER.indexOf(`${overcallLevel}${suitSym}`) <= opponentIdx) {
      overcallLevel++;
    }
    const overcallBid = `${overcallLevel}${suitSym}`;

    // An overcall promises a GOOD suit — when the caller has told us this
    // (longest) suit is ragged (no 2 of the top 3 honors, nor 3 of the top
    // 5), a 5-card overcall is unsound: partner will raise and lead this
    // suit.  Fall through to double/pass.  (16+ hands still act — passing
    // that much strength is worse than a ragged suit; 6+ card length also
    // compensates.)
    const raggedFiveCardSuit =
      hand.goodSuitQuality === false &&
      best.count === 5 &&
      best.count ===
        Math.max(hand.spades, hand.hearts, hand.diamonds, hand.clubs) &&
      hcp <= 15;
    // A 2-level or higher overcall requires at least 10 HCP — with 8–9 fall
    // through to Pass.  A 3-level overcall needs 12+ with a 6-card suit, and a
    // simple overcall NEVER enters at the 4-level (over their game-level
    // preempt, double with the right shape or pass).
    if (
      raggedFiveCardSuit ||
      (overcallLevel >= 2 && hcp < 10) ||
      (overcallLevel >= 3 && hcp < 11 && best.count < 6) ||
      overcallLevel >= 4
    ) {
      // fall through to takeout double / pass below
    } else {
      const honorNote =
        hcp <= 10
          ? " Make sure your suit has at least 2 honors (NF Bridge requirement for minimum overcall)."
          : "";
      const vulNote =
        vul === "we-only" || vul === "both"
          ? " You are vulnerable — be more selective about overcalling with minimum values."
          : "";
      const levelName =
        overcallLevel === 1
          ? "1-Level"
          : overcallLevel === 2
            ? "2-Level"
            : `${overcallLevel}-Level`;
      const balancingPrefix = balancing ? "Balancing " : "";
      const balancingNote = balancing
        ? ' The opening was followed by two passes, putting you in the balancing (pass-out) seat — the last chance to keep the auction alive. Partner may have been "trapped" with values but no clear bid. In this seat SAYC allows you to compete with slightly less than a direct overcall would require.'
        : "";
      return {
        bid: overcallBid,
        category: `${balancingPrefix}${levelName} Overcall (${hcp} HCP, ${best.count}-Card ${best.name.charAt(0).toUpperCase() + best.name.slice(1)})`,
        reasoning: `With ${hcp} HCP and ${best.count} ${best.name}, overcall ${overcallBid}. A ${levelName.toLowerCase()} overcall shows a good ${best.count}-card suit and ${overcallLevel === 1 ? "8-16" : "10-17"} HCP.${hcp >= 16 ? " Your hand is a MAXIMUM for the overcall — plan to bid again (raise, new suit, or NT) to show the extra strength." : ""}${balancingNote}${honorNote}${vulNote}`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `${hcp} HCP, ${best.count}-card ${best.name} suit. ${overcallLevel >= 2 ? "10-17 HCP for 2-level or higher." : "8-16 HCP at the 1-level."}${balancing ? " (Balancing seat — may have slightly fewer values than a direct overcall.)" : ""}`,
        expectedResponses: [
          {
            partnerBid: "Raise (support + values)",
            meaning: "3+ card support, appropriate values",
          },
          {
            partnerBid: "Cue bid opponent's suit",
            meaning: "Strong hand — asking for clarification",
          },
          { partnerBid: "Pass", meaning: "No fit, no game values" },
        ],
        confidence: "high",
        note:
          best.count === 5
            ? "With exactly 5 cards: make sure the suit is genuinely good (2 of the top 3 honors, or 3 of the top 5) for a sound overcall — quality matters more than raw length here."
            : undefined,
      };
    }
  }

  // Takeout / optional doubles are a LOW-LEVEL tool.  Over a freely-bid game
  // (the opponents at the 4-level or higher), a double is PENALTY — it shows
  // defensive tricks (trump length/strength), NOT shortness asking partner to
  // bid.  Do not recommend an automatic takeout double here; with a hand that
  // is short in their suit (no penalty double) and a partner who has shown
  // nothing, the sound action is to pass.
  const opponentLevel = parseInt(opponentBid[0]) || 0;
  if (opponentLevel >= 4) {
    return {
      bid: "Pass",
      category: "Pass (Double Would Be Penalty at the Game Level)",
      reasoning: `The opponents have bid to ${opponentBid}, a game-level contract. A takeout double only applies at low levels — a double of a freely-bid game is PENALTY, showing defensive tricks (length and strength in their trump suit), not shortness. With ${hcp} HCP and ${inOpponentSuit} card${inOpponentSuit === 1 ? "" : "s"} in their ${suitOpponent} suit, you do not have a penalty double, and your partner has not shown values. Pass and defend.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "No penalty double of their game and partner has shown nothing — passing to defend.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  // 19+ HCP balanced is too strong for a direct 1NT/2NT overcall.  Double first
  // (planning to rebid NT) — this is a STRENGTH-showing double, not takeout, so
  // it applies even with length in the opponent's suit.  A 19-count must never
  // pass an opponent's opening.
  if (hcp >= 19 && analysis.isBalanced && !opponentIsNT) {
    return {
      bid: "Double",
      category: "High-Strength Double (19+ HCP Balanced)",
      reasoning:
        "With 19+ HCP balanced you are too strong for a direct 1NT/2NT overcall. Double first; on your next turn rebid NT at the lowest level to show this powerhouse. (This is a strength-showing double — not takeout — so your length in their suit does not matter.)",
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "19+ HCP balanced — very strong; NT rebid to follow.",
      expectedResponses: [],
      confidence: "high",
      note: "After partner responds, rebid the lowest available NT to show 19+ balanced.",
    };
  }

  // Takeout Double (12-15 HCP, short in opponent's suit, good shape — 3+ cards in each unbid suit)
  // Requires hasGoodShape: a takeout double promises support for all unbid suits.
  // Only check the three suits NOT bid by the opponent.
  const unOpenedSuits = (
    ["spades", "hearts", "diamonds", "clubs"] as const
  ).filter((s) => s !== suitOpponent);
  const hasGoodShape =
    inOpponentSuit <= 2 &&
    unOpenedSuits.every((s) => (hand[s as keyof Hand] as number) >= 3);

  if (hcp >= 12 && hcp <= 15 && hasGoodShape) {
    return {
      bid: "Double",
      category: "Takeout Double (12-15 HCP)",
      reasoning: `With ${hcp} HCP, 0-2 cards in opponent's ${suitOpponent}, and 3+ cards in every unbid suit, double for takeout. This is the classic takeout double shape (e.g. 4441/5440, or a small doubleton in their suit) — you are asking partner to bid their best suit among the unbid suits.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `Opening strength (12-15 HCP) with 0-2 cards in ${suitOpponent} and support for all unbid suits. Please bid your best suit.`,
      expectedResponses: [
        {
          partnerBid: "1NT (balanced + stopper)",
          meaning: "6-10 pts balanced with stopper in opponents' suit",
        },
        { partnerBid: "2NT (balanced + stopper)", meaning: "11-12 pts" },
        { partnerBid: "3NT (balanced + stopper)", meaning: "13-15 pts" },
        {
          partnerBid: "Bid a suit",
          meaning:
            "0-8 pts — bid longest suit (prefer 4+ card major over longer minor)",
        },
        { partnerBid: "Jump bid in suit", meaning: "9-12 pts" },
        { partnerBid: "Game", meaning: "13+ pts" },
      ],
      confidence: "high",
      note: "Do NOT bid again unless partner promises values (a jump or cue bid). Shape is less important with 16+ pts.",
    };
  }

  // Strong double (16+ HCP) then rebid.  Any hand too strong for a simple
  // overcall doubles first, regardless of balance — shortness in the opponent's
  // suit (inOpponentSuit <= 2) is exactly what a takeout double wants.  This
  // also catches the 19-21 powerhouses that must NOT pass an opening.
  if (hcp >= 16 && inOpponentSuit <= 2) {
    const strongLabel = hcp >= 19 ? "19+" : "16-18";
    return {
      bid: "Double",
      category: `High-Strength Takeout Double (${strongLabel} HCP)`,
      reasoning: `With ${hcp} HCP, double first to show a strong hand. On the next round, bid your long suit (jump with 19+) to reveal extra strength beyond a normal overcall. A double is correct here — being short in the opponent's ${suitOpponent} is ideal for takeout.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "Strong hand (16+ HCP) — double first reveals extra strength beyond a simple overcall.",
      expectedResponses: [],
      confidence: "high",
      note: `After partner responds, ${hcp >= 19 ? "jump in" : "bid"} your long suit (or NT if balanced) to show ${strongLabel} HCP.`,
    };
  }

  // Unusual 2NT (5-5 in two lowest unbid suits)
  const lowest2Unbid = [
    { name: "clubs", count: hand.clubs },
    { name: "diamonds", count: hand.diamonds },
    { name: "hearts", count: hand.hearts },
  ].filter((s) => s.name !== suitOpponent && s.count >= 5);

  if (
    lowest2Unbid.length >= 2 &&
    tp >= 5 &&
    !opponentIsNT &&
    parseInt(opponentBid[0]) === 1 &&
    // Unusual 2NT is a DIRECT jump over the opponents' opening only.
    (auctionOpeningBid === undefined || opponentBid === auctionOpeningBid)
  ) {
    return {
      bid: "2NT",
      category: "Unusual 2NT (5-5 in Lower Suits)",
      reasoning:
        "With 5-5 in the two lowest unbid suits, bid Unusual 2NT. Over 1♥/1♠ this shows clubs and diamonds (both minors).",
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "5+ cards in each of the two lowest unbid suits.",
      expectedResponses: [
        { partnerBid: "3♣/3♦", meaning: "Choose the better minor" },
      ],
      confidence: "medium",
      note:
        vul === "we-only" || vul === "both"
          ? "Vulnerable — this can be costly if doubled. Ensure good suit quality."
          : undefined,
    };
  }

  return {
    bid: "Pass",
    category: "Pass (No Good Overcall)",
    reasoning: (() => {
      const parts: string[] = [];
      if (inOpponentSuit >= 4) {
        parts.push(
          `Your longest suit is the opponent's suit (${inOpponentSuit} ${suitOpponent}) — you cannot make a natural overcall in it.`,
        );
      }
      if (!analysis.isBalanced) {
        parts.push(
          "Your hand is unbalanced (singleton or void), so a 1NT overcall (which requires a balanced hand) is not available.",
        );
      }
      if (inOpponentSuit > 2) {
        parts.push(
          `A takeout double requires shortness (0–2 cards) in the opponent's suit, but you hold ${inOpponentSuit} ${suitOpponent}.`,
        );
      }
      // Explain the REAL reason a takeout double is unavailable: you lack 3-card
      // support for one or more unbid suits.  (Being short in the opponent's
      // suit is good for a double, so it is never the reason to pass.)
      const shortUnbid = unOpenedSuits.filter(
        (s) => (hand[s as keyof Hand] as number) < 3,
      );
      if (hcp >= 12 && inOpponentSuit <= 2 && shortUnbid.length > 0) {
        parts.push(
          `A takeout double promises 3+ cards in every unbid suit, but you hold only ${shortUnbid
            .map((s) => `${hand[s as keyof Hand]} ${s}`)
            .join(" and ")} — so double is not available.`,
        );
      }
      const longestUnbid = suits.reduce(
        (best, s) => (s.count > best.count ? s : best),
        { name: "", count: 0 },
      );
      if (longestUnbid.count > 0 && longestUnbid.count < 5) {
        parts.push(
          `Your longest unbid suit has only ${longestUnbid.count} cards — a natural overcall requires 5+.`,
        );
      } else if (longestUnbid.count >= 5) {
        // A 5+ card suit exists but a gate blocked it — say WHICH one
        // honestly instead of implying no suit was available.
        const oIdx = BID_ORDER.indexOf(opponentBid);
        let lvl = 1;
        while (
          lvl < 7 &&
          BID_ORDER.indexOf(`${lvl}${suitSymbol(longestUnbid.name)}`) <= oIdx
        )
          lvl++;
        const hcpGate = lvl >= 3 ? "11+" : lvl === 2 ? "10+" : "8+";
        const raggedLongest =
          hand.goodSuitQuality === false &&
          longestUnbid.count ===
            Math.max(hand.spades, hand.hearts, hand.diamonds, hand.clubs);
        if (raggedLongest && longestUnbid.count >= 6 && hcp <= 10) {
          parts.push(
            `Your ${longestUnbid.count}-card ${longestUnbid.name} suit has preempt length, but it is too RAGGED for a preemptive jump — a preempt promises a GOOD suit (2 of the top 3 honors, or 3 of the top 5) since partner will trust it for sacrifices and leads. A natural ${lvl}-level overcall needs ${hcpGate} HCP, which you also lack (${hcp} HCP).`,
          );
        } else if (raggedLongest) {
          parts.push(
            `Your ${longestUnbid.count}-card ${longestUnbid.name} suit is too RAGGED to overcall — an overcall promises a GOOD suit (2 of the top 3 honors, or 3 of the top 5); partner would raise with support and lead this suit against their contract.`,
          );
        } else {
          parts.push(
            `Your ${longestUnbid.count}-card ${longestUnbid.name} suit would have to come in at the ${lvl}-level, which needs ${hcpGate} HCP — with only ${hcp} HCP that overcall is too dangerous.`,
          );
        }
      }
      parts.push(
        "Pass for now. If the opponents stop low you may get a chance to enter the auction later (balancing position).",
      );
      return parts.join(" ");
    })(),
    handAnalysis: analysis,
    whatYourBidTellsPartner: "No suitable overcall — passing.",
    expectedResponses: [],
    confidence: "high",
  };
}

// ─── Negative Double ─────────────────────────────────────────────────────────

function negativeDoubleFitRaise(
  _hand: Hand,
  analysis: ReturnType<typeof analyzeHand>,
  openerBid: string,
  overcall: string,
  partnerSuitNameND: string,
  partnerFitND: number,
  minFitLength: number,
  pointTotal: number,
): BidRecommendation | null {
  if (
    partnerFitND < minFitLength ||
    !(
      partnerSuitNameND === "hearts" ||
      partnerSuitNameND === "spades" ||
      partnerFitND >= minFitLength + 1
    ) ||
    overcall.endsWith("NT") ||
    overcall.slice(1) === openerBid.slice(1)
  ) {
    return null;
  }

  const overcallIdxR = BID_ORDER.indexOf(overcall);
  const sym = suitSymbol(partnerSuitNameND);
  const minRaise = BID_ORDER.find(
    (b, i) => i > overcallIdxR && b.endsWith(sym),
  );
  if (pointTotal >= 10 && minRaise && parseInt(minRaise[0]) <= 3) {
    const cueBidND = BID_ORDER.find(
      (b, i) =>
        i > BID_ORDER.indexOf(overcall) && b.endsWith(overcall.slice(1)),
    );
    if (cueBidND && parseInt(cueBidND[0]) <= 3) {
      return {
        bid: cueBidND,
        category:
          pointTotal >= 13
            ? "Cuebid Raise (13+, Game Forcing)"
            : "Cuebid Raise (10-12, Limit Raise or Better)",
        reasoning: `Partner opened ${openerBid} and you hold ${partnerFitND}-card support with ${pointTotal} TP. In competition, direct raises — even jumps — are WEAK/preemptive, so the cuebid of the overcalled suit (${cueBidND}) carries every raise of limit strength or better.${pointTotal >= 13 ? " With game-going values you will insist on game." : " With 10-12, pass partner's minimum signoff."}`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `${partnerFitND}-card ${partnerSuitNameND} support, ${pointTotal >= 13 ? "13+ pts — game-forcing" : "10-12 pts — limit raise"}.`,
        expectedResponses: [
          { partnerBid: "Return to the suit", meaning: "Minimum opener" },
          { partnerBid: "Game", meaning: "Accepting with extras" },
        ],
        confidence: "high",
      };
    }
  }
  if (minRaise && parseInt(minRaise[0]) <= 3) {
    return {
      bid: minRaise,
      category:
        pointTotal >= 13
          ? "Raise (Game-Going Hand — Will Bid Again)"
          : pointTotal >= 10
            ? "Raise (Limit Values, Cue Unavailable)"
            : "Competitive Raise",
      reasoning: `Partner opened ${openerBid} and you hold ${partnerFitND}-card support — raising describes this hand better than a negative double. ${pointTotal >= 13 ? `With ${pointTotal} TP the hand is game-going: the preempt removed the forcing cuebid, so raise now and bid again over partner's sign-off.` : pointTotal >= 10 ? `With ${pointTotal} TP, make a limit raise.` : "With under 10 points, raise once competitively."}`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: `${partnerFitND}-card ${partnerSuitNameND} support, ${pointTotal >= 13 ? "13+ pts — I will bid again over a sign-off" : pointTotal >= 10 ? "10-12 pts (limit raise)" : "6-9 pts (competitive)"}.`,
      expectedResponses: [
        { partnerBid: "Pass", meaning: "Minimum opener" },
        { partnerBid: "Game", meaning: "Extra values" },
      ],
      confidence: "high",
    };
  }
  return null;
}

export function getNegativeDouble(
  hand: Hand,
  openerBid: string,
  overcall: string,
  vul: Vulnerability = "none",
): BidRecommendation {
  const analysis = analyzeHand(hand);
  const { hcp } = hand;
  const overcallLevel = parseInt(overcall.charAt(0)) || 1;

  // Determine which majors are unbid
  const openedHearts = openerBid.includes("♥");
  const openedSpades = openerBid.includes("♠");
  const overcalledHearts = overcall.includes("♥");
  const overcalledSpades = overcall.includes("♠");

  const heartsUnbid = !openedHearts && !overcalledHearts;
  const spadesUnbid = !openedSpades && !overcalledSpades;

  if (hcp < 6) {
    // A PREEMPTIVE raise needs shape, not HCP: with a big fit for partner's
    // suit (4+ for a major, 5+ for a minor) and real shortness, jump-raise
    // competitively — the Law of Total Tricks covers the level, and passing
    // hands the opponents an uncontested run.
    const openSuitNameND = openerBid.includes("♠")
      ? "spades"
      : openerBid.includes("♥")
        ? "hearts"
        : openerBid.includes("♦")
          ? "diamonds"
          : "clubs";
    const openIsMajorND =
      openSuitNameND === "spades" || openSuitNameND === "hearts";
    const fitLenND = hand[openSuitNameND as keyof Hand] as number;
    const shortestND = Math.min(
      hand.spades,
      hand.hearts,
      hand.diamonds,
      hand.clubs,
    );
    const jumpRaiseND = (() => {
      const oIdx = BID_ORDER.indexOf(overcall);
      const cheapest = BID_ORDER.find(
        (b, i) => i > oIdx && b.endsWith(suitSymbol(openSuitNameND)),
      );
      if (!cheapest) return undefined;
      const lvl = Math.min(parseInt(cheapest[0]) + 1, 4);
      // LOTT: bid to the trump total — 9 trumps → 3-level, 10+ → 4-level.
      const trumps = fitLenND + (openIsMajorND ? 5 : 3);
      const lottLvl = trumps - 6;
      const target = Math.min(lvl, lottLvl);
      const bid = `${target}${suitSymbol(openSuitNameND)}`;
      return BID_ORDER.indexOf(bid) > oIdx ? bid : undefined;
    })();
    if (fitLenND >= (openIsMajorND ? 4 : 5) && shortestND <= 1 && jumpRaiseND) {
      return {
        bid: jumpRaiseND,
        category: "Preemptive Jump Raise in Competition (Weak, Big Fit)",
        reasoning: `Too weak for a negative double (${hcp} HCP), but with ${fitLenND}-card support for partner's ${openSuitNameND} and a ${shortestND === 0 ? "void" : "singleton"}, a preemptive ${jumpRaiseND} beats passing: the Law of Total Tricks covers the level, and it takes the opponents' bidding space away. In competition a jump raise is WEAK — strong raises go through a cuebid.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `Weak (under 6 HCP) with ${fitLenND}+ card ${openSuitNameND} support and shape — purely obstructive. Do not bid on without a huge hand.`,
        expectedResponses: [
          { partnerBid: "Pass", meaning: "The normal action — preempt stands" },
        ],
        confidence: "medium",
      };
    }
    return {
      bid: "Pass",
      category: "Pass (Too Weak for Negative Double)",
      reasoning:
        "With fewer than 6 HCP, pass. You need at least 6 pts for a negative double.",
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Too weak to act.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  // ── RHO overcalled in NOTRUMP: there is no negative double here ────────────
  // A double of a 1NT overcall is PENALTY — it announces that our side holds
  // the balance of power (opener's 12+ plus ~9-10+ here beats the 15-18 the
  // overcall claims).  Suit bids are natural and to play.
  if (overcall.endsWith("NT")) {
    if (hcp >= 10) {
      return {
        bid: "Double",
        category: "Penalty Double of the 1NT Overcall (10+ HCP)",
        reasoning: `RHO's ${overcall} overcall claims 15-18 HCP, but partner opened (12+) and you hold ${hcp} — the math does not work for them. Double is PENALTY (not negative): your side holds the balance of power.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner:
          "10+ HCP — the deal belongs to us. Pass unless very distributional.",
        expectedResponses: [
          { partnerBid: "Pass", meaning: "Accepting the penalty" },
        ],
        confidence: "high",
      };
    }
    const ntNatural = (["spades", "hearts", "diamonds", "clubs"] as const).find(
      (s) =>
        !openerBid.includes(suitSymbol(s)) &&
        (hand[s as keyof Hand] as number) >= 5,
    );
    if (ntNatural && hcp >= 6) {
      const ntNatBid = `2${suitSymbol(ntNatural)}`;
      return {
        bid: ntNatBid,
        category: "Natural Suit Bid Over the 1NT Overcall",
        reasoning: `RHO overcalled ${overcall}. A double here would be penalty (10+), which you do not have. With ${hcp} HCP and a 5+ card ${ntNatural} suit, bid ${ntNatBid} — natural and to play, competing for the partscore.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `5+ ${ntNatural}, about 6-9 pts. Not forcing.`,
        expectedResponses: [],
        confidence: "medium",
      };
    }
    return {
      bid: "Pass",
      category: "Pass Over the 1NT Overcall",
      reasoning: `RHO overcalled ${overcall}. A double here would be PENALTY (about 10+ HCP), and with ${hcp} HCP and no 5-card suit to bid naturally, pass. Partner gets another chance.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Under 10 pts, no long suit — nothing to say.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  // ── Cuebid overcall (e.g. Michaels): RHO bid OUR suit — a negative double
  // makes no sense (the "overcall" shows two other suits).  Defend naturally.
  const openerSuitChar = openerBid.slice(1);
  if (!overcall.endsWith("NT") && overcall.slice(1) === openerSuitChar) {
    return {
      bid: "Pass",
      category: "Pass Over Opponent's Cuebid (Michaels)",
      reasoning: `RHO's ${overcall} is a cuebid of partner's suit (usually Michaels, showing a two-suiter — not natural). A negative double does not apply here. Pass for now: you can bid naturally or penalize their landing spot on the next round with full information.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "No clear action over the conventional cuebid yet — awaiting their landing spot.",
      expectedResponses: [],
      confidence: "medium",
    };
  }

  // ── SAYC ceiling: negative doubles apply only THROUGH 2♠ ────────────────────
  // Over a higher overcall (3♣ and up) a double is penalty-oriented, so the
  // negative double is OFF.  Act naturally instead: bid a good suit or raise
  // with real values, otherwise pass.
  if (
    isRealBid(overcall) &&
    BID_ORDER.indexOf(overcall) > BID_ORDER.indexOf("2♠")
  ) {
    const floorIdxHigh = BID_ORDER.indexOf(overcall);
    // Natural bid: 5+ card unbid suit with opening-ish values for the level.
    const highCandidates = (
      ["spades", "hearts", "diamonds", "clubs"] as const
    ).filter(
      (s) =>
        !openerBid.includes(suitSymbol(s)) &&
        !overcall.includes(suitSymbol(s)) &&
        (hand[s as keyof Hand] as number) >= 5,
    );
    for (const s of highCandidates) {
      const natBid = BID_ORDER.find(
        (b, i) => i > floorIdxHigh && b.endsWith(suitSymbol(s)),
      );
      if (!natBid) continue;
      const natLevel = parseInt(natBid[0]);
      const gameLevel = s === "hearts" || s === "spades" ? 4 : 5;
      if (hcp >= 13 && natLevel <= gameLevel) {
        return {
          bid: natBid,
          category: `Natural ${natBid} (Negative Double Off Above 2♠)`,
          reasoning: `RHO's ${overcall} is above 2♠, so a negative double is OFF — a double here would be penalty. With ${hcp} HCP and a 5+ card ${s} suit, bid it naturally at the level the preempt forces.`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: `5+ ${s}, opening values (13+ pts). Natural and constructive at this level.`,
          expectedResponses: [],
          confidence: "medium",
        };
      }
    }
    // Raise partner with a real fit and near-invitational values.
    const fitSuitName = openerBid.includes("♠")
      ? "spades"
      : openerBid.includes("♥")
        ? "hearts"
        : openerBid.includes("♦")
          ? "diamonds"
          : "clubs";
    const fitLen = hand[fitSuitName as keyof Hand] as number;
    const tpFit = calcTPWithFit(hand);
    // Vulnerable, a high-level competitive raise needs real extras — going
    // for -200/-500 against a partscore is the classic vulnerable disaster.
    const weAreVul = vul === "we-only" || vul === "both";
    if (fitLen >= 4 && tpFit >= (weAreVul ? 13 : 11)) {
      const raiseBid = BID_ORDER.find(
        (b, i) => i > floorIdxHigh && b.endsWith(suitSymbol(fitSuitName)),
      );
      const raiseGame =
        fitSuitName === "hearts" || fitSuitName === "spades" ? 4 : 5;
      if (raiseBid && parseInt(raiseBid[0]) <= raiseGame) {
        return {
          bid: raiseBid,
          category: "Competitive Raise (Negative Double Off Above 2♠)",
          reasoning: `RHO's ${overcall} is above 2♠, so a negative double is OFF. With ${fitLen}-card support for partner's ${fitSuitName} and ${tpFit} support points, compete with a raise to ${raiseBid} rather than selling out to the preempt.${weAreVul ? " (You are vulnerable — this raise promises the extra values it shows.)" : " Not vulnerable, the raise also works as an advance sacrifice if the opponents can make their contract."}`,
          handAnalysis: analysis,
          whatYourBidTellsPartner: `${fitLen}-card ${fitSuitName} support with competitive values (11+ support pts).`,
          expectedResponses: [],
          confidence: "medium",
        };
      }
    }
    return {
      bid: "Pass",
      category: "Pass (Negative Double Off Above 2♠)",
      reasoning: `SAYC negative doubles apply only through 2♠ — over RHO's ${overcall}, a double would be PENALTY, not takeout. With ${hcp} HCP and no suit strong enough to bid at this level (a new suit here shows roughly 13+ points and 5+ cards), pass. Partner still has a chance to act.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner:
        "Nothing promised — could be weak, or trapping with values the preempt shut out.",
      expectedResponses: [],
      confidence: "high",
      note: "Negative doubles are OFF above 2♠ in SAYC. A double of a 3-level (or higher) overcall is for penalty.",
    };
  }

  // ── Prefer a NATURAL bid when one is available ──────────────────────────────
  // SAYC: the negative double is for hands that CANNOT bid their suit directly.
  // With a 5+ card unbid suit and enough strength for the required level, bid it.
  const overcallIdxND = BID_ORDER.indexOf(overcall);
  const naturalCandidates = (
    ["spades", "hearts", "diamonds", "clubs"] as const
  ).filter(
    (s) =>
      !openerBid.includes(suitSymbol(s)) &&
      !overcall.includes(suitSymbol(s)) &&
      (hand[s as keyof Hand] as number) >= 5,
  );
  // …but the negative double still comes FIRST when it shows a 4-card unbid
  // MAJOR this hand actually holds — the major fit outranks a minor suit, and
  // a 2-level new suit needs a full 10+ points anyway.
  const dblWouldShowMyMajor = (["hearts", "spades"] as const).some(
    (m) =>
      !openerBid.includes(suitSymbol(m)) &&
      !overcall.includes(suitSymbol(m)) &&
      (hand[m] as number) >= 4 &&
      (hand[m] as number) <= 4,
  );
  for (const s of naturalCandidates) {
    const natBid = BID_ORDER.find(
      (b, i) => i > overcallIdxND && b.endsWith(suitSymbol(s)),
    );
    if (!natBid) continue;
    const natLevel = parseInt(natBid[0]);
    const natIsMinor = s === "clubs" || s === "diamonds";
    if (natIsMinor && dblWouldShowMyMajor) continue;
    if ((natLevel === 1 && hcp >= 6) || (natLevel === 2 && hcp >= 10)) {
      return {
        bid: natBid,
        category: `Natural ${natBid} (Prefer Suit Bid over Negative Double)`,
        reasoning: `You hold a 5+ card ${s} suit and enough strength (${hcp} HCP) to bid it directly at the ${natLevel}-level. The negative double is reserved for hands that CANNOT bid their suit — show this one naturally.`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `5+ ${s}, ${natLevel === 2 ? "10+" : "6+"} pts. ${natLevel === 1 ? "One-round force." : "Constructive."}`,
        expectedResponses: [],
        confidence: "high",
      };
    }
  }

  const partnerSuitNameND = suitFromBid(openerBid);
  const partnerFitND = partnerSuitNameND
    ? (hand[partnerSuitNameND as keyof Hand] as number)
    : 0;

  const fourPlusRaise = partnerSuitNameND
    ? negativeDoubleFitRaise(
        hand,
        analysis,
        openerBid,
        overcall,
        partnerSuitNameND,
        partnerFitND,
        4,
        calcTPWithFit(hand),
      )
    : null;
  if (fourPlusRaise) return fourPlusRaise;

  // ── Shape check: a negative double PROMISES the unbid major(s) ─────────────
  const shapeOk =
    heartsUnbid && spadesUnbid
      ? hand.hearts >= 4 && hand.spades >= 4
      : heartsUnbid
        ? hand.hearts >= 4
        : spadesUnbid
          ? hand.spades >= 4
          : // no unbid major: double implies both unbid minors
            hand.diamonds >= 4 && hand.clubs >= 4;
  if (!shapeOk) {
    const threePlusRaise = partnerSuitNameND
      ? negativeDoubleFitRaise(
          hand,
          analysis,
          openerBid,
          overcall,
          partnerSuitNameND,
          partnerFitND,
          3,
          analysis.tp,
        )
      : null;
    if (threePlusRaise) return threePlusRaise;

    // Before passing: a 4+ card unbid major biddable at the 1-level is a natural,
    // forcing response — show it rather than passing with values.  (A negative
    // double would promise BOTH majors; with a single major you bid it.)
    const floorIdxND = Math.max(
      BID_ORDER.indexOf(openerBid),
      isRealBid(overcall) ? BID_ORDER.indexOf(overcall) : -1,
    );
    const oneLevelMajor: { name: string; bid: string } | null =
      spadesUnbid && hand.spades >= 4 && BID_ORDER.indexOf("1♠") > floorIdxND
        ? { name: "spades", bid: "1♠" }
        : heartsUnbid &&
            hand.hearts >= 4 &&
            BID_ORDER.indexOf("1♥") > floorIdxND
          ? { name: "hearts", bid: "1♥" }
          : null;
    if (oneLevelMajor && hcp >= 6) {
      return {
        bid: oneLevelMajor.bid,
        category: "New Suit at 1 Level After Overcall (4+ major)",
        reasoning: `After partner's ${openerBid} and the ${overcall} overcall, bid your 4+ card ${oneLevelMajor.name} suit at the 1-level. A new suit by responder is natural and forcing — show the major rather than passing or making a negative double (which would promise both majors).`,
        handAnalysis: analysis,
        whatYourBidTellsPartner: `4+ ${oneLevelMajor.name}, 6+ HCP. Forcing one round.`,
        expectedResponses: [
          {
            partnerBid: "Raise",
            meaning: `3+ card ${oneLevelMajor.name} support`,
          },
          { partnerBid: "Rebid", meaning: "Describes opener's hand" },
        ],
        confidence: "high",
      };
    }

    return {
      bid: "Pass",
      category: "Pass (Wrong Shape for Negative Double)",
      reasoning: `A negative double here promises ${heartsUnbid && spadesUnbid ? "4+ cards in BOTH majors" : heartsUnbid ? "4+ hearts" : spadesUnbid ? "4+ spades" : "both unbid minors"}, which this hand does not hold. With no suit to bid directly either, pass — partner gets another chance.`,
      handAnalysis: analysis,
      whatYourBidTellsPartner: "Nothing promised — could be weak or trapping.",
      expectedResponses: [],
      confidence: "high",
    };
  }

  let shownSuits = "";
  if (heartsUnbid && spadesUnbid) {
    shownSuits = "4+ hearts AND 4+ spades (both majors at 1-level)";
  } else if (heartsUnbid) {
    shownSuits = "4+ hearts";
    if (overcallLevel >= 2)
      shownSuits += " (or a hand too weak to bid hearts directly)";
  } else if (spadesUnbid) {
    shownSuits = "4+ spades";
  } else {
    shownSuits = "4+ cards in at least one unbid suit";
  }

  return {
    bid: "Double",
    category: "Negative Double (Sputnik)",
    reasoning: `After partner opens and RHO overcalls, double through 2♠ is a NEGATIVE (not penalty) double. With ${hcp} HCP and the right shape, this shows ${shownSuits} and asks partner to bid your suit.`,
    handAnalysis: analysis,
    whatYourBidTellsPartner: `${shownSuits} with 6+ pts. You cannot bid the suit directly (wrong level or hand too weak).`,
    expectedResponses: [
      {
        partnerBid: "Bid shown suit at cheapest level",
        meaning: "Minimum opener (11-14 TP)",
      },
      { partnerBid: "Jump in shown suit", meaning: "15-17 TP — strong" },
      { partnerBid: "Game in shown suit", meaning: "18-19 TP — game-forcing" },
      {
        partnerBid: "NT bid",
        meaning: "Has a stopper in overcalled suit, no 4-card fit",
      },
    ],
    confidence: "high",
    note: "Negative doubles are OFF if the opponents bid above 2♠. In that case, a double would be for penalty.",
  };
}
