import * as React from "react";
import { MAX_BID, MIN_BID } from "../../../../jotai/spades-atom";
import Grid from "@mui/material/Grid2";
import Slider from "@mui/material/Slider";

interface ScorePlayerBoxProps {
  initial: string;
  lastBid: number;
  made: number;
  setMade: React.Dispatch<React.SetStateAction<number>>;
}

const ScorePlayerBox = ({
  initial,
  lastBid,
  made,
  setMade,
}: ScorePlayerBoxProps) => {
  const handleScore = (_e: Event, value: number | number[]) => {
    const newNum = Array.isArray(value) ? value[0] : value;
    setMade(newNum);
  };

  return (
    <Grid size={6}>
      <div>
        {initial} Bid: {lastBid}
      </div>
      <div>Made: {made}</div>
      <Slider
        aria-label={`player ${0} made`}
        min={MIN_BID}
        max={MAX_BID}
        value={made}
        valueLabelDisplay="auto"
        onChange={handleScore}
      />
    </Grid>
  );
};

export default ScorePlayerBox;
