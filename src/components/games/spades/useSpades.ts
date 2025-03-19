import { useAtom, useAtomValue } from "jotai";
import playerAtom from "../../../jotai/player-atom";
import spadesAtom, { Bids, defaultBid } from "../../../jotai/spades-atom";
import { bidsToString, getScore, penaltyHelper } from "./helpers";

const useSpades = () => {
  const players = useAtomValue(playerAtom);
  const [spades, setSpades] = useAtom(spadesAtom);

  const { data, first, lastBid, overBids, wins1, wins2 } = spades;
  const initials = players.reduce((a, p, i) => (i < 4 ? a + p.name[0] : a), "");

  /** sets a new data entry with first and bid info of data, updates first */
  const addBid = (bids: Bids) => {
    // can't add bid if bid already exists, or if someone won
    if (data[data.length - 1] && data[data.length - 1]?.score1 === undefined) {
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
    // underbidding tracker algorithm
    const newOverBids: [number, number, number, number, number] = [...overBids];
    lastBid.forEach((bid, i) => {
      // don't count if 2nd partner was nil
      if (
        (i === 0 && lastBid[2].bid === 0) ||
        (i === 1 && lastBid[3].bid === 0)
      ) {
        return;
      }
      // add the overbid or bags, whatever is lower
      newOverBids[i] += Math.min(
        mades[i] - bid.bid, // if overbid is lower, partner got bags
        i === 0 || i === 2 ? newBags1 || 0 : newBags2 || 0, // if bags is lower, player was saving partner
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
