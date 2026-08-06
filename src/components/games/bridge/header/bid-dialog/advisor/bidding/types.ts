// SAYC (Standard American Yellow Card) Bidding Advisor
// System: 5-card majors, 15-17 1NT, based on No Fear Bridge cheat sheet
// Additional conventions validated against ACBL SAYC and BridgeBum

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Hand {
  hcp: number;
  spades: number;
  hearts: number;
  diamonds: number;
  clubs: number;
  /** Optional: actual ace count (0-4). Shown in HandInput only during Blackwood auctions. */
  aces?: number;
  /** Optional: actual king count (0-4). Shown in HandInput only during Blackwood kings-ask. */
  kings?: number;
  /**
   * Optional: does the player hold a stopper in the opponent's suit?
   * A stopper is A, Kx, Qxx, or Jxxx in the opponent's suit.
   * Shown in HandInput when there is an opponent suit in play.
   * When undefined, the engine cannot recommend NT bids that require a stopper.
   */
  hasStopperInOpponentSuit?: boolean;
  /**
   * Optional: is the player's LONGEST suit a "good" suit for a preemptive
   * opening — i.e. at least 2 of the top 3 honors (AK, AQ, KQ) or 3 of the top
   * 5 (e.g. QJT)?  SAYC weak-2 and 3-level preempt openings require a good
   * suit; length and HCP alone do not tell us whether the suit is biddable.
   * Shown in HandInput only when the answer would change the recommendation.
   * When undefined the engine assumes the suit is good (legacy behavior), so a
   * caller that never sets it sees the same advice as before.
   */
  goodSuitQuality?: boolean;
}

export type Vulnerability = "none" | "we-only" | "they-only" | "both";

type Situation =
  // Opening
  | "opening"
  // Responding to partner's opening (no interference)
  | "responding-1nt"
  | "responding-2nt"
  | "responding-3nt-opening"
  | "responding-suit"
  | "responding-2c"
  | "responding-weak2"
  | "responding-preempt"
  // Competing
  | "overcalling"
  | "negative-double"
  // Responding to partner's competition
  | "responding-to-simple-oc"
  | "responding-to-jump-oc"
  | "responding-to-double"
  | "responding-to-preempt-oc"
  | "responding-to-1nt-oc"
  | "responding-to-michaels"
  | "responding-to-unusual-2nt"
  // Advancing partner's Cappelletti call over the opponents' 1NT opening
  | "advancing-cappelletti"
  // Opener's rebids
  | "rebid-after-nt"
  | "rebid-after-suit"
  | "rebid-after-negative-double"
  | "jacoby-2nt-opener"
  | "protective-rebid"
  // My own bid was passed out — the auction is over in my contract
  | "auction-passed-out"
  // Responding to partner's opening after opponent interference
  | "responding-suit-after-double"
  | "responding-1nt-doubled"
  | "after-own-double"
  // Advancer's second turn (our side did not open; partner overcalled)
  | "advancer-rebid"
  // Overcaller's second turn (I overcalled; partner advanced)
  | "overcaller-rebid"
  // Responder's second bid after a suit response (partner opened and rebid)
  | "responder-rebid"
  // Convention follow-ups
  | "stayman-response"
  | "transfer-response"
  | "minor-transfer-response"
  | "blackwood-response"
  | "gerber-response"
  | "blackwood-kings"
  | "grand-slam-force"
  | "grand-slam-force-response"
  | "stayman-opener-rebid"
  | "blackwood-ace-response"
  | "blackwood-kings-response"
  | "responder-nt-rebid"
  | "respond-to-partner-invitation";

