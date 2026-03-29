/**
 * Random Hand Simulation Script
 *
 * Deals 4 random Bridge hands, then drives each player through the full auction
 * using the bidding engine, verifying that every recommendation is a valid bid
 * (strictly higher than the last concrete bid in the auction).
 *
 * Usage:  npx tsx scripts/simulate-random-hands.mts
 */

import {
  type Hand,
  type AuctionState,
  type BiddingPosition,
  type BidRound,
  getRecommendation,
  deriveSituation,
  getRelatives,
} from "../src/components/games/bridge/header/bid-dialog/advisor/bidding-logic.js";

// ─── Configuration ────────────────────────────────────────────────────────────

const SIM_DEALS = 50;
const MAX_ROUNDS = 15; // Safety cap to prevent infinite loops

// ─── Deck helpers ─────────────────────────────────────────────────────────────

type Card = { suit: "spades" | "hearts" | "diamonds" | "clubs"; rank: number };

const RANKS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]; // 2-14 (J=11,Q=12,K=13,A=14)

function buildDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of ["spades", "hearts", "diamonds", "clubs"] as const) {
    for (const rank of RANKS) {
      deck.push({ suit, rank });
    }
  }
  return deck;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function hcpForCard(rank: number): number {
  if (rank === 14) return 4; // Ace
  if (rank === 13) return 3; // King
  if (rank === 12) return 2; // Queen
  if (rank === 11) return 1; // Jack
  return 0;
}

function dealHands(): Hand[] {
  const deck = shuffle(buildDeck());
  const hands: Hand[] = [1, 2, 3, 4].map(() => ({
    hcp: 0,
    spades: 0,
    hearts: 0,
    diamonds: 0,
    clubs: 0,
    aces: 0,
    kings: 0,
  }));
  for (let i = 0; i < 52; i++) {
    const card = deck[i];
    const hand = hands[i % 4];
    hand[card.suit]++;
    hand.hcp += hcpForCard(card.rank);
    if (card.rank === 14) hand.aces = (hand.aces ?? 0) + 1;
    if (card.rank === 13) hand.kings = (hand.kings ?? 0) + 1;
  }
  return hands;
}

// ─── Bid validation helpers ───────────────────────────────────────────────────

const BID_ORDER = [
  "1♣","1♦","1♥","1♠","1NT",
  "2♣","2♦","2♥","2♠","2NT",
  "3♣","3♦","3♥","3♠","3NT",
  "4♣","4♦","4♥","4♠","4NT",
  "5♣","5♦","5♥","5♠","5NT",
  "6♣","6♦","6♥","6♠","6NT",
  "7♣","7♦","7♥","7♠","7NT",
];

/** Extract the core bid (e.g. "2♠") from an annotated string like "2♠ (jump)" */
function extractCoreBid(b: string): string {
  const m = b.match(/\d[♣♦♥♠]|\dNT/);
  return m ? m[0] : b;
}

/** Return the last non-Pass/Double/Redouble concrete bid from the full auction */
function getLastRealBid(completedRounds: BidRound[], currentRound: BidRound): string | undefined {
  // Flatten: completed rounds in order, then current round
  const allBids: string[] = [];
  for (const round of completedRounds) {
    for (const pos of [1, 2, 3, 4] as BiddingPosition[]) {
      if (round[pos]) allBids.push(round[pos]!);
    }
  }
  for (const pos of [1, 2, 3, 4] as BiddingPosition[]) {
    if (currentRound[pos]) allBids.push(currentRound[pos]!);
  }
  // Find last concrete bid (not Pass/Double/Redouble)
  for (let i = allBids.length - 1; i >= 0; i--) {
    const b = allBids[i];
    if (b && b !== "Pass" && b !== "Double" && b !== "Redouble") {
      return extractCoreBid(b);
    }
  }
  return undefined;
}

/** Return true if bid `a` is strictly higher than bid `b` in the Bridge auction order */
function isBidHigher(a: string, b: string): boolean {
  const coreA = extractCoreBid(a);
  const coreB = extractCoreBid(b);
  return BID_ORDER.indexOf(coreA) > BID_ORDER.indexOf(coreB);
}

