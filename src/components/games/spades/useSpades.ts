import { useAtom, useAtomValue } from "jotai";
import playerAtom from "../../../jotai/player-atom";
import scoreboardAtom, { Bid, defaultBid } from "../../../jotai/spades-atom";
import getScore from "./helpers";

const useSpades = () => {
  const players = useAtomValue(playerAtom);
  const [{ first, lastBid, data }, setScoreboard] = useAtom(scoreboardAtom);

  const initials: [string, string, string, string] = [
    players[0].name[0],
    players[1].name[0],
    players[2].name[0],
    players[3].name[0],
  ];

  /** sets a new data entry with first and bid info of data, updates first */
  const addBid = (bids: [Bid, Bid, Bid, Bid]) => {
    // can't add bid if bid already exists, or if someone won
    if (data[data.length - 1] && data[data.length - 1]?.score1 === undefined) {
      return;
    }
    // convert bid to storage data format
    const newData = [...data];
    const newEntry = {
      start: initials[first],
      bid: bids.reduce((acc, b) => {
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
      }, ""),
    };
    newData.push(newEntry);
    // update first player and add data entry
    setScoreboard({ first, lastBid: bids, data: newData });
  };

  const penaltyHelper = (s: number, b: number, m?: string) => {
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

  const addPenalty = (team: number) => () => {
    let i = data.length - 1;
    if (data[i]?.score1 === undefined) {
      i -= 1;
    }
    if (team === 0) {
      // verify data
      const { score1, bags1, mod1 } = data[i] || {};
      if (score1 === undefined || bags1 === undefined) {
        return;
      }
      // add 3 bags
      const { score, bags, mod } = penaltyHelper(score1, bags1, mod1);
      // update data
      const newData = [...data];
      newData[i] = { ...data[i], score1: score, bags1: bags, mod1: mod };
      setScoreboard({ first, lastBid, data: newData });
    } else {
      // verify data
      const { score2, bags2, mod2 } = data[i] || {};
      if (score2 === undefined || bags2 === undefined) {
        return;
      }
      // add 3 bags
      const { score, bags, mod } = penaltyHelper(score2, bags2, mod2);
      // update data
      const newData = [...data];
      newData[i] = { ...data[i], score2: score, bags2: bags, mod2: mod };
      setScoreboard({ first, lastBid, data: newData });
    }
  };

  /** calculates and adds score1 and score2 finishing data entry */
  const addScore = (mades: [number, number, number, number]) => {
    // can't add scores if no bid exists
    if (data[data.length - 1]?.score1 !== undefined) {
      return;
    }
    // convert made tricks to scores
    const newData = [...data];
    const { score1, bags1, score2, bags2 } = data[data.length - 2] || {};
    // calculate scores
    const {
      score: newScore1,
      bags: newBags1,
      mod: mod1,
    } = getScore(
      { ...lastBid[0], made: mades[0] },
      { ...lastBid[2], made: mades[2] },
      score1 || 0,
      bags1 || 0,
    );
    const {
      score: newScore2,
      bags: newBags2,
      mod: mod2,
    } = getScore(
      { ...lastBid[1], made: mades[1] },
      { ...lastBid[3], made: mades[3] },
      score2 || 0,
      bags2 || 0,
    );
    // update scores in data entry
    newData[data.length - 1] = {
      ...data[data.length - 1],
      score1: newScore1,
      bags1: newBags1,
      mod1,
      score2: newScore2,
      bags2: newBags2,
      mod2,
    };
    setScoreboard({
      first: (first + 1) % 4,
      lastBid: [defaultBid, defaultBid, defaultBid, defaultBid],
      data: newData,
    });
  };

  const newGame = () =>
    setScoreboard({
      first,
      lastBid: [defaultBid, defaultBid, defaultBid, defaultBid],
      data: [],
    });

  return {
    first,
    lastBid,
    data,
    initials,
    addBid,
    addPenalty,
    addScore,
    newGame,
  };
};

export default useSpades;
