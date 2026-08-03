/**
 * Can you  audit the Bridge bidding application in react-home to ensure that all of the bidding is SAYC compliant? I tried to create a Bridge bidding skill you can use for better accuracy. I want to be sure the recommended bid is accurate, I want to be sure the reasoning for that bid is accurate, and I want to be sure the information on why someone else may have bid something is accurate.
You'll have to:

1. simulate a deck of cards and deal out 4 hands
2. Use the bridge bidding tool from the perspective of player 1 to get their recommended bid
3. Clear out the information and fill it in for player 2 (and put in whatever the recommended bid for player 1 was as their bid in the Auction Context) to get their recommended bid.
4. Keep doing the same for players 3 and 4.
5. Then, go back to player 1, and enter in all the previous bids in the Auction Context and advance to the next round.
6. Continue the simulation until the bidding is complete for all rounds and the auction has concluded (ensuring all along the way that the recommended bid is correct per SAYC)
7. Continue running simulations until you get 3 correct final bids in a row with no errors along the way (all recommended bids being compliant). sim-audit.test.ts was created to help with this a bit on your last run.

Notes:
* Essentially, you are using the tool from the perspective of each of the 4 players.
* Each player would only know their own cards, but Claude will have knowledge of all 4 hands, please pretend you don't know the other hands (as if you were playing bridge).
* Along the way, make sure that all information makes sense:
  * Your Hand Analysis
  * Why This Bid
  * What It Tells Partner
  * And the i icon on why someone else bid what they did. This doesn't have to be perfect, again we don't know EXACTLY what they other person's hand is, but the info here should be accurate to what can be interpreted from their bid.
* Feel free to make any code changes, update the information, fix any bugs, fix any bad information, and make sure users have the best experience. Ask any questions if you need anything from me.
*/

/**
 * TEMPORARY simulation harness for the SAYC audit — deals seeded hands and
 * auto-plays full auctions through the SAME entry points the Bid Advisor UI
 * uses (deriveSituation → getRecommendation, getBidMeaning for tooltips).
 * Writes a human-readable transcript per seed for manual refereeing.
 * Delete this file when the audit is done.
 */
import { writeFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  deriveSituation,
  getBidMeaning,
  getFinalContractInfo,
  getRecommendation,
  getRelatives,
  type AuctionState,
  type BidRound,
  type BiddingPosition,
  type Hand,
  type Vulnerability,
} from "./bidding-logic";

// ─── Deck / deal (mirrors the seeded deal script used for the UI audit) ──────
type Card = { s: "S" | "H" | "D" | "C"; r: string };
const SUITS = ["S", "H", "D", "C"] as const;
const RANKS = "AKQJT98765432".split("");
const HCP_MAP: Record<string, number> = { A: 4, K: 3, Q: 2, J: 1 };

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface DealtHand {
  cards: Record<"S" | "H" | "D" | "C", string[]>;
  hcp: number;
  aces: number;
  kings: number;
}

function dealHands(seed: number): DealtHand[] {
  const rand = mulberry32(seed);
  const deck: Card[] = [];
  for (const s of SUITS) for (const r of RANKS) deck.push({ s, r });
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  const players: Card[][] = [[], [], [], []];
  deck.forEach((card, i) => players[i % 4].push(card));
  return players.map((cs) => {
    const bySuit: DealtHand["cards"] = { S: [], H: [], D: [], C: [] };
    for (const c of cs) bySuit[c.s].push(c.r);
    for (const s of SUITS)
      bySuit[s].sort((a, b) => RANKS.indexOf(a) - RANKS.indexOf(b));
    return {
      cards: bySuit,
      hcp: cs.reduce((sum, c) => sum + (HCP_MAP[c.r] ?? 0), 0),
      aces: cs.filter((c) => c.r === "A").length,
      kings: cs.filter((c) => c.r === "K").length,
    };
  });
}

function hasStopper(cards: string[]): boolean {
  if (cards.includes("A")) return true;
  if (cards.includes("K") && cards.length >= 2) return true;
  if (cards.includes("Q") && cards.length >= 3) return true;
  if (cards.includes("J") && cards.length >= 4) return true;
  return false;
}

function goodSuit(cards: string[]): boolean {
  const top3 = ["A", "K", "Q"].filter((r) => cards.includes(r)).length;
  const top5 = ["A", "K", "Q", "J", "T"].filter((r) =>
    cards.includes(r),
  ).length;
  return top3 >= 2 || top5 >= 3;
}

const SYM_TO_SUIT: Record<string, "S" | "H" | "D" | "C"> = {
  "♠": "S",
  "♥": "H",
  "♦": "D",
  "♣": "C",
};

function handStr(h: DealtHand): string {
  return (["S", "H", "D", "C"] as const)
    .map((s) => `${s}:${h.cards[s].join("") || "—"}`)
    .join(" ");
}

