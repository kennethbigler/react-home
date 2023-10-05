import * as React from "react";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import { Grid, TextField } from "@mui/material";
import InfoPopup from "../../common/info-popover/InfoPopup";

const BotC: React.FC = React.memo(() => {
  const [numPlayers, setNumPlayers] = React.useState<number>(8);
  const handleSliderChange = (_e: Event, value: number | number[]) =>
    setNumPlayers(value as number);

  const playerTextFields = [];

  for (let i = 0; i < numPlayers; i += 1) {
    playerTextFields.push(
      <Grid item xs={6} sm={4} key={`playerNo${i}`}>
        <TextField
          defaultValue="Ken"
          placeholder="Enter Player Name"
          title={`player ${i} name`}
        />
      </Grid>,
    );
  }

  return (
    <div className="flex-container">
      <Typography variant="h2" component="h1" gutterBottom>
        Blood on the Clocktower
      </Typography>
      <InfoPopup title="Players">
        <Grid container spacing={1}>
          <div>Players: {numPlayers}</div>
          <Slider
            aria-label="player count"
            min={6}
            max={20}
            value={numPlayers}
            onChange={handleSliderChange}
          />
          {playerTextFields}
        </Grid>
      </InfoPopup>
    </div>
  );
});

export default BotC;
