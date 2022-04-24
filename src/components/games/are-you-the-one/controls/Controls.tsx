import React from "react";
import { useDispatch, useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { DBRootState } from "../../../../store/types";
import { updateScore, updateNoMatch } from "../../../../store/modules/ayto";
import Dropdown from "./Dropdown";

interface ControlsProps {
  roundNumber: number;
  options: string[];
  onSelect: (index: number) => void;
}

// eslint-disable-next-line no-restricted-globals
const getScore = (value: number) => (isNaN(value) ? -1 : value);

const Controls = (props: ControlsProps) => {
  const { roundNumber, options, onSelect } = props;

  // Redux
  const { roundPairings, matches, noMatch } = useSelector(
    (state: DBRootState) => ({ ...state.ayto })
  );
  const dispatch = useDispatch();

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
        dispatch(updateNoMatch(li, gi));
      }
    });
  };

  const handleTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setScore(parseInt(event.target.value, 10) || 0);
    dispatch(updateScore(parseInt(event.target.value, 10), roundNumber));
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
