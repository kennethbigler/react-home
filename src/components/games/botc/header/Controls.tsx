import * as React from "react";
// MUI
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid2";
import { SelectChangeEvent } from "@mui/material";
// Custom
import EditPlayers from "./edit-players/EditPlayers";
import InfoPopup from "../../../common/info-popover/InfoPopup";
import { BotCPlayer } from "../../../../recoil/botc-atom";
import { playerDist } from "../../../../constants/botc";
import Tracker from "./Tracker";

interface ControlsProps {
  // Shared
  botcPlayers: BotCPlayer[];
  numPlayers: number;
  numTravelers: number;
  // Controls
  newBotCGame: () => void;
  // Tracker
  round: number;
  tracker: number[][];
  updateRound: (i: number) => () => void;
  updateTracker: (i: number) => () => void;
  // EditPlayers
  isText: boolean;
  script: number;
  updateNames: (i: number) => (e: React.FocusEvent<HTMLInputElement>) => void;
  updateNumPlayers: (_e: Event, value: number | number[]) => void;
  updateNumTravelers: (_e: Event, value: number | number[]) => void;
  updatePlayerOrder: (i: number, dir: number) => () => void;
  updateScript: (i: SelectChangeEvent<number>) => void;
  updateText: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Controls = ({
  // Shared
  botcPlayers,
  numPlayers,
  numTravelers,
  // Controls
  newBotCGame,
  // Tracker
  round,
  tracker,
  updateRound,
  updateTracker,
  // EditPlayers
  isText,
  script,
  updateNames,
  updateNumPlayers,
  updateNumTravelers,
  updatePlayerOrder,
  updateScript,
  updateText,
}: ControlsProps) => {
  const [hasToast, setHasToast] = React.useState(false);

  /** close the toast message */
  const handleClose = () => setHasToast(false);
  /** reset the BotC game and open the success toast */
  const handleReset = () => {
    newBotCGame();
    setHasToast(true);
  };

  return (
    <div className="flex-container" style={{ marginBottom: "20px" }}>
      <Grid size={12}>
        <Typography>
          Dist: {playerDist[numPlayers]}
          {numTravelers ? ` +${numTravelers}` : ""}
        </Typography>
      </Grid>

      <InfoPopup title="Tracker">
        <Tracker
          botcPlayers={botcPlayers}
          end={numPlayers + numTravelers}
          round={round}
          tracker={tracker}
          updateRound={updateRound}
          updateTracker={updateTracker}
        />
      </InfoPopup>

      <InfoPopup title="Players">
        <EditPlayers
          handleReset={handleReset}
          botcPlayers={botcPlayers}
          isText={isText}
          numPlayers={numPlayers}
          numTravelers={numTravelers}
          script={script}
          updateNames={updateNames}
          updateNumPlayers={updateNumPlayers}
          updateNumTravelers={updateNumTravelers}
          updatePlayerOrder={updatePlayerOrder}
          updateScript={updateScript}
          updateText={updateText}
        />
      </InfoPopup>

      <Snackbar open={hasToast} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Game Reset
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Controls;
