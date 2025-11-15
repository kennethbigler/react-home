import PlayerMenu from "../../common/header/PlayerMenu";
import { getChipColor } from "./spadesHelpers";
import { Avatar, Chip, Typography } from "@mui/material";

interface HeaderProps {
  initials: string;
  wins1: number;
  wins2: number;
}

const Header = ({ initials, wins1, wins2 }: HeaderProps) => (
  <>
    <div className="flex-container">
      <Typography variant="h2" component="h1">
        ♠️🧮
      </Typography>
      <Chip
        avatar={<Avatar>{initials[0] + initials[2]}</Avatar>}
        color={getChipColor(wins1, wins2)}
        label={wins1}
      />
      <Chip
        avatar={<Avatar>{initials[1] + initials[3]}</Avatar>}
        color={getChipColor(wins2, wins1)}
        label={wins2}
      />
      <PlayerMenu />
    </div>
  </>
);

export default Header;
