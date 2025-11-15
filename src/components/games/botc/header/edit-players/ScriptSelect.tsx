import {
  SelectChangeEvent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
interface ScriptSelectProps {
  script: number;
  onChange: (i: SelectChangeEvent<number>) => void;
}

const menuItems = [
  "Trouble Brewing",
  "Sects and Violets",
  "Bad Moon Rising",
  "The Spy Who Pinged Me",
  "Other",
];

/** EditPlayers -> ScriptSelect
 *              -> ScriptControls
 *              -> players.map(EditNameAndPos) */
const ScriptSelect = ({ script, onChange }: ScriptSelectProps) => (
  <FormControl
    fullWidth
    sx={{ marginTop: "5px", marginRight: "10px" }}
    size="small"
  >
    <InputLabel id="demo-simple-select-label">Script</InputLabel>
    <Select
      label="Script"
      labelId="demo-simple-select-label"
      value={script}
      onChange={onChange}
    >
      {menuItems.map((item, i) => (
        <MenuItem key={i} value={i}>
          {item}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

export default ScriptSelect;
