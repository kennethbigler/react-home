import { memo } from "react";
import InfoPopup from "../../common/info-popover/InfoPopup";
import Rules from "./Rules";
import Help from "./help";
import PlayerMenu from "../../common/header/PlayerMenu";
import { Typography } from "@mui/material";

const Header = memo(() => (
  <div className="flex-container">
    <Typography variant="h2" component="h1" gutterBottom>
      Blackjack (21)
    </Typography>
    <PlayerMenu />
    <InfoPopup title="Rules">
      <Rules />
      <Help />
    </InfoPopup>
  </div>
));

Header.displayName = "Header";

export default Header;
