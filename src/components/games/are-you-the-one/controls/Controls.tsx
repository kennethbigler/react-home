import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { RoundPairing } from "../../../../store/types";
import Dropdown from "./Dropdown";

interface ControlsProps {
  /** [lady-i: (gent-i | -1), -1, -1, ...] */
  matches: number[];
  /** [lady-i: [gent-i: bool]] */
  noMatch: boolean[][];
  onSelect: (index: number) => void;
  options: string[];
  roundNumber: number;
  /** [round-i: RoundPairing] */
  roundPairings: RoundPairing[];
  updateScore: (score: number) => void;
  updateNoMatch: (li: number, gi: number) => void;
}

// eslint-disable-next-line no-restricted-globals
const getScore = (value: number) => (isNaN(value) ? -1 : value);

const Controls = (props: ControlsProps) => {
  const {
    matches,
    noMatch,
    options,
    onSelect,
    roundNumber,
    roundPairings,
    updateNoMatch,
    updateScore,
  } = props;

  // hooks/state
  const [score, setScore] = React.useState(
    getScore(roundPairings[roundNumber]?.score)
  );

  // handlers
  const handleSelect = (index: number) => {
    setScore(getScore(roundPairings[index]?.score));
    onSelect(index);
  };

  const handleBlackout = () => {
    roundPairings[roundNumber].pairs.forEach((gi, li) => {
      if (matches[li] !== gi && !noMatch[li][gi]) {
        updateNoMatch(li, gi);
      }
    });
  };

  const handleTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setScore(parseInt(event.target.value, 10) || 0);
    updateScore(parseInt(event.target.value, 10));
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <Dropdown
        roundNumber={roundNumber}
        options={options}
        onSelect={handleSelect}
      />
      {roundNumber < options.length - 2 && (
        <>
          <Button variant="outlined" onClick={handleBlackout}>
            Blackout
          </Button>
          <TextField
            id="score-input"
            label="Score"
            variant="outlined"
            type="number"
            value={score}
            onChange={handleTextFieldChange}
          />
        </>
      )}
    </div>
  );
};

export default Controls;
