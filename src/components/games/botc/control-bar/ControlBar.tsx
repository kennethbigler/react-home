import * as React from "react";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import SwapHoriz from "@mui/icons-material/SwapHoriz";
import EditPlayers from "./edit-players/EditPlayers";
import InfoPopup from "../../../common/info-popover/InfoPopup";
import { BotCPlayer } from "../../../../jotai/botc-atom";
import Tracker from "./Tracker";
import { FormControlLabel, Switch } from "@mui/material";

interface ControlBarProps {
  // Shared
  botcPlayers: BotCPlayer[];
  numPlayers: number;
  numTravelers: number;
  showMove: boolean;
  // ControlBar
  newBotCGame: () => void;
  onMoveToggle: () => void;
}

const ControlBar = ({
  // Shared
  botcPlayers,
  numPlayers,
  numTravelers,
  showMove,
  // ControlBar
  newBotCGame,
  onMoveToggle,
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
      <FormControlLabel
        control={<Switch checked={showMove} onChange={onMoveToggle} />}
        label={<SwapHoriz />}
      />
      <InfoPopup title="Tracker">
        <Tracker botcPlayers={botcPlayers} end={numPlayers + numTravelers} />
      </InfoPopup>

      <InfoPopup title="Players">
        <EditPlayers
          handleReset={handleReset}
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
