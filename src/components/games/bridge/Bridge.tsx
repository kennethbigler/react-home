import Typography from "@mui/material/Typography";
import InfoPopup from "../../common/info-popover/InfoPopup";

const Bridge = () => (
  <div className="flex-container">
    <Typography variant="h2" component="h1">
      🌉
    </Typography>
    <InfoPopup title="Bid">Bid</InfoPopup>
    <InfoPopup title="Score">Score</InfoPopup>
  </div>
);

export default Bridge;
