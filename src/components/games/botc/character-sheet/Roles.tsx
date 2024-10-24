import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { BotCRole } from "../../../../recoil/botc-atom";
import { tb, snv, bmr, dtb, swpm, other } from "../../../../constants/botc";
import RoleButton from "./RoleButton";

interface RolesProps {
  isText: boolean;
  script: number;
  roles: BotCRole[];
  updateRoles?: (role: BotCRole, selected: boolean) => () => void;
}

const Roles = ({ isText, script, roles, updateRoles }: RolesProps) => {
  let scripts = { active: tb, travelers: [...snv.travelers, ...bmr.travelers] };
  switch (script) {
    case 1:
      scripts = { active: snv, travelers: [...tb.travelers, ...bmr.travelers] };
      break;
    case 2:
      scripts = { active: bmr, travelers: [...tb.travelers, ...snv.travelers] };
      break;
    case 3:
      scripts = {
        active: dtb,
        travelers: [...tb.travelers, ...snv.travelers, ...bmr.travelers],
      };
      break;
    case 4:
      scripts = {
        active: swpm,
        travelers: [...tb.travelers, ...snv.travelers, ...bmr.travelers],
      };
      break;
    case 5:
      scripts = {
        active: other,
        travelers: [],
      };
      break;
    default: // keep initial assignment
  }
  const roleKey = roles.reduce((acc, r) => ({ ...acc, [r.name]: true }), {});
  const gridSize = script === 5 ? 3 : 6;

  return (
    <>
      <Grid size={12}>
        <hr />
        <Typography>Townsfolk</Typography>
      </Grid>
      {scripts.active.townsfolk.map((role: BotCRole) => (
        <Grid size={gridSize} sx={{ textAlign: "center" }} key={role.name}>
          <RoleButton
            isText={isText}
            role={role}
            selected={role.name in roleKey}
            updateRoles={updateRoles}
          />
        </Grid>
      ))}

      <Grid size={12}>
        <hr />
        <Typography>Outsiders</Typography>
      </Grid>
      {scripts.active.outsiders.map((role: BotCRole) => (
        <Grid size={gridSize} sx={{ textAlign: "center" }} key={role.name}>
          <RoleButton
            isText={isText}
            role={role}
            selected={role.name in roleKey}
            updateRoles={updateRoles}
          />
        </Grid>
      ))}

      <Grid size={12}>
        <hr />
        <Typography>Minions</Typography>
      </Grid>
      {scripts.active.minions.map((role: BotCRole) => (
        <Grid size={gridSize} sx={{ textAlign: "center" }} key={role.name}>
          <RoleButton
            isText={isText}
            role={role}
            selected={role.name in roleKey}
            updateRoles={updateRoles}
          />
        </Grid>
      ))}

      <Grid size={12}>
        <hr />
        <Typography>Demons</Typography>
      </Grid>
      {scripts.active.demons.map((role: BotCRole) => (
        <Grid size={gridSize} sx={{ textAlign: "center" }} key={role.name}>
          <RoleButton
            isText={isText}
            role={role}
            selected={role.name in roleKey}
            updateRoles={updateRoles}
          />
        </Grid>
      ))}

      {scripts.active.travelers.length > 0 && (
        <>
          <Grid size={12}>
            <hr />
            <Typography>Travelers</Typography>
          </Grid>
          {scripts.active.travelers.map((role: BotCRole) => (
            <Grid size={gridSize} sx={{ textAlign: "center" }} key={role.name}>
              <RoleButton
                isText={isText}
                role={role}
                selected={role.name in roleKey}
                updateRoles={updateRoles}
              />
            </Grid>
          ))}
        </>
      )}

      {scripts.travelers.length > 0 && (
        <Grid size={12}>
          <hr />
          <Typography>Other Travelers</Typography>
        </Grid>
      )}
      {scripts.travelers.map((role: BotCRole) => (
        <Grid size={gridSize} sx={{ textAlign: "center" }} key={role.name}>
          <RoleButton
            isText={isText}
            role={role}
            selected={role.name in roleKey}
            updateRoles={updateRoles}
          />
        </Grid>
      ))}
    </>
  );
};

export default Roles;
