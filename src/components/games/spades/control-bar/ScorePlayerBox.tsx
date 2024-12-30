import * as React from "react";
import { MAX_BID, MIN_BID } from "../../../../jotai/spades-atom";
import Grid from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import Add from "@mui/icons-material/Add";
import Remove from "@mui/icons-material/Remove";
import { Typography } from "@mui/material";

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
  const decrMade = () => setMade(Math.max(made - 1, MIN_BID));
  const incrMade = () => setMade(Math.min(made + 1, MAX_BID));

  return (
    <Grid size={6}>
      <Typography>
        {initial} Bid: {lastBid}
      </Typography>
      <div>
        Made:
        <IconButton onClick={decrMade} disabled={made <= MIN_BID}>
          <Remove />
        </IconButton>
        {made}
        <IconButton onClick={incrMade} disabled={made >= MAX_BID}>
          <Add />
        </IconButton>
      </div>
    </Grid>
  );
};

export default ScorePlayerBox;
