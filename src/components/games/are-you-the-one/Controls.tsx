import * as React from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { useRecoilState } from "recoil";
import {
  aytoSeasonSelector,
  RoundPairing,
} from "../../../recoil/are-you-the-one-atom";
import { seasons } from "../../../constants/ayto";
import Dropdown from "../../common/dropdown/Dropdown";

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
  const [score, setScore] = React.useState(
    getScore(roundPairings[roundNumber]?.score),
  );

  // handlers
  const handleSeasonSelect = (newSeason: number) => setSeason(newSeason);
  const handleMatchupSelect = (index: number) => {
    setScore(getScore(roundPairings[index]?.score));
    onSelect(index);
  };

  const handleBlackout = () => {
    onBlackout(roundPairings[roundNumber].pairs);
    setScore(0);
  };

  const incrScore = () => {
    setScore(score + 1);
    updateScore(score + 1);
  };
  const decrScore = () => {
    setScore(score - 1);
    updateScore(score - 1);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "1em",
      }}
    >
      <Dropdown
        ariaLabel="select season"
        value={season}
        options={seasons}
        onSelect={handleSeasonSelect}
      />
      <Dropdown
        ariaLabel="select matchup"
        value={roundNumber}
        options={options}
        onSelect={handleMatchupSelect}
      />
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
