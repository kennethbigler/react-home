import * as React from "react";
import { useAtom, useAtomValue } from "jotai";
import Controls from "./Controls";
import Table from "./table/Table";
import Analysis from "./analysis/Analysis";
import aYTOAtom, { aytoPlayerRead } from "../../../jotai/are-you-the-one-state";
import useHist from "./histogram/useHist";
import { Typography } from "@mui/material";

const AreYouTheOne = () => {
  const [{ matches, noMatch, roundPairings }, setState] = useAtom(aYTOAtom);
  const { ladies, gents, options } = useAtomValue(aytoPlayerRead);

  // state
  const [ri, setRi] = React.useState(0);
  const { hist, tempScore, calculatedEquations } = useHist(
    ladies.length,
    matches,
    noMatch,
    roundPairings,
  );

  // handlers
  const handleSelect = (selected: number) => {
    setRi(selected);
  };

  const handleUpdateScore = (score: number) => {
    const newRoundPairing = !roundPairings[ri]
      ? { pairs: [], score: 0 }
      : { ...roundPairings[ri] };
    newRoundPairing.score = score;
    const newRoundPairings = [...roundPairings];
    newRoundPairings[ri] = newRoundPairing;
    setState({ matches, noMatch, roundPairings: newRoundPairings });
  };

  const handleUpdateNoMatch = (li: number, gi: number) => {
    const newMatches = noMatch.map((gentArray: boolean[]) => [...gentArray]);
    // if array for lady doesn't exist yet, create skeleton one
    if (!newMatches[li]) {
      newMatches[li] = [];
    }
    // assign no match
    newMatches[li][gi] = !newMatches[li][gi];
    // update state
    setState({ matches, noMatch: newMatches, roundPairings });
  };

  const handleBlackout = (pairs: number[]) => {
    // create immutable copy for storage
    const newNoMatches = noMatch.map((gentArray: boolean[]) => [...gentArray]);
    let newScore = 0;
    // no match for all pairs
    pairs.forEach((gi, li) => {
      if (matches[li] === gi) {
        newScore += 1;
      } else if (!noMatch[li][gi]) {
        // if array for lady doesn't exist yet, create skeleton one
        if (!newNoMatches[li]) {
          newNoMatches[li] = [];
        }
        // assign no match
        newNoMatches[li][gi] = true;
      }
    });
    const newRoundPairing = { ...roundPairings[ri], score: newScore };
    const newRoundPairings = [...roundPairings];
    newRoundPairings[ri] = newRoundPairing;
    // update state
    setState({
      matches,
      noMatch: newNoMatches,
      roundPairings: newRoundPairings,
    });
  };

  const handleUpdatePairs = (rn: number, li: number, gi: number) => {
    const newRoundPairing = !roundPairings[rn]
      ? { pairs: [], score: 0 }
      : { ...roundPairings[rn], pairs: [...roundPairings[rn].pairs] };
    newRoundPairing.pairs[li] = gi;
    const newRoundPairings = [...roundPairings];
    newRoundPairings[ri] = newRoundPairing;
    setState({ matches, noMatch, roundPairings: newRoundPairings });
  };

  const handleUpdateMatch = (li: number, gi: number) => {
    const newMatches = [...matches];
    const newNoMatches = noMatch.map((gentArray: boolean[]) => [...gentArray]);
    // if array for lady doesn't exist yet, create skeleton one
    if (!newNoMatches[li]) {
      newNoMatches[li] = [];
    }
    // assign new match
    newMatches[li] = gi;
    // make all gent options no matches
    for (let i = 0; i < gents.length; i += 1) {
      newNoMatches[li][i] = i !== gi;
    }
    // make all ladies options no matches
    for (let i = 0; i < ladies.length; i += 1) {
      if (!newNoMatches[i]) {
        newNoMatches[i] = [];
      }
      newNoMatches[i][gi] = i !== li;
    }

    const numMatches = newMatches.reduce(
      (acc, matchStatus) => (matchStatus >= 0 ? acc + 1 : acc),
      0,
    );

    // update round pairings
    const newRoundPairings = [...roundPairings];
    for (let rn = 0; rn < options.length - 1; rn += 1) {
      const { pairs, score } = roundPairings[rn] || {
        pairs: [],
        score: numMatches,
      };
      if (!roundPairings[rn] || pairs[li] < 0 || pairs[li] === undefined) {
        const newRoundPairing = {
          pairs: [...pairs],
          score: Math.max(score, numMatches),
        };
        newRoundPairing.pairs[li] = gi;
        newRoundPairings[rn] = newRoundPairing;
      }
    }

    // update state
    setState({
      matches: newMatches,
      noMatch: newNoMatches,
      roundPairings: newRoundPairings,
    });
  };

  return (
    <>
      <Typography variant="h2" component="h1">
        Are You The One?
      </Typography>
      <Controls
        onSelect={handleSelect}
        options={options}
        ri={ri}
        roundPairings={roundPairings}
        onBlackout={handleBlackout}
        updateScore={handleUpdateScore}
      />
      <br />
      <Table
        gents={gents}
        hist={hist}
        ladies={ladies}
        matches={matches}
        noMatch={noMatch}
        options={options}
        ri={ri}
        roundPairings={roundPairings}
        updateMatch={handleUpdateMatch}
        updateNoMatch={handleUpdateNoMatch}
        updatePairs={handleUpdatePairs}
      />
      <Analysis
        calculatedEquations={calculatedEquations}
        gents={gents}
        hist={hist}
        ladies={ladies}
        matches={matches}
        noMatch={noMatch}
        roundPairings={roundPairings}
        tempScore={tempScore}
      />
    </>
  );
};

export default AreYouTheOne;
