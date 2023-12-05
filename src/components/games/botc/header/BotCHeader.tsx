import * as React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import InfoPopup from "../../../common/info-popover/InfoPopup";
import { BotCPlayer } from "../../../../recoil/botc-atom";
import DialogControls from "./DialogControls";
import DialogPlayers from "./DialogPlayers";

interface BotCHeaderProps {
  script: number;
  numPlayers: number;
  numTravelers: number;
  botcPlayers: BotCPlayer[];
  newBotCGame: () => void;
  updateScript: (i: number) => () => void;
  updateNumPlayers: (_e: Event, value: number | number[]) => void;
  updateNumTravelers: (_e: Event, value: number | number[]) => void;
  updateNamesOnBlur: (
    i: number,
  ) => (e: React.FocusEvent<HTMLInputElement>) => void;
}

const BotCHeader = ({
  script,
  numPlayers,
  numTravelers,
  botcPlayers,
  newBotCGame,
  updateScript,
  updateNumPlayers,
  updateNumTravelers,
  updateNamesOnBlur,
}: BotCHeaderProps) => {
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
          <DialogControls
            script={script}
            numPlayers={numPlayers}
            numTravelers={numTravelers}
            updateScript={updateScript}
            updateNumPlayers={updateNumPlayers}
            updateNumTravelers={updateNumTravelers}
            handleReset={handleReset}
          />
          <DialogPlayers
            numPlayers={numPlayers}
            numTravelers={numTravelers}
            botcPlayers={botcPlayers}
            updateNamesOnBlur={updateNamesOnBlur}
          />
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

export default BotCHeader;
