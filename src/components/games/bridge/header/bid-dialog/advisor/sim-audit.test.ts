/**
 * SAYC simulation regression — deals seeded hands and auto-plays full auctions
 * through deriveSituation → getRecommendation (same entry points as the Bid
 * Advisor UI). Optional SIM_OUT writes human-readable transcripts.
 */
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

// ─── Deck / deal ─────────────────────────────────────────────────────────────
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

type AuctionCall = { seat: BiddingPosition; call: string };

const samePartnership = (a: BiddingPosition, b: BiddingPosition): boolean =>
  a % 2 === b % 2;

/** True when a Double recommendation would be illegal for `seat`. */
function isIllegalDoubleRecommendation(
  seat: BiddingPosition,
  auction: AuctionCall[],
): boolean {
  const lastNonPass = [...auction].reverse().find((e) => e.call !== "Pass");
  return (
    !lastNonPass ||
    lastNonPass.call === "Double" ||
    lastNonPass.call === "Redouble" ||
    samePartnership(seat, lastNonPass.seat)
  );
}

interface DealResult {
  transcript: string;
  problems: string[];
}

function runDeal(seed: number, nsVul: boolean, ewVul: boolean): DealResult {
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
  const flatCalls: AuctionCall[] = [];
  let done = false;

  for (let round = 0; round < 8 && !done; round++) {
    for (let p = 1 as BiddingPosition; p <= 4; p = (p + 1) as BiddingPosition) {
      const seat = p as BiddingPosition;
      const dealt = hands[seat - 1];
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

      const lastReal = [...flatCalls]
        .reverse()
        .map((e) => e.call)
        .find(isReal);
      if (isReal(call) && lastReal) {
        if (BID_ORDER_SIM.indexOf(call) <= BID_ORDER_SIM.indexOf(lastReal)) {
          problems.push(
            `P${seat} recommended ILLEGAL ${call} (floor ${lastReal})`,
          );
        }
      }
      if (call === "Double" && isIllegalDoubleRecommendation(seat, flatCalls)) {
        problems.push(`P${seat} recommended ILLEGAL Double`);
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
      flatCalls.push({ seat, call });

      const trailing = (() => {
        let n = 0;
        for (let i = flatCalls.length - 1; i >= 0; i--) {
          if (flatCalls[i].call === "Pass") n++;
          else break;
        }
        return n;
      })();
      const anyAction = flatCalls.some((e) => e.call !== "Pass");
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
    `AUCTION: ${flatCalls.map((e) => e.call).join(" – ")}   FINAL: ${isComplete ? `${finalContract ?? "passed out"}${doubling ? ` (${doubling})` : ""}` : "(incomplete)"}`,
  );

  lines.push("");
  lines.push("── Tooltips (getBidMeaning) ──");
  const allRounds = [...completedRounds, currentRound];
  const opening = flatCalls.map((e) => e.call).find(isReal);
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
  return { transcript: lines.join("\n"), problems };
}

// ─── Runner ──────────────────────────────────────────────────────────────────
const DEFAULT_SEEDS = [43, 44, 45];
const parseSeeds = (raw: string | undefined): number[] => {
  const parsed = (raw ?? DEFAULT_SEEDS.join(","))
    .split(",")
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => Number.isFinite(n));
  return parsed.length > 0 ? parsed : DEFAULT_SEEDS;
};
const SEEDS = parseSeeds(process.env.SIM_SEEDS);
const OUT = process.env.SIM_OUT;

describe("bidding-logic | SAYC seeded auction simulation", () => {
  it("flags doubles of a partner's bid as illegal", () => {
    expect(
      isIllegalDoubleRecommendation(3, [
        { seat: 1, call: "1♣" },
        { seat: 2, call: "Pass" },
      ]),
    ).toBe(true);
  });

  it("allows doubles of an opponent's bid", () => {
    expect(isIllegalDoubleRecommendation(2, [{ seat: 1, call: "1♣" }])).toBe(
      false,
    );
  });

  it("flags doubles after Double or Redouble", () => {
    expect(
      isIllegalDoubleRecommendation(4, [
        { seat: 1, call: "1♣" },
        { seat: 2, call: "Double" },
      ]),
    ).toBe(true);
    expect(
      isIllegalDoubleRecommendation(1, [
        { seat: 2, call: "1♣" },
        { seat: 3, call: "Double" },
        { seat: 4, call: "Redouble" },
      ]),
    ).toBe(true);
  });

  it("plays full auctions for each seed with no auto-flagged problems", async () => {
    const vulCycle: [boolean, boolean][] = [
      [false, false],
      [true, false],
      [false, true],
      [true, true],
    ];
    const results = SEEDS.map((seed, i) => runDeal(seed, ...vulCycle[i % 4]));
    const transcript = results.map((r) => r.transcript).join("\n\n");
    const problems = results.flatMap((r) => r.problems);

    if (OUT) {
      const { writeFileSync } = await import("node:fs");
      writeFileSync(OUT, transcript);
    }
    expect(problems).toEqual([]);
  });
});
