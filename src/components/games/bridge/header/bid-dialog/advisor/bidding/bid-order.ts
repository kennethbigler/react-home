// ─── Bid ordering ─────────────────────────────────────────────────────────────

export const BID_ORDER: string[] = [
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

/**
 * Returns the list of valid bids that may follow `lastBid` in a Bridge auction.
 * - Pass is always valid.
 * - Suit/NT bids must be strictly higher than the last *suit/NT* bid (Double and
 *   Redouble do not raise the floor — the floor is set by the most recent real bid).
 * - Double is valid after any suit/NT bid (not after Pass, Double, or Redouble).
 * - Redouble is valid only immediately after a Double.
 *
 * `lastSuitBid` is the most recent suit/NT bid (skipping Double/Redouble). Pass
 * this separately when the immediately preceding bid was Double or Redouble so
 * the suit floor is computed correctly.
 */
export function getValidBidsAfter(
  lastBid: string | undefined,
  lastSuitBid?: string,
): string[] {
  const result: string[] = ["Pass"];

  // Determine the floor for suit/NT bids — Double/Redouble don't raise it.
  // Use lastSuitBid if provided, otherwise fall back to lastBid if it's a suit/NT bid.
  const suitFloor =
    lastSuitBid ??
    (lastBid &&
    lastBid !== "Pass" &&
    lastBid !== "Double" &&
    lastBid !== "Redouble"
      ? lastBid
      : undefined);

  const floorIdx = suitFloor ? BID_ORDER.indexOf(suitFloor) : -1;
  const higherSuitBids =
    floorIdx >= 0 ? BID_ORDER.slice(floorIdx + 1) : BID_ORDER;

  if (!lastBid) {
    result.push(...BID_ORDER, "Double");
    return result;
  }
  if (lastBid === "Pass") {
    result.push(...higherSuitBids);
    if (suitFloor) result.push("Double");
    return result;
  }
  if (lastBid === "Double") {
    result.push(...higherSuitBids, "Redouble");
    return result;
  }
  if (lastBid === "Redouble") {
    result.push(...higherSuitBids);
    return result;
  }
  // lastBid is a suit/NT bid
  const idx = BID_ORDER.indexOf(lastBid);
  if (idx >= 0) {
    result.push(...BID_ORDER.slice(idx + 1), "Double");
  } else {
    result.push(...BID_ORDER, "Double");
  }
  return result;
}

export function isRealBid(bid: string | undefined): bid is string {
  return (
    !!bid &&
    bid !== "Pass" &&
    bid !== "Double" &&
    bid !== "Redouble" &&
    bid !== "Interpret response"
  );
}
