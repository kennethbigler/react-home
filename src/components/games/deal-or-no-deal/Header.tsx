import React from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { getMoneyText } from "./helpers";
import { Briefcase } from "../../../recoil/deal-or-no-deal-state";
import { DBPlayer } from "../../../recoil/player-atom";

interface HeaderProps {
  casesToOpen: number;
  isOver: number;
  newGame: React.MouseEventHandler;
  player: DBPlayer;
  playerChoice?: Briefcase;
  dndOpen?: boolean;
}

const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
  const {
    playerChoice: pc,
    casesToOpen,
    isOver,
    newGame,
    player,
    dndOpen,
  } = props;

  return (
    <Grid container spacing={1}>
      <Grid item sm={6} xs={12}>
        <Typography variant="h3" component="h2" gutterBottom>
          {`Your Case: ${pc ? pc.loc : "?"}${
            isOver ? ` - ${getMoneyText(pc && pc.val)}` : ""
          }`}
        </Typography>
        <Typography variant="h4" component="h3" gutterBottom>
          {!dndOpen &&
            (isOver
              ? `You Won ${getMoneyText(isOver)}`
              : `Number of Cases to Open: ${casesToOpen}`)}
        </Typography>
        {isOver ? (
          <Button onClick={newGame} variant="contained">
            New Game
          </Button>
        ) : null}
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
