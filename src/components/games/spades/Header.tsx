import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import PlayerMenu from "../../common/header/PlayerMenu";

interface HeaderProps {
  initials: string;
  wins1: number;
  wins2: number;
  bags: [number, number, number, number];
}

const Header = ({ initials, wins1, wins2, bags }: HeaderProps) => (
  <>
    <div className="flex-container">
      <Typography variant="h2" component="h1">
        ♠️ Scores
      </Typography>
      <PlayerMenu />
    </div>
    <div className="flex-container">
      <Chip
        avatar={<Avatar>{initials[0] + initials[2]}</Avatar>}
        color={wins1 >= wins2 ? "success" : "error"}
        label={wins1}
      />
      <Chip
        avatar={<Avatar>💰</Avatar>}
        color="warning"
        label={`${initials[0]} ${bags[0]} | ${initials[1]} ${bags[1]} | ${initials[2]} ${bags[2]} | ${initials[3]} ${bags[3]}`}
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
