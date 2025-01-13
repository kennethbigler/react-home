import * as React from "react";
import Divider from "@mui/material/Divider";
import useBotC from "./useBotC";
import Header from "./Header";
import ControlBar from "./control-bar/ControlBar";
import PlayerNotes from "./player-notes/PlayerNotes";

const BotC = React.memo(() => {
  const { botcPlayers, numPlayers, numTravelers, newBotCGame, isText, script } =
    useBotC();

  /* ----------     Render     ---------- */
  return (
    <>
      <Header />
      <ControlBar
        botcPlayers={botcPlayers}
        numPlayers={numPlayers}
        numTravelers={numTravelers}
        newBotCGame={newBotCGame}
      />
      <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
      <PlayerNotes
        botcPlayers={botcPlayers}
        isText={isText}
        playerCount={numPlayers + numTravelers}
        script={script}
      />
    </>
  );
});

BotC.displayName = "BotC";

export default BotC;
