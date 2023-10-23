import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { BotCRole } from "../../../recoil/botc-atom";

interface RoleButtonProps {
  role: BotCRole;
  playerNo: number;
  selected: boolean;
  updateRoles: (i: number, role: BotCRole, selected: boolean) => () => void;
}

const RoleButton = ({
  role,
  playerNo,
  selected,
  updateRoles,
}: RoleButtonProps) => (
  <Grid item xs={6} sx={{ textAlign: "center" }}>
    <Button
      variant={selected ? "contained" : "outlined"}
      color={role.alignment}
      sx={{ padding: "6px", width: "100%" }}
      onClick={updateRoles(playerNo, role, selected)}
    >
      {role.name}
    </Button>
  </Grid>
);

export default RoleButton;
