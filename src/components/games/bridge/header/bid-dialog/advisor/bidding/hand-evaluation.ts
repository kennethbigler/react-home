import type { Hand, HandAnalysis } from "./types";

// ─── Helper Calculations ─────────────────────────────────────────────────────

export const SUIT_NAMES = ["spades", "hearts", "diamonds", "clubs"] as const;

export type SuitName = (typeof SUIT_NAMES)[number];

/** Spades → hearts → diamonds → clubs, with each suit's length from `hand`. */
export function suitDescriptors(
  hand: Hand,
): { name: SuitName; count: number }[] {
  return [
    { name: "spades", count: hand.spades },
    { name: "hearts", count: hand.hearts },
    { name: "diamonds", count: hand.diamonds },
    { name: "clubs", count: hand.clubs },
  ];
}

/** Map a bid string to its suit name; undefined for notrump and non-suit calls. */
export function suitFromBid(bid: string | undefined): SuitName | undefined {
  if (!bid || bid.endsWith("NT")) return undefined;
  if (bid.includes("♠")) return "spades";
  if (bid.includes("♥")) return "hearts";
  if (bid.includes("♦")) return "diamonds";
  if (bid.includes("♣")) return "clubs";
  return undefined;
}

export function calcLongSuitPoints(hand: Hand): number {
  const suits = [hand.spades, hand.hearts, hand.diamonds, hand.clubs];
  return suits.reduce((pts, count) => pts + Math.max(0, count - 4), 0);
}

export function calcTP(hand: Hand): number {
  return hand.hcp + calcLongSuitPoints(hand);
}

export function calcShortSuitPoints(hand: Hand): number {
  const suits = [hand.spades, hand.hearts, hand.diamonds, hand.clubs];
  return suits.reduce((pts, count) => {
    if (count === 0) return pts + 5; // void
    if (count === 1) return pts + 3; // singleton
    if (count === 2) return pts + 1; // doubleton
    return pts;
  }, 0);
}

export function calcTPWithFit(hand: Hand): number {
  return hand.hcp + calcShortSuitPoints(hand);
}

export function isBalanced(hand: Hand): boolean {
  const suits = [hand.spades, hand.hearts, hand.diamonds, hand.clubs];
  const hasVoid = suits.some((c) => c === 0);
  const hasSingleton = suits.some((c) => c === 1);
  const doubletons = suits.filter((c) => c === 2).length;
  return !hasVoid && !hasSingleton && doubletons <= 1;
}

export function hasVoid(hand: Hand): boolean {
  return [hand.spades, hand.hearts, hand.diamonds, hand.clubs].some(
    (c) => c === 0,
  );
}

export function ruleOf20(hand: Hand): boolean {
  const suits = suitDescriptors(hand);
  suits.sort((a, b) => b.count - a.count);
  return hand.hcp + suits[0].count + suits[1].count >= 20;
}

export function longestSuitInfo(hand: Hand): { name: string; length: number } {
  const suits = suitDescriptors(hand);
  // Spades > hearts > diamonds > clubs for tie-breaking (higher-ranking first)
  suits.sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return SUIT_NAMES.indexOf(a.name) - SUIT_NAMES.indexOf(b.name);
  });
  return { name: suits[0].name, length: suits[0].count };
}

export function hasFiveCardMajor(hand: Hand): boolean {
  return hand.spades >= 5 || hand.hearts >= 5;
}

export function bestMajor(hand: Hand): string | null {
  if (hand.spades >= 5 && hand.spades >= hand.hearts) return "spades";
  if (hand.hearts >= 5) return "hearts";
  return null;
}

export function longerMinor(hand: Hand): string {
  if (hand.diamonds > hand.clubs) return "diamonds";
  if (hand.clubs > hand.diamonds) return "clubs";
  // tie: 4-4 or longer (5-5, 6-6) → diamonds (open the higher-ranking suit); 3-3 → clubs
  if (hand.diamonds >= 4) return "diamonds";
  return "clubs";
}

export function suitSymbol(suit: string): string {
  const map: Record<string, string> = {
    spades: "♠",
    hearts: "♥",
    diamonds: "♦",
    clubs: "♣",
  };
  return map[suit] ?? suit;
}

export function suitBidLevel(suit: string, level: number): string {
  return `${level}${suitSymbol(suit)}`;
}

export function getContractLimit(combinedTP: number): string {
  if (combinedTP >= 37) return "7NT (Grand Slam in NT)";
  if (combinedTP >= 35) return "7 of suit (Grand Slam)";
  if (combinedTP >= 33) return "6NT (Small Slam in NT)";
  if (combinedTP >= 31) return "6 of suit (Small Slam)";
  if (combinedTP >= 29) return "5♣ or 5♦ (Minor Game)";
  if (combinedTP >= 25) return "3NT or 4♥/♠ (Game)";
  return "Part Score (non-game)";
}

export function analyzeHand(hand: Hand): HandAnalysis {
  const tp = calcTP(hand);
  const balanced = isBalanced(hand);
  const { name: longestName, length: longestLength } = longestSuitInfo(hand);
  const fiveCardMajor = hasFiveCardMajor(hand);
  const voidPresent = hasVoid(hand);

  const parts: string[] = [];
  parts.push(`${tp} TP (${hand.hcp} HCP)`);
  if (balanced) {
    parts.push("balanced");
  } else {
    parts.push("unbalanced");
  }
  if (longestLength >= 5) {
    parts.push(`${longestLength}-card ${longestName} suit`);
  }
  if (voidPresent) {
    parts.push("void present");
  }

  return {
    tp,
    hcp: hand.hcp,
    isBalanced: balanced,
    longestSuitName: longestName,
    longestSuitLength: longestLength,
    hasFiveCardMajor: fiveCardMajor,
    hasVoid: voidPresent,
    description: parts.join(", "),
  };
}
