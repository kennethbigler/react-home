import { MouseEventHandler, memo } from "react";
import Piece from "./Piece";
import { C4Turn } from "../../../jotai/connect4-atom";
import { Button, Toolbar, Typography } from "@mui/material";

interface HeaderProps {
  newGame: MouseEventHandler;
  turn: C4Turn;
  winner?: number;
}

const Header = memo(({ winner, turn, newGame }: HeaderProps) => (
  <Toolbar>
    <div className="flex-container">
      <div style={{ display: "flex", alignItems: "center" }}>
        <Typography style={{ marginRight: 10 }} variant="h4" component="h2">
          {winner ? "Winner:" : "Turn:"}
        </Typography>
        <Piece piece={winner || turn} />
      </div>
      <Button onClick={newGame} variant="contained">
        Reset Game
      </Button>
    </div>
  </Toolbar>
));

Header.displayName = "Header";

export default Header;
