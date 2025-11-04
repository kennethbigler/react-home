import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import MobileScreenShareIcon from "@mui/icons-material/MobileScreenShare";
import Typography from "@mui/material/Typography";
import { playerDist } from "../../../constants/botc";
import botcQRCode from "../../../images/botc-qr-code.png";

interface HeaderProps {
  numPlayers: number;
  numTravelers: number;
}

const Header = React.memo(({ numPlayers, numTravelers }: HeaderProps) => {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  /* ----------     Render     ---------- */
  return (
    <div className="flex-container">
      <Typography variant="h2" component="h1" gutterBottom>
        BotC
      </Typography>
      <Typography>
        {playerDist[numPlayers]}
        {numTravelers ? ` +${numTravelers}` : ""}
      </Typography>
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
  );
});

Header.displayName = "Header";

export default Header;
