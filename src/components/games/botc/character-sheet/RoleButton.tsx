import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { BotCRole } from "../../../../recoil/botc-atom";

interface RoleButtonProps {
  role: BotCRole;
  selected: boolean;
  updateRoles?: (role: BotCRole, selected: boolean) => () => void;
}

const RoleButton = ({ role, selected, updateRoles }: RoleButtonProps) => (
  <Grid item xs={6} sx={{ textAlign: "center" }}>
    <Button
      variant={selected ? "contained" : "outlined"}
      color={role.alignment}
      sx={{
        padding: "6px",
        width: "100%",
        fontFamily: '"EB Garamond", Barlow, serif;',
      }}
      onClick={updateRoles && updateRoles(role, selected)}
    >
      <img
        src={role.icon}
        alt=""
        style={{ width: "24px", marginRight: "10px" }}
      />
      {role.name}
    </Button>
  </Grid>
);

export default RoleButton;
