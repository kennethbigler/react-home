import { memo } from "react";
import useBotC from "./useBotC";
import Header from "./header/Header";
import PlayerNotes from "./player-notes/PlayerNotes";
import LiePie from "./LiePie";
import { Divider } from "@mui/material";

const BotC = memo(() => {
  const { numPlayers, numTravelers, isText, script } = useBotC();

  /* ----------     Render     ---------- */
  return (
    <>
      <Header numPlayers={numPlayers} numTravelers={numTravelers} />
      <Divider sx={{ marginTop: 2, marginBottom: 2 }} aria-hidden />
      <PlayerNotes
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
