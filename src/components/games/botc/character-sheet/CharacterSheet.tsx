import Grid from "@mui/material/Grid2";
import {
  BotCPlayer,
  BotCPlayerStatus,
  BotCRole,
} from "../../../../recoil/botc-atom";
import Notes from "./Notes";
import Roles from "./Roles";

interface CharacterSheetProps {
  isText: boolean;
  script: number;
  player: BotCPlayer;
  updateNotes: (e: React.FocusEvent<HTMLInputElement>) => void;
  updateStats: (
    key: BotCPlayerStatus,
  ) => (_e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  updateRoles: (role: BotCRole, selected: boolean) => () => void;
}

const CharacterSheet = ({
  isText,
  script,
  player,
  updateNotes,
  updateStats,
  updateRoles,
}: CharacterSheetProps) => (
  <Grid container spacing={1}>
    <Notes
      player={player}
      updateNotes={updateNotes}
      updateStats={updateStats}
    />
    <Roles
      isText={isText}
      script={script}
      roles={player?.roles}
      updateRoles={updateRoles}
    />
  </Grid>
);

export default CharacterSheet;
