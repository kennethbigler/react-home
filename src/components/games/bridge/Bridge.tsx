import { Typography } from "@mui/material";
import BidDialog from "./bid-dialog/BidDialog";
import ScoreDialog from "./score-dialog/ScoreDialog";
import ScoreDisplay from "./ScoreDisplay";

const Bridge = () => (
  <>
    <div className="flex-container">
      <Typography variant="h2" component="h1">
        🌉
      </Typography>
      <BidDialog />
      <ScoreDialog />
    </div>
    <ScoreDisplay />
  </>
);

export default Bridge;
