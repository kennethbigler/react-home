import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

interface RoleButtonProps {
  role: string;
  playerNo: number;
  selected: boolean;
  updatePlayerRoles: (i: number, role: string, selected: boolean) => () => void;
}

const RoleButton = ({
  role,
  playerNo,
  selected,
  updatePlayerRoles,
}: RoleButtonProps) => (
  <Grid item xs={6} sx={{ textAlign: "center" }}>
    <Button
      variant={selected ? "contained" : "outlined"}
      color={selected ? "primary" : "secondary"}
      sx={{ padding: "6px", width: "100%" }}
      onClick={updatePlayerRoles(playerNo, role, selected)}
    >
      {role}
    </Button>
  </Grid>
);

export default RoleButton;
