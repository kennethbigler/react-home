import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Controls from "./controls/Controls";
import Table from "./table/Table";
import Analysis from "./analysis/Analysis";
import { ladies, gents, options } from "../../../constants/ayto";
import { DBRootState } from "../../../store/types";
import {
  updateMatch,
  updateNoMatch,
  updatePairs,
  updateScore,
} from "../../../store/modules/ayto";

/**
 * TODO:
 * replace Dropdown with MUI Dropdown when available
 * if an equation exists in another equation, sub it out for remaining number
 * useHist needs to move to this file
 */
const AreYouTheOne = () => {
  // Redux
  const { roundPairings, noMatch, matches } = useSelector(
    (state: DBRootState) => ({ ...state.ayto })
  );
  const dispatch = useDispatch();

  // state
  const [roundNumber, setRoundNumber] = React.useState(0);

  // handlers
  const handleSelect = (selected: number) => {
    setRoundNumber(selected);
  };
  const handleUpdateScore = (score: number) => {
    dispatch(updateScore(score, roundNumber));
  };
  const handleUpdateNoMatch = (li: number, gi: number) => {
    dispatch(updateNoMatch(li, gi));
  };
  const handleUpdatePairs = (ri: number, li: number, gi: number) => {
    dispatch(updatePairs(ri, li, gi));
  };
  const handleUpdateMatch = (li: number, gi: number) => {
    dispatch(updateMatch(li, gi));
    for (let ri = 0; ri < options.length - 2; ri += 1) {
      if (
        !roundPairings[ri] ||
        roundPairings[ri].pairs[li] < 0 ||
        roundPairings[ri].pairs[li] === undefined
      ) {
        dispatch(updatePairs(ri, li, gi));
      }
    }
  };

  return (
    <>
      <h1>Are You The One?</h1>
      <Controls
        matches={matches}
        noMatch={noMatch}
        onSelect={handleSelect}
        options={options}
        roundNumber={roundNumber}
        roundPairings={roundPairings}
        updateNoMatch={handleUpdateNoMatch}
        updateScore={handleUpdateScore}
      />
      <br />
      <Table
        gents={gents}
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
        gents={gents}
        ladies={ladies}
        matches={matches}
        noMatch={noMatch}
        roundPairings={roundPairings}
      />
    </>
  );
};

export default AreYouTheOne;