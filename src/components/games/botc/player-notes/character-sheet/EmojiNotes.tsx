import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import { BotCPlayerStatus } from "../../../../../jotai/botc-atom";

interface EmojiNotesProps {
  liar: boolean;
  used: boolean;
  exec: boolean;
  kill: boolean;
  onToggle: (
    key: BotCPlayerStatus,
  ) => (_e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
}

/** CharacterSheet -> EmojiNotes
 *                 -> Roles -> RoleSelection */
const EmojiNotes = ({ liar, used, exec, kill, onToggle }: EmojiNotesProps) => (
  <Grid size={12}>
    <FormGroup row sx={{ display: "block", textAlign: "center" }}>
      <FormControlLabel
        label="😈"
        control={<Checkbox checked={liar} onChange={onToggle("liar")} />}
      />
      <FormControlLabel
        label="❌"
        control={<Checkbox checked={used} onChange={onToggle("used")} />}
      />
      <FormControlLabel
        label="💀"
        control={<Checkbox checked={kill} onChange={onToggle("kill")} />}
      />
      <FormControlLabel
        label="✋"
        control={<Checkbox checked={exec} onChange={onToggle("exec")} />}
      />
    </FormGroup>
  </Grid>
);

export default EmojiNotes;
