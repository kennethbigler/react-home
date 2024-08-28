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
      <div style={{ width: "100%" }}>
        <hr />
        <Typography>Townsfolk</Typography>
      </div>
      {scripts.active.townsfolk.map((role: BotCRole) => (
        <RoleButton
          key={role.name}
          role={role}
          selected={role.name in roleKey}
          updateRoles={updateRoles}
        />
      ))}

      <div style={{ width: "100%" }}>
        <hr />
        <Typography>Outsiders</Typography>
      </div>
      {scripts.active.outsiders.map((role: BotCRole) => (
        <RoleButton
          key={role.name}
          role={role}
          selected={role.name in roleKey}
          updateRoles={updateRoles}
        />
      ))}

      <div style={{ width: "100%" }}>
        <hr />
        <Typography>Minions</Typography>
      </div>
      {scripts.active.minions.map((role: BotCRole) => (
        <RoleButton
          key={role.name}
          role={role}
          selected={role.name in roleKey}
          updateRoles={updateRoles}
        />
      ))}

      <div style={{ width: "100%" }}>
        <hr />
        <Typography>Demons</Typography>
      </div>
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
          <div style={{ width: "100%" }}>
            <hr />
            <Typography>Travelers</Typography>
          </div>
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

      <div style={{ width: "100%" }}>
        <hr />
        <Typography>Other Travelers</Typography>
      </div>
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
