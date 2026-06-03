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

const getShareSearch = () => {
  if (window.location.search) return window.location.search;

  const hashQueryIndex = window.location.hash.indexOf("?");
  return hashQueryIndex >= 0 ? window.location.hash.slice(hashQueryIndex) : "";
};

const getCleanShareUrl = () => {
  const cleanHash = window.location.hash.split("?")[0];
  return `${window.location.pathname}${cleanHash}`;
};

const BotC = memo(() => {
  const { numPlayers, numTravelers, isText, script } = useBotC();
  const setState = useSetAtom(botcAtom);

  useEffect(() => {
    const search = getShareSearch();
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
      window.history.replaceState(null, "", getCleanShareUrl());
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
