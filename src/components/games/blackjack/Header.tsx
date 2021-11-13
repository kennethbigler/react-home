import React from "react";
import Typography from "@mui/material/Typography";
import InfoPopup from "../../common/info-popover/InfoPopup";
import Rules from "./Rules";
import Help from "./help";

const Header: React.FC = React.memo(() => (
  <div className="flex-container">
    <Typography variant="h2" gutterBottom>
      Blackjack (21)
    </Typography>
    <InfoPopup title="Rules">
      <Rules />
      <Help />
    </InfoPopup>
  </div>
));

export default Header;
