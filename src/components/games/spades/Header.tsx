import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import PlayerMenu from "../../common/header/PlayerMenu";

interface HeaderProps {
  initials: string;
  overBids: [number, number, number, number];
  wins1: number;
  wins2: number;
}

const Header = ({ initials, overBids, wins1, wins2 }: HeaderProps) => (
  <>
    <div className="flex-container">
      <Typography variant="h2" component="h1">
        ♠️&nbsp;🧮
      </Typography>
      <PlayerMenu />
    </div>
    <br aria-hidden />
    <div className="flex-container">
      <Chip
        avatar={<Avatar>{initials[0] + initials[2]}</Avatar>}
        color={wins1 >= wins2 ? "success" : "error"}
        label={wins1}
      />
      <Chip
        avatar={<Avatar>💰</Avatar>}
        label={`${initials[0]} ${overBids[0]} | ${initials[1]} ${overBids[1]} | ${initials[2]} ${overBids[2]} | ${initials[3]} ${overBids[3]}`}
      />
      <Chip
        avatar={<Avatar>{initials[1] + initials[3]}</Avatar>}
        color={wins2 >= wins1 ? "success" : "error"}
        label={wins2}
      />
    </div>
  </>
);

export default Header;