// ─── Simulation ───────────────────────────────────────────────────────────────

let totalErrors = 0;

for (let deal = 1; deal <= SIM_DEALS; deal++) {
  const hands = dealHands();
  const completedRounds: BidRound[] = [];
  let errorInDeal = false;

  // Simulate full auction until 3 consecutive passes
  for (let roundNum = 1; roundNum <= MAX_ROUNDS; roundNum++) {
    const currentRound: BidRound = {};
    let passCount = 0;

    // Count passes already at end of all completed rounds
    const allBidsSoFar: string[] = [];
    for (const r of completedRounds) {
      for (const pos of [1, 2, 3, 4] as BiddingPosition[]) {
        if (r[pos]) allBidsSoFar.push(r[pos]!);
      }
    }
    // Check if already 3 consecutive passes exist (from end of last round)
    const trailingPasses = allBidsSoFar
      .slice(-3)
      .filter((b) => b === "Pass").length;
    if (trailingPasses >= 3 && roundNum > 1) break;

    for (const pos of [1, 2, 3, 4] as BiddingPosition[]) {
      const myPosition = pos as BiddingPosition;
      const state: AuctionState = {
        myPosition,
        completedRounds,
        currentRound,
      };
      const hand = hands[pos - 1];
      const ctx = deriveSituation(state);
      const rec = getRecommendation(hand, ctx);
      const bid = extractCoreBid(rec.bid);

      // Flag non-concrete bids (stubs like "Continue auction", "Interpret response", etc.)
      const isStubBid =
        bid !== "Pass" &&
        bid !== "Double" &&
        bid !== "Redouble" &&
        !BID_ORDER.includes(bid);
      if (isStubBid) {
        console.error(
          `  STUB BID P${pos} R${roundNum}: "${rec.bid}" — ${rec.category} [situation: ${ctx.situation}]`,
        );
        totalErrors++;
        errorInDeal = true;
      }

      // Validate concrete bids must be higher than the last real bid
      if (!isStubBid && bid !== "Pass" && bid !== "Double" && bid !== "Redouble" && BID_ORDER.includes(bid)) {
        const lastReal = getLastRealBid(completedRounds, currentRound);
        if (lastReal && !isBidHigher(bid, lastReal)) {
          console.error(
            `  INVALID BID P${pos} R${roundNum}: "${rec.bid}" is not higher than last bid "${lastReal}" — ${rec.category}`,
          );
          if (!errorInDeal) {
            console.error(`  Hand P${pos}: HCP=${hand.hcp} ♠${hand.spades} ♥${hand.hearts} ♦${hand.diamonds} ♣${hand.clubs}`);
            console.error(`  Context situation: ${ctx.situation}`);
            console.error(`  Context: partnerBid=${ctx.partnerBid} rhoBid=${ctx.rhoBid} lhoBid=${ctx.lhoBid} myPreviousBid=${ctx.myPreviousBid}`);
          }
          totalErrors++;
          errorInDeal = true;
        }
      }

      // Stub bids ("Continue auction", etc.) are treated as Pass
      const recorded =
        bid === "Pass" ||
        bid === "Double" ||
        bid === "Redouble" ||
        BID_ORDER.includes(bid)
          ? rec.bid
          : "Pass";

      currentRound[pos] = recorded === rec.bid ? bid : "Pass";

      // Count consecutive passes
      if (currentRound[pos] === "Pass") passCount++;
      else passCount = 0;
    }

    completedRounds.push({ ...currentRound });

    // Stop if last 3 bids in this round were all passes
    const roundBids = [1, 2, 3, 4].map((p) => currentRound[p as BiddingPosition] ?? "Pass");
    const endPasses = roundBids.slice(-3).filter((b) => b === "Pass").length;
    if (endPasses >= 3 && roundNum > 1) break;
  }

  if (!errorInDeal) {
    // Optionally print a short success line
    // console.log(`Deal ${deal}: OK (${completedRounds.length} rounds)`);
  }
}

console.log(`\nSummary: ${totalErrors} total errors across ${SIM_DEALS} deals`);
process.exit(totalErrors > 0 ? 1 : 0);
