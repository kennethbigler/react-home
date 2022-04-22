import React from "react";
import { useDispatch, useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import { DBRootState } from "../../../../store/types";
import { updateScore } from "../../../../store/modules/ayto";
import Dropdown from "./Dropdown";
import { options } from "../../../../constants/ayto";

interface ControlsProps {
  roundNumber: number;
  onSelect: (index: number) => void;
}

// eslint-disable-next-line no-restricted-globals
const getScore = (value: number) => (isNaN(value) ? -1 : value);

const Controls = (props: ControlsProps) => {
  const { roundNumber, onSelect } = props;

  // Redux
  const { roundPairings } = useSelector((state: DBRootState) => ({
    ...state.ayto,
  }));
  const dispatch = useDispatch();

  // hooks/state
  const [score, setScore] = React.useState(
    getScore(roundPairings[roundNumber]?.score)
  );

  // handlers
  const handleTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setScore(parseInt(event.target.value, 10) || 0);
    dispatch(updateScore(parseInt(event.target.value, 10), roundNumber));
  };

  const handleSelect = (index: number) => {
    setScore(getScore(roundPairings[index]?.score));
    onSelect(index);
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <Dropdown roundNumber={roundNumber} onSelect={handleSelect} />
      {roundNumber < options.length - 2 && (
        <TextField
          id="score-input"
          label="Score"
          variant="outlined"
          type="number"
          value={score}
          onChange={handleTextFieldChange}
        />
      )}
    </div>
  );
};

export default Controls;
