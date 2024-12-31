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
) => {
  // double blind nil
  if (p1.blind && p2.blind) {
    if (p1.made === 0 && p2.made === 0) {
      return { score: score + 80, bags };
    } else {
      return { score, bags: bags + p1.made + p2.made };
    }
  }
  // double nil
  if (p1.bid === 0 && p2.bid === 0) {
    // 1 blind 1 normal
    if (p1.blind || p2.blind) {
      if (p1.made === 0 && p2.made === 0) {
        return { score: score + 60, bags };
      } else if ((p1.blind && p1.made === 0) || (p2.blind && p2.made === 0)) {
        return { score: score + 30, bags: bags + p1.made + p2.made };
      } else if (p1.made === 0 || p2.made === 0) {
        return { score, bags: bags + p1.made + p2.made };
      } else {
        return { score: score - 30, bags: bags + p1.made + p2.made };
      }
    }
    // 2 normal
    if (p1.made === 0 && p2.made === 0) {
      return { score: score + 40, bags };
    } else if (p1.made === 0 || p2.made === 0) {
      return { score, bags: bags + p1.made + p2.made };
    } else {
      return { score: score - 20, bags: bags + p1.made + p2.made };
    }
  }
  let newScore = 0;
  let newBags = 0;
  // trains
  if ((p1.train || p2.train) && p1.made + p2.made >= 10) {
    newScore = 20;
    newBags = p1.made + p2.made - 10;
  } else {
    // eval nils
    if (p1.bid === 0) {
      if (p1.made === 0) {
        newScore += p1.blind ? 20 : 10;
      } else {
        newScore -= 10;
        newBags += p1.made;
      }
    } else if (p2.bid === 0) {
      if (p2.made === 0) {
        newScore += p2.blind ? 20 : 10;
      } else {
        newScore -= 10;
        newBags += p2.made;
      }
    }
    // eval group score
    const teamBid = p1.bid + p2.bid;
    const teamMade = (p1.bid > 0 ? p1.made : 0) + (p2.bid > 0 ? p2.made : 0);
    if (teamMade >= teamBid) {
      newScore += teamBid;
      newBags += teamMade - teamBid;
    } else {
      newScore -= teamBid;
    }
  }
  // check for bag out
  if (bags + newBags >= 10) {
    newScore -= 9;
    newBags -= 10;
  }
  // return
  return { score: score + newScore, bags: bags + newBags };
};
export default getScore;
