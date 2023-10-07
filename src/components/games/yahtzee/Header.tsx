import * as React from "react";
import Typography from "@mui/material/Typography";
import ScoreGraph from "./ScoreGraph";
import PlayerMenu from "../../common/header/PlayerMenu";

interface HeaderProps {
  scores: number[];
  money: number;
  name: string;
}

const Header: React.FC<HeaderProps> = ({
  scores,
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
      <ScoreGraph scores={scores} />
    </div>
  </>
);

export default Header;
