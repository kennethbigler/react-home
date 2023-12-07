import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Grid from "@mui/material/Grid";
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
  updateScript: (i: number) => () => void;
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
    <Grid item xs={12} sx={{ textAlign: "center" }}>
      <div className="flex-container">
        <ButtonGroup aria-label="Select BotC Game">
          <Button
            variant={script === 0 ? "contained" : "outlined"}
            onClick={updateScript(0)}
          >
            TB
          </Button>
          <Button
            variant={script === 1 ? "contained" : "outlined"}
            onClick={updateScript(1)}
          >
            S&V
          </Button>
          <Button
            variant={script === 2 ? "contained" : "outlined"}
            onClick={updateScript(2)}
          >
            BMR
          </Button>
          <Button
            variant={script === 3 ? "contained" : "outlined"}
            onClick={updateScript(3)}
          >
            DTB
          </Button>
        </ButtonGroup>
        <Button variant="contained" color="error" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </Grid>
    <Grid item xs={12}>
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
    <Grid item xs={12}>
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
