import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { RoundPairing } from "../../../../recoil/are-you-the-one-atom";
import Dropdown from "./Dropdown";

interface ControlsProps {
  onSelect: (index: number) => void;
  options: string[];
  roundNumber: number;
  /** [round-i: RoundPairing] */
  roundPairings: RoundPairing[];
  updateScore: (score: number) => void;
  onBlackout: (pairs: number[]) => void;
}

// eslint-disable-next-line no-restricted-globals
const getScore = (value: number) => (isNaN(value) ? -1 : value);

const Controls = (props: ControlsProps) => {
  const {
    options,
    onSelect,
    roundNumber,
    roundPairings,
    onBlackout,
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

  const handleBlackout = () => onBlackout(roundPairings[roundNumber].pairs);

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
          <Button variant="outlined" color="secondary" onClick={handleBlackout}>
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
