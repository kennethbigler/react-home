import * as React from "react";
import Divider from "@mui/material/Divider";
import useBotC from "./useBotC";
import Header from "./Header";
import ControlBar from "./control-bar/ControlBar";
import PlayerNotes from "./player-notes/PlayerNotes";
import LiePie from "./LiePie";

const BotC = React.memo(() => {
  const [showMove, setShowMove] = React.useState(false);
  const { botcPlayers, numPlayers, numTravelers, newBotCGame, isText, script } =
    useBotC();
  const handleMoveToggle = () => setShowMove(!showMove);

  /* ----------     Render     ---------- */
  return (
    <>
      <Header numPlayers={numPlayers} numTravelers={numTravelers} />
      <ControlBar
        botcPlayers={botcPlayers}
        numPlayers={numPlayers}
        numTravelers={numTravelers}
        showMove={showMove}
        newBotCGame={newBotCGame}
        onMoveToggle={handleMoveToggle}
      />
      <Divider sx={{ marginTop: 2, marginBottom: 2 }} aria-hidden />
      <PlayerNotes
        botcPlayers={botcPlayers}
        isText={isText}
        playerCount={numPlayers + numTravelers}
        script={script}
        showMove={showMove}
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
