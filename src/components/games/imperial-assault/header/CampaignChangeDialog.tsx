import { campaignTitles } from "./constants";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

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
  <Dialog onClose={onClose} open={open}>
    <DialogTitle>New Campaign</DialogTitle>
    <DialogContent>
      Are you sure you want to switch from:
      <br aria-hidden />
      {campaignTitles[parseInt(oldC)]} &gt; {campaignTitles[parseInt(newC)]}?
    </DialogContent>
    <DialogActions>
      <Button color="error" onClick={onSave}>
        New Campaign
      </Button>
      <Button color="primary" onClick={onClose}>
        Cancel
      </Button>
    </DialogActions>
  </Dialog>
);

export default CampaignChangeDialog;
