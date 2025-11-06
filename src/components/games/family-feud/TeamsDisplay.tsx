import { memo } from "react";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";

interface TeamsDisplayProps {
  score1: number;
  score2: number;
}

const TeamsDisplay = memo(({ score1, score2 }: TeamsDisplayProps) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-around",
      textAlign: "center",
    }}
  >
    <div>
      <Typography variant="h3" component="h2">
        Team 1
      </Typography>
      <Chip label={score1} color="primary" />
    </div>
    <div>
      <Typography variant="h3" component="h2">
        Team 2
      </Typography>
      <Chip label={score2} color="primary" />
    </div>
  </div>
));

TeamsDisplay.displayName = "TeamsDisplay";

export default TeamsDisplay;
