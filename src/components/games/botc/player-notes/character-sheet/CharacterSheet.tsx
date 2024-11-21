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
  script,
  player: { name, notes, liar, used, exec, kill, roles },
  onNotesBlur,
  onRoleClick,
  onStatsToggle,
}: CharacterSheetProps) => (
  <InfoPopup buttonText={name} title={`Roles - ${name}`}>
    <Grid container spacing={1}>
      <Grid size={12}>
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
