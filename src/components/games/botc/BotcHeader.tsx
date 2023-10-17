import * as React from "react";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import InfoPopup from "../../common/info-popover/InfoPopup";
import {
  BOTC_MAX_PLAYERS,
  BOTC_MIN_PLAYERS,
  BotCPlayer,
} from "../../../recoil/botc-atom";
import { playerDist } from "../../../constants/botc";

interface BotcHeaderProps {
  script: number;
  numPlayers: number;
  numTravelers: number;
  botcPlayers: BotCPlayer[];
  newBotcGame: () => void;
  updateScript: (i: number) => () => void;
  updateNumPlayers: (_e: Event, value: number | number[]) => void;
  updateNumTravelers: (_e: Event, value: number | number[]) => void;
  updatePlayersBlur: (
    i: number,
  ) => (e: React.FocusEvent<HTMLInputElement>) => void;
  updatePlayersKeyDown: (
    i: number,
  ) => (e: React.KeyboardEvent<HTMLDivElement>) => void;
}

const BotcHeader = ({
  script,
  numPlayers,
  numTravelers,
  botcPlayers,
  newBotcGame,
  updateScript,
  updateNumPlayers,
  updateNumTravelers,
  updatePlayersBlur,
  updatePlayersKeyDown,
}: BotcHeaderProps) => {
  // set player TextFields
  const playerTextFields = [];
  for (let i = 0; i < (numPlayers + numTravelers); i += 1) {
    playerTextFields.push(
      <Grid item xs={6} sm={4} key={`playerNo${i}`}>
        <TextField
          defaultValue={botcPlayers[i].name}
          placeholder="Enter Player Name"
          title={`player ${i} name`}
          onBlur={updatePlayersBlur(i)}
          onKeyDown={updatePlayersKeyDown(i)}
        />
      </Grid>,
    );
  }

  return (
    <div className="flex-container">
      <Typography variant="h2" component="h1" gutterBottom>
        BotC
      </Typography>
      <InfoPopup title="Players">
        <Grid container spacing={1}>
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <div className="flex-container">
              <ButtonGroup aria-label="Select BotC Game">
                <Button
                  variant={script === 0 ? "contained" : "outlined"}
                  onClick={updateScript(0)}
                >
                  TB
                </Button>
                <Button
                  variant={script === 1 ? "contained" : "outlined"}
                  onClick={updateScript(1)}
                >
                  S&V
                </Button>
                <Button
                  variant={script === 2 ? "contained" : "outlined"}
                  onClick={updateScript(2)}
                >
                  BMR
                </Button>
              </ButtonGroup>
              <Button variant="contained" color="error" onClick={newBotcGame}>
                Reset
              </Button>
            </div>
          </Grid>
          <Grid item xs={12}>
            <Typography>Players: {numPlayers} / Dist: {playerDist[numPlayers]}</Typography>
            <Slider
              aria-label="player count"
              min={BOTC_MIN_PLAYERS}
              max={BOTC_MAX_PLAYERS}
              value={numPlayers}
              onChange={updateNumPlayers}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography>Travelers: {numTravelers}</Typography>
            <Slider
              aria-label="traveler count"
              min={0}
              max={5}
              value={numTravelers}
              onChange={updateNumTravelers}
            />
          </Grid>
          {playerTextFields}
        </Grid>
      </InfoPopup>
    </div>
  );
};

export default BotcHeader;
