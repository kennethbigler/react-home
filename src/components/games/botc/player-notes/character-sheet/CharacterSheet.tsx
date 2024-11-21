import Grid from "@mui/material/Grid2";
import TextField from "@mui/material/TextField";
import InfoPopup from "../../../../common/info-popover/InfoPopup";
import Roles from "./Roles";
import {
  BotCPlayer,
  BotCPlayerStatus,
  BotCRole,
} from "../../../../../recoil/botc-atom";
import EmojiNotes from "./EmojiNotes";

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
  player: { name, notes, liar, used, exec, kill, roles },
  updateNotes,
  updateStats,
  updateRoles,
}: CharacterSheetProps) => (
  <InfoPopup buttonText={name} title={`Roles - ${name}`}>
    <Grid container spacing={1}>
      <Grid size={12}>
        <TextField
          fullWidth
          label="Notes"
          variant="standard"
          defaultValue={notes}
          onBlur={updateNotes}
        />
      </Grid>

      <EmojiNotes
        liar={liar}
        used={used}
        kill={kill}
        exec={exec}
        updateStats={updateStats}
      />

      <Roles
        isText={isText}
        script={script}
        roleKey={roles.reduce((acc, r) => ({ ...acc, [r.name]: true }), {})}
        updateRoles={updateRoles}
      />
    </Grid>
  </InfoPopup>
);

export default CharacterSheet;
