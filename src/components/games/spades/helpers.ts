import { Bids } from "../../../jotai/spades-atom";

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
): { score: number; bags: number; mod?: string; lifeBags: number } => {
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
  const lifeBags = newBags;
  // check for bag out
  while (bags + newBags >= 10) {
    newScore -= 9;
    newBags -= 10;
    mod += "💰";
  }
  // return
  return { score: score + newScore, bags: bags + newBags, mod, lifeBags };
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
