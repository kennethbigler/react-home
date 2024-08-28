import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import TextField from "@mui/material/TextField";
import { BotCPlayer, BotCPlayerStatus } from "../../../../recoil/botc-atom";

interface NotesProps {
  player: BotCPlayer;
  updateStats: (
    key: BotCPlayerStatus,
  ) => (_e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  updateNotes: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const Notes = ({
  player: { notes, liar, dead, used },
  updateStats,
  updateNotes,
}: NotesProps) => (
  <>
    <div style={{ width: "100%" }}>
      <TextField
        fullWidth
        label="Notes"
        variant="standard"
        defaultValue={notes}
        onBlur={updateNotes}
      />
    </div>

    <div style={{ width: "100%" }}>
      <FormGroup row sx={{ display: "block", textAlign: "center" }}>
        <FormControlLabel
          control={<Checkbox checked={liar} onChange={updateStats("liar")} />}
          label="😈"
        />
        <FormControlLabel
          control={<Checkbox checked={dead} onChange={updateStats("dead")} />}
          label="💀"
        />
        <FormControlLabel
          control={<Checkbox checked={used} onChange={updateStats("used")} />}
          label="❌"
        />
      </FormGroup>
    </div>
  </>
);

export default Notes;
