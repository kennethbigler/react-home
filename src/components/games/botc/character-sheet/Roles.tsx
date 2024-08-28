import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { BotCRole } from "../../../../recoil/botc-atom";
import { tb, snv, bmr, dtb, swpm } from "../../../../constants/botc";
import RoleButton from "./RoleButton";

interface RolesProps {
  script: number;
  roles: BotCRole[];
  updateRoles?: (role: BotCRole, selected: boolean) => () => void;
}

const Roles = ({ script, roles, updateRoles }: RolesProps) => {
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
    default: // keep initial assignment
  }
  const roleKey = roles.reduce((acc, r) => ({ ...acc, [r.name]: true }), {});

  return (
    <>
      <Grid size={12}>
        <hr />
        <Typography>Townsfolk</Typography>
      </Grid>
      {scripts.active.townsfolk.map((role: BotCRole) => (
        <RoleButton
          key={role.name}
          role={role}
          selected={role.name in roleKey}
          updateRoles={updateRoles}
        />
      ))}

      <Grid size={12}>
        <hr />
        <Typography>Outsiders</Typography>
      </Grid>
      {scripts.active.outsiders.map((role: BotCRole) => (
        <RoleButton
          key={role.name}
          role={role}
          selected={role.name in roleKey}
          updateRoles={updateRoles}
        />
      ))}

      <Grid size={12}>
        <hr />
        <Typography>Minions</Typography>
      </Grid>
      {scripts.active.minions.map((role: BotCRole) => (
        <RoleButton
          key={role.name}
          role={role}
          selected={role.name in roleKey}
          updateRoles={updateRoles}
        />
      ))}

      <Grid size={12}>
        <hr />
        <Typography>Demons</Typography>
      </Grid>
      {scripts.active.demons.map((role: BotCRole) => (
        <RoleButton
          key={role.name}
          role={role}
          selected={role.name in roleKey}
          updateRoles={updateRoles}
        />
      ))}

      {scripts.active.travelers.length > 0 && (
        <>
          <Grid size={12}>
            <hr />
            <Typography>Travelers</Typography>
          </Grid>
          {scripts.active.travelers.map((role: BotCRole) => (
            <RoleButton
              key={role.name}
              role={role}
              selected={role.name in roleKey}
              updateRoles={updateRoles}
            />
          ))}
        </>
      )}

      <Grid size={12}>
        <hr />
        <Typography>Other Travelers</Typography>
      </Grid>
      {scripts.travelers.map((role: BotCRole) => (
        <RoleButton
          key={role.name}
          role={role}
          selected={role.name in roleKey}
          updateRoles={updateRoles}
        />
      ))}
    </>
  );
};

export default Roles;
