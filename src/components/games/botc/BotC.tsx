import * as React from "react";
import { useRecoilState } from "recoil";
import BotcHeader from "./BotcHeader";
import botcAtom from "../../../recoil/botc-atom";
import PlayerNotes from "./PlayerNotes";

const BotC: React.FC = React.memo(() => {
  const [{ script, numPlayers, botcPlayers }, setState] =
    useRecoilState(botcAtom);

  /* ----------     Header Functions     ---------- */
  /** update botc script used */
  const handleUpdateScript = (i: number) => () =>
    setState({ script: i, numPlayers, botcPlayers });

  /** update number of players */
  const handleUpdateNumPlayers = (_e: Event, value: number | number[]) =>
    setState({ script, botcPlayers, numPlayers: value as number });

  /** update player name onBlur */
  const handleUpdatePlayersBlur =
    (i: number) =>
    (e: React.FocusEvent<HTMLInputElement>): void => {
      const newPlayers = [...botcPlayers];
      const newPlayer = { ...newPlayers[i], name: e.target.value || "" };
      newPlayers[i] = newPlayer;
      setState({ script, numPlayers, botcPlayers: newPlayers });
    };
  /** if enter key was pressed in textfield, update name */
  const handleUpdatePlayersKeyDown =
    (i: number) =>
    (e: React.KeyboardEvent<HTMLDivElement>): void => {
      if (e.key === "Enter") {
        const newPlayers = [...botcPlayers];
        const newPlayer = {
          ...newPlayers[i],
          name: (e.target as HTMLInputElement).value || "",
        };
        newPlayers[i] = newPlayer;
        setState({ script, numPlayers, botcPlayers: newPlayers });
      }
    };

  return (
    <>
      <BotcHeader
        script={script}
        numPlayers={numPlayers}
        botcPlayers={botcPlayers}
        handleUpdateScript={handleUpdateScript}
        handleUpdateNumPlayers={handleUpdateNumPlayers}
        handleUpdatePlayersBlur={handleUpdatePlayersBlur}
        handleUpdatePlayersKeyDown={handleUpdatePlayersKeyDown}
      />
      <PlayerNotes
        script={script}
        numPlayers={numPlayers}
        botcPlayers={botcPlayers}
      />
    </>
  );
});

export default BotC;
