import { Button, FormControl, Switch, Typography } from "@mui/material";

interface ScriptControlsProps {
  isText: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
}

/** EditPlayers -> ScriptSelect
 *              -> ScriptControls
 *              -> players.map(EditNameAndPos) */
const ScriptControls = ({ isText, onChange, onReset }: ScriptControlsProps) => (
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
    <Button variant="contained" color="error" onClick={onReset}>
      Reset
    </Button>
  </div>
);

export default ScriptControls;
