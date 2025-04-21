import { useAtom, useAtomValue } from "jotai";
import playerAtom from "../../../jotai/player-atom";
import spadesAtom, { Bids, defaultBid } from "../../../jotai/spades-atom";
import { bidsToString, getMetrics, getScore, penaltyHelper } from "./helpers";

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

  return {
    // data
    data,
    first,
    initials,
    lastBid,
    lifeBags,
    wins1,
    wins2,
    // functions
    addBid,
    addPenalty,
    addScore,
    newGame,
  };
};

export default useSpades;
