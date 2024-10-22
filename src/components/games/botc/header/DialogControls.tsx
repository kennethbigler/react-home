import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid2";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { SelectChangeEvent } from "@mui/material";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import {
  BOTC_MAX_PLAYERS,
  BOTC_MAX_TRAVELERS,
  BOTC_MIN_PLAYERS,
} from "../../../../recoil/botc-atom";
import { playerDist } from "../../../../constants/botc";

interface DialogControlsProps {
  script: number;
  numPlayers: number;
  numTravelers: number;
  updateScript: (i: SelectChangeEvent<number>) => void;
  updateNumPlayers: (_e: Event, value: number | number[]) => void;
  updateNumTravelers: (_e: Event, value: number | number[]) => void;
  handleReset: () => void;
}

const DialogControls = ({
  script,
  numPlayers,
  numTravelers,
  updateScript,
  updateNumPlayers,
  updateNumTravelers,
  handleReset,
}: DialogControlsProps) => (
  <>
    <Grid size={12} sx={{ textAlign: "center" }}>
      <div className="flex-container">
        <FormControl
          fullWidth
          sx={{ marginTop: "5px", marginRight: "10px" }}
          size="small"
        >
          <InputLabel id="demo-simple-select-label">Script</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={script}
            label="Script"
            onChange={updateScript}
          >
            <MenuItem value={0}>Trouble Brewing</MenuItem>
            <MenuItem value={1}>Sects and Violets</MenuItem>
            <MenuItem value={2}>Bad Moon Rising</MenuItem>
            <MenuItem value={3}>Dansel&apos;s Trouble Brewing</MenuItem>
            <MenuItem value={4}>The Spy Who Pinged Me</MenuItem>
            <MenuItem value={5}>Other</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" color="error" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </Grid>
    <Grid size={12}>
      <Typography>
        Players: {numPlayers} / Dist: {playerDist[numPlayers]}
      </Typography>
      <Slider
        aria-label="player count"
        min={BOTC_MIN_PLAYERS}
        max={BOTC_MAX_PLAYERS}
        value={numPlayers}
        onChange={updateNumPlayers}
      />
    </Grid>
    <Grid size={12}>
      <Typography>Travelers: {numTravelers}</Typography>
      <Slider
        aria-label="traveler count"
        min={0}
        max={BOTC_MAX_TRAVELERS}
        value={numTravelers}
        onChange={updateNumTravelers}
      />
    </Grid>
  </>
);

export default DialogControls;
