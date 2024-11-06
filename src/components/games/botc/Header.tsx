import * as React from "react";
// MUI
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { SelectChangeEvent } from "@mui/material";
// Custom
import EditPlayers from "./edit-players/EditPlayers";
import InfoPopup from "../../common/info-popover/InfoPopup";
import { BotCPlayer } from "../../../recoil/botc-atom";
import { playerDist } from "../../../constants/botc";

const numRounds = [0, 1, 2, 3, 4, 5, 6, 7];

interface HeaderProps {
  botcPlayers: BotCPlayer[];
  isText: boolean;
  numPlayers: number;
  numTravelers: number;
  script: number;
  newBotCGame: () => void;
  updateNames: (i: number) => (e: React.FocusEvent<HTMLInputElement>) => void;
  updateNumPlayers: (_e: Event, value: number | number[]) => void;
  updateNumTravelers: (_e: Event, value: number | number[]) => void;
  updatePlayerOrder: (i: number, dir: number) => () => void;
  updateScript: (i: SelectChangeEvent<number>) => void;
  updateText: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Header = ({
  botcPlayers,
  isText,
  numPlayers,
  numTravelers,
  script,
  newBotCGame,
  updateNames,
  updateNumPlayers,
  updateNumTravelers,
  updatePlayerOrder,
  updateScript,
  updateText,
}: HeaderProps) => {
  const [hasToast, setHasToast] = React.useState(false);
  const [round, setRound] = React.useState(0);
  const [tracker, setTracker] = React.useState(
    numRounds.map(() => botcPlayers.map(() => 0)),
  );

  /** close the toast message */
  const handleClose = () => setHasToast(false);
  /** reset the BOTC game and open the success toast */
  const handleReset = () => {
    newBotCGame();
    setHasToast(true);
  };

  /** Handle tracker toggle */
  const handleClick = (i: number) => () => {
    const tempTracker = [...tracker[round]];
    tempTracker[i] = (tracker[round][i] + 1) % 3;
    const newTracker = [...tracker];
    newTracker[round] = tempTracker;
    setTracker(newTracker);
  };

  /** Update round */
  const updateRound = (i: number) => () => setRound(i);

  return (
    <>
      <Typography variant="h2" component="h1" gutterBottom>
        BotC
      </Typography>

      <div className="flex-container" style={{ marginBottom: "20px" }}>
        <Grid size={12}>
          <Typography>
            Dist: {playerDist[numPlayers]}
            {numTravelers ? ` +${numTravelers}` : ""}
          </Typography>
        </Grid>

        <InfoPopup title="Tracker">
          <Grid container spacing={1}>
            {botcPlayers.map(({ name }, i) =>
              i < numPlayers + numTravelers ? (
                <Grid key={i} size={4}>
                  <Button
                    fullWidth
                    variant={tracker[round][i] > 0 ? "contained" : "text"}
                    color={tracker[round][i] !== 2 ? "primary" : "error"}
                    onClick={handleClick(i)}
                  >
                    {name}
                  </Button>
                </Grid>
              ) : null,
            )}
          </Grid>
          <br aria-hidden />
          <ButtonGroup fullWidth aria-label="Pick Round">
            {numRounds.map((i) => (
              <Button
                key={i}
                onClick={updateRound(i)}
                variant={i === round ? "contained" : "outlined"}
              >
                {i + 1}
              </Button>
            ))}
          </ButtonGroup>
        </InfoPopup>

        <InfoPopup title="Players">
          <EditPlayers
            handleReset={handleReset}
            botcPlayers={botcPlayers}
            isText={isText}
            numPlayers={numPlayers}
            numTravelers={numTravelers}
            script={script}
            updateNames={updateNames}
            updateNumPlayers={updateNumPlayers}
            updateNumTravelers={updateNumTravelers}
            updatePlayerOrder={updatePlayerOrder}
            updateScript={updateScript}
            updateText={updateText}
          />
        </InfoPopup>
      </div>

      <Snackbar open={hasToast} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Game Reset
        </Alert>
      </Snackbar>
    </>
  );
};

export default Header;
