import * as React from "react";
import { useRecoilState } from "recoil";
import {
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import {
  aytoSeasonSelector,
  RoundPairing,
} from "../../../recoil/are-you-the-one-atom";
import { seasons } from "../../../constants/ayto";

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

const ctrlStyles: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: "1em",
  alignItems: "center",
};

/** Controls component for Are You The One */
const Controls: React.FC<ControlsProps> = ({
  options,
  onSelect,
  roundNumber,
  roundPairings,
  onBlackout,
  updateScore,
}) => {
  // hooks/state
  const [season, setSeason] = useRecoilState(aytoSeasonSelector);
  const score = getScore(roundPairings[roundNumber]?.score);

  // handlers
  const selectSeason = (e: SelectChangeEvent<number>) =>
    setSeason(Number(e.target.value));
  const selectMatchup = (e: SelectChangeEvent<number>) =>
    onSelect(Number(e.target.value));
  const handleBlackout = () => onBlackout(roundPairings[roundNumber].pairs);
  const incrScore = () => updateScore(score + 1);
  const decrScore = () => updateScore(score - 1);

  return (
    <div style={ctrlStyles}>
      <FormControl>
        <InputLabel>Season</InputLabel>
        <Select label="Season" value={season} onChange={selectSeason}>
          {seasons.map((option, i) => (
            <MenuItem key={option} value={i}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel>Matchup</InputLabel>
        <Select label="Matchup" value={roundNumber} onChange={selectMatchup}>
          {options.map((option, i) => (
            <MenuItem key={option} value={i}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {roundNumber < options.length - 2 && (
        <>
          <Button variant="outlined" color="secondary" onClick={handleBlackout}>
            Blackout
          </Button>
          <div>
            <p style={{ display: "inline", marginRight: 15 }}>Score: {score}</p>
            <ButtonGroup variant="contained" aria-label="modify matchup score">
              <Button aria-label="decrement score" onClick={decrScore}>
                -
              </Button>
              <Button aria-label="increment score" onClick={incrScore}>
                +
              </Button>
            </ButtonGroup>
          </div>
        </>
      )}
    </div>
  );
};

export default Controls;
