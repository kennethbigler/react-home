import { MouseEventHandler, memo } from "react";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Piece from "./Piece";
import { C4Turn } from "../../../jotai/connect4-atom";

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
