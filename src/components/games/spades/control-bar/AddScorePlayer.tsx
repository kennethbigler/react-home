import { Dispatch, SetStateAction } from "react";
import Add from "@mui/icons-material/Add";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Remove from "@mui/icons-material/Remove";
import Typography from "@mui/material/Typography";
import { MAX_BID, MIN_BID } from "../../../../jotai/spades-atom";

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