export interface AuctionContext {
  situation: Situation;
  vulnerability?: Vulnerability;
  partnerBid?: string;
  rhoBid?: string;
  lhoBid?: string;
  /**
   * My most recent real (non-pass, non-double) bid in the auction.  Used by
   * the floor-collision safety net to detect "my last bid is at level X" and
   * prevent recommending a lower bid.
   */
  myPreviousBid?: string;
  /**
   * My ORIGINAL opening bid — the first real bid I made in the auction.  Used
   * by rebid handlers that need to know what suit I opened with (e.g. the
   * weak-2 2NT inquiry must check the original 2♥ opening, NOT a 2♥ rebid by
   * a 1♥ opener).  Falls back to myPreviousBid when not set.
   */
  myFirstBid?: string;
  agreedSuit?: string;
  /** True when the opener's second bid was completing a Jacoby Transfer (not Stayman). */
  wasTransferCompletion?: boolean;
  /**
   * For `stayman-response`: partner's follow-up bid after responder's rebid.
   * e.g. in 1NT–2♣–2♦–2♠–2NT, `partnerBid` = "2♦" (Stayman reply) and
   * `partnerContinuation` = "2NT" (partner's second bid declining the invitation).
   */
  partnerContinuation?: string;
  /**
   * True when the current player is in the balancing (protective) seat — i.e. they
   * already passed once earlier in the auction and are now getting a second chance
   * after an opponent has opened.  Standards for overcalling are slightly relaxed
   * in this seat (you are "protecting" partner who may have been trapped with values).
   */
  balancing?: boolean;
  /**
   * Partner's FIRST real bid in the auction (e.g. their original overcall).
   * Used by `advancer-rebid` to give preference between partner's two suits.
   */
  partnerFirstBid?: string;
  /**
   * Partner's earlier Blackwood ACE response (5♣/5♦/5♥/5♠), threaded into the
   * kings follow-up so a grand slam is never bid with aces missing.
   */
  partnerAceResponse?: string;
  /**
   * The most recent CALL in the auction (including Pass/Double/Redouble).
   * Used by the safety net to ensure Double/Redouble recommendations are
   * legal (you cannot double a double, or redouble out of turn).
   */
  lastCall?: string;
  /**
   * True when Stayman/transfers are OFF for partner's response because an
   * opponent made a real bid BEFORE that response.
   */
  systemsOff?: boolean;
  /**
   * True when MY PARTNER opened the auction — used in `after-own-double` (my
   * earlier double was a negative double, not takeout) and in
   * `respond-to-partner-invitation` (partner's jump rebid is the opener
   * invite ladder). Drives wording of the follow-up advice.
   */
  partnerOpened?: boolean;
  /**
   * The FIRST real bid of the whole auction (any seat).  Lets handlers tell a
   * conventional bid from a natural one — e.g. "1NT then 2♣" is Stayman only
   * when the 1NT was the OPENING, not when it was a response.
   */
  auctionOpeningBid?: string;
  /**
   * For `rebid-after-suit`: true when I have already opened AND rebid, and
   * partner's latest real bid is the one I already answered — my hand is
   * fully described and only opponents' interference returns the turn to me.
   */
  partnerHasNothingNew?: boolean;
  /**
   * For `rebid-after-suit`: true when partner's latest bid CUE-BIDS a suit an
   * opponent had shown BEFORE partner's call — the game-forcing raise in
   * competition, never a natural bid in the enemy suit.
   */
  partnerCuedTheirSuit?: boolean;
  /**
   * For `responding-to-1nt-oc`: the opponents' highest real bid made AFTER
   * partner's 1NT overcall — Stayman/transfers are off over it.
   */
  interferenceOverPartnerNT?: string;
  /**
   * For `advancing-cappelletti`: the opponents' highest real bid made AFTER
   * partner's Cappelletti call, if any — must be cleared by any advance.
   */
  interferenceOverCappelletti?: string;
  /**
   * For `after-own-double`: true when MY earlier double was a LEAD-DIRECTING
   * double of the opponents' Stayman 2♣ (shows clubs and asks for a club
   * lead) — not takeout and not negative.
   */
  doubleWasLeadDirecting?: boolean;
  /**
   * For `rebid-after-negative-double`: the bid partner actually DOUBLED (the
   * real bid immediately before their Double).  Decides negative-vs-penalty
   * (through 2♠) even when the opponents have raised since.
   */
  doubledBid?: string;
  /**
   * For `auction-passed-out`: an opponent DOUBLED my standing bid, so the
   * auction is NOT actually over — I may pass (play doubled), redouble, or
   * run.  The handler must not claim "auction complete".
   */
  myBidWasDoubled?: boolean;
  /**
   * For `responding-2nt`: partner's 2NT was the REBID after a strong 2♣
   * opening (22-24, not 20-21) — the response ladder shifts down ~2 points.
   */
  after2COpening?: boolean;
  /**
   * For `responder-rebid`: the auction's highest bid at the moment BEFORE
   * partner's latest rebid — jump detection must measure against this, not
   * against the opponents' CURRENT bids (which may have come later).
   */
  partnerRebidFloor?: string;
  /**
   * For `respond-to-partner-invitation`: partner was an OVERCALLER, not the
   * opener — their re-raise invite shows 14-15 support points and the
   * accept/decline thresholds shift to the 6-10 raise ladder.
   */
  partnerWasOvercaller?: boolean;
  /**
   * For `rebid-after-suit`: partner made a (negative) DOUBLE earlier in the
   * auction — their later raise of my suit is INVITATIONAL (11-13), never a
   * weak preemptive jump.
   */
  partnerDoubledEarlier?: boolean;
  /**
   * For `protective-rebid`: my first bid was an OVERCALL, not the auction's
   * opening — stories must say "overcall", not "opening bid".
   */
  iOvercalled?: boolean;
  /**
   * For `rebid-after-suit`: an opponent's DOUBLE sat DIRECTLY over my
   * opening bid (immediately before partner's response — i.e. my
   * opening-Double-Pass-partner's response, or my opening-Double-response
   * with no intervening pass). Only then is partner's 2NT response JORDAN (a
   * limit raise), rather than a natural invite — a double made anywhere
   * else in the auction (e.g. over partner's own later bid, or a reopening
   * double after 2NT was already bid) must NOT trigger the Jordan reading.
   */
  oppDoubledMyOpeningDirectly?: boolean;
}

interface ExpectedResponse {
  partnerBid: string;
  meaning: string;
  yourRebid?: string;
}

export interface HandAnalysis {
  tp: number;
  hcp: number;
  isBalanced: boolean;
  longestSuitName: string;
  longestSuitLength: number;
  hasFiveCardMajor: boolean;
  hasVoid: boolean;
  description: string;
}

export interface BidRecommendation {
  bid: string;
  category: string;
  reasoning: string;
  handAnalysis: HandAnalysis;
  whatYourBidTellsPartner: string;
  expectedResponses: ExpectedResponse[];
  confidence: "high" | "medium" | "low";
  note?: string;
  alternativeBid?: string;
}

// ─── Auction State types ──────────────────────────────────────────────────────

/** Bidding order position: 1 = dealer/first to bid, 4 = last to bid in a round */
export type BiddingPosition = 1 | 2 | 3 | 4;
export type BidRound = Partial<Record<BiddingPosition, string>>;

/** External-facing auction model: what the UI sends instead of a hand-coded Situation */
export interface AuctionState {
  /** Position in the bidding order: 1 (dealer) through 4 */
  myPosition: BiddingPosition;
  /** Fully completed rounds (all 4 players bid, including my previous bids) */
  completedRounds: BidRound[];
  /** Current round — only the other players' bids before my turn */
  currentRound: BidRound;
  /** Optional override for Blackwood / GSF agreed suit when auto-derivation is ambiguous */
  agreedSuit?: string;
}
