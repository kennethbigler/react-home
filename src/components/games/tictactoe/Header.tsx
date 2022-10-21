import React from "react";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

interface HeaderProps {
  newGame: React.MouseEventHandler;
  turn: string;
  winner: string | null;
}

const Header: React.FC<HeaderProps> = React.memo(
  ({ winner, turn, newGame }: HeaderProps) => (
    <Toolbar>
      <Typography style={{ flex: 1 }} variant="h4" component="h2">
        {winner ? `Winner: ${winner}` : `Turn: ${turn}`}
      </Typography>
      <Button onClick={newGame} variant="contained">
        Reset Game
      </Button>
    </Toolbar>
  )
);

export default Header;
