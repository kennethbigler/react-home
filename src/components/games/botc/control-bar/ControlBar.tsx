import * as React from "react";
// MUI
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
// Custom
import EditPlayers from "./edit-players/EditPlayers";
import InfoPopup from "../../../common/info-popover/InfoPopup";
import { BotCPlayer } from "../../../../jotai/botc-atom";
import { playerDist } from "../../../../constants/botc";
import Tracker from "./Tracker";

interface ControlBarProps {
  // Shared
  botcPlayers: BotCPlayer[];
  numPlayers: number;
  numTravelers: number;
  // ControlBar
  newBotCGame: () => void;
}

const ControlBar = ({
  // Shared
  botcPlayers,
  numPlayers,
  numTravelers,
  // ControlBar
  newBotCGame,
}: ControlBarProps) => {
  const [hasToast, setHasToast] = React.useState(false);

  /** close the toast message */
  const handleClose = () => setHasToast(false);
  /** reset the BotC game and open the success toast */
  const handleReset = () => {
    newBotCGame();
    setHasToast(true);
  };

  return (
    <div className="flex-container">
      <Typography>
        Dist: {playerDist[numPlayers]}
        {numTravelers ? ` +${numTravelers}` : ""}
      </Typography>

      <InfoPopup title="Tracker">
        <Tracker botcPlayers={botcPlayers} end={numPlayers + numTravelers} />
      </InfoPopup>

      <InfoPopup title="Players">
        <EditPlayers
          handleReset={handleReset}
          botcPlayers={botcPlayers}
          numPlayers={numPlayers}
          numTravelers={numTravelers}
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

export default ControlBar;
