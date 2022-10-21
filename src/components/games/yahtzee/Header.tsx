import React from "react";
import Typography from "@mui/material/Typography";
import ScoreGraph from "./ScoreGraph";

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
    <Typography variant="h1">Yahtzee</Typography>
    <div className="flex-container">
      <Typography variant="h4" component="h2">
        {name}: ${money}
      </Typography>
      <ScoreGraph scores={scores} />
    </div>
  </>
);

export default Header;
