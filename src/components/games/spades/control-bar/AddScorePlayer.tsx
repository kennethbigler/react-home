import { Dispatch, SetStateAction } from "react";
import Add from "@mui/icons-material/Add";
import Remove from "@mui/icons-material/Remove";
import { MAX_BID, MIN_BID } from "../../../../jotai/spades-atom";
import { Grid, IconButton, Typography } from "@mui/material";

interface AddScorePlayerProps {
  initial: string;
  lastBid: number;
  made: number;
  setMade: Dispatch<SetStateAction<number>>;
}

const AddScorePlayer = ({
  initial,
  lastBid,
  made,
  setMade,
}: AddScorePlayerProps) => {
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
          <Remove aria-label="decrease" />
        </IconButton>
        {made}
        <IconButton onClick={incrMade} disabled={made >= MAX_BID}>
          <Add aria-label="increase" />
        </IconButton>
      </div>
    </Grid>
  );
};

export default AddScorePlayer;
