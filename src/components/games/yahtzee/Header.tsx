import * as React from "react";
import Typography from "@mui/material/Typography";
import PlayerMenu from "../../common/header/PlayerMenu";

interface HeaderProps {
  bestScore: number;
  lastScore: number;
  money: number;
  name: string;
}

const Header: React.FC<HeaderProps> = ({
  bestScore,
  lastScore,
  money,
  name,
}: HeaderProps) => (
  <>
    <div className="flex-container">
      <Typography variant="h2" component="h1">
        Yahtzee
      </Typography>
      <PlayerMenu />
    </div>
    <div className="flex-container">
      <Typography variant="h4" component="h2">
        {name}: ${money}
      </Typography>
      <Typography variant="h4">{`Best: ${bestScore}`}</Typography>
      <Typography variant="h4">{`Last: ${lastScore}`}</Typography>
    </div>
  </>
);

export default Header;
