import Grid from "@mui/material/Grid2";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import { BotCPlayerStatus } from "../../../../../recoil/botc-atom";

interface EmojiNotesProps {
  liar: boolean;
  used: boolean;
  exec: boolean;
  kill: boolean;
  updateStats: (
    key: BotCPlayerStatus,
  ) => (_e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
}

const EmojiNotes = ({
  liar,
  used,
  exec,
  kill,
  updateStats,
}: EmojiNotesProps) => (
  <Grid size={12}>
    <FormGroup row sx={{ display: "block", textAlign: "center" }}>
      <FormControlLabel
        control={<Checkbox checked={liar} onChange={updateStats("liar")} />}
        label="😈"
      />
      <FormControlLabel
        control={<Checkbox checked={used} onChange={updateStats("used")} />}
        label="❌"
      />
      <FormControlLabel
        control={<Checkbox checked={kill} onChange={updateStats("kill")} />}
        label="💀"
      />
      <FormControlLabel
        control={<Checkbox checked={exec} onChange={updateStats("exec")} />}
        label="✋"
      />
    </FormGroup>
  </Grid>
);

export default EmojiNotes;
