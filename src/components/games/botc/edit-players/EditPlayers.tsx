import * as React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Slider from "@mui/material/Slider";
import { SelectChangeEvent } from "@mui/material";
import InfoPopup from "../../../common/info-popover/InfoPopup";
import {
  BotCPlayer,
  BOTC_MAX_PLAYERS,
  BOTC_MAX_TRAVELERS,
  BOTC_MIN_PLAYERS,
} from "../../../../recoil/botc-atom";
import EditNameAndPos from "./EditNameAndPos";
import ScriptSelect from "./ScriptSelect";
import ScriptControls from "./ScriptControls";
import { playerDist } from "../../../../constants/botc";

interface EditPlayersProps {
  botcPlayers: BotCPlayer[];
  isText: boolean;
  numPlayers: number;
  numTravelers: number;
  script: number;
  newBotCGame: () => void;
  updateNames: (i: number) => (e: React.FocusEvent<HTMLInputElement>) => void;
  updateNumPlayers: (_e: Event, value: number | number[]) => void;
  updateNumTravelers: (_e: Event, value: number | number[]) => void;
  updatePlayerOrder: (i: number, dir: number) => () => void;
  updateScript: (i: SelectChangeEvent<number>) => void;
  updateText: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EditPlayers = ({
  botcPlayers,
  isText,
  numPlayers,
  numTravelers,
  script,
  newBotCGame,
  updateNames,
  updateNumPlayers,
  updateNumTravelers,
  updatePlayerOrder,
  updateScript,
  updateText,
}: EditPlayersProps) => {
  const [hasToast, setHasToast] = React.useState(false);
  /** close the toast message */
  const handleClose = () => setHasToast(false);
  /** reset the BOTC game and open the success toast */
  const handleReset = () => {
    newBotCGame();
    setHasToast(true);
  };

  return (
    <div className="flex-container">
      <Typography variant="h2" component="h1" gutterBottom>
        BotC
      </Typography>

      <InfoPopup title="Players">
        <Grid container spacing={1}>
          <Grid size={12} sx={{ textAlign: "center" }}>
            <ScriptSelect script={script} updateScript={updateScript} />
            <ScriptControls
              isText={isText}
              updateText={updateText}
              handleReset={handleReset}
            />
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

          {botcPlayers.map((player, i) =>
            i < numPlayers + numTravelers ? (
              <EditNameAndPos
                key={`player${i}-${player.name}`}
                first={i === 0}
                last={i === numPlayers + numTravelers - 1}
                name={player.name}
                moveUp={updatePlayerOrder(i, -1)}
                moveDown={updatePlayerOrder(i, 1)}
                onBlur={updateNames(i)}
              />
            ) : null,
          )}
        </Grid>
      </InfoPopup>

      <Snackbar open={hasToast} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Game Reset
        </Alert>
      </Snackbar>
    </div>
  );
};

export default EditPlayers;
