interface ScoreData {
  bid: number;
  blind: boolean;
  train: boolean;
  made: number;
}

const getScore = (
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
  }
  // double nil
  if (p1.bid === 0 && p2.bid === 0) {
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
    }
    // 2 normal
    if (p1.made === 0 && p2.made === 0) {
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
  }
  // trains
  if (p1.train || p2.train) {
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
export default getScore;
