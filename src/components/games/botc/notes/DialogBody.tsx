import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { BotCRole } from "../../../../recoil/botc-atom";
import { tb, snv, bmr } from "../../../../constants/botc";
import RoleButton from "./RoleButton";

interface DialogBodyProps {
  script: number;
  roles: BotCRole[];
  updateRoles: (role: BotCRole, selected: boolean) => () => void;
}

const DialogBody = ({ script, roles, updateRoles }: DialogBodyProps) => {
  let scripts = { active: tb, backup1: snv, backup2: bmr };
  switch (script) {
    case 1:
      scripts = { active: snv, backup1: tb, backup2: bmr };
      break;
    case 2:
      scripts = { active: bmr, backup1: tb, backup2: snv };
      break;
    default: // keep initial assignment
  }
  const roleKey = roles.reduce((acc, r) => ({ ...acc, [r.name]: true }), {});

  return (
    <>
      <Grid item xs={12}>
        <hr />
      </Grid>
      <Grid item xs={12}>
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
      </Grid>
      <Grid item xs={12}>
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
      </Grid>
      <Grid item xs={12}>
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
      </Grid>
      <Grid item xs={12}>
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

      <Grid item xs={12}>
        <hr />
      </Grid>
      <Grid item xs={12}>
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

      <Grid item xs={12}>
        <hr />
      </Grid>
      <Grid item xs={12}>
        <Typography>Other Travelers</Typography>
      </Grid>
      {scripts.backup1.travelers.map((name: string) => (
        <RoleButton
          key={name}
          role={{ name, alignment: "warning" }}
          selected={name in roleKey}
          updateRoles={updateRoles}
        />
      ))}
      {scripts.backup2.travelers.map((name: string) => (
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
