import * as React from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { getMoneyText } from "./helpers";
import { Briefcase } from "../../../jotai/deal-or-no-deal-state";

interface HeaderProps {
  casesToOpen: number;
  isOver: number;
  newGame: React.MouseEventHandler;
  name: string;
  money: number;
  playerChoice?: Briefcase;
  dndOpen?: boolean;
}

const Header = ({
  playerChoice: pc,
  casesToOpen,
  isOver,
  newGame,
  name,
  money,
  dndOpen,
}: HeaderProps) => (
  <Grid container spacing={1}>
    <Grid size={{ xs: 12, sm: 6 }}>
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
      {isOver && (
        <Button onClick={newGame} variant="contained">
          New Game
        </Button>
      )}
    </Grid>
    <Grid size={{ xs: 12, sm: 6 }}>
      <Typography variant="h3" align="right" gutterBottom>
        {`${name}: ${getMoneyText(money)}`}
      </Typography>
    </Grid>
  </Grid>
);

export default Header;
