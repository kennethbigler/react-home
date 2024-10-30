import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";

interface ScriptControlsProps {
  isText: boolean;
  updateText: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleReset: () => void;
}

const ScriptControls = ({
  isText,
  updateText,
  handleReset,
}: ScriptControlsProps) => (
  <div className="flex-container">
    <FormControl
      sx={{ flexDirection: "row", alignItems: "center", margin: "10px 0" }}
    >
      <Typography>🐙</Typography>
      <Switch
        checked={isText}
        inputProps={{ "aria-label": "toggle text" }}
        onChange={updateText}
      />
      <Typography>Text</Typography>
    </FormControl>
    <Button variant="contained" color="error" onClick={handleReset}>
      Reset
    </Button>
  </div>
);

export default ScriptControls;
