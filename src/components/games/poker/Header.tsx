import { memo } from "react";
import Typography from "@mui/material/Typography";
import PlayerMenu from "../../common/header/PlayerMenu";

const Header = memo(() => (
  <div className="flex-container">
    <Typography variant="h2" component="h1" gutterBottom>
      5 Card Draw Poker
    </Typography>
    <PlayerMenu />
  </div>
));

Header.displayName = "Header";

export default Header;
