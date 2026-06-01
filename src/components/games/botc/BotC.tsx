import { memo, useEffect } from "react";
import { useSetAtom } from "jotai";
import useBotC from "./useBotC";
import Header from "./header/Header";
import PlayerNotes from "./player-notes/PlayerNotes";
import LiePie from "./LiePie";
import { Divider } from "@mui/material";
import botcAtom, {
  botcPlayerShell,
  newBotCGame,
} from "../../../jotai/botc-atom";
import { parseShareParams } from "../../../utils/botc-share-utils";

const BotC = memo(() => {
  const { numPlayers, numTravelers, isText, script } = useBotC();
  const setState = useSetAtom(botcAtom);

  useEffect(() => {
    const search = window.location.hash.includes("?")
      ? window.location.hash.slice(window.location.hash.indexOf("?"))
      : "";
    if (!search) return;

    void parseShareParams(search).then((shared) => {
      if (!shared) return;
      const base = newBotCGame();
      const { names } = shared;
      const newPlayers = base.botcPlayers.map((_p, i) =>
        i < names.length
          ? { ...botcPlayerShell, name: names[i] }
          : { ...botcPlayerShell },
      );
      setState({
        ...base,
        script: shared.script,
        numPlayers: shared.numPlayers,
        numTravelers: shared.numTravelers,
        botcPlayers: newPlayers,
      });
      // Remove share params from URL without reloading
      const cleanHash = window.location.hash.split("?")[0];
      window.history.replaceState(
        null,
        "",
        window.location.pathname + cleanHash,
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
