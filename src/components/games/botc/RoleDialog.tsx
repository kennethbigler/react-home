import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { ReactNode } from "react";
import { BotCPlayer } from "../../../recoil/botc-atom";
import { tb, snv, bmr } from "../../../constants/botc";
import RoleButton from "./RoleButton";

interface RoleDialogProps {
  script: number;
  player: BotCPlayer;
}

const RoleDialog = ({
  script,
  player: { name, roles, liar, dead, used },
}: RoleDialogProps) => {
  let active;
  switch (script) {
    case 1:
      active = snv;
      break;
    case 2:
      active = bmr;
      break;
    default:
      active = tb;
  }

  const townsfolk: ReactNode[] = [];
  const outsiders: ReactNode[] = [];
  const minions: ReactNode[] = [];
  const demons: ReactNode[] = [];
  active.townsfolk.forEach((town) =>
    townsfolk.push(
      <RoleButton role={town} selected={roles.includes(town)} key={town} />,
    ),
  );
  active.outsiders.forEach((outsider) =>
    outsiders.push(
      <RoleButton
        role={outsider}
        selected={roles.includes(outsider)}
        key={outsider}
      />,
    ),
  );
  active.minions.forEach((minion) =>
    minions.push(
      <RoleButton
        role={minion}
        selected={roles.includes(minion)}
        key={minion}
      />,
    ),
  );
  active.demons.forEach((demon) =>
    demons.push(
      <RoleButton role={demon} selected={roles.includes(demon)} key={demon} />,
    ),
  );

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Typography>{name}</Typography>
      </Grid>
      <Grid item xs={12}>
        <hr />
      </Grid>
      <Grid item xs={12}>
        <FormGroup row sx={{ display: "block", textAlign: "center" }}>
          <FormControlLabel control={<Checkbox checked={liar} />} label="😈" />
          <FormControlLabel control={<Checkbox checked={dead} />} label="💀" />
          <FormControlLabel control={<Checkbox checked={used} />} label="❌" />
        </FormGroup>
      </Grid>
      <Grid item xs={12}>
        <hr />
      </Grid>
      <Grid item xs={12}>
        <Typography>Townsfolk</Typography>
      </Grid>
      {townsfolk}
      <Grid item xs={12}>
        <hr />
      </Grid>
      <Grid item xs={12}>
        <Typography>Outsiders</Typography>
      </Grid>
      {outsiders}
      <Grid item xs={12}>
        <hr />
      </Grid>
      <Grid item xs={12}>
        <Typography>Minions</Typography>
      </Grid>
      {minions}
      <Grid item xs={12}>
        <hr />
      </Grid>
      <Grid item xs={12}>
        <Typography>Demons</Typography>
      </Grid>
      {demons}
    </Grid>
  );
};

export default RoleDialog;
