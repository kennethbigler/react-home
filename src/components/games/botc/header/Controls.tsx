import { CSSProperties, useState } from "react";
import EditNoteIcon from "@mui/icons-material/EditNote";
import MobileScreenShareIcon from "@mui/icons-material/MobileScreenShare";
import SettingsIcon from "@mui/icons-material/Settings";
import botcQRCode from "../../../../images/botc-qr-code.png";
import EditPlayers from "./edit-players/EditPlayers";
import InfoPopup from "../../../common/info-popover/InfoPopup";
import Tracker from "./Tracker";
import { Alert, Grid, Snackbar } from "@mui/material";

interface ControlsProps {
  numPlayers: number;
  numTravelers: number;
}

const qrCodeStyle: CSSProperties = {
  display: "block",
  margin: "auto",
};

const Controls = ({ numPlayers, numTravelers }: ControlsProps) => {
  const [hasToast, setHasToast] = useState(false);
  const handleOpenToast = () => setHasToast(true);
  const handleCloseToast = () => setHasToast(false);

  return (
    <Grid size={12}>
      <div className="flex-container">
        <InfoPopup
          title="Track Players"
          buttonText={<EditNoteIcon aria-label="track players" />}
          buttonVariant="text"
        >
          <Tracker end={numPlayers + numTravelers} />
        </InfoPopup>

        <InfoPopup
          title="Settings"
          buttonText={<SettingsIcon aria-label="settings" />}
          buttonVariant="text"
        >
          <EditPlayers
            openToast={handleOpenToast}
            numPlayers={numPlayers}
            numTravelers={numTravelers}
          />
        </InfoPopup>
        <Snackbar
          open={hasToast}
          autoHideDuration={3000}
          onClose={handleCloseToast}
        >
          <Alert
            onClose={handleCloseToast}
            severity="success"
            sx={{ width: "100%" }}
          >
            Game Reset
          </Alert>
        </Snackbar>

        <InfoPopup
          title="Share"
          buttonText={<MobileScreenShareIcon aria-label="share" />}
          buttonVariant="text"
        >
          <img src={botcQRCode} alt="sharable QR code" style={qrCodeStyle} />
        </InfoPopup>
      </div>
    </Grid>
  );
};

export default Controls;
