import { CSSProperties } from "react";
import { useAtom } from "jotai";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { SelectChangeEvent } from "@mui/material";
import {
  aytoSeasonState,
  RoundPairing,
} from "../../../jotai/are-you-the-one-state";
import { seasons } from "../../../constants/ayto";

interface ControlsProps {
  /** round options, last is Truth Booth (TB) */
  options: string[];
  ri: number;
  /** [round-i: RoundPairing] */
  roundPairings: RoundPairing[];
  // functions
  onBlackout: (pairs: number[]) => void;
  onSelect: (index: number) => void;
  updateScore: (score: number) => void;
}

const getScore = (value: number) => (isNaN(value) ? -1 : value);

const ctrlStyles: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: "1em",
  alignItems: "center",
};

/** Controls component for Are You The One */
const Controls = ({
  options,
  onSelect,
  ri,
  roundPairings,
  onBlackout,
  updateScore,
}: ControlsProps) => {
  // hooks/state
  const [season, setSeason] = useAtom(aytoSeasonState);
  const score = getScore(roundPairings[ri]?.score);

  // handlers
  const selectSeason = (e: SelectChangeEvent<number>) =>
    setSeason(Number(e.target.value));
  const selectMatchup = (e: SelectChangeEvent<number>) =>
    onSelect(Number(e.target.value));
  const handleBlackout = () => onBlackout(roundPairings[ri].pairs);
  const incrScore = () => updateScore(score + 1);
  const decrScore = () => updateScore(score - 1);

  return (
    <div style={ctrlStyles}>
      <FormControl>
        <InputLabel id="season-select">Season</InputLabel>
        <Select
          labelId="season-select"
          label="Season"
          value={season}
          onChange={selectSeason}
        >
          {seasons.map((option, i) => (
            <MenuItem key={option} value={i}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel id="matchup-select">Matchup</InputLabel>
        <Select
          labelId="matchup-select"
          label="Matchup"
          value={ri}
          onChange={selectMatchup}
        >
          {options.map((option, i) => (
            <MenuItem key={option} value={i}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {ri < options.length - 1 && (
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
