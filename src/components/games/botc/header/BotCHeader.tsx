import * as React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import InfoPopup from "../../../common/info-popover/InfoPopup";
import { BotCPlayer } from "../../../../recoil/botc-atom";
import DialogControls from "./DialogControls";
import EditPlayer from "./EditPlayer";

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
  updatePlayerOrder: (i: number, dir: number) => () => void;
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
  updatePlayerOrder,
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
          {botcPlayers.map((player, i) =>
            i < numPlayers + numTravelers ? (
              <EditPlayer
                key={`player${player.id}`}
                first={i === 0}
                last={i === numPlayers + numTravelers - 1}
                name={player.name}
                moveUp={updatePlayerOrder(i, -1)}
                moveDown={updatePlayerOrder(i, 1)}
                title={`player ${player.id} name`}
                onBlur={updateNamesOnBlur(i)}
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

export default BotCHeader;
