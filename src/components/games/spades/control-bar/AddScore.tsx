import * as React from "react";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import InfoPopup from "../../../common/info-popover/InfoPopup";
import { Bids } from "../../../../jotai/spades-atom";
import ScorePlayerBox from "./ScorePlayerBox";

interface AddScoreProps {
  initials: [string, string, string, string];
  lastBid: Bids;
  onScoreSave: (mades: [number, number, number, number]) => void;
}

const AddScore = ({ initials, lastBid, onScoreSave }: AddScoreProps) => {
  const [made0, setMade0] = React.useState(lastBid[0].bid);
  const [made1, setMade1] = React.useState(lastBid[1].bid);
  const [made2, setMade2] = React.useState(lastBid[2].bid);
  const [made3, setMade3] = React.useState(lastBid[3].bid);

  const total = made0 + made1 + made2 + made3;

  const handleAddScore =
    total === 13 ? () => onScoreSave([made0, made1, made2, made3]) : undefined;

  return (
    <InfoPopup title="+ Score" onSave={handleAddScore}>
      <Typography
        color={total === 13 ? "success" : "warning"}
        align="center"
        marginBottom={1}
      >
        {total !== 13 && "⚠️"} Tricks: {total}
      </Typography>
      <Grid container spacing={2}>
        <ScorePlayerBox
          initial={initials[0]}
          lastBid={lastBid[0].bid}
          made={made0}
          setMade={setMade0}
        />
        <ScorePlayerBox
          initial={initials[1]}
          lastBid={lastBid[1].bid}
          made={made1}
          setMade={setMade1}
        />
        <ScorePlayerBox
          initial={initials[2]}
          lastBid={lastBid[2].bid}
          made={made2}
          setMade={setMade2}
        />
        <ScorePlayerBox
          initial={initials[3]}
          lastBid={lastBid[3].bid}
          made={made3}
          setMade={setMade3}
        />
      </Grid>
    </InfoPopup>
  );
};

export default AddScore;
