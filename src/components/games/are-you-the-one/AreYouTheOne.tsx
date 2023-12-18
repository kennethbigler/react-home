import * as React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import Controls from "./Controls";
import Table from "./table/Table";
import Analysis from "./analysis/Analysis";
import aYTOAtom, {
  aytoPlayerSelector,
} from "../../../recoil/are-you-the-one-atom";
import useHist from "./histogram/useHist";

const AreYouTheOne = () => {
  const [{ matches, noMatch, roundPairings }, setState] =
    useRecoilState(aYTOAtom);
  const { ladies, gents, options } = useRecoilValue(aytoPlayerSelector);

  // state
  const [roundNumber, setRoundNumber] = React.useState(0);
  const { hist, tempScore, calculatedEquations } = useHist(
    ladies.length,
    matches,
    noMatch,
    roundPairings,
  );

  // handlers
  const handleSelect = (selected: number) => {
    setRoundNumber(selected);
  };

  const handleUpdateScore = (score: number) => {
    const newRoundPairing = !roundPairings[roundNumber]
      ? { pairs: [], score: 0 }
      : { ...roundPairings[roundNumber] };
    newRoundPairing.score = score;
    const newRoundPairings = [...roundPairings];
    newRoundPairings[roundNumber] = newRoundPairing;
    setState({ matches, noMatch, roundPairings: newRoundPairings });
  };

  const handleUpdateNoMatch = (li: number, gi: number) => {
    const newMatches = noMatch.map((gentArray: boolean[]) => [...gentArray]);
    // if array for lady doesn't exist yet, create skeleton one
    !newMatches[li] && (newMatches[li] = []);
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
        !newNoMatches[li] && (newNoMatches[li] = []);
        // assign no match
        newNoMatches[li][gi] = true;
      }
    });
    const newRoundPairing = { ...roundPairings[roundNumber], score: newScore };
    const newRoundPairings = [...roundPairings];
    newRoundPairings[roundNumber] = newRoundPairing;
    // update state
    setState({
      matches,
      noMatch: newNoMatches,
      roundPairings: newRoundPairings,
    });
  };

  const handleUpdatePairs = (ri: number, li: number, gi: number) => {
    const newRoundPairing = !roundPairings[ri]
      ? { pairs: [], score: 0 }
      : { ...roundPairings[ri], pairs: [...roundPairings[ri].pairs] };
    newRoundPairing.pairs[li] = gi;
    const newRoundPairings = [...roundPairings];
    newRoundPairings[roundNumber] = newRoundPairing;
    setState({ matches, noMatch, roundPairings: newRoundPairings });
  };

  const handleUpdateMatch = (li: number, gi: number) => {
    const newMatches = [...matches];
    const newNoMatches = noMatch.map((gentArray: boolean[]) => [...gentArray]);
    // if array for lady doesn't exist yet, create skeleton one
    !newNoMatches[li] && (newNoMatches[li] = []);
    // assign new match
    newMatches[li] = gi;
    // make all gent options no matches
    for (let i = 0; i < gents.length; i += 1) {
      newNoMatches[li][i] = i !== gi;
    }
    // make all ladies options no matches
    for (let i = 0; i < ladies.length; i += 1) {
      !newNoMatches[i] && (newNoMatches[i] = []);
      newNoMatches[i][gi] = i !== li;
    }

    const numMatches = newMatches.reduce(
      (acc, matchStatus) => (matchStatus >= 0 ? acc + 1 : acc),
      0,
    );

    // update round pairings
    const newRoundPairings = [...roundPairings];
    for (let ri = 0; ri < options.length - 2; ri += 1) {
      const { pairs, score } = roundPairings[ri] || {
        pairs: [],
        score: numMatches,
      };
      if (!roundPairings[ri] || pairs[li] < 0 || pairs[li] === undefined) {
        const newRoundPairing = {
          pairs: [...pairs],
          score: Math.max(score, numMatches),
        };
        newRoundPairing.pairs[li] = gi;
        newRoundPairings[ri] = newRoundPairing;
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
      <h1>Are You The One?</h1>
      <Controls
        onSelect={handleSelect}
        options={options}
        roundNumber={roundNumber}
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
        roundNumber={roundNumber}
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
