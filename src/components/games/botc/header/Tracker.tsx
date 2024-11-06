import * as React from "react";
// MUI
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
// Custom
import { BotCPlayer } from "../../../../recoil/botc-atom";

const numRounds = [0, 1, 2, 3, 4, 5, 6, 7];

interface TrackerProps {
  botcPlayers: BotCPlayer[];
  end: number;
}

const Tracker = ({ botcPlayers, end }: TrackerProps) => {
  const [round, setRound] = React.useState(0);
  const [tracker, setTracker] = React.useState(
    numRounds.map(() => botcPlayers.map(() => 0)),
  );

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
    <Grid container spacing={1}>
      {botcPlayers.map(({ name }, i) =>
        i < end ? (
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
      <Grid size={12} marginTop={3}>
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
      </Grid>
    </Grid>
  );
};

export default Tracker;
