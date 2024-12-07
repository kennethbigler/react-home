import { RoundPairing } from "../../../../jotai/are-you-the-one-state";

export interface AYTOHist {
  odds: number;
  oddsWeight: number;
  rounds: number[];
}

export interface AYTODictObj {
  couples: [number, number][];
  score: number;
}

export interface AYTODict {
  [key: string]: AYTODictObj;
}

/** function to get game logic
 * @param {number} len
 * @param {number[]} matches [lady-i: (gent-i | -1), -1, -1, ...]
 * @param {boolean[][]} noMatch [lady-i: [gent-i: bool]]
 * @param {Object[]} roundPairings [round-i: RoundPairing]
 * @returns {Object} {
 *   hist: [lady-i: [gent-i: { odds, rounds together }]]
 *   tempScore: [round-i: number of confirmed matches]
 *   calculatedEquations: [i: { pairs, score }]
 * } */
const useHist = (
  len: number,
  matches: number[],
  noMatch: boolean[][],
  roundPairings: RoundPairing[],
) => {
  // state
  const hist: AYTOHist[][] = [];
  const tempScore: number[] = [];
  const totals: number[] = [];

  // create histogram
  roundPairings.forEach(({ pairs }, ri) => {
    tempScore[ri] = 0;
    totals[ri] = len;

    pairs.forEach((gi, li) => {
      // noMatch increases odds of the rest
      if (li < 0 || gi < 0 || noMatch[li][gi]) {
        totals[ri] -= 1;
      }
      // remove matches
      if (matches[li] === gi) {
        tempScore[ri] += 1;
        totals[ri] -= 1;
      }
      // verify data obj
      if (!hist[li]) {
        hist[li] = [];
      }
      if (!hist[li][gi]) {
        hist[li][gi] = { odds: 0, oddsWeight: 0, rounds: [] };
      }
      // histogram
      hist[li][gi].rounds.push(ri);
    });
  });

  // temp state
  const dict: AYTODict = {};

  // with histogram made, time to get some stats
  roundPairings.forEach(({ pairs, score }, ri) => {
    pairs.forEach((gi, li) => {
      // ----------     odds     ---------- //
      const histObj = hist[li][gi];
      // 0% odds for no match
      if (noMatch[li][gi]) {
        return;
      }
      // 100% odds for match or max score
      if (matches[li] === gi || score === len) {
        histObj.odds = 100;
        return;
      }
      // calculate odds for the round
      const odds = totals[ri]
        ? ((score - tempScore[ri]) * 100) / totals[ri]
        : 0;
      // assign first odds
      if (histObj.oddsWeight === 0) {
        histObj.odds = Math.floor(odds);
      } else if (!odds || !histObj.odds) {
        // if odds for either are 0
        histObj.odds = 0;
      } else {
        // rolling average
        histObj.odds = Math.floor(
          (histObj.odds * histObj.oddsWeight + odds) / (histObj.oddsWeight + 1),
        );
      }
      // update odds weight
      histObj.oddsWeight += 1;

      // ----------     equations     ---------- //
      // only care about repeats
      if (histObj.rounds.length < 2) {
        return;
      }
      // create key from round combination (length)
      const keys = [
        histObj.rounds.reduce((acc, val) => acc + val.toString(), ""),
      ];
      // add every pair of 2 rounds as keys
      for (let i = ri + 1; i < histObj.rounds.length; i += 1) {
        keys.push(`${histObj.rounds[ri]}${histObj.rounds[i]}`);
      }
      // NOTE: length (l) and 2 are covered, anything in-between is not directly considered (still covered in 2s)
      keys.forEach((key) => {
        // put that in the dictionary
        if (!dict[key]) {
          dict[key] = { couples: [], score };
        }
        // calculate equations
        let canAdd = true;
        dict[key].couples.forEach(([tli, tgi]) => {
          canAdd = canAdd && tli !== li && tgi !== gi;
        });
        if (canAdd) {
          dict[key].couples.push([li, gi]);
        }
        dict[key].score = Math.min(score - tempScore[ri], dict[key].score);
      });
    });
  });

  // more state
  const calculatedEquations: RoundPairing[] = [];

  // convert qualifying couples to more equations
  Object.keys(dict).forEach((key) => {
    if (
      // only care about repeat couples
      dict[key].couples.length > 1 &&
      // where there are more couples than score available
      dict[key].couples.length > dict[key].score
    ) {
      const tempPairs: number[] = [];
      // convert to RP
      dict[key].couples.forEach(([li, gi]) => {
        tempPairs[li] = gi;
      });
      // validate new equation doesn't already exist
      let isRepeat = false;
      calculatedEquations.forEach(({ pairs, score }, ci) => {
        let hasExactRepeat = true;
        let hasRoughRepeat = true;
        for (let i = 0; i < pairs.length; i += 1) {
          if (tempPairs[i] !== pairs[i]) {
            if (tempPairs[i]) {
              hasExactRepeat = false;
              hasRoughRepeat = false;
            } else {
              // new equation has fewer couples, may still be a match but is missing some keys
              hasExactRepeat = false;
            }
          }
        }
        isRepeat =
          // compare against itself
          isRepeat ||
          // exclude if exact repeat
          hasExactRepeat ||
          // exclude if rough repeat with higher or equal score
          (hasRoughRepeat && dict[key].score >= score);
        // if exact repeat, pick the lower of the 2 scores
        if (hasExactRepeat) {
          calculatedEquations[ci].score = Math.min(score, dict[key].score);
        }
      });
      // Add RP to equations
      if (!isRepeat) {
        calculatedEquations.push({
          pairs: tempPairs,
          score: dict[key].score,
        });
      }
    }
  });

  return {
    hist,
    tempScore,
    calculatedEquations,
  };
};

export default useHist;
