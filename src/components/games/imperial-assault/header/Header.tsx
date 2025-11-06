import { useState } from "react";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { SelectChangeEvent } from "@mui/material";
import { useHeader } from "../useImperialAssault";
import { campaignTitles } from "./constants";
import CampaignChangeDialog from "./CampaignChangeDialog";

const Header = () => {
  const { campaignIdx, handleCampaignChange } = useHeader();
  const [newCIdx, setNewCIdx] = useState(campaignIdx);
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  const handleSave = () => {
    handleCampaignChange(newCIdx);
    handleClose();
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    setNewCIdx(e.target.value);
    setIsOpen(true);
  };

  return (
    <div className="flex-container">
      <Typography variant="h2" component="h1" gutterBottom>
        Imperial Assault
      </Typography>
      <FormControl>
        <InputLabel id="campaign-select-label">Campaign</InputLabel>
        <Select
          labelId="campaign-select-label"
          value={campaignIdx}
          label="Campaign"
          onChange={handleSelectChange}
        >
          {campaignTitles.map((name, i) => (
            <MenuItem key={`campaign-${i}`} value={`${i}`}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <CampaignChangeDialog
        oldC={campaignIdx}
        newC={newCIdx}
        open={isOpen}
        onClose={handleClose}
        onSave={handleSave}
      />
    </div>
  );
};

export default Header;
