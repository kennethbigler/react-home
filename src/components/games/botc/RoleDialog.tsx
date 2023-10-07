import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { ReactNode } from "react";
import { BotCPlayer } from "../../../recoil/botc-atom";
import { tb, snv, bmr } from "../../../constants/botc";
import RoleButton from "./RoleButton";

interface RoleDialogProps {
  script: number;
  playerNo: number;
  player: BotCPlayer;
  updatePlayerStats: (
    i: number,
    key: "liar" | "dead" | "used",
  ) => (_e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  updatePlayerRoles: (i: number, role: string, selected: boolean) => () => void;
}

const RoleDialog = ({
  script,
  playerNo,
  player: { name, roles, liar, dead, used },
  updatePlayerStats,
  updatePlayerRoles,
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
      <RoleButton
        role={town}
        playerNo={playerNo}
        selected={roles.includes(town)}
        updatePlayerRoles={updatePlayerRoles}
        key={town}
      />,
    ),
  );
  active.outsiders.forEach((outsider) =>
    outsiders.push(
      <RoleButton
        role={outsider}
        playerNo={playerNo}
        selected={roles.includes(outsider)}
        updatePlayerRoles={updatePlayerRoles}
        key={outsider}
      />,
    ),
  );
  active.minions.forEach((minion) =>
    minions.push(
      <RoleButton
        role={minion}
        playerNo={playerNo}
        selected={roles.includes(minion)}
        updatePlayerRoles={updatePlayerRoles}
        key={minion}
      />,
    ),
  );
  active.demons.forEach((demon) =>
    demons.push(
      <RoleButton
        role={demon}
        playerNo={playerNo}
        selected={roles.includes(demon)}
        updatePlayerRoles={updatePlayerRoles}
        key={demon}
      />,
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
          <FormControlLabel
            control={
              <Checkbox
                checked={liar}
                onChange={updatePlayerStats(playerNo, "liar")}
              />
            }
            label="😈"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={dead}
                onChange={updatePlayerStats(playerNo, "dead")}
              />
            }
            label="💀"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={used}
                onChange={updatePlayerStats(playerNo, "used")}
              />
            }
            label="❌"
          />
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
