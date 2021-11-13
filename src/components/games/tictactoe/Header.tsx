import React from "react";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

interface HeaderProps {
  newGame: React.MouseEventHandler;
  turn: string;
  winner?: string;
}

const Header: React.FC<HeaderProps> = React.memo(
  ({ winner, turn, newGame }: HeaderProps) => (
    <Toolbar>
      <Typography style={{ flex: 1 }} variant="h6">
        {winner ? `Winner: ${winner}` : `Turn: ${turn}`}
      </Typography>
      <Button
        color="primary"
        onClick={newGame}
        variant="contained"
        role="button"
      >
        Reset Game
      </Button>
    </Toolbar>
  )
);

export default Header;
