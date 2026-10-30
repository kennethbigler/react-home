import {
  Button,
  ButtonGroup,
  FormControl,
  Switch,
  Typography,
} from "@mui/material";
import type { BotCWinner } from "@/jotai/botc-atom";

interface ScriptControlsProps {
  isText: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onWin: (winner: BotCWinner) => void;
}

/** EditPlayers -> ScriptSearch
 *              -> ScriptControls */
const ScriptControls = ({ isText, onChange, onWin }: ScriptControlsProps) => (
  <div className="flex-container">
    <FormControl
      sx={{ flexDirection: "row", alignItems: "center", margin: "10px 0" }}
    >
      <Typography>🐙</Typography>
      <Switch
        checked={isText}
        slotProps={{ input: { "aria-label": "toggle text" } }}
        onChange={onChange}
      />
      <Typography>Text</Typography>
    </FormControl>
    {/* No Reset button on purpose: every game must end with a winner so the
        win tally stays complete. Picking a side also starts the new game. */}
    <ButtonGroup variant="contained" aria-label="record game winner">
      <Button
        color="success"
        aria-label="Good Win"
        onClick={() => onWin("good")}
      >
        😇 Win
      </Button>
      <Button color="error" aria-label="Evil Win" onClick={() => onWin("evil")}>
        😈 Win
      </Button>
    </ButtonGroup>
  </div>
);

export default ScriptControls;
