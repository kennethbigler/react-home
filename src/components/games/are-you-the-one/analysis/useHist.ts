import { RoundPairing } from "../../../../store/types";

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

/** [lady-i: (gent-i | -1), -1, -1, ...] */
/** [lady-i: [gent-i: bool]] */
/** [round-i: RoundPairing] */
const useHist = (
  len: number,
  matches: number[],
  noMatch: boolean[][],
  roundPairings: RoundPairing[]
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
      !hist[li] && (hist[li] = []);
      !hist[li][gi] && (hist[li][gi] = { odds: 0, oddsWeight: 0, rounds: [] });
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
      // 100% odds for match
      if (matches[li] === gi) {
        histObj.odds = 100;
        return;
      }
      // calculate odds for the round
      const odds = totals[ri]
        ? ((score - tempScore[ri]) * 100) / totals[ri]
        : 0;
      // rolling average
      histObj.odds = Math.floor(
        (histObj.odds * histObj.oddsWeight + odds) / (histObj.oddsWeight + 1)
      );

      // ----------     equations     ---------- //
      // only care about repeats
      if (histObj.rounds.length < 2) {
        return;
      }
      // create key from round combination
      const key = histObj.rounds.reduce((acc, val) => acc + val.toString(), "");
      // put that in the dictionary
      !dict[key] && (dict[key] = { couples: [], score: len });
      // calculate equations
      let canAdd = true;
      dict[key].couples.forEach(([tli, _]) => {
        canAdd = canAdd && tli !== li;
      });
      canAdd && dict[key].couples.push([li, gi]);
      dict[key].score = Math.min(score - tempScore[ri], dict[key].score);
    });
  });

  // more state
  const calculatedEquations: RoundPairing[] = [];

  // convert qualifying couples to more equations
  Object.keys(dict).forEach((key) => {
    if (
      // only care about repeat couples
      dict[key].couples.length > 2 &&
      // where there are more couples than score available
      dict[key].couples.length > dict[key].score
    ) {
      const tempPairs: number[] = [];
      // convert to RP
      dict[key].couples.forEach(([li, gi]) => {
        tempPairs[li] = gi;
      });
      // Add RP to equations
      calculatedEquations.push({
        pairs: tempPairs,
        score: dict[key].score,
      });
    }
  });

  return {
    hist,
    tempScore,
    calculatedEquations,
  };
};

export default useHist;
