import Grid from "@mui/material/Grid";
import { BotCPlayer, BotCRole } from "../../../../recoil/botc-atom";
import DialogHeader from "./DialogHeader";
import DialogBody from "./DialogBody";

interface RoleDialogProps {
  script: number;
  player: BotCPlayer;
  updateStats: (
    key: "liar" | "dead" | "used",
  ) => (_e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  updateRoles: (role: BotCRole, selected: boolean) => () => void;
  updateNotes: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const RoleDialog = ({
  script,
  player,
  updateStats,
  updateRoles,
  updateNotes,
}: RoleDialogProps) => (
  <Grid container spacing={1}>
    <DialogHeader
      player={player}
      updateStats={updateStats}
      updateNotes={updateNotes}
    />
    <DialogBody
      script={script}
      roles={player.roles}
      updateRoles={updateRoles}
    />
  </Grid>
);

export default RoleDialog;
