import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { SelectChangeEvent } from "@mui/material";

interface ScriptSelectProps {
  script: number;
  updateScript: (i: SelectChangeEvent<number>) => void;
}

const menuItems = [
  "Trouble Brewing",
  "Sects and Violets",
  "Bad Moon Rising",
  "Dansel's Trouble Brewing",
  "The Spy Who Pinged Me",
  "Other",
];

const ScriptSelect = ({ script, updateScript }: ScriptSelectProps) => (
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
      onChange={updateScript}
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
