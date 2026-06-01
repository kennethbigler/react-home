import { useMemo, useState } from "react";
import EditNoteIcon from "@mui/icons-material/EditNote";
import MobileScreenShareIcon from "@mui/icons-material/MobileScreenShare";
import SettingsIcon from "@mui/icons-material/Settings";
import { QRCodeSVG } from "qrcode.react";
import { useAtomValue } from "jotai";
import EditPlayers from "./edit-players/EditPlayers";
import InfoPopup from "../../../common/info-popover/InfoPopup";
import Tracker from "./Tracker";
import { Alert, Grid, Snackbar } from "@mui/material";
import botcAtom from "../../../../jotai/botc-atom";
import { buildShareUrl } from "../../../../utils/botc-share-utils";

interface ControlsProps {
  numPlayers: number;
  numTravelers: number;
}

const Controls = ({ numPlayers, numTravelers }: ControlsProps) => {
  const [hasToast, setHasToast] = useState(false);
  const { script, botcPlayers } = useAtomValue(botcAtom);

  const shareUrl = useMemo(
    () => buildShareUrl(script, numPlayers, numTravelers, botcPlayers),
    [script, numPlayers, numTravelers, botcPlayers],
  );

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
            openToast={() => setHasToast(true)}
            numPlayers={numPlayers}
            numTravelers={numTravelers}
          />
        </InfoPopup>
        <Snackbar
          open={hasToast}
          autoHideDuration={3000}
          onClose={() => setHasToast(false)}
        >
          <Alert
            onClose={() => setHasToast(false)}
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
          <QRCodeSVG
            value={shareUrl}
            size={200}
            style={{ display: "block", margin: "auto" }}
          />
        </InfoPopup>
      </div>
    </Grid>
  );
};

export default Controls;
