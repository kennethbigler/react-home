import { Bids, NilMetrics } from "../../../jotai/spades-atom";

/** defined in spades-atom
 * bid: number;
 * blind: boolean;
 * train: boolean;
 * made: number;
 */
interface ScoreData {
  bid: number;
  blind: boolean;
  train: boolean;
  made: number;
}

/** convert Bids to string for smaller storage */
export const bidsToString = (bids: Bids): string =>
  bids.reduce((acc, b) => {
    if (b.train) {
      return acc + "🚂";
    } else if (b.blind) {
      return acc + "🦮";
    } else if (b.bid === 0) {
      return acc + "🚫";
    } else if (b.bid >= 10) {
      return acc + `,${b.bid},`;
    } else {
      return acc + b.bid.toString();
    }
  }, "");

/** get and update score from Bids and made values */
export const getScore = (
  p1: ScoreData,
  p2: ScoreData,
  score: number,
  bags: number,
): { score: number; bags: number; mod?: string } => {
  let newScore = 0;
  let newBags = 0;
  let mod = "";

  // double blind nil
  if (p1.blind && p2.blind) {
    if (p1.made === 0 && p2.made === 0) {
      // win
      newScore = 80;
    } else {
      // lose
      newBags = p1.made + p2.made;
      mod = "🚫🚫";
    }
    // double nil
  } else if (p1.bid === 0 && p2.bid === 0) {
    // 1 blind 1 normal
    if (p1.blind || p2.blind) {
      if (p1.made === 0 && p2.made === 0) {
        // win
        newScore = 60;
      } else if ((p1.blind && p1.made === 0) || (p2.blind && p2.made === 0)) {
        // blind win
        newScore = 30;
        newBags = p1.made + p2.made;
        mod = "🚫";
      } else if (p1.made === 0 || p2.made === 0) {
        // normal win
        newBags = p1.made + p2.made;
        mod = "🚫";
      } else {
        // lose
        newScore = -30;
        newBags = p1.made + p2.made;
        mod = "🚫🚫";
      }
      // 2 normal
    } else if (p1.made === 0 && p2.made === 0) {
      // win
      newScore = 40;
    } else if (p1.made === 0 || p2.made === 0) {
      // half win
      newBags = p1.made + p2.made;
      mod = "🚫";
    } else {
      // lose
      newScore = -20;
      newBags = p1.made + p2.made;
      mod = "🚫🚫";
    }
    // trains
  } else if (p1.train || p2.train) {
    if (p1.made + p2.made >= 10) {
      // win
      newScore = 20;
      newBags = p1.made + p2.made - 10;
    } else {
      // lose
      newScore = -20;
      mod = "🚂";
    }
  } else {
    // eval nils
    if (p1.bid === 0) {
      if (p1.made === 0) {
        // win
        newScore += p1.blind ? 20 : 10;
      } else {
        // lose
        newScore -= 10;
        newBags += p1.made;
        mod = "🚫";
      }
    } else if (p2.bid === 0) {
      if (p2.made === 0) {
        // win
        newScore += p2.blind ? 20 : 10;
      } else {
        // lose
        newScore -= 10;
        newBags += p2.made;
        mod = "🚫";
      }
    }
    // eval group score
    const teamBid = p1.bid + p2.bid;
    const teamMade = (p1.bid > 0 ? p1.made : 0) + (p2.bid > 0 ? p2.made : 0);
    if (teamMade >= teamBid) {
      // win
      newScore += teamBid;
      newBags += teamMade - teamBid;
    } else {
      // lose
      newScore -= teamBid;
      mod += "🎰";
    }
  }
  // check for bag out
  while (bags + newBags >= 10) {
    newScore -= 9;
    newBags -= 10;
    mod += "💰";
  }
  // return
  return { score: score + newScore, bags: bags + newBags, mod };
};

/** add the penalty then handle bag out if needed */
export const penaltyHelper = (s: number, b: number, m?: string) => {
  // add bags
  let bags = b + 3;
  let mod = (m || "") + "😈";
  let score = s;
  // check for bag out
  if (bags >= 10) {
    score -= 9;
    bags -= 10;
    mod += "💰";
  }
  // return;
  return { score, bags, mod };
};

export const getChipColor = (a: number, b: number) => {
  if (a === b) {
    return "default";
  }
  return a > b ? "success" : "error";
};

/** Get Metrics, and return new lifeBags and Nils */
export const getMetrics = (
  nils: NilMetrics,
  lifeBags: [number, number, number, number, number],
  first: number,
  lastBid: Bids,
  mades: [number, number, number, number],
  missedBids: [number, number, number, number],
) => {
  // New variables stored to state
  const newNils: NilMetrics = [...nils];
  const newMissedBids: [number, number, number, number] = [...missedBids];
  const newLifeBags: [number, number, number, number, number] = [...lifeBags];
  // get order relative to first
  const a = first;
  const b = (first + 1) % 4;
  const c = (first + 2) % 4;
  const d = (first + 3) % 4;
  // check if 2nd partner was nil
  const cWasNil = lastBid[c].bid === 0 && !lastBid[c].blind;
  const dWasNil = lastBid[d].bid === 0 && !lastBid[d].blind;
  // check if stopped
  const acStopped = lastBid[a].bid + lastBid[c].bid > mades[a] + mades[c];
  const bdStopped = lastBid[b].bid + lastBid[d].bid > mades[b] + mades[d];

  // Iterate over bids
  lastBid.forEach((bid, i) => {
    // Nil Tracker, [bid, blind, won]
    newNils[i][0] += bid.bid === 0 ? 1 : 0;
    newNils[i][1] += bid.blind ? 1 : 0;
    newNils[i][2] += bid.bid === 0 && mades[i] === 0 ? 1 : 0;

    // Missed Bid Tracker
    // partner index
    const p = (i + 2) % 4;
    // team bids vs made tricks
    const teamMiss = bid.bid + lastBid[p].bid - (mades[i] + mades[p]);
    const iMiss = bid.bid - mades[i];
    // add to missed bid tracker
    if (bid.bid > 2 && teamMiss > 0 && iMiss > 0) {
      newMissedBids[i] += Math.min(iMiss, teamMiss);
    }

    // Bag Tracker
    const partnerNil2nd = (i === a && cWasNil) || (i === b && dWasNil);
    const stoppedEnemy =
      ((i === a || i === c) && bdStopped) ||
      ((i === b || i === d) && acStopped);
    // don't count certain bag situations for bag tracker
    if (partnerNil2nd || stoppedEnemy || bid.train || lastBid[p].train) {
      return;
    }
    // add the team or personal bags, whatever is lower
    if (-teamMiss > 0 && -iMiss > 0) {
      newLifeBags[i] += Math.min(-iMiss, -teamMiss);
    }
  });
  // increment expected bags by 0.25
  newLifeBags[lastBid.length] += 0.25;

  return { newNils, newMissedBids, newLifeBags };
};
