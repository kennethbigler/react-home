import { Typography } from "@mui/material";
import InfoPopup from "../../common/info-popover/InfoPopup";
import BidDialog from "./bid-dialog/BidDialog";
import ScoreDialog from "./score-dialog/ScoreDialog";

const Bridge = () => (
  <div className="flex-container">
    <Typography variant="h2" component="h1">
      🌉
    </Typography>
    <InfoPopup title="Bid">
      <BidDialog />
    </InfoPopup>
    <InfoPopup title="Score">
      <ScoreDialog />
    </InfoPopup>
  </div>
);

export default Bridge;
