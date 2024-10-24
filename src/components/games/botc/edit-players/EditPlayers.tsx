import * as React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { SelectChangeEvent } from "@mui/material";
import InfoPopup from "../../../common/info-popover/InfoPopup";
import { BotCPlayer } from "../../../../recoil/botc-atom";
import DialogControls from "./DialogControls";
import EditNameAndPos from "./EditNameAndPos";

interface EditPlayersProps {
  isText: boolean;
  script: number;
  numPlayers: number;
  numTravelers: number;
  botcPlayers: BotCPlayer[];
  newBotCGame: () => void;
  updateNames: (i: number) => (e: React.FocusEvent<HTMLInputElement>) => void;
  updateNumPlayers: (_e: Event, value: number | number[]) => void;
  updateNumTravelers: (_e: Event, value: number | number[]) => void;
  updatePlayerOrder: (i: number, dir: number) => () => void;
  updateScript: (i: SelectChangeEvent<number>) => void;
  updateText: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EditPlayers = ({
  isText,
  script,
  numPlayers,
  numTravelers,
  botcPlayers,
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
          <DialogControls
            isText={isText}
            script={script}
            numPlayers={numPlayers}
            numTravelers={numTravelers}
            updateScript={updateScript}
            updateNumPlayers={updateNumPlayers}
            updateNumTravelers={updateNumTravelers}
            updateText={updateText}
            handleReset={handleReset}
          />
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
