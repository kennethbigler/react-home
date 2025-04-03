import * as React from "react";
// MUI
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
// Custom
import { BotCPlayer } from "../../../../jotai/botc-atom";
import { useTracker } from "../useBotC";
import { getGridSize } from "../helpers";

const numRounds = [0, 1, 2, 3, 4, 5, 6, 7];

interface TrackerProps {
  botcPlayers: BotCPlayer[];
  end: number;
}

const Tracker = ({ botcPlayers, end }: TrackerProps) => {
  const { round, tracker, onRoundClick, onTrackClick } = useTracker();

  return (
    <Grid container spacing={1}>
      {botcPlayers.map(
        ({ name }, i) =>
          i < end && (
            <React.Fragment key={i}>
              <Grid size={getGridSize(end, i)}>
                <Button
                  fullWidth
                  variant={tracker[round][i] > 0 ? "contained" : "outlined"}
                  color={tracker[round][i] !== 2 ? "primary" : "error"}
                  onClick={onTrackClick(i)}
                >
                  {name}
                </Button>
              </Grid>
              {i % 2 === 1 && i >= 3 && i < end - 3 && <Grid size={2} />}
            </React.Fragment>
          ),
      )}
      <Grid size={12} marginTop={3}>
        <ButtonGroup fullWidth aria-label="Pick Round">
          {numRounds.map((i) => (
            <Button
              key={i}
              onClick={onRoundClick(i)}
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
