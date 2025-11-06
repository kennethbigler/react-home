import { memo } from "react";
import Chip from "@mui/material/Chip";

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
      <h2>Team 1</h2>
      <Chip label={score1} color="primary" />
    </div>
    <div>
      <h2>Team 2</h2>
      <Chip label={score2} color="primary" />
    </div>
  </div>
));

TeamsDisplay.displayName = "TeamsDisplay";

export default TeamsDisplay;