// ─── Auction runner ──────────────────────────────────────────────────────────
const BID_ORDER_SIM = [
  "1♣",
  "1♦",
  "1♥",
  "1♠",
  "1NT",
  "2♣",
  "2♦",
  "2♥",
  "2♠",
  "2NT",
  "3♣",
  "3♦",
  "3♥",
  "3♠",
  "3NT",
  "4♣",
  "4♦",
  "4♥",
  "4♠",
  "4NT",
  "5♣",
  "5♦",
  "5♥",
  "5♠",
  "5NT",
  "6♣",
  "6♦",
  "6♥",
  "6♠",
  "6NT",
  "7♣",
  "7♦",
  "7♥",
  "7♠",
  "7NT",
];
const isReal = (b: string | undefined): b is string =>
  !!b && b !== "Pass" && b !== "Double" && b !== "Redouble";

function runDeal(seed: number, nsVul: boolean, ewVul: boolean): string {
  const hands = dealHands(seed);
  const lines: string[] = [];
  const problems: string[] = [];
  lines.push(
    `=== SEED ${seed}  (NS ${nsVul ? "VUL" : "nv"} / EW ${ewVul ? "VUL" : "nv"}) ===`,
  );
  hands.forEach((h, i) =>
    lines.push(
      `P${i + 1}: ${handStr(h)}  | ${h.hcp} HCP, ${h.aces}A ${h.kings}K`,
    ),
  );
  lines.push("");

  const completedRounds: BidRound[] = [];
  let currentRound: BidRound = {};
  const flatCalls: string[] = [];
  let done = false;

  for (let round = 0; round < 8 && !done; round++) {
    for (let p = 1 as BiddingPosition; p <= 4; p = (p + 1) as BiddingPosition) {
      const seat = p as BiddingPosition;
      const dealt = hands[seat - 1];
      // Per-seat vulnerability (NS = seats 1/3)
      const weV = seat === 1 || seat === 3 ? nsVul : ewVul;
      const theyV = seat === 1 || seat === 3 ? ewVul : nsVul;
      const vul: Vulnerability =
        weV && theyV ? "both" : weV ? "we-only" : theyV ? "they-only" : "none";

      const state: AuctionState = {
        myPosition: seat,
        completedRounds,
        currentRound: { ...currentRound },
      };
      const ctx = deriveSituation(state, vul);

      // Stopper input — same detection the UI uses (rho first, then lho;
      // ignore a conventional 2♣ over NT).
      const lhoIsNT = ctx.lhoBid?.endsWith("NT") ?? false;
      const rhoIsNT = ctx.rhoBid?.endsWith("NT") ?? false;
      const isConv2C = (b: string) => b === "2♣" && (lhoIsNT || rhoIsNT);
      const oppSuitBid =
        (ctx.rhoBid?.match(/[♠♥♦♣]/) && !isConv2C(ctx.rhoBid)
          ? ctx.rhoBid
          : null) ??
        (ctx.lhoBid?.match(/[♠♥♦♣]/) && !isConv2C(ctx.lhoBid)
          ? ctx.lhoBid
          : null);
      const oppSuitSym = oppSuitBid?.match(/[♠♥♦♣]/)?.[0];
      const stopper = oppSuitSym
        ? hasStopper(dealt.cards[SYM_TO_SUIT[oppSuitSym]])
        : undefined;

      const longest = (["S", "H", "D", "C"] as const).reduce((a, b) =>
        dealt.cards[b].length > dealt.cards[a].length ? b : a,
      );
      const hand: Hand = {
        hcp: dealt.hcp,
        spades: dealt.cards.S.length,
        hearts: dealt.cards.H.length,
        diamonds: dealt.cards.D.length,
        clubs: dealt.cards.C.length,
        aces: dealt.aces,
        kings: dealt.kings,
        hasStopperInOpponentSuit: stopper,
        goodSuitQuality: goodSuit(dealt.cards[longest]),
      };

      const rec = getRecommendation(hand, ctx);
      const call = rec.bid;

      // Legality check
      const lastReal = [...flatCalls].reverse().find(isReal);
      if (isReal(call) && lastReal) {
        if (BID_ORDER_SIM.indexOf(call) <= BID_ORDER_SIM.indexOf(lastReal)) {
          problems.push(
            `P${seat} recommended ILLEGAL ${call} (floor ${lastReal})`,
          );
        }
      }
      if (call === "Double") {
        const lastNonPass = [...flatCalls].reverse().find((b) => b !== "Pass");
        if (
          !lastNonPass ||
          lastNonPass === "Double" ||
          lastNonPass === "Redouble"
        ) {
          problems.push(`P${seat} recommended ILLEGAL Double`);
        }
      }
      if (
        rec.category.includes("Auction Past Recommended Bid") ||
        rec.category.includes("Intended Bid No Longer Available")
      ) {
        problems.push(
          `P${seat}: safety-net fallback fired (handler produced an unavailable bid)`,
        );
      }

      lines.push(
        `[R${round + 1}] P${seat} (${ctx.situation}${stopper !== undefined ? `, stopper:${stopper}` : ""}) → ${call}  «${rec.category}»  (${rec.confidence})`,
      );
      lines.push(`      why: ${rec.reasoning}`);
      lines.push(`      tells: ${rec.whatYourBidTellsPartner}`);
      if (rec.note) lines.push(`      note: ${rec.note}`);

      currentRound[seat] = call;
      flatCalls.push(call);

      // Termination: 3 passes after any real call, or 4 opening passes
      const trailing = (() => {
        let n = 0;
        for (let i = flatCalls.length - 1; i >= 0; i--) {
          if (flatCalls[i] === "Pass") n++;
          else break;
        }
        return n;
      })();
      const anyAction = flatCalls.some((b) => b !== "Pass");
      if (
        (anyAction && trailing >= 3 && flatCalls.length > 3) ||
        trailing >= 4
      ) {
        done = true;
        break;
      }
    }
    completedRounds.push(currentRound);
    currentRound = {};
  }

  if (!done) problems.push("AUCTION DID NOT TERMINATE within 8 rounds");

  const { isComplete, finalContract, doubling } = getFinalContractInfo(
    completedRounds,
    currentRound,
    1,
  );
  lines.push("");
  lines.push(
    `AUCTION: ${flatCalls.join(" – ")}   FINAL: ${isComplete ? `${finalContract ?? "passed out"}${doubling ? ` (${doubling})` : ""}` : "(incomplete)"}`,
  );

  // ── Tooltip review: each real call as partner + as opponent ────────────────
  lines.push("");
  lines.push("── Tooltips (getBidMeaning) ──");
  const allRounds = [...completedRounds, currentRound];
  const opening = flatCalls.find(isReal);
  const flat: { seat: BiddingPosition; call: string }[] = [];
  {
    let i = 0;
    outer: for (const r of allRounds) {
      for (
        let s = 1 as BiddingPosition;
        s <= 4;
        s = (s + 1) as BiddingPosition
      ) {
        if (r[s] === undefined) continue;
        flat.push({ seat: s, call: r[s]! });
        if (++i >= flatCalls.length) break outer;
      }
    }
  }
  flat.forEach((entry, idx) => {
    if (entry.call === "Pass") return;
    const before = flat.slice(0, idx);
    const prevHigh = [...before]
      .map((e) => e.call)
      .reverse()
      .find(isReal);
    const bidderPrev = [...before]
      .filter((e) => e.seat === entry.seat)
      .map((e) => e.call)
      .reverse()
      .find((b) => b !== "Pass");
    const pSeat = getRelatives(entry.seat).partner;
    const partnerPrev =
      [...before]
        .filter((e) => e.seat === pSeat)
        .map((e) => e.call)
        .reverse()
        .find((b) => b !== "Pass") ?? "none";
    const partnerFirst = before
      .filter((e) => e.seat === pSeat)
      .map((e) => e.call)
      .find(isReal);
    const lastNonPass = [...before].reverse().find((e) => e.call !== "Pass");
    const oppDoubledJustBefore =
      !!lastNonPass &&
      lastNonPass.call === "Double" &&
      lastNonPass.seat !== pSeat &&
      lastNonPass.seat !== entry.seat;
    const asPartner = getBidMeaning(
      entry.call,
      "partner",
      prevHigh,
      bidderPrev,
      partnerPrev,
      opening,
      partnerFirst,
      oppDoubledJustBefore,
    );
    const asOpp = getBidMeaning(
      entry.call,
      "rho",
      prevHigh,
      bidderPrev,
      partnerPrev,
      opening,
      partnerFirst,
      oppDoubledJustBefore,
    );
    lines.push(`#${idx + 1} P${entry.seat} ${entry.call}`);
    lines.push(`   partner-view: ${asPartner}`);
    lines.push(`   opp-view:     ${asOpp}`);
  });

  lines.push("");
  if (problems.length) {
    lines.push("!!! AUTO-FLAGGED PROBLEMS:");
    for (const p of problems) lines.push(`  - ${p}`);
  } else {
    lines.push("(no auto-flagged problems)");
  }
  lines.push("");
  return lines.join("\n");
}

// ─── Runner ──────────────────────────────────────────────────────────────────
const SEEDS = (process.env.SIM_SEEDS ?? "43,44,45")
  .split(",")
  .map((s) => parseInt(s.trim(), 10));
const OUT = process.env.SIM_OUT;

describe("SAYC simulation audit (temporary harness)", () => {
  it("plays full auctions for each seed and writes transcripts", () => {
    const vulCycle: [boolean, boolean][] = [
      [false, false],
      [true, false],
      [false, true],
      [true, true],
    ];
    const out = SEEDS.map((seed, i) => runDeal(seed, ...vulCycle[i % 4])).join(
      "\n\n",
    );
    if (OUT) {
      writeFileSync(OUT, out);
    }
    expect(out.length).toBeGreaterThan(0);
  });
});
