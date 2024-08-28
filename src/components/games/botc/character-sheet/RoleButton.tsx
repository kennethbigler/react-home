import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import { BotCRole } from "../../../../recoil/botc-atom";

interface RoleButtonProps {
  role: BotCRole;
  selected: boolean;
  updateRoles?: (role: BotCRole, selected: boolean) => () => void;
}

const RoleButton = ({ role, selected, updateRoles }: RoleButtonProps) => (
  <Grid size={6} sx={{ textAlign: "center" }}>
    <Button
      variant={selected ? "contained" : "outlined"}
      color={role.alignment}
      sx={{ textTransform: "none", width: "100%" }}
      onClick={updateRoles && updateRoles(role, selected)}
    >
      {role.name}
    </Button>
  </Grid>
);

export default RoleButton;
