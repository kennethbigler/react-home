import * as React from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import EditNoteIcon from "@mui/icons-material/EditNote";
import MobileScreenShareIcon from "@mui/icons-material/MobileScreenShare";
import SettingsIcon from "@mui/icons-material/Settings";
import botcQRCode from "../../../../images/botc-qr-code.png";
import EditPlayers from "./edit-players/EditPlayers";
import InfoPopup from "../../../common/info-popover/InfoPopup";
import { BotCPlayer } from "../../../../jotai/botc-atom";
import Tracker from "./Tracker";

interface ControlsProps {
  botcPlayers: BotCPlayer[];
  numPlayers: number;
  numTravelers: number;
}

const Controls = ({ botcPlayers, numPlayers, numTravelers }: ControlsProps) => {
  const [open, setOpen] = React.useState(false);
  const [hasToast, setHasToast] = React.useState(false);

  const handleOpenToast = () => setHasToast(true);
  const handleCloseToast = () => setHasToast(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  /* ----------     Render     ---------- */
  return (
    <Grid size={12}>
      <div className="flex-container">
        <InfoPopup
          title={<EditNoteIcon aria-label="track players" />}
          buttonVariant="text"
        >
          <Tracker botcPlayers={botcPlayers} end={numPlayers + numTravelers} />
        </InfoPopup>

        <InfoPopup
          title={<SettingsIcon aria-label="settings" />}
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

        <IconButton aria-label="share" onClick={handleOpen} color="primary">
          <MobileScreenShareIcon />
        </IconButton>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
        >
          <DialogTitle id="share-dialog-title">Share</DialogTitle>
          <DialogContent>
            <img src={botcQRCode} alt="botc QR code" />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </div>
    </Grid>
  );
};

export default Controls;
