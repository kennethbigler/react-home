import React from "react";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Piece from "./Piece";
import { C4Turn } from "../../../recoil/connect4-atom";

interface HeaderProps {
  newGame: React.MouseEventHandler;
  turn: C4Turn;
  winner?: number;
}

const Header: React.FC<HeaderProps> = React.memo((props: HeaderProps) => {
  const { winner, turn, newGame } = props;
  // status text
  const status = winner ? "Winner:" : "Turn:";
  const piece = winner || turn;

  return (
    <Toolbar>
      <div className="flex-container">
        <div style={{ display: "flex", alignItems: "center" }}>
          <Typography style={{ marginRight: 10 }} variant="h6">
            {status}
          </Typography>
          <Piece piece={piece} />
        </div>
        <Button color="primary" onClick={newGame} variant="contained">
          Reset Game
        </Button>
      </div>
    </Toolbar>
  );
});

export default Header;
