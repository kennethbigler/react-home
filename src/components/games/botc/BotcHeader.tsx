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
} from "../../../constants/botc";

interface BotcHeaderProps {
  script: number;
  setScript: React.Dispatch<React.SetStateAction<number>>;
  numPlayers: number;
  setNumPlayers: React.Dispatch<React.SetStateAction<number>>;
  botcPlayers: BotCPlayer[];
  setBotcPlayers: React.Dispatch<React.SetStateAction<BotCPlayer[]>>;
}

const BotcHeader = ({
  script,
  setScript,
  numPlayers,
  setNumPlayers,
  botcPlayers,
  setBotcPlayers,
}: BotcHeaderProps) => {
  /** update number of players */
  const handleSliderChange = (_e: Event, value: number | number[]) =>
    setNumPlayers(value as number);

  /** update player name onBlur */
  const handleBlur =
    (i: number) =>
    (e: React.FocusEvent<HTMLInputElement>): void => {
      const newPlayers = [...botcPlayers];
      const newPlayer = { ...newPlayers[i], name: e.target.value || "" };
      newPlayers[i] = newPlayer;
      setBotcPlayers(newPlayers);
    };

  /** if enter key was pressed in textfield, update name */
  const handleKeyDown =
    (i: number) =>
    (e: React.KeyboardEvent<HTMLDivElement>): void => {
      if (e.key === "Enter") {
        const newPlayers = [...botcPlayers];
        const newPlayer = {
          ...newPlayers[i],
          name: (e.target as HTMLInputElement).value || "",
        };
        newPlayers[i] = newPlayer;
        setBotcPlayers(newPlayers);
      }
    };

  const handleGameSelection = (i: number) => () => setScript(i);

  // set player TextFields
  const playerTextFields = [];
  for (let i = 0; i < numPlayers; i += 1) {
    playerTextFields.push(
      <Grid item xs={6} sm={4} key={`playerNo${i}`}>
        <TextField
          defaultValue={botcPlayers[i].name}
          placeholder="Enter Player Name"
          title={`player ${i} name`}
          onBlur={handleBlur(i)}
          onKeyDown={handleKeyDown(i)}
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
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <ButtonGroup aria-label="Select BotC Game">
              <Button
                variant={script === 0 ? "contained" : "outlined"}
                onClick={handleGameSelection(0)}
              >
                Trouble Brewing
              </Button>
              <Button
                variant={script === 1 ? "contained" : "outlined"}
                onClick={handleGameSelection(1)}
              >
                Sects and Violets
              </Button>
              <Button
                variant={script === 2 ? "contained" : "outlined"}
                onClick={handleGameSelection(2)}
              >
                Bad Moon Rising
              </Button>
            </ButtonGroup>
          </Grid>
          <Grid item xs={12}>
            <Typography>Count: {numPlayers}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Slider
              aria-label="player count"
              min={BOTC_MIN_PLAYERS}
              max={BOTC_MAX_PLAYERS}
              value={numPlayers}
              onChange={handleSliderChange}
            />
          </Grid>
          {playerTextFields}
        </Grid>
      </InfoPopup>
    </div>
  );
};

export default BotcHeader;
