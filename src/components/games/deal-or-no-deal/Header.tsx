import React from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { getMoneyText } from "./helpers";
import { Briefcase } from "../../../recoil/deal-or-no-deal-atom";
import { DBPlayer } from "../../../recoil/player-atom";

interface HeaderProps {
  casesToOpen: number;
  isOver: boolean;
  newGame: React.MouseEventHandler;
  offer?: number;
  player: DBPlayer;
  playerChoice?: Briefcase;
}

const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
  const {
    playerChoice: pc,
    casesToOpen,
    isOver,
    offer,
    newGame,
    player,
  } = props;

  return (
    <Grid container spacing={1}>
      <Grid item sm={6} xs={12}>
        <Typography variant="h3" gutterBottom>
          {`Your Case: ${pc ? pc.loc : "?"}${
            isOver ? ` - ${getMoneyText(pc && pc.val)}` : ""
          }`}
        </Typography>
        <Typography variant="h4" gutterBottom>
          {isOver
            ? `You Won ${getMoneyText(offer)}`
            : `Number of Cases to Open: ${casesToOpen}`}
        </Typography>
        {isOver && (
          <Button color="primary" onClick={newGame} variant="contained">
            New Game
          </Button>
        )}
      </Grid>
      <Grid item sm={6} xs={12}>
        <Typography variant="h3" align="right" gutterBottom>
          {`${player.name}: ${getMoneyText(player.money)}`}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Header;
