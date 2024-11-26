import * as React from "react";
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
