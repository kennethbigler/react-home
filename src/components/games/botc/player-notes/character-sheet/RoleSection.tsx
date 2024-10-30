import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { BotCRole } from "../../../../../recoil/botc-atom";

export interface RoleKey {
  [key: string]: boolean;
}

interface RoleSectionProps {
  gridSize: number;
  isText: boolean;
  roleKey: RoleKey;
  roles: BotCRole[];
  title: string;
  updateRoles?: (role: BotCRole, selected: boolean) => () => void;
}

const RoleSection = ({
  gridSize,
  isText,
  roleKey,
  roles,
  title,
  updateRoles,
}: RoleSectionProps) => (
  <>
    <Grid size={12}>
      <hr aria-hidden />
      <Typography>{title}</Typography>
    </Grid>

    {roles.map((role: BotCRole) => {
      const selected = role.name in roleKey;
      return (
        <Grid key={role.name} size={gridSize} sx={{ textAlign: "center" }}>
          <Button
            variant={selected ? "contained" : "outlined"}
            color={role.alignment}
            sx={{ textTransform: "none", width: "100%" }}
            onClick={updateRoles && updateRoles(role, selected)}
            title={role.name}
          >
            {isText ? role.name : role.icon}
          </Button>
        </Grid>
      );
    })}
  </>
);

export default RoleSection;
