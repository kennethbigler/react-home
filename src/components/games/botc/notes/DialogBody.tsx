import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { BotCRole } from "../../../../recoil/botc-atom";
import { tb, snv, bmr, dtb } from "../../../../constants/botc";
import RoleButton from "./RoleButton";

interface DialogBodyProps {
  script: number;
  roles: BotCRole[];
  updateRoles: (role: BotCRole, selected: boolean) => () => void;
}

const DialogBody = ({ script, roles, updateRoles }: DialogBodyProps) => {
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
    default: // keep initial assignment
  }
  const roleKey = roles.reduce((acc, r) => ({ ...acc, [r.name]: true }), {});

  return (
    <>
      <Grid item xs={12}>
        <hr />
        <Typography>Townsfolk</Typography>
      </Grid>
      {scripts.active.townsfolk.map((name: string) => (
        <RoleButton
          key={name}
          role={{ name, alignment: "info" }}
          selected={name in roleKey}
          updateRoles={updateRoles}
        />
      ))}

      <Grid item xs={12}>
        <hr />
        <Typography>Outsiders</Typography>
      </Grid>
      {scripts.active.outsiders.map((name: string) => (
        <RoleButton
          key={name}
          role={{ name, alignment: "success" }}
          selected={name in roleKey}
          updateRoles={updateRoles}
        />
      ))}

      <Grid item xs={12}>
        <hr />
        <Typography>Minions</Typography>
      </Grid>
      {scripts.active.minions.map((name: string) => (
        <RoleButton
          key={name}
          role={{ name, alignment: "error" }}
          selected={name in roleKey}
          updateRoles={updateRoles}
        />
      ))}

      <Grid item xs={12}>
        <hr />
        <Typography>Demons</Typography>
      </Grid>
      {scripts.active.demons.map((name: string) => (
        <RoleButton
          key={name}
          role={{ name, alignment: "error" }}
          selected={name in roleKey}
          updateRoles={updateRoles}
        />
      ))}

      {scripts.active.travelers.length > 0 && (
        <>
          <Grid item xs={12}>
            <hr />
            <Typography>Travelers</Typography>
          </Grid>
          {scripts.active.travelers.map((name: string) => (
            <RoleButton
              key={name}
              role={{ name, alignment: "warning" }}
              selected={name in roleKey}
              updateRoles={updateRoles}
            />
          ))}
        </>
      )}

      <Grid item xs={12}>
        <hr />
        <Typography>Other Travelers</Typography>
      </Grid>
      {scripts.travelers.map((name: string) => (
        <RoleButton
          key={name}
          role={{ name, alignment: "warning" }}
          selected={name in roleKey}
          updateRoles={updateRoles}
        />
      ))}
    </>
  );
};

export default DialogBody;
