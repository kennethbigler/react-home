import { useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import InfoPopup from "../../../common/info-popover/InfoPopup";
import { Bids } from "../../../../jotai/spades-atom";
import AddScorePlayer from "./AddScorePlayer";

interface AddScoreProps {
  initials: string;
  lastBid: Bids;
  onScoreSave: (mades: [number, number, number, number]) => void;
}

const AddScore = ({ initials, lastBid, onScoreSave }: AddScoreProps) => {
  const [made0, setMade0] = useState(3);
  const [made1, setMade1] = useState(3);
  const [made2, setMade2] = useState(3);
  const [made3, setMade3] = useState(3);

  const total = made0 + made1 + made2 + made3;

  const handleAddScore = () => {
    onScoreSave([made0, made1, made2, made3]);
    setMade0(3);
    setMade1(3);
    setMade2(3);
    setMade3(3);
  };

  const handleSave = total === 13 ? handleAddScore : undefined;

  return (
    <InfoPopup title="+ Score" onSave={handleSave}>
      <Typography
        color={total === 13 ? "success" : "warning"}
        align="center"
        marginBottom={1}
      >
        {total !== 13 && "⚠️"} Tricks: {total}
      </Typography>
      <Grid container spacing={2}>
        <AddScorePlayer
          initial={initials[0]}
          lastBid={lastBid[0].bid}
          made={made0}
          setMade={setMade0}
        />
        <AddScorePlayer
          initial={initials[1]}
          lastBid={lastBid[1].bid}
          made={made1}
          setMade={setMade1}
        />
        <AddScorePlayer
          initial={initials[2]}
          lastBid={lastBid[2].bid}
          made={made2}
          setMade={setMade2}
        />
        <AddScorePlayer
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
