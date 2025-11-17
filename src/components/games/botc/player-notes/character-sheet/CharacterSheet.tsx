import InfoPopup from "../../../../common/info-popover/InfoPopup";
import Roles from "./Roles";
import {
  BotCPlayer,
  BotCPlayerStatus,
  BotCRole,
} from "../../../../../jotai/botc-atom";
import EmojiNotes from "./EmojiNotes";
import { Grid, TextField } from "@mui/material";

interface CharacterSheetProps {
  isText: boolean;
  player: BotCPlayer;
  script: number;
  onNameBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onNotesBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onRoleClick: (role: BotCRole, selected: boolean) => () => void;
  onStatsToggle: (
    key: BotCPlayerStatus,
  ) => (_e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
}

/** CharacterSheet -> EmojiNotes
 *                 -> Roles -> RoleSelection */
const CharacterSheet = ({
  isText,
  player: { name, notes, liar, used, exec, kill, roles },
  script,
  onNameBlur,
  onNotesBlur,
  onRoleClick,
  onStatsToggle,
}: CharacterSheetProps) => (
  <InfoPopup
    fullWidth
    buttonText={name}
    buttonVariant={exec || kill ? "contained" : "outlined"}
    buttonColor={exec || kill ? "error" : "primary"}
    title={`Roles - ${name}`}
  >
    <Grid container spacing={1}>
      <Grid size={6}>
        <TextField
          fullWidth
          defaultValue={name}
          label="Player Name"
          variant="standard"
          onBlur={onNameBlur}
        />
      </Grid>
      <Grid size={6}>
        <TextField
          fullWidth
          label="Notes"
          variant="standard"
          defaultValue={notes}
          onBlur={onNotesBlur}
        />
      </Grid>

      <EmojiNotes
        liar={liar}
        used={used}
        kill={kill}
        exec={exec}
        onToggle={onStatsToggle}
      />

      <Roles
        isText={isText}
        script={script}
        roleKey={roles.reduce((acc, r) => ({ ...acc, [r.name]: true }), {})}
        onRoleClick={onRoleClick}
      />
    </Grid>
  </InfoPopup>
);

export default CharacterSheet;
