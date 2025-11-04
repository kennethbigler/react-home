import * as React from "react";
import Divider from "@mui/material/Divider";
import useBotC from "./useBotC";
import Header from "./header/Header";
import PlayerNotes from "./player-notes/PlayerNotes";
import LiePie from "./LiePie";

const BotC = React.memo(() => {
  const { botcPlayers, numPlayers, numTravelers, newBotCGame, isText, script } =
    useBotC();

  /* ----------     Render     ---------- */
  return (
    <>
      <Header
        botcPlayers={botcPlayers}
        numPlayers={numPlayers}
        numTravelers={numTravelers}
        newBotCGame={newBotCGame}
      />
      <Divider sx={{ marginTop: 2, marginBottom: 2 }} aria-hidden />
      <PlayerNotes
        botcPlayers={botcPlayers}
        isText={isText}
        playerCount={numPlayers + numTravelers}
        script={script}
      />
      <LiePie
        numPlayers={numPlayers}
        numTravelers={numTravelers}
        script={script}
      />
    </>
  );
});

BotC.displayName = "BotC";

export default BotC;
