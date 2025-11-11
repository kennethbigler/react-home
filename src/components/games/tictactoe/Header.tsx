import { memo, MouseEventHandler } from "react";
import { Button, Toolbar, Typography } from "@mui/material";
interface HeaderProps {
  newGame: MouseEventHandler;
  turn: string;
  winner: string | null;
}

const Header = memo(({ winner, turn, newGame }: HeaderProps) => (
  <Toolbar>
    <Typography style={{ flex: 1 }} variant="h4" component="h2">
      {winner ? `Winner: ${winner}` : `Turn: ${turn}`}
    </Typography>
    <Button onClick={newGame} variant="contained">
      Reset Game
    </Button>
  </Toolbar>
));

Header.displayName = "Header";

export default Header;
