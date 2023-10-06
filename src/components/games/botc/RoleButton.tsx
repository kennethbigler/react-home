import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

interface RoleButtonProps {
  role: string;
  selected: boolean;
}

const RoleButton = ({ role, selected }: RoleButtonProps) => (
  <Grid item xs={6} sx={{ textAlign: "center" }}>
    <Button
      variant={selected ? "contained" : "outlined"}
      color={selected ? "primary" : "secondary"}
      sx={{ padding: "6px", width: "100%" }}
    >
      {role}
    </Button>
  </Grid>
);

export default RoleButton;
