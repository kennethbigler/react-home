import { useAtom, useAtomValue } from "jotai";
import playerAtom from "../../../jotai/player-atom";
import spadesAtom, { Bids, defaultBid } from "../../../jotai/spades-atom";
import { bidsToString, getScore, penaltyHelper } from "./helpers";

const useSpades = () => {
  const players = useAtomValue(playerAtom);
  const [spades, setSpades] = useAtom(spadesAtom);

  const { data, first, lastBid, overBids, wins1, wins2, total1, total2, nils } =
    spades;
  const initials = players.reduce((a, p, i) => (i < 4 ? a + p.name[0] : a), "");

  /** sets a new data entry with first and bid info of data, updates first */
  const addBid = (bids: Bids) => {
    // edit score if exists
    if (data[data.length - 1] && data[data.length - 1]?.score1 === undefined) {
      const newData = [...data];
      newData[data.length - 1].bid = bidsToString(bids);
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
      setSpades({ ...spades, data: newData });
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
      setSpades({ ...spades, data: newData });
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
      score: scoreA,
      bags: bagsA,
      mod: mod1,
      lifeBags: lifeBags1,
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
      lifeBags: lifeBags2,
    } = getScore(
      { ...lastBid[1], made: mades[1] },
      { ...lastBid[3], made: mades[3] },
      score2 || 0,
      bags2 || 0,
    );
    // update scores in data entry
    newData[data.length - 1] = {
      ...data[data.length - 1],
      score1: scoreA,
      bags1: bagsA,
      mod1,
      score2: scoreB,
      bags2: bagsB,
      mod2,
    };

    const newNils: [
      [number, number, number],
      [number, number, number],
      [number, number, number],
      [number, number, number],
    ] = [...nils];
    // underbidding tracker algorithm
    // get order relative to first
    const a = (first + 0) % 4;
    const b = (first + 1) % 4;
    const c = (first + 2) % 4;
    const d = (first + 3) % 4;
    const newOverBids: [number, number, number, number, number] = [...overBids];

    lastBid.forEach((bid, i) => {
      // add to nil tracker, [bid, blind, won]
      newNils[i][0] += lastBid[i].bid === 0 ? 1 : 0;
      newNils[i][1] += lastBid[i].blind ? 1 : 0;
      newNils[i][2] += lastBid[i].bid === 0 && mades[i] === 0 ? 1 : 0;
      // don't count if 2nd partner was nil
      if (
        (i === a && lastBid[c].bid === 0 && !lastBid[c].blind) ||
        (i === b && lastBid[d].bid === 0 && !lastBid[d].blind) ||
        ((i === a || i === c) &&
          lastBid[b].bid + lastBid[d].bid > mades[b] + mades[d]) ||
        ((i === b || i === d) &&
          lastBid[a].bid + lastBid[c].bid > mades[a] + mades[c]) ||
        lastBid[i].train ||
        lastBid[(i + 2) % 4].train
      ) {
        return;
      }
      // add the overbid or bags, whatever is lower
      newOverBids[i] += Math.max(
        // get bag count
        Math.min(
          mades[i] - bid.bid, // if overbid is lower, partner got bags
          i === 0 || i === 2 ? lifeBags1 : lifeBags2, // if bags is lower, player was saving partner
        ),
        0, // and make sure it's not negative
      );
    });
    // increment expected bags by 0.25
    newOverBids[lastBid.length] += 0.25;

    // update state
    setSpades({
      ...spades,
      data: newData,
      first: (first + 1) % 4,
      lastBid: [defaultBid, defaultBid, defaultBid, defaultBid],
      overBids: newOverBids,
      nils: newNils,
    });
  };

  const newGame = () => {
    const { score1, bags1 } = data[data.length - 1];
    const { score2, bags2 } = data[data.length - 1];
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
    overBids,
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
