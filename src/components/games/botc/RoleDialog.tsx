import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import TextField from "@mui/material/TextField";
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
  updatePlayerNotesBlur: (
    i: number,
  ) => (e: React.FocusEvent<HTMLInputElement>) => void;
  updatePlayerNotesKeyDown: (
    i: number,
  ) => (e: React.KeyboardEvent<HTMLDivElement>) => void;
}

const RoleDialog = ({
  script,
  playerNo,
  player: { roles, notes, liar, dead, used },
  updatePlayerStats,
  updatePlayerRoles,
  updatePlayerNotesBlur,
  updatePlayerNotesKeyDown,
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

  const generateRoleButtons =
    (arr: ReactNode[], color: "info" | "warning" | "error") => (role: string) =>
      arr.push(
        <RoleButton
          role={role}
          color={color}
          playerNo={playerNo}
          selected={roles.includes(role)}
          updatePlayerRoles={updatePlayerRoles}
          key={role}
        />,
      );

  const townsfolk: ReactNode[] = [];
  const outsiders: ReactNode[] = [];
  const minions: ReactNode[] = [];
  const demons: ReactNode[] = [];
  const travelers: ReactNode[] = [];
  active.townsfolk.forEach(generateRoleButtons(townsfolk, "info"));
  active.outsiders.forEach(generateRoleButtons(outsiders, "info"));
  active.minions.forEach(generateRoleButtons(minions, "error"));
  active.demons.forEach(generateRoleButtons(demons, "error"));
  active.travelers.forEach(generateRoleButtons(travelers, "warning"));

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Notes"
          variant="standard"
          defaultValue={notes}
          onBlur={updatePlayerNotesBlur(playerNo)}
          onKeyDown={updatePlayerNotesKeyDown(playerNo)}
        />
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

      <Grid item xs={12}>
        <hr />
      </Grid>
      <Grid item xs={12}>
        <Typography>Travelers</Typography>
      </Grid>
      {travelers}
    </Grid>
  );
};

export default RoleDialog;
