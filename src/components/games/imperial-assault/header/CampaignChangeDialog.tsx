import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { campaignTitles } from "./constants";

interface CampaignChangeDialogProps {
  oldC: string;
  newC: string;
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}

const CampaignChangeDialog = ({
  oldC,
  newC,
  open,
  onClose,
  onSave,
}: CampaignChangeDialogProps) => (
  <Dialog title="info-popup" onClose={onClose} open={open}>
    <DialogTitle>New Campaign</DialogTitle>
    <DialogContent>
      Are you sure you want to switch from:
      <br aria-hidden />
      {campaignTitles[parseInt(oldC)]} &gt; {campaignTitles[parseInt(newC)]}?
    </DialogContent>
    <DialogActions>
      <Button color="secondary" onClick={onSave}>
        Yes
      </Button>
      <Button color="primary" onClick={onClose}>
        Close
      </Button>
    </DialogActions>
  </Dialog>
);

export default CampaignChangeDialog;
