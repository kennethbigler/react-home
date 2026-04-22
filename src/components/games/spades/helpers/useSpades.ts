import { useAtom, useAtomValue } from "jotai";
import playerAtom from "../../../../jotai/player-atom";
import spadesAtom, {
  Bids,
  defaultBid,
  NilMetrics,
} from "../../../../jotai/spades-atom";
import { getScoreText } from "./getScoreText";

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

const useSpades = () => {
  const players = useAtomValue(playerAtom);
  const [spades, setSpades] = useAtom(spadesAtom);

  const {
    data,
    first,
    lastBid,
    lifeBags,
    missedBids,
    wins1,
    wins2,
    total1,
    total2,
    nils,
  } = spades;
  const initials = players.reduce((a, p, i) => (i < 4 ? a + p.name[0] : a), "");

  /** sets a new data entry with first and bid info of data, updates first */
  const addBid = (bids: Bids) => {
    const last = data.length - 1;
    // edit score if exists
    if (data[last] && data[last]?.score1 === undefined) {
      const newData = [...data];
      newData[last].bid = bidsToString(bids);
      setSpades({ ...spades, data: newData, lastBid: bids });
      return;
    }
    // convert bid to storage data format
    const newData = [...data];
    newData.push({ start: initials[first], bid: bidsToString(bids) });
    // update first player and add data entry
    setSpades({ ...spades, data: newData, lastBid: bids });
  };

  const addPenalty = (team: number) => () => {
    let last = data.length - 1;
    if (data[last]?.score1 === undefined) {
      last -= 1;
    }
    if (team === 0) {
      // verify data
      const { score1, bags1, mod1 } = data[last] || {};
      if (score1 === undefined || bags1 === undefined) {
        return;
      }
      // add 3 bags
      const { score, bags, mod } = penaltyHelper(score1, bags1, mod1);
      // update data
      const newData = [...data];
      newData[last] = { ...data[last], score1: score, bags1: bags, mod1: mod };
      setSpades({ ...spades, data: newData });
    } else {
      // verify data
      const { score2, bags2, mod2 } = data[last] || {};
      if (score2 === undefined || bags2 === undefined) {
        return;
      }
      // add 3 bags
      const { score, bags, mod } = penaltyHelper(score2, bags2, mod2);
      // update data
      const newData = [...data];
      newData[last] = { ...data[last], score2: score, bags2: bags, mod2: mod };
      setSpades({ ...spades, data: newData });
    }
  };

  /** calculates and adds score1 and score2 finishing data entry */
  const addScore = (mades: [number, number, number, number]) => {
    const last = data.length - 1;
    // can't add scores if no bid exists
    if (data[last]?.score1 !== undefined) {
      return;
    }

    // convert made tricks to scores
    const newData = [...data];
    const { score1, bags1, score2, bags2 } = data[last - 1] || {};

    // calculate scores
    const {
      score: scoreA,
      bags: bagsA,
      mod: mod1,
    } = getScore(
      { ...lastBid[0], made: mades[0] },
      { ...lastBid[2], made: mades[2] },
      score1 || 0,
      bags1 || 0,
    );
    const {
      score: scoreB,
      bags: bagsB,
      mod: mod2,
    } = getScore(
      { ...lastBid[1], made: mades[1] },
      { ...lastBid[3], made: mades[3] },
      score2 || 0,
      bags2 || 0,
    );
    // update scores in data entry
    newData[last] = {
      ...data[last],
      score1: scoreA,
      bags1: bagsA,
      mod1,
      score2: scoreB,
      bags2: bagsB,
      mod2,
    };

    const { newNils, newMissedBids, newLifeBags } = getMetrics(
      nils,
      lifeBags,
      first,
      lastBid,
      mades,
      missedBids,
    );

    // update state
    setSpades({
      ...spades,
      data: newData,
      first: (first + 1) % 4,
      lastBid: [defaultBid, defaultBid, defaultBid, defaultBid],
      lifeBags: newLifeBags,
      missedBids: newMissedBids,
      nils: newNils,
    });
  };

  const newGame = () => {
    const { score1, bags1, score2, bags2 } = data[data.length - 1];
    const is1Winner =
      (score1 === score2 && (bags1 || 0) > (bags2 || 0)) ||
      (score1 || 0) > (score2 || 0);
    setSpades({
      ...spades,
      data: [],
      lastBid: [defaultBid, defaultBid, defaultBid, defaultBid],
      wins1: wins1 + (is1Winner ? 1 : 0),
      wins2: wins2 + (is1Winner ? 0 : 1),
      total1: total1 + (score1 || 0) * 10 + (bags1 || 0),
      total2: total2 + (score2 || 0) * 10 + (bags2 || 0),
    });
  };

  // Derive current scores for display (find last completed row)
  let scoreIdx = data.length - 1;
  if (data[scoreIdx]?.score1 === undefined) {
    scoreIdx -= 1;
  }
  const curScore1 = data[scoreIdx]?.score1 || 0;
  const curBags1 = data[scoreIdx]?.bags1 || 0;
  const curScore2 = data[scoreIdx]?.score2 || 0;
  const curBags2 = data[scoreIdx]?.bags2 || 0;
  const scoreDiff = curScore1 * 10 + curBags1 - (curScore2 * 10 + curBags2);
  const blindTrade =
    scoreDiff > 0 ? Math.floor(scoreDiff / 100) : Math.ceil(scoreDiff / 100);
  const scoreText = `${getScoreText(curScore1, curScore2)}${curBags1} | ${getScoreText(curScore2, curScore1)}${curBags2}`;
  const showPenalty = data[0]?.score1 !== undefined;
  const showReset = curScore1 >= 100 || curScore2 >= 100;

  return {
    // data
    data,
    first,
    initials,
    lastBid,
    lifeBags,
    wins1,
    wins2,
    // derived
    blindTrade,
    scoreText,
    showPenalty,
    showReset,
    // functions
    addBid,
    addPenalty,
    addScore,
    newGame,
  };
};

export default useSpades;
