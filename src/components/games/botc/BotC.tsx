import * as React from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import BotcHeader from "./BotcHeader";
import { BOTC_MAX_PLAYERS, BotCPlayer } from "../../../constants/botc";

const botcPlayerShell: BotCPlayer = {
  name: "Ken",
  roles: [],
  liar: false,
  dead: false,
};

const initBotcPlayers: BotCPlayer[] = [];
for (let i = 0; i < BOTC_MAX_PLAYERS; i += 1) {
  initBotcPlayers.push(botcPlayerShell);
}

const BotC: React.FC = React.memo(() => {
  const [script, setScript] = React.useState(0);
  const [numPlayers, setNumPlayers] = React.useState(8);
  const [botcPlayers, setBotcPlayers] = React.useState(initBotcPlayers);

  // set player Buttons
  const playerButtons = [];
  for (let i = 0; i < numPlayers; i += 1) {
    playerButtons.push(
      <Grid item xs={4} sm={3} md={2} xl={1} key={`playerNo${i}`}>
        <Button variant="contained">{botcPlayers[i].name}</Button>
      </Grid>,
    );
  }

  return (
    <>
      <BotcHeader
        script={script}
        setScript={setScript}
        numPlayers={numPlayers}
        setNumPlayers={setNumPlayers}
        botcPlayers={botcPlayers}
        setBotcPlayers={setBotcPlayers}
      />
      {/* PlayerNotes */}
      <Grid container spacing={1}>
        {playerButtons}
      </Grid>
    </>
  );
});

export default BotC;
