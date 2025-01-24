import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useHeader } from "./useImperialAssault";

const Header = () => {
  const { campaignIdx, handleCampaignChange } = useHeader();

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
          onChange={handleCampaignChange}
        >
          <MenuItem value="0">Imperial Assault Campaign Log</MenuItem>
          <MenuItem value="1">Twin Shadows Campaign Log</MenuItem>
          <MenuItem value="2">Return to Hoth Campaign Log</MenuItem>
          <MenuItem value="3">The Bespin Gambit Campaign Log</MenuItem>
          <MenuItem value="4">Jabba&apos;s Realm Campaign Log</MenuItem>
          <MenuItem value="5">Heart of the Empire Campaign Log</MenuItem>
          <MenuItem value="6">Tyrants of Lothal Campaign Log</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export default Header;
