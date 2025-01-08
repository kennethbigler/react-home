import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import PlayerMenu from "../../common/header/PlayerMenu";

interface HeaderProps {
  initials: string;
  wins1: number;
  wins2: number;
}

const Header = React.memo(({ initials, wins1, wins2 }: HeaderProps) => (
  <div className="flex-container">
    <Typography variant="h2">♠️</Typography>
    <Chip
      avatar={<Avatar>{initials[1] + initials[3]}</Avatar>}
      color={wins2 >= wins1 ? "success" : "error"}
      label={wins2}
    />
    <Chip
      avatar={<Avatar>{initials[0] + initials[2]}</Avatar>}
      color={wins1 >= wins2 ? "success" : "error"}
      label={wins1}
    />
    <PlayerMenu />
  </div>
));

Header.displayName = "Header";

export default Header;
