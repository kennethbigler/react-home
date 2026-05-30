import { memo } from "react";
import useBotC from "./useBotC";
import Header from "./header/Header";
import PlayerNotes from "./player-notes/PlayerNotes";
import LiePie from "./LiePie";
import { Divider } from "@mui/material";

const BotC = memo(() => {
  const { numPlayers, numTravelers, isText, activeScript } = useBotC();

  /* ----------     Render     ---------- */
  return (
    <>
      <Header numPlayers={numPlayers} numTravelers={numTravelers} />
      <Divider sx={{ marginTop: 2, marginBottom: 2 }} aria-hidden />
      <PlayerNotes
        isText={isText}
        playerCount={numPlayers + numTravelers}
        activeScript={activeScript}
      />
      <LiePie
        numPlayers={numPlayers}
        numTravelers={numTravelers}
        activeScript={activeScript}
      />
    </>
  );
});

BotC.displayName = "BotC";

export default BotC;
